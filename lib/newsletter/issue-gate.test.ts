import { test, describe } from "node:test";
import assert from "node:assert/strict";
import { readFileSync, existsSync } from "node:fs";
import { join } from "node:path";
import { checkIssueHtml, assertIssueHtml } from "./issue-gate";

const ARCHIVE = join(process.cwd(), "data", "newsletter-archive");

describe("checkIssueHtml", () => {
  test("blocks the issue that actually reached the list", () => {
    // This is the whole reason the gate exists. data/newsletter-archive/
    // 2026-08-10.html quotes "$0.30" in the featured-article blurb and
    // "Aged leads from $0.25" in the closing CTA, and its JSON records
    // sent: true on 2026-08-12 under broadcast a830c99a. The price guard
    // already existed; it was wired only into the draft script, which is not
    // the path that produced or mailed this file.
    //
    // If this test ever goes green-by-vacuity because the archive was deleted,
    // the assertion below fails loudly rather than silently passing.
    const path = join(ARCHIVE, "2026-08-10.html");
    assert.ok(existsSync(path), "the 2026-08-10 archive is the regression fixture");

    const gate = checkIssueHtml(readFileSync(path, "utf8"));
    assert.equal(gate.ok, false);
    assert.ok(gate.blocking.includes("$0.30"), gate.blocking.join(","));
    assert.ok(gate.blocking.includes("$0.25"), gate.blocking.join(","));
    assert.match(gate.reason ?? "", /per-lead price/);
  });

  test("passes the issue that was drafted after the guard landed", () => {
    // 2026-08-31 went out on 2026-09-01 having been drafted through
    // scripts/draft-newsletter.ts, which did run the scanner. It should still
    // pass the stricter gate, or the gate is too aggressive to deploy.
    const path = join(ARCHIVE, "2026-08-31.html");
    assert.ok(existsSync(path));

    const gate = checkIssueHtml(readFileSync(path, "utf8"));
    assert.equal(gate.ok, true, gate.reason);
    assert.deepEqual(gate.blocking, []);
  });

  test("warns, but does not block, when the issue has no store link", () => {
    // An issue that earns nothing is a wasted send, not a broken promise to a
    // buyer. Blocking would be a new way to lose a week.
    const gate = checkIssueHtml("<p>All site links today.</p>");
    assert.equal(gate.ok, true);
    assert.ok(gate.warnings.some((w) => /cannot earn/.test(w)));
  });

  test("flags duplicate utm_content, which GA4 would silently merge", () => {
    const html = `
      <a href="https://store.agedleadstore.com/a/leads?utm_content=2026-09-08-hero">a</a>
      <a href="https://store.agedleadstore.com/b/leads?utm_content=2026-09-08-hero">b</a>`;
    const gate = checkIssueHtml(html);
    assert.equal(gate.ok, true, "a measurement collision is not worth losing an issue over");
    assert.ok(gate.warnings.some((w) => w.includes("2026-09-08-hero")));
  });

  test("distinct placements on the same host do not warn", () => {
    const html = `
      <a href="https://store.agedleadstore.com/a/leads?utm_content=2026-09-08-hero">a</a>
      <a href="https://agedleadstore.com/all-lead-types/?utm_content=2026-09-08-footer">b</a>`;
    const gate = checkIssueHtml(html);
    assert.deepEqual(gate.warnings, []);
  });

  test("a tracking URL containing 0.25 is not a price claim", () => {
    // toText() strips tags precisely so an href cannot trip the scan.
    const html = `<a href="https://agedleadstore.com/x?v=0.25">Shop leads</a>`;
    assert.equal(checkIssueHtml(html).ok, true);
  });
});

describe("assertIssueHtml", () => {
  test("throws on a blocking claim and is silent otherwise", () => {
    assert.throws(() => assertIssueHtml("<p>$0.30 aged leads</p>"), /per-lead price/);
    assert.doesNotThrow(() =>
      assertIssueHtml(`<a href="https://agedleadstore.com/all-lead-types/">Shop</a>`),
    );
  });
});
