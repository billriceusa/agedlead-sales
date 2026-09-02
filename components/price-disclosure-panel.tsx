import Link from "next/link";
import { PROVIDERS } from "@/data/providers";
import {
  providersPublishingPrices,
  disclosureStats,
  DISCLOSURE_META,
} from "@/data/price-disclosure";

/**
 * What stands where a price trend chart cannot yet.
 *
 * `PriceTrendChart` renders nothing below three verified months, which is the
 * right call — two points is not a trend — but it left a silent hole on nine of
 * eleven vertical pages. A reader who came for pricing got a table and no
 * explanation of why there was no chart.
 *
 * The Q3 study (2026-09-02) tried to close that gap from public sources and
 * filled zero of twelve cells, because the prices are not published. One
 * provider in fifteen states a per-lead price a buyer could compare.
 *
 * So this panel says that, plainly, and turns the absence into the finding.
 * Non-disclosure is not an accident in this market — a published number commits
 * a seller to it and lets a buyer walk to a competitor holding an exact figure.
 * Naming who does publish is the only real pressure a directory can apply, and
 * it makes transparency worth something to the providers who practise it.
 *
 * This reads favourably for Aged Lead Store, which is an affiliate partner. It
 * is not a favour. It is a fact any reader can check in a browser in ten
 * seconds, the source link is right there, and the panel would say the opposite
 * just as readily — the data behind it is re-verified from the live sites each
 * quarter, not asserted.
 */

interface Props {
  /** Vertical display name, for the copy. */
  verticalName: string;
  /** How many verified months this vertical actually has. */
  monthsAvailable: number;
  /** Months needed before a trend line means anything. */
  monthsRequired?: number;
}

export function PriceDisclosurePanel({
  verticalName,
  monthsAvailable,
  monthsRequired = 3,
}: Props) {
  const stats = disclosureStats();
  const publishers = providersPublishingPrices();
  const nameOf = (slug: string) =>
    PROVIDERS.find((p) => p.slug === slug)?.name ?? slug;

  return (
    <section className="rounded-xl border border-zinc-200 bg-zinc-50 p-6 dark:border-zinc-800 dark:bg-zinc-900 sm:p-8">
      <p className="text-xs font-bold uppercase tracking-widest text-blue-700 dark:text-blue-400">
        Why there is no trend chart here yet
      </p>

      <h2 className="mt-2 text-xl font-bold text-zinc-900 dark:text-white">
        Almost nobody in this market publishes a price
      </h2>

      <p className="mt-3 text-[15px] leading-relaxed text-zinc-600 dark:text-zinc-400">
        A price trend needs {monthsRequired} verified months before it means
        anything, and {verticalName.toLowerCase()} currently has{" "}
        {monthsAvailable === 0 ? "none" : monthsAvailable}. That is not for lack
        of looking. In September 2026 we checked every provider in our directory
        for a per-lead price stated publicly, with its lead age and exclusivity —
        specific enough that a buyer could actually compare it.
      </p>

      <div className="mt-5 flex flex-wrap gap-3">
        <div className="rounded-lg border border-zinc-200 bg-white px-4 py-3 dark:border-zinc-700 dark:bg-zinc-950">
          <p className="text-2xl font-bold text-zinc-900 dark:text-white">
            {stats.publishing}
            <span className="text-base font-medium text-zinc-400">
              {" "}
              / {stats.total}
            </span>
          </p>
          <p className="text-xs text-zinc-500 dark:text-zinc-400">
            publish any price
          </p>
        </div>
        <div className="rounded-lg border border-zinc-200 bg-white px-4 py-3 dark:border-zinc-700 dark:bg-zinc-950">
          <p className="text-2xl font-bold text-zinc-900 dark:text-white">
            {stats.quoteOnly}
          </p>
          <p className="text-xs text-zinc-500 dark:text-zinc-400">
            require a quote
          </p>
        </div>
      </div>

      <p className="mt-5 text-[15px] leading-relaxed text-zinc-600 dark:text-zinc-400">
        &ldquo;Call for a quote&rdquo; is a pricing strategy, not an oversight. A
        published number commits a seller to it, and it lets you walk to a
        competitor holding an exact figure. Which is why the ones who do publish
        are worth naming:
      </p>

      <ul className="mt-4 space-y-3">
        {publishers.map((d) => {
          const meta = DISCLOSURE_META[d.level];
          return (
            <li
              key={d.slug}
              className="rounded-lg border border-zinc-200 bg-white p-4 dark:border-zinc-700 dark:bg-zinc-950"
            >
              <div className="flex flex-wrap items-center gap-2">
                <Link
                  href={`/providers/${d.slug}`}
                  className="font-semibold text-zinc-900 hover:text-blue-700 dark:text-white dark:hover:text-blue-400"
                >
                  {nameOf(d.slug)}
                </Link>
                <span
                  className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ${
                    meta.tone === "good"
                      ? "bg-green-100 text-green-800 dark:bg-green-950 dark:text-green-300"
                      : "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300"
                  }`}
                >
                  {meta.short}
                </span>
              </div>
              <p className="mt-1.5 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
                {d.note}
              </p>
              <p className="mt-1.5 text-xs text-zinc-400">
                Verified {d.verified} ·{" "}
                <a
                  href={d.sourceUrl}
                  rel="nofollow noopener noreferrer"
                  target="_blank"
                  className="underline hover:text-zinc-600 dark:hover:text-zinc-300"
                >
                  check it yourself
                </a>
              </p>
            </li>
          );
        })}
      </ul>

      <p className="mt-5 text-sm leading-relaxed text-zinc-500 dark:text-zinc-400">
        The benchmark tables below come from our own quarterly study rather than
        from vendor pages, which is why they exist at all. See{" "}
        <Link
          href="/methodology"
          className="underline hover:text-zinc-700 dark:hover:text-zinc-300"
        >
          how we gather them
        </Link>
        .
      </p>
    </section>
  );
}
