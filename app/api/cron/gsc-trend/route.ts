import { NextResponse } from "next/server";
import { fetchGSCReport, type GSCReport } from "@/lib/cron/gsc-data";
import {
  fetchGscTrend,
  appendGscSnapshot,
  serializeGscTrend,
} from "@/lib/cron/gsc-trend";
import { commitFilesToGitHub } from "@/lib/cron/git-commit";
import { recordCronRun } from "@/lib/cron/heartbeat";

export const maxDuration = 60;
export const dynamic = "force-dynamic";

// Dedicated GSC-trend snapshot cron.
//
// Split out of `daily-performance` on 2026-07-03. The daily performance *report
// email* and the `performance-backlog.json` auto-commits are superseded by the
// consolidated BRSG Portfolio Performance Report (billricestrategy.com), so
// `daily-performance` was unscheduled. But its Step 2b — the `gsc-trend.json`
// snapshot — is the disavow / toxic-backlink tripwire and must keep recording
// daily. This route is that step, standalone: fetch GSC, append the snapshot,
// commit if changed. No AI, no email, no backlog. `health-check` monitors it
// (2-day staleness) so a silent stall — e.g. the 2026-06 Vercel WIF break that
// froze the trend for 4 days undetected — now alerts within a day.
export async function GET(request: Request) {
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const startTime = Date.now();
  const reportDate = new Date().toISOString().split("T")[0];

  // ── Fetch GSC ────────────────────────────────────────────────
  let gsc: GSCReport;
  try {
    gsc = await fetchGSCReport();
  } catch (err) {
    const msg = `GSC fetch failed: ${err instanceof Error ? err.message : err}`;
    console.error(`[GscTrend] ${msg}`);
    await recordCronRun({
      name: "gsc-trend",
      status: "failed",
      detail: msg,
      durationMs: Date.now() - startTime,
    });
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }

  if (!gsc.available) {
    const msg = `GSC not available: ${gsc.error}`;
    console.warn(`[GscTrend] ${msg}`);
    await recordCronRun({
      name: "gsc-trend",
      status: "failed",
      detail: msg,
      durationMs: Date.now() - startTime,
    });
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }

  // ── Append snapshot + commit if changed ──────────────────────
  let committed = false;
  let daysTracked = 0;
  try {
    const existingTrend = await fetchGscTrend();
    const { trend, changed } = appendGscSnapshot(existingTrend, gsc, reportDate);
    daysTracked = trend.snapshots.length;
    if (changed) {
      await commitFilesToGitHub(
        [
          {
            path: "data/gsc-trend.json",
            content: serializeGscTrend(trend, new Date().toISOString()),
          },
        ],
        `chore(gsc): trend snapshot — ${reportDate}\n\n${gsc.sevenDay.metrics.clicks} clicks / ${gsc.sevenDay.metrics.impressions} impressions (7d rolling).`
      );
      committed = true;
      console.log(`[GscTrend] Snapshot committed (${daysTracked} days tracked)`);
    } else {
      console.log("[GscTrend] Trend unchanged — skipping commit");
    }
  } catch (err) {
    const msg = `GSC trend update failed: ${err instanceof Error ? err.message : err}`;
    console.error(`[GscTrend] ${msg}`);
    await recordCronRun({
      name: "gsc-trend",
      status: "failed",
      detail: msg,
      durationMs: Date.now() - startTime,
    });
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }

  const duration = Date.now() - startTime;
  await recordCronRun({
    name: "gsc-trend",
    status: "ok",
    detail: `${gsc.sevenDay.metrics.clicks} clk / ${gsc.sevenDay.metrics.impressions} impr (7d); ${daysTracked} days tracked; committed=${committed}`,
    durationMs: duration,
  });

  return NextResponse.json({
    success: true,
    reportDate,
    committed,
    daysTracked,
    duration,
  });
}
