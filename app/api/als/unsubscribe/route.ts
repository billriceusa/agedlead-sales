import { NextRequest, NextResponse } from "next/server";
import { verifyUnsubToken, unsubscribeContact } from "@/lib/als/lifecycle";
import { SENDER_LEGAL_NAME, SENDER_POSTAL_ADDRESS } from "@/lib/sender";

export const dynamic = "force-dynamic";

/**
 * Unsubscribe endpoint for the Aged Leads Insights lifecycle emails.
 *
 * WHY IT MOVED HERE (2026-10-07)
 *
 * This route used to live in `agency-manager`, which is on the decommission
 * path. Everything else about this program already runs in this repo — the
 * journeys, the send cron (`/api/cron/als-lifecycle`), the contact table, and
 * both `verifyUnsubToken` and `unsubscribeContact` in lib/als/lifecycle.ts.
 * Only the HTTP surface was left behind, which meant a CAN-SPAM-required
 * opt-out depended on an app scheduled to be switched off. That is a
 * fail-closed dependency on a system with a retirement date, and 15 U.S.C.
 * § 7704(a)(4) gives no grace for an opt-out mechanism that stops working.
 *
 * MIGRATION ORDER — THIS MATTERS. Every email ALREADY SENT carries an absolute
 * link to the old host. Those links keep working only while agency-manager is
 * up. So:
 *   1. ship this route + repoint ALS_PUBLIC_APP_URL (new mail points here),
 *   2. leave the agency-manager route serving the old links,
 *   3. retire it only once the in-flight sends have aged out.
 * Deleting the old route before step 3 breaks opt-out for everyone holding an
 * older email. Nothing here does that; this is purely additive.
 *
 * TOKENS. The link is `?c=<contactId>&t=<hmac>`, signed with ALS_UNSUB_SECRET
 * (falling back to CRON_SECRET). Both apps must sign with the same secret for
 * old links to verify in either place during the overlap.
 *
 * GET unsubscribes on sight rather than asking for a second click. That is
 * deliberate and it is the behaviour being ported, not a new choice: an opt-out
 * that needs a confirmation step is a worse opt-out, and the token already
 * proves the request came from a real email we sent. The known cost is that a
 * scanner or link-prefetcher can trip it — which fails in the safe direction,
 * since the reply path below restores anyone caught by it.
 */

function parse(req: NextRequest): { id: number; token: string } | null {
  const sp = req.nextUrl.searchParams;
  const id = Number(sp.get("c"));
  const token = sp.get("t") || "";
  if (!Number.isInteger(id) || id <= 0 || !token) return null;
  return { id, token };
}

/** RFC 8058 one-click, which Gmail and Yahoo require of bulk senders. */
export async function POST(req: NextRequest) {
  const p = parse(req);
  if (!p || !verifyUnsubToken(p.id, p.token)) {
    return NextResponse.json({ error: "Invalid link" }, { status: 400 });
  }
  await unsubscribeContact(p.id);
  return NextResponse.json({ success: true });
}

export async function GET(req: NextRequest) {
  const p = parse(req);
  const ok = !!p && verifyUnsubToken(p.id, p.token);
  if (ok && p) await unsubscribeContact(p.id);

  const body = ok
    ? `<h1>You're unsubscribed.</h1>
       <p>You won't receive any more Aged Leads Insights emails. If this was a
       mistake, reply to any of our emails and we'll add you back.</p>`
    : `<h1>Link not recognized</h1>
       <p>This unsubscribe link is invalid or has expired. Reply to any of our
       emails and we'll take care of it for you.</p>`;

  // Self-contained: no app CSS, no fonts, no JS. This page has to render for
  // someone who just told us to stop emailing them, so it should not depend on
  // anything that can fail. Dark mode is handled with a media query rather than
  // the site's theme toggle, for the same reason.
  const html = `<!doctype html>
<html lang="en"><head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="robots" content="noindex,nofollow">
<title>Unsubscribe — Aged Leads Insights</title>
<style>
  :root { color-scheme: light dark; }
  body {
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
    background: #eceff3; color: #1c2530; margin: 0;
    padding: 16px;
  }
  .c {
    max-width: 520px; margin: 10vh auto; background: #fff;
    border: 1px solid #d8dee6; border-radius: 14px; padding: 32px 28px;
  }
  h1 { font-size: 22px; line-height: 1.3; margin: 0 0 10px; }
  p { line-height: 1.6; color: #41506a; margin: 0 0 12px; }
  .k {
    font-size: 12px; letter-spacing: .16em; text-transform: uppercase;
    color: #8295a8; margin-bottom: 14px;
  }
  .addr { font-size: 12px; color: #7b8a9c; margin-top: 22px; line-height: 1.5; }
  @media (prefers-color-scheme: dark) {
    body { background: #0f1419; color: #e6edf3; }
    .c { background: #161b22; border-color: #2d333b; }
    p { color: #b3c0cf; }
    .k { color: #768495; }
    .addr { color: #6d7a8a; }
  }
</style></head>
<body><div class="c">
  <div class="k">Aged Leads Insights</div>
  ${body}
  <p class="addr">${SENDER_LEGAL_NAME}<br>${SENDER_POSTAL_ADDRESS}</p>
</div></body></html>`;

  return new NextResponse(html, {
    status: ok ? 200 : 400,
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      // Never let a CDN or browser serve a cached "you're unsubscribed" to the
      // next person, and never cache the failure either.
      "Cache-Control": "no-store, max-age=0",
      "X-Robots-Tag": "noindex, nofollow",
    },
  });
}
