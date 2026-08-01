import type { Metadata } from "next";
import Link from "next/link";
import { CtaBanner } from "@/components/cta-banner";
import { NewsletterSignup } from "@/components/newsletter-signup";
import { siteUrl } from "@/lib/site-url";

export const metadata: Metadata = {
  title: "Newsletter — Weekly Aged Lead Strategies & Scripts",
  description:
    "Subscribe to the Work Aged Leads newsletter. Weekly strategies, scripts, and insights for sales professionals who work aged leads. Delivered every Tuesday morning by Bill Rice.",
  alternates: { canonical: siteUrl("/newsletter") },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    {
      "@type": "ListItem",
      position: 1,
      name: "Home",
      item: siteUrl("/"),
    },
    {
      "@type": "ListItem",
      position: 2,
      name: "Newsletter",
      item: siteUrl("/newsletter"),
    },
  ],
};

export default function NewsletterPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* ── Hero Section ──────────────────────────────── */}
      <section className="bg-white py-16 dark:bg-zinc-950">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold text-zinc-900 dark:text-white">
            The Work Aged Leads Newsletter
          </h1>
          <p className="mt-6 text-lg leading-relaxed text-zinc-600 dark:text-zinc-400">
            Weekly strategies, scripts, and insights for sales professionals who
            work aged leads. Delivered every Tuesday morning by{" "}
            <Link
              href="/about"
              className="font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400"
            >
              Bill Rice
            </Link>
            .
          </p>
        </div>
      </section>

      {/* ── What You'll Get ───────────────────────────── */}
      <section className="border-t border-zinc-200 bg-zinc-50 py-16 dark:border-zinc-800 dark:bg-zinc-900">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-zinc-900 dark:text-white">
            What You&apos;ll Get Every Week
          </h2>
          <ul className="mt-6 space-y-4 text-lg text-zinc-600 dark:text-zinc-400">
            <li className="flex items-start gap-3">
              <span className="mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-blue-100 text-sm font-bold text-blue-700 dark:bg-blue-900 dark:text-blue-300">
                1
              </span>
              <span>
                <strong className="text-zinc-900 dark:text-white">
                  Exclusive tips not published on the blog
                </strong>{" "}
                — tactics, observations, and lessons from 25+ years of working
                leads that only newsletter subscribers receive
              </span>
            </li>
            <li className="flex items-start gap-3">
              <span className="mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-blue-100 text-sm font-bold text-blue-700 dark:bg-blue-900 dark:text-blue-300">
                2
              </span>
              <span>
                <strong className="text-zinc-900 dark:text-white">
                  Featured article spotlight with commentary
                </strong>{" "}
                — the best new content on the site with context on why it
                matters and how to apply it
              </span>
            </li>
            <li className="flex items-start gap-3">
              <span className="mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-blue-100 text-sm font-bold text-blue-700 dark:bg-blue-900 dark:text-blue-300">
                3
              </span>
              <span>
                <strong className="text-zinc-900 dark:text-white">
                  Industry insights and trend analysis
                </strong>{" "}
                — what&apos;s changing in insurance, mortgage, and solar lead
                markets and what it means for your pipeline
              </span>
            </li>
            <li className="flex items-start gap-3">
              <span className="mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-blue-100 text-sm font-bold text-blue-700 dark:bg-blue-900 dark:text-blue-300">
                4
              </span>
              <span>
                <strong className="text-zinc-900 dark:text-white">
                  Scripts, frameworks, and benchmarks you can use immediately
                </strong>{" "}
                — no fluff, no theory, just tools you can put to work the same
                day you read them
              </span>
            </li>
          </ul>
        </div>
      </section>

      {/* ── Newsletter Signup ─────────────────────────── */}
      <section className="bg-white py-16 dark:bg-zinc-950">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <NewsletterSignup
            variant="card"
            heading="Join the Newsletter"
            description="Free, no spam, unsubscribe anytime. Join thousands of sales professionals who start their Tuesday with actionable aged lead strategies."
            context="newsletter-page"
          />
        </div>
      </section>

      {/* ── Past Issues ───────────────────────────────── */}
      <section className="border-t border-zinc-200 bg-zinc-50 py-16 dark:border-zinc-800 dark:bg-zinc-900">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-zinc-900 dark:text-white">
            Past Issues
          </h2>
          <p className="mt-4 text-lg text-zinc-600 dark:text-zinc-400">
            Our newsletter launched in March 2026. Past issues will be archived
            here as they&apos;re published. Subscribe above so you don&apos;t
            miss the next one.
          </p>
        </div>
      </section>

      {/* ── About the Author ──────────────────────────── */}
      <section className="bg-white py-16 dark:bg-zinc-950">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <div className="rounded-xl border border-zinc-200 p-6 dark:border-zinc-800">
            <h2 className="text-xl font-bold text-zinc-900 dark:text-white">
              About Bill Rice
            </h2>
            <p className="mt-3 text-zinc-600 dark:text-zinc-400">
              Bill Rice has spent 30+ years in lead generation and fintech
              marketing. He was Employee #7 at DeepGreen Bank and built
              EquityOnline at Quicken Loans. In 2005 he founded Kaleidico,
              where he coined the term &ldquo;lead management&rdquo; and built
              icoSales — the first intelligent lead scoring and distribution
              platform for mortgage lead buyers. He owned and operated Velocity
              Lending (DTC mortgage lender, 2016-2018) and has personally
              worked millions of aged leads across insurance, mortgage, solar,
              and home improvement. Work Aged Leads is where he publishes what
              actually converts them — independent of any lead seller.
            </p>
            <Link
              href="/about"
              className="mt-4 inline-block text-sm font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400"
            >
              Read the full story &rarr;
            </Link>
          </div>
        </div>
      </section>

      <CtaBanner campaign="newsletter" />
    </>
  );
}
