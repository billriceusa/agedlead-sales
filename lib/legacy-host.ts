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
 * Paths whose destination also moved, so the host swap can land on the final
 * URL in one hop instead of handing it to a second rule in next.config.ts.
 *
 * Every entry here exists because the page it pointed at was retired *after*
 * url-map.csv was generated — three legacy playbooks unpublished in favour of
 * the flagship funnel, and three near-duplicate blog posts consolidated. The
 * host redirect alone would send them to a path that no longer exists and rely
 * on a second redirect to rescue them.
 *
 * Two hops is survivable and the comment above says so, but these are the only
 * ALS paths that need it, the fix is a lookup, and it keeps the post-cutover
 * gate honest at --max-hops=1 rather than carrying six permanent exceptions.
 *
 * Keep in sync with data/migration/url-map.csv, which is the source of truth.
 */
const PATH_MOVES: Record<string, string> = {
  "/playbooks/7-day-aged-lead-follow-up-cadence":
    "/guides/7-day-aged-lead-follow-up-cadence",
  "/playbooks/tracking-aged-lead-roi-metrics": "/calculators/roi-calculator",
  "/playbooks/mortgage-rate-shopping-playbook": "/lead-types/mortgage-leads",
  "/blog/aged-lead-team-training-playbook-managers":
    "/blog/training-aged-lead-sales-team",
  "/blog/summer-solar-aged-lead-activation-strategy":
    "/blog/summer-solar-sales-aged-leads-q2-strategy",
  "/blog/aged-lead-budget-allocation-roi-optimization":
    "/blog/aged-lead-budget-allocation-strategy",
};

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

  // Trailing slash is not significant here — /blog/x and /blog/x/ are the same
  // page, and a miss would silently cost the extra hop this table exists to
  // remove.
  const moved =
    PATH_MOVES[url.pathname] ??
    PATH_MOVES[url.pathname.replace(/\/+$/, "")];
  if (moved) url.pathname = moved;

  url.protocol = "https:";
  url.host = TARGET_HOST;
  url.port = "";
  return url.toString();
}
