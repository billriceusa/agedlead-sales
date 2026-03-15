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

  const { error } = await resend.emails.send({
    from: fromEmail,
    to: recipientEmail,
    subject: `Weekly Content Report — ${report.weekStartDate}`,
    html,
  });

  if (error) {
    console.error("Failed to send email:", error);
    return false;
  }

  console.log(`Report email sent to ${recipientEmail}`);
  return true;
}

function buildReportEmail(report: WeeklyReport): string {
  const articlesHtml = report.articlesPublished
    .map(
      (a) => `
      <tr>
        <td style="padding: 8px 12px; border-bottom: 1px solid #e5e7eb;">${a.title}</td>
        <td style="padding: 8px 12px; border-bottom: 1px solid #e5e7eb;">${a.publishDate}</td>
        <td style="padding: 8px 12px; border-bottom: 1px solid #e5e7eb;">${a.pillar}</td>
        <td style="padding: 8px 12px; border-bottom: 1px solid #e5e7eb;"><code>${a.primaryKeyword}</code></td>
      </tr>`
    )
    .join("");

  const opportunitiesHtml = report.analysis.newOpportunities
    .map((o) => `<li style="margin-bottom: 4px;">${o}</li>`)
    .join("");

  const trendingHtml = report.analysis.trendingTopics
    .map((t) => `<li style="margin-bottom: 4px;">${t}</li>`)
    .join("");

  const updatesHtml = report.analysis.recommendedUpdates
    .map((u) => `<li style="margin-bottom: 4px;">${u}</li>`)
    .join("");

  const errorsHtml =
    report.errors.length > 0
      ? `
    <div style="background: #fef2f2; border: 1px solid #fecaca; border-radius: 8px; padding: 16px; margin-top: 24px;">
      <h3 style="color: #dc2626; margin-top: 0;">Errors Encountered</h3>
      <ul>${report.errors.map((e) => `<li>${e}</li>`).join("")}</ul>
    </div>`
      : "";

  return `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; color: #1f2937; max-width: 800px; margin: 0 auto; padding: 20px;">
  
  <div style="background: linear-gradient(135deg, #1e40af, #3b82f6); color: white; padding: 24px 32px; border-radius: 12px; margin-bottom: 24px;">
    <h1 style="margin: 0 0 4px 0; font-size: 24px;">Weekly Content Report</h1>
    <p style="margin: 0; opacity: 0.9;">Aged Lead Sales — Week of ${report.weekStartDate}</p>
    <p style="margin: 8px 0 0 0; opacity: 0.7; font-size: 14px;">Automated run: ${report.runDate}</p>
  </div>

  <div style="background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 8px; padding: 16px; margin-bottom: 24px;">
    <h2 style="color: #166534; margin-top: 0; font-size: 18px;">SEO Strategy Review</h2>
    <p style="white-space: pre-line;">${report.analysis.strategyReview}</p>
  </div>

  <div style="background: #eff6ff; border: 1px solid #bfdbfe; border-radius: 8px; padding: 16px; margin-bottom: 24px;">
    <h2 style="color: #1e40af; margin-top: 0; font-size: 18px;">Competitive Insights</h2>
    <p style="white-space: pre-line;">${report.analysis.competitiveInsights}</p>
  </div>

  <h2 style="font-size: 18px; border-bottom: 2px solid #e5e7eb; padding-bottom: 8px;">Articles Published This Week</h2>
  <table style="width: 100%; border-collapse: collapse; margin-bottom: 24px;">
    <thead>
      <tr style="background: #f9fafb;">
        <th style="padding: 8px 12px; text-align: left; border-bottom: 2px solid #e5e7eb;">Title</th>
        <th style="padding: 8px 12px; text-align: left; border-bottom: 2px solid #e5e7eb;">Date</th>
        <th style="padding: 8px 12px; text-align: left; border-bottom: 2px solid #e5e7eb;">Pillar</th>
        <th style="padding: 8px 12px; text-align: left; border-bottom: 2px solid #e5e7eb;">Keyword</th>
      </tr>
    </thead>
    <tbody>${articlesHtml}</tbody>
  </table>

  <h2 style="font-size: 18px; border-bottom: 2px solid #e5e7eb; padding-bottom: 8px;">New Opportunities Identified</h2>
  <ul style="line-height: 1.6;">${opportunitiesHtml}</ul>

  <h2 style="font-size: 18px; border-bottom: 2px solid #e5e7eb; padding-bottom: 8px;">Trending Topics</h2>
  <ul style="line-height: 1.6;">${trendingHtml}</ul>

  <h2 style="font-size: 18px; border-bottom: 2px solid #e5e7eb; padding-bottom: 8px;">Recommended Strategy Updates</h2>
  <ul style="line-height: 1.6;">${updatesHtml}</ul>

  <div style="background: #fefce8; border: 1px solid #fde68a; border-radius: 8px; padding: 16px; margin-top: 24px;">
    <h2 style="color: #92400e; margin-top: 0; font-size: 18px;">Next Week Plan</h2>
    <p style="white-space: pre-line;">${report.nextWeekPlan}</p>
  </div>

  ${errorsHtml}

  <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 32px 0 16px;">
  <p style="color: #9ca3af; font-size: 12px;">This report was generated automatically by the Aged Lead Sales weekly content cron job.</p>
</body>
</html>`;
}
