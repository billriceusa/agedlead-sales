import type { ReactNode } from "react";
import { GlossaryTooltip } from "./glossary-tooltip";
import type { GlossaryEntry } from "@/lib/glossary-linker";

/**
 * Static-content glossary linker.
 *
 * The PortableText path uses `injectGlossaryLinks` (lib/glossary-linker.ts) to
 * annotate Sanity blocks. Lead-type pages render plain strings from
 * `data/lead-types.ts`, which that path can't touch — this helper covers them.
 *
 * `makeGlossaryLinker` returns a `link(text)` function that wraps the first
 * occurrence of each glossary term in a <GlossaryTooltip>. Call it once per
 * page render and reuse the returned function across every prose field, so the
 * shared `seen` set enforces "first occurrence across the whole page" (matching
 * the PortableText behavior) rather than linking the same term repeatedly.
 */
export function makeGlossaryLinker(
  glossary: GlossaryEntry[]
): (text: string) => ReactNode {
  if (!glossary || glossary.length === 0) {
    return (text: string) => text;
  }

  // Longer terms first so "aged lead" wins over "lead" on overlap.
  const sorted = [...glossary].sort((a, b) => b.term.length - a.term.length);
  const seen = new Set<string>();

  const escape = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

  return function link(text: string): ReactNode {
    if (!text) return text;

    // First occurrence of each not-yet-linked term in this string.
    const candidates: { start: number; end: number; entry: GlossaryEntry }[] =
      [];
    for (const entry of sorted) {
      if (seen.has(entry.term.toLowerCase())) continue;
      const m = new RegExp(`\\b${escape(entry.term)}\\b`, "i").exec(text);
      if (m) candidates.push({ start: m.index, end: m.index + m[0].length, entry });
    }
    if (candidates.length === 0) return text;

    // Earliest first; on overlap, the longer match wins.
    candidates.sort(
      (a, b) => a.start - b.start || b.end - b.start - (a.end - a.start)
    );

    const chosen: typeof candidates = [];
    let lastEnd = -1;
    for (const c of candidates) {
      if (c.start < lastEnd) continue; // overlaps an already-chosen term
      chosen.push(c);
      lastEnd = c.end;
    }

    const nodes: ReactNode[] = [];
    let cursor = 0;
    chosen.forEach((c, i) => {
      seen.add(c.entry.term.toLowerCase());
      if (c.start > cursor) nodes.push(text.slice(cursor, c.start));
      nodes.push(
        <GlossaryTooltip
          key={`g-${c.entry.slug}-${i}`}
          term={c.entry.term}
          definition={c.entry.definition}
          slug={c.entry.slug}
        >
          {text.slice(c.start, c.end)}
        </GlossaryTooltip>
      );
      cursor = c.end;
    });
    if (cursor < text.length) nodes.push(text.slice(cursor));
    return nodes;
  };
}
