/**
 * Spread a journey's due rows across days so no single cron run mails a cohort.
 *
 * WHY THIS IS ITS OWN MODULE (Phase 2, 2026-09-09)
 *
 * `scripts/lifecycle-release-cohort.ts` grew a `--restagger` mode that worked
 * only for replenishment and only for rows dated in the FUTURE. Both limits are
 * wrong for the job Phase 2 needs:
 *
 *  - Journey. The offsets were read from the replenishment steps and the query
 *    hard-coded `journey = 'replenishment'`, so pointing it at welcome would
 *    have re-dated rows using the wrong spacing.
 *
 *  - Past-due. The query filtered `next_due_at > now()`. Every one of the 123
 *    paused welcome rows is dated 2026-07-12 .. 2026-08-01 — all in the past —
 *    so the old restagger would have selected ZERO of them and reported success.
 *    A past-due row is exactly the row that fires in the next run; excluding it
 *    excluded the whole problem.
 *
 * The scheduling itself is pure and lives here so it can be tested without a
 * database, in the same spirit as `replenishReserveFor` and `allocateDueSlots`.
 */

export const DAY_MS = 86_400_000;

/** A journey row as the planner needs to see it. */
export interface RestaggerRow {
  jid: number;
  /** Steps already sent. The step about to send is `step + 1`. */
  step: number;
  nextDueAt: Date;
}

/** One row's new landing date. */
export interface RestaggerMove {
  jid: number;
  step: number;
  /** New `next_due_at`. */
  to: Date;
  /** Day this row previously sat on, for dry-run reporting. */
  from: string;
}

export interface RestaggerOptions {
  /** Rows to place, any due date, past or future. */
  rows: RestaggerRow[];
  /** Max rows of THIS journey allowed to land on one day. */
  perDay: number;
  /**
   * Max rows across ALL journeys allowed on one day. 0 disables the check.
   * Pair with `occupancy` — without it there is nothing to combine against.
   */
  combinedMax: number;
  /** Day -> rows already scheduled by OTHER journeys. Keys are `YYYY-MM-DD`. */
  occupancy: Map<string, number>;
  /** First day the schedule may use. */
  start: Date;
  /** Safety stop so a zero-room budget cannot spin forever. */
  maxDays?: number;
}

export function dayKey(d: Date): string {
  return d.toISOString().slice(0, 10);
}

/** Noon UTC on `key`, matching the send-window convention already in use. */
export function dayStart(key: string): Date {
  return new Date(key + "T12:00:00.000Z");
}

/**
 * Walk forward from `start`, placing rows oldest-due-first into the first day
 * with room under BOTH budgets.
 *
 * Returns only rows whose day actually changes. A row already sitting on an
 * acceptable day is left alone — re-dating it would churn `updated_at` and,
 * worse, move a contact's next email for no reason.
 */
export function planRestagger(opts: RestaggerOptions): {
  moves: RestaggerMove[];
  perDayPlan: Map<string, number>;
  unplaced: number;
} {
  const { rows, perDay, combinedMax, occupancy, start } = opts;
  const maxDays = opts.maxDays ?? 365;

  // Longest-waiting first, so the people held back the longest go first.
  const ordered = [...rows].sort((a, b) => a.nextDueAt.getTime() - b.nextDueAt.getTime());

  const mine = new Map<string, number>();
  const moves: RestaggerMove[] = [];
  let cursor = new Date(dayStart(dayKey(start)));
  const stopAt = cursor.getTime() + maxDays * DAY_MS;
  let unplaced = 0;

  for (const r of ordered) {
    let key = dayKey(cursor);
    // Advance to the first day with room under both budgets.
    while (cursor.getTime() <= stopAt) {
      key = dayKey(cursor);
      const used = mine.get(key) ?? 0;
      const others = occupancy.get(key) ?? 0;
      const roomJourney = perDay - used;
      const roomCombined = combinedMax > 0 ? combinedMax - others - used : Number.POSITIVE_INFINITY;
      if (roomJourney > 0 && roomCombined > 0) break;
      cursor = new Date(cursor.getTime() + DAY_MS);
    }
    if (cursor.getTime() > stopAt) {
      unplaced++;
      continue;
    }
    mine.set(key, (mine.get(key) ?? 0) + 1);

    const fromKey = dayKey(r.nextDueAt);
    if (fromKey !== key) {
      moves.push({ jid: r.jid, step: r.step, to: dayStart(key), from: fromKey });
    }
  }

  return { moves, perDayPlan: mine, unplaced };
}

/**
 * Anchor that makes the step about to send land exactly on `due`.
 *
 * The cron computes the step AFTER this one as `anchorAt + offsets[nextStep]`,
 * so setting the anchor naively to `due` would push a mid-sequence row's next
 * email a full offset too late. Back-dating by the current step's offset keeps
 * the designed spacing measured from the new date.
 */
export function anchorFor(due: Date, step: number, offsets: number[]): Date {
  const idx = Math.min(step + 1, offsets.length) - 1;
  const offset = offsets[idx] ?? 0;
  return new Date(due.getTime() - offset * DAY_MS);
}
