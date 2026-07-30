import type { Metadata } from "next";
import Link from "next/link";
import { CtaBanner } from "@/components/cta-banner";
import { JsonLd, breadcrumbJsonLd } from "@/components/json-ld";
import { PROVIDERS, getProviderPairs } from "@/data/providers";

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://agedleadsales.com";

export const metadata: Metadata = {
  title: "Lead Provider & Lead Type Comparisons",
  description:
    "Side-by-side comparisons of aged lead providers, plus the product decisions that come with them — aged vs real-time, IUL vs term, Medicare Advantage vs Medigap.",
  alternates: { canonical: `${baseUrl}/compare` },
  openGraph: {
    title: "Lead Provider & Lead Type Comparisons",
    description:
      "Head-to-head provider comparisons and the lead-type decisions that matter, with transparent pricing and 6-dimension ratings.",
    url: `${baseUrl}/compare`,
    images: [
      {
        url: `${baseUrl}/api/og?title=${encodeURIComponent("Lead Provider Comparisons")}&category=Comparisons&type=tool`,
      },
    ],
  },
};

/**
 * Hand-written comparison essays (literal /compare/* routes), as opposed to the
 * generated provider-pair pages below. Kept in sync with app/sitemap.ts.
 */
const EDITORIAL = [
  {
    slug: "aged-vs-real-time-leads",
    title: "Aged vs Real-Time Leads",
    description:
      "The core buying decision: what you give up on contact rate, what you get back on price, and the volume math that decides which one wins for your close rate.",
  },
  {
    slug: "iul-vs-term-life",
    title: "IUL vs Term Life",
    description:
      "Two very different sales off the same life insurance lead. Product mechanics, who each one suits, and how the sales cycle differs.",
  },
  {
    slug: "medicare-advantage-vs-supplement",
    title: "Medicare Advantage vs Medigap",
    description:
      "Networks, out-of-pocket exposure, and enrollment windows — the differences that actually change which plan you recommend.",
  },
];

/** Provider pairings involving Aged Lead Store — the only ones indexed. */
function alsPairings() {
  return getProviderPairs()
    .filter(([a, b]) => a === "aged-lead-store" || b === "aged-lead-store")
    .map(([a, b]) => {
      const otherSlug = a === "aged-lead-store" ? b : a;
      const other = PROVIDERS.find((p) => p.slug === otherSlug);
      return { pair: `${a}-vs-${b}`, other };
    })
    .filter((x): x is { pair: string; other: (typeof PROVIDERS)[number] } =>
      Boolean(x.other),
    )
    .sort((x, y) => y.other.overallRating - x.other.overallRating);
}

export default function ComparePage() {
  const pairings = alsPairings();
  const total = EDITORIAL.length + pairings.length;

  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", url: baseUrl },
          { name: "Compare", url: `${baseUrl}/compare` },
        ])}
      />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "ItemList",
          name: "Lead Provider and Lead Type Comparisons",
          description:
            "Side-by-side comparisons of aged lead providers and lead types.",
          numberOfItems: total,
          itemListElement: [
            ...EDITORIAL.map((e, i) => ({
              "@type": "ListItem",
              position: i + 1,
              name: e.title,
              url: `${baseUrl}/compare/${e.slug}`,
            })),
            ...pairings.map((p, i) => ({
              "@type": "ListItem",
              position: EDITORIAL.length + i + 1,
              name: `Aged Lead Store vs ${p.other.name}`,
              url: `${baseUrl}/compare/${p.pair}`,
            })),
          ],
        }}
      />

      <section className="bg-white py-16 dark:bg-zinc-950">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-12">
            <h1 className="text-4xl font-bold text-zinc-900 dark:text-white">
              Comparisons
            </h1>
            <p className="mt-4 max-w-2xl text-lg text-zinc-600 dark:text-zinc-400">
              Two kinds of decision show up over and over when you buy aged
              leads: which provider to buy from, and which product to sell off
              the lead once you have it. These are the head-to-heads for both.
            </p>
          </div>

          <h2 className="text-2xl font-semibold text-zinc-900 dark:text-white">
            Lead type &amp; product decisions
          </h2>
          <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {EDITORIAL.map((item) => (
              <div
                key={item.slug}
                className="flex flex-col rounded-xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900"
              >
                <h3 className="text-lg font-semibold text-zinc-900 dark:text-white">
                  {item.title}
                </h3>
                <p className="mt-2 flex-1 text-sm text-zinc-600 dark:text-zinc-400">
                  {item.description}
                </p>
                <Link
                  href={`/compare/${item.slug}`}
                  className="mt-4 inline-flex items-center text-sm font-semibold text-blue-600 hover:text-blue-700 dark:text-blue-400"
                >
                  Read the comparison &rarr;
                </Link>
              </div>
            ))}
          </div>

          <h2 className="mt-16 text-2xl font-semibold text-zinc-900 dark:text-white">
            Provider head-to-heads
          </h2>
          <p className="mt-3 max-w-2xl text-sm text-zinc-600 dark:text-zinc-400">
            Aged Lead Store is the largest aged lead marketplace, so it is the
            benchmark every other provider gets measured against. Each page
            scores both sides on the same six dimensions — see our{" "}
            <Link
              href="/methodology"
              className="font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400"
            >
              rating methodology
            </Link>
            .
          </p>
          <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {pairings.map(({ pair, other }) => (
              <div
                key={pair}
                className="flex flex-col rounded-xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900"
              >
                <h3 className="text-lg font-semibold text-zinc-900 dark:text-white">
                  Aged Lead Store vs {other.name}
                </h3>
                <p className="mt-2 flex-1 text-sm text-zinc-600 dark:text-zinc-400">
                  {other.shortDescription}
                </p>
                <Link
                  href={`/compare/${pair}`}
                  className="mt-4 inline-flex items-center text-sm font-semibold text-blue-600 hover:text-blue-700 dark:text-blue-400"
                >
                  Compare &rarr;
                </Link>
              </div>
            ))}
          </div>

          <p className="mt-12 text-sm text-zinc-600 dark:text-zinc-400">
            Looking for one provider rather than a pairing? The{" "}
            <Link
              href="/providers"
              className="font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400"
            >
              provider directory
            </Link>{" "}
            rates all {PROVIDERS.length} we cover.
          </p>
        </div>
      </section>

      <CtaBanner />
    </>
  );
}
