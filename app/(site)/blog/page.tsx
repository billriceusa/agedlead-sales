import type { Metadata } from "next";
import { siteUrl } from "@/lib/site-url";
import { sanityFetch } from "@/sanity/lib/fetch";
import { postsQuery } from "@/sanity/lib/queries";
import { PostCard } from "@/components/post-card";
import { CtaBanner } from "@/components/cta-banner";
import { NewsletterSignup } from "@/components/newsletter-signup";

export const metadata: Metadata = {
  title: "Aged Lead Strategies, Scripts & Industry Data",
  description:
    "Proven aged-lead strategies, call scripts, and pricing data for insurance agents, mortgage brokers, and sales pros — turn low-cost aged leads into closed deals.",
  alternates: { canonical: siteUrl("/blog") },
};

export default async function BlogPage() {
  const posts = (await sanityFetch(postsQuery)) || [];

  return (
    <>
      <section className="bg-white py-16 dark:bg-zinc-950">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-12">
            <h1 className="text-4xl font-bold text-zinc-900 dark:text-white">
              Blog
            </h1>
            <p className="mt-4 max-w-2xl text-lg text-zinc-600 dark:text-zinc-400">
              Sales tips, prospecting strategies, and industry insights to help
              you grow your business with aged leads.
            </p>
          </div>

          {posts.length > 0 ? (
            <>
              <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
                {posts.slice(0, 3).map(
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

              <div className="my-12">
                <NewsletterSignup
                  variant="card"
                  context="blog-listing"
                  heading="Get the Aged Lead Operator's Edge"
                  description="Every Tuesday — exclusive tactics, scripts, and benchmarks from 25+ years working aged leads. Tips not published on the blog. Free, unsubscribe anytime."
                />
              </div>

              {posts.length > 3 && (
                <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
                  {posts.slice(3).map(
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
              )}
            </>
          ) : (
            <div className="rounded-xl border border-zinc-200 bg-zinc-50 p-12 text-center dark:border-zinc-800 dark:bg-zinc-900">
              <p className="text-lg text-zinc-600 dark:text-zinc-400">
                No blog posts yet. Check back soon for sales tips, strategies,
                and industry insights.
              </p>
            </div>
          )}
        </div>
      </section>

      <CtaBanner variant="default" />
    </>
  );
}
