import type { Metadata } from "next";
import { CtaBanner } from "@/components/cta-banner";

export const metadata: Metadata = {
  title: "About",
  description:
    "Learn about Aged Lead Store — 24+ years helping sales professionals grow their businesses with affordable, high-volume aged leads.",
};

export default function AboutPage() {
  return (
    <>
      <section className="bg-white py-16 dark:bg-zinc-950">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold text-zinc-900 dark:text-white">
            About Aged Lead Store
          </h1>

          <div className="mt-8 space-y-6 text-lg leading-relaxed text-zinc-600 dark:text-zinc-400">
            <p>
              <strong className="text-zinc-900 dark:text-white">
                Aged Lead Store
              </strong>{" "}
              has been helping sales professionals build profitable businesses
              since 2001. With over 24 years of experience and an A+ BBB
              rating, we&apos;re one of the most trusted sources for aged
              consumer data in the industry.
            </p>

            <p>
              This site is your training hub — a resource for sales
              professionals across insurance, mortgage, legal, solar, and other
              industries who want to learn how to incorporate aged leads into
              their sales operation.
            </p>

            <h2 className="pt-4 text-2xl font-bold text-zinc-900 dark:text-white">
              What Are Aged Leads?
            </h2>
            <p>
              Aged leads are consumer data records from people who previously
              expressed interest in a product or service — typically 30 to 90+
              days ago. They originally filled out a form, requested a quote, or
              expressed intent on a website.
            </p>
            <p>
              Because these records are older, they cost a fraction of what
              real-time leads cost. Instead of paying $10–$50+ per lead and
              competing in a speed-to-call race, you can purchase hundreds or
              thousands of aged records and work them at your own pace with the
              right outreach strategy.
            </p>

            <h2 className="pt-4 text-2xl font-bold text-zinc-900 dark:text-white">
              What You&apos;ll Find Here
            </h2>
            <ul className="list-disc space-y-2 pl-6">
              <li>
                <strong className="text-zinc-900 dark:text-white">
                  Lead Type Guides
                </strong>{" "}
                — Learn about each lead vertical (mortgage, insurance, final
                expense, IUL, SSDI, MVA, solar, Medicare, and more)
              </li>
              <li>
                <strong className="text-zinc-900 dark:text-white">
                  Sales Playbooks
                </strong>{" "}
                — Step-by-step frameworks and scripts for working aged leads
                effectively
              </li>
              <li>
                <strong className="text-zinc-900 dark:text-white">
                  Blog Articles
                </strong>{" "}
                — Tips, strategies, case studies, and industry insights
              </li>
            </ul>

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
                  description:
                    "Evergreen Lead Optimization keeps contact data fresh",
                },
                {
                  title: "Replacement Guarantee",
                  description:
                    "Self-service dashboard to replace bad data instantly",
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
          </div>
        </div>
      </section>

      <CtaBanner />
    </>
  );
}
