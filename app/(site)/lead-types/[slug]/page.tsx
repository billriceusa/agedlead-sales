import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { sanityFetch } from "@/sanity/lib/fetch";
import { leadTypeBySlugQuery } from "@/sanity/lib/queries";
import { urlForImage } from "@/sanity/lib/image";
import { PortableText } from "@/components/portable-text";
import { PostCard } from "@/components/post-card";
import { PlaybookCard } from "@/components/playbook-card";
import { CtaBanner } from "@/components/cta-banner";
import { JsonLd, breadcrumbJsonLd } from "@/components/json-ld";

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://agedleadstore.com";

interface Props {
  params: Promise<{ slug: string }>;
}

const LEAD_TYPE_FALLBACKS: Record<
  string,
  { title: string; icon: string; description: string; affiliateUrl: string }
> = {
  "mortgage-leads": {
    title: "Mortgage Leads",
    icon: "🏠",
    description:
      "Aged mortgage leads are consumer records from individuals who previously expressed interest in home loans, refinancing, or mortgage-related products. These leads offer mortgage brokers and loan officers a cost-effective way to build a high-volume pipeline.",
    affiliateUrl: "https://agedleadstore.com",
  },
  "insurance-leads": {
    title: "Insurance Leads",
    icon: "🛡️",
    description:
      "Aged insurance leads include consumers who requested quotes for auto, home, health, or life insurance. Insurance agents can use these records to fill their pipeline at a fraction of the cost of real-time leads.",
    affiliateUrl: "https://agedleadstore.com",
  },
  "final-expense-leads": {
    title: "Final Expense Leads",
    icon: "⚰️",
    description:
      "Aged final expense leads connect you with individuals who previously explored burial insurance and end-of-life planning. This is one of the highest-converting verticals for aged lead campaigns.",
    affiliateUrl: "https://agedleadstore.com",
  },
  "iul-leads": {
    title: "IUL Leads",
    icon: "📈",
    description:
      "Aged IUL (Indexed Universal Life) leads come from consumers who explored cash-value life insurance, wealth-building strategies, and tax-advantaged retirement options.",
    affiliateUrl: "https://agedleadstore.com",
  },
  "ssdi-leads": {
    title: "SSDI Leads",
    icon: "⚖️",
    description:
      "Aged SSDI leads are from individuals who previously sought assistance with Social Security Disability Insurance claims. Ideal for disability law firms and advocacy services.",
    affiliateUrl: "https://agedleadstore.com",
  },
  "mva-leads": {
    title: "MVA Leads",
    icon: "🚗",
    description:
      "Aged MVA (Motor Vehicle Accident) leads connect personal injury attorneys and legal services with individuals who were previously involved in auto accidents and sought legal representation.",
    affiliateUrl: "https://agedleadstore.com",
  },
  "solar-leads": {
    title: "Solar Leads",
    icon: "☀️",
    description:
      "Aged solar leads are from homeowners who explored solar panel installation and renewable energy savings. Solar companies can use these leads to fill their sales pipeline efficiently.",
    affiliateUrl: "https://agedleadstore.com",
  },
  "medicare-leads": {
    title: "Medicare Leads",
    icon: "🏥",
    description:
      "Aged Medicare leads connect you with seniors who explored Medicare supplement plans, Medicare Advantage, and Part D options. A growing market with consistent demand.",
    affiliateUrl: "https://agedleadstore.com",
  },
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const leadType: any = await sanityFetch(leadTypeBySlugQuery, { slug });
  const fallback = LEAD_TYPE_FALLBACKS[slug];

  if (!leadType && !fallback) return {};

  const title = leadType?.seo?.metaTitle || leadType?.title || fallback?.title || "";
  const description =
    leadType?.seo?.metaDescription ||
    leadType?.shortDescription ||
    fallback?.description ||
    "";

  return {
    title: `Aged ${title} – Strategies & Training`,
    description,
    alternates: { canonical: `${baseUrl}/lead-types/${slug}` },
    openGraph: {
      title: `Aged ${title} – Strategies & Training`,
      description,
      url: `${baseUrl}/lead-types/${slug}`,
      images: [
        {
          url: `${baseUrl}/api/og?title=${encodeURIComponent(`Aged ${title}`)}&type=lead-type`,
        },
      ],
    },
  };
}

export default async function LeadTypePage({ params }: Props) {
  const { slug } = await params;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const leadType: any = await sanityFetch(leadTypeBySlugQuery, { slug });
  const fallback = LEAD_TYPE_FALLBACKS[slug];
  if (!leadType && !fallback) notFound();

  const title = leadType?.title || fallback?.title || "";
  const icon = leadType?.icon || fallback?.icon || "";
  const description =
    leadType?.shortDescription || fallback?.description || "";
  const affiliateUrl = leadType?.affiliateUrl || fallback?.affiliateUrl || "https://agedleadstore.com";
  const imageUrl = leadType?.mainImage
    ? urlForImage(leadType.mainImage)?.width(1200).url()
    : undefined;

  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", url: baseUrl },
          { name: "Lead Types", url: `${baseUrl}/lead-types` },
          { name: title, url: `${baseUrl}/lead-types/${slug}` },
        ])}
      />

      {/* Hero */}
      <section className="bg-gradient-to-br from-zinc-900 to-blue-950 py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <nav className="mb-8 text-sm text-zinc-400">
            <Link href="/lead-types" className="hover:text-white">
              Lead Types
            </Link>
            <span className="mx-2">/</span>
            <span className="text-white">{title}</span>
          </nav>

          <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-2xl">
              <span className="text-5xl">{icon}</span>
              <h1 className="mt-4 text-4xl font-bold text-white sm:text-5xl">
                Aged {title}
              </h1>
              <p className="mt-4 text-lg text-zinc-300">{description}</p>
              {leadType?.averageCostPerLead && (
                <p className="mt-3 text-sm text-zinc-400">
                  Average cost:{" "}
                  <span className="font-semibold text-blue-400">
                    {leadType.averageCostPerLead}
                  </span>{" "}
                  per lead
                </p>
              )}
              <div className="mt-8 flex flex-col gap-4 sm:flex-row">
                <a
                  href={affiliateUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-lg bg-blue-600 px-8 py-3 text-center font-semibold text-white transition-colors hover:bg-blue-700"
                >
                  Buy {title} at AgedLeadStore.com
                </a>
              </div>
            </div>
            {imageUrl && (
              <div className="overflow-hidden rounded-xl lg:max-w-md">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={imageUrl}
                  alt={title}
                  className="w-full rounded-xl"
                />
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Body Content from Sanity */}
      {leadType?.body && (
        <section className="bg-white py-16 dark:bg-zinc-950">
          <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
            <PortableText value={leadType.body} />
          </div>
        </section>
      )}

      {/* Fallback content for pages without CMS data */}
      {!leadType?.body && (
        <section className="bg-white py-16 dark:bg-zinc-950">
          <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
            <h2 className="mb-6 text-2xl font-bold text-zinc-900 dark:text-white">
              Why Use Aged {title}?
            </h2>
            <div className="space-y-4 text-zinc-600 dark:text-zinc-400">
              <p>
                Aged {title.toLowerCase()} give you access to consumers who
                previously expressed genuine interest in your services — at a
                fraction of what you&apos;d pay for real-time leads.
              </p>
              <p>
                Instead of spending $10–$50+ per real-time lead and competing in
                a speed-to-call race, you can purchase hundreds or even
                thousands of aged records for the same budget and work them at
                your own pace.
              </p>
              <p>
                The key to success with aged leads is using the right outreach
                approach. Check out our playbooks and blog posts below for
                proven strategies.
              </p>
            </div>

            <div className="mt-10">
              <CtaBanner
                variant="compact"
                headline={`Ready to Buy ${title}?`}
                description={`Browse aged ${title.toLowerCase()} at AgedLeadStore.com — starting at just pennies per lead.`}
                buttonText={`Buy ${title}`}
                buttonHref={affiliateUrl}
              />
            </div>
          </div>
        </section>
      )}

      {/* Related Posts */}
      {leadType?.relatedPosts && leadType.relatedPosts.length > 0 && (
        <section className="border-t border-zinc-200 bg-zinc-50 py-16 dark:border-zinc-800 dark:bg-zinc-900">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <h2 className="mb-8 text-2xl font-bold text-zinc-900 dark:text-white">
              Articles About {title}
            </h2>
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {leadType.relatedPosts.map(
                (post: {
                  _id: string;
                  title: string;
                  slug: { current: string };
                  excerpt: string;
                  mainImage?: { asset?: { _ref: string }; alt?: string };
                  publishedAt?: string;
                }) => (
                  <PostCard
                    key={post._id}
                    title={post.title}
                    slug={post.slug.current}
                    excerpt={post.excerpt}
                    mainImage={post.mainImage}
                    publishedAt={post.publishedAt}
                  />
                )
              )}
            </div>
          </div>
        </section>
      )}

      {/* Related Playbooks */}
      {leadType?.relatedPlaybooks &&
        leadType.relatedPlaybooks.length > 0 && (
          <section className="border-t border-zinc-200 bg-white py-16 dark:border-zinc-800 dark:bg-zinc-950">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <h2 className="mb-8 text-2xl font-bold text-zinc-900 dark:text-white">
                Playbooks for {title}
              </h2>
              <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
                {leadType.relatedPlaybooks.map(
                  (pb: {
                    _id: string;
                    title: string;
                    slug: { current: string };
                    excerpt: string;
                    mainImage?: { asset?: { _ref: string }; alt?: string };
                    difficulty?: string;
                    estimatedTime?: string;
                  }) => (
                    <PlaybookCard
                      key={pb._id}
                      title={pb.title}
                      slug={pb.slug.current}
                      excerpt={pb.excerpt}
                      mainImage={pb.mainImage}
                      difficulty={pb.difficulty}
                      estimatedTime={pb.estimatedTime}
                    />
                  )
                )}
              </div>
            </div>
          </section>
        )}

      {/* Bottom CTA */}
      <CtaBanner
        headline={`Start Prospecting with Aged ${title}`}
        description={`Create your free account at AgedLeadStore.com and browse ${title.toLowerCase()} inventory in your area.`}
        buttonHref={affiliateUrl}
      />
    </>
  );
}
