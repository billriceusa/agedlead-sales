#!/usr/bin/env node
/**
 * Normalises a Search Console "Pages" CSV export into the shape
 * build-url-map.mjs consumes, and writes data/migration/htwl-gsc-pages.json.
 *
 * Two normalisations matter, and both were bugs the first time round:
 *   - www and non-www appear as SEPARATE rows in GSC exports even though the
 *     www host 308s to non-www. Summing them is the only honest total.
 *   - Anchor-fragment URLs (/page#section) are the same page and must fold into
 *     the base path, or a single page looks like eight weak ones.
 *
 * Re-run whenever a fresher export lands, then re-run build-url-map.mjs.
 *
 * Usage: node scripts/refresh-gsc-input.mjs [path-to-Pages.csv]
 */

import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const DIR = join(process.cwd(), "data", "migration");
const HOST = "https://howtoworkleads.com";
const src = process.argv[2] ?? join(DIR, "htwl-gsc-pages-2026-07-29.csv");

const num = (s) => Number(String(s).replace(/[,%]/g, "")) || 0;

const rows = readFileSync(src, "utf8").split("\n").slice(1).filter(Boolean);
const agg = new Map();

for (const line of rows) {
  const cells = line.split(",");
  if (cells.length < 5) continue;
  const [url, clicks, impr, , pos] = cells;
  const path =
    url
      .replace("https://www.", "https://")
      .split("#")[0]
      .replace(/\/$/, "")
      .replace(HOST, "") || "/";

  const cur = agg.get(path) ?? { clicks: 0, impr: 0, posSum: 0, posW: 0 };
  const rowImpr = num(impr);
  cur.clicks += num(clicks);
  cur.impr += rowImpr;

  // Weight position by impressions. A plain mean is wrong here because the rows
  // being folded together are wildly unequal: buy-iul-leads has one base row at
  // position 16.2 plus five #fragment rows sitting at 7-9 on a handful of
  // impressions each, and a www row with 2 impressions. Averaging those flat
  // reported the page at 8.3 — a page-1 ranking it does not have. Position
  // feeds the risk column, so the distortion propagates.
  const p = Number(pos);
  if (Number.isFinite(p) && rowImpr > 0) {
    cur.posSum += p * rowImpr;
    cur.posW += rowImpr;
  }
  agg.set(path, cur);
}

const out = {};
for (const [path, v] of [...agg].sort(([a], [b]) => a.localeCompare(b))) {
  out[path] = {
    clicks: v.clicks,
    impr: v.impr,
    pos: v.posW ? Math.round((v.posSum / v.posW) * 10) / 10 : null,
  };
}

writeFileSync(join(DIR, "htwl-gsc-pages.json"), JSON.stringify(out, null, 0));

const totals = Object.values(out).reduce(
  (a, v) => ({ clicks: a.clicks + v.clicks, impr: a.impr + v.impr }),
  { clicks: 0, impr: 0 }
);
console.log(`source: ${src}`);
console.log(`raw rows: ${rows.length} -> normalized pages: ${Object.keys(out).length}`);
console.log(`total clicks: ${totals.clicks} | total impressions: ${totals.impr}`);
