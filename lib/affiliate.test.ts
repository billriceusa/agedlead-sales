import { test, describe } from "node:test";
import assert from "node:assert/strict";
import { affiliateUrl, storeCategoryPath, agedLeadLabel } from "./affiliate";

describe("storeCategoryPath", () => {
  test("resolves a Sanity leadType title — the form every caller actually passes", () => {
    // The bug this replaces looked up a Title Case string in a lowercase-slug
    // map, so it silently missed on all 102 posts that set leadTypes and every
    // affiliate click landed on the generic catalogue.
    assert.equal(storeCategoryPath("Auto Insurance Leads"), "/auto-insurance-leads/");
    assert.equal(storeCategoryPath("Life Insurance Leads"), "/life-insurance-leads/");
    assert.equal(storeCategoryPath("Health Insurance Leads"), "/health-insurance-leads/");
  });

  test("points at the BUY page, never the article that shares its name", () => {
    // The partner publishes an article and a buy page under parallel slugs, so
    // a 200 does not mean a purchase page. /mortgage-leads/ is a tag archive
    // ("Mortgage Leads Archives") and /home-improvement-leads/ is an article.
    // The authority is the "Buy Aged Leads" nav dropdown.
    assert.equal(
      storeCategoryPath("Mortgage Leads"),
      "/mortgage-leads-purchase-refinance/",
    );
    assert.equal(
      storeCategoryPath("Home Improvement Leads"),
      "/buy-home-improvement-leads-lp/",
    );
    assert.equal(
      storeCategoryPath("IUL Leads"),
      "/indexed-universal-life-insurance-leads/",
    );
  });

  test("final expense follows the partner's own menu onto life insurance", () => {
    // Looks wrong, is right: their dropdown points Final Expense Leads at
    // /life-insurance-leads/, because final expense is life insurance.
    assert.equal(storeCategoryPath("Final Expense Leads"), "/life-insurance-leads/");
  });

  test("attorney-intake products share the legal category", () => {
    assert.equal(storeCategoryPath("MVA Leads"), "/legal-leads/");
    assert.equal(storeCategoryPath("SSDI Leads"), "/legal-leads/");
  });

  test("verticals the partner does not sell fall back to the catalogue", () => {
    // No Medicare, solar, or generic-insurance buy page exists. The catalogue
    // is broader but it sells; the same-named articles do not.
    for (const t of ["Medicare Leads", "Solar Leads", "Insurance Leads"]) {
      assert.equal(storeCategoryPath(t), undefined, t);
    }
    assert.equal(
      affiliateUrl({ path: storeCategoryPath("Medicare Leads"), campaign: "c", content: "x" }),
      affiliateUrl({ campaign: "c", content: "x" }),
    );
  });

  test("accepts a slug or a bare vertical, so old call sites keep working", () => {
    assert.equal(
      storeCategoryPath("mortgage-leads"),
      "/mortgage-leads-purchase-refinance/",
    );
    assert.equal(storeCategoryPath("mortgage"), "/mortgage-leads-purchase-refinance/");
    assert.equal(storeCategoryPath("home-services"), "/buy-home-improvement-leads-lp/");
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
