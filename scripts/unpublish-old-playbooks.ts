/**
 * Unpublishes the 4 legacy Sanity playbook docs in favor of the flagship
 * "Aged Lead Operator's System" magnet (routes at /playbook).
 *
 * Approach: for each published playbook, create a draft copy (if one doesn't
 * already exist), then delete the published document. This makes the
 * unpublish reversible — to restore, just publish the draft in Studio.
 *
 * Usage:
 *   DRY_RUN=1 pnpm tsx scripts/unpublish-old-playbooks.ts    # preview only
 *   pnpm tsx scripts/unpublish-old-playbooks.ts              # actually unpublish
 *
 * Requires SANITY_API_TOKEN + NEXT_PUBLIC_SANITY_PROJECT_ID + NEXT_PUBLIC_SANITY_DATASET
 * in .env.local (already present).
 */

import { createClient } from "@sanity/client";
import { readFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));

function loadEnv() {
  const envPath = join(__dirname, "..", ".env.local");
  const contents = readFileSync(envPath, "utf-8");
  for (const line of contents.split("\n")) {
    const m = line.match(/^([A-Z_][A-Z0-9_]*)=(.*)$/);
    if (!m) continue;
    const [, key, rawVal] = m;
    if (process.env[key]) continue;
    let val = rawVal.trim();
    if (
      (val.startsWith('"') && val.endsWith('"')) ||
      (val.startsWith("'") && val.endsWith("'"))
    ) {
      val = val.slice(1, -1);
    }
    process.env[key] = val;
  }
}

loadEnv();

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";
const token = process.env.SANITY_API_TOKEN;
const DRY_RUN = process.env.DRY_RUN === "1";

if (!projectId || !token) {
  console.error(
    "Missing NEXT_PUBLIC_SANITY_PROJECT_ID or SANITY_API_TOKEN in .env.local"
  );
  process.exit(1);
}

const client = createClient({
  projectId,
  dataset,
  token,
  apiVersion: "2024-01-01",
  useCdn: false,
});

interface PlaybookDoc {
  _id: string;
  _rev: string;
  title: string;
  slug: { current: string };
}

async function main() {
  console.log(`\nSanity dataset: ${dataset}`);
  console.log(`Mode: ${DRY_RUN ? "DRY RUN (no changes)" : "LIVE"}\n`);

  const published = await client.fetch<PlaybookDoc[]>(
    `*[_type == "playbook" && !(_id in path("drafts.**"))] | order(title asc){
      _id, _rev, title, slug
    }`
  );

  if (published.length === 0) {
    console.log("No published playbook docs found. Nothing to do.");
    return;
  }

  console.log(`Found ${published.length} published playbook doc(s):`);
  for (const doc of published) {
    console.log(`  - ${doc.title}  [${doc._id}]  slug: ${doc.slug?.current ?? "(no slug)"}`);
  }
  console.log("");

  if (DRY_RUN) {
    console.log("DRY RUN — would create drafts for the above and delete published versions.");
    console.log("Rerun without DRY_RUN=1 to execute.\n");
    return;
  }

  let unpublished = 0;
  for (const doc of published) {
    try {
      // Check for existing draft
      const draftId = `drafts.${doc._id}`;
      const existingDraft = await client.getDocument(draftId);

      if (!existingDraft) {
        // Fetch full document then create as draft
        const full = await client.getDocument(doc._id);
        if (!full) {
          console.log(`  ! ${doc.title} — could not fetch full doc, skipping`);
          continue;
        }
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { _id: _ignored, _rev: _ignoredRev, ...rest } = full;
        await client.create({ ...rest, _id: draftId });
        console.log(`  + draft created for "${doc.title}"`);
      } else {
        console.log(`  = draft already exists for "${doc.title}"`);
      }

      await client.delete(doc._id);
      console.log(`  × deleted published "${doc.title}"`);
      unpublished += 1;
    } catch (err) {
      console.error(
        `  ! ${doc.title} — error: ${err instanceof Error ? err.message : "unknown"}`
      );
    }
  }

  console.log(`\nUnpublished ${unpublished}/${published.length} playbook doc(s).`);
  console.log("To restore any: open Sanity Studio, find the draft, and Publish.\n");
}

main().catch((err) => {
  console.error("Fatal:", err);
  process.exit(1);
});
