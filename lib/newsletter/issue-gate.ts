/**
 * The single checkpoint every newsletter issue passes before it can be archived
 * or mailed.
 *
 * WHY THIS EXISTS WHEN `price-guard.ts` ALREADY DID
 *
 * The price guard was correct and it still did not work, because it was wired
 * into exactly one caller: `scripts/draft-newsletter.ts`, a command a human runs
 * by choice. The Sunday cron is what actually produces archived issues, and it
 * ran no guard at all; `scripts/send-newsletter.ts` mailed archived bytes
 * without re-reading them.
 *
 * The cost of that is not hypothetical. `data/newsletter-archive/2026-08-10.html`
 * contains both "$0.30" and "Aged leads from $0.25", and its JSON records
 * `sent: true` on 2026-08-12 under broadcast a830c99a. The exact defect the
 * guard was written for reached the list, while the guard sat one code path
 * away. A gate that only runs on the path a human happens to take is not a gate.
 *
 * So the policy lives here, and both boundaries call it: HTML production (the
 * cron and the draft script) and transmission (the sender).
 *
 * The extra two checks are cheap and serve the same goal the newsletter exists
 * for. An issue with no store link earns nothing, and duplicate `utm_content`
 * values silently merge two placements into one GA4 row — a template regression
 * that is invisible until the report is already wrong.
 */

import { scanForPriceClaims, priceClaimError } from "./price-guard";

export interface IssueGate {
  ok: boolean;
  /** Per-lead price claims. Any hit stops the issue. */
  blocking: string[];
  /** Whole-dollar amounts and non-fatal structure notes, for a human to eyeball. */
  warnings: string[];
  /** Human-readable explanation of the first failure, ready to print or email. */
  reason?: string;
}

const STORE_HOST_RE = /https?:\/\/(?:[a-z0-9-]+\.)*agedleadstore\.com/gi;
const UTM_CONTENT_RE = /[?&]utm_content=([^"'&\s>]+)/gi;

/**
 * Every `utm_content` in the issue, in document order, duplicates included.
 * Read off the raw HTML rather than the stripped text — these live in hrefs,
 * which is precisely what `toText()` throws away.
 */
function utmContents(html: string): string[] {
  return [...html.matchAll(UTM_CONTENT_RE)].map((m) => m[1]);
}

export function checkIssueHtml(html: string): IssueGate {
  const { blocking, warnings: priceWarnings } = scanForPriceClaims(html);
  const warnings = [...priceWarnings];

  if (blocking.length > 0) {
    return { ok: false, blocking, warnings, reason: priceClaimError(blocking) };
  }

  // Not fatal — an issue that earns nothing is a wasted send, not a broken
  // promise to a buyer, and blocking on it would be a new way to lose a week.
  const storeLinks = html.match(STORE_HOST_RE) ?? [];
  if (storeLinks.length === 0) {
    warnings.push(
      "No agedleadstore.com link in the issue — this send cannot earn anything.",
    );
  }

  const contents = utmContents(html);
  const dupes = [...new Set(contents.filter((c, i) => contents.indexOf(c) !== i))];
  if (dupes.length > 0) {
    warnings.push(
      `Duplicate utm_content values (${dupes.join(", ")}) — GA4 merges these into ` +
        `one row, so those placements cannot be told apart.`,
    );
  }

  return { ok: true, blocking, warnings };
}

/** Throws on a blocking claim. For callers that should simply stop. */
export function assertIssueHtml(html: string): void {
  const gate = checkIssueHtml(html);
  if (!gate.ok) throw new Error(gate.reason);
}
