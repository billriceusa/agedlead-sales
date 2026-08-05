import { getAccessToken } from "./google-auth";

export interface GSCMetrics {
  clicks: number;
  impressions: number;
  ctr: number;
  position: number;
}

export interface GSCQueryData {
  query: string;
  clicks: number;
  impressions: number;
  ctr: number;
  position: number;
}

export interface GSCPageData {
  page: string;
  clicks: number;
  impressions: number;
  ctr: number;
  position: number;
}

export interface GSCDeviceData {
  device: string;
  clicks: number;
  impressions: number;
  ctr: number;
}

export interface GSCPeriodData {
  /**
   * False when Search Console answered 200 with no rows. The metrics below are
   * then zeros for rendering convenience ONLY — they are not a measurement and
   * must never be persisted as one. Anything writing to a durable record has to
   * branch on this first; see buildSnapshot() in lib/cron/gsc-trend.ts.
   */
  hasData: boolean;
  metrics: GSCMetrics;
  dailyAverage: GSCMetrics;
  topQueries: GSCQueryData[];
  topPages: GSCPageData[];
  devices: GSCDeviceData[];
}

/**
 * A period read that either produced rows or did not.
 *
 * "No rows" is not zero traffic. A property verified moments ago returns an
 * empty rows array with a 200, which is how workagedleads.com came to be
 * recorded as 0 clicks / 0 impressions the day after cutover — a fabricated
 * measurement, indistinguishable from a real collapse, written permanently.
 */
type GSCPeriodResult =
  | { hasData: true; metrics: GSCMetrics }
  | { hasData: false };

export interface GSCReport {
  sevenDay: GSCPeriodData;
  ninetyDay: GSCPeriodData;
  available: boolean;
  error?: string;
}

function formatDate(d: Date): string {
  return d.toISOString().split("T")[0];
}

function dateRange(daysAgo: number): { start: string; end: string } {
  const end = new Date();
  end.setDate(end.getDate() - 2); // GSC data lags ~2 days
  const start = new Date(end);
  start.setDate(end.getDate() - daysAgo + 1);
  return { start: formatDate(start), end: formatDate(end) };
}

async function querySearchAnalytics(
  siteUrl: string,
  token: string,
  body: Record<string, unknown>
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
): Promise<any> {
  const encodedUrl = encodeURIComponent(siteUrl);
  const res = await fetch(
    `https://www.googleapis.com/webmasters/v3/sites/${encodedUrl}/searchAnalytics/query`,
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
    throw new Error(`GSC API error ${res.status}: ${text}`);
  }

  return res.json();
}

async function fetchPeriodMetrics(
  siteUrl: string,
  token: string,
  days: number
): Promise<GSCPeriodResult> {
  const range = dateRange(days);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const data: any = await querySearchAnalytics(siteUrl, token, {
    startDate: range.start,
    endDate: range.end,
    type: "web",
  });

  const rows = data.rows || [];
  if (rows.length === 0) {
    return { hasData: false };
  }

  let totalClicks = 0;
  let totalImpressions = 0;
  let totalPosition = 0;
  let positionCount = 0;

  for (const row of rows) {
    totalClicks += row.clicks || 0;
    totalImpressions += row.impressions || 0;
    if (row.position) {
      totalPosition += row.position;
      positionCount++;
    }
  }

  return {
    hasData: true,
    metrics: {
      clicks: totalClicks,
      impressions: totalImpressions,
      ctr: totalImpressions > 0 ? totalClicks / totalImpressions : 0,
      position: positionCount > 0 ? totalPosition / positionCount : 0,
    },
  };
}

async function fetchTopQueries(
  siteUrl: string,
  token: string,
  days: number
): Promise<GSCQueryData[]> {
  const range = dateRange(days);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const data: any = await querySearchAnalytics(siteUrl, token, {
    startDate: range.start,
    endDate: range.end,
    dimensions: ["query"],
    rowLimit: 20,
    type: "web",
  });

  return (data.rows || []).map(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (row: any) => ({
      query: row.keys?.[0] || "",
      clicks: row.clicks || 0,
      impressions: row.impressions || 0,
      ctr: row.ctr || 0,
      position: row.position || 0,
    })
  );
}

async function fetchTopPages(
  siteUrl: string,
  token: string,
  days: number
): Promise<GSCPageData[]> {
  const range = dateRange(days);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const data: any = await querySearchAnalytics(siteUrl, token, {
    startDate: range.start,
    endDate: range.end,
    dimensions: ["page"],
    rowLimit: 15,
    type: "web",
  });

  return (data.rows || []).map(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (row: any) => ({
      page: row.keys?.[0] || "",
      clicks: row.clicks || 0,
      impressions: row.impressions || 0,
      ctr: row.ctr || 0,
      position: row.position || 0,
    })
  );
}

async function fetchDeviceBreakdown(
  siteUrl: string,
  token: string,
  days: number
): Promise<GSCDeviceData[]> {
  const range = dateRange(days);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const data: any = await querySearchAnalytics(siteUrl, token, {
    startDate: range.start,
    endDate: range.end,
    dimensions: ["device"],
    type: "web",
  });

  return (data.rows || []).map(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (row: any) => ({
      device: row.keys?.[0] || "",
      clicks: row.clicks || 0,
      impressions: row.impressions || 0,
      ctr: row.ctr || 0,
    })
  );
}

function toDailyAverage(metrics: GSCMetrics, days: number): GSCMetrics {
  return {
    clicks: metrics.clicks / days,
    impressions: metrics.impressions / days,
    ctr: metrics.ctr,
    position: metrics.position,
  };
}

/**
 * `available` means the fetch and auth succeeded — NOT that there was data.
 * Check `sevenDay.hasData` for that. Auth failures and 403s still throw and
 * land in the catch below, which is why a lost grant can never masquerade as
 * a quiet week.
 *
 * Pass the property explicitly. It used to read GSC_SITE_URL itself, which
 * made tracking two properties through a domain migration impossible.
 */
export async function fetchGSCReport(
  siteUrlArg?: string
): Promise<GSCReport> {
  const siteUrl = siteUrlArg ?? process.env.GSC_SITE_URL;
  if (!siteUrl) {
    return {
      sevenDay: emptyPeriod(),
      ninetyDay: emptyPeriod(),
      available: false,
      error: "GSC_SITE_URL not configured",
    };
  }

  try {
    const token = await getAccessToken();

    const [
      sevenDayMetrics,
      ninetyDayMetrics,
      sevenDayQueries,
      ninetyDayQueries,
      sevenDayPages,
      devices,
    ] = await Promise.all([
      fetchPeriodMetrics(siteUrl, token, 7),
      fetchPeriodMetrics(siteUrl, token, 90),
      fetchTopQueries(siteUrl, token, 7),
      fetchTopQueries(siteUrl, token, 90),
      fetchTopPages(siteUrl, token, 7),
      fetchDeviceBreakdown(siteUrl, token, 7),
    ]);

    const zero: GSCMetrics = { clicks: 0, impressions: 0, ctr: 0, position: 0 };
    const seven = sevenDayMetrics.hasData ? sevenDayMetrics.metrics : zero;
    const ninety = ninetyDayMetrics.hasData ? ninetyDayMetrics.metrics : zero;

    return {
      sevenDay: {
        hasData: sevenDayMetrics.hasData,
        metrics: seven,
        dailyAverage: toDailyAverage(seven, 7),
        topQueries: sevenDayQueries,
        topPages: sevenDayPages,
        devices,
      },
      ninetyDay: {
        hasData: ninetyDayMetrics.hasData,
        metrics: ninety,
        dailyAverage: toDailyAverage(ninety, 90),
        topQueries: ninetyDayQueries,
        topPages: [],
        devices: [],
      },
      available: true,
    };
  } catch (err) {
    return {
      sevenDay: emptyPeriod(),
      ninetyDay: emptyPeriod(),
      available: false,
      error: `GSC fetch failed: ${err instanceof Error ? err.message : err}`,
    };
  }
}

function emptyPeriod(): GSCPeriodData {
  return {
    hasData: false,
    metrics: { clicks: 0, impressions: 0, ctr: 0, position: 0 },
    dailyAverage: { clicks: 0, impressions: 0, ctr: 0, position: 0 },
    topQueries: [],
    topPages: [],
    devices: [],
  };
}
