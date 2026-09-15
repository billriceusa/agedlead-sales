import { test, describe } from "node:test";
import assert from "node:assert/strict";
import {
  evaluatePriceIndexAge,
  PRICE_INDEX_MAX_AGE_DAYS,
  PRICE_INDEX_SNOOZE_UNTIL,
} from "./price-index-check";

describe("evaluatePriceIndexAge", () => {
  test("a fresh study is ok and not snoozed", () => {
    const v = evaluatePriceIndexAge(PRICE_INDEX_MAX_AGE_DAYS, new Date("2026-09-15T13:00:00Z"));
    assert.equal(v.ok, true);
    assert.equal(v.snoozed, false);
  });

  test("an overdue study is held quiet before the snooze date", () => {
    const v = evaluatePriceIndexAge(106, new Date("2026-09-20T13:00:00Z"));
    assert.equal(v.ok, true);
    assert.equal(v.snoozed, true);
    assert.match(v.detail, new RegExp(`snoozed until ${PRICE_INDEX_SNOOZE_UNTIL}`));
  });

  test("the snooze EXPIRES — an overdue study alerts again on the snooze date", () => {
    // The whole risk of a snooze is that it quietly becomes permanent. This is
    // the line that stops that: on the date, the check reports honestly with no
    // human needing to remember the snooze was ever set.
    const on = evaluatePriceIndexAge(120, new Date(`${PRICE_INDEX_SNOOZE_UNTIL}T13:00:00Z`));
    assert.equal(on.ok, false);
    assert.equal(on.snoozed, false);

    const after = evaluatePriceIndexAge(150, new Date("2026-11-01T13:00:00Z"));
    assert.equal(after.ok, false);
  });

  test("the snooze date is close enough to still be a snooze", () => {
    // A date set a year out would be a disabled monitor with extra steps.
    const until = new Date(`${PRICE_INDEX_SNOOZE_UNTIL}T00:00:00Z`).getTime();
    const set = new Date("2026-09-15T00:00:00Z").getTime();
    assert.ok((until - set) / 86_400_000 <= 30, "snooze longer than 30 days from when it was set");
  });
});
