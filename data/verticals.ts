export interface VerticalData {
  name: string;
  slug: string;
  icon: string;
  description: string;
  tier: 1 | 2 | 3;
  order: number;
  /** Default contact rates by lead age for this vertical */
  benchmarkDefaults: {
    realTimeContactRate: number;
    agedContactRate: number;
    realTimeCloseRate: number;
    agedCloseRate: number;
    avgDealValue: number;
  };
}

export const VERTICALS: VerticalData[] = [
  // ── Tier 1: Highest Volume ────────────────────────────────
  {
    name: "Mortgage",
    slug: "mortgage",
    icon: "🏠",
    description:
      "Purchase, refinance, HELOC, reverse, FHA/VA, and DSCR/investor mortgage leads.",
    tier: 1,
    order: 1,
    benchmarkDefaults: {
      realTimeContactRate: 0.55,
      agedContactRate: 0.3,
      realTimeCloseRate: 0.04,
      agedCloseRate: 0.015,
      avgDealValue: 3500,
    },
  },
  {
    name: "Auto Insurance",
    slug: "auto-insurance",
    icon: "🚗",
    description:
      "Auto insurance quote leads from consumers shopping for new or better coverage.",
    tier: 1,
    order: 2,
    benchmarkDefaults: {
      realTimeContactRate: 0.5,
      agedContactRate: 0.35,
      realTimeCloseRate: 0.08,
      agedCloseRate: 0.03,
      avgDealValue: 225,
    },
  },
  {
    name: "Life Insurance",
    slug: "life-insurance",
    icon: "🛡️",
    description:
      "Term life, whole life, and universal life insurance leads from consumers seeking coverage.",
    tier: 1,
    order: 3,
    benchmarkDefaults: {
      realTimeContactRate: 0.5,
      agedContactRate: 0.3,
      realTimeCloseRate: 0.06,
      agedCloseRate: 0.025,
      avgDealValue: 800,
    },
  },
  {
    name: "Final Expense",
    slug: "final-expense",
    icon: "⚰️",
    description:
      "Burial and final expense insurance leads targeting seniors planning end-of-life costs.",
    tier: 1,
    order: 4,
    benchmarkDefaults: {
      realTimeContactRate: 0.5,
      agedContactRate: 0.3,
      realTimeCloseRate: 0.1,
      agedCloseRate: 0.04,
      avgDealValue: 660,
    },
  },
  {
    name: "Health Insurance",
    slug: "health-insurance",
    icon: "🏥",
    description:
      "ACA, marketplace, and individual health insurance leads from open enrollment and SEPs.",
    tier: 1,
    order: 5,
    benchmarkDefaults: {
      realTimeContactRate: 0.5,
      agedContactRate: 0.3,
      realTimeCloseRate: 0.15,
      agedCloseRate: 0.05,
      avgDealValue: 300,
    },
  },
  {
    name: "Medicare",
    slug: "medicare",
    icon: "💊",
    description:
      "Medicare Advantage, Medicare Supplement, and Part D leads from seniors turning 65 or during AEP.",
    tier: 1,
    order: 6,
    benchmarkDefaults: {
      realTimeContactRate: 0.55,
      agedContactRate: 0.3,
      realTimeCloseRate: 0.12,
      agedCloseRate: 0.04,
      avgDealValue: 400,
    },
  },
  {
    name: "Solar",
    slug: "solar",
    icon: "☀️",
    description:
      "Homeowner leads interested in solar panel installation and clean energy savings.",
    tier: 1,
    order: 7,
    benchmarkDefaults: {
      realTimeContactRate: 0.5,
      agedContactRate: 0.25,
      realTimeCloseRate: 0.08,
      agedCloseRate: 0.03,
      avgDealValue: 4500,
    },
  },

  // ── Tier 2: Significant Volume ────────────────────────────
  {
    name: "Home Improvement",
    slug: "home-improvement",
    icon: "🔨",
    description:
      "Roofing, windows, HVAC, bathrooms, kitchens, and other home renovation leads.",
    tier: 2,
    order: 1,
    benchmarkDefaults: {
      realTimeContactRate: 0.5,
      agedContactRate: 0.3,
      realTimeCloseRate: 0.15,
      agedCloseRate: 0.05,
      avgDealValue: 1200,
    },
  },
  {
    name: "Debt Settlement",
    slug: "debt-settlement",
    icon: "💳",
    description:
      "Debt consolidation, credit repair, and tax debt leads from consumers seeking financial relief.",
    tier: 2,
    order: 2,
    benchmarkDefaults: {
      realTimeContactRate: 0.45,
      agedContactRate: 0.25,
      realTimeCloseRate: 0.05,
      agedCloseRate: 0.02,
      avgDealValue: 2000,
    },
  },
  {
    name: "MCA & Business Loans",
    slug: "mca-business-loans",
    icon: "🏢",
    description:
      "Merchant cash advance, business loan, and working capital leads for small business funding.",
    tier: 2,
    order: 3,
    benchmarkDefaults: {
      realTimeContactRate: 0.4,
      agedContactRate: 0.2,
      realTimeCloseRate: 0.05,
      agedCloseRate: 0.02,
      avgDealValue: 3000,
    },
  },
  {
    name: "Legal",
    slug: "legal",
    icon: "⚖️",
    description:
      "Personal injury, mass tort, MVA, and other legal intake leads for attorneys.",
    tier: 2,
    order: 4,
    benchmarkDefaults: {
      realTimeContactRate: 0.5,
      agedContactRate: 0.25,
      realTimeCloseRate: 0.03,
      agedCloseRate: 0.01,
      avgDealValue: 5000,
    },
  },

  // ── Tier 3: Niche ─────────────────────────────────────────
  {
    name: "Long-Term Care",
    slug: "long-term-care",
    icon: "🏡",
    description:
      "Long-term care insurance leads from individuals planning for extended care needs.",
    tier: 3,
    order: 1,
    benchmarkDefaults: {
      realTimeContactRate: 0.5,
      agedContactRate: 0.3,
      realTimeCloseRate: 0.05,
      agedCloseRate: 0.02,
      avgDealValue: 2500,
    },
  },
  {
    name: "Auto Warranty",
    slug: "auto-warranty",
    icon: "🔧",
    description:
      "Extended auto warranty and vehicle service contract leads.",
    tier: 3,
    order: 2,
    benchmarkDefaults: {
      realTimeContactRate: 0.45,
      agedContactRate: 0.25,
      realTimeCloseRate: 0.1,
      agedCloseRate: 0.03,
      avgDealValue: 400,
    },
  },
  {
    name: "Home Security",
    slug: "home-security",
    icon: "🔒",
    description:
      "Home security system and monitoring service leads from homeowners.",
    tier: 3,
    order: 3,
    benchmarkDefaults: {
      realTimeContactRate: 0.5,
      agedContactRate: 0.28,
      realTimeCloseRate: 0.12,
      agedCloseRate: 0.04,
      avgDealValue: 500,
    },
  },
  {
    name: "Annuity & IUL",
    slug: "annuity-iul",
    icon: "📈",
    description:
      "Indexed universal life and annuity leads from consumers exploring cash-value investment products.",
    tier: 3,
    order: 4,
    benchmarkDefaults: {
      realTimeContactRate: 0.45,
      agedContactRate: 0.25,
      realTimeCloseRate: 0.05,
      agedCloseRate: 0.02,
      avgDealValue: 3000,
    },
  },
];

/** Lookup a vertical by slug */
export function getVertical(slug: string): VerticalData | undefined {
  return VERTICALS.find((v) => v.slug === slug);
}

/** Get verticals filtered by tier */
export function getVerticalsByTier(tier: 1 | 2 | 3): VerticalData[] {
  return VERTICALS.filter((v) => v.tier === tier);
}
