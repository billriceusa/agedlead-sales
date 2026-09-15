/**
 * The sender identity every commercial email from this property must carry.
 *
 * WHY THIS EXISTS (2026-09-15)
 *
 * CAN-SPAM requires every commercial electronic mail message to include "a
 * valid physical postal address of the sender" — 15 U.S.C. § 7704(a)(5)(A)(iii).
 * These emails carry affiliate links, so they are commercial.
 *
 * Found while building the mortgage protection launch: the address appeared in
 * exactly one template, the lifecycle mailer (lib/als/lifecycle.ts), and in none
 * of the broadcast templates — the weekly newsletter, the direct offer, or the
 * restock offer. The 2026-09-15 newsletter issue went to the list without it.
 *
 * One constant, imported everywhere, so the next template cannot be written
 * without it. `sender.test.ts` asserts every broadcast template renders it.
 */
export const SENDER_LEGAL_NAME = "Bill Rice Strategy Group";
export const SENDER_POSTAL_ADDRESS = "750 E. Hurd Rd., Monroe, MI 48162";

/** Footer line for HTML templates. Matches the lifecycle mailer's wording. */
export function senderAddressHtml(color = "#9ca3af"): string {
  return `<p style="margin: 0 0 8px 0; color: ${color}; font-size: 12px; line-height: 1.5;">${SENDER_LEGAL_NAME} &middot; ${SENDER_POSTAL_ADDRESS}</p>`;
}
