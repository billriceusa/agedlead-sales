#!/usr/bin/env node
/**
 * Creates the four leadType documents the /buying-leads fold needs as
 * destinations (migration plan Phase 1).
 *
 * leadType currently covers 8 verticals while /price-index/* and
 * /providers/best/* run 11-12. These four bring it into line so the whole site
 * shares one vertical spine, and so every folded /buying-leads page lands on a
 * topic-matched destination instead of a generic hub.
 *
 * Field set deliberately matches the existing 8 docs: thin by design, because
 * app/(site)/lead-types/[slug] enriches from vertical, provider and benchmark
 * data. No body content here — that comes from harvesting the howtoworkleads
 * source pages, which is a human pass.
 *
 * averageCostPerLead is intentionally NOT set. The reliable benchmarks for
 * these verticals span mixed age brackets and produce misleading ranges
 * ($20-$100 for aged auto, $1.00-$1.00 for life). Benchmarks are human-verified
 * quarterly on this site and are never auto-generated — leave it empty rather
 * than ship a number nobody stands behind.
 *
 * Idempotent: uses createIfNotExists, so re-running will not clobber edits.
 *
 * Usage: SANITY_API_TOKEN=... node scripts/create-lead-types.mjs [--dry-run]
 */

const PROJECT_ID = "p7rbtajg";
const DATASET = "production";
const API = "2024-01-01";

const token = process.env.SANITY_API_TOKEN;
const dryRun = process.argv.includes("--dry-run");

if (!token && !dryRun) {
  console.error("SANITY_API_TOKEN is required (or pass --dry-run)");
  process.exit(1);
}

const docs = [
  {
    _id: "lt-life-insurance",
    _type: "leadType",
    title: "Life Insurance Leads",
    slug: { _type: "slug", current: "life-insurance-leads" },
    shortDescription:
      "Life insurance leads from consumers who requested term or whole life coverage quotes and compared carriers.",
    icon: "❤️",
    affiliateUrl: "https://agedleadstore.com",
    industries: ["Life Insurance", "Final Expense", "Estate Planning"],
    order: 9,
  },
  {
    _id: "lt-auto-insurance",
    _type: "leadType",
    title: "Auto Insurance Leads",
    slug: { _type: "slug", current: "auto-insurance-leads" },
    shortDescription:
      "Auto insurance leads from drivers who requested rate quotes and compared coverage options.",
    icon: "🚙",
    affiliateUrl: "https://agedleadstore.com",
    industries: ["Auto Insurance", "P&C Insurance"],
    order: 10,
  },
  {
    _id: "lt-health-insurance",
    _type: "leadType",
    title: "Health Insurance Leads",
    slug: { _type: "slug", current: "health-insurance-leads" },
    shortDescription:
      "Health insurance leads from consumers who shopped individual and family plans, including ACA marketplace coverage.",
    icon: "⚕️",
    affiliateUrl: "https://agedleadstore.com",
    industries: ["Health Insurance", "ACA Marketplace", "Medicare"],
    order: 11,
  },
  {
    _id: "lt-home-improvement",
    _type: "leadType",
    title: "Home Improvement Leads",
    slug: { _type: "slug", current: "home-improvement-leads" },
    shortDescription:
      "Home improvement leads from homeowners who requested estimates for roofing, HVAC, windows and other contracted work.",
    icon: "🔨",
    affiliateUrl: "https://agedleadstore.com",
    industries: ["Roofing", "HVAC", "Windows", "Solar", "General Contracting"],
    order: 12,
  },
];

if (dryRun) {
  console.log("DRY RUN — would createIfNotExists:");
  for (const d of docs) console.log(`  ${d._id.padEnd(22)} /lead-types/${d.slug.current}`);
  process.exit(0);
}

const res = await fetch(
  `https://${PROJECT_ID}.api.sanity.io/v${API}/data/mutate/${DATASET}?returnIds=true`,
  {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
    body: JSON.stringify({ mutations: docs.map((doc) => ({ createIfNotExists: doc })) }),
  }
);

const body = await res.json();
if (!res.ok) {
  console.error(`Sanity mutate failed (${res.status}):`, JSON.stringify(body, null, 2));
  process.exit(1);
}

console.log("Created/verified:", body.results?.map((r) => `${r.id} (${r.operation})`).join(", "));
