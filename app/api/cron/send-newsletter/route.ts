import { NextResponse } from "next/server";
import {
  createAndSendBroadcast,
  fetchAudienceContacts,
  REPLY_TO_EMAIL,
} from "@/lib/resend";
import { checkIssueHtml } from "@/lib/newsletter/issue-gate";
import { readIssue, readIssueHtml, archivePaths } from "@/lib/newsletter/archive-github";
import { commitFilesToGitHub } from "@/lib/cron/git-commit";

/**
 * The Tuesday sender — the second half of the opt-out review window.
 *
 * HOW THE WINDOW WORKS (Bill's decision, 2026-09-02)
 *
 *   Sunday 14:00 UTC  weekly-newsletter drafts the issue, archives it, and
 *                     emails Bill a preview carrying a one-click STOP link.
 *   ~43 hours pass.   Bill does nothing if he is happy. If he is not, one click
 *                     sets `killed: true` in the archive.
 *   Tuesday 13:00 UTC this route sends whatever is archived and not killed.
 *
 * So the normal case is hands-off and the veto costs one click. That is the
 * whole design: a review gate nobody uses becomes a rubber stamp, and a gate
 * that requires a terminal on a Sunday evening does not get used at all.
 *
 * WHAT THIS ROUTE REFUSES TO DO
 *
 * It cannot generate copy. It only mails bytes that were archived on Sunday and
 * that Bill had a window to stop. If regeneration happened here, the issue that
 * shipped would not be the issue that was previewed and the window would be
 * decorative.
 *
 * Every guard from `scripts/send-newsletter.ts` is repeated here deliberately —
 * killed, already-sent, the price gate re-run on the actual bytes, and the
 * recipient floor. This is now the path that mails the list most weeks, so it
 * cannot be the weaker of the two. The gate in particular is re-run against the
 * bytes about to be transmitted rather than trusted from Sunday: the 2026-08-10
 * issue quoted "$0.25" against a real $0.40 floor and reached the list because
 * the guard sat on the authoring path instead of the sending one.
 *
 * Reads the archive from GitHub, never the bundle — see lib/newsletter/
 * archive-github.ts. A kill committed on Monday must be visible on Tuesday even
 * if no redeploy happened in between, or the kill switch is a lie.
 */

export const dynamic = "force-dynamic";
export const maxDuration = 60;

/** Below this, the audience id is wrong or the merge never ran. Refuse. */
const MIN_EXPECTED_RECIPIENTS = 500;

/** The Tuesday this run is for, in UTC. */
function todayUtc(): string {
  return new Date().toISOString().slice(0, 10);
}

export async function GET(request: Request) {
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const url = new URL(request.url);
  // `?date=` is for replaying a specific issue by hand. `?dryRun=1` reports what
  // would happen and mails nothing — the only safe way to exercise this route.
  const date = url.searchParams.get("date") ?? todayUtc();
  const dryRun = url.searchParams.get("dryRun") === "1";

  const log: string[] = [];
  const skip = (reason: string) => {
    log.push(reason);
    console.log(`[SendCron] ${reason}`);
    return NextResponse.json({ ok: true, sent: false, date, reason, log });
  };

  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    return NextResponse.json({ error: "date must be YYYY-MM-DD" }, { status: 400 });
  }

  let issue, html;
  try {
    [issue, html] = await Promise.all([readIssue(date), readIssueHtml(date)]);
  } catch (err) {
    const msg = `Archive read failed: ${err instanceof Error ? err.message : err}`;
    console.error(`[SendCron] ${msg}`);
    return NextResponse.json({ ok: false, sent: false, date, error: msg }, { status: 502 });
  }

  // No issue for this date is the ordinary case on 51 of 52 Tuesdays if the
  // calendar lapses, and on every non-Tuesday. Not an error.
  if (!issue || !html) {
    return skip(`No archived issue for ${date} — nothing to send.`);
  }
  if (issue.killed) {
    return skip(
      `Issue ${date} was stopped${issue.killedAt ? ` on ${issue.killedAt.slice(0, 10)}` : ""}` +
        `${issue.killedReason ? ` (${issue.killedReason})` : ""} — not sending.`,
    );
  }
  if (issue.sent) {
    return skip(
      `Issue ${date} was already sent${issue.sentAt ? ` at ${issue.sentAt}` : ""} — refusing to send twice.`,
    );
  }

  // Re-scan the bytes about to be mailed. Never trust Sunday's verdict.
  const gate = checkIssueHtml(html);
  if (!gate.ok) {
    const msg = `Issue ${date} FAILED the content gate at send time and was NOT sent: ${gate.reason}`;
    console.error(`[SendCron] ${msg}`);
    return NextResponse.json(
      { ok: false, sent: false, date, error: msg, blocking: gate.blocking },
      { status: 422 },
    );
  }
  for (const w of gate.warnings) log.push(`Warning: ${w}`);

  const apiKey = (process.env.RESEND_API_KEY || "").trim();
  const audienceId = (process.env.RESEND_AUDIENCE_ID || "").trim();
  const fromEmail = (process.env.RESEND_FROM_EMAIL || "").trim();
  if (!apiKey || !audienceId || !fromEmail) {
    return NextResponse.json(
      { ok: false, sent: false, date, error: "RESEND_API_KEY, RESEND_AUDIENCE_ID or RESEND_FROM_EMAIL missing" },
      { status: 500 },
    );
  }

  const contacts = await fetchAudienceContacts(apiKey, audienceId);
  const mailable = contacts.filter((c) => !c.unsubscribed).length;
  log.push(`Audience ${audienceId}: ${mailable} mailable of ${contacts.length}`);

  if (mailable < MIN_EXPECTED_RECIPIENTS) {
    const msg = `Only ${mailable} mailable contacts, below the ${MIN_EXPECTED_RECIPIENTS} floor — refusing. The audience id is probably wrong.`;
    console.error(`[SendCron] ${msg}`);
    return NextResponse.json({ ok: false, sent: false, date, error: msg, log }, { status: 500 });
  }

  if (dryRun) {
    return NextResponse.json({
      ok: true,
      sent: false,
      dryRun: true,
      date,
      subject: issue.subject,
      from: fromEmail,
      wouldMail: mailable,
      log,
    });
  }

  const { broadcastId } = await createAndSendBroadcast(apiKey, {
    audienceId,
    from: fromEmail,
    subject: issue.subject,
    html,
    previewText: issue.previewText,
    name: `${issue.campaign === "direct-offer" ? "Direct Offer" : "Weekly Newsletter"} — ${date}`,
    replyTo: REPLY_TO_EMAIL,
  });

  const sentAt = new Date().toISOString();

  // Commit the sent flag. If this fails the mail has ALREADY gone, so it is
  // reported loudly rather than swallowed: an unrecorded send is the one state
  // that could cause a duplicate next week.
  let flagCommitted = true;
  try {
    await commitFilesToGitHub(
      [
        {
          path: archivePaths.json(date),
          content:
            JSON.stringify({ ...issue, sent: true, sentAt, broadcastId, sentBy: "cron" }, null, 2) + "\n",
        },
      ],
      `chore(newsletter): auto-sent ${date} (broadcast ${broadcastId})`,
    );
  } catch (err) {
    flagCommitted = false;
    console.error(
      `[SendCron] SENT ${date} as ${broadcastId} but FAILED to record it: ${err instanceof Error ? err.message : err}. ` +
        `Set sent:true in the archive by hand — otherwise this issue can be mailed again.`,
    );
  }

  console.log(`[SendCron] Sent ${date} — broadcast ${broadcastId} to ${mailable}`);
  return NextResponse.json({
    ok: true,
    sent: true,
    date,
    broadcastId,
    recipients: mailable,
    sentAt,
    flagCommitted,
    log,
  });
}
