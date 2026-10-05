import { affiliateUrl, storeCategoryPath } from "./affiliate";
import { AFFILIATE_UTM_SOURCE } from "./utm";

/**
 * Storefront deep links for on-site doors.
 *
 * WHY THIS EXISTS, AND WHY IT IS SEPARATE FROM `lib/affiliate.ts`
 *
 * `lib/affiliate.ts` builds links to `agedleadstore.com` — the partner's
 * MARKETING site. Its `STORE_CATEGORY_PATHS` map is documented as "marketing
 * paths only", and every entry in it resolves to a page the partner wrote to
 * *explain* a vertical. That is the right destination for a reader who still
 * needs convincing. It is the wrong one for a reader who has already declared
 * a vertical by reading a whole page about it.
 *
 * `lib/newsletter/store-links.ts` already makes the other choice, and records
 * why: the partner's own card grid on /all-lead-types/ "link[s] straight into
 * the storefront app, skipping the marketing page entirely. That is one fewer
 * click before an order, and the host is tracked in the SAME GA4 property
 * (357329146) that commission is computed from."
 *
 * This module gives the on-site doors the same treatment the newsletter has
 * had since 2026-08-27. It is a separate file rather than an addition to
 * `lib/affiliate.ts` because the two have different hosts, different link
 * shapes and different verification rules, and because `lib/newsletter/**` is
 * not the only consumer any more.
 *
 * THE MEASUREMENT THAT MOTIVATED IT (store-side GA4 357329146,
 * 2026-09-01 -> 2026-10-05, sessionMedium=affiliate, by campaign x content):
 *
 *   lead-type / hero-door      32 sessions   1 add-to-cart   0 orders   $0.00
 *   header-nav / header        24 sessions   8 add-to-carts  0 orders   $0.00
 *   providers-hub / hero-door  22 sessions  15 add-to-carts  5 orders  $545.00
 *   lead-types-hub / hero-door 10 sessions   0 add-to-carts  0 orders   $0.00
 *
 * `lead-type/hero-door` is the LARGEST single on-site door by sessions and it
 * has produced no revenue. Breaking those sessions down by the page they
 * actually landed on is what identifies the mechanism: of the ~12 `lead-type`
 * sessions that landed on one of the partner's marketing pages
 * (/life-insurance-leads/ 5, /auto-insurance-leads/ 1, /health-insurance-leads/
 * 1, /buy-home-improvement-leads-lp/ 1, /all-lead-types/ 2, plus /faq/ and
 * /about-aged-lead-store/), ZERO reached a cart. The single add-to-cart under
 * the campaign came from a session that landed on /customers/login — an
 * existing account holder, the returning-user artifact already documented for
 * the retired site's header door, not a reader this door converted.
 *
 * The same test on `header-nav` says the same thing: its 13 sessions that
 * landed on /all-lead-types/ — where that door actually points — produced zero
 * add-to-carts. All 13 of the campaign's carts came from sessions that landed
 * deep inside the storefront or on /customers/login.
 *
 * So the pattern is not "lead-type pages have weak intent". It is that a door
 * pointing at a page of prose cannot produce a cart, because there is no cart
 * on it. The storefront pages carry live per-lead pricing ($0.25-$2.50
 * observed), state filters and an Add to Cart control. That is the difference
 * between the surfaces that earn here and the ones that do not.
 *
 * HOW TO VERIFY AN ENTRY — A 200 IS NOT ENOUGH, AND NEITHER IS A 404
 *
 * `lib/newsletter/store-links.ts` warns that `/bogus_vertical/leads` returned
 * 200 in 2026-08, so status codes could not separate a real vertical from a
 * typo; the test was the body (real verticals 85-90 KB and naming their own
 * vertical ~11 times, the bogus slug 30 KB).
 *
 * Re-verified 2026-10-05 and the storefront's behaviour has CHANGED: both
 * `/bogus_vertical/leads` and `/legal/leads` now return **404** at 30,507
 * bytes, while all eight real segments return 200 at 82.9-92.4 KB. The body
 * test still passes and is still the one to trust — the status code now agrees
 * with it, but it did not in August, so do not start relying on the code
 * alone. Diff the body.
 *
 * THE AUTHORITATIVE SOURCE IS THE CARD GRID on
 * https://agedleadstore.com/all-lead-types/ — the same source
 * `lib/newsletter/store-links.ts` uses, confirmed by Bill 2026-08-27. Re-read
 * those cards; do not infer a segment from a URL pattern.
 *
 * Verified against that grid 2026-10-05. It links exactly eight distinct
 * segments, and this map carries all eight:
 *   auto_insurance, health_insurance, home_improvement, homeowner_insurance,
 *   iul_insurance, life_insurance, mortgage_refinance, solar_installation
 *
 * NOT STOCKED, AND DELIBERATELY ABSENT — do not "fix" these by inventing a
 * segment:
 *   - legal / SSDI / MVA — `/legal/leads` is a verified 404. The partner sells
 *     all legal intake from the MARKETING page `/legal-leads/`, which
 *     `storeCategoryPath` already returns, so those pages correctly keep it.
 *   - the generic "Insurance Leads" bucket — no single storefront segment
 *     covers it, exactly as there is no generic-insurance marketing buy page.
 *   - medicare — absent from the card grid. NOTE for a human decision, not a
 *     licence to add it: the storefront's own root nav does link
 *     `medicare_supplement/leads`, along with auto_warranty, card_debt,
 *     home_warranty, mortgage_protection and tax_debt — six segments the
 *     marketing card grid does not show. Solar was in exactly this position
 *     once (documented in `lib/affiliate.ts` as unstocked, then found on the
 *     grid), so the Medicare note may simply be stale. It needs Bill's
 *     confirmation against what Troy is actually selling before any lead-type
 *     page points at it.
 */

const STOREFRONT_BASE = "https://store.agedleadstore.com";
const UTM_MEDIUM = "affiliate";

/**
 * Lead type -> storefront segment.
 *
 * Keyed the same way `storeCategoryPath` is keyed — the Sanity
 * `leadType.title` normalised to a slug ("Mortgage Leads" -> "mortgage-leads")
 * — because callers pass a title, and the two maps must agree on lookup
 * behaviour or a page could resolve a marketing path and no segment (or the
 * reverse) for the same input.
 */
const STOREFRONT_SEGMENTS: Record<string, string> = {
  "mortgage-leads": "mortgage_refinance",
  "life-insurance-leads": "life_insurance",
  // Per the partner's own menu, final expense IS life insurance to them — the
  // same equivalence `lib/affiliate.ts` and `STORE_VERTICALS` both encode.
  "final-expense-leads": "life_insurance",
  "auto-insurance-leads": "auto_insurance",
  "health-insurance-leads": "health_insurance",
  "iul-leads": "iul_insurance",
  "home-improvement-leads": "home_improvement",
  // Legacy slug: /lead-types/home-services-leads 301s to home-improvement-leads,
  // but older content still carries the label, so it resolves rather than
  // silently falling back to the catalogue.
  "home-services-leads": "home_improvement",
  "homeowners-insurance-leads": "homeowner_insurance",
  // Solar closes a gap `lib/affiliate.ts` flagged explicitly: the partner
  // stocks it, but only in the storefront — there is no marketing buy page, so
  // `storeCategoryPath` returns undefined and the solar guide has been sending
  // declared solar intent to the full catalogue. It now deep-links like every
  // other stocked vertical.
  "solar-leads": "solar_installation",
};

/**
 * The storefront segment for a lead type, or undefined when the partner does
 * not stock it there.
 *
 * Undefined is a valid answer, not a failure: the caller should fall back to
 * `storeCategoryPath` (the marketing buy page) and then to the catalogue.
 * Accepts a Sanity title or a slug, and tolerates a bare vertical
 * ("mortgage") by retrying with the `-leads` suffix — the same tolerance
 * `storeCategoryPath` has, for the same reason.
 */
export function storefrontSegment(
  leadType?: string | null
): string | undefined {
  if (!leadType) return undefined;
  const key = leadType.trim().toLowerCase().replace(/[\s_]+/g, "-");
  return STOREFRONT_SEGMENTS[key] ?? STOREFRONT_SEGMENTS[`${key}-leads`];
}

interface StorefrontLink {
  segment: string;
  campaign: string;
  content: string;
}

/**
 * A tagged storefront URL.
 *
 * Same four UTMs and the same source as `affiliateUrl`, so these sessions land
 * in the same store-side reports under the same campaign names. `utm_medium`
 * stays `affiliate` (not `email`, which is what `storeUrl` emits for the
 * newsletter) so on-site doors remain separable from sends.
 *
 * `isAffiliateDomain` in `lib/affiliate.ts` already matches subdomains of the
 * affiliate host, so clicks here are counted as affiliate rather than as
 * leakage to a competitor. That function exists precisely because the
 * newsletter started deep-linking this host; nothing further is needed.
 */
export function storefrontUrl({
  segment,
  campaign,
  content,
}: StorefrontLink): string {
  const params = new URLSearchParams({
    utm_source: AFFILIATE_UTM_SOURCE,
    utm_medium: UTM_MEDIUM,
    utm_campaign: campaign,
    utm_content: content,
  });
  return `${STOREFRONT_BASE}/${segment}/leads?${params.toString()}`;
}

/**
 * The one place the destination precedence lives.
 *
 * WHY THIS EXISTS (2026-10-05)
 *
 * The precedence — storefront segment, then marketing buy page, then full
 * catalogue — shipped the same day into three components at once:
 * `hero-affiliate-door.tsx`, `cta-banner.tsx` and `inline-text-cta.tsx`. Each
 * carried its own four-line copy, written separately, because they were built
 * by different hands under a file-ownership split.
 *
 * Four lines is nothing. Four lines that must never disagree is a defect
 * waiting for the next person who changes two of the three. The whole reason
 * this precedence exists is that a lead-type page's hero door and its body CTAs
 * pointed at DIFFERENT destinations, which would have corrupted the
 * iteration-11 reading on 2026-11-09 — so leaving three copies of the rule that
 * fixed that is precisely the wrong shape.
 *
 * `fallbackPath` exists for CtaBanner, which accepts an explicit
 * `affiliatePath` override and must keep honouring it when no segment resolves.
 *
 * The `-store` suffix on `content` is what keeps storefront destinations
 * separable in GA4 from the marketing-page history under the same campaign. It
 * is applied here, once, rather than remembered in three places.
 */
export function affiliateDestination({
  leadType,
  campaign,
  content,
  fallbackPath,
}: {
  leadType?: string;
  campaign: string;
  content: string;
  /** CtaBanner's explicit `affiliatePath` override; ignored when a segment resolves. */
  fallbackPath?: string;
}): { href: string; segment?: string; content: string; isStorefront: boolean } {
  const segment = storefrontSegment(leadType);
  if (segment) {
    const resolved = `${content}-store`;
    return {
      href: storefrontUrl({ segment, campaign, content: resolved }),
      segment,
      content: resolved,
      isStorefront: true,
    };
  }
  return {
    href: affiliateUrl({
      path: fallbackPath ?? storeCategoryPath(leadType),
      campaign,
      content,
    }),
    content,
    isStorefront: false,
  };
}
