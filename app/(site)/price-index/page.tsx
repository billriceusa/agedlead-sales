import type { Metadata } from "next";
import Link from "next/link";
import { CtaBanner } from "@/components/cta-banner";
import { JsonLd, breadcrumbJsonLd } from "@/components/json-ld";
import { VERTICALS } from "@/data/verticals";
import {
  PRICE_BENCHMARKS,
  formatPrice,
  formatPriceRange,
  getBenchmarksByVertical,
} from "@/data/price-benchmarks";

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://agedleadsales.com";

export const metadata: Metadata = {
  title: "Lead Price Index — What Should You Pay for Leads?",
  description:
    "Monthly pricing benchmarks for aged leads, real-time leads, and live transfers across 15 verticals. Fair market values updated monthly.",
  alternates: { canonical: `${baseUrl}/price-index` },
  openGraph: {
    title: "Lead Price Index | Aged Lead Sales",
    description:
      "The first independent lead pricing index. Fair market values for aged and real-time leads across mortgage, insurance, solar, and more.",
    url: `${baseUrl}/price-index`,
    images: [
      {
        url: `${baseUrl}/api/og?title=${encodeURIComponent("Lead Price Index")}&category=Lead Marketwatch&type=tool`,
      },
    ],
  },
};

function getVerticalSummary(verticalSlug: string) {
  const benchmarks = getBenchmarksByVertical(verticalSlug);
  if (benchmarks.length === 0) return null;

  // Find the most common aged benchmark (31-85 days, shared, internet-form)
  const aged = benchmarks.find(
    (b) =>
      b.leadAgeBracket === "31-85-days" &&
      b.exclusivity === "shared" &&
      b.leadType === "internet-form"
  );

  // Find real-time shared
  const realTime = benchmarks.find(
    (b) =>
      b.leadAgeBracket === "real-time" &&
      b.exclusivity === "shared" &&
      b.leadType === "internet-form"
  );

  return { aged, realTime, totalBenchmarks: benchmarks.length };
}

export default function PriceIndexPage() {
  const latestMonth = PRICE_BENCHMARKS[0]?.month || "2026-03";
  const monthLabel = new Date(latestMonth + "-01").toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });

  // Build vertical cards with summary data
  const verticalCards = VERTICALS.filter((v) => v.tier <= 2).map((v) => ({
    ...v,
    summary: getVerticalSummary(v.slug),
  }));

  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", url: baseUrl },
          { name: "Price Index", url: `${baseUrl}/price-index` },
        ])}
      />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Dataset",
          name: "Lead Price Index",
          description:
            "Monthly pricing benchmarks for aged leads and real-time leads across 15 verticals.",
          url: `${baseUrl}/price-index`,
          temporalCoverage: latestMonth,
          creator: {
            "@type": "Organization",
            name: "Aged Lead Sales",
            url: baseUrl,
          },
        }}
      />

      {/* Hero */}
      <section className="bg-white py-16 dark:bg-zinc-950">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-12">
            <div className="mb-4 flex items-center gap-2">
              <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700 dark:bg-blue-900/50 dark:text-blue-300">
                Lead Marketwatch
              </span>
              <span className="text-xs text-zinc-500 dark:text-zinc-400">
                Updated {monthLabel}
              </span>
            </div>
            <h1 className="text-4xl font-bold text-zinc-900 dark:text-white">
              Lead Price Index
            </h1>
            <p className="mt-4 max-w-3xl text-lg text-zinc-600 dark:text-zinc-400">
              What should you pay for leads? Our monthly benchmarks track fair
              market pricing across 15 verticals and every lead type — aged,
              real-time, live transfers, and more.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                href="/calculators/know-your-cpl"
                className="inline-flex items-center rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
              >
                Calculate Your CPL &rarr;
              </Link>
              <Link
                href="/providers"
                className="inline-flex items-center rounded-lg border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800"
              >
                Compare Providers &rarr;
              </Link>
            </div>
          </div>

          {/* Vertical Cards Grid */}
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {verticalCards.map((v) => (
              <Link
                key={v.slug}
                href={`/price-index/${v.slug}`}
                className="group rounded-xl border border-zinc-200 bg-white p-6 transition-all hover:border-blue-300 hover:shadow-lg dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-blue-700"
              >
                <div className="flex items-center justify-between">
                  <span className="text-2xl">{v.icon}</span>
                  {v.summary?.aged && (
                    <span className="rounded-full bg-blue-100 px-2 py-0.5 text-xs font-semibold text-blue-700 dark:bg-blue-900/50 dark:text-blue-300">
                      {v.summary.totalBenchmarks} data points
                    </span>
                  )}
                </div>
                <h3 className="mt-3 text-lg font-semibold text-zinc-900 dark:text-white">
                  {v.name}
                </h3>
                {v.summary?.aged && (
                  <div className="mt-3 space-y-2">
                    <div>
                      <span className="text-xs text-zinc-500 dark:text-zinc-400">
                        Aged (31-85 days, shared)
                      </span>
                      <p className="text-lg font-bold text-zinc-900 dark:text-white">
                        {formatPriceRange(
                          v.summary.aged.priceLow,
                          v.summary.aged.priceHigh
                        )}
                        <span className="ml-1 text-sm font-normal text-zinc-500">
                          /lead
                        </span>
                      </p>
                    </div>
                    {v.summary.realTime && (
                      <div>
                        <span className="text-xs text-zinc-500 dark:text-zinc-400">
                          Real-time (shared)
                        </span>
                        <p className="text-sm text-zinc-600 dark:text-zinc-400">
                          {formatPriceRange(
                            v.summary.realTime.priceLow,
                            v.summary.realTime.priceHigh
                          )}
                          /lead
                        </p>
                      </div>
                    )}
                  </div>
                )}
                {!v.summary && (
                  <p className="mt-3 text-sm text-zinc-400 dark:text-zinc-500">
                    Benchmark data coming soon
                  </p>
                )}
                <span className="mt-4 inline-flex text-sm font-medium text-blue-600 group-hover:text-blue-700 dark:text-blue-400">
                  View full pricing &rarr;
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* How We Collect Data */}
      <section className="border-t border-zinc-200 bg-zinc-50 py-16 dark:border-zinc-800 dark:bg-zinc-900">
        <div className="mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-zinc-900 dark:text-white">
            How We Collect This Data
          </h2>
          <p className="mt-4 text-zinc-600 dark:text-zinc-400">
            Our team researches 50+ lead providers monthly, aggregating
            published pricing, requesting quotes, and analyzing market trends.
            Every data point includes a confidence rating indicating data
            quality. Benchmarks represent fair market ranges, not specific
            provider pricing.
          </p>
          <div className="mt-6 flex items-center justify-center gap-6 text-sm">
            <span className="inline-flex items-center gap-1.5">
              <span className="inline-block h-2 w-2 rounded-full bg-green-500" />
              <span className="text-zinc-600 dark:text-zinc-400">
                High confidence
              </span>
            </span>
            <span className="inline-flex items-center gap-1.5">
              <span className="inline-block h-2 w-2 rounded-full bg-yellow-500" />
              <span className="text-zinc-600 dark:text-zinc-400">
                Medium confidence
              </span>
            </span>
            <span className="inline-flex items-center gap-1.5">
              <span className="inline-block h-2 w-2 rounded-full bg-red-400" />
              <span className="text-zinc-600 dark:text-zinc-400">
                Low confidence
              </span>
            </span>
          </div>
          <Link
            href="/methodology"
            className="mt-6 inline-flex text-sm font-semibold text-blue-600 hover:text-blue-700 dark:text-blue-400"
          >
            Read our full methodology &rarr;
          </Link>
        </div>
      </section>

      <CtaBanner />
    </>
  );
}
