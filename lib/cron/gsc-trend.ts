// Persist a daily snapshot of Google Search Console metrics to
// data/gsc-trend.json in GitHub. The daily-performance cron already fetches GSC
// for its AI summary but throws the raw numbers away — this keeps them so we can
// actually measure CTR/traffic trends over time (e.g. did a title change lift
// CTR? is the disavow recovering rankings?) and feed the prune decision later.
//
// One snapshot per day, keyed by date and idempotent on re-run. Records the
// rolling 7-day window (smoothed, less noisy than single-day GSC which also lags
// ~2 days), plus top pages and queries for per-URL tracking.

import type { GSCReport } from "./gsc-data";

const MAX_SNAPSHOTS = 365; // ~1 year of daily history
const TOP_N = 10; // top pages / queries kept per snapshot

export interface GscTrendMetrics {
  clicks: number;
  impressions: number;
  ctr: number;
  position: number;
}

export interface GscTrendPage {
  page: string;
  clicks: number;
  impressions: number;
  ctr: number;
  position: number;
}

export interface GscTrendQuery {
  query: string;
  clicks: number;
  impressions: number;
  ctr: number;
  position: number;
}

export interface GscTrendSnapshot {
  date: string; // YYYY-MM-DD
  /** Rolling 7-day window totals — the smoothed headline series. */
  rolling7d: GscTrendMetrics;
  topPages: GscTrendPage[];
  topQueries: GscTrendQuery[];
}

export interface GscTrend {
  lastUpdated: string;
  snapshots: GscTrendSnapshot[];
}

function round(n: number, dp = 4): number {
  const f = 10 ** dp;
  return Math.round((n || 0) * f) / f;
}

export async function fetchGscTrend(): Promise<GscTrend | null> {
  const token = process.env.GITHUB_TOKEN;
  const repo = process.env.GITHUB_REPO;
  const branch = process.env.GITHUB_BRANCH || "main";

  if (!token || !repo) return null;

  try {
    const res = await fetch(
      `https://api.github.com/repos/${repo}/contents/data/gsc-trend.json?ref=${branch}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/vnd.github.v3+json",
        },
      }
    );
    if (!res.ok) return null; // 404 on first run is expected

    const data = (await res.json()) as { content?: string };
    if (!data.content) return null;

    const decoded = Buffer.from(data.content, "base64").toString("utf-8");
    return JSON.parse(decoded) as GscTrend;
  } catch {
    return null;
  }
}

function buildSnapshot(gsc: GSCReport, date: string): GscTrendSnapshot {
  const m = gsc.sevenDay.metrics;
  return {
    date,
    rolling7d: {
      clicks: m.clicks || 0,
      impressions: m.impressions || 0,
      ctr: round(m.ctr),
      position: round(m.position, 2),
    },
    topPages: gsc.sevenDay.topPages.slice(0, TOP_N).map((p) => ({
      page: p.page,
      clicks: p.clicks || 0,
      impressions: p.impressions || 0,
      ctr: round(p.ctr),
      position: round(p.position, 2),
    })),
    topQueries: gsc.sevenDay.topQueries.slice(0, TOP_N).map((q) => ({
      query: q.query,
      clicks: q.clicks || 0,
      impressions: q.impressions || 0,
      ctr: round(q.ctr),
      position: round(q.position, 2),
    })),
  };
}

/**
 * Upsert today's snapshot. Idempotent: re-running on the same day replaces that
 * day's row rather than appending a duplicate. Returns changed=false only when
 * an identical snapshot for today already exists (avoids no-op commits).
 */
export function appendGscSnapshot(
  existing: GscTrend | null,
  gsc: GSCReport,
  date: string
): { trend: GscTrend; changed: boolean } {
  const snapshot = buildSnapshot(gsc, date);
  const snapshots = (existing?.snapshots ?? []).filter((s) => s.date !== date);

  const prior = existing?.snapshots.find((s) => s.date === date);
  const identical = prior && JSON.stringify(prior) === JSON.stringify(snapshot);

  snapshots.push(snapshot);
  snapshots.sort((a, b) => a.date.localeCompare(b.date));
  const trimmed =
    snapshots.length > MAX_SNAPSHOTS ? snapshots.slice(-MAX_SNAPSHOTS) : snapshots;

  return {
    trend: {
      lastUpdated: existing?.lastUpdated ?? "",
      snapshots: trimmed,
    },
    changed: !identical,
  };
}

export function serializeGscTrend(trend: GscTrend, nowIso: string): string {
  return JSON.stringify({ ...trend, lastUpdated: nowIso }, null, 2) + "\n";
}
