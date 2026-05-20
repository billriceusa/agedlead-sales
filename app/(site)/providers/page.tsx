import type { Metadata } from "next";
import { sanityFetch } from "@/sanity/lib/fetch";
import { providersLastVerifiedQuery } from "@/sanity/lib/queries";
import { ProviderCard } from "@/components/provider-card";
import { CtaBanner } from "@/components/cta-banner";
import { JsonLd, breadcrumbJsonLd } from "@/components/json-ld";
import { PROVIDERS } from "@/data/providers";
import { getVertical } from "@/data/verticals";
import Link from "next/link";

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://agedleadsales.com";

export const metadata: Metadata = {
  title: "Lead Provider Directory — Compare & Rate Lead Providers",
  description:
    "Independent ratings and reviews of 15+ lead providers across mortgage, insurance, solar, and more. Transparent methodology. Updated monthly.",
  alternates: { canonical: `${baseUrl}/providers` },
  openGraph: {
    title: "Lead Provider Directory | Aged Lead Sales",
    description:
      "Compare lead providers with our independent ratings. 6-dimension scoring, honest editorial reviews, and transparent methodology.",
    url: `${baseUrl}/providers`,
    images: [
      {
        url: `${baseUrl}/api/og?title=${encodeURIComponent("Lead Provider Directory")}&category=Lead Marketwatch&type=tool`,
      },
    ],
  },
};

export default async function ProvidersPage() {
  // Static data is the source of truth for editorial content (ratings,
  // descriptions, lead types, pricing, featured status). Sanity contributes
  // only the marketwatch-cron-managed lastVerified date per provider. This
  // matches the data model on /providers/[slug] and avoids drift between the
  // listing and the profile pages.
  const sanityMeta = await sanityFetch(providersLastVerifiedQuery);
  const lastVerifiedBySlug = new Map<string, string>();
  if (sanityMeta) {
    for (const m of sanityMeta) {
      if (m.slug && m.lastVerified) {
        lastVerifiedBySlug.set(m.slug, m.lastVerified);
      }
    }
  }

  const providers = PROVIDERS.map((p) => ({
    name: p.name,
    slug: p.slug,
    shortDescription: p.shortDescription,
    overallRating: p.overallRating,
    lastVerified: lastVerifiedBySlug.get(p.slug) ?? p.lastVerified,
    pricingModel: p.pricingModel,
    leadTypes: p.leadTypes,
    isFeatured: p.isFeatured,
    verticals: p.verticals.map((vSlug) => {
      const vd = getVertical(vSlug);
      return vd
        ? { name: vd.name, slug: vd.slug, icon: vd.icon }
        : { name: vSlug, slug: vSlug, icon: undefined };
    }),
  })).sort((a, b) => b.overallRating - a.overallRating);

  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", url: baseUrl },
          { name: "Providers", url: `${baseUrl}/providers` },
        ])}
      />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "ItemList",
          name: "Lead Provider Directory",
          description:
            "Independent ratings and reviews of lead providers across all major verticals.",
          numberOfItems: providers.length,
          itemListElement: providers.map(
            (p: { name: string; slug: string }, i: number) => ({
              "@type": "ListItem",
              position: i + 1,
              name: p.name,
              url: `${baseUrl}/providers/${p.slug}`,
            })
          ),
        }}
      />

      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-zinc-900 via-zinc-900 to-blue-950">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-600/10 via-transparent to-transparent" />
        <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
          <span className="mb-4 inline-block rounded-full bg-blue-500/20 px-3 py-1 text-xs font-semibold text-blue-300">
            Lead Marketwatch
          </span>
          <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl">
            Lead Provider Directory
          </h1>
          <p className="mt-4 max-w-2xl text-lg leading-relaxed text-zinc-300">
            Independent ratings and reviews of lead providers across mortgage,
            insurance, solar, and more. Every provider is scored on 6
            dimensions with a transparent, published methodology. Updated
            monthly.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/price-index"
              className="inline-flex items-center rounded-lg bg-white/10 px-4 py-2.5 text-sm font-medium text-white backdrop-blur-sm transition-colors hover:bg-white/20"
            >
              Lead Price Index &rarr;
            </Link>
            <Link
              href="/methodology"
              className="inline-flex items-center rounded-lg bg-white/10 px-4 py-2.5 text-sm font-medium text-white backdrop-blur-sm transition-colors hover:bg-white/20"
            >
              Our Methodology &rarr;
            </Link>
          </div>
        </div>
      </section>

      {/* Provider Grid */}
      <section className="bg-white py-16 dark:bg-zinc-950">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-zinc-900 dark:text-white">
              All Providers
            </h2>
            <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
              {providers.length} providers rated &middot; Sorted by overall score
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {providers.map(
              (p) => (
                <ProviderCard
                  key={p.slug}
                  name={p.name}
                  slug={p.slug}
                  shortDescription={p.shortDescription}
                  overallRating={p.overallRating}
                  lastVerified={p.lastVerified}
                  pricingModel={p.pricingModel}
                  leadTypes={p.leadTypes}
                  verticals={p.verticals}
                  isFeatured={p.isFeatured}
                />
              )
            )}
          </div>
        </div>
      </section>

      {/* Rating Methodology Summary */}
      <section className="border-t border-zinc-200 bg-zinc-50 py-16 dark:border-zinc-800 dark:bg-zinc-900">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="text-2xl font-bold text-zinc-900 dark:text-white">
              How We Rate Providers
            </h2>
            <p className="mt-4 text-zinc-600 dark:text-zinc-400">
              Every provider is independently evaluated across six weighted
              dimensions. We publish our methodology, date every review, and
              include honest assessments — including what each provider is{" "}
              <em>not</em> ideal for. Affiliate relationships never affect our
              ratings.
            </p>
          </div>
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[
              {
                label: "Pricing Transparency",
                weight: "20%",
                desc: "Published prices, self-service purchasing",
              },
              {
                label: "Value",
                weight: "20%",
                desc: "Price relative to quality and contact rates",
              },
              {
                label: "Data Quality & Compliance",
                weight: "20%",
                desc: "Verified data, DNC scrubbing, TCPA paperwork handoff",
              },
              {
                label: "Flexibility",
                weight: "15%",
                desc: "Minimums, contracts, return policies",
              },
              {
                label: "Platform & Delivery",
                weight: "15%",
                desc: "Self-service portal, API, CRM integration",
              },
              {
                label: "Reputation",
                weight: "10%",
                desc: "Years in business, BBB rating, industry presence",
              },
            ].map((dim) => (
              <div
                key={dim.label}
                className="rounded-lg border border-zinc-200 bg-white p-4 dark:border-zinc-700 dark:bg-zinc-800"
              >
                <div className="flex items-baseline justify-between">
                  <span className="text-sm font-semibold text-zinc-900 dark:text-white">
                    {dim.label}
                  </span>
                  <span className="text-xs font-medium text-blue-600 dark:text-blue-400">
                    {dim.weight}
                  </span>
                </div>
                <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
                  {dim.desc}
                </p>
              </div>
            ))}
          </div>
          <p className="mx-auto mt-6 max-w-3xl text-center text-xs text-zinc-500 dark:text-zinc-400">
            Data Quality &amp; Compliance scores what providers actually deliver
            to buyers: verified contact data, DNC scrubbing, and TCPA paperwork
            handoff. All purchased lead inventory is brokered consumer data —
            fresh consent before outreach is the buyer&apos;s responsibility.
          </p>
          <div className="mt-8 text-center">
            <Link
              href="/methodology"
              className="text-sm font-semibold text-blue-600 hover:text-blue-700 dark:text-blue-400"
            >
              Read our full methodology &rarr;
            </Link>
          </div>
        </div>
      </section>

      <CtaBanner />
    </>
  );
}
