import { test, describe } from "node:test";
import assert from "node:assert/strict";
import { STORE_VERTICALS, storeUrl, catalogueUrl } from "./store-links";

describe("storeUrl", () => {
  test("every placement in one issue gets a distinct utm_content", () => {
    // This is the invariant the whole three-CTA layout rests on. The issue
    // that shipped before set utm_content to the date alone, so three
    // placements would have been indistinguishable in GA4 and the layout
    // change would have been unmeasurable.
    const week = "2026-08-31";
    const contents = [
      catalogueUrl(week, "hero"),
      catalogueUrl(week, "footer"),
      catalogueUrl(week, "vertical-all"),
      ...STORE_VERTICALS.map((v) => storeUrl(week, `vertical-${v.key}`, v.segment)),
    ].map((u) => new URL(u).searchParams.get("utm_content"));

    assert.equal(new Set(contents).size, contents.length);
  });

  test("carries both the issue and the placement, in that order", () => {
    const u = new URL(storeUrl("2026-08-31", "vertical-mortgage", "mortgage_refinance"));
    assert.equal(u.searchParams.get("utm_content"), "2026-08-31-vertical-mortgage");
    assert.equal(u.searchParams.get("utm_campaign"), "weekly-newsletter");
  });

  test("is medium=email, not affiliate", () => {
    // Newsletter clicks land under workagedleads/email. A success check that
    // reads workagedleads/affiliate — as the original plan specified — would
    // report zero newsletter impact no matter how the newsletter performed.
    assert.equal(new URL(catalogueUrl("2026-08-31", "hero")).searchParams.get("utm_medium"), "email");
  });

  test("deep links hit the storefront; the fallback hits the catalogue", () => {
    // The card grid links straight into the storefront, skipping the marketing
    // page. Same GA4 property, so attribution survives the shorter path.
    const deep = new URL(storeUrl("2026-08-31", "vertical-solar", "solar_installation"));
    assert.equal(deep.host, "store.agedleadstore.com");
    assert.equal(deep.pathname, "/solar_installation/leads");

    const fallback = new URL(catalogueUrl("2026-08-31", "vertical-all"));
    assert.equal(fallback.host, "agedleadstore.com");
    assert.equal(fallback.pathname, "/all-lead-types/");
  });
});

describe("STORE_VERTICALS", () => {
  test("keys are unique, since utm_content is built from them", () => {
    const keys = STORE_VERTICALS.map((v) => v.key);
    assert.equal(new Set(keys).size, keys.length);
  });

  test("final expense and life share a storefront segment on purpose", () => {
    // Troy's card grid points both at life_insurance — final expense IS life
    // insurance to the store. Distinct keys keep them separable in reporting
    // even though the destination is identical.
    const fe = STORE_VERTICALS.find((v) => v.key === "final-expense");
    const life = STORE_VERTICALS.find((v) => v.key === "life");
    assert.equal(fe?.segment, "life_insurance");
    assert.equal(life?.segment, "life_insurance");
  });

  test("carries exactly the nine cards Troy stocks", () => {
    // Sourced from the card grid at agedleadstore.com/all-lead-types/,
    // confirmed by Bill 2026-08-27. Medicare and legal are absent because the
    // grid does not carry them — do not add a vertical without a card.
    assert.equal(STORE_VERTICALS.length, 9);
    assert.ok(!STORE_VERTICALS.some((v) => v.key === "medicare"));
  });
});
