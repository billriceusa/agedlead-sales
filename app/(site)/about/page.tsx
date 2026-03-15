import type { Metadata } from "next";
import Link from "next/link";
import { CtaBanner } from "@/components/cta-banner";

export const metadata: Metadata = {
  title: "About",
  description:
    "Aged Lead Sales is founded by Bill Rice, a lead conversion expert with 20+ years of experience. Free training and strategies for sales professionals working with aged leads.",
};

export default function AboutPage() {
  return (
    <>
      <section className="bg-white py-16 dark:bg-zinc-950">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold text-zinc-900 dark:text-white">
            About Aged Lead Sales
          </h1>

          <div className="mt-8 space-y-6 text-lg leading-relaxed text-zinc-600 dark:text-zinc-400">
            <p>
              <strong className="text-zinc-900 dark:text-white">
                Aged Lead Sales
              </strong>{" "}
              is a training and strategy hub for sales professionals who want
              to build profitable businesses using aged leads. We provide free
              guides, playbooks, calculators, and scripts — all based on real
              experience, not theory.
            </p>

            <p>
              The site is founded and authored by{" "}
              <Link
                href="/about/bill-rice"
                className="text-blue-600 underline hover:text-blue-700 dark:text-blue-400"
              >
                Bill Rice
              </Link>
              , a lead conversion expert with 20+ years of hands-on experience
              across insurance, mortgage, solar, and home improvement. Bill has
              personally worked millions of leads and developed the systems
              that help salespeople turn aged data into closed deals.
            </p>

            <h2 className="pt-4 text-2xl font-bold text-zinc-900 dark:text-white">
              Why This Site Exists
            </h2>
            <p>
              Most sales training is written by people who&apos;ve never
              actually dialed a lead. The advice is generic, theoretical, and
              doesn&apos;t account for the unique economics of aged leads. Bill
              built Aged Lead Sales to fix that — providing specific, tested
              strategies that come from decades of doing the work himself.
            </p>
            <p>
              Every guide, every script, and every playbook on this site is
              grounded in real-world results. When we say a 2% conversion rate
              on aged leads beats a 10% rate on real-time leads, that&apos;s
              based on actual campaigns — not a spreadsheet exercise.
            </p>

            <h2 className="pt-4 text-2xl font-bold text-zinc-900 dark:text-white">
              What You&apos;ll Find Here
            </h2>
            <ul className="list-disc space-y-2 pl-6">
              <li>
                <Link href="/lead-types" className="text-blue-600 hover:text-blue-700 dark:text-blue-400">
                  Lead Type Guides
                </Link>{" "}
                — Deep dives into each vertical with industry-specific
                scripts, cost data, and strategies
              </li>
              <li>
                <Link href="/playbooks" className="text-blue-600 hover:text-blue-700 dark:text-blue-400">
                  Sales Playbooks
                </Link>{" "}
                — Step-by-step frameworks for working aged leads effectively
              </li>
              <li>
                <Link href="/blog" className="text-blue-600 hover:text-blue-700 dark:text-blue-400">
                  Blog
                </Link>{" "}
                — Tips, case studies, and industry analysis
              </li>
              <li>
                <Link href="/calculators" className="text-blue-600 hover:text-blue-700 dark:text-blue-400">
                  Free Calculators
                </Link>{" "}
                — ROI tools, pipeline planners, and lead cost calculators
              </li>
              <li>
                <Link href="/glossary" className="text-blue-600 hover:text-blue-700 dark:text-blue-400">
                  Glossary
                </Link>{" "}
                — 50+ definitions covering sales, insurance, mortgage, and
                lead generation terminology
              </li>
            </ul>

            <h2 className="pt-4 text-2xl font-bold text-zinc-900 dark:text-white">
              Our Relationship with AgedLeadStore.com
            </h2>
            <p>
              We partner with{" "}
              <strong className="text-zinc-900 dark:text-white">
                AgedLeadStore.com
              </strong>{" "}
              — one of the most trusted aged lead providers in the industry,
              operating since 2001 with an A+ BBB rating. When we link to
              AgedLeadStore.com, we earn a commission if you purchase leads.
              This is how we fund the free training and tools on this site.
            </p>
            <p>
              Our editorial content is independent. We recommend
              AgedLeadStore.com because Bill has worked with them directly and
              trusts their data quality, validation processes, and replacement
              guarantees — not because of the commission.
            </p>

            <h2 className="pt-4 text-2xl font-bold text-zinc-900 dark:text-white">
              Why AgedLeadStore.com?
            </h2>
            <div className="grid gap-4 sm:grid-cols-2">
              {[
                {
                  title: "24+ Years in Business",
                  description: "Operating since 2001 with a proven track record",
                },
                {
                  title: "A+ BBB Rating",
                  description: "Trusted by thousands of sales professionals",
                },
                {
                  title: "Proprietary Validation",
                  description: "Evergreen Lead Optimization keeps contact data fresh",
                },
                {
                  title: "Replacement Guarantee",
                  description: "Self-service dashboard to replace bad data instantly",
                },
              ].map((item) => (
                <div
                  key={item.title}
                  className="rounded-lg border border-zinc-200 p-4 dark:border-zinc-800"
                >
                  <h3 className="font-semibold text-zinc-900 dark:text-white">
                    {item.title}
                  </h3>
                  <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
                    {item.description}
                  </p>
                </div>
              ))}
            </div>

            <h2 className="pt-4 text-2xl font-bold text-zinc-900 dark:text-white">
              Meet the Author
            </h2>
            <div className="rounded-xl border border-zinc-200 bg-zinc-50 p-6 dark:border-zinc-800 dark:bg-zinc-900">
              <h3 className="text-xl font-bold text-zinc-900 dark:text-white">
                Bill Rice
              </h3>
              <p className="mt-1 text-sm text-blue-600 dark:text-blue-400">
                Founder & Lead Conversion Expert
              </p>
              <p className="mt-3 text-zinc-600 dark:text-zinc-400">
                20+ years building lead conversion systems. Former Air Force
                intelligence officer. Founder of Kaleidico. Marketing director
                for Aged Lead Store. Has personally worked millions of leads
                across insurance, mortgage, solar, and home improvement.
              </p>
              <Link
                href="/about/bill-rice"
                className="mt-4 inline-block text-sm font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400"
              >
                Full bio →
              </Link>
            </div>
          </div>
        </div>
      </section>

      <CtaBanner campaign="about" />
    </>
  );
}
