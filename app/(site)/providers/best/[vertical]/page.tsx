import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ProviderCard } from "@/components/provider-card";
import { CtaBanner } from "@/components/cta-banner";
import { HeroAffiliateDoor } from "@/components/hero-affiliate-door";
import { RelatedLinks } from "@/components/related-links";
import { JsonLd, breadcrumbJsonLd } from "@/components/json-ld";
import { VERTICALS, getVertical } from "@/data/verticals";
import { getProvidersByVertical } from "@/data/providers";
import { LEAD_TYPES } from "@/data/lead-types";
import { leadTypeForVertical } from "@/data/lead-type-vertical-map";
import { storefrontSegment } from "@/lib/store-front";
import { storeCategoryPath } from "@/lib/affiliate";

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
      title: `${title} | Work Aged Leads`,
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

  /*
    AN OUTBOUND DOOR ON THE BEST-OF PAGES (2026-10-05)

    These pages rank up to 15 providers and, until now, offered the reader no
    way out to a merchant except the sitewide `CtaBanner` in the footer. That
    footer banner alone produced 3 affiliate clicks on 16 views of
    /providers/best/medicare, which is the whole argument: the intent is here and
    the page was not serving it. `/providers` had the same shape at 0.61% before
    iteration 4 put a door in its header and took it to 3.68%.

    Unlike a /compare pair page, the vertical IS declared here, so the door can
    deep-link precisely — and the destination precedence is the hero door's
    (storefront segment -> marketing buy page -> full catalogue), resolved from
    the lead-type guide's own title so the label matches what
    /lead-types/[slug] renders ("aged IUL leads", not "aged iul leads").

    WHAT FALLS THROUGH TO THE CATALOGUE, AND WHY IT IS NOT A BUG:

      medicare, debt-settlement, mca-business-loans, long-term-care,
      auto-warranty, home-security

    The partner's card grid at /all-lead-types/ stocks none of them and there is
    no marketing buy page either. `leadType` is withheld in that case rather than
    passed through, because the door's label is built from it: naming Medicare on
    a button that lands on a catalogue with no Medicare card would be a claim the
    destination does not support. The generic "Browse Aged Leads" door to the
    catalogue is the honest version, and the catalogue is the destination the
    one door on this property that earns already uses (`providers-hub`, 22
    sessions -> 5 orders -> $545.00, 2026-09-01 -> 10-05).

    `legal` deliberately lands on the MIDDLE rung: `/legal/leads` is a verified
    404 and the partner sells all legal intake from the marketing page.

    DO NOT invent a segment for Medicare. The storefront's root nav does link
    `medicare_supplement/leads`, but it is absent from the card grid that is the
    authoritative source, and `lib/store-front.ts` records that it needs Bill's
    confirmation against what Troy is actually selling first.
  */
  const leadTypeKey = guide?.title ?? guideSlug ?? verticalSlug;
  const partnerStocksVertical = Boolean(
    storefrontSegment(leadTypeKey) || storeCategoryPath(leadTypeKey)
  );
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
            {/* The two internal tools keep their position — they lose the
                outline styling, not the place. The ranked provider list below,
                and every competitor link in it, is untouched: this adds a
                disclosed affiliate option, it does not displace the
                alternatives that make the ranking worth reading. */}
            <HeroAffiliateDoor
              leadType={partnerStocksVertical ? leadTypeKey : undefined}
              campaign="providers-best"
              tone="light"
              secondary={[
                {
                  label: `${vertical.name} Pricing Benchmarks`,
                  href: `/price-index/${verticalSlug}`,
                },
                { label: "Calculate Your CPL", href: "/calculators/know-your-cpl" },
              ]}
            />
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
