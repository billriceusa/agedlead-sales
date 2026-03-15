import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { sanityFetch } from "@/sanity/lib/fetch";
import { glossaryTermBySlugQuery } from "@/sanity/lib/queries";
import { PortableText } from "@/components/portable-text";
import { PostCard } from "@/components/post-card";
import { CtaBanner } from "@/components/cta-banner";
import {
  JsonLd,
  glossaryTermJsonLd,
  breadcrumbJsonLd,
} from "@/components/json-ld";

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://agedleadsales.com";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const term: any = await sanityFetch(glossaryTermBySlugQuery, { slug });
  if (!term) return {};

  const title = term.seo?.metaTitle || `What is ${term.term}? – Definition & Guide`;
  const description = term.seo?.metaDescription || term.definition;

  return {
    title,
    description,
    alternates: { canonical: `${baseUrl}/glossary/${slug}` },
    openGraph: {
      title,
      description,
      url: `${baseUrl}/glossary/${slug}`,
      images: [
        {
          url: `${baseUrl}/api/og?title=${encodeURIComponent(term.term)}&category=Definition&type=glossary`,
        },
      ],
    },
  };
}

export default async function GlossaryTermPage({ params }: Props) {
  const { slug } = await params;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const term: any = await sanityFetch(glossaryTermBySlugQuery, { slug });
  if (!term) notFound();

  return (
    <>
      <JsonLd
        data={glossaryTermJsonLd({
          term: term.term,
          definition: term.definition,
          slug: term.slug.current,
        })}
      />
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", url: baseUrl },
          { name: "Glossary", url: `${baseUrl}/glossary` },
          { name: term.term, url: `${baseUrl}/glossary/${term.slug.current}` },
        ])}
      />

      <article className="bg-white py-12 dark:bg-zinc-950">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <nav className="mb-8 text-sm text-zinc-500">
            <Link
              href="/glossary"
              className="hover:text-zinc-700 dark:hover:text-zinc-300"
            >
              Glossary
            </Link>
            <span className="mx-2">/</span>
            <span className="text-zinc-900 dark:text-white">{term.term}</span>
          </nav>

          <header className="mb-10">
            {term.category && (
              <span className="mb-3 inline-block rounded-full bg-zinc-100 px-3 py-0.5 text-xs font-medium uppercase tracking-wider text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400">
                {term.category}
              </span>
            )}
            <h1 className="text-3xl font-bold text-zinc-900 dark:text-white sm:text-4xl">
              {term.term}
            </h1>
          </header>

          {/* Definition card */}
          <div className="mb-10 rounded-xl border-2 border-blue-200 bg-blue-50 p-6 dark:border-blue-900 dark:bg-blue-950/50">
            <h2 className="mb-2 text-sm font-semibold uppercase tracking-wider text-blue-700 dark:text-blue-400">
              Definition
            </h2>
            <p className="text-lg leading-relaxed text-zinc-800 dark:text-zinc-200">
              {term.definition}
            </p>
          </div>

          {/* Extended body */}
          {term.body && term.body.length > 0 && (
            <div className="prose-wrapper">
              <PortableText value={term.body} />
            </div>
          )}

          {/* Related lead types */}
          {term.relatedLeadTypes && term.relatedLeadTypes.length > 0 && (
            <div className="mt-10">
              <h2 className="mb-4 text-xl font-bold text-zinc-900 dark:text-white">
                Related Lead Types
              </h2>
              <div className="grid gap-3 sm:grid-cols-2">
                {term.relatedLeadTypes.map(
                  (lt: {
                    title: string;
                    slug: { current: string };
                    icon?: string;
                    affiliateUrl?: string;
                  }) => (
                    <Link
                      key={lt.slug.current}
                      href={`/lead-types/${lt.slug.current}`}
                      className="flex items-center gap-3 rounded-lg border border-zinc-200 bg-white p-4 transition-colors hover:border-blue-300 dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-blue-700"
                    >
                      {lt.icon && <span className="text-2xl">{lt.icon}</span>}
                      <span className="font-medium text-zinc-900 dark:text-white">
                        {lt.title}
                      </span>
                    </Link>
                  )
                )}
              </div>
            </div>
          )}

          {/* Related terms */}
          {term.relatedTerms && term.relatedTerms.length > 0 && (
            <div className="mt-10">
              <h2 className="mb-4 text-xl font-bold text-zinc-900 dark:text-white">
                Related Terms
              </h2>
              <div className="grid gap-3 sm:grid-cols-2">
                {term.relatedTerms.map(
                  (rt: {
                    term: string;
                    slug: { current: string };
                    definition: string;
                  }) => (
                    <Link
                      key={rt.slug.current}
                      href={`/glossary/${rt.slug.current}`}
                      className="group rounded-lg border border-zinc-200 bg-white p-4 transition-colors hover:border-blue-300 dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-blue-700"
                    >
                      <h3 className="font-semibold text-zinc-900 group-hover:text-blue-600 dark:text-white dark:group-hover:text-blue-400">
                        {rt.term}
                      </h3>
                      <p className="mt-1 text-sm text-zinc-600 line-clamp-2 dark:text-zinc-400">
                        {rt.definition}
                      </p>
                    </Link>
                  )
                )}
              </div>
            </div>
          )}

          <div className="mt-12">
            <CtaBanner variant="compact" />
          </div>
        </div>
      </article>

      {/* Related posts */}
      {term.relatedPosts && term.relatedPosts.length > 0 && (
        <section className="border-t border-zinc-200 bg-zinc-50 py-16 dark:border-zinc-800 dark:bg-zinc-900">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <h2 className="mb-8 text-2xl font-bold text-zinc-900 dark:text-white">
              Related Articles
            </h2>
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {term.relatedPosts.map(
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
    </>
  );
}
