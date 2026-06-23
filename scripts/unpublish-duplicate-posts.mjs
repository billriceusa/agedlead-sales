/**
 * Unpublish the near-duplicate blog posts produced by the (now-disabled)
 * weekly-content cron. Each loser slug 308-redirects to its canonical in
 * next.config.ts; unpublishing here removes it from published queries and the
 * sitemap while preserving the content as a recoverable Sanity draft (same
 * draft-preserving pattern as scripts/unpublish-old-playbooks.ts).
 *
 * Run once:  node --env-file=.env.local scripts/unpublish-duplicate-posts.mjs
 */
import { createClient } from "@sanity/client";

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION || "2024-01-01",
  token: process.env.SANITY_API_TOKEN,
  useCdn: false,
});

// loser slugs (the cron dupes) — canonical they redirect into in comment
const LOSERS = [
  "aged-lead-budget-allocation-roi-optimization", // -> aged-lead-budget-allocation-strategy
  "aged-lead-team-training-playbook-managers", //     -> training-aged-lead-sales-team
  "summer-solar-aged-lead-activation-strategy", //    -> summer-solar-sales-aged-leads-q2-strategy
];

for (const slug of LOSERS) {
  const doc = await client.fetch(
    `*[_type=="post" && slug.current==$slug && !(_id in path("drafts.**"))][0]`,
    { slug }
  );
  if (!doc) {
    console.log(`SKIP  ${slug} — no published doc found`);
    continue;
  }
  const draftId = `drafts.${doc._id}`;
  await client.createIfNotExists({ ...doc, _id: draftId });
  await client.delete(doc._id);
  console.log(`UNPUBLISHED  ${slug}  (${doc._id} -> ${draftId})`);
}

console.log("\nDone. Redirected slugs are now drafts (recoverable) and out of the sitemap.");
