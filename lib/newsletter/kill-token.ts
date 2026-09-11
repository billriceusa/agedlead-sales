import { createHmac, timingSafeEqual } from "node:crypto";

/**
 * Single-purpose tokens for the "kill this issue" link in the Sunday preview.
 *
 * WHY NOT JUST PUT CRON_SECRET IN THE LINK
 *
 * The obvious implementation is `/api/newsletter/kill?date=…&secret=$CRON_SECRET`.
 * That secret also authorises every cron route in this app — drafting, sending,
 * the GSC trend commit, the ALS lifecycle mailer. Putting it in a URL means it
 * is written into an email, and from there into Bill's mail provider, any
 * forward of that mail, and every intermediate log that records query strings.
 * A leaked kill link would be a leaked key to the whole cron surface.
 *
 * These tokens are derived from CRON_SECRET but are not it. A token is bound to
 * one issue date and authorises exactly one action: marking that issue killed.
 * The worst a leak can do is stop one newsletter — a nuisance, and one the
 * preview email announces loudly enough to notice. It cannot send anything, and
 * it cannot be reversed into the secret.
 *
 * Deliberately NOT time-limited. The review window is short, but an expired
 * kill link at the moment Bill actually wants to stop a send is the one failure
 * this must not have. Killing is the safe direction.
 */

import type { ArchiveKind } from "./archive-github";

/**
 * One purpose string per archive.
 *
 * The newsletter's stays EXACTLY as it was. Preview emails already sitting in
 * Bill's inbox carry tokens signed with it, and those links have to keep
 * working — a kill link that stopped verifying would fail in the one direction
 * this design refuses to fail in. The offer gets its own purpose so a token for
 * one archive cannot stop an issue in the other, even on the same date.
 */
const PURPOSES: Record<ArchiveKind, string> = {
  newsletter: "newsletter-kill-v1",
  offer: "offer-kill-v1",
};

function secret(): string {
  const s = process.env.CRON_SECRET;
  if (!s) throw new Error("CRON_SECRET is not set — cannot sign kill tokens");
  return s;
}

/** Hex HMAC binding this purpose to one issue date. */
export function killToken(date: string, kind: ArchiveKind = "newsletter"): string {
  return createHmac("sha256", secret())
    .update(`${PURPOSES[kind]}:${date}`)
    .digest("hex");
}

/**
 * Constant-time verification.
 *
 * A plain `===` on a hex digest leaks how many leading characters matched via
 * response timing, which is enough to forge one byte at a time. `timingSafeEqual`
 * throws on a length mismatch, so length is checked first.
 */
export function verifyKillToken(
  date: string,
  token: string | null | undefined,
  kind: ArchiveKind = "newsletter",
): boolean {
  if (!token) return false;
  let expected: string;
  try {
    expected = killToken(date, kind);
  } catch {
    return false;
  }
  if (token.length !== expected.length) return false;
  try {
    return timingSafeEqual(Buffer.from(token, "hex"), Buffer.from(expected, "hex"));
  } catch {
    // Non-hex input makes Buffer.from produce a short buffer; treat as a miss.
    return false;
  }
}

/**
 * The absolute URL to drop into the preview email.
 *
 * The `kind` parameter is omitted for the newsletter so the URL shape is byte
 * for byte what it has always been, and the kill route defaults to the same.
 */
export function killUrl(
  siteUrl: string,
  date: string,
  kind: ArchiveKind = "newsletter",
): string {
  const base = siteUrl.replace(/\/$/, "");
  const suffix = kind === "newsletter" ? "" : `&kind=${kind}`;
  return `${base}/api/newsletter/kill?date=${encodeURIComponent(date)}&t=${killToken(date, kind)}${suffix}`;
}
