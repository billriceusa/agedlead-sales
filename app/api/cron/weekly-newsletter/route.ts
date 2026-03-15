import { NextResponse } from "next/server";
import { createClient } from "next-sanity";
import { Resend } from "resend";
import { NEWSLETTER_CALENDAR } from "@/data/newsletter-calendar";
import {
  generateNewsletterContent,
  type RecentPost,
  type NewsletterContent,
} from "@/lib/cron/newsletter-ai";
import { buildNewsletterHtml } from "@/lib/cron/newsletter-email";
import { commitFilesToGitHub } from "@/lib/cron/git-commit";

export const maxDuration = 300;
export const dynamic = "force-dynamic";

const REVIEW_EMAIL = "bill@billricestrategy.com";

function getSiteUrl(): string {
  return process.env.NEXT_PUBLIC_SITE_URL || "https://agedleadsales.com";
}

function getSanityClient() {
  const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
  const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";
  const token = process.env.SANITY_API_TOKEN;

  if (!projectId || !token) {
    throw new Error(
      "Missing NEXT_PUBLIC_SANITY_PROJECT_ID or SANITY_API_TOKEN"
    );
  }

  return createClient({
    projectId,
    dataset,
    apiVersion: "2026-03-14",
    token,
    useCdn: false,
  });
}

function getWeekDates(): {
  tuesday: string;
  tuesdayISO: string;
  weekLabel: string;
  weekNumber: number;
} {
  const now = new Date();
  const dayOfWeek = now.getDay(); // 0 = Sunday
  const daysUntilTuesday = dayOfWeek <= 2 ? 2 - dayOfWeek : 9 - dayOfWeek;

  const tuesday = new Date(now);
  tuesday.setDate(now.getDate() + daysUntilTuesday);
  tuesday.setHours(9, 0, 0, 0); // 9 AM ET

  const monday = new Date(tuesday);
  monday.setDate(tuesday.getDate() - 1);

  const fmt = (d: Date) => d.toISOString().split("T")[0];

  const startOfYear = new Date(now.getFullYear(), 0, 1);
  const weekNumber = Math.ceil(
    ((now.getTime() - startOfYear.getTime()) / 86400000 + startOfYear.getDay() + 1) / 7
  );

  return {
    tuesday: fmt(tuesday),
    tuesdayISO: tuesday.toISOString(),
    weekLabel: fmt(monday),
    weekNumber,
  };
}

async function fetchRecentPosts(): Promise<RecentPost[]> {
  try {
    const client = getSanityClient();
    const posts = await client.fetch<RecentPost[]>(
      `*[_type == "post"] | order(publishedAt desc)[0...10] {
        title,
        "slug": slug.current,
        excerpt,
        publishedAt,
        "pillar": categories[0]->title
      }`
    );
    return posts;
  } catch (err) {
    console.warn("Failed to fetch posts from Sanity:", err);
    return [];
  }
}

function findCurrentPlan(weekLabel: string) {
  const exactMatch = NEWSLETTER_CALENDAR.find(
    (p) => p.sendDate === weekLabel || p.sendDate === weekLabel
  );
  if (exactMatch) return exactMatch;

  const weekDate = new Date(weekLabel);
  return NEWSLETTER_CALENDAR.find((p) => {
    const planDate = new Date(p.sendDate);
    const diff = Math.abs(weekDate.getTime() - planDate.getTime());
    return diff < 7 * 24 * 60 * 60 * 1000; // within 7 days
  });
}

async function sendPreviewEmail(
  resend: Resend,
  fromEmail: string,
  subject: string,
  html: string
): Promise<{ success: boolean; error?: string }> {
  const previewHtml = `
    <div style="background: #fefce8; border: 2px solid #f59e0b; border-radius: 8px; padding: 16px; margin: 0 auto 24px; max-width: 600px; font-family: -apple-system, sans-serif;">
      <p style="margin: 0 0 4px 0; font-weight: 700; color: #92400e;">Newsletter Preview for Review</p>
      <p style="margin: 0; color: #78350f; font-size: 14px;">This is the newsletter scheduled to send to subscribers on Tuesday. Review and reply with any changes needed.</p>
    </div>
    ${html}`;

  const { error } = await resend.emails.send({
    from: fromEmail,
    to: REVIEW_EMAIL,
    subject: `[PREVIEW] ${subject}`,
    html: previewHtml,
  });

  if (error) {
    return { success: false, error: JSON.stringify(error) };
  }
  return { success: true };
}

async function scheduleBroadcast(
  audienceId: string,
  fromEmail: string,
  subject: string,
  html: string,
  scheduledAt: string
): Promise<{ success: boolean; broadcastId?: string; error?: string }> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    return { success: false, error: "RESEND_API_KEY not set" };
  }

  const res = await fetch("https://api.resend.com/broadcasts", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      audience_id: audienceId,
      from: fromEmail,
      subject,
      html,
      send: true,
      scheduled_at: scheduledAt,
    }),
  });

  if (!res.ok) {
    const body = await res.text();
    return {
      success: false,
      error: `Broadcast API returned ${res.status}: ${body}`,
    };
  }

  const data = (await res.json()) as { id?: string };
  return { success: true, broadcastId: data.id };
}

export async function GET(request: Request) {
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const startTime = Date.now();
  const errors: string[] = [];
  const weekDates = getWeekDates();
  const siteUrl = getSiteUrl();

  console.log(
    `[Newsletter] Starting run for week of ${weekDates.weekLabel}, send date: ${weekDates.tuesday}`
  );

  // ── Step 1: Gather context ───────────────────────────────────
  const recentPosts = await fetchRecentPosts();
  console.log(`[Newsletter] Found ${recentPosts.length} recent posts`);

  const plan = findCurrentPlan(weekDates.tuesday);
  if (plan) {
    console.log(
      `[Newsletter] Found calendar plan: "${plan.theme}" (${plan.focusVertical})`
    );
  } else {
    console.log(
      "[Newsletter] No calendar plan found — AI will research and create theme"
    );
  }

  // ── Step 2: Generate newsletter content ──────────────────────
  let content: NewsletterContent;
  try {
    console.log("[Newsletter] Generating newsletter content with AI...");
    content = await generateNewsletterContent(
      plan ?? null,
      recentPosts,
      siteUrl,
      weekDates.weekLabel
    );
    console.log(`[Newsletter] Generated: "${content.subject}"`);
  } catch (err) {
    const msg = `Newsletter content generation failed: ${err instanceof Error ? err.message : err}`;
    console.error(msg);
    return NextResponse.json(
      { success: false, error: msg, duration: Date.now() - startTime },
      { status: 500 }
    );
  }

  // ── Step 3: Build HTML email ─────────────────────────────────
  const newsletterHtml = buildNewsletterHtml(
    content,
    siteUrl,
    weekDates.weekLabel
  );
  console.log(
    `[Newsletter] Built HTML email (${(newsletterHtml.length / 1024).toFixed(1)} KB)`
  );

  // ── Step 4: Send preview to Bill ─────────────────────────────
  const resendApiKey = process.env.RESEND_API_KEY;
  const fromEmail =
    process.env.RESEND_FROM_EMAIL || "Aged Lead Sales <noreply@agedleadsales.com>";

  if (resendApiKey) {
    const resend = new Resend(resendApiKey);
    try {
      const preview = await sendPreviewEmail(
        resend,
        fromEmail,
        content.subject,
        newsletterHtml
      );
      if (preview.success) {
        console.log(`[Newsletter] Preview sent to ${REVIEW_EMAIL}`);
      } else {
        const msg = `Preview email failed: ${preview.error}`;
        console.error(msg);
        errors.push(msg);
      }
    } catch (err) {
      const msg = `Preview email error: ${err instanceof Error ? err.message : err}`;
      console.error(msg);
      errors.push(msg);
    }
  } else {
    console.warn("[Newsletter] RESEND_API_KEY not set — skipping preview email");
    errors.push("RESEND_API_KEY not set — preview email not sent");
  }

  // ── Step 5: Schedule broadcast for Tuesday ───────────────────
  const audienceId = process.env.RESEND_AUDIENCE_ID;
  let broadcastId: string | undefined;

  if (resendApiKey && audienceId) {
    try {
      const scheduledAt = `${weekDates.tuesday}T14:00:00.000Z`; // 9 AM ET = 14:00 UTC
      console.log(
        `[Newsletter] Scheduling broadcast to audience ${audienceId} for ${scheduledAt}`
      );
      const result = await scheduleBroadcast(
        audienceId,
        fromEmail,
        content.subject,
        newsletterHtml,
        scheduledAt
      );
      if (result.success) {
        broadcastId = result.broadcastId;
        console.log(
          `[Newsletter] Broadcast scheduled: ${broadcastId}`
        );
      } else {
        const msg = `Broadcast scheduling failed: ${result.error}`;
        console.error(msg);
        errors.push(msg);
      }
    } catch (err) {
      const msg = `Broadcast error: ${err instanceof Error ? err.message : err}`;
      console.error(msg);
      errors.push(msg);
    }
  } else {
    const msg = audienceId
      ? "RESEND_API_KEY not set — broadcast not scheduled"
      : "RESEND_AUDIENCE_ID not set — broadcast not scheduled";
    console.warn(`[Newsletter] ${msg}`);
    errors.push(msg);
  }

  // ── Step 6: Commit newsletter content to GitHub ──────────────
  const reportData = {
    runDate: new Date().toISOString(),
    weekOf: weekDates.weekLabel,
    sendDate: weekDates.tuesday,
    theme: plan?.theme || "AI-generated",
    focusVertical: plan?.focusVertical || "AI-selected",
    subject: content.subject,
    previewText: content.previewText,
    broadcastId: broadcastId || null,
    featuredArticle: content.featuredArticle,
    quickTips: content.quickTips.map((t) => t.title),
    industryInsight: content.industryInsight.headline,
    errors,
  };

  try {
    await commitFilesToGitHub(
      [
        {
          path: `data/newsletter-archive/${weekDates.weekLabel}.json`,
          content: JSON.stringify(reportData, null, 2),
        },
        {
          path: `data/newsletter-archive/${weekDates.weekLabel}.html`,
          content: newsletterHtml,
        },
      ],
      `chore(newsletter): weekly newsletter — ${weekDates.weekLabel}\n\nSubject: ${content.subject}\nTheme: ${plan?.theme || "AI-generated"}\nScheduled for: ${weekDates.tuesday}`
    );
    console.log("[Newsletter] Committed newsletter archive to GitHub");
  } catch (err) {
    const msg = `GitHub commit failed: ${err instanceof Error ? err.message : err}`;
    console.error(msg);
    errors.push(msg);
  }

  // ── Step 7: Send report email to Bill ────────────────────────
  if (resendApiKey) {
    try {
      const resend = new Resend(resendApiKey);
      await resend.emails.send({
        from: fromEmail,
        to: REVIEW_EMAIL,
        subject: `Newsletter Report — ${weekDates.weekLabel}`,
        html: buildReportHtml(reportData, weekDates),
      });
      console.log(`[Newsletter] Report email sent to ${REVIEW_EMAIL}`);
    } catch (err) {
      const msg = `Report email failed: ${err instanceof Error ? err.message : err}`;
      console.error(msg);
      errors.push(msg);
    }
  }

  const duration = Date.now() - startTime;
  console.log(
    `[Newsletter] Completed in ${(duration / 1000).toFixed(1)}s — ${errors.length} errors`
  );

  return NextResponse.json({
    success: errors.length === 0,
    duration,
    weekOf: weekDates.weekLabel,
    subject: content.subject,
    broadcastId,
    previewSentTo: REVIEW_EMAIL,
    scheduledFor: weekDates.tuesday,
    errors,
  });
}

function buildReportHtml(
  report: {
    runDate: string;
    weekOf: string;
    sendDate: string;
    theme: string;
    focusVertical: string;
    subject: string;
    previewText: string;
    broadcastId: string | null;
    featuredArticle: { title: string; slug: string };
    quickTips: string[];
    industryInsight: string;
    errors: string[];
  },
  weekDates: { tuesday: string; weekLabel: string }
): string {
  const tipsHtml = report.quickTips
    .map((t) => `<li style="margin-bottom: 4px;">${t}</li>`)
    .join("");

  const errorsHtml =
    report.errors.length > 0
      ? `<div style="background: #fef2f2; border: 1px solid #fecaca; border-radius: 8px; padding: 16px; margin-top: 20px;">
          <h3 style="color: #dc2626; margin: 0 0 8px;">Issues</h3>
          <ul style="margin: 0; padding-left: 20px;">${report.errors.map((e) => `<li>${e}</li>`).join("")}</ul>
        </div>`
      : "";

  return `<!DOCTYPE html>
<html><head><meta charset="utf-8"></head>
<body style="font-family: -apple-system, sans-serif; color: #1f2937; max-width: 600px; margin: 0 auto; padding: 20px;">
  <div style="background: linear-gradient(135deg, #7c3aed, #a78bfa); color: white; padding: 24px; border-radius: 12px; margin-bottom: 20px;">
    <h1 style="margin: 0 0 4px; font-size: 22px;">Newsletter Report</h1>
    <p style="margin: 0; opacity: 0.9; font-size: 14px;">Week of ${report.weekOf}</p>
  </div>

  <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
    <tr><td style="padding: 8px 0; font-weight: 600; width: 140px;">Subject</td><td style="padding: 8px 0;">${report.subject}</td></tr>
    <tr><td style="padding: 8px 0; font-weight: 600; border-top: 1px solid #e5e7eb;">Preview</td><td style="padding: 8px 0; border-top: 1px solid #e5e7eb;">${report.previewText}</td></tr>
    <tr><td style="padding: 8px 0; font-weight: 600; border-top: 1px solid #e5e7eb;">Theme</td><td style="padding: 8px 0; border-top: 1px solid #e5e7eb;">${report.theme}</td></tr>
    <tr><td style="padding: 8px 0; font-weight: 600; border-top: 1px solid #e5e7eb;">Vertical</td><td style="padding: 8px 0; border-top: 1px solid #e5e7eb;">${report.focusVertical}</td></tr>
    <tr><td style="padding: 8px 0; font-weight: 600; border-top: 1px solid #e5e7eb;">Send Date</td><td style="padding: 8px 0; border-top: 1px solid #e5e7eb;">${weekDates.tuesday} at 9:00 AM ET</td></tr>
    <tr><td style="padding: 8px 0; font-weight: 600; border-top: 1px solid #e5e7eb;">Broadcast ID</td><td style="padding: 8px 0; border-top: 1px solid #e5e7eb;">${report.broadcastId || "Not scheduled"}</td></tr>
    <tr><td style="padding: 8px 0; font-weight: 600; border-top: 1px solid #e5e7eb;">Featured</td><td style="padding: 8px 0; border-top: 1px solid #e5e7eb;">${report.featuredArticle.title}</td></tr>
  </table>

  <h3 style="margin: 0 0 8px; font-size: 16px;">Quick Tips Included</h3>
  <ul style="margin: 0 0 20px; padding-left: 20px;">${tipsHtml}</ul>

  <h3 style="margin: 0 0 8px; font-size: 16px;">Industry Insight</h3>
  <p style="margin: 0 0 20px;">${report.industryInsight}</p>

  <p style="color: #6b7280; font-size: 13px;">A preview copy of the newsletter was sent separately. Reply to this email with any changes needed before Tuesday.</p>

  ${errorsHtml}

  <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 24px 0 12px;">
  <p style="color: #9ca3af; font-size: 11px;">Generated by the Aged Lead Sales newsletter cron job at ${report.runDate}</p>
</body></html>`;
}
