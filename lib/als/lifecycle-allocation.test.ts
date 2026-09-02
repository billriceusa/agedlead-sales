import { test, describe } from "node:test";
import assert from "node:assert/strict";
import { allocateDueSlots } from "./lifecycle";

/**
 * These guard what thousands of real buyers receive each morning. The bug being
 * fixed was silent: `.limit(cap)` in SQL meant replenishment rows were never
 * loaded when the value track had an older backlog, so the highest-earning
 * emails in the system ($70/session) simply never sent while $0/session ones
 * did — and nothing in the output said so.
 */

type Row = { id: number; journey: string; nextDueAt: Date };

const day = (n: number) => new Date(Date.UTC(2026, 7, n));

/** `count` rows of one journey, oldest first, starting at a given day. */
function rows(journey: string, count: number, startDay = 1, idBase = 0): Row[] {
  return Array.from({ length: count }, (_, i) => ({
    id: idBase + i,
    journey,
    nextDueAt: day(startDay + i),
  }));
}

/** The real 2026-09-02 shape: a large, OLDER value-track backlog. */
function realisticBacklog(): Row[] {
  return [...rows("welcome", 300, 1, 0), ...rows("ai-series", 282, 1, 1000), ...rows("replenishment", 133, 20, 2000)].sort(
    (a, b) => a.nextDueAt.getTime() - b.nextDueAt.getTime(),
  );
}

describe("allocateDueSlots", () => {
  test("reserves slots for replenishment even when the value track is older", () => {
    // The whole point. Before the fix, 150 oldest-due rows were all value-track
    // and replenishment sent nothing.
    const { replenishCount, valueCount, selected } = allocateDueSlots(realisticBacklog(), 150, 50);
    assert.equal(replenishCount, 50);
    assert.equal(valueCount, 100);
    assert.equal(selected.length, 150);
  });

  test("without a reserve, replenishment is starved — the bug, reproduced", () => {
    const { replenishCount } = allocateDueSlots(realisticBacklog(), 150, 0);
    assert.equal(replenishCount, 0, "value-track backlog should crowd it out entirely");
  });

  test("never sends more than the cap", () => {
    const { selected } = allocateDueSlots(realisticBacklog(), 150, 50);
    assert.equal(selected.length, 150);
  });

  test("sends everything when the cap exceeds what is due", () => {
    const input = [...rows("welcome", 5), ...rows("replenishment", 3, 1, 100)];
    const { selected } = allocateDueSlots(input, 150, 50);
    assert.equal(selected.length, 8);
  });

  test("unused reserve goes to the value track rather than idling", () => {
    // Reserve is a floor on contention, not a throttle. Idle slots would make
    // the backlog worse.
    const input = [...rows("welcome", 200), ...rows("replenishment", 10, 1, 1000)];
    const { replenishCount, valueCount, selected } = allocateDueSlots(input, 150, 50);
    assert.equal(replenishCount, 10, "only 10 were due");
    assert.equal(valueCount, 140, "the other 40 reserved slots went to value");
    assert.equal(selected.length, 150);
  });

  test("replenishment backfills slots the value track cannot use", () => {
    const input = [...rows("welcome", 20), ...rows("replenishment", 300, 1, 1000)];
    const { replenishCount, valueCount, selected } = allocateDueSlots(input, 150, 50);
    assert.equal(valueCount, 20);
    assert.equal(replenishCount, 130, "reserve 50 + 80 backfilled");
    assert.equal(selected.length, 150);
  });

  test("a reserve larger than the cap is clamped, not honoured blindly", () => {
    const input = [...rows("welcome", 100), ...rows("replenishment", 100, 1, 1000)];
    const { selected, replenishCount } = allocateDueSlots(input, 30, 500);
    assert.equal(selected.length, 30);
    assert.equal(replenishCount, 30);
  });

  test("handles a zero cap and an empty queue without throwing", () => {
    assert.equal(allocateDueSlots(realisticBacklog(), 0, 50).selected.length, 0);
    assert.equal(allocateDueSlots([], 150, 50).selected.length, 0);
    assert.equal(allocateDueSlots(realisticBacklog(), 150, -5).replenishCount, 0);
  });

  test("the chosen batch still goes out oldest-due first", () => {
    // Two buckets are interleaved during allocation, so the batch has to be
    // re-sorted or the longest-waiting contact loses their place.
    const { selected } = allocateDueSlots(realisticBacklog(), 150, 50);
    const times = selected.map((r) => r.nextDueAt.getTime());
    assert.deepEqual(times, [...times].sort((a, b) => a - b));
  });

  test("picks the OLDEST replenishment rows, not arbitrary ones", () => {
    const input = [...rows("replenishment", 100, 1, 0)].sort(
      (a, b) => a.nextDueAt.getTime() - b.nextDueAt.getTime(),
    );
    const { selected } = allocateDueSlots(input, 10, 10);
    assert.deepEqual(
      selected.map((r) => r.id),
      [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
    );
  });

  test("selects no row twice", () => {
    const { selected } = allocateDueSlots(realisticBacklog(), 150, 50);
    const ids = selected.map((r) => `${r.journey}:${r.id}`);
    assert.equal(new Set(ids).size, ids.length);
  });
});
