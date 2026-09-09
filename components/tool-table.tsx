import Link from "next/link";

/**
 * Tool recommendations with the trade-off stated, not just the name.
 *
 * `components/comparison-table.tsx` could not be reused — its props are
 * `{ providerA, providerB }` and it is bound to `ProviderData` for scoring two lead
 * vendors head to head. This is a different job: three to six tools across categories,
 * each with an honest reason and an honest limit.
 *
 * EVERY ROW CARRIES A `limit`, and it is required rather than optional. A recommendation
 * with no stated downside reads as an ad, and this site's whole asset is that its
 * provider reviews are independent. The same standard applies to tooling.
 *
 * Outbound links are `rel="nofollow"` and open in place. None of these are affiliate
 * relationships — if one ever becomes one, it must route through `lib/affiliate.ts` and
 * carry the site-wide disclosure like every other paid link, not be quietly swapped in
 * here.
 */
export interface ToolRow {
  name: string;
  category: string;
  /** Why an aged-lead operator would pick this one. */
  why: string;
  /** What it is bad at, or who should not buy it. Required on purpose. */
  limit: string;
  href?: string;
  /** e.g. "from $97/mo", "free tier". Omit rather than guess. */
  pricing?: string;
}

export interface ToolTableProps {
  rows: ToolRow[];
  heading?: string | null;
  intro?: string;
}

export function ToolTable({ rows, heading = "What to use", intro }: ToolTableProps) {
  if (rows.length === 0) return null;

  return (
    <section className="my-10">
      {heading && (
        <h2 className="mb-2 text-2xl font-bold text-zinc-900 dark:text-white">{heading}</h2>
      )}
      {intro && (
        <p className="mb-6 max-w-2xl leading-relaxed text-zinc-600 dark:text-zinc-400">{intro}</p>
      )}

      {/* Cards on small screens, table from md up. A 5-column table on a phone is
          unreadable, and this content is read on phones. */}
      <div className="space-y-4 md:hidden">
        {rows.map((row) => (
          <div
            key={row.name}
            className="rounded-xl border border-zinc-200 p-5 dark:border-zinc-800"
          >
            <p className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
              {row.category}
            </p>
            <p className="mt-1 text-base font-bold text-zinc-900 dark:text-white">
              {row.href ? (
                <Link href={row.href} rel="nofollow" className="text-blue-700 underline dark:text-blue-400">
                  {row.name}
                </Link>
              ) : (
                row.name
              )}
              {row.pricing && (
                <span className="ml-2 text-xs font-normal text-zinc-500">{row.pricing}</span>
              )}
            </p>
            <p className="mt-2 text-sm leading-relaxed text-zinc-700 dark:text-zinc-300">
              {row.why}
            </p>
            <p className="mt-2 text-sm leading-relaxed text-amber-800 dark:text-amber-300">
              <span className="font-semibold">Limit:</span> {row.limit}
            </p>
          </div>
        ))}
      </div>

      <div className="hidden overflow-x-auto md:block">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="border-b-2 border-zinc-200 text-left dark:border-zinc-800">
              <th className="py-3 pr-4 font-semibold text-zinc-900 dark:text-white">Tool</th>
              <th className="py-3 pr-4 font-semibold text-zinc-900 dark:text-white">Use it for</th>
              <th className="py-3 font-semibold text-zinc-900 dark:text-white">Where it stops</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.name} className="border-b border-zinc-100 align-top dark:border-zinc-800">
                <td className="py-4 pr-4">
                  <span className="block font-semibold text-zinc-900 dark:text-white">
                    {row.href ? (
                      <Link
                        href={row.href}
                        rel="nofollow"
                        className="text-blue-700 underline dark:text-blue-400"
                      >
                        {row.name}
                      </Link>
                    ) : (
                      row.name
                    )}
                  </span>
                  <span className="block text-xs text-zinc-500">{row.category}</span>
                  {row.pricing && (
                    <span className="block text-xs text-zinc-500">{row.pricing}</span>
                  )}
                </td>
                <td className="py-4 pr-4 leading-relaxed text-zinc-700 dark:text-zinc-300">
                  {row.why}
                </td>
                <td className="py-4 leading-relaxed text-amber-800 dark:text-amber-300">
                  {row.limit}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="mt-4 text-xs text-zinc-500 dark:text-zinc-500">
        No vendor on this list pays us. Our only paid relationship is disclosed site-wide on
        our{" "}
        <Link href="/affiliate-disclosure" className="underline">
          affiliate disclosure
        </Link>
        .
      </p>
    </section>
  );
}
