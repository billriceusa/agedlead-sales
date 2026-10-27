/**
 * The one place the site's own address is written down.
 *
 * Most of the codebase reads `NEXT_PUBLIC_SITE_URL` with an inline
 * `|| "https://workagedleads.com"` fallback, and those are fine: the env var is
 * set in Vercel, so the fallback is dormant. What was NOT fine were the bare
 * literals — a host written straight into an email body, a JSON-LD block, a
 * canonical tag or a copyable embed snippet. Those ignore the env var
 * entirely, so at cutover they kept pointing at a domain that 301s back to the
 * site emitting them.
 *
 * The rule this module exists to enforce: never write the site's own host into
 * a string. Import from here.
 *
 * Cutover HAPPENED on 2026-08-03: `NEXT_PUBLIC_SITE_URL` and `NOINDEX_HOSTS=""`
 * shipped together, because flipping the noindex without the URL would have
 * made the new host indexable while it declared its canonical to be a domain
 * that was simultaneously redirecting to it. The folder and GitHub repo were
 * renamed to match the domain on 2026-10-27, and every fallback in the repo
 * moved off agedleadsales.com then: a fallback naming a retired domain is a
 * silent trap, not a safety net.
 */

/** Canonical origin, no trailing slash. */
export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL || "https://workagedleads.com"
).replace(/\/$/, "");

/** Bare hostname, no scheme and no `www.` — for display, never for links. */
export const SITE_HOST = (() => {
  try {
    return new URL(SITE_URL).hostname.replace(/^www\./, "");
  } catch {
    return "workagedleads.com";
  }
})();

/** Absolute URL for a site-relative path. `siteUrl("/start-here")`. */
export function siteUrl(path = "/"): string {
  return `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;
}

/**
 * The reader-facing contact address, as published on /privacy, /terms,
 * /contact and /editorial-process.
 *
 * Deliberately its own variable rather than derived from SITE_HOST. A mailbox
 * is not a DNS record: `bill@workagedleads.com` has to exist and be monitored
 * before these pages can publish it, and deriving it from the site URL would
 * silently repoint every legal page at a dead address the moment cutover
 * flipped `NEXT_PUBLIC_SITE_URL`. Set `NEXT_PUBLIC_CONTACT_EMAIL` when the
 * mailbox is live — that is a Phase 5 gate, not a code change.
 */
export const CONTACT_EMAIL =
  process.env.NEXT_PUBLIC_CONTACT_EMAIL || "bill@workagedleads.com";
