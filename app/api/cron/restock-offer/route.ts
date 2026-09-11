import { NextResponse } from "next/server";
import { Resend } from "resend";
import {
  createAndSendBroadcast,
  fetchAudienceContacts,
  REPLY_TO_EMAIL,
} from "@/lib/resend";
import { checkIssueHtml } from "@/lib/newsletter/issue-gate";
import { readIssue, readIssueHtml, archivePaths } from "@/lib/newsletter/archive-github";
import { commitFilesToGitHub } from "@/lib/cron/git-commit";
import { recordCronRun, type CronStatus } from "@/lib/cron/heartbeat";
import { killUrl } from "@/lib/newsletter/kill-token";
import {
  buildRestockHtml,
  editionFor,
  firstSundayLabel,
  hoursSinceDraft,
  RESTOCK_CAMPAIGN,
} from "@/lib/newsletter/restock-offer";

/**
 * The monthly restock offer — draft, review window, send.
 *
 * WHY THIS EXISTS
 *
 * The only things that ever asked a reader to buy again were the per-person
 * journeys in lib/als/lifecycle.ts, and those are one-shot: a contact walks
 * `replenishment` once and `winback` once, and after that nothing puts the
 * store in front of them ever again. Store-side GA4 says that is precisely the
 * wrong group to go quiet on — returning buyers landing on the storefront's
 * login page out-earned all of our cold affiliate traffic by better than ten to
 * one over Aug 1 to Sep 10, on half the sessions.
 *
 * ONE ROUTE, TWO MODES
 *
 * `?mode=draft` builds the month's edition, runs the price gate, archives it,
 * and emails Bill a preview carrying a one-click STOP link. It cannot send to
 * the list — there is no broadcast call on that path at all, the same
 * structural separation `weekly-newsletter` has.
 *
 * `?mode=send` mails whatever is archived, unkilled and unsent, and only once
 * the review window has actually elapsed. It cannot generate copy. If it could,
 * the bytes that shipped would not be the bytes Bill had a window to stop, and
 * the window would be decorative.
 *
 * THE SCHEDULE
 *
 *   first Sunday, 14:00 UTC   draft + preview to Bill
 *   ~4 days pass              he does nothing if he is happy
 *   Thursday, 13:00 UTC       this sends it
 *
 * Both crons fire weekly and decide in code, because cron cannot express "first
 * Sunday of the month" — day-of-month and day-of-week are OR'd, not AND'd, so
 * `0 14 1-7 * 0` would fire far more often than intended. Off-week runs no-op.
 *
 * WHY THURSDAY AND A SEPARATE ARCHIVE
 *
 * The newsletter owns Tuesday and `data/newsletter-archive`. Sharing either
 * would mean one silently overwriting the other, and would average two very
 * different sends into one trend line. The offer gets Thursday and
 * `data/offer-archive`, and its own `restock-offer` campaign, so its
 * performance can be read on its own.
 *
 * THE SEND IS SELF-HEALING. It recomputes the month's label rather than
 * remembering one, so a Thursday that runs after a failed or late draft simply
 * finds nothing and no-ops, and the next Thursday in the same month picks up a
 * draft that landed in between. It refuses to send twice because the archive
 * records `sent`.
 */

export const dynamic = "force-dynamic";
export const maxDuration = 60;

const REVIEW_EMAIL = "bill@billricestrategy.com";

/** Below this, the audience id is wrong or the merge never ran. Refuse. */
const MIN_EXPECTED_RECIPIENTS = 500;

/**
 * How long after the draft the send is allowed to fire, in hours.
 *
 * The point of the window is that Bill gets a genuine chance to stop it. A send
 * that could fire hours after the draft would make the STOP link a formality,
 * which is the failure mode the newsletter's Sunday-to-Tuesday gap was built to
 * avoid after auto-send once mailed a "preview" and the broadcast in one run.
 */
const REVIEW_WINDOW_HOURS = 48;

function getSiteUrl(): string {
  return process.env.NEXT_PUBLIC_SITE_URL || "https://agedleadsales.com";
}

export async function GET(request: Request) {
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const startedAt = Date.now();
  const url = new URL(request.url);
  const mode = url.searchParams.get("mode") === "send" ? "send" : "draft";
  const dryRun = url.searchParams.get("dryRun") === "1";
  // `?force=1` drafts off-schedule. Deliberately only affects the DRAFT path —
  // there is no flag anywhere here that shortens the review window.
  const force = url.searchParams.get("force") === "1";
  const now = new Date();
  const label = url.searchParams.get("date") ?? firstSundayLabel(now);

  if (!/^\d{4}-\d{2}-\d{2}$/.test(label)) {
    return NextResponse.json({ error: "date must be YYYY-MM-DD" }, { status: 400 });
  }

  // A dry run deliberately records nothing. A manual probe must not stamp the
  // heartbeat fresh and hide a genuinely stalled month.
  const beat = async (status: CronStatus, detail: string) => {
    if (dryRun) return;
    await recordCronRun({
      name: `restock-offer-${mode}`,
      status,
      detail: `${label}: ${detail}`,
      durationMs: Date.now() - startedAt,
    });
  };

  const log: string[] = [];
  const skip = async (reason: string) => {
    log.push(reason);
    console.log(`[Restock:${mode}] ${reason}`);
    // `ok` on purpose: an off-week run, a killed offer and an already-sent
    // offer are all correct outcomes. The route ran and decided not to act.
    await beat("ok", reason);
    return NextResponse.json({ ok: true, mode, label, acted: false, reason, log });
  };

  const edition = editionFor(new Date(`${label}T12:00:00Z`));

  // ─────────────────────────────── DRAFT ────────────────────────────────
  if (mode === "draft") {
    const isDraftDay = label === firstSundayLabel(now) && now.toISOString().slice(0, 10) === label;
    if (!isDraftDay && !force) {
      return skip(
        `Not the first Sunday of the month (today is ${now.toISOString().slice(0, 10)}, ` +
          `this month's draft day is ${firstSundayLabel(now)}) — nothing to draft.`,
      );
    }

    const existing = await readIssue(label, "offer").catch(() => null);
    if (existing?.sent) {
      return skip(`Offer ${label} was already sent — refusing to redraft over a send.`);
    }
    if (existing && !force) {
      return skip(`Offer ${label} is already archived — not overwriting it.`);
    }

    const siteUrl = getSiteUrl();
    const html = buildRestockHtml(edition, label, siteUrl);

    // The price gate runs here AND again at send time. Here it decides whether
    // the archive is written killed; there it re-reads the actual bytes.
    const gate = checkIssueHtml(html);
    for (const w of gate.warnings) log.push(`Warning: ${w}`);

    const record = {
      weekOf: label,
      subject: edition.subject,
      previewText: edition.previewText,
      campaign: RESTOCK_CAMPAIGN,
      edition: edition.key,
      theme: edition.headline,
      killed: !gate.ok,
      ...(gate.ok
        ? {}
        : {
            killedAt: new Date().toISOString(),
            killedReason: `Quarantined by the content gate: ${gate.reason}`,
          }),
    };

    if (dryRun) {
      return NextResponse.json({
        ok: true,
        mode,
        label,
        dryRun: true,
        acted: false,
        edition: edition.key,
        subject: edition.subject,
        gateOk: gate.ok,
        bytes: html.length,
        log,
      });
    }

    try {
      await commitFilesToGitHub(
        [
          { path: archivePaths.json(label, "offer"), content: JSON.stringify(record, null, 2) + "\n" },
          { path: archivePaths.html(label, "offer"), content: html },
        ],
        `chore(offer): archive the ${label} restock offer (${edition.key})`,
      );
    } catch (err) {
      const msg = `Archive commit failed: ${err instanceof Error ? err.message : err}`;
      console.error(`[Restock:draft] ${msg}`);
      await beat("failed", msg);
      return NextResponse.json({ ok: false, mode, label, error: msg, log }, { status: 502 });
    }

    // Preview to Bill. A stop link that cannot be signed is reported as absent
    // rather than rendered dead — a dead link that looks live is worse than none.
    const stopLink = (() => {
      try {
        return killUrl(getSiteUrl(), label, "offer");
      } catch {
        return null;
      }
    })();

    const banner = gate.ok
      ? `<div style="background:#fefce8;border:2px solid #f59e0b;border-radius:8px;padding:16px;margin:0 auto 24px;max-width:600px;font-family:-apple-system,sans-serif;">
      <p style="margin:0 0 4px 0;font-weight:700;color:#92400e;">Restock offer — sends Thursday unless you stop it</p>
      <p style="margin:0 0 12px;color:#78350f;font-size:14px;">This is the monthly offer, edition <strong>${edition.key}</strong>. Do nothing and it goes to the whole list on Thursday. If it should not, use the button — one click, no login.</p>
      ${
        stopLink
          ? `<p style="margin:0;"><a href="${stopLink}" style="display:inline-block;background:#dc2626;color:#ffffff;padding:10px 20px;border-radius:6px;text-decoration:none;font-weight:700;font-size:14px;">Stop this offer</a></p>`
          : `<p style="margin:0;color:#991b1b;font-size:13px;font-weight:600;">No stop link — CRON_SECRET is not set on this deployment, so the token could not be signed. Kill it by hand if needed.</p>`
      }
    </div>`
      : `<div style="background:#fef2f2;border:2px solid #dc2626;border-radius:8px;padding:16px;margin:0 auto 24px;max-width:600px;font-family:-apple-system,sans-serif;">
      <p style="margin:0 0 4px 0;font-weight:700;color:#991b1b;">QUARANTINED — this offer cannot be sent</p>
      <p style="margin:0;color:#7f1d1d;font-size:14px;">It quotes a per-lead price (${gate.blocking.join(", ")}). The archive was written with <code>killed: true</code>, so Thursday's run will refuse it.</p>
    </div>`;

    const apiKey = (process.env.RESEND_API_KEY || "").trim();
    const fromEmail = (process.env.RESEND_FROM_EMAIL || "").trim();
    let previewSent = false;
    if (apiKey && fromEmail) {
      const { error } = await new Resend(apiKey).emails.send({
        from: fromEmail,
        replyTo: REPLY_TO_EMAIL,
        to: REVIEW_EMAIL,
        subject: gate.ok ? `[PREVIEW] ${edition.subject}` : `[QUARANTINED] ${edition.subject}`,
        html: `${banner}${html}`,
      });
      previewSent = !error;
      if (error) log.push(`Preview send failed: ${JSON.stringify(error)}`);
    } else {
      log.push("RESEND_API_KEY or RESEND_FROM_EMAIL missing — no preview sent.");
    }

    // An archived offer nobody was shown will send on Thursday with no review.
    // That is the one state worth escalating on the drafting path.
    await beat(
      previewSent ? "ok" : "failed",
      previewSent
        ? `archived ${edition.key} and previewed to ${REVIEW_EMAIL}`
        : `archived ${edition.key} but the PREVIEW DID NOT SEND — it will mail on Thursday unreviewed unless stopped by hand`,
    );

    return NextResponse.json({
      ok: true,
      mode,
      label,
      acted: true,
      edition: edition.key,
      subject: edition.subject,
      gateOk: gate.ok,
      killed: !gate.ok,
      previewSent,
      previewSentTo: REVIEW_EMAIL,
      log,
    });
  }

  // ──────────────────────────────── SEND ─────────────────────────────────
  let issue, html;
  try {
    [issue, html] = await Promise.all([
      readIssue(label, "offer"),
      readIssueHtml(label, "offer"),
    ]);
  } catch (err) {
    const msg = `Archive read failed: ${err instanceof Error ? err.message : err}`;
    console.error(`[Restock:send] ${msg}`);
    await beat("failed", msg);
    return NextResponse.json({ ok: false, mode, label, error: msg }, { status: 502 });
  }

  // Ordinary: most Thursdays in a month have nothing pending because the offer
  // already went out, and a Thursday that falls before the first Sunday has
  // nothing drafted yet. Neither is a fault.
  if (!issue || !html) return skip(`No archived restock offer for ${label} — nothing to send.`);
  if (issue.killed) {
    return skip(
      `Offer ${label} was stopped${issue.killedAt ? ` on ${issue.killedAt.slice(0, 10)}` : ""}` +
        `${issue.killedReason ? ` (${issue.killedReason})` : ""} — not sending.`,
    );
  }
  if (issue.sent) {
    return skip(
      `Offer ${label} was already sent${issue.sentAt ? ` at ${issue.sentAt}` : ""} — refusing to send twice.`,
    );
  }

  const elapsed = hoursSinceDraft(label, now);
  if (elapsed < REVIEW_WINDOW_HOURS) {
    return skip(
      `Only ${elapsed.toFixed(1)}h since the ${label} draft, inside the ${REVIEW_WINDOW_HOURS}h review window — holding.`,
    );
  }

  // Re-scan the bytes about to be mailed. Never trust the draft run's verdict:
  // the archive can be edited by hand between the two, which is the whole point
  // of having a window.
  const gate = checkIssueHtml(html);
  if (!gate.ok) {
    const msg = `Offer ${label} FAILED the content gate at send time and was NOT sent: ${gate.reason}`;
    console.error(`[Restock:send] ${msg}`);
    await beat("failed", `content gate blocked the send: ${gate.reason}`);
    return NextResponse.json(
      { ok: false, mode, label, error: msg, blocking: gate.blocking },
      { status: 422 },
    );
  }
  for (const w of gate.warnings) log.push(`Warning: ${w}`);

  const apiKey = (process.env.RESEND_API_KEY || "").trim();
  const audienceId = (process.env.RESEND_AUDIENCE_ID || "").trim();
  const fromEmail = (process.env.RESEND_FROM_EMAIL || "").trim();
  if (!apiKey || !audienceId || !fromEmail) {
    const msg = "RESEND_API_KEY, RESEND_AUDIENCE_ID or RESEND_FROM_EMAIL missing";
    await beat("failed", msg);
    return NextResponse.json({ ok: false, mode, label, error: msg }, { status: 500 });
  }

  const contacts = await fetchAudienceContacts(apiKey, audienceId).catch(async (err) => {
    await beat("failed", `audience read failed: ${err instanceof Error ? err.message : err}`);
    throw err;
  });
  const mailable = contacts.filter((c) => !c.unsubscribed).length;
  log.push(`Audience ${audienceId}: ${mailable} mailable of ${contacts.length}`);

  if (mailable < MIN_EXPECTED_RECIPIENTS) {
    const msg = `Only ${mailable} mailable contacts, below the ${MIN_EXPECTED_RECIPIENTS} floor — refusing. The audience id is probably wrong.`;
    console.error(`[Restock:send] ${msg}`);
    await beat("failed", msg);
    return NextResponse.json({ ok: false, mode, label, error: msg, log }, { status: 500 });
  }

  if (dryRun) {
    return NextResponse.json({
      ok: true,
      mode,
      label,
      dryRun: true,
      acted: false,
      edition: issue.edition ?? edition.key,
      subject: issue.subject,
      from: fromEmail,
      hoursSinceDraft: Number(elapsed.toFixed(1)),
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
    name: `Restock Offer — ${label}`,
    replyTo: REPLY_TO_EMAIL,
  }).catch(async (err) => {
    await beat("failed", `broadcast failed: ${err instanceof Error ? err.message : err}`);
    throw err;
  });

  const sentAt = new Date().toISOString();

  // The mail has ALREADY gone if this fails, so it is reported loudly rather
  // than swallowed: an unrecorded send is the one state that lets next
  // Thursday's run mail the same offer a second time.
  let flagCommitted = true;
  try {
    await commitFilesToGitHub(
      [
        {
          path: archivePaths.json(label, "offer"),
          content:
            JSON.stringify({ ...issue, sent: true, sentAt, broadcastId, sentBy: "cron" }, null, 2) +
            "\n",
        },
      ],
      `chore(offer): auto-sent ${label} (broadcast ${broadcastId})`,
    );
  } catch (err) {
    flagCommitted = false;
    console.error(
      `[Restock:send] SENT ${label} as ${broadcastId} but FAILED to record it: ` +
        `${err instanceof Error ? err.message : err}. Set sent:true in the archive by hand — ` +
        `otherwise this offer can be mailed again next Thursday.`,
    );
  }

  console.log(`[Restock:send] Sent ${label} — broadcast ${broadcastId} to ${mailable}`);

  await beat(
    flagCommitted ? "ok" : "failed",
    flagCommitted
      ? `sent to ${mailable} — broadcast ${broadcastId}`
      : `SENT to ${mailable} as ${broadcastId} but the sent flag did NOT commit. ` +
          `Set sent:true in the archive by hand or this offer can be mailed twice.`,
  );

  return NextResponse.json({
    ok: true,
    mode,
    label,
    acted: true,
    broadcastId,
    recipients: mailable,
    sentAt,
    flagCommitted,
    log,
  });
}
