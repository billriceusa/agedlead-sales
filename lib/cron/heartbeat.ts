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
  | "als-lifecycle"
  | "send-newsletter";

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

/**
 * Turn a thrown value into a heartbeat-safe one-liner.
 *
 * Written after the 2026-09-04 als-lifecycle failure, where the detail field
 * was actively unhelpful in two ways. Drizzle wraps a query error so that
 * `.message` opens with `Failed query: <sql>\nparams: <every bound value>` and
 * keeps the real Postgres error in `.cause`. So the 2000-char cap below spent
 * its whole budget on SQL and parameters and truncated the one sentence that
 * said what went wrong — and the parameters were 111 customer email addresses,
 * which then sat in a Sanity document.
 *
 * Cause first, no params, hard cap. A heartbeat is a diagnosis, not a dump.
 */
export function describeError(err: unknown): string {
  const cause = (err as { cause?: unknown })?.cause;
  const causeMessage =
    cause instanceof Error ? cause.message : typeof cause === "string" ? cause : "";

  const own = err instanceof Error ? err.message : String(err);

  // Drop drizzle's SQL/params dump, keeping any prose that precedes it.
  const ownSummary = own.split(/\n?(?:Failed query:|params:)/)[0].trim();

  const parts = [causeMessage.trim(), ownSummary].filter(Boolean);
  const seen = new Set<string>();
  const message = parts.filter((p) => !seen.has(p) && seen.add(p)).join(" — ");

  return (message || "unknown error").slice(0, 300);
}

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
