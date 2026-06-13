import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ProviderCard } from "@/components/provider-card";
import { CtaBanner } from "@/components/cta-banner";
import { RelatedLinks } from "@/components/related-links";
import { JsonLd, breadcrumbJsonLd } from "@/components/json-ld";
import { VERTICALS, getVertical } from "@/data/verticals";
import { getProvidersByVertical } from "@/data/providers";
import { LEAD_TYPES } from "@/data/lead-types";
import { leadTypeForVertical } from "@/data/lead-type-vertical-map";

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://agedleadsales.com";

export function generateStaticParams() {
  return VERTICALS.map((v) => ({ vertical: v.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ vertical: string }>;
}): Promise<Metadata> {
  const { vertical: verticalSlug } = await params;
  const vertical = getVertical(verticalSlug);
  if (!vertical) return {};

  const title = `Best ${vertical.name} Lead Providers (2026)`;
  // A "best providers" page needs at least 2 reviewed providers to be a real
  // ranking; thinner pages stay crawlable but out of the index until filled.
  const thin = getProvidersByVertical(verticalSlug).length < 2;
  return {
    title,
    description: `Compare the top-rated ${vertical.name.toLowerCase()} lead providers. Independent reviews, transparent ratings, and honest recommendations. Verified quarterly.`,
    robots: thin ? { index: false, follow: true } : undefined,
    alternates: { canonical: `${baseUrl}/providers/best/${verticalSlug}` },
    openGraph: {
      title: `${title} | Aged Lead Sales`,
      description: `Top-rated ${vertical.name.toLowerCase()} lead providers ranked by our 6-dimension scoring methodology.`,
      url: `${baseUrl}/providers/best/${verticalSlug}`,
      images: [
        {
          url: `${baseUrl}/api/og?title=${encodeURIComponent(title)}&category=Lead Marketwatch&type=tool`,
        },
      ],
    },
  };
}

export default async function BestByVerticalPage({
  params,
}: {
  params: Promise<{ vertical: string }>;
}) {
  const { vertical: verticalSlug } = await params;
  const vertical = getVertical(verticalSlug);
  if (!vertical) return notFound();

  const providers = getProvidersByVertical(verticalSlug);

  // Internal-linking cluster: tie this best-providers page to its lead-type
  // guide and price benchmarks for the same vertical.
  const guideSlug = leadTypeForVertical(verticalSlug);
  const guide = guideSlug ? LEAD_TYPES[guideSlug] : undefined;
  const relatedLinks = [
    guide && {
      href: `/lead-types/${guideSlug}`,
      label: `${vertical.name} lead buyer's guide`,
      description: `How aged ${vertical.name.toLowerCase()} leads work, pricing, and how to work them.`,
    },
    {
      href: `/price-index/${verticalSlug}`,
      label: `${vertical.name} price benchmarks`,
      description: `What you should pay for ${vertical.name.toLowerCase()} leads by age and exclusivity.`,
    },
    {
      href: "/blog/aged-lead-industry-statistics",
      label: "Aged lead industry statistics",
      description: "Pricing, contact rates, and provider data across every vertical.",
    },
    {
      href: "/providers",
      label: "Compare all lead providers",
      description: "The full directory with our 6-dimension ratings.",
    },
  ];

  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", url: baseUrl },
          { name: "Providers", url: `${baseUrl}/providers` },
          {
            name: `Best ${vertical.name}`,
            url: `${baseUrl}/providers/best/${verticalSlug}`,
          },
        ])}
      />

      <section className="bg-white py-16 dark:bg-zinc-950">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-12">
            <div className="mb-3 flex items-center gap-2 text-sm text-zinc-500 dark:text-zinc-400">
              <Link
                href="/providers"
                className="hover:text-blue-600 dark:hover:text-blue-400"
              >
                Providers
              </Link>
              <span>/</span>
              <span>Best {vertical.name}</span>
            </div>
            <h1 className="text-4xl font-bold text-zinc-900 dark:text-white">
              {vertical.icon} Best {vertical.name} Lead Providers (2026)
            </h1>
            <p className="mt-4 max-w-3xl text-lg text-zinc-600 dark:text-zinc-400">
              {providers.length > 0
                ? `We independently reviewed ${providers.length} ${vertical.name.toLowerCase()} lead providers. Here are the top-rated options, ranked by our 6-dimension scoring methodology.`
                : `We're currently building our ${vertical.name.toLowerCase()} provider reviews. Check back soon.`}
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                href={`/price-index/${verticalSlug}`}
                className="inline-flex items-center rounded-lg border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800"
              >
                {vertical.name} Pricing Benchmarks &rarr;
              </Link>
              <Link
                href="/calculators/know-your-cpl"
                className="inline-flex items-center rounded-lg border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800"
              >
                Calculate Your CPL &rarr;
              </Link>
            </div>
          </div>

          {providers.length > 0 ? (
            <div className="space-y-6">
              {providers.map((p, idx) => (
                <div key={p.slug} className="flex items-start gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-zinc-100 text-lg font-bold text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300">
                    {idx + 1}
                  </div>
                  <div className="flex-1">
                    <ProviderCard
                      name={p.name}
                      slug={p.slug}
                      shortDescription={p.shortDescription}
                      overallRating={p.overallRating}
                      lastVerified={p.lastVerified}
                      pricingModel={p.pricingModel}
                      leadTypes={p.leadTypes}
                      verticals={p.verticals.map((vSlug) => ({
                        name: vSlug,
                        slug: vSlug,
                      }))}
                    />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="rounded-xl border border-zinc-200 bg-zinc-50 p-12 text-center dark:border-zinc-800 dark:bg-zinc-900">
              <p className="text-zinc-500 dark:text-zinc-400">
                No providers reviewed for this vertical yet. Check back soon.
              </p>
              <Link
                href="/providers"
                className="mt-4 inline-flex items-center text-sm font-semibold text-blue-600 hover:text-blue-700 dark:text-blue-400"
              >
                Browse all providers &rarr;
              </Link>
            </div>
          )}
        </div>
      </section>

      <RelatedLinks
        title={`More on ${vertical.name.toLowerCase()} leads`}
        links={relatedLinks}
      />

      <CtaBanner />
    </>
  );
}
