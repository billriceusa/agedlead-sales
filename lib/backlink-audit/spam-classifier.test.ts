import { test, describe } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import {
  classifyDomain,
  classifyDomains,
  DEFAULT_WHITELIST,
} from "./spam-classifier";

const DISAVOW_PATH = join(
  process.cwd(),
  "data",
  "backlink-audit",
  "disavow.txt",
);

function disavowedDomains(): string[] {
  return readFileSync(DISAVOW_PATH, "utf8")
    .split("\n")
    .filter((l) => l.startsWith("domain:"))
    .map((l) => l.slice("domain:".length).trim())
    .filter(Boolean);
}

describe("classifyDomain — ground truth from the live disavow file", () => {
  // The real value of this test: the disavow file is 291 domains that a human
  // already judged toxic. Anything the classifier calls "clean" there is a
  // miss it would have let through on the next attack wave.
  test("does not call any known-toxic domain clean", () => {
    const misses = classifyDomains(disavowedDomains()).filter(
      (c) => c.verdict === "clean",
    );
    assert.deepEqual(
      misses.map((m) => m.domain),
      [],
      "classifier called known-spam domains clean",
    );
  });

  test("auto-flags the large majority without human review", () => {
    const results = classifyDomains(disavowedDomains());
    const spam = results.filter((r) => r.verdict === "spam").length;
    const ratio = spam / results.length;
    // Not 100%: some toxic domains are plain .com names with nothing in the
    // label to give them away, and those genuinely need a human. The bar is
    // that the bulk is handled automatically.
    assert.ok(
      ratio >= 0.8,
      `only ${(ratio * 100).toFixed(1)}% auto-flagged as spam (want >=80%)`,
    );
  });
});

describe("classifyDomain — whitelist protection", () => {
  for (const d of DEFAULT_WHITELIST) {
    test(`never disavows ${d}`, () => {
      assert.equal(classifyDomain(d).verdict, "clean");
    });
  }

  test("protects subdomains of whitelisted domains", () => {
    assert.equal(classifyDomain("blog.billrice.com").verdict, "clean");
  });

  test("whitelist wins even against a spammy-looking name", () => {
    assert.equal(
      classifyDomain("seogear.shop", ["seogear.shop"]).verdict,
      "clean",
    );
  });
});

describe("classifyDomain — real attack samples", () => {
  const spam = [
    "contextual-link-baron-services.store",
    "proven-serp-boost-and-outreach-pro-services.store",
    "backlink-pro-anchor-text-and-click-through-hub.store",
    "ultimate-seoexpress-niche-edit-experts.store",
    "optimal-website-outrank-hq.store",
    "seogear.shop",
    "linktrove.shop",
    "rankmall.shop",
    "backlinkmasters.shop",
    "linkseoalliance.shop",
    "backlinksplace.site",
    "high-da-do-follow-and-niche-edit-syndicate.store",
    "tier-one-and-domain-rating-trusted-exchange.store",
  ];

  for (const d of spam) {
    test(`flags ${d}`, () => {
      assert.equal(classifyDomain(d).verdict, "spam");
    });
  }

  test("gives a reason for every flag", () => {
    for (const c of classifyDomains(spam)) {
      assert.ok(c.reasons.length > 0, `${c.domain} flagged with no reason`);
    }
  });
});

describe("classifyDomain — false-positive guards", () => {
  // These are the expensive mistakes: disavowing a real link.
  const legitimate = [
    "nytimes.com",
    "forbes.com",
    "linkedin.com", // contains "link"
    "searchengineland.com", // an actual SEO publication
    "moz.com",
    "hubspot.com",
    "insurancejournal.com",
    "consumerfinance.gov",
    "reddit.com",
    "wikipedia.org",
  ];

  for (const d of legitimate) {
    test(`does not auto-disavow ${d}`, () => {
      assert.notEqual(
        classifyDomain(d).verdict,
        "spam",
        `${d} would have been auto-disavowed`,
      );
    });
  }

  test("a real .com SEO agency goes to review, not spam", () => {
    // Naming signal but a trustworthy TLD — a human should look.
    assert.equal(classifyDomain("linkbuildingagency.com").verdict, "review");
  });
});

describe("classifyDomain — input handling", () => {
  test("normalizes case and www.", () => {
    const c = classifyDomain("WWW.SeoGear.shop");
    assert.equal(c.domain, "seogear.shop");
    assert.equal(c.verdict, "spam");
  });

  test("flags unparseable input for review rather than guessing", () => {
    assert.equal(classifyDomain("not-a-domain").verdict, "review");
  });
});
