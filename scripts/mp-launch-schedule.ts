/**
 * Test, then schedule, the mortgage protection launch emails.
 *
 * Three modes, safest first:
 *
 *   npx tsx scripts/mp-launch-schedule.ts            dry run — renders, gates, prints the plan
 *   npx tsx scripts/mp-launch-schedule.ts --test     sends BOTH to bill@billricestrategy.com only
 *   npx tsx scripts/mp-launch-schedule.ts --apply    schedules both broadcasts to the segment
 *
 * WHY SCHEDULED IN RESEND AND NOT A CRON
 *
 * Bill travels 2026-09-17 to 09-30 and both sends fall inside that. Scheduling
 * in Resend means the exact bytes he approved are the bytes that mail, nothing
 * in our code has to run while he is away, and either send can be cancelled by
 * deleting the broadcast in the Resend dashboard from a phone.
 *
 * --apply REFUSES unless
 * - the segment was built by scripts/mp-launch-segment.ts and its ID is pinned
 *   in data/campaigns/mortgage-protection-launch-2026-09.json;
 * - the segment holds between 2,000 and 3,200 contacts — the dry run counted
 *   2,951, so anything outside that band means the wrong segment or a broken
 *   build, and 2,951 or 6,208 people getting the wrong email is not recoverable;
 * - both emails pass the issue gate;
 * - broadcasts have not already been scheduled for this campaign.
 *
 * After scheduling it reads each broadcast back and fails loudly unless Resend
 * reports it scheduled, at the right time, to the right segment.
 */
import { config } from "dotenv";
config({ path: ".env.local", quiet: true } as never);

import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { join } from "node:path";
import { Resend } from "resend";
import type { LaunchEmail } from "../lib/newsletter/mortgage-protection-launch";

/**
 * Modules that read process.env AT IMPORT are loaded dynamically, inside main().
 *
 * Static imports are hoisted above the `config()` call, so lib/site-url.ts
 * evaluated before .env.local was loaded and froze its fallback — the RETIRED
 * agedleadsales.com — into every footer link. The 2026-09-15 test send to Bill
 * caught it; the local preview did not, because it passed the origin in by hand.
 */
async function loadModules() {
  const launch = await import("../lib/newsletter/mortgage-protection-launch");
  const gate = await import("../lib/newsletter/issue-gate");
  const resend = await import("../lib/resend");
  const als = await import("../lib/als/config");
  const site = await import("../lib/site-url");
  return { ...launch, ...gate, ...resend, ...als, ...site };
}

const CANONICAL_HOST = "workagedleads.com";

const MODE = process.argv.includes("--apply") ? "apply" : process.argv.includes("--test") ? "test" : "dry";
const RECORD = join(process.cwd(), "data", "campaigns", "mortgage-protection-launch-2026-09.json");
const TEST_TO = "bill@billricestrategy.com";
const SEND_HOUR_UTC = "13:00:00Z"; // 9am Eastern, matching the newsletter
const MIN_SEGMENT = 2000;
const MAX_SEGMENT = 3200;

const KEY = (process.env.RESEND_API_KEY || "").trim();

function scheduledAt(email: LaunchEmail): string {
  return `${email.label}T${SEND_HOUR_UTC}`;
}

function broadcastName(email: LaunchEmail): string {
  return `MP Launch — ${email.key === "announce" ? "Announcement" : "Reminder"} — ${email.label}`;
}

function readRecord(): Record<string, unknown> {
  return existsSync(RECORD) ? JSON.parse(readFileSync(RECORD, "utf8")) : {};
}

async function main() {
  console.log(`=== ${MODE.toUpperCase()} ===`);
  if (!KEY) throw new Error("RESEND_API_KEY missing");

  const {
    buildLaunchHtml,
    MP_LAUNCH_EMAILS,
    checkIssueHtml,
    createScheduledBroadcast,
    getBroadcast,
    ALS_LIFECYCLE_FROM,
    ALS_LIFECYCLE_REPLY_TO,
    SITE_URL,
  } = await loadModules();

  if (new URL(SITE_URL).hostname !== CANONICAL_HOST) {
    throw new Error(`Site URL resolved to ${SITE_URL}, not https://${CANONICAL_HOST} — refusing to render links to the wrong host.`);
  }
  console.log(`site       ${SITE_URL}`);

  const rendered = MP_LAUNCH_EMAILS.map((email: LaunchEmail) => {
    const html = buildLaunchHtml(email, SITE_URL);
    const gate = checkIssueHtml(html);
    return { email, html, gate };
  });

  for (const { email, html, gate } of rendered) {
    console.log(`\n${broadcastName(email)}`);
    console.log(`  subject    ${email.subject}`);
    console.log(`  preview    ${email.previewText}`);
    console.log(`  sends at   ${scheduledAt(email)}`);
    console.log(`  size       ${(html.length / 1024).toFixed(1)} KB`);
    console.log(`  gate       ${gate.ok ? "pass" : `BLOCKED — ${gate.reason}`}`);
    for (const w of gate.warnings) console.log(`  warning    ${w}`);
  }
  if (rendered.some((r) => !r.gate.ok)) throw new Error("An email failed the issue gate — nothing sent or scheduled.");

  const record = readRecord();
  console.log(`\nfrom       ${ALS_LIFECYCLE_FROM.replace(/<[^@>]+@/, "<…@")}`);
  console.log(`segment    ${record.segmentId ? `${record.segmentId} (${record.segmentCount ?? "?"} contacts)` : "not built yet — run scripts/mp-launch-segment.ts --apply"}`);

  if (MODE === "dry") {
    console.log("\nnothing sent.");
    return;
  }

  if (MODE === "test") {
    const resend = new Resend(KEY);
    for (const { email, html } of rendered) {
      // Transactional sends do not resolve {{{RESEND_UNSUBSCRIBE_URL}}}; only a
      // broadcast does. The test copy shows it literally, and says so.
      const banner = `<div style="background:#fefce8;border:2px solid #f59e0b;border-radius:8px;padding:12px 16px;margin:0 auto 16px;max-width:600px;font-family:-apple-system,sans-serif;font-size:13px;color:#78350f;">TEST — ${broadcastName(email)}. Scheduled for ${scheduledAt(email)} to the Life &amp; Final Expense segment once approved. The unsubscribe link only works in the real broadcast.</div>`;
      const { error } = await resend.emails.send({
        from: ALS_LIFECYCLE_FROM,
        replyTo: ALS_LIFECYCLE_REPLY_TO,
        to: TEST_TO,
        subject: `[TEST] ${email.subject}`,
        html: banner + html,
      });
      if (error) throw new Error(`Test send failed for ${email.key}: ${JSON.stringify(error)}`);
      console.log(`test sent: ${email.key} -> ${TEST_TO}`);
    }
    return;
  }

  // ─── apply ───
  const segmentId = record.segmentId as string | undefined;
  const segmentCount = Number(record.segmentCount);
  if (!segmentId) throw new Error("No pinned segment. Run scripts/mp-launch-segment.ts --apply first.");
  if (!(segmentCount >= MIN_SEGMENT && segmentCount <= MAX_SEGMENT)) {
    throw new Error(`Segment holds ${record.segmentCount} contacts, outside ${MIN_SEGMENT}–${MAX_SEGMENT} — refusing to schedule.`);
  }
  if (record.broadcasts) {
    throw new Error(
      "Broadcasts are already recorded for this campaign — refusing to schedule twice. " +
        "If they were deleted in Resend on purpose, remove the `broadcasts` key from the record first.",
    );
  }

  const results: Record<string, unknown>[] = [];
  for (const { email, html } of rendered) {
    const { broadcastId } = await createScheduledBroadcast(KEY, {
      segmentId,
      from: ALS_LIFECYCLE_FROM,
      replyTo: ALS_LIFECYCLE_REPLY_TO,
      subject: email.subject,
      previewText: email.previewText,
      html,
      name: broadcastName(email),
      scheduledAt: scheduledAt(email),
    });
    const back = await getBroadcast(KEY, broadcastId);
    const okStatus = back.status === "scheduled";
    const okTime = back.scheduled_at ? Date.parse(back.scheduled_at) === Date.parse(scheduledAt(email)) : false;
    const backSegment = back.segment_id ?? back.audience_id;
    const okSegment = backSegment === segmentId;
    results.push({
      key: email.key,
      broadcastId,
      name: broadcastName(email),
      scheduledAt: scheduledAt(email),
      verified: { status: back.status, scheduled_at: back.scheduled_at, segment: backSegment },
    });
    console.log(`scheduled ${email.key}: ${broadcastId} — status=${back.status} time=${okTime ? "ok" : back.scheduled_at} segment=${okSegment ? "ok" : backSegment}`);
    if (!okStatus || !okTime || !okSegment) {
      writeFileSync(RECORD, JSON.stringify({ ...readRecord(), broadcasts: results }, null, 2) + "\n");
      throw new Error(`Broadcast ${broadcastId} did not verify. Check it in the Resend dashboard before anything else.`);
    }
  }

  writeFileSync(
    RECORD,
    JSON.stringify({ ...readRecord(), broadcasts: results, scheduledAtRun: new Date().toISOString() }, null, 2) + "\n",
  );
  console.log(`\nboth scheduled and verified. Record: ${RECORD}`);
}

main()
  .then(() => process.exit(0))
  .catch((e) => {
    console.error("FAILED:", e instanceof Error ? e.message : e);
    process.exit(1);
  });
