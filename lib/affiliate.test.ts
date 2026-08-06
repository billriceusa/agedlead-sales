import { test, describe } from "node:test";
import assert from "node:assert/strict";
import { affiliateUrl, storeCategoryPath, agedLeadLabel } from "./affiliate";

describe("storeCategoryPath", () => {
  test("resolves a Sanity leadType title — the form every caller actually passes", () => {
    // The bug this replaces looked up a Title Case string in a lowercase-slug
    // map, so it silently missed on all 102 posts that set leadTypes and every
    // affiliate click landed on the generic catalogue.
    assert.equal(storeCategoryPath("Mortgage Leads"), "/mortgage-leads/");
    assert.equal(storeCategoryPath("Auto Insurance Leads"), "/auto-insurance-leads/");
    assert.equal(storeCategoryPath("Life Insurance Leads"), "/life-insurance-leads/");
  });

  test("uses the partner's slug, not ours, where they diverge", () => {
    // Verified 200 on 2026-08-06. The intuitive guesses are wrong:
    // /final-expense-leads/ redirects, /solar-leads/ lands on a blog post.
    assert.equal(storeCategoryPath("Final Expense Leads"), "/online-final-expense-leads/");
    assert.equal(storeCategoryPath("Solar Leads"), "/solar-installation-leads/");
    assert.equal(
      storeCategoryPath("IUL Leads"),
      "/indexed-universal-life-insurance-leads/",
    );
  });

  test("attorney-intake products share the legal category", () => {
    assert.equal(storeCategoryPath("MVA Leads"), "/legal-leads/");
    assert.equal(storeCategoryPath("SSDI Leads"), "/legal-leads/");
  });

  test("Medicare falls back rather than pointing at a 404", () => {
    // The partner has no Medicare category — /medicare-leads/ is a 404. A
    // worse landing page beats a broken one on the money link.
    assert.equal(storeCategoryPath("Medicare Leads"), undefined);
    assert.equal(
      affiliateUrl({ path: storeCategoryPath("Medicare Leads"), campaign: "c", content: "x" }),
      affiliateUrl({ campaign: "c", content: "x" }),
    );
  });

  test("accepts a slug or a bare vertical, so old call sites keep working", () => {
    assert.equal(storeCategoryPath("mortgage-leads"), "/mortgage-leads/");
    assert.equal(storeCategoryPath("mortgage"), "/mortgage-leads/");
    assert.equal(storeCategoryPath("home-services"), "/home-improvement-leads/");
    assert.equal(storeCategoryPath("auto"), "/auto-insurance-leads/");
  });

  test("missing or unknown input is undefined, never a guessed path", () => {
    for (const v of [undefined, null, "", "   ", "Underwater Basket Leads"]) {
      assert.equal(storeCategoryPath(v), undefined, `${JSON.stringify(v)}`);
    }
  });
});

describe("agedLeadLabel", () => {
  test("does not double the word 'leads'", () => {
    // Shipped as "aged Mortgage Leads leads" on ~102 published posts.
    assert.equal(agedLeadLabel("Mortgage Leads"), "aged mortgage leads");
    assert.equal(agedLeadLabel("Auto Insurance Leads"), "aged auto insurance leads");
  });

  test("keeps acronyms upper-case", () => {
    assert.equal(agedLeadLabel("IUL Leads"), "aged IUL leads");
    assert.equal(agedLeadLabel("MVA Leads"), "aged MVA leads");
    assert.equal(agedLeadLabel("SSDI Leads"), "aged SSDI leads");
  });

  test("handles slugs and stray whitespace", () => {
    assert.equal(agedLeadLabel("final-expense-leads"), "aged final expense leads");
    assert.equal(agedLeadLabel("  Solar Leads  "), "aged solar leads");
  });

  test("falls back to the generic label rather than emitting 'aged  leads'", () => {
    for (const v of [undefined, null, "", "   ", "Leads"]) {
      assert.equal(agedLeadLabel(v), "aged leads", `${JSON.stringify(v)}`);
    }
  });
});

describe("affiliateUrl", () => {
  test("keeps the UTM contract intact and defaults to the full catalogue", () => {
    const u = new URL(affiliateUrl({ campaign: "lead-type", content: "mortgage-leads" }));
    assert.equal(u.origin + u.pathname, "https://agedleadstore.com/all-lead-types/");
    assert.equal(u.searchParams.get("utm_source"), "workagedleads");
    assert.equal(u.searchParams.get("utm_medium"), "affiliate");
    assert.equal(u.searchParams.get("utm_campaign"), "lead-type");
    assert.equal(u.searchParams.get("utm_content"), "mortgage-leads");
  });

  test("a resolved category path replaces the catalogue path, not the params", () => {
    const u = new URL(
      affiliateUrl({
        path: storeCategoryPath("Health Insurance Leads"),
        campaign: "lead-type",
        content: "health-insurance-leads",
      }),
    );
    assert.equal(u.pathname, "/health-insurance-leads/");
    assert.equal(u.searchParams.get("utm_source"), "workagedleads");
  });
});
