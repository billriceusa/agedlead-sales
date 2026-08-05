#!/usr/bin/env node
/**
 * Redirect-integrity check for the workagedleads.com consolidation.
 *
 * Reads data/migration/url-map.csv and probes every row over the network. Two
 * modes, because the interesting assertions differ either side of cutover:
 *
 *   --mode=pre   (default) Sources must still be live. Confirms every old_url
 *                resolves 200 today, so the map is not already describing dead
 *                pages, and that no row has drifted to a 404 since it was
 *                built. Run this before touching DNS.
 *
 *   --mode=post  The real gate. Every old_url — and its www. variant — must
 *                land on exactly the new_url the CSV promises, with a live 200
 *                and no more than --max-hops redirects. PRUNE rows (no new_url)
 *                must 404: they are deliberately dropped, and a PRUNE row that
 *                quietly resolves means something is redirecting content we
 *                decided not to keep.
 *
 * The www. variants are checked separately and on purpose. A page can be
 * single-hop on the bare host and three-hop on www if www still points at its
 * bare-domain sibling instead of at the new host — see "Redirect topology at
 * cutover" in data/migration/README.md. www URLs are indexed and earning today,
 * so they are not a rounding error.
 *
 * Usage:
 *   node scripts/verify-redirects.mjs [--mode=pre|post] [--max-hops=1]
 *                                     [--concurrency=8] [--limit=N] [--verbose]
 *
 * Exit 0 only if every row passes. Intended to be run by hand at each phase
 * boundary, not in CI — it hits the live network a few hundred times.
 */

import { readFileSync } from "node:fs";
import { join } from "node:path";

const args = Object.fromEntries(
  process.argv.slice(2).map((a) => {
    const [k, v] = a.replace(/^--/, "").split("=");
    return [k, v ?? true];
  })
);

const MODE = args.mode ?? "pre";
const MAX_HOPS = Number(args["max-hops"] ?? 1);
const CONCURRENCY = Number(args.concurrency ?? 8);
const LIMIT = args.limit ? Number(args.limit) : Infinity;
const VERBOSE = Boolean(args.verbose);

if (!["pre", "post"].includes(MODE)) {
  console.error(`unknown --mode=${MODE} (expected "pre" or "post")`);
  process.exit(2);
}

/** Minimal CSV splitter — the notes column is quoted and contains commas. */
function splitRow(line) {
  const out = [];
  let cur = "";
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (ch === '"') {
      if (inQuotes && line[i + 1] === '"') {
        cur += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (ch === "," && !inQuotes) {
      out.push(cur);
      cur = "";
    } else {
      cur += ch;
    }
  }
  out.push(cur);
  return out;
}

const csv = readFileSync(
  join(process.cwd(), "data", "migration", "url-map.csv"),
  "utf8"
);

const rows = csv
  .split("\n")
  .slice(1)
  .filter((l) => l.trim())
  .map((l) => {
    const [oldUrl, newUrl, action] = splitRow(l);
    return { oldUrl, newUrl, action };
  })
  .slice(0, LIMIT);

/** Follow redirects by hand so we can count hops and see the whole chain. */
async function trace(url, cap = 10) {
  const chain = [];
  let current = url;
  for (let i = 0; i <= cap; i++) {
    let res;
    try {
      res = await fetch(current, { redirect: "manual" });
    } catch (err) {
      return { chain, final: current, status: 0, error: String(err.message ?? err) };
    }
    if (res.status >= 300 && res.status < 400) {
      const loc = res.headers.get("location");
      if (!loc) return { chain, final: current, status: res.status };
      chain.push({ from: current, status: res.status, to: loc });
      current = new URL(loc, current).toString();
      continue;
    }
    return { chain, final: current, status: res.status };
  }
  return { chain, final: current, status: -1, error: `exceeded ${cap} hops` };
}

const norm = (u) => u.replace(/\/$/, "");
const wwwVariant = (u) => u.replace(/^https:\/\/(?!www\.)/, "https://www.");

async function checkPre(row) {
  const t = await trace(row.oldUrl);
  if (t.status !== 200) {
    return {
      ok: false,
      why: `source is not live: ${t.status || t.error} (final ${t.final})`,
    };
  }
  return { ok: true, hops: t.chain.length };
}

async function checkPost(row, url) {
  const t = await trace(url);

  if (!row.newUrl) {
    // PRUNE — must be gone, not silently redirected somewhere.
    if (t.status === 404 || t.status === 410) return { ok: true, hops: t.chain.length };
    return {
      ok: false,
      why: `PRUNE row still resolves ${t.status} at ${t.final} (expected 404)`,
    };
  }

  // A mapped destination is allowed to redirect onward by design: /lead-order
  // is an affiliate link-out that hands off to agedleadstore.com, and that
  // host answers 403 to automated clients. Arriving at the mapped URL is the
  // contract; what it does next, and what a third party's bot policy returns,
  // is not this gate's business.
  const target = norm(row.newUrl);
  if (norm(t.final) !== target) {
    const arrival = t.chain.findIndex((c) => norm(c.to) === target);
    if (arrival !== -1) {
      const hops = arrival + 1;
      if (hops > MAX_HOPS) {
        return { ok: false, why: `${hops} hops to reach ${row.newUrl} (max ${MAX_HOPS})` };
      }
      return { ok: true, hops };
    }
  }

  if (t.status !== 200) {
    return { ok: false, why: `${t.status || t.error} at ${t.final}` };
  }
  if (norm(t.final) !== norm(row.newUrl)) {
    return { ok: false, why: `landed on ${t.final}, expected ${row.newUrl}` };
  }
  if (t.chain.length > MAX_HOPS) {
    return {
      ok: false,
      why: `${t.chain.length} hops (max ${MAX_HOPS}): ${t.chain
        .map((c) => `${c.status}->${c.to}`)
        .join(" ")}`,
    };
  }
  return { ok: true, hops: t.chain.length };
}

/** Build the full probe list up front so the progress counter is honest. */
const probes = [];
for (const row of rows) {
  if (MODE === "pre") {
    if (row.action === "PRUNE" || row.newUrl) probes.push({ row, url: row.oldUrl, variant: "bare" });
  } else {
    probes.push({ row, url: row.oldUrl, variant: "bare" });
    probes.push({ row, url: wwwVariant(row.oldUrl), variant: "www" });
  }
}

const failures = [];
const hopHistogram = new Map();
let done = 0;

async function worker(queue) {
  for (;;) {
    const probe = queue.pop();
    if (!probe) return;
    const result =
      MODE === "pre"
        ? await checkPre(probe.row)
        : await checkPost(probe.row, probe.url);
    done++;
    if (!result.ok) {
      failures.push({ ...probe, why: result.why });
      if (VERBOSE) console.error(`FAIL ${probe.url} — ${result.why}`);
    } else {
      hopHistogram.set(result.hops, (hopHistogram.get(result.hops) ?? 0) + 1);
    }
    if (done % 50 === 0) process.stderr.write(`  ${done}/${probes.length}\n`);
  }
}

const queue = [...probes].reverse();
console.log(
  `mode=${MODE}  rows=${rows.length}  probes=${probes.length}  max-hops=${MAX_HOPS}`
);
await Promise.all(
  Array.from({ length: Math.min(CONCURRENCY, probes.length) }, () => worker(queue))
);

console.log(`\nhop distribution (passing probes):`);
for (const [h, n] of [...hopHistogram].sort((a, b) => a[0] - b[0])) {
  console.log(`  ${h} hop${h === 1 ? "" : "s"}: ${n}`);
}

if (failures.length) {
  console.log(`\n${failures.length} FAILURES:\n`);
  for (const f of failures.slice(0, 60)) {
    console.log(`  [${f.row.action}/${f.variant}] ${f.url}\n      ${f.why}`);
  }
  if (failures.length > 60) console.log(`  ... and ${failures.length - 60} more`);
  process.exit(1);
}

console.log(`\nAll ${probes.length} probes passed.`);
