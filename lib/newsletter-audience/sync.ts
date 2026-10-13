/**
 * Resend + Postgres I/O for folding the source audiences into the Work Aged
 * Leads list. Shared by `scripts/migrate-newsletter-audience.ts` (manual, prints
 * the full plan) and `app/api/cron/newsletter-audience-sync` (daily, unattended).
 *
 * The merge logic itself is pure and lives in ./merge.ts. This file is only the
 * reads, the writes, and the throttle between them — moved here from the script
 * on 2026-10-13 so the cron could not drift from it.
 */

import { neon } from "@neondatabase/serverless";
import {
  mergeAudiences,
  planWrites,
  summarizePlan,
  type AudienceSource,
  type MergeStats,
  type ResendContactRow,
  type SuppressionSource,
  type WriteAction,
} from "./merge";

const RESEND_BASE = "https://api.resend.com";

/** The Work Aged Leads audience — created 2026-08-01, the consolidated list. */
export const DEFAULT_TARGET = "43fe6675-cc8f-44f3-9c1c-70a094b2d47d";

/** The ALS buyer-activation audiences. Folded in per Bill 2026-08-01 — buyers
 * consent to the newsletter in the buy/order flow, so it is one list. These are
 * the audiences whose opt-out state lives in Postgres, not in Resend. */
export const ALS_AUDIENCES = new Set([
  "9657093e-99fe-4a34-9846-946be85b64f7", // ALS Aged-Lead Buyers — Purchasers
  "83613b84-c1fd-4362-9dd1-8914533e30f8", // ALS Aged-Lead Buyers — Inquiries
  "74476de7-677f-4686-bfb9-d6fe66a5d855", // ALS Store Self-Serve — Inquiries
]);

/** The retiring audiences. The two newsletters keep receiving signups until
 * their sites stop serving forms, and the ALS harvest cron adds buyers daily —
 * which is why the merge is re-runnable, and since 2026-10-13 runs daily.
 *
 * Every address on Self-Serve is already in `als_buyer_contacts`, so the
 * Postgres opt-out set covers it the same way it covers the other two. */
export const DEFAULT_SOURCES = [
  "d579bf1f-0467-45a3-ad6b-52460920a903", // agedleadsales-newsletter
  "8a35228e-149f-4b15-8e24-26a24e3d6e98", // howtoworkleads-newsletter
  "9657093e-99fe-4a34-9846-946be85b64f7", // ALS Aged-Lead Buyers — Purchasers
  "83613b84-c1fd-4362-9dd1-8914533e30f8", // ALS Aged-Lead Buyers — Inquiries
  "74476de7-677f-4686-bfb9-d6fe66a5d855", // ALS Store Self-Serve — Inquiries
];

export interface Audience {
  id: string;
  name: string;
}

function authHeaders(apiKey: string): Record<string, string> {
  return {
    Authorization: `Bearer ${apiKey}`,
    "Content-Type": "application/json",
  };
}

/**
 * Resend allows 10 requests per second and 429s the rest.
 *
 * This matters more on the write path than the read path. Applying the ALS fold
 * is ~2,200 sequential contact creates; unthrottled, that 429s a few hundred in
 * and leaves a partially migrated audience — which looks exactly like a
 * finished one until someone counts. Every Resend call goes through here: a
 * fixed floor between requests, plus a bounded retry that honours the reset
 * header when the floor is not enough.
 */
const MIN_REQUEST_INTERVAL_MS = 150; // ~6.6/s, comfortably under the 10/s cap
const MAX_RETRIES = 5;

let nextRequestAt = 0;

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function resendFetch(url: string, init: RequestInit): Promise<Response> {
  for (let attempt = 0; ; attempt++) {
    const wait = nextRequestAt - Date.now();
    if (wait > 0) await sleep(wait);
    nextRequestAt = Date.now() + MIN_REQUEST_INTERVAL_MS;

    const res = await fetch(url, init);
    if (res.status !== 429 || attempt >= MAX_RETRIES) return res;

    // `ratelimit-reset` is in seconds; fall back to exponential backoff.
    const reset = Number(res.headers.get("ratelimit-reset"));
    const backoff = Number.isFinite(reset) && reset > 0
      ? reset * 1000
      : MIN_REQUEST_INTERVAL_MS * 2 ** (attempt + 1);
    await sleep(backoff);
  }
}

export async function getAudience(apiKey: string, id: string): Promise<Audience> {
  const res = await resendFetch(`${RESEND_BASE}/audiences/${id}`, {
    headers: authHeaders(apiKey),
    cache: "no-store",
  });
  if (!res.ok) {
    throw new Error(
      `Resend get audience ${id} failed ${res.status}: ${await res.text()}`,
    );
  }
  const data = await res.json();
  return { id: data.id as string, name: data.name as string };
}

/** Reads every contact in an audience.
 *
 * Resend returns the full list in one response today. If that ever changes,
 * `has_more` goes true and this throws rather than quietly migrating a prefix
 * of the list — a half-copied audience looks exactly like a finished one. */
export async function getContacts(
  apiKey: string,
  audienceId: string,
): Promise<ResendContactRow[]> {
  const res = await resendFetch(`${RESEND_BASE}/audiences/${audienceId}/contacts`, {
    headers: authHeaders(apiKey),
    cache: "no-store",
  });
  if (!res.ok) {
    throw new Error(
      `Resend list contacts ${audienceId} failed ${res.status}: ${await res.text()}`,
    );
  }
  const body = (await res.json()) as {
    data?: ResendContactRow[];
    has_more?: boolean;
  };
  if (body.has_more) {
    throw new Error(
      `Audience ${audienceId} returned has_more=true — the merge reads a single ` +
        `page and would migrate only part of the list. Add pagination before rerunning.`,
    );
  }
  return body.data ?? [];
}

export async function createContact(
  apiKey: string,
  audienceId: string,
  action: Extract<WriteAction, { kind: "create" }>,
): Promise<void> {
  const res = await resendFetch(`${RESEND_BASE}/audiences/${audienceId}/contacts`, {
    method: "POST",
    headers: authHeaders(apiKey),
    body: JSON.stringify({
      email: action.contact.email,
      ...(action.contact.firstName ? { first_name: action.contact.firstName } : {}),
      ...(action.contact.lastName ? { last_name: action.contact.lastName } : {}),
      unsubscribed: action.contact.unsubscribed,
    }),
  });
  // 409 means it landed between the read and the write. Harmless: the next run
  // sees it and reconciles the unsubscribed flag.
  if (!res.ok && res.status !== 409) {
    throw new Error(
      `create ${action.contact.email} failed ${res.status}: ${await res.text()}`,
    );
  }
}

export async function suppressContact(
  apiKey: string,
  audienceId: string,
  action: Extract<WriteAction, { kind: "suppress" }>,
): Promise<void> {
  const res = await resendFetch(
    `${RESEND_BASE}/audiences/${audienceId}/contacts/${action.targetContactId}`,
    {
      method: "PATCH",
      headers: authHeaders(apiKey),
      body: JSON.stringify({ unsubscribed: true }),
    },
  );
  if (!res.ok) {
    throw new Error(
      `suppress ${action.contact.email} failed ${res.status}: ${await res.text()}`,
    );
  }
}

/**
 * Every address that has opted out of ALS lifecycle email.
 *
 * This is the authoritative opt-out record for the ALS audiences — the Resend
 * flag on those rows is not. Read it before merging them, never after.
 */
export async function getAlsOptOuts(databaseUrl: string): Promise<string[]> {
  const sql = neon(databaseUrl);
  const rows = (await sql`
    select distinct lower(email) as email
    from als_buyer_contacts
    where unsubscribed
  `) as { email: string }[];
  return rows.map((r) => r.email);
}

export interface SyncPlan {
  target: Audience;
  targetContacts: ResendContactRow[];
  stats: MergeStats;
  actions: WriteAction[];
  summary: ReturnType<typeof summarizePlan>;
}

/**
 * Read every source, the target, and the Postgres opt-outs, and return the
 * write plan. Writes nothing.
 *
 * Refuses an ALS source without DATABASE_URL: merging one of those on the
 * Resend flag alone resubscribes people who unsubscribed.
 */
export async function loadSyncPlan(opts: {
  apiKey: string;
  databaseUrl: string;
  targetId?: string;
  sourceIds?: string[];
}): Promise<SyncPlan> {
  const targetId = opts.targetId ?? DEFAULT_TARGET;
  const sourceIds = opts.sourceIds?.length ? opts.sourceIds : DEFAULT_SOURCES;

  if (sourceIds.includes(targetId)) {
    throw new Error("Target audience is also listed as a source — refusing to run.");
  }
  const alsSources = sourceIds.filter((id) => ALS_AUDIENCES.has(id));
  if (alsSources.length && !opts.databaseUrl) {
    throw new Error(
      "DATABASE_URL is not set, and an ALS buyer audience is a source. " +
        "ALS opt-outs live in Postgres (als_buyer_contacts.unsubscribed), not in " +
        "the Resend audience — merging without them would resubscribe people who " +
        "have already unsubscribed.",
    );
  }

  const target = await getAudience(opts.apiKey, targetId);
  const sources: AudienceSource[] = [];
  for (const id of sourceIds) {
    const audience = await getAudience(opts.apiKey, id);
    sources.push({ name: audience.name, contacts: await getContacts(opts.apiKey, id) });
  }
  const targetContacts = await getContacts(opts.apiKey, targetId);

  const suppression: SuppressionSource[] = [];
  if (alsSources.length) {
    suppression.push({
      name: "als_buyer_contacts.unsubscribed (Postgres)",
      emails: await getAlsOptOuts(opts.databaseUrl),
    });
  }

  const { contacts, stats } = mergeAudiences(sources, suppression);
  const actions = planWrites(
    contacts,
    targetContacts,
    suppression.flatMap((s) => s.emails),
  );
  return { target, targetContacts, stats, actions, summary: summarizePlan(actions) };
}

export interface ApplyResult {
  created: number;
  suppressed: number;
  /** Writes the plan called for that this run did not reach. */
  remaining: number;
  stoppedBy: "done" | "max-writes" | "deadline";
}

/**
 * Apply a plan's writes in order, suppressions first.
 *
 * Suppressions go first because they are the writes that matter most: each one
 * is a person who opted out and is still sendable on the target. A run that is
 * cut short should leave new signups for tomorrow, never an opt-out.
 *
 * `maxWrites` and `deadline` let an unattended run stop cleanly before its
 * platform timeout. The plan is a diff against the target's live state, so
 * whatever is left is simply picked up by the next run.
 */
export async function applyWrites(
  actions: WriteAction[],
  write: (action: Extract<WriteAction, { kind: "create" | "suppress" }>) => Promise<void>,
  limits: { maxWrites?: number; deadline?: number; now?: () => number } = {},
): Promise<ApplyResult> {
  const now = limits.now ?? Date.now;
  const pending = [
    ...actions.filter((a) => a.kind === "suppress"),
    ...actions.filter((a) => a.kind === "create"),
  ] as Extract<WriteAction, { kind: "create" | "suppress" }>[];

  let created = 0;
  let suppressed = 0;
  let i = 0;
  let stoppedBy: ApplyResult["stoppedBy"] = "done";
  for (; i < pending.length; i++) {
    if (limits.maxWrites !== undefined && i >= limits.maxWrites) {
      stoppedBy = "max-writes";
      break;
    }
    if (limits.deadline !== undefined && now() >= limits.deadline) {
      stoppedBy = "deadline";
      break;
    }
    const action = pending[i];
    await write(action);
    if (action.kind === "create") created++;
    else suppressed++;
  }
  return { created, suppressed, remaining: pending.length - i, stoppedBy };
}

/** The real writer for `applyWrites`. */
export function resendWriter(apiKey: string, targetId: string) {
  return (action: Extract<WriteAction, { kind: "create" | "suppress" }>) =>
    action.kind === "create"
      ? createContact(apiKey, targetId, action)
      : suppressContact(apiKey, targetId, action);
}
