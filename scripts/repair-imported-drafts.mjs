#!/usr/bin/env node
/**
 * Repairs the 71 howtoworkleads posts staged as drafts by
 * scripts/migrate-htwl-content.mjs (Phase 2a).
 *
 * The import copied Portable Text across verbatim, which looked safe and was
 * not: howtoworkleads.com parses markdown inside span text at render time, so
 * its documents carry raw `**bold**`, `[text](url)` and a leading `# Title`
 * line that only *look* rendered on the source site. This project renders with
 * @portabletext/react, which prints span text as-is — so those posts would
 * publish with literal markdown in the body. Six of them would also publish
 * the authoring brief ("Sanity CMS Fields": slug, meta description, excerpt)
 * straight into the article, which is already publicly visible on
 * howtoworkleads.com today.
 *
 * Touches DRAFTS ONLY (`drafts.*`). Nothing here publishes anything, and the
 * documents it edits are not reachable on the live site.
 *
 * Usage:
 *   node scripts/repair-imported-drafts.mjs             # dry run, prints a report
 *   node scripts/repair-imported-drafts.mjs --apply     # patch Sanity
 *   node scripts/repair-imported-drafts.mjs --slug=x    # single doc
 *
 * Requires SANITY_API_TOKEN with write access when --apply is passed.
 */

import { normalizeImportedBlocks } from "./lib/normalize-imported-blocks.mjs";

const args = Object.fromEntries(
  process.argv.slice(2).map((a) => {
    const [k, v] = a.replace(/^--/, "").split("=");
    return [k, v ?? true];
  })
);

const APPLY = Boolean(args.apply);
const ONLY = typeof args.slug === "string" ? args.slug : null;

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";
const token = process.env.SANITY_API_TOKEN;

if (!projectId) {
  console.error("NEXT_PUBLIC_SANITY_PROJECT_ID is not set");
  process.exit(2);
}
if (APPLY && !token) {
  console.error("--apply needs SANITY_API_TOKEN with write access");
  process.exit(2);
}

const API = `https://${projectId}.api.sanity.io/v2024-01-01`;

let n = 0;
const keyFn = () => `r${(n++).toString(36)}${Math.random().toString(36).slice(2, 8)}`;

async function query(groq) {
  const url = `${API}/data/query/${dataset}?query=${encodeURIComponent(groq)}`;
  const res = await fetch(url, {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });
  const json = await res.json();
  if (json.error) throw new Error(JSON.stringify(json.error));
  return json.result;
}

const docs = await query(
  `*[_id in path("drafts.**") && _type=="post"]{_id, "slug":slug.current, body}`
);

console.log(`draft posts: ${docs.length}${ONLY ? ` (filtering to ${ONLY})` : ""}\n`);

const patches = [];
const totals = {
  metaBlocksDropped: 0,
  leadingH1Dropped: 0,
  linksConverted: 0,
  boldConverted: 0,
};
const leadOrder = [];

for (const doc of docs) {
  if (ONLY && doc.slug !== ONLY) continue;
  const { blocks, stats } = normalizeImportedBlocks(doc.body, keyFn);
  const changed = Object.values(stats).some((v) => v > 0);

  // Surface links to the retired affiliate endpoint rather than rewriting
  // them: /lead-order is marked PRUNE in url-map.csv but 307s to
  // agedleadstore.com, and the correct replacement depends on the affiliate
  // attribution question that is still open in Phase 0.
  const hrefs = JSON.stringify(blocks).match(/https?:\/\/(?:www\.)?howtoworkleads\.com[^"\\\s)]*/g);
  if (hrefs) for (const h of hrefs) leadOrder.push({ slug: doc.slug, href: h });

  if (!changed) continue;
  for (const k of Object.keys(totals)) totals[k] += stats[k];
  patches.push({ id: doc._id, slug: doc.slug, blocks, stats });
}

for (const p of patches) {
  const bits = Object.entries(p.stats)
    .filter(([, v]) => v > 0)
    .map(([k, v]) => `${k}=${v}`)
    .join(" ");
  console.log(`  ${p.slug}\n      ${bits}`);
}

console.log(`\ndrafts needing repair: ${patches.length}`);
console.log(`totals: ${JSON.stringify(totals)}`);

if (leadOrder.length) {
  console.log(`\nretired-host links left in place (need a content decision):`);
  for (const l of leadOrder) console.log(`  ${l.slug}  ->  ${l.href}`);
}

if (!APPLY) {
  console.log(`\nDRY RUN — nothing written. Re-run with --apply to patch.`);
  process.exit(0);
}

const mutations = patches.map((p) => ({
  patch: { id: p.id, set: { body: p.blocks } },
}));

const res = await fetch(`${API}/data/mutate/${dataset}`, {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  },
  body: JSON.stringify({ mutations }),
});
const json = await res.json();
if (json.error) {
  console.error(`\nmutation failed: ${JSON.stringify(json.error).slice(0, 500)}`);
  process.exit(1);
}
console.log(`\napplied ${mutations.length} patches (transaction ${json.transactionId}).`);
