/**
 * Canonical Bill Rice identity — mirrored copy. Do not edit in isolation.
 *
 * Source of truth: ~/Code/_shared-docs/bill-rice-identity.md
 * Reference implementation: billrice.com/src/lib/identity.ts
 *
 * billrice.com holds the authoritative DESCRIPTION of the person. This site
 * emits a REFERENCE node carrying the same @id, so crawlers resolve one entity
 * instead of a site-local duplicate.
 */

/** One URI for the person, on every domain. Never re-mint this per site. */
export const BILL_RICE_ID = "https://billrice.com/#person";

/** The person's own canonical page — schema.org `url`, not a sameAs entry. */
export const BILL_RICE_URL = "https://billrice.com";

/** Name as it appears in bylines, for matching CMS-authored content. */
export const BILL_RICE_NAME = "Bill Rice";

/**
 * Identity profiles only — accounts that ARE Bill Rice. Verified 2026-07-29.
 *
 * This site previously listed howtoworkleads.com/resources/about and
 * kaleidico.com/bill-rice/ here. Those are *pages about* Bill on sites he is
 * connected to — not profiles that are him — so they belong in a relationship
 * (worksFor / author), not in sameAs.
 */
export const BILL_RICE_SAME_AS = [
  "https://www.wikidata.org/wiki/Q139037772",
  "https://www.linkedin.com/in/billrice/",
  "https://x.com/billrice",
  "https://www.youtube.com/@billricestrategy",
  "https://medium.com/@billrice",
] as const;

/** The reference node this site emits in place of a local Person description. */
export const billRicePersonRef = {
  "@type": "Person",
  "@id": BILL_RICE_ID,
  name: BILL_RICE_NAME,
  url: BILL_RICE_URL,
  sameAs: [...BILL_RICE_SAME_AS],
};

/** Reference-by-id, for author / founder / publisher slots. */
export const billRiceRef = { "@id": BILL_RICE_ID };
