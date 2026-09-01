/**
 * Refuse to ship a newsletter issue that quotes a per-lead price.
 *
 * WHY THIS IS CODE AND NOT JUST A PROMPT RULE
 *
 * `lib/cron/newsletter-ai.ts` instructs the model never to quote per-lead
 * pricing. A prompt is a request, not a control. The first draft produced after
 * that rule was added still opened with "$0.30 aged leads" — below the
 * partner's actual $0.40 floor at the time. A wrong price inside a broadcast
 * reaches thousands of buyers who will hold us to it, and there is no recall.
 *
 * Sub-dollar amounts are the reliable tell: aged-lead pricing is the only thing
 * this newsletter ever quotes in cents. Fresh / real-time lead costs run in
 * whole dollars and are legitimate to cite when sourced, so those are surfaced
 * as a warning for a human to eyeball rather than a hard stop.
 *
 * Related: the closing CTA used to hard-code "Aged leads from $0.25" in the
 * template itself. That was removed for the same reason — see
 * `lib/cron/newsletter-email.ts`.
 */

export interface PriceScan {
  /** Per-lead price claims. Any hit must block the issue. */
  blocking: string[];
  /** Whole-dollar amounts — legitimate only as sourced fresh-lead costs. */
  warnings: string[];
}

const BLOCKING = [
  /\$0\.\d{1,2}/g, // $0.25, $0.3
  /\b\d{1,3}\s*cents?\b/gi, // "30 cents"
  /\bcents?\s+(?:a|per)\s+lead\b/gi, // "cents per lead"
];

const DOLLARS = /\$\d{1,4}(?:\.\d{2})?/g;

/** Strip tags so `href="...0.25..."` in a URL cannot trip the text scan. */
function toText(html: string): string {
  return html.replace(/<[^>]+>/g, " ");
}

export function scanForPriceClaims(html: string): PriceScan {
  const text = toText(html);

  const blocking = [...new Set(BLOCKING.flatMap((re) => text.match(re) ?? []))];

  // Anything already caught as blocking should not be repeated as a warning.
  const warnings = [...new Set(text.match(DOLLARS) ?? [])].filter(
    (d) => !blocking.includes(d),
  );

  return { blocking, warnings };
}

export function priceClaimError(blocking: string[]): string {
  return (
    `The draft quotes a per-lead price — ${blocking.join(", ")}.\n\n` +
    `Partner pricing changes without notice, and this issue would mail that number\n` +
    `to the whole list with no way to recall it. Compare cost structure in words\n` +
    `("a fraction of what fresh leads cost") and let the store page show the live\n` +
    `figure. Re-run the draft; the copy is regenerated each time.`
  );
}
