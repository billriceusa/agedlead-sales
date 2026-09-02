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

  test("discloses the affiliate relationship before the first store link", () => {
    const html = buildOfferHtml(LABEL, SITE);
    const disclosure = html.indexOf("I am an affiliate");
    const firstStoreLink = html.indexOf("agedleadstore.com");
    assert.ok(disclosure > -1, "no affiliate disclosure in body");
    assert.ok(
      disclosure < firstStoreLink,
      "disclosure must appear above the first store link, not after it",
    );
  });

  test("has a subject and preview text", () => {
    assert.ok(OFFER_CONTENT.subject.length > 0);
    assert.ok(OFFER_CONTENT.previewText.length > 0);
  });
});
