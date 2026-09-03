import { test, describe } from "node:test";
import assert from "node:assert/strict";
import { replenishReserveFor, ALS_LIFECYCLE_REPLENISH_FLOOR } from "./config";
import { allocateDueSlots } from "./lifecycle";

/**
 * The reserve used to be the absolute number 50 while a comment claimed it
 * "scales with [the cap] and needs no change". It did not. Since
 * `allocateDueSlots` hands the value track `cap - reserve`, raising the cap
 * 150 -> 250 to clear the buyer backlog would have given all 100 new slots to
 * welcome/ai-series and moved the buyer list not at all — the cap raise would
 * have looked applied and done nothing.
 *
 * These tests are about that specific silence: a knob that reports success
 * while failing to do the one thing it was turned for.
 */

const SHARE = 0.4;

describe("replenishReserveFor", () => {
  test("scales with the cap — the property the old comment falsely claimed", () => {
    assert.equal(replenishReserveFor(150, SHARE), 60);
    assert.equal(replenishReserveFor(250, SHARE), 100);
    assert.equal(replenishReserveFor(400, SHARE), 160);
  });

  test("raising the cap raises the buyer track's slots, not only the value track's", () => {
    // The regression, stated as an invariant.
    const before = replenishReserveFor(150, SHARE);
    const after = replenishReserveFor(250, SHARE);
    assert.ok(after > before, `reserve did not grow with the cap: ${before} -> ${after}`);
  });

  test("small caps fall back to the floor rather than starving buyers out", () => {
    // 40% of 100 is 40, below the floor. The floor wins.
    assert.equal(replenishReserveFor(100, SHARE), ALS_LIFECYCLE_REPLENISH_FLOOR);
    assert.equal(replenishReserveFor(60, SHARE), ALS_LIFECYCLE_REPLENISH_FLOOR);
  });

  test("never exceeds the cap, even when the floor would", () => {
    // A deliverability incident could drop the cap under the floor; reserving
    // more slots than exist would let allocateDueSlots hand out phantom slots.
    assert.equal(replenishReserveFor(20, SHARE), 20);
    assert.equal(replenishReserveFor(1, SHARE), 1);
  });

  test("a nonsense share falls back to 40% instead of zeroing the reserve", () => {
    for (const bad of [0, -1, 2, NaN, Infinity]) {
      assert.equal(replenishReserveFor(250, bad as number), 100, `share ${bad}`);
    }
  });

  test("a nonsense cap reserves nothing rather than NaN", () => {
    for (const bad of [0, -5, NaN]) {
      assert.equal(replenishReserveFor(bad as number, SHARE), 0, `cap ${bad}`);
    }
  });
});

describe("the cap raise, end to end", () => {
  const day = (n: number) => new Date(Date.UTC(2026, 8, n));
  /** The real 2026-09-03 shape: 582 active value-track, 133 active replenish. */
  const backlog = () =>
    [
      ...Array.from({ length: 185 }, (_, i) => ({ id: i, journey: "welcome", nextDueAt: day(1) })),
      ...Array.from({ length: 397 }, (_, i) => ({ id: 1000 + i, journey: "ai-series", nextDueAt: day(2) })),
      ...Array.from({ length: 133 }, (_, i) => ({ id: 2000 + i, journey: "replenishment", nextDueAt: day(5) })),
    ].sort((a, b) => a.nextDueAt.getTime() - b.nextDueAt.getTime());

  test("150 -> 250 actually moves more buyers", () => {
    const at150 = allocateDueSlots(backlog(), 150, replenishReserveFor(150, SHARE));
    const at250 = allocateDueSlots(backlog(), 250, replenishReserveFor(250, SHARE));
    assert.equal(at150.replenishCount, 60);
    assert.equal(at250.replenishCount, 100);
    assert.ok(
      at250.replenishCount > at150.replenishCount,
      "raising the cap must reach more buyers, or there is no reason to raise it",
    );
  });

  test("with the OLD absolute reserve, the same cap raise reached no extra buyers", () => {
    // Kept as the counter-example. This is what would have shipped.
    const at150 = allocateDueSlots(backlog(), 150, 50);
    const at250 = allocateDueSlots(backlog(), 250, 50);
    assert.equal(at150.replenishCount, 50);
    assert.equal(at250.replenishCount, 50);
    assert.equal(at250.valueCount - at150.valueCount, 100);
  });

  test("the value track still gets the majority of a raised cap", () => {
    // Education is slowed under contention, never abandoned.
    const { replenishCount, valueCount } = allocateDueSlots(
      backlog(),
      250,
      replenishReserveFor(250, SHARE),
    );
    assert.equal(replenishCount + valueCount, 250);
    assert.ok(valueCount > replenishCount, `${valueCount} value vs ${replenishCount} replenish`);
  });

  test("replenishment still backfills when the value track runs dry", () => {
    // The floor is a floor, not a ceiling — unchanged by this refactor.
    const onlyBuyers = Array.from({ length: 400 }, (_, i) => ({
      id: i,
      journey: "replenishment",
      nextDueAt: day(1),
    }));
    const { replenishCount, valueCount } = allocateDueSlots(
      onlyBuyers,
      250,
      replenishReserveFor(250, SHARE),
    );
    assert.equal(replenishCount, 250);
    assert.equal(valueCount, 0);
  });
});
