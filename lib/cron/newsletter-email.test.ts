import { test, describe } from "node:test";
import assert from "node:assert/strict";
import { buildNewsletterHtml } from "./newsletter-email";
import type { NewsletterContent } from "./newsletter-ai";

const SITE = "https://workagedleads.com";
const WEEK = "2026-09-08";

const content: NewsletterContent = {
  subject: "Test issue",
  previewText: "Preview",
  personalIntro: "Para one.\n\nPara two.",
  featuredArticle: {
    title: "How to work aged leads",
    slug: "how-to-work-aged-leads",
    spotlight: "A spotlight.",
  },
  quickTips: [
    { title: "Tip one", body: "Body one." },
    { title: "Tip two", body: "Body two." },
  ],
  weeklyDigest: [
    { title: "Post A", slug: "post-a", oneLiner: "One." },
    { title: "Post B", slug: "post-b", oneLiner: "Two." },
  ],
  industryInsight: { headline: "Headline", body: "Body." },
  closingNote: "Closing.",
} as NewsletterContent;

function links(html: string): URL[] {
  return [...html.matchAll(/href="(https:\/\/[^"]+)"/g)].map(
    (m) => new URL(m[1].replace(/&amp;/g, "&")),
  );
}

describe("newsletter site-link tagging", () => {
  test("no link back to our own site is untagged", () => {
    // Fifteen of twenty-seven links used to point home with no UTMs, so blog
    // traffic the newsletter drove arrived as direct/organic and the weekly
    // report's sessionMedium=email filter could never see it. Doing work with
    // no credit looks exactly like doing none.
    const html = buildNewsletterHtml(content, SITE, WEEK);
    const own = links(html).filter((u) => u.origin === SITE);
    assert.ok(own.length > 0, "expected site links in the issue");
    for (const u of own) {
      assert.equal(
        u.searchParams.get("utm_medium"),
        "email",
        `untagged site link: ${u.pathname}`,
      );
      assert.equal(u.searchParams.get("utm_campaign"), "weekly-newsletter", u.pathname);
      assert.ok(u.searchParams.get("utm_content"), `no utm_content: ${u.pathname}`);
    }
  });

  test("every site link carries the issue label in utm_content", () => {
    const html = buildNewsletterHtml(content, SITE, WEEK);
    for (const u of links(html).filter((x) => x.origin === SITE)) {
      assert.ok(
        (u.searchParams.get("utm_content") ?? "").startsWith(`${WEEK}-`),
        `${u.pathname}: ${u.searchParams.get("utm_content")}`,
      );
    }
  });

  test("distinct placements are distinguishable, not collapsed into one row", () => {
    // The footer and the featured button both point at the site; if they shared
    // a utm_content the report could not tell a skim from a click-through.
    const html = buildNewsletterHtml(content, SITE, WEEK);
    const contents = links(html)
      .filter((u) => u.origin === SITE)
      .map((u) => `${u.pathname}|${u.searchParams.get("utm_content")}`);
    assert.equal(new Set(contents).size, contents.length, contents.join("\n"));
  });

  test("store links keep their own campaign, unchanged", () => {
    // Site links must not be mistaken for store links. They answer different
    // questions and only one of them earns.
    const html = buildNewsletterHtml(content, SITE, WEEK);
    const store = links(html).filter((u) => u.hostname.endsWith("agedleadstore.com"));
    assert.ok(store.length > 0, "expected store links");
    for (const u of store) {
      assert.equal(u.searchParams.get("utm_source"), "workagedleads", u.href);
      assert.equal(u.searchParams.get("utm_medium"), "email", u.href);
    }
  });

  test("site links are not tagged as the affiliate source", () => {
    const html = buildNewsletterHtml(content, SITE, WEEK);
    for (const u of links(html).filter((x) => x.origin === SITE)) {
      assert.notEqual(u.searchParams.get("utm_medium"), "affiliate", u.pathname);
    }
  });
});
