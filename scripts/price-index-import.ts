/**
 * Lead Price Index — import the filled Q3 research worksheet into Sanity.
 *
 * Reads `data/loop/price-index-q3-worksheet.csv`, validates every observation,
 * derives each cell's low/median/high from the raw provider observations, and
 * writes one `priceBenchmark` document per cell.
 *
 * The aggregates are DERIVED here, never typed by hand. That is the point: a
 * hand-computed median is unfalsifiable, and the index already got polluted
 * once (46805ee) by numbers nobody could trace to a source. Every observation
 * carries a provider and a sourceUrl, and the notes field on the published
 * benchmark records them so any figure on a price page can be walked back to
 * the page it was read from.
 *
 * Refusals — the script exits non-zero rather than writing partial data:
 *   - an observation with a price but no sourceUrl, or no providerName
 *   - a cell that reached fewer than 2 distinct providers (the trust gate in
 *     `lib/benchmark-coverage.ts`; single-provider rows are junk)
 *   - priceLow > priceHigh
 *   - a vertical slug with no matching `vertical` document
 *
 * Usage:
 *   npm run price-index:import                 # dry run, prints the plan
 *   npm run price-index:import -- --apply      # writes to Sanity
 *   npm run price-index:import -- --file <path>
 *
 * Required env for --apply: SANITY_API_TOKEN (write access).
 */

import { config as loadEnv } from "dotenv";
loadEnv({ path: ".env.local" });
loadEnv();

import { readFileSync } from "node:fs";
import { join } from "node:path";

const PROJECT_ID = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ?? "p7rbtajg";
const DATASET = process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production";
const API = "v2023-05-03";

/** `lib/benchmark-coverage.ts` trust gate — single-provider rows are junk. */
const MIN_PROVIDERS = 2;

const DEFAULT_FILE = join(
  process.cwd(),
  "data",
  "loop",
  "price-index-q3-worksheet.csv"
);

interface Observation {
  vertical: string;
  leadAgeBracket: string;
  exclusivity: string;
  leadType: string;
  targetMonth: string;
  providerName: string;
  priceLow: number;
  priceHigh: number;
  sourceUrl: string;
  observedDate: string;
  row: number;
}

function arg(flag: string): string | undefined {
  const i = process.argv.indexOf(flag);
  return i === -1 ? undefined : process.argv[i + 1];
}

/** Minimal RFC-4180 line splitter — handles quoted fields with commas. */
function splitCsvLine(line: string): string[] {
  const out: string[] = [];
  let cur = "";
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (inQuotes) {
      if (ch === '"') {
        if (line[i + 1] === '"') {
          cur += '"';
          i++;
        } else inQuotes = false;
      } else cur += ch;
    } else if (ch === '"') inQuotes = true;
    else if (ch === ",") {
      out.push(cur);
      cur = "";
    } else cur += ch;
  }
  out.push(cur);
  return out.map((s) => s.trim());
}

const cellKey = (o: {
  vertical: string;
  leadAgeBracket: string;
  exclusivity: string;
  leadType: string;
  targetMonth: string;
}) =>
  [o.vertical, o.leadAgeBracket, o.exclusivity, o.leadType, o.targetMonth].join(
    "|"
  );

function parseWorksheet(path: string): {
  observations: Observation[];
  errors: string[];
} {
  const text = readFileSync(path, "utf8");
  const lines = text.split(/\r?\n/).filter((l) => l.trim().length > 0);
  if (lines.length < 2) throw new Error(`${path} has no data rows`);

  const header = splitCsvLine(lines[0]);
  const idx = (name: string) => {
    const i = header.indexOf(name);
    if (i === -1) throw new Error(`worksheet is missing column "${name}"`);
    return i;
  };
  const col = {
    vertical: idx("vertical"),
    leadAgeBracket: idx("leadAgeBracket"),
    exclusivity: idx("exclusivity"),
    leadType: idx("leadType"),
    targetMonth: idx("targetMonth"),
    providerName: idx("providerName"),
    priceLow: idx("priceLow"),
    priceHigh: idx("priceHigh"),
    sourceUrl: idx("sourceUrl"),
    observedDate: idx("observedDate"),
  };

  const observations: Observation[] = [];
  const errors: string[] = [];

  for (let i = 1; i < lines.length; i++) {
    const f = splitCsvLine(lines[i]);
    const rowNo = i + 1;
    const provider = f[col.providerName] ?? "";
    const lowRaw = f[col.priceLow] ?? "";
    const highRaw = f[col.priceHigh] ?? "";
    const sourceUrl = f[col.sourceUrl] ?? "";

    const touched = provider || lowRaw || highRaw || sourceUrl;
    if (!touched) continue; // untouched slot — fine, skip

    const missing: string[] = [];
    if (!provider) missing.push("providerName");
    if (!lowRaw) missing.push("priceLow");
    if (!highRaw) missing.push("priceHigh");
    if (!sourceUrl) missing.push("sourceUrl");
    if (missing.length) {
      errors.push(`row ${rowNo}: partially filled — missing ${missing.join(", ")}`);
      continue;
    }

    const low = Number(lowRaw.replace(/[$,]/g, ""));
    const high = Number(highRaw.replace(/[$,]/g, ""));
    if (!Number.isFinite(low) || !Number.isFinite(high)) {
      errors.push(`row ${rowNo}: priceLow/priceHigh must be numbers`);
      continue;
    }
    if (low > high) {
      errors.push(`row ${rowNo}: priceLow ${low} > priceHigh ${high}`);
      continue;
    }
    if (!/^https?:\/\//i.test(sourceUrl)) {
      errors.push(`row ${rowNo}: sourceUrl must be an http(s) URL`);
      continue;
    }

    observations.push({
      vertical: f[col.vertical],
      leadAgeBracket: f[col.leadAgeBracket],
      exclusivity: f[col.exclusivity],
      leadType: f[col.leadType],
      targetMonth: f[col.targetMonth],
      providerName: provider,
      priceLow: low,
      priceHigh: high,
      sourceUrl,
      observedDate: f[col.observedDate] ?? "",
      row: rowNo,
    });
  }

  return { observations, errors };
}

function median(values: number[]): number {
  const s = [...values].sort((a, b) => a - b);
  const mid = Math.floor(s.length / 2);
  return s.length % 2 ? s[mid] : (s[mid - 1] + s[mid]) / 2;
}

const round2 = (n: number) => Math.round(n * 100) / 100;

async function sanityFetch<T>(query: string): Promise<T> {
  const url =
    `https://${PROJECT_ID}.api.sanity.io/${API}/data/query/${DATASET}` +
    `?query=${encodeURIComponent(query)}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Sanity ${res.status}: ${await res.text()}`);
  const body = (await res.json()) as { result?: T };
  if (body.result === undefined) throw new Error("Sanity returned no result");
  return body.result;
}

interface Mutation {
  create?: Record<string, unknown>;
  patch?: { id: string; set: Record<string, unknown> };
}

async function sanityMutate(mutations: Mutation[], token: string) {
  const res = await fetch(
    `https://${PROJECT_ID}.api.sanity.io/${API}/data/mutate/${DATASET}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ mutations }),
    }
  );
  if (!res.ok) throw new Error(`Sanity mutate ${res.status}: ${await res.text()}`);
  return res.json();
}

async function main() {
  const apply = process.argv.includes("--apply");
  const file = arg("--file") ?? DEFAULT_FILE;

  const { observations, errors } = parseWorksheet(file);

  if (observations.length === 0 && errors.length === 0) {
    console.log(`${file} has no filled observations yet. Nothing to import.`);
    console.log("Fill in providerName, priceLow, priceHigh and sourceUrl, then re-run.");
    return;
  }

  // ── Group into cells ──────────────────────────────────────────────
  const cells = new Map<string, Observation[]>();
  for (const o of observations) {
    const k = cellKey(o);
    if (!cells.has(k)) cells.set(k, []);
    cells.get(k)!.push(o);
  }

  // ── Trust gate ────────────────────────────────────────────────────
  const shortCells: string[] = [];
  for (const [k, obs] of cells) {
    const distinct = new Set(obs.map((o) => o.providerName.toLowerCase()));
    if (distinct.size < MIN_PROVIDERS) {
      shortCells.push(
        `${k.replace(/\|/g, " | ")} — ${distinct.size} provider(s), needs ${MIN_PROVIDERS}`
      );
    }
  }

  if (errors.length || shortCells.length) {
    if (errors.length) {
      console.error(`\n${errors.length} malformed row(s):`);
      for (const e of errors) console.error(`  ${e}`);
    }
    if (shortCells.length) {
      console.error(
        `\n${shortCells.length} cell(s) below the ${MIN_PROVIDERS}-provider trust gate:`
      );
      for (const c of shortCells) console.error(`  ${c}`);
      console.error(
        "\nThese would publish as unreliable benchmarks and would not clear " +
          "`lib/benchmark-coverage.ts`. Add another provider or delete the rows."
      );
    }
    process.exit(1);
  }

  // ── Resolve vertical slugs to document ids ────────────────────────
  const slugs = [...new Set(observations.map((o) => o.vertical))];
  const verticals = await sanityFetch<{ _id: string; slug: string }[]>(
    `*[_type=="vertical" && slug.current in [${slugs.map((s) => `"${s}"`).join(",")}]]{_id, "slug": slug.current}`
  );
  const verticalId = new Map(verticals.map((v) => [v.slug, v._id]));
  const unknown = slugs.filter((s) => !verticalId.has(s));
  if (unknown.length) {
    console.error(`Unknown vertical slug(s): ${unknown.join(", ")}`);
    process.exit(1);
  }

  // ── Find existing benchmarks for these cells ──────────────────────
  const months = [...new Set(observations.map((o) => o.targetMonth))];
  const existing = await sanityFetch<
    {
      _id: string;
      month: string;
      leadAgeBracket: string;
      exclusivity: string;
      leadType: string;
      vertical: string;
    }[]
  >(
    `*[_type=="priceBenchmark" && month in [${months.map((m) => `"${m}"`).join(",")}]]{
      _id, month, leadAgeBracket, exclusivity, leadType, "vertical": vertical->slug.current
    }`
  );
  const existingByCell = new Map(
    existing.map((e) => [
      cellKey({ ...e, targetMonth: e.month }),
      e._id,
    ])
  );

  // ── Build the plan ────────────────────────────────────────────────
  const mutations: Mutation[] = [];
  const plan: string[] = [];

  for (const [k, obs] of [...cells.entries()].sort()) {
    const first = obs[0];
    const low = Math.min(...obs.map((o) => o.priceLow));
    const high = Math.max(...obs.map((o) => o.priceHigh));
    const mid = round2(
      median(obs.map((o) => (o.priceLow + o.priceHigh) / 2))
    );
    const providers = new Set(obs.map((o) => o.providerName.toLowerCase())).size;
    const confidence = providers >= 4 ? "high" : "medium";

    const notes = [
      `Q3 ${first.targetMonth} human-verified study. ${providers} providers sampled.`,
      ...obs.map(
        (o) =>
          `- ${o.providerName}: $${o.priceLow}${o.priceLow === o.priceHigh ? "" : `-$${o.priceHigh}`}` +
          `${o.observedDate ? ` (observed ${o.observedDate})` : ""} — ${o.sourceUrl}`
      ),
    ].join("\n");

    const doc = {
      _type: "priceBenchmark",
      vertical: { _type: "reference", _ref: verticalId.get(first.vertical)! },
      leadAgeBracket: first.leadAgeBracket,
      exclusivity: first.exclusivity,
      leadType: first.leadType,
      month: first.targetMonth,
      priceLow: round2(low),
      priceMedian: mid,
      priceHigh: round2(high),
      providersSampled: providers,
      confidence,
      notes,
    };

    const existingId = existingByCell.get(k);
    if (existingId) {
      const { _type, ...set } = doc;
      void _type;
      mutations.push({ patch: { id: existingId, set } });
      plan.push(
        `  update  ${k.replace(/\|/g, " | ")}  $${doc.priceLow}-$${doc.priceHigh} (median $${mid}, n=${providers}, ${confidence})`
      );
    } else {
      mutations.push({ create: doc });
      plan.push(
        `  create  ${k.replace(/\|/g, " | ")}  $${doc.priceLow}-$${doc.priceHigh} (median $${mid}, n=${providers}, ${confidence})`
      );
    }
  }

  console.log(`Worksheet: ${file}`);
  console.log(
    `${observations.length} observation(s) across ${cells.size} cell(s). ` +
      `All cells cleared the ${MIN_PROVIDERS}-provider trust gate.`
  );
  console.log("");
  console.log("Plan");
  for (const p of plan) console.log(p);
  console.log("");

  if (!apply) {
    console.log("Dry run — nothing written. Re-run with --apply to publish.");
    return;
  }

  const token = process.env.SANITY_API_TOKEN;
  if (!token) {
    console.error("SANITY_API_TOKEN is not set — cannot write. Aborting.");
    process.exit(1);
  }

  await sanityMutate(mutations, token);
  const created = mutations.filter((m) => m.create).length;
  const updated = mutations.filter((m) => m.patch).length;
  console.log(`Applied: ${created} created, ${updated} updated.`);
  console.log("Re-run `npm run price-index:gap` to see which charts unlocked.");
}

main().catch((err) => {
  console.error(err instanceof Error ? err.message : err);
  process.exit(1);
});
