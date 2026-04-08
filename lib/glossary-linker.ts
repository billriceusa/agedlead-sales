import type { PortableTextBlock } from "sanity";

export interface GlossaryEntry {
  term: string;
  slug: string;
  definition: string;
}

interface Span {
  _type: "span";
  _key: string;
  text: string;
  marks: string[];
}

interface MarkDef {
  _key: string;
  _type: string;
  term?: string;
  definition?: string;
  slug?: string;
}

interface Block {
  _type: string;
  _key?: string;
  style?: string;
  children?: Span[];
  markDefs?: MarkDef[];
}

let keyCounter = 0;
function genKey() {
  return `gt_${++keyCounter}`;
}

/**
 * Pre-process PortableText blocks to inject glossary tooltip annotations.
 * Only the first occurrence of each term across all blocks gets linked.
 * Skips headings (h1-h4) — only processes normal/blockquote paragraphs.
 */
export function injectGlossaryLinks(
  blocks: PortableTextBlock[],
  glossary: GlossaryEntry[]
): PortableTextBlock[] {
  if (!glossary.length || !blocks.length) return blocks;

  keyCounter = 0;

  // Sort by term length descending so longer terms match first
  // (e.g., "aged lead" before "lead")
  const sorted = [...glossary].sort((a, b) => b.term.length - a.term.length);

  // Build case-insensitive regex patterns
  const termPatterns = sorted.map((entry) => ({
    entry,
    regex: new RegExp(
      `\\b${entry.term.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\b`,
      "i"
    ),
  }));

  const linkedTerms = new Set<string>();
  const result: PortableTextBlock[] = [];

  for (const block of blocks) {
    const b = block as unknown as Block;

    // Only process text blocks with normal or blockquote style
    if (
      b._type !== "block" ||
      !b.children ||
      (b.style && b.style !== "normal" && b.style !== "blockquote")
    ) {
      result.push(block);
      continue;
    }

    const newChildren: Span[] = [];
    const newMarkDefs: MarkDef[] = [...(b.markDefs || [])];

    for (const child of b.children) {
      // Only process plain text spans (no existing marks like links)
      if (child._type !== "span" || child.marks.length > 0 || !child.text) {
        newChildren.push(child);
        continue;
      }

      // Try to find one glossary match in this span
      let matched = false;
      for (const { entry, regex } of termPatterns) {
        const termKey = entry.term.toLowerCase();
        if (linkedTerms.has(termKey)) continue;

        const match = regex.exec(child.text);
        if (!match) continue;

        // Found a match — split the span into before / term / after
        linkedTerms.add(termKey);
        matched = true;

        const markKey = genKey();
        newMarkDefs.push({
          _key: markKey,
          _type: "glossaryTerm",
          term: entry.term,
          definition: entry.definition,
          slug: entry.slug,
        });

        const before = child.text.slice(0, match.index);
        const termText = child.text.slice(
          match.index,
          match.index + match[0].length
        );
        const after = child.text.slice(match.index + match[0].length);

        if (before) {
          newChildren.push({
            _type: "span",
            _key: genKey(),
            text: before,
            marks: [],
          });
        }

        newChildren.push({
          _type: "span",
          _key: genKey(),
          text: termText,
          marks: [markKey],
        });

        if (after) {
          // Recursion-free: push the remaining text as a new span
          // (it could contain another term, but we limit to one match per span
          //  to keep complexity manageable — the next block iteration will catch others)
          newChildren.push({
            _type: "span",
            _key: genKey(),
            text: after,
            marks: [],
          });
        }

        break; // One match per original span
      }

      if (!matched) {
        newChildren.push(child);
      }
    }

    result.push({
      ...block,
      children: newChildren,
      markDefs: newMarkDefs,
    } as unknown as PortableTextBlock);
  }

  return result;
}
