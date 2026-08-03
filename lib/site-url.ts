/**
 * The one place the site's own address is written down.
 *
 * Most of the codebase already reads `NEXT_PUBLIC_SITE_URL` with an inline
 * `|| "https://agedleadsales.com"` fallback, and those are fine: the env var is
 * set in Vercel, so cutover flips them all at once. What was NOT fine were the
 * bare literals — an `https://agedleadsales.com/...` written straight into an
 * email body, a JSON-LD block, a canonical tag or a copyable embed snippet.
 * Those ignore the env var entirely, so at cutover they would keep pointing at
 * a domain that 301s back to the site emitting them.
 *
 * The rule this module exists to enforce: never write the site's own host into
 * a string. Import from here.
 *
 * Cutover is one env change — `NEXT_PUBLIC_SITE_URL=https://workagedleads.com`
 * — and it must ship in the same deploy as `NOINDEX_HOSTS=""`. Flipping the
 * noindex without the URL makes the new host indexable while it declares its
 * canonical to be a domain that is simultaneously redirecting to it.
 */

/** Canonical origin, no trailing slash. */
export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL || "https://agedleadsales.com"
).replace(/\/$/, "");

/** Bare hostname, no scheme and no `www.` — for display, never for links. */
export const SITE_HOST = (() => {
  try {
    return new URL(SITE_URL).hostname.replace(/^www\./, "");
  } catch {
    return "agedleadsales.com";
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
  process.env.NEXT_PUBLIC_CONTACT_EMAIL || "bill@agedleadsales.com";
