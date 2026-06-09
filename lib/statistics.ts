import { PROVIDERS } from "@/data/providers";
import { VERTICALS } from "@/data/verticals";
import { PRICE_BENCHMARKS } from "@/data/price-benchmarks";

export function getMarketOverviewStats() {
  const providerCount = PROVIDERS.length;
  const verticalCount = VERTICALS.length;
  const dealValues = VERTICALS.map((v) => v.benchmarkDefaults.avgDealValue);
  const minDealValue = Math.min(...dealValues);
  const maxDealValue = Math.max(...dealValues);
  const foundedYears = PROVIDERS.map((p) => p.foundedYear);
  const oldestProvider = Math.min(...foundedYears);
  const newestProvider = Math.max(...foundedYears);
  const featuredCount = PROVIDERS.filter((p) => p.isFeatured).length;

  return {
    providerCount,
    verticalCount,
    minDealValue,
    maxDealValue,
    oldestProvider,
    newestProvider,
    featuredCount,
    benchmarkDataPoints: PRICE_BENCHMARKS.length,
  };
}

export function getPricingDistributionStats() {
  // Real-time vs aged price comparison
  const realTimeBenchmarks = PRICE_BENCHMARKS.filter(
    (b) => b.leadAgeBracket === "real-time" && b.exclusivity === "shared"
  );
  const agedBenchmarks = PRICE_BENCHMARKS.filter(
    (b) => b.leadAgeBracket === "31-85-days" && b.exclusivity === "shared"
  );

  const verticalPricing = VERTICALS.map((v) => {
    const rt = realTimeBenchmarks.find((b) => b.vertical === v.slug);
    const aged = agedBenchmarks.find((b) => b.vertical === v.slug);
    const savings = rt && aged ? Math.round((1 - aged.priceMedian / rt.priceMedian) * 100) : null;

    return {
      vertical: v.name,
      slug: v.slug,
      icon: v.icon,
      tier: v.tier,
      realTimeMedian: rt?.priceMedian || null,
      agedMedian: aged?.priceMedian || null,
      savingsPercent: savings,
    };
  }).filter((v) => v.realTimeMedian && v.agedMedian);

  // Exclusivity premium
  const sharedBenchmarks = PRICE_BENCHMARKS.filter(
    (b) => b.exclusivity === "shared" && b.leadAgeBracket === "real-time"
  );
  const exclusiveBenchmarks = PRICE_BENCHMARKS.filter(
    (b) => b.exclusivity === "exclusive" && b.leadAgeBracket === "real-time"
  );

  const premiums: number[] = [];
  for (const shared of sharedBenchmarks) {
    const exclusive = exclusiveBenchmarks.find((e) => e.vertical === shared.vertical);
    if (exclusive) {
      premiums.push(exclusive.priceMedian / shared.priceMedian);
    }
  }
  const avgExclusivityPremium = premiums.length
    ? Math.round((premiums.reduce((a, b) => a + b, 0) / premiums.length) * 10) / 10
    : null;

  return { verticalPricing, avgExclusivityPremium };
}

export function getProviderLandscapeStats() {
  const transparencyBreakdown = {
    transparent: PROVIDERS.filter((p) => p.pricingModel === "transparent").length,
    semiTransparent: PROVIDERS.filter((p) => p.pricingModel === "semi-transparent").length,
    salesRequired: PROVIDERS.filter((p) => p.pricingModel === "sales-required").length,
  };

  const bbbBreakdown: Record<string, number> = {};
  for (const p of PROVIDERS) {
    bbbBreakdown[p.bbbRating] = (bbbBreakdown[p.bbbRating] || 0) + 1;
  }

  const avgOverallRating =
    Math.round(
      (PROVIDERS.reduce((sum, p) => sum + p.overallRating, 0) / PROVIDERS.length) * 10
    ) / 10;

  const withMinimums = PROVIDERS.filter((p) => p.hasMinimums).length;
  const withContracts = PROVIDERS.filter((p) => p.contractRequired).length;

  // Lead type distribution
  const leadTypeCounts: Record<string, number> = {};
  for (const p of PROVIDERS) {
    for (const lt of p.leadTypes) {
      leadTypeCounts[lt] = (leadTypeCounts[lt] || 0) + 1;
    }
  }

  return {
    transparencyBreakdown,
    bbbBreakdown,
    avgOverallRating,
    withMinimums,
    withContracts,
    leadTypeCounts,
  };
}

export function getLeadEconomicsStats() {
  const verticalEconomics = VERTICALS.map((v) => {
    const b = v.benchmarkDefaults;
    return {
      name: v.name,
      icon: v.icon,
      tier: v.tier,
      realTimeContactRate: Math.round(b.realTimeContactRate * 100),
      agedContactRate: Math.round(b.agedContactRate * 100),
      realTimeCloseRate: Math.round(b.realTimeCloseRate * 100),
      agedCloseRate: Math.round(b.agedCloseRate * 100),
      avgDealValue: b.avgDealValue,
    };
  });

  // Aggregate averages
  const avgAgedContactRate = Math.round(
    (VERTICALS.reduce((s, v) => s + v.benchmarkDefaults.agedContactRate, 0) /
      VERTICALS.length) *
      100
  );
  const avgAgedCloseRate = Math.round(
    (VERTICALS.reduce((s, v) => s + v.benchmarkDefaults.agedCloseRate, 0) /
      VERTICALS.length) *
      1000
  ) / 10;

  return { verticalEconomics, avgAgedContactRate, avgAgedCloseRate };
}
