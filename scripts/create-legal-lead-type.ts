/**
 * Creates the `legal-leads` umbrella leadType and tags the posts that belong to
 * it.
 *
 * WHY THIS EXISTS
 * ---------------
 * The site already had a `legal` vertical (/price-index/legal,
 * /providers/best/legal) and two dedicated sub-vertical guides (mva-leads,
 * ssdi-leads) — but no lead type for the rest of the category. So the
 * bankruptcy, family law and workers' comp posts carried no `leadTypes`
 * reference at all, which means their affiliate CTA fell back to the generic
 * /all-lead-types/ catalogue instead of the partner's legal buy page.
 *
 * Field set deliberately matches the existing 12 docs: thin by design, because
 * app/(site)/lead-types/[slug] enriches from data/lead-types.ts plus vertical,
 * provider and benchmark data. No body content here.
 *
 * averageCostPerLead is intentionally NOT set, matching create-lead-types.mjs —
 * benchmarks on this site are human-verified quarterly and never auto-generated.
 *
 * WHAT IS *NOT* TAGGED, AND WHY
 * -----------------------------
 * The two debt posts (how-to-work-debt-leads,
 * aged-debt-settlement-leads-scripts-strategies) are deliberately left
 * untagged. Their audience is debt-relief companies, credit counselling and
 * settlement firms — not attorneys — and the partner has no debt buy page
 * (verified against their full link catalogue 2026-08-12). Tagging them
 * `legal-leads` would point a debt-relief buyer at an attorney-intake page,
 * which is a silent conversion leak of exactly the kind lib/affiliate.ts warns
 * about. Untagged, they fall back to /all-lead-types/ where the buyer can
 * filter — which is the better destination, not a gap. Revisit only if the
 * partner adds a debt category.
 *
 * Idempotent: createIfNotExists for the doc, and the tag patch skips posts that
 * already carry the reference.
 *
 * Run: npx tsx scripts/create-legal-lead-type.ts [--dry-run]
 */

import { config as loadEnv } from "dotenv";
loadEnv({ path: ".env.local" });
loadEnv();

import { createClient } from "@sanity/client";

const dryRun = process.argv.includes("--dry-run");

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || "production",
  apiVersion: "2026-03-14",
  token: process.env.SANITY_API_TOKEN,
  useCdn: false,
});

const LEAD_TYPE_ID = "lt-legal";
const LEAD_TYPE_SLUG = "legal-leads";

const doc = {
  _id: LEAD_TYPE_ID,
  _type: "leadType" as const,
  title: "Legal Leads",
  slug: { _type: "slug" as const, current: LEAD_TYPE_SLUG },
  shortDescription:
    "Bankruptcy, family law, workers' comp, injury, and disability prospects who asked for legal help.",
  icon: "🏛️",
  affiliateUrl: "https://agedleadstore.com",
  industries: [
    "Bankruptcy",
    "Family Law",
    "Workers' Compensation",
    "Personal Injury",
    "Disability",
  ],
  order: 13,
};

/** Attorney-intake posts that had no lead type before this. */
const POSTS_TO_TAG = [
  "how-to-work-bankruptcy-leads",
  "how-to-work-family-law-leads",
  "how-to-work-workers-comp-leads",
];

async function main() {
  console.log(dryRun ? "DRY RUN — no writes\n" : "LIVE — writing to Sanity\n");

  // ── 1. the leadType document ───────────────────────────────────────────
  const existing = await client.fetch<{ _id: string } | null>(
    `*[_type == "leadType" && slug.current == $slug][0]{ _id }`,
    { slug: LEAD_TYPE_SLUG }
  );

  if (existing) {
    console.log(`[ok ] leadType already exists: ${LEAD_TYPE_SLUG} (${existing._id})`);
  } else if (dryRun) {
    console.log(`[dry] would create leadType: ${LEAD_TYPE_SLUG} (${LEAD_TYPE_ID}) order ${doc.order}`);
  } else {
    await client.createIfNotExists(doc);
    console.log(`[new] created leadType: ${LEAD_TYPE_SLUG} (${LEAD_TYPE_ID})`);
  }

  const leadTypeId = existing?._id || LEAD_TYPE_ID;

  // ── 2. tag the posts ───────────────────────────────────────────────────
  for (const postSlug of POSTS_TO_TAG) {
    const post = await client.fetch<{ _id: string; leadTypes?: { _ref: string }[] } | null>(
      `*[_type == "post" && !(_id in path("drafts.**")) && slug.current == $slug][0]{ _id, leadTypes }`,
      { slug: postSlug }
    );

    if (!post) {
      console.warn(`[skip] post not found: ${postSlug}`);
      continue;
    }

    const alreadyTagged = (post.leadTypes || []).some((r) => r._ref === leadTypeId);
    if (alreadyTagged) {
      console.log(`[ok ] already tagged: ${postSlug} → ${LEAD_TYPE_SLUG}`);
      continue;
    }

    if (dryRun) {
      console.log(`[dry] would tag: ${postSlug} → ${LEAD_TYPE_SLUG}`);
      continue;
    }

    await client
      .patch(post._id)
      .setIfMissing({ leadTypes: [] })
      .append("leadTypes", [
        { _type: "reference", _ref: leadTypeId, _key: LEAD_TYPE_SLUG },
      ])
      .commit();

    console.log(`[tag] ${postSlug} → ${LEAD_TYPE_SLUG}`);
  }

  console.log("\ndone");
}

main().catch((err) => {
  console.error("Failed:", err);
  process.exit(1);
});
