/**
 * The affiliate attribution source, in one place.
 *
 * This existed as six independent copies of the string "agedleadsales" —
 * two module-private constants that happened to share a name, two inline
 * literals inside the lifecycle mailer, a raw template literal in the email
 * course, three more baked into static course copy, and a GA4 report filter
 * matching the same value from the other direction. Changing "the" UTM source
 * meant finding all of them, and the report filter fails silently if missed:
 * it simply stops matching traffic, which reads as a traffic loss rather than
 * a broken query.
 *
 * D16 (2026-08-01, Bill): affiliate credit is UTM-based and carries no
 * dependence on the referring URL, so the value is ours to choose.
 */
export const AFFILIATE_UTM_SOURCE = "workagedleads";

/**
 * The value emitted before the 2026-08-05 rebrand.
 *
 * Kept because GA4 does not rewrite history: sessions recorded under the old
 * source stay under it forever. Any report spanning the switch has to match
 * both or it shows a cliff on the changeover date that never happened.
 */
export const AFFILIATE_UTM_SOURCE_LEGACY = "agedleadsales";

/** Both values, for report filters that must span the rebrand. */
export const AFFILIATE_UTM_SOURCES = [
  AFFILIATE_UTM_SOURCE,
  AFFILIATE_UTM_SOURCE_LEGACY,
] as const;
