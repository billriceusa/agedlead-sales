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
 * Failure mode was chosen: while the default listed workagedleads.com,
 * forgetting to configure `NOINDEX_HOSTS` left the site over-protected rather
 * than exposed.
 *
 * SOFT LAUNCH ENDED 2026-08-03. The default is now empty.
 *
 * The original plan was to end it by setting `NOINDEX_HOSTS=""` at cutover.
 * That does not work: Vercel discards an empty-string environment variable, so
 * the value never reaches the runtime and `parseNoindexHosts` sees `undefined`
 * and falls back to the default — leaving the new host noindexed on the very
 * deploy meant to release it, with nothing in the env to show why. Ending the
 * soft launch in code removes the dependency on a value the platform cannot
 * represent.
 *
 * The mechanism is intact. Set `NOINDEX_HOSTS` to suppress a host again; the
 * unconditional `.vercel.app` rule in `shouldNoindexHost` is untouched.
 */

/** Hosts suppressed when `NOINDEX_HOSTS` is not set. Compared bare — a leading
 * `www.` is stripped from both sides, so this covers apex and www together.
 *
 * Empty since cutover: no production host on this project should be suppressed
 * by default. Preview deployments are still covered, in `shouldNoindexHost`. */
export const DEFAULT_NOINDEX_HOSTS: string[] = [];

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
