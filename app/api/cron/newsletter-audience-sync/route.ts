import { NextResponse } from "next/server";
import { recordCronRun, type CronStatus } from "@/lib/cron/heartbeat";
import { applyWrites, loadSyncPlan, resendWriter } from "@/lib/newsletter-audience/sync";

/**
 * Daily: fold new signups and ALS buyers into the Work Aged Leads list.
 *
 * Until 2026-10-13 this was `npm run newsletter:migrate -- --apply`, run by
 * hand. The Tuesday send had been automatic since 2026-09-02 but this step was
 * not, so every week it was skipped, new buyers missed the issue — and, worse,
 * people who opted out on an ALS list stayed sendable here. The first catch-up
 * run on 2026-10-13 found 352 contacts missing and 28 opt-outs not honored.
 * Bill decided the same day that new buyers should be added automatically.
 *
 * Runs daily rather than weekly so each run is small (the ALS harvest adds
 * buyers daily) and a failed day costs one day, not one issue.
 *
 * WHAT IT WILL NOT DO
 *
 * - Resubscribe anyone. `planWrites` only creates or suppresses; a contact
 *   opted out on the target is left alone (see lib/newsletter-audience/merge.ts).
 * - Run without the Postgres opt-out set. `loadSyncPlan` throws instead.
 * - Apply an unexpectedly large batch. Above MAX_CREATES_PER_RUN the source
 *   config is probably wrong (a wrong audience id looks like thousands of new
 *   people). It refuses, records `failed`, and waits for a person to run the
 *   script by hand and read the plan.
 */

export const dynamic = "force-dynamic";
export const maxDuration = 300;

/** A normal day is tens of creates. The 2026-10-13 backlog was 352. */
const MAX_CREATES_PER_RUN = 1000;
/** Cap per run; anything past it is tomorrow's diff. */
const MAX_WRITES_PER_RUN = 600;
/** Stop writing with a minute to spare before maxDuration. */
const WRITE_BUDGET_MS = 240_000;

export async function GET(request: Request) {
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const startedAt = Date.now();
  const dryRun = new URL(request.url).searchParams.get("dryRun") === "1";

  // A dry run records nothing, so a manual probe cannot hide a stalled cron.
  const beat = async (status: CronStatus, detail: string) => {
    if (dryRun) return;
    await recordCronRun({
      name: "newsletter-audience-sync",
      status,
      detail,
      durationMs: Date.now() - startedAt,
    });
  };

  const apiKey = (process.env.RESEND_API_KEY || "").trim();
  const databaseUrl = (process.env.DATABASE_URL || "").trim();
  if (!apiKey) {
    await beat("failed", "RESEND_API_KEY missing");
    return NextResponse.json({ ok: false, error: "RESEND_API_KEY missing" }, { status: 500 });
  }

  let plan;
  try {
    plan = await loadSyncPlan({ apiKey, databaseUrl });
  } catch (err) {
    const msg = `Plan failed: ${err instanceof Error ? err.message : err}`;
    console.error(`[AudienceSync] ${msg}`);
    await beat("failed", msg);
    return NextResponse.json({ ok: false, error: msg }, { status: 500 });
  }

  const { summary, actions } = plan;
  const planText = `plan: ${summary.create} create, ${summary.suppress} suppress, ${summary.unchanged} unchanged`;

  if (summary.create > MAX_CREATES_PER_RUN) {
    const msg =
      `${planText} — ${summary.create} creates is above the ${MAX_CREATES_PER_RUN} limit, refusing. ` +
      `A source audience id is probably wrong. Run \`npm run newsletter:migrate\` and read the plan.`;
    console.error(`[AudienceSync] ${msg}`);
    await beat("failed", msg);
    return NextResponse.json({ ok: false, error: msg, summary }, { status: 422 });
  }

  if (dryRun || (summary.create === 0 && summary.suppress === 0)) {
    const detail = summary.create === 0 && summary.suppress === 0 ? "in sync, nothing to write" : planText;
    await beat("ok", detail);
    return NextResponse.json({ ok: true, dryRun, summary, detail });
  }

  let result;
  try {
    result = await applyWrites(actions, resendWriter(apiKey, plan.target.id), {
      maxWrites: MAX_WRITES_PER_RUN,
      deadline: startedAt + WRITE_BUDGET_MS,
    });
  } catch (err) {
    // A write threw partway. Everything before it landed; the next run's diff
    // picks up the rest. Recorded as failed so a repeat failure is seen.
    const msg = `Write failed: ${err instanceof Error ? err.message : err}`;
    console.error(`[AudienceSync] ${msg}`);
    await beat("failed", `${planText}; ${msg}`);
    return NextResponse.json({ ok: false, error: msg, summary }, { status: 500 });
  }

  const detail =
    `${result.created} created, ${result.suppressed} suppressed` +
    (result.remaining ? `; ${result.remaining} left for the next run (${result.stoppedBy})` : "");
  console.log(`[AudienceSync] ${detail}`);
  // `partial` when writes were left over: harmless once, a problem if it
  // repeats, because it means the daily volume outruns one run.
  await beat(result.remaining ? "partial" : "ok", detail);

  return NextResponse.json({ ok: true, summary, ...result });
}
