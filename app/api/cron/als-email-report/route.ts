// Weekly Aged Leads Insights email-program report.
//
// Pulls Resend audience/broadcast data + GA4 email-attributed engagement,
// computes real week-over-week growth from a committed snapshot, emails the
// summary, and records a heartbeat. Webhook-free by design (Bill's call).
//
// Auth: Bearer CRON_SECRET (same as every other cron here).
// Schedule: Sundays 11:00 UTC (vercel.json) — after the lifecycle send window.

import { NextResponse } from "next/server";
import { Resend } from "resend";
import {
  gatherAlsEmailReport,
  buildAlsEmailReportEmail,
  fetchEmailTrend,
  appendEmailSnapshot,
  serializeEmailTrend,
  computeDeltas,
} from "@/lib/cron/als-email-report";
import { commitFilesToGitHub } from "@/lib/cron/git-commit";
import { recordCronRun } from "@/lib/cron/heartbeat";

export const maxDuration = 300;
export const dynamic = "force-dynamic";

const REPORT_EMAIL = process.env.ALS_EMAIL_REPORT_TO || "bill@billricestrategy.com";

export async function GET(request: Request) {
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const startTime = Date.now();
  console.log("[ALS Email Report] Starting weekly report");

  let report;
  try {
    report = await gatherAlsEmailReport();
  } catch (err) {
    const msg = `Report gather failed: ${err instanceof Error ? err.message : err}`;
    console.error(msg);
    await recordCronRun({
      name: "als-email-report",
      status: "failed",
      detail: msg,
      durationMs: Date.now() - startTime,
    });
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }

  // ── Real WoW growth: read prior snapshot, compute deltas, persist new one ──
  let priorDate: string | null = null;
  try {
    const existing = await fetchEmailTrend();
    const { deltas, priorDate: pd } = computeDeltas(report, existing);
    report.audienceDeltas = deltas;
    report.priorSnapshotDate = pd;
    priorDate = pd;

    const { trend, changed } = appendEmailSnapshot(existing, report);
    if (changed) {
      await commitFilesToGitHub(
        [
          {
            path: "data/als-email-report-trend.json",
            content: serializeEmailTrend(trend, new Date().toISOString()),
          },
        ],
        `chore(email): ALS email-report snapshot — ${report.reportDate}\n\n` +
          report.audiences
            .map((a) => `${a.name}: ${a.total} (${a.unsubscribed} unsub)`)
            .join(", ")
      );
      console.log("[ALS Email Report] Trend snapshot committed");
    }
  } catch (err) {
    const msg = `Trend snapshot failed: ${err instanceof Error ? err.message : err}`;
    console.error(msg);
    report.errors.push(msg);
  }

  // ── Send the email ──────────────────────────────────────────
  let emailed = false;
  const resendApiKey = process.env.RESEND_API_KEY;
  if (resendApiKey) {
    try {
      const resend = new Resend(resendApiKey);
      const fromEmail =
        process.env.RESEND_FROM_EMAIL ||
        "Work Aged Leads <noreply@agedleadsales.com>";
      const purchasers = report.audiences.find((a) => a.name.includes("Purchasers"));
      const inquiries = report.audiences.find((a) => a.name.includes("Inquiries"));
      const totalList =
        (purchasers?.total ?? 0) + (inquiries?.total ?? 0);

      const { error } = await resend.emails.send({
        from: fromEmail,
        to: REPORT_EMAIL,
        subject: `Aged Leads Insights — Weekly Email Report — ${report.reportDate} (${totalList.toLocaleString("en-US")} on list)`,
        html: buildAlsEmailReportEmail(report),
      });
      if (error) {
        report.errors.push(`Resend send: ${JSON.stringify(error)}`);
      } else {
        emailed = true;
        console.log(`[ALS Email Report] Sent to ${REPORT_EMAIL}`);
      }
    } catch (err) {
      report.errors.push(
        `Resend send threw: ${err instanceof Error ? err.message : err}`
      );
    }
  } else {
    report.errors.push("RESEND_API_KEY not set — report not emailed");
  }

  const status =
    report.errors.length === 0 ? "ok" : emailed ? "partial" : "failed";
  await recordCronRun({
    name: "als-email-report",
    status,
    detail: `audiences=${report.audiences.map((a) => a.total).join("/")} ga4=${
      report.ga4.available ? report.ga4.sessions + " sess" : "n/a"
    } emailed=${emailed}${priorDate ? ` Δvs=${priorDate}` : ""}`,
    durationMs: Date.now() - startTime,
  });

  return NextResponse.json({
    success: status !== "failed",
    status,
    emailed,
    reportDate: report.reportDate,
    audiences: report.audiences,
    ga4Available: report.ga4.available,
    errors: report.errors,
    durationMs: Date.now() - startTime,
  });
}
