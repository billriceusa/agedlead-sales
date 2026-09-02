// On-demand GA4 report: outbound (referral) clicks from agedleadsales.com,
// grouped by destination domain, for last 30 days and last 90 days.
//
// Auth: Bearer ${CRON_SECRET} — same gating as the daily-performance cron.
// Runs in Vercel runtime so it can use the WIF service-account auth in
// lib/cron/google-auth.ts. Triggered locally via curl when we want a fresh
// dashboard.

import { NextResponse } from "next/server";
import { getAccessToken } from "@/lib/cron/google-auth";
import { SITE_HOST } from "@/lib/site-url";
import { AFFILIATE_DOMAIN, isAffiliateDomain } from "@/lib/affiliate";

export const maxDuration = 60;
export const dynamic = "force-dynamic";

const PROPERTY_ID = "528489903"; // Work Aged Leads — BRSG account

// The monetized destination. Clicks to any other partner host in
// data/partner-hosts.ts are editorial, not revenue — the Click Loop scores
// pages on this domain alone.
// The monetized destination, and the "is this it?" predicate. Both live in
// lib/affiliate.ts so the storefront-subdomain rule has exactly one definition —
// see the doc comment there for why `===` was wrong in two directions at once.
//
// Nothing has been lost yet: the storefront deep-links first shipped in the
// 2026-08-31 issue, which mailed 2026-09-01. This is fixed before the clicks it
// would have mis-scored arrive.

interface GA4Row {
  dimensionValues: { value: string }[];
  metricValues: { value: string }[];
}

interface GA4ReportResponse {
  rows?: GA4Row[];
  rowCount?: number;
}

async function runGA4Report(
  token: string,
  body: Record<string, unknown>
): Promise<GA4ReportResponse> {
  const res = await fetch(
    `https://analyticsdata.googleapis.com/v1beta/properties/${PROPERTY_ID}:runReport`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    }
  );
  if (!res.ok) {
    throw new Error(`GA4 API ${res.status}: ${await res.text()}`);
  }
  return res.json();
}

// Filter: enhanced-measurement outbound clicks (event=click).
// GA4 populates linkDomain only on outbound clicks, so the eventName filter
// alone is sufficient — the additional "(not set)" rows are post-processed out.
const CLICK_FILTER = {
  filter: {
    fieldName: "eventName",
    stringFilter: { value: "click" },
  },
};

async function fetchByDomain(token: string, days: 30 | 90): Promise<{ domain: string; count: number }[]> {
  const startDate = `${days}daysAgo`;
  const data = await runGA4Report(token, {
    dateRanges: [{ startDate, endDate: "today" }],
    dimensions: [{ name: "linkDomain" }],
    metrics: [{ name: "eventCount" }],
    dimensionFilter: CLICK_FILTER,
    orderBys: [{ metric: { metricName: "eventCount" }, desc: true }],
    limit: 100,
  });
  return (data.rows || [])
    .map((r) => ({
      domain: r.dimensionValues[0]?.value || "(unknown)",
      count: Number(r.metricValues[0]?.value || 0),
    }))
    .filter((r) => r.domain && r.domain !== "(not set)" && r.count > 0);
}

async function fetchTotal(token: string, days: 30 | 90): Promise<number> {
  const startDate = `${days}daysAgo`;
  const data = await runGA4Report(token, {
    dateRanges: [{ startDate, endDate: "today" }],
    metrics: [{ name: "eventCount" }],
    dimensionFilter: CLICK_FILTER,
  });
  return Number(data.rows?.[0]?.metricValues?.[0]?.value || 0);
}

async function fetchTopLinks(
  token: string,
  days: 30 | 90
): Promise<{ url: string; count: number }[]> {
  const startDate = `${days}daysAgo`;
  const data = await runGA4Report(token, {
    dateRanges: [{ startDate, endDate: "today" }],
    dimensions: [{ name: "linkUrl" }],
    metrics: [{ name: "eventCount" }],
    dimensionFilter: CLICK_FILTER,
    orderBys: [{ metric: { metricName: "eventCount" }, desc: true }],
    limit: 25,
  });
  return (data.rows || [])
    .map((r) => ({
      url: r.dimensionValues[0]?.value || "",
      count: Number(r.metricValues[0]?.value || 0),
    }))
    .filter((r) => r.url && r.count > 0);
}

// ── Click Loop scoreboard ────────────────────────────────────────────
// Which page sent each affiliate click, and at what rate. `byDomain` and
// `topLinks` above answer "where did clicks go"; these answer "which page
// earned them", which is the input the Click Loop selects and kills on
// (see CLICK-LOOP.md, steps 2 and 6).
//
// Read-side only — this adds dimensions to existing GA4 queries. No tracking
// or instrumentation changes.

const ALS_CLICK_FILTER = {
  andGroup: {
    expressions: [
      CLICK_FILTER,
      {
        filter: {
          fieldName: "linkDomain",
          // ENDS_WITH, not the default EXACT, so `store.agedleadstore.com`
          // deep-links count. See isAffiliateDomain(). GA4 has no "this host or
          // a subdomain of it" matcher, so ENDS_WITH is the closest available;
          // it would also match a hypothetical `notagedleadstore.com`, which
          // cannot occur because every outbound link on this site is authored
          // by us.
          stringFilter: { matchType: "ENDS_WITH", value: AFFILIATE_DOMAIN },
        },
      },
    ],
  },
};

async function fetchAffiliateClicksByPage(
  token: string,
  days: 30 | 90
): Promise<Map<string, number>> {
  const data = await runGA4Report(token, {
    dateRanges: [{ startDate: `${days}daysAgo`, endDate: "today" }],
    dimensions: [{ name: "pagePath" }],
    metrics: [{ name: "eventCount" }],
    dimensionFilter: ALS_CLICK_FILTER,
    orderBys: [{ metric: { metricName: "eventCount" }, desc: true }],
    limit: 250,
  });
  const out = new Map<string, number>();
  for (const r of data.rows || []) {
    const path = r.dimensionValues[0]?.value;
    const count = Number(r.metricValues[0]?.value || 0);
    if (path && count > 0) out.set(path, count);
  }
  return out;
}

async function fetchPageViews(
  token: string,
  days: 30 | 90
): Promise<Map<string, number>> {
  const data = await runGA4Report(token, {
    dateRanges: [{ startDate: `${days}daysAgo`, endDate: "today" }],
    dimensions: [{ name: "pagePath" }],
    metrics: [{ name: "screenPageViews" }],
    orderBys: [{ metric: { metricName: "screenPageViews" }, desc: true }],
    limit: 500,
  });
  const out = new Map<string, number>();
  for (const r of data.rows || []) {
    const path = r.dimensionValues[0]?.value;
    const views = Number(r.metricValues[0]?.value || 0);
    if (path && views > 0) out.set(path, views);
  }
  return out;
}

export interface PageScore {
  path: string;
  affiliateClicks: number;
  views: number;
  /** Affiliate clicks per view. The `C` term in the Click Loop's scoring rule. */
  clickRate: number | null;
}

function buildPageScores(
  clicks: Map<string, number>,
  views: Map<string, number>
): PageScore[] {
  return [...clicks.entries()]
    .map(([path, affiliateClicks]) => {
      const v = views.get(path) ?? 0;
      return {
        path,
        affiliateClicks,
        views: v,
        // A rate needs a denominator. Report null rather than a fabricated 0
        // when GA4 has clicks for a path but no matching pageview row.
        clickRate: v > 0 ? affiliateClicks / v : null,
      };
    })
    .sort((a, b) => b.affiliateClicks - a.affiliateClicks);
}

export async function GET(request: Request) {
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const token = await getAccessToken();
    const [
      total30,
      total90,
      byDomain30,
      byDomain90,
      topLinks30,
      alsByPage30,
      views30,
    ] = await Promise.all([
      fetchTotal(token, 30),
      fetchTotal(token, 90),
      fetchByDomain(token, 30),
      fetchByDomain(token, 90),
      fetchTopLinks(token, 30),
      fetchAffiliateClicksByPage(token, 30),
      fetchPageViews(token, 30),
    ]);

    const pageScores30 = buildPageScores(alsByPage30, views30);
    const affiliateTotal30 = pageScores30.reduce(
      (sum, p) => sum + p.affiliateClicks,
      0
    );
    // Clicks going to the 14 non-monetized partner hosts. A flag condition in
    // CLICK-LOOP.md fires when this exceeds the affiliate total.
    const leakage30 = byDomain30
      .filter((d) => !isAffiliateDomain(d.domain))
      .reduce((sum, d) => sum + d.count, 0);

    return NextResponse.json({
      propertyId: PROPERTY_ID,
      site: SITE_HOST,
      generatedAt: new Date().toISOString(),
      windows: {
        last30d: { totalClicks: total30, dailyAvg: total30 / 30 },
        last90d: { totalClicks: total90, dailyAvg: total90 / 90 },
      },
      byDomain: {
        last30d: byDomain30,
        last90d: byDomain90,
      },
      topLinks30d: topLinks30,
      // The Click Loop scoreboard.
      affiliate: {
        domain: AFFILIATE_DOMAIN,
        last30d: {
          clicks: affiliateTotal30,
          dailyAvg: affiliateTotal30 / 30,
          // Non-monetized outbound clicks over the same window.
          leakageClicks: leakage30,
        },
        byPage30d: pageScores30,
      },
    });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : String(err) },
      { status: 500 }
    );
  }
}
