import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { sanityFetch } from "@/sanity/lib/fetch";
import {
  providerBySlugQuery,
  allProviderSlugsQuery,
} from "@/sanity/lib/queries";
import { ProviderRatingBadge } from "@/components/provider-rating-badge";
import { ProviderRatingBar } from "@/components/provider-rating-bar";
import { FreshnessIndicator } from "@/components/freshness-indicator";
import { CtaBanner } from "@/components/cta-banner";
import { JsonLd, breadcrumbJsonLd } from "@/components/json-ld";
import { getProvider, PROVIDERS } from "@/data/providers";

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://agedleadsales.com";

const LEAD_TYPE_LABELS: Record<string, string> = {
  aged: "Aged Internet Leads",
  "real-time": "Real-Time Internet Leads",
  "live-transfer": "Live Transfers",
  trigger: "Trigger / Credit Pulls",
  "data-list": "Data Lists",
  "direct-mail": "Direct Mail Leads",
};

const PRICING_LABELS: Record<string, string> = {
  transparent: "Transparent — prices published online",
  "semi-transparent": "Semi-Transparent — ranges published, exact quotes require contact",
  "sales-required": "Sales Required — must contact for pricing",
};

const DELIVERY_LABELS: Record<string, string> = {
  "instant-download": "Instant Download / CSV",
  email: "Email Delivery",
  api: "API Integration",
  "crm-push": "CRM Push",
  "real-time-post": "Real-Time Post",
};

const COMPLIANCE_LABELS: Record<string, string> = {
  "tcpa-docs": "TCPA Consent Documentation",
  trustedform: "TrustedForm Certificates",
  jornaya: "Jornaya / LeadiD",
  "dnc-scrubbing": "DNC Scrubbing",
  "consent-verification": "Consent Verification",
};

export async function generateStaticParams() {
  const sanityResult = await sanityFetch(allProviderSlugsQuery);
  if (sanityResult && sanityResult.length > 0) {
    return sanityResult.map((p: { slug: string }) => ({ slug: p.slug }));
  }
  return PROVIDERS.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const staticProvider = getProvider(slug);
  const name = staticProvider?.name || slug;

  return {
    title: `${name} Review — Lead Provider Rating & Analysis`,
    description: `Independent review and rating of ${name}. See our honest assessment, 6-dimension scores, and how they compare to other lead providers.`,
    alternates: { canonical: `${baseUrl}/providers/${slug}` },
    openGraph: {
      title: `${name} Review | Aged Lead Sales`,
      description: `Independent ${name} review with transparent ratings across pricing, value, compliance, flexibility, platform, and reputation.`,
      url: `${baseUrl}/providers/${slug}`,
      images: [
        {
          url: `${baseUrl}/api/og?title=${encodeURIComponent(`${name} Review`)}&category=Provider Rating&type=tool`,
        },
      ],
    },
  };
}

export default async function ProviderProfilePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  // Try Sanity first, fall back to static data
  const sanityProvider = await sanityFetch(providerBySlugQuery, { slug });
  const staticProvider = getProvider(slug);

  if (!sanityProvider && !staticProvider) return notFound();

  // Use static data for now (Sanity will take over once populated)
  const p = staticProvider!;

  const ratings = [
    { label: "Pricing Transparency", score: p.ratingTransparency, weight: "20%" },
    { label: "Value", score: p.ratingValue, weight: "20%" },
    { label: "Data Quality & Compliance", score: p.ratingCompliance, weight: "20%" },
    { label: "Flexibility", score: p.ratingFlexibility, weight: "15%" },
    { label: "Platform & Delivery", score: p.ratingPlatform, weight: "15%" },
    { label: "Reputation & Track Record", score: p.ratingReputation, weight: "10%" },
  ];

  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", url: baseUrl },
          { name: "Providers", url: `${baseUrl}/providers` },
          { name: p.name, url: `${baseUrl}/providers/${p.slug}` },
        ])}
      />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Organization",
          name: p.name,
          url: p.website,
          foundingDate: String(p.foundedYear),
          aggregateRating: {
            "@type": "AggregateRating",
            ratingValue: p.overallRating,
            bestRating: 10,
            worstRating: 1,
            ratingCount: 1,
            author: {
              "@type": "Organization",
              name: "Aged Lead Sales",
            },
          },
        }}
      />

      {/* Hero */}
      <section className="bg-white py-12 dark:bg-zinc-950">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
            <div>
              <div className="mb-3 flex items-center gap-2 text-sm text-zinc-500 dark:text-zinc-400">
                <Link
                  href="/providers"
                  className="hover:text-blue-600 dark:hover:text-blue-400"
                >
                  Providers
                </Link>
                <span>/</span>
                <span>{p.name}</span>
              </div>
              <h1 className="text-4xl font-bold text-zinc-900 dark:text-white">
                {p.name}
              </h1>
              <div className="mt-3 flex flex-wrap items-center gap-4 text-sm text-zinc-600 dark:text-zinc-400">
                {p.foundedYear && <span>Est. {p.foundedYear}</span>}
                {p.bbbRating && p.bbbRating !== "NR" && (
                  <span>BBB: {p.bbbRating}</span>
                )}
                {p.headquartersState && <span>{p.headquartersState}</span>}
                <FreshnessIndicator lastVerified={p.lastVerified} />
              </div>
              <p className="mt-4 max-w-2xl text-lg text-zinc-600 dark:text-zinc-400">
                {p.shortDescription}
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                {p.website && (
                  <a
                    href={p.website}
                    target="_blank"
                    rel="noopener noreferrer nofollow"
                    className="inline-flex items-center rounded-lg border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800"
                  >
                    Visit Website &nearr;
                  </a>
                )}
                <Link
                  href="/providers"
                  className="inline-flex items-center rounded-lg border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800"
                >
                  Compare with Another Provider
                </Link>
              </div>
            </div>
            <ProviderRatingBadge score={p.overallRating} size="lg" />
          </div>
        </div>
      </section>

      {/* Our Take */}
      <section className="border-t border-zinc-200 bg-zinc-50 py-12 dark:border-zinc-800 dark:bg-zinc-900">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl">
            <h2 className="text-2xl font-bold text-zinc-900 dark:text-white">
              Our Take
            </h2>
            <div className="mt-4 space-y-4 text-zinc-600 dark:text-zinc-400">
              {p.editorialReview.split("\n").map((paragraph, i) => (
                <p key={i}>{paragraph}</p>
              ))}
            </div>
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <div className="rounded-lg border border-green-200 bg-green-50 p-4 dark:border-green-800 dark:bg-green-950/30">
                <h3 className="text-sm font-semibold text-green-700 dark:text-green-400">
                  Best For
                </h3>
                <ul className="mt-2 space-y-1">
                  {p.bestFor.map((item) => (
                    <li
                      key={item}
                      className="flex items-start gap-2 text-sm text-green-600 dark:text-green-400"
                    >
                      <span className="mt-0.5">&#10003;</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="rounded-lg border border-red-200 bg-red-50 p-4 dark:border-red-800 dark:bg-red-950/30">
                <h3 className="text-sm font-semibold text-red-700 dark:text-red-400">
                  Not Ideal For
                </h3>
                <ul className="mt-2 space-y-1">
                  {p.notIdealFor.map((item) => (
                    <li
                      key={item}
                      className="flex items-start gap-2 text-sm text-red-600 dark:text-red-400"
                    >
                      <span className="mt-0.5">&#10007;</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Ratings Breakdown */}
      <section className="border-t border-zinc-200 bg-white py-12 dark:border-zinc-800 dark:bg-zinc-950">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl">
            <h2 className="text-2xl font-bold text-zinc-900 dark:text-white">
              Ratings Breakdown
            </h2>
            <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
              Scored 1-10 across six weighted dimensions.{" "}
              <Link
                href="/methodology"
                className="text-blue-600 hover:text-blue-700 dark:text-blue-400"
              >
                See methodology
              </Link>
            </p>
            <div className="mt-6 space-y-4">
              {ratings.map((r) => (
                <ProviderRatingBar
                  key={r.label}
                  label={r.label}
                  score={r.score}
                  weight={r.weight}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* What They Offer */}
      <section className="border-t border-zinc-200 bg-zinc-50 py-12 dark:border-zinc-800 dark:bg-zinc-900">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl">
            <h2 className="text-2xl font-bold text-zinc-900 dark:text-white">
              What They Offer
            </h2>
            <div className="mt-6 space-y-6">
              {/* Lead Types */}
              <div>
                <h3 className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">
                  Lead Types
                </h3>
                <div className="mt-2 flex flex-wrap gap-2">
                  {p.leadTypes.map((lt) => (
                    <span
                      key={lt}
                      className="rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-700 dark:bg-blue-900/50 dark:text-blue-300"
                    >
                      {LEAD_TYPE_LABELS[lt] || lt}
                    </span>
                  ))}
                </div>
              </div>

              {/* Operations Grid */}
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-lg border border-zinc-200 bg-white p-4 dark:border-zinc-700 dark:bg-zinc-800">
                  <h3 className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">
                    Pricing Model
                  </h3>
                  <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
                    {PRICING_LABELS[p.pricingModel] || p.pricingModel}
                  </p>
                </div>
                <div className="rounded-lg border border-zinc-200 bg-white p-4 dark:border-zinc-700 dark:bg-zinc-800">
                  <h3 className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">
                    Minimums
                  </h3>
                  <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
                    {p.hasMinimums
                      ? p.minimumDescription || "Yes — contact for details"
                      : "No minimums"}
                  </p>
                </div>
                <div className="rounded-lg border border-zinc-200 bg-white p-4 dark:border-zinc-700 dark:bg-zinc-800">
                  <h3 className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">
                    Contract Required
                  </h3>
                  <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
                    {p.contractRequired ? "Yes" : "No contract required"}
                  </p>
                </div>
                <div className="rounded-lg border border-zinc-200 bg-white p-4 dark:border-zinc-700 dark:bg-zinc-800">
                  <h3 className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">
                    Return / Refund Policy
                  </h3>
                  <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
                    {p.returnPolicy}
                  </p>
                </div>
              </div>

              {/* Delivery */}
              <div>
                <h3 className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">
                  Delivery Methods
                </h3>
                <div className="mt-2 flex flex-wrap gap-2">
                  {p.deliveryMethods.map((dm) => (
                    <span
                      key={dm}
                      className="rounded-full bg-zinc-100 px-3 py-1 text-sm text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400"
                    >
                      {DELIVERY_LABELS[dm] || dm}
                    </span>
                  ))}
                </div>
              </div>

              {/* Compliance */}
              <div>
                <h3 className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">
                  Compliance Features
                </h3>
                <div className="mt-2 flex flex-wrap gap-2">
                  {p.complianceFeatures.map((cf) => (
                    <span
                      key={cf}
                      className="inline-flex items-center gap-1 rounded-full bg-green-100 px-3 py-1 text-sm text-green-700 dark:bg-green-900/50 dark:text-green-300"
                    >
                      &#10003; {COMPLIANCE_LABELS[cf] || cf}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Disclosure */}
      <section className="border-t border-zinc-200 bg-white py-8 dark:border-zinc-800 dark:bg-zinc-950">
        <div className="mx-auto max-w-3xl px-4 text-center">
          <p className="text-xs text-zinc-500 dark:text-zinc-400">
            <strong>Disclosure:</strong> We may earn a commission if you
            purchase through our links. This does not affect our ratings or
            editorial content. Providers cannot pay for higher scores.{" "}
            <Link
              href="/methodology"
              className="text-blue-600 hover:text-blue-700 dark:text-blue-400"
            >
              Read our methodology
            </Link>
          </p>
        </div>
      </section>

      <CtaBanner />
    </>
  );
}
