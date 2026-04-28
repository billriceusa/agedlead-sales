/**
 * One-time publisher for the seven 2026-04-28 drafts.
 *
 * Reads each `content/drafts-2026-04-28/<n>-*\/draft.md`, parses simple
 * frontmatter, converts the markdown body to Portable Text via
 * lib/markdown-to-portabletext.ts, builds a Sanity post document, and
 * createOrReplace's it.
 *
 * Run via tsx (loads .env.local automatically when --env-file is passed):
 *   npx tsx --env-file=.env.local scripts/publish-drafts-2026-04-28.ts --dry-run
 *   npx tsx --env-file=.env.local scripts/publish-drafts-2026-04-28.ts --slug=aged-mortgage-leads-2026-guide
 *   npx tsx --env-file=.env.local scripts/publish-drafts-2026-04-28.ts
 */

import { createClient } from "@sanity/client";
import { readFileSync, readdirSync, statSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { markdownToPortableText, type PortableTextNode } from "../lib/markdown-to-portabletext.js";

const __dirname = dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = join(__dirname, "..");
const DRAFTS_DIR = join(REPO_ROOT, "content", "drafts-2026-04-28");

// ── Frontmatter parser (minimal, enough for our format) ─────────────
function parseFrontmatter(src: string): { data: Record<string, string>; body: string } {
  const m = src.match(/^---\n([\s\S]*?)\n---\n?([\s\S]*)$/);
  if (!m) return { data: {}, body: src };
  const yaml = m[1];
  const body = m[2];
  const data: Record<string, string> = {};
  for (const line of yaml.split("\n")) {
    const kv = line.match(/^([A-Za-z_][\w]*):\s*(.*)$/);
    if (!kv) continue;
    let val = kv[2].trim();
    if (val.startsWith('"') && val.endsWith('"')) val = val.slice(1, -1);
    if (val.startsWith("'") && val.endsWith("'")) val = val.slice(1, -1);
    data[kv[1]] = val;
  }
  return { data, body };
}

// ── Sanity client ────────────────────────────────────────────────────
const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "p7rbtajg";
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";
const token = (process.env.SANITY_API_TOKEN || "").trim();

if (!token) {
  console.error("Missing SANITY_API_TOKEN env var");
  process.exit(1);
}

const client = createClient({
  projectId,
  dataset,
  apiVersion: "2026-03-14",
  token,
  useCdn: false,
});

function key() {
  return Math.random().toString(36).slice(2, 10);
}

function ref(id: string) {
  return { _type: "reference", _ref: id, _key: key() };
}

// ── Per-article metadata ────────────────────────────────────────────
const ARTICLE_META: Record<string, {
  categoryIds: string[];
  leadTypeIds: string[];
  contentType: "pillar" | "cluster";
}> = {
  "aged-mortgage-leads-2026-guide": {
    categoryIds: ["cat-lead-types"],
    leadTypeIds: ["lt-mortgage"],
    contentType: "pillar",
  },
  "auto-insurance-leads-cost-2026": {
    categoryIds: ["cat-roi"],
    leadTypeIds: ["lt-insurance"],
    contentType: "cluster",
  },
  "life-insurance-leads-cost-2026": {
    categoryIds: ["cat-roi"],
    leadTypeIds: ["lt-insurance", "lt-iul", "lt-final-expense"],
    contentType: "cluster",
  },
  "health-insurance-leads-cost-2026": {
    categoryIds: ["cat-roi"],
    leadTypeIds: ["lt-insurance", "lt-medicare"],
    contentType: "cluster",
  },
  "chatgpt-prompts-aged-leads": {
    categoryIds: ["cat-scripts"],
    leadTypeIds: [],
    contentType: "cluster",
  },
  "ai-lead-scoring-aged-leads": {
    categoryIds: ["cat-scripts", "cat-roi"],
    leadTypeIds: [],
    contentType: "cluster",
  },
  "aged-lead-store-review-2026": {
    categoryIds: ["cat-getting-started"],
    leadTypeIds: [],
    contentType: "cluster",
  },
};

function metaTitleFrom(title: string) {
  if (title.length <= 60) return title;
  return title.slice(0, 57) + "…";
}

function metaDescriptionFrom(excerpt: string | undefined) {
  if (!excerpt) return undefined;
  if (excerpt.length <= 160) return excerpt;
  return excerpt.slice(0, 157) + "…";
}

type SanityDoc = {
  _id: string;
  _type: "post";
  [key: string]: unknown;
};

interface BuiltDoc {
  doc: SanityDoc;
  slug: string;
  title: string;
}

function buildDoc(draftDir: string): BuiltDoc {
  const draftPath = join(draftDir, "draft.md");
  const raw = readFileSync(draftPath, "utf8");
  const { data, body } = parseFrontmatter(raw);

  const title = data.title;
  const slug = data.slug;
  const excerpt = data.excerpt;
  const publishedAt = data.publishedAt
    ? new Date(data.publishedAt).toISOString()
    : new Date().toISOString();

  if (!title || !slug) {
    throw new Error(`Missing title or slug in ${draftPath}`);
  }

  // Strip the leading H1 (title) since the title is a separate field.
  const bodyMd = body.replace(/^\s*#\s+.+?\n/, "");

  const portableText: PortableTextNode[] = markdownToPortableText(bodyMd);

  const meta = ARTICLE_META[slug];
  if (!meta) {
    throw new Error(`No category/leadType mapping for slug: ${slug}`);
  }

  const doc = {
    _id: `post-${slug}`,
    _type: "post" as const,
    title,
    slug: { _type: "slug" as const, current: slug },
    excerpt,
    publishedAt,
    contentType: meta.contentType,
    isFeatured: false,
    author: ref("author-bill-rice"),
    categories: meta.categoryIds.map((id) => ref(id)),
    ...(meta.leadTypeIds.length > 0
      ? { leadTypes: meta.leadTypeIds.map((id) => ref(id)) }
      : {}),
    seo: {
      metaTitle: metaTitleFrom(title),
      metaDescription: metaDescriptionFrom(excerpt),
    },
    body: portableText,
  };

  return { doc, slug, title };
}

async function main() {
  const args = process.argv.slice(2);
  const dryRun = args.includes("--dry-run");
  const slugArg = args.find((a) => a.startsWith("--slug="))?.split("=")[1];

  const folders = readdirSync(DRAFTS_DIR)
    .filter((name) => /^\d{2}-/.test(name))
    .filter((name) => statSync(join(DRAFTS_DIR, name)).isDirectory())
    .sort();

  console.log(`Found ${folders.length} draft folders.\n`);

  for (const folder of folders) {
    const draftDir = join(DRAFTS_DIR, folder);
    let built: BuiltDoc;
    try {
      built = buildDoc(draftDir);
    } catch (e: unknown) {
      console.error(`✗ ${folder}: ${(e as Error).message}`);
      continue;
    }

    const { doc, slug, title } = built;

    if (slugArg && slugArg !== slug) continue;

    const body = doc.body as PortableTextNode[];
    const blocks = body.length;
    const tables = body.filter((b) => b._type === "table").length;
    const codeBlocks = body.filter((b) => b._type === "codeBlock").length;
    const lists = body.filter(
      (b) => b._type === "block" && (b as { listItem?: string }).listItem
    ).length;

    console.log(`→ ${slug}`);
    console.log(`  title: ${title}`);
    console.log(
      `  body: ${blocks} blocks, ${tables} tables, ${codeBlocks} code blocks, ${lists} list items`
    );
    console.log(`  publishedAt: ${doc.publishedAt}`);
    const cats = doc.categories as { _ref: string }[];
    console.log(`  categories: ${cats.map((r) => r._ref).join(", ")}`);
    if (doc.leadTypes) {
      const lts = doc.leadTypes as { _ref: string }[];
      console.log(`  leadTypes: ${lts.map((r) => r._ref).join(", ")}`);
    }

    if (dryRun) {
      console.log(`  [dry-run] not writing\n`);
      continue;
    }

    try {
      await client.createOrReplace(doc);
      console.log(`  ✓ published\n`);
    } catch (e: unknown) {
      console.error(`  ✗ publish failed: ${(e as Error).message}\n`);
    }
  }

  console.log("Done.");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
