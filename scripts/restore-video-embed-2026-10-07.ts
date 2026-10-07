/**
 * Put the video back, as a real embed this time.
 *
 * WHY (2026-10-07)
 *
 * /blog/how-to-work-aged-leads-the-complete-system-for-maximum-roi had a raw
 * <iframe> pasted into its body as plain text. Portable Text has no notion of
 * raw HTML, so it printed as escaped markup on the site's highest-traffic blog
 * post and pushed the page 31px sideways on a phone. The paste was removed
 * earlier today; this restores what the author actually wanted, using the
 * `videoEmbed` type added in the same change.
 *
 * The title on the original embed was "How to Work Aged Leads", matching the
 * article, so this is restoring intended content rather than adding new
 * content.
 *
 * It goes back at the same position — after the multi-channel paragraph the
 * original sat beneath — rather than at the end, because that is where the
 * author put it.
 *
 * DRY RUN BY DEFAULT.
 *
 *   npx tsx --env-file=.env.local scripts/restore-video-embed-2026-10-07.ts
 *   npx tsx --env-file=.env.local scripts/restore-video-embed-2026-10-07.ts --apply
 */

import { createClient } from "@sanity/client";
import { extractYouTubeId } from "../sanity/schemaTypes/objects/videoEmbed";

const APPLY = process.argv.includes("--apply");
const SLUG = "how-to-work-aged-leads-the-complete-system-for-maximum-roi";
const VIDEO_URL = "https://www.youtube.com/watch?v=4m9p9hdcaC8";
const VIDEO_TITLE = "How to Work Aged Leads";
/** The paragraph the original embed sat directly beneath. */
const ANCHOR = "The Multi-Channel Principle";
/**
 * The orphaned caption, which is the one genuinely READER-VISIBLE defect here.
 *
 * It sits immediately after where the video was and reads, with literal
 * asterisks that never converted to italics:
 *
 *   *Watch this complete walkthrough of the aged lead conversion system in action.*
 *
 * So the page currently tells people to watch a video that is not on it. The
 * paragraph becomes the embed's caption — which is what it always was — and the
 * stray asterisks go with it.
 */
const ORPHAN_CAPTION = "Watch this complete walkthrough";

interface Span { _type: string; text?: string }
interface Block { _key: string; _type: string; children?: Span[] }

function key(): string {
  return Math.random().toString(36).slice(2, 14);
}

async function main() {
  console.log(APPLY ? "=== APPLY ===" : "=== DRY RUN (--apply to write) ===");

  const id = extractYouTubeId(VIDEO_URL);
  if (!id) throw new Error(`Could not extract a video id from ${VIDEO_URL}`);
  console.log(`video id   ${id}`);

  const token = (process.env.SANITY_API_TOKEN || "").trim();
  if (!token) throw new Error("Missing SANITY_API_TOKEN");

  const client = createClient({
    projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "p7rbtajg",
    dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || "production",
    apiVersion: "2026-03-14",
    token,
    useCdn: false,
  });

  const doc = await client.fetch<{ _id: string; body: Block[] } | null>(
    `*[_type == "post" && slug.current == $s][0]{ _id, body }`,
    { s: SLUG },
  );
  if (!doc) throw new Error(`No post with slug ${SLUG}`);

  if (doc.body.some((b) => b._type === "videoEmbed")) {
    console.log("\nalready has a videoEmbed — nothing to do.");
    return;
  }
  // Belt and braces: the raw paste must be gone before we re-add the real one,
  // or the page would carry both.
  const stillRaw = doc.body.some((b) =>
    /<\s*iframe/i.test((b.children ?? []).map((c) => c.text ?? "").join("")),
  );
  if (stillRaw) throw new Error("Raw iframe markup is still in the body — remove it first.");

  const anchorIdx = doc.body.findIndex((b) =>
    (b.children ?? []).map((c) => c.text ?? "").join("").includes(ANCHOR),
  );
  if (anchorIdx === -1) throw new Error(`Could not find the anchor paragraph ("${ANCHOR}").`);

  const insertAfterKey = doc.body[anchorIdx]._key;

  // Find the orphaned caption paragraph and fold it into the embed.
  const orphan = doc.body.find((b) =>
    (b.children ?? []).map((c) => c.text ?? "").join("").includes(ORPHAN_CAPTION),
  );
  const orphanText = orphan
    ? (orphan.children ?? [])
        .map((c) => c.text ?? "")
        .join("")
        .replace(/^\s*\*+\s*/, "")
        .replace(/\s*\*+\s*$/, "")
        .trim()
    : undefined;

  console.log(`anchor     block ${anchorIdx} (_key=${insertAfterKey})`);
  console.log(`insert     videoEmbed immediately after it`);
  console.log(
    orphan
      ? `caption    reusing the orphaned paragraph (_key=${orphan._key}): ${JSON.stringify(orphanText)}\n           and removing it, so the line is not printed twice`
      : `caption    none — orphaned paragraph not found`,
  );
  console.log(`body       ${doc.body.length} -> ${doc.body.length + (orphan ? 0 : 1)} blocks`);

  if (!APPLY) {
    console.log("\nnothing written.");
    return;
  }

  let patch = client
    .patch(doc._id)
    .insert("after", `body[_key=="${insertAfterKey}"]`, [
      {
        _type: "videoEmbed",
        _key: key(),
        url: VIDEO_URL,
        title: VIDEO_TITLE,
        ...(orphanText ? { caption: orphanText } : {}),
      },
    ]);
  if (orphan) patch = patch.unset([`body[_key=="${orphan._key}"]`]);
  await patch.commit();

  const after = await client.fetch<{ body: Block[] }>(
    `*[_type == "post" && slug.current == $s][0]{ body }`,
    { s: SLUG },
  );
  const embeds = after.body.filter((b) => b._type === "videoEmbed");
  console.log(`\npatched — ${after.body.length} blocks, ${embeds.length} videoEmbed`);
  if (embeds.length !== 1) throw new Error(`Expected exactly 1 videoEmbed, found ${embeds.length}`);
  console.log("verified.");
}

main()
  .then(() => process.exit(0))
  .catch((e) => {
    console.error("FAILED:", e instanceof Error ? e.message : e);
    process.exit(1);
  });
