import { test, describe } from "node:test";
import assert from "node:assert/strict";
import {
  buildLaunchHtml,
  MP_ANNOUNCEMENT,
  MP_LAUNCH_CAMPAIGN,
  MP_LAUNCH_EMAILS,
  MP_REMINDER,
} from "./mortgage-protection-launch";
import { LANDING_PAGES } from "./store-links";
import { checkIssueHtml } from "./issue-gate";
import { SENDER_POSTAL_ADDRESS } from "@/lib/sender";

const SITE = "https://workagedleads.com";

function urls(html: string): URL[] {
  return [...html.matchAll(/href="(https:\/\/[^"]+)"/g)].map(
    (m) => new URL(m[1].replace(/&amp;/g, "&")),
  );
}

function text(html: string): string {
  return html.replace(/<[^>]+>/g, " ");
}

/** Every rule runs against both emails. Either one can be the one that mails wrong. */
const BOTH = MP_LAUNCH_EMAILS.map((e) => [e.key, e] as const);

describe("mortgage protection launch emails", () => {
  test("both pass the gate the send path re-runs", () => {
    for (const [key, email] of BOTH) {
      const gate = checkIssueHtml(buildLaunchHtml(email, SITE));
      assert.equal(gate.ok, true, `${key}: ${gate.reason}`);
    }
  });

  test("neither quotes a price", () => {
    // The landing page shows $4.50 as a top price today. Prices move, and a
    // broadcast cannot be recalled.
    for (const [key, email] of BOTH) {
      assert.equal(/\$\s*\d/.test(buildLaunchHtml(email, SITE)), false, key);
    }
  });

  test("every store link is exactly the mortgage protection landing page, fully tagged", () => {
    // Bill asked for the landing page by name, with affiliate UTMs. A link to the
    // storefront app or the catalogue would be a different destination.
    const landing = new URL(LANDING_PAGES["mortgage-protection"]);
    for (const [key, email] of BOTH) {
      const store = urls(buildLaunchHtml(email, SITE)).filter((u) =>
        u.hostname.endsWith("agedleadstore.com"),
      );
      assert.ok(store.length >= 2, `${key}: expected a top and a bottom call to action`);
      for (const u of store) {
        assert.equal(u.origin + u.pathname, landing.origin + landing.pathname, `${key}: ${u.href}`);
        assert.equal(u.searchParams.get("utm_source"), "workagedleads", u.href);
        assert.equal(u.searchParams.get("utm_medium"), "email", u.href);
        assert.equal(u.searchParams.get("utm_campaign"), MP_LAUNCH_CAMPAIGN, u.href);
        assert.ok(u.searchParams.get("utm_content"), u.href);
      }
    }
  });

  test("utm_content is distinct per link and carries the send label and email", () => {
    // Two emails in one campaign: the content tag is what separates the
    // announcement's clicks from the reminder's.
    const all: string[] = [];
    for (const [key, email] of BOTH) {
      const contents = urls(buildLaunchHtml(email, SITE))
        .filter((u) => u.hostname.endsWith("agedleadstore.com"))
        .map((u) => u.searchParams.get("utm_content") ?? "");
      for (const c of contents) {
        assert.ok(c.startsWith(`${email.label}-${key}-`), `${key}: ${c}`);
      }
      all.push(...contents);
    }
    assert.equal(new Set(all).size, all.length, "duplicate utm_content across the two emails");
  });

  test("the two emails send on the agreed days, announcement first", () => {
    assert.equal(MP_ANNOUNCEMENT.label, "2026-09-23");
    assert.equal(MP_REMINDER.label, "2026-09-25");
    assert.equal(new Date(`${MP_ANNOUNCEMENT.label}T00:00:00Z`).getUTCDay(), 3, "announcement is not a Wednesday");
    assert.equal(new Date(`${MP_REMINDER.label}T00:00:00Z`).getUTCDay(), 5, "reminder is not a Friday");
  });

  test("the age bands match the landing page", () => {
    // Verified on the live page 2026-09-15: 3 to 30, 31 to 85, 86 to 365 days.
    const body = text(buildLaunchHtml(MP_ANNOUNCEMENT, SITE));
    for (const band of ["3 to 30 days", "31 to 85 days", "86 to 365 days"]) {
      assert.ok(body.includes(band), `missing band: ${band}`);
    }
  });

  test("neither makes a homeowner verification claim", () => {
    // Bill, 2026-09-15: left out entirely. The newest band may not be checked yet.
    for (const [key, email] of BOTH) {
      const body = text(buildLaunchHtml(email, SITE));
      assert.equal(/verif/i.test(body), false, `${key} mentions verification`);
      assert.equal(/\brenters?\b/i.test(body), false, `${key} mentions renters`);
    }
  });

  test("neither invents urgency", () => {
    const urgency = [
      /\blimited\b/i,
      /\bhurry\b/i,
      /\blast chance\b/i,
      /\bwhile (?:supplies|stocks?) last\b/i,
      /\bact (?:now|fast)\b/i,
      /\bdon'?t miss\b/i,
      /\bends? (?:today|tonight|soon|this week|friday|sunday)\b/i,
      /\bselling out\b/i,
    ];
    for (const [key, email] of BOTH) {
      const body = text(buildLaunchHtml(email, SITE));
      for (const re of urgency) assert.equal(re.test(body), false, `${key} matched ${re}`);
    }
  });

  test("neither narrates the send sequence", () => {
    // The reminder must stand alone. Readers are not shown that a second email
    // follows the first.
    const leaks = [
      /\bwednesday\b/i,
      /\bfriday\b/i,
      /\bin case you missed\b/i,
      /\breminder\b/i,
      /\bearlier this week\b/i,
      /\bmy (?:last|previous) (?:email|note)\b/i,
      /\bthis email\b/i,
    ];
    for (const [key, email] of BOTH) {
      const body = text(buildLaunchHtml(email, SITE));
      for (const re of leaks) assert.equal(re.test(body), false, `${key} matched ${re}`);
    }
  });

  test("neither makes a first-person claim about buying leads", () => {
    const claims = [/\bI buy\b/i, /\bI order\b/i, /\bI purchase\b/i, /\bmy (?:lead )?(?:orders?|supplier)\b/i];
    for (const [key, email] of BOTH) {
      const html = buildLaunchHtml(email, SITE);
      for (const re of claims) assert.equal(re.test(html), false, `${key} matched ${re}`);
    }
  });

  test("both disclose the affiliate relationship, briefly", () => {
    for (const [key, email] of BOTH) {
      const html = buildLaunchHtml(email, SITE);
      assert.match(html, /at no cost to you/i, key);
      assert.ok((html.match(/affiliate/gi) ?? []).length <= 3, `${key}: do not dwell on the disclosure`);
    }
  });

  test("both carry the sender's physical postal address", () => {
    // CAN-SPAM, 15 U.S.C. § 7704(a)(5)(A)(iii).
    for (const [key, email] of BOTH) {
      assert.ok(buildLaunchHtml(email, SITE).includes(SENDER_POSTAL_ADDRESS), key);
    }
  });

  test("both keep the unsubscribe merge tag intact", () => {
    for (const [key, email] of BOTH) {
      assert.ok(buildLaunchHtml(email, SITE).includes("{{{RESEND_UNSUBSCRIBE_URL}}}"), key);
    }
  });

  test("site links come from the passed origin", () => {
    for (const [key, email] of BOTH) {
      const html = buildLaunchHtml(email, "https://example.test");
      assert.equal(html.includes("workagedleads.com/"), false, `${key} hardcodes a host`);
      assert.ok(html.includes("https://example.test/calculators"), key);
    }
  });

  test("the footer does not claim a site signup these readers never made", () => {
    // This audience asked the store for leads; they did not sign up on our site.
    for (const [key, email] of BOTH) {
      assert.equal(/signed up at/i.test(buildLaunchHtml(email, SITE)), false, key);
    }
  });
});
