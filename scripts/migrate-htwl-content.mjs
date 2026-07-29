#!/usr/bin/env node
/**
 * Phase 2a of the workagedleads.com consolidation: import the howtoworkleads
 * blog corpus into this project's Sanity dataset.
 *
 * Imports as DRAFTS. The site client reads with useCdn and no token, i.e. the
 * published perspective, so drafts are invisible to the live site. That matters:
 * blog queries here are ungated on publishedAt, so a direct publish would put
 * 68 posts live on agedleadsales.com while they are still live on
 * howtoworkleads.com — duplicate content across two domains until the 301s
 * fire. Stage now, publish in bulk at cutover.
 *
 * Only MIGRATE rows are imported. The 6 MERGE rows are content that belongs
 * inside an existing post here; importing them would create the very duplicates
 * the consolidation exists to remove. They are exported to markdown instead,
 * for a human to harvest.
 *
 * Usage:
 *   node scripts/migrate-htwl-content.mjs --dry-run
 *   SANITY_API_TOKEN=... node scripts/migrate-htwl-content.mjs
 */

import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { join } from "node:path";

const SRC_PROJECT = "e9k38j42";
const DST_PROJECT = "p7rbtajg";
const DATASET = "production";
const API = "2024-01-01";

const EXPORT_PATH =
  process.env.HTWL_EXPORT ??
  "/Users/billrice/Documents/brsg/sites/_migration-backups/sanity-htwl-e9k38j42-2026-07-29.ndjson";

const dryRun = process.argv.includes("--dry-run");
const token = process.env.SANITY_API_TOKEN;
if (!token && !dryRun) {
  console.error("SANITY_API_TOKEN required (or pass --dry-run)");
  process.exit(1);
}

// ---------------------------------------------------------------- references
/** howtoworkleads category slug -> this project's category doc id. */
const CATEGORY_MAP = {
  "buying-leads": "cat-getting-started",
  resources: "cat-getting-started",
  "lead-management": "cat-strategies",
  "crm-systems": "cat-strategies",
  "sales-process": "cat-strategies",
  "insurance-leads": "cat-lead-types",
  "legal-leads": "cat-lead-types",
  "home-services-leads": "cat-lead-types",
  "aged-leads": "cat-getting-started",
  compliance: "cat-compliance",
};

/**
 * Lead-type inference, first match wins so order matters — "life insurance"
 * must beat the bare "insurance" catch-all, and "final expense" must beat both.
 */
const LEAD_TYPE_RULES = [
  [/final[- ]expense/i, "lt-final-expense"],
  [/\biul\b|indexed universal/i, "lt-iul"],
  [/medicare/i, "lt-medicare"],
  [/life[- ]insurance/i, "lt-life-insurance"],
  [/health[- ]insurance|\baca\b/i, "lt-health-insurance"],
  [/auto[- ]insurance/i, "lt-auto-insurance"],
  // Annuity content belongs with IUL — they share the annuity-iul vertical.
  [/annuity/i, "lt-iul"],
  [/mortgage|refinance|heloc|dscr|non[- ]qm|bank[- ]statement|real[- ]estate/i, "lt-mortgage"],
  [/solar/i, "lt-solar"],
  [
    /home[- ](improvement|services)|roofing|hvac|window|plumb|electric|landscap|paint|garage[- ]door|remodel|contractor|pest/i,
    "lt-home-improvement",
  ],
  [/\bmva\b|motor vehicle|personal injury|mass tort/i, "lt-mva"],
  [/\bssdi\b|disability/i, "lt-ssdi"],
  [/insurance/i, "lt-insurance"],
];

const inferLeadTypes = (text) => {
  const hits = [];
  for (const [re, id] of LEAD_TYPE_RULES) {
    if (re.test(text) && !hits.includes(id)) hits.push(id);
    if (hits.length === 2) break;
  }
  return hits;
};

// -------------------------------------------------------------------- inputs
const docs = readFileSync(EXPORT_PATH, "utf8")
  .split("\n")
  .filter(Boolean)
  .map((l) => JSON.parse(l));

const bySlug = new Map();
const catSlugById = new Map();
for (const d of docs) {
  if (d._type === "blogPost") bySlug.set(d.slug?.current, d);
  if (d._type === "categoryPage") catSlugById.set(d._id, d.slug?.current);
}

const MIGRATION_DIR = join(process.cwd(), "data", "migration");
const urlMap = readFileSync(join(MIGRATION_DIR, "url-map.csv"), "utf8")
  .split("\n")
  .slice(1)
  .filter(Boolean)
  .map((line) => {
    // naive split is fine: only `notes` is ever quoted, and it is last
    const [old_url, new_url, action] = line.split(",");
    return { old_url, new_url, action };
  });

const pick = (action) =>
  urlMap
    .filter(
      (r) =>
        r.action === action &&
        r.old_url.includes("howtoworkleads.com/blog/")
    )
    .map((r) => r.old_url.split("/blog/")[1]);

const toImport = pick("MIGRATE");
const toHarvest = pick("MERGE");

// ---------------------------------------------------------------- transforms
const keyCounter = (() => {
  let n = 0;
  return () => `mig${(n++).toString(36)}`;
})();

/** comparisonTable -> table. Header row first, per the target schema. */
const comparisonToTable = (b) => ({
  _type: "table",
  _key: b._key ?? keyCounter(),
  ...(b.title ? { caption: b.title } : {}),
  rows: [
    ...(b.columns?.length
      ? [{ _type: "tableRow", _key: keyCounter(), cells: b.columns }]
      : []),
    ...(b.rows ?? []).map((r) => ({
      _type: "tableRow",
      _key: keyCounter(),
      cells: r.cells ?? [],
    })),
  ],
});

const textBlock = (text, style = "normal") => ({
  _type: "block",
  _key: keyCounter(),
  style,
  markDefs: [],
  children: [{ _type: "span", _key: keyCounter(), text, marks: [] }],
});

/**
 * faqSection -> plain blocks. FAQPage JSON-LD only renders on lead-type and
 * /compare pages here, so a blog post could not emit the rich result either
 * way. Answer-first prose keeps the AEO value.
 */
const faqToBlocks = (b) => [
  textBlock(b.title || "Frequently Asked Questions", "h2"),
  ...(b.faqs ?? []).flatMap((f) => [textBlock(f.question, "h3"), textBlock(f.answer)]),
];

const assetRefs = new Set();
const collectAsset = (ref) => ref && assetRefs.add(ref);

function transformBody(content, assetMap) {
  const out = [];
  for (const b of content ?? []) {
    switch (b._type) {
      case "comparisonTable":
        out.push(comparisonToTable(b));
        break;
      case "faqSection":
        out.push(...faqToBlocks(b));
        break;
      case "image": {
        const ref = b.asset?._ref;
        collectAsset(ref);
        const mapped = assetMap?.get(ref);
        if (mapped) out.push({ ...b, asset: { _type: "reference", _ref: mapped } });
        break; // drop rather than emit a cross-project ref that renders broken
      }
      default:
        out.push(b);
    }
  }
  return out;
}

function transform(src, assetMap) {
  const slug = src.slug.current;
  const haystack = `${src.title} ${slug}`;
  const cats = (src.categories ?? [])
    .map((c) => CATEGORY_MAP[catSlugById.get(c._ref)])
    .filter(Boolean);
  const uniqueCats = [...new Set(cats)];

  const mainRef = src.mainImage?.asset?._ref;
  collectAsset(mainRef);
  const mappedMain = assetMap?.get(mainRef);

  const doc = {
    _id: `drafts.post-htwl-${slug}`,
    _type: "post",
    title: src.title,
    slug: { _type: "slug", current: slug },
    ...(src.excerpt ? { excerpt: src.excerpt } : {}),
    ...(mappedMain
      ? {
          mainImage: {
            _type: "image",
            asset: { _type: "reference", _ref: mappedMain },
            ...(src.mainImage.alt ? { alt: src.mainImage.alt } : {}),
          },
        }
      : {}),
    body: transformBody(src.content, assetMap),
    author: { _type: "reference", _ref: "author-bill-rice" },
    ...(uniqueCats.length
      ? {
          categories: uniqueCats.map((id) => ({
            _type: "reference",
            _key: keyCounter(),
            _ref: id,
          })),
        }
      : {}),
    ...(() => {
      const lts = inferLeadTypes(haystack);
      return lts.length
        ? {
            leadTypes: lts.map((id) => ({
              _type: "reference",
              _key: keyCounter(),
              _ref: id,
            })),
          }
        : {};
    })(),
    ...(src.publishedAt ? { publishedAt: src.publishedAt } : {}),
    // The relocation that silently nulls metadata if missed: howtoworkleads
    // keeps these top-level, this project nests them under `seo`.
    seo: {
      _type: "object",
      ...(src.seoTitle ? { metaTitle: src.seoTitle } : {}),
      ...(src.seoDescription ? { metaDescription: src.seoDescription } : {}),
    },
  };

  // Hard assertion — a null here is the exact failure the plan called out.
  if (src.seoTitle && !doc.seo.metaTitle)
    throw new Error(`SEO relocation lost metaTitle for ${slug}`);
  if (src.seoDescription && !doc.seo.metaDescription)
    throw new Error(`SEO relocation lost metaDescription for ${slug}`);

  return doc;
}

// ------------------------------------------------------------ asset transfer
const cdnUrl = (ref) => {
  const m = /^image-([a-f0-9]+)-(\d+x\d+)-(\w+)$/.exec(ref);
  if (!m) return null;
  return `https://cdn.sanity.io/images/${SRC_PROJECT}/${DATASET}/${m[1]}-${m[2]}.${m[3]}`;
};

async function uploadAssets(refs) {
  const map = new Map();
  let i = 0;
  for (const ref of refs) {
    i++;
    const url = cdnUrl(ref);
    if (!url) {
      console.warn(`  [${i}/${refs.length}] unparseable ref, skipping: ${ref}`);
      continue;
    }
    const img = await fetch(url);
    if (!img.ok) {
      console.warn(`  [${i}/${refs.length}] source fetch ${img.status}, skipping: ${ref}`);
      continue;
    }
    const buf = Buffer.from(await img.arrayBuffer());
    const res = await fetch(
      `https://${DST_PROJECT}.api.sanity.io/v${API}/assets/images/${DATASET}?filename=${encodeURIComponent(ref)}`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": img.headers.get("content-type") ?? "image/jpeg",
        },
        body: buf,
      }
    );
    const body = await res.json();
    if (!res.ok) {
      console.warn(`  [${i}/${refs.length}] upload failed: ${JSON.stringify(body).slice(0, 160)}`);
      continue;
    }
    map.set(ref, body.document._id);
    console.log(`  [${i}/${refs.length}] ${ref} -> ${body.document._id}`);
  }
  return map;
}

// -------------------------------------------------------------------- run it
console.log(`source posts in export: ${bySlug.size}`);
console.log(`MIGRATE (import as drafts): ${toImport.length}`);
console.log(`MERGE  (export for harvest): ${toHarvest.length}`);

const missing = toImport.filter((s) => !bySlug.has(s));
if (missing.length) {
  console.error(`\nMissing from export: ${missing.join(", ")}`);
  process.exit(1);
}

// First pass with no asset map, purely to discover which assets are referenced.
for (const slug of toImport) transform(bySlug.get(slug), null);
const refs = [...assetRefs];
console.log(`distinct image assets referenced: ${refs.length}`);

if (dryRun) {
  const sample = transform(bySlug.get(toImport[0]), new Map());
  console.log(`\nDRY RUN — no writes.`);
  console.log(`sample: ${sample._id}`);
  console.log(`  categories: ${JSON.stringify(sample.categories?.map((c) => c._ref))}`);
  console.log(`  leadTypes:  ${JSON.stringify(sample.leadTypes?.map((c) => c._ref))}`);
  console.log(`  seo:        ${JSON.stringify(sample.seo).slice(0, 120)}`);
  const types = {};
  for (const s of toImport)
    for (const b of transform(bySlug.get(s), new Map()).body) types[b._type] = (types[b._type] || 0) + 1;
  console.log(`  body block types across all ${toImport.length}: ${JSON.stringify(types)}`);
  const noCat = toImport.filter((s) => !transform(bySlug.get(s), new Map()).categories);
  const noLt = toImport.filter((s) => !transform(bySlug.get(s), new Map()).leadTypes);
  console.log(`  posts with no category: ${noCat.length}${noCat.length ? " -> " + noCat.join(", ") : ""}`);
  console.log(`  posts with no leadType: ${noLt.length}${noLt.length ? " -> " + noLt.join(", ") : ""}`);
  process.exit(0);
}

console.log(`\nuploading ${refs.length} image assets to ${DST_PROJECT}...`);
const assetMap = await uploadAssets(refs);

const mutations = toImport.map((slug) => ({
  createOrReplace: transform(bySlug.get(slug), assetMap),
}));

console.log(`\nwriting ${mutations.length} drafts...`);
const res = await fetch(
  `https://${DST_PROJECT}.api.sanity.io/v${API}/data/mutate/${DATASET}`,
  {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
    body: JSON.stringify({ mutations }),
  }
);
const body = await res.json();
if (!res.ok) {
  console.error(`mutate failed (${res.status}):`, JSON.stringify(body).slice(0, 600));
  process.exit(1);
}
console.log(`wrote ${body.results?.length ?? 0} drafts`);

// MERGE sources -> markdown for a human to harvest into the destination post.
const outDir = join(MIGRATION_DIR, "merge-sources");
mkdirSync(outDir, { recursive: true });
const plain = (blocks) =>
  (blocks ?? [])
    .map((b) =>
      b._type === "block"
        ? `${b.style?.startsWith("h") ? "#".repeat(+b.style[1]) + " " : ""}${(b.children ?? [])
            .map((c) => c.text)
            .join("")}`
        : `[${b._type}]`
    )
    .join("\n\n");
for (const slug of toHarvest) {
  const d = bySlug.get(slug);
  if (!d) continue;
  const dest = urlMap.find((r) => r.old_url.endsWith(`/blog/${slug}`))?.new_url ?? "";
  writeFileSync(
    join(outDir, `${slug}.md`),
    `# ${d.title}\n\nMerge into: ${dest}\nSource: https://howtoworkleads.com/blog/${slug}\n\n---\n\n${plain(d.content)}\n`
  );
}
console.log(`wrote ${toHarvest.length} merge-source markdown files to data/migration/merge-sources/`);
