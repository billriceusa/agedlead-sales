#!/usr/bin/env node
/**
 * Builds data/migration/url-map.csv — the single source of truth for the
 * workagedleads.com consolidation (Phases 2, 5 and 6 of the migration plan).
 *
 * Every live URL across both source sites gets exactly one row. The mechanical
 * parts are derived here; the columns that need a human call (near-duplicate
 * winners, borderline prunes) are emitted with action=REVIEW so they surface
 * rather than getting silently decided by a heuristic.
 *
 * Inputs live alongside the output in data/migration/ so this is reproducible
 * after the source repo is archived:
 *   - htwl-sitemap.txt        howtoworkleads.com sitemap URLs
 *   - alsales-sitemap.txt     agedleadsales.com sitemap URLs
 *   - htwl-gsc-pages.json     GSC page performance, www/non-www normalized
 *
 * Usage: node scripts/build-url-map.mjs
 */

import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const DIR = join(process.cwd(), "data", "migration");
const NEW_HOST = "https://workagedleads.com";

const readLines = (f) =>
  readFileSync(join(DIR, f), "utf8")
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);

const gsc = JSON.parse(readFileSync(join(DIR, "htwl-gsc-pages.json"), "utf8"));
const publishedAt = JSON.parse(readFileSync(join(DIR, "htwl-published-at.json"), "utf8"));

/**
 * The GSC export is a 3-month window that closed on this date. Anything
 * published after it has no data here, so zero impressions means "not measured
 * yet", NOT "dead". Pruning on that would have killed the entire IUL cluster
 * and the 5-post compliance cluster — the site's newest and best work.
 */
const GSC_WINDOW_END = "2026-06-05";

/**
 * The approved fold: all 23 /buying-leads/* pages collapse into the lead-type
 * spine. Verticals marked NEW need a leadType doc created before the redirect
 * fires — /price-index/* and /providers/best/* already run this taxonomy, so
 * this brings leadType into line with the rest of the site.
 */
const FOLD = {
  "aged-final-expense-leads": "final-expense-leads",
  "buy-final-expense-leads": "final-expense-leads",
  "aged-iul-leads": "iul-leads",
  "buy-iul-leads": "iul-leads",
  "aged-life-insurance-leads": "life-insurance-leads",
  "buy-life-insurance-leads": "life-insurance-leads",
  "buy-medicare-leads": "medicare-leads",
  "buy-mortgage-leads": "mortgage-leads",
  "buy-purchase-mortgage-leads": "mortgage-leads",
  "buy-refinance-mortgage-leads": "mortgage-leads",
  "buy-mortgage-refinance-leads": "mortgage-leads",
  "buy-non-qm-mortgage-leads": "mortgage-leads",
  "buy-bank-statement-loan-leads": "mortgage-leads",
  "buy-dscr-loan-leads": "mortgage-leads",
  "buy-heloc-leads": "mortgage-leads",
  "buy-real-estate-leads": "mortgage-leads",
  "buy-auto-insurance-leads": "auto-insurance-leads",
  "health-insurance-leads": "health-insurance-leads",
  "buy-home-improvement-leads": "home-improvement-leads",
  "buy-solar-leads": "solar-leads",
  "buy-annuity-leads": "insurance-leads",
  "buy-mortgage-protection-leads": "insurance-leads",
  "buy-pc-insurance-leads": "insurance-leads",
};

/** The one buying-leads page with no vertical of its own — it is the hub. */
const FOLD_TO_HUB = new Set(["buy-aged-leads"]);

/** leadType slugs that do not exist yet in Sanity (currently 8 of these 12). */
const NEW_LEAD_TYPES = new Set([
  "life-insurance-leads",
  "auto-insurance-leads",
  "health-insurance-leads",
  "home-improvement-leads",
]);

/** Generic CRM/sales-theory sections — position 39-70, ~0 clicks. Prune. */
const PRUNE_PREFIXES = ["/crm-systems/", "/lead-management/", "/sales-process/"];

/**
 * Real duplicates, resolved by reading the actual titles rather than trusting
 * the slug-token similarity that surfaced them.
 *
 * Take the best of both into the destination, then 301. The howtoworkleads
 * version is often the more thorough one (aged-lead-scripts-templates covers
 * four channels vs two) — merging means harvesting that depth into the
 * destination, not discarding it.
 *
 * Seven other flagged pairs turned out to be false positives and are NOT here:
 * aged-lead-pricing-guide (pricing) matched aged-lead-crm-setup-guide (CRM
 * setup) on shared tokens alone, and it is a position-4.8 page with 2,959
 * impressions. Likewise the "how to WORK aged X leads" vertical guides matched
 * "how to BUY aged leads" — different job, different intent. Those all migrate.
 */
const MERGE_INTO = {
  // Both cover aged-vs-real-time cost. The coded /compare/ route is the better
  // pattern than either blog post — answer-first, real table, FAQPage schema.
  "real-cost-aged-vs-fresh-leads-2026": "/compare/aged-vs-real-time-leads",
  // Generic "for sales teams" angle is off-moat; the aged-specific one wins.
  "ai-lead-scoring-prioritization": "/blog/ai-lead-scoring-aged-leads",
  // Comparison vs scorecard — same job. This is the review/compare moat, so
  // merge into one stronger vendor-evaluation page rather than keeping two.
  "aged-lead-vendor-comparison": "/blog/aged-lead-vendor-scorecard-evaluation",
  "aged-lead-scripts-templates": "/blog/aged-lead-scripts-that-work",
  // Duplicates the existing ALSales guide, not the CRM/dialer post.
  "aged-lead-follow-up-cadence": "/guides/7-day-aged-lead-follow-up-cadence",
  "aged-lead-conversion-rates":
    "/blog/aged-lead-conversion-rates-by-industry-data-benchmarks",
};

/**
 * Hubs, tools and download pages — everything that is neither a blog post nor
 * a /buying-leads page. Destination null means prune.
 */
const EXPLICIT = {
  "/": "/",
  "/blog": "/blog",
  "/resources": "/resources",
  // Category hubs whose children all fold into the lead-type spine.
  "/buying-leads": "/lead-types",
  "/aged-leads": "/lead-types",
  "/insurance-leads": "/lead-types/insurance-leads",
  "/home-services-leads": "/lead-types/home-improvement-leads",
  "/legal-leads": "/providers/best/legal",
  // Tools map onto the existing calculator suite.
  "/tools": "/calculators",
  "/tools/aged-lead-roi-calculator": "/calculators/roi-calculator",
  "/tools/compliance-checklist": "/blog/tcpa-compliance-calling-aged-leads",
  // Gated downloads all live behind the resources hub on the target.
  "/downloads": "/resources",
  "/downloads/7-day-follow-up-cadence": "/resources",
  "/downloads/aged-lead-quick-start-kit": "/resources",
  "/downloads/insurance-lead-scripts-bundle": "/resources",
  "/downloads/mortgage-lead-scripts-bundle": "/resources",
  "/downloads/lead-vendor-comparison-scorecard": "/resources",
  "/downloads/real-time-lead-team-playbook": "/resources",
  // Hubs for the pruned generic sections — nothing left to point at.
  "/crm-systems": null,
  "/lead-management": null,
  "/sales-process": null,
  // Utility page with no unique content (renders the site-wide fallback title).
  "/lead-order": null,
};

const path = (u) => new URL(u).pathname.replace(/\/$/, "") || "/";
const perf = (p) => gsc[p] ?? { clicks: 0, impr: 0, pos: null };

const rows = [];
const add = (r) => rows.push(r);

// ---------------------------------------------------------------- howtoworkleads
for (const url of readLines("htwl-sitemap.txt")) {
  const p = path(url);
  const { clicks, impr, pos } = perf(p);
  const slug = p.split("/").pop();
  const base = { old_url: url, clicks, impr, pos: pos ?? "" };

  if (p.startsWith("/buying-leads/")) {
    if (FOLD_TO_HUB.has(slug)) {
      add({ ...base, new_url: `${NEW_HOST}/lead-types`, action: "FOLD", risk: "medium",
        notes: "hub page — folds to the lead-types index, not a single vertical" });
      continue;
    }
    const dest = FOLD[slug];
    if (!dest) {
      add({ ...base, new_url: "", action: "REVIEW", risk: "high", notes: "buying-leads page with no fold mapping" });
      continue;
    }
    // Page-1 assets are the ones a bad fold actually costs you.
    const risk = pos !== null && pos < 15 ? "high" : impr > 1000 ? "medium" : "low";
    add({
      ...base,
      new_url: `${NEW_HOST}/lead-types/${dest}`,
      action: "FOLD",
      risk,
      notes: [
        NEW_LEAD_TYPES.has(dest) ? `destination leadType '${dest}' must be created first` : "",
        risk === "high" ? "page-1 asset — harvest copy into destination before redirecting" : "",
      ].filter(Boolean).join("; "),
    });
    continue;
  }

  if (PRUNE_PREFIXES.some((pre) => p.startsWith(pre))) {
    add({ ...base, new_url: "", action: "PRUNE", risk: "low",
      notes: "generic CRM/sales theory — high impressions, ~0 clicks, position 39-70" });
    continue;
  }

  if (p.startsWith("/blog/")) {
    if (MERGE_INTO[slug]) {
      add({ ...base, new_url: `${NEW_HOST}${MERGE_INTO[slug]}`, action: "MERGE",
        risk: pos !== null && pos < 15 ? "medium" : "low",
        notes: "harvest the best of both into the destination, then redirect" });
    } else if (impr === 0 && (publishedAt[slug] ?? "") > GSC_WINDOW_END) {
      add({ ...base, new_url: `${NEW_HOST}${p}`, action: "MIGRATE", risk: "low",
        notes: `published ${publishedAt[slug]}, after the GSC window closed — too new to judge, do not prune` });
    } else if (impr === 0) {
      add({ ...base, new_url: "", action: "PRUNE", risk: "low",
        notes: "zero impressions in the 3mo GSC window" });
    } else {
      add({ ...base, new_url: `${NEW_HOST}${p}`, action: "MIGRATE", risk: "low", notes: "" });
    }
    continue;
  }

  if (p === "/resources/about") {
    add({ ...base, new_url: `${NEW_HOST}/about`, action: "MERGE", risk: "low",
      notes: "merge into the existing about page" });
    continue;
  }

  if (p in EXPLICIT) {
    const dest = EXPLICIT[p];
    if (dest === null) {
      add({ ...base, new_url: "", action: "PRUNE", risk: "low",
        notes: "hub for a pruned section, or no unique content" });
    } else {
      const same = dest === p;
      add({
        ...base,
        new_url: `${NEW_HOST}${dest}`,
        action: same ? "MIGRATE" : dest.startsWith("/lead-types") ? "FOLD" : "MERGE",
        risk: pos !== null && pos < 15 && !same ? "medium" : "low",
        notes: same ? "" : "hub/tool/download remapped onto the target site's equivalent",
      });
    }
    continue;
  }

  add({ ...base, new_url: "", action: "REVIEW", risk: "medium", notes: "unclassified howtoworkleads URL" });
}

// --------------------------------------------------------------- agedleadsales
// Target site: everything keeps its path, only the host changes.
for (const url of readLines("alsales-sitemap.txt")) {
  add({
    old_url: url,
    new_url: `${NEW_HOST}${path(url)}`,
    action: "REHOST",
    clicks: "",
    impr: "",
    pos: "",
    risk: "low",
    notes: "",
  });
}

// ------------------------------------------------------------------------ emit
const COLS = ["old_url", "new_url", "action", "risk", "clicks", "impr", "pos", "notes"];
const esc = (v) => {
  const s = String(v ?? "");
  return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
};

writeFileSync(
  join(DIR, "url-map.csv"),
  [COLS.join(","), ...rows.map((r) => COLS.map((c) => esc(r[c])).join(","))].join("\n") + "\n"
);

const by = (k) => rows.reduce((a, r) => ((a[r[k]] = (a[r[k]] || 0) + 1), a), {});
console.log(`url-map.csv — ${rows.length} rows`);
console.log("by action:", by("action"));
console.log("by risk:  ", by("risk"));
const high = rows.filter((r) => r.risk === "high");
if (high.length) {
  console.log(`\n${high.length} high-risk rows (page-1 assets in the fold):`);
  for (const r of high) console.log(`  pos ${r.pos}  ${r.clicks} clk  ${r.impr} impr  ${path(r.old_url)}`);
}
