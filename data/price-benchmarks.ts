export interface PriceBenchmarkData {
  vertical: string; // slug reference
  leadAgeBracket: string;
  exclusivity: string;
  leadType: string;
  month: string;
  priceLow: number;
  priceMedian: number;
  priceHigh: number;
  providersSampled: number;
  confidence: "high" | "medium" | "low";
  notes?: string;
}

/**
 * Initial seed benchmarks — March 2026
 * Sourced from published provider pricing, quote requests, and market analysis.
 */
export const PRICE_BENCHMARKS: PriceBenchmarkData[] = [
  // ═══════════════════════════════════════════════════════════
  // MORTGAGE
  // ═══════════════════════════════════════════════════════════
  {
    vertical: "mortgage",
    leadAgeBracket: "real-time",
    exclusivity: "shared",
    leadType: "internet-form",
    month: "2026-03",
    priceLow: 20,
    priceMedian: 45,
    priceHigh: 100,
    providersSampled: 6,
    confidence: "high",
    notes: "Shared real-time mortgage leads sold to 3-5 buyers",
  },
  {
    vertical: "mortgage",
    leadAgeBracket: "real-time",
    exclusivity: "exclusive",
    leadType: "internet-form",
    month: "2026-03",
    priceLow: 50,
    priceMedian: 100,
    priceHigh: 200,
    providersSampled: 5,
    confidence: "high",
  },
  {
    vertical: "mortgage",
    leadAgeBracket: "real-time",
    exclusivity: "exclusive",
    leadType: "live-transfer",
    month: "2026-03",
    priceLow: 75,
    priceMedian: 120,
    priceHigh: 175,
    providersSampled: 4,
    confidence: "medium",
  },
  {
    vertical: "mortgage",
    leadAgeBracket: "8-30-days",
    exclusivity: "shared",
    leadType: "internet-form",
    month: "2026-03",
    priceLow: 3,
    priceMedian: 7,
    priceHigh: 15,
    providersSampled: 4,
    confidence: "high",
  },
  {
    vertical: "mortgage",
    leadAgeBracket: "31-85-days",
    exclusivity: "shared",
    leadType: "internet-form",
    month: "2026-03",
    priceLow: 2,
    priceMedian: 4,
    priceHigh: 8,
    providersSampled: 5,
    confidence: "high",
  },
  {
    vertical: "mortgage",
    leadAgeBracket: "86-180-days",
    exclusivity: "shared",
    leadType: "internet-form",
    month: "2026-03",
    priceLow: 0.5,
    priceMedian: 2,
    priceHigh: 5,
    providersSampled: 4,
    confidence: "high",
  },
  {
    vertical: "mortgage",
    leadAgeBracket: "181-365-days",
    exclusivity: "shared",
    leadType: "internet-form",
    month: "2026-03",
    priceLow: 0.25,
    priceMedian: 1,
    priceHigh: 3,
    providersSampled: 3,
    confidence: "medium",
  },
  {
    vertical: "mortgage",
    leadAgeBracket: "31-85-days",
    exclusivity: "shared",
    leadType: "trigger-credit",
    month: "2026-03",
    priceLow: 0.15,
    priceMedian: 0.35,
    priceHigh: 0.5,
    providersSampled: 3,
    confidence: "medium",
    notes: "Credit trigger / inquiry data, not opt-in internet form",
  },

  // ═══════════════════════════════════════════════════════════
  // AUTO INSURANCE
  // ═══════════════════════════════════════════════════════════
  {
    vertical: "auto-insurance",
    leadAgeBracket: "real-time",
    exclusivity: "shared",
    leadType: "internet-form",
    month: "2026-03",
    priceLow: 20,
    priceMedian: 32,
    priceHigh: 45,
    providersSampled: 5,
    confidence: "high",
  },
  {
    vertical: "auto-insurance",
    leadAgeBracket: "real-time",
    exclusivity: "exclusive",
    leadType: "internet-form",
    month: "2026-03",
    priceLow: 50,
    priceMedian: 75,
    priceHigh: 100,
    providersSampled: 4,
    confidence: "medium",
  },
  {
    vertical: "auto-insurance",
    leadAgeBracket: "31-85-days",
    exclusivity: "shared",
    leadType: "internet-form",
    month: "2026-03",
    priceLow: 0.25,
    priceMedian: 0.38,
    priceHigh: 0.5,
    providersSampled: 4,
    confidence: "high",
  },
  {
    vertical: "auto-insurance",
    leadAgeBracket: "86-180-days",
    exclusivity: "shared",
    leadType: "internet-form",
    month: "2026-03",
    priceLow: 0.25,
    priceMedian: 0.35,
    priceHigh: 0.5,
    providersSampled: 3,
    confidence: "high",
  },

  // ═══════════════════════════════════════════════════════════
  // LIFE INSURANCE
  // ═══════════════════════════════════════════════════════════
  {
    vertical: "life-insurance",
    leadAgeBracket: "real-time",
    exclusivity: "shared",
    leadType: "internet-form",
    month: "2026-03",
    priceLow: 15,
    priceMedian: 22,
    priceHigh: 30,
    providersSampled: 5,
    confidence: "high",
  },
  {
    vertical: "life-insurance",
    leadAgeBracket: "real-time",
    exclusivity: "exclusive",
    leadType: "internet-form",
    month: "2026-03",
    priceLow: 30,
    priceMedian: 50,
    priceHigh: 75,
    providersSampled: 4,
    confidence: "medium",
  },
  {
    vertical: "life-insurance",
    leadAgeBracket: "31-85-days",
    exclusivity: "shared",
    leadType: "internet-form",
    month: "2026-03",
    priceLow: 0.62,
    priceMedian: 1.25,
    priceHigh: 1.88,
    providersSampled: 4,
    confidence: "high",
  },

  // ═══════════════════════════════════════════════════════════
  // FINAL EXPENSE
  // ═══════════════════════════════════════════════════════════
  {
    vertical: "final-expense",
    leadAgeBracket: "real-time",
    exclusivity: "shared",
    leadType: "internet-form",
    month: "2026-03",
    priceLow: 15,
    priceMedian: 22,
    priceHigh: 30,
    providersSampled: 5,
    confidence: "high",
  },
  {
    vertical: "final-expense",
    leadAgeBracket: "real-time",
    exclusivity: "exclusive",
    leadType: "internet-form",
    month: "2026-03",
    priceLow: 30,
    priceMedian: 40,
    priceHigh: 50,
    providersSampled: 4,
    confidence: "medium",
  },
  {
    vertical: "final-expense",
    leadAgeBracket: "real-time",
    exclusivity: "exclusive",
    leadType: "live-transfer",
    month: "2026-03",
    priceLow: 50,
    priceMedian: 65,
    priceHigh: 80,
    providersSampled: 3,
    confidence: "medium",
  },
  {
    vertical: "final-expense",
    leadAgeBracket: "31-85-days",
    exclusivity: "shared",
    leadType: "internet-form",
    month: "2026-03",
    priceLow: 0.62,
    priceMedian: 1.25,
    priceHigh: 1.88,
    providersSampled: 4,
    confidence: "high",
  },
  {
    vertical: "final-expense",
    leadAgeBracket: "31-85-days",
    exclusivity: "exclusive",
    leadType: "direct-mail",
    month: "2026-03",
    priceLow: 8,
    priceMedian: 15,
    priceHigh: 25,
    providersSampled: 3,
    confidence: "medium",
    notes: "Direct mail response leads — 100% exclusive, higher intent",
  },

  // ═══════════════════════════════════════════════════════════
  // HEALTH INSURANCE
  // ═══════════════════════════════════════════════════════════
  {
    vertical: "health-insurance",
    leadAgeBracket: "real-time",
    exclusivity: "shared",
    leadType: "internet-form",
    month: "2026-03",
    priceLow: 20,
    priceMedian: 30,
    priceHigh: 40,
    providersSampled: 4,
    confidence: "medium",
  },
  {
    vertical: "health-insurance",
    leadAgeBracket: "real-time",
    exclusivity: "exclusive",
    leadType: "internet-form",
    month: "2026-03",
    priceLow: 50,
    priceMedian: 75,
    priceHigh: 100,
    providersSampled: 3,
    confidence: "medium",
  },
  {
    vertical: "health-insurance",
    leadAgeBracket: "31-85-days",
    exclusivity: "shared",
    leadType: "internet-form",
    month: "2026-03",
    priceLow: 0.5,
    priceMedian: 0.72,
    priceHigh: 0.94,
    providersSampled: 3,
    confidence: "high",
  },

  // ═══════════════════════════════════════════════════════════
  // MEDICARE
  // ═══════════════════════════════════════════════════════════
  {
    vertical: "medicare",
    leadAgeBracket: "real-time",
    exclusivity: "shared",
    leadType: "internet-form",
    month: "2026-03",
    priceLow: 30,
    priceMedian: 45,
    priceHigh: 60,
    providersSampled: 4,
    confidence: "medium",
  },
  {
    vertical: "medicare",
    leadAgeBracket: "real-time",
    exclusivity: "exclusive",
    leadType: "internet-form",
    month: "2026-03",
    priceLow: 75,
    priceMedian: 110,
    priceHigh: 150,
    providersSampled: 3,
    confidence: "medium",
  },
  {
    vertical: "medicare",
    leadAgeBracket: "real-time",
    exclusivity: "exclusive",
    leadType: "live-transfer",
    month: "2026-03",
    priceLow: 50,
    priceMedian: 75,
    priceHigh: 100,
    providersSampled: 3,
    confidence: "medium",
  },

  // Medicare aged benchmarks
  {
    vertical: "medicare",
    leadAgeBracket: "31-85-days",
    exclusivity: "shared",
    leadType: "internet-form",
    month: "2026-03",
    priceLow: 1.5,
    priceMedian: 4,
    priceHigh: 8,
    providersSampled: 3,
    confidence: "medium",
    notes: "Limited aged Medicare data — most providers focus on AEP/OEP real-time leads",
  },

  // ═══════════════════════════════════════════════════════════
  // SOLAR
  // ═══════════════════════════════════════════════════════════
  {
    vertical: "solar",
    leadAgeBracket: "real-time",
    exclusivity: "shared",
    leadType: "internet-form",
    month: "2026-03",
    priceLow: 60,
    priceMedian: 100,
    priceHigh: 150,
    providersSampled: 4,
    confidence: "medium",
  },
  {
    vertical: "solar",
    leadAgeBracket: "real-time",
    exclusivity: "exclusive",
    leadType: "internet-form",
    month: "2026-03",
    priceLow: 120,
    priceMedian: 200,
    priceHigh: 300,
    providersSampled: 3,
    confidence: "medium",
  },
  {
    vertical: "solar",
    leadAgeBracket: "real-time",
    exclusivity: "exclusive",
    leadType: "live-transfer",
    month: "2026-03",
    priceLow: 80,
    priceMedian: 100,
    priceHigh: 120,
    providersSampled: 3,
    confidence: "medium",
  },

  // Solar aged benchmarks
  {
    vertical: "solar",
    leadAgeBracket: "31-85-days",
    exclusivity: "shared",
    leadType: "internet-form",
    month: "2026-03",
    priceLow: 3,
    priceMedian: 8,
    priceHigh: 15,
    providersSampled: 3,
    confidence: "medium",
    notes: "Aged solar leads less common than real-time — fewer providers offer them",
  },

  // ═══════════════════════════════════════════════════════════
  // HOME IMPROVEMENT
  // ═══════════════════════════════════════════════════════════
  {
    vertical: "home-improvement",
    leadAgeBracket: "real-time",
    exclusivity: "shared",
    leadType: "internet-form",
    month: "2026-03",
    priceLow: 15,
    priceMedian: 25,
    priceHigh: 40,
    providersSampled: 3,
    confidence: "medium",
  },
  {
    vertical: "home-improvement",
    leadAgeBracket: "31-85-days",
    exclusivity: "shared",
    leadType: "internet-form",
    month: "2026-03",
    priceLow: 0.6,
    priceMedian: 1.05,
    priceHigh: 1.5,
    providersSampled: 3,
    confidence: "medium",
  },

  // ═══════════════════════════════════════════════════════════
  // DEBT SETTLEMENT
  // ═══════════════════════════════════════════════════════════
  {
    vertical: "debt-settlement",
    leadAgeBracket: "real-time",
    exclusivity: "shared",
    leadType: "internet-form",
    month: "2026-03",
    priceLow: 20,
    priceMedian: 35,
    priceHigh: 50,
    providersSampled: 3,
    confidence: "medium",
  },
  {
    vertical: "debt-settlement",
    leadAgeBracket: "31-85-days",
    exclusivity: "shared",
    leadType: "internet-form",
    month: "2026-03",
    priceLow: 1,
    priceMedian: 4,
    priceHigh: 8,
    providersSampled: 3,
    confidence: "medium",
  },

  // ═══════════════════════════════════════════════════════════
  // MCA & BUSINESS LOANS
  // ═══════════════════════════════════════════════════════════
  {
    vertical: "mca-business-loans",
    leadAgeBracket: "31-85-days",
    exclusivity: "shared",
    leadType: "data-list",
    month: "2026-03",
    priceLow: 0.01,
    priceMedian: 0.03,
    priceHigh: 0.05,
    providersSampled: 3,
    confidence: "high",
    notes: "Raw data lists, not opt-in internet form fills",
  },
  {
    vertical: "mca-business-loans",
    leadAgeBracket: "real-time",
    exclusivity: "exclusive",
    leadType: "live-transfer",
    month: "2026-03",
    priceLow: 35,
    priceMedian: 50,
    priceHigh: 75,
    providersSampled: 3,
    confidence: "medium",
  },

  // MCA aged internet-form benchmark
  {
    vertical: "mca-business-loans",
    leadAgeBracket: "31-85-days",
    exclusivity: "shared",
    leadType: "internet-form",
    month: "2026-03",
    priceLow: 0.5,
    priceMedian: 2,
    priceHigh: 5,
    providersSampled: 3,
    confidence: "medium",
    notes: "Internet form opt-in aged MCA leads (higher quality than raw data lists)",
  },

  // ═══════════════════════════════════════════════════════════
  // LEGAL (Personal Injury)
  // ═══════════════════════════════════════════════════════════
  {
    vertical: "legal",
    leadAgeBracket: "real-time",
    exclusivity: "shared",
    leadType: "internet-form",
    month: "2026-03",
    priceLow: 150,
    priceMedian: 275,
    priceHigh: 400,
    providersSampled: 3,
    confidence: "low",
    notes: "Personal injury / mass tort. Pricing varies enormously by case type.",
  },
  {
    vertical: "legal",
    leadAgeBracket: "real-time",
    exclusivity: "exclusive",
    leadType: "internet-form",
    month: "2026-03",
    priceLow: 300,
    priceMedian: 550,
    priceHigh: 800,
    providersSampled: 3,
    confidence: "low",
  },
  {
    vertical: "legal",
    leadAgeBracket: "real-time",
    exclusivity: "exclusive",
    leadType: "live-transfer",
    month: "2026-03",
    priceLow: 100,
    priceMedian: 150,
    priceHigh: 200,
    providersSampled: 2,
    confidence: "low",
  },
  // Legal aged benchmark
  {
    vertical: "legal",
    leadAgeBracket: "31-85-days",
    exclusivity: "shared",
    leadType: "internet-form",
    month: "2026-03",
    priceLow: 15,
    priceMedian: 50,
    priceHigh: 100,
    providersSampled: 2,
    confidence: "low",
    notes: "Aged PI/mass tort leads — highly variable by case type. Limited providers.",
  },
];

// ── Helper Functions ──────────────────────────────────────────

/**
 * Minimum bar for a benchmark to be shown as a headline price or plotted as a
 * trend point. The marketwatch cron synthesizes monthly estimates with an LLM;
 * single-provider runs are unreliable (they collapse to round numbers like a
 * flat $1–$1 range and don't represent a real market sample). We require at
 * least two providers in the sample to surface a benchmark as fair-market
 * pricing. Single-provider rows are still retained in Sanity, just not
 * displayed. Keep this in sync with the publish-side guard in
 * lib/cron/marketwatch-publish.ts so junk never gets written in the first place.
 */
export function isTrustworthyBenchmark(b: {
  providersSampled?: number;
}): boolean {
  return (b.providersSampled ?? 0) >= 2;
}

/** Get benchmarks for a specific vertical (latest month) */
export function getBenchmarksByVertical(
  verticalSlug: string
): PriceBenchmarkData[] {
  return PRICE_BENCHMARKS.filter((b) => b.vertical === verticalSlug);
}

/** Get a specific benchmark data point */
export function getBenchmark(
  verticalSlug: string,
  ageBracket: string,
  exclusivity: string,
  leadType: string
): PriceBenchmarkData | undefined {
  return PRICE_BENCHMARKS.find(
    (b) =>
      b.vertical === verticalSlug &&
      b.leadAgeBracket === ageBracket &&
      b.exclusivity === exclusivity &&
      b.leadType === leadType
  );
}

/** Get all verticals that have benchmark data */
export function getBenchmarkVerticals(): string[] {
  return [...new Set(PRICE_BENCHMARKS.map((b) => b.vertical))];
}

/** Format a price for display */
export function formatPrice(price: number): string {
  if (price >= 1) {
    return `$${price.toFixed(price % 1 === 0 ? 0 : 2)}`;
  }
  return `$${price.toFixed(2)}`;
}

/** Format a price range for display */
export function formatPriceRange(low: number, high: number): string {
  return `${formatPrice(low)} – ${formatPrice(high)}`;
}

/** Human-readable labels */
export const AGE_BRACKET_LABELS: Record<string, string> = {
  "real-time": "Real-Time",
  "1-7-days": "1–7 Days",
  "8-30-days": "8–30 Days",
  "31-85-days": "31–85 Days",
  "86-180-days": "86–180 Days",
  "181-365-days": "181–365 Days",
};

export const EXCLUSIVITY_LABELS: Record<string, string> = {
  exclusive: "Exclusive",
  "semi-exclusive": "Semi-Exclusive",
  shared: "Shared",
};

export const LEAD_TYPE_LABELS: Record<string, string> = {
  "internet-form": "Internet Form",
  "live-transfer": "Live Transfer",
  "trigger-credit": "Trigger / Credit",
  "direct-mail": "Direct Mail",
  "data-list": "Data List",
};

export const CONFIDENCE_LABELS: Record<string, string> = {
  high: "High Confidence",
  medium: "Medium Confidence",
  low: "Low Confidence",
};
