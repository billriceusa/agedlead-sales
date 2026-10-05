import type { Metadata } from "next";
import Link from "next/link";
import { LeadMagnetCta } from "@/components/lead-magnet-cta";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { JsonLd, breadcrumbJsonLd } from "@/components/json-ld";

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://workagedleads.com";

export const metadata: Metadata = {
  title: "DNC Safe Harbor Worksheet: The Six Conditions",
  description:
    "The FTC's do-not-call safe harbor is six conditions, not just a 31-day scrub. Work through each one, with what 'documented' means for a one-person operation.",
  alternates: { canonical: `${baseUrl}/resources/dnc-safe-harbor-worksheet` },
};

/**
 * WHY THIS PAGE IS NOT GATED.
 *
 * The task that created it said "email-gated". The six conditions are not
 * gated, deliberately, and the reasoning is worth leaving here.
 *
 * This is the information a buyer needs in order NOT to get hurt — the exact
 * category where putting a form between the reader and the answer is the wrong
 * trade. It is also the claim the page has to earn its ranking on: the query it
 * targets is held by a LinkedIn post, a 2005 FTC audit PDF and a Reddit thread,
 * and we beat those by answering better in public, not by answering behind a
 * form.
 *
 * The opt-in offers what genuinely needs delivering — a fillable copy and the
 * 31-day reminder, both of which are only useful in an inbox. That still feeds
 * the list, which is what P3's kill rule measures, without hiding compliance
 * information from someone who needs it.
 *
 * Every regulatory claim below is cited to the eCFR, per the standing rule that
 * compliance claims verify to statute or CFR and never to a vendor's summary.
 */

const CFR_310_4 =
  "https://www.ecfr.gov/current/title-16/chapter-I/subchapter-C/part-310/section-310.4";

const CONDITIONS: {
  n: number;
  cite: string;
  title: string;
  requirement: string;
  documented: string;
}[] = [
  {
    n: 1,
    cite: "310.4(b)(3)(i)",
    title: "Written procedures",
    requirement:
      "You have established and implemented written procedures to comply with the do-not-call rules.",
    documented:
      "A single document naming who pulls the scrub, how often, where the file lives, and what happens when someone asks to stop. One page is a written procedure. Nothing in your head is.",
  },
  {
    n: 2,
    cite: "310.4(b)(3)(ii)",
    title: "Training",
    requirement:
      "You have trained your personnel, and any entity assisting in your compliance, in those procedures.",
    documented:
      "If you are a one-person operation, this is a dated note that you read and adopted the procedure. If you use a VA, a dialer vendor or an overseas caller, they are covered by this condition too — and they are the most commonly missed part of it.",
  },
  {
    n: 3,
    cite: "310.4(b)(3)(iii)",
    title: "An internal do-not-call list",
    requirement:
      "You maintain and record a list of numbers you may not contact, built from people who told you directly to stop.",
    documented:
      "A suppression list your dialer actually reads before it dials. This request binds you regardless of any registry, and it does not expire. It is the cheapest condition to satisfy and the most expensive to neglect, because the evidence of the request is usually sitting in your own CRM.",
  },
  {
    n: 4,
    cite: "310.4(b)(3)(iv)",
    title: "A scrub no older than 31 days — and the records",
    requirement:
      "You use a process employing a version of the registry obtained from the Commission no more than thirty-one days before the call, and you maintain records documenting that process.",
    documented:
      "Dated scrub receipts, kept. This is the condition most agents think is the whole rule, and it is the only one with two halves: the clean file and the proof of how it got clean. A clean file with no dated record is a scrub you cannot demonstrate.",
  },
  {
    n: 5,
    cite: "310.4(b)(3)(v)",
    title: "Monitoring and enforcement",
    requirement:
      "You monitor and enforce compliance with the procedures you established.",
    documented:
      "A recurring check that the process actually ran — the scrub happened on schedule, the suppression list was applied, the exceptions got looked at. A procedure nobody checks is condition one without condition five.",
  },
  {
    n: 6,
    cite: "310.4(b)(3)(vi)",
    title: "The call was an error",
    requirement:
      "Any call that slipped through was the result of error, not of failing to obtain the information needed to honor a stop request.",
    documented:
      "This one you cannot prepare in advance; it is the test the other five let you pass. If conditions one through five are real and documented, a call that gets through reads as an error. If they are not, it reads as a process that was never built.",
  },
];

export default function DncSafeHarborWorksheetPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 sm:py-16">
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", url: baseUrl },
          { name: "Resources", url: `${baseUrl}/resources` },
          {
            name: "DNC Safe Harbor Worksheet",
            url: `${baseUrl}/resources/dnc-safe-harbor-worksheet`,
          },
        ])}
      />
      <Breadcrumbs
        items={[
          { label: "Resources", href: "/resources" },
          { label: "DNC Safe Harbor Worksheet" },
        ]}
      />

      <h1 className="mt-6 text-3xl font-bold tracking-tight text-zinc-900 sm:text-4xl dark:text-white">
        The DNC Safe Harbor Worksheet
      </h1>

      <p className="mt-5 text-lg leading-relaxed text-zinc-700 dark:text-zinc-300">
        Most agents working purchased data believe the requirement is &ldquo;scrub every 31
        days.&rdquo; The 31 days is real, but it is one item in a six-part safe harbor. Do only
        that one and you have a cleaner file and no defense.
      </p>

      <p className="mt-4 text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
        Below is each condition as the regulation states it, what it means for a small operation,
        and what &ldquo;documented&rdquo; has to look like. Everything here is cited to{" "}
        <a
          href={CFR_310_4}
          className="underline hover:text-zinc-900 dark:hover:text-zinc-200"
          rel="noopener noreferrer"
          target="_blank"
        >
          16 CFR 310.4
        </a>
        .
      </p>

      <div className="mt-8 rounded-lg border border-amber-200 bg-amber-50 p-5 dark:border-amber-900/60 dark:bg-amber-950/30">
        <p className="text-sm leading-relaxed text-amber-900 dark:text-amber-200">
          <strong className="font-semibold">What a safe harbor is.</strong> It is a defense, not a
          permission. It says that if a call reaches someone on the registry, you are not liable —
          provided you can demonstrate <em>all six</em> of the following as part of your routine
          business practice. Partial compliance is not partial protection.
        </p>
      </div>

      <ol className="mt-10 space-y-8">
        {CONDITIONS.map((c) => (
          <li key={c.n} className="border-l-2 border-zinc-200 pl-5 dark:border-zinc-700">
            <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
              <span className="text-sm font-semibold text-blue-700 dark:text-blue-400">
                Condition {c.n}
              </span>
              <a
                href={CFR_310_4}
                className="font-mono text-xs text-zinc-500 underline hover:text-zinc-700 dark:text-zinc-500 dark:hover:text-zinc-300"
                rel="noopener noreferrer"
                target="_blank"
              >
                {c.cite}
              </a>
            </div>
            <h2 className="mt-1 text-xl font-bold text-zinc-900 dark:text-white">{c.title}</h2>
            <p className="mt-2 text-base leading-relaxed text-zinc-700 dark:text-zinc-300">
              {c.requirement}
            </p>
            <p className="mt-3 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
              <strong className="font-semibold text-zinc-800 dark:text-zinc-200">
                What documented means:
              </strong>{" "}
              {c.documented}
            </p>
          </li>
        ))}
      </ol>

      <h2 className="mt-14 text-2xl font-bold text-zinc-900 dark:text-white">
        The 31-day clock, applied to aged data
      </h2>
      <p className="mt-3 text-base leading-relaxed text-zinc-700 dark:text-zinc-300">
        People register on the Do-Not-Call list every day, so a file cleaned six weeks ago is no
        longer clean. Aged data carries that problem twice: a 90-day-old record has had three
        months of registrations land on it since it was generated. Re-scrub before you work a
        batch, then every thirty-one days for as long as you keep working it — not once at
        purchase.
      </p>

      <h2 className="mt-10 text-2xl font-bold text-zinc-900 dark:text-white">
        Calling hours are a separate rule
      </h2>
      <p className="mt-3 text-base leading-relaxed text-zinc-700 dark:text-zinc-300">
        The registry governs <em>who</em> you may call, not <em>when</em>.{" "}
        <a
          href={CFR_310_4}
          className="underline hover:text-zinc-900 dark:hover:text-zinc-200"
          rel="noopener noreferrer"
          target="_blank"
        >
          16 CFR 310.4(c)
        </a>{" "}
        restricts calls to a residence to between 8:00 a.m. and 9:00 p.m. local time at the called
        person&rsquo;s location — not yours — and several states are stricter. Aged lists are
        almost always multi-state, so a perfectly scrubbed file dialed at 7:45 a.m. in a time zone
        you did not check is still a violation.
      </p>

      <h2 className="mt-10 text-2xl font-bold text-zinc-900 dark:text-white">
        Which law you are reading
      </h2>
      <p className="mt-3 text-base leading-relaxed text-zinc-700 dark:text-zinc-300">
        Everything above is the FTC&rsquo;s Telemarketing Sales Rule. The TCPA is a separate
        statute with its own rules at the FCC (
        <a
          href="https://www.ecfr.gov/current/title-47/section-64.1200"
          className="underline hover:text-zinc-900 dark:hover:text-zinc-200"
          rel="noopener noreferrer"
          target="_blank"
        >
          47 CFR 64.1200
        </a>
        ), and the TSR&rsquo;s own footnotes say that complying with one does not discharge your
        obligations under the other. When a vendor says a product makes you &ldquo;DNC
        compliant,&rdquo; ask which regime they mean.
      </p>

      <p className="mt-10 rounded-lg bg-zinc-100 p-5 text-sm leading-relaxed text-zinc-600 dark:bg-zinc-900 dark:text-zinc-400">
        Operational guidance, not legal advice — liability for every call sits with you, the
        caller. Confirm specifics with a TCPA attorney;{" "}
        <a
          href="https://www.henson-legal.com/"
          className="underline hover:text-zinc-900 dark:hover:text-zinc-200"
          rel="noopener noreferrer"
          target="_blank"
        >
          Henson Legal
        </a>{" "}
        is the firm we point people to.
      </p>

      <div className="mt-12">
        <LeadMagnetCta
          variant="card"
          heading="Get the fillable worksheet and the 31-day reminder"
          description="The six conditions above are free to read and always will be. The email version adds a fillable copy you can keep as your written procedure, plus a reminder when your scrub is about to go stale."
          buttonText="Send me the worksheet"
          leadMagnetId="dnc-safe-harbor-worksheet"
          context="dnc-safe-harbor-worksheet"
          features={[
            "Fillable copy of all six conditions",
            "A one-page written procedure you can adopt as-is",
            "A reminder before your 31-day scrub expires",
            "The weekly newsletter — unsubscribe any time",
          ]}
        />
      </div>

      <p className="mt-10 text-base leading-relaxed text-zinc-700 dark:text-zinc-300">
        Working out whether to scrub free or paid?{" "}
        <Link
          href="/blog/dnc-scrubbing-on-a-budget"
          className="font-semibold text-blue-700 underline hover:text-blue-800 dark:text-blue-400"
        >
          Read the free-versus-paid breakdown
        </Link>{" "}
        — including where litigator scrubbing fits, and where it does not.
      </p>
    </div>
  );
}
