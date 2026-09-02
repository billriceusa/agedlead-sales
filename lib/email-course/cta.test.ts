import { test, describe } from "node:test";
import assert from "node:assert/strict";
import { mortgageCourse } from "./mortgage";
import { insuranceCourse } from "./insurance";
import { homeServicesCourse } from "./home-services";
import type { CourseModule, EmailContext } from "./types";

const COURSES: [string, CourseModule][] = [
  ["mortgage", mortgageCourse],
  ["insurance", insuranceCourse],
  ["home-services", homeServicesCourse],
];

function ctx(vertical: EmailContext["vertical"]): EmailContext {
  return {
    firstName: "Bill",
    recipientEmail: "test@example.com",
    playbookUrl: "https://workagedleads.com/downloads/playbook.pdf",
    workbookUrl: "https://workagedleads.com/downloads/workbook.pdf",
    unsubscribeUrl: "https://workagedleads.com/api/flagship/unsubscribe?email=x",
    vertical,
  };
}

describe("flagship course store CTAs", () => {
  for (const [name, course] of COURSES) {
    const v = name as EmailContext["vertical"];

    test(`${name}: every email carries a store link in HTML and text`, () => {
      // Before 2026-09-02 only email 5 had one, and only in the HTML part —
      // plain-text readers of the final email got no link at all.
      for (const email of course.emails) {
        const html = email.buildHtml(ctx(v));
        const text = email.buildText(ctx(v));
        assert.match(html, /agedleadstore\.com/, `${name} day ${email.day}: no store link in HTML`);
        assert.match(text, /agedleadstore\.com/, `${name} day ${email.day}: no store link in text`);
      }
    });

    test(`${name}: each email is separately measurable`, () => {
      // utm_content is the only thing distinguishing five sends of the same
      // campaign. Duplicates would collapse the course into one unreadable row.
      const seen = course.emails.map((e) => {
        const m = e.buildHtml(ctx(v)).match(/utm_content=email-(\d+)/);
        assert.ok(m, `${name} day ${e.day}: no utm_content`);
        return m![1];
      });
      assert.deepEqual(seen, ["1", "2", "3", "4", "5"], `${name}: ${seen}`);
      assert.equal(new Set(seen).size, seen.length);
    });

    test(`${name}: HTML and text agree on which email they are`, () => {
      // They are maintained in parallel by hand. A mismatch would attribute a
      // plain-text click to the wrong lesson.
      for (const email of course.emails) {
        const h = email.buildHtml(ctx(v)).match(/utm_content=(email-\d+)/)?.[1];
        const t = email.buildText(ctx(v)).match(/utm_content=(email-\d+)/)?.[1];
        assert.equal(h, t, `${name} day ${email.day}: html=${h} text=${t}`);
      }
    });

    test(`${name}: every store link discloses the affiliate relationship`, () => {
      for (const email of course.emails) {
        assert.match(
          email.buildHtml(ctx(v)),
          /affiliate link/i,
          `${name} day ${email.day}: store link without disclosure`,
        );
        assert.match(email.buildText(ctx(v)), /affiliate link/i);
      }
    });

    test(`${name}: emits the current UTM source, not the retired brand`, () => {
      // The .md source of record carried utm_source=agedleadsales long after
      // the TS modules migrated, so record and reality disagreed.
      for (const email of course.emails) {
        assert.equal(
          /utm_source=agedleadsales\b/.test(email.buildHtml(ctx(v))),
          false,
          `${name} day ${email.day}: retired utm_source`,
        );
        assert.match(email.buildHtml(ctx(v)), /utm_source=workagedleads/);
      }
    });

    test(`${name}: no email invents a first-person purchase`, () => {
      // Bill is not currently an active lead buyer (confirmed 2026-09-02).
      for (const email of course.emails) {
        const body = email.buildHtml(ctx(v)) + email.buildText(ctx(v));
        for (const re of [/\bI buy\b/i, /\bwhere I (?:actually )?buy\b/i, /\bI'm an affiliate\b/i]) {
          assert.equal(re.test(body), false, `${name} day ${email.day} matched ${re}`);
        }
      }
    });

    test(`${name}: the CTA reason differs per email, so it is not five identical ads`, () => {
      // Same link five times with the same sentence is a banner. Tying it to
      // what each email taught is what makes it a pull rather than a push —
      // the distinction the store-side data turns on ($59-70/session for
      // chosen surfaces vs $0.96 for cta-banner).
      const lines = course.emails.map((e) => {
        const m = e.buildText(ctx(v)).split("\n").find((l) => l.includes("See aged"));
        return e.buildText(ctx(v)).slice(0, (m ? e.buildText(ctx(v)).indexOf(m) : 0));
      });
      const ctaSentences = course.emails.map((e) => {
        const t = e.buildText(ctx(v));
        const i = t.indexOf("See aged");
        return t.slice(Math.max(0, i - 200), i).trim().split("\n").filter(Boolean).pop() ?? "";
      });
      assert.equal(
        new Set(ctaSentences).size,
        ctaSentences.length,
        `${name}: repeated CTA copy — ${JSON.stringify(ctaSentences)}`,
      );
      assert.ok(lines.length === 5);
    });
  }
});
