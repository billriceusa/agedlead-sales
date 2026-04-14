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

async function checkWeeklyContent(client: ReturnType<typeof getSanityClient>, now: Date): Promise<HealthCheck> {
  const latest = await client.fetch<{ _createdAt: string; title: string } | null>(
    `*[_type == "post"] | order(_createdAt desc)[0]{ _createdAt, title }`
  );
  if (!latest) {
    return { name: "Weekly content", ok: false, detail: "No posts exist in Sanity" };
  }
  const age = daysBetween(latest._createdAt, now);
  const ok = age <= 10;
  return {
    name: "Weekly content",
    ok,
    detail: ok
      ? `Latest post "${latest.title}" created ${age}d ago`
      : `Latest post was ${age}d ago — weekly cron may have failed. Title: "${latest.title}"`,
    lastSeen: latest._createdAt,
    ageDays: age,
  };
}

async function checkMarketwatch(client: ReturnType<typeof getSanityClient>, now: Date): Promise<HealthCheck> {
  const latest = await client.fetch<{ _updatedAt: string } | null>(
    `*[_type == "priceBenchmark"] | order(_updatedAt desc)[0]{ _updatedAt }`
  );
  if (!latest) {
    return { name: "Marketwatch benchmarks", ok: false, detail: "No priceBenchmark docs exist" };
  }
  const age = daysBetween(latest._updatedAt, now);
  const ok = age <= 35;
  return {
    name: "Marketwatch benchmarks",
    ok,
    detail: ok
      ? `Latest benchmark updated ${age}d ago`
      : `Benchmarks are ${age}d old — monthly marketwatch cron may have failed`,
    lastSeen: latest._updatedAt,
    ageDays: age,
  };
}

const CRON_STALENESS: Record<CronName, { maxDays: number; label: string }> = {
  "weekly-content": { maxDays: 8, label: "Weekly content cron" },
  "weekly-newsletter": { maxDays: 8, label: "Weekly newsletter cron" },
  "daily-performance": { maxDays: 2, label: "Daily performance cron" },
  "seo-audit": { maxDays: 8, label: "SEO audit cron" },
  "marketwatch": { maxDays: 35, label: "Marketwatch cron" },
  "health-check": { maxDays: 2, label: "Health-check cron" },
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
  const cronsToCheck: CronName[] = [
    "weekly-content",
    "weekly-newsletter",
    "daily-performance",
    "seo-audit",
    "marketwatch",
  ];
  for (const name of cronsToCheck) {
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
    <h1 style="margin: 0 0 4px; font-size: 22px;">AgedLeadSales Cron Health</h1>
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
    Promise.all([checkWeeklyContent(client, now), checkMarketwatch(client, now)]),
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
          subject: `[ALERT] ${failing.length} AgedLeadSales cron${failing.length > 1 ? "s" : ""} failing`,
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
