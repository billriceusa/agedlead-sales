/**
 * Which of a directory provider's verticals the one paying partner actually
 * stocks — and therefore what an honest "also available at Aged Lead Store"
 * offer on a competitor's profile is allowed to say.
 *
 * WHY THIS EXISTS
 *
 * `/providers/{slug}` is the only page on the site that links out to a
 * non-paying provider. The hero's "Visit Website" button is the single call
 * site of `providerWebsiteUrl`, and every non-affiliate outbound click GA4
 * recorded in the 30 days to 2026-10-05 carried `utm_campaign=provider-{slug}`,
 * so all 42 of them left from these 14 pages. On those pages a reader at peak
 * purchase intent was shown exactly one destination — the competitor — with the
 * partner reachable only through the related-links block and the footer banner,
 * several screens below.
 *
 * The fix is to put the alternative at the same decision point, not to remove or
 * demote the competitor link: the independence of these reviews is the reason
 * anyone reads them. See /methodology.
 *
 * THE CATALOGUE IS NOT THE PARTNER'S `verticals` LIST
 *
 * A vertical can be listed on the partner's own profile and still have no page
 * to send a shopper to. Solar is exactly that case — the partner stocks it, but
 * only inside the storefront, with no marketing buy page (see the
 * STORE_CATEGORY_PATHS note in lib/affiliate.ts). `storeCategoryPath` returning
 * a path is the only evidence a vertical-specific destination exists, so that is
 * the test used here.
 *
 * A vertical that falls back to the generic `/all-lead-types/` catalogue counts
 * as NOT stocked and is never linked. Routing vertical-specific intent to the
 * full catalogue is the leak this is meant to close, not a reclaim of it.
 */

import { PROVIDERS } from "../data/providers";
import { getVertical } from "../data/verticals";
import { leadTypeForVertical } from "../data/lead-type-vertical-map";
import { storeCategoryPath } from "./affiliate";

/** The one provider in the directory that pays a commission. */
export const AFFILIATE_PROVIDER_SLUG = "aged-lead-store";

export interface StockedVertical {
  verticalSlug: string;
  /** Display name, e.g. "Auto Insurance". */
  verticalName: string;
  /**
   * The key `storeCategoryPath` and `agedLeadLabel` understand for this
   * vertical. Not always the vertical slug — see `storeLeadTypeKey`.
   */
  leadTypeKey: string;
}

export interface ProviderStoreComparison {
  affiliateName: string;
  affiliateSlug: string;
  affiliateRating: number;
  /** True when the partner is the highest-scoring provider in the directory. */
  affiliateIsTopRated: boolean;
  /** Canonical `/compare/{pair}` path for this provider against the partner. */
  comparePath: string;
  /** Verticals this provider sells that the partner has a real buy page for. */
  stocked: StockedVertical[];
  /** Display names of this provider's verticals the partner cannot serve. */
  unstockedNames: string[];
}

/**
 * The lead-type key for a vertical, or undefined when the partner has no
 * vertical-specific destination for it.
 *
 * Two indirections, both load-bearing. `leadTypeForVertical` covers the
 * verticals whose slug differs from their lead-type slug ("annuity-iul" →
 * "iul-leads"). The `?? verticalSlug` fallback covers the ones that have a store
 * path but no guide page — "homeowners-insurance" is absent from
 * VERTICAL_TO_LEAD_TYPE yet maps cleanly through `storeCategoryPath`'s own
 * `-leads` retry. Dropping either one silently under-reports the catalogue.
 */
export function storeLeadTypeKey(verticalSlug: string): string | undefined {
  const key = leadTypeForVertical(verticalSlug) ?? verticalSlug;
  return storeCategoryPath(key) ? key : undefined;
}

/**
 * Build the honest comparison for a provider profile, or null when there is
 * nothing to say — the partner's own profile, or a slug we do not carry.
 */
export function providerStoreComparison(
  providerSlug: string
): ProviderStoreComparison | null {
  if (providerSlug === AFFILIATE_PROVIDER_SLUG) return null;

  const provider = PROVIDERS.find((p) => p.slug === providerSlug);
  const affiliate = PROVIDERS.find((p) => p.slug === AFFILIATE_PROVIDER_SLUG);
  if (!provider || !affiliate) return null;

  const stocked: StockedVertical[] = [];
  const unstockedNames: string[] = [];

  for (const verticalSlug of provider.verticals) {
    const verticalName = getVertical(verticalSlug)?.name ?? verticalSlug;
    // Both conditions matter: the partner must list the vertical AND have a
    // destination for it.
    const leadTypeKey = affiliate.verticals.includes(verticalSlug)
      ? storeLeadTypeKey(verticalSlug)
      : undefined;
    if (leadTypeKey) {
      stocked.push({ verticalSlug, verticalName, leadTypeKey });
    } else {
      unstockedNames.push(verticalName);
    }
  }

  const topRating = Math.max(...PROVIDERS.map((p) => p.overallRating));

  return {
    affiliateName: affiliate.name,
    affiliateSlug: affiliate.slug,
    affiliateRating: affiliate.overallRating,
    affiliateIsTopRated: affiliate.overallRating === topRating,
    // Alphabetical, matching parsePair's canonical order in
    // app/(site)/compare/[pair]/page.tsx. A reversed pair 404s.
    comparePath: `/compare/${[affiliate.slug, provider.slug]
      .sort()
      .join("-vs-")}`,
    stocked,
    unstockedNames,
  };
}
