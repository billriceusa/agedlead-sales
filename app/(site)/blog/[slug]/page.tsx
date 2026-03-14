import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { sanityFetch } from "@/sanity/lib/fetch";
import { postBySlugQuery } from "@/sanity/lib/queries";
import { urlForImage } from "@/sanity/lib/image";
import { PortableText } from "@/components/portable-text";
import { PostCard } from "@/components/post-card";
import { CtaBanner } from "@/components/cta-banner";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const post: any = await sanityFetch(postBySlugQuery, { slug });
  if (!post) return {};

  return {
    title: post.seoTitle || post.title,
    description: post.seoDescription || post.excerpt,
    openGraph: {
      title: post.seoTitle || post.title,
      description: post.seoDescription || post.excerpt,
      type: "article",
      publishedTime: post.publishedAt,
      ...(post.mainImage && {
        images: [
          {
            url: urlForImage(post.mainImage)?.width(1200).height(630).url() || "",
          },
        ],
      }),
    },
  };
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const post: any = await sanityFetch(postBySlugQuery, { slug });
  if (!post) notFound();

  const imageUrl = post.mainImage
    ? urlForImage(post.mainImage)?.width(1200).url()
    : undefined;

  return (
    <>
      <article className="bg-white py-12 dark:bg-zinc-950">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb */}
          <nav className="mb-8 text-sm text-zinc-500">
            <Link
              href="/blog"
              className="hover:text-zinc-700 dark:hover:text-zinc-300"
            >
              Blog
            </Link>
            <span className="mx-2">/</span>
            <span className="text-zinc-900 dark:text-white">{post.title}</span>
          </nav>

          {/* Header */}
          <header className="mb-10">
            {post.categories && post.categories.length > 0 && (
              <div className="mb-4 flex flex-wrap gap-2">
                {post.categories.map(
                  (cat: { title: string; slug: { current: string } }) => (
                    <span
                      key={cat.slug.current}
                      className="rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-800 dark:bg-blue-900/30 dark:text-blue-400"
                    >
                      {cat.title}
                    </span>
                  )
                )}
              </div>
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
                        src={
                          urlForImage(post.author.image)
                            ?.width(80)
                            .height(80)
                            .url() || ""
                        }
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
                <time
                  dateTime={post.publishedAt}
                  className="text-sm text-zinc-500"
                >
                  {new Date(post.publishedAt).toLocaleDateString("en-US", {
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                  })}
                </time>
              )}
            </div>
          </header>

          {/* Featured Image */}
          {imageUrl && (
            <div className="mb-10 overflow-hidden rounded-xl">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={imageUrl}
                alt={post.mainImage?.alt || post.title}
                className="w-full"
              />
            </div>
          )}

          {/* Related Lead Types */}
          {post.leadTypes && post.leadTypes.length > 0 && (
            <div className="mb-8 rounded-lg border border-blue-200 bg-blue-50 p-4 dark:border-blue-900 dark:bg-blue-950/50">
              <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                Related lead types:{" "}
              </span>
              {post.leadTypes.map(
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
                    {i < post.leadTypes.length - 1 && (
                      <span className="text-zinc-400">, </span>
                    )}
                  </span>
                )
              )}
            </div>
          )}

          {/* Body */}
          {post.body && (
            <div className="prose-wrapper">
              <PortableText value={post.body} />
            </div>
          )}

          {/* Inline CTA */}
          <div className="mt-12">
            <CtaBanner variant="compact" />
          </div>
        </div>
      </article>

      {/* Related Posts */}
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
