/**
 * Freshness verdict for the Lead Price Index study, with a dated snooze.
 *
 * WHY A SNOOZE (Bill, 2026-09-15)
 *
 * The study is a quarterly human publishing task. Once it goes overdue, this
 * check fails on every daily health run, and the alert email it produces is the
 * same email a genuine cron failure uses. Through Bill's trip (2026-09-17 to
 * 09-30) that is fourteen identical alerts about something nobody can act on
 * from an iPad — which trains the reader to skim past exactly the email that
 * would carry a real failure.
 *
 * WHY IT MUST EXPIRE
 *
 * A snooze with no end date is a monitor turned off with a comment explaining
 * why it looked like a good idea at the time. The date is a hard stop: from
 * PRICE_INDEX_SNOOZE_UNTIL onward the check reports honestly again, whether or
 * not anyone remembers the snooze existed. That behavior is what the test pins.
 */

/** The study is judged on its own quarterly cadence. */
export const PRICE_INDEX_MAX_AGE_DAYS = 100;

/**
 * Alerts for an overdue study are held until this UTC date (inclusive of the
 * day before; alerting resumes ON this date). Set for Bill's return.
 */
export const PRICE_INDEX_SNOOZE_UNTIL = "2026-10-05";

export interface PriceIndexVerdict {
  ok: boolean;
  snoozed: boolean;
  detail: string;
}

export function evaluatePriceIndexAge(ageDays: number, now: Date): PriceIndexVerdict {
  if (ageDays <= PRICE_INDEX_MAX_AGE_DAYS) {
    return { ok: true, snoozed: false, detail: `Latest benchmark published ${ageDays}d ago` };
  }

  const overdue =
    `Benchmarks are ${ageDays}d old — the quarterly Lead Price Index study is due. ` +
    `This is a human publishing task, not a cron failure; marketwatch only ` +
    `surfaces pricing signals to verify.`;

  if (now < new Date(`${PRICE_INDEX_SNOOZE_UNTIL}T00:00:00Z`)) {
    return {
      ok: true,
      snoozed: true,
      detail: `${overdue} Alert snoozed until ${PRICE_INDEX_SNOOZE_UNTIL}.`,
    };
  }

  return { ok: false, snoozed: false, detail: overdue };
}
