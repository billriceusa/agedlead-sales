import type { GscPropertyKey } from "./gsc-trend";

/**
 * The Search Console properties the trend cron reads.
 *
 * Declared in code rather than as a comma-separated env var, matching
 * BRSG_PROPERTIES in the billricestrategy.com repo. An env string would carry
 * only the site URL — losing the stable join key the snapshot rows are keyed
 * on, the label, and the retirement date. This list changes when a domain
 * migrates, not per environment, so it belongs in git where the diff records
 * when a property was added or dropped.
 */
export interface GscPropertyConfig {
  key: GscPropertyKey;
  /** sc-domain: or URL-prefix form, exactly as registered in Search Console. */
  gscSiteUrl: string;
  label: string;
  /** Stop reading this property after this date. History for it is retained. */
  retiredAfter?: string; // YYYY-MM-DD
}

export const GSC_PROPERTIES: GscPropertyConfig[] = [
  {
    // Kept through the migration so the series has continuity rather than a
    // cliff. Retire once its numbers have fully drained into workagedleads.com
    // — roughly 60-90 days after the 2026-08-03 cutover.
    key: "agedleadsales",
    gscSiteUrl: "sc-domain:agedleadsales.com",
    label: "Aged Lead Sales (retiring)",
  },
  {
    key: "workagedleads",
    gscSiteUrl: "sc-domain:workagedleads.com",
    label: "Work Aged Leads",
  },
];

/** Properties still being read on the given date. */
export function activeProperties(today: string): GscPropertyConfig[] {
  return GSC_PROPERTIES.filter((p) => !p.retiredAfter || today <= p.retiredAfter);
}
