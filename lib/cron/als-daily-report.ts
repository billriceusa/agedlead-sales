/**
 * Daily email-program report for workagedleads.com.
 *
 * Replaces the Sunday `als-email-report` (Bill, 2026-09-09). One report, daily,
 * covering every email this property sends: the three lifecycle journeys and the
 * weekly newsletter.
 *
 * FOUR QUESTIONS, IN THIS ORDER
 *
 *   1. Did we send yesterday?  The program has now gone dark twice without
 *      anyone noticing — 34 days on a broken opt-out query, then a Tuesday
 *      newsletter that never fired because two crons disagreed about a filename.
 *      Both were invisible because nothing said "zero".
 *   2. Did it arrive?         Delivery, bounce and complaint rates, from the
 *      webhook capture. Especially the bounce rate: 3,591 never-mailed contacts
 *      entered the pool on 2026-09-09 and the sending domain is five weeks old.
 *   3. Did anyone engage?     Opens and clicks, same source.
 *   4. Did it earn?           Store-side sessions and revenue, which is the only
 *      number that pays.
 *
 * ENGAGEMENT DATA IS NOT RETROACTIVE. Resend's API exposes no open, click,
 * bounce or delivery figures — verified 2026-09-09 against both `GET /broadcasts`
 * and `GET /broadcasts/{id}`. Everything in section 2 and 3 comes from
 * `als_email_events`, populated by our own webhook, and therefore starts at the
 * moment that webhook was registered. Before then those sections read zero, and
 * a zero there means "not measured", not "nobody opened it". The report says so
 * rather than letting a reader draw the wrong conclusion.
 */
import { sql } from "drizzle-orm";
import { db } from "@/lib/db";
import { fetchStoreRevenue, type RevenueRow } from "@/lib/reports/store-revenue";
import { fetchAudienceContacts } from "@/lib/resend";

/** Campaign prefixes that identify an email placement on the store scoreboard. */
const EMAIL_CAMPAIGN_PREFIXES = [
  "welcome-",
  "replenish-",
  "winback-",
  "weekly-newsletter",
  "direct-offer",
];

export function isEmailCampaign(key: string): boolean {
  return EMAIL_CAMPAIGN_PREFIXES.some((p) => key.startsWith(p));
}

export interface JourneyRow {
  journey: string;
  sentYesterday: number;
  sent7d: number;
  active: number;
  dueToday: number;
  due7d: number;
}

export interface EngagementRow {
  delivered: number;
  opened: number;
  clicked: number;
  bounced: number;
  hardBounced: number;
  complained: number;
}

export interface DailyEmailReport {
  generatedAt: string;
  /** True once any webhook event has ever landed. Gates the engagement sections. */
  engagementTracking: boolean;
  sendsYesterday: number;
  sends7d: number;
  sends30d: number;
  journeys: JourneyRow[];
  enrolledYesterday: { journey: string; n: number }[];
  list: {
    total: number;
    mailable: number;
    unsubscribed: number;
    unsubbedYesterday: number;
    newsletterAudience: number | null;
  };
  engagement24h: EngagementRow;
  engagement7d: EngagementRow;
  topLinks7d: { url: string; clicks: number }[];
  recentHardBounces: { recipient: string; occurredAt: string }[];
  revenue: {
    available: boolean;
    mtdEmailSessions: number;
    mtdEmailRevenue: number;
    mtdAllSessions: number;
    mtdAllRevenue: number;
    byCampaign: RevenueRow[];
    goalTarget: number;
    commissionLikely: number;
  };
  warnings: string[];
}

function rowsOf<T>(r: unknown): T[] {
  return ((r as { rows?: T[] }).rows ?? []) as T[];
}
const n = (v: unknown): number => Number(v ?? 0);

async function engagementFor(interval: string): Promise<EngagementRow> {
  const r = await db.execute(sql`
    select
      sum(case when event_type = 'email.delivered' then 1 else 0 end)::int as delivered,
      count(distinct case when event_type = 'email.opened' then email_id end)::int as opened,
      count(distinct case when event_type = 'email.clicked' then email_id end)::int as clicked,
      sum(case when event_type = 'email.bounced' then 1 else 0 end)::int as bounced,
      sum(case when event_type = 'email.bounced' and bounce_type = 'hard' then 1 else 0 end)::int as hard_bounced,
      sum(case when event_type = 'email.complained' then 1 else 0 end)::int as complained
    from als_email_events
    where occurred_at > now() - ${sql.raw(`interval '${interval}'`)}`);
  const row = rowsOf<Record<string, unknown>>(r)[0] ?? {};
  return {
    delivered: n(row.delivered),
    // Distinct by email_id: one recipient opening five times is one open, which
    // is what an open RATE means. Raw event counts would overstate it.
    opened: n(row.opened),
    clicked: n(row.clicked),
    bounced: n(row.bounced),
    hardBounced: n(row.hard_bounced),
    complained: n(row.complained),
  };
}

export async function buildDailyEmailReport(): Promise<DailyEmailReport> {
  const warnings: string[] = [];

  const [sendsRes, journeyRes, enrolledRes, listRes, eventsExistRes] = await Promise.all([
    db.execute(sql`
      select
        sum(case when last_sent_at >= current_date - 1 and last_sent_at < current_date then 1 else 0 end)::int as yesterday,
        sum(case when last_sent_at > now() - interval '7 days' then 1 else 0 end)::int as d7,
        sum(case when last_sent_at > now() - interval '30 days' then 1 else 0 end)::int as d30
      from als_buyer_journeys where last_sent_at is not null`),
    db.execute(sql`
      select journey,
        sum(case when last_sent_at >= current_date - 1 and last_sent_at < current_date then 1 else 0 end)::int as sent_yesterday,
        sum(case when last_sent_at > now() - interval '7 days' then 1 else 0 end)::int as sent_7d,
        sum(case when status = 'active' then 1 else 0 end)::int as active,
        sum(case when status = 'active' and next_due_at::date = current_date then 1 else 0 end)::int as due_today,
        sum(case when status = 'active' and next_due_at < now() + interval '7 days' then 1 else 0 end)::int as due_7d
      from als_buyer_journeys group by 1 order by 1`),
    db.execute(sql`
      select journey, count(*)::int as n from als_buyer_journeys
      where entered_at >= current_date - 1 and entered_at < current_date
      group by 1 order by 2 desc`),
    db.execute(sql`
      select count(*)::int as total,
        sum(case when sendable and not unsubscribed then 1 else 0 end)::int as mailable,
        sum(case when unsubscribed then 1 else 0 end)::int as unsubscribed
      from als_buyer_contacts`),
    db.execute(sql`select count(*)::int as n from als_email_events`),
  ]);

  const s = rowsOf<Record<string, unknown>>(sendsRes)[0] ?? {};
  const listRow = rowsOf<Record<string, unknown>>(listRes)[0] ?? {};
  const engagementTracking = n(rowsOf<Record<string, unknown>>(eventsExistRes)[0]?.n) > 0;

  const [engagement24h, engagement7d, topLinksRes, bouncesRes] = await Promise.all([
    engagementFor("24 hours"),
    engagementFor("7 days"),
    db.execute(sql`
      select link_url as url, count(*)::int as clicks from als_email_events
      where event_type = 'email.clicked' and link_url is not null
        and occurred_at > now() - interval '7 days'
      group by 1 order by 2 desc limit 8`),
    db.execute(sql`
      select recipient, occurred_at from als_email_events
      where event_type = 'email.bounced' and bounce_type = 'hard'
        and occurred_at > now() - interval '7 days'
      order by occurred_at desc limit 10`),
  ]);

  // Newsletter audience is a nice-to-have; a Resend hiccup must not fail the report.
  let newsletterAudience: number | null = null;
  try {
    const key = (process.env.RESEND_API_KEY || "").trim();
    const aud = (process.env.RESEND_AUDIENCE_ID || "").trim();
    if (key && aud) {
      const contacts = await fetchAudienceContacts(key, aud);
      newsletterAudience = contacts.filter((c) => !c.unsubscribed).length;
    }
  } catch (err) {
    warnings.push(`Newsletter audience unavailable: ${err instanceof Error ? err.message : err}`);
  }

  // Store-side revenue. Local runs 403 on GA4; production reads it via Workload
  // Identity Federation. A failure here must degrade, not blank the report.
  let revenue: DailyEmailReport["revenue"] = {
    available: false,
    mtdEmailSessions: 0,
    mtdEmailRevenue: 0,
    mtdAllSessions: 0,
    mtdAllRevenue: 0,
    byCampaign: [],
    goalTarget: 0,
    commissionLikely: 0,
  };
  try {
    const sr = await fetchStoreRevenue();
    const email = sr.byCampaign.filter((c) => isEmailCampaign(c.key));
    revenue = {
      available: true,
      mtdEmailSessions: email.reduce((a, c) => a + c.sessions, 0),
      mtdEmailRevenue: email.reduce((a, c) => a + c.revenue, 0),
      mtdAllSessions: sr.mtd.sessions,
      mtdAllRevenue: sr.mtd.attributedRevenue,
      byCampaign: email.sort((a, b) => b.revenue - a.revenue || b.sessions - a.sessions),
      goalTarget: sr.goal.target,
      commissionLikely: sr.mtd.commissionLikely,
    };
  } catch (err) {
    warnings.push(`Store revenue unavailable: ${err instanceof Error ? err.message : err}`);
  }

  const journeys: JourneyRow[] = rowsOf<Record<string, unknown>>(journeyRes).map((r) => ({
    journey: String(r.journey),
    sentYesterday: n(r.sent_yesterday),
    sent7d: n(r.sent_7d),
    active: n(r.active),
    dueToday: n(r.due_today),
    due7d: n(r.due_7d),
  }));

  const sendsYesterday = n(s.yesterday);

  // The alarms. These are the two silent failures this program has actually had.
  if (sendsYesterday === 0) {
    warnings.push(
      "ZERO lifecycle emails sent yesterday. The program has gone dark twice before without anyone noticing — check the als-lifecycle heartbeat.",
    );
  }
  if (!engagementTracking) {
    warnings.push(
      "No engagement events captured yet. Register the Resend webhook at /api/webhooks/resend, or every open/click/bounce figure below stays at zero regardless of reality.",
    );
  }
  // A structural zero, not a real one. Resend's open and click tracking are per-DOMAIN
  // flags, off by default, and when they are off `email.opened` and `email.clicked`
  // simply never fire — so the report would show "0.0% open rate" on hundreds of
  // delivered emails and read as catastrophic engagement rather than absent measurement.
  // Found 2026-09-10: all four sending domains had open_tracking and click_tracking
  // false while the report displayed 0 opens on 247 deliveries.
  if (engagementTracking && engagement7d.delivered >= 50 && engagement7d.opened === 0) {
    warnings.push(
      `Zero opens across ${engagement7d.delivered} delivered emails in 7 days. That is almost certainly Resend open tracking being OFF for the sending domain rather than nobody opening. Check open_tracking on the domain in Resend before treating any engagement figure here as real.`,
    );
  }

  const delivered7d = engagement7d.delivered;
  if (delivered7d > 100) {
    // Denominator is ATTEMPTED, not delivered. A bounce is by definition not a
    // delivery, so dividing by `delivered` overstates the rate — it read 6.9% on
    // 2026-09-10 where the true figure was 6.4%. This number gates a behaviour
    // change, so it has to be the one mailbox providers actually compute.
    const attempted7d = engagement7d.delivered + engagement7d.bounced;
    const bounceRate = attempted7d > 0 ? engagement7d.bounced / attempted7d : 0;
    if (bounceRate > 0.03) {
      warnings.push(
        `Bounce rate ${(bounceRate * 100).toFixed(1)}% over 7 days, above the 3% line where mailbox providers start throttling. 3,591 never-mailed contacts entered the pool on 2026-09-09.`,
      );
    }
  }

  return {
    generatedAt: new Date().toISOString(),
    engagementTracking,
    sendsYesterday,
    sends7d: n(s.d7),
    sends30d: n(s.d30),
    journeys,
    enrolledYesterday: rowsOf<Record<string, unknown>>(enrolledRes).map((r) => ({
      journey: String(r.journey),
      n: n(r.n),
    })),
    list: {
      total: n(listRow.total),
      mailable: n(listRow.mailable),
      unsubscribed: n(listRow.unsubscribed),
      unsubbedYesterday: 0,
      newsletterAudience,
    },
    engagement24h,
    engagement7d,
    topLinks7d: rowsOf<Record<string, unknown>>(topLinksRes).map((r) => ({
      url: String(r.url),
      clicks: n(r.clicks),
    })),
    recentHardBounces: rowsOf<Record<string, unknown>>(bouncesRes).map((r) => ({
      recipient: String(r.recipient ?? ""),
      occurredAt: String(r.occurred_at ?? ""),
    })),
    revenue,
    warnings,
  };
}

// ---------------------------------------------------------------------------
// Rendering — one function, used by both the email and the live page, so the
// two cannot drift into disagreeing about the same day.
// ---------------------------------------------------------------------------

const esc = (s: string) =>
  s.replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c] as string);
const money = (v: number) => `$${v.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
const pct = (num: number, den: number) => (den > 0 ? `${((num / den) * 100).toFixed(1)}%` : "—");

function engagementTable(label: string, e: EngagementRow, tracking: boolean): string {
  if (!tracking) {
    return `<p style="margin:6px 0 14px;color:#92400e;background:#fffbeb;border:1px solid #fde68a;padding:10px;border-radius:6px;">
      <b>${esc(label)}: not measured yet.</b> Resend's API exposes no open, click or bounce data, so these come from our own webhook. Register it and figures appear from that day forward.</p>`;
  }
  return `<table style="border-collapse:collapse;margin:6px 0 16px;font-size:14px;">
    <tr><td style="padding:3px 14px 3px 0;color:#6b7280;">Delivered</td><td style="padding:3px 0;font-weight:600;">${e.delivered}</td></tr>
    <tr><td style="padding:3px 14px 3px 0;color:#6b7280;">Opened</td><td style="padding:3px 0;font-weight:600;">${e.opened} <span style="color:#6b7280;font-weight:400;">(${pct(e.opened, e.delivered)})</span></td></tr>
    <tr><td style="padding:3px 14px 3px 0;color:#6b7280;">Clicked</td><td style="padding:3px 0;font-weight:600;">${e.clicked} <span style="color:#6b7280;font-weight:400;">(${pct(e.clicked, e.delivered)})</span></td></tr>
    <tr><td style="padding:3px 14px 3px 0;color:#6b7280;">Bounced</td><td style="padding:3px 0;font-weight:600;color:${e.bounced > 0 ? "#b45309" : "#111827"};">${e.bounced} <span style="color:#6b7280;font-weight:400;">(${pct(e.bounced, e.delivered + e.bounced)} of attempted, ${e.hardBounced} hard)</span></td></tr>
    <tr><td style="padding:3px 14px 3px 0;color:#6b7280;">Complaints</td><td style="padding:3px 0;font-weight:600;color:${e.complained > 0 ? "#dc2626" : "#111827"};">${e.complained}</td></tr>
  </table>`;
}

export function renderDailyEmailReportHtml(r: DailyEmailReport): string {
  const date = r.generatedAt.slice(0, 10);
  const sentOk = r.sendsYesterday > 0;

  const warnings = r.warnings.length
    ? `<div style="background:#fef2f2;border:1px solid #fecaca;border-radius:8px;padding:14px;margin:0 0 22px;">
        <h3 style="margin:0 0 8px;color:#dc2626;font-size:15px;">Needs attention</h3>
        <ul style="margin:0;padding-left:18px;color:#7f1d1d;font-size:14px;line-height:1.6;">
          ${r.warnings.map((w) => `<li>${esc(w)}</li>`).join("")}
        </ul></div>`
    : "";

  // Retired journeys (`ai-series`, exited 2026-09-04) still have rows in the
  // table and would show as a line of zeros every day. A daily report earns its
  // reading by having no filler in it.
  const journeyRows = r.journeys
    .filter((j) => j.active > 0 || j.sent7d > 0 || j.sentYesterday > 0)
    .map(
      (j) => `<tr>
        <td style="padding:6px 12px 6px 0;font-weight:600;">${esc(j.journey)}</td>
        <td style="padding:6px 12px 6px 0;text-align:right;">${j.sentYesterday}</td>
        <td style="padding:6px 12px 6px 0;text-align:right;">${j.sent7d}</td>
        <td style="padding:6px 12px 6px 0;text-align:right;">${j.active}</td>
        <td style="padding:6px 12px 6px 0;text-align:right;">${j.dueToday}</td>
        <td style="padding:6px 0;text-align:right;">${j.due7d}</td>
      </tr>`,
    )
    .join("");

  const campaignRows = r.revenue.byCampaign.length
    ? r.revenue.byCampaign
        .map(
          (c) => `<tr>
            <td style="padding:5px 12px 5px 0;">${esc(c.key)}</td>
            <td style="padding:5px 12px 5px 0;text-align:right;">${c.sessions}</td>
            <td style="padding:5px 12px 5px 0;text-align:right;">${c.transactions}</td>
            <td style="padding:5px 0;text-align:right;font-weight:600;">${money(c.revenue)}</td>
          </tr>`,
        )
        .join("")
    : `<tr><td colspan="4" style="padding:8px 0;color:#6b7280;">No email-attributed store sessions this month.</td></tr>`;

  const links = r.topLinks7d.length
    ? `<h3 style="font-size:14px;margin:18px 0 6px;">Most-clicked links, 7 days</h3>
       <ol style="margin:0;padding-left:20px;font-size:13px;color:#374151;line-height:1.7;">
         ${r.topLinks7d.map((l) => `<li><span style="color:#6b7280;">${l.clicks}&times;</span> ${esc(l.url.slice(0, 110))}</li>`).join("")}
       </ol>`
    : "";

  const bounces = r.recentHardBounces.length
    ? `<h3 style="font-size:14px;margin:18px 0 6px;color:#b45309;">Hard bounces, suppressed automatically</h3>
       <p style="font-size:13px;color:#374151;margin:0 0 6px;">${r.recentHardBounces
         .map((b) => esc(b.recipient))
         .join(", ")}</p>`
    : "";

  // The charset declaration is not optional. Without it the em-dashes and
  // middots in this template render as mojibake ("â€"") in both the browser and
  // most mail clients — caught on the first preview, 2026-09-09.
  return `<!doctype html><html><head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>Email program — ${date}</title>
</head><body style="margin:0;padding:0;background:#f3f4f6;">
<div style="max-width:680px;margin:0 auto;padding:24px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;color:#111827;">
  <div style="background:#fff;border-radius:10px;padding:26px;">
    <p style="margin:0 0 4px;font-size:12px;letter-spacing:.08em;text-transform:uppercase;color:#6b7280;">Work Aged Leads</p>
    <h1 style="margin:0 0 4px;font-size:22px;">Email program — ${date}</h1>
    <p style="margin:0 0 20px;color:#6b7280;font-size:14px;">Lifecycle and newsletter, sends through revenue.</p>

    ${warnings}

    <div style="background:${sentOk ? "#f0fdf4" : "#fef2f2"};border:1px solid ${sentOk ? "#bbf7d0" : "#fecaca"};border-radius:8px;padding:16px;margin:0 0 22px;">
      <div style="font-size:30px;font-weight:700;color:${sentOk ? "#166534" : "#dc2626"};">${r.sendsYesterday}</div>
      <div style="color:#374151;font-size:14px;">lifecycle emails sent yesterday &middot; ${r.sends7d} in 7 days &middot; ${r.sends30d} in 30</div>
    </div>

    <h2 style="font-size:17px;border-bottom:2px solid #e5e7eb;padding-bottom:7px;">By journey</h2>
    <table style="border-collapse:collapse;width:100%;font-size:14px;margin:8px 0 20px;">
      <tr style="color:#6b7280;font-size:12px;text-transform:uppercase;letter-spacing:.04em;">
        <td style="padding:0 12px 6px 0;">Journey</td>
        <td style="padding:0 12px 6px 0;text-align:right;">Sent y'day</td>
        <td style="padding:0 12px 6px 0;text-align:right;">7d</td>
        <td style="padding:0 12px 6px 0;text-align:right;">Active</td>
        <td style="padding:0 12px 6px 0;text-align:right;">Due today</td>
        <td style="padding:0 0 6px;text-align:right;">Due 7d</td>
      </tr>
      ${journeyRows || `<tr><td colspan="6" style="padding:8px 0;color:#6b7280;">No journeys.</td></tr>`}
    </table>
    ${
      r.enrolledYesterday.length
        ? `<p style="font-size:13px;color:#374151;margin:-10px 0 20px;">Enrolled yesterday: ${r.enrolledYesterday
            .map((e) => `${e.n} ${esc(e.journey)}`)
            .join(", ")}</p>`
        : ""
    }

    <h2 style="font-size:17px;border-bottom:2px solid #e5e7eb;padding-bottom:7px;">Delivery and engagement</h2>
    <h3 style="font-size:14px;margin:14px 0 2px;">Last 24 hours</h3>
    ${engagementTable("Last 24 hours", r.engagement24h, r.engagementTracking)}
    <h3 style="font-size:14px;margin:14px 0 2px;">Last 7 days</h3>
    ${engagementTable("Last 7 days", r.engagement7d, r.engagementTracking)}
    ${links}
    ${bounces}

    <h2 style="font-size:17px;border-bottom:2px solid #e5e7eb;padding-bottom:7px;">List</h2>
    <table style="border-collapse:collapse;font-size:14px;margin:8px 0 20px;">
      <tr><td style="padding:3px 14px 3px 0;color:#6b7280;">Mailable buyers</td><td style="padding:3px 0;font-weight:600;">${r.list.mailable.toLocaleString()}</td></tr>
      <tr><td style="padding:3px 14px 3px 0;color:#6b7280;">Total contacts</td><td style="padding:3px 0;">${r.list.total.toLocaleString()}</td></tr>
      <tr><td style="padding:3px 14px 3px 0;color:#6b7280;">Unsubscribed</td><td style="padding:3px 0;">${r.list.unsubscribed.toLocaleString()} <span style="color:#6b7280;">(${pct(r.list.unsubscribed, r.list.total)})</span></td></tr>
      <tr><td style="padding:3px 14px 3px 0;color:#6b7280;">Newsletter audience</td><td style="padding:3px 0;">${r.list.newsletterAudience === null ? "unavailable" : r.list.newsletterAudience.toLocaleString()}</td></tr>
    </table>

    <h2 style="font-size:17px;border-bottom:2px solid #e5e7eb;padding-bottom:7px;">What email earned, month to date</h2>
    ${
      r.revenue.available
        ? `<p style="font-size:14px;color:#374151;margin:10px 0 4px;">
             Email drove <b>${r.revenue.mtdEmailSessions}</b> of ${r.revenue.mtdAllSessions} store sessions and
             <b>${money(r.revenue.mtdEmailRevenue)}</b> of ${money(r.revenue.mtdAllRevenue)} attributed revenue.
             Likely commission across all sources ${money(r.revenue.commissionLikely)} against a ${money(r.revenue.goalTarget)} goal.</p>
           <table style="border-collapse:collapse;width:100%;font-size:14px;margin:8px 0 6px;">
             <tr style="color:#6b7280;font-size:12px;text-transform:uppercase;letter-spacing:.04em;">
               <td style="padding:0 12px 6px 0;">Campaign</td>
               <td style="padding:0 12px 6px 0;text-align:right;">Sessions</td>
               <td style="padding:0 12px 6px 0;text-align:right;">Txns</td>
               <td style="padding:0 0 6px;text-align:right;">Revenue</td>
             </tr>
             ${campaignRows}
           </table>`
        : `<p style="font-size:14px;color:#92400e;background:#fffbeb;border:1px solid #fde68a;padding:10px;border-radius:6px;">Store revenue unavailable this run. Local runs cannot read GA4; production reads it through Workload Identity Federation.</p>`
    }

    <p style="margin:22px 0 0;font-size:12px;color:#9ca3af;border-top:1px solid #e5e7eb;padding-top:12px;">
      Generated ${esc(r.generatedAt)}. Engagement figures come from our own Resend webhook and begin the day it was registered; Resend's API provides none.
    </p>
  </div>
</div></body></html>`;
}
