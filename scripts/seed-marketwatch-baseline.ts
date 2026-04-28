/**
 * One-shot seed: migrate the static marketwatch baseline (verticals,
 * providers, price benchmarks) from data/*.ts into Sanity so the monthly
 * marketwatch cron has something to operate on.
 *
 * Idempotent — uses deterministic _ids and createOrReplace, so re-running
 * upserts the same docs.
 *
 * Run: npx tsx scripts/seed-marketwatch-baseline.ts
 *
 * Required env (loaded from .env.local):
 *   NEXT_PUBLIC_SANITY_PROJECT_ID
 *   NEXT_PUBLIC_SANITY_DATASET (defaults to "production")
 *   SANITY_API_TOKEN (write permission)
 */

import { config as loadEnv } from "dotenv";
loadEnv({ path: ".env.local" });
loadEnv(); // also load .env if present (no override)
import { createClient } from "@sanity/client";
import { VERTICALS } from "../data/verticals";
import { PROVIDERS } from "../data/providers";
import { PRICE_BENCHMARKS } from "../data/price-benchmarks";

const TODAY = new Date().toISOString().slice(0, 10); // 2026-04-28
const CURRENT_MONTH = TODAY.slice(0, 7); // 2026-04

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";
const token = process.env.SANITY_API_TOKEN;

if (!projectId || !token) {
  console.error("Missing NEXT_PUBLIC_SANITY_PROJECT_ID or SANITY_API_TOKEN");
  process.exit(1);
}

const client = createClient({
  projectId,
  dataset,
  apiVersion: "2026-03-14",
  token,
  useCdn: false,
});

const verticalIdFor = (slug: string) => `vertical-${slug}`;
const providerIdFor = (slug: string) => `provider-${slug}`;
const benchmarkIdFor = (b: {
  vertical: string;
  leadAgeBracket: string;
  exclusivity: string;
  leadType: string;
  month: string;
}) =>
  `benchmark-${b.vertical}-${b.leadAgeBracket}-${b.exclusivity}-${b.leadType}-${b.month}`;

async function seedVerticals() {
  console.log(`\n[verticals] seeding ${VERTICALS.length}…`);
  const tx = client.transaction();
  for (const v of VERTICALS) {
    tx.createOrReplace({
      _id: verticalIdFor(v.slug),
      _type: "vertical",
      name: v.name,
      slug: { _type: "slug", current: v.slug },
      icon: v.icon,
      description: v.description,
      tier: v.tier,
      order: v.order,
    });
  }
  await tx.commit();
  console.log(`[verticals] ✓ ${VERTICALS.length} created/updated`);
}

async function seedProviders() {
  console.log(`\n[providers] seeding ${PROVIDERS.length}…`);
  const tx = client.transaction();
  for (const p of PROVIDERS) {
    tx.createOrReplace({
      _id: providerIdFor(p.slug),
      _type: "leadProvider",
      name: p.name,
      slug: { _type: "slug", current: p.slug },
      shortDescription: p.shortDescription,
      website: p.website,
      foundedYear: p.foundedYear,
      bbbRating: p.bbbRating,
      headquartersState: p.headquartersState,
      bestFor: p.bestFor,
      notIdealFor: p.notIdealFor,
      ratingTransparency: p.ratingTransparency,
      ratingValue: p.ratingValue,
      ratingCompliance: p.ratingCompliance,
      ratingFlexibility: p.ratingFlexibility,
      ratingPlatform: p.ratingPlatform,
      ratingReputation: p.ratingReputation,
      ratingNotes: p.ratingNotes,
      lastVerified: TODAY,
      verticals: p.verticals.map((vSlug) => ({
        _type: "reference",
        _ref: verticalIdFor(vSlug),
        _key: vSlug,
      })),
      leadTypes: p.leadTypes,
      pricingModel: p.pricingModel,
      hasMinimums: p.hasMinimums,
      minimumDescription: p.minimumDescription,
      contractRequired: p.contractRequired,
      returnPolicy: p.returnPolicy,
      deliveryMethods: p.deliveryMethods,
      complianceFeatures: p.complianceFeatures,
      isFeatured: p.isFeatured,
    });
  }
  await tx.commit();
  console.log(`[providers] ✓ ${PROVIDERS.length} created/updated (lastVerified=${TODAY})`);
}

async function seedBenchmarks() {
  // Seed both March (history) and current-month (April) entries so the
  // price-index page reports the latest month and we have month-over-month
  // history for the cron to compare against.
  const marchEntries = PRICE_BENCHMARKS;
  const currentEntries = PRICE_BENCHMARKS.map((b) => ({
    ...b,
    month: CURRENT_MONTH,
  }));
  const all = [...marchEntries, ...currentEntries];

  console.log(
    `\n[benchmarks] seeding ${all.length} (${marchEntries.length} historical + ${currentEntries.length} for ${CURRENT_MONTH})…`
  );

  // Sanity transactions cap at 500 ops; chunk to be safe.
  const CHUNK = 100;
  for (let i = 0; i < all.length; i += CHUNK) {
    const slice = all.slice(i, i + CHUNK);
    const tx = client.transaction();
    for (const b of slice) {
      tx.createOrReplace({
        _id: benchmarkIdFor(b),
        _type: "priceBenchmark",
        vertical: { _type: "reference", _ref: verticalIdFor(b.vertical) },
        leadAgeBracket: b.leadAgeBracket,
        exclusivity: b.exclusivity,
        leadType: b.leadType,
        month: b.month,
        priceLow: b.priceLow,
        priceMedian: b.priceMedian,
        priceHigh: b.priceHigh,
        providersSampled: b.providersSampled,
        confidence: b.confidence,
        notes: b.notes,
      });
    }
    await tx.commit();
  }
  console.log(`[benchmarks] ✓ ${all.length} created/updated`);
}

async function main() {
  console.log(`Sanity baseline seed → project=${projectId} dataset=${dataset}`);
  await seedVerticals();
  await seedProviders();
  await seedBenchmarks();

  // Sanity check
  const counts = await client.fetch<{
    verticals: number;
    providers: number;
    benchmarks: number;
  }>(
    `{
      "verticals": count(*[_type == "vertical"]),
      "providers": count(*[_type == "leadProvider"]),
      "benchmarks": count(*[_type == "priceBenchmark"])
    }`
  );
  console.log(`\n✅ Done. Sanity now has:`, counts);
}

main().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
