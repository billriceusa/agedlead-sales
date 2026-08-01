/**
 * Which hostnames must never be indexed.
 *
 * During Phase 3 the site serves on two domains at once: agedleadsales.com,
 * which is indexed and earning, and workagedleads.com, which is being stood up.
 * A second complete copy of a 250-page site appearing in the index — on the
 * domain we are about to migrate *to* — is the worst possible place to have a
 * duplicate-content problem, because it competes with the target of the move.
 *
 * The migration plan calls for this to key on the hostname rather than on a
 * build-time robots flag, and that is deliberate: Next evaluates `metadata`
 * robots at build time, so an env-driven robots rule ships baked in and a copy
 * built with the wrong value is indexable with no way to tell from the outside.
 * A request-time hostname check cannot get that wrong.
 *
 * Failure mode is chosen: when `NOINDEX_HOSTS` is unset the migration host is
 * still suppressed. Forgetting to configure it leaves the site over-protected,
 * not exposed.
 *
 * To let workagedleads.com be indexed at cutover, set `NOINDEX_HOSTS` to an
 * empty string and redeploy. Removing this at cutover is Phase 5, not Phase 3.
 */

/** Hosts suppressed when `NOINDEX_HOSTS` is not set. Compared bare — a leading
 * `www.` is stripped from both sides, so this covers apex and www together. */
export const DEFAULT_NOINDEX_HOSTS = ["workagedleads.com"];

/** The value sent on a suppressed host. `nofollow` is included so link equity
 * is not attributed to the staging copy while both hosts serve the same pages. */
export const NOINDEX_HEADER = "noindex, nofollow";

/** Lowercase, drop the port, drop a leading `www.`, drop a trailing dot. */
export function normalizeHost(host: string | null | undefined): string {
  const bare = (host ?? "")
    .trim()
    .toLowerCase()
    .split(":")[0]
    .replace(/\.$/, "");
  return bare.startsWith("www.") ? bare.slice(4) : bare;
}

/**
 * Parse the `NOINDEX_HOSTS` override.
 *
 * Unset (undefined) falls back to the defaults. An explicitly empty string
 * means "suppress nothing" — that is the cutover switch, and it has to be
 * distinguishable from "not configured".
 */
export function parseNoindexHosts(raw: string | undefined): string[] {
  if (raw === undefined) return DEFAULT_NOINDEX_HOSTS;
  return raw
    .split(",")
    .map((h) => normalizeHost(h))
    .filter(Boolean);
}

/**
 * Should this host be served `X-Robots-Tag: noindex`?
 *
 * Vercel preview deployments are always suppressed. They serve a full copy of
 * the site on a URL nobody controls the sharing of, and Phase 3 produces a
 * stream of them. They are never a host we want ranking.
 */
export function shouldNoindexHost(
  host: string | null | undefined,
  noindexHosts: string[] = DEFAULT_NOINDEX_HOSTS,
): boolean {
  const normalized = normalizeHost(host);
  if (!normalized) return false;
  if (normalized.endsWith(".vercel.app")) return true;
  return noindexHosts.includes(normalized);
}
