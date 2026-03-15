import Link from "next/link";
import { sanityFetch } from "@/sanity/lib/fetch";
import { homepageDataQuery } from "@/sanity/lib/queries";
import { LeadTypeCard } from "@/components/lead-type-card";
import { PostCard } from "@/components/post-card";
import { PlaybookCard } from "@/components/playbook-card";
import { CtaBanner } from "@/components/cta-banner";
import { JsonLd, websiteJsonLd, organizationJsonLd } from "@/components/json-ld";
import { affiliateUrl } from "@/lib/affiliate";

const LEAD_TYPE_DEFAULTS = [
  {
    icon: "🏠",
    title: "Mortgage Leads",
    slug: "mortgage-leads",
    shortDescription:
      "Connect with homebuyers and refinancers who expressed interest in mortgage products. High-intent data at a fraction of real-time cost.",
  },
  {
    icon: "🛡️",
    title: "Insurance Leads",
    slug: "insurance-leads",
    shortDescription:
      "Reach consumers who previously requested quotes for auto, home, health, or life insurance products.",
  },
  {
    icon: "⚰️",
    title: "Final Expense Leads",
    slug: "final-expense-leads",
    shortDescription:
      "Access aged final expense and burial insurance leads — a proven market with high close rates using the right approach.",
  },
  {
    icon: "📈",
    title: "IUL Leads",
    slug: "iul-leads",
    shortDescription:
      "Indexed Universal Life leads from consumers who explored cash-value life insurance and wealth-building strategies.",
  },
  {
    icon: "⚖️",
    title: "SSDI Leads",
    slug: "ssdi-leads",
    shortDescription:
      "Social Security Disability Insurance leads from individuals who sought assistance with their disability claims.",
  },
  {
    icon: "🚗",
    title: "MVA Leads",
    slug: "mva-leads",
    shortDescription:
      "Motor Vehicle Accident leads for personal injury attorneys and legal services professionals.",
  },
  {
    icon: "☀️",
    title: "Solar Leads",
    slug: "solar-leads",
    shortDescription:
      "Homeowners who expressed interest in solar panel installation and renewable energy savings.",
  },
  {
    icon: "🏥",
    title: "Medicare Leads",
    slug: "medicare-leads",
    shortDescription:
      "Seniors approaching or in Medicare eligibility who explored supplement and advantage plan options.",
  },
];

export default async function HomePage() {
  const data = await sanityFetch(homepageDataQuery);

  const leadTypes =
    data?.leadTypes && data.leadTypes.length > 0
      ? data.leadTypes
      : LEAD_TYPE_DEFAULTS;
  const recentPosts = data?.recentPosts || [];
  const featuredPlaybooks = data?.featuredPlaybooks || [];

  return (
    <>
      <JsonLd data={websiteJsonLd()} />
      <JsonLd data={organizationJsonLd()} />

      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-zinc-900 via-zinc-900 to-blue-950">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-600/20 via-transparent to-transparent" />
        <div className="relative mx-auto max-w-7xl px-4 py-24 sm:px-6 sm:py-32 lg:px-8">
          <div className="max-w-3xl">
            <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">
              Grow Your Sales with{" "}
              <span className="text-blue-400">Aged Leads</span>
            </h1>
            <p className="mt-6 text-lg leading-relaxed text-zinc-300 sm:text-xl">
              Stop overpaying for real-time leads. Learn how to build a
              high-volume, high-profit sales operation using aged leads — with
              training, playbooks, and proven strategies for every industry.
            </p>
            <div className="mt-10 flex flex-col gap-4 sm:flex-row">
              <a
                href={affiliateUrl({ campaign: "homepage", content: "hero-cta" })}
                target="_blank"
                rel="nofollow sponsored noopener noreferrer"
                className="rounded-lg bg-blue-600 px-8 py-3.5 text-center text-base font-semibold text-white shadow-lg transition-colors hover:bg-blue-700"
              >
                Browse Leads at AgedLeadStore.com
              </a>
              <Link
                href="/playbooks"
                className="rounded-lg border border-zinc-600 px-8 py-3.5 text-center text-base font-semibold text-white transition-colors hover:bg-zinc-800"
              >
                View Playbooks
              </Link>
            </div>
          </div>

          {/* Stats */}
          <div className="mt-16 grid grid-cols-2 gap-8 sm:grid-cols-4">
            {[
              { value: "24+", label: "Years in Business" },
              { value: "A+", label: "BBB Rating" },
              { value: "$0.50", label: "Per Lead Starting" },
              { value: "1000+", label: "Leads per Order" },
            ].map((stat) => (
              <div key={stat.label}>
                <div className="text-3xl font-bold text-blue-400">
                  {stat.value}
                </div>
                <div className="mt-1 text-sm text-zinc-400">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Lead Types Grid */}
      <section className="bg-white py-20 dark:bg-zinc-950">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-zinc-900 dark:text-white sm:text-4xl">
              Aged Leads for Every Industry
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-zinc-600 dark:text-zinc-400">
              We carry aged leads across the most popular verticals. Click any
              lead type to learn strategies, see playbooks, and start buying.
            </p>
          </div>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {leadTypes.map(
              (lt: {
                _id?: string;
                title: string;
                slug: string | { current: string };
                shortDescription: string;
                icon?: string;
              }) => (
                <LeadTypeCard
                  key={lt._id || lt.title}
                  title={lt.title}
                  slug={
                    typeof lt.slug === "string" ? lt.slug : lt.slug.current
                  }
                  shortDescription={lt.shortDescription}
                  icon={lt.icon}
                />
              )
            )}
          </div>
          <div className="mt-10 text-center">
            <Link
              href="/lead-types"
              className="text-base font-semibold text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
            >
              View all lead types &rarr;
            </Link>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="border-y border-zinc-200 bg-zinc-50 py-20 dark:border-zinc-800 dark:bg-zinc-900">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-zinc-900 dark:text-white sm:text-4xl">
              How Aged Leads Work
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-zinc-600 dark:text-zinc-400">
              Aged leads are consumer records from people who previously
              expressed interest in a product or service. Here&apos;s why they work.
            </p>
          </div>
          <div className="mt-12 grid gap-8 md:grid-cols-3">
            {[
              {
                step: "1",
                title: "Massive Volume, Low Cost",
                description:
                  "Get 500–1,000+ records for the price of 10–15 real-time leads. Fill your pipeline without blowing your budget.",
              },
              {
                step: "2",
                title: "Real Intent, Real Context",
                description:
                  "These are real people who did express interest in your service 30–90+ days ago. You know their name, contact info, and what they needed.",
              },
              {
                step: "3",
                title: "Higher Profit Margins",
                description:
                  "Lower cost per lead means you only need a 1–2% conversion rate to dramatically outperform expensive real-time leads.",
              },
            ].map((item) => (
              <div
                key={item.step}
                className="rounded-xl border border-zinc-200 bg-white p-8 dark:border-zinc-800 dark:bg-zinc-950"
              >
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-full bg-blue-600 text-lg font-bold text-white">
                  {item.step}
                </div>
                <h3 className="text-xl font-semibold text-zinc-900 dark:text-white">
                  {item.title}
                </h3>
                <p className="mt-3 text-zinc-600 dark:text-zinc-400">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Recent Blog Posts */}
      {recentPosts.length > 0 && (
        <section className="bg-white py-20 dark:bg-zinc-950">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex items-end justify-between">
              <div>
                <h2 className="text-3xl font-bold text-zinc-900 dark:text-white">
                  Latest from the Blog
                </h2>
                <p className="mt-2 text-lg text-zinc-600 dark:text-zinc-400">
                  Tips, strategies, and insights for sales professionals.
                </p>
              </div>
              <Link
                href="/blog"
                className="hidden text-base font-semibold text-blue-600 hover:text-blue-700 dark:text-blue-400 sm:block"
              >
                View all posts &rarr;
              </Link>
            </div>
            <div className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {recentPosts
                .slice(0, 3)
                .map(
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
            <div className="mt-8 text-center sm:hidden">
              <Link
                href="/blog"
                className="text-base font-semibold text-blue-600"
              >
                View all posts &rarr;
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Featured Playbooks */}
      {featuredPlaybooks.length > 0 && (
        <section className="border-t border-zinc-200 bg-zinc-50 py-20 dark:border-zinc-800 dark:bg-zinc-900">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex items-end justify-between">
              <div>
                <h2 className="text-3xl font-bold text-zinc-900 dark:text-white">
                  Sales Playbooks
                </h2>
                <p className="mt-2 text-lg text-zinc-600 dark:text-zinc-400">
                  Step-by-step guides to master aged lead prospecting.
                </p>
              </div>
              <Link
                href="/playbooks"
                className="hidden text-base font-semibold text-blue-600 hover:text-blue-700 dark:text-blue-400 sm:block"
              >
                View all playbooks &rarr;
              </Link>
            </div>
            <div className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {featuredPlaybooks.map(
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

      {/* CTA */}
      <CtaBanner />
    </>
  );
}
