import { NextResponse } from "next/server";
import { sendSingleEmail } from "@/lib/resend";
import { recordCronRun } from "@/lib/cron/heartbeat";
import { buildDailyEmailReport, renderDailyEmailReportHtml } from "@/lib/cron/als-daily-report";

/**
 * Daily email-program report. Replaces the Sunday `als-email-report`
 * (Bill, 2026-09-09).
 *
 * TWO WAYS IN, ONE RENDERER
 *
 *   GET  ?send=1   mails it. This is what the cron calls.
 *   GET            returns the same HTML in the browser, mailing nothing.
 *
 * Both go through `renderDailyEmailReportHtml`, so the page and the email
 * cannot drift into telling different stories about the same day. Viewing must
 * never send: Bill checks this URL between runs, and a page that mails a report
 * every time it is opened trains people to stop opening it.
 *
 * SCHEDULED AT 12:30 UTC, after the 10:50 UTC lifecycle run, so "sent
 * yesterday" is settled and today's run is already reflected in the queue
 * figures. Running before the lifecycle would report a day that had not
 * happened yet.
 */
export const dynamic = "force-dynamic";
export const maxDuration = 120;

const REPORT_EMAIL = process.env.ALS_EMAIL_REPORT_TO || "bill@billricestrategy.com";

export async function GET(request: Request) {
  if (request.headers.get("authorization") !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const startedAt = Date.now();
  const send = new URL(request.url).searchParams.get("send") === "1";

  let report;
  try {
    report = await buildDailyEmailReport();
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    // A report that fails to build is itself a silent failure — the day simply
    // produces no email. Record it so the health check can see the gap.
    if (send) {
      await recordCronRun({
        name: "als-daily-report",
        status: "failed",
        detail: `report build failed: ${msg}`,
        durationMs: Date.now() - startedAt,
      });
    }
    return NextResponse.json({ ok: false, error: msg }, { status: 500 });
  }

  const html = renderDailyEmailReportHtml(report);

  if (!send) {
    return new NextResponse(html, {
      headers: { "Content-Type": "text/html; charset=utf-8" },
    });
  }

  const apiKey = (process.env.RESEND_API_KEY || "").trim();
  if (!apiKey) {
    await recordCronRun({
      name: "als-daily-report",
      status: "failed",
      detail: "RESEND_API_KEY missing — report not mailed.",
      durationMs: Date.now() - startedAt,
    });
    return NextResponse.json({ ok: false, error: "RESEND_API_KEY missing" }, { status: 500 });
  }

  // The subject carries the two numbers worth seeing without opening anything:
  // whether we sent, and whether anything needs attention.
  const flag = report.warnings.length > 0 ? ` — ${report.warnings.length} to check` : "";
  const subject = `Email program: ${report.sendsYesterday} sent yesterday${flag}`;

  try {
    await sendSingleEmail(apiKey, {
      from: process.env.RESEND_FROM_EMAIL || "Work Aged Leads <bill@workagedleads.com>",
      to: [REPORT_EMAIL],
      subject,
      html,
      replyTo: "bill@billricestrategy.com",
    });
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    await recordCronRun({
      name: "als-daily-report",
      status: "failed",
      detail: `send failed: ${msg}`,
      durationMs: Date.now() - startedAt,
    });
    return NextResponse.json({ ok: false, error: msg }, { status: 502 });
  }

  await recordCronRun({
    name: "als-daily-report",
    // `partial` when the report itself is flagging something, so a run that
    // mails a page full of warnings does not read as an unqualified success.
    status: report.warnings.length > 0 ? "partial" : "ok",
    detail: [
      `sent ${report.sendsYesterday} yesterday`,
      `${report.sends7d} in 7d`,
      report.engagementTracking ? "engagement tracked" : "engagement NOT tracked",
      report.warnings.length > 0 ? `${report.warnings.length} warning(s)` : "",
    ]
      .filter(Boolean)
      .join(", "),
    durationMs: Date.now() - startedAt,
  });

  return NextResponse.json({
    ok: true,
    mailedTo: REPORT_EMAIL,
    sendsYesterday: report.sendsYesterday,
    warnings: report.warnings,
  });
}
