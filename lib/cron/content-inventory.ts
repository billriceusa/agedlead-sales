// Content inventory for the performance analyst.
//
// The daily-performance AI was historically fed GA4/GSC numbers ONLY. With no
// list of pages that already exist, a query sitting on page 2 with low clicks
// looks indistinguishable from a query with no page at all — so the analyst
// kept recommending "create a new page" for content that was already live
// (the "aged lead store reviews" rec repeated 10+ times against an existing
// review page). This module gives the analyst the site's published URL set so
// it can recommend OPTIMIZING the right existing page instead.
//
// Source of truth is the live sitemap: it auto-includes new Sanity posts, so
// the inventory stays correct with zero maintenance. Failure is non-fatal —
// an empty inventory just means the analyst loses the guard for that run,
// matching the rest of the cron's graceful-degradation style.

import { SITE_URL } from "@/lib/site-url";

const SITE_BASE_URL =
  process.env.SITE_BASE_URL?.replace(/\/$/, "") || SITE_URL;

const MAX_URLS = 400;

/**
 * Fetch the published URL paths from the live sitemap. Returns sorted,
 * de-duplicated pathnames (e.g. "/blog/aged-lead-store-review-2026"). Returns
 * an empty array on any failure — callers must treat empty as "inventory
 * unavailable", never as "site has no pages".
 */
export async function fetchContentInventory(): Promise<string[]> {
  try {
    const res = await fetch(`${SITE_BASE_URL}/sitemap.xml`, {
      headers: { "User-Agent": "agedleadsales-perf-cron" },
    });
    if (!res.ok) return [];

    const xml = await res.text();
    const paths = new Set<string>();

    for (const match of xml.matchAll(/<loc>([^<]+)<\/loc>/g)) {
      const raw = match[1]?.trim();
      if (!raw) continue;
      try {
        paths.add(new URL(raw).pathname || "/");
      } catch {
        // Skip malformed <loc> entries rather than fail the whole pull.
      }
    }

    return Array.from(paths).sort().slice(0, MAX_URLS);
  } catch {
    return [];
  }
}

/**
 * Render the inventory as a prompt block. When the inventory is unavailable we
 * say so explicitly so the analyst knows the optimize-don't-create guard is
 * inactive for this run (rather than silently assuming the site is empty).
 */
export function renderContentInventory(paths: string[]): string {
  if (paths.length === 0) {
    return `### Existing Published Pages
Inventory unavailable for this run (sitemap fetch failed). Do not assume a
page is missing — if a query looks like it lacks a page, recommend VERIFYING
the page exists before recommending creation.
`;
  }

  return `### Existing Published Pages (${paths.length})
These pages ALREADY EXIST on the site. Do NOT recommend creating any page
whose topic an existing URL already covers — recommend optimizing or
consolidating the specific existing URL instead.

${paths.map((p) => `- ${p}`).join("\n")}
`;
}
