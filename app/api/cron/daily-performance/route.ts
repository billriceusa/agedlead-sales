import { NextResponse } from "next/server";
import { Resend } from "resend";
import { fetchGA4Report, type GA4Report } from "@/lib/cron/ga4-data";
import { fetchGSCReport, type GSCReport } from "@/lib/cron/gsc-data";
import {
  analyzePerformance,
  type PerformanceAnalysis,
} from "@/lib/cron/performance-ai";
import {
  fetchPerformanceBacklog,
  mergeRecommendations,
  serializeBacklog,
} from "@/lib/cron/performance-backlog";
import { commitFilesToGitHub } from "@/lib/cron/git-commit";

export const maxDuration = 300;
export const dynamic = "force-dynamic";

const REPORT_EMAIL = "bill@billricestrategy.com";

export async function GET(request: Request) {
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const startTime = Date.now();
  const errors: string[] = [];
  const reportDate = new Date().toISOString().split("T")[0];

  console.log(`[Performance] Starting daily report: ${reportDate}`);

  // ── Step 1: Fetch GA4 and GSC data in parallel ──────────────
  let ga4: GA4Report;
  let gsc: GSCReport;

  try {
    [ga4, gsc] = await Promise.all([fetchGA4Report(), fetchGSCReport()]);

    if (ga4.available) {
      console.log(
        `[Performance] GA4: ${ga4.sevenDay.metrics.sessions} sessions (7d), ${ga4.ninetyDay.metrics.sessions} sessions (90d)`
      );
    } else {
      console.warn(`[Performance] GA4 not available: ${ga4.error}`);
      errors.push(`GA4: ${ga4.error}`);
    }

    if (gsc.available) {
      console.log(
        `[Performance] GSC: ${gsc.sevenDay.metrics.clicks} clicks (7d), ${gsc.ninetyDay.metrics.clicks} clicks (90d)`
      );
    } else {
      console.warn(`[Performance] GSC not available: ${gsc.error}`);
      errors.push(`GSC: ${gsc.error}`);
    }
  } catch (err) {
    const msg = `Data fetch failed: ${err instanceof Error ? err.message : err}`;
    console.error(msg);
    return NextResponse.json(
      { success: false, error: msg, duration: Date.now() - startTime },
      { status: 500 }
    );
  }

  if (!ga4.available && !gsc.available) {
    const msg =
      "Neither GA4 nor GSC data available. Configure GOOGLE_CLIENT_EMAIL, GOOGLE_PRIVATE_KEY, GA4_PROPERTY_ID, and/or GSC_SITE_URL.";
    console.error(msg);
    return NextResponse.json(
      { success: false, error: msg, errors, duration: Date.now() - startTime },
      { status: 500 }
    );
  }

  // ── Step 2: AI Analysis ──────────────────────────────────────
  let analysis: PerformanceAnalysis;
  try {
    console.log("[Performance] Running AI analysis...");
    analysis = await analyzePerformance(ga4, gsc);
    console.log(
      `[Performance] Analysis complete: ${analysis.insights.length} insights, ${analysis.recommendations.length} recommendations`
    );
  } catch (err) {
    const msg = `AI analysis failed: ${err instanceof Error ? err.message : err}`;
    console.error(msg);
    errors.push(msg);

    analysis = {
      overallAssessment: "AI analysis unavailable for this report.",
      insights: [],
      recommendations: [],
      contentPerformance: "Analysis unavailable.",
      seoPerformance: "Analysis unavailable.",
      trafficAnalysis: "Analysis unavailable.",
      nextSteps: [],
    };
  }

  let backlogChanged = false;
  let backlogItemCount = 0;
  if (analysis.recommendations.length > 0) {
    try {
      const existingBacklog = await fetchPerformanceBacklog();
      const { backlog, changed } = mergeRecommendations(
        existingBacklog,
        analysis.recommendations,
        reportDate
      );
      backlogChanged = changed;
      backlogItemCount = backlog.items.filter((i) => i.status === "open").length;

      if (changed) {
        await commitFilesToGitHub(
          [
            {
              path: "data/performance-backlog.json",
              content: serializeBacklog(backlog),
            },
          ],
          `chore(perf): update performance backlog — ${reportDate}\n\n${
            backlog.items.filter((i) => i.lastSeen === reportDate).length
          } items touched today, ${backlogItemCount} open total.`
        );
        console.log(
          `[Performance] Backlog updated and committed (${backlogItemCount} open items)`
        );
      } else {
        console.log("[Performance] Backlog unchanged — skipping commit");
      }
    } catch (err) {
      const msg = `Backlog update failed: ${err instanceof Error ? err.message : err}`;
      console.error(msg);
      errors.push(msg);
    }
  }

  // ── Step 3: Send email report ────────────────────────────────
  const resendApiKey = process.env.RESEND_API_KEY;
  if (resendApiKey) {
    try {
      const resend = new Resend(resendApiKey);
      const fromEmail =
        process.env.RESEND_FROM_EMAIL ||
        "Aged Lead Sales <noreply@agedleadsales.com>";

      await resend.emails.send({
        from: fromEmail,
        to: REPORT_EMAIL,
        subject: `Daily Performance — ${reportDate}${ga4.available ? ` — ${Math.round(ga4.sevenDay.dailyAverage.sessions)} sessions/day` : ""}`,
        html: buildPerformanceEmail(ga4, gsc, analysis, reportDate, errors),
      });
      console.log(`[Performance] Report sent to ${REPORT_EMAIL}`);
    } catch (err) {
      const msg = `Email send failed: ${err instanceof Error ? err.message : err}`;
      console.error(msg);
      errors.push(msg);
    }
  } else {
    errors.push("RESEND_API_KEY not set — email not sent");
  }

  const duration = Date.now() - startTime;
  console.log(
    `[Performance] Completed in ${(duration / 1000).toFixed(1)}s — ${errors.length} errors`
  );

  return NextResponse.json({
    success: errors.length === 0,
    duration,
    reportDate,
    ga4Available: ga4.available,
    gscAvailable: gsc.available,
    insightsCount: analysis.insights.length,
    recommendationsCount: analysis.recommendations.length,
    backlogChanged,
    backlogOpenCount: backlogItemCount,
    errors,
  });
}

// ── Email Builder ──────────────────────────────────────────────

function num(n: number): string {
  return n.toLocaleString("en-US", { maximumFractionDigits: 1 });
}

function pct(n: number): string {
  return (n * 100).toFixed(2) + "%";
}

function changeBadge(sevenDay: number, ninetyDay: number, inverse = false): string {
  if (ninetyDay === 0) return '<span style="color:#6b7280;">N/A</span>';
  const change = ((sevenDay - ninetyDay) / ninetyDay) * 100;
  const isGood = inverse ? change < 0 : change > 0;
  const color = isGood ? "#059669" : change === 0 ? "#6b7280" : "#dc2626";
  const arrow = change > 0 ? "▲" : change < 0 ? "▼" : "–";
  return `<span style="color:${color};font-weight:600;">${arrow} ${Math.abs(change).toFixed(1)}%</span>`;
}

function metricRow(
  label: string,
  sevenDay: number,
  ninetyDay: number,
  formatter: (n: number) => string = num,
  inverse = false
): string {
  return `<tr>
    <td style="padding:8px 12px;border-bottom:1px solid #e5e7eb;font-weight:500;">${label}</td>
    <td style="padding:8px 12px;border-bottom:1px solid #e5e7eb;text-align:right;font-variant-numeric:tabular-nums;">${formatter(sevenDay)}</td>
    <td style="padding:8px 12px;border-bottom:1px solid #e5e7eb;text-align:right;font-variant-numeric:tabular-nums;">${formatter(ninetyDay)}</td>
    <td style="padding:8px 12px;border-bottom:1px solid #e5e7eb;text-align:center;">${changeBadge(sevenDay, ninetyDay, inverse)}</td>
  </tr>`;
}

function buildPerformanceEmail(
  ga4: GA4Report,
  gsc: GSCReport,
  analysis: PerformanceAnalysis,
  reportDate: string,
  errors: string[]
): string {
  const s7 = ga4.sevenDay.dailyAverage;
  const s90 = ga4.ninetyDay.dailyAverage;
  const g7 = gsc.sevenDay.dailyAverage;
  const g90 = gsc.ninetyDay.dailyAverage;

  const ga4Section = ga4.available
    ? `
    <h2 style="font-size:18px;margin:24px 0 12px;border-bottom:2px solid #e5e7eb;padding-bottom:8px;">Google Analytics — Daily Averages</h2>
    <table style="width:100%;border-collapse:collapse;margin-bottom:16px;font-size:14px;">
      <thead><tr style="background:#f9fafb;">
        <th style="padding:8px 12px;text-align:left;border-bottom:2px solid #e5e7eb;">Metric</th>
        <th style="padding:8px 12px;text-align:right;border-bottom:2px solid #e5e7eb;">7-Day Avg</th>
        <th style="padding:8px 12px;text-align:right;border-bottom:2px solid #e5e7eb;">90-Day Avg</th>
        <th style="padding:8px 12px;text-align:center;border-bottom:2px solid #e5e7eb;">Trend</th>
      </tr></thead>
      <tbody>
        ${metricRow("Sessions", s7.sessions, s90.sessions)}
        ${metricRow("Active Users", s7.activeUsers, s90.activeUsers)}
        ${metricRow("New Users", s7.newUsers, s90.newUsers)}
        ${metricRow("Page Views", s7.screenPageViews, s90.screenPageViews)}
        ${metricRow("Avg Duration", s7.averageSessionDuration, s90.averageSessionDuration, (n) => num(n) + "s")}
        ${metricRow("Bounce Rate", s7.bounceRate, s90.bounceRate, pct, true)}
        ${metricRow("Engagement Rate", s7.engagementRate, s90.engagementRate, pct)}
      </tbody>
    </table>

    <h3 style="font-size:15px;margin:16px 0 8px;">Top Pages (Last 7 Days)</h3>
    <table style="width:100%;border-collapse:collapse;margin-bottom:16px;font-size:13px;">
      <thead><tr style="background:#f9fafb;">
        <th style="padding:6px 10px;text-align:left;border-bottom:1px solid #e5e7eb;">Page</th>
        <th style="padding:6px 10px;text-align:right;border-bottom:1px solid #e5e7eb;">Views</th>
        <th style="padding:6px 10px;text-align:right;border-bottom:1px solid #e5e7eb;">Users</th>
      </tr></thead>
      <tbody>${ga4.sevenDay.topPages
        .slice(0, 10)
        .map(
          (p) =>
            `<tr><td style="padding:6px 10px;border-bottom:1px solid #f3f4f6;"><code style="font-size:12px;">${p.path}</code></td><td style="padding:6px 10px;border-bottom:1px solid #f3f4f6;text-align:right;">${num(p.views)}</td><td style="padding:6px 10px;border-bottom:1px solid #f3f4f6;text-align:right;">${num(p.users)}</td></tr>`
        )
        .join("")}
      </tbody>
    </table>

    <h3 style="font-size:15px;margin:16px 0 8px;">Top Sources (Last 7 Days)</h3>
    <table style="width:100%;border-collapse:collapse;margin-bottom:24px;font-size:13px;">
      <thead><tr style="background:#f9fafb;">
        <th style="padding:6px 10px;text-align:left;border-bottom:1px solid #e5e7eb;">Source / Medium</th>
        <th style="padding:6px 10px;text-align:right;border-bottom:1px solid #e5e7eb;">Sessions</th>
        <th style="padding:6px 10px;text-align:right;border-bottom:1px solid #e5e7eb;">Users</th>
      </tr></thead>
      <tbody>${ga4.sevenDay.topSources
        .slice(0, 8)
        .map(
          (s) =>
            `<tr><td style="padding:6px 10px;border-bottom:1px solid #f3f4f6;">${s.source} / ${s.medium}</td><td style="padding:6px 10px;border-bottom:1px solid #f3f4f6;text-align:right;">${num(s.sessions)}</td><td style="padding:6px 10px;border-bottom:1px solid #f3f4f6;text-align:right;">${num(s.users)}</td></tr>`
        )
        .join("")}
      </tbody>
    </table>`
    : `<div style="background:#fefce8;border:1px solid #fde68a;border-radius:8px;padding:16px;margin:24px 0;"><p style="margin:0;color:#92400e;">GA4 data not available: ${ga4.error}</p></div>`;

  const gscSection = gsc.available
    ? `
    <h2 style="font-size:18px;margin:24px 0 12px;border-bottom:2px solid #e5e7eb;padding-bottom:8px;">Search Console — Daily Averages</h2>
    <table style="width:100%;border-collapse:collapse;margin-bottom:16px;font-size:14px;">
      <thead><tr style="background:#f9fafb;">
        <th style="padding:8px 12px;text-align:left;border-bottom:2px solid #e5e7eb;">Metric</th>
        <th style="padding:8px 12px;text-align:right;border-bottom:2px solid #e5e7eb;">7-Day Avg</th>
        <th style="padding:8px 12px;text-align:right;border-bottom:2px solid #e5e7eb;">90-Day Avg</th>
        <th style="padding:8px 12px;text-align:center;border-bottom:2px solid #e5e7eb;">Trend</th>
      </tr></thead>
      <tbody>
        ${metricRow("Clicks", g7.clicks, g90.clicks)}
        ${metricRow("Impressions", g7.impressions, g90.impressions)}
        ${metricRow("CTR", g7.ctr, g90.ctr, pct)}
        ${metricRow("Avg Position", g7.position, g90.position, num, true)}
      </tbody>
    </table>

    <h3 style="font-size:15px;margin:16px 0 8px;">Top Search Queries (Last 7 Days)</h3>
    <table style="width:100%;border-collapse:collapse;margin-bottom:16px;font-size:13px;">
      <thead><tr style="background:#f9fafb;">
        <th style="padding:6px 10px;text-align:left;border-bottom:1px solid #e5e7eb;">Query</th>
        <th style="padding:6px 10px;text-align:right;border-bottom:1px solid #e5e7eb;">Clicks</th>
        <th style="padding:6px 10px;text-align:right;border-bottom:1px solid #e5e7eb;">Impressions</th>
        <th style="padding:6px 10px;text-align:right;border-bottom:1px solid #e5e7eb;">CTR</th>
        <th style="padding:6px 10px;text-align:right;border-bottom:1px solid #e5e7eb;">Position</th>
      </tr></thead>
      <tbody>${gsc.sevenDay.topQueries
        .slice(0, 15)
        .map(
          (q) =>
            `<tr><td style="padding:6px 10px;border-bottom:1px solid #f3f4f6;">${q.query}</td><td style="padding:6px 10px;border-bottom:1px solid #f3f4f6;text-align:right;">${q.clicks}</td><td style="padding:6px 10px;border-bottom:1px solid #f3f4f6;text-align:right;">${num(q.impressions)}</td><td style="padding:6px 10px;border-bottom:1px solid #f3f4f6;text-align:right;">${pct(q.ctr)}</td><td style="padding:6px 10px;border-bottom:1px solid #f3f4f6;text-align:right;">${q.position.toFixed(1)}</td></tr>`
        )
        .join("")}
      </tbody>
    </table>

    <h3 style="font-size:15px;margin:16px 0 8px;">Device Breakdown (Last 7 Days)</h3>
    <table style="width:100%;border-collapse:collapse;margin-bottom:24px;font-size:13px;">
      <thead><tr style="background:#f9fafb;">
        <th style="padding:6px 10px;text-align:left;border-bottom:1px solid #e5e7eb;">Device</th>
        <th style="padding:6px 10px;text-align:right;border-bottom:1px solid #e5e7eb;">Clicks</th>
        <th style="padding:6px 10px;text-align:right;border-bottom:1px solid #e5e7eb;">Impressions</th>
        <th style="padding:6px 10px;text-align:right;border-bottom:1px solid #e5e7eb;">CTR</th>
      </tr></thead>
      <tbody>${gsc.sevenDay.devices
        .map(
          (d) =>
            `<tr><td style="padding:6px 10px;border-bottom:1px solid #f3f4f6;">${d.device}</td><td style="padding:6px 10px;border-bottom:1px solid #f3f4f6;text-align:right;">${d.clicks}</td><td style="padding:6px 10px;border-bottom:1px solid #f3f4f6;text-align:right;">${num(d.impressions)}</td><td style="padding:6px 10px;border-bottom:1px solid #f3f4f6;text-align:right;">${pct(d.ctr)}</td></tr>`
        )
        .join("")}
      </tbody>
    </table>`
    : `<div style="background:#fefce8;border:1px solid #fde68a;border-radius:8px;padding:16px;margin:24px 0;"><p style="margin:0;color:#92400e;">GSC data not available: ${gsc.error}</p></div>`;

  const trendIcon = (trend: string) => {
    const icons: Record<string, string> = {
      improving: '<span style="color:#059669;">▲</span>',
      declining: '<span style="color:#dc2626;">▼</span>',
      stable: '<span style="color:#6b7280;">–</span>',
      new: '<span style="color:#2563eb;">★</span>',
    };
    return icons[trend] || icons.stable;
  };

  const insightsHtml = analysis.insights
    .map(
      (i) => `
      <tr>
        <td style="padding:10px 12px;border-bottom:1px solid #e5e7eb;">${trendIcon(i.trend)} ${i.category}</td>
        <td style="padding:10px 12px;border-bottom:1px solid #e5e7eb;"><strong>${i.title}</strong><br><span style="color:#6b7280;font-size:13px;">${i.detail}</span></td>
        <td style="padding:10px 12px;border-bottom:1px solid #e5e7eb;text-align:right;font-size:13px;">${i.metric7d}</td>
        <td style="padding:10px 12px;border-bottom:1px solid #e5e7eb;text-align:right;font-size:13px;">${i.metric90d}</td>
        <td style="padding:10px 12px;border-bottom:1px solid #e5e7eb;text-align:center;font-weight:600;">${i.change}</td>
      </tr>`
    )
    .join("");

  const priorityBadge = (p: string) => {
    const styles: Record<string, string> = {
      high: "background:#fef2f2;color:#dc2626",
      medium: "background:#fefce8;color:#ca8a04",
      low: "background:#f0fdf4;color:#059669",
    };
    return `<span style="${styles[p] || styles.medium};padding:2px 8px;border-radius:4px;font-size:11px;font-weight:600;text-transform:uppercase;">${p}</span>`;
  };

  const recsHtml = analysis.recommendations
    .map(
      (r) => `
      <tr>
        <td style="padding:10px 12px;border-bottom:1px solid #e5e7eb;">${priorityBadge(r.priority)}</td>
        <td style="padding:10px 12px;border-bottom:1px solid #e5e7eb;">
          <strong>${r.title}</strong><br>
          <span style="color:#374151;font-size:13px;">${r.description}</span>
        </td>
        <td style="padding:10px 12px;border-bottom:1px solid #e5e7eb;font-size:13px;color:#059669;">${r.expectedImpact}</td>
      </tr>`
    )
    .join("");

  const nextStepsHtml = analysis.nextSteps
    .map(
      (s, i) =>
        `<tr><td style="padding:6px 12px;border-bottom:1px solid #f3f4f6;width:30px;color:#6b7280;font-weight:600;">${i + 1}.</td><td style="padding:6px 12px;border-bottom:1px solid #f3f4f6;">${s}</td></tr>`
    )
    .join("");

  const errorsHtml =
    errors.length > 0
      ? `<div style="background:#fef2f2;border:1px solid #fecaca;border-radius:8px;padding:16px;margin-top:20px;">
          <h3 style="color:#dc2626;margin:0 0 8px;">Data Collection Issues</h3>
          <ul style="margin:0;padding-left:20px;font-size:13px;">${errors.map((e) => `<li>${e}</li>`).join("")}</ul>
        </div>`
      : "";

  return `<!DOCTYPE html>
<html><head><meta charset="utf-8"></head>
<body style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;color:#1f2937;max-width:900px;margin:0 auto;padding:20px;">

  <div style="background:linear-gradient(135deg,#0c4a6e,#0284c7);color:white;padding:28px 32px;border-radius:12px;margin-bottom:24px;">
    <h1 style="margin:0 0 4px;font-size:24px;">Daily Performance Report</h1>
    <p style="margin:0;opacity:0.85;font-size:14px;">Aged Lead Sales — ${reportDate}</p>
    <p style="margin:8px 0 0;opacity:0.7;font-size:13px;">7-Day Rolling Average vs 90-Day Average</p>
  </div>

  <!-- Overall Assessment -->
  <div style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:8px;padding:20px;margin-bottom:24px;">
    <h2 style="margin:0 0 12px;font-size:18px;">Executive Summary</h2>
    <p style="margin:0;line-height:1.7;white-space:pre-line;">${analysis.overallAssessment}</p>
  </div>

  ${ga4Section}
  ${gscSection}

  <!-- Key Insights -->
  <h2 style="font-size:18px;margin:24px 0 12px;border-bottom:2px solid #e5e7eb;padding-bottom:8px;">Key Insights</h2>
  <table style="width:100%;border-collapse:collapse;margin-bottom:24px;font-size:14px;">
    <thead><tr style="background:#f9fafb;">
      <th style="padding:8px 12px;text-align:left;border-bottom:2px solid #e5e7eb;width:100px;">Category</th>
      <th style="padding:8px 12px;text-align:left;border-bottom:2px solid #e5e7eb;">Insight</th>
      <th style="padding:8px 12px;text-align:right;border-bottom:2px solid #e5e7eb;">7-Day</th>
      <th style="padding:8px 12px;text-align:right;border-bottom:2px solid #e5e7eb;">90-Day</th>
      <th style="padding:8px 12px;text-align:center;border-bottom:2px solid #e5e7eb;">Change</th>
    </tr></thead>
    <tbody>${insightsHtml}</tbody>
  </table>

  <!-- Analysis Sections -->
  <div style="background:#eff6ff;border:1px solid #bfdbfe;border-radius:8px;padding:20px;margin-bottom:16px;">
    <h3 style="margin:0 0 8px;font-size:16px;color:#1e40af;">Content Performance</h3>
    <p style="margin:0;line-height:1.6;white-space:pre-line;font-size:14px;">${analysis.contentPerformance}</p>
  </div>
  <div style="background:#f0fdf4;border:1px solid #bbf7d0;border-radius:8px;padding:20px;margin-bottom:16px;">
    <h3 style="margin:0 0 8px;font-size:16px;color:#166534;">SEO Performance</h3>
    <p style="margin:0;line-height:1.6;white-space:pre-line;font-size:14px;">${analysis.seoPerformance}</p>
  </div>
  <div style="background:#faf5ff;border:1px solid #e9d5ff;border-radius:8px;padding:20px;margin-bottom:24px;">
    <h3 style="margin:0 0 8px;font-size:16px;color:#7c3aed;">Traffic Analysis</h3>
    <p style="margin:0;line-height:1.6;white-space:pre-line;font-size:14px;">${analysis.trafficAnalysis}</p>
  </div>

  <!-- Recommendations -->
  <h2 style="font-size:18px;margin:24px 0 12px;border-bottom:2px solid #e5e7eb;padding-bottom:8px;">Recommendations</h2>
  <table style="width:100%;border-collapse:collapse;margin-bottom:24px;font-size:14px;">
    <thead><tr style="background:#f9fafb;">
      <th style="padding:8px 12px;text-align:left;border-bottom:2px solid #e5e7eb;width:70px;">Priority</th>
      <th style="padding:8px 12px;text-align:left;border-bottom:2px solid #e5e7eb;">Recommendation</th>
      <th style="padding:8px 12px;text-align:left;border-bottom:2px solid #e5e7eb;width:160px;">Expected Impact</th>
    </tr></thead>
    <tbody>${recsHtml}</tbody>
  </table>

  <!-- Next Steps -->
  <div style="background:#fefce8;border:1px solid #fde68a;border-radius:8px;padding:20px;margin-bottom:24px;">
    <h2 style="margin:0 0 12px;font-size:18px;color:#92400e;">Today's Action Items</h2>
    <table style="width:100%;border-collapse:collapse;">${nextStepsHtml}</table>
  </div>

  ${errorsHtml}

  <hr style="border:none;border-top:1px solid #e5e7eb;margin:32px 0 16px;">
  <p style="color:#9ca3af;font-size:12px;">Generated by the Aged Lead Sales daily performance cron job. Data sources: Google Analytics 4${ga4.available ? " (connected)" : ""}, Google Search Console${gsc.available ? " (connected)" : ""}.</p>
</body></html>`;
}
