import { test } from "node:test";
import assert from "node:assert/strict";

import { isAffiliateHost, normalizeAffiliateHref } from "./affiliate-link-normalizer";

const OPTS = { campaign: "blog-post", content: "body-link" };

function params(url: string) {
  return Object.fromEntries(new URL(url).searchParams.entries());
}

// ---------------------------------------------------------------------------
// The four real failure modes found in the 2026-08-26 crawl
// ---------------------------------------------------------------------------

test("repairs ?ref=howtoworkleads — 27 links, the largest single leak", () => {
  const out = normalizeAffiliateHref("https://agedleadstore.com/?ref=howtoworkleads", OPTS);
  assert.ok(out);
  assert.deepEqual(params(out!), {
    utm_source: "workagedleads",
    utm_medium: "affiliate",
    utm_campaign: "blog-post",
    utm_content: "body-link",
  });
  assert.doesNotMatch(out!, /ref=/);
});

test("repairs a bare untagged URL — invisible to the invoice filter", () => {
  const out = normalizeAffiliateHref("https://agedleadstore.com/all-lead-types/", OPTS);
  assert.ok(out);
  assert.match(out!, /utm_source=workagedleads/);
  assert.match(out!, /\/all-lead-types\//);
});

test("repairs utm_source=howtoworkleads, which credits the retired property", () => {
  const out = normalizeAffiliateHref(
    "https://agedleadstore.com/life-insurance-leads/?utm_source=howtoworkleads&utm_medium=blog&utm_campaign=x",
    OPTS
  );
  assert.ok(out);
  assert.match(out!, /utm_source=workagedleads/);
  assert.doesNotMatch(out!, /howtoworkleads/);
  assert.doesNotMatch(out!, /utm_medium=blog/);
});

test("repairs a campaign-only link with no source or medium", () => {
  const out = normalizeAffiliateHref(
    "https://agedleadstore.com/?utm_campaign=build-sales-team",
    OPTS
  );
  assert.ok(out);
  assert.equal(params(out!).utm_campaign, "blog-post");
  assert.equal(params(out!).utm_medium, "affiliate");
});

// ---------------------------------------------------------------------------
// What it must NOT touch
// ---------------------------------------------------------------------------

test("leaves internal and third-party links alone", () => {
  assert.equal(normalizeAffiliateHref("/providers", OPTS), null);
  assert.equal(normalizeAffiliateHref("https://theleadswarehouse.com/", OPTS), null);
  assert.equal(normalizeAffiliateHref("https://workagedleads.com/blog", OPTS), null);
  assert.equal(normalizeAffiliateHref("mailto:bill@workagedleads.com", OPTS), null);
  assert.equal(normalizeAffiliateHref(undefined, OPTS), null);
  assert.equal(normalizeAffiliateHref("", OPTS), null);
  assert.equal(normalizeAffiliateHref("not a url", OPTS), null);
});

test("does not be fooled by a lookalike host", () => {
  // A domain that merely ENDS with the brand must not match.
  assert.equal(isAffiliateHost("notagedleadstore.com"), false);
  assert.equal(normalizeAffiliateHref("https://notagedleadstore.com/x", OPTS), null);
  assert.equal(isAffiliateHost("agedleadstore.com.evil.net"), false);
});

test("preserves the author's chosen destination path exactly", () => {
  // Remapping a destination would override an editorial decision. This function
  // only ever rewrites the query string.
  const out = normalizeAffiliateHref(
    "https://agedleadstore.com/mortgage-leads-purchase-refinance/?ref=howtoworkleads",
    OPTS
  );
  assert.match(out!, /\/mortgage-leads-purchase-refinance\//);
});

// ---------------------------------------------------------------------------
// Host and shape handling
// ---------------------------------------------------------------------------

test("normalises www to the apex", () => {
  const out = normalizeAffiliateHref("https://www.agedleadstore.com/aca-leads/", OPTS);
  assert.ok(out!.startsWith("https://agedleadstore.com/aca-leads/"));
});

test("upgrades a plain-http affiliate link to https", () => {
  const out = normalizeAffiliateHref("http://agedleadstore.com/all-lead-types/", OPTS);
  assert.ok(out!.startsWith("https://agedleadstore.com/"));
});

test("keeps a non-apex subdomain's host but still tags it", () => {
  // House rule sends CTAs to marketing pages, not the store UI — but silently
  // redirecting an author's destination is the wrong fix. Credit it, flag it.
  const out = normalizeAffiliateHref("https://store.agedleadstore.com/customers/x", OPTS);
  assert.ok(out);
  assert.match(out!, /^https:\/\/store\.agedleadstore\.com\/customers\/x\?/);
  assert.match(out!, /utm_source=workagedleads/);
});

test("preserves a fragment", () => {
  const out = normalizeAffiliateHref("https://agedleadstore.com/all-lead-types/#pricing", OPTS);
  assert.ok(out!.endsWith("#pricing"));
});

test("defaults content to body-link when not supplied", () => {
  const out = normalizeAffiliateHref("https://agedleadstore.com/", { campaign: "guide" });
  assert.equal(params(out!).utm_content, "body-link");
  assert.equal(params(out!).utm_campaign, "guide");
});

test("is idempotent — re-normalising an already-correct link is a no-op", () => {
  const once = normalizeAffiliateHref("https://agedleadstore.com/aca-leads/", OPTS)!;
  const twice = normalizeAffiliateHref(once, OPTS)!;
  assert.equal(once, twice);
});
