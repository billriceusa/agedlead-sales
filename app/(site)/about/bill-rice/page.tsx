import type { Metadata } from "next";
import Link from "next/link";
import { JsonLd, personPageJsonLd, breadcrumbJsonLd } from "@/components/json-ld";
import { Breadcrumbs } from "@/components/breadcrumbs";

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://agedleadsales.com";

export const metadata: Metadata = {
  title: "Bill Rice – Founder & Lead Conversion Expert",
  description:
    "Bill Rice has 30+ years building lead conversion systems across insurance, mortgage, and solar. Founder of Kaleidico. Marketing director for Aged Lead Store.",
  alternates: { canonical: `${baseUrl}/about/bill-rice` },
};

export default function BillRicePage() {
  return (
    <>
      <JsonLd data={personPageJsonLd()} />
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", url: baseUrl },
          { name: "About", url: `${baseUrl}/about` },
          { name: "Bill Rice", url: `${baseUrl}/about/bill-rice` },
        ])}
      />

      <section className="bg-white py-16 dark:bg-zinc-950">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <Breadcrumbs
            items={[
              { label: "About", href: "/about" },
              { label: "Bill Rice" },
            ]}
          />

          <header className="mb-10">
            <h1 className="text-3xl font-bold text-zinc-900 dark:text-white sm:text-4xl">
              Bill Rice
            </h1>
            <p className="mt-2 text-lg text-blue-600 dark:text-blue-400">
              Founder & Lead Conversion Expert
            </p>
          </header>

          <div className="space-y-6 text-lg leading-relaxed text-zinc-600 dark:text-zinc-400">
            <p>
              Bill Rice has spent over 20 years building lead conversion systems
              that work — across insurance, mortgage, solar, and home
              improvement industries. He&apos;s personally worked millions of
              leads and developed the training frameworks that help sales
              professionals turn aged leads into closed deals at scale.
            </p>

            <h2 className="pt-4 text-2xl font-bold text-zinc-900 dark:text-white">
              Background
            </h2>
            <p>
              Bill started his career as a{" "}
              <strong className="text-zinc-900 dark:text-white">
                U.S. Air Force Office of Special Investigations (AFOSI) Special
                Agent and case officer
              </strong>
              , where he developed the systematic thinking and process
              discipline that would later define his approach to lead
              conversion. After the military, he spent decades designing and
              building consumer-direct banking and lending platforms — working
              with institutions like Quicken Loans and building mortgage
              companies from the ground up.
            </p>
            <p>
              Through that work, Bill discovered a fundamental problem: the
              economics of lead generation are broken for most salespeople.
              Real-time leads cost $15-$60+ each, competition is fierce, and
              most agents burn through their budgets before they can build
              sustainable pipelines.
            </p>

            <h2 className="pt-4 text-2xl font-bold text-zinc-900 dark:text-white">
              Aged Lead Expertise
            </h2>
            <p>
              Bill identified aged leads as the solution — consumer records that
              cost 80-95% less than real-time leads, giving salespeople the
              volume they need to build predictable income. But volume alone
              isn&apos;t enough. Bill developed complete systems for working aged
              leads: outreach cadences, scripts, compliance frameworks, and ROI
              tracking methodologies that turn raw data into revenue.
            </p>
            <p>
              As{" "}
              <strong className="text-zinc-900 dark:text-white">
                marketing director for Aged Lead Store
              </strong>{" "}
              (the industry&apos;s most trusted aged lead provider, operating
              since 2001 with an A+ BBB rating), Bill creates the training
              courses, scripts, and content that help thousands of sales
              professionals master the aged lead approach.
            </p>

            <h2 className="pt-4 text-2xl font-bold text-zinc-900 dark:text-white">
              Current Work
            </h2>
            <p>
              Bill is the founder and CEO of{" "}
              <a
                href="https://kaleidico.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 underline hover:text-blue-700 dark:text-blue-400"
              >
                Kaleidico
              </a>
              , a digital agency specializing in lead generation systems for
              mortgage, legal, and financial services companies. He also runs{" "}
              <a
                href="https://www.howtoworkleads.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 underline hover:text-blue-700 dark:text-blue-400"
              >
                How To Work Leads
              </a>
              , an educational platform for lead conversion best practices.
            </p>
            <p>
              At Aged Lead Sales, Bill writes the guides, playbooks, and
              training content based on his direct experience — not theory. When
              he writes about calling scripts, conversion rates, or outreach
              cadences, it comes from decades of doing it himself.
            </p>

            <h2 className="pt-4 text-2xl font-bold text-zinc-900 dark:text-white">
              Connect
            </h2>
            <ul className="space-y-2">
              <li>
                <a
                  href="https://billrice.com/about"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 underline hover:text-blue-700 dark:text-blue-400"
                >
                  Full Career Profile ↗
                </a>
              </li>
              <li>
                <a
                  href="https://kaleidico.com/bill-rice/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 underline hover:text-blue-700 dark:text-blue-400"
                >
                  Kaleidico ↗
                </a>
              </li>
              <li>
                <a
                  href="https://www.howtoworkleads.com/resources/about"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 underline hover:text-blue-700 dark:text-blue-400"
                >
                  How To Work Leads ↗
                </a>
              </li>
              <li>
                <a
                  href="https://medium.com/@billrice"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 underline hover:text-blue-700 dark:text-blue-400"
                >
                  Medium ↗
                </a>
              </li>
            </ul>
          </div>
        </div>
      </section>
    </>
  );
}
