import { test, describe } from "node:test";
import assert from "node:assert/strict";
import { planRestagger, anchorFor, dayKey, DAY_MS, type RestaggerRow } from "./restagger";

/**
 * These guard the thing that nearly shipped twice: a cohort of held-back rows
 * all firing in one cron run because every missed step of an overdue journey is
 * also overdue.
 *
 * The live shape being defended against, read from the database 2026-09-09:
 * 123 active welcome rows, every one dated 2026-07-12 .. 2026-08-01 — all in
 * the PAST — held back only by the `ALS_LIFECYCLE_JOURNEYS` allowlist. Adding
 * "welcome" to that env var makes all 123 due at once.
 */

const jul = (d: number) => new Date(Date.UTC(2026, 6, d, 10, 40));
const start = new Date(Date.UTC(2026, 8, 10, 12));

/** `n` rows all dated in July, i.e. the real paused-welcome shape. */
function pastDueRows(n: number, step = 0): RestaggerRow[] {
  return Array.from({ length: n }, (_, i) => ({
    jid: i + 1,
    step,
    nextDueAt: jul(12 + (i % 20)),
  }));
}

describe("planRestagger", () => {
  test("places past-due rows — the case the old restagger silently skipped", () => {
    // The old implementation filtered `next_due_at > now()`, so a July-dated
    // backlog selected zero rows and reported success.
    const { moves } = planRestagger({
      rows: pastDueRows(123),
      perDay: 18,
      combinedMax: 0,
      occupancy: new Map(),
      start,
    });
    assert.equal(moves.length, 123, "every past-due row must be re-dated");
  });

  test("never exceeds perDay for its own journey", () => {
    const { perDayPlan } = planRestagger({
      rows: pastDueRows(123),
      perDay: 18,
      combinedMax: 0,
      occupancy: new Map(),
      start,
    });
    for (const [day, n] of perDayPlan) {
      assert.ok(n <= 18, `${day} carries ${n}, over the 18/day budget`);
    }
    // 123 rows at 18/day is seven days: six full plus a remainder.
    assert.equal(perDayPlan.size, 7);
  });

  test("counts other journeys against a combined ceiling", () => {
    // The live replenishment load on 2026-09-17..20 is 36/day. With a combined
    // ceiling of 40 those days have room for 4 welcome rows each, not 18.
    const occupancy = new Map<string, number>([
      ["2026-09-10", 18],
      ["2026-09-11", 16],
      ["2026-09-17", 36],
      ["2026-09-18", 36],
    ]);
    const { perDayPlan } = planRestagger({
      rows: pastDueRows(60),
      perDay: 18,
      combinedMax: 40,
      occupancy,
      start,
    });
    for (const [day, n] of perDayPlan) {
      const others = occupancy.get(day) ?? 0;
      assert.ok(n + others <= 40, `${day}: ${n} + ${others} others exceeds 40`);
    }
  });

  test("a fully-booked day is skipped, not overfilled", () => {
    const occupancy = new Map<string, number>([["2026-09-10", 40]]);
    const { perDayPlan } = planRestagger({
      rows: pastDueRows(5),
      perDay: 18,
      combinedMax: 40,
      occupancy,
      start,
    });
    assert.equal(perDayPlan.get("2026-09-10"), undefined);
    assert.equal(perDayPlan.get("2026-09-11"), 5);
  });

  test("leaves a row alone when its day is already acceptable", () => {
    // Churning updated_at and moving someone's next email for no reason is a
    // real cost, so an already-fine row must produce no move.
    const rows: RestaggerRow[] = [{ jid: 1, step: 0, nextDueAt: new Date(Date.UTC(2026, 8, 10, 12)) }];
    const { moves } = planRestagger({
      rows,
      perDay: 18,
      combinedMax: 0,
      occupancy: new Map(),
      start,
    });
    assert.equal(moves.length, 0);
  });

  test("longest-waiting rows go first", () => {
    const rows: RestaggerRow[] = [
      { jid: 1, step: 0, nextDueAt: jul(30) },
      { jid: 2, step: 0, nextDueAt: jul(12) },
      { jid: 3, step: 0, nextDueAt: jul(20) },
    ];
    const { moves } = planRestagger({
      rows,
      perDay: 1,
      combinedMax: 0,
      occupancy: new Map(),
      start,
    });
    assert.deepEqual(moves.map((m) => m.jid), [2, 3, 1]);
    assert.equal(dayKey(moves[0].to), "2026-09-10");
    assert.equal(dayKey(moves[1].to), "2026-09-11");
    assert.equal(dayKey(moves[2].to), "2026-09-12");
  });

  test("reports rows it could not place rather than dropping them", () => {
    const { moves, unplaced } = planRestagger({
      rows: pastDueRows(10),
      perDay: 1,
      combinedMax: 0,
      occupancy: new Map(),
      start,
      maxDays: 3,
    });
    assert.ok(unplaced > 0, "unplaceable rows must be counted");
    assert.equal(moves.length + unplaced, 10);
  });
});

describe("anchorFor", () => {
  const WELCOME = [3, 7, 14];
  const REPLENISH = [0, 11, 24];

  test("back-dates so the step about to send lands on the target day", () => {
    // A welcome row at step 0 is about to send step 1, offset 3.
    const due = new Date(Date.UTC(2026, 8, 10, 12));
    const anchor = anchorFor(due, 0, WELCOME);
    assert.equal(anchor.getTime(), due.getTime() - 3 * DAY_MS);
  });

  test("keeps the designed spacing for the step that follows", () => {
    // The cron sets the next due as anchorAt + offsets[nextStep]. For a step-0
    // welcome row landing on the 10th, step 2 must follow 4 days later (7 - 3),
    // not 7 days after the send.
    const due = new Date(Date.UTC(2026, 8, 10, 12));
    const anchor = anchorFor(due, 0, WELCOME);
    const followOn = new Date(anchor.getTime() + WELCOME[1] * DAY_MS);
    assert.equal(dayKey(followOn), "2026-09-14");
  });

  test("uses the right offsets per journey", () => {
    // Replenishment step 1 is offset 0, so its anchor is the due date itself.
    const due = new Date(Date.UTC(2026, 8, 10, 12));
    assert.equal(anchorFor(due, 0, REPLENISH).getTime(), due.getTime());
    // A mid-sequence replenishment row at step 1 uses offset 11.
    assert.equal(anchorFor(due, 1, REPLENISH).getTime(), due.getTime() - 11 * DAY_MS);
  });

  test("clamps at the last step instead of running off the end", () => {
    const due = new Date(Date.UTC(2026, 8, 10, 12));
    assert.equal(anchorFor(due, 99, WELCOME).getTime(), due.getTime() - 14 * DAY_MS);
  });
});
