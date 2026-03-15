import { getAccessToken } from "./google-auth";

export interface GA4Metrics {
  sessions: number;
  activeUsers: number;
  newUsers: number;
  screenPageViews: number;
  averageSessionDuration: number;
  bounceRate: number;
  engagementRate: number;
  eventsPerSession: number;
}

export interface GA4PageData {
  path: string;
  views: number;
  users: number;
}

export interface GA4SourceData {
  source: string;
  medium: string;
  sessions: number;
  users: number;
}

export interface GA4PeriodData {
  metrics: GA4Metrics;
  dailyAverage: GA4Metrics;
  topPages: GA4PageData[];
  topSources: GA4SourceData[];
}

export interface GA4Report {
  sevenDay: GA4PeriodData;
  ninetyDay: GA4PeriodData;
  available: boolean;
  error?: string;
}

function formatDate(d: Date): string {
  return d.toISOString().split("T")[0];
}

function dateRange(daysAgo: number): { start: string; end: string } {
  const end = new Date();
  end.setDate(end.getDate() - 1); // yesterday (GA4 data lags ~1 day)
  const start = new Date(end);
  start.setDate(end.getDate() - daysAgo + 1);
  return { start: formatDate(start), end: formatDate(end) };
}

async function runReport(
  propertyId: string,
  token: string,
  body: Record<string, unknown>
): Promise<Record<string, unknown>> {
  const res = await fetch(
    `https://analyticsdata.googleapis.com/v1beta/properties/${propertyId}:runReport`,
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
    const text = await res.text();
    throw new Error(`GA4 API error ${res.status}: ${text}`);
  }

  return res.json();
}

function extractMetricValue(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  row: any,
  index: number
): number {
  return parseFloat(row?.metricValues?.[index]?.value || "0");
}

async function fetchPeriodMetrics(
  propertyId: string,
  token: string,
  days: number
): Promise<GA4Metrics> {
  const range = dateRange(days);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const data: any = await runReport(propertyId, token, {
    dateRanges: [{ startDate: range.start, endDate: range.end }],
    metrics: [
      { name: "sessions" },
      { name: "activeUsers" },
      { name: "newUsers" },
      { name: "screenPageViews" },
      { name: "averageSessionDuration" },
      { name: "bounceRate" },
      { name: "engagementRate" },
      { name: "eventsPerSession" },
    ],
  });

  const row = data.rows?.[0];
  return {
    sessions: extractMetricValue(row, 0),
    activeUsers: extractMetricValue(row, 1),
    newUsers: extractMetricValue(row, 2),
    screenPageViews: extractMetricValue(row, 3),
    averageSessionDuration: extractMetricValue(row, 4),
    bounceRate: extractMetricValue(row, 5),
    engagementRate: extractMetricValue(row, 6),
    eventsPerSession: extractMetricValue(row, 7),
  };
}

async function fetchTopPages(
  propertyId: string,
  token: string,
  days: number
): Promise<GA4PageData[]> {
  const range = dateRange(days);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const data: any = await runReport(propertyId, token, {
    dateRanges: [{ startDate: range.start, endDate: range.end }],
    dimensions: [{ name: "pagePath" }],
    metrics: [
      { name: "screenPageViews" },
      { name: "activeUsers" },
    ],
    orderBys: [{ metric: { metricName: "screenPageViews" }, desc: true }],
    limit: 15,
  });

  return (data.rows || []).map(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (row: any) => ({
      path: row.dimensionValues?.[0]?.value || "",
      views: extractMetricValue(row, 0),
      users: extractMetricValue(row, 1),
    })
  );
}

async function fetchTopSources(
  propertyId: string,
  token: string,
  days: number
): Promise<GA4SourceData[]> {
  const range = dateRange(days);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const data: any = await runReport(propertyId, token, {
    dateRanges: [{ startDate: range.start, endDate: range.end }],
    dimensions: [
      { name: "sessionSource" },
      { name: "sessionMedium" },
    ],
    metrics: [
      { name: "sessions" },
      { name: "activeUsers" },
    ],
    orderBys: [{ metric: { metricName: "sessions" }, desc: true }],
    limit: 10,
  });

  return (data.rows || []).map(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (row: any) => ({
      source: row.dimensionValues?.[0]?.value || "(unknown)",
      medium: row.dimensionValues?.[1]?.value || "(none)",
      sessions: extractMetricValue(row, 0),
      users: extractMetricValue(row, 1),
    })
  );
}

function toDailyAverage(metrics: GA4Metrics, days: number): GA4Metrics {
  return {
    sessions: metrics.sessions / days,
    activeUsers: metrics.activeUsers / days,
    newUsers: metrics.newUsers / days,
    screenPageViews: metrics.screenPageViews / days,
    averageSessionDuration: metrics.averageSessionDuration,
    bounceRate: metrics.bounceRate,
    engagementRate: metrics.engagementRate,
    eventsPerSession: metrics.eventsPerSession,
  };
}

export async function fetchGA4Report(): Promise<GA4Report> {
  const propertyId = process.env.GA4_PROPERTY_ID;
  if (!propertyId) {
    return {
      sevenDay: emptyPeriod(),
      ninetyDay: emptyPeriod(),
      available: false,
      error: "GA4_PROPERTY_ID not configured",
    };
  }

  try {
    const token = await getAccessToken();

    const [
      sevenDayMetrics,
      ninetyDayMetrics,
      sevenDayPages,
      ninetyDayPages,
      sevenDaySources,
    ] = await Promise.all([
      fetchPeriodMetrics(propertyId, token, 7),
      fetchPeriodMetrics(propertyId, token, 90),
      fetchTopPages(propertyId, token, 7),
      fetchTopPages(propertyId, token, 90),
      fetchTopSources(propertyId, token, 7),
    ]);

    return {
      sevenDay: {
        metrics: sevenDayMetrics,
        dailyAverage: toDailyAverage(sevenDayMetrics, 7),
        topPages: sevenDayPages,
        topSources: sevenDaySources,
      },
      ninetyDay: {
        metrics: ninetyDayMetrics,
        dailyAverage: toDailyAverage(ninetyDayMetrics, 90),
        topPages: ninetyDayPages,
        topSources: [],
      },
      available: true,
    };
  } catch (err) {
    return {
      sevenDay: emptyPeriod(),
      ninetyDay: emptyPeriod(),
      available: false,
      error: `GA4 fetch failed: ${err instanceof Error ? err.message : err}`,
    };
  }
}

function emptyPeriod(): GA4PeriodData {
  const emptyMetrics: GA4Metrics = {
    sessions: 0,
    activeUsers: 0,
    newUsers: 0,
    screenPageViews: 0,
    averageSessionDuration: 0,
    bounceRate: 0,
    engagementRate: 0,
    eventsPerSession: 0,
  };
  return {
    metrics: emptyMetrics,
    dailyAverage: emptyMetrics,
    topPages: [],
    topSources: [],
  };
}
