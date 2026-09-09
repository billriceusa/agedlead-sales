/**
 * Resend webhook signature verification and payload parsing.
 *
 * Resend signs webhooks with Svix. The signed content is
 * `${svix-id}.${svix-timestamp}.${rawBody}`, HMAC-SHA256 with the secret, and
 * the result is base64. The `svix-signature` header carries one or more
 * space-separated `v1,<base64>` pairs — more than one during a secret rotation,
 * so ANY match is a pass.
 *
 * Implemented directly rather than pulling in the `svix` package: it is ~20
 * lines of standard crypto, and a webhook that mutates a production table is a
 * poor place to add a dependency for convenience.
 *
 * Pure and exported so the verification can be tested without a live endpoint.
 * Signature bugs are the kind that pass a smoke test and fail silently in one
 * direction — either rejecting real events, which looks like "the webhook never
 * fires", or accepting forged ones.
 */
import { createHmac, timingSafeEqual } from "crypto";

/** Reject anything older than this. Blocks replay of a captured request. */
export const MAX_SKEW_SECONDS = 5 * 60;

export interface VerifyInput {
  rawBody: string;
  svixId: string | null;
  svixTimestamp: string | null;
  svixSignature: string | null;
  /** `whsec_...` as issued by Resend. */
  secret: string;
  /** Injectable for tests. */
  nowSeconds?: number;
}

export type VerifyResult = { ok: true } | { ok: false; reason: string };

export function verifyResendSignature(input: VerifyInput): VerifyResult {
  const { rawBody, svixId, svixTimestamp, svixSignature, secret } = input;
  if (!secret) return { ok: false, reason: "no signing secret configured" };
  if (!svixId || !svixTimestamp || !svixSignature) {
    return { ok: false, reason: "missing svix headers" };
  }

  const ts = Number(svixTimestamp);
  if (!Number.isFinite(ts)) return { ok: false, reason: "bad timestamp" };
  const now = input.nowSeconds ?? Math.floor(Date.now() / 1000);
  if (Math.abs(now - ts) > MAX_SKEW_SECONDS) {
    return { ok: false, reason: "timestamp outside tolerance" };
  }

  // The secret is base64 after the `whsec_` prefix.
  const key = Buffer.from(secret.replace(/^whsec_/, ""), "base64");
  const expected = createHmac("sha256", key)
    .update(`${svixId}.${svixTimestamp}.${rawBody}`)
    .digest("base64");

  // `v1,<sig> v1,<sig>` — several during rotation. Any match passes.
  const provided = svixSignature
    .split(" ")
    .map((part) => part.split(",")[1])
    .filter((s): s is string => Boolean(s));

  for (const candidate of provided) {
    const a = Buffer.from(candidate);
    const b = Buffer.from(expected);
    if (a.length === b.length && timingSafeEqual(a, b)) return { ok: true };
  }
  return { ok: false, reason: "no matching signature" };
}

export interface ParsedEvent {
  eventType: string;
  emailId: string | null;
  recipient: string | null;
  subject: string | null;
  linkUrl: string | null;
  bounceType: string | null;
  occurredAt: Date;
}

/**
 * Flatten a Resend webhook body into the row we store.
 *
 * Defensive about shape on purpose: Resend has added fields over time, and a
 * webhook handler that throws on an unfamiliar payload drops the event
 * permanently — Svix retries a 500 only a handful of times.
 */
export function parseResendEvent(body: unknown): ParsedEvent | null {
  if (!body || typeof body !== "object") return null;
  const b = body as Record<string, unknown>;
  const type = typeof b.type === "string" ? b.type : null;
  if (!type) return null;

  const data = (b.data ?? {}) as Record<string, unknown>;
  const to = data.to;
  const recipient = Array.isArray(to)
    ? typeof to[0] === "string"
      ? to[0].toLowerCase()
      : null
    : typeof to === "string"
      ? to.toLowerCase()
      : null;

  const click = (data.click ?? {}) as Record<string, unknown>;
  const bounce = (data.bounce ?? {}) as Record<string, unknown>;

  // `created_at` is the event time; fall back to now so an event is never
  // dropped over a missing timestamp.
  const rawWhen = typeof b.created_at === "string" ? b.created_at : null;
  const when = rawWhen ? new Date(rawWhen) : new Date();

  return {
    eventType: type,
    emailId: typeof data.email_id === "string" ? data.email_id : null,
    recipient,
    subject: typeof data.subject === "string" ? data.subject : null,
    linkUrl: typeof click.link === "string" ? click.link : null,
    bounceType:
      typeof bounce.type === "string"
        ? bounce.type
        : typeof data.bounce_type === "string"
          ? (data.bounce_type as string)
          : null,
    occurredAt: isNaN(when.getTime()) ? new Date() : when,
  };
}
