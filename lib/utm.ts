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

/**
 * The value emitted by howtoworkleads.com before it was folded in.
 *
 * This one is easy to forget and expensive to forget. howtoworkleads.com was
 * the original property and carried the overwhelming majority of attributed
 * revenue — $18,303.25 in March 2026 and $9,282.60 in July 2026, against
 * $616.50 for both newer sources combined in August. It is not a rounding
 * error; for most of 2026 it IS the revenue.
 *
 * It is separate from AFFILIATE_UTM_SOURCES on purpose. That list feeds the
 * lifecycle-email report, which pairs it with medium EXACT "email"; adding a
 * third source there would quietly move that report's numbers for no reason.
 * Attribution and invoicing need the wider net, so they get their own list.
 */
export const AFFILIATE_UTM_SOURCE_LEGACY_HTWL = "howtoworkleads";

/**
 * Every source value that has EVER represented one of Bill's properties.
 *
 * For attribution and invoicing ONLY. Two rules come with it, and both were
 * learned by getting them wrong:
 *
 * 1. Match on SOURCE, never on medium. howtoworkleads.com tagged its outbound
 *    links `utm_medium=website`, not `affiliate`. A filter that pins
 *    medium="affiliate" returns $0.00 for every month before the rebrand while
 *    looking perfectly healthy.
 *
 * 2. Sum all three. GA4 does not rewrite history, so a single window can hold
 *    sessions under two or three different source values at once — August 2026
 *    is split across `workagedleads` ($361.50) and `agedleadsales` ($255.00)
 *    because the source flipped mid-month on 2026-08-04.
 *
 * The failure mode of getting either wrong is the dangerous kind: the query
 * does not error, it just finds less money.
 */
export const AFFILIATE_ATTRIBUTION_SOURCES = [
  AFFILIATE_UTM_SOURCE,
  AFFILIATE_UTM_SOURCE_LEGACY,
  AFFILIATE_UTM_SOURCE_LEGACY_HTWL,
] as const;
