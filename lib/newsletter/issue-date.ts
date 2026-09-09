/**
 * Which archive label a given moment belongs to.
 *
 * WHY THIS EXISTS — it cost a send (2026-09-09)
 *
 * The two halves of the auto-send window disagreed about the name of the file
 * they were passing between them, and nothing in the system could see it.
 *
 *   Sunday   `weekly-newsletter` archives under `getWeekDates().weekLabel`,
 *            which is `fmt(monday)` — the MONDAY before the send Tuesday.
 *            Every archived issue is Monday-dated: 2026-08-10, 08-17, 08-31,
 *            09-07.
 *   Tuesday  `send-newsletter` defaulted its date to `todayUtc()` — a TUESDAY —
 *            and read `readIssue(thatTuesday)`.
 *
 * A Tuesday-named archive has never existed, so the read always missed. Worse,
 * the miss was indistinguishable from the ordinary case: "no issue for this
 * date" is genuinely normal on every non-Tuesday, so the route returned `ok`
 * and stamped the heartbeat healthy. A ready issue to 2,628 people sat unsent
 * on 2026-09-08 while the monitoring said the cron was fine.
 *
 * Proven by dry-running the live route on both dates:
 *   ?date=2026-09-08 -> "No archived issue for 2026-09-08 — nothing to send."
 *   ?date=2026-09-07 -> subject "The Free Tools Most Agents Never Open",
 *                        wouldMail 2628, gate passed.
 *
 * The fix resolves the label the same way the drafting side names it, rather
 * than assuming the send day and the file name are the same string. Fixing it
 * on the send side deliberately: renaming archives would orphan every issue
 * already on disk, and the Monday label is the one humans have been typing into
 * `npm run newsletter:send -- --date <label>` all along.
 */

/** Most recent Monday on or before `now`, in UTC, as `YYYY-MM-DD`. */
export function issueLabelFor(now: Date): string {
  const d = new Date(
    Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()),
  );
  // getUTCDay: 0 = Sunday, 1 = Monday. Sunday must go back six days, not one —
  // a naive `day - 1` would send Sunday to Saturday and skip the week entirely.
  const back = (d.getUTCDay() + 6) % 7;
  d.setUTCDate(d.getUTCDate() - back);
  return d.toISOString().slice(0, 10);
}
