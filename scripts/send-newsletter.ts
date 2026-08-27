/**
 * Send an already-drafted, already-reviewed weekly newsletter.
 *
 * This is the deliberate human half of the newsletter split. The Sunday cron
 * (`app/api/cron/weekly-newsletter/route.ts`) drafts the issue, emails Bill a
 * preview, and archives the rendered HTML — it cannot mail the list. This
 * script is the only thing that can, and it only ever sends bytes that were
 * archived and reviewed.
 *
 * WHY IT SENDS THE ARCHIVE INSTEAD OF REGENERATING
 *
 * The copy is AI-drafted. Regenerating at send time would produce a different
 * issue than the one Bill approved, which would make the review gate
 * decorative. The archived `.html` is the contract: what was previewed is what
 * ships.
 *
 * Usage:
 *   npm run newsletter:send -- --date 2026-08-10                      # dry run
 *   npm run newsletter:send -- --date 2026-08-10 --seed me@x.com      # one test copy
 *   npm run newsletter:send -- --date 2026-08-10 --confirm            # send to the list
 *
 * Required env (loaded from .env.local):
 *   RESEND_API_KEY, RESEND_AUDIENCE_ID, RESEND_FROM_EMAIL
 *
 * Run `npm run newsletter:migrate -- --apply` first. The consolidated audience
 * does not self-update: new buyers land in the ALS source audiences daily and
 * only reach the broadcast list when that merge runs. Skipping it silently
 * mails a stale list — roughly 65 buyers/week go missing.
 */

import { config as loadEnv } from "dotenv";
loadEnv({ path: ".env.local" });
loadEnv();

import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { join } from "node:path";
import {
  createAndSendBroadcast,
  fetchAudienceContacts,
  sendSingleEmail,
  REPLY_TO_EMAIL,
} from "../lib/resend";

const ARCHIVE_DIR = join(process.cwd(), "data", "newsletter-archive");

/** A send that reaches fewer than this many people means the audience id is
 * wrong or the merge never ran. Refuse rather than burn the issue on a stub. */
const MIN_EXPECTED_RECIPIENTS = 500;

interface ArchivedIssue {
  weekOf: string;
  subject: string;
  previewText: string;
  sent?: boolean;
  sentAt?: string;
  broadcastId?: string;
  killed?: boolean;
  killedAt?: string;
  killedReason?: string;
}

function flag(args: string[], name: string): string | undefined {
  const i = args.indexOf(name);
  return i >= 0 ? args[i + 1] : undefined;
}

async function main() {
  const args = process.argv.slice(2);
  const date = flag(args, "--date");
  const seed = flag(args, "--seed");
  const confirm = args.includes("--confirm");

  if (!date || !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    console.error("Usage: npm run newsletter:send -- --date YYYY-MM-DD [--seed you@example.com] [--confirm]");
    process.exit(1);
  }

  const jsonPath = join(ARCHIVE_DIR, `${date}.json`);
  const htmlPath = join(ARCHIVE_DIR, `${date}.html`);
  if (!existsSync(jsonPath) || !existsSync(htmlPath)) {
    console.error(
      `No archived issue for ${date}.\nExpected:\n  ${jsonPath}\n  ${htmlPath}\n\n` +
        `The Sunday cron writes these. Run it first, or pick a date that exists.`,
    );
    process.exit(1);
  }

  const issue = JSON.parse(readFileSync(jsonPath, "utf8")) as ArchivedIssue;
  const html = readFileSync(htmlPath, "utf8");

  // A retired issue. Distinct from `sent`: this one never went out and never
  // should. An archived draft looks sendable forever — the date is the only
  // thing that ages, and nothing in the file records that a human read it and
  // said no. Without this flag the natural recovery from "which issue do I
  // send?" is to reach for the newest archive, which is exactly the mistake.
  if (issue.killed) {
    console.error(
      `Issue ${date} was retired${issue.killedAt ? ` on ${issue.killedAt.slice(0, 10)}` : ""} and must not be sent.\n` +
        `${issue.killedReason ? `Reason: ${issue.killedReason}\n` : ""}` +
        `Draft a new issue rather than reviving this one.`,
    );
    process.exit(1);
  }

  // Idempotence. Resend will happily create a second broadcast over the same
  // audience, and the subscribers are the ones who notice.
  if (issue.sent) {
    console.error(
      `Issue ${date} was already sent${issue.sentAt ? ` at ${issue.sentAt}` : ""}` +
        `${issue.broadcastId ? ` (broadcast ${issue.broadcastId})` : ""}.\n` +
        `Refusing to send it twice. Delete the "sent" flag in ${jsonPath} if this is truly intended.`,
    );
    process.exit(1);
  }

  const apiKey = (process.env.RESEND_API_KEY || "").trim();
  const audienceId = (process.env.RESEND_AUDIENCE_ID || "").trim();
  const fromEmail = (process.env.RESEND_FROM_EMAIL || "").trim();
  for (const [name, value] of [
    ["RESEND_API_KEY", apiKey],
    ["RESEND_AUDIENCE_ID", audienceId],
    ["RESEND_FROM_EMAIL", fromEmail],
  ] as const) {
    if (!value) {
      console.error(`${name} is not set (looked in .env.local and .env).`);
      process.exit(1);
    }
  }

  console.log(`Issue    : ${date}`);
  console.log(`Subject  : ${issue.subject}`);
  console.log(`From     : ${fromEmail}`);
  console.log(`Reply-to : ${REPLY_TO_EMAIL}`);
  console.log(`HTML     : ${(html.length / 1024).toFixed(1)} KB`);

  // ── Seed send: one real copy, no audience involved ──────────
  if (seed) {
    if (!confirm) {
      console.log(`\nWould send ONE seed copy to ${seed}. Re-run with --confirm.`);
      return;
    }
    const { id } = await sendSingleEmail(apiKey, {
      from: fromEmail,
      to: [seed],
      subject: `[SEED] ${issue.subject}`,
      html,
      replyTo: REPLY_TO_EMAIL,
    });
    console.log(`\nSeed sent to ${seed} (${id}). The archive is untouched — this does not count as the send.`);
    return;
  }

  // ── Real send ───────────────────────────────────────────────
  const contacts = await fetchAudienceContacts(apiKey, audienceId);
  const mailable = contacts.filter((c) => !c.unsubscribed).length;
  console.log(`Audience : ${audienceId}`);
  console.log(`Recipients: ${mailable} mailable of ${contacts.length} (${contacts.length - mailable} suppressed)`);

  if (mailable < MIN_EXPECTED_RECIPIENTS) {
    console.error(
      `\nOnly ${mailable} mailable contacts — below the ${MIN_EXPECTED_RECIPIENTS} floor.\n` +
        `That usually means RESEND_AUDIENCE_ID points at the wrong list. Refusing to send.`,
    );
    process.exit(1);
  }

  if (!confirm) {
    console.log(`\nDry run — nothing sent. Re-run with --confirm to mail ${mailable} subscribers.`);
    console.log(`Tip: send yourself a copy first with --seed you@example.com --confirm`);
    return;
  }

  const { broadcastId } = await createAndSendBroadcast(apiKey, {
    audienceId,
    from: fromEmail,
    subject: issue.subject,
    html,
    previewText: issue.previewText,
    name: `Weekly Newsletter — ${date}`,
    replyTo: REPLY_TO_EMAIL,
  });

  const sentAt = new Date().toISOString();
  writeFileSync(
    jsonPath,
    JSON.stringify({ ...issue, sent: true, sentAt, broadcastId }, null, 2) + "\n",
  );

  console.log(`\nSent. Broadcast ${broadcastId} → ${mailable} subscribers.`);
  console.log(`Marked ${date}.json as sent — commit it so the flag survives.`);
}

main().catch((err) => {
  console.error(err instanceof Error ? err.message : err);
  process.exit(1);
});
