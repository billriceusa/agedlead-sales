import type { PriceBenchmarkData } from "@/data/price-benchmarks";
import {
  formatPrice,
  AGE_BRACKET_LABELS,
  CONFIDENCE_LABELS,
} from "@/data/price-benchmarks";

interface PriceBenchmarkTableProps {
  benchmarks: PriceBenchmarkData[];
  exclusivityFilter?: string;
  leadTypeFilter?: string;
}

function ConfidenceDot({ level }: { level: string }) {
  const colors: Record<string, string> = {
    high: "bg-green-500",
    medium: "bg-yellow-500",
    low: "bg-red-400",
  };
  return (
    <span
      className={`inline-block h-1.5 w-1.5 rounded-full ${colors[level] || "bg-zinc-400"}`}
      title={CONFIDENCE_LABELS[level] || level}
    />
  );
}

export function PriceBenchmarkTable({
  benchmarks,
  exclusivityFilter,
  leadTypeFilter,
}: PriceBenchmarkTableProps) {
  const filtered = benchmarks.filter((b) => {
    if (exclusivityFilter && b.exclusivity !== exclusivityFilter) return false;
    if (leadTypeFilter && b.leadType !== leadTypeFilter) return false;
    return true;
  });

  // Sort by age bracket order
  const ageBracketOrder = [
    "real-time",
    "1-7-days",
    "8-30-days",
    "31-85-days",
    "86-180-days",
    "181-365-days",
  ];
  const sorted = [...filtered].sort(
    (a, b) =>
      ageBracketOrder.indexOf(a.leadAgeBracket) -
      ageBracketOrder.indexOf(b.leadAgeBracket)
  );

  if (sorted.length === 0) {
    return (
      <div className="rounded-lg border border-zinc-200 bg-zinc-50 p-8 text-center dark:border-zinc-700 dark:bg-zinc-800">
        <p className="text-sm text-zinc-500 dark:text-zinc-400">
          No benchmark data available for this combination.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border border-zinc-200 dark:border-zinc-700">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-zinc-200 bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-800">
            <th className="px-4 py-3 text-left font-medium text-zinc-600 dark:text-zinc-400">
              Lead Age
            </th>
            <th className="px-4 py-3 text-right font-medium text-zinc-600 dark:text-zinc-400">
              Low
            </th>
            <th className="px-4 py-3 text-right font-medium text-zinc-600 dark:text-zinc-400">
              Median
            </th>
            <th className="px-4 py-3 text-right font-medium text-zinc-600 dark:text-zinc-400">
              High
            </th>
            <th className="hidden px-4 py-3 text-right font-medium text-zinc-600 dark:text-zinc-400 sm:table-cell">
              Confidence
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-zinc-200 dark:divide-zinc-700">
          {sorted.map((b, i) => (
            <tr
              key={`${b.leadAgeBracket}-${b.exclusivity}-${b.leadType}`}
              className={
                i % 2 === 0
                  ? "bg-white dark:bg-zinc-900"
                  : "bg-zinc-50 dark:bg-zinc-900/50"
              }
            >
              <td className="px-4 py-3 font-medium text-zinc-700 dark:text-zinc-300">
                {AGE_BRACKET_LABELS[b.leadAgeBracket] || b.leadAgeBracket}
              </td>
              <td className="px-4 py-3 text-right text-zinc-600 dark:text-zinc-400">
                {formatPrice(b.priceLow)}
              </td>
              <td className="px-4 py-3 text-right font-semibold text-zinc-900 dark:text-white">
                {formatPrice(b.priceMedian)}
              </td>
              <td className="px-4 py-3 text-right text-zinc-600 dark:text-zinc-400">
                {formatPrice(b.priceHigh)}
              </td>
              <td className="hidden px-4 py-3 text-right sm:table-cell">
                <span className="inline-flex items-center gap-1.5 text-xs text-zinc-500 dark:text-zinc-400">
                  <ConfidenceDot level={b.confidence} />
                  {b.confidence}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
