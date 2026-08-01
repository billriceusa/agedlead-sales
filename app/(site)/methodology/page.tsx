import type { Metadata } from "next";
import Link from "next/link";
import { JsonLd, breadcrumbJsonLd } from "@/components/json-ld";

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://agedleadsales.com";

export const metadata: Metadata = {
  title: "Our Methodology: How We Rate Lead Providers",
  description:
    "Transparent methodology for our lead provider ratings and pricing benchmarks. Learn how we score, what data we use, and how we stay independent.",
  alternates: { canonical: `${baseUrl}/methodology` },
};

export default function MethodologyPage() {
  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", url: baseUrl },
          { name: "Methodology", url: `${baseUrl}/methodology` },
        ])}
      />

      <section className="bg-white py-16 dark:bg-zinc-950">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <div className="mb-12">
            <h1 className="text-4xl font-bold text-zinc-900 dark:text-white">
              Our Methodology
            </h1>
            <p className="mt-4 text-lg text-zinc-600 dark:text-zinc-400">
              Transparency is core to what we do. Here&apos;s exactly how we rate
              providers, how we collect pricing data, and how we maintain
              editorial independence.
            </p>
          </div>

          <div className="prose prose-zinc dark:prose-invert max-w-none">
            <h2>How We Rate Providers</h2>
            <p>
              Every lead provider in our directory is independently evaluated
              across six weighted dimensions. We do not accept payment for higher
              ratings, and affiliate relationships never influence our scores.
            </p>

            <h3>Rating Dimensions</h3>
            <table>
              <thead>
                <tr>
                  <th>Dimension</th>
                  <th>Weight</th>
                  <th>What We Evaluate</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>
                    <strong>Pricing Transparency</strong>
                  </td>
                  <td>20%</td>
                  <td>
                    Are prices published on the website? Can you purchase
                    self-service without calling sales? Is the pricing structure
                    clear and predictable?
                  </td>
                </tr>
                <tr>
                  <td>
                    <strong>Value</strong>
                  </td>
                  <td>20%</td>
                  <td>
                    Price relative to reported data quality, contact rates, and
                    conversion performance. Are you getting what you pay for?
                  </td>
                </tr>
                <tr>
                  <td>
                    <strong>Data Quality &amp; Compliance</strong>
                  </td>
                  <td>20%</td>
                  <td>
                    Verified, validated contact data, DNC scrubbing, TCPA
                    paperwork handoff at delivery, and the operational
                    discipline a buyer should expect from a credible provider.
                  </td>
                </tr>
                <tr>
                  <td>
                    <strong>Flexibility</strong>
                  </td>
                  <td>15%</td>
                  <td>
                    No minimum orders, no long-term contracts, reasonable
                    return/refund policies, geographic filtering, and volume
                    scalability.
                  </td>
                </tr>
                <tr>
                  <td>
                    <strong>Platform &amp; Delivery</strong>
                  </td>
                  <td>15%</td>
                  <td>
                    Self-service portal quality, CRM integration options, API
                    delivery, instant download, and overall user experience.
                  </td>
                </tr>
                <tr>
                  <td>
                    <strong>Reputation &amp; Track Record</strong>
                  </td>
                  <td>10%</td>
                  <td>
                    Years in business, BBB rating, industry presence, forum
                    sentiment, and overall market trust.
                  </td>
                </tr>
              </tbody>
            </table>

            <p>
              <strong>A note on consent:</strong> All purchased lead inventory
              is brokered consumer data. The original consumer&apos;s consent
              does not transfer to the buyer along with the data. Fresh
              consent, scrubbed dialing windows, and current revocation
              handling are the buyer&apos;s responsibility before any outreach
              — regardless of what consent-capture infrastructure was used at
              the original source. We score Data Quality &amp; Compliance on
              what providers actually deliver to buyers: verified data, DNC
              scrubbing, paperwork handoff, and operational discipline.
            </p>

            <h3>Scoring Scale</h3>
            <ul>
              <li>
                <strong>8-10:</strong> Excellent. Industry-leading in this
                dimension. Few or no concerns.
              </li>
              <li>
                <strong>5-7:</strong> Good to adequate. Meets expectations but
                room for improvement.
              </li>
              <li>
                <strong>1-4:</strong> Below average. Significant concerns or
                limitations in this area.
              </li>
            </ul>
            <p>
              The overall score is a weighted average of all six dimensions,
              published as X.X out of 10.
            </p>

            <h2>How We Collect Pricing Data</h2>
            <p>
              Our Lead Price Index tracks fair market pricing across 15 verticals
              and multiple lead types. Here&apos;s how we gather this data:
            </p>
            <ol>
              <li>
                <strong>Published pricing audit:</strong> Each quarter we review
                provider websites to capture any publicly listed per-lead
                pricing.
              </li>
              <li>
                <strong>Quote requests:</strong> For providers that don&apos;t
                publish pricing, we request quotes as a prospective buyer.
              </li>
              <li>
                <strong>Market analysis:</strong> We analyze industry reports,
                forum discussions, and public data to triangulate pricing where
                direct data is limited.
              </li>
              <li>
                <strong>AI-assisted monitoring:</strong> Between quarterly
                reviews we use automated tools to watch provider websites for
                pricing changes and flag them for human verification — every
                published benchmark is reviewed by our team, never auto-generated.
              </li>
            </ol>

            <h3>Confidence Levels</h3>
            <p>
              Every benchmark includes a confidence rating to help you understand
              data reliability:
            </p>
            <ul>
              <li>
                <strong>High:</strong> Multiple transparent data points from
                published pricing. High reliability.
              </li>
              <li>
                <strong>Medium:</strong> Some direct data supplemented with
                market inference. Reasonable reliability.
              </li>
              <li>
                <strong>Low:</strong> Limited data available. Treat these ranges
                as directional estimates, not precise benchmarks.
              </li>
            </ul>

            <h2>Our Pricing Model</h2>
            <p>
              Where we have limited direct pricing data for specific age brackets,
              we use a mathematical model to estimate fair market values. The model
              is based on an empirically observed pattern: <strong>lead value follows
              an exponential decay curve over time</strong>, and the rate of decay
              correlates with the average deal value in each vertical.
            </p>
            <p>
              The core formula is: <code>aged_price = real_time_price &times; e<sup>-&lambda;t</sup> &times; exclusivity_multiplier</code>
            </p>
            <p>
              Where &lambda; (lambda) is a decay rate constant calibrated per vertical
              from our observed data, t is the lead age in days, and the exclusivity
              multiplier ranges from 1.0x (shared) to 2.2x (exclusive) — a ratio
              that holds remarkably consistent across all verticals.
            </p>
            <p>
              Key findings from our analysis across 10+ verticals:
            </p>
            <ul>
              <li>Aged (31-85 day) leads cost <strong>88-98% less</strong> than real-time leads</li>
              <li><strong>High-value verticals</strong> (legal, mortgage) have slower decay — even stale leads are worth pursuing</li>
              <li><strong>Low-ticket verticals</strong> (auto insurance) have the fastest decay</li>
              <li>The <strong>exclusive premium is 2.0-2.5x</strong> across all verticals</li>
            </ul>
            <p>
              Model-estimated prices are labeled <em>&quot;est.&quot;</em> in our
              pricing tables and marked as &quot;modeled&quot; confidence. As we
              gather more direct data, modeled estimates are replaced with observed
              benchmarks.
            </p>

            <h2>Update Frequency</h2>
            <p>
              We re-verify pricing benchmarks on a quarterly cycle, and every
              benchmark carries a &quot;Last Verified&quot; quarter so you can
              see exactly how fresh the data is. Provider profiles are monitored
              continuously between cycles — each shows its own &quot;Last
              Verified&quot; date, and profiles not verified within 60 days are
              flagged as potentially outdated.
            </p>

            <h2>Editorial Independence</h2>
            <p>
              Some providers in our directory are affiliate partners — we may
              earn a commission if you purchase through our links. This is
              disclosed on every provider page. Affiliate relationships{" "}
              <strong>never</strong> influence our ratings:
            </p>
            <ul>
              <li>Providers cannot pay for higher scores.</li>
              <li>
                We review and rate providers regardless of whether they have an
                affiliate relationship with us.
              </li>
              <li>
                Every provider profile includes &quot;Not Ideal For&quot; — we
                publish honest limitations, even for our affiliate partners.
              </li>
              <li>
                Our rating methodology and scoring criteria are published here
                for full transparency.
              </li>
              <li>
                The sharpest conflict we carry is stated plainly: Bill Rice
                serves as marketing director for{" "}
                <Link href="/providers/aged-lead-store">Aged Lead Store</Link>,
                which is one of the providers rated here. It is scored on the
                same six dimensions as every other provider, and the
                relationship is disclosed on every page where it is relevant.
                Full detail is in our{" "}
                <Link href="/affiliate-disclosure">affiliate disclosure</Link>.
              </li>
            </ul>

            <h2>Who We Are</h2>
            <p>
              Work Aged Leads is run by{" "}
              <Link href="/about/bill-rice">Bill Rice</Link>, who brings 30+
              years of experience in mortgage lending and sales operations.
              We&apos;re not an anonymous content farm — our reviews are backed by
              real industry expertise and a commitment to helping lead buyers
              make informed decisions.
            </p>
            <p>
              This site is the merged archive of two sites Bill ran separately
              — How To Work Leads, which covered working leads, and Aged Lead
              Sales, which covered buying them. Both now publish here under one
              name. See <Link href="/about">About</Link> for the full account.
            </p>

            <h2>Contact Us</h2>
            <p>
              Have questions about our methodology? Think a provider profile
              needs updating? Use the <Link href="/contact">contact form</Link>{" "}
              or email{" "}
              <a href="mailto:bill@billricestrategy.com">
                bill@billricestrategy.com
              </a>
              . Both reach Bill directly.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
