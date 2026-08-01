import type { Metadata } from "next";
import Link from "next/link";
import { StatCard } from "@/components/stat-card";
import { CopyableStatCard } from "@/components/copyable-stat-card";
import { ShareableQuote } from "@/components/shareable-quote";
import { CiteThisButton } from "@/components/cite-this-button";
import { ExpandableDeepDive } from "@/components/expandable-deep-dive";
import { JsonLd, breadcrumbJsonLd } from "@/components/json-ld";
import {
  getMarketOverviewStats,
  getPricingDistributionStats,
  getProviderLandscapeStats,
  getLeadEconomicsStats,
  getAgingCurveStats,
} from "@/lib/statistics";
import { AGE_BRACKET_LABELS } from "@/data/price-benchmarks";
import { billRicePersonRef } from "@/lib/identity";

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://agedleadsales.com";
const lastUpdated = "2026-04-08";
const pageUrl = `${baseUrl}/blog/aged-lead-industry-statistics`;

export const metadata: Metadata = {
  title: "Aged Lead Industry Statistics [2026]",
  description:
    "Aged lead pricing benchmarks across 14 verticals, plus contact rates, close rates and ROI data from 18+ providers. Updated quarterly.",
  alternates: { canonical: pageUrl },
  openGraph: {
    title: "Aged Lead Industry Statistics [2026]",
    description:
      "Pricing benchmarks, contact rates, and market data across 14 verticals and 18+ providers. The most comprehensive aged lead data on the web.",
    url: pageUrl,
  },
};

export default function StatisticsPage() {
  const market = getMarketOverviewStats();
  const pricing = getPricingDistributionStats();
  const providers = getProviderLandscapeStats();
  const economics = getLeadEconomicsStats();
  const aging = getAgingCurveStats();
  const heroCurve = aging.curves[0];

  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", url: baseUrl },
          { name: "Blog", url: `${baseUrl}/blog` },
          { name: "Aged Lead Industry Statistics", url: pageUrl },
        ])}
      />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Dataset",
          name: "Aged Lead Industry Pricing & Performance Benchmarks",
          description:
            "Quarterly benchmarks for aged lead pricing, the price-decay curve by lead age, contact rates, and provider ratings across 14 verticals.",
          url: pageUrl,
          dateModified: lastUpdated,
          variableMeasured: [
            "Median lead price by vertical",
            "Price decay by lead age bracket",
            "Real-time vs aged contact rate",
            "Real-time vs aged close rate",
            "Provider pricing transparency",
          ],
          // Canonical person, not a site-local anonymous Person.
          creator: billRicePersonRef,
          license: "https://creativecommons.org/licenses/by/4.0/",
        }}
      />

      <article className="bg-white py-16 dark:bg-zinc-950">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          {/* Hero */}
          <header className="mb-12">
            <p className="mb-3 text-sm font-medium text-blue-600 dark:text-blue-400">
              Updated quarterly &middot; Last updated{" "}
              {new Date(lastUpdated).toLocaleDateString("en-US", {
                month: "long",
                day: "numeric",
                year: "numeric",
              })}
            </p>
            <h1 className="text-3xl font-bold text-zinc-900 dark:text-white sm:text-4xl lg:text-5xl">
              Aged Lead Industry Statistics [2026]
            </h1>
            <p className="mt-4 max-w-2xl text-lg text-zinc-600 dark:text-zinc-400">
              Pricing benchmarks, contact rates, close rates, and provider
              landscape data across {market.verticalCount} verticals and{" "}
              {market.providerCount}+ rated providers. Sourced from our{" "}
              <Link
                href="/methodology"
                className="text-blue-600 hover:text-blue-700 dark:text-blue-400"
              >
                published methodology
              </Link>
              .
            </p>
          </header>

          {/* Key Stats Row — copyable with attribution */}
          <section className="mb-16 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <CopyableStatCard
              value={`${market.providerCount}+`}
              label="Providers independently rated"
              source="Work Aged Leads Provider Directory"
              sourceUrl={`${baseUrl}/providers`}
            />
            <CopyableStatCard
              value={`${market.verticalCount}`}
              label="Verticals with pricing benchmarks"
              source="Work Aged Leads Price Index"
              sourceUrl={`${baseUrl}/price-index`}
            />
            <CopyableStatCard
              value={`$${market.minDealValue}-$${market.maxDealValue.toLocaleString()}`}
              label="Deal value range across verticals"
              source="Work Aged Leads"
              sourceUrl={pageUrl}
            />
            <CopyableStatCard
              value={`${market.benchmarkDataPoints}+`}
              label="Verified price data points tracked"
              source="Work Aged Leads Price Index"
              sourceUrl={`${baseUrl}/price-index`}
            />
          </section>

          {/* Pricing by Vertical */}
          <section className="mb-16">
            <h2 className="mb-2 text-2xl font-bold text-zinc-900 dark:text-white">
              Pricing: Real-Time vs. Aged Leads by Vertical
            </h2>
            <p className="mb-6 text-sm text-zinc-600 dark:text-zinc-400">
              Median cost per shared internet lead. Aged leads use the 31-85 day
              bracket.{" "}
              <Link
                href="/price-index"
                className="text-blue-600 hover:text-blue-700 dark:text-blue-400"
              >
                See full price index &rarr;
              </Link>
            </p>

            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-zinc-200 dark:border-zinc-800">
                    <th className="py-3 pr-4 text-left font-semibold text-zinc-900 dark:text-white">
                      Vertical
                    </th>
                    <th className="px-4 py-3 text-right font-semibold text-zinc-900 dark:text-white">
                      Real-Time
                    </th>
                    <th className="px-4 py-3 text-right font-semibold text-zinc-900 dark:text-white">
                      Aged (31-85d)
                    </th>
                    <th className="py-3 pl-4 text-right font-semibold text-zinc-900 dark:text-white">
                      Savings
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {pricing.verticalPricing.map((v) => (
                    <tr
                      key={v.slug}
                      className="border-b border-zinc-100 dark:border-zinc-800/50"
                    >
                      <td className="py-3 pr-4 text-zinc-700 dark:text-zinc-300">
                        <Link
                          href={`/price-index/${v.slug}`}
                          className="hover:text-blue-600 dark:hover:text-blue-400"
                        >
                          {v.icon} {v.vertical}
                        </Link>
                      </td>
                      <td className="px-4 py-3 text-right text-zinc-700 dark:text-zinc-300">
                        ${v.realTimeMedian}
                      </td>
                      <td className="px-4 py-3 text-right font-medium text-blue-600 dark:text-blue-400">
                        ${v.agedMedian}
                      </td>
                      <td className="py-3 pl-4 text-right font-medium text-green-600 dark:text-green-400">
                        {v.savingsPercent}% less
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {pricing.avgExclusivityPremium && (
              <p className="mt-4 text-sm text-zinc-500 dark:text-zinc-400">
                <strong className="text-zinc-700 dark:text-zinc-300">
                  Exclusivity premium:
                </strong>{" "}
                Exclusive leads cost an average of{" "}
                {pricing.avgExclusivityPremium}x more than shared leads across
                all verticals.
              </p>
            )}

            <div className="mt-4">
              <CiteThisButton
                citation={`According to Work Aged Leads, aged leads (31-85 days) cost ${pricing.verticalPricing[0]?.savingsPercent || 70}-${pricing.verticalPricing[pricing.verticalPricing.length - 1]?.savingsPercent || 90}% less than real-time leads across ${pricing.verticalPricing.length} verticals. Source: ${pageUrl} (Updated ${lastUpdated})`}
              />
            </div>

            <ShareableQuote
              quote={`Aged leads cost 70-90% less than real-time leads, but require a fundamentally different approach. A 2% conversion rate on $2 leads crushes a 10% rate on $50 leads. The math is overwhelmingly in your favor.`}
              attribution="Bill Rice, Work Aged Leads"
              pageUrl={pageUrl}
            />
          </section>

          {/* Price Decay Curve */}
          {heroCurve && (
            <section className="mb-16">
              <h2 className="mb-2 text-2xl font-bold text-zinc-900 dark:text-white">
                How Aged Lead Prices Decay With Age
              </h2>
              <p className="mb-6 text-sm text-zinc-600 dark:text-zinc-400">
                Median price of a shared internet-form lead as it ages, by
                bracket, shown as a percentage of its real-time value. The{" "}
                {heroCurve.vertical.toLowerCase()} vertical carries the most
                complete curve.
              </p>

              {/* Hero curve — % of real-time value retained at each stage */}
              <div className="rounded-xl border border-zinc-200 bg-zinc-50 p-5 dark:border-zinc-800 dark:bg-zinc-900">
                <p className="mb-4 text-xs font-semibold uppercase tracking-wider text-zinc-400">
                  {heroCurve.icon} {heroCurve.vertical} — price by lead age
                  (shared, internet form)
                </p>
                <div className="space-y-3">
                  {heroCurve.stops.map((s) => (
                    <div key={s.bracket} className="flex items-center gap-3">
                      <span className="w-28 shrink-0 text-sm text-zinc-700 dark:text-zinc-300">
                        {AGE_BRACKET_LABELS[s.bracket] || s.bracket}
                      </span>
                      <div className="h-6 flex-1 overflow-hidden rounded bg-zinc-200 dark:bg-zinc-800">
                        <div
                          className="flex h-full items-center justify-end rounded bg-blue-600 pr-2 dark:bg-blue-500"
                          style={{ width: `${Math.max(s.pctOfRealTime, 4)}%` }}
                        >
                          {s.pctOfRealTime >= 18 && (
                            <span className="text-xs font-medium text-white">
                              {s.pctOfRealTime}%
                            </span>
                          )}
                        </div>
                      </div>
                      <span className="w-16 shrink-0 text-right text-sm font-medium text-zinc-900 dark:text-white">
                        ${s.median}
                      </span>
                    </div>
                  ))}
                </div>
                <p className="mt-4 text-sm text-zinc-500 dark:text-zinc-400">
                  By the {AGE_BRACKET_LABELS[heroCurve.oldestBracket] || heroCurve.oldestBracket}{" "}
                  bracket, a {heroCurve.vertical.toLowerCase()} lead has shed{" "}
                  <strong className="text-zinc-700 dark:text-zinc-300">
                    {heroCurve.maxDecayPercent}%
                  </strong>{" "}
                  of its real-time value (${heroCurve.realTimeMedian} &rarr; $
                  {heroCurve.stops[heroCurve.stops.length - 1].median}).{" "}
                  <Link
                    href="/blog/aged-mortgage-leads-2026-guide"
                    className="text-blue-600 hover:text-blue-700 dark:text-blue-400"
                  >
                    See the full aged mortgage leads guide &rarr;
                  </Link>
                </p>
              </div>

              {/* Decay summary across every vertical with a full curve */}
              {aging.curves.length > 1 && (
                <div className="mt-6 overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-zinc-200 dark:border-zinc-800">
                        <th className="py-3 pr-4 text-left font-semibold text-zinc-900 dark:text-white">
                          Vertical
                        </th>
                        <th className="px-4 py-3 text-right font-semibold text-zinc-900 dark:text-white">
                          Real-Time
                        </th>
                        <th className="px-4 py-3 text-right font-semibold text-zinc-900 dark:text-white">
                          Oldest Tracked
                        </th>
                        <th className="py-3 pl-4 text-right font-semibold text-zinc-900 dark:text-white">
                          Value Lost
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {aging.curves.map((c) => (
                        <tr
                          key={c.slug}
                          className="border-b border-zinc-100 dark:border-zinc-800/50"
                        >
                          <td className="py-3 pr-4 text-zinc-700 dark:text-zinc-300">
                            <Link
                              href={`/price-index/${c.slug}`}
                              className="hover:text-blue-600 dark:hover:text-blue-400"
                            >
                              {c.icon} {c.vertical}
                            </Link>
                          </td>
                          <td className="px-4 py-3 text-right text-zinc-700 dark:text-zinc-300">
                            ${c.realTimeMedian}
                          </td>
                          <td className="px-4 py-3 text-right text-zinc-700 dark:text-zinc-300">
                            ${c.stops[c.stops.length - 1].median}{" "}
                            <span className="text-zinc-400">
                              ({AGE_BRACKET_LABELS[c.oldestBracket] || c.oldestBracket})
                            </span>
                          </td>
                          <td className="py-3 pl-4 text-right font-medium text-green-600 dark:text-green-400">
                            {c.maxDecayPercent}%
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              <div className="mt-4">
                <CiteThisButton
                  citation={`According to Work Aged Leads, a shared ${heroCurve.vertical.toLowerCase()} internet lead falls from $${heroCurve.realTimeMedian} real-time to $${heroCurve.stops[heroCurve.stops.length - 1].median} by the ${(AGE_BRACKET_LABELS[heroCurve.oldestBracket] || heroCurve.oldestBracket).toLowerCase()} bracket — a ${heroCurve.maxDecayPercent}% loss of value as the lead ages. Source: ${pageUrl} (Updated ${lastUpdated})`}
                />
              </div>
            </section>
          )}

          {/* Provider Landscape */}
          <section className="mb-16">
            <h2 className="mb-2 text-2xl font-bold text-zinc-900 dark:text-white">
              Provider Landscape
            </h2>
            <p className="mb-6 text-sm text-zinc-600 dark:text-zinc-400">
              How {market.providerCount} rated providers compare on
              transparency, accreditation, and business practices. See our
              in-depth{" "}
              <Link
                href="/blog/aged-lead-store-review-2026"
                className="text-blue-600 hover:text-blue-700 dark:text-blue-400"
              >
                Aged Lead Store review
              </Link>{" "}
              for the largest marketplace in the category.
            </p>

            <div className="grid gap-4 sm:grid-cols-3">
              <div className="rounded-xl border border-zinc-200 bg-zinc-50 p-5 dark:border-zinc-800 dark:bg-zinc-900">
                <p className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
                  Pricing Transparency
                </p>
                <div className="mt-3 space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-zinc-700 dark:text-zinc-300">
                      Fully transparent
                    </span>
                    <span className="font-semibold text-green-600">
                      {providers.transparencyBreakdown.transparent}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-zinc-700 dark:text-zinc-300">
                      Semi-transparent
                    </span>
                    <span className="font-semibold text-yellow-600">
                      {providers.transparencyBreakdown.semiTransparent}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-zinc-700 dark:text-zinc-300">
                      Sales required
                    </span>
                    <span className="font-semibold text-red-600">
                      {providers.transparencyBreakdown.salesRequired}
                    </span>
                  </div>
                </div>
              </div>

              <div className="rounded-xl border border-zinc-200 bg-zinc-50 p-5 dark:border-zinc-800 dark:bg-zinc-900">
                <p className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
                  BBB Ratings
                </p>
                <div className="mt-3 space-y-2">
                  {Object.entries(providers.bbbBreakdown)
                    .sort(([a], [b]) => a.localeCompare(b))
                    .map(([grade, count]) => (
                      <div
                        key={grade}
                        className="flex items-center justify-between text-sm"
                      >
                        <span className="text-zinc-700 dark:text-zinc-300">
                          {grade}
                        </span>
                        <span className="font-semibold text-zinc-900 dark:text-white">
                          {count}
                        </span>
                      </div>
                    ))}
                </div>
              </div>

              <div className="rounded-xl border border-zinc-200 bg-zinc-50 p-5 dark:border-zinc-800 dark:bg-zinc-900">
                <p className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
                  Business Practices
                </p>
                <div className="mt-3 space-y-2 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-zinc-700 dark:text-zinc-300">
                      Avg. overall rating
                    </span>
                    <span className="font-semibold text-zinc-900 dark:text-white">
                      {providers.avgOverallRating}/10
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-zinc-700 dark:text-zinc-300">
                      Require minimums
                    </span>
                    <span className="font-semibold text-zinc-900 dark:text-white">
                      {providers.withMinimums}/{market.providerCount}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-zinc-700 dark:text-zinc-300">
                      Require contracts
                    </span>
                    <span className="font-semibold text-zinc-900 dark:text-white">
                      {providers.withContracts}/{market.providerCount}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-4">
              <CiteThisButton
                citation={`Of ${market.providerCount} aged lead providers reviewed by Work Aged Leads, only ${providers.transparencyBreakdown.transparent} (${Math.round((providers.transparencyBreakdown.transparent / market.providerCount) * 100)}%) offer fully transparent pricing. Source: ${pageUrl} (Updated ${lastUpdated})`}
              />
            </div>
          </section>

          {/* Lead Economics */}
          <section className="mb-16">
            <h2 className="mb-2 text-2xl font-bold text-zinc-900 dark:text-white">
              Lead Economics by Vertical
            </h2>
            <p className="mb-6 text-sm text-zinc-600 dark:text-zinc-400">
              Contact rates, close rates, and average deal values. Aged lead
              rates represent the 31-85 day bracket.
            </p>

            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-zinc-200 dark:border-zinc-800">
                    <th className="py-3 pr-4 text-left font-semibold text-zinc-900 dark:text-white">
                      Vertical
                    </th>
                    <th className="px-3 py-3 text-right font-semibold text-zinc-900 dark:text-white">
                      Contact (RT)
                    </th>
                    <th className="px-3 py-3 text-right font-semibold text-zinc-900 dark:text-white">
                      Contact (Aged)
                    </th>
                    <th className="px-3 py-3 text-right font-semibold text-zinc-900 dark:text-white">
                      Close (RT)
                    </th>
                    <th className="px-3 py-3 text-right font-semibold text-zinc-900 dark:text-white">
                      Close (Aged)
                    </th>
                    <th className="py-3 pl-3 text-right font-semibold text-zinc-900 dark:text-white">
                      Avg Deal
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {economics.verticalEconomics
                    .sort((a, b) => a.tier - b.tier)
                    .map((v) => (
                      <tr
                        key={v.name}
                        className="border-b border-zinc-100 dark:border-zinc-800/50"
                      >
                        <td className="py-3 pr-4 text-zinc-700 dark:text-zinc-300">
                          {v.icon} {v.name}
                        </td>
                        <td className="px-3 py-3 text-right text-zinc-500">
                          {v.realTimeContactRate}%
                        </td>
                        <td className="px-3 py-3 text-right font-medium text-blue-600 dark:text-blue-400">
                          {v.agedContactRate}%
                        </td>
                        <td className="px-3 py-3 text-right text-zinc-500">
                          {v.realTimeCloseRate}%
                        </td>
                        <td className="px-3 py-3 text-right font-medium text-blue-600 dark:text-blue-400">
                          {v.agedCloseRate}%
                        </td>
                        <td className="py-3 pl-3 text-right text-zinc-700 dark:text-zinc-300">
                          ${v.avgDealValue.toLocaleString()}
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>

            <div className="mt-4 flex flex-wrap gap-4 text-sm text-zinc-500">
              <span>
                Avg. aged contact rate:{" "}
                <strong className="text-zinc-900 dark:text-white">
                  {economics.avgAgedContactRate}%
                </strong>
              </span>
              <span>
                Avg. aged close rate:{" "}
                <strong className="text-zinc-900 dark:text-white">
                  {economics.avgAgedCloseRate}%
                </strong>
              </span>
            </div>

            <div className="mt-4">
              <CiteThisButton
                citation={`The average contact rate on aged leads (31-85 days) is ${economics.avgAgedContactRate}% across ${market.verticalCount} verticals, with an average close rate of ${economics.avgAgedCloseRate}%. Source: Work Aged Leads, ${pageUrl} (Updated ${lastUpdated})`}
              />
            </div>

            <ShareableQuote
              quote={`The salespeople who win with aged leads are the ones who treat lead conversion as a system, not a lottery. Different scripts, different cadences, different expectations, different economics.`}
              attribution="Bill Rice, Work Aged Leads"
              pageUrl={pageUrl}
            />
          </section>

          {/* Methodology */}
          <section className="mb-16">
            <h2 className="mb-4 text-2xl font-bold text-zinc-900 dark:text-white">
              Methodology & Data Sources
            </h2>

            <ExpandableDeepDive title="How we collect and verify this data">
              <div className="space-y-3">
                <p>
                  All provider ratings use our{" "}
                  <Link
                    href="/methodology"
                    className="text-blue-600 hover:text-blue-700 dark:text-blue-400"
                  >
                    published 6-dimension methodology
                  </Link>
                  , scoring each provider on Transparency, Value, Compliance,
                  Flexibility, Platform, and Reputation with weighted scoring
                  (20/20/20/15/15/10).
                </p>
                <p>
                  Price benchmarks are sourced from published provider pricing,
                  direct quote requests, and market analysis. Each data point
                  includes a confidence rating (high, medium, or low) and the
                  number of providers sampled.
                </p>
                <p>
                  Contact and close rates represent industry benchmarks from
                  published case studies, provider-reported data, and our
                  independent analysis. All figures are verified quarterly.
                </p>
                <p>
                  <strong>Update cadence:</strong> This page and our price
                  benchmarks are verified quarterly. Provider ratings are
                  re-verified every 90 days.
                </p>
              </div>
            </ExpandableDeepDive>
          </section>

          {/* Cite This Section */}
          <section className="rounded-xl border border-zinc-200 bg-zinc-50 p-6 dark:border-zinc-800 dark:bg-zinc-900">
            <h2 className="mb-4 text-lg font-bold text-zinc-900 dark:text-white">
              Cite This Page
            </h2>
            <p className="mb-4 text-sm text-zinc-600 dark:text-zinc-400">
              You are welcome to reference these statistics with attribution.
              Use one of the pre-formatted citations below.
            </p>

            <div className="space-y-4">
              <div className="rounded-lg border border-zinc-200 bg-white p-4 dark:border-zinc-700 dark:bg-zinc-800">
                <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-zinc-400">
                  Inline Citation
                </p>
                <p className="text-sm text-zinc-700 dark:text-zinc-300">
                  According to{" "}
                  <em>Work Aged Leads&apos; 2026 Industry Statistics</em>,
                  aged leads cost 70-90% less than real-time leads across 14
                  verticals.
                </p>
                <div className="mt-2">
                  <CiteThisButton
                    citation={`According to Work Aged Leads' 2026 Industry Statistics, aged leads cost 70-90% less than real-time leads across 14 verticals. (Source: ${pageUrl})`}
                  />
                </div>
              </div>

              <div className="rounded-lg border border-zinc-200 bg-white p-4 dark:border-zinc-700 dark:bg-zinc-800">
                <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-zinc-400">
                  HTML Attribution
                </p>
                <code className="block text-xs text-zinc-600 dark:text-zinc-400">
                  {`<a href="${pageUrl}">Aged Lead Industry Statistics 2026</a> — Work Aged Leads`}
                </code>
                <div className="mt-2">
                  <CiteThisButton
                    citation={`<a href="${pageUrl}">Aged Lead Industry Statistics 2026</a> — Work Aged Leads`}
                  />
                </div>
              </div>
            </div>
          </section>

          {/* Editorial footer */}
          <div className="mt-10 border-t border-zinc-200 pt-6 dark:border-zinc-800">
            <p className="text-sm text-zinc-500">
              Data compiled by{" "}
              <Link
                href="/about"
                className="text-blue-600 hover:text-blue-700 dark:text-blue-400"
              >
                Bill Rice
              </Link>{" "}
              using our{" "}
              <Link
                href="/methodology"
                className="text-blue-600 hover:text-blue-700 dark:text-blue-400"
              >
                published methodology
              </Link>
              . Last verified {lastUpdated}. Found an error?{" "}
              <Link
                href="/contact"
                className="text-blue-600 hover:text-blue-700 dark:text-blue-400"
              >
                Let us know
              </Link>
              .
            </p>
          </div>
        </div>
      </article>
    </>
  );
}
