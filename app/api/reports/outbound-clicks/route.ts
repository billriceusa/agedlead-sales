// On-demand GA4 report: outbound (referral) clicks from agedleadsales.com,
// grouped by destination domain, for last 30 days and last 90 days.
//
// Auth: Bearer ${CRON_SECRET} — same gating as the daily-performance cron.
// Runs in Vercel runtime so it can use the WIF service-account auth in
// lib/cron/google-auth.ts. Triggered locally via curl when we want a fresh
// dashboard.

import { NextResponse } from "next/server";
import { getAccessToken } from "@/lib/cron/google-auth";

export const maxDuration = 60;
export const dynamic = "force-dynamic";

const PROPERTY_ID = "528489903"; // Aged Lead Sales — BRSG account

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

export async function GET(request: Request) {
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const token = await getAccessToken();
    const [total30, total90, byDomain30, byDomain90, topLinks30] =
      await Promise.all([
        fetchTotal(token, 30),
        fetchTotal(token, 90),
        fetchByDomain(token, 30),
        fetchByDomain(token, 90),
        fetchTopLinks(token, 30),
      ]);

    return NextResponse.json({
      propertyId: PROPERTY_ID,
      site: "agedleadsales.com",
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
    });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : String(err) },
      { status: 500 }
    );
  }
}
