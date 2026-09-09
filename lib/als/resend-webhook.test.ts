import { test, describe } from "node:test";
import assert from "node:assert/strict";
import { createHmac } from "crypto";
import { verifyResendSignature, parseResendEvent } from "./resend-webhook";

/**
 * A webhook that writes to a production table has two failure directions and
 * both are quiet. Reject real events and it looks like "Resend never fires".
 * Accept forged ones and anybody can write rows. These pin both.
 */

const SECRET = "whsec_" + Buffer.from("a-test-signing-key-32-bytes-long").toString("base64");

function sign(id: string, ts: number, body: string, secret = SECRET): string {
  const key = Buffer.from(secret.replace(/^whsec_/, ""), "base64");
  return "v1," + createHmac("sha256", key).update(`${id}.${ts}.${body}`).digest("base64");
}

const NOW = 1_788_000_000;
const BODY = JSON.stringify({ type: "email.opened", data: { email_id: "e1" } });

describe("verifyResendSignature", () => {
  test("accepts a correctly signed request", () => {
    const r = verifyResendSignature({
      rawBody: BODY,
      svixId: "msg_1",
      svixTimestamp: String(NOW),
      svixSignature: sign("msg_1", NOW, BODY),
      secret: SECRET,
      nowSeconds: NOW,
    });
    assert.deepEqual(r, { ok: true });
  });

  test("rejects a tampered body", () => {
    const sig = sign("msg_1", NOW, BODY);
    const r = verifyResendSignature({
      rawBody: BODY.replace("opened", "clicked"),
      svixId: "msg_1",
      svixTimestamp: String(NOW),
      svixSignature: sig,
      secret: SECRET,
      nowSeconds: NOW,
    });
    assert.equal(r.ok, false);
  });

  test("rejects a signature made with a different secret", () => {
    const other = "whsec_" + Buffer.from("a-different-key-of-32-bytes-len!").toString("base64");
    const r = verifyResendSignature({
      rawBody: BODY,
      svixId: "msg_1",
      svixTimestamp: String(NOW),
      svixSignature: sign("msg_1", NOW, BODY, other),
      secret: SECRET,
      nowSeconds: NOW,
    });
    assert.equal(r.ok, false);
  });

  test("rejects a replayed request outside the tolerance window", () => {
    const old = NOW - 60 * 60;
    const r = verifyResendSignature({
      rawBody: BODY,
      svixId: "msg_1",
      svixTimestamp: String(old),
      svixSignature: sign("msg_1", old, BODY),
      secret: SECRET,
      nowSeconds: NOW,
    });
    assert.equal(r.ok, false);
    assert.match((r as { reason: string }).reason, /tolerance/);
  });

  test("accepts when one of several rotated signatures matches", () => {
    // During a secret rotation Svix sends both. Any match is a pass.
    const header = `v1,YmFkc2lnbmF0dXJl ${sign("msg_1", NOW, BODY).split(",")[1]}`;
    const r = verifyResendSignature({
      rawBody: BODY,
      svixId: "msg_1",
      svixTimestamp: String(NOW),
      svixSignature: header.replace(/(^| )([A-Za-z0-9+/=]+)$/, " v1,$2"),
      secret: SECRET,
      nowSeconds: NOW,
    });
    assert.equal(r.ok, true);
  });

  test("refuses when no secret is configured", () => {
    // Must fail CLOSED. An unset env var must never mean "accept everything".
    const r = verifyResendSignature({
      rawBody: BODY,
      svixId: "msg_1",
      svixTimestamp: String(NOW),
      svixSignature: sign("msg_1", NOW, BODY),
      secret: "",
      nowSeconds: NOW,
    });
    assert.equal(r.ok, false);
  });

  test("refuses when svix headers are missing", () => {
    const r = verifyResendSignature({
      rawBody: BODY,
      svixId: null,
      svixTimestamp: String(NOW),
      svixSignature: sign("msg_1", NOW, BODY),
      secret: SECRET,
      nowSeconds: NOW,
    });
    assert.equal(r.ok, false);
  });
});

describe("parseResendEvent", () => {
  test("flattens a delivered event", () => {
    const e = parseResendEvent({
      type: "email.delivered",
      created_at: "2026-09-09T16:20:00.000Z",
      data: { email_id: "e1", to: ["Dave@Example.com"], subject: "Hello" },
    });
    assert.equal(e?.eventType, "email.delivered");
    assert.equal(e?.emailId, "e1");
    assert.equal(e?.recipient, "dave@example.com", "recipient must be lowercased for joins");
    assert.equal(e?.subject, "Hello");
    assert.equal(e?.occurredAt.toISOString(), "2026-09-09T16:20:00.000Z");
  });

  test("captures the followed link on a click", () => {
    const e = parseResendEvent({
      type: "email.clicked",
      created_at: "2026-09-09T16:25:00.000Z",
      data: {
        email_id: "e2",
        to: ["a@b.com"],
        click: { link: "https://agedleadstore.com/all-lead-types/?utm_campaign=winback-w1" },
      },
    });
    assert.match(e?.linkUrl ?? "", /winback-w1/);
  });

  test("captures the bounce type", () => {
    const e = parseResendEvent({
      type: "email.bounced",
      created_at: "2026-09-09T16:30:00.000Z",
      data: { email_id: "e3", to: ["gone@nowhere.tld"], bounce: { type: "hard" } },
    });
    assert.equal(e?.bounceType, "hard");
  });

  test("survives an unfamiliar payload instead of throwing", () => {
    // Svix retries a 500 only a few times, so throwing on an unexpected shape
    // loses the event permanently. Missing fields must degrade to null.
    const e = parseResendEvent({ type: "email.something_new" });
    assert.equal(e?.eventType, "email.something_new");
    assert.equal(e?.emailId, null);
    assert.equal(e?.recipient, null);
    assert.ok(e?.occurredAt instanceof Date);
  });

  test("returns null when there is no event type to record", () => {
    assert.equal(parseResendEvent({ data: {} }), null);
    assert.equal(parseResendEvent(null), null);
    assert.equal(parseResendEvent("nope"), null);
  });
});
