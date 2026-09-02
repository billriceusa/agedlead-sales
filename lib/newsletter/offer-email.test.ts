import { test, describe } from "node:test";
import assert from "node:assert/strict";
import { buildOfferHtml, OFFER_CAMPAIGN, OFFER_CONTENT } from "./offer-email";
import { STORE_VERTICALS } from "./store-links";
import { checkIssueHtml } from "./issue-gate";

const LABEL = "2026-09-10";
const SITE = "https://workagedleads.com";

function urls(html: string): URL[] {
  return [...html.matchAll(/href="(https:\/\/[^"]+)"/g)].map((m) => new URL(m[1].replace(/&amp;/g, "&")));
}

describe("buildOfferHtml", () => {
  test("passes the same gate the sender re-runs at transmission", () => {
    // The offer is mailed through scripts/send-newsletter.ts, which re-scans the
    // archived bytes. If this template could ever fail that gate, the failure
    // would surface at send time on an issue already reviewed — the worst
    // possible moment. Catch it here instead.
    const gate = checkIssueHtml(buildOfferHtml(LABEL, SITE));
    assert.equal(gate.ok, true, gate.reason);
  });

  test("quotes no price", () => {
    // Partner pricing is Troy's to publish and it moves. The 2026-08-10 issue
    // quoted "$0.25" against a real $0.40 floor and was mailed before anyone
    // noticed, which is why the gate above exists at all.
    const html = buildOfferHtml(LABEL, SITE);
    assert.equal(/\$\s*\d/.test(html), false, "offer email must not contain a dollar figure");
  });

  test("offers every vertical the partner actually stocks", () => {
    const html = buildOfferHtml(LABEL, SITE);
    for (const v of STORE_VERTICALS) {
      assert.ok(html.includes(v.label), `missing vertical button: ${v.label}`);
      assert.ok(
        html.includes(`/${v.segment}/leads`),
        `missing storefront segment for ${v.label}: ${v.segment}`,
      );
    }
  });

  test("every store link is tagged to the offer campaign, not the newsletter", () => {
    // Tagging this one-off as `weekly-newsletter` would average it into the
    // Tuesday trend line and neither send could be read afterwards.
    const store = urls(buildOfferHtml(LABEL, SITE)).filter((u) =>
      u.hostname.endsWith("agedleadstore.com"),
    );
    assert.ok(store.length >= STORE_VERTICALS.length, "expected one link per vertical, plus catalogue");
    for (const u of store) {
      assert.equal(u.searchParams.get("utm_campaign"), OFFER_CAMPAIGN, u.href);
      assert.equal(u.searchParams.get("utm_medium"), "email", u.href);
    }
  });

  test("every store link gets a distinct utm_content", () => {
    // Two verticals legitimately share a destination — the partner maps Final
    // Expense onto life_insurance — so the URLs are not unique and the
    // placement tag is the only thing separating them in GA4.
    const contents = urls(buildOfferHtml(LABEL, SITE))
      .filter((u) => u.hostname.endsWith("agedleadstore.com"))
      .map((u) => u.searchParams.get("utm_content"));
    assert.equal(new Set(contents).size, contents.length);
  });

  test("carries the send label so the archive and the report can be joined", () => {
    const contents = urls(buildOfferHtml(LABEL, SITE))
      .filter((u) => u.hostname.endsWith("agedleadstore.com"))
      .map((u) => u.searchParams.get("utm_content") ?? "");
    assert.ok(contents.length > 0);
    assert.ok(contents.every((c) => c.startsWith(`${LABEL}-`)), contents.join(", "));
  });

  test("builds site links from the passed origin, never a hardcoded host", () => {
    // lib/site-url.ts exists because a `www.agedleadsales.com` fallback drifted
    // into a live mailer once. A template that hardcodes a host mails dead links.
    const html = buildOfferHtml(LABEL, "https://example.test");
    assert.equal(html.includes("agedleadsales.com"), false);
    assert.ok(html.includes("https://example.test/calculators/know-your-cpl"));
  });

  test("keeps the unsubscribe merge tag intact", () => {
    // Resend resolves this only on a broadcast. If it is ever escaped or
    // renamed, every recipient gets a dead unsubscribe link — CAN-SPAM, not
    // cosmetics.
    assert.ok(buildOfferHtml(LABEL, SITE).includes("{{{RESEND_UNSUBSCRIBE_URL}}}"));
  });

  test("makes no first-person claim about buying leads", () => {
    // Bill is NOT currently an active lead buyer (confirmed 2026-09-02). The
    // first version of this email said "where I actually buy" and "I buy from
    // Aged Lead Store" — both invented, and both mailed before anyone caught
    // it. The AI newsletter prompt has banned fabricated first-person
    // experience for months; this template is hand-written and inherited none
    // of that, exactly like the price guard that only ran on the draft path.
    const html = buildOfferHtml(LABEL, SITE);
    const claims = [
      /\bI buy\b/i,
      /\bI (?:re)?stock\b/i,
      /\bI order\b/i,
      /\bI purchase\b/i,
      /\bwhere I (?:actually )?(?:buy|shop|restock)\b/i,
      /\bI am an affiliate\b/i,
      /\bI'm an affiliate\b/i,
      /\bmy (?:lead )?(?:orders?|buys?|supplier)\b/i,
    ];
    for (const re of claims) {
      assert.equal(re.test(html), false, `first-person purchasing claim matched ${re}`);
    }
  });

  test("discloses the affiliate relationship, briefly", () => {
    // Disclosure is required and must stay. But the earlier draft gave it a
    // whole paragraph, which made the commission arrangement the subject of
    // the email instead of the reader's pipeline. Present, short, near the
    // links — not the emotional centre.
    const html = buildOfferHtml(LABEL, SITE);
    assert.match(html, /affiliate link/i, "no affiliate disclosure present");
    assert.match(html, /at no cost to you/i, "disclosure omits the no-cost clause");
    const mentions = (html.match(/affiliate/gi) ?? []).length;
    assert.ok(
      mentions <= 3,
      `affiliate mentioned ${mentions} times — disclose once or twice, do not dwell`,
    );
  });

  test("is written to the reader, not about Bill", () => {
    // The value proposition is the READER's pipeline. Bill's authority comes
    // from 25+ years building lead programs, not from being a customer.
    const html = buildOfferHtml(LABEL, SITE);
    const body = html.replace(/<[^>]+>/g, " ");
    const you = (body.match(/\b(?:you|your)\b/gi) ?? []).length;
    const i = (body.match(/\bI\b/g) ?? []).length;
    assert.ok(you > i, `reader-centric check: "you" ${you} vs "I" ${i}`);
  });

  test("leaks no strategy or internal reasoning to the reader", () => {
    // The subhead once read "One email, one job. Back to the usual Tuesday next
    // week." — design notes printed at the top of a sales email. Bill: "You
    // basically told the reader — I'm sending you an email to get your click.
    // Ugh! Yuck!" The reader must never be shown the machinery.
    const html = buildOfferHtml(LABEL, SITE);
    const leaks = [
      /one email,? one job/i,
      /\bthis email (?:is|has|does|exists)/i,
      /\bback to the usual\b/i,
      /\b(?:we|I) (?:want|need) (?:your|a) click/i,
      /\bcall.to.action\b/i,
      /\bwe(?:'re| are) testing\b/i,
      /\bour (?:strategy|goal|objective) (?:here|with this)/i,
      /\bkeeping this short so\b/i,
      /\bthe (?:point|purpose) of this email\b/i,
    ];
    for (const re of leaks) {
      assert.equal(re.test(html), false, `strategy leak matched ${re}`);
    }
  });

  test("makes the consistency argument, not a cheapness argument", () => {
    const html = buildOfferHtml(LABEL, SITE);
    assert.match(html, /consistent|steady|sustain/i, "missing the consistency framing");
  });

  test("has a subject and preview text", () => {
    assert.ok(OFFER_CONTENT.subject.length > 0);
    assert.ok(OFFER_CONTENT.previewText.length > 0);
  });
});
