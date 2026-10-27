/**
 * Repair the provider freshness dates after splitting review from scan.
 *
 * WHY (2026-10-07)
 *
 * The marketwatch cron stamped `lastVerified` on every successful scan, so the
 * value sitting in Sanity for each provider is NOT a review date — it is the
 * date a machine last diffed that provider's pricing page. All fifteen
 * providers were displaying "Verified Sep 2026" on that basis while the real
 * human review dates, held in data/providers.ts, were 138-160 days old.
 *
 * That is why LeadsData could sit mislabelled for 33 days after a separate file
 * flagged it: the public page said it had been verified weeks ago.
 *
 * This moves each provider's machine-stamped value into `lastScanned`, where it
 * is true, and restores `lastVerified` to the static file's human date, where
 * it is also true. Nothing is invented; both numbers already existed, they were
 * just in the wrong fields.
 *
 * AFTER THIS RUNS the directory will show older review dates — several of them
 * red. That is the point. The dates were always that old; the site was
 * reporting a scan as if it were a review.
 *
 * DRY RUN BY DEFAULT.
 *
 *   npx tsx --env-file=.env.local scripts/split-verified-from-scanned-2026-10-07.ts
 *   npx tsx --env-file=.env.local scripts/split-verified-from-scanned-2026-10-07.ts --apply
 */

import { createClient } from "@sanity/client";
import { PROVIDERS } from "../data/providers";

const APPLY = process.argv.includes("--apply");

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

  const docs: { _id: string; slug: string; lastVerified?: string; lastScanned?: string }[] =
    await client.fetch(
      `*[_type == "leadProvider"]{ _id, "slug": slug.current, lastVerified, lastScanned }`,
    );
  console.log(`${docs.length} provider documents in Sanity\n`);

  const staticBySlug = new Map(PROVIDERS.map((p) => [p.slug, p]));
  let planned = 0;
  let skipped = 0;

  for (const d of docs) {
    const stat = staticBySlug.get(d.slug);
    if (!stat) {
      console.log(`SKIP ${d.slug} — no static entry to take a human date from`);
      skipped++;
      continue;
    }
    const humanDate = stat.lastVerified;
    const machineDate = d.lastVerified;

    if (!machineDate) {
      console.log(`SKIP ${d.slug} — nothing in Sanity lastVerified`);
      skipped++;
      continue;
    }
    // Already repaired, or Sanity genuinely holds the human date.
    if (machineDate === humanDate) {
      console.log(`ok   ${d.slug} — Sanity already matches the human date (${humanDate})`);
      skipped++;
      continue;
    }

    // Never move a date BACKWARDS into lastScanned if one is already there and
    // is newer — the cron may have run since.
    const scanned =
      d.lastScanned && d.lastScanned > machineDate ? d.lastScanned : machineDate;

    console.log(
      `FIX  ${d.slug}\n` +
        `       lastVerified ${machineDate} (machine-stamped) -> ${humanDate} (human, from data/providers.ts)\n` +
        `       lastScanned  ${d.lastScanned ?? "(unset)"} -> ${scanned}`,
    );
    planned++;

    if (APPLY) {
      await client.patch(d._id).set({ lastVerified: humanDate, lastScanned: scanned }).commit();
    }
  }

  console.log(`\n${planned} to fix, ${skipped} skipped`);
  if (!APPLY) console.log("nothing written.");
}

main()
  .then(() => process.exit(0))
  .catch((e) => {
    console.error("FAILED:", e instanceof Error ? e.message : e);
    process.exit(1);
  });
