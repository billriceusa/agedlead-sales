/**
 * Fit a meta description into what Google actually renders.
 *
 * Pages that fall back to body prose for their description — the glossary
 * falls back to the full term definition — routinely ship 200+ characters.
 * Google cuts those, so the end of the sentence never reaches a searcher.
 *
 * Cuts on a SENTENCE boundary first and only falls back to a word boundary,
 * because the failure mode we are avoiding is a description that stops
 * mid-word. That is not hypothetical: 12 posts shipped machine-truncated
 * metadata reading "...in the categor…" until 2026-08-06. A description that
 * ends on a complete thought reads as written; one that ends in "the categor…"
 * reads as broken.
 */

/** Google renders roughly this much of a description. */
export const META_DESCRIPTION_MAX = 155;

export function fitMetaDescription(
  text: string | null | undefined,
  max: number = META_DESCRIPTION_MAX,
): string {
  if (!text) return "";
  const clean = text.replace(/\s+/g, " ").trim();
  if (clean.length <= max) return clean;

  // Prefer the largest whole number of sentences that fits. Requires the
  // period to be followed by a space so "$1.25" and "U.S." don't split it.
  const head = clean.slice(0, max + 1);
  const lastSentence = Math.max(
    head.lastIndexOf(". "),
    head.lastIndexOf("! "),
    head.lastIndexOf("? "),
  );
  // Only worth it if a sentence break leaves a usable description rather than
  // a fragment — below half the budget we'd be throwing away good copy.
  if (lastSentence >= Math.floor(max / 2)) {
    return clean.slice(0, lastSentence + 1).trim();
  }

  // No usable sentence break: cut on the last whole word and mark the cut.
  const room = max - 1; // leave room for the ellipsis
  const slice = clean.slice(0, room + 1);
  const lastSpace = slice.lastIndexOf(" ");
  const cut = lastSpace > 0 ? slice.slice(0, lastSpace) : clean.slice(0, room);
  return `${cut.replace(/[,;:.–—-]+$/, "").trim()}…`;
}
