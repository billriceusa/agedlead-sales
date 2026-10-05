import { test, describe } from "node:test";
import assert from "node:assert/strict";
import { storefrontSegment, storefrontUrl } from "./store-front";
import { storeCategoryPath, isAffiliateDomain } from "./affiliate";
import { STORE_VERTICALS } from "./newsletter/store-links";
import { LEAD_TYPES } from "../data/lead-types";

/**
 * The segment vocabulary the partner's card grid actually stocks.
 *
 * Derived from `STORE_VERTICALS` rather than restated, so the two maps cannot
 * drift apart. `lib/newsletter/store-links.ts` is the older of the two and is
 * verified against the card grid; if a segment is added or renamed there, this
 * file's map has to agree or the test fails.
 */
const STOCKED = new Set(STORE_VERTICALS.map((v) => v.segment));

/** Lead types that must NOT resolve a storefront segment, and why. */
const DELIBERATELY_UNSTOCKED: Record<string, string> = {
  // /legal/leads is a verified 404. The partner sells all legal intake from the
  // marketing page, which storeCategoryPath returns.
  "legal-leads": "no storefront segment; marketing /legal-leads/ is the buy page",
  "ssdi-leads": "attorney intake, same as legal",
  "mva-leads": "attorney intake, same as legal",
  // Absent from the card grid. The storefront root does link
  // medicare_supplement, which is a finding for Bill, not a licence to map it.
  "medicare-leads": "not on the card grid; needs Bill's confirmation",
  // No single segment covers generic insurance, exactly as there is no generic
  // insurance marketing buy page.
  "insurance-leads": "generic bucket, no single segment",
};

describe("storefrontSegment", () => {
  test("every mapped segment is one the partner actually stocks", () => {
    // The failure this prevents is the expensive one: a plausible-looking
    // segment that renders a 404 at 30KB sends declared purchase intent into a
    // dead end, and nothing about the link looks broken from our side.
    for (const slug of Object.keys(LEAD_TYPES)) {
      const segment = storefrontSegment(slug);
      if (segment) {
        assert.ok(
          STOCKED.has(segment),
          `${slug} resolves "${segment}", which is not in the card-grid set`
        );
      }
    }
  });

  test("the deliberately-unstocked lead types resolve nothing", () => {
    for (const [slug, why] of Object.entries(DELIBERATELY_UNSTOCKED)) {
      assert.equal(
        storefrontSegment(slug),
        undefined,
        `${slug} must not resolve a segment — ${why}`
      );
    }
  });

  test("accepts a Sanity title as well as a slug", () => {
    // Callers pass `leadType.title`, not the slug. This is the lookup the
    // component actually performs.
    assert.equal(storefrontSegment("Mortgage Leads"), "mortgage_refinance");
    assert.equal(storefrontSegment("mortgage-leads"), "mortgage_refinance");
    assert.equal(storefrontSegment("IUL Leads"), "iul_insurance");
    assert.equal(storefrontSegment("Solar Leads"), "solar_installation");
  });

  test("tolerates a bare vertical by retrying with the -leads suffix", () => {
    assert.equal(storefrontSegment("mortgage"), "mortgage_refinance");
  });

  test("final expense is life insurance, per the partner's own menu", () => {
    // Looks wrong, is not. storeCategoryPath encodes the same equivalence, and
    // the two must not disagree about it.
    assert.equal(storefrontSegment("Final Expense Leads"), "life_insurance");
    assert.equal(storefrontSegment("Life Insurance Leads"), "life_insurance");
    assert.equal(storeCategoryPath("Final Expense Leads"), "/life-insurance-leads/");
  });

  test("solar is the gap this closed", () => {
    // The partner stocks solar but only in the storefront — there is no
    // marketing buy page — so before this map the solar guide sent declared
    // solar intent to the undifferentiated catalogue.
    assert.equal(storeCategoryPath("Solar Leads"), undefined);
    assert.equal(storefrontSegment("Solar Leads"), "solar_installation");
  });

  test("no lead type is left with neither a segment nor a marketing path unless it is on the documented list", () => {
    // Falling back to the full catalogue is a valid answer, but it should only
    // ever happen for a vertical we have decided about on purpose.
    for (const slug of Object.keys(LEAD_TYPES)) {
      const hasDestination =
        Boolean(storefrontSegment(slug)) || Boolean(storeCategoryPath(slug));
      if (!hasDestination) {
        assert.ok(
          slug in DELIBERATELY_UNSTOCKED,
          `${slug} falls back to the catalogue but is not on the documented list`
        );
      }
    }
  });

  test("empty and nullish input resolve nothing rather than throwing", () => {
    assert.equal(storefrontSegment(undefined), undefined);
    assert.equal(storefrontSegment(null), undefined);
    assert.equal(storefrontSegment(""), undefined);
    assert.equal(storefrontSegment("   "), undefined);
  });
});

describe("storefrontUrl", () => {
  test("points at the storefront host and the segment's leads page", () => {
    const u = new URL(
      storefrontUrl({
        segment: "mortgage_refinance",
        campaign: "lead-type",
        content: "hero-door-store",
      })
    );
    assert.equal(u.host, "store.agedleadstore.com");
    assert.equal(u.pathname, "/mortgage_refinance/leads");
  });

  test("carries all four UTMs, with medium=affiliate", () => {
    // medium separates on-site doors from the newsletter, which emits
    // medium=email from lib/newsletter/store-links.ts. Blending them would make
    // neither surface readable.
    const p = new URL(
      storefrontUrl({
        segment: "life_insurance",
        campaign: "lead-type",
        content: "hero-door-store",
      })
    ).searchParams;
    assert.equal(p.get("utm_source"), "workagedleads");
    assert.equal(p.get("utm_medium"), "affiliate");
    assert.equal(p.get("utm_campaign"), "lead-type");
    assert.equal(p.get("utm_content"), "hero-door-store");
  });

  test("the storefront host counts as affiliate, not as leakage", () => {
    // The regression this guards is documented at length in lib/affiliate.ts:
    // an exact host comparison drops storefront clicks out of the affiliate
    // total AND counts them as leakage to a competitor, which can trip
    // CLICK-LOOP's flag condition *because* a door is working.
    const host = new URL(
      storefrontUrl({
        segment: "solar_installation",
        campaign: "lead-type",
        content: "hero-door-store",
      })
    ).host;
    assert.ok(isAffiliateDomain(host));
  });

  test("every stocked vertical produces a distinct, well-formed URL", () => {
    const urls = [...STOCKED].map((segment) =>
      storefrontUrl({ segment, campaign: "lead-type", content: "hero-door-store" })
    );
    assert.equal(new Set(urls).size, urls.length);
    for (const u of urls) {
      const parsed = new URL(u);
      assert.equal(parsed.protocol, "https:");
      assert.match(parsed.pathname, /^\/[a-z_]+\/leads$/);
    }
  });
});
