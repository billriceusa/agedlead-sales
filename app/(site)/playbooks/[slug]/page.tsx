import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { sanityFetch } from "@/sanity/lib/fetch";
import { playbookBySlugQuery, glossaryTooltipQuery } from "@/sanity/lib/queries";
import { urlForImage } from "@/sanity/lib/image";
import { PortableText, extractHeadings, buildHeadingIdMap } from "@/components/portable-text";
import { KeyTakeawayBox } from "@/components/key-takeaway-box";
import { PlaybookCard } from "@/components/playbook-card";
import { CtaBanner } from "@/components/cta-banner";
import { InlineTextCta } from "@/components/inline-text-cta";
import { JsonLd, breadcrumbJsonLd, howToJsonLd } from "@/components/json-ld";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { CredibilityBadges } from "@/components/credibility-badges";
import { StickyToc } from "@/components/sticky-toc";
import { NextReadBar } from "@/components/next-read-bar";
import { ReactionButtons } from "@/components/reaction-buttons";

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://agedleadsales.com";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const playbook: any = await sanityFetch(playbookBySlugQuery, { slug });
  if (!playbook) return {};

  const title = playbook.seo?.metaTitle || playbook.title;
  const description = playbook.seo?.metaDescription || playbook.excerpt;
  const ogImageUrl = playbook.mainImage
    ? urlForImage(playbook.mainImage)?.width(1200).height(630).url()
    : `${baseUrl}/api/og?title=${encodeURIComponent(playbook.title)}&type=playbook`;

  return {
    title,
    description,
    alternates: { canonical: `${baseUrl}/playbooks/${slug}` },
    openGraph: {
      title,
      description,
      url: `${baseUrl}/playbooks/${slug}`,
      ...(ogImageUrl && { images: [{ url: ogImageUrl }] }),
    },
  };
}

export default async function PlaybookPage({ params }: Props) {
  const { slug } = await params;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [playbook, glossary]: [any, any] = await Promise.all([
    sanityFetch(playbookBySlugQuery, { slug }),
    sanityFetch(glossaryTooltipQuery),
  ]);
  if (!playbook) notFound();

  const headings = playbook.body ? extractHeadings(playbook.body) : [];
  const headingIds = playbook.body ? buildHeadingIdMap(playbook.body) : new Map<string, string>();

  const imageUrl = playbook.mainImage
    ? urlForImage(playbook.mainImage)?.width(1200).url()
    : undefined;

  const difficultyLabel = playbook.difficulty
    ? playbook.difficulty.charAt(0).toUpperCase() + playbook.difficulty.slice(1)
    : null;

  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", url: baseUrl },
          { name: "Playbooks", url: `${baseUrl}/playbooks` },
          { name: playbook.title, url: `${baseUrl}/playbooks/${playbook.slug.current}` },
        ])}
      />
      <JsonLd
        data={howToJsonLd({
          name: playbook.title,
          description: playbook.excerpt || "",
          steps: [
            {
              name: "Understand the strategy",
              text: `Read through the full ${playbook.title} playbook to understand the approach and why it works for aged leads.`,
            },
            {
              name: "Gather your materials",
              text: "Prepare your lead list, CRM, phone system, and any scripts or templates referenced in this playbook.",
            },
            {
              name: "Follow the playbook step by step",
              text: `Work through each section of the ${playbook.title} guide, applying the techniques to your aged lead inventory.`,
            },
            {
              name: "Track and optimize your results",
              text: "Measure your contact rate, conversion rate, and ROI. Adjust your approach based on what works best for your market.",
            },
          ],
        })}
      />

      <article className="bg-white py-12 dark:bg-zinc-950">
        <div className="relative mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          {headings.length >= 3 && <StickyToc headings={headings} />}

          <Breadcrumbs
            items={[
              { label: "Playbooks", href: "/playbooks" },
              { label: playbook.title },
            ]}
          />

          {/* Header */}
          <header className="mb-10">
            <div className="mb-4 flex flex-wrap items-center gap-3">
              {difficultyLabel && (
                <span
                  className={`rounded-full px-3 py-1 text-xs font-medium ${
                    playbook.difficulty === "beginner"
                      ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                      : playbook.difficulty === "intermediate"
                        ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400"
                        : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
                  }`}
                >
                  {difficultyLabel}
                </span>
              )}
              {playbook.estimatedTime && (
                <span className="text-sm text-zinc-500">
                  {playbook.estimatedTime}
                </span>
              )}
            </div>

            <h1 className="text-3xl font-bold text-zinc-900 dark:text-white sm:text-4xl lg:text-5xl">
              {playbook.title}
            </h1>
            <p className="mt-4 text-lg text-zinc-600 dark:text-zinc-400">
              {playbook.excerpt}
            </p>

            {playbook.author && (
              <div className="mt-6 flex items-center gap-3">
                {playbook.author.image && (
                  <div className="h-10 w-10 overflow-hidden rounded-full bg-zinc-200 dark:bg-zinc-700">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={
                        urlForImage(playbook.author.image)
                          ?.width(80)
                          .height(80)
                          .url() || ""
                      }
                      alt={playbook.author.name}
                      className="h-full w-full object-cover"
                    />
                  </div>
                )}
                <div>
                  <p className="text-sm font-medium text-zinc-900 dark:text-white">
                    {playbook.author.name}
                  </p>
                  {playbook.author.role && (
                    <p className="text-xs text-zinc-500">
                      {playbook.author.role}
                    </p>
                  )}
                </div>
              </div>
            )}

            <CredibilityBadges
              publishedAt={playbook.publishedAt}
              updatedAt={playbook._updatedAt}
              authorName={playbook.author?.name}
              authorRole={playbook.author?.role}
            />
          </header>

          {/* Featured Image */}
          {imageUrl && (
            <div className="mb-10 overflow-hidden rounded-xl">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={imageUrl}
                alt={playbook.mainImage?.alt || playbook.title}
                className="w-full"
              />
            </div>
          )}

          {/* Related Lead Types */}
          {playbook.leadTypes && playbook.leadTypes.length > 0 && (
            <div className="mb-8 rounded-lg border border-blue-200 bg-blue-50 p-4 dark:border-blue-900 dark:bg-blue-950/50">
              <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                Applies to:{" "}
              </span>
              {playbook.leadTypes.map(
                (
                  lt: {
                    title: string;
                    slug: { current: string };
                    icon?: string;
                  },
                  i: number
                ) => (
                  <span key={lt.slug.current}>
                    <Link
                      href={`/lead-types/${lt.slug.current}`}
                      className="text-sm font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400"
                    >
                      {lt.icon} {lt.title}
                    </Link>
                    {i < playbook.leadTypes.length - 1 && (
                      <span className="text-zinc-400">, </span>
                    )}
                  </span>
                )
              )}
            </div>
          )}

          {/* Inline Text CTA */}
          <InlineTextCta
            campaign="playbook"
            leadType={playbook.leadTypes?.[0]?.title}
          />

          {playbook.excerpt && (
            <KeyTakeawayBox
              excerpt={playbook.excerpt}
              firstHeadingId={headings[0]?.id}
            />
          )}

          {/* Body */}
          {playbook.body && (
            <div className="prose-wrapper">
              <PortableText
                value={playbook.body}
                campaign="playbook"
                glossary={glossary || []}
                headingIds={headingIds}
              />
            </div>
          )}

          {/* Free Tools */}
          <div className="mt-10 rounded-xl border border-zinc-200 bg-zinc-50 p-6 dark:border-zinc-800 dark:bg-zinc-900">
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-zinc-500">
              Free Tools
            </h3>
            <div className="grid gap-3 sm:grid-cols-3">
              <Link
                href="/calculators/roi-calculator"
                className="rounded-lg border border-zinc-200 bg-white p-3 text-sm font-medium text-zinc-900 transition-colors hover:border-blue-300 hover:bg-blue-50 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white dark:hover:border-blue-700"
              >
                ROI Calculator
              </Link>
              <Link
                href="/calculators/lead-cost-calculator"
                className="rounded-lg border border-zinc-200 bg-white p-3 text-sm font-medium text-zinc-900 transition-colors hover:border-blue-300 hover:bg-blue-50 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white dark:hover:border-blue-700"
              >
                Lead Cost Calculator
              </Link>
              <Link
                href="/calculators/pipeline-calculator"
                className="rounded-lg border border-zinc-200 bg-white p-3 text-sm font-medium text-zinc-900 transition-colors hover:border-blue-300 hover:bg-blue-50 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white dark:hover:border-blue-700"
              >
                Pipeline Calculator
              </Link>
            </div>
          </div>

          <ReactionButtons slug={playbook.slug.current} contentType="playbook" />

          {/* Inline CTA */}
          <div className="mt-12">
            <CtaBanner variant="compact" />
          </div>
        </div>
      </article>

      {playbook.relatedPlaybooks?.[0] && (
        <NextReadBar
          title={playbook.relatedPlaybooks[0].title}
          slug={playbook.relatedPlaybooks[0].slug.current}
          basePath="/playbooks"
        />
      )}

      {/* Related Playbooks */}
      {playbook.relatedPlaybooks && playbook.relatedPlaybooks.length > 0 && (
        <section className="border-t border-zinc-200 bg-zinc-50 py-16 dark:border-zinc-800 dark:bg-zinc-900">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <h2 className="mb-8 text-2xl font-bold text-zinc-900 dark:text-white">
              More Playbooks
            </h2>
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {playbook.relatedPlaybooks.map(
                (rp: {
                  _id: string;
                  title: string;
                  slug: { current: string };
                  excerpt: string;
                  mainImage?: { asset?: { _ref: string }; alt?: string };
                  difficulty?: string;
                  estimatedTime?: string;
                }) => (
                  <PlaybookCard
                    key={rp._id}
                    title={rp.title}
                    slug={rp.slug.current}
                    excerpt={rp.excerpt}
                    mainImage={rp.mainImage}
                    difficulty={rp.difficulty}
                    estimatedTime={rp.estimatedTime}
                  />
                )
              )}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
