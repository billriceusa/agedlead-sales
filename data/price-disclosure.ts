/**
 * Which lead providers will tell you what they charge — before you talk to them.
 *
 * WHY THIS EXISTS
 *
 * The Q3 Price Index study (see `data/loop/price-index-q3-disclosure-survey.md`)
 * set out to re-price 12 mortgage and final-expense cells from public sources
 * and filled **zero** of them. Not because the research stalled — because the
 * prices are not public. Of 15 rated providers, exactly **one** publishes a
 * per-lead price at the granularity a buyer could actually compare.
 *
 * That absence is the more useful finding. A market where 1 in 15 sellers will
 * state a price is a market where buyers cannot comparison-shop at all, and
 * "call for a quote" is a pricing strategy, not an oversight: a published number
 * commits you to it, and it lets the buyer walk to a competitor with an exact
 * figure in hand.
 *
 * So rather than leave a gap where a price chart should be, the site names the
 * gap and scores it. Disclosure becomes a visible, checkable advantage for the
 * providers who practise it — which is the only kind of pressure a directory can
 * apply to a market that would rather stay opaque.
 *
 * THIS IS OBSERVATION, NOT JUDGEMENT — AND IT IS KEPT SEPARATE ON PURPOSE
 *
 * `data/providers.ts` holds ratings: considered editorial positions with
 * reasoning. This file holds one narrow fact per provider — what their public
 * site showed on a given date — so it can be re-checked mechanically each
 * quarter without reopening any editorial argument. Do not merge them.
 *
 * It happens to reflect well on Aged Lead Store, which is an affiliate partner.
 * That is not a favour: it is a fact anyone can verify in a browser in ten
 * seconds, the citation is right here, and it would read exactly the same if the
 * partner published nothing. If Aged Lead Store stops publishing, this entry
 * changes with it.
 *
 * RE-VERIFYING: visit each `sourceUrl`, look for a per-lead price stated with
 * its age bracket and exclusivity, and update `level`, `note` and `verified`.
 * A price behind a login or a quote form is NOT published.
 */

export type DisclosureLevel =
  /** A per-lead price, public, with enough detail to compare. */
  | "published"
  /** Real prices, but only for part of the catalogue or without age/exclusivity. */
  | "partial"
  /** Only a bundle total — unusable without knowing the lead count. */
  | "package-only"
  /** Only an "as low as" figure. A floor is not a range. */
  | "floor-only"
  /** Prices exist, but for products outside the consumer lead verticals here. */
  | "adjacent-only"
  /** Nothing public. Call, book a demo, or log in. */
  | "quote-only"
  /** Surveyed, but the site does not sell leads in the sense this index means. */
  | "not-applicable";

export interface PriceDisclosure {
  /** Matches `slug` in data/providers.ts. */
  slug: string;
  level: DisclosureLevel;
  /** What was actually on the page. Quote figures verbatim. */
  note: string;
  /** The page the observation came from. */
  sourceUrl: string;
  /** YYYY-MM-DD the page was read. */
  verified: string;
}

export const PRICE_DISCLOSURE: PriceDisclosure[] = [
  {
    slug: "aged-lead-store",
    level: "published",
    note:
      "Publishes a full per-lead price table across nine verticals, each with its age band and exclusivity — e.g. mortgage $1.50–$2.50 at 30–85 days, shared. The only provider surveyed whose public pricing is specific enough to compare.",
    sourceUrl: "https://agedleadstore.com/all-lead-types/",
    verified: "2026-09-02",
  },
  {
    slug: "badass-insurance-leads",
    level: "partial",
    note:
      "Publishes life insurance at $1.00 per lead (3–12 months, exclusive) and Spanish-language life at $1.85. Final expense, Medicare, health and IUL are offered but priced on request.",
    sourceUrl: "https://badassinsuranceleads.com",
    verified: "2026-09-02",
  },
  {
    slug: "lead-heroes",
    level: "package-only",
    note:
      'Shows a package range of "$800.00 – $3,400.00" with volume tiers, but no per-lead price and no lead age, exclusivity or source type — so the cost per lead cannot be derived.',
    sourceUrl: "https://leadheroes.com/final-expense-leads/",
    verified: "2026-09-02",
  },
  {
    slug: "brokers-data",
    level: "floor-only",
    note:
      'States daily mortgage trigger leads "as low as 20 cents each". A floor is not a range, and it covers real-time trigger data rather than aged internet leads. Everything else is quoted.',
    sourceUrl: "https://brokersdata.com",
    verified: "2026-09-02",
  },
  {
    slug: "synergy-direct-solution",
    level: "adjacent-only",
    note:
      'Prices aged business-loan, UCC and trigger leads at "1-5 cents each", but not the consumer verticals this index tracks. Consumer pricing is "discussed directly with our team".',
    sourceUrl: "https://synergydirectsolution.com",
    verified: "2026-09-02",
  },
  {
    slug: "datatoleads",
    level: "adjacent-only",
    note:
      "Advertises $0.01 per record for enriched B2B data. That is a data-append product, not a consumer lead, so it is not comparable to per-lead pricing here.",
    sourceUrl: "https://datatoleads.com",
    verified: "2026-09-02",
  },
  {
    slug: "the-leads-warehouse",
    level: "quote-only",
    note: 'Lists verticals across finance, health and legal, but directs all pricing to a phone call to "talk pricing".',
    sourceUrl: "https://theleadswarehouse.com",
    verified: "2026-09-02",
  },
  {
    slug: "aged-leads-depot",
    level: "quote-only",
    note: 'States aged leads are "significantly cheaper than fresh leads" without a single figure. Pricing goes through a contact form or a booked strategy call.',
    sourceUrl: "https://agedleadsdepot.com",
    verified: "2026-09-02",
  },
  {
    slug: "need-a-lead",
    level: "quote-only",
    note: "Direct-mail leads described as 100% exclusive with 90-day territory exclusivity, but every price is behind a free-quote request.",
    sourceUrl: "https://needalead.com",
    verified: "2026-09-02",
  },
  {
    slug: "smartfinancial",
    level: "quote-only",
    note: 'Raises the question "How much does it cost?" on the agent page and does not answer it. No lead type, age or exclusivity detail is public either.',
    sourceUrl: "https://agents.smartfinancial.com/",
    verified: "2026-09-02",
  },
  {
    slug: "ileads",
    level: "quote-only",
    note: "Mortgage and property-data products are described in detail with no pricing anywhere; the route to a number is a booked demo.",
    sourceUrl: "https://ileads.com",
    verified: "2026-09-02",
  },
  {
    slug: "leadpoint",
    level: "quote-only",
    note: "Public site is effectively a contact page — an address, a phone number and a form. No products or pricing are shown without contacting them.",
    sourceUrl: "https://leadpoint.com",
    verified: "2026-09-02",
  },
  {
    slug: "lead-tycoons",
    level: "quote-only",
    note: "Advertises business-loan, MCA and UCC leads in both real-time and aged form, with no pricing on the public page.",
    sourceUrl: "https://leadtycoons.com",
    verified: "2026-09-02",
  },
  {
    slug: "quotewizard",
    level: "quote-only",
    note: "Primarily a consumer comparison site; agent pricing sits behind the Agent Portal login and is not published.",
    sourceUrl: "https://quotewizard.com",
    verified: "2026-09-02",
  },
  {
    slug: "leadsdata",
    level: "not-applicable",
    note:
      "Public site presents as a behaviour-analytics and identity-resolution platform ($49/mo for 10k sessions; $0.18 per activatable resolution) rather than a lead marketplace. Its pricing is published, but it is not per-lead pricing. Flagged for editorial review — see data/loop/price-index-q3-disclosure-survey.md.",
    sourceUrl: "https://leadsdata.com",
    verified: "2026-09-02",
  },
];

const BY_SLUG = new Map(PRICE_DISCLOSURE.map((d) => [d.slug, d]));

export function getDisclosure(slug: string): PriceDisclosure | undefined {
  return BY_SLUG.get(slug);
}

/** Display copy for each level. `rank` orders best-to-worst for sorting. */
export const DISCLOSURE_META: Record<
  DisclosureLevel,
  { label: string; short: string; rank: number; tone: "good" | "mixed" | "poor" | "neutral" }
> = {
  published: {
    label: "Publishes per-lead prices",
    short: "Prices published",
    rank: 0,
    tone: "good",
  },
  partial: {
    label: "Publishes some prices",
    short: "Some prices published",
    rank: 1,
    tone: "mixed",
  },
  "package-only": {
    label: "Package totals only",
    short: "Package price only",
    rank: 2,
    tone: "mixed",
  },
  "floor-only": {
    label: '"As low as" figure only',
    short: "Starting price only",
    rank: 3,
    tone: "mixed",
  },
  "adjacent-only": {
    label: "Prices other products only",
    short: "Other products priced",
    rank: 4,
    tone: "neutral",
  },
  "quote-only": {
    label: "Quote required — no public prices",
    short: "Quote only",
    rank: 5,
    tone: "poor",
  },
  "not-applicable": {
    label: "Not a per-lead seller",
    short: "Not comparable",
    rank: 6,
    tone: "neutral",
  },
};

/** Providers whose public pricing is specific enough to actually compare. */
export function providersPublishingPrices(): PriceDisclosure[] {
  return PRICE_DISCLOSURE.filter(
    (d) => d.level === "published" || d.level === "partial",
  ).sort((a, b) => DISCLOSURE_META[a.level].rank - DISCLOSURE_META[b.level].rank);
}

/** Headline counts for the summary panel. Derived, never hand-written. */
export function disclosureStats(): {
  total: number;
  publishing: number;
  quoteOnly: number;
} {
  const comparable = PRICE_DISCLOSURE.filter((d) => d.level !== "not-applicable");
  return {
    total: comparable.length,
    publishing: comparable.filter(
      (d) => d.level === "published" || d.level === "partial",
    ).length,
    quoteOnly: comparable.filter((d) => d.level === "quote-only").length,
  };
}
