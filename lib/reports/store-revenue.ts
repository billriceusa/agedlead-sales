import { getAccessToken } from "@/lib/cron/google-auth";
import { ALS_GA4_PROPERTY } from "@/lib/als/config";
import { AFFILIATE_UTM_SOURCES } from "@/lib/utm";

/**
 * Store-side attributed revenue — the basis commission is actually paid on.
 *
 * Extracted from `app/api/reports/store-revenue/route.ts` so the daily
 * commission email and the on-demand JSON endpoint compute from ONE
 * implementation. Two copies of a revenue calculation drift, and the first
 * anyone would notice is a report and an endpoint disagreeing about the month.
 *
 * Reads GA4 `357329146` (the STORE property, Kaleidico account) rather than
 * `528489903` (this site, BRSG account). Site-side clicks are a poor proxy for
 * money: July's `header-nav` took 96 sessions to $9,132.60 while `cta-banner`
 * took 91 — the same click volume — to $100.50.
 */

/** Bill, 2026-09-02. */
export const REV_SHARE = 0.2;

/**
 * GA4 attributed revenue is a ceiling, not the payable base.
 *
 * March 2026 attributed $18,303.25 and ALS's books recorded $2,918 rev share —
 * about 80% of the nominal 20%. Applying that factor reproduces March at
 * $2,928.52 against an actual $2,918, a 0.4% error. That is n=1 and not proof,
 * but it is the only month where both numbers exist and the model matches it.
 * Re-derive when Apr-Jul books are available.
 */
export const REALISATION = 0.8;

/**
 * Every source that has sent store traffic on this site's behalf.
 *
 * `AFFILIATE_UTM_SOURCES` spans the rebrand and is right for site-side reports.
 * It omits `howtoworkleads`, a separate domain retired INTO this one on
 * 2026-08-03 that was the larger earner — $9,132.60 in July against $100.50.
 * Leaving it out understates every pre-August month and makes the consolidation
 * look like growth.
 */
export const STORE_SOURCES = [...AFFILIATE_UTM_SOURCES, "howtoworkleads"];

export interface RevenueRow {
  key: string;
  sessions: number;
  revenue: number;
  transactions: number;
  revenuePerSession: number;
}

export interface RevenueTotals {
  sessions: number;
  transactions: number;
  attributedRevenue: number;
  revenuePerSession: number;
  /** 20% of attributed revenue. NEVER quote this as expected earnings. */
  commissionCeiling: number;
  /** Ceiling discounted to observed realisation. This is the number to quote. */
  commissionLikely: number;
}

export interface StoreRevenueReport {
  propertyId: string;
  window: { start: string; end: string };
  sources: string[];
  mtd: RevenueTotals;
  yesterday: RevenueTotals;
  byCampaign: RevenueRow[];
  byPlacement: RevenueRow[];
  monthly: (RevenueRow & { commissionLikely: number })[];
  goal: {
    target: number;
    pctOfGoal: number;
    revenueStillNeeded: number;
    /** Fraction of the month elapsed, 0-1. Pace context for the percentage. */
    monthElapsed: number;
    onPace: boolean;
  };
  generatedAt: string;
}

function money(n: number): number {
  return Math.round(n * 100) / 100;
}

function totalsFrom(sessions: number, revenue: number, transactions: number): RevenueTotals {
  return {
    sessions,
    transactions,
    attributedRevenue: money(revenue),
    revenuePerSession: sessions ? money(revenue / sessions) : 0,
    commissionCeiling: money(revenue * REV_SHARE),
    commissionLikely: money(revenue * REV_SHARE * REALISATION),
  };
}

const METRICS = [{ name: "sessions" }, { name: "totalRevenue" }, { name: "transactions" }];

const SOURCE_FILTER = {
  filter: {
    fieldName: "sessionSource",
    inListFilter: { values: STORE_SOURCES, caseSensitive: false },
  },
};

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

/* eslint-disable @typescript-eslint/no-explicit-any */
function rows(json: any): RevenueRow[] {
  return (json.rows ?? []).map((r: any) => {
    const sessions = Number(r.metricValues[0]?.value ?? 0);
    const revenue = Number(r.metricValues[1]?.value ?? 0);
    return {
      key: r.dimensionValues?.[0]?.value ?? "(not set)",
      sessions,
      revenue: money(revenue),
      transactions: Number(r.metricValues[2]?.value ?? 0),
      revenuePerSession: sessions ? money(revenue / sessions) : 0,
    };
  });
}

function scalar(json: any): { sessions: number; revenue: number; transactions: number } {
  const r = (json.rows ?? [])[0];
  if (!r) return { sessions: 0, revenue: 0, transactions: 0 };
  return {
    sessions: Number(r.metricValues[0]?.value ?? 0),
    revenue: Number(r.metricValues[1]?.value ?? 0),
    transactions: Number(r.metricValues[2]?.value ?? 0),
  };
}
/* eslint-enable @typescript-eslint/no-explicit-any */

function isoDay(d: Date): string {
  return d.toISOString().slice(0, 10);
}

export interface FetchOptions {
  start?: string;
  end?: string;
  goal?: number;
}

export async function fetchStoreRevenue(
  opts: FetchOptions = {},
): Promise<StoreRevenueReport> {
  const now = new Date();
  const start = opts.start ?? `${isoDay(now).slice(0, 7)}-01`;
  const end = opts.end ?? isoDay(now);
  const goal = opts.goal ?? 2000;

  const yesterdayDate = new Date(now);
  yesterdayDate.setUTCDate(now.getUTCDate() - 1);
  const yesterday = isoDay(yesterdayDate);

  const token = await getAccessToken();
  const dateRanges = [{ startDate: start, endDate: end }];

  const [mtdJson, ydayJson, campaignJson, placementJson, monthlyJson] = await Promise.all([
    runReport(token, { dateRanges, metrics: METRICS, dimensionFilter: SOURCE_FILTER }),
    runReport(token, {
      dateRanges: [{ startDate: yesterday, endDate: yesterday }],
      metrics: METRICS,
      dimensionFilter: SOURCE_FILTER,
    }),
    runReport(token, {
      dateRanges,
      dimensions: [{ name: "sessionCampaignName" }],
      metrics: METRICS,
      dimensionFilter: SOURCE_FILTER,
      orderBys: [{ metric: { metricName: "totalRevenue" }, desc: true }],
      limit: 25,
    }),
    // The placement tag. store-links.ts has emitted this for months and nothing
    // read it back, so a 13-link issue collapsed into a single row.
    runReport(token, {
      dateRanges,
      dimensions: [{ name: "sessionManualAdContent" }],
      metrics: METRICS,
      dimensionFilter: SOURCE_FILTER,
      orderBys: [{ metric: { metricName: "totalRevenue" }, desc: true }],
      limit: 25,
    }),
    runReport(token, {
      dateRanges: [{ startDate: "2026-01-01", endDate: end }],
      dimensions: [{ name: "yearMonth" }],
      metrics: METRICS,
      dimensionFilter: SOURCE_FILTER,
      orderBys: [{ dimension: { dimensionName: "yearMonth" } }],
      limit: 24,
    }),
  ]);

  const mtdRaw = scalar(mtdJson);
  const mtd = totalsFrom(mtdRaw.sessions, mtdRaw.revenue, mtdRaw.transactions);
  const ydayRaw = scalar(ydayJson);

  // Pace: how far through the month are we, against how far to the goal.
  const daysInMonth = new Date(
    Date.UTC(now.getUTCFullYear(), now.getUTCMonth() + 1, 0),
  ).getUTCDate();
  const monthElapsed = now.getUTCDate() / daysInMonth;
  const pctOfGoal = goal ? mtd.commissionLikely / goal : 0;

  return {
    propertyId: ALS_GA4_PROPERTY,
    window: { start, end },
    sources: STORE_SOURCES,
    mtd,
    yesterday: totalsFrom(ydayRaw.sessions, ydayRaw.revenue, ydayRaw.transactions),
    byCampaign: rows(campaignJson),
    byPlacement: rows(placementJson),
    monthly: rows(monthlyJson).map((r) => ({
      ...r,
      commissionLikely: money(r.revenue * REV_SHARE * REALISATION),
    })),
    goal: {
      target: goal,
      pctOfGoal: Math.round(pctOfGoal * 100),
      revenueStillNeeded: money(
        Math.max(0, goal / (REV_SHARE * REALISATION) - mtd.attributedRevenue),
      ),
      monthElapsed: Math.round(monthElapsed * 100) / 100,
      onPace: pctOfGoal >= monthElapsed,
    },
    generatedAt: new Date().toISOString(),
  };
}
