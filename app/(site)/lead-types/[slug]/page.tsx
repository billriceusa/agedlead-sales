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
import { JsonLd, breadcrumbJsonLd, faqJsonLd } from "@/components/json-ld";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { NewsletterSignup } from "@/components/newsletter-signup";
import { LEAD_TYPES } from "@/data/lead-types";

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://agedleadsales.com";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const leadType: any = await sanityFetch(leadTypeBySlugQuery, { slug });
  const fallback = LEAD_TYPES[slug];

  if (!leadType && !fallback) return {};

  const title =
    leadType?.seo?.metaTitle || fallback?.metaTitle || leadType?.title || fallback?.title || "";
  const description =
    leadType?.seo?.metaDescription || fallback?.metaDescription || leadType?.shortDescription || "";

  return {
    title,
    description,
    alternates: { canonical: `${baseUrl}/lead-types/${slug}` },
    openGraph: {
      title,
      description,
      url: `${baseUrl}/lead-types/${slug}`,
      images: [
        {
          url: `${baseUrl}/api/og?title=${encodeURIComponent(title)}&type=lead-type`,
        },
      ],
    },
  };
}

export default async function LeadTypePage({ params }: Props) {
  const { slug } = await params;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const leadType: any = await sanityFetch(leadTypeBySlugQuery, { slug });
  const data = LEAD_TYPES[slug];
  if (!leadType && !data) notFound();

  const title = leadType?.title || data?.title || "";
  const icon = leadType?.icon || data?.icon || "";
  const description =
    leadType?.shortDescription || data?.heroDescription || "";
  // Map lead type slugs to vertical slugs (they don't always match)
  const LEAD_TYPE_TO_VERTICAL: Record<string, string> = {
    "mortgage-leads": "mortgage",
    "insurance-leads": "auto-insurance",
    "final-expense-leads": "final-expense",
    "iul-leads": "annuity-iul",
    "ssdi-leads": "life-insurance",
    "mva-leads": "legal",
    "solar-leads": "solar",
    "medicare-leads": "medicare",
  };
  const verticalSlug = LEAD_TYPE_TO_VERTICAL[slug] || slug.replace(/-leads$/, "");
  const compareHref = `/providers/best/${verticalSlug}`;
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
      {data?.faqs && <JsonLd data={faqJsonLd(data.faqs)} />}

      {/* Hero */}
      <section className="bg-gradient-to-br from-zinc-900 to-blue-950 py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Breadcrumbs
            variant="dark"
            items={[
              { label: "Lead Types", href: "/lead-types" },
              { label: title },
            ]}
          />

          <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-2xl">
              <span className="text-5xl">{icon}</span>
              <h1 className="mt-4 text-4xl font-bold text-white sm:text-5xl">
                Aged {title}
              </h1>
              <p className="mt-4 text-lg text-zinc-300">{description}</p>
              {(leadType?.averageCostPerLead || data?.costRange) && (
                <p className="mt-3 text-sm text-zinc-400">
                  Average cost:{" "}
                  <span className="font-semibold text-blue-400">
                    {leadType?.averageCostPerLead || data?.costRange}
                  </span>{" "}
                  per lead
                </p>
              )}
              <div className="mt-8 flex flex-col gap-4 sm:flex-row">
                <Link
                  href={compareHref}
                  className="rounded-lg bg-blue-600 px-8 py-3 text-center font-semibold text-white transition-colors hover:bg-blue-700"
                >
                  Compare {title} Providers
                </Link>
                <Link
                  href={`/price-index/${verticalSlug}`}
                  className="rounded-lg border border-zinc-600 px-8 py-3 text-center font-semibold text-white transition-colors hover:bg-zinc-800"
                >
                  {title} Pricing
                </Link>
              </div>
            </div>
            {imageUrl && (
              <div className="overflow-hidden rounded-xl lg:max-w-md">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={imageUrl} alt={title} className="w-full rounded-xl" />
              </div>
            )}
          </div>
        </div>
      </section>

      {/* CMS Body Content (overrides static content when present) */}
      {leadType?.body && (
        <section className="bg-white py-16 dark:bg-zinc-950">
          <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
            <PortableText value={leadType.body} />
          </div>
        </section>
      )}

      {/* Rich static content for SEO (rendered when no CMS body) */}
      {!leadType?.body && data && (
        <>
          {/* What Are Section */}
          <section className="bg-white py-16 dark:bg-zinc-950">
            <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
              <h2 className="mb-6 text-2xl font-bold text-zinc-900 dark:text-white sm:text-3xl">
                What Are Aged {title}?
              </h2>
              <p className="mb-6 leading-relaxed text-zinc-600 dark:text-zinc-400">
                {data.sections.whatAre}
              </p>

              {/* What You Get */}
              <div className="mb-8 rounded-xl border border-zinc-200 bg-zinc-50 p-6 dark:border-zinc-800 dark:bg-zinc-900">
                <h3 className="mb-4 text-lg font-semibold text-zinc-900 dark:text-white">
                  What You Get with Each Lead
                </h3>
                <ul className="space-y-2">
                  {data.whatYouGet.map((item) => (
                    <li key={item} className="flex items-start gap-2 text-sm text-zinc-600 dark:text-zinc-400">
                      <span className="mt-0.5 text-blue-500">✓</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Who It's For */}
              <div className="rounded-xl border border-zinc-200 bg-zinc-50 p-6 dark:border-zinc-800 dark:bg-zinc-900">
                <h3 className="mb-4 text-lg font-semibold text-zinc-900 dark:text-white">
                  Who Uses Aged {title}?
                </h3>
                <ul className="space-y-2">
                  {data.whoItsFor.map((item) => (
                    <li key={item} className="flex items-start gap-2 text-sm text-zinc-600 dark:text-zinc-400">
                      <span className="mt-0.5 text-blue-500">→</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </section>

          {/* Why Use Section */}
          <section className="border-t border-zinc-200 bg-zinc-50 py-16 dark:border-zinc-800 dark:bg-zinc-900">
            <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
              <h2 className="mb-6 text-2xl font-bold text-zinc-900 dark:text-white sm:text-3xl">
                Why Use Aged {title}?
              </h2>
              <p className="mb-8 leading-relaxed text-zinc-600 dark:text-zinc-400">
                {data.sections.whyUse}
              </p>

              {/* Cost Comparison */}
              <div className="grid gap-6 sm:grid-cols-2">
                <div className="rounded-xl border-2 border-red-200 bg-white p-6 dark:border-red-900 dark:bg-zinc-950">
                  <h3 className="text-lg font-bold text-red-600 dark:text-red-400">
                    Real-Time {title}
                  </h3>
                  <p className="mt-2 text-3xl font-bold text-zinc-900 dark:text-white">
                    {data.sections.costComparison.realTime}
                  </p>
                  <ul className="mt-4 space-y-2 text-sm text-zinc-600 dark:text-zinc-400">
                    <li className="flex items-start gap-2">
                      <span className="mt-0.5 text-red-500">✕</span>
                      Competing with 5-10 other buyers
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="mt-0.5 text-red-500">✕</span>
                      Speed-to-call arms race
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="mt-0.5 text-red-500">✕</span>
                      $500 budget = ~10-20 leads
                    </li>
                  </ul>
                </div>
                <div className="rounded-xl border-2 border-blue-200 bg-white p-6 dark:border-blue-900 dark:bg-zinc-950">
                  <h3 className="text-lg font-bold text-blue-600 dark:text-blue-400">
                    Aged {title}
                  </h3>
                  <p className="mt-2 text-3xl font-bold text-zinc-900 dark:text-white">
                    {data.sections.costComparison.aged}
                  </p>
                  <ul className="mt-4 space-y-2 text-sm text-zinc-600 dark:text-zinc-400">
                    <li className="flex items-start gap-2">
                      <span className="mt-0.5 text-blue-500">✓</span>
                      Little to no competition
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="mt-0.5 text-blue-500">✓</span>
                      Work at your own pace
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="mt-0.5 text-blue-500">✓</span>
                      $500 budget = 250-1,000+ leads
                    </li>
                  </ul>
                </div>
              </div>
              <p className="mt-4 text-center text-sm font-semibold text-blue-600 dark:text-blue-400">
                {data.sections.costComparison.savings}
              </p>
            </div>
          </section>

          {/* Mid-page CTA */}
          <CtaBanner
            variant="compact"
            headline={`Compare ${title} Providers`}
            description={`See which providers offer the best aged ${title.toLowerCase()} — with independent ratings and fair market pricing from ${data.costRange} per lead.`}
            buttonText="Compare Providers"
            buttonHref={compareHref}
          />

          {/* How to Work Section */}
          <section className="bg-white py-16 dark:bg-zinc-950">
            <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
              <h2 className="mb-6 text-2xl font-bold text-zinc-900 dark:text-white sm:text-3xl">
                How to Work Aged {title}
              </h2>
              <p className="mb-8 leading-relaxed text-zinc-600 dark:text-zinc-400">
                {data.sections.howToWork}
              </p>

              {/* Script */}
              <div className="mb-8 rounded-xl border-2 border-blue-200 bg-blue-50 p-6 dark:border-blue-900 dark:bg-blue-950/50">
                <h3 className="mb-3 text-lg font-semibold text-zinc-900 dark:text-white">
                  Sample Opening Script
                </h3>
                <blockquote className="mb-4 border-l-4 border-blue-400 pl-4 italic text-zinc-700 dark:text-zinc-300">
                  {data.sections.script.opener}
                </blockquote>
                <h4 className="mb-2 text-sm font-semibold uppercase tracking-wider text-blue-700 dark:text-blue-400">
                  Why This Works
                </h4>
                <ul className="space-y-1.5">
                  {data.sections.script.whyItWorks.map((reason) => (
                    <li key={reason} className="flex items-start gap-2 text-sm text-zinc-600 dark:text-zinc-400">
                      <span className="mt-0.5 text-blue-500">✓</span>
                      {reason}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Best Practices */}
              <h3 className="mb-4 text-xl font-semibold text-zinc-900 dark:text-white">
                Best Practices
              </h3>
              <ul className="space-y-3">
                {data.sections.bestPractices.map((practice, i) => (
                  <li key={i} className="flex items-start gap-3 text-zinc-600 dark:text-zinc-400">
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-blue-100 text-xs font-bold text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">
                      {i + 1}
                    </span>
                    {practice}
                  </li>
                ))}
              </ul>
            </div>
          </section>

          {/* FAQ Section */}
          {data.faqs.length > 0 && (
            <section className="border-t border-zinc-200 bg-zinc-50 py-16 dark:border-zinc-800 dark:bg-zinc-900">
              <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
                <h2 className="mb-8 text-2xl font-bold text-zinc-900 dark:text-white sm:text-3xl">
                  Frequently Asked Questions
                </h2>
                <div className="space-y-6">
                  {data.faqs.map((faq) => (
                    <div
                      key={faq.question}
                      className="rounded-xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-950"
                    >
                      <h3 className="text-lg font-semibold text-zinc-900 dark:text-white">
                        {faq.question}
                      </h3>
                      <p className="mt-3 leading-relaxed text-zinc-600 dark:text-zinc-400">
                        {faq.answer}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          )}

          {/* Newsletter CTA */}
          <section className="bg-white py-12 dark:bg-zinc-950">
            <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
              <NewsletterSignup
                variant="card"
                heading={`Get ${title.split(" ")[0]} Sales Tips`}
                description={`Weekly strategies, scripts, and insights for working aged ${title.toLowerCase()}. Free, no spam.`}
                context={`lead-type-${slug}`}
              />
            </div>
          </section>
        </>
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
      {leadType?.relatedPlaybooks && leadType.relatedPlaybooks.length > 0 && (
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
      <CtaBanner />
    </>
  );
}
