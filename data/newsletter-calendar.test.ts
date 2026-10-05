import { test, describe } from "node:test";
import assert from "node:assert/strict";
import {
  NEWSLETTER_CALENDAR,
  findPlanForDate,
  calendarStatus,
} from "./newsletter-calendar";

describe("NEWSLETTER_CALENDAR shape", () => {
  test("is not empty", () => {
    assert.ok(NEWSLETTER_CALENDAR.length > 0);
  });

  test("every sendDate is a Tuesday", () => {
    // The cron computes the upcoming Tuesday and matches on it exactly. One
    // entry on a Wednesday is an issue that silently never gets its theme.
    for (const p of NEWSLETTER_CALENDAR) {
      const d = new Date(`${p.sendDate}T12:00:00Z`);
      assert.equal(
        d.getUTCDay(),
        2,
        `${p.sendDate} ("${p.theme}") is not a Tuesday`,
      );
    }
  });

  test("sendDates are unique, ascending, and exactly one week apart", () => {
    const dates = NEWSLETTER_CALENDAR.map((p) => p.sendDate);
    assert.equal(new Set(dates).size, dates.length, "duplicate sendDate");
    assert.deepEqual(dates, [...dates].sort(), "not in ascending order");
    for (let i = 1; i < dates.length; i++) {
      const gap =
        (new Date(dates[i]).getTime() - new Date(dates[i - 1]).getTime()) /
        86_400_000;
      assert.equal(gap, 7, `${dates[i - 1]} -> ${dates[i]} is ${gap} days, not 7`);
    }
  });

  test("every entry carries a theme and at least one tip topic", () => {
    for (const p of NEWSLETTER_CALENDAR) {
      assert.ok(p.theme.trim().length > 0, `${p.sendDate} has no theme`);
      assert.ok(
        p.exclusiveTipTopics.length > 0,
        `${p.sendDate} has no tip topics`,
      );
    }
  });

  test("week numbers are unique", () => {
    const weeks = NEWSLETTER_CALENDAR.map((p) => p.week);
    assert.equal(new Set(weeks).size, weeks.length);
  });
});

describe("findPlanForDate", () => {
  test("matches an exact date", () => {
    const first = NEWSLETTER_CALENDAR[0];
    assert.equal(findPlanForDate(first.sendDate)?.theme, first.theme);
  });

  test("does NOT match a nearby date", () => {
    // The old lookup matched anything within seven days. Because plans are
    // weekly, that window could return the PREVIOUS week's plan for a send —
    // a stale theme that reads as deliberate, which is worse than no theme.
    const first = NEWSLETTER_CALENDAR[0];
    const dayBefore = new Date(new Date(first.sendDate).getTime() - 86_400_000)
      .toISOString()
      .slice(0, 10);
    const dayAfter = new Date(new Date(first.sendDate).getTime() + 86_400_000)
      .toISOString()
      .slice(0, 10);
    assert.equal(findPlanForDate(dayBefore), undefined);
    assert.equal(findPlanForDate(dayAfter), undefined);
  });

  test("returns undefined past the end of the calendar", () => {
    assert.equal(findPlanForDate("2099-01-06"), undefined);
  });
});

describe("calendarStatus", () => {
  test("a matched date names the theme", () => {
    const first = NEWSLETTER_CALENDAR[0];
    const s = calendarStatus(first.sendDate);
    assert.equal(s.matched, true);
    assert.equal(s.plan?.sendDate, first.sendDate);
    assert.ok(s.message.includes(first.theme));
  });

  test("an uncovered date says so loudly and explains the consequence", () => {
    // This is the whole point of the module. The calendar expired 2026-06-02
    // and 13 consecutive issues were drafted with no plan, archived as
    // "AI-generated", with nothing anywhere reporting it. Silence was the bug.
    const s = calendarStatus("2099-01-06");
    assert.equal(s.matched, false);
    assert.equal(s.plan, undefined);
    assert.match(s.message, /NO CALENDAR PLAN/);
    assert.match(s.message, /invent/i);
  });

  test("counts remaining issues, excluding the one being sent", () => {
    const first = NEWSLETTER_CALENDAR[0];
    assert.equal(
      calendarStatus(first.sendDate).remaining,
      NEWSLETTER_CALENDAR.length - 1,
    );
  });

  test("warns when the calendar is nearly exhausted", () => {
    const last = NEWSLETTER_CALENDAR[NEWSLETTER_CALENDAR.length - 1];
    const s = calendarStatus(last.sendDate);
    assert.equal(s.remaining, 0);
    assert.match(s.message, /LAST issue/);
  });

  test("reports the last covered date so the gap is actionable", () => {
    const last = NEWSLETTER_CALENDAR[NEWSLETTER_CALENDAR.length - 1];
    assert.equal(calendarStatus("2099-01-06").lastDate, last.sendDate);
    assert.ok(calendarStatus("2099-01-06").message.includes(last.sendDate));
  });
});

describe("forward coverage — the tripwire for a silently expiring calendar", () => {
  /**
   * WHY THIS TEST CAN FAIL ON A DAY NOBODY TOUCHED THE CODE
   *
   * That is the point. When the last calendar ran out on 2026-06-02, thirteen
   * consecutive issues went out with a theme the model invented, and nothing
   * anywhere said so — `calendarStatus()` only speaks through a banner in the
   * preview email, which depends on a human reading it.
   *
   * This asserts the calendar still covers the next four Tuesdays. It starts
   * failing about a month before the calendar actually runs dry, which is the
   * loud, early warning the banner never was. If it fails: add entries to
   * NEWSLETTER_CALENDAR. Do not widen the window to make it pass.
   */
  const WEEKS_OF_COVER = 4;

  test(`covers the next ${WEEKS_OF_COVER} Tuesdays`, () => {
    const now = new Date();
    const uncovered: string[] = [];

    for (let i = 0; i < WEEKS_OF_COVER; i++) {
      const d = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
      // Next Tuesday (today, if today is a Tuesday), then weekly from there.
      d.setUTCDate(d.getUTCDate() + ((2 - d.getUTCDay() + 7) % 7) + i * 7);
      const iso = d.toISOString().slice(0, 10);
      if (!findPlanForDate(iso)) uncovered.push(iso);
    }

    assert.deepEqual(
      uncovered,
      [],
      `NEWSLETTER_CALENDAR has no plan for ${uncovered.join(", ")}. ` +
        `The calendar runs through ${NEWSLETTER_CALENDAR[NEWSLETTER_CALENDAR.length - 1].sendDate}. ` +
        `Add entries in data/newsletter-calendar.ts — an issue with no plan gets a theme the model made up.`,
    );
  });
});
