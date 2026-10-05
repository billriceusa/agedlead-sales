import { test, describe } from "node:test";
import assert from "node:assert/strict";
import {
  AFFILIATE_PROVIDER_SLUG,
  providerStoreComparison,
  storeLeadTypeKey,
} from "./provider-store-match";
import { PROVIDERS } from "../data/providers";
import { getProviderPairs } from "../data/providers";
import { storeCategoryPath } from "./affiliate";

describe("storeLeadTypeKey", () => {
  test("resolves verticals whose slug differs from their lead-type slug", () => {
    assert.equal(storeLeadTypeKey("annuity-iul"), "iul-leads");
    assert.equal(storeLeadTypeKey("final-expense"), "final-expense-leads");
  });

  test("resolves a vertical that has a store path but no guide page", () => {
    // Absent from VERTICAL_TO_LEAD_TYPE; reachable only via the bare-slug
    // fallback. The regression this guards is silent under-reporting.
    assert.equal(storeLeadTypeKey("homeowners-insurance"), "homeowners-insurance");
  });

  test("returns undefined for a vertical with no vertical-specific destination", () => {
    // Solar is stocked by the partner but has no marketing buy page, so a link
    // would land on the generic catalogue. That is the leak, not a reclaim.
    assert.equal(storeLeadTypeKey("solar"), undefined);
    assert.equal(storeLeadTypeKey("medicare"), undefined);
  });

  test("every key it returns actually resolves to a store path", () => {
    for (const p of PROVIDERS) {
      for (const v of p.verticals) {
        const key = storeLeadTypeKey(v);
        if (key !== undefined) {
          assert.ok(
            storeCategoryPath(key),
            `storeLeadTypeKey("${v}") returned "${key}" with no store path`
          );
        }
      }
    }
  });
});

describe("providerStoreComparison", () => {
  test("returns null for the paying partner's own profile", () => {
    assert.equal(providerStoreComparison(AFFILIATE_PROVIDER_SLUG), null);
  });

  test("returns null for an unknown slug", () => {
    assert.equal(providerStoreComparison("not-a-provider"), null);
  });

  test("every non-partner provider gets a comparison", () => {
    for (const p of PROVIDERS) {
      if (p.slug === AFFILIATE_PROVIDER_SLUG) continue;
      assert.ok(
        providerStoreComparison(p.slug),
        `no comparison built for ${p.slug}`
      );
    }
  });

  test("comparePath matches a real generated compare route", () => {
    const pairs = new Set(
      getProviderPairs().map(([a, b]) => `/compare/${a}-vs-${b}`)
    );
    for (const p of PROVIDERS) {
      if (p.slug === AFFILIATE_PROVIDER_SLUG) continue;
      const c = providerStoreComparison(p.slug)!;
      assert.ok(
        pairs.has(c.comparePath),
        `${c.comparePath} is not a generated compare route`
      );
    }
  });

  test("stocked + unstocked accounts for every vertical, with no overlap", () => {
    for (const p of PROVIDERS) {
      if (p.slug === AFFILIATE_PROVIDER_SLUG) continue;
      const c = providerStoreComparison(p.slug)!;
      assert.equal(
        c.stocked.length + c.unstockedNames.length,
        p.verticals.length,
        `${p.slug}: vertical count does not reconcile`
      );
    }
  });

  test("a stocked vertical is one the partner both lists and has a page for", () => {
    const affiliate = PROVIDERS.find((p) => p.slug === AFFILIATE_PROVIDER_SLUG)!;
    for (const p of PROVIDERS) {
      if (p.slug === AFFILIATE_PROVIDER_SLUG) continue;
      for (const s of providerStoreComparison(p.slug)!.stocked) {
        assert.ok(
          affiliate.verticals.includes(s.verticalSlug),
          `${p.slug}: ${s.verticalSlug} is not in the partner's verticals`
        );
        assert.ok(
          storeCategoryPath(s.leadTypeKey),
          `${p.slug}: ${s.verticalSlug} has no store path`
        );
      }
    }
  });

  test("a provider with no catalogue overlap reports zero stocked verticals", () => {
    // Lead Tycoons and Synergy Direct Solution sell only MCA / business-loan
    // leads, which the partner does not carry. The component must render no
    // affiliate link at all in this case.
    for (const slug of ["lead-tycoons", "synergy-direct-solution"]) {
      const c = providerStoreComparison(slug)!;
      assert.equal(c.stocked.length, 0, `${slug} should have no overlap`);
      assert.ok(c.unstockedNames.length > 0);
    }
  });

  test("the partner is the top-rated provider, so the ranking claim holds", () => {
    // The component tells the reader the partner scores highest in the
    // directory. If an editorial re-score ever makes that false, this fails and
    // the copy has to change rather than quietly becoming a lie.
    const c = providerStoreComparison("datatoleads")!;
    assert.equal(c.affiliateIsTopRated, true);
    assert.equal(
      c.affiliateRating,
      Math.max(...PROVIDERS.map((p) => p.overallRating))
    );
  });
});
