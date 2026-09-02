import { NextResponse } from "next/server";
import { getAccessToken } from "@/lib/cron/google-auth";
import { ALS_GA4_PROPERTY } from "@/lib/als/config";
import { AFFILIATE_UTM_SOURCES } from "@/lib/utm";

/**
 * The commission scoreboard — attributed store revenue, read store-side.
 *
 * WHY THIS EXISTS, AND WHY IT IS A DIFFERENT PROPERTY
 *
 * `/api/reports/outbound-clicks` counts clicks LEAVING this site, from GA4
 * `528489903`. That is the wrong unit for money, and the 2026-09-02 reading
 * proved how wrong: in July, `header-nav` took 96 sessions to $9,132.60 while
 * `cta-banner` took 91 — the same click volume — to $100.50. Roughly $95 per
 * session against $1.10. Optimising clicks treats those as equal.
 *
 * Commission is computed on the STORE's revenue, so it has to be read on the
 * store's property (`357329146`), where the ecommerce events actually fire.
 *
 * ACCESS: this needs the WIF service account to hold Viewer on a property in the
 * KALEIDICO Analytics account, granted 2026-09-02. That is a deliberate
 * cross-entity grant — a BRSG service account reading a Kaleidico-owned
 * property — and it is the reason this route did not exist before. If it starts
 * returning 403, the grant was removed; that is an access fact, never "no data".
 *
 * THE RATE: 20% of store revenue (Bill, 2026-09-02). GA4's attributed revenue
 * is a CEILING rather than the payable base — March 2026 attributed $18,303.25
 * and the books recorded $2,918 rev share, about 80% of the 20% figure, with
 * timing, refunds and last-click attribution all plausible causes. So this
 * reports both: `commissionCeiling` at the nominal rate and `commissionLikely`
 * discounted to the observed realisation. Never quote the ceiling as expected
 * earnings.
 */

export const dynamic = "force-dynamic";
export const maxDuration = 60;

/** Bill, 2026-09-02. */
const REV_SHARE = 0.2;

/**
 * March 2026: $2,918 recorded against $18,303.25 attributed.
 * Single observation — refine when more months of the books are available.
 */
const REALISATION = 0.8;

/**
 * Every source that has ever sent traffic to the store on this site's behalf.
 *
 * `AFFILIATE_UTM_SOURCES` spans the *rebrand* — workagedleads and its immediate
 * predecessor agedleadsales — and that is the right list for the site's own
 * reports. It is NOT the right list here, because `howtoworkleads` was a
 * separate domain that was retired INTO this one on 2026-08-03, and it was the
 * larger earner of the two: $9,132.60 in July against $100.50 from the
 * agedleadsales placements. Omitting it would understate every month before
 * August and make the consolidation look like growth.
 *
 * Added locally rather than to the shared constant so the site-side reports,
 * which legitimately should not count a domain that never pointed at them, keep
 * their current behaviour.
 */
const SOURCES = [...AFFILIATE_UTM_SOURCES, "howtoworkleads"];

interface Row {
  key: string;
  sessions: number;
  revenue: number;
  transactions: number;
}

function money(n: number): number {
  return Math.round(n * 100) / 100;
}

async function runReport(
  token: string,
  body: Record<string, unknown>,
): Promise<{ rows?: unknown[] }> {
  const res = await fetch(
    `https://analyticsdata.googleapis.com/v1beta/properties/${ALS_GA4_PROPERTY}:runReport`,
    {
      method: "POST",
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      body: JSON.stringify(body),
      cache: "no-store",
    },
  );
  if (!res.ok) {
    throw new Error(`GA4 ${res.status} on property ${ALS_GA4_PROPERTY}: ${await res.text()}`);
  }
  return res.json();
}

/** Restrict to traffic this site sent, across every source name it has used. */
const sourceFilter = {
  filter: {
    fieldName: "sessionSource",
    inListFilter: { values: SOURCES, caseSensitive: false },
  },
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function toRows(json: any, keyParts = 1): Row[] {
  return (json.rows ?? []).map((r: any) => ({
    key: r.dimensionValues
      .slice(0, keyParts)
      .map((d: any) => d.value)
      .join(" / "),
    sessions: Number(r.metricValues[0]?.value ?? 0),
    revenue: Number(r.metricValues[1]?.value ?? 0),
    transactions: Number(r.metricValues[2]?.value ?? 0),
  }));
}

const METRICS = [
  { name: "sessions" },
  { name: "totalRevenue" },
  { name: "transactions" },
];

export async function GET(request: Request) {
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const url = new URL(request.url);
  const now = new Date();
  const monthStart = `${now.toISOString().slice(0, 7)}-01`;
  const start = url.searchParams.get("start") ?? monthStart;
  const end = url.searchParams.get("end") ?? now.toISOString().slice(0, 10);
  const goal = Number(url.searchParams.get("goal") ?? 2000);

  let token: string;
  try {
    token = await getAccessToken();
  } catch (err) {
    return NextResponse.json(
      { error: `Could not mint a Google token: ${err instanceof Error ? err.message : err}` },
      { status: 500 },
    );
  }

  try {
    const dateRanges = [{ startDate: start, endDate: end }];

    const [totalJson, campaignJson, contentJson, monthlyJson] = await Promise.all([
      runReport(token, { dateRanges, metrics: METRICS, dimensionFilter: sourceFilter }),
      runReport(token, {
        dateRanges,
        dimensions: [{ name: "sessionCampaignName" }],
        metrics: METRICS,
        dimensionFilter: sourceFilter,
        orderBys: [{ metric: { metricName: "totalRevenue" }, desc: true }],
        limit: 50,
      }),
      // The placement tag. lib/newsletter/store-links.ts goes to real trouble
      // encoding placement into utm_content, and until now nothing read it back.
      runReport(token, {
        dateRanges,
        dimensions: [{ name: "sessionManualAdContent" }],
        metrics: METRICS,
        dimensionFilter: sourceFilter,
        orderBys: [{ metric: { metricName: "totalRevenue" }, desc: true }],
        limit: 50,
      }),
      runReport(token, {
        dateRanges: [{ startDate: "2026-01-01", endDate: end }],
        dimensions: [{ name: "yearMonth" }],
        metrics: METRICS,
        dimensionFilter: sourceFilter,
        orderBys: [{ dimension: { dimensionName: "yearMonth" } }],
        limit: 24,
      }),
    ]);

    const totals = toRows({ rows: (totalJson.rows ?? []).map((r: unknown) => ({ dimensionValues: [{ value: "all" }], metricValues: (r as { metricValues: unknown[] }).metricValues })) })[0] ?? {
      key: "all",
      sessions: 0,
      revenue: 0,
      transactions: 0,
    };

    const revenue = money(totals.revenue);
    const ceiling = money(revenue * REV_SHARE);
    const likely = money(revenue * REV_SHARE * REALISATION);

    return NextResponse.json({
      propertyId: ALS_GA4_PROPERTY,
      scoreboard: "store-side attributed revenue — the basis commission is paid on",
      window: { start, end },
      sources: SOURCES,
      totals: {
        sessions: totals.sessions,
        transactions: totals.transactions,
        attributedRevenue: revenue,
        revenuePerSession: totals.sessions ? money(revenue / totals.sessions) : 0,
      },
      commission: {
        rate: REV_SHARE,
        ceiling,
        likely,
        realisationApplied: REALISATION,
        note:
          "ceiling = 20% of GA4 attributed revenue. likely applies the ~80% realisation observed in March 2026 ($2,918 booked against $18,303.25 attributed). Quote `likely`, not `ceiling`.",
      },
      goal: {
        target: goal,
        vsLikely: money(likely - goal),
        pctOfGoal: goal ? Math.round((likely / goal) * 100) : null,
        revenueStillNeeded: money(Math.max(0, goal / (REV_SHARE * REALISATION) - revenue)),
      },
      byCampaign: toRows(campaignJson).map((r) => ({
        ...r,
        revenue: money(r.revenue),
        revenuePerSession: r.sessions ? money(r.revenue / r.sessions) : 0,
      })),
      byPlacement: toRows(contentJson).map((r) => ({
        ...r,
        revenue: money(r.revenue),
        revenuePerSession: r.sessions ? money(r.revenue / r.sessions) : 0,
      })),
      monthly: toRows(monthlyJson).map((r) => ({
        ...r,
        revenue: money(r.revenue),
        commissionLikely: money(r.revenue * REV_SHARE * REALISATION),
        revenuePerSession: r.sessions ? money(r.revenue / r.sessions) : 0,
      })),
      generatedAt: new Date().toISOString(),
    });
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    const forbidden = msg.includes("403");
    return NextResponse.json(
      {
        error: msg,
        hint: forbidden
          ? `403 means the WIF service account lost Viewer on property ${ALS_GA4_PROPERTY} in the Kaleidico Analytics account. That is an access fact, not an absence of data.`
          : undefined,
      },
      { status: forbidden ? 403 : 500 },
    );
  }
}
