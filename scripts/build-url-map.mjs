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
 *   - htwl-gsc-pages-2026-06-05.json   the prior window, retained so the prune
 *                             rule needs two observations rather than one
 *   - htwl-published-at.json  publish dates, for the new-content grace window
 *   - backlinks-2026-08-01.json  live referring domains per URL, both sites
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
 * The window that closed 2026-06-05, kept so the prune rule can see more than
 * one observation. A single window is not enough evidence to delete a page:
 * how-to-work-aged-leads-the-complete-system-for-maximum-roi sat at position
 * 6.2 with 151 impressions here and vanished from the 2026-07-29 export
 * entirely — and it is the site's namesake cornerstone article. Pruning a page
 * that ranked page-1 eight weeks ago is precisely the mistake the /playbooks
 * consolidation already made once.
 *
 * Do not replace this file when refreshing. Add the newer window and keep the
 * older one; prune eligibility is the intersection.
 */
const priorGsc = JSON.parse(
  readFileSync(join(DIR, "htwl-gsc-pages-2026-06-05.json"), "utf8")
);

/**
 * End of the GSC window in htwl-gsc-pages.json. Refresh both together via
 * scripts/refresh-gsc-input.mjs.
 */
const GSC_WINDOW_END = "2026-07-29";

/**
 * Live referring domains per URL, both sites (Ahrefs, 2026-08-01).
 *
 * Backlinks were not an input to this generator until 2026-08-01, and the
 * omission had teeth: the prune rule keys on search impressions alone, and a
 * page can hold links while earning no impressions at all. Seven pruned pages
 * turned out to hold live referring domains — one of them from kaleidico.com
 * at DR 38 — and a PRUNE row emits no destination, so each would have 404'd.
 *
 * The lesson is the same one /lead-order already taught: a URL's search
 * metrics do not measure its inbound links. Check what points AT a page before
 * deleting it.
 *
 * www and non-www are summed per path — www 308s to the apex, so the two rows
 * describe one page.
 */
const backlinkFile = JSON.parse(
  readFileSync(join(DIR, "backlinks-2026-08-01.json"), "utf8")
);

const refdomainsByUrl = (() => {
  const out = {};
  for (const [host, entries] of Object.entries(backlinkFile)) {
    if (host.startsWith("_")) continue; // provenance keys
    for (const { url, refdomains } of entries) {
      const key = url.replace("://www.", "://").replace(/\/$/, "");
      out[key] = (out[key] ?? 0) + refdomains;
    }
  }
  return out;
})();

/** Referring domains pointing at a source URL, www and apex combined. */
const refdomains = (url) => refdomainsByUrl[url.replace(/\/$/, "")] ?? 0;

/**
 * Zero impressions only means "dead" if the page had a fair chance to be
 * measured. Anything published inside this grace period is exempt from the
 * zero-impression prune.
 *
 * Originally this was a simple "published after the window closed" test, which
 * rescued 9 posts the first pass would have deleted — the IUL cluster and the
 * 5-post compliance cluster. The 2026-07-29 refresh proved that right: three of
 * them now earn clicks and three sit inside the top 10. But a hard window edge
 * is too brittle. Under a plain window test, iul-leads-cost and
 * iul-vs-whole-life-leads (published late June, still at zero impressions)
 * would flip to PRUNE — deleting half of a deliberate strategic cluster after
 * five weeks. Ninety days is the honest floor for judging new content.
 */
const NEW_CONTENT_GRACE_DAYS = 90;

const graceCutoff = new Date(
  Date.parse(`${GSC_WINDOW_END}T00:00:00Z`) - NEW_CONTENT_GRACE_DAYS * 86_400_000
)
  .toISOString()
  .slice(0, 10);

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
};

/**
 * Pruned pages that hold live referring domains, rescued with a topic-matched
 * destination so the link is not thrown away at cutover.
 *
 * The plan's rule applies here and constrains what counts as a rescue: never
 * redirect to the homepage or a generic hub. `/playbooks/7-day-aged-lead-
 * follow-up-cadence` was 301'd into the generic `/playbook` once already and
 * the equity was wasted — Google treats a topically unrelated 301 as a soft
 * 404 and passes little. A bad destination is not better than a 404; it is the
 * same outcome with more clutter.
 *
 * Five of these are direct subject matches. The last two are weaker and are
 * marked so: the target site has no B2C-funnel or B2B-vs-B2C equivalent,
 * because it is a B2C-only property. They redirect to the site's canonical
 * multi-touch consumer process, which is the nearest real page rather than a
 * hub. Worth an editorial second opinion before cutover.
 */
const LINKED_PRUNE_RESCUE = {
  // Direct subject matches.
  "/blog/aged-lead-email-drip-campaigns": {
    to: "/blog/email-outreach-aged-leads-templates",
    why: "email outreach to aged leads — same subject",
  },
  "/blog/aged-leads-dnc-compliance": {
    to: "/blog/tcpa-compliance-calling-aged-leads",
    why: "DNC obligations are TCPA obligations — same subject",
  },
  "/blog/right-way-to-use-ai-lead-followup": {
    to: "/blog/ai-guardrails-aged-lead-agents",
    why: "responsible use of AI agents on lead follow-up — same subject",
  },
  "/blog/salesforce-leads-review": {
    to: "/blog/aged-lead-crm-setup-guide",
    why: "CRM selection and setup for aged leads — same job as a CRM review",
  },
  "/sales-process/how-to-build-a-real-time-internet-lead-team": {
    to: "/blog/scaling-aged-lead-operation-solo-agent-to-team",
    why: "building out a lead-handling team — same subject",
  },
  // Weaker matches — no B2C-funnel equivalent exists on a B2C-only site.
  "/sales-process/the-modern-b2c-sales-funnel": {
    to: "/guides/7-day-aged-lead-follow-up-cadence",
    why: "nearest real page: the site's canonical structured multi-touch consumer process. Weak match — review before cutover",
    weak: true,
  },
  "/sales-process/b2c-vs-b2b-sales-process": {
    to: "/guides/7-day-aged-lead-follow-up-cadence",
    why: "nearest real page; the target site is B2C-only so the comparison has no equivalent. Weak match — review before cutover",
    weak: true,
  },
};

const path = (u) => new URL(u).pathname.replace(/\/$/, "") || "/";
const perf = (p) => gsc[p] ?? { clicks: 0, impr: 0, pos: null };
const priorPerf = (p) => priorGsc[p] ?? { clicks: 0, impr: 0, pos: null };

const rows = [];
const add = (r) => rows.push(r);

// ---------------------------------------------------------------- howtoworkleads
for (const url of readLines("htwl-sitemap.txt")) {
  const p = path(url);
  const { clicks, impr, pos } = perf(p);
  const slug = p.split("/").pop();
  const base = { old_url: url, clicks, impr, pos: pos ?? "", refdomains: refdomains(url) };

  // Runs ahead of every prune branch: a page that would otherwise be dropped
  // but still holds inbound links gets a topic-matched destination instead.
  const rescue = LINKED_PRUNE_RESCUE[p];
  if (rescue && base.refdomains > 0) {
    add({
      ...base,
      new_url: `${NEW_HOST}${rescue.to}`,
      action: "MERGE",
      risk: rescue.weak ? "medium" : "low",
      notes: `pruned but holds ${base.refdomains} referring domain(s) — rescued: ${rescue.why}`,
    });
    continue;
  }

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
    // What a bad fold costs you is TRAFFIC, not rank. The 2026-07-29 GSC
    // refresh made this concrete: buy-iul-leads slipped from position 8.7 to
    // 16.2 while growing to 67 clicks — still the strongest page across both
    // sites, but a position-only rule had just downgraded it. Clicks lead.
    const risk =
      clicks >= 10 || (pos !== null && pos < 15 && clicks > 0)
        ? "high"
        : impr > 1000
          ? "medium"
          : "low";
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
    } else if (impr === 0 && (publishedAt[slug] ?? "") > graceCutoff) {
      add({ ...base, new_url: `${NEW_HOST}${p}`, action: "MIGRATE", risk: "low",
        notes: `published ${publishedAt[slug]}, inside the ${NEW_CONTENT_GRACE_DAYS}-day grace window — too new to judge, do not prune` });
    } else if (impr === 0 && priorPerf(p).impr > 0) {
      const prior = priorPerf(p);
      add({ ...base, new_url: `${NEW_HOST}${p}`, action: "MIGRATE", risk: "low",
        notes: `zero impressions now, but ${prior.impr} impressions at position ${prior.pos} in the window ending 2026-06-05 — decayed, not dead; do not prune on one window` });
    } else if (impr === 0) {
      add({ ...base, new_url: "", action: "PRUNE", risk: "low",
        notes: [
          "zero impressions in both GSC windows (2026-06-05 and 2026-07-29)",
          publishedAt[slug] ? "" : "no publishedAt in Sanity — age unverified",
        ].filter(Boolean).join("; ") });
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

  // Not a content page — a CTA endpoint that 307s to agedleadstore.com with
  // UTM tagging. An earlier pass pruned it as "no unique content", which is
  // true and beside the point: nobody searches for a redirect, they click it,
  // so its 25 impressions say nothing about its value. 36 link instances
  // across 17 pages point here, six of them on pages that survive the
  // migration, including two body-copy links in the cornerstone article.
  // Preserved as a route on the new host (see next.config.ts) so the affiliate
  // exit keeps working.
  if (p === "/lead-order") {
    add({ ...base, new_url: `${NEW_HOST}${p}`, action: "MIGRATE", risk: "medium",
      notes: "affiliate CTA endpoint, not content — keep the outbound redirect alive" });
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
    refdomains: refdomains(url),
    risk: "low",
    notes: "",
  });
}

// ------------------------------------------------------------------------ emit
/**
 * No pruned page may still hold inbound links. A PRUNE row emits no
 * destination and 404s at cutover, so this is the check that stops the
 * generator from silently throwing away link equity — add a
 * LINKED_PRUNE_RESCUE entry, or deliberately drop the links and say so here.
 *
 * This fails the build rather than warning. A warning in a script nobody
 * watches is how the first seven got this far.
 */
const droppedWithLinks = rows.filter(
  (r) => r.action === "PRUNE" && Number(r.refdomains) > 0
);
if (droppedWithLinks.length) {
  const detail = droppedWithLinks
    .map((r) => `  ${r.refdomains} refdomain(s)  ${r.old_url}`)
    .join("\n");
  throw new Error(
    `${droppedWithLinks.length} PRUNE row(s) still hold live referring domains and would 404 at cutover:\n${detail}\n` +
      `Give each a topic-matched destination in LINKED_PRUNE_RESCUE, or accept the loss explicitly.`
  );
}

const COLS = ["old_url", "new_url", "action", "risk", "clicks", "impr", "pos", "refdomains", "notes"];
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
