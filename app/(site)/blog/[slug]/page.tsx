import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { sanityFetch } from "@/sanity/lib/fetch";
import { postBySlugQuery, glossaryTooltipQuery } from "@/sanity/lib/queries";
import { urlForImage } from "@/sanity/lib/image";
import { PortableText } from "@/components/portable-text";
import { PostCard } from "@/components/post-card";
import { CtaBanner } from "@/components/cta-banner";
import { InlineTextCta } from "@/components/inline-text-cta";
import { JsonLd, articleJsonLd, breadcrumbJsonLd } from "@/components/json-ld";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { ScrollProgressBar } from "@/components/scroll-progress-bar";

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://agedleadsales.com";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const post: any = await sanityFetch(postBySlugQuery, { slug });
  if (!post) return {};

  const title = post.seo?.metaTitle || post.title;
  const description = post.seo?.metaDescription || post.excerpt;
  const ogImageUrl = post.mainImage
    ? urlForImage(post.mainImage)?.width(1200).height(630).url()
    : `${baseUrl}/api/og?title=${encodeURIComponent(post.title)}&type=blog`;

  return {
    title,
    description,
    alternates: { canonical: `${baseUrl}/blog/${slug}` },
    openGraph: {
      title,
      description,
      type: "article",
      publishedTime: post.publishedAt,
      url: `${baseUrl}/blog/${slug}`,
      ...(ogImageUrl && { images: [{ url: ogImageUrl }] }),
    },
  };
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [post, glossary]: [any, any] = await Promise.all([
    sanityFetch(postBySlugQuery, { slug }),
    sanityFetch(glossaryTooltipQuery),
  ]);
  if (!post) notFound();

  const imageUrl = post.mainImage
    ? urlForImage(post.mainImage)?.width(1200).url()
    : undefined;

  return (
    <>
      <JsonLd
        data={articleJsonLd({
          title: post.title,
          description: post.excerpt,
          slug: post.slug.current,
          publishedAt: post.publishedAt,
          modifiedAt: post._updatedAt,
          authorName: post.author?.name,
          imageUrl: imageUrl || undefined,
        })}
      />
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", url: baseUrl },
          { name: "Blog", url: `${baseUrl}/blog` },
          { name: post.title, url: `${baseUrl}/blog/${post.slug.current}` },
        ])}
      />

      <ScrollProgressBar />

      <article className="bg-white py-12 dark:bg-zinc-950">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <Breadcrumbs
            items={[
              { label: "Blog", href: "/blog" },
              { label: post.title },
            ]}
          />

          <header className="mb-10">
            {post.categories && post.categories.length > 0 && (
              <div className="mb-4 flex flex-wrap gap-2">
                {post.categories.map(
                  (cat: { title: string; slug: { current: string } }) => (
                    <Link
                      key={cat.slug.current}
                      href={`/blog/category/${cat.slug.current}`}
                      className="rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-800 transition-colors hover:bg-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:hover:bg-blue-900/50"
                    >
                      {cat.title}
                    </Link>
                  )
                )}
              </div>
            )}

            {post.contentType && (
              <span className="mb-3 inline-block rounded-full bg-zinc-100 px-3 py-0.5 text-xs font-medium uppercase tracking-wider text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400">
                {post.contentType === "pillar" ? "Comprehensive Guide" : "Deep Dive"}
              </span>
            )}

            <h1 className="text-3xl font-bold text-zinc-900 dark:text-white sm:text-4xl lg:text-5xl">
              {post.title}
            </h1>

            <div className="mt-6 flex items-center gap-4">
              {post.author && (
                <div className="flex items-center gap-3">
                  {post.author.image && (
                    <div className="h-10 w-10 overflow-hidden rounded-full bg-zinc-200 dark:bg-zinc-700">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={urlForImage(post.author.image)?.width(80).height(80).url() || ""}
                        alt={post.author.name}
                        className="h-full w-full object-cover"
                      />
                    </div>
                  )}
                  <div>
                    <p className="text-sm font-medium text-zinc-900 dark:text-white">
                      {post.author.name}
                    </p>
                    {post.author.role && (
                      <p className="text-xs text-zinc-500">{post.author.role}</p>
                    )}
                  </div>
                </div>
              )}
              {post.publishedAt && (
                <time dateTime={post.publishedAt} className="text-sm text-zinc-500">
                  {new Date(post.publishedAt).toLocaleDateString("en-US", {
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                  })}
                </time>
              )}
            </div>
          </header>

          {imageUrl && (
            <div className="mb-10 overflow-hidden rounded-xl">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={imageUrl} alt={post.mainImage?.alt || post.title} className="w-full" />
            </div>
          )}

          {/* Pillar post — show cluster posts */}
          {post.clusterPosts && post.clusterPosts.length > 0 && (
            <div className="mb-8 rounded-lg border border-zinc-200 bg-zinc-50 p-5 dark:border-zinc-800 dark:bg-zinc-900">
              <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-zinc-500">
                In This Series
              </h2>
              <ul className="space-y-2">
                {post.clusterPosts.map(
                  (cp: { _id: string; title: string; slug: { current: string } }) => (
                    <li key={cp._id}>
                      <Link
                        href={`/blog/${cp.slug.current}`}
                        className="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400"
                      >
                        {cp.title}
                      </Link>
                    </li>
                  )
                )}
              </ul>
            </div>
          )}

          {/* Cluster post — link back to pillar */}
          {post.pillarPost && (
            <div className="mb-8 rounded-lg border border-blue-200 bg-blue-50 p-4 dark:border-blue-900 dark:bg-blue-950/50">
              <span className="text-sm text-zinc-600 dark:text-zinc-400">Part of: </span>
              <Link
                href={`/blog/${post.pillarPost.slug.current}`}
                className="text-sm font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400"
              >
                {post.pillarPost.title} &rarr;
              </Link>
            </div>
          )}

          {post.leadTypes && post.leadTypes.length > 0 && (
            <div className="mb-8 rounded-lg border border-blue-200 bg-blue-50 p-4 dark:border-blue-900 dark:bg-blue-950/50">
              <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                Related lead types:{" "}
              </span>
              {post.leadTypes.map(
                (lt: { title: string; slug: { current: string }; icon?: string }, i: number) => (
                  <span key={lt.slug.current}>
                    <Link
                      href={`/lead-types/${lt.slug.current}`}
                      className="text-sm font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400"
                    >
                      {lt.icon} {lt.title}
                    </Link>
                    {i < post.leadTypes.length - 1 && <span className="text-zinc-400">, </span>}
                  </span>
                )
              )}
            </div>
          )}

          <InlineTextCta
            campaign="blog-post"
            leadType={post.leadTypes?.[0]?.title}
          />

          {post.body && (
            <div className="prose-wrapper">
              <PortableText
                value={post.body}
                campaign="blog-post"
                glossary={glossary || []}
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

          <div className="mt-10 border-t border-zinc-200 pt-6 dark:border-zinc-800">
            <p className="text-sm text-zinc-500">
              Our content follows a rigorous{" "}
              <Link
                href="/editorial-process"
                className="text-blue-600 hover:text-blue-700 dark:text-blue-400"
              >
                editorial process
              </Link>
              . Found an error?{" "}
              <a
                href="mailto:bill@agedleadsales.com"
                className="text-blue-600 hover:text-blue-700 dark:text-blue-400"
              >
                Let us know
              </a>
              .
            </p>
          </div>

          <div className="mt-12">
            <CtaBanner variant="compact" />
          </div>
        </div>
      </article>

      {post.relatedPosts && post.relatedPosts.length > 0 && (
        <section className="border-t border-zinc-200 bg-zinc-50 py-16 dark:border-zinc-800 dark:bg-zinc-900">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <h2 className="mb-8 text-2xl font-bold text-zinc-900 dark:text-white">
              Related Articles
            </h2>
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {post.relatedPosts.map(
                (rp: {
                  _id: string;
                  title: string;
                  slug: { current: string };
                  excerpt: string;
                  mainImage?: { asset?: { _ref: string }; alt?: string };
                  publishedAt?: string;
                }) => (
                  <PostCard
                    key={rp._id}
                    title={rp.title}
                    slug={rp.slug.current}
                    excerpt={rp.excerpt}
                    mainImage={rp.mainImage}
                    publishedAt={rp.publishedAt}
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
