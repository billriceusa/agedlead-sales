/**
 * A multi-step email sequence, rendered as authored copy an operator can lift.
 *
 * WHY THIS IS NEW CODE
 *
 * Nothing in `components/` rendered a sequence before this. The two closest things were
 * both unusable: the "Sample Opening Script" block is inline JSX inside
 * `app/(site)/lead-types/[slug]/page.tsx` rather than a component, and
 * `components/calculators/outreach-cadence-planner.tsx` *computes* touch spacing from
 * user input instead of displaying authored copy. This borrows the script block's card
 * chrome and the planner's day-chip treatment, and does the job neither could.
 *
 * WHY EMAIL AND NOT "CHANNEL" (Bill, 2026-09-09)
 *
 * There is no `channel` field, on purpose. The doctrine for aged leads is email and
 * manual dial only until the prospect gives fresh consent, so a component that made SMS
 * a first-class option would quietly invite the thing the site now tells people not to
 * do. A sequence that graduates to other channels does so *after* the consent step, and
 * that belongs in prose, not in a data field.
 *
 * `body` splits on "\n\n" for paragraphs, matching the `deepDive` convention already used
 * in data/flagship-verticals.ts and data/lead-types.ts.
 */
export interface EmailStep {
  /** Days after sequence start. Day 0 is the first send. */
  day: number;
  subject: string;
  /** The email body as authored. Paragraph breaks are "\n\n". */
  body: string;
  /** Why this email is shaped the way it is. The teaching half. */
  whyItWorks: string[];
  /**
   * Marks the email that asks for consent. Rendered distinctly because it is the
   * hinge of the whole sequence — everything before it re-opens the conversation,
   * everything after it runs on permission the operator captured directly.
   */
  isConsentAsk?: boolean;
}

export interface EmailSequenceProps {
  steps: EmailStep[];
  /** Optional heading. Pass null to render bare inside a section that already has one. */
  heading?: string | null;
  intro?: string;
}

function dayLabel(day: number): string {
  return day === 0 ? "Day 0 — send today" : `Day ${day}`;
}

export function EmailSequence({
  steps,
  heading = "The sequence",
  intro,
}: EmailSequenceProps) {
  if (steps.length === 0) return null;

  return (
    <section className="my-10">
      {heading && (
        <h2 className="mb-2 text-2xl font-bold text-zinc-900 dark:text-white">{heading}</h2>
      )}
      {intro && (
        <p className="mb-6 max-w-2xl leading-relaxed text-zinc-600 dark:text-zinc-400">{intro}</p>
      )}

      <ol className="space-y-5">
        {steps.map((step, i) => {
          const accent = step.isConsentAsk
            ? "border-emerald-300 bg-emerald-50 dark:border-emerald-900 dark:bg-emerald-950/40"
            : "border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900/60";
          const chip = step.isConsentAsk
            ? "bg-emerald-600 text-white"
            : "bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300";

          return (
            <li key={i} className={`rounded-xl border-2 p-6 ${accent}`}>
              <div className="mb-3 flex flex-wrap items-center gap-3">
                <span
                  className={`rounded-full px-3 py-1 text-xs font-bold whitespace-nowrap ${chip}`}
                >
                  {dayLabel(step.day)}
                </span>
                {step.isConsentAsk && (
                  <span className="text-xs font-semibold uppercase tracking-wider text-emerald-800 dark:text-emerald-300">
                    This is the permission ask
                  </span>
                )}
              </div>

              <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-500">
                Subject
              </p>
              <p className="mb-4 text-base font-semibold text-zinc-900 dark:text-white">
                {step.subject}
              </p>

              <div className="mb-4 border-l-4 border-zinc-300 pl-4 dark:border-zinc-700">
                {step.body
                  .split("\n\n")
                  .filter(Boolean)
                  .map((para, j) => (
                    <p
                      key={j}
                      className="mb-3 text-sm leading-relaxed text-zinc-700 last:mb-0 dark:text-zinc-300"
                    >
                      {para}
                    </p>
                  ))}
              </div>

              {step.whyItWorks.length > 0 && (
                <>
                  <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-blue-700 dark:text-blue-400">
                    Why this works
                  </p>
                  <ul className="space-y-1.5">
                    {step.whyItWorks.map((reason) => (
                      <li
                        key={reason}
                        className="flex items-start gap-2 text-sm text-zinc-600 dark:text-zinc-400"
                      >
                        <span className="mt-0.5 text-blue-500">&#10003;</span>
                        <span>{reason}</span>
                      </li>
                    ))}
                  </ul>
                </>
              )}
            </li>
          );
        })}
      </ol>
    </section>
  );
}
