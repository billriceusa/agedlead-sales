import type { Metadata } from "next";
import { siteUrl } from "@/lib/site-url";
import Link from "next/link";
import { CtaBanner } from "@/components/cta-banner";
import { NewsletterSignup } from "@/components/newsletter-signup";

export const metadata: Metadata = {
  title: "About Bill Rice: 30+ Years in Lead Generation",
  description:
    "Work Aged Leads is built by Bill Rice — the expert who coined 'lead management,' built lead systems at Quicken Loans, and has personally worked millions of aged leads across insurance, mortgage, solar, and home improvement. Free training from someone who actually dials.",
  alternates: { canonical: siteUrl("/about") },
};

export default function AboutPage() {
  return (
    <>
      <section className="bg-white py-16 dark:bg-zinc-950">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold text-zinc-900 dark:text-white">
            About Work Aged Leads
          </h1>

          <div className="mt-8 space-y-6 text-lg leading-relaxed text-zinc-600 dark:text-zinc-400">
            <p>
              I&apos;m{" "}
              <strong className="text-zinc-900 dark:text-white">
                Bill Rice
              </strong>
              , and I built this site because I&apos;m tired of watching
              salespeople fail with aged leads — not because aged leads
              don&apos;t work, but because the advice they&apos;re following
              comes from people who&apos;ve never actually dialed one.
            </p>

            <p>
              I&apos;ve spent 30+ years in lead generation and fintech
              marketing. I&apos;ve personally worked millions of leads across
              insurance, mortgage, solar, and home improvement. I coined the
              term &ldquo;lead management&rdquo; — literally invented the
              concept of systematically scoring, routing, and nurturing leads
              before it had a name. And I built the first intelligent lead
              scoring and distribution system for mortgage lending, back when
              most companies were still handing out leads on index cards.
            </p>

            <p>
              Everything on this site — every guide, every script, every
              calculator, every playbook — comes from that experience. Not
              theory. Not something I read in a marketing blog. Actual results
              from actual campaigns with actual money on the line.
            </p>

            {/* ── Provenance: the two-site merge ─────────────── */}

            <h2 className="pt-4 text-2xl font-bold text-zinc-900 dark:text-white">
              Two Sites, One Address
            </h2>
            <p>
              Work Aged Leads is two sites merged into one. How To Work Leads
              covered the sales side — scripts, cadences, CRM setup, the work
              of reaching someone weeks after they filled out a form. Aged Lead
              Sales covered the buying side — what leads cost, which providers
              sell them, and how the vendors compare.
            </p>
            <p>
              That split never matched how the job actually works. You
              can&apos;t judge what a lead is worth without knowing what it
              takes to work one, and you can&apos;t build a cadence without
              knowing what you paid. Both archives now live here, under one
              name, at one address.
            </p>

            {/* ── Career Arc ────────────────────────────────── */}

            <h2 className="pt-4 text-2xl font-bold text-zinc-900 dark:text-white">
              How I Got Here
            </h2>

            <h3 className="pt-2 text-xl font-semibold text-zinc-900 dark:text-white">
              U.S. Air Force Office of Special Investigations (AFOSI)
            </h3>
            <p>
              My career started about as far from sales as you can get. I
              graduated from the{" "}
              <strong className="text-zinc-900 dark:text-white">
                United States Air Force Academy
              </strong>{" "}
              in 1992 with a B.S. in Political Science and was commissioned as
              a U.S. Air Force Office of Special Investigations (AFOSI) Special
              Agent and case officer specializing in counterespionage operations. The Air
              Force teaches you to think in systems — to break complex problems
              into components, identify leverage points, and execute with
              discipline. That analytical framework shaped everything I&apos;ve
              done since.
            </p>
            <p>
              After my active duty service, I worked as a Program Manager at
              TASC Inc., supporting Information Warfare Centers, and served as
              the Call Intercept System Security Manager at Iridium
              Communications. Intelligence work trains you to find signal in
              noise — a skill that turns out to be directly applicable to
              finding the buyers hiding in a pile of aged leads.
            </p>

            <h3 className="pt-2 text-xl font-semibold text-zinc-900 dark:text-white">
              Early Internet Banking &amp; the Birth of Online Lending
            </h3>
            <p>
              In 2000 I joined as{" "}
              <strong className="text-zinc-900 dark:text-white">
                Employee #7 at DeepGreen Bank
              </strong>
              , one of the first internet-only banks in the country. We grew
              to about 80 people running what functionally behaved like a
              billion-dollar bank — still small by industry standards, still
              punching several weight classes up. We launched the first
              unconditional online Home Equity Line of Credit — no branch visit
              required, no conditions, fully digital — before most people
              trusted the internet with their money. DeepGreen was sold to
              LightYear Capital in 2004. That experience gave me a front-row
              seat to how lead generation and online conversion would reshape
              financial services.
            </p>

            <h3 className="pt-2 text-xl font-semibold text-zinc-900 dark:text-white">
              Quicken Loans (Now Rocket Mortgage)
            </h3>
            <p>
              From DeepGreen, I moved to{" "}
              <strong className="text-zinc-900 dark:text-white">
                Quicken Loans
              </strong>{" "}
              in 2004, initially as COO of the Rock Bank project — a federally
              chartered bank initiative — and then pivoted to Vice President of
              National Home Equity, where I built the EquityOnline platform,
              Quicken Loans&apos; first true online lending and offer platform.
              Quicken Loans was already legendary for its sales culture and
              lead conversion discipline. I learned what world-class lead
              management looks like at scale — thousands of loan officers,
              millions of leads, and a relentless focus on speed to contact,
              follow-up cadence, and conversion optimization.
            </p>
            <p>
              This is where I developed the first intelligent lead scoring and
              distribution system for mortgage lending. Instead of round-robin
              or random assignment, we built algorithms that matched lead
              characteristics to loan officer strengths. The conversion rate
              improvements were massive. And the principles behind that system
              — scoring leads on recency, intent signals, data quality, and
              contact probability — are exactly what I teach on this site for
              aged lead prospecting.
            </p>

            <h3 className="pt-2 text-xl font-semibold text-zinc-900 dark:text-white">
              Founding Kaleidico
            </h3>
            <p>
              In 2005 I founded{" "}
              <strong className="text-zinc-900 dark:text-white">
                Kaleidico
              </strong>
              , originally as a lead management software company (I built
              icoSales and coined &ldquo;lead management&rdquo; as an industry
              category — authoring the original Wikipedia page). After the 2008
              mortgage meltdown destroyed the call-center lender client base, I
              pivoted Kaleidico into the demand generation agency it is today,
              serving mortgage lenders, law firms, and senior living
              communities. Kaleidico became one of the top marketing agencies
              in the mortgage industry, known for building lead generation
              systems that actually convert — not just drive traffic. Following
              the agency&apos;s acquisition and liquidity event, I retained 10%
              ownership and transitioned into the Chief Revenue Officer role,
              where I continue to lead business development, sales, and
              marketing strategy and execution.
            </p>
            <p>
              Through Kaleidico, I&apos;ve worked with companies at every stage
              — from solo loan officers buying their first batch of aged leads
              to enterprise lenders running multi-million-dollar lead
              acquisition budgets. That range of experience is what makes the
              training on this site practical for everyone, whether you&apos;re
              a one-person shop or managing a call center.
            </p>

            <h3 className="pt-2 text-xl font-semibold text-zinc-900 dark:text-white">
              Velocity Lending &amp; the Aged Lead Proof-of-Concept
            </h3>
            <p>
              From 2016 to 2018, I owned and operated{" "}
              <strong className="text-zinc-900 dark:text-white">
                Velocity Lending
              </strong>
              , a consumer direct (DTC) mortgage lender, alongside Kaleidico.
              Velocity was a live proof-of-concept for the Kaleidico playbook
              — that a small lender could compete alongside the biggest names
              in the business with first-party lead generation. Most
              importantly for this site, it validated that{" "}
              <em>aged leads, worked correctly, can quickly build a large
              database marketing operation</em>
              . That discovery is the foundation of the training, playbooks,
              and scripts you&apos;ll find here.
            </p>

            <h3 className="pt-2 text-xl font-semibold text-zinc-900 dark:text-white">
              Today: Three Companies and a Book
            </h3>
            <p>
              Today I run three companies.{" "}
              <a
                href="https://kaleidico.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 underline hover:text-blue-700 dark:text-blue-400"
              >
                Kaleidico
              </a>
              , as CRO.{" "}
              <a
                href="https://billricestrategy.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 underline hover:text-blue-700 dark:text-blue-400"
              >
                Bill Rice Strategy Group
              </a>
              , my B2B strategic agency for fintech companies. And{" "}
              <a
                href="https://verifiedvector.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 underline hover:text-blue-700 dark:text-blue-400"
              >
                Verified Vector
              </a>
              , my AI-first agency — no employees, just AI agents and me, with
              every deliverable produced in code. In 2025 I published{" "}
              <a
                href="https://www.leadbuyerplaybook.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 underline hover:text-blue-700 dark:text-blue-400"
              >
                The Lead Buyer&apos;s Playbook
              </a>
              , the enterprise guide to buying and converting leads profitably.
            </p>

            <h3 className="pt-2 text-xl font-semibold text-zinc-900 dark:text-white">
              Strategic Advisory &amp; Consulting
            </h3>
            <p>
              Today I run{" "}
              <strong className="text-zinc-900 dark:text-white">
                Bill Rice Consulting
              </strong>{" "}
              (Bill Rice Strategy Group), where I work directly with fintech
              companies, lenders, and lead-dependent businesses on conversion
              strategy. I serve as marketing director for Aged Lead Store and
              have been a strategic advisor to companies including{" "}
              <strong className="text-zinc-900 dark:text-white">
                Quizzle
              </strong>{" "}
              (acquired by Bankrate),{" "}
              <strong className="text-zinc-900 dark:text-white">
                SpringEQ
              </strong>
              ,{" "}
              <strong className="text-zinc-900 dark:text-white">ProPair</strong>
              , and{" "}
              <strong className="text-zinc-900 dark:text-white">Figure</strong>{" "}
              (a leading HELOC lender). My current client work spans mortgage,
              fintech, insurance, and lead technology.
            </p>

            <h3 className="pt-2 text-xl font-semibold text-zinc-900 dark:text-white">
              Education
            </h3>
            <ul className="list-disc space-y-2 pl-6">
              <li>
                <strong className="text-zinc-900 dark:text-white">
                  B.S. Political Science
                </strong>{" "}
                — United States Air Force Academy (1992)
              </li>
              <li>
                <strong className="text-zinc-900 dark:text-white">
                  MBA in Marketing
                </strong>{" "}
                — University of Phoenix (2003)
              </li>
            </ul>

            {/* ── Why This Site Exists ───────────────────────── */}

            <h2 className="pt-4 text-2xl font-bold text-zinc-900 dark:text-white">
              Why I Built This Site
            </h2>
            <p>
              Here&apos;s the problem I keep seeing: a salesperson buys a batch
              of aged leads, works them for a week using the same approach
              they&apos;d use on a fresh lead, gets frustrated by the lower
              contact rates, and declares that aged leads don&apos;t work. Then
              they go back to paying 10x more for real-time leads that burn
              through their budget in days.
            </p>
            <p>
              Aged leads absolutely work. But they require a fundamentally
              different approach — different scripts, different cadences,
              different expectations, different economics. A 2% conversion rate
              on aged leads at $2 per lead crushes a 10% conversion rate on
              real-time leads at $50 per lead. The math is overwhelmingly in
              your favor. But only if you know how to work them correctly.
            </p>
            <p>
              The training that exists for aged leads is mostly terrible.
              It&apos;s written by content marketers who&apos;ve never sat in a
              dialing seat. It&apos;s generic advice — &ldquo;be persistent,&rdquo;
              &ldquo;follow up quickly,&rdquo; &ldquo;build rapport&rdquo; —
              that doesn&apos;t address the specific challenges of contacting
              someone who filled out a form weeks or months ago and may not
              remember doing it.
            </p>
            <p>
              I built this site to be the resource I wish existed when I
              was training sales teams. Specific. Tactical. Based on data from
              real campaigns. Every script on this site has been tested. Every
              framework has been used in production. Every number I cite comes
              from actual results, not industry averages.
            </p>

            {/* ── Thought Leadership ────────────────────────── */}

            <h2 className="pt-4 text-2xl font-bold text-zinc-900 dark:text-white">
              Thought Leadership &amp; Speaking
            </h2>
            <p>
              Beyond this site, I stay active in the lead generation and sales
              community through several channels:
            </p>
            <ul className="list-disc space-y-2 pl-6">
              <li>
                <strong className="text-zinc-900 dark:text-white">
                  &ldquo;The Lead Brief&rdquo;
                </strong>{" "}
                — my weekly newsletter covering marketing strategy,
                lead generation trends, and lessons from 30+ years in the
                industry
              </li>
              <li>
                <strong className="text-zinc-900 dark:text-white">
                  Conference speaker
                </strong>{" "}
                — regular presenter at Lead Generation World and fintech
                industry events
              </li>
              <li>
                <strong className="text-zinc-900 dark:text-white">
                  Podcast guest
                </strong>{" "}
                — featured on 30+ marketing and business podcasts discussing
                lead conversion, sales systems, and building revenue engines
              </li>
              <li>
                <strong className="text-zinc-900 dark:text-white">
                  LinkedIn
                </strong>{" "}
                (@billrice) — where I share daily insights on lead management,
                sales strategy, and marketing for founders
              </li>
              <li>
                <strong className="text-zinc-900 dark:text-white">
                  YouTube
                </strong>{" "}
                (Bill Rice Strategy) — video breakdowns of sales frameworks,
                lead generation tactics, and marketing strategy
              </li>
              <li>
                <strong className="text-zinc-900 dark:text-white">
                  Upcoming book
                </strong>{" "}
                — &ldquo;Sales and Marketing for Founders,&rdquo; drawing on
                decades of building revenue systems for startups and
                growth-stage companies
              </li>
            </ul>

            {/* ── What You'll Find Here ──────────────────────── */}

            <h2 className="pt-4 text-2xl font-bold text-zinc-900 dark:text-white">
              What You&apos;ll Find Here
            </h2>
            <p>
              Every piece of content here is designed to be
              immediately actionable. Here&apos;s how the site is organized:
            </p>
            <ul className="list-disc space-y-3 pl-6">
              <li>
                <Link
                  href="/lead-types"
                  className="font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400"
                >
                  Lead Type Guides
                </Link>{" "}
                — Deep dives into each vertical (insurance, mortgage, solar,
                home improvement) with industry-specific scripts, realistic cost
                data, and conversion strategies tailored to how buyers behave in
                that market
              </li>
              <li>
                <Link
                  href="/playbook"
                  className="font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400"
                >
                  The Operator&apos;s Playbook
                </Link>{" "}
                — Step-by-step frameworks for working aged leads, from first
                contact to close. These are the same systems I&apos;ve deployed
                at scale for mortgage lenders and insurance agencies
              </li>
              <li>
                <Link
                  href="/guides"
                  className="font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400"
                >
                  Guides
                </Link>{" "}
                — In-depth training content covering speed to lead, objection
                handling, multi-touch campaigns, and the psychology of
                re-engaging a prospect who filled out a form weeks ago
              </li>
              <li>
                <Link
                  href="/blog"
                  className="font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400"
                >
                  Blog
                </Link>{" "}
                — Analysis, case studies, and tactical tips — updated regularly
                with insights from my ongoing client work and industry
                observations
              </li>
              <li>
                <Link
                  href="/calculators"
                  className="font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400"
                >
                  Free Calculators
                </Link>{" "}
                — ROI calculators, pipeline planners, and lead cost tools so you
                can model your economics before you spend a dollar
              </li>
              <li>
                <Link
                  href="/glossary"
                  className="font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400"
                >
                  Glossary
                </Link>{" "}
                — 50+ definitions covering sales, insurance, mortgage, and lead
                generation terminology — the language you need to navigate this
                industry confidently
              </li>
            </ul>

            {/* ── Affiliate Relationships ─────────────────────── */}

            <h2 className="pt-4 text-2xl font-bold text-zinc-900 dark:text-white">
              Affiliate Relationships &amp; Editorial Independence
            </h2>
            <p>
              Full transparency: I serve as the marketing director for
              AgedLeadStore.com, which is one of the providers reviewed in our{" "}
              <a
                href="/providers"
                className="font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400"
              >
                provider directory
              </a>
              . I also maintain affiliate relationships with other providers.
              When you visit a provider through our tracked links and make a
              purchase, I may earn a commission. That revenue funds the free
              tools, training, and research on this site.
            </p>
            <p>
              These relationships are always disclosed and{" "}
              <strong className="text-zinc-900 dark:text-white">
                never influence our ratings or recommendations
              </strong>
              . Every provider — including AgedLeadStore — is evaluated using
              the same{" "}
              <a
                href="/methodology"
                className="font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400"
              >
                published methodology
              </a>
              . We score on six weighted dimensions, publish honest
              assessments including what each provider is <em>not</em> ideal
              for, and date every review so you know how fresh the data is.
            </p>
            <p>
              I don&apos;t sugarcoat the challenges of working aged leads. I
              give you realistic numbers, realistic expectations, and realistic
              frameworks because that&apos;s the only way you&apos;ll actually
              succeed. The goal of this site is to help you make informed lead
              buying decisions — not to push you toward any single provider.
            </p>

            {/* ── My Approach ────────────────────────────────── */}

            <h2 className="pt-4 text-2xl font-bold text-zinc-900 dark:text-white">
              My Approach to Training
            </h2>
            <p>
              My intelligence background shaped how I think about sales. In
              counterespionage, you don&apos;t have the luxury of guessing.
              You analyze the data, identify patterns, build a thesis, test it,
              and refine. That&apos;s exactly how I approach lead conversion.
            </p>
            <p>
              When I train someone to work aged leads, I don&apos;t give them a
              motivational speech and a phone. I give them a system: what to say
              on the first call (and the seventh), how to handle the
              &ldquo;I don&apos;t remember filling that out&rdquo; objection,
              when to text versus call versus email, how to calculate their
              break-even point, and how to build a sustainable pipeline that
              produces predictable revenue month after month.
            </p>
            <p>
              I value frameworks over theory. I&apos;d rather give you a
              five-step process that works 80% of the time than a
              philosophical treatise on &ldquo;the art of persuasion.&rdquo;
              You&apos;re busy. You need to close deals. The content on this
              site respects your time by being specific, actionable, and honest
              about what works and what doesn&apos;t.
            </p>

            {/* ── Closing ────────────────────────────────────── */}

            <h2 className="pt-4 text-2xl font-bold text-zinc-900 dark:text-white">
              Let&apos;s Get to Work
            </h2>
            <p>
              If you&apos;re new to aged leads, start with the{" "}
              <Link
                href="/lead-types"
                className="font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400"
              >
                Lead Type Guides
              </Link>{" "}
              for your industry and the{" "}
              <Link
                href="/calculators/roi-calculator"
                className="font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400"
              >
                ROI Calculator
              </Link>{" "}
              to model your economics. If you&apos;re already working aged
              leads and want to improve, the{" "}
              <Link
                href="/playbook"
                className="font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400"
              >
                The Operator&apos;s Playbook
              </Link>{" "}
              will give you the frameworks to tighten your process.
            </p>
            <p>
              I&apos;ve been doing this for 30 years. I&apos;ve watched the
              lead industry evolve from fax-back forms to real-time bidding
              platforms. Through all of that change, one thing has stayed
              constant: the salespeople who win are the ones who treat lead
              conversion as a system, not a lottery. That&apos;s what this site
              teaches.
            </p>
            <p>
              You can also find me on LinkedIn (@billrice), where I post daily
              on lead management and sales strategy, and on the Bill Rice
              Strategy YouTube channel, where I break down frameworks in video
              format.
            </p>
            <p>
              For my full career profile, visit{" "}
              <a
                href="https://billrice.com/about"
                className="font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400"
              >
                billrice.com/about
              </a>
              .
            </p>
            <p className="font-medium text-zinc-900 dark:text-white">
              — Bill Rice
            </p>
          </div>
        </div>
      </section>

      <section className="bg-white py-12 dark:bg-zinc-950">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <NewsletterSignup variant="card" context="about" />
        </div>
      </section>

      <CtaBanner campaign="about" />
    </>
  );
}
