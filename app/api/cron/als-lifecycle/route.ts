import { NextRequest, NextResponse } from "next/server";
import { desc } from "drizzle-orm";
import { db } from "@/lib/db";
import { alsBuyerJourneys } from "@/lib/db/schema";
import {
  runLifecycle,
  getLifecyclePlan,
  renderLifecycleEmail,
  lifecycleStepIndex,
  journeyLength,
  type JourneyName,
} from "@/lib/als/lifecycle";
import { ALS_LIFECYCLE_SEND_ENABLED, ALS_LIFECYCLE_LAUNCH_AT } from "@/lib/als/config";

export const maxDuration = 300;
export const dynamic = "force-dynamic";

// Lifecycle emails send from the AgedLeadSales Resend account — that is the
// account's name in Resend, not the site brand. It survives the rename to
// Work Aged Leads on purpose; renaming it here would not rename it there.
// The full-access
// key lives in env on this project (ALS_RESEND_API_KEY, falling back to the
// shared RESEND_API_KEY).
function resolveResendApiKey(): string | null {
  return process.env.ALS_RESEND_API_KEY || process.env.RESEND_API_KEY || null;
}

export async function GET(req: NextRequest) {
  const sp = req.nextUrl.searchParams;
  const mode = sp.get("mode") || "sync";
  const authHeader = req.headers.get("authorization");
  const bearerOk = authHeader === `Bearer ${process.env.CRON_SECRET}`;

  // Cron, manual runs, and the read-only preview/render views all require the
  // Bearer secret (no separate browser-admin path in this repo).
  if (!bearerOk) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // -------- Render one email (read-only) --------
  if (mode === "render") {
    const journey = (sp.get("journey") || "welcome") as JourneyName;
    const step = Number(sp.get("step") || "1");
    if (step < 1 || step > journeyLength(journey)) {
      return NextResponse.json({ error: `step out of range for ${journey}` }, { status: 400 });
    }
    const { html } = renderLifecycleEmail(journey, step, {
      firstName: sp.get("name") || "there",
      vertical: sp.get("vertical"),
      states: null,
      lastOrderAmount: null,
      lifetimeOrders: null,
    });
    return new NextResponse(html, {
      headers: { "Content-Type": "text/html; charset=utf-8" },
    });
  }

  // Launch-date guard: even when SEND_ENABLED, hold all sends until LAUNCH_AT.
  const launchAt = ALS_LIFECYCLE_LAUNCH_AT ? new Date(ALS_LIFECYCLE_LAUNCH_AT) : null;
  const launchReached = !launchAt || isNaN(launchAt.getTime()) || new Date() >= launchAt;
  const live = ALS_LIFECYCLE_SEND_ENABLED && launchReached;

  // -------- Preview dashboard (read-only) --------
  if (mode === "preview") {
    const plan = await getLifecyclePlan(live);
    const recent = await db
      .select()
      .from(alsBuyerJourneys)
      .orderBy(desc(alsBuyerJourneys.updatedAt))
      .limit(60);
    return new NextResponse(
      buildDashboardHtml(plan, recent, {
        enabled: ALS_LIFECYCLE_SEND_ENABLED,
        launchAt: ALS_LIFECYCLE_LAUNCH_AT,
        live,
      }),
      { headers: { "Content-Type": "text/html; charset=utf-8" } }
    );
  }

  // -------- Run (enroll + advance) --------
  const apiKey = resolveResendApiKey();
  if (live && !apiKey) {
    return NextResponse.json(
      { success: false, error: "Send enabled but no Resend API key resolved" },
      { status: 500 }
    );
  }

  const startedAt = Date.now();
  try {
    const result = await runLifecycle(apiKey || "", { sendEnabled: live });
    console.log(
      `[als-lifecycle] ${
        live
          ? `+${result.enrolledWelcome}/${result.enrolledAiSeries}/${result.enrolledReplenishment} enrolled (welcome/ai/replen), ${result.sent} sent, ${result.completed} completed`
          : `DRY (${ALS_LIFECYCLE_SEND_ENABLED ? `scheduled for ${ALS_LIFECYCLE_LAUNCH_AT}` : "send disabled"}): ${result.plan?.welcomeEligible ?? 0} welcome-eligible, ${result.plan?.replenishEligible ?? 0} replen-eligible, ${result.plan?.dueNow ?? 0} due`
      } (${Date.now() - startedAt}ms)`
    );
    return NextResponse.json({
      success: true,
      live,
      sendEnabled: ALS_LIFECYCLE_SEND_ENABLED,
      launchAt: ALS_LIFECYCLE_LAUNCH_AT || null,
      result,
    });
  } catch (err) {
    console.error("[als-lifecycle] failed", err);
    return NextResponse.json(
      { success: false, error: err instanceof Error ? err.message : String(err) },
      { status: 500 }
    );
  }
}

// ---------------------------------------------------------------------------
// Dashboard
// ---------------------------------------------------------------------------

type JourneyRow = typeof alsBuyerJourneys.$inferSelect;

function esc(s: string | null): string {
  return (s || "").replace(/[&<>"]/g, (c) =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c] as string
  );
}

function buildDashboardHtml(
  plan: Awaited<ReturnType<typeof getLifecyclePlan>>,
  recent: JourneyRow[],
  launch: { enabled: boolean; launchAt: string; live: boolean }
): string {
  const gate = launch.live
    ? `<span style="color:#22c55e;font-weight:700;">LIVE — sending</span>`
    : launch.enabled && launch.launchAt
    ? `<span style="color:#7dd3fc;font-weight:700;">ENABLED — scheduled, holds until ${esc(launch.launchAt)} (dry until then)</span>`
    : `<span style="color:#fbbf24;font-weight:700;">SEND DISABLED (dry run — nothing sends)</span>`;

  const steps = lifecycleStepIndex()
    .map(
      (s) =>
        `<tr><td><span class="badge ${s.journey}">${s.journey}</span></td><td>${s.step}</td>
        <td>day ${s.offsetDays}</td><td>${esc(s.subject)}</td>
        <td><a href="?mode=render&journey=${s.journey}&step=${s.step}" target="_blank">preview →</a></td></tr>`
    )
    .join("");

  const rows = recent
    .map(
      (j) =>
        `<tr><td>${j.contactId}</td><td><span class="badge ${j.journey}">${esc(j.journey)}</span></td>
        <td>${j.step}/${journeyLength(j.journey as JourneyName)}</td><td>${esc(j.status)}</td>
        <td>${j.nextDueAt ? new Date(j.nextDueAt).toISOString().split("T")[0] : "—"}</td>
        <td>${j.lastSentAt ? new Date(j.lastSentAt).toISOString().split("T")[0] : "—"}</td></tr>`
    )
    .join("");

  return `<!doctype html><html><head><meta charset="utf-8"><title>ALS Lifecycle</title>
<style>
  body{font-family:-apple-system,sans-serif;margin:0;background:#0f172a;color:#e2e8f0;}
  .wrap{max-width:1000px;margin:0 auto;padding:32px 20px;}
  h1{font-size:20px;margin:0 0 4px;} .sub{color:#94a3b8;font-size:13px;margin-bottom:20px;}
  .gate{background:#1e293b;border:1px solid #334155;border-radius:8px;padding:10px 14px;margin-bottom:20px;font-size:14px;}
  .kpis{display:flex;gap:18px;flex-wrap:wrap;margin-bottom:26px;}
  .kpi{background:#1e293b;border:1px solid #334155;border-radius:10px;padding:14px 18px;}
  .kpi .n{font-size:24px;font-weight:700;display:block;} .kpi .l{font-size:11px;color:#94a3b8;text-transform:uppercase;letter-spacing:.04em;}
  h2{font-size:14px;color:#cbd5e1;margin:24px 0 8px;}
  table{width:100%;border-collapse:collapse;font-size:13px;} th,td{text-align:left;padding:7px 10px;border-bottom:1px solid #1e293b;}
  th{color:#94a3b8;font-weight:600;font-size:11px;text-transform:uppercase;}
  a{color:#7dd3fc;} .badge{padding:2px 8px;border-radius:999px;font-size:11px;font-weight:600;}
  .badge.welcome{background:#312e81;color:#c7d2fe;} .badge.replenishment{background:#164e63;color:#a5f3fc;}
  .badge.ai-series{background:#3f1d52;color:#e9c7fc;}
</style></head><body><div class="wrap">
  <h1>Aged Leads Insights — Lifecycle</h1>
  <div class="sub">Triggered welcome → AI series → replenishment. Read-only QC view.</div>
  <div class="gate">Status: ${gate} &middot; AI series: ${plan.aiSeriesEnabled ? '<span style="color:#22c55e;font-weight:700;">ENABLED</span>' : '<span style="color:#fbbf24;font-weight:700;">dark (gated off)</span>'}</div>
  <div class="kpis">
    <div class="kpi"><span class="n">${plan.welcomeEligible}</span><span class="l">welcome-eligible</span></div>
    <div class="kpi"><span class="n">${plan.aiSeriesEligible}</span><span class="l">ai-series-eligible</span></div>
    <div class="kpi"><span class="n">${plan.replenishEligible}</span><span class="l">replen-eligible</span></div>
    <div class="kpi"><span class="n">${plan.activeWelcome}</span><span class="l">active welcome</span></div>
    <div class="kpi"><span class="n">${plan.activeAiSeries}</span><span class="l">active ai-series</span></div>
    <div class="kpi"><span class="n">${plan.activeReplenishment}</span><span class="l">active replen</span></div>
    <div class="kpi"><span class="n">${plan.dueNow}</span><span class="l">due now</span></div>
  </div>
  <h2>Email steps (click to preview the actual email)</h2>
  <table><thead><tr><th>Journey</th><th>Step</th><th>Fires</th><th>Subject</th><th></th></tr></thead><tbody>${steps}</tbody></table>
  <h2>Recent journey activity</h2>
  <table><thead><tr><th>Contact</th><th>Journey</th><th>Step</th><th>Status</th><th>Next due</th><th>Last sent</th></tr></thead>
  <tbody>${rows || `<tr><td colspan="6" style="color:#94a3b8;padding:20px">No journeys yet — none enrolled until send is enabled.</td></tr>`}</tbody></table>
</div></body></html>`;
}
