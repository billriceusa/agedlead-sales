#!/usr/bin/env node
/**
 * Emit the howtoworkleads.com -> workagedleads.com path-change rules for the
 * OTHER repo.
 *
 * howtoworkleads.com is served by a separate Vercel project (howtoworkleads-web,
 * repo billriceusa/howtoworkleads), which cannot read this repo's url-map.csv.
 * Its next.config.js preserves the path and hands off to workagedleads.com, so
 * any URL whose path also changed takes a second hop through the rules in
 * lib/migration-redirects.ts once it lands here.
 *
 * That second hop is avoidable: if the old host already knows the final path it
 * can send the visitor straight there. This script generates that table so the
 * two repos cannot drift — url-map.csv stays the single source of truth and the
 * copy in the other repo is generated, never hand-edited.
 *
 * Usage:
 *   node scripts/export-cross-host-redirects.mjs > /path/to/howtoworkleads/apps/web/data/migration/cross-host-redirects.json
 *
 * Re-run whenever url-map.csv changes, and commit the result in BOTH repos.
 */

import { readFileSync } from "node:fs";
import { join } from "node:path";

const NEW_HOST = "https://workagedleads.com";
const SOURCE_HOST = "https://howtoworkleads.com";

/** Minimal CSV row splitter — handles the quoted `notes` column. */
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

function toPath(url, host) {
  if (url === host) return "/";
  if (url.startsWith(`${host}/`)) return url.slice(host.length);
  return null;
}

const csv = readFileSync(
  join(process.cwd(), "data", "migration", "url-map.csv"),
  "utf8"
);

const rows = csv.trim().split("\n").slice(1);

const pathChanges = [];
const pruned = [];
const seen = new Set();

for (const line of rows) {
  if (!line.trim()) continue;
  const [oldUrl, newUrl, action] = splitRow(line);

  const from = toPath(oldUrl, SOURCE_HOST);
  if (from === null) continue; // agedleadsales row — handled by its own proxy

  if (!newUrl) {
    pruned.push(from);
    continue;
  }

  const to = toPath(newUrl, NEW_HOST);
  if (to === null) {
    throw new Error(`unrecognised destination host: ${newUrl}`);
  }

  // Path unchanged: the catch-all host swap already gets there in one hop.
  if (from === to) continue;

  if (seen.has(from)) {
    throw new Error(`duplicate source path: ${from}`);
  }
  seen.add(from);

  pathChanges.push({ source: from, destination: `${NEW_HOST}${to}`, action });
}

pathChanges.sort((a, b) => a.source.localeCompare(b.source));
pruned.sort();

process.stdout.write(
  JSON.stringify(
    {
      $generatedBy: "agedlead-sales/scripts/export-cross-host-redirects.mjs",
      $source: "agedlead-sales/data/migration/url-map.csv",
      $note:
        "Generated. Do not hand-edit — re-run the generator against url-map.csv.",
      pathChanges,
      pruned,
    },
    null,
    2
  ) + "\n"
);
