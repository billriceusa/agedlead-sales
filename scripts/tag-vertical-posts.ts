/**
 * One-shot: tag the two insurance-vertical posts that were missing leadType
 * references. Idempotent — patches add the reference only if not already
 * present (Sanity setIfMissing for the array, then append).
 *
 * Run: npx tsx scripts/tag-vertical-posts.ts
 */

import { config as loadEnv } from "dotenv";
loadEnv({ path: ".env.local" });
loadEnv();

import { createClient } from "@sanity/client";

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || "production",
  apiVersion: "2026-03-14",
  token: process.env.SANITY_API_TOKEN,
  useCdn: false,
});

const tagging: { postSlug: string; leadTypeSlug: string }[] = [
  {
    postSlug: "aged-lead-nurture-sequences-insurance-agents",
    leadTypeSlug: "insurance-leads",
  },
  {
    postSlug: "auto-insurance-aged-leads-cross-sell-strategy-double-revenue",
    leadTypeSlug: "insurance-leads",
  },
];

async function main() {
  for (const { postSlug, leadTypeSlug } of tagging) {
    const post = await client.fetch<{ _id: string; leadTypes?: { _ref: string }[] } | null>(
      `*[_type == "post" && slug.current == $slug][0]{ _id, leadTypes }`,
      { slug: postSlug }
    );
    const leadType = await client.fetch<{ _id: string } | null>(
      `*[_type == "leadType" && slug.current == $slug][0]{ _id }`,
      { slug: leadTypeSlug }
    );

    if (!post) {
      console.warn(`[skip] post not found: ${postSlug}`);
      continue;
    }
    if (!leadType) {
      console.warn(`[skip] leadType not found: ${leadTypeSlug}`);
      continue;
    }

    const alreadyTagged = (post.leadTypes || []).some(
      (ref) => ref._ref === leadType._id
    );
    if (alreadyTagged) {
      console.log(`[ok ] already tagged: ${postSlug} → ${leadTypeSlug}`);
      continue;
    }

    await client
      .patch(post._id)
      .setIfMissing({ leadTypes: [] })
      .append("leadTypes", [
        { _type: "reference", _ref: leadType._id, _key: leadTypeSlug },
      ])
      .commit();

    console.log(`[tag] ${postSlug} → ${leadTypeSlug}`);
  }
  console.log("✅ done");
}

main().catch((err) => {
  console.error("Failed:", err);
  process.exit(1);
});
