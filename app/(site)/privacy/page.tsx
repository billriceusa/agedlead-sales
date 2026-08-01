import type { Metadata } from "next";
import Link from "next/link";
import { JsonLd, breadcrumbJsonLd } from "@/components/json-ld";
import { CONTACT_EMAIL, SITE_HOST } from "@/lib/site-url";

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://agedleadsales.com";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "How Work Aged Leads collects, uses, and protects your data. Covers cookies, analytics, email subscriptions, and your rights.",
  alternates: { canonical: `${baseUrl}/privacy` },
};

export default function PrivacyPage() {
  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", url: baseUrl },
          { name: "Privacy Policy", url: `${baseUrl}/privacy` },
        ])}
      />

      <section className="bg-white py-16 dark:bg-zinc-950">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <div className="mb-12">
            <h1 className="text-4xl font-bold text-zinc-900 dark:text-white">
              Privacy Policy
            </h1>
            <p className="mt-4 text-sm text-zinc-500">
              Last updated: April 4, 2026
            </p>
          </div>

          <div className="prose prose-zinc dark:prose-invert max-w-none">
            <p>
              Work Aged Leads (&quot;we,&quot; &quot;us,&quot; or &quot;our&quot;)
              operates the website {SITE_HOST}. This Privacy Policy explains
              what information we collect, how we use it, and your choices
              regarding that information.
            </p>

            <h2>Information We Collect</h2>

            <h3>Information You Provide</h3>
            <ul>
              <li>
                <strong>Email address</strong> &mdash; when you subscribe to our
                newsletter, download a lead magnet, or contact us
              </li>
              <li>
                <strong>Name</strong> &mdash; if provided via a contact form or
                email
              </li>
            </ul>
            <p>
              We do not collect payment information, Social Security numbers, or
              other sensitive financial data on this site.
            </p>

            <h3>Information Collected Automatically</h3>
            <ul>
              <li>
                <strong>Analytics data</strong> &mdash; page views, session
                duration, traffic sources, device type, and browser information
                via Google Analytics 4 (GA4) and Google Tag Manager (GTM)
              </li>
              <li>
                <strong>Cookies</strong> &mdash; GA4 and GTM set cookies to
                measure site usage and distinguish visitors. These are
                first-party analytics cookies, not used for advertising
                retargeting
              </li>
              <li>
                <strong>Server logs</strong> &mdash; our hosting provider
                (Vercel) collects standard web server logs including IP
                addresses, request URLs, and timestamps
              </li>
            </ul>

            <h2>How We Use Your Information</h2>
            <ul>
              <li>
                <strong>Newsletter delivery</strong> &mdash; to send you the
                content you subscribed to via Resend, our email service provider
              </li>
              <li>
                <strong>Lead magnet delivery</strong> &mdash; to email you
                downloadable resources you requested
              </li>
              <li>
                <strong>Site improvement</strong> &mdash; to understand how
                visitors use the site and improve content, navigation, and tools
              </li>
              <li>
                <strong>Communication</strong> &mdash; to respond to inquiries
                sent to {CONTACT_EMAIL}
              </li>
            </ul>
            <p>
              We do not sell, rent, or trade your personal information to third
              parties.
            </p>

            <h2>Third-Party Services</h2>
            <p>We use the following third-party services that may process your data:</p>
            <ul>
              <li>
                <strong>Google Analytics 4 &amp; Google Tag Manager</strong>{" "}
                &mdash; website analytics and event tracking.{" "}
                <a
                  href="https://policies.google.com/privacy"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Google Privacy Policy
                </a>
              </li>
              <li>
                <strong>Resend</strong> &mdash; email delivery for newsletters
                and transactional emails.{" "}
                <a
                  href="https://resend.com/legal/privacy-policy"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Resend Privacy Policy
                </a>
              </li>
              <li>
                <strong>Vercel</strong> &mdash; website hosting and serverless
                functions.{" "}
                <a
                  href="https://vercel.com/legal/privacy-policy"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Vercel Privacy Policy
                </a>
              </li>
              <li>
                <strong>Sanity.io</strong> &mdash; content management system
                (stores published content, not user data)
              </li>
            </ul>

            <h2>Cookies</h2>
            <p>
              This site uses cookies for analytics purposes only. We do not use
              advertising cookies or tracking pixels for retargeting. You can
              disable cookies in your browser settings, though this may affect
              analytics accuracy.
            </p>
            <table>
              <thead>
                <tr>
                  <th>Cookie</th>
                  <th>Purpose</th>
                  <th>Duration</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>_ga</td>
                  <td>Google Analytics &mdash; distinguishes visitors</td>
                  <td>2 years</td>
                </tr>
                <tr>
                  <td>_ga_*</td>
                  <td>Google Analytics &mdash; session persistence</td>
                  <td>2 years</td>
                </tr>
              </tbody>
            </table>

            <h2>Affiliate Links</h2>
            <p>
              Some links on this site are affiliate links. When you click an
              affiliate link, the destination site may set its own cookies to
              track the referral. We include UTM parameters in affiliate URLs for
              our own analytics. See our{" "}
              <Link href="/affiliate-disclosure">Affiliate Disclosure</Link> for
              full details.
            </p>

            <h2>Your Rights</h2>
            <p>You have the right to:</p>
            <ul>
              <li>
                <strong>Unsubscribe</strong> from our email list at any time
                using the link in every email
              </li>
              <li>
                <strong>Request access</strong> to the personal data we hold
                about you
              </li>
              <li>
                <strong>Request deletion</strong> of your personal data
              </li>
              <li>
                <strong>Opt out</strong> of analytics tracking by using a browser
                extension like{" "}
                <a
                  href="https://tools.google.com/dlpage/gaoptout"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Google Analytics Opt-out
                </a>
              </li>
            </ul>

            <h3>California Residents (CCPA/CPRA)</h3>
            <p>
              Under the California Consumer Privacy Act, as amended by the CPRA,
              California residents have the right to know what personal
              information we collect, to access it, to delete it, to correct it,
              and to opt out of the sale or sharing of personal information &mdash;
              without discrimination for exercising these rights.
            </p>
            <p>
              We do not sell your personal information for money. The CPRA also
              treats some uses of third-party analytics cookies (such as Google
              Analytics) as &quot;sharing&quot; personal information for
              cross-context behavioral advertising, even when no money changes
              hands.
            </p>
            <p>
              <strong>Do Not Sell or Share My Personal Information:</strong> to
              opt out, disable analytics cookies in your browser or via the{" "}
              <a
                href="https://tools.google.com/dlpage/gaoptout"
                target="_blank"
                rel="noopener noreferrer"
              >
                Google Analytics Opt-out Add-on
              </a>
              , and/or email us at{" "}
              <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>{" "}
              with the subject &quot;Do Not Sell or Share&quot; and we will honor
              your request.
            </p>

            <h3>European Residents (GDPR)</h3>
            <p>
              If you are located in the European Economic Area, you have rights
              under the General Data Protection Regulation including the right to
              access, rectify, erase, restrict processing, and data portability.
              Our lawful basis for processing is legitimate interest (analytics)
              and consent (email subscription).
            </p>

            <h2>Data Retention</h2>
            <ul>
              <li>
                <strong>Email subscriber data</strong> is retained until you
                unsubscribe, at which point it is removed from our active list
              </li>
              <li>
                <strong>Analytics data</strong> is retained per Google Analytics
                default retention settings (14 months)
              </li>
              <li>
                <strong>Server logs</strong> are retained per Vercel&apos;s
                standard retention policy
              </li>
            </ul>

            <h2>Children&apos;s Privacy</h2>
            <p>
              This site is not directed at children under 13. We do not knowingly
              collect personal information from children. If you believe a child
              has provided us with personal information, please contact us and we
              will delete it.
            </p>

            <h2>Changes to This Policy</h2>
            <p>
              We may update this Privacy Policy from time to time. Changes will
              be posted on this page with an updated &quot;Last updated&quot;
              date. Continued use of the site after changes constitutes
              acceptance of the updated policy.
            </p>

            <h2>Contact</h2>
            <p>
              For privacy-related questions or to exercise your rights, contact
              us at{" "}
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
