/**
 * Single source of truth for the lead-type ↔ vertical relationship.
 *
 * Lead-type page slugs (e.g. "mva-leads", "iul-leads") don't always match
 * vertical slugs (e.g. "legal", "annuity-iul"), and the relationship is not
 * 1:1 — several insurance lead types map onto the same family of verticals. We
 * keep BOTH directions curated by hand (rather than deriving the reverse from
 * the forward map) so the internal-linking cluster never produces a mislink.
 *
 * This powers the cluster that ties each vertical together for SEO:
 *   lead-type guide  ↔  price index  ↔  best providers
 */

/** Lead-type page slug → its vertical slug (for price-index + providers/best). */
export const LEAD_TYPE_TO_VERTICAL: Record<string, string> = {
  "mortgage-leads": "mortgage",
  "insurance-leads": "auto-insurance",
  "final-expense-leads": "final-expense",
  "iul-leads": "annuity-iul",
  // SSDI = Social Security Disability; these are disability-attorney leads, so
  // they map to the "legal" vertical (same as mva-leads), NOT life-insurance.
  "ssdi-leads": "legal",
  "mva-leads": "legal",
  "solar-leads": "solar",
  "medicare-leads": "medicare",
  // Without this, "home-services-leads" falls back to "home-services", which is
  // not a real vertical slug (the vertical is "home-improvement") — producing
  // broken /price-index and /providers/best links on that page.
  "home-services-leads": "home-improvement",
};

export function verticalForLeadType(leadTypeSlug: string): string {
  return (
    LEAD_TYPE_TO_VERTICAL[leadTypeSlug] || leadTypeSlug.replace(/-leads$/, "")
  );
}

/**
 * Vertical slug → its primary lead-type guide slug. Curated (NOT derived from
 * the forward map) because several lead types point at the same vertical and we
 * want the most relevant guide for each vertical, not whichever happened to be
 * listed first. Only verticals that have a dedicated guide appear here.
 */
export const VERTICAL_TO_LEAD_TYPE: Record<string, string> = {
  mortgage: "mortgage-leads",
  "auto-insurance": "insurance-leads",
  "life-insurance": "insurance-leads",
  "health-insurance": "insurance-leads",
  "final-expense": "final-expense-leads",
  "annuity-iul": "iul-leads",
  legal: "mva-leads",
  solar: "solar-leads",
  medicare: "medicare-leads",
  "home-improvement": "home-services-leads",
};

export function leadTypeForVertical(
  verticalSlug: string
): string | undefined {
  return VERTICAL_TO_LEAD_TYPE[verticalSlug];
}
