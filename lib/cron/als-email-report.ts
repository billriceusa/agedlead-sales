// Weekly performance report for the Aged Leads Insights lifecycle email program.
//
// Deliberately webhook-free (Bill's call — webhooks add deliverability/complexity
// risk). Everything here is pulled on a schedule from two read APIs we already
// trust:
//
//   1. Resend API (full-access key) — audience sizes, subscribed/unsubscribed
//      counts + rate, and the broadcast log. Cumulative audience totals are
//      snapshotted weekly to data/als-email-report-trend.json so we can show
//      REAL week-over-week growth instead of a single static number.
//
//   2. GA4 (agedleadsales.com property, via the same Vercel-OIDC → impersonated
//      service account the other crons use) filtered to the email program's UTMs
//      (utm_source=agedleadsales, utm_medium=email). This is the on-site
//      footprint of the sends: sessions, engagement, key events, by journey and
//      landing page. The buy-CTA → agedleadstore.com revenue lives in a separate
//      (client) GA4 property; we read it ONLY if ALS_STORE_GA4_PROPERTY_ID is set
//      and the service account has access, and degrade with a note otherwise —
//      we never fabricate a revenue number.
//
// No open/click aggregates: the Resend broadcast API doesn't expose them and we
// don't run webhooks, so engagement comes from GA4 UTMs, by design.

import { getAccessToken } from "./google-auth";
import {
  fetchBroadcasts,
  fetchAudiences,
  fetchAudienceContacts,
  type EmailCampaignData,
} from "@/lib/resend";
import {
  ALS_AUDIENCE_PURCHASERS,
  ALS_AUDIENCE_INQUIRIES,
} from "@/lib/als/config";

const REPORT_WINDOW_DAYS = 7;
const MAX_SNAPSHOTS = 104; // ~2 years of weekly history

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface AudienceStat {
  name: string;
  total: number;
  subscribed: number;
  unsubscribed: number;
  unsubRate: number; // unsubscribed / total, 0 when empty
}

export interface AudienceDelta {
  name: string;
  totalDelta: number;
  subscribedDelta: number;
  unsubscribedDelta: number;
}

export interface Ga4CampaignRow {
  campaign: string;
  sessions: number;
  keyEvents: number;
}

export interface Ga4PageRow {
  page: string;
  sessions: number;
}

export interface Ga4EmailAttribution {
  available: boolean;
  error?: string;
  propertyId: string;
  windowStart: string;
  windowEnd: string;
  sessions: number;
  activeUsers: number;
  engagedSessions: number;
  engagementRate: number; // engagedSessions / sessions
  keyEvents: number | null; // null when the property predates the metric rename
  byCampaign: Ga4CampaignRow[];
  byLandingPage: Ga4PageRow[];
}

export interface StoreRevenue {
  available: boolean;
  error?: string;
  propertyId?: string;
  sessions: number;
  keyEvents: number;
  totalRevenue: number; // USD
}

export interface AlsEmailReport {
  generatedAt: string;
  reportDate: string; // YYYY-MM-DD
  audiences: AudienceStat[];
  audienceDeltas: AudienceDelta[]; // vs prior weekly snapshot; empty on first run
  priorSnapshotDate: string | null;
  broadcasts: EmailCampaignData[];
  ga4: Ga4EmailAttribution;
  store: StoreRevenue | null; // null when ALS_STORE_GA4_PROPERTY_ID unset
  errors: string[];
}

// ---------------------------------------------------------------------------
// Date helpers (mirror ga4-data.ts: GA4 lags ~1 day, so window ends yesterday)
// ---------------------------------------------------------------------------

function formatDate(d: Date): string {
  return d.toISOString().split("T")[0];
}

function reportWindow(days: number): { start: string; end: string } {
  const end = new Date();
  end.setDate(end.getDate() - 1);
  const start = new Date(end);
  start.setDate(end.getDate() - days + 1);
  return { start: formatDate(start), end: formatDate(end) };
}

// ---------------------------------------------------------------------------
// Resend: audience stats (targets the two lifecycle buyer audiences by name)
// ---------------------------------------------------------------------------

export async function fetchAudienceStats(apiKey: string): Promise<AudienceStat[]> {
  const wanted = [ALS_AUDIENCE_PURCHASERS, ALS_AUDIENCE_INQUIRIES];
  const audiences = await fetchAudiences(apiKey);

  const stats: AudienceStat[] = [];
  for (const name of wanted) {
    // ensureAudience's dedupe logic showed duplicate-name audiences can exist;
    // pick the most-populated match so the report tracks the live one.
    const matches = audiences.filter((a) => a.name === name);
    if (matches.length === 0) {
      stats.push({ name, total: 0, subscribed: 0, unsubscribed: 0, unsubRate: 0 });
      continue;
    }
    let best = { total: -1, subscribed: 0, unsubscribed: 0 };
    for (const a of matches) {
      const contacts = await fetchAudienceContacts(apiKey, a.id);
      const total = contacts.length;
      if (total > best.total) {
        best = {
          total,
          subscribed: contacts.filter((c) => !c.unsubscribed).length,
          unsubscribed: contacts.filter((c) => c.unsubscribed).length,
        };
      }
    }
    stats.push({
      name,
      total: best.total < 0 ? 0 : best.total,
      subscribed: best.subscribed,
      unsubscribed: best.unsubscribed,
      unsubRate: best.total > 0 ? best.unsubscribed / best.total : 0,
    });
  }
  return stats;
}

// ---------------------------------------------------------------------------
// GA4: email-attributed activity on the agedleadsales.com property
// ---------------------------------------------------------------------------

async function ga4RunReport(
  propertyId: string,
  token: string,
  body: Record<string, unknown>
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
): Promise<any> {
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

// Restrict to the lifecycle program's UTMs. source CONTAINS "agedleadsales"
// (tolerates agedleadsales / agedleadsales.com), medium EXACT "email".
function emailUtmFilter() {
  return {
    andGroup: {
      expressions: [
        {
          filter: {
            fieldName: "sessionSource",
            stringFilter: {
              matchType: "CONTAINS",
              value: "agedleadsales",
              caseSensitive: false,
            },
          },
        },
        {
          filter: {
            fieldName: "sessionMedium",
            stringFilter: { matchType: "EXACT", value: "email", caseSensitive: false },
          },
        },
      ],
    },
  };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function metricVal(row: any, i: number): number {
  return parseFloat(row?.metricValues?.[i]?.value || "0");
}

export async function fetchEmailAttribution(): Promise<Ga4EmailAttribution> {
  const propertyId = process.env.GA4_PROPERTY_ID || "";
  const win = reportWindow(REPORT_WINDOW_DAYS);
  const empty: Ga4EmailAttribution = {
    available: false,
    propertyId,
    windowStart: win.start,
    windowEnd: win.end,
    sessions: 0,
    activeUsers: 0,
    engagedSessions: 0,
    engagementRate: 0,
    keyEvents: null,
    byCampaign: [],
    byLandingPage: [],
  };
  if (!propertyId) {
    return { ...empty, error: "GA4_PROPERTY_ID not configured" };
  }

  try {
    const token = await getAccessToken();
    const dateRanges = [{ startDate: win.start, endDate: win.end }];
    const dimensionFilter = emailUtmFilter();

    // Totals with long-stable metrics only (won't 400 on older properties).
    const totals = await ga4RunReport(propertyId, token, {
      dateRanges,
      dimensionFilter,
      metrics: [
        { name: "sessions" },
        { name: "activeUsers" },
        { name: "engagedSessions" },
      ],
    });
    const trow = totals.rows?.[0];
    const sessions = metricVal(trow, 0);
    const activeUsers = metricVal(trow, 1);
    const engagedSessions = metricVal(trow, 2);

    // Key events (formerly "conversions") in a separate call so a metric-name
    // mismatch on a pre-2024 property only drops this line, not the whole block.
    let keyEvents: number | null = null;
    try {
      const ke = await ga4RunReport(propertyId, token, {
        dateRanges,
        dimensionFilter,
        metrics: [{ name: "keyEvents" }],
      });
      keyEvents = metricVal(ke.rows?.[0], 0);
    } catch {
      keyEvents = null;
    }

    // By journey (sessionCampaignName) and landing page.
    const [byCampRaw, byPageRaw] = await Promise.all([
      ga4RunReport(propertyId, token, {
        dateRanges,
        dimensionFilter,
        dimensions: [{ name: "sessionCampaignName" }],
        metrics: [{ name: "sessions" }, { name: "keyEvents" }],
        orderBys: [{ metric: { metricName: "sessions" }, desc: true }],
        limit: 15,
      }).catch(() =>
        ga4RunReport(propertyId, token, {
          dateRanges,
          dimensionFilter,
          dimensions: [{ name: "sessionCampaignName" }],
          metrics: [{ name: "sessions" }],
          orderBys: [{ metric: { metricName: "sessions" }, desc: true }],
          limit: 15,
        })
      ),
      ga4RunReport(propertyId, token, {
        dateRanges,
        dimensionFilter,
        dimensions: [{ name: "landingPagePlusQueryString" }],
        metrics: [{ name: "sessions" }],
        orderBys: [{ metric: { metricName: "sessions" }, desc: true }],
        limit: 10,
      }),
    ]);

    const byCampaign: Ga4CampaignRow[] = (byCampRaw.rows || []).map(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (r: any) => ({
        campaign: r.dimensionValues?.[0]?.value || "(not set)",
        sessions: metricVal(r, 0),
        keyEvents: r.metricValues?.[1] ? metricVal(r, 1) : 0,
      })
    );
    const byLandingPage: Ga4PageRow[] = (byPageRaw.rows || []).map(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (r: any) => ({
        page: r.dimensionValues?.[0]?.value || "",
        sessions: metricVal(r, 0),
      })
    );

    return {
      available: true,
      propertyId,
      windowStart: win.start,
      windowEnd: win.end,
      sessions,
      activeUsers,
      engagedSessions,
      engagementRate: sessions > 0 ? engagedSessions / sessions : 0,
      keyEvents,
      byCampaign,
      byLandingPage,
    };
  } catch (err) {
    return {
      ...empty,
      error: `GA4 fetch failed: ${err instanceof Error ? err.message : err}`,
    };
  }
}

// Optional: agedleadstore.com revenue from email-attributed sessions. Only runs
// when ALS_STORE_GA4_PROPERTY_ID is set AND the service account can read it.
export async function fetchStoreRevenue(): Promise<StoreRevenue | null> {
  const propertyId = process.env.ALS_STORE_GA4_PROPERTY_ID;
  if (!propertyId) return null; // not configured → omit cleanly, no fabrication

  const win = reportWindow(REPORT_WINDOW_DAYS);
  try {
    const token = await getAccessToken();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const data: any = await ga4RunReport(propertyId, token, {
      dateRanges: [{ startDate: win.start, endDate: win.end }],
      dimensionFilter: emailUtmFilter(),
      metrics: [
        { name: "sessions" },
        { name: "keyEvents" },
        { name: "totalRevenue" },
      ],
    });
    const row = data.rows?.[0];
    return {
      available: true,
      propertyId,
      sessions: metricVal(row, 0),
      keyEvents: metricVal(row, 1),
      totalRevenue: metricVal(row, 2),
    };
  } catch (err) {
    return {
      available: false,
      propertyId,
      sessions: 0,
      keyEvents: 0,
      totalRevenue: 0,
      error: `Store GA4 fetch failed: ${err instanceof Error ? err.message : err}`,
    };
  }
}

// ---------------------------------------------------------------------------
// Weekly trend snapshot (real WoW growth) — mirrors gsc-trend.ts
// ---------------------------------------------------------------------------

export interface EmailTrendSnapshot {
  date: string; // YYYY-MM-DD
  audiences: {
    name: string;
    total: number;
    subscribed: number;
    unsubscribed: number;
  }[];
  emailSessions: number; // GA4 email-attributed sessions, 7d window
  emailKeyEvents: number | null;
}

export interface EmailTrend {
  lastUpdated: string;
  snapshots: EmailTrendSnapshot[];
}

export async function fetchEmailTrend(): Promise<EmailTrend | null> {
  const token = process.env.GITHUB_TOKEN;
  const repo = process.env.GITHUB_REPO;
  const branch = process.env.GITHUB_BRANCH || "main";
  if (!token || !repo) return null;

  try {
    const res = await fetch(
      `https://api.github.com/repos/${repo}/contents/data/als-email-report-trend.json?ref=${branch}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/vnd.github.v3+json",
        },
        cache: "no-store",
      }
    );
    if (!res.ok) return null; // 404 first run
    const data = (await res.json()) as { content?: string };
    if (!data.content) return null;
    return JSON.parse(
      Buffer.from(data.content, "base64").toString("utf-8")
    ) as EmailTrend;
  } catch {
    return null;
  }
}

function buildSnapshot(report: AlsEmailReport): EmailTrendSnapshot {
  return {
    date: report.reportDate,
    audiences: report.audiences.map((a) => ({
      name: a.name,
      total: a.total,
      subscribed: a.subscribed,
      unsubscribed: a.unsubscribed,
    })),
    emailSessions: report.ga4.available ? report.ga4.sessions : 0,
    emailKeyEvents: report.ga4.available ? report.ga4.keyEvents : null,
  };
}

export function appendEmailSnapshot(
  existing: EmailTrend | null,
  report: AlsEmailReport
): { trend: EmailTrend; changed: boolean } {
  const snapshot = buildSnapshot(report);
  const prior = existing?.snapshots.find((s) => s.date === snapshot.date);
  const identical = prior && JSON.stringify(prior) === JSON.stringify(snapshot);

  const snapshots = (existing?.snapshots ?? []).filter(
    (s) => s.date !== snapshot.date
  );
  snapshots.push(snapshot);
  snapshots.sort((a, b) => a.date.localeCompare(b.date));
  const trimmed =
    snapshots.length > MAX_SNAPSHOTS ? snapshots.slice(-MAX_SNAPSHOTS) : snapshots;

  return {
    trend: { lastUpdated: existing?.lastUpdated ?? "", snapshots: trimmed },
    changed: !identical,
  };
}

export function serializeEmailTrend(trend: EmailTrend, nowIso: string): string {
  return JSON.stringify({ ...trend, lastUpdated: nowIso }, null, 2) + "\n";
}

// Compute audience deltas vs the most recent PRIOR weekly snapshot.
export function computeDeltas(
  report: AlsEmailReport,
  existing: EmailTrend | null
): { deltas: AudienceDelta[]; priorDate: string | null } {
  const prior = (existing?.snapshots ?? [])
    .filter((s) => s.date < report.reportDate)
    .sort((a, b) => b.date.localeCompare(a.date))[0];
  if (!prior) return { deltas: [], priorDate: null };

  const deltas: AudienceDelta[] = report.audiences.map((a) => {
    const p = prior.audiences.find((x) => x.name === a.name);
    return {
      name: a.name,
      totalDelta: a.total - (p?.total ?? 0),
      subscribedDelta: a.subscribed - (p?.subscribed ?? 0),
      unsubscribedDelta: a.unsubscribed - (p?.unsubscribed ?? 0),
    };
  });
  return { deltas, priorDate: prior.date };
}

// ---------------------------------------------------------------------------
// Orchestration
// ---------------------------------------------------------------------------

export async function gatherAlsEmailReport(): Promise<AlsEmailReport> {
  const errors: string[] = [];
  const generatedAt = new Date().toISOString();
  const reportDate = generatedAt.split("T")[0];
  const apiKey = process.env.RESEND_API_KEY || "";

  let audiences: AudienceStat[] = [];
  let broadcasts: EmailCampaignData[] = [];
  if (!apiKey) {
    errors.push("RESEND_API_KEY not configured — audience + broadcast data skipped");
  } else {
    try {
      audiences = await fetchAudienceStats(apiKey);
    } catch (err) {
      errors.push(`Resend audiences: ${err instanceof Error ? err.message : err}`);
    }
    try {
      broadcasts = await fetchBroadcasts(apiKey);
    } catch (err) {
      errors.push(`Resend broadcasts: ${err instanceof Error ? err.message : err}`);
    }
  }

  const [ga4, store] = await Promise.all([
    fetchEmailAttribution(),
    fetchStoreRevenue(),
  ]);
  if (!ga4.available && ga4.error) errors.push(ga4.error);
  if (store && !store.available && store.error) errors.push(store.error);

  return {
    generatedAt,
    reportDate,
    audiences,
    audienceDeltas: [],
    priorSnapshotDate: null,
    broadcasts,
    ga4,
    store,
    errors,
  };
}

// ---------------------------------------------------------------------------
// Email rendering (dark-green house style, matches the other ALS reports)
// ---------------------------------------------------------------------------

function esc(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function num(n: number): string {
  return Math.round(n).toLocaleString("en-US");
}

function pct(n: number): string {
  return `${(n * 100).toFixed(1)}%`;
}

function deltaBadge(d: number, invert = false): string {
  if (d === 0) return `<span style="color:#6b7280;">±0</span>`;
  const good = invert ? d < 0 : d > 0;
  const color = good ? "#166534" : "#b45309";
  const sign = d > 0 ? "+" : "";
  return `<span style="color:${color};font-weight:600;">${sign}${num(d)}</span>`;
}

export function buildAlsEmailReportEmail(report: AlsEmailReport): string {
  const { ga4, store } = report;

  const audienceRows = report.audiences
    .map((a) => {
      const d = report.audienceDeltas.find((x) => x.name === a.name);
      const growth = d ? deltaBadge(d.totalDelta) : "<span style='color:#6b7280;'>—</span>";
      const unsubGrowth = d
        ? deltaBadge(d.unsubscribedDelta, true)
        : "<span style='color:#6b7280;'>—</span>";
      return `
      <tr>
        <td style="padding:8px 12px;border-bottom:1px solid #e5e7eb;">${esc(a.name)}</td>
        <td style="padding:8px 12px;border-bottom:1px solid #e5e7eb;text-align:right;"><strong>${num(a.total)}</strong></td>
        <td style="padding:8px 12px;border-bottom:1px solid #e5e7eb;text-align:right;">${growth}</td>
        <td style="padding:8px 12px;border-bottom:1px solid #e5e7eb;text-align:right;">${num(a.subscribed)}</td>
        <td style="padding:8px 12px;border-bottom:1px solid #e5e7eb;text-align:right;">${num(a.unsubscribed)} (${pct(a.unsubRate)})</td>
        <td style="padding:8px 12px;border-bottom:1px solid #e5e7eb;text-align:right;">${unsubGrowth}</td>
      </tr>`;
    })
    .join("");

  const priorNote = report.priorSnapshotDate
    ? `Δ vs ${esc(report.priorSnapshotDate)}`
    : "first snapshot — deltas begin next week";

  const ga4Block = ga4.available
    ? `
    <div style="background:#f0fdf4;border:1px solid #bbf7d0;border-radius:8px;padding:16px;margin-bottom:24px;">
      <h2 style="color:#166534;margin-top:0;font-size:18px;">Email-attributed activity on agedleadsales.com</h2>
      <p style="margin:0 0 12px;color:#374151;font-size:13px;">UTM <code>source=agedleadsales · medium=email</code> · ${esc(ga4.windowStart)} → ${esc(ga4.windowEnd)}</p>
      <table style="width:100%;border-collapse:collapse;">
        <tr>
          <td style="padding:6px 12px;">Sessions</td><td style="padding:6px 12px;text-align:right;"><strong>${num(ga4.sessions)}</strong></td>
          <td style="padding:6px 12px;">Users</td><td style="padding:6px 12px;text-align:right;"><strong>${num(ga4.activeUsers)}</strong></td>
        </tr>
        <tr>
          <td style="padding:6px 12px;">Engaged sessions</td><td style="padding:6px 12px;text-align:right;"><strong>${num(ga4.engagedSessions)}</strong></td>
          <td style="padding:6px 12px;">Engagement rate</td><td style="padding:6px 12px;text-align:right;"><strong>${pct(ga4.engagementRate)}</strong></td>
        </tr>
        <tr>
          <td style="padding:6px 12px;">Key events</td><td style="padding:6px 12px;text-align:right;"><strong>${ga4.keyEvents === null ? "n/a" : num(ga4.keyEvents)}</strong></td>
          <td></td><td></td>
        </tr>
      </table>
      ${
        ga4.byCampaign.length
          ? `<h3 style="font-size:14px;color:#1B4D3E;margin:16px 0 6px;">By journey</h3>
      <table style="width:100%;border-collapse:collapse;font-size:13px;">
        ${ga4.byCampaign
          .map(
            (c) =>
              `<tr><td style="padding:4px 12px;border-bottom:1px solid #e5e7eb;"><code>${esc(c.campaign)}</code></td><td style="padding:4px 12px;border-bottom:1px solid #e5e7eb;text-align:right;">${num(c.sessions)} sess</td><td style="padding:4px 12px;border-bottom:1px solid #e5e7eb;text-align:right;">${num(c.keyEvents)} ev</td></tr>`
          )
          .join("")}
      </table>`
          : ""
      }
      ${
        ga4.byLandingPage.length
          ? `<h3 style="font-size:14px;color:#1B4D3E;margin:16px 0 6px;">Top landing pages</h3>
      <table style="width:100%;border-collapse:collapse;font-size:13px;">
        ${ga4.byLandingPage
          .map(
            (p) =>
              `<tr><td style="padding:4px 12px;border-bottom:1px solid #e5e7eb;">${esc(p.page)}</td><td style="padding:4px 12px;border-bottom:1px solid #e5e7eb;text-align:right;">${num(p.sessions)} sess</td></tr>`
          )
          .join("")}
      </table>`
          : ""
      }
    </div>`
    : `
    <div style="background:#fffbeb;border:1px solid #fde68a;border-radius:8px;padding:16px;margin-bottom:24px;">
      <h2 style="color:#b45309;margin-top:0;font-size:18px;">Email-attributed GA4 — unavailable</h2>
      <p style="margin:0;color:#7c2d12;font-size:13px;">${esc(ga4.error || "No data")}</p>
    </div>`;

  let storeBlock = "";
  if (store === null) {
    storeBlock = `
    <div style="background:#f9fafb;border:1px solid #e5e7eb;border-radius:8px;padding:16px;margin-bottom:24px;">
      <h2 style="color:#374151;margin-top:0;font-size:18px;">agedleadstore.com revenue</h2>
      <p style="margin:0;color:#6b7280;font-size:13px;">Buy-CTA orders + revenue are tracked in the agedleadstore.com GA4 property, which this service account can't read. Set <code>ALS_STORE_GA4_PROPERTY_ID</code> (with read access) to surface revenue here; until then read it in that property's UI.</p>
    </div>`;
  } else if (store.available) {
    storeBlock = `
    <div style="background:#f0faf5;border:1px solid #b8e0cf;border-radius:8px;padding:16px;margin-bottom:24px;">
      <h2 style="color:#1B4D3E;margin-top:0;font-size:18px;">agedleadstore.com — email-driven revenue</h2>
      <table style="width:100%;border-collapse:collapse;">
        <tr>
          <td style="padding:6px 12px;">Sessions</td><td style="padding:6px 12px;text-align:right;"><strong>${num(store.sessions)}</strong></td>
          <td style="padding:6px 12px;">Key events</td><td style="padding:6px 12px;text-align:right;"><strong>${num(store.keyEvents)}</strong></td>
          <td style="padding:6px 12px;">Revenue</td><td style="padding:6px 12px;text-align:right;"><strong>$${num(store.totalRevenue)}</strong></td>
        </tr>
      </table>
    </div>`;
  } else {
    storeBlock = `
    <div style="background:#fffbeb;border:1px solid #fde68a;border-radius:8px;padding:16px;margin-bottom:24px;">
      <h2 style="color:#b45309;margin-top:0;font-size:18px;">agedleadstore.com revenue — unavailable</h2>
      <p style="margin:0;color:#7c2d12;font-size:13px;">${esc(store.error || "No data")}</p>
    </div>`;
  }

  const sentBroadcasts = report.broadcasts.filter((b) => b.sendDate);
  const broadcastRows = sentBroadcasts.length
    ? sentBroadcasts
        .slice(0, 12)
        .map(
          (b) =>
            `<tr><td style="padding:8px 12px;border-bottom:1px solid #e5e7eb;">${esc(b.subject)}</td><td style="padding:8px 12px;border-bottom:1px solid #e5e7eb;">${esc(b.status)}</td><td style="padding:8px 12px;border-bottom:1px solid #e5e7eb;">${esc(b.sendDate || "")}</td></tr>`
        )
        .join("")
    : `<tr><td colspan="3" style="padding:12px;color:#6b7280;">No broadcasts sent yet. The lifecycle program sends per-contact (not broadcasts), so this stays empty unless a manual broadcast goes out.</td></tr>`;

  const errorsHtml = report.errors.length
    ? `<div style="background:#fef2f2;border:1px solid #fecaca;border-radius:8px;padding:16px;margin-top:24px;">
        <h3 style="color:#dc2626;margin-top:0;">Warnings</h3>
        <ul>${report.errors.map((e) => `<li style="font-size:13px;">${esc(e)}</li>`).join("")}</ul>
      </div>`
    : "";

  return `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;color:#1f2937;max-width:800px;margin:0 auto;padding:20px;">

  <div style="background:linear-gradient(135deg,#166534,#1B4D3E);color:white;padding:24px 32px;border-radius:12px;margin-bottom:24px;">
    <div style="display:inline-block;background:rgba(255,255,255,0.2);padding:2px 10px;border-radius:999px;font-size:12px;font-weight:700;letter-spacing:0.5px;">AGED LEADS INSIGHTS</div>
    <h1 style="margin:8px 0 4px;font-size:24px;">Weekly Email Program Report</h1>
    <p style="margin:0;opacity:0.9;">Lifecycle sends from news.agedleadsales.com → agedleadstore.com</p>
    <p style="margin:8px 0 0;opacity:0.7;font-size:14px;">${esc(report.reportDate)} · ${esc(priorNote)}</p>
  </div>

  <h2 style="font-size:18px;border-bottom:2px solid #e5e7eb;padding-bottom:8px;">Audiences</h2>
  <table style="width:100%;border-collapse:collapse;margin-bottom:24px;">
    <thead>
      <tr style="background:#f9fafb;">
        <th style="padding:8px 12px;text-align:left;border-bottom:2px solid #e5e7eb;">Audience</th>
        <th style="padding:8px 12px;text-align:right;border-bottom:2px solid #e5e7eb;">Total</th>
        <th style="padding:8px 12px;text-align:right;border-bottom:2px solid #e5e7eb;">WoW</th>
        <th style="padding:8px 12px;text-align:right;border-bottom:2px solid #e5e7eb;">Subscribed</th>
        <th style="padding:8px 12px;text-align:right;border-bottom:2px solid #e5e7eb;">Unsub (rate)</th>
        <th style="padding:8px 12px;text-align:right;border-bottom:2px solid #e5e7eb;">Unsub WoW</th>
      </tr>
    </thead>
    <tbody>${audienceRows}</tbody>
  </table>

  ${ga4Block}
  ${storeBlock}

  <h2 style="font-size:18px;border-bottom:2px solid #e5e7eb;padding-bottom:8px;">Broadcasts</h2>
  <table style="width:100%;border-collapse:collapse;margin-bottom:24px;">
    <thead>
      <tr style="background:#f9fafb;">
        <th style="padding:8px 12px;text-align:left;border-bottom:2px solid #e5e7eb;">Subject</th>
        <th style="padding:8px 12px;text-align:left;border-bottom:2px solid #e5e7eb;">Status</th>
        <th style="padding:8px 12px;text-align:left;border-bottom:2px solid #e5e7eb;">Sent</th>
      </tr>
    </thead>
    <tbody>${broadcastRows}</tbody>
  </table>

  ${errorsHtml}

  <hr style="border:none;border-top:1px solid #e5e7eb;margin:32px 0 16px;">
  <p style="color:#9ca3af;font-size:12px;">Generated by the AgedLeadSales.com weekly email-report cron. No webhooks — audiences + broadcasts from the Resend API, engagement from GA4 UTMs. Aggregate deliverability/bounce/complaint is in the Resend dashboard.</p>
</body>
</html>`;
}
