/**
 * Transitional footer notice for the workagedleads.com consolidation.
 *
 * Bill's call on 2026-08-03: no re-introduction broadcast. Sending simply moves
 * to the new domain and a subtle line in the footer carries the recognition.
 *
 * It says "new home of" rather than "rebranded" because two sites merged — a
 * reader who knew both will notice the difference, and getting that wrong on
 * the one line whose whole job is recognition is worse than saying nothing.
 *
 * REMOVE AFTER 2026-11-01. This is a transitional notice, not permanent
 * footer furniture. Delete this file and the four call sites; nothing else
 * depends on it.
 */

export const REBRAND_NOTICE_SUNSET = "2026-11-01";

export const REBRAND_NOTICE_TEXT =
  "Work Aged Leads is the new home of Aged Lead Sales and How To Work Leads. Same author, same archive, one address.";

/**
 * Small grey type, sits above the unsubscribe link. Deliberately not in the
 * body: in the body it reads as an announcement, which is the thing we decided
 * not to make.
 */
export const rebrandNoticeHtml = (): string =>
  `<p style="margin: 0 0 8px 0; color: #9ca3af; font-size: 12px; line-height: 1.5;">${REBRAND_NOTICE_TEXT}</p>`;
