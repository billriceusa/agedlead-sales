import { cache } from "react";
import {
  getBenchmarksByVertical,
  isTrustworthyBenchmark,
  type PriceBenchmarkData,
} from "@/data/price-benchmarks";
import { sanityFetch } from "@/sanity/lib/fetch";
import { staticShapedBenchmarksByVerticalQuery } from "@/sanity/lib/queries";

/**
 * Single source of truth for "what reliable pricing data do we have for this
 * vertical." Prefers Sanity benchmarks (human-curated), falls back to the
 * static seed, and drops anything that fails the trust gate
 * (`providersSampled >= 2`) so single-provider estimates never count as data.
 *
 * Wrapped in React `cache()` so the price-index page and its `generateMetadata`
 * share one Sanity round-trip per vertical within a render.
 */
export const loadTrustworthyBenchmarks = cache(
  async (verticalSlug: string): Promise<PriceBenchmarkData[]> => {
    let sanityBenchmarks: PriceBenchmarkData[] | null = null;
    try {
      sanityBenchmarks = (await sanityFetch(
        staticShapedBenchmarksByVerticalQuery,
        { vertical: verticalSlug }
      )) as PriceBenchmarkData[] | null;
    } catch {
      sanityBenchmarks = null;
    }
    const staticBenchmarks = getBenchmarksByVertical(verticalSlug);
    const source =
      sanityBenchmarks && sanityBenchmarks.length > 0
        ? sanityBenchmarks
        : staticBenchmarks;
    return source.filter(isTrustworthyBenchmark);
  }
);

/**
 * True when a vertical has at least one reliable benchmark — i.e. its
 * /price-index/[vertical] page shows real data rather than the "coming soon"
 * empty state. Used to keep thin pages out of the index + sitemap.
 */
export async function hasTrustworthyBenchmarks(
  verticalSlug: string
): Promise<boolean> {
  return (await loadTrustworthyBenchmarks(verticalSlug)).length > 0;
}
