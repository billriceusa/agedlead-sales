/**
 * Seed the consent + deliverability glossary terms into Sanity.
 *
 * WHY THIS SCRIPT EXISTS — TWO SOURCES, ONE SET OF TERMS
 *
 * The glossary lives in two places and they serve different jobs:
 *
 *   data/glossary-terms.ts   powers /glossary and /glossary/[slug]
 *   Sanity `glossaryTerm`    powers the AUTO-LINKER via glossaryTooltipQuery
 *                            (lib/glossary-linker.ts, components/glossary-static.tsx)
 *
 * A term added to only the first one gets a page nobody is ever linked to. A term added
 * to only the second one auto-links to a 404. Both have to happen, which is exactly the
 * kind of two-step a person forgets — so this script reads the TypeScript file as the
 * source of truth and pushes anything missing into Sanity, rather than restating the
 * definitions and letting the two drift.
 *
 * Idempotent: uses a deterministic `glossary-{slug}` document id and `createIfNotExists`,
 * so re-running touches nothing that already exists. Pass --force to overwrite the term,
 * definition and category on documents that are already there.
 *
 * DRY RUN BY DEFAULT. `--apply` to write.
 *
 *   npx tsx scripts/seed-consent-glossary.ts
 *   npx tsx scripts/seed-consent-glossary.ts --apply
 */
import { config } from "dotenv";
config({ path: ".env.local", quiet: true } as never);

import { createClient } from "@sanity/client";
import { GLOSSARY_TERMS } from "../data/glossary-terms";

const APPLY = process.argv.includes("--apply");
const FORCE = process.argv.includes("--force");

/** The terms this script is responsible for. Everything else predates it. */
const CONSENT_SLUGS = [
  "prior-express-written-consent",
  "inherited-consent",
  "fresh-consent",
  "reassigned-number-database",
  "safe-harbor",
  "calling-window",
  "suppression-list",
  "permission-pass",
  // Added 2026-09-10 from a live buyer conversation: a captive P&C agent stopped buying
  // aged leads because a 100-record batch scrubbed to 67 and, unlike fresh inventory,
  // carried no credit-back. The site had no name for either half of that.
  "lead-spoilage",
  "net-usable-rate",
];

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "p7rbtajg",
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || "production",
  apiVersion: "2026-03-14",
  token: process.env.SANITY_API_TOKEN,
  useCdn: false,
});

async function main() {
  console.log(APPLY ? "=== APPLY ===" : "=== DRY RUN (--apply to write) ===");
  if (APPLY && !process.env.SANITY_API_TOKEN) {
    throw new Error("SANITY_API_TOKEN missing — cannot write.");
  }

  const wanted = GLOSSARY_TERMS.filter((t) => CONSENT_SLUGS.includes(t.slug));
  const missingFromData = CONSENT_SLUGS.filter(
    (s) => !GLOSSARY_TERMS.some((t) => t.slug === s),
  );
  if (missingFromData.length > 0) {
    throw new Error(
      `These slugs are not in data/glossary-terms.ts, so there is nothing to seed: ${missingFromData.join(", ")}`,
    );
  }

  const existing: { _id: string; slug?: string }[] = await client.fetch(
    `*[_type == "glossaryTerm" && slug.current in $slugs]{ _id, "slug": slug.current }`,
    { slugs: CONSENT_SLUGS },
  );
  const have = new Set(existing.map((e) => e.slug));

  console.log(`\nterms in data file: ${wanted.length}`);
  console.log(`already in Sanity:  ${have.size}`);
  for (const t of wanted) {
    console.log(`  ${have.has(t.slug) ? "exists " : "CREATE "} ${t.slug}  —  ${t.term}`);
  }

  if (!APPLY) {
    console.log("\nnothing written.");
    return;
  }

  let created = 0;
  let updated = 0;
  for (const t of wanted) {
    const _id = `glossary-${t.slug}`;
    const doc = {
      _id,
      _type: "glossaryTerm" as const,
      term: t.term,
      slug: { _type: "slug" as const, current: t.slug },
      definition: t.definition,
      category: t.category,
    };
    if (have.has(t.slug)) {
      if (!FORCE) continue;
      await client
        .patch(_id)
        .set({ term: t.term, definition: t.definition, category: t.category })
        .commit();
      updated++;
    } else {
      await client.createIfNotExists(doc);
      created++;
    }
    // Well inside Sanity's write limits; this is a handful of documents.
    await new Promise((r) => setTimeout(r, 150));
  }

  console.log(`\ncreated ${created}, updated ${updated}`);

  const after: { slug?: string }[] = await client.fetch(
    `*[_type == "glossaryTerm" && slug.current in $slugs]{ "slug": slug.current }`,
    { slugs: CONSENT_SLUGS },
  );
  console.log(`now in Sanity: ${after.length} of ${CONSENT_SLUGS.length}`);
  const stillMissing = CONSENT_SLUGS.filter((s) => !after.some((a) => a.slug === s));
  if (stillMissing.length > 0) console.log("STILL MISSING:", stillMissing.join(", "));
}

main()
  .then(() => process.exit(0))
  .catch((e) => {
    console.error("FAILED:", e instanceof Error ? e.message : e);
    process.exit(1);
  });
