/**
 * Normalises Portable Text imported from the howtoworkleads.com dataset.
 *
 * Why this exists: Portable Text is not as portable as it looks. The
 * howtoworkleads front-end parses markdown *inside* span text at render time,
 * so its authors left raw `**bold**`, `[text](url)` and even a leading
 * `# Title` line sitting in plain spans and the site rendered them correctly.
 * This project renders with @portabletext/react, which prints span text
 * verbatim — so the same documents publish with literal asterisks and bracket
 * syntax in the body copy.
 *
 * Verified on the 71 staged drafts (2026-07-30):
 *   - 29 raw `[text](url)` links across 11 drafts
 *   - 37 raw `**bold**` spans, all in the cornerstone article
 *   - 17 drafts opening with a literal `# <title>` block, duplicating the
 *     <h1> the blog template already renders from post.title
 *   - 6 drafts opening with a "Sanity CMS Fields" blockquote carrying the
 *     authoring brief (Slug / SEO Title / Meta Description / Excerpt /
 *     Category / Published Date). That block is publicly visible on
 *     howtoworkleads.com today; it must not follow the content across.
 *
 * Applied by scripts/migrate-htwl-content.mjs on import and by
 * scripts/repair-imported-drafts.mjs for documents already staged.
 */

const META_HEADER = /^sanity\s+cms\s+fields$/i;
const META_LINE = /^-\s*(slug|seo title|meta description|excerpt|category|published date|title|author|date|description)\s*:/i;
const LEADING_H1 = /^#\s+\S/;

const blockText = (b) =>
  (b?.children ?? []).map((c) => c?.text ?? "").join("");

/** Split a plain string on `**bold**`. */
function splitBold(s) {
  const out = [];
  const rx = /\*\*([^*\n]{1,300})\*\*/g;
  let last = 0;
  let m;
  while ((m = rx.exec(s))) {
    if (m.index > last) out.push({ text: s.slice(last, m.index) });
    out.push({ text: m[1], strong: true });
    last = rx.lastIndex;
  }
  if (last < s.length) out.push({ text: s.slice(last) });
  return out.filter((t) => t.text !== "");
}

/**
 * Split a plain string into typed runs on `[text](url)` then `**bold**`.
 * Returns a single untyped run when there is no inline markdown, which is how
 * callers detect "nothing to do".
 */
export function inlineRuns(text) {
  const out = [];
  const rx = /\[([^\]\n]{1,300})\]\((https?:\/\/[^)\s]+|\/[^)\s]*)\)/g;
  let last = 0;
  let m;
  while ((m = rx.exec(text))) {
    if (m.index > last) out.push(...splitBold(text.slice(last, m.index)));
    for (const run of splitBold(m[1])) out.push({ ...run, href: m[2] });
    last = rx.lastIndex;
  }
  if (last < text.length) out.push(...splitBold(text.slice(last)));
  return out.length ? out : [{ text }];
}

/**
 * @param {Array} blocks   Portable Text array as imported.
 * @param {() => string} keyFn  Unique-key generator (Sanity requires _key
 *                              unique within the array).
 * @returns {{blocks: Array, stats: object}}
 */
export function normalizeImportedBlocks(blocks, keyFn) {
  const stats = {
    metaBlocksDropped: 0,
    leadingH1Dropped: 0,
    linksConverted: 0,
    boldConverted: 0,
  };

  let out = [...(blocks ?? [])];

  // 1+2. Strip the document preamble: the "Sanity CMS Fields" authoring brief
  //       and a literal "# Title" line. They appear in either order — some
  //       drafts lead with the heading, some with the brief — so keep peeling
  //       until neither matches rather than checking index 0 twice.
  for (;;) {
    if (!out.length) break;
    const head = blockText(out[0]).trim();

    if (META_HEADER.test(head)) {
      // Only from the top of the document; a blockquote shaped like this
      // further down is prose, not a brief.
      let i = 1;
      while (i < out.length && META_LINE.test(blockText(out[i]).trim())) i++;
      stats.metaBlocksDropped += i;
      out = out.slice(i);
      continue;
    }

    // The blog template already renders post.title as the page <h1>, so a
    // leading "# Title" block duplicates the heading.
    if (LEADING_H1.test(head)) {
      stats.leadingH1Dropped += 1;
      out = out.slice(1);
      continue;
    }

    break;
  }

  // 3. Convert residual inline markdown into real marks and markDefs.
  out = out.map((block) => {
    if (block?._type !== "block" || !Array.isArray(block.children)) return block;

    const markDefs = [...(block.markDefs ?? [])];
    const children = [];
    let touched = false;

    for (const child of block.children) {
      if (child?._type !== "span" || typeof child.text !== "string" || !child.text) {
        children.push(child);
        continue;
      }
      const runs = inlineRuns(child.text);
      if (runs.length === 1 && !runs[0].href && !runs[0].strong) {
        children.push(child);
        continue;
      }
      touched = true;
      for (const run of runs) {
        const marks = [...(child.marks ?? [])];
        if (run.strong) {
          if (!marks.includes("strong")) marks.push("strong");
          stats.boldConverted++;
        }
        if (run.href) {
          const key = keyFn();
          markDefs.push({ _key: key, _type: "link", href: run.href });
          marks.push(key);
          stats.linksConverted++;
        }
        children.push({ _type: "span", _key: keyFn(), text: run.text, marks });
      }
    }

    return touched ? { ...block, children, markDefs } : block;
  });

  return { blocks: out, stats };
}
