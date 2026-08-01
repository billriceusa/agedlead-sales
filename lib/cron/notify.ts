import { Resend } from "resend";
import type { WeeklyReport } from "./types";

export async function sendWeeklyReport(
  report: WeeklyReport,
  recipientEmail: string
): Promise<boolean> {
  const apiKey = process.env.RESEND_API_KEY;
  const fromEmail =
    process.env.RESEND_FROM_EMAIL || "noreply@agedleadsales.com";

  if (!apiKey) {
    console.warn("RESEND_API_KEY not set — skipping email notification");
    console.log("Weekly Report:", JSON.stringify(report, null, 2));
    return false;
  }

  const resend = new Resend(apiKey);
  const html = buildReportEmail(report);
  const status = statusLabel(report);
  const subject = `[${status}] Work Aged Leads Weekly Content — ${report.weekStartDate}`;

  const { error } = await resend.emails.send({
    from: fromEmail,
    to: recipientEmail,
    subject,
    html,
  });

  if (error) {
    console.error("Failed to send email:", error);
    return false;
  }

  console.log(`Report email sent to ${recipientEmail}`);
  return true;
}

function statusLabel(report: WeeklyReport): string {
  if (report.fatalError) return "FATAL";
  if (report.articlesFailed.length > 0) return "PARTIAL";
  if (report.articlesCreated.length === 0) return "NO NEW CONTENT";
  if (report.errors.length > 0) return "WITH WARNINGS";
  return "OK";
}

function statusColor(report: WeeklyReport): string {
  if (report.fatalError || report.articlesFailed.length > 0) return "#dc2626";
  if (report.articlesCreated.length === 0) return "#d97706";
  if (report.errors.length > 0) return "#d97706";
  return "#166534";
}

function escape(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function buildReportEmail(report: WeeklyReport): string {
  const status = statusLabel(report);
  const color = statusColor(report);

  const createdHtml = report.articlesCreated.length
    ? report.articlesCreated
        .map(
          (a) => `
      <tr>
        <td style="padding: 8px 12px; border-bottom: 1px solid #e5e7eb;">${escape(a.title)}</td>
        <td style="padding: 8px 12px; border-bottom: 1px solid #e5e7eb;">${a.publishDate}</td>
        <td style="padding: 8px 12px; border-bottom: 1px solid #e5e7eb;">${escape(a.pillar)}</td>
        <td style="padding: 8px 12px; border-bottom: 1px solid #e5e7eb;"><code>${escape(a.primaryKeyword)}</code></td>
      </tr>`
        )
        .join("")
    : `<tr><td colspan="4" style="padding: 12px; color: #6b7280;">No articles created this run.</td></tr>`;

  const skippedHtml =
    report.articlesSkipped.length > 0
      ? `
    <h2 style="font-size: 16px; color: #b45309; border-bottom: 2px solid #fde68a; padding-bottom: 6px; margin-top: 24px;">Skipped (${report.articlesSkipped.length})</h2>
    <ul style="line-height: 1.5;">
      ${report.articlesSkipped.map((s) => `<li><strong>${escape(s.title)}</strong><br><span style="color: #6b7280; font-size: 13px;">${escape(s.reason)}</span></li>`).join("")}
    </ul>`
      : "";

  const failedHtml =
    report.articlesFailed.length > 0
      ? `
    <div style="background: #fef2f2; border: 1px solid #fecaca; border-radius: 8px; padding: 16px; margin-top: 24px;">
      <h2 style="color: #dc2626; margin-top: 0; font-size: 16px;">Failed (${report.articlesFailed.length})</h2>
      <ul>${report.articlesFailed.map((f) => `<li><strong>${escape(f.title)}</strong> — ${escape(f.reason)}</li>`).join("")}</ul>
    </div>`
      : "";

  const imageHtml =
    report.imageOutcomes && report.imageOutcomes.length > 0
      ? (() => {
          const created = report.imageOutcomes!.filter((o) => o.status === "created");
          const issues = report.imageOutcomes!.filter((o) => o.status !== "created");
          const issueColor =
            issues.some((o) => o.status === "rate-limited") ? "#b45309" :
            issues.some((o) => o.status === "upload-failed") ? "#dc2626" :
            "#6b7280";
          return `
    <h2 style="font-size: 16px; color: #166534; border-bottom: 2px solid #bbf7d0; padding-bottom: 6px; margin-top: 24px;">Featured images (${created.length}/${report.imageOutcomes!.length})</h2>
    <ul style="line-height: 1.5; padding-left: 20px;">
      ${created
        .map(
          (o) =>
            `<li>${escape(o.title)} <span style="color: #6b7280; font-size: 13px;">— photo by ${escape(o.photographer || "Unsplash")}</span></li>`
        )
        .join("")}
      ${issues
        .map(
          (o) =>
            `<li style="color: ${issueColor};">${escape(o.title)} <span style="font-size: 13px;">— ${escape(o.status)}${o.detail ? `: ${escape(o.detail)}` : ""}</span></li>`
        )
        .join("")}
    </ul>`;
        })()
      : "";

  const fatalHtml = report.fatalError
    ? `
    <div style="background: #fef2f2; border: 2px solid #dc2626; border-radius: 8px; padding: 16px; margin: 20px 0;">
      <h2 style="color: #dc2626; margin-top: 0; font-size: 18px;">Fatal Error — run aborted</h2>
      <pre style="white-space: pre-wrap; font-size: 13px; color: #7f1d1d;">${escape(report.fatalError)}</pre>
    </div>`
    : "";

  const errorsHtml =
    report.errors.length > 0
      ? `
    <div style="background: #fffbeb; border: 1px solid #fde68a; border-radius: 8px; padding: 16px; margin-top: 24px;">
      <h3 style="color: #b45309; margin-top: 0;">Warnings</h3>
      <ul>${report.errors.map((e) => `<li>${escape(e)}</li>`).join("")}</ul>
    </div>`
      : "";

  const analysisHtml = report.analysis
    ? `
    <div style="background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 8px; padding: 16px; margin-bottom: 24px;">
      <h2 style="color: #166534; margin-top: 0; font-size: 18px;">SEO Strategy Review</h2>
      <p style="white-space: pre-line;">${escape(report.analysis.strategyReview)}</p>
    </div>
    <div style="background: #f0faf5; border: 1px solid #b8e0cf; border-radius: 8px; padding: 16px; margin-bottom: 24px;">
      <h2 style="color: #1B4D3E; margin-top: 0; font-size: 18px;">Competitive Insights</h2>
      <p style="white-space: pre-line;">${escape(report.analysis.competitiveInsights)}</p>
    </div>
    <h2 style="font-size: 18px; border-bottom: 2px solid #e5e7eb; padding-bottom: 8px;">Opportunities</h2>
    <ul style="line-height: 1.6;">${report.analysis.newOpportunities.map((o) => `<li>${escape(o)}</li>`).join("")}</ul>
    <h2 style="font-size: 18px; border-bottom: 2px solid #e5e7eb; padding-bottom: 8px;">Trending Topics</h2>
    <ul style="line-height: 1.6;">${report.analysis.trendingTopics.map((t) => `<li>${escape(t)}</li>`).join("")}</ul>
    <h2 style="font-size: 18px; border-bottom: 2px solid #e5e7eb; padding-bottom: 8px;">Recommended Updates</h2>
    <ul style="line-height: 1.6;">${report.analysis.recommendedUpdates.map((u) => `<li>${escape(u)}</li>`).join("")}</ul>`
    : "";

  const planHtml = report.nextWeekPlan
    ? `
    <div style="background: #fdf8ed; border: 1px solid #fde68a; border-radius: 8px; padding: 16px; margin-top: 24px;">
      <h2 style="color: #92400e; margin-top: 0; font-size: 18px;">Next Week Plan</h2>
      <p style="white-space: pre-line;">${escape(report.nextWeekPlan)}</p>
    </div>`
    : "";

  return `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; color: #1f2937; max-width: 800px; margin: 0 auto; padding: 20px;">

  <div style="background: linear-gradient(135deg, ${color}, #1B4D3E); color: white; padding: 24px 32px; border-radius: 12px; margin-bottom: 24px;">
    <div style="display: inline-block; background: rgba(255,255,255,0.2); padding: 2px 10px; border-radius: 999px; font-size: 12px; font-weight: 700; letter-spacing: 0.5px;">${status}</div>
    <h1 style="margin: 8px 0 4px 0; font-size: 24px;">Weekly Content Report</h1>
    <p style="margin: 0; opacity: 0.9;">Work Aged Leads — Week of ${report.weekStartDate}</p>
    <p style="margin: 8px 0 0 0; opacity: 0.7; font-size: 14px;">Automated run: ${report.runDate}</p>
    <p style="margin: 8px 0 0 0; font-size: 14px;">
      Created: <strong>${report.articlesCreated.length}</strong> &nbsp;·&nbsp;
      Skipped: <strong>${report.articlesSkipped.length}</strong> &nbsp;·&nbsp;
      Failed: <strong>${report.articlesFailed.length}</strong>
    </p>
  </div>

  ${fatalHtml}

  <h2 style="font-size: 18px; border-bottom: 2px solid #e5e7eb; padding-bottom: 8px;">Articles Created</h2>
  <table style="width: 100%; border-collapse: collapse; margin-bottom: 24px;">
    <thead>
      <tr style="background: #f9fafb;">
        <th style="padding: 8px 12px; text-align: left; border-bottom: 2px solid #e5e7eb;">Title</th>
        <th style="padding: 8px 12px; text-align: left; border-bottom: 2px solid #e5e7eb;">Date</th>
        <th style="padding: 8px 12px; text-align: left; border-bottom: 2px solid #e5e7eb;">Pillar</th>
        <th style="padding: 8px 12px; text-align: left; border-bottom: 2px solid #e5e7eb;">Keyword</th>
      </tr>
    </thead>
    <tbody>${createdHtml}</tbody>
  </table>

  ${imageHtml}
  ${skippedHtml}
  ${failedHtml}
  ${analysisHtml}
  ${planHtml}
  ${errorsHtml}

  <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 32px 0 16px;">
  <p style="color: #9ca3af; font-size: 12px;">Generated by AgedLeadSales.com weekly content cron.</p>
</body>
</html>`;
}
