/**
 * Validate `data/loop/ledger.json`.
 *
 * The ledger is the Click Loop's operating record — the input to the kill rule
 * (CLICK-LOOP.md step 6) and the monthly engine review. Nothing imports it, so
 * a malformed ledger does not break the build and ships silently. That happened
 * on 2026-08-18: the iteration-2 entry landed without a comma separator and the
 * file stopped parsing.
 *
 * Run with `npm run loop:check`. Exits non-zero on any problem.
 */

import { readFileSync } from "node:fs";
import { join } from "node:path";

const LEDGER = join(process.cwd(), "data", "loop", "ledger.json");
const ENGINES = new Set([
  "merchant-intelligence",
  "live-data",
  "tools",
  "experiences",
  "unblock",
]);
const VERDICTS = new Set(["pending", "keep", "kill", "n/a"]);

const problems: string[] = [];

let raw: string;
try {
  raw = readFileSync(LEDGER, "utf8");
} catch (err) {
  console.error(`Cannot read ${LEDGER}: ${err instanceof Error ? err.message : err}`);
  process.exit(1);
}

interface Iteration {
  iteration?: number;
  date?: string;
  engine?: string;
  asset?: string;
  verdict?: string;
}

let data: { iterations?: Iteration[]; scoreboardReadings?: unknown[]; kills?: unknown[] };
try {
  data = JSON.parse(raw);
} catch (err) {
  console.error(`ledger.json does not parse: ${err instanceof Error ? err.message : err}`);
  process.exit(1);
}

const iterations = data.iterations;
if (!Array.isArray(iterations)) {
  problems.push("`iterations` is missing or not an array");
} else {
  const seen = new Set<number>();
  iterations.forEach((it, i) => {
    const where = `iterations[${i}]`;
    if (typeof it.iteration !== "number") problems.push(`${where}: iteration must be a number`);
    else if (seen.has(it.iteration)) problems.push(`${where}: duplicate iteration ${it.iteration}`);
    else seen.add(it.iteration);

    if (!it.date || !/^\d{4}-\d{2}-\d{2}$/.test(it.date))
      problems.push(`${where}: date must be YYYY-MM-DD`);
    if (!it.asset) problems.push(`${where}: asset is required`);
    if (!it.engine || !ENGINES.has(it.engine))
      problems.push(`${where}: engine must be one of ${[...ENGINES].join(", ")}`);
    if (!it.verdict || !VERDICTS.has(it.verdict))
      problems.push(`${where}: verdict must be one of ${[...VERDICTS].join(", ")}`);
  });
}

for (const key of ["scoreboardReadings", "kills"] as const) {
  if (!Array.isArray(data[key])) problems.push(`\`${key}\` is missing or not an array`);
}

if (problems.length) {
  console.error("Loop ledger is invalid:");
  for (const p of problems) console.error(`  - ${p}`);
  process.exit(1);
}

console.log(
  `Loop ledger OK — ${iterations!.length} iteration(s), ` +
    `${data.scoreboardReadings!.length} scoreboard reading(s), ` +
    `${data.kills!.length} kill(s).`
);
