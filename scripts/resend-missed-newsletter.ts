/**
 * Schedule a newsletter issue that failed to send, for a later time.
 *
 * WHY (2026-09-15)
 *
 * The 2026-09-14 issue ("The Numbers Game") failed at its Tuesday 13:00 UTC
 * send with Resend 403 "You have reached your contacts quota". Bill upgraded
 * the plan and asked for it to go out the next morning. The send-newsletter
 * cron cannot do that: it sends immediately, and only for the current week's
 * label. Scheduling it inside Resend means the exact archived bytes go out at
 * the set time with nothing in our code needing to run, and it can be
 * cancelled by deleting the broadcast.
 *
 * THE ONE CHANGE TO THE ARCHIVED BYTES
 *
 * The issue was drafted Sunday 2026-09-13, before the CAN-SPAM postal-address
 * fix (15 U.S.C. § 7704(a)(5)(A)(iii)). This script inserts
 * `senderAddressHtml()` immediately before the footer's rebrand notice —
 * exactly where the current template places it — and refuses unless that
 * anchor appears exactly once. Nothing else in the issue changes.
 *
 * Every guard the send route applies is repeated: not sent, not killed, the
 * price gate re-run on the final bytes, and the recipient floor.
 *
 * NOTE: the archive on main still reads `sent: false` after this runs. The
 * scheduled broadcast is recorded in data/campaigns/ instead, because writing
 * the archive belongs on main. Do not replay this issue through the
 * send-newsletter route, or it mails twice.
 *
 * DRY RUN BY DEFAULT.
 *
 *   npx tsx scripts/resend-missed-newsletter.ts --date 2026-09-14 --at 2026-09-16T13:00:00Z
 *   npx tsx scripts/resend-missed-newsletter.ts --date 2026-09-14 --at 2026-09-16T13:00:00Z --apply
 */
import { config } from "dotenv";
config({ path: ".env.local", quiet: true } as never);

import { writeFileSync, existsSync, readFileSync, mkdirSync } from "node:fs";
import { join, dirname } from "node:path";

const APPLY = process.argv.includes("--apply");
const arg = (name: string) => {
  const i = process.argv.indexOf(name);
  return i !== -1 ? process.argv[i + 1] : undefined;
};
const DATE = arg("--date");
const AT = arg("--at");
const MIN_RECIPIENTS = 500;
const ANCHOR = "Work Aged Leads is the new home of";

async function main() {
  console.log(APPLY ? "=== APPLY ===" : "=== DRY RUN (--apply to schedule) ===");
  if (!DATE || !/^\d{4}-\d{2}-\d{2}$/.test(DATE)) throw new Error("--date YYYY-MM-DD required");
  if (!AT || Number.isNaN(Date.parse(AT))) throw new Error("--at ISO-8601 time required");

  // Env-reading modules load after dotenv — static imports would hoist above it.
  const { readIssue, readIssueHtml } = await import("../lib/newsletter/archive-github");
  const { checkIssueHtml } = await import("../lib/newsletter/issue-gate");
  const { senderAddressHtml, SENDER_POSTAL_ADDRESS } = await import("../lib/sender");
  const { fetchAudienceContacts, createScheduledBroadcast, getBroadcast, REPLY_TO_EMAIL } = await import("../lib/resend");

  const apiKey = (process.env.RESEND_API_KEY || "").trim();
  const segmentId = (process.env.RESEND_AUDIENCE_ID || "").trim();
  const from = (process.env.RESEND_FROM_EMAIL || "").trim();
  if (!apiKey || !segmentId || !from) throw new Error("RESEND_API_KEY, RESEND_AUDIENCE_ID or RESEND_FROM_EMAIL missing");

  const [issue, archivedHtml] = await Promise.all([readIssue(DATE), readIssueHtml(DATE)]);
  if (!issue || !archivedHtml) throw new Error(`No archived issue for ${DATE}`);
  if (issue.killed) throw new Error(`Issue ${DATE} was killed — refusing.`);
  if (issue.sent) throw new Error(`Issue ${DATE} is already marked sent — refusing to send twice.`);

  let html = archivedHtml;
  let inserted = false;
  if (!html.includes(SENDER_POSTAL_ADDRESS)) {
    const hits = html.split(ANCHOR).length - 1;
    if (hits !== 1) throw new Error(`Footer anchor found ${hits} times, expected exactly 1 — refusing to guess where the address goes.`);
    const at = html.lastIndexOf("<p", html.indexOf(ANCHOR));
    html = html.slice(0, at) + senderAddressHtml() + "\n                    " + html.slice(at);
    inserted = true;
  }

  const gate = checkIssueHtml(html);
  const contacts = await fetchAudienceContacts(apiKey, segmentId);
  const mailable = contacts.filter((c) => !c.unsubscribed).length;

  console.log(`issue      ${DATE} — ${issue.subject}`);
  console.log(`schedule   ${AT}`);
  console.log(`address    ${inserted ? "inserted before the footer notice" : "already present"}`);
  console.log(`gate       ${gate.ok ? "pass" : `BLOCKED — ${gate.reason}`}`);
  for (const w of gate.warnings) console.log(`warning    ${w}`);
  console.log(`recipients ${mailable} mailable`);

  if (!gate.ok) throw new Error("Content gate blocked the send.");
  if (mailable < MIN_RECIPIENTS) throw new Error(`Only ${mailable} mailable, below the ${MIN_RECIPIENTS} floor — wrong segment?`);

  const record = join(process.cwd(), "data", "campaigns", `newsletter-${DATE}-resend.json`);
  if (existsSync(record) && JSON.parse(readFileSync(record, "utf8")).broadcastId) {
    throw new Error(`A resend is already recorded in ${record} — refusing to schedule twice.`);
  }

  if (!APPLY) {
    console.log("\nnothing scheduled.");
    return;
  }

  const name = `Weekly Newsletter — ${DATE} (resend after quota failure)`;
  const { broadcastId } = await createScheduledBroadcast(apiKey, {
    segmentId,
    from,
    replyTo: REPLY_TO_EMAIL,
    subject: issue.subject,
    previewText: issue.previewText,
    html,
    name,
    scheduledAt: AT,
  });
  const back = await getBroadcast(apiKey, broadcastId);
  const ok =
    back.status === "scheduled" &&
    !!back.scheduled_at &&
    Date.parse(back.scheduled_at) === Date.parse(AT) &&
    (back.segment_id ?? back.audience_id) === segmentId;

  mkdirSync(dirname(record), { recursive: true });
  writeFileSync(
    record,
    JSON.stringify(
      {
        issue: DATE,
        subject: issue.subject,
        reason: "Original 2026-09-15 13:00 UTC send failed: Resend 403 contacts quota. Plan upgraded by Bill; resend requested for the next morning.",
        broadcastId,
        name,
        scheduledAt: AT,
        segmentId,
        mailableAtScheduling: mailable,
        addressInserted: inserted,
        verified: { status: back.status, scheduled_at: back.scheduled_at, segment: back.segment_id ?? back.audience_id },
        scheduledAtRun: new Date().toISOString(),
      },
      null,
      2,
    ) + "\n",
  );

  console.log(`\nscheduled ${broadcastId} — status=${back.status} time=${back.scheduled_at}`);
  if (!ok) throw new Error(`Broadcast ${broadcastId} did not verify — check it in the Resend dashboard.`);
  console.log(`verified. Record: ${record}`);
}

main()
  .then(() => process.exit(0))
  .catch((e) => {
    console.error("FAILED:", e instanceof Error ? e.message : e);
    process.exit(1);
  });
