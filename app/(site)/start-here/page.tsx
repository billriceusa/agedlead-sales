import type { Metadata } from "next";
import Link from "next/link";
import { CtaBanner } from "@/components/cta-banner";
import { affiliateUrl } from "@/lib/affiliate";

export const metadata: Metadata = {
  title: "Start Here — Your Complete Guide to Working Aged Leads | Aged Lead Sales",
  description:
    "New to aged leads? This guided onboarding page walks you through the math, the systems, and the strategies that make aged leads the most profitable lead source in insurance, mortgage, and solar sales.",
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    {
      "@type": "ListItem",
      position: 1,
      name: "Home",
      item: "https://agedleadsales.com",
    },
    {
      "@type": "ListItem",
      position: 2,
      name: "Start Here",
      item: "https://agedleadsales.com/start-here",
    },
  ],
};

export default function StartHerePage() {
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
            New to Aged Leads? Start Here.
          </h1>

          <div className="mt-8 space-y-6 text-lg leading-relaxed text-zinc-600 dark:text-zinc-400">
            <p>
              If you&apos;re here for the first time, let me save you months of
              trial and error. I&apos;m{" "}
              <Link
                href="/about"
                className="font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400"
              >
                Bill Rice
              </Link>
              , and I&apos;ve spent 25+ years building lead generation systems
              and personally working millions of leads across insurance,
              mortgage, solar, and home improvement. This page is the roadmap I
              wish someone had given me on day one.
            </p>

            <p>
              Here&apos;s what you need to know:{" "}
              <strong className="text-zinc-900 dark:text-white">
                Aged leads are leads that were generated days, weeks, or months
                ago and weren&apos;t converted by the original buyer.
              </strong>{" "}
              Someone filled out a form requesting a quote, applied for
              insurance, or asked about a mortgage — but nobody closed them.
              Now they&apos;re available to you at a fraction of the original
              cost.
            </p>

            <p>
              They work. Exceptionally well, in fact. But most people fail with
              them because they follow advice from content marketers who have
              never sat in a dialing seat. They treat aged leads like fresh
              leads, get frustrated by lower contact rates on day one, and quit
              before the system has time to produce results. The advice out
              there — &ldquo;be persistent,&rdquo; &ldquo;follow up
              quickly&rdquo; — is so generic it&apos;s useless. Aged leads
              require a fundamentally different approach: different scripts,
              different cadences, different economics, and different
              expectations.
            </p>

            <p>
              That&apos;s what this site teaches. Everything here comes from
              real campaigns with real money on the line — not theory, not
              something I read in a blog. Let me walk you through it.
            </p>

            {/* ── The Math ──────────────────────────────── */}

            <h2 className="pt-4 text-2xl font-bold text-zinc-900 dark:text-white">
              The Math That Changes Everything
            </h2>

            <p>
              Before you learn a single script or build any system, you need to
              understand why aged leads win on economics. This is the
              comparison that converts every skeptic I&apos;ve ever trained:
            </p>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-lg border border-zinc-200 bg-zinc-50 p-5 dark:border-zinc-800 dark:bg-zinc-900">
                <h3 className="font-semibold text-zinc-900 dark:text-white">
                  Real-Time Leads
                </h3>
                <ul className="mt-3 space-y-1.5 text-base text-zinc-600 dark:text-zinc-400">
                  <li>Cost: <strong className="text-zinc-900 dark:text-white">$50/lead</strong></li>
                  <li>Conversion rate: <strong className="text-zinc-900 dark:text-white">10%</strong></li>
                  <li>Cost per sale: <strong className="text-zinc-900 dark:text-white">$500</strong></li>
                  <li>100 leads = <strong className="text-zinc-900 dark:text-white">$5,000 spent</strong></li>
                </ul>
              </div>
              <div className="rounded-lg border border-blue-200 bg-blue-50 p-5 dark:border-blue-900 dark:bg-blue-950/50">
                <h3 className="font-semibold text-zinc-900 dark:text-white">
                  Aged Leads
                </h3>
                <ul className="mt-3 space-y-1.5 text-base text-zinc-600 dark:text-zinc-400">
                  <li>Cost: <strong className="text-zinc-900 dark:text-white">$2/lead</strong></li>
                  <li>Conversion rate: <strong className="text-zinc-900 dark:text-white">2%</strong></li>
                  <li>Cost per sale: <strong className="text-zinc-900 dark:text-white">$100</strong></li>
                  <li>100 leads = <strong className="text-zinc-900 dark:text-white">$200 spent</strong></li>
                </ul>
              </div>
            </div>

            <p>
              Same number of sales from 100 leads of each type — but the aged
              leads cost you{" "}
              <strong className="text-zinc-900 dark:text-white">
                $4,800 less
              </strong>
              . Your cost per acquisition drops by 80%. That&apos;s not a
              marginal improvement. That&apos;s a completely different business
              model.
            </p>

            <p>
              Want to model your own numbers?{" "}
              <Link
                href="/calculators/roi-calculator"
                className="font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400"
              >
                Use the free ROI Calculator
              </Link>{" "}
              to plug in your actual costs, conversion rates, and revenue per
              sale. The math speaks for itself.
            </p>

            {/* ── Learning Path ─────────────────────────── */}

            <h2 className="pt-4 text-2xl font-bold text-zinc-900 dark:text-white">
              Your Learning Path
            </h2>

            <p>
              I&apos;ve organized everything on this site into three levels.
              Work through them in order, or jump to wherever you are in your
              journey. Each level builds on the one before it.
            </p>

            {/* Level 1 */}
            <div className="rounded-lg border border-zinc-200 p-6 dark:border-zinc-800">
              <div className="flex items-center gap-3">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-blue-100 text-sm font-bold text-blue-700 dark:bg-blue-900 dark:text-blue-300">
                  1
                </span>
                <h3 className="text-xl font-semibold text-zinc-900 dark:text-white">
                  Understand the Basics
                </h3>
              </div>
              <p className="mt-3 text-base text-zinc-600 dark:text-zinc-400">
                Before you spend a dollar, get clear on what aged leads actually
                are, how they differ across industries, and whether the
                economics work for your specific situation.
              </p>
              <ul className="mt-4 space-y-2.5">
                <li>
                  <Link
                    href="/glossary/aged-lead"
                    className="font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400"
                  >
                    What Is an Aged Lead?
                  </Link>{" "}
                  <span className="text-sm text-zinc-500 dark:text-zinc-500">
                    — The definition, how they&apos;re sourced, and why they
                    still convert
                  </span>
                </li>
                <li>
                  <Link
                    href="/lead-types"
                    className="font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400"
                  >
                    Lead Type Overview
                  </Link>{" "}
                  <span className="text-sm text-zinc-500 dark:text-zinc-500">
                    — Insurance, mortgage, solar, home improvement — find your
                    vertical
                  </span>
                </li>
                <li>
                  <Link
                    href="/calculators/roi-calculator"
                    className="font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400"
                  >
                    ROI Calculator
                  </Link>{" "}
                  <span className="text-sm text-zinc-500 dark:text-zinc-500">
                    — Model your cost per acquisition before you buy anything
                  </span>
                </li>
              </ul>
            </div>

            {/* Level 2 */}
            <div className="rounded-lg border border-zinc-200 p-6 dark:border-zinc-800">
              <div className="flex items-center gap-3">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-blue-100 text-sm font-bold text-blue-700 dark:bg-blue-900 dark:text-blue-300">
                  2
                </span>
                <h3 className="text-xl font-semibold text-zinc-900 dark:text-white">
                  Build Your System
                </h3>
              </div>
              <p className="mt-3 text-base text-zinc-600 dark:text-zinc-400">
                Aged leads don&apos;t reward talent — they reward discipline.
                You need a repeatable system: a follow-up cadence, a CRM that
                tracks every touch, and metrics that tell you what&apos;s
                working. Build the machine before you feed it leads.
              </p>
              <ul className="mt-4 space-y-2.5">
                <li>
                  <Link
                    href="/playbooks/7-day-follow-up-cadence"
                    className="font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400"
                  >
                    7-Day Follow-Up Cadence
                  </Link>{" "}
                  <span className="text-sm text-zinc-500 dark:text-zinc-500">
                    — The exact contact sequence that maximizes aged lead
                    conversion
                  </span>
                </li>
                <li>
                  <Link
                    href="/blog/aged-lead-crm-setup-guide"
                    className="font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400"
                  >
                    CRM Setup for Aged Leads
                  </Link>{" "}
                  <span className="text-sm text-zinc-500 dark:text-zinc-500">
                    — How to configure your CRM so nothing falls through the
                    cracks
                  </span>
                </li>
                <li>
                  <Link
                    href="/playbooks/roi-metrics"
                    className="font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400"
                  >
                    ROI Metrics Playbook
                  </Link>{" "}
                  <span className="text-sm text-zinc-500 dark:text-zinc-500">
                    — The numbers you must track weekly to know if your system
                    is working
                  </span>
                </li>
                <li>
                  <Link
                    href="/calculators/pipeline-calculator"
                    className="font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400"
                  >
                    Pipeline Calculator
                  </Link>{" "}
                  <span className="text-sm text-zinc-500 dark:text-zinc-500">
                    — Figure out how many leads you need to hit your monthly
                    revenue target
                  </span>
                </li>
              </ul>
            </div>

            {/* Level 3 */}
            <div className="rounded-lg border border-zinc-200 p-6 dark:border-zinc-800">
              <div className="flex items-center gap-3">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-blue-100 text-sm font-bold text-blue-700 dark:bg-blue-900 dark:text-blue-300">
                  3
                </span>
                <h3 className="text-xl font-semibold text-zinc-900 dark:text-white">
                  Master Your Vertical
                </h3>
              </div>
              <p className="mt-3 text-base text-zinc-600 dark:text-zinc-400">
                Every industry has its own buyer psychology, objection patterns,
                and conversion tactics. Once your system is running, go deep on
                the strategies specific to your market.
              </p>
              <ul className="mt-4 space-y-2.5">
                <li>
                  <Link
                    href="/blog/final-expense-door-knocking"
                    className="font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400"
                  >
                    Final Expense Door Knocking
                  </Link>{" "}
                  <span className="text-sm text-zinc-500 dark:text-zinc-500">
                    — How to use aged leads to fuel in-person insurance sales
                  </span>
                </li>
                <li>
                  <Link
                    href="/blog/mortgage-rate-shopping-leads"
                    className="font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400"
                  >
                    Mortgage Rate Shopping Leads
                  </Link>{" "}
                  <span className="text-sm text-zinc-500 dark:text-zinc-500">
                    — Why rate shoppers make excellent aged lead prospects
                  </span>
                </li>
                <li>
                  <Link
                    href="/blog/iul-conversion-strategies"
                    className="font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400"
                  >
                    IUL Conversion Strategies
                  </Link>{" "}
                  <span className="text-sm text-zinc-500 dark:text-zinc-500">
                    — Indexed Universal Life sales from aged insurance leads
                  </span>
                </li>
                <li>
                  <Link
                    href="/calculators/lead-cost-calculator"
                    className="font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400"
                  >
                    Lead Cost Calculator
                  </Link>{" "}
                  <span className="text-sm text-zinc-500 dark:text-zinc-500">
                    — Compare costs across lead types and vendors for your
                    vertical
                  </span>
                </li>
              </ul>
            </div>

            {/* ── Ready to Buy ──────────────────────────── */}

            <h2 className="pt-4 text-2xl font-bold text-zinc-900 dark:text-white">
              Ready to Buy Your First Batch?
            </h2>

            <p>
              Here&apos;s my advice for getting started — and I give this same
              advice to every salesperson I train, whether they&apos;re a solo
              agent or running a 50-seat call center:
            </p>

            <ol className="list-decimal space-y-3 pl-6 text-base">
              <li>
                <strong className="text-zinc-900 dark:text-white">
                  Buy 50&ndash;100 leads.
                </strong>{" "}
                Not 500. Not 1,000. You need enough to test your system without
                drowning in data you can&apos;t work properly. At $2&ndash;$5
                per lead, this is a $100&ndash;$500 investment — less than a
                single real-time lead in most verticals.
              </li>
              <li>
                <strong className="text-zinc-900 dark:text-white">
                  Work the full 7-day cadence.
                </strong>{" "}
                Don&apos;t call twice and give up. Follow the{" "}
                <Link
                  href="/playbooks/7-day-follow-up-cadence"
                  className="font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400"
                >
                  7-Day Follow-Up Cadence
                </Link>
                {" "}exactly as written — calls, texts, emails, in the right
                order at the right intervals. Most conversions happen on
                attempts 4 through 7, not 1 and 2.
              </li>
              <li>
                <strong className="text-zinc-900 dark:text-white">
                  Track everything for 4 weeks.
                </strong>{" "}
                Contact rate, conversation rate, appointment rate, close rate.
                You need at least one full cycle to know whether your system is
                working. Judging aged leads after 3 days is like judging a gym
                membership after one workout.
              </li>
              <li>
                <strong className="text-zinc-900 dark:text-white">
                  Optimize, then scale.
                </strong>{" "}
                Once you know your numbers — cost per contact, cost per
                appointment, cost per sale — you can scale with confidence.
                Double your lead volume, hire a second dialer, expand to a new
                lead type. But only after you&apos;ve proven the unit economics.
              </li>
            </ol>

            <p>
              When you&apos;re ready to buy your first batch, I recommend{" "}
              <a
                href={affiliateUrl({ campaign: "start-here", content: "first-batch-link" })}
                target="_blank"
                rel="nofollow sponsored noopener noreferrer"
                className="font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400"
              >
                AgedLeadStore.com
              </a>
              . They&apos;ve been in business 24+ years, their data validation
              system (Evergreen Lead Optimization) keeps contact info fresh,
              and they offer a self-service replacement guarantee. I&apos;ve
              worked with their team for years and trust their operation.
              Creating an account is free — you only pay when you buy leads.
            </p>

            <p className="font-medium text-zinc-900 dark:text-white">
              Now go build your system. I&apos;ll be here when you need me.
            </p>

            <p className="font-medium text-zinc-900 dark:text-white">
              — Bill Rice
            </p>
          </div>
        </div>
      </section>

      <CtaBanner campaign="start-here" />
    </>
  );
}
