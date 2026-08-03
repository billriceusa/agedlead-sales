import type { Metadata } from "next";
import Link from "next/link";
import { JsonLd, breadcrumbJsonLd } from "@/components/json-ld";
import { CONTACT_EMAIL, SITE_HOST } from "@/lib/site-url";

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://agedleadsales.com";

export const metadata: Metadata = {
  title: "Terms of Service",
  description:
    "Terms of Service for Work Aged Leads. Covers site usage, intellectual property, disclaimers, and liability limitations.",
  alternates: { canonical: `${baseUrl}/terms` },
};

export default function TermsPage() {
  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", url: baseUrl },
          { name: "Terms of Service", url: `${baseUrl}/terms` },
        ])}
      />

      <section className="bg-white py-16 dark:bg-zinc-950">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <div className="mb-12">
            <h1 className="text-4xl font-bold text-zinc-900 dark:text-white">
              Terms of Service
            </h1>
            <p className="mt-4 text-sm text-zinc-500">
              Last updated: April 4, 2026
            </p>
          </div>

          <div className="prose prose-zinc dark:prose-invert max-w-none">
            <p>
              By accessing and using {SITE_HOST} (&quot;the Site&quot;),
              you agree to these Terms of Service. If you do not agree, please
              do not use the Site.
            </p>

            <h2>1. About This Site</h2>
            <p>
              Work Aged Leads provides educational content, sales training
              resources, provider reviews, pricing benchmarks, and interactive
              tools related to aged lead purchasing and sales strategies. The
              Site is operated by Bill Rice (&quot;we,&quot; &quot;us,&quot; or
              &quot;our&quot;).
            </p>

            <h2>2. Educational Content &mdash; Not Professional Advice</h2>
            <p>
              All content on this Site is for informational and educational
              purposes only. Nothing on this Site constitutes:
            </p>
            <ul>
              <li>Financial, investment, or legal advice</li>
              <li>A guarantee of sales results or lead performance</li>
              <li>
                An endorsement of any specific lead provider (even those we
                review favorably)
              </li>
            </ul>
            <p>
              Lead buying involves risk. Results vary based on your industry,
              market, skill level, follow-up process, and many other factors. We
              provide frameworks, benchmarks, and tools to help you make informed
              decisions &mdash; but we cannot guarantee outcomes.
            </p>

            <h2>3. Intellectual Property</h2>
            <p>
              All content on this Site &mdash; including articles, guides,
              playbooks, calculators, tools, data, design, and branding &mdash;
              is owned by Work Aged Leads and protected by copyright law. You
              may:
            </p>
            <ul>
              <li>Read, share, and link to our content freely</li>
              <li>
                Quote short excerpts with attribution and a link back to the
                source page
              </li>
            </ul>
            <p>You may not:</p>
            <ul>
              <li>
                Reproduce, republish, or redistribute our content in bulk
                without written permission
              </li>
              <li>
                Scrape, copy, or use our content to train AI models without
                authorization
              </li>
              <li>
                Remove attribution, copyright notices, or affiliate disclosures
                from embedded content
              </li>
            </ul>

            <h2>4. Provider Reviews &amp; Ratings</h2>
            <p>
              Our provider reviews and ratings are based on our published{" "}
              <Link href="/methodology">methodology</Link>. We strive for
              accuracy and fairness, but:
            </p>
            <ul>
              <li>
                Ratings reflect our assessment at the time of review and may not
                reflect recent changes to a provider&apos;s offering
              </li>
              <li>
                We cannot verify every claim made by providers on their own
                websites
              </li>
              <li>
                Your experience with any provider may differ from our assessment
              </li>
            </ul>
            <p>
              Always conduct your own due diligence before purchasing leads from
              any provider.
            </p>

            <h2>5. Pricing Benchmarks</h2>
            <p>
              The pricing data in our Lead Price Index is directional, not
              guaranteed. Actual lead prices vary by provider, volume, contract
              terms, geography, and market conditions. Benchmarks are updated
              monthly but may not reflect real-time pricing. See our{" "}
              <Link href="/methodology">methodology page</Link> for details on
              how we collect and model pricing data.
            </p>

            <h2>6. Affiliate Relationships</h2>
            <p>
              Some links on this Site are affiliate links. When you make a
              purchase through these links, we may earn a commission at no
              additional cost to you. Affiliate relationships are always
              disclosed and do not influence our ratings or editorial content.
              See our{" "}
              <Link href="/affiliate-disclosure">Affiliate Disclosure</Link>{" "}
              for full details.
            </p>

            <h2>7. User Conduct</h2>
            <p>When using this Site, you agree not to:</p>
            <ul>
              <li>
                Use automated tools to scrape, harvest, or bulk-download content
              </li>
              <li>
                Attempt to interfere with the Site&apos;s operation or security
              </li>
              <li>
                Submit false information through any form on the Site
              </li>
              <li>
                Use the Site for any unlawful purpose
              </li>
            </ul>

            <h2>8. Newsletter &amp; Email Communications</h2>
            <p>
              By subscribing to our newsletter, you consent to receive periodic
              emails from us. Every email includes an unsubscribe link. We do
              not share your email address with third parties for marketing
              purposes. See our{" "}
              <Link href="/privacy">Privacy Policy</Link> for details.
            </p>

            <h2>9. Calculator &amp; Tool Disclaimers</h2>
            <p>
              Our calculators and interactive tools provide estimates based on
              the inputs you provide and general industry assumptions. Results
              are for informational purposes only and should not be relied upon
              as the sole basis for business decisions. Actual results will vary.
            </p>

            <h2>10. Limitation of Liability</h2>
            <p>
              To the maximum extent permitted by law, Work Aged Leads and its
              owner shall not be liable for any direct, indirect, incidental,
              consequential, or punitive damages arising from your use of or
              inability to use this Site, including but not limited to losses
              from lead purchases made based on information found on this Site.
            </p>
            <p>
              The Site is provided &quot;as is&quot; without warranties of any
              kind, either express or implied, including but not limited to
              implied warranties of merchantability, fitness for a particular
              purpose, and non-infringement.
            </p>

            <h2>11. Third-Party Links</h2>
            <p>
              This Site contains links to third-party websites. We are not
              responsible for the content, privacy practices, or terms of any
              third-party site. Linking to a site does not imply endorsement
              beyond what is explicitly stated in our editorial content.
            </p>

            <h2>12. Changes to These Terms</h2>
            <p>
              We may update these Terms from time to time. Changes take effect
              when posted on this page. Continued use of the Site after changes
              constitutes acceptance of the updated terms.
            </p>

            <h2>13. Governing Law</h2>
            <p>
              These Terms are governed by the laws of the State of Florida,
              without regard to conflict of law provisions. Any disputes will be
              resolved in the courts of Marion County, Florida.
            </p>

            <h2>14. Contact</h2>
            <p>
              Questions about these Terms? Contact us at{" "}
              <a href={`mailto:${CONTACT_EMAIL}`}>
                {CONTACT_EMAIL}
              </a>
              .
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
