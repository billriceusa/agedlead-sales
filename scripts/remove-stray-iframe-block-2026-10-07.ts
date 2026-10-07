/**
 * Remove a raw <iframe> tag that was pasted into a post body as plain text.
 *
 * WHY (2026-10-07)
 *
 * /blog/how-to-work-aged-leads-the-complete-system-for-maximum-roi is the
 * site's highest-traffic blog post (373 views/30d) and one of the four pages
 * the P4 routing work now sends readers to. Block 46 of its body is a single
 * text span containing nothing but:
 *
 *   <iframe width="560" height="315" src="https://www.youtube.com/embed/..."
 *   title="How to Work Aged Leads" ... allowfullscreen></iframe>
 *
 * Portable Text has no notion of raw HTML, so this renders as a literal wall of
 * escaped markup in the middle of the article. Readers have been seeing the tag
 * printed as text. It is also the cause of the 31px horizontal overflow
 * measured at 390px, because `src="https://..."` is one unbreakable token.
 *
 * SCOPE: this was found by scanning all 232 Sanity documents with a body. It is
 * the ONLY document with raw markup in its prose, so this is a one-off paste,
 * not a systemic import defect. The one other long-token finding — the UTM
 * example in the glossary — is legitimate content and is handled with CSS
 * (`overflow-wrap: anywhere` on .prose-wrapper), not by editing the copy.
 *
 * A VIDEO WAS INTENDED HERE. The embed's title is "How to Work Aged Leads",
 * matching the article. The Portable Text renderer supports only `image` and
 * `table` custom block types — there is no video/embed type — so restoring the
 * video means a schema addition, a Studio input and a renderer case. That is a
 * separate decision; this script removes the broken artifact rather than
 * leaving garbage on the page while that gets decided.
 *
 * SAFETY: refuses unless the target block's text is ENTIRELY iframe markup, so
 * it can never eat a paragraph that merely mentions one.
 *
 * DRY RUN BY DEFAULT.
 *
 *   npx tsx --env-file=.env.local scripts/remove-stray-iframe-block-2026-10-07.ts
 *   npx tsx --env-file=.env.local scripts/remove-stray-iframe-block-2026-10-07.ts --apply
 */

import { createClient } from "@sanity/client";

const APPLY = process.argv.includes("--apply");
const SLUG = "how-to-work-aged-leads-the-complete-system-for-maximum-roi";

interface Span {
  _type: string;
  text?: string;
}
interface Block {
  _key: string;
  _type: string;
  style?: string;
  children?: Span[];
}

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

  const doc = await client.fetch<{ _id: string; body: Block[] } | null>(
    `*[_type == "post" && slug.current == $s][0]{ _id, body }`,
    { s: SLUG },
  );
  if (!doc) throw new Error(`No post with slug ${SLUG}`);

  const offenders = doc.body.filter((b) => {
    const text = (b.children ?? []).map((c) => c.text ?? "").join("");
    if (!/<\s*iframe/i.test(text)) return false;
    // ENTIRELY markup, or we do not touch it.
    const remainder = text.replace(/<\s*iframe[\s\S]*?<\s*\/\s*iframe\s*>/gi, "").trim();
    if (remainder.length > 0) {
      throw new Error(
        `Block ${b._key} contains an iframe AND ${remainder.length} chars of real prose ` +
          `(${JSON.stringify(remainder.slice(0, 80))}). Refusing to delete a block with content in it.`,
      );
    }
    return true;
  });

  console.log(`document   ${doc._id}`);
  console.log(`body       ${doc.body.length} blocks`);
  console.log(`offenders  ${offenders.length}`);

  if (offenders.length === 0) {
    console.log("\nnothing to do — already clean.");
    return;
  }
  if (offenders.length > 1) {
    throw new Error(`Expected exactly 1 stray block, found ${offenders.length}. Stopping.`);
  }

  const target = offenders[0];
  console.log(`remove     _key=${target._key} (${doc.body.indexOf(target)} of ${doc.body.length})`);

  if (!APPLY) {
    console.log("\nnothing written.");
    return;
  }

  await client.patch(doc._id).unset([`body[_key=="${target._key}"]`]).commit();

  const after = await client.fetch<{ body: Block[] }>(
    `*[_type == "post" && slug.current == $s][0]{ body }`,
    { s: SLUG },
  );
  const stillThere = after.body.some((b) =>
    /<\s*iframe/i.test((b.children ?? []).map((c) => c.text ?? "").join("")),
  );
  console.log(`\npatched — body is now ${after.body.length} blocks`);
  if (stillThere) throw new Error("iframe markup is STILL present after the patch.");
  console.log("verified: no iframe markup remains in the body.");
}

main()
  .then(() => process.exit(0))
  .catch((e) => {
    console.error("FAILED:", e instanceof Error ? e.message : e);
    process.exit(1);
  });
