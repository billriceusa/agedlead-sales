/**
 * Build the merged disavow file for workagedleads.com.
 *
 * Why a separate script from `refresh-disavow.ts`: that one maintains
 * agedleadsales.com's own file incrementally, from one domain list. This builds
 * a NEW file for a NEW property out of two source profiles, and it has to be
 * right the first time — none of the existing disavow protection follows a 301,
 * so at cutover workagedleads.com inherits ~450 referring domains with zero
 * protection unless this file is uploaded first.
 *
 * That ordering is the whole point. Submit on the URL-prefix property
 * `https://workagedleads.com/` BEFORE the redirects fire. The disavow tool does
 * not accept domain properties, which is why the URL-prefix one exists.
 *
 * Usage:
 *   npm run disavow:merged -- <als.json> <htwl.json>            # dry run
 *   npm run disavow:merged -- <als.json> <htwl.json> --apply    # writes the file
 *
 * Each input is an Ahrefs `site-explorer-referring-domains` export — either the
 * raw JSON array of row objects, or a CSV with a `domain` column.
 *
 * What lands in the file:
 *   1. Everything already in data/backlink-audit/disavow.txt. Those 291 were
 *      human-judged toxic across earlier audits; nothing is dropped on the way
 *      to the new property.
 *   2. Every domain the classifier calls "spam" on either profile.
 *   3. The explicitly evidenced entries below.
 *
 * What does NOT: anything the classifier calls "review". Those are printed for
 * a human instead. Disavowing a genuine editorial link is far more expensive
 * than leaving one spam domain for the next pass, and that asymmetry does not
 * change just because this file is being built in a hurry.
 */
import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import {
  classifyDomains,
  DEFAULT_WHITELIST,
  type Classification,
} from "../lib/backlink-audit/spam-classifier";

const SOURCE_PATH = join(process.cwd(), "data", "backlink-audit", "disavow.txt");
const OUT_PATH = join(
  process.cwd(),
  "data",
  "backlink-audit",
  "disavow-workagedleads.txt",
);

/**
 * The classifier reads domain *names*. These two are named like ordinary sites
 * and land in "clean" on name alone, but they are link aggregators that scrape
 * and republish the whole web — the outbound counts are not a typo.
 *
 * Measured via Ahrefs site-explorer-outlinks-stats, 2026-08-03.
 */
const EVIDENCED_ADDITIONS: { domain: string; reason: string }[] = [
  {
    domain: "factmags.com",
    reason:
      "scraper — links out to 347,254,377 domains (41,279,166 dofollow); measured 2026-08-03",
  },
  {
    domain: "goooogla.com",
    reason:
      "scraper — links out to 409,847,956 domains (74,469,142 dofollow); measured 2026-08-03",
  },
];

/**
 * Both retiring hosts join the whitelist. On the merged property they are not
 * third-party referrers any more — they are the site's own former addresses,
 * and they will be 301ing into it.
 */
const MERGED_WHITELIST = [
  ...DEFAULT_WHITELIST,
  "agedleadsales.com",
  "workagedleads.com",
];

interface RefRow {
  domain: string;
  domain_rating?: number;
  dofollow_links?: number;
  traffic_domain?: number;
}

function parseRefdomains(path: string): RefRow[] {
  const raw = readFileSync(path, "utf8").trim();

  if (raw.startsWith("[") || raw.startsWith("{")) {
    const parsed = JSON.parse(raw);
    const rows = Array.isArray(parsed) ? parsed : (parsed.refdomains ?? []);
    return (rows as RefRow[]).filter((r) => r?.domain);
  }

  // CSV fallback — same shape refresh-disavow.ts accepts.
  const lines = raw.split("\n").map((l) => l.trim()).filter(Boolean);
  const header = lines[0].toLowerCase();
  const cols = header.split(",").map((c) => c.replace(/"/g, "").trim());
  const idx = cols.indexOf("domain");
  if (idx < 0) throw new Error(`${path}: no "domain" column`);
  return lines
    .slice(1)
    .map((l) => ({ domain: (l.split(",")[idx] ?? "").replace(/"/g, "").trim() }))
    .filter((r) => r.domain);
}

function normalize(d: string): string {
  return d.trim().toLowerCase().replace(/^www\./, "");
}

function existingDisavowed(text: string): Set<string> {
  return new Set(
    text
      .split("\n")
      .filter((l) => l.startsWith("domain:"))
      .map((l) => normalize(l.slice("domain:".length)))
      .filter(Boolean),
  );
}

function main() {
  const args = process.argv.slice(2);
  const apply = args.includes("--apply");
  const files = args.filter((a) => !a.startsWith("--"));

  if (files.length < 2) {
    console.error(
      "usage: npm run disavow:merged -- <als-refdomains> <htwl-refdomains> [--apply]",
    );
    process.exit(1);
  }

  // Keep the strongest row per domain so the review listing shows the real
  // dofollow count rather than whichever profile was read last.
  const profile = new Map<string, RefRow>();
  for (const file of files) {
    for (const row of parseRefdomains(file)) {
      const d = normalize(row.domain);
      const prev = profile.get(d);
      if (!prev || (row.dofollow_links ?? 0) > (prev.dofollow_links ?? 0)) {
        profile.set(d, { ...row, domain: d });
      }
    }
  }

  const existingText = readFileSync(SOURCE_PATH, "utf8");
  const existing = existingDisavowed(existingText);

  const results = classifyDomains([...profile.keys()], MERGED_WHITELIST);
  const spam = results.filter((c) => c.verdict === "spam");
  const review = results.filter((c) => c.verdict === "review");
  const clean = results.filter((c) => c.verdict === "clean");

  const evidenced = EVIDENCED_ADDITIONS.map((e) => normalize(e.domain));
  const final = new Set<string>([
    ...existing,
    ...spam.map((c) => c.domain),
    ...evidenced,
  ]);

  // A whitelisted domain must never reach the file, even via the carried-over
  // set — the old file predates workagedleads.com being a whitelist entry.
  for (const w of MERGED_WHITELIST) final.delete(normalize(w));

  const sorted = [...final].sort();

  console.log(`Source profiles read:      ${files.length}`);
  console.log(`Distinct referring domains: ${profile.size}`);
  console.log(`  spam                      ${spam.length}`);
  console.log(`  review (NOT added)        ${review.length}`);
  console.log(`  clean                     ${clean.length}`);
  console.log(`Carried from disavow.txt:   ${existing.size}`);
  console.log(`Evidenced additions:        ${evidenced.length}`);
  console.log(`\nMerged total:               ${sorted.length}\n`);

  if (review.length) {
    console.log("NEEDS A HUMAN — not in the file:");
    for (const c of review) {
      const r = profile.get(c.domain);
      console.log(
        `  ${c.domain.padEnd(40)} DR ${String(r?.domain_rating ?? "?").padStart(4)}  ` +
          `dofollow=${r?.dofollow_links ?? 0}  [${c.reasons.join("; ")}]`,
      );
    }
    console.log("");
  }

  const today = new Date().toISOString().slice(0, 10);
  const reviewNote = (c: Classification) => {
    const r = profile.get(c.domain);
    return `#   ${c.domain} — DR ${r?.domain_rating ?? "?"}, dofollow ${r?.dofollow_links ?? 0}: ${c.reasons.join("; ")}`;
  };

  const header = [
    "# Disavow file for workagedleads.com",
    `# Generated ${today} by scripts/build-merged-disavow.ts.`,
    "#",
    "# MERGED profile: agedleadsales.com + howtoworkleads.com. Both are 301ing",
    "# into workagedleads.com, and a disavow does NOT follow a redirect — the",
    "# protection on the old properties does not transfer. Upload this file on",
    "# the URL-PREFIX property https://workagedleads.com/ (the tool does not",
    "# accept domain properties) BEFORE the redirects go live.",
    "#",
    `# ${sorted.length} domains: ${existing.size} carried from the agedleadsales file,`,
    `# ${spam.length} classified spam across the merged profile, ${evidenced.length} added on measured evidence.`,
    "#",
    "# Whitelisted as legitimate (NOT disavowed):",
    `#   ${MERGED_WHITELIST.join(", ")}`,
    "#",
    "# Added on evidence the name-based classifier cannot see:",
    ...EVIDENCED_ADDITIONS.map((e) => `#   ${e.domain} — ${e.reason}`),
    "#",
    review.length
      ? `# ${review.length} domain(s) flagged for human review and deliberately NOT included.`
      : "# No domains required human review.",
    ...review.map(reviewNote),
    "#",
    "# Upload via Google Search Console > Disavow Links Tool.",
    "",
  ].join("\n");

  const body = sorted.map((d) => `domain:${d}`).join("\n") + "\n";

  if (!apply) {
    console.log("Dry run — re-run with --apply to write the file.");
    console.log(`Would write ${OUT_PATH}`);
    return;
  }

  writeFileSync(OUT_PATH, header + body);
  console.log(`Wrote ${OUT_PATH} — ${sorted.length} domains.`);
}

main();
