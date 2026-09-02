import { AFFILIATE_UTM_SOURCE } from "@/lib/utm";

/**
 * The lead types Aged Lead Store actually sells, and where to send a buyer.
 *
 * THE AUTHORITATIVE SOURCE IS THE CARD GRID ON
 * https://agedleadstore.com/all-lead-types/ — confirmed by Bill 2026-08-27 as
 * the mapping to use, and it does not change often. Re-derive this list from
 * those cards; do not infer it from URL patterns or from our own lead-type
 * taxonomy, which is broader than what Troy stocks.
 *
 * WHY THESE POINT AT store.agedleadstore.com AND NOT THE MARKETING PAGES
 *
 * The cards themselves link straight into the storefront app, skipping the
 * marketing page entirely. That is one fewer click before an order, and the
 * host is tracked in the SAME GA4 property (357329146) that commission is
 * computed from — verified 2026-08-27: store.agedleadstore.com carried 7,610
 * sessions / 47,524 pageviews over the prior 87 days. Sending buyers here
 * therefore shortens the path without breaking attribution.
 *
 * A 200 CANNOT VALIDATE THESE URLS. `/bogus_vertical/leads` also returns 200
 * — the storefront serves a page for any slug. What separates a real vertical
 * from a typo is the body: real verticals rendered 85–90 KB and named their
 * own vertical ~11 times, the bogus slug rendered 30 KB. If you add or rename
 * an entry, diff the body, don't check the status code.
 *
 * Verified 2026-08-27: all nine resolve, no redirects, each page's own
 * vertical dominates its copy.
 *
 * Deliberately NOT priced here. Troy's card grid shows a price per vertical,
 * and quoting it in an email means a price change silently mails a wrong
 * number to the whole list. The storefront shows the live price on landing.
 */
export interface StoreVertical {
  /** Slug used in utm_content. Stable — changing it breaks trend continuity. */
  key: string;
  /** Button label. Reads as the buyer's own vertical, not our taxonomy. */
  label: string;
  /** Storefront path segment, exactly as the card grid links it. */
  segment: string;
}

export const STORE_VERTICALS: StoreVertical[] = [
  { key: "mortgage", label: "Mortgage", segment: "mortgage_refinance" },
  { key: "final-expense", label: "Final Expense", segment: "life_insurance" },
  { key: "life", label: "Life Insurance", segment: "life_insurance" },
  { key: "auto", label: "Auto Insurance", segment: "auto_insurance" },
  { key: "health", label: "Health Insurance", segment: "health_insurance" },
  { key: "iul", label: "IUL Insurance", segment: "iul_insurance" },
  { key: "home-improvement", label: "Home Improvement", segment: "home_improvement" },
  { key: "home-insurance", label: "Home Insurance", segment: "homeowner_insurance" },
  { key: "solar", label: "Solar Installation", segment: "solar_installation" },
];

const STOREFRONT = "https://store.agedleadstore.com";
const CATALOGUE = "https://agedleadstore.com/all-lead-types/";

/**
 * The default campaign for links built here.
 *
 * Kept as the default so every existing caller keeps emitting exactly what it
 * emitted before. Anything that is NOT the Tuesday newsletter must pass its own
 * campaign — a one-off offer send tagged `weekly-newsletter` would be averaged
 * into the newsletter's trend line and neither could be read afterwards.
 */
const DEFAULT_CAMPAIGN = "weekly-newsletter";

/**
 * Build a tagged store URL.
 *
 * `utm_content` carries BOTH the issue and the placement — `2026-08-31-hero`,
 * `2026-08-31-vertical-mortgage`, `2026-08-31-footer`. The issue date alone
 * (what shipped before) tells you which email earned a click but never which
 * link, which makes a multi-placement layout unmeasurable.
 *
 * `campaign` separates one *send* from another the same way `utm_content`
 * separates one link from another within a send.
 */
export function storeUrl(
  weekLabel: string,
  placement: string,
  segment?: string,
  campaign: string = DEFAULT_CAMPAIGN,
): string {
  const base = segment ? `${STOREFRONT}/${segment}/leads` : CATALOGUE;
  const params = new URLSearchParams({
    utm_source: AFFILIATE_UTM_SOURCE,
    utm_medium: "email",
    utm_campaign: campaign,
    utm_content: `${weekLabel}-${placement}`,
  });
  return `${base}?${params.toString()}`;
}

/** The catalogue fallback, for readers whose vertical isn't stocked. */
export function catalogueUrl(
  weekLabel: string,
  placement: string,
  campaign: string = DEFAULT_CAMPAIGN,
): string {
  return storeUrl(weekLabel, placement, undefined, campaign);
}
