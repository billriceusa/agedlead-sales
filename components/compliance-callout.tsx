import Link from "next/link";

/**
 * A compliance boundary stated plainly, in its own box.
 *
 * WHY THIS IS NOT `KeyTakeawayBox`
 *
 * `components/key-takeaway-box.tsx` takes a single `excerpt` string and splits it on
 * sentence boundaries into bullets. That is right for a summary and wrong for a legal
 * boundary: a compliance rule has to say exactly what it says, in the order it says it,
 * and it must not be reflowed by a regex. This takes explicit body copy and explicit
 * rules instead.
 *
 * WHY IT EXISTS AT ALL (Bill, 2026-09-09)
 *
 * The doctrine for this site is Mode A — manual dial and email only against aged leads,
 * no texting and no autodialing on inherited consent, until the prospect gives fresh
 * consent directly. That rule was written in the gated flagship playbook and nowhere on
 * the public site, while five public pages taught SMS templates. Every new operator
 * asset carries this box so the boundary travels with the tactic instead of living one
 * click away.
 *
 * `tone` is deliberate rather than inferred. A hard stop and a piece of context should
 * not look identical.
 */
export interface ComplianceCalloutProps {
  heading: string;
  /** Paragraphs. Split on "\n\n", matching the `deepDive` convention in data/flagship-verticals.ts. */
  body: string;
  /** Optional hard rules, rendered as a list under the body. */
  rules?: string[];
  /** `stop` for a do-not-do-this boundary, `note` for context. */
  tone?: "stop" | "note";
  /** Where to read the full doctrine. Defaults to the Fresh-Consent Ladder guide. */
  learnMoreHref?: string | null;
  learnMoreLabel?: string;
}

const TONE = {
  stop: {
    wrap: "border-amber-300 bg-amber-50 dark:border-amber-900 dark:bg-amber-950/40",
    label: "text-amber-800 dark:text-amber-300",
    marker: "bg-amber-500",
    link: "text-amber-900 hover:text-amber-950 dark:text-amber-300 dark:hover:text-amber-200",
    eyebrow: "Compliance boundary",
  },
  note: {
    wrap: "border-zinc-300 bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-900/60",
    label: "text-zinc-700 dark:text-zinc-300",
    marker: "bg-zinc-400",
    link: "text-blue-700 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300",
    eyebrow: "Before you send",
  },
} as const;

export function ComplianceCallout({
  heading,
  body,
  rules = [],
  tone = "stop",
  learnMoreHref = "/guides/fresh-consent-ladder",
  learnMoreLabel = "Read the Fresh-Consent Ladder",
}: ComplianceCalloutProps) {
  const t = TONE[tone];
  const paragraphs = body.split("\n\n").filter(Boolean);

  return (
    <aside
      className={`my-8 rounded-xl border-2 p-6 ${t.wrap}`}
      aria-label={`${t.eyebrow}: ${heading}`}
    >
      <p className={`mb-1 text-xs font-semibold uppercase tracking-wider ${t.label}`}>
        {t.eyebrow}
      </p>
      <h3 className="mb-3 text-lg font-semibold text-zinc-900 dark:text-white">{heading}</h3>

      {paragraphs.map((p, i) => (
        <p key={i} className="mb-3 text-sm leading-relaxed text-zinc-700 last:mb-0 dark:text-zinc-300">
          {p}
        </p>
      ))}

      {rules.length > 0 && (
        <ul className="mt-4 space-y-2">
          {rules.map((rule) => (
            <li
              key={rule}
              className="flex gap-2.5 text-sm leading-relaxed text-zinc-800 dark:text-zinc-200"
            >
              <span className={`mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full ${t.marker}`} />
              <span>{rule}</span>
            </li>
          ))}
        </ul>
      )}

      {learnMoreHref && (
        <Link
          href={learnMoreHref}
          className={`mt-4 inline-block text-sm font-semibold underline ${t.link}`}
        >
          {learnMoreLabel} &rarr;
        </Link>
      )}

      <p className="mt-4 text-xs leading-relaxed text-zinc-500 dark:text-zinc-500">
        Operator guidance, not legal advice. TCPA, FCC rules and state mini-TCPA laws change
        frequently, and consent requirements vary by state and by consent record. Consult
        counsel familiar with TCPA and your state&apos;s rules before running outreach against
        any list.
      </p>
    </aside>
  );
}
