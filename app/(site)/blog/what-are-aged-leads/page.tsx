import type { Metadata } from "next";
import Link from "next/link";
import { CtaBanner } from "@/components/cta-banner";
import { NewsletterSignup } from "@/components/newsletter-signup";
import { JsonLd, articleJsonLd, breadcrumbJsonLd } from "@/components/json-ld";
import { affiliateUrl } from "@/lib/affiliate";

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://agedleadsales.com";

export const metadata: Metadata = {
  title: "What Are Aged Leads? Complete Guide for Sales Pros (2026)",
  description:
    "Aged leads are consumer records from people who expressed interest 30-180+ days ago. Learn what they cost, how to work them, and why they deliver better ROI than real-time leads.",
  alternates: { canonical: `${baseUrl}/blog/what-are-aged-leads` },
  openGraph: {
    title: "What Are Aged Leads? Complete Guide for Sales Professionals",
    description:
      "Everything you need to know about aged leads — what they are, how they compare to real-time leads, and how to work them for maximum ROI.",
    type: "article",
    publishedTime: "2026-03-14",
    url: `${baseUrl}/blog/what-are-aged-leads`,
    images: [
      {
        url: `${baseUrl}/api/og?title=${encodeURIComponent("What Are Aged Leads?")}&category=Guide&type=blog`,
      },
    ],
  },
};

export default function WhatAreAgedLeadsPage() {
  return (
    <>
      <JsonLd
        data={articleJsonLd({
          title: "What Are Aged Leads? The Complete Guide for Sales Professionals",
          description:
            "Everything you need to know about aged leads — what they are, how they compare to real-time leads, what they cost, and how to work them.",
          slug: "what-are-aged-leads",
          publishedAt: "2026-03-14",
        })}
      />
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", url: baseUrl },
          { name: "Blog", url: `${baseUrl}/blog` },
          { name: "What Are Aged Leads?", url: `${baseUrl}/blog/what-are-aged-leads` },
        ])}
      />

      <article className="bg-white py-12 dark:bg-zinc-950">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <nav className="mb-8 text-sm text-zinc-500">
            <Link href="/blog" className="hover:text-zinc-700 dark:hover:text-zinc-300">Blog</Link>
            <span className="mx-2">/</span>
            <span className="text-zinc-900 dark:text-white">What Are Aged Leads?</span>
          </nav>

          <header className="mb-10">
            <span className="mb-3 inline-block rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-800 dark:bg-blue-900/30 dark:text-blue-400">
              Getting Started
            </span>
            <span className="mb-3 ml-2 inline-block rounded-full bg-zinc-100 px-3 py-0.5 text-xs font-medium uppercase tracking-wider text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400">
              Comprehensive Guide
            </span>
            <h1 className="text-3xl font-bold text-zinc-900 dark:text-white sm:text-4xl lg:text-5xl">
              What Are Aged Leads? The Complete Guide for Sales Professionals
            </h1>
            <p className="mt-4 text-lg text-zinc-600 dark:text-zinc-400">
              Everything you need to know about aged leads — what they are, why they exist,
              how they compare to real-time leads, and how to turn them into closed deals.
            </p>
            <time dateTime="2026-03-14" className="mt-4 block text-sm text-zinc-500">
              March 14, 2026
            </time>
          </header>

          {/* Table of Contents */}
          <div className="mb-12 rounded-xl border border-zinc-200 bg-zinc-50 p-6 dark:border-zinc-800 dark:bg-zinc-900">
            <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-zinc-500">
              In This Guide
            </h2>
            <ol className="space-y-1.5 text-sm">
              {[
                ["#what-are-aged-leads", "What Are Aged Leads?"],
                ["#how-they-work", "How Aged Leads Work"],
                ["#aged-vs-real-time", "Aged Leads vs. Real-Time Leads"],
                ["#cost", "How Much Do Aged Leads Cost?"],
                ["#types", "Types of Aged Leads"],
                ["#how-to-work", "How to Work Aged Leads"],
                ["#script", "The \"Honest Follow-Up\" Script"],
                ["#roi", "ROI: The Math That Makes It Work"],
                ["#getting-started", "Getting Started"],
              ].map(([href, label], i) => (
                <li key={href}>
                  <a href={href} className="text-blue-600 hover:text-blue-700 dark:text-blue-400">
                    {i + 1}. {label}
                  </a>
                </li>
              ))}
            </ol>
          </div>

          {/* Content */}
          <div className="space-y-8">
            <section id="what-are-aged-leads">
              <h2 className="mb-4 text-2xl font-bold text-zinc-900 dark:text-white sm:text-3xl">
                What Are Aged Leads?
              </h2>
              <p className="mb-4 leading-relaxed text-zinc-600 dark:text-zinc-400">
                An <Link href="/glossary/aged-lead" className="text-blue-600 hover:text-blue-700 dark:text-blue-400">aged lead</Link> is a consumer data record from someone who previously expressed interest in a product or service — typically 30 to 180+ days ago. These are real people who filled out a form online, requested a quote, or submitted an inquiry for services like insurance, mortgage loans, solar installation, legal representation, or Medicare coverage.
              </p>
              <p className="mb-4 leading-relaxed text-zinc-600 dark:text-zinc-400">
                The &quot;aged&quot; part simply means the lead is older. When a consumer fills out a form, that lead is initially sold as a &quot;real-time&quot; or &quot;fresh&quot; lead to agents and salespeople who pay a premium to contact the consumer immediately. After 30+ days, those same records become &quot;aged leads&quot; and are resold at a dramatically lower price — often 80-95% less.
              </p>
              <p className="leading-relaxed text-zinc-600 dark:text-zinc-400">
                The key insight: <strong className="text-zinc-900 dark:text-white">most of these consumers still need the product they searched for.</strong> Life doesn&apos;t stop after 30 days. Mortgages still need closing, insurance coverage is still needed, disability claims are still pending, and solar panels still save money. Aged leads give you access to these consumers at a price that makes high-volume prospecting financially viable.
              </p>
            </section>

            <section id="how-they-work">
              <h2 className="mb-4 text-2xl font-bold text-zinc-900 dark:text-white sm:text-3xl">
                How Aged Leads Work
              </h2>
              <p className="mb-4 leading-relaxed text-zinc-600 dark:text-zinc-400">
                The aged lead lifecycle follows a predictable path:
              </p>
              <ol className="mb-4 space-y-4">
                {[
                  ["Consumer submits information", "A person searches for insurance quotes, mortgage rates, or legal help online. They fill out a form with their name, contact information, and details about what they need."],
                  ["Lead is sold in real-time", "The lead is immediately sold to 3-8 buyers for $15-$60+ each. A speed-to-call race begins — whoever contacts the consumer fastest wins."],
                  ["Lead ages out", "After 30+ days, the real-time window closes. Many consumers were never successfully contacted, lost interest in one vendor but not the product, or are still comparison shopping."],
                  ["Lead is resold as aged", "The same record is now available as an aged lead for $0.25-$5. Sales professionals buy these records in bulk and work them through personal, multi-channel outreach."],
                ].map(([title, desc], i) => (
                  <li key={i} className="flex items-start gap-4">
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-blue-100 text-sm font-bold text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">
                      {i + 1}
                    </span>
                    <div>
                      <strong className="text-zinc-900 dark:text-white">{title}.</strong>{" "}
                      <span className="text-zinc-600 dark:text-zinc-400">{desc}</span>
                    </div>
                  </li>
                ))}
              </ol>
            </section>

            <section id="aged-vs-real-time">
              <h2 className="mb-4 text-2xl font-bold text-zinc-900 dark:text-white sm:text-3xl">
                Aged Leads vs. Real-Time Leads
              </h2>
              <p className="mb-6 leading-relaxed text-zinc-600 dark:text-zinc-400">
                The differences come down to cost, competition, and approach:
              </p>
              <div className="mb-6 overflow-x-auto">
                <table className="w-full rounded-lg border border-zinc-200 text-left text-sm dark:border-zinc-800">
                  <thead className="bg-zinc-50 dark:bg-zinc-900">
                    <tr>
                      <th className="px-4 py-3 font-semibold text-zinc-900 dark:text-white">Factor</th>
                      <th className="px-4 py-3 font-semibold text-red-600 dark:text-red-400">Real-Time Leads</th>
                      <th className="px-4 py-3 font-semibold text-blue-600 dark:text-blue-400">Aged Leads</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-200 text-zinc-600 dark:divide-zinc-800 dark:text-zinc-400">
                    {[
                      ["Cost per lead", "$15–$60+", "$0.25–$5"],
                      ["Competition", "5-10 simultaneous buyers", "Little to none"],
                      ["Response rate", "20-40%", "5-15%"],
                      ["Conversion rate", "5-15%", "1-5%"],
                      ["Volume per $500", "10-30 leads", "100-2,000 leads"],
                      ["Timing pressure", "Must call within seconds", "Work at your own pace"],
                      ["Best for", "High-budget, speed-focused teams", "Volume-focused professionals"],
                    ].map(([factor, rt, aged]) => (
                      <tr key={factor}>
                        <td className="px-4 py-3 font-medium text-zinc-900 dark:text-white">{factor}</td>
                        <td className="px-4 py-3">{rt}</td>
                        <td className="px-4 py-3">{aged}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>

            <section id="cost">
              <h2 className="mb-4 text-2xl font-bold text-zinc-900 dark:text-white sm:text-3xl">
                How Much Do Aged Leads Cost?
              </h2>
              <p className="mb-6 leading-relaxed text-zinc-600 dark:text-zinc-400">
                Aged lead pricing varies by industry, lead age, and geographic targeting. Here are typical ranges:
              </p>
              <div className="mb-6 overflow-x-auto">
                <table className="w-full rounded-lg border border-zinc-200 text-left text-sm dark:border-zinc-800">
                  <thead className="bg-zinc-50 dark:bg-zinc-900">
                    <tr>
                      <th className="px-4 py-3 font-semibold text-zinc-900 dark:text-white">Lead Type</th>
                      <th className="px-4 py-3 font-semibold text-zinc-900 dark:text-white">Aged Lead Cost</th>
                      <th className="px-4 py-3 font-semibold text-zinc-900 dark:text-white">Real-Time Cost</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-200 text-zinc-600 dark:divide-zinc-800 dark:text-zinc-400">
                    {[
                      ["Insurance", "$0.25–$2", "$15–$50"],
                      ["Mortgage", "$0.50–$3", "$25–$60"],
                      ["Final Expense", "$0.50–$3", "$20–$40"],
                      ["IUL", "$1–$5", "$30–$75"],
                      ["Solar", "$0.50–$3", "$20–$50"],
                      ["Medicare", "$0.50–$3", "$15–$40"],
                      ["SSDI", "$0.50–$3", "$20–$50"],
                      ["MVA", "$1–$5", "$50–$200"],
                    ].map(([type, aged, rt]) => (
                      <tr key={type}>
                        <td className="px-4 py-3 font-medium text-zinc-900 dark:text-white">
                          <Link href={`/lead-types/${type?.toString().toLowerCase().replace(/\s+/g, "-")}-leads`} className="text-blue-600 hover:text-blue-700 dark:text-blue-400">{type}</Link>
                        </td>
                        <td className="px-4 py-3">{aged}</td>
                        <td className="px-4 py-3">{rt}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p className="leading-relaxed text-zinc-600 dark:text-zinc-400">
                Use our <Link href="/calculators/roi-calculator" className="text-blue-600 hover:text-blue-700 dark:text-blue-400">free ROI Calculator</Link> to compare the economics for your specific situation.
              </p>
            </section>

            {/* Mid-article CTA */}
            <CtaBanner
              variant="compact"
              headline="Ready to Try Aged Leads?"
              description="Browse thousands of affordable aged leads at AgedLeadStore.com — no commitment required."
              buttonText="Browse Aged Leads"
              buttonHref={affiliateUrl({ campaign: "blog-what-are-aged-leads", content: "mid-article-cta" })}
              campaign="blog-what-are-aged-leads"
            />

            <section id="types">
              <h2 className="mb-4 text-2xl font-bold text-zinc-900 dark:text-white sm:text-3xl">
                Types of Aged Leads
              </h2>
              <p className="mb-4 leading-relaxed text-zinc-600 dark:text-zinc-400">
                Aged leads are available across virtually every industry where consumers request information online. The most popular verticals include:
              </p>
              <div className="grid gap-3 sm:grid-cols-2">
                {[
                  { icon: "🏠", name: "Mortgage Leads", slug: "mortgage-leads", desc: "Home purchase, refinance, HELOC" },
                  { icon: "🛡️", name: "Insurance Leads", slug: "insurance-leads", desc: "Auto, home, life, health" },
                  { icon: "⚰️", name: "Final Expense Leads", slug: "final-expense-leads", desc: "Burial and funeral insurance" },
                  { icon: "📈", name: "IUL Leads", slug: "iul-leads", desc: "Indexed Universal Life" },
                  { icon: "☀️", name: "Solar Leads", slug: "solar-leads", desc: "Solar panel installation" },
                  { icon: "🏥", name: "Medicare Leads", slug: "medicare-leads", desc: "Supplement, Advantage, Part D" },
                  { icon: "⚖️", name: "SSDI Leads", slug: "ssdi-leads", desc: "Disability claims" },
                  { icon: "🚗", name: "MVA Leads", slug: "mva-leads", desc: "Auto accident / personal injury" },
                ].map((lt) => (
                  <Link
                    key={lt.slug}
                    href={`/lead-types/${lt.slug}`}
                    className="flex items-center gap-3 rounded-lg border border-zinc-200 bg-zinc-50 p-4 transition-colors hover:border-blue-300 dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-blue-700"
                  >
                    <span className="text-2xl">{lt.icon}</span>
                    <div>
                      <span className="font-medium text-zinc-900 dark:text-white">{lt.name}</span>
                      <p className="text-xs text-zinc-500">{lt.desc}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </section>

            <section id="how-to-work">
              <h2 className="mb-4 text-2xl font-bold text-zinc-900 dark:text-white sm:text-3xl">
                How to Work Aged Leads
              </h2>
              <p className="mb-4 leading-relaxed text-zinc-600 dark:text-zinc-400">
                The biggest mistake with aged leads is treating them like real-time leads. You can&apos;t call once and expect a sale. Success comes from a systematic, multi-channel <Link href="/glossary/follow-up-cadence" className="text-blue-600 hover:text-blue-700 dark:text-blue-400">follow-up cadence</Link>:
              </p>
              <ol className="mb-6 space-y-3">
                {[
                  ["Day 1: Direct Mail", "Send a personal letter or postcard — something physical that stands out from digital noise."],
                  ["Day 3: Phone Call", "Use the Honest Follow-Up script (below). Keep it brief, helpful, and low-pressure."],
                  ["Day 4: Email", "Send a plain-text email — no HTML templates. Personal and conversational."],
                  ["Day 7: Second Call", "Try again at a different time of day. Leave a voicemail if no answer."],
                  ["Day 10: Final Touch", "Door knock (if local) or send a second email with additional value."],
                ].map(([title, desc], i) => (
                  <li key={i} className="flex items-start gap-3">
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-blue-100 text-xs font-bold text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">
                      {i + 1}
                    </span>
                    <div className="text-zinc-600 dark:text-zinc-400">
                      <strong className="text-zinc-900 dark:text-white">{title}.</strong> {desc}
                    </div>
                  </li>
                ))}
              </ol>
            </section>

            <section id="script">
              <h2 className="mb-4 text-2xl font-bold text-zinc-900 dark:text-white sm:text-3xl">
                The &quot;Honest Follow-Up&quot; Script
              </h2>
              <p className="mb-4 leading-relaxed text-zinc-600 dark:text-zinc-400">
                The single most effective approach for aged leads is radical honesty. Don&apos;t pretend you have a relationship that doesn&apos;t exist. Instead:
              </p>
              <blockquote className="mb-6 rounded-xl border-2 border-blue-200 bg-blue-50 p-6 text-lg italic leading-relaxed text-zinc-700 dark:border-blue-900 dark:bg-blue-950/50 dark:text-zinc-300">
                &quot;Hi [Name], this is [Your Name]. I&apos;m doing a follow-up on some older inquiry records from [Month] regarding [Product/Service]. It doesn&apos;t look like we ever spoke, so I wanted to make sure you were able to get what you needed — or is this still on your to-do list?&quot;
              </blockquote>
              <p className="mb-4 font-semibold text-zinc-900 dark:text-white">
                Why this works:
              </p>
              <ul className="space-y-2 text-zinc-600 dark:text-zinc-400">
                {[
                  "It acknowledges the timeline honestly (\"older inquiry\")",
                  "It doesn't fake a relationship (\"doesn't look like we ever spoke\")",
                  "It's low-pressure (\"make sure you got what you needed\")",
                  "It captures procrastinators while giving others an easy out",
                ].map((reason) => (
                  <li key={reason} className="flex items-start gap-2">
                    <span className="mt-0.5 text-blue-500">✓</span>
                    {reason}
                  </li>
                ))}
              </ul>
            </section>

            <section id="roi">
              <h2 className="mb-4 text-2xl font-bold text-zinc-900 dark:text-white sm:text-3xl">
                ROI: The Math That Makes It Work
              </h2>
              <p className="mb-6 leading-relaxed text-zinc-600 dark:text-zinc-400">
                Here&apos;s why aged leads deliver better <Link href="/glossary/roi" className="text-blue-600 hover:text-blue-700 dark:text-blue-400">ROI</Link> despite lower conversion rates. Consider a $500 monthly budget:
              </p>
              <div className="mb-6 grid gap-6 sm:grid-cols-2">
                <div className="rounded-xl border-2 border-red-200 p-5 dark:border-red-900">
                  <h3 className="text-lg font-bold text-red-600 dark:text-red-400">Real-Time Leads</h3>
                  <p className="mt-2 text-3xl font-bold text-zinc-900 dark:text-white">$500 → 16 leads</p>
                  <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">at $30/lead, 10% conversion = <strong>~2 sales</strong></p>
                </div>
                <div className="rounded-xl border-2 border-blue-200 p-5 dark:border-blue-900">
                  <h3 className="text-lg font-bold text-blue-600 dark:text-blue-400">Aged Leads</h3>
                  <p className="mt-2 text-3xl font-bold text-zinc-900 dark:text-white">$500 → 500 leads</p>
                  <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">at $1/lead, 2% conversion = <strong>~10 sales</strong></p>
                </div>
              </div>
              <p className="leading-relaxed text-zinc-600 dark:text-zinc-400">
                <strong className="text-zinc-900 dark:text-white">5x more sales from the same budget.</strong> That&apos;s the aged lead advantage. Run your own numbers with our <Link href="/calculators/roi-calculator" className="text-blue-600 hover:text-blue-700 dark:text-blue-400">free ROI Calculator</Link>.
              </p>
            </section>

            <section id="getting-started">
              <h2 className="mb-4 text-2xl font-bold text-zinc-900 dark:text-white sm:text-3xl">
                Getting Started with Aged Leads
              </h2>
              <ol className="space-y-3 text-zinc-600 dark:text-zinc-400">
                {[
                  ["Choose your lead type", "Pick the vertical that matches your business — insurance, mortgage, final expense, solar, etc."],
                  ["Start small", "Buy 100-200 leads to test your process and scripts before scaling up."],
                  ["Set up a CRM", "Track every contact attempt, outcome, and follow-up. Without a system, leads fall through the cracks."],
                  ["Use the Honest Follow-Up script", "Don't fake familiarity. Be transparent about why you're calling."],
                  ["Work the cadence", "Plan for 5-7 touches across phone, email, and mail over 10-14 days."],
                  ["Track your numbers", "Measure contact rate, conversion rate, and cost per acquisition. Adjust and scale."],
                ].map(([title, desc], i) => (
                  <li key={i} className="flex items-start gap-3">
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-blue-100 text-xs font-bold text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">
                      {i + 1}
                    </span>
                    <div>
                      <strong className="text-zinc-900 dark:text-white">{title}.</strong> {desc}
                    </div>
                  </li>
                ))}
              </ol>
            </section>
          </div>

          <div className="mt-12">
            <NewsletterSignup
              variant="card"
              heading="Get Weekly Aged Lead Tips"
              description="Strategies, scripts, and insights for sales professionals working with aged leads. Free, no spam."
              context="blog-what-are-aged-leads"
            />
          </div>
        </div>
      </article>

      <CtaBanner campaign="blog-what-are-aged-leads" />
    </>
  );
}
