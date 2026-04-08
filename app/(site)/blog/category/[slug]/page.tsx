import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { sanityFetch } from "@/sanity/lib/fetch";
import {
  categoryBySlugQuery,
  postsByCategoryQuery,
  categoriesQuery,
} from "@/sanity/lib/queries";
import { PostCard } from "@/components/post-card";
import { CtaBanner } from "@/components/cta-banner";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { JsonLd, breadcrumbJsonLd } from "@/components/json-ld";

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://agedleadsales.com";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const category: any = await sanityFetch(categoryBySlugQuery, { slug });
  if (!category) return {};

  const title = `${category.title} Articles — Aged Lead Sales Blog`;
  const description =
    category.description ||
    `Browse all articles about ${category.title.toLowerCase()} — sales tips, strategies, and insights for aged lead professionals.`;

  return {
    title,
    description,
    alternates: { canonical: `${baseUrl}/blog/category/${slug}` },
    openGraph: {
      title,
      description,
      url: `${baseUrl}/blog/category/${slug}`,
    },
  };
}

export async function generateStaticParams() {
  const categories =
    (await sanityFetch<{ slug: { current: string } }[]>(categoriesQuery)) || [];
  return categories.map((cat) => ({ slug: cat.slug.current }));
}

export default async function CategoryPage({ params }: Props) {
  const { slug } = await params;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const category: any = await sanityFetch(categoryBySlugQuery, { slug });
  if (!category) notFound();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const posts: any[] =
    (await sanityFetch(postsByCategoryQuery, {
      categoryId: category._id,
    })) || [];

  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", url: baseUrl },
          { name: "Blog", url: `${baseUrl}/blog` },
          {
            name: category.title,
            url: `${baseUrl}/blog/category/${category.slug.current}`,
          },
        ])}
      />

      <section className="bg-white py-16 dark:bg-zinc-950">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Breadcrumbs
            items={[
              { label: "Blog", href: "/blog" },
              { label: category.title },
            ]}
          />

          <div className="mb-12">
            <h1 className="text-4xl font-bold text-zinc-900 dark:text-white">
              {category.title}
            </h1>
            {category.description && (
              <p className="mt-4 max-w-2xl text-lg text-zinc-600 dark:text-zinc-400">
                {category.description}
              </p>
            )}
            <p className="mt-2 text-sm text-zinc-500">
              {posts.length} {posts.length === 1 ? "article" : "articles"}
            </p>
          </div>

          {posts.length > 0 ? (
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {posts.map(
                (post: {
                  _id: string;
                  title: string;
                  slug: { current: string };
                  excerpt: string;
                  mainImage?: { asset?: { _ref: string }; alt?: string };
                  publishedAt?: string;
                  author?: { name: string };
                }) => (
                  <PostCard
                    key={post._id}
                    title={post.title}
                    slug={post.slug.current}
                    excerpt={post.excerpt}
                    mainImage={post.mainImage}
                    publishedAt={post.publishedAt}
                    author={post.author}
                  />
                )
              )}
            </div>
          ) : (
            <div className="rounded-xl border border-zinc-200 bg-zinc-50 p-12 text-center dark:border-zinc-800 dark:bg-zinc-900">
              <p className="text-lg text-zinc-600 dark:text-zinc-400">
                No articles in this category yet. Check back soon.
              </p>
              <Link
                href="/blog"
                className="mt-4 inline-block text-sm font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400"
              >
                &larr; Back to all articles
              </Link>
            </div>
          )}
        </div>
      </section>

      <CtaBanner variant="default" />
    </>
  );
}
