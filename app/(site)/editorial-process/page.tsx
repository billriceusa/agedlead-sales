import type { Metadata } from "next";
import Link from "next/link";
import { JsonLd, breadcrumbJsonLd } from "@/components/json-ld";
import { CONTACT_EMAIL } from "@/lib/site-url";

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://agedleadsales.com";

export const metadata: Metadata = {
  title: "Our Editorial Process",
  description:
    "How Work Aged Leads researches, writes, reviews, and maintains content. Our commitment to accuracy, independence, and transparency.",
  alternates: { canonical: `${baseUrl}/editorial-process` },
};

export default function EditorialProcessPage() {
  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", url: baseUrl },
          {
            name: "Editorial Process",
            url: `${baseUrl}/editorial-process`,
          },
        ])}
      />

      <section className="bg-white py-16 dark:bg-zinc-950">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <div className="mb-12">
            <h1 className="text-4xl font-bold text-zinc-900 dark:text-white">
              Our Editorial Process
            </h1>
            <p className="mt-4 text-lg text-zinc-600 dark:text-zinc-400">
              How we research, write, review, and maintain the content on this
              site &mdash; and why you can trust it.
            </p>
          </div>

          <div className="prose prose-zinc dark:prose-invert max-w-none">
            <h2>Who Writes Our Content</h2>
            <p>
              All content on Work Aged Leads is written and reviewed by{" "}
              <Link href="/about/bill-rice">Bill Rice</Link>, who brings 30+
              years of direct experience in lead generation, mortgage lending,
              insurance sales, and fintech marketing. Bill was Employee #7 at
              DeepGreen Bank, built EquityOnline at Quicken Loans, founded
              Kaleidico in 2005 (where he coined the term &quot;lead
              management&quot; and built icoSales, the first intelligent lead
              scoring and distribution platform for mortgage lead buyers),
              owned and operated Velocity Lending from 2016 to 2018, and has
              personally managed millions of leads across multiple industries.
            </p>
            <p>
              This is not a content farm. Every article, guide, playbook, and
              tool on this site is informed by hands-on experience with real
              campaigns, real budgets, and real results.
            </p>

            <h2>How We Research</h2>
            <p>Every piece of content follows a structured research process:</p>
            <ol>
              <li>
                <strong>Primary experience</strong> &mdash; we draw on decades
                of direct experience buying, selling, and optimizing aged leads
                across insurance, mortgage, solar, final expense, and other
                verticals
              </li>
              <li>
                <strong>Market analysis</strong> &mdash; we review current
                provider offerings, pricing, industry forums, and practitioner
                discussions to stay current
              </li>
              <li>
                <strong>Data verification</strong> &mdash; statistics and data
                points are sourced from authoritative references (.gov, .edu,
                industry associations, published research) and linked directly
              </li>
              <li>
                <strong>Competitive review</strong> &mdash; we analyze what
                other sources say about a topic and identify what they miss,
                oversimplify, or get wrong
              </li>
            </ol>

            <h2>Our Content Standards</h2>
            <ul>
              <li>
                <strong>Every factual claim is sourced.</strong> If we cite a
                statistic, there is a hyperlink to the original source. We do
                not use unsourced data points or fabricated statistics.
              </li>
              <li>
                <strong>Original analysis in every article.</strong> We do not
                simply restate what other sites say. Every piece includes our own
                perspective, frameworks, or recommendations based on real-world
                experience.
              </li>
              <li>
                <strong>Honest about trade-offs.</strong> We acknowledge
                downsides, limitations, and scenarios where our recommendations
                may not apply. We scope our advice explicitly.
              </li>
              <li>
                <strong>No fabricated testimonials or results.</strong> When we
                reference outcomes, they come from documented campaigns. When we
                use illustrative examples, they are clearly labeled as such.
              </li>
              <li>
                <strong>Opinionated but transparent.</strong> We take positions
                and make recommendations. We also explain our reasoning so you
                can evaluate whether our logic applies to your situation.
              </li>
            </ul>

            <h2>Provider Reviews</h2>
            <p>
              Our provider reviews and ratings follow a published{" "}
              <Link href="/methodology">methodology</Link> with six weighted
              dimensions. Key principles:
            </p>
            <ul>
              <li>
                Affiliate relationships do not influence scores (see our{" "}
                <Link href="/affiliate-disclosure">Affiliate Disclosure</Link>)
              </li>
              <li>
                Every provider profile includes both strengths and limitations
              </li>
              <li>
                All profiles show a &quot;Last Verified&quot; date
              </li>
              <li>
                Pricing benchmarks include confidence ratings so you know how
                reliable the data is
              </li>
            </ul>

            <h2>How We Maintain Content</h2>
            <p>
              Publishing is just the beginning. We maintain content through:
            </p>
            <ul>
              <li>
                <strong>Monthly provider reviews</strong> &mdash; every provider
                profile and pricing benchmark is reviewed on a monthly cycle
              </li>
              <li>
                <strong>Automated monitoring</strong> &mdash; our SEO audit
                system flags content that may need updating based on
                performance changes, competitive landscape shifts, or broken
                links
              </li>
              <li>
                <strong>Industry tracking</strong> &mdash; we monitor regulatory
                changes (FCC 1:1 consent rules, TCPA updates, state-level
                compliance changes) that affect lead buying advice
              </li>
              <li>
                <strong>&quot;Updated&quot; dates</strong> &mdash; when we
                refresh content, the updated date reflects the actual last
                review, not just a cosmetic change
              </li>
            </ul>

            <h2>Corrections Policy</h2>
            <p>
              We correct errors promptly. If you find inaccurate information,
              outdated data, or a broken link on this site, please email{" "}
              <a href={`mailto:${CONTACT_EMAIL}`}>
                {CONTACT_EMAIL}
              </a>{" "}
              and we will investigate and update the content. We do not
              silently change substantive claims &mdash; material corrections are
              noted.
            </p>

            <h2>Editorial Independence</h2>
            <p>
              Our editorial decisions &mdash; what to cover, how to rate
              providers, what to recommend &mdash; are made independently of any
              commercial relationship. We disclose all affiliate relationships
              and never allow them to influence our editorial content. This
              independence is what makes our content trustworthy, and we protect
              it rigorously.
            </p>
            <p>
              For more on how affiliate relationships work on this site, see
              our <Link href="/affiliate-disclosure">Affiliate Disclosure</Link>
              . For details on our rating system, see our{" "}
              <Link href="/methodology">Methodology</Link>.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
