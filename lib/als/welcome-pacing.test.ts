import { test, describe } from "node:test";
import assert from "node:assert/strict";
import { welcomeEnrollmentDate } from "./lifecycle";

/**
 * This bug class has now caused three incidents and these are the guard against a fourth.
 *
 *   2026-09-04  replenishment enrolled 111 unblocked purchasers with offsetDays 0, and the
 *               run mailed 128 against a planned 18/day.
 *   2026-09-10  welcome enrolled ~350 contacts unblocked by dropping the verification
 *               gate. Their natural date is signup + 3 days, which for months-old contacts
 *               is deep in the past, so all of them were due instantly. 202 sent against a
 *               staggered plan of 12/day, on a five-week-old sending domain.
 *   winback     paced when it was written, precisely because of the first one.
 *
 * The failure is always the same: a cohort becomes eligible at once, their due dates are
 * computed from something historical, and the send is bounded only by the daily cap.
 */

const DAY = 86_400_000;
const NOW = new Date("2026-09-10T11:00:00Z");
const START_DAYS = 3;
const PER_DAY = 30;

const place = (firstSeenAt: Date, backlogIndex: number) =>
  welcomeEnrollmentDate({ firstSeenAt, now: NOW, backlogIndex, perDay: PER_DAY, startDays: START_DAYS });

describe("welcomeEnrollmentDate", () => {
  test("a brand-new signup keeps its natural date and takes no backlog slot", () => {
    // Joined today: due in 3 days, exactly as designed. Steady state must be untouched.
    const r = place(new Date(NOW.getTime()), 0);
    assert.equal(r.usedBacklogSlot, false);
    assert.equal(r.due.getTime(), NOW.getTime() + START_DAYS * DAY);
    assert.equal(r.anchor.getTime(), NOW.getTime(), "anchor stays on the signup date");
  });

  test("a months-old contact is paced instead of firing immediately", () => {
    // The 2026-09-10 case. Natural due was months ago.
    const old = new Date(NOW.getTime() - 240 * DAY);
    const r = place(old, 0);
    assert.equal(r.usedBacklogSlot, true);
    assert.ok(r.due >= NOW, "must not be back-dated into the past");
    assert.equal(r.due.getTime(), NOW.getTime(), "first backlog row goes today");
  });

  test("backlog spreads at perDay and does not all land on one day", () => {
    const old = new Date(NOW.getTime() - 240 * DAY);
    const days = new Set<string>();
    for (let i = 0; i < 350; i++) days.add(place(old, i).due.toISOString().slice(0, 10));
    // 350 rows at 30/day is 12 distinct days. Before the fix it was 1.
    assert.equal(days.size, 12);
  });

  test("no single day exceeds perDay", () => {
    const old = new Date(NOW.getTime() - 240 * DAY);
    const counts = new Map<string, number>();
    for (let i = 0; i < 350; i++) {
      const k = place(old, i).due.toISOString().slice(0, 10);
      counts.set(k, (counts.get(k) ?? 0) + 1);
    }
    for (const [day, n] of counts) assert.ok(n <= PER_DAY, `${day} has ${n}, over ${PER_DAY}`);
  });

  test("the anchor moves with a paced due date so later steps stay correctly spaced", () => {
    // The cron computes step 2 as anchorAt + offsets[1]. Leaving the anchor on a signup
    // from eight months ago would make step 2 due in the past the moment step 1 sends.
    const old = new Date(NOW.getTime() - 240 * DAY);
    const r = place(old, 90);
    assert.equal(
      r.anchor.getTime(),
      r.due.getTime() - START_DAYS * DAY,
      "anchor must be due minus the start offset",
    );
    assert.ok(r.anchor > new Date(NOW.getTime() - 10 * DAY), "anchor must not stay historical");
  });

  test("a contact whose natural date is tomorrow is left alone", () => {
    // Joined 2 days ago, due tomorrow. Future, so it keeps its slot-free path.
    const r = place(new Date(NOW.getTime() - 2 * DAY), 0);
    assert.equal(r.usedBacklogSlot, false);
    assert.equal(r.due.getTime(), NOW.getTime() + 1 * DAY);
  });

  test("a natural date exactly now counts as backlog, not future", () => {
    // Boundary: signup + 3 days === now. It is due, so it must be paced.
    const r = place(new Date(NOW.getTime() - START_DAYS * DAY), 0);
    assert.equal(r.usedBacklogSlot, true);
  });

  test("a zero or negative perDay cannot divide by zero or stall", () => {
    const old = new Date(NOW.getTime() - 240 * DAY);
    const r = welcomeEnrollmentDate({
      firstSeenAt: old,
      now: NOW,
      backlogIndex: 5,
      perDay: 0,
      startDays: START_DAYS,
    });
    assert.ok(Number.isFinite(r.due.getTime()), "must not produce an invalid date");
    assert.ok(r.due >= NOW);
  });
});
