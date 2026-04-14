import type { Metadata } from "next";
import Link from "next/link";
import { allFlagshipVerticals } from "@/data/flagship-verticals";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { JsonLd, breadcrumbJsonLd } from "@/components/json-ld";

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://agedleadsales.com";

export const metadata: Metadata = {
  title: "The Aged Lead Operator's System — Free Playbook",
  description:
    "The complete playbook, workbook, and 10-day email course for working aged leads. Choose your vertical: Mortgage, Insurance, or Home Services.",
  alternates: { canonical: `${baseUrl}/playbook` },
};

export default function PlaybookIndexPage() {
  const verticals = allFlagshipVerticals();

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
    </>
  );
}
