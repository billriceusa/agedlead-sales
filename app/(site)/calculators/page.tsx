import type { Metadata } from "next";
import Link from "next/link";
import { CtaBanner } from "@/components/cta-banner";
import { JsonLd, breadcrumbJsonLd } from "@/components/json-ld";

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://agedleadsales.com";

export const metadata: Metadata = {
  title: "Free Sales Calculators & Tools",
  description:
    "Free calculators and interactive tools for sales professionals. ROI calculators, lead cost analysis, and prospecting tools — no sign-up required.",
  alternates: { canonical: `${baseUrl}/calculators` },
  openGraph: {
    title: "Free Sales Calculators & Tools | Aged Lead Sales",
    description:
      "5 free interactive tools: pipeline volume calculator, Know Your CPL, ROI calculator, lead cost calculator, and outreach cadence planner. No sign-up required.",
    url: `${baseUrl}/calculators`,
    images: [
      {
        url: `${baseUrl}/api/og?title=${encodeURIComponent("Free Sales Calculators & Tools")}&category=Free Tools&type=calculator`,
      },
    ],
  },
};

const CALCULATORS = [
  {
    title: "Pipeline Volume Calculator",
    slug: "pipeline-calculator",
    description:
      "Determine how many leads you need to hit your income goals based on your close rate and average deal size. Our most-used tool — start here.",
    icon: "📈",
    status: "live",
    popular: true,
  },
  {
    title: "Know Your CPL",
    slug: "know-your-cpl",
    description:
      "Calculate your maximum cost per lead based on your vertical, close rate, and deal value. Compare aged vs. real-time ROI side by side.",
    icon: "🎯",
    status: "live",
  },
  {
    title: "Aged Lead ROI Calculator",
    slug: "roi-calculator",
    description:
      "Compare the ROI of aged leads vs. real-time leads. Input your budget, conversion rates, and deal values to see the difference.",
    icon: "📊",
    status: "live",
  },
  {
    title: "Lead Cost Calculator",
    slug: "lead-cost-calculator",
    description:
      "Calculate your true cost per acquisition when factoring in lead cost, contact rate, and conversion rate.",
    icon: "💰",
    status: "live",
  },
  {
    title: "Outreach Cadence Planner",
    slug: "outreach-cadence-planner",
    description:
      "Plan your multi-channel follow-up sequence for aged leads — calls, emails, direct mail, and door knocking.",
    icon: "📅",
    status: "live",
  },
];

export default function CalculatorsPage() {
  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", url: baseUrl },
          { name: "Calculators", url: `${baseUrl}/calculators` },
        ])}
      />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "ItemList",
          name: "Free Sales Calculators",
          description:
            "Interactive tools for sales professionals to calculate ROI, lead costs, pipeline volume, and outreach cadences.",
          numberOfItems: CALCULATORS.length,
          itemListElement: CALCULATORS.map((calc, i) => ({
            "@type": "ListItem",
            position: i + 1,
            name: calc.title,
            url: `${baseUrl}/calculators/${calc.slug}`,
          })),
        }}
      />
      <section className="bg-white py-16 dark:bg-zinc-950">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-12">
            <h1 className="text-4xl font-bold text-zinc-900 dark:text-white">
              Free Sales Calculators
            </h1>
            <p className="mt-4 max-w-2xl text-lg text-zinc-600 dark:text-zinc-400">
              Interactive tools to help you analyze deals, plan your pipeline,
              and maximize your return on aged leads. No sign-up required.
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2">
            {CALCULATORS.map((calc) => (
              <div
                key={calc.slug}
                className={`relative flex flex-col rounded-xl border bg-white p-6 dark:bg-zinc-900 ${
                  calc.popular
                    ? "border-blue-500 ring-1 ring-blue-500/40 dark:border-blue-500"
                    : "border-zinc-200 dark:border-zinc-800"
                }`}
              >
                {calc.popular && (
                  <span className="absolute right-4 top-4 rounded-full bg-blue-100 px-2.5 py-1 text-xs font-semibold text-blue-700 dark:bg-blue-900/50 dark:text-blue-300">
                    Most popular
                  </span>
                )}
                <span className="mb-3 text-3xl">{calc.icon}</span>
                <h2 className="text-xl font-semibold text-zinc-900 dark:text-white">
                  {calc.title}
                </h2>
                <p className="mt-2 flex-1 text-sm text-zinc-600 dark:text-zinc-400">
                  {calc.description}
                </p>
                <Link
                  href={`/calculators/${calc.slug}`}
                  className="mt-4 inline-flex items-center text-sm font-semibold text-blue-600 hover:text-blue-700 dark:text-blue-400"
                >
                  Open Calculator &rarr;
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      <CtaBanner />
    </>
  );
}
