/**
 * Lead Pricing Algorithm
 *
 * Derives aged lead pricing from real-time benchmarks using empirically
 * observed decay curves. The model is calibrated from our benchmark data
 * across 10+ verticals.
 *
 * Key findings:
 * - Lead value follows exponential decay over time
 * - Decay rate correlates with deal value (high-value verticals decay slower)
 * - Exclusive premium is ~2.0-2.5x across all verticals
 * - The curve follows roughly: price = RT_price × e^(-λt)
 *   where λ varies by vertical "stickiness" (deal value driven)
 */

// ── Age Brackets ──────────────────────────────────────────────

export const AGE_BRACKETS = [
  "real-time",
  "1-7-days",
  "8-30-days",
  "31-85-days",
  "86-180-days",
  "181-365-days",
] as const;

export type AgeBracket = (typeof AGE_BRACKETS)[number];

/** Midpoint in days for each bracket — used in the decay formula */
const AGE_BRACKET_MIDPOINT_DAYS: Record<AgeBracket, number> = {
  "real-time": 0,
  "1-7-days": 4,
  "8-30-days": 19,
  "31-85-days": 58,
  "86-180-days": 133,
  "181-365-days": 273,
};

// ── Exclusivity Multipliers ───────────────────────────────────

/** Empirically observed: exclusive leads cost 2.0-2.5x shared */
const EXCLUSIVITY_MULTIPLIER: Record<string, number> = {
  shared: 1.0,
  "semi-exclusive": 1.5,
  exclusive: 2.2,
};

// ── Vertical Decay Profiles ───────────────────────────────────

/**
 * Each vertical has a "stickiness" factor that determines how slowly
 * leads lose value. Higher deal values = stickier leads (slower decay).
 *
 * lambda = decay rate constant (higher = faster decay)
 * Calibrated from observed RT-to-aged ratios:
 *   ratio = e^(lambda × midpoint_days)
 *   lambda = ln(ratio) / midpoint_days
 *
 * Using the 31-85 day bracket (midpoint=58 days) as calibration anchor.
 */
interface VerticalDecayProfile {
  /** Decay rate constant — higher means faster price decay */
  lambda: number;
  /** Spread factor: how wide the low-to-high range is (1.0 = tight, 3.0 = wide) */
  spreadFactor: number;
  /** Confidence for computed estimates */
  defaultConfidence: "high" | "medium" | "low";
}

const VERTICAL_DECAY_PROFILES: Record<string, VerticalDecayProfile> = {
  // Calibrated from data: RT $32 → Aged $0.38 = 84x ratio
  // lambda = ln(84) / 58 = 0.0764
  "auto-insurance": { lambda: 0.076, spreadFactor: 1.5, defaultConfidence: "medium" },

  // RT $35 → Aged $4 = 8.8x ratio → lambda = ln(8.8) / 58 = 0.0375
  "debt-settlement": { lambda: 0.038, spreadFactor: 2.5, defaultConfidence: "medium" },

  // RT $22 → Aged $1.25 = 17.6x → lambda = ln(17.6) / 58 = 0.0496
  "final-expense": { lambda: 0.050, spreadFactor: 1.8, defaultConfidence: "medium" },

  // RT $30 → Aged $0.72 = 41.7x → lambda = ln(41.7) / 58 = 0.0643
  "health-insurance": { lambda: 0.064, spreadFactor: 1.5, defaultConfidence: "medium" },

  // RT $25 → Aged $1.05 = 23.8x → lambda = ln(23.8) / 58 = 0.0546
  "home-improvement": { lambda: 0.055, spreadFactor: 1.8, defaultConfidence: "medium" },

  // RT $275 → Aged $50 = 5.5x → lambda = ln(5.5) / 58 = 0.0294
  "legal": { lambda: 0.029, spreadFactor: 3.0, defaultConfidence: "low" },

  // RT $22 → Aged $1.25 = 17.6x → lambda = 0.0496
  "life-insurance": { lambda: 0.050, spreadFactor: 1.8, defaultConfidence: "medium" },

  // RT $45 → Aged $4 = 11.3x → lambda = ln(11.3) / 58 = 0.0419
  "mca-business-loans": { lambda: 0.042, spreadFactor: 2.5, defaultConfidence: "medium" },

  // RT $45 → Aged $4 = 11.3x → lambda = 0.0419
  "medicare": { lambda: 0.042, spreadFactor: 2.0, defaultConfidence: "medium" },

  // RT $45 → Aged $4 = 11.3x → lambda = 0.0419
  "mortgage": { lambda: 0.042, spreadFactor: 2.0, defaultConfidence: "high" },

  // RT $100 → Aged $8 = 12.5x → lambda = ln(12.5) / 58 = 0.0435
  "solar": { lambda: 0.044, spreadFactor: 2.0, defaultConfidence: "medium" },

  // Tier 3 verticals — use category average
  "long-term-care": { lambda: 0.042, spreadFactor: 2.0, defaultConfidence: "low" },
  "auto-warranty": { lambda: 0.055, spreadFactor: 1.8, defaultConfidence: "low" },
  "home-security": { lambda: 0.055, spreadFactor: 1.8, defaultConfidence: "low" },
  "annuity-iul": { lambda: 0.042, spreadFactor: 2.0, defaultConfidence: "low" },
};

/** Fallback for unknown verticals */
const DEFAULT_PROFILE: VerticalDecayProfile = {
  lambda: 0.045,
  spreadFactor: 2.0,
  defaultConfidence: "low",
};

// ── Core Algorithm ────────────────────────────────────────────

export interface PriceEstimate {
  priceLow: number;
  priceMedian: number;
  priceHigh: number;
  confidence: "high" | "medium" | "low";
  isComputed: boolean;
  notes: string;
}

/**
 * Estimate the price for a lead given its characteristics.
 *
 * @param realTimeSharedMedian - The real-time shared median price for this vertical
 * @param ageBracket - Target age bracket
 * @param exclusivity - "shared" | "semi-exclusive" | "exclusive"
 * @param verticalSlug - Vertical identifier for decay profile lookup
 */
export function estimateLeadPrice(
  realTimeSharedMedian: number,
  ageBracket: AgeBracket,
  exclusivity: string,
  verticalSlug: string
): PriceEstimate {
  const profile = VERTICAL_DECAY_PROFILES[verticalSlug] || DEFAULT_PROFILE;
  const days = AGE_BRACKET_MIDPOINT_DAYS[ageBracket];
  const exMult = EXCLUSIVITY_MULTIPLIER[exclusivity] || 1.0;

  // Core formula: price = RT × e^(-λ × days) × exclusivity_multiplier
  const median = realTimeSharedMedian * Math.exp(-profile.lambda * days) * exMult;

  // Spread: low and high range based on vertical volatility
  const spreadDown = 1 / profile.spreadFactor;
  const spreadUp = profile.spreadFactor;
  const low = median * spreadDown;
  const high = median * spreadUp;

  // Round to sensible precision
  const round = (n: number) => {
    if (n >= 100) return Math.round(n);
    if (n >= 10) return Math.round(n * 10) / 10;
    if (n >= 1) return Math.round(n * 100) / 100;
    if (n >= 0.1) return Math.round(n * 100) / 100;
    return Math.round(n * 1000) / 1000;
  };

  return {
    priceLow: round(low),
    priceMedian: round(median),
    priceHigh: round(high),
    confidence: ageBracket === "real-time" ? profile.defaultConfidence : downgradeConfidence(profile.defaultConfidence),
    isComputed: true,
    notes: `Computed from RT shared median ($${realTimeSharedMedian}) using decay model (λ=${profile.lambda})`,
  };
}

function downgradeConfidence(c: "high" | "medium" | "low"): "high" | "medium" | "low" {
  if (c === "high") return "medium";
  return "low";
}

/**
 * Generate a full price curve for a vertical from a single real-time data point.
 * Returns estimates for all age brackets × exclusivity levels.
 */
export function generatePriceCurve(
  realTimeSharedMedian: number,
  verticalSlug: string
): {
  ageBracket: AgeBracket;
  exclusivity: string;
  estimate: PriceEstimate;
}[] {
  const results: {
    ageBracket: AgeBracket;
    exclusivity: string;
    estimate: PriceEstimate;
  }[] = [];

  for (const age of AGE_BRACKETS) {
    for (const exc of ["shared", "semi-exclusive", "exclusive"]) {
      results.push({
        ageBracket: age,
        exclusivity: exc,
        estimate: estimateLeadPrice(realTimeSharedMedian, age, exc, verticalSlug),
      });
    }
  }

  return results;
}

/**
 * Calculate the max CPL a buyer should pay given their economics.
 *
 * @param dealValue - Revenue per closed deal
 * @param contactRate - % of leads you reach (0-1)
 * @param closeRate - % of contacts that close (0-1)
 * @param targetMargin - Desired profit margin (0-1, default 0.5)
 */
export function calculateMaxCpl(
  dealValue: number,
  contactRate: number,
  closeRate: number,
  targetMargin: number = 0.5
): {
  maxCpl: number;
  revenuePerLead: number;
  effectiveCloseRate: number;
} {
  const effectiveCloseRate = contactRate * closeRate;
  const revenuePerLead = effectiveCloseRate * dealValue;
  const maxCpl = revenuePerLead * targetMargin;

  return {
    maxCpl: Math.round(maxCpl * 100) / 100,
    revenuePerLead: Math.round(revenuePerLead * 100) / 100,
    effectiveCloseRate,
  };
}

/**
 * Given observed benchmarks for a vertical, fill in missing age brackets
 * using the decay model. Only fills gaps — never overwrites real data.
 */
export function fillBenchmarkGaps(
  verticalSlug: string,
  existingBenchmarks: {
    leadAgeBracket: string;
    exclusivity: string;
    leadType: string;
    priceLow: number;
    priceMedian: number;
    priceHigh: number;
  }[],
  month: string
): {
  vertical: string;
  leadAgeBracket: string;
  exclusivity: string;
  leadType: string;
  month: string;
  priceLow: number;
  priceMedian: number;
  priceHigh: number;
  providersSampled: number;
  confidence: "high" | "medium" | "low";
  notes: string;
  isComputed: boolean;
}[] {
  // Find the real-time shared internet-form benchmark as our anchor
  const rtAnchor = existingBenchmarks.find(
    (b) =>
      b.leadAgeBracket === "real-time" &&
      b.exclusivity === "shared" &&
      b.leadType === "internet-form"
  );

  if (!rtAnchor) return []; // Can't compute without an anchor

  const results: ReturnType<typeof fillBenchmarkGaps> = [];

  // For each age bracket × exclusivity combo, check if data exists
  for (const age of AGE_BRACKETS) {
    for (const exc of ["shared", "semi-exclusive", "exclusive"] as const) {
      const exists = existingBenchmarks.find(
        (b) =>
          b.leadAgeBracket === age &&
          b.exclusivity === exc &&
          b.leadType === "internet-form"
      );

      if (!exists) {
        // Fill the gap with computed estimate
        const estimate = estimateLeadPrice(
          rtAnchor.priceMedian,
          age,
          exc,
          verticalSlug
        );

        results.push({
          vertical: verticalSlug,
          leadAgeBracket: age,
          exclusivity: exc,
          leadType: "internet-form",
          month,
          priceLow: estimate.priceLow,
          priceMedian: estimate.priceMedian,
          priceHigh: estimate.priceHigh,
          providersSampled: 0,
          confidence: estimate.confidence,
          notes: estimate.notes,
          isComputed: true,
        });
      }
    }
  }

  return results;
}

// ── Display Helpers ───────────────────────────────────────────

export function getDecayProfile(verticalSlug: string): VerticalDecayProfile {
  return VERTICAL_DECAY_PROFILES[verticalSlug] || DEFAULT_PROFILE;
}

export function getExclusivityMultiplier(exclusivity: string): number {
  return EXCLUSIVITY_MULTIPLIER[exclusivity] || 1.0;
}

/** Human-readable label for the decay speed */
export function getDecayLabel(lambda: number): string {
  if (lambda >= 0.065) return "Very Fast Decay";
  if (lambda >= 0.050) return "Fast Decay";
  if (lambda >= 0.040) return "Moderate Decay";
  if (lambda >= 0.030) return "Slow Decay";
  return "Very Slow Decay";
}
