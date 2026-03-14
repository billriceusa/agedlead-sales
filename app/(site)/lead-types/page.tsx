import type { Metadata } from "next";
import { sanityFetch } from "@/sanity/lib/fetch";
import { leadTypesQuery } from "@/sanity/lib/queries";
import { LeadTypeCard } from "@/components/lead-type-card";
import { CtaBanner } from "@/components/cta-banner";

export const metadata: Metadata = {
  title: "Aged Lead Types",
  description:
    "Browse aged leads by industry — mortgage, insurance, final expense, IUL, SSDI, MVA, solar, Medicare, and more. Learn strategies and buy leads at AgedLeadStore.com.",
};

const LEAD_TYPE_DEFAULTS = [
  {
    icon: "🏠",
    title: "Mortgage Leads",
    slug: "mortgage-leads",
    shortDescription:
      "Connect with homebuyers and refinancers who expressed interest in mortgage products.",
  },
  {
    icon: "🛡️",
    title: "Insurance Leads",
    slug: "insurance-leads",
    shortDescription:
      "Reach consumers who previously requested auto, home, health, or life insurance quotes.",
  },
  {
    icon: "⚰️",
    title: "Final Expense Leads",
    slug: "final-expense-leads",
    shortDescription:
      "Aged final expense and burial insurance leads with high close-rate potential.",
  },
  {
    icon: "📈",
    title: "IUL Leads",
    slug: "iul-leads",
    shortDescription:
      "Indexed Universal Life leads from consumers exploring cash-value life insurance.",
  },
  {
    icon: "⚖️",
    title: "SSDI Leads",
    slug: "ssdi-leads",
    shortDescription:
      "Social Security Disability Insurance leads from individuals seeking claim assistance.",
  },
  {
    icon: "🚗",
    title: "MVA Leads",
    slug: "mva-leads",
    shortDescription:
      "Motor Vehicle Accident leads for personal injury attorneys and legal professionals.",
  },
  {
    icon: "☀️",
    title: "Solar Leads",
    slug: "solar-leads",
    shortDescription:
      "Homeowners interested in solar panel installation and energy savings.",
  },
  {
    icon: "🏥",
    title: "Medicare Leads",
    slug: "medicare-leads",
    shortDescription:
      "Seniors exploring Medicare supplement and advantage plan options.",
  },
];

export default async function LeadTypesPage() {
  const leadTypes = (await sanityFetch(leadTypesQuery)) || [];

  const displayLeadTypes =
    leadTypes && leadTypes.length > 0 ? leadTypes : LEAD_TYPE_DEFAULTS;

  return (
    <>
      <section className="bg-white py-16 dark:bg-zinc-950">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-12">
            <h1 className="text-4xl font-bold text-zinc-900 dark:text-white">
              Aged Lead Types
            </h1>
            <p className="mt-4 max-w-3xl text-lg text-zinc-600 dark:text-zinc-400">
              We carry aged leads across the most popular sales verticals.
              Click any lead type to learn prospecting strategies, browse
              playbooks, and find links to purchase leads at AgedLeadStore.com.
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {displayLeadTypes.map(
              (lt: {
                _id?: string;
                title: string;
                slug: string | { current: string };
                shortDescription: string;
                icon?: string;
                affiliateUrl?: string;
              }) => (
                <LeadTypeCard
                  key={lt._id || lt.title}
                  title={lt.title}
                  slug={
                    typeof lt.slug === "string" ? lt.slug : lt.slug.current
                  }
                  shortDescription={lt.shortDescription}
                  icon={lt.icon}
                  affiliateUrl={lt.affiliateUrl}
                />
              )
            )}
          </div>
        </div>
      </section>

      {/* Value Proposition */}
      <section className="border-t border-zinc-200 bg-zinc-50 py-20 dark:border-zinc-800 dark:bg-zinc-900">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="text-3xl font-bold text-zinc-900 dark:text-white">
              Why Aged Leads?
            </h2>
            <p className="mt-4 text-lg text-zinc-600 dark:text-zinc-400">
              Aged leads let you build a high-volume sales pipeline at a
              fraction of the cost. Instead of paying $10–$50+ for a single
              real-time lead, you can get hundreds or thousands of aged records
              and close deals with the right approach.
            </p>
          </div>
          <div className="mt-12 grid gap-8 md:grid-cols-2">
            <div className="rounded-xl border-2 border-red-200 bg-white p-8 dark:border-red-900 dark:bg-zinc-950">
              <h3 className="text-xl font-bold text-red-600 dark:text-red-400">
                Real-Time Leads
              </h3>
              <ul className="mt-4 space-y-3 text-zinc-600 dark:text-zinc-400">
                <li className="flex items-start gap-2">
                  <span className="mt-0.5 text-red-500">✕</span>
                  $10–$50+ per lead
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-0.5 text-red-500">✕</span>
                  Must call within 5 seconds
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-0.5 text-red-500">✕</span>
                  Extremely competitive
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-0.5 text-red-500">✕</span>
                  $500 budget = ~20 leads
                </li>
              </ul>
            </div>
            <div className="rounded-xl border-2 border-blue-200 bg-white p-8 dark:border-blue-900 dark:bg-zinc-950">
              <h3 className="text-xl font-bold text-blue-600 dark:text-blue-400">
                Aged Leads
              </h3>
              <ul className="mt-4 space-y-3 text-zinc-600 dark:text-zinc-400">
                <li className="flex items-start gap-2">
                  <span className="mt-0.5 text-blue-500">✓</span>
                  $0.50–$2.00 per lead
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-0.5 text-blue-500">✓</span>
                  Work at your own pace
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-0.5 text-blue-500">✓</span>
                  Less competition
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-0.5 text-blue-500">✓</span>
                  $500 budget = 1,000+ leads
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <CtaBanner />
    </>
  );
}
