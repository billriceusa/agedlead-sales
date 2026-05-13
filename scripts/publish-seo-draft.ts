/**
 * Publishes a manually-written SEO draft to Sanity CMS, attaches a featured
 * image via Unsplash, and pings IndexNow.
 *
 * Usage:
 *   npm run publish:draft -- content/drafts-2026-05-12/aged-life-insurance-leads-guide/draft.md
 *
 * The draft must have YAML frontmatter between triple-dash delimiters followed
 * by a markdown body. See content/drafts-2026-04-28/ for the expected format.
 *
 * Required env vars (auto-loaded from .env.local when present):
 *   NEXT_PUBLIC_SANITY_PROJECT_ID
 *   SANITY_API_TOKEN
 *   UNSPLASH_ACCESS_KEY      (optional — image step skipped if absent)
 *   NEXT_PUBLIC_SITE_URL     (defaults to https://agedleadsales.com)
 */

import { readFileSync, existsSync } from "fs";
import { resolve } from "path";
import { publishArticle, getExistingPosts } from "../lib/cron/sanity-publish";
import { generateAndAttachFeaturedImage } from "../lib/cron/featured-image";
import { notifyIndexNow } from "../lib/indexnow";
import type { ArticleSection, WeeklyBrief, GeneratedArticle } from "../lib/cron/types";

// Load .env.local in local dev (Node 20.12+). Must happen before any Sanity
// or Unsplash clients are initialised; those are constructed lazily inside
// the imported modules so this placement is safe.
try {
  (process as unknown as { loadEnvFile?: (p: string) => void }).loadEnvFile?.(
    ".env.local"
  );
} catch {
  // env already set or .env.local absent — not an error
}

// ── Types ─────────────────────────────────────────────────────────────────────

type Frontmatter = Record<string, string | string[]>;

// ── Frontmatter parser ────────────────────────────────────────────────────────

function parseFrontmatter(raw: string): Frontmatter {
  const result: Frontmatter = {};
  let currentKey: string | null = null;

  for (const line of raw.split("\n")) {
    // Block sequence item: "  - value"
    if (/^\s{2,}-\s/.test(line)) {
      const val = line.replace(/^\s+-\s+/, "").trim();
      if (currentKey) {
        const existing = result[currentKey];
        if (Array.isArray(existing)) {
          existing.push(val);
        } else {
          result[currentKey] = [val];
        }
      }
      continue;
    }

    // Key: value  (value may be empty for array-only keys)
    const m = line.match(/^([a-zA-Z][a-zA-Z0-9_-]*):\s*(.*)$/);
    if (m) {
      currentKey = m[1];
      const val = m[2].trim().replace(/^["']|["']$/g, "");
      if (val) result[currentKey] = val;
      continue;
    }

    // Non-indented, non-key line resets key context
    if (line.length > 0 && !/^\s/.test(line)) currentKey = null;
  }

  return result;
}

// ── Markdown → ArticleSection[] ──────────────────────────────────────────────

function stripInline(text: string): string {
  return text
    .replace(/\*\*(.+?)\*\*/g, "$1")
    .replace(/\*(.+?)\*/g, "$1")
    .replace(/__(.+?)__/g, "$1")
    .replace(/_(.+?)_/g, "$1")
    .replace(/`(.+?)`/g, "$1")
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .replace(/~~(.+?)~~/g, "$1")
    .trim();
}

function markdownToSections(body: string): ArticleSection[] {
  const sections: ArticleSection[] = [];
  let pending: string[] = [];

  const flush = () => {
    const text = stripInline(pending.join(" ").trim());
    if (text) sections.push({ style: "normal", text });
    pending = [];
  };

  for (const raw of body.split("\n")) {
    const line = raw.trimEnd();

    // HTML comments (CMS import notes)
    if (line.trimStart().startsWith("<!--")) { flush(); continue; }

    // Table rows and separators
    if (/^\s*\|/.test(line) || /^\s*[\s|:-]+$/.test(line)) { flush(); continue; }

    // H1 — skip (it duplicates the title already in frontmatter)
    if (/^# /.test(line)) { flush(); continue; }

    if (/^## /.test(line)) {
      flush();
      sections.push({ style: "h2", text: stripInline(line.replace(/^## /, "")) });
      continue;
    }

    if (/^### /.test(line)) {
      flush();
      sections.push({ style: "h3", text: stripInline(line.replace(/^### /, "")) });
      continue;
    }

    if (/^#### /.test(line)) {
      flush();
      sections.push({ style: "h3", text: stripInline(line.replace(/^#### /, "")) });
      continue;
    }

    // Blockquotes (affiliate disclosure, callout boxes)
    if (/^> /.test(line)) {
      flush();
      sections.push({ style: "blockquote", text: stripInline(line.replace(/^> /, "")) });
      continue;
    }

    // Unordered list items — flatten to prose
    if (/^[\s]*[-*+] /.test(line)) {
      pending.push(line.replace(/^[\s\-*+]+/, ""));
      continue;
    }

    // Ordered list items — flatten to prose
    if (/^[\s]*\d+\. /.test(line)) {
      pending.push(line.replace(/^[\s]*\d+\.\s+/, ""));
      continue;
    }

    // Blank line → paragraph break
    if (!line.trim()) { flush(); continue; }

    pending.push(line);
  }

  flush();
  return sections.filter((s) => s.text.length > 0);
}

// ── Category → Pillar + LeadType mappings ────────────────────────────────────

const CATEGORY_TO_PILLAR: Record<string, string> = {
  "insurance":       "Vertical Playbooks",
  "mortgage":        "Vertical Playbooks",
  "solar":           "Vertical Playbooks",
  "home-services":   "Vertical Playbooks",
  "final-expense":   "Vertical Playbooks",
  "providers":       "Vertical Playbooks",
  "compliance":      "Compliance",
  "strategies":      "Channel Tactics",
  "metrics":         "Metrics & Optimization",
  "roles":           "Role Guides",
  "getting-started": "Role Guides",
};

const CATEGORY_TO_LEAD_TYPES: Record<string, string[]> = {
  "insurance":     ["lt-insurance"],
  "mortgage":      ["lt-mortgage"],
  "solar":         ["lt-solar"],
  "home-services": ["lt-insurance"],
  "final-expense": ["lt-final-expense"],
  "providers":     ["lt-insurance", "lt-mortgage"],
  "compliance":    ["lt-insurance", "lt-mortgage"],
};

// ── Build GeneratedArticle ────────────────────────────────────────────────────

function buildArticle(fm: Frontmatter, sections: ArticleSection[]): GeneratedArticle {
  const str = (k: string, fallback = ""): string => {
    const v = fm[k];
    return typeof v === "string" ? v : fallback;
  };

  const title       = str("title");
  const slug        = str("slug");
  const excerpt     = str("excerpt");
  const category    = str("category", "insurance");
  const contentType = str("contentType", "pillar") as "pillar" | "cluster";

  // Extract YYYY-MM-DD from publishedAt (may be full ISO string)
  const publishDate = str("publishedAt", new Date().toISOString()).split("T")[0];

  const pillar          = CATEGORY_TO_PILLAR[category] ?? "Vertical Playbooks";
  const targetLeadTypes = CATEGORY_TO_LEAD_TYPES[category] ?? ["lt-insurance"];

  const secondaryKeywords = fm["secondaryKeywords"];
  const secondaryArr = Array.isArray(secondaryKeywords) ? secondaryKeywords : [];

  const rawSeoTitle = str("seoTitle") || title;
  const seoTitle    = rawSeoTitle.length > 60 ? rawSeoTitle.slice(0, 57) + "…" : rawSeoTitle;
  const seoDescription = (str("metaDescription") || excerpt).slice(0, 160);

  const brief: WeeklyBrief = {
    day: "Mon",        // placeholder — unused by publishArticle
    publishDate,
    slug,
    title,
    pillar,
    primaryKeyword: str("primaryKeyword"),
    secondaryKeywords: secondaryArr,
    targetLeadTypes,
    wordCount: str("wordCount", "~2000"),
    competitiveAngle: "",
    outline: [],
    internalLinks: [],
  };

  return { brief, excerpt, seoTitle, seoDescription, contentType, sections };
}

// ── Main ─────────────────────────────────────────────────────────────────────

async function main() {
  const draftPath = process.argv[2];
  if (!draftPath) {
    console.error(
      "Usage: npm run publish:draft -- <path-to-draft.md>\n" +
      "Example: npm run publish:draft -- content/drafts-2026-05-12/aged-life-insurance-leads-guide/draft.md"
    );
    process.exit(1);
  }

  const absPath = resolve(draftPath);
  if (!existsSync(absPath)) {
    console.error(`✗ File not found: ${absPath}`);
    process.exit(1);
  }

  const raw = readFileSync(absPath, "utf-8");

  const fmMatch = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/);
  if (!fmMatch) {
    console.error("✗ Could not find --- frontmatter delimiters in the file.");
    process.exit(1);
  }

  const fm       = parseFrontmatter(fmMatch[1]);
  const sections = markdownToSections(fmMatch[2]);

  if (!fm["title"] || !fm["slug"]) {
    console.error("✗ Frontmatter must include at least `title` and `slug`.");
    process.exit(1);
  }

  console.log(`\nPublishing draft: ${fm["title"]}`);
  console.log(`  slug      : ${fm["slug"]}`);
  console.log(`  category  : ${fm["category"] ?? "(unset — defaulting to insurance)"}`);
  console.log(`  sections  : ${sections.length} blocks parsed from markdown`);
  console.log(`  publishAt : ${(fm["publishedAt"] as string | undefined)?.split("T")[0] ?? "today"}`);

  const article  = buildArticle(fm, sections);
  const existing = await getExistingPosts();

  console.log(`\n  Sanity: ${existing.length} existing posts checked for duplicates…`);

  const outcome = await publishArticle(article, existing);

  if (outcome.status === "skipped") {
    console.log(`\n⚠ Skipped — ${outcome.reason}`);
    process.exit(0);
  }

  console.log(`  ✓ Created Sanity document: ${outcome.id}`);

  console.log("\n  Fetching featured image from Unsplash…");
  const imgOutcome = await generateAndAttachFeaturedImage(outcome.id, article.brief.title);

  if (imgOutcome.status === "created") {
    console.log(`  ✓ Featured image attached (photo by ${imgOutcome.photographer})`);
  } else {
    const detail = imgOutcome.status !== "created" && "detail" in imgOutcome ? imgOutcome.detail : undefined;
    console.log(`  ⚠ Image skipped: ${imgOutcome.status}${detail ? ` — ${detail}` : ""}`);
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://agedleadsales.com";
  const pageUrl = `${siteUrl}/blog/${outcome.slug}`;
  try {
    await notifyIndexNow(pageUrl);
    console.log(`  ✓ IndexNow pinged: ${pageUrl}`);
  } catch (e) {
    console.log(`  ⚠ IndexNow ping failed: ${e instanceof Error ? e.message : e}`);
  }

  console.log(`\n✓ Done — live at: ${pageUrl}`);
  console.log(
    "  Post is in Sanity with the scheduled publishedAt date.\n" +
    "  Merge the PR to trigger a Vercel rebuild.\n"
  );
}

main().catch((err) => {
  console.error("publish-seo-draft failed:", err);
  process.exit(1);
});
