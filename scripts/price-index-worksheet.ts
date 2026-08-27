/**
 * Lead Price Index — Q3 research worksheet generator.
 *
 * `price-index-gap.ts` says *which* cells need re-pricing. This turns that
 * into the artifact Bill actually fills in: a CSV with one pre-addressed row
 * per (cell x provider observation slot), so the research is data entry
 * against a fixed checklist rather than an open-ended dig.
 *
 * Why a worksheet and not a script that estimates prices: the Price Index is a
 * quarterly HUMAN-VERIFIED study. Auto-synthesis was removed in 46805ee
 * because single-provider LLM guesses polluted the index. Every row here needs
 * a provider name, an observed price, and a source URL — `price-index-import`
 * refuses anything missing a citation, and refuses any cell that did not reach
 * the 2-provider trust gate.
 *
 * Usage:
 *   npm run price-index:worksheet                 # target month = current
 *   npm run price-index:worksheet -- --month 2026-08
 *   npm run price-index:worksheet -- --slots 4    # observation rows per cell
 *
 * Reads only. Writes one CSV. No Sanity token required.
 */

import { writeFileSync } from "node:fs";
import { join } from "node:path";

const PROJECT_ID = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ?? "p7rbtajg";
const DATASET = process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production";

/** `components/price-trend-chart.tsx:53` returns null below this. */
const TREND_CHART_MIN_MONTHS = 3;
/** `lib/benchmark-coverage.ts` trust gate — single-provider rows are junk. */
const MIN_PROVIDERS = 2;

const OUT_PATH = join(
  process.cwd(),
  "data",
  "loop",
  "price-index-q3-worksheet.csv"
);

interface Benchmark {
  vertical: string;
  month: string;
  leadAgeBracket: string;
  exclusivity: string;
  leadType: string;
  priceLow: number;
  priceMedian: number;
  priceHigh: number;
  providersSampled: number | null;
}

export const WORKSHEET_COLUMNS = [
  "vertical",
  "leadAgeBracket",
  "exclusivity",
  "leadType",
  "targetMonth",
  "providerName",
  "priceLow",
  "priceHigh",
  "sourceUrl",
  "observedDate",
  "notes",
] as const;

function arg(flag: string): string | undefined {
  const i = process.argv.indexOf(flag);
  return i === -1 ? undefined : process.argv[i + 1];
}

async function fetchBenchmarks(): Promise<Benchmark[]> {
  const query = `*[_type=="priceBenchmark"]{
    month, leadAgeBracket, exclusivity, leadType,
    priceLow, priceMedian, priceHigh, providersSampled,
    "vertical": vertical->slug.current
  }`;
  const url =
    `https://${PROJECT_ID}.api.sanity.io/v2023-05-03/data/query/${DATASET}` +
    `?query=${encodeURIComponent(query)}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Sanity ${res.status}: ${await res.text()}`);
  const body = (await res.json()) as { result?: Benchmark[] };
  if (!body.result) throw new Error("Sanity returned no result set");
  return body.result.filter((b) => b.vertical);
}

const csvEscape = (v: string) =>
  /[",\n]/.test(v) ? `"${v.replace(/"/g, '""')}"` : v;

async function main() {
  const targetMonth = arg("--month") ?? new Date().toISOString().slice(0, 7);
  if (!/^\d{4}-\d{2}$/.test(targetMonth)) {
    throw new Error(`--month must be YYYY-MM, got "${targetMonth}"`);
  }
  const slots = Number(arg("--slots") ?? 3);
  if (!Number.isInteger(slots) || slots < MIN_PROVIDERS) {
    throw new Error(`--slots must be an integer >= ${MIN_PROVIDERS}`);
  }

  const benchmarks = await fetchBenchmarks();
  const reliable = benchmarks.filter(
    (b) => (b.providersSampled ?? 0) >= MIN_PROVIDERS
  );

  const monthsByVertical = new Map<string, Set<string>>();
  for (const b of reliable) {
    if (!monthsByVertical.has(b.vertical))
      monthsByVertical.set(b.vertical, new Set());
    monthsByVertical.get(b.vertical)!.add(b.month);
  }

  // Only the verticals a single verified month would unlock a chart for.
  const needsUnlock = [...monthsByVertical.entries()]
    .filter(([, months]) => months.size < TREND_CHART_MIN_MONTHS)
    .map(([v]) => v)
    .sort();

  const lines: string[] = [WORKSHEET_COLUMNS.join(",")];
  let cellCount = 0;

  for (const vertical of needsUnlock) {
    const rows = reliable.filter((b) => b.vertical === vertical);
    // Re-observe the SAME cells as the newest reliable month. A chart built
    // from a different cell mix month to month measures the mix, not the market.
    const newest = rows
      .map((b) => b.month)
      .sort()
      .at(-1)!;
    if (newest === targetMonth) continue; // already priced this month
    const cells = rows
      .filter((b) => b.month === newest)
      .sort((a, b) =>
        `${a.leadAgeBracket}${a.exclusivity}${a.leadType}`.localeCompare(
          `${b.leadAgeBracket}${b.exclusivity}${b.leadType}`
        )
      );

    for (const c of cells) {
      cellCount++;
      const prior =
        `prior ${newest}: $${c.priceLow}-$${c.priceHigh} ` +
        `(median $${c.priceMedian}, n=${c.providersSampled ?? "?"})`;
      for (let s = 0; s < slots; s++) {
        lines.push(
          [
            c.vertical,
            c.leadAgeBracket,
            c.exclusivity,
            c.leadType,
            targetMonth,
            "", // providerName
            "", // priceLow
            "", // priceHigh
            "", // sourceUrl
            "", // observedDate
            s === 0 ? csvEscape(prior) : "",
          ].join(",")
        );
      }
    }
  }

  writeFileSync(OUT_PATH, lines.join("\n") + "\n");

  console.log(`Wrote ${OUT_PATH}`);
  console.log(
    `${needsUnlock.length} vertical(s), ${cellCount} cell(s), ` +
      `${slots} observation slot(s) each = ${cellCount * slots} rows to fill.`
  );
  console.log("");
  console.log("How to fill it:");
  console.log(
    `  - Each cell needs at least ${MIN_PROVIDERS} rows with a provider, a price and a sourceUrl.`
  );
  console.log("  - Point price? Put the same number in priceLow and priceHigh.");
  console.log(
    "  - Published a range? priceLow and priceHigh are that provider's range."
  );
  console.log("  - Leave unused slots blank; the importer ignores them.");
  console.log("  - sourceUrl must be the page you read the price on.");
  console.log("");
  console.log(
    "Then: npm run price-index:import        # validates, shows the plan"
  );
  console.log("      npm run price-index:import -- --apply");
}

main().catch((err) => {
  console.error(err instanceof Error ? err.message : err);
  process.exit(1);
});
