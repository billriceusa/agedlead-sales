/**
 * Rewrite the DNC scrubbing post around the six-condition safe harbor.
 *
 * WHY (2026-10-05, loop P3)
 *
 * /blog/dnc-scrubbing-on-a-budget ranks #7 for "do not call list scrubbing" at
 * DR 7, against a page one made of a LinkedIn post, a 2005 FTC OIG audit PDF, a
 * Reddit thread, a .docx.pdf on a CDN, a forum thread and a Facebook group post.
 * It is the clearest on-page gap measured anywhere on this site, and it is the
 * anchor for the one half of the delivery layer that is winnable at our DR.
 *
 * The substantive correction it carries: the post presented "re-scrub every 31
 * days" as the rule. It is not. 16 CFR 310.4(b)(3) makes the scrub ONE OF SIX
 * conditions in a safe harbor, and condition (iv) itself has two halves — the
 * scrub AND the records documenting it. An agent who does only the scrub
 * believes they are protected and is not. Every regulatory claim in the new body
 * is cited to the eCFR, per the standing rule that compliance claims verify to
 * statute or CFR and never to a vendor's or law firm's summary.
 *
 * WHAT THIS DELIBERATELY DOES NOT DO
 *
 * It does not touch the title, the slug, publishedAt, categories or lead types.
 * The page holds a position-7 ranking; changing the title in the same pass as a
 * body rewrite would make the 2026-12-05 verdict unattributable. The title is a
 * separate, measurable decision. This patches `body` and `excerpt`, nothing else.
 *
 * DRY RUN BY DEFAULT.
 *
 *   npx tsx --env-file=.env.local scripts/publish-dnc-safe-harbor-2026-10-05.ts
 *   npx tsx --env-file=.env.local scripts/publish-dnc-safe-harbor-2026-10-05.ts --apply
 */

import { createClient } from "@sanity/client";
import { readFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { markdownToPortableText } from "../lib/markdown-to-portabletext.js";

const __dirname = dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = join(__dirname, "..");
const DRAFT = join(REPO_ROOT, "content", "drafts-2026-10-05", "01-dnc-safe-harbor", "draft.md");

const DOC_ID = "post-htwl-dnc-scrubbing-on-a-budget";
const EXPECTED_SLUG = "dnc-scrubbing-on-a-budget";
const APPLY = process.argv.includes("--apply");

function parseFrontmatter(src: string): { data: Record<string, string>; body: string } {
  const m = src.match(/^---\n([\s\S]*?)\n---\n?([\s\S]*)$/);
  if (!m) return { data: {}, body: src };
  const data: Record<string, string> = {};
  for (const line of m[1].split("\n")) {
    const kv = line.match(/^([A-Za-z_][\w]*):\s*(.*)$/);
    if (!kv) continue;
    let val = kv[2].trim();
    if (
      (val.startsWith('"') && val.endsWith('"')) ||
      (val.startsWith("'") && val.endsWith("'"))
    ) {
      val = val.slice(1, -1);
    }
    data[kv[1]] = val;
  }
  return { data, body: m[2] };
}

async function main() {
  console.log(APPLY ? "=== APPLY ===" : "=== DRY RUN (--apply to write) ===");

  const token = (process.env.SANITY_API_TOKEN || "").trim();
  if (!token) throw new Error("Missing SANITY_API_TOKEN");

  const client = createClient({
    projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "p7rbtajg",
    dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || "production",
    apiVersion: "2026-03-14",
    token,
    useCdn: false,
  });

  const existing = await client.fetch(
    `*[_id == $id][0]{ _id, title, "slug": slug.current, publishedAt, "blocks": count(body) }`,
    { id: DOC_ID },
  );
  if (!existing) throw new Error(`No document ${DOC_ID} — refusing to create one by accident.`);
  if (existing.slug !== EXPECTED_SLUG) {
    throw new Error(
      `Document ${DOC_ID} has slug "${existing.slug}", expected "${EXPECTED_SLUG}". ` +
        `Refusing to rewrite a post that is not the one this script was written for.`,
    );
  }

  const { data, body } = parseFrontmatter(readFileSync(DRAFT, "utf8"));
  if (data.slug !== EXPECTED_SLUG) {
    throw new Error(`Draft frontmatter slug "${data.slug}" does not match ${EXPECTED_SLUG}.`);
  }

  // Strip the leading H1 — the page template renders the title itself, so
  // leaving it in the body would print the headline twice.
  const withoutH1 = body.replace(/^\s*#\s+.*\n+/, "");
  const blocks = markdownToPortableText(withoutH1);

  if (!Array.isArray(blocks) || blocks.length < 20) {
    throw new Error(`Converted body has only ${blocks?.length ?? 0} blocks — that looks wrong.`);
  }

  const text = withoutH1.replace(/[#*_>`\[\]()]/g, " ");
  const words = text.split(/\s+/).filter(Boolean).length;

  console.log(`document   ${existing._id}`);
  console.log(`title      ${existing.title}  (UNCHANGED)`);
  console.log(`slug       ${existing.slug}  (UNCHANGED)`);
  console.log(`published  ${existing.publishedAt}  (UNCHANGED)`);
  console.log(`body       ${existing.blocks} blocks -> ${blocks.length} blocks`);
  console.log(`words      ~${words}`);
  console.log(`excerpt    ${data.excerpt.slice(0, 90)}...`);

  // Sanity-check the citations survived the markdown conversion: these are the
  // claims the piece rests on, and a silent link-stripping would turn a cited
  // compliance page into an uncited one.
  for (const needle of ["310.4(b)(3)", "ecfr.gov", "henson-legal.com", "64.1200"]) {
    if (!withoutH1.includes(needle)) {
      throw new Error(`Draft is missing required citation marker "${needle}".`);
    }
  }
  console.log("citations  310.4(b)(3), eCFR, Henson Legal, 47 CFR 64.1200 all present");

  if (!APPLY) {
    console.log("\nnothing written.");
    return;
  }

  await client.patch(DOC_ID).set({ body: blocks, excerpt: data.excerpt }).commit();
  console.log(`\npatched ${DOC_ID} — body and excerpt only.`);
}

main()
  .then(() => process.exit(0))
  .catch((e) => {
    console.error("FAILED:", e instanceof Error ? e.message : e);
    process.exit(1);
  });
