import { test, describe } from "node:test";
import assert from "node:assert/strict";
import {
  LEAD_TYPE_TO_VERTICAL,
  VERTICAL_TO_LEAD_TYPE,
  verticalForLeadType,
  leadTypeForVertical,
} from "../data/lead-type-vertical-map";
import { LEAD_TYPES } from "../data/lead-types";
import { VERTICALS } from "../data/verticals";
import { storeCategoryPath } from "./affiliate";

/**
 * The internal-linking cluster is lead-type guide ↔ price index ↔ best
 * providers, and it is wired by hand in two directions. These tests pin the
 * invariants that keep it from silently coming apart — every failure mode below
 * has already happened at least once on this site.
 */
describe("lead-type ↔ vertical cluster", () => {
  test("every vertical's guide slug has a LEAD_TYPES entry", () => {
    // app/(site)/providers/best/[vertical] does `LEAD_TYPES[guideSlug]` and
    // renders the cluster link only when that lookup succeeds. A value here
    // with no static entry doesn't error — the link just vanishes, which is how
    // "home-improvement" pointed at the non-existent "home-services-leads"
    // guide and lost its cluster link without anyone noticing.
    for (const [vertical, guideSlug] of Object.entries(VERTICAL_TO_LEAD_TYPE)) {
      assert.ok(
        LEAD_TYPES[guideSlug],
        `vertical "${vertical}" points at guide "${guideSlug}", which has no LEAD_TYPES entry — its cluster link will silently disappear`,
      );
    }
  });

  test("every vertical key is a real vertical", () => {
    const known = new Set(VERTICALS.map((v) => v.slug));
    for (const vertical of Object.keys(VERTICAL_TO_LEAD_TYPE)) {
      assert.ok(
        known.has(vertical),
        `"${vertical}" is not a slug in VERTICALS — /price-index/${vertical} and /providers/best/${vertical} do not exist`,
      );
    }
  });

  test("a vertical's guide points back at that same vertical", () => {
    // Both directions are curated by hand precisely because the relationship
    // isn't 1:1. That's fine — but a guide must not claim a different vertical
    // than the one linking to it, or the cluster sends users in a circle.
    for (const [vertical, guideSlug] of Object.entries(VERTICAL_TO_LEAD_TYPE)) {
      assert.equal(
        verticalForLeadType(guideSlug),
        vertical,
        `vertical "${vertical}" → guide "${guideSlug}" → vertical "${verticalForLeadType(guideSlug)}" — the round trip must return to where it started`,
      );
    }
  });

  test("every mapped lead type resolves to a real vertical", () => {
    const known = new Set(VERTICALS.map((v) => v.slug));
    for (const [leadType, vertical] of Object.entries(LEAD_TYPE_TO_VERTICAL)) {
      assert.ok(
        known.has(vertical),
        `lead type "${leadType}" maps to "${vertical}", which is not a real vertical`,
      );
    }
  });
});

describe("legal vertical", () => {
  test("the legal vertical's guide is the umbrella, not a sub-vertical", () => {
    // MVA and SSDI keep their own guides and their own head terms. The category
    // pages (/price-index/legal, /providers/best/legal) cover the whole
    // vertical — bankruptcy, family law, workers' comp, injury, disability — so
    // the honest destination for them is the umbrella guide.
    assert.equal(leadTypeForVertical("legal"), "legal-leads");
    assert.equal(verticalForLeadType("mva-leads"), "legal");
    assert.equal(verticalForLeadType("ssdi-leads"), "legal");
  });

  test("legal lead types deep-link to the partner's legal buy page", () => {
    // Verified against the partner's own link catalogue on 2026-08-12:
    // /legal-leads/ is the ONLY legal buy page they run, and all three of these
    // route to it. Without the "legal-leads" entry the umbrella guide's CTA
    // falls back to /all-lead-types/, which is what the bankruptcy, family law
    // and workers' comp posts were doing before this cluster existed.
    assert.equal(storeCategoryPath("Legal Leads"), "/legal-leads/");
    assert.equal(storeCategoryPath("legal-leads"), "/legal-leads/");
    assert.equal(storeCategoryPath("MVA Leads"), "/legal-leads/");
    assert.equal(storeCategoryPath("SSDI Leads"), "/legal-leads/");
  });

  test("the umbrella guide compares providers for the legal vertical", () => {
    assert.equal(LEAD_TYPES["legal-leads"].getCompareUrl(), "/providers/best/legal");
  });
});
