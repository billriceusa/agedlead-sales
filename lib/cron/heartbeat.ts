import { createClient } from "next-sanity";

export type CronName =
  | "weekly-content"
  | "weekly-newsletter"
  | "daily-performance"
  | "seo-audit"
  | "marketwatch"
  | "health-check"
  | "als-email-report"
  | "gsc-trend"
  | "commission-report"
  | "als-lifecycle";

export type CronStatus = "ok" | "partial" | "failed";

function getSanityWriteClient() {
  const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
  const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";
  const token = (process.env.SANITY_API_TOKEN || "").trim();
  if (!projectId || !token) return null;
  return createClient({
    projectId,
    dataset,
    apiVersion: "2026-03-14",
    token,
    useCdn: false,
  });
}

export type HeartbeatPayload = {
  name: CronName;
  status: CronStatus;
  detail?: string;
  durationMs?: number;
};

export async function recordCronRun(payload: HeartbeatPayload): Promise<void> {
  const client = getSanityWriteClient();
  if (!client) {
    console.warn(`[Heartbeat] Sanity unavailable, cannot record ${payload.name}`);
    return;
  }
  try {
    await client.createOrReplace({
      _id: `heartbeat-${payload.name}`,
      _type: "cronHeartbeat",
      name: payload.name,
      status: payload.status,
      detail: payload.detail?.slice(0, 2000) ?? "",
      durationMs: payload.durationMs,
      ranAt: new Date().toISOString(),
    });
  } catch (err) {
    console.error(`[Heartbeat] Failed to record ${payload.name}:`, err);
  }
}
