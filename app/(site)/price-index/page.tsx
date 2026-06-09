import type { Metadata } from "next";
import Link from "next/link";
import { CtaBanner } from "@/components/cta-banner";
import { CiteThisButton } from "@/components/cite-this-button";
import { JsonLd, breadcrumbJsonLd } from "@/components/json-ld";
import { VERTICALS } from "@/data/verticals";
import {
  PRICE_BENCHMARKS,
  formatPriceRange,
  isTrustworthyBenchmark,
  type PriceBenchmarkData,
} from "@/data/price-benchmarks";
import { sanityFetch } from "@/sanity/lib/fetch";
import {
  recentStaticShapedBenchmarksQuery,
  postsByCategorySlugsQuery,
} from "@/sanity/lib/queries";
import { PostCard } from "@/components/post-card";

// Pricing & buying-economics cluster: posts that argue/explain numbers.
const PRICE_INDEX_CLUSTER_CATEGORIES = ["roi-analytics"];

interface ClusterPost {
  _id: string;
  title: string;
  slug: { current: string };
  excerpt?: string;
  mainImage?: { asset?: { _ref: string }; alt?: string };
  publishedAt?: string;
}

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

function getVerticalSummary(
  verticalSlug: string,
  benchmarkSource: PriceBenchmarkData[]
) {
  // Only surface trustworthy benchmarks (≥2 providers sampled). benchmarkSource
  // is ordered newest-month-first, so the first match per series is the latest
  // reliable data point — never a sparse single-provider cron estimate.
  const benchmarks = benchmarkSource.filter(
    (b) => b.vertical === verticalSlug && isTrustworthyBenchmark(b)
  );
  if (benchmarks.length === 0) return null;

  // Latest reliable aged benchmark (31-85 days, shared, internet-form)
  const aged = benchmarks.find(
    (b) =>
      b.leadAgeBracket === "31-85-days" &&
      b.exclusivity === "shared" &&
      b.leadType === "internet-form"
  );

  // Latest reliable real-time shared
  const realTime = benchmarks.find(
    (b) =>
      b.leadAgeBracket === "real-time" &&
      b.exclusivity === "shared" &&
      b.leadType === "internet-form"
  );

  return { aged, realTime, totalBenchmarks: benchmarks.length };
}

export default async function PriceIndexPage() {
  // Prefer Sanity (kept fresh by the marketwatch cron) and fall back to the
  // static seed when Sanity is empty or unreachable. We pull every tracked
  // month (newest first) so each card can show its latest *reliable* price,
  // not just whatever the most recent cron run happened to write.
  const [sanityBenchmarks, clusterPostsRaw] = await Promise.all([
    sanityFetch(recentStaticShapedBenchmarksQuery) as Promise<
      PriceBenchmarkData[] | null
    >,
    sanityFetch(postsByCategorySlugsQuery, {
      slugs: PRICE_INDEX_CLUSTER_CATEGORIES,
    }) as Promise<ClusterPost[] | null>,
  ]);
  const clusterPosts: ClusterPost[] = clusterPostsRaw || [];
  const benchmarks: PriceBenchmarkData[] =
    sanityBenchmarks && sanityBenchmarks.length > 0
      ? sanityBenchmarks
      : PRICE_BENCHMARKS;

  // Freshness reflects the latest *reliable* month, so we don't advertise a
  // single-provider cron run as the current state of the market.
  const latestMonth =
    benchmarks.find((b) => isTrustworthyBenchmark(b))?.month ||
    benchmarks[0]?.month ||
    "2026-03";
  const monthLabel = new Date(latestMonth + "-01").toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });

  // Build vertical cards with summary data
  const verticalCards = VERTICALS.filter((v) => v.tier <= 2).map((v) => ({
    ...v,
    summary: getVerticalSummary(v.slug, benchmarks),
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
      <section className="relative overflow-hidden bg-gradient-to-br from-zinc-900 via-zinc-900 to-blue-950">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-600/10 via-transparent to-transparent" />
        <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
          <div className="flex items-center gap-3">
            <span className="inline-block rounded-full bg-blue-500/20 px-3 py-1 text-xs font-semibold text-blue-300">
              Lead Marketwatch
            </span>
            <span className="text-xs text-zinc-400">
              Updated {monthLabel}
            </span>
          </div>
          <h1 className="mt-4 text-4xl font-bold tracking-tight text-white sm:text-5xl">
            Lead Price Index
          </h1>
          <p className="mt-4 max-w-2xl text-lg leading-relaxed text-zinc-300">
            What should you pay for leads? Our monthly benchmarks track fair
            market pricing across 15 verticals and every lead type — aged,
            real-time, live transfers, and more.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/calculators/know-your-cpl"
              className="inline-flex items-center rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-blue-600/25 transition-colors hover:bg-blue-700"
            >
              Calculate Your CPL &rarr;
            </Link>
            <Link
              href="/providers"
              className="inline-flex items-center rounded-lg bg-white/10 px-4 py-2.5 text-sm font-medium text-white backdrop-blur-sm transition-colors hover:bg-white/20"
            >
              Compare Providers &rarr;
            </Link>
          </div>
        </div>
      </section>

      {/* Vertical Cards */}
      <section className="bg-white py-16 dark:bg-zinc-950">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-zinc-900 dark:text-white">
              Pricing by Vertical
            </h2>
            <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
              Click any vertical to see full pricing breakdowns by age, exclusivity, and lead type.
            </p>
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
            Our team researches the aged-lead provider market monthly,
            aggregating published pricing, requesting quotes, and analyzing
            market trends.
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

      <section className="border-t border-zinc-200 bg-white py-8 dark:border-zinc-800 dark:bg-zinc-950">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-center gap-3">
            <span className="text-sm text-zinc-500">Reference this data:</span>
            <CiteThisButton
              citation={`Lead pricing benchmarks from the Aged Lead Sales Lead Price Index, covering ${VERTICALS.length} verticals with monthly updates. Source: ${baseUrl}/price-index`}
            />
          </div>
        </div>
      </section>

      {clusterPosts.length > 0 && (
        <section className="border-t border-zinc-200 bg-zinc-50 py-16 dark:border-zinc-800 dark:bg-zinc-950/50">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl">
              <h2 className="text-2xl font-bold text-zinc-900 dark:text-white">
                Pricing &amp; ROI deep-dives
              </h2>
              <p className="mt-2 text-zinc-600 dark:text-zinc-400">
                What the numbers mean for your buying strategy — conversion
                math, lead-age tradeoffs, and where the margin actually lives.
              </p>
            </div>
            <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {clusterPosts.slice(0, 6).map((p) => (
                <PostCard
                  key={p._id}
                  title={p.title}
                  slug={p.slug.current}
                  excerpt={p.excerpt || ""}
                  mainImage={p.mainImage}
                  publishedAt={p.publishedAt}
                />
              ))}
            </div>
            <div className="mt-8">
              <Link
                href="/blog/category/roi-analytics"
                className="text-sm font-semibold text-blue-600 hover:text-blue-700 dark:text-blue-400"
              >
                More ROI &amp; analytics articles &rarr;
              </Link>
            </div>
          </div>
        </section>
      )}

      <CtaBanner />
    </>
  );
}
