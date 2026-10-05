import type { ReactElement } from "react";
import Link from "next/link";

/**
 * Contextual internal routing module — "where to go next from here".
 *
 * WHY THIS EXISTS (Click Loop iteration P4, 2026-10-05)
 *
 * Four pages — `/`, `/playbook`, `/calculators` and the "complete system"
 * pillar post — drew 1,615 views in the measured window and produced 12
 * affiliate clicks (0.74%). Eleven lead-type and provider pages drew 333 views
 * and produced 76 (22.8%). The traffic and the intent are on opposite sides of
 * a 31x gap.
 *
 * The loop has already killed the obvious response three separate times: the
 * homepage hero door (1 store session, 0 orders, $0.00 in five weeks), both
 * calculator result doors (zero store sessions, ever) and the statistics-page
 * CTAs. See `kills[]` in data/loop/ledger.json. So this is deliberately NOT a
 * store door, a banner or a buy button. It is internal navigation: move the
 * reader to the surface that already converts rather than trying to convert
 * them where they stand.
 *
 * DESIGN CONSTRAINTS THIS COMPONENT ENCODES
 *
 * - Every destination is a first-party URL. No affiliate link, no outbound host.
 * - Each caller writes its own per-destination copy, because a reader on the
 *   calculators hub and a reader on the playbook hub need different reasons to
 *   click. A shared list of labels would be a link dump.
 * - Pure server component: the links are real crawlable <a> tags in the SSR
 *   HTML, which also concentrates internal link equity on the commercial pages
 *   (same reasoning as components/related-links.tsx).
 * - Icons are inline SVG, matching the convention used elsewhere in this repo.
 *   No emoji.
 */

export type NextStepIcon = "verticals" | "pricing" | "providers" | "review";

const ICON_PATHS: Record<NextStepIcon, ReactElement> = {
  // Squares grid — browse by vertical.
  verticals: (
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M3.75 6A2.25 2.25 0 0 1 6 3.75h2.25A2.25 2.25 0 0 1 10.5 6v2.25a2.25 2.25 0 0 1-2.25 2.25H6a2.25 2.25 0 0 1-2.25-2.25V6Zm0 9.75A2.25 2.25 0 0 1 6 13.5h2.25a2.25 2.25 0 0 1 2.25 2.25V18a2.25 2.25 0 0 1-2.25 2.25H6A2.25 2.25 0 0 1 3.75 18v-2.25ZM13.5 6a2.25 2.25 0 0 1 2.25-2.25H18A2.25 2.25 0 0 1 20.25 6v2.25A2.25 2.25 0 0 1 18 10.5h-2.25a2.25 2.25 0 0 1-2.25-2.25V6Zm0 9.75a2.25 2.25 0 0 1 2.25-2.25H18a2.25 2.25 0 0 1 2.25 2.25V18A2.25 2.25 0 0 1 18 20.25h-2.25a2.25 2.25 0 0 1-2.25-2.25v-2.25Z"
    />
  ),
  // Tag — price benchmarks.
  pricing: (
    <>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M9.568 3H5.25A2.25 2.25 0 0 0 3 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.921 2.656.49a11.27 11.27 0 0 0 5.014-5.014c.431-.876.209-1.957-.49-2.656L11.16 3.659A2.25 2.25 0 0 0 9.568 3Z"
      />
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 6h.008v.008H6V6Z" />
    </>
  ),
  // Storefront — the seller directory.
  providers: (
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M13.5 21v-7.5a.75.75 0 0 1 .75-.75h3a.75.75 0 0 1 .75.75V21m-4.5 0H2.36m11.14 0H18m0 0h3.64m-1.39 0V9.349M3.75 21V9.349m0 0a3.001 3.001 0 0 0 3.75-.615A2.993 2.993 0 0 0 9.75 9.75c.896 0 1.7-.393 2.25-1.016a2.993 2.993 0 0 0 2.25 1.016c.896 0 1.7-.393 2.25-1.015a3.001 3.001 0 0 0 3.75.614m-16.5 0a3.004 3.004 0 0 1-.621-4.72l1.189-1.19A1.5 1.5 0 0 1 5.378 3h13.243a1.5 1.5 0 0 1 1.06.44l1.19 1.189a3 3 0 0 1-.621 4.72m-13.5 8.351h3.75a.75.75 0 0 0 .75-.75V13.5a.75.75 0 0 0-.75-.75H6.75a.75.75 0 0 0-.75.75v3.75c0 .414.336.75.75.75Z"
    />
  ),
  // Badge with a check — a worked, written review.
  review: (
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M9 12.75 11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 0 1-1.043 3.296 3.745 3.745 0 0 1-3.296 1.043A3.745 3.745 0 0 1 12 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 0 1-3.296-1.043 3.745 3.745 0 0 1-1.043-3.296A3.745 3.745 0 0 1 3 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 0 1 1.043-3.296 3.746 3.746 0 0 1 3.296-1.043A3.746 3.746 0 0 1 12 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 0 1 3.296 1.043 3.746 3.746 0 0 1 1.043 3.296A3.745 3.745 0 0 1 21 12Z"
    />
  ),
};

export interface NextStepItem {
  /** First-party path. Never an outbound or affiliate URL. */
  href: string;
  label: string;
  /** Why this page, for this reader, right here. Written per caller. */
  description: string;
  icon: NextStepIcon;
  /** Optional one-line qualifier, e.g. who should take this route. */
  meta?: string;
}

export function NextStepRouter({
  heading,
  intro,
  items,
  tone = "muted",
  className = "",
}: {
  heading: string;
  intro?: string;
  items: NextStepItem[];
  /** Match the alternating section backgrounds on the host page. */
  tone?: "muted" | "plain";
  className?: string;
}) {
  if (items.length === 0) return null;

  const toneClasses =
    tone === "plain"
      ? "bg-white dark:bg-zinc-950"
      : "bg-zinc-50 dark:bg-zinc-900";

  const columns =
    items.length >= 3 ? "sm:grid-cols-2 lg:grid-cols-3" : "sm:grid-cols-2";

  return (
    <section
      id="next-steps"
      className={`scroll-mt-20 border-y border-zinc-200 py-14 dark:border-zinc-800 sm:py-16 ${toneClasses} ${className}`}
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl">
          <h2 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-white sm:text-3xl">
            {heading}
          </h2>
          {intro && (
            <p className="mt-3 text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
              {intro}
            </p>
          )}
        </div>

        <ul className={`mt-8 grid gap-4 ${columns}`}>
          {items.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                className="group flex h-full flex-col rounded-xl border border-zinc-200 bg-white p-5 transition-colors hover:border-blue-400 dark:border-zinc-800 dark:bg-zinc-950 dark:hover:border-blue-600"
              >
                <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-50 text-blue-600 dark:bg-blue-950/60 dark:text-blue-400">
                  <svg
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.6}
                    stroke="currentColor"
                    aria-hidden="true"
                  >
                    {ICON_PATHS[item.icon]}
                  </svg>
                </span>
                <span className="mt-4 text-base font-semibold text-zinc-900 group-hover:text-blue-700 dark:text-white dark:group-hover:text-blue-400">
                  {item.label}{" "}
                  <span
                    aria-hidden="true"
                    className="text-blue-600 dark:text-blue-400"
                  >
                    &rarr;
                  </span>
                </span>
                <span className="mt-2 flex-1 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
                  {item.description}
                </span>
                {item.meta && (
                  <span className="mt-3 text-xs font-medium uppercase tracking-wider text-zinc-500 dark:text-zinc-500">
                    {item.meta}
                  </span>
                )}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
