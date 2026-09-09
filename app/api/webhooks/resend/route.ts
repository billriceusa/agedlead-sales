import { NextResponse } from "next/server";
import { sql } from "drizzle-orm";
import { db } from "@/lib/db";
import { alsEmailEvents } from "@/lib/db/schema";
import { verifyResendSignature, parseResendEvent, isOurSend } from "@/lib/als/resend-webhook";

/**
 * Resend delivery/engagement webhook.
 *
 * WHY THIS EXISTS
 *
 * Resend's API exposes no engagement data at all — verified 2026-09-09 against
 * `GET /broadcasts` (id/name/audience_id/status/timestamps only) and
 * `GET /broadcasts/{id}` (adds content and headers, no stats). Open rate, click
 * rate, bounces and deliveries live only in their dashboard. This endpoint is
 * the only way the daily report can say anything about what happened between
 * "sent" and "earned".
 *
 * NOT AUTHENTICATED BY CRON_SECRET. Resend cannot send a Bearer token, so the
 * trust boundary is the Svix signature instead. It fails CLOSED: no configured
 * secret means every request is rejected, because an unset env var must never
 * silently become "accept anything" on a route that writes to Postgres.
 *
 * IDEMPOTENT. Svix retries on any non-2xx, and a retried open must not become
 * two opens. The Svix message id is unique in the table and a conflict is
 * ignored rather than erroring.
 *
 * RETURNS 200 ON AN UNPARSEABLE BODY, deliberately. Svix retries a failure only
 * a handful of times before giving up permanently, so a 500 on a payload shape
 * we do not recognise would lose real events while we were not looking. A
 * signature failure still returns 401 — that one we want to keep rejecting.
 */
export const dynamic = "force-dynamic";
export const maxDuration = 30;

export async function POST(request: Request) {
  // Raw body, not request.json(): the signature is computed over the exact
  // bytes, and re-serialising parsed JSON will not reproduce them.
  const rawBody = await request.text();

  const verdict = verifyResendSignature({
    rawBody,
    svixId: request.headers.get("svix-id"),
    svixTimestamp: request.headers.get("svix-timestamp"),
    svixSignature: request.headers.get("svix-signature"),
    secret: (process.env.RESEND_WEBHOOK_SECRET || "").trim(),
  });
  if (!verdict.ok) {
    console.warn(`[resend-webhook] rejected: ${verdict.reason}`);
    return NextResponse.json({ error: verdict.reason }, { status: 401 });
  }

  let body: unknown;
  try {
    body = JSON.parse(rawBody);
  } catch {
    return NextResponse.json({ ok: true, stored: false, reason: "unparseable body" });
  }

  const event = parseResendEvent(body);
  if (!event) {
    return NextResponse.json({ ok: true, stored: false, reason: "no event type" });
  }

  // A Resend webhook is ACCOUNT-wide, and this account sends for 26 verified
  // domains across BRSG, Kaleidico clients and the book properties. Storing all
  // of them would blend other properties' engagement into this report AND write
  // Kaleidico and Zoomcasa client recipients into a BRSG database. Acknowledged
  // with 200 so Svix stops retrying — this is a correct outcome, not a failure.
  if (!isOurSend(event.fromAddress)) {
    return NextResponse.json({
      ok: true,
      stored: false,
      reason: "not a workagedleads sending domain",
    });
  }

  const svixId = request.headers.get("svix-id") as string;
  try {
    await db
      .insert(alsEmailEvents)
      .values({
        svixId,
        eventType: event.eventType,
        emailId: event.emailId,
        recipient: event.recipient,
        subject: event.subject,
        fromAddress: event.fromAddress,
        linkUrl: event.linkUrl,
        bounceType: event.bounceType,
        occurredAt: event.occurredAt,
      })
      .onConflictDoNothing({ target: alsEmailEvents.svixId });
  } catch (err) {
    // A write failure IS worth a retry, unlike a shape we do not understand.
    console.error("[resend-webhook] insert failed", err);
    return NextResponse.json({ error: "insert failed" }, { status: 500 });
  }

  // A hard bounce is a dead mailbox. Suppress it immediately rather than
  // waiting for a human to read a report: every further send to it is pure
  // reputation damage, and this program is running on a sending domain that is
  // five weeks old. Soft bounces are transient and are recorded, not acted on.
  if (event.eventType === "email.bounced" && event.bounceType === "hard" && event.recipient) {
    await db.execute(sql`
      update als_buyer_contacts
      set sendable = false, kickbox_result = 'undeliverable'
      where lower(trim(email)) = ${event.recipient}`);
    console.warn(`[resend-webhook] hard bounce suppressed: ${event.recipient}`);
  }

  return NextResponse.json({ ok: true, stored: true, type: event.eventType });
}
