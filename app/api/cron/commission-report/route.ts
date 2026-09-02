import { NextResponse } from "next/server";
import { Resend } from "resend";
import { fetchStoreRevenue } from "@/lib/reports/store-revenue";
import {
  buildCommissionReportEmail,
  commissionReportSubject,
} from "@/lib/cron/commission-report-email";
import { recordCronRun } from "@/lib/cron/heartbeat";

/**
 * The daily affiliate commission email. 6am ET.
 *
 * Bill asked for this on 2026-09-02, the same day the store-side property
 * became readable. Until then the only way to know what the affiliate
 * relationship had earned was to ask someone to query GA4 by hand, which meant
 * in practice nobody knew between one session and the next.
 *
 * SENDS EVERY DAY, INCLUDING QUIET ONES
 *
 * Deliberately not skip-on-empty. This is Bill's own operating number rather
 * than a client digest, and a missing email is indistinguishable from a broken
 * cron — the silence would be the failure mode. A zero day says zero and
 * explains that GA4 lags 24-48h, so an empty yesterday is usually latency.
 *
 * WHAT IT WILL NOT DO
 *
 * It will not send a report built on an error. If GA4 fails, the run records a
 * failed heartbeat and returns non-200 rather than mailing a cheerful $0.00 —
 * a report that cannot tell "no sales" from "no data" is worse than no report,
 * and that exact confusion produced a wrong verdict earlier in this project.
 */

export const dynamic = "force-dynamic";
export const maxDuration = 60;

const REPORT_EMAIL = "bill@billricestrategy.com";

export async function GET(request: Request) {
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const url = new URL(request.url);
  /** Render and return the email without sending it. For smoke tests. */
  const dryRun = url.searchParams.get("dryRun") === "1";
  /** Override the recipient — used to send a test copy elsewhere. */
  const to = url.searchParams.get("to") ?? REPORT_EMAIL;
  const goal = Number(url.searchParams.get("goal") ?? 2000);
  const start = url.searchParams.get("start") ?? undefined;
  const end = url.searchParams.get("end") ?? undefined;

  let report;
  try {
    report = await fetchStoreRevenue({ start, end, goal });
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error(`[CommissionReport] GA4 read failed: ${msg}`);
    await recordCronRun({
      name: "commission-report",
      status: "failed",
      detail: `GA4 read failed: ${msg}`,
    }).catch(() => {});
    return NextResponse.json(
      {
        error: msg,
        sent: false,
        note: msg.includes("403")
          ? "403 means the WIF service account lost Viewer on the Kaleidico property. An access fact, not an absence of data."
          : "No email was sent. A report built on a failed read cannot tell 'no sales' from 'no data'.",
      },
      { status: 502 },
    );
  }

  const subject = commissionReportSubject(report);
  const html = buildCommissionReportEmail(report);

  if (dryRun) {
    return NextResponse.json({
      dryRun: true,
      sent: false,
      subject,
      to,
      htmlBytes: html.length,
      mtdCommission: report.mtd.commissionLikely,
      mtdRevenue: report.mtd.attributedRevenue,
      pctOfGoal: report.goal.pctOfGoal,
      onPace: report.goal.onPace,
      yesterdaySessions: report.yesterday.sessions,
      placements: report.byPlacement.length,
      months: report.monthly.length,
    });
  }

  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.RESEND_FROM_EMAIL || "Work Aged Leads <bill@workagedleads.com>";
  if (!apiKey) {
    await recordCronRun({
      name: "commission-report",
      status: "failed",
      detail: "RESEND_API_KEY not set",
    }).catch(() => {});
    return NextResponse.json({ error: "RESEND_API_KEY not set", sent: false }, { status: 500 });
  }

  try {
    const resend = new Resend(apiKey);
    const { data, error } = await resend.emails.send({ from, to, subject, html });
    if (error) throw new Error(JSON.stringify(error));

    await recordCronRun({
      name: "commission-report",
      status: "ok",
      detail: `${report.mtd.commissionLikely} MTD, ${report.goal.pctOfGoal}% of goal`,
    }).catch(() => {});

    console.log(`[CommissionReport] Sent to ${to} — ${subject}`);
    return NextResponse.json({
      sent: true,
      to,
      subject,
      id: data?.id,
      mtdCommission: report.mtd.commissionLikely,
      pctOfGoal: report.goal.pctOfGoal,
    });
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error(`[CommissionReport] Send failed: ${msg}`);
    await recordCronRun({
      name: "commission-report",
      status: "failed",
      detail: `Send failed: ${msg}`,
    }).catch(() => {});
    return NextResponse.json({ error: msg, sent: false }, { status: 502 });
  }
}
