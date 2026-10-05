import { test, describe } from "node:test";
import assert from "node:assert/strict";
import { storefrontSegment, storefrontUrl, affiliateDestination } from "./store-front";
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
  // Added 2026-10-05 with the annuity guide, and this one needs explaining
  // because the evidence cuts both ways.
  //
  // The card grid at /all-lead-types/ — the authoritative source per
  // lib/store-front.ts — was re-read on 2026-10-05 and links exactly the eight
  // documented segments. "annuity" is not among them, so the guide resolves
  // nothing and the hero door falls through to the catalogue.
  //
  // BUT the body diff says the segment is real and stocked. On 2026-10-05
  // https://store.agedleadstore.com/annuity/leads returned 200 at 81,642 bytes
  // (the 404 control /bogus_vertical/leads: 30,511 bytes), carrying its own
  // "Get Annuity Leads" heading, "validated Internet Annuity quote requests",
  // two Add to Cart controls, the full state filter grid, and a real
  // volume-tiered price table with two freshness brackets ("Annuity 15-85 Days",
  // "Annuity 86-500 Days"). That is indistinguishable from homeowner_insurance
  // or iul_insurance on every test this project uses.
  //
  // This is the Medicare situation again — a segment the storefront serves that
  // the marketing card grid does not show — and solar sat here once before it
  // appeared on the grid. It needs Bill's confirmation against what the partner
  // is actually selling before any page points at it. Do not map it on the
  // strength of the body diff alone.
  "annuity-leads": "not on the card grid; storefront serves /annuity/leads — needs Bill's confirmation",
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

/**
 * These pin the single destination helper.
 *
 * The precedence shipped as three separate four-line copies on 2026-10-05 —
 * hero-affiliate-door, cta-banner and inline-text-cta — because they were built
 * under a file-ownership split. The defect that created the precedence in the
 * first place was a lead-type page whose hero door and body CTAs pointed at
 * DIFFERENT destinations, so three copies of the fix was the wrong shape. These
 * tests exist so the one copy cannot drift back.
 */
describe("affiliateDestination", () => {
  test("a stocked vertical deep-links the storefront and suffixes the content", () => {
    const d = affiliateDestination({
      leadType: "Mortgage Leads",
      campaign: "lead-type",
      content: "hero-door",
    });
    assert.equal(d.isStorefront, true);
    assert.equal(d.segment, "mortgage_refinance");
    assert.equal(d.content, "hero-door-store");
    assert.match(d.href, /^https:\/\/store\.agedleadstore\.com\/mortgage_refinance\/leads\?/);
    assert.match(d.href, /utm_content=hero-door-store/);
    assert.match(d.href, /utm_campaign=lead-type/);
  });

  test("an unstocked vertical falls through and does NOT suffix the content", () => {
    // Medicare has no storefront segment and no marketing buy page. Suffixing
    // here would split the marketing-page history for no reason.
    const d = affiliateDestination({
      leadType: "Medicare Leads",
      campaign: "lead-type",
      content: "hero-door",
    });
    assert.equal(d.isStorefront, false);
    assert.equal(d.segment, undefined);
    assert.equal(d.content, "hero-door");
    assert.ok(!d.href.startsWith("https://store."), `fell through to ${d.href}`);
  });

  test("legal lands on the marketing rung, never store.../legal/leads", () => {
    // /legal/leads is a verified 404 — the partner sells all legal intake from
    // the marketing page.
    const d = affiliateDestination({
      leadType: "Legal Leads",
      campaign: "lead-type",
      content: "hero-door",
    });
    assert.equal(d.isStorefront, false);
    assert.ok(!d.href.includes("/legal/leads"), `would 404: ${d.href}`);
  });

  test("fallbackPath is honoured only when no segment resolves", () => {
    const stocked = affiliateDestination({
      leadType: "Mortgage Leads",
      campaign: "cta-banner",
      content: "primary",
      fallbackPath: "/some-marketing-page/",
    });
    assert.equal(stocked.isStorefront, true, "a resolved segment must win over fallbackPath");
    assert.ok(!stocked.href.includes("some-marketing-page"));

    const unstocked = affiliateDestination({
      leadType: "Medicare Leads",
      campaign: "cta-banner",
      content: "primary",
      fallbackPath: "/some-marketing-page/",
    });
    assert.equal(unstocked.isStorefront, false);
    assert.match(unstocked.href, /some-marketing-page/);
  });

  test("no lead type at all resolves the catalogue, not a guess", () => {
    const d = affiliateDestination({ campaign: "compare-pair", content: "compare-door" });
    assert.equal(d.isStorefront, false);
    assert.equal(d.content, "compare-door");
  });

  test("the three callers produce ONE destination and three contents", () => {
    // This is the actual defect the helper exists to prevent: the hero door and
    // the body CTAs on the same page disagreeing about where to send a reader.
    const hero = affiliateDestination({ leadType: "Mortgage Leads", campaign: "lead-type", content: "hero-door" });
    const inline = affiliateDestination({ leadType: "Mortgage Leads", campaign: "lead-type", content: "inline-text" });
    const banner = affiliateDestination({ leadType: "Mortgage Leads", campaign: "lead-type", content: "mortgage-leads" });

    const path = (u: string) => new URL(u).origin + new URL(u).pathname;
    assert.equal(path(hero.href), path(inline.href));
    assert.equal(path(hero.href), path(banner.href));

    const contents = [hero.content, inline.content, banner.content];
    assert.equal(new Set(contents).size, 3, `utm_content must stay distinct: ${contents.join(", ")}`);
  });
});
