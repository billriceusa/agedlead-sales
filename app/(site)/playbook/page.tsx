import type { Metadata } from "next";
import Link from "next/link";
import { allFlagshipVerticals } from "@/data/flagship-verticals";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { JsonLd, breadcrumbJsonLd } from "@/components/json-ld";
import { PostCard } from "@/components/post-card";
import { NextStepRouter } from "@/components/next-step-router";
import { sanityFetch } from "@/sanity/lib/fetch";
import { postsByCategorySlugsQuery } from "@/sanity/lib/queries";

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://agedleadsales.com";

// Operations cluster: tactics that turn the playbook into daily reps —
// scripts/outreach, strategies, compliance, getting-started.
const PLAYBOOK_CLUSTER_CATEGORIES = [
  "strategies",
  "scripts-outreach",
  "compliance",
  "getting-started",
];

export const metadata: Metadata = {
  title: "The Aged Lead Operator's System — Free Playbook",
  description:
    "The complete playbook, workbook, and 10-day email course for working aged leads. Choose your vertical: Mortgage, Insurance, or Home Services.",
  alternates: { canonical: `${baseUrl}/playbook` },
};

interface ClusterPost {
  _id: string;
  title: string;
  slug: { current: string };
  excerpt?: string;
  mainImage?: { asset?: { _ref: string }; alt?: string };
  publishedAt?: string;
}

export default async function PlaybookIndexPage() {
  const verticals = allFlagshipVerticals();
  const clusterPosts =
    ((await sanityFetch(postsByCategorySlugsQuery, {
      slugs: PLAYBOOK_CLUSTER_CATEGORIES,
    })) as ClusterPost[] | null) || [];

  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", url: baseUrl },
          { name: "Playbook", url: `${baseUrl}/playbook` },
        ])}
      />

      <section className="bg-gradient-to-br from-zinc-950 via-blue-950 to-zinc-900 py-20 text-white">
        <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
          <p className="text-sm font-semibold uppercase tracking-wider text-blue-300">
            Free Playbook + Workbook + 10-Day Email Course
          </p>
          <h1 className="mt-3 text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
            The Aged Lead Operator&apos;s System
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-zinc-300">
            The complete operator&apos;s manual for turning cheap aged leads into closed deals. Scripts, unit economics, cadence, nurture, compliance — built by someone who actually dials.
          </p>
          <p className="mt-8 text-sm font-medium uppercase tracking-wider text-zinc-400">
            Choose your vertical
          </p>
        </div>
      </section>

      <section className="bg-white py-16 dark:bg-zinc-950">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <Breadcrumbs items={[{ label: "Playbook" }]} />

          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {verticals.map((v) => (
              <Link
                key={v.slug}
                href={`/playbook/${v.slug}`}
                className="group flex flex-col rounded-2xl border-2 border-zinc-200 bg-white p-6 transition hover:border-blue-500 hover:shadow-lg dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-blue-500"
              >
                <div className="text-4xl">{v.icon}</div>
                <h2 className="mt-4 text-xl font-bold text-zinc-900 dark:text-white">
                  {v.title}
                </h2>
                <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
                  {v.subtitle}
                </p>
                <div className="mt-4 flex items-baseline gap-2">
                  <span className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                    {v.proofStat.number}
                  </span>
                  <span className="text-xs text-zinc-500">{v.proofStat.label}</span>
                </div>
                <span className="mt-6 inline-flex items-center gap-1 text-sm font-semibold text-blue-600 group-hover:gap-2 dark:text-blue-400">
                  Get the {v.title} Playbook
                  <span className="transition-all">→</span>
                </span>
              </Link>
            ))}
          </div>

          <div className="mx-auto mt-20 max-w-3xl rounded-2xl bg-zinc-50 p-8 dark:bg-zinc-900">
            <h2 className="text-2xl font-bold text-zinc-900 dark:text-white">What you get</h2>
            <ul className="mt-4 space-y-2 text-zinc-700 dark:text-zinc-300">
              <li className="flex items-start gap-2">
                <span className="mt-0.5 text-blue-500">✓</span>
                <span>
                  <strong>The Playbook (PDF)</strong> — 40+ pages of scripts, unit-economics math, cadence, nurture, and compliance. Tuned to your vertical.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-0.5 text-blue-500">✓</span>
                <span>
                  <strong>The Workbook (PDF)</strong> — 10 fillable worksheets that turn the playbook into your own operating plan.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-0.5 text-blue-500">✓</span>
                <span>
                  <strong>The 10-day Email Course</strong> — 5 emails (Days 0, 2, 4, 7, 10) walking you through setup, outreach, nurture, and compliance.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-0.5 text-blue-500">✓</span>
                <span>
                  <strong>Tuesday tactical newsletter</strong> — after the course, one idea a week to sharpen your operation.
                </span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/*
        Internal routing, not a door — Click Loop iteration P4, 2026-10-05.

        /playbook drew 409 views and produced 1 affiliate click in the measured
        window. The reader here is an operator: they have decided to do the work
        and are about to build a cadence. What the page never gave them was a
        route to the supply side, which is where the system's own math comes
        from — so the three destinations below are the inputs the playbook
        assumes the reader already has.

        Deliberately NOT a store door. The door pattern has been killed three
        times on these low-intent surfaces (ledger kills[], iterations 1, 5, 6).
        Every href here is first-party.

        Vertical choice stays with the three playbook cards above; this block
        does not re-ask it, which is why it routes to hubs and to one worked
        review rather than to a single vertical's buying guide.
      */}
      <NextStepRouter
        heading="The system assumes you bought well"
        intro="Scripts and cadence cannot rescue a file that was overpriced, or one from a seller who will not say where the data came from. Settle the supply side before you run week one."
        items={[
          {
            href: "/providers",
            label: "Compare aged lead providers",
            description:
              "Independent six-dimension ratings of the sellers we have reviewed — pricing transparency, verticals covered, data age and replacement terms, each with a verification date.",
            icon: "providers",
          },
          {
            href: "/blog/aged-lead-store-review-2026",
            label: "A seller vetted end to end",
            description:
              "One provider taken apart in full: catalog, data sourcing, replacement policy, and where it falls short. Useful mainly as the list of questions to put to any seller.",
            icon: "review",
          },
          {
            href: "/price-index",
            label: "Lead Price Index",
            description:
              "The playbook's unit economics all start from a cost-per-lead input. This is where that number comes from — quarterly benchmarks by vertical, with the sourcing shown.",
            icon: "pricing",
          },
        ]}
      />

      {clusterPosts.length > 0 && (
        <section className="border-t border-zinc-200 bg-zinc-50 py-16 dark:border-zinc-800 dark:bg-zinc-950/50">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl">
              <h2 className="text-2xl font-bold text-zinc-900 dark:text-white">
                Operator deep-dives
              </h2>
              <p className="mt-2 text-zinc-600 dark:text-zinc-400">
                Tactical articles that pair with the playbook — scripts that
                close, follow-up cadence, compliance, and unit-economics math.
              </p>
            </div>
            <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {clusterPosts.slice(0, 6).map((p) => (
                <PostCard
                  key={p._id}
                  title={p.title}
                  slug={p.slug.current}
                  excerpt={p.excerpt || ""}
                  mainImage={p.mainImage}
                  publishedAt={p.publishedAt}
                />
              ))}
            </div>
            <div className="mt-8">
              <Link
                href="/blog"
                className="text-sm font-semibold text-blue-600 hover:text-blue-700 dark:text-blue-400"
              >
                Browse all articles &rarr;
              </Link>
            </div>
          </div>
        </section>
      )}
    </>
  );
}
