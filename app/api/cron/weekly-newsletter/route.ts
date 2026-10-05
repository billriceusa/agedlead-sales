import { NextResponse } from "next/server";
import { createClient } from "next-sanity";
import { Resend } from "resend";
import { calendarStatus, type CalendarStatus } from "@/data/newsletter-calendar";
import {
  generateNewsletterContent,
  type RecentPost,
  type NewsletterContent,
} from "@/lib/cron/newsletter-ai";
import { buildNewsletterHtml } from "@/lib/cron/newsletter-email";
import { checkIssueHtml, type IssueGate } from "@/lib/newsletter/issue-gate";
import { commitFilesToGitHub } from "@/lib/cron/git-commit";
import { readIssue } from "@/lib/newsletter/archive-github";
import { recordCronRun } from "@/lib/cron/heartbeat";
import { REPLY_TO_EMAIL } from "@/lib/resend";
import { killUrl } from "@/lib/newsletter/kill-token";

export const maxDuration = 300;
export const dynamic = "force-dynamic";

const REVIEW_EMAIL = "bill@billricestrategy.com";

/**
 * The origin every link in the issue is built from.
 *
 * WHY THE HARD REFUSAL: agedleadsales.com is a RETIRED hostname. The fallback
 * below predates the 2026-08-03 consolidation, and an unset NEXT_PUBLIC_SITE_URL
 * would render every article link, every store link and the STOP link on the dead
 * brand — and then mail it, because nothing downstream inspects the host. A test
 * send caught exactly this in scripts/draft-newsletter.ts, which already refuses;
 * the route that writes the archives did not. Better a loud 500 on Sunday, with
 * the whole week still available to fix it, than 5,900 people receiving dead links.
 */
function getSiteUrl(): string {
  const url = process.env.NEXT_PUBLIC_SITE_URL || "https://agedleadsales.com";
  let host: string;
  try {
    host = new URL(url).host.replace(/^www\./, "");
  } catch {
    throw new Error(`NEXT_PUBLIC_SITE_URL is not a valid URL: ${url}`);
  }
  if (host !== "workagedleads.com") {
    throw new Error(
      `Refusing to draft an issue for host "${host}". ` +
        `NEXT_PUBLIC_SITE_URL must be https://workagedleads.com — ` +
        `agedleadsales.com has been retired since 2026-08-03 and every link, ` +
        `including the STOP link, would point at the dead brand.`
    );
  }
  return url;
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

// Plan lookup moved to data/newsletter-calendar.ts (`calendarStatus`), matched
// EXACTLY. What stood here matched anything within seven days — and since plans
// are weekly, that window could return the PREVIOUS week's plan for a send. A
// stale theme reads as deliberate, so it is worse than no theme at all. It also
// had a copy/paste tell: `p.sendDate === weekLabel || p.sendDate === weekLabel`.
//
// The bigger failure it hid: the calendar expired 2026-06-02 and 13 consecutive
// issues drafted with no plan, archived as theme "AI-generated", with nothing
// anywhere saying so. `calendarStatus()` now returns a sentence about it, and
// the preview email below prints it.

async function sendPreviewEmail(
  resend: Resend,
  fromEmail: string,
  subject: string,
  html: string,
  weekLabel: string,
  gate: IssueGate,
  cal: CalendarStatus
): Promise<{ success: boolean; error?: string }> {
  // The calendar line. An expired calendar produced 13 issues on themes the
  // model invented for itself, and the preview email looked exactly the same
  // every one of those weeks. It does not look the same any more.
  const calendarBanner = cal.matched
    ? `
    <div style="background: #f0fdf4; border: 1px solid #86efac; border-radius: 8px; padding: 12px 16px; margin: 0 auto 16px; max-width: 600px; font-family: -apple-system, sans-serif;">
      <p style="margin: 0; color: #166534; font-size: 13px;">${cal.message}</p>
    </div>`
    : `
    <div style="background: #fff7ed; border: 2px solid #ea580c; border-radius: 8px; padding: 16px; margin: 0 auto 16px; max-width: 600px; font-family: -apple-system, sans-serif;">
      <p style="margin: 0 0 4px 0; font-weight: 700; color: #9a3412;">NO CALENDAR PLAN — the theme below is the model's own</p>
      <p style="margin: 0; color: #9a3412; font-size: 13px;">${cal.message}</p>
    </div>`;
  // On a blocking failure the issue is archived with killed:true, so the send
  // command below would simply be refused. Printing it anyway would send Bill
  // to a dead end and read like the gate had not fired.
  // The review window, stated plainly. This banner used to say "NOT scheduled,
  // NOT sent" and hand over a terminal command. Since 2026-09-02 the issue
  // SENDS BY ITSELF on Tuesday unless it is stopped, so the banner has to say
  // that — a preview that understates what happens next is how an unreviewed
  // issue reaches thousands of people.
  const stopLink = (() => {
    try {
      return killUrl(getSiteUrl(), weekLabel);
    } catch {
      // CRON_SECRET missing — cannot sign a token. Say so rather than render a
      // dead link that looks like a working one.
      return null;
    }
  })();

  const banner = gate.ok
    ? `
    <div style="background: #fefce8; border: 2px solid #f59e0b; border-radius: 8px; padding: 16px; margin: 0 auto 24px; max-width: 600px; font-family: -apple-system, sans-serif;">
      <p style="margin: 0 0 4px 0; font-weight: 700; color: #92400e;">Scheduled to send Tuesday 9am ET unless you stop it</p>
      <p style="margin: 0 0 12px; color: #78350f; font-size: 14px;">Do nothing and this goes to the list on Tuesday. If it should not, use the button — one click, no login, and it cannot be undone by accident.</p>
      ${
        stopLink
          ? `<p style="margin: 0 0 12px;"><a href="${stopLink}" style="display: inline-block; background: #dc2626; color: #ffffff; padding: 10px 20px; border-radius: 6px; text-decoration: none; font-weight: 700; font-size: 14px;">Stop this issue</a></p>`
          : `<p style="margin: 0 0 12px; color: #991b1b; font-size: 13px; font-weight: 600;">No stop link — CRON_SECRET is not set on this deployment, so the token could not be signed. Kill it by hand if needed.</p>`
      }
      <p style="margin: 0; color: #78350f; font-size: 13px;">To send it early instead:</p>
      <pre style="margin: 6px 0 0; padding: 8px 10px; background: #fff7ed; border: 1px solid #fed7aa; border-radius: 6px; font-size: 12px; overflow-x: auto;">npm run newsletter:send -- --date ${weekLabel} --confirm</pre>
    </div>`
    : `
    <div style="background: #fef2f2; border: 2px solid #dc2626; border-radius: 8px; padding: 16px; margin: 0 auto 24px; max-width: 600px; font-family: -apple-system, sans-serif;">
      <p style="margin: 0 0 4px 0; font-weight: 700; color: #991b1b;">QUARANTINED — this issue cannot be sent</p>
      <p style="margin: 0 0 8px; color: #7f1d1d; font-size: 14px;">It quotes a per-lead price (${gate.blocking.join(", ")}). The archive was written with <code>killed: true</code>, so the send command will refuse it.</p>
      <p style="margin: 0; color: #7f1d1d; font-size: 13px;">Partner pricing changes without notice and a broadcast cannot be recalled. Edit the archived HTML to compare cost structure in words, or draft a fresh issue.</p>
    </div>`;

  const previewHtml = `${calendarBanner}${banner}
    ${html}`;

  const { error } = await resend.emails.send({
    from: fromEmail,
    replyTo: REPLY_TO_EMAIL,
    to: REVIEW_EMAIL,
    subject: gate.ok ? `[PREVIEW] ${subject}` : `[QUARANTINED] ${subject}`,
    html: previewHtml,
  });

  if (error) {
    return { success: false, error: JSON.stringify(error) };
  }
  return { success: true };
}

export async function GET(request: Request) {
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // THIS ROUTE CANNOT SEND TO SUBSCRIBERS. It drafts, previews to Bill, and
  // archives. Nothing more.
  //
  // History: auto-send was disabled 2026-06-23 by owner directive behind a
  // CRON_PUBLISH_DISABLED env flag, because the route emailed Bill a "preview"
  // and scheduled the live broadcast in the SAME run — the preview was never a
  // gate, just a courtesy copy of something already going out.
  //
  // Restored 2026-08-10 with the gate made structural instead of configurable:
  // the broadcast code path is gone from this file entirely. There is no env
  // var that makes this route mail the list, which is a stronger guarantee than
  // a flag someone can flip by accident. Sending is a separate, deliberate,
  // human-run step — `npm run newsletter:send -- --date <YYYY-MM-DD> --confirm`.
  const startTime = Date.now();
  try {
    return await draftThisWeeksIssue(request, startTime);
  } catch (err) {
    // WHY THIS EXISTS: everything after generation used to run unguarded. A
    // throw here — a malformed issue reaching buildNewsletterHtml, a missing
    // Sanity token, a bad NEXT_PUBLIC_SITE_URL — 500'd the route BEFORE
    // recordCronRun was ever reached, so the health check saw last week's beat
    // and said nothing for eight days. A failure must always leave a heartbeat.
    const msg = err instanceof Error ? err.message : String(err);
    console.error(`[Newsletter] Run failed: ${msg}`);
    await recordCronRun({
      name: "weekly-newsletter",
      status: "failed",
      detail: msg,
      durationMs: Date.now() - startTime,
    }).catch((beatErr) => {
      console.error(`[Newsletter] Heartbeat write also failed: ${beatErr}`);
    });
    return NextResponse.json(
      { success: false, error: msg, duration: Date.now() - startTime },
      { status: 500 }
    );
  }
}

async function draftThisWeeksIssue(request: Request, startTime: number) {
  const errors: string[] = [];
  const weekDates = getWeekDates();
  const siteUrl = getSiteUrl();
  const force = new URL(request.url).searchParams.get("force") === "1";

  console.log(
    `[Newsletter] Starting run for week of ${weekDates.weekLabel}, send date: ${weekDates.tuesday}`
  );

  // ── Step 0: Never overwrite an issue that already exists ─────
  //
  // This route used to commit unconditionally. Bill clicks STOP in the preview,
  // anyone re-triggers the route for the same week, and the fresh record — which
  // carries no `killed` key — erases the kill and the issue mails. The restock
  // route has refused this since it shipped; this one did not.
  //
  // It also makes the cron idempotent, which is what lets the Monday run exist:
  // the schedule is Sunday AND Monday, so a Sunday that dies still has a second
  // chance, and a Sunday that succeeded makes Monday a free no-op that spends no
  // Anthropic tokens. Deliberate redrafts pass ?force=1.
  const existing = await readIssue(weekDates.weekLabel).catch((err) => {
    // A read failure must not block drafting a week that has nothing archived.
    console.warn(`[Newsletter] Could not read existing archive: ${err}`);
    return null;
  });
  if (existing && !force) {
    const state = existing.sent ? "already sent" : existing.killed ? "killed" : "drafted";
    const detail = `Issue ${weekDates.weekLabel} is ${state} — refusing to overwrite it. Pass ?force=1 to redraft deliberately.`;
    console.log(`[Newsletter] ${detail}`);
    await recordCronRun({
      name: "weekly-newsletter",
      status: "ok",
      detail,
      durationMs: Date.now() - startTime,
    });
    return NextResponse.json({
      success: true,
      skipped: true,
      reason: detail,
      weekOf: weekDates.weekLabel,
      subject: existing.subject,
      duration: Date.now() - startTime,
    });
  }

  // ── Step 1: Gather context ───────────────────────────────────
  const recentPosts = await fetchRecentPosts();
  console.log(`[Newsletter] Found ${recentPosts.length} recent posts`);

  const calStatus = calendarStatus(weekDates.tuesday);
  const plan = calStatus.plan;
  console.log(`[Newsletter] ${calStatus.message}`);

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
    await recordCronRun({
      name: "weekly-newsletter",
      status: "failed",
      detail: msg,
      durationMs: Date.now() - startTime,
    });
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

  // ── Step 3.5: Gate the issue ─────────────────────────────────
  //
  // This cron produced 2026-08-10, which quoted "$0.30" and "Aged leads from
  // $0.25" and was mailed on 2026-08-12. The price guard existed; it was wired
  // into scripts/draft-newsletter.ts, a command a human runs by choice, and
  // never into this route — the one that actually writes archives.
  //
  // A blocking hit QUARANTINES rather than aborts. The archive is still
  // committed, because a stack trace cannot tell you why the model wrote a
  // price and the bad draft can. It is written with killed:true, which reuses
  // the already-tested refusal in scripts/send-newsletter.ts rather than
  // inventing a second kind of "do not send" flag.
  const gate = checkIssueHtml(newsletterHtml);
  if (!gate.ok) {
    console.error(`[Newsletter] QUARANTINED — ${gate.blocking.join(", ")}`);
    errors.push(
      `QUARANTINED (price guard): ${gate.blocking.join(", ")} — archived with killed:true, not sendable.`
    );
  }
  for (const w of gate.warnings) {
    console.warn(`[Newsletter] ${w}`);
    errors.push(`Warning: ${w}`);
  }

  // ── Step 4: Send preview to Bill ─────────────────────────────
  const resendApiKey = process.env.RESEND_API_KEY;
  const fromEmail =
    process.env.RESEND_FROM_EMAIL || "Work Aged Leads <bill@workagedleads.com>";

  //
  // THE PREVIEW *IS* THE REVIEW. This newsletter is opt-out: nobody approves an
  // issue, Bill only stops one he dislikes, using the STOP link in this email.
  // So a preview that never arrives is not a logged warning — it means Tuesday
  // would mail ~5,900 people an issue no human ever saw, with no way to have
  // stopped it. A failed preview therefore kills the issue; Bill can redraft
  // with ?force=1 once the mail path is working.
  let previewFailed: string | null = null;

  if (resendApiKey) {
    const resend = new Resend(resendApiKey);
    try {
      const preview = await sendPreviewEmail(
        resend,
        fromEmail,
        content.subject,
        newsletterHtml,
        weekDates.weekLabel,
        gate,
        calStatus
      );
      if (preview.success) {
        console.log(`[Newsletter] Preview sent to ${REVIEW_EMAIL}`);
      } else {
        previewFailed = `Preview email failed: ${preview.error}`;
      }
    } catch (err) {
      previewFailed = `Preview email error: ${err instanceof Error ? err.message : err}`;
    }
  } else {
    previewFailed = "RESEND_API_KEY not set — preview email not sent";
  }

  if (previewFailed) {
    console.error(`[Newsletter] ${previewFailed}`);
    errors.push(
      `${previewFailed} — archived with killed:true, because an unreviewed issue must not send.`
    );
  }

  // ── Step 5: (removed) ────────────────────────────────────────
  // Scheduling a live broadcast used to happen here, in the same run that
  // emailed the "preview". That is the whole reason this cron was switched off
  // on 2026-06-23. Sending now lives in scripts/send-newsletter.ts and is run
  // by a human against an archived, already-reviewed issue.

  // ── Step 6: Commit newsletter content to GitHub ──────────────
  const reportData = {
    runDate: new Date().toISOString(),
    weekOf: weekDates.weekLabel,
    sendDate: weekDates.tuesday,
    // "AI-generated" here is the tell that the calendar had no entry for this
    // date. Thirteen consecutive issues carried it after the calendar expired
    // on 2026-06-02 and nobody noticed, because nothing read this field back.
    // `calendarStatus.message` is now archived beside it and printed in the
    // preview, so the same silence cannot recur.
    theme: plan?.theme || "AI-generated",
    focusVertical: plan?.focusVertical || "topic-themed",
    calendarStatus: calStatus.message,
    calendarMatched: calStatus.matched,
    calendarRemaining: calStatus.remaining,
    subject: content.subject,
    previewText: content.previewText,
    // The rendered HTML archived alongside this file is the ONLY thing
    // scripts/send-newsletter.ts will mail. Regenerating would produce
    // different AI copy than the issue Bill approved, which would defeat the
    // review gate — so the approved bytes are what get stored and sent.
    html: `${weekDates.weekLabel}.html`,
    sent: false,
    // Set on a blocking gate failure, or when the preview never reached Bill.
    // send-newsletter.ts already refuses any issue carrying this flag, so both
    // cases need no new code there.
    ...(gate.ok && !previewFailed
      ? {}
      : {
          killed: true,
          killedAt: new Date().toISOString(),
          killedReason: !gate.ok
            ? `AUTO-QUARANTINE (price guard): ${gate.blocking.join(", ")}`
            : `AUTO-QUARANTINE (no review possible): ${previewFailed}`,
        }),
    priceGuard: { blocking: gate.blocking, warnings: gate.warnings },
    featuredArticle: content.featuredArticle,
    quickTips: content.quickTips.map((t) => t.title),
    industryInsight: content.industryInsight.headline,
    errors,
  };

  let archiveCommitted = true;
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
    // THE ONE ERROR THAT GUARANTEES NOTHING CAN BE SENT. The Tuesday sender
    // reads the archive from main; if this commit did not land, there is no
    // issue to mail and the week is lost. It used to be filed as `partial`
    // alongside cosmetic warnings, and health-check alerts only on `failed`,
    // so the single fatal error was the one that stayed silent.
    archiveCommitted = false;
    const msg = `GitHub commit failed — NOTHING IS ARCHIVED, so Tuesday has nothing to send: ${err instanceof Error ? err.message : err}`;
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

  // `partial` is for cosmetic warnings; health-check only alerts on `failed`.
  // A missing archive or an unreviewable issue must reach Bill, so both are
  // `failed` — not filed beside the duplicate-utm_content warning.
  await recordCronRun({
    name: "weekly-newsletter",
    status: !archiveCommitted || previewFailed ? "failed" : errors.length === 0 ? "ok" : "partial",
    detail:
      errors.length > 0
        ? errors.join("; ")
        : `subject="${content.subject}" drafted, not sent`,
    durationMs: duration,
  });

  return NextResponse.json({
    success: errors.length === 0,
    duration,
    weekOf: weekDates.weekLabel,
    subject: content.subject,
    previewSentTo: REVIEW_EMAIL,
    sent: false,
    sendCommand: `npm run newsletter:send -- --date ${weekDates.weekLabel} --confirm`,
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
    html: string;
    sent: boolean;
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
    <tr><td style="padding: 8px 0; font-weight: 600; border-top: 1px solid #e5e7eb;">Target send</td><td style="padding: 8px 0; border-top: 1px solid #e5e7eb;">${weekDates.tuesday} at 9:00 AM ET</td></tr>
    <tr><td style="padding: 8px 0; font-weight: 600; border-top: 1px solid #e5e7eb;">Status</td><td style="padding: 8px 0; border-top: 1px solid #e5e7eb; color: #b45309; font-weight: 600;">Drafted — nothing scheduled, nothing sent</td></tr>
    <tr><td style="padding: 8px 0; font-weight: 600; border-top: 1px solid #e5e7eb;">Featured</td><td style="padding: 8px 0; border-top: 1px solid #e5e7eb;">${report.featuredArticle.title}</td></tr>
  </table>

  <h3 style="margin: 0 0 8px; font-size: 16px;">Quick Tips Included</h3>
  <ul style="margin: 0 0 20px; padding-left: 20px;">${tipsHtml}</ul>

  <h3 style="margin: 0 0 8px; font-size: 16px;">Industry Insight</h3>
  <p style="margin: 0 0 20px;">${report.industryInsight}</p>

  <p style="color: #6b7280; font-size: 13px;">A preview copy of the newsletter was sent separately. This issue is <strong>not scheduled</strong> — it goes nowhere until someone runs:</p>
  <pre style="padding: 10px 12px; background: #f9fafb; border: 1px solid #e5e7eb; border-radius: 6px; font-size: 12px; overflow-x: auto;">npm run newsletter:migrate -- --apply   # fold in the week's new buyers
npm run newsletter:send -- --date ${report.weekOf} --confirm</pre>

  ${errorsHtml}

  <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 24px 0 12px;">
  <p style="color: #9ca3af; font-size: 11px;">Generated by the Work Aged Leads newsletter cron job at ${report.runDate}</p>
</body></html>`;
}
