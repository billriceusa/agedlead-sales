import { NextResponse } from "next/server";
import { createClient } from "next-sanity";
import { Resend } from "resend";
import { recordCronRun, type CronName } from "@/lib/cron/heartbeat";

export const maxDuration = 60;
export const dynamic = "force-dynamic";

const ALERT_EMAIL = "bill@billricestrategy.com";

type HealthCheck = {
  name: string;
  ok: boolean;
  detail: string;
  lastSeen?: string;
  ageDays?: number;
};

function getSanityClient() {
  const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
  const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";
  const token = (process.env.SANITY_API_TOKEN || "").trim();
  if (!projectId || !token) {
    throw new Error("Missing NEXT_PUBLIC_SANITY_PROJECT_ID or SANITY_API_TOKEN");
  }
  return createClient({
    projectId,
    dataset,
    apiVersion: "2026-03-14",
    token,
    useCdn: false,
  });
}

function daysBetween(fromIso: string, to: Date): number {
  const from = new Date(fromIso).getTime();
  return Math.round((to.getTime() - from) / 86400000);
}

// Benchmark freshness is a *content* signal about the Lead Price Index study,
// not a health signal about the marketwatch cron. Those came apart when the
// cron deliberately stopped synthesizing benchmarks (single-provider LLM
// guesses were polluting the public index — see app/api/cron/marketwatch, and
// note upsertPriceBenchmarks now has no callers). Nothing writes priceBenchmark
// on a schedule any more; the study is published by hand.
//
// The old check asserted a 35-day bound and blamed the cron by name when it
// tripped. Since the last study landed 2026-06-01 that fired every single day,
// and the accusation was false every time — the cron ran fine on 2026-08-01
// (scanned=15 changed=13 pricingSignals=7). It got recorded in BACKLOG.md as
// "marketwatch cron failing since ~2026-08-01", which it never was. A monitor
// that names the wrong culprit is worse than no monitor.
//
// So: measure the study on the study's own quarterly cadence, and let the
// marketwatch heartbeat below be the only thing that speaks for the cron.
const PRICE_INDEX_MAX_AGE_DAYS = 100;

async function checkPriceIndexStudy(
  client: ReturnType<typeof getSanityClient>,
  now: Date
): Promise<HealthCheck> {
  const latest = await client.fetch<{ _updatedAt: string } | null>(
    `*[_type == "priceBenchmark"] | order(_updatedAt desc)[0]{ _updatedAt }`
  );
  if (!latest) {
    return {
      name: "Lead Price Index study",
      ok: false,
      detail: "No priceBenchmark docs exist",
    };
  }
  const age = daysBetween(latest._updatedAt, now);
  const ok = age <= PRICE_INDEX_MAX_AGE_DAYS;
  return {
    name: "Lead Price Index study",
    ok,
    detail: ok
      ? `Latest benchmark published ${age}d ago`
      : `Benchmarks are ${age}d old — the quarterly Lead Price Index study is due. ` +
        `This is a human publishing task, not a cron failure; marketwatch only ` +
        `surfaces pricing signals to verify.`,
    lastSeen: latest._updatedAt,
    ageDays: age,
  };
}

// Only crons still scheduled in vercel.json are monitored. weekly-content,
// weekly-newsletter, seo-audit, and daily-performance were decommissioned
// 2026-07-02 (superseded by the consolidated BRSG Portfolio Performance
// Report in billricestrategy.com) — their routes remain but are unscheduled,
// so a staleness check would alert forever.
const MONITORED_CRONS = ["marketwatch", "als-email-report", "gsc-trend", "als-lifecycle"] as const satisfies readonly CronName[];
const CRON_STALENESS: Record<(typeof MONITORED_CRONS)[number], { maxDays: number; label: string }> = {
  "marketwatch": { maxDays: 35, label: "Marketwatch cron" },
  "als-email-report": { maxDays: 8, label: "ALS email report cron" },
  // Runs daily; a 2-day gap means it stalled. This is the tripwire that would
  // have caught the 2026-06 Vercel WIF break (froze gsc-trend 4 days, silent).
  "gsc-trend": { maxDays: 2, label: "GSC trend snapshot cron" },
  // Runs daily and is the only cron that mails the buyer list. A stalled run is
  // invisible from the outside — no bounce, no error, just no revenue — which
  // is how the replenishment track sat starved through August.
  "als-lifecycle": { maxDays: 2, label: "ALS lifecycle cron" },
};

async function checkCronHeartbeats(
  client: ReturnType<typeof getSanityClient>,
  now: Date
): Promise<HealthCheck[]> {
  const heartbeats = await client.fetch<
    { name: CronName; status: string; ranAt: string; detail: string }[]
  >(`*[_type == "cronHeartbeat"]{ name, status, ranAt, detail }`);
  const byName = new Map(heartbeats.map((h) => [h.name, h]));
  const results: HealthCheck[] = [];
  for (const name of MONITORED_CRONS) {
    const { maxDays, label } = CRON_STALENESS[name];
    const hb = byName.get(name);
    if (!hb) {
      results.push({
        name: label,
        ok: false,
        detail: `No heartbeat recorded yet — cron has never run or can't write to Sanity`,
      });
      continue;
    }
    const age = daysBetween(hb.ranAt, now);
    const stale = age > maxDays;
    const failed = hb.status === "failed";
    const ok = !stale && !failed;
    let detail: string;
    if (stale) {
      detail = `Last run ${age}d ago (threshold ${maxDays}d) — cron may have stopped firing. Last status: ${hb.status}`;
    } else if (failed) {
      detail = `Last run failed ${age}d ago: ${hb.detail?.slice(0, 200) || "(no detail)"}`;
    } else {
      detail = `Last run ${age}d ago [${hb.status}]: ${hb.detail?.slice(0, 120) || ""}`;
    }
    results.push({ name: label, ok, detail, lastSeen: hb.ranAt, ageDays: age });
  }
  return results;
}

function buildAlertEmail(checks: HealthCheck[], now: Date): string {
  const failing = checks.filter((c) => !c.ok);
  const rows = checks
    .map(
      (c) => `
      <tr>
        <td style="padding: 10px 12px; border-bottom: 1px solid #e5e7eb; font-weight: 600;">
          <span style="display: inline-block; width: 10px; height: 10px; border-radius: 50%; background: ${c.ok ? "#10b981" : "#dc2626"}; margin-right: 8px;"></span>${c.name}
        </td>
        <td style="padding: 10px 12px; border-bottom: 1px solid #e5e7eb; color: ${c.ok ? "#1f2937" : "#991b1b"};">${c.detail}</td>
      </tr>`
    )
    .join("");

  const bannerColor = failing.length > 0 ? "#dc2626" : "#166534";
  const bannerLabel =
    failing.length > 0
      ? `${failing.length} cron health check${failing.length > 1 ? "s" : ""} failing`
      : "All automations healthy";

  return `<!DOCTYPE html>
<html><head><meta charset="utf-8"></head>
<body style="font-family: -apple-system, sans-serif; color: #1f2937; max-width: 640px; margin: 0 auto; padding: 20px;">
  <div style="background: linear-gradient(135deg, ${bannerColor}, #1B4D3E); color: white; padding: 24px; border-radius: 12px; margin-bottom: 20px;">
    <h1 style="margin: 0 0 4px; font-size: 22px;">Work Aged Leads Cron Health</h1>
    <p style="margin: 0; opacity: 0.95;">${bannerLabel}</p>
    <p style="margin: 8px 0 0; opacity: 0.7; font-size: 13px;">${now.toISOString()}</p>
  </div>
  <table style="width: 100%; border-collapse: collapse; background: white; border-radius: 8px; overflow: hidden; border: 1px solid #e5e7eb;">
    ${rows}
  </table>
  <p style="color: #9ca3af; font-size: 12px; margin-top: 24px;">This alert fires daily at 13:00 UTC. You only receive an email when something is failing.</p>
</body></html>`;
}

export async function GET(request: Request) {
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const startTime = Date.now();
  const now = new Date();
  const client = getSanityClient();

  const [contentChecks, heartbeatChecks] = await Promise.all([
    Promise.all([checkPriceIndexStudy(client, now)]),
    checkCronHeartbeats(client, now),
  ]);

  const checks = [...contentChecks, ...heartbeatChecks];
  const failing = checks.filter((c) => !c.ok);

  if (failing.length > 0) {
    const apiKey = process.env.RESEND_API_KEY;
    const fromEmail =
      process.env.RESEND_FROM_EMAIL || "AgedLeadSales <noreply@agedleadsales.com>";
    if (apiKey) {
      try {
        const resend = new Resend(apiKey);
        await resend.emails.send({
          from: fromEmail,
          to: ALERT_EMAIL,
          subject: `[ALERT] ${failing.length} Work Aged Leads cron${failing.length > 1 ? "s" : ""} failing`,
          html: buildAlertEmail(checks, now),
        });
      } catch (err) {
        console.error("[Health] Failed to send alert email:", err);
      }
    }
  }

  await recordCronRun({
    name: "health-check",
    status: failing.length === 0 ? "ok" : "partial",
    detail: failing.length === 0 ? "all checks passing" : `${failing.length} failing`,
    durationMs: Date.now() - startTime,
  });

  return NextResponse.json({
    ok: failing.length === 0,
    checks,
    timestamp: now.toISOString(),
  });
}
