import type { Metadata } from "next";
import Link from "next/link";
import { LeadMagnetCta } from "@/components/lead-magnet-cta";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { JsonLd, breadcrumbJsonLd } from "@/components/json-ld";
import { CtaBanner } from "@/components/cta-banner";

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://agedleadsales.com";

export const metadata: Metadata = {
  title: "Free Resources — Aged Lead Sales",
  description:
    "Free downloadable tools for sales professionals: follow-up cadence sheets, lead scripts, ROI scorecards, buying checklists, and route planners. No cost — just enter your email.",
  alternates: { canonical: `${baseUrl}/resources` },
};

const resources = [
  {
    id: "7-day-cadence",
    title: "7-Day Follow-Up Cadence Cheat Sheet",
    description:
      "A day-by-day outreach sequence for your first week with a new batch of aged leads. Covers calls, emails, and texts with suggested timing and scripts.",
    features: [
      "7-day multi-channel cadence map",
      "Call, email, and SMS timing",
      "Opening scripts for each touchpoint",
      "When to stop and move on",
    ],
    downloadUrl: "/downloads/7-day-follow-up-cadence.pdf",
    category: "Cadence & Workflow",
  },
  {
    id: "scripts-bundle",
    title: "Aged Lead Scripts Bundle",
    description:
      "Tested phone scripts for the most common aged lead scenarios: first contact, the 'I don't remember' objection, follow-up calls, and voicemail drops.",
    features: [
      "5 proven cold call openers",
      "Objection handling frameworks",
      "Voicemail scripts that get callbacks",
      "Email follow-up templates",
    ],
    downloadUrl: "/downloads/aged-lead-scripts-bundle.pdf",
    category: "Scripts & Templates",
  },
  {
    id: "roi-scorecard",
    title: "Weekly ROI Scorecard",
    description:
      "Track your aged lead performance week by week. Log dials, contacts, appointments, closes, and revenue to calculate your true ROI and identify what to optimize.",
    features: [
      "Weekly tracking template",
      "Auto-calculated conversion rates",
      "Cost per acquisition formula",
      "Break-even analysis",
    ],
    downloadUrl: "/downloads/weekly-roi-scorecard.pdf",
    category: "Tracking & Analytics",
  },
  {
    id: "lead-buying-checklist",
    title: "Lead Buying Checklist",
    description:
      "Before you buy a single lead, run through this checklist. Covers provider vetting, pricing red flags, compliance requirements, and volume planning.",
    features: [
      "Provider evaluation criteria",
      "Pricing transparency checks",
      "Compliance requirements by vertical",
      "Volume and budget planning",
    ],
    downloadUrl: "/downloads/lead-buying-checklist.pdf",
    category: "Buying & Evaluation",
  },
  {
    id: "door-knocking-planner",
    title: "Door-Knocking Route Planner",
    description:
      "For agents who work aged leads in person. Plan efficient door-knocking routes, track visit outcomes, and manage your follow-up schedule for face-to-face prospecting.",
    features: [
      "Route planning template",
      "Visit outcome tracker",
      "Follow-up scheduling",
      "Leave-behind material checklist",
    ],
    downloadUrl: "/downloads/door-knocking-route-planner.pdf",
    category: "Field Sales",
  },
];

export default function ResourcesPage() {
  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", url: baseUrl },
          { name: "Resources", url: `${baseUrl}/resources` },
        ])}
      />

      <section className="bg-white py-16 dark:bg-zinc-950">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Breadcrumbs items={[{ label: "Resources" }]} />

          <div className="mb-12">
            <h1 className="text-4xl font-bold text-zinc-900 dark:text-white">
              Free Resources
            </h1>
            <p className="mt-4 max-w-2xl text-lg text-zinc-600 dark:text-zinc-400">
              Downloadable tools, templates, and checklists for sales
              professionals working aged leads. Free &mdash; just enter your
              email and we&apos;ll send the download link.
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {resources.map((resource) => (
              <div key={resource.id} className="flex">
                <LeadMagnetCta
                  variant="card"
                  heading={resource.title}
                  description={resource.description}
                  buttonText="Get Free Download"
                  leadMagnetId={resource.id}
                  features={resource.features}
                  context={`resources-${resource.id}`}
                  downloadUrl={resource.downloadUrl}
                />
              </div>
            ))}
          </div>

          <div className="mt-16 rounded-xl border border-zinc-200 bg-zinc-50 p-8 dark:border-zinc-800 dark:bg-zinc-900">
            <h2 className="text-xl font-bold text-zinc-900 dark:text-white">
              More free tools
            </h2>
            <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
              In addition to these downloadable resources, we offer free
              interactive calculators:
            </p>
            <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
              {[
                { name: "ROI Calculator", href: "/calculators/roi-calculator" },
                {
                  name: "Lead Cost Calculator",
                  href: "/calculators/lead-cost-calculator",
                },
                {
                  name: "Pipeline Planner",
                  href: "/calculators/pipeline-calculator",
                },
                {
                  name: "Outreach Cadence",
                  href: "/calculators/outreach-cadence-planner",
                },
                {
                  name: "Know Your CPL",
                  href: "/calculators/know-your-cpl",
                },
              ].map((calc) => (
                <Link
                  key={calc.href}
                  href={calc.href}
                  className="rounded-lg border border-zinc-200 bg-white p-3 text-center text-sm font-medium text-zinc-900 transition-colors hover:border-blue-300 hover:bg-blue-50 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white dark:hover:border-blue-700"
                >
                  {calc.name}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      <CtaBanner />
    </>
  );
}
