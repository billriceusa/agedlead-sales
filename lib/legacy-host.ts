/**
 * Permanent redirects from the retiring hosts onto workagedleads.com.
 *
 * agedleadsales.com is attached to this same Vercel project, so the host move
 * is done here rather than in Vercel's domain settings. Same effect, but it is
 * reviewable, testable, and revertible with a revert instead of depending on
 * someone remembering which box they ticked.
 *
 * Path is preserved and the query string with it. A URL whose path also
 * changed then takes a second hop through the `next.config.ts` rules built
 * from url-map.csv — `agedleadsales.com/old` → `workagedleads.com/old` →
 * `workagedleads.com/new`. Two hops is fine; Google follows short chains.
 *
 * `/api` is deliberately NOT redirected. A 301 turns a POST into a GET, so
 * redirecting the capture routes would silently drop any form submitted from a
 * page a visitor already had open on the old host — the failure mode being
 * lost leads with no error anywhere. The old host keeps serving those routes;
 * it is the same deployment, and `ALLOWED_HOSTS` in lib/anti-spam.ts still
 * lists it on purpose. Crawlers never see them: robots.txt disallows /api.
 */

import { normalizeHost } from "./soft-launch";

/** The canonical host everything lands on. */
export const TARGET_HOST = "workagedleads.com";

/**
 * Hosts that now redirect. Compared bare, so `www.` is covered by the apex
 * entry — `normalizeHost` strips it from both sides.
 *
 * howtoworkleads.com is NOT here: it is served by a different Vercel project
 * (`howtoworkleads-web`) and redirects from its own repo.
 */
export const LEGACY_HOSTS = ["agedleadsales.com"];

/** Prefixes left on the old host. See the note above about POST. */
const NOT_REDIRECTED = ["/api"];


/**
 * The absolute URL this request should be permanently redirected to, or null
 * to serve normally.
 */
export function legacyRedirectTarget(
  host: string | null | undefined,
  requestUrl: string,
  legacyHosts: string[] = LEGACY_HOSTS,
): string | null {
  const normalized = normalizeHost(host);
  if (!normalized || !legacyHosts.includes(normalized)) return null;

  let url: URL;
  try {
    url = new URL(requestUrl);
  } catch {
    return null;
  }

  if (NOT_REDIRECTED.some((p) => url.pathname === p || url.pathname.startsWith(`${p}/`))) {
    return null;
  }

  url.protocol = "https:";
  url.host = TARGET_HOST;
  url.port = "";
  return url.toString();
}
