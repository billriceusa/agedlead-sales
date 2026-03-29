import { createClient } from "next-sanity";
import type { BenchmarkEstimate } from "./marketwatch-ai";

function getSanityWriteClient() {
  const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
  const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";
  const token = process.env.SANITY_API_TOKEN;

  if (!projectId || !token) {
    throw new Error(
      "Missing NEXT_PUBLIC_SANITY_PROJECT_ID or SANITY_API_TOKEN"
    );
  }

  return createClient({
    projectId,
    dataset,
    apiVersion: "2026-03-14",
    token,
    useCdn: false,
  });
}

/**
 * Get all provider slugs and their lastVerified dates from Sanity.
 */
export async function getProviderProfiles(): Promise<
  {
    slug: string;
    name: string;
    website: string;
    lastVerified: string;
    pricingModel: string;
    leadTypes: string[];
    verticals: string[];
    returnPolicy: string;
  }[]
> {
  const client = getSanityWriteClient();
  return client.fetch(
    `*[_type == "leadProvider"] {
      "slug": slug.current,
      name,
      website,
      lastVerified,
      pricingModel,
      leadTypes,
      "verticals": verticals[]->slug.current,
      returnPolicy
    }`
  );
}

/**
 * Upsert price benchmark documents into Sanity.
 * Creates new documents for the current month.
 */
export async function upsertPriceBenchmarks(
  benchmarks: BenchmarkEstimate[],
  month: string
): Promise<number> {
  if (benchmarks.length === 0) return 0;

  const client = getSanityWriteClient();
  let created = 0;

  // First, get vertical IDs by slug
  const verticals: { _id: string; slug: string }[] = await client.fetch(
    `*[_type == "vertical"] { _id, "slug": slug.current }`
  );

  const verticalMap = new Map(verticals.map((v) => [v.slug, v._id]));

  for (const benchmark of benchmarks) {
    const verticalId = verticalMap.get(benchmark.vertical);
    if (!verticalId) {
      console.warn(
        `Skipping benchmark: no vertical found for slug "${benchmark.vertical}"`
      );
      continue;
    }

    // Create a deterministic ID for upsert
    const docId = `benchmark-${benchmark.vertical}-${benchmark.leadAgeBracket}-${benchmark.exclusivity}-${benchmark.leadType}-${month}`;

    try {
      await client.createOrReplace({
        _id: docId,
        _type: "priceBenchmark",
        vertical: { _type: "reference", _ref: verticalId },
        leadAgeBracket: benchmark.leadAgeBracket,
        exclusivity: benchmark.exclusivity,
        leadType: benchmark.leadType,
        month,
        priceLow: benchmark.priceLow,
        priceMedian: benchmark.priceMedian,
        priceHigh: benchmark.priceHigh,
        providersSampled: benchmark.providersSampled,
        confidence: benchmark.confidence,
        notes: benchmark.notes,
      });
      created++;
    } catch (err) {
      console.error(`Failed to upsert benchmark ${docId}:`, err);
    }
  }

  return created;
}

/**
 * Find providers whose lastVerified date is older than the given threshold.
 */
export async function findStaleProviders(
  daysThreshold: number = 30
): Promise<string[]> {
  const client = getSanityWriteClient();
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - daysThreshold);
  const cutoff = cutoffDate.toISOString().split("T")[0];

  const stale: { name: string; lastVerified: string }[] = await client.fetch(
    `*[_type == "leadProvider" && lastVerified < $cutoff] {
      name,
      lastVerified
    }`,
    { cutoff }
  );

  return stale.map(
    (p) => `${p.name} (last verified: ${p.lastVerified})`
  );
}

/**
 * Update a provider's lastVerified date.
 */
export async function updateProviderVerifiedDate(
  slug: string
): Promise<void> {
  const client = getSanityWriteClient();
  const today = new Date().toISOString().split("T")[0];

  const provider = await client.fetch(
    `*[_type == "leadProvider" && slug.current == $slug][0]._id`,
    { slug }
  );

  if (provider) {
    await client.patch(provider).set({ lastVerified: today }).commit();
  }
}

/**
 * Get existing benchmark data for comparison.
 */
export async function getExistingBenchmarks(): Promise<BenchmarkEstimate[]> {
  const client = getSanityWriteClient();

  const data: {
    vertical: string;
    leadAgeBracket: string;
    exclusivity: string;
    leadType: string;
    priceLow: number;
    priceMedian: number;
    priceHigh: number;
    providersSampled: number;
    confidence: string;
    notes: string;
  }[] = await client.fetch(
    `*[_type == "priceBenchmark"] | order(month desc) {
      "vertical": vertical->slug.current,
      leadAgeBracket,
      exclusivity,
      leadType,
      priceLow,
      priceMedian,
      priceHigh,
      providersSampled,
      confidence,
      notes
    }`
  );

  return data.map((d) => ({
    ...d,
    confidence: (d.confidence as "high" | "medium" | "low") || "medium",
  }));
}
