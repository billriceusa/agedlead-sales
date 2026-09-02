import { NextResponse } from "next/server";
import { verifyKillToken } from "@/lib/newsletter/kill-token";
import { readIssue, archivePaths } from "@/lib/newsletter/archive-github";
import { commitFilesToGitHub } from "@/lib/cron/git-commit";

/**
 * The veto in the opt-out review window.
 *
 * Bill's decision (2026-09-02): the Q4 issues send automatically on Tuesday
 * unless he stops one. That only works if stopping one is genuinely a click —
 * a kill switch that needs a terminal is a kill switch that does not get used
 * on a Sunday evening.
 *
 * Marking `killed: true` is all this does. `scripts/send-newsletter.ts` and
 * `app/api/cron/send-newsletter` both refuse a killed issue, so the flag is the
 * single mechanism and there is no second code path to keep in sync.
 *
 * GET, not POST, because it is a link in an email. That is a deliberate
 * trade: link prefetchers and scanners can follow a GET, so an aggressive mail
 * scanner could kill an issue nobody meant to kill. That direction is safe —
 * it stops a send, it cannot cause one — and the outcome is loud (the issue
 * does not go out, and the archive records when and why). The reverse design,
 * where a scanner could TRIGGER a send, would be unacceptable.
 *
 * Authorised by a purpose-scoped HMAC bound to the one date, never by
 * CRON_SECRET itself — see lib/newsletter/kill-token.ts for why that matters.
 */

export const dynamic = "force-dynamic";

function page(title: string, body: string, ok: boolean): NextResponse {
  const accent = ok ? "#166534" : "#991b1b";
  const bg = ok ? "#f0fdf4" : "#fef2f2";
  return new NextResponse(
    `<!DOCTYPE html><html lang="en"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>${title}</title></head>
<body style="margin:0;padding:48px 16px;background:#f3f4f6;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Arial,sans-serif;">
<div style="max-width:560px;margin:0 auto;background:${bg};border:2px solid ${accent};border-radius:12px;padding:28px;">
<h1 style="margin:0 0 12px;font-size:20px;color:${accent};">${title}</h1>
<p style="margin:0;color:#374151;font-size:15px;line-height:1.7;">${body}</p>
</div></body></html>`,
    { status: ok ? 200 : 400, headers: { "Content-Type": "text/html; charset=utf-8" } },
  );
}

export async function GET(request: Request) {
  const url = new URL(request.url);
  const date = url.searchParams.get("date") ?? "";
  const token = url.searchParams.get("t");

  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    return page("Bad request", "That link is missing a valid issue date.", false);
  }
  if (!verifyKillToken(date, token)) {
    // Deliberately does not say whether the date exists — an unauthenticated
    // caller learns nothing about the schedule.
    return page("Not authorised", "That link is not valid.", false);
  }

  let issue;
  try {
    issue = await readIssue(date);
  } catch (err) {
    console.error("[Kill] archive read failed:", err);
    return page(
      "Could not reach the archive",
      "GitHub did not answer, so nothing was changed. The issue is still scheduled — try again, or set <code>killed: true</code> in the archive by hand.",
      false,
    );
  }

  if (!issue) {
    return page("No such issue", `Nothing is archived for ${date}.`, false);
  }

  if (issue.sent) {
    // Honest about the one case this cannot fix.
    return page(
      "Already sent — too late to stop",
      `Issue ${date} went out${issue.sentAt ? ` at ${issue.sentAt}` : ""}` +
        `${issue.broadcastId ? ` (broadcast ${issue.broadcastId})` : ""}. ` +
        `Killing it now would change nothing. If the copy is wrong, the correction has to be a follow-up send.`,
      false,
    );
  }

  if (issue.killed) {
    return page(
      "Already stopped",
      `Issue ${date} was already marked killed${issue.killedAt ? ` on ${issue.killedAt.slice(0, 10)}` : ""}. It will not send. Nothing further to do.`,
      true,
    );
  }

  const killed = {
    ...issue,
    killed: true,
    killedAt: new Date().toISOString(),
    killedReason: "Stopped by Bill from the Sunday preview email.",
  };

  try {
    await commitFilesToGitHub(
      [{ path: archivePaths.json(date), content: JSON.stringify(killed, null, 2) + "\n" }],
      `chore(newsletter): stop the ${date} issue — killed from the preview`,
    );
  } catch (err) {
    console.error("[Kill] commit failed:", err);
    return page(
      "Could not save the stop",
      "GitHub accepted the read but rejected the write, so the issue is STILL SCHEDULED. Set <code>killed: true</code> in the archive by hand before Tuesday.",
      false,
    );
  }

  console.log(`[Kill] Issue ${date} marked killed`);
  return page(
    "Stopped",
    `Issue <strong>${date}</strong> will not send. Nothing goes to the list. ` +
      `The archive records it as killed, so neither the Tuesday cron nor the send script will pick it up — including by accident later.`,
    true,
  );
}
