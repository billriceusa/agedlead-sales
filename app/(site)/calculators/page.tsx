import type { Metadata } from "next";
import Link from "next/link";
import { CtaBanner } from "@/components/cta-banner";

export const metadata: Metadata = {
  title: "Free Sales Calculators & Tools",
  description:
    "Free calculators and interactive tools for sales professionals. ROI calculators, lead cost analysis, and prospecting tools — no sign-up required.",
};

const CALCULATORS = [
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
    title: "Pipeline Volume Calculator",
    slug: "pipeline-calculator",
    description:
      "Determine how many leads you need to hit your income goals based on your close rate and average deal size.",
    icon: "📈",
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
                className="relative flex flex-col rounded-xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900"
              >
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
