import { test, describe } from "node:test";
import assert from "node:assert/strict";
import { issueLabelFor } from "./issue-date";

/**
 * The regression these lock down cost a real send: on Tuesday 2026-09-08 the
 * send cron asked for `2026-09-08`, the archive was named `2026-09-07`, and the
 * route reported `ok` because "no issue for this date" is the ordinary case on
 * most days. 2,628 people did not get an issue that was drafted, gated and
 * ready.
 */
describe("issueLabelFor", () => {
  test("Tuesday resolves to the Monday the drafting cron archived under", () => {
    // The exact miss. 2026-09-08 was a Tuesday; the archive is 2026-09-07.
    assert.equal(issueLabelFor(new Date("2026-09-08T13:00:00Z")), "2026-09-07");
  });

  test("Monday resolves to itself", () => {
    assert.equal(issueLabelFor(new Date("2026-09-07T14:00:00Z")), "2026-09-07");
  });

  test("Sunday goes back six days, not forward and not one", () => {
    // getUTCDay() is 0 on Sunday. A naive `day - 1` would land on Saturday and
    // skip the week; a naive `day` would stay on Sunday. Both are wrong.
    assert.equal(issueLabelFor(new Date("2026-09-13T14:00:00Z")), "2026-09-07");
  });

  test("every day of one week maps to that week's Monday", () => {
    const week = [
      "2026-09-07", // Mon
      "2026-09-08", // Tue
      "2026-09-09", // Wed
      "2026-09-10", // Thu
      "2026-09-11", // Fri
      "2026-09-12", // Sat
      "2026-09-13", // Sun
    ];
    for (const day of week) {
      assert.equal(
        issueLabelFor(new Date(`${day}T12:00:00Z`)),
        "2026-09-07",
        `${day} should resolve to 2026-09-07`,
      );
    }
  });

  test("crosses a month boundary correctly", () => {
    // 2026-09-01 was a Tuesday; its Monday is in August.
    assert.equal(issueLabelFor(new Date("2026-09-01T13:00:00Z")), "2026-08-31");
  });

  test("uses UTC, not the host timezone", () => {
    // 2026-09-08T00:30Z is still Monday evening in New York. The cron runs in
    // UTC and the archive is named in UTC, so this must resolve to the Monday.
    assert.equal(issueLabelFor(new Date("2026-09-08T00:30:00Z")), "2026-09-07");
    // And late Monday UTC is still the same label.
    assert.equal(issueLabelFor(new Date("2026-09-07T23:59:00Z")), "2026-09-07");
  });

  test("matches the labels actually on disk", () => {
    // Every recurring archive is Monday-named. Sampling the real ones proves
    // the resolver agrees with the drafting side's `fmt(monday)`.
    for (const label of ["2026-08-10", "2026-08-17", "2026-08-31", "2026-09-07"]) {
      assert.equal(
        issueLabelFor(new Date(`${label}T14:00:00Z`)),
        label,
        `${label} is a Monday archive label and must resolve to itself`,
      );
    }
  });
});
