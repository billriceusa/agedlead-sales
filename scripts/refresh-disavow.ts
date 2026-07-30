/**
 * Refresh data/backlink-audit/disavow.txt from a current referring-domains list.
 *
 * Why this exists: between the 2026-07-03 and 2026-07-21 audits, 41 new spam
 * domains accrued because every refresh was a manual Ahrefs pull followed by
 * human eyeballing, and nothing ran in between. This turns the judgement part
 * into code so a refresh is a two-minute job instead of an afternoon.
 *
 * Usage:
 *   npm run disavow:refresh -- <domains-file>            # dry run, prints a plan
 *   npm run disavow:refresh -- <domains-file> --apply    # writes disavow.txt
 *
 * <domains-file> is one domain per line, or an Ahrefs referring-domains CSV
 * export (the `domain` column is picked out automatically). Blank lines and
 * lines starting with # are ignored.
 *
 * Domains classified "review" are never auto-added — they are printed for a
 * human to judge. Disavowing a genuine editorial link is the expensive
 * mistake; leaving one spam domain for the next pass is not.
 */
import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import {
  classifyDomains,
  DEFAULT_WHITELIST,
  type Classification,
} from "../lib/backlink-audit/spam-classifier";

const DISAVOW_PATH = join(
  process.cwd(),
  "data",
  "backlink-audit",
  "disavow.txt",
);

function parseDomainsFile(path: string): string[] {
  const raw = readFileSync(path, "utf8");
  const lines = raw
    .split("\n")
    .map((l) => l.trim())
    .filter((l) => l && !l.startsWith("#"));

  if (!lines.length) return [];

  // CSV export? Find the domain column by header name.
  const header = lines[0].toLowerCase();
  if (header.includes(",") && /(^|,)\s*"?domain"?\s*(,|$)/.test(header)) {
    const cols = header.split(",").map((c) => c.replace(/"/g, "").trim());
    const idx = cols.indexOf("domain");
    return lines
      .slice(1)
      .map((l) => (l.split(",")[idx] ?? "").replace(/"/g, "").trim())
      .filter(Boolean);
  }

  return lines.map((l) => l.split(",")[0].replace(/"/g, "").trim());
}

function existingDisavowed(text: string): Set<string> {
  return new Set(
    text
      .split("\n")
      .filter((l) => l.startsWith("domain:"))
      .map((l) => l.slice("domain:".length).trim().toLowerCase())
      .filter(Boolean),
  );
}

function main() {
  const args = process.argv.slice(2);
  const apply = args.includes("--apply");
  const file = args.find((a) => !a.startsWith("--"));

  if (!file) {
    console.error(
      "usage: npm run disavow:refresh -- <domains-file> [--apply]",
    );
    process.exit(1);
  }

  const incoming = parseDomainsFile(file);
  if (!incoming.length) {
    console.error(`No domains parsed from ${file}`);
    process.exit(1);
  }

  const disavowText = readFileSync(DISAVOW_PATH, "utf8");
  const already = existingDisavowed(disavowText);

  const results = classifyDomains(incoming);
  const isNew = (c: Classification) => !already.has(c.domain);

  const newSpam = results.filter((c) => c.verdict === "spam" && isNew(c));
  const newReview = results.filter((c) => c.verdict === "review" && isNew(c));
  const clean = results.filter((c) => c.verdict === "clean");

  console.log(`Referring domains read:  ${incoming.length}`);
  console.log(`Already disavowed:       ${already.size}`);
  console.log(`New spam (auto-add):     ${newSpam.length}`);
  console.log(`New — needs review:      ${newReview.length}`);
  console.log(`Clean / whitelisted:     ${clean.length}\n`);

  if (newReview.length) {
    console.log("NEEDS A HUMAN — not added automatically:");
    for (const c of newReview) {
      console.log(`  ${c.domain}  [${c.reasons.join("; ")}]`);
    }
    console.log("");
  }

  if (!newSpam.length) {
    console.log("No new spam domains. disavow.txt is current.");
    return;
  }

  console.log("Would add:");
  for (const c of newSpam) console.log(`  domain:${c.domain}`);

  if (!apply) {
    console.log("\nDry run — re-run with --apply to write disavow.txt.");
    return;
  }

  const today = new Date().toISOString().slice(0, 10);
  const sorted = newSpam.map((c) => c.domain).sort();
  const section = [
    "",
    `# --- ${today} refresh (scripts/refresh-disavow.ts) ---`,
    `# ${sorted.length} domains auto-classified as link-farm spam.`,
    ...(newReview.length
      ? [
          `# ${newReview.length} further domain(s) flagged for human review and NOT added:`,
          ...newReview.map((c) => `#   ${c.domain} — ${c.reasons.join("; ")}`),
        ]
      : []),
    ...sorted.map((d) => `domain:${d}`),
  ].join("\n");

  let updated = disavowText.replace(/\n*$/, "") + section + "\n";

  // Keep the header's domain count honest — it is the first thing a human
  // reads before uploading to Search Console.
  const total = existingDisavowed(updated).size;
  updated = updated.replace(
    /^(# Generated .*?; last refreshed )\d{4}-\d{2}-\d{2} \(\d+ domains\)\./m,
    `$1${today} (${total} domains).`,
  );

  writeFileSync(DISAVOW_PATH, updated);
  console.log(
    `\nWrote ${DISAVOW_PATH} — ${total} domains total (+${sorted.length}).`,
  );
  console.log("Upload it in Search Console -> Disavow Links Tool.");
  console.log(`Whitelist in effect: ${DEFAULT_WHITELIST.join(", ")}`);
}

main();
