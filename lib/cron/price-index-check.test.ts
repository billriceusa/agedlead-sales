import { test, describe } from "node:test";
import assert from "node:assert/strict";
import {
  evaluatePriceIndexAge,
  PRICE_INDEX_MAX_AGE_DAYS,
  PRICE_INDEX_SNOOZE_UNTIL,
  latestPublishedMonth,
  studyAgeDays,
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

describe("measuring the PUBLISHED study, not the Sanity docs", () => {
  /**
   * The 2026-10-07 bug. The health check read Sanity's machine-written
   * priceBenchmark docs (newest 2026-06-01, 128 days) while the study readers
   * actually see — data/price-benchmarks.ts — was month 2026-03, 220 days old.
   * The daily alert reported the comfortable number, understating the staleness
   * of the published artifact by 92 days.
   */
  test("picks the newest month from the published set", () => {
    assert.equal(
      latestPublishedMonth([{ month: "2026-03" }, { month: "2026-01" }, { month: "2026-02" }]),
      "2026-03",
    );
  });

  test("dedupes - a study has many benchmarks sharing one month", () => {
    const many = Array.from({ length: 42 }, () => ({ month: "2026-03" }));
    assert.equal(latestPublishedMonth(many), "2026-03");
  });

  test("returns null for an empty set rather than throwing", () => {
    assert.equal(latestPublishedMonth([]), null);
  });

  test("sorts correctly across a year boundary", () => {
    assert.equal(
      latestPublishedMonth([{ month: "2026-09" }, { month: "2026-10" }, { month: "2025-12" }]),
      "2026-10",
    );
  });

  test("age is measured from the FIRST of the month, the conservative reading", () => {
    assert.equal(studyAgeDays("2026-03", new Date("2026-03-31T00:00:00Z")), 30);
  });

  test("reproduces the exact understatement that motivated this", () => {
    const now = new Date("2026-10-07T13:00:00Z");
    const published = studyAgeDays("2026-03", now); // what readers see
    const sanityDocs = studyAgeDays("2026-06", now); // what the check used to read
    assert.equal(published, 220);
    assert.ok(
      published - sanityDocs > 80,
      `published study was ${published - sanityDocs}d older than the docs being measured`,
    );
  });

  test("a published study that is current reports ok", () => {
    const now = new Date("2026-10-07T00:00:00Z");
    const age = studyAgeDays("2026-10", now);
    assert.equal(evaluatePriceIndexAge(age, now).ok, true);
  });

  test("rejects a malformed month instead of silently returning NaN days", () => {
    assert.throws(() => studyAgeDays("March 2026", new Date()), /YYYY-MM/);
  });
});
