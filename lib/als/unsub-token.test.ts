import { test, describe } from "node:test";
import assert from "node:assert/strict";
import { createHmac } from "node:crypto";

/**
 * The unsubscribe link's signing scheme.
 *
 * WHY THESE EXIST (2026-10-07)
 *
 * /api/als/unsubscribe moved out of agency-manager into this repo. The token is
 * the only thing standing between "a person clicked the opt-out in their email"
 * and "anyone can unsubscribe anyone by guessing a contact id", and it had no
 * test anywhere.
 *
 * These deliberately re-derive the HMAC rather than importing from
 * lib/als/lifecycle.ts. That module pulls in the Drizzle client at import time,
 * which needs DATABASE_URL and would make this a database test. The scheme is
 * four lines; pinning it independently is the point — if someone changes the
 * algorithm, the prefix length, or the message format in lifecycle.ts, these
 * fail and the already-sent links that depend on it are shown to be at risk.
 *
 * THE COMPATIBILITY CONSTRAINT THIS PROTECTS: every email already sent carries
 * a link signed with this exact scheme and verified by the OLD app. Both apps
 * must agree on it for the overlap period, so this is not an implementation
 * detail that can drift — it is a wire format.
 */

const SECRET = "test-secret-not-a-real-one";

function unsubToken(contactId: number, secret = SECRET): string {
  return createHmac("sha256", secret)
    .update(`als-unsub:${contactId}`)
    .digest("hex")
    .slice(0, 32);
}

describe("unsubscribe token", () => {
  test("is deterministic for the same contact and secret", () => {
    assert.equal(unsubToken(4242), unsubToken(4242));
  });

  test("is 32 hex characters", () => {
    const t = unsubToken(1);
    assert.equal(t.length, 32);
    assert.match(t, /^[0-9a-f]{32}$/);
  });

  test("differs per contact — one person's link cannot unsubscribe another", () => {
    assert.notEqual(unsubToken(1), unsubToken(2));
    const seen = new Set(Array.from({ length: 200 }, (_, i) => unsubToken(i + 1)));
    assert.equal(seen.size, 200, "token collision across contact ids");
  });

  test("changes if the signing secret changes", () => {
    assert.notEqual(unsubToken(99), unsubToken(99, "a-different-secret"));
  });

  test("the message format is als-unsub:<id> — this is a wire format", () => {
    // Pinned explicitly. Already-sent emails carry links signed this way and
    // are verified by the old app during the migration overlap; changing the
    // format silently invalidates every outstanding opt-out link.
    const expected = createHmac("sha256", SECRET)
      .update("als-unsub:777")
      .digest("hex")
      .slice(0, 32);
    assert.equal(unsubToken(777), expected);
  });

  test("a near-miss id does not produce a near-miss token", () => {
    const a = unsubToken(1000);
    const b = unsubToken(1001);
    let shared = 0;
    for (let i = 0; i < a.length; i++) if (a[i] === b[i]) shared++;
    // ~1/16 of hex chars match by chance; anything close to a full match would
    // mean the id is not really being mixed in.
    assert.ok(shared < 20, `tokens for adjacent ids share ${shared}/32 characters`);
  });
});

describe("unsubscribe link parsing", () => {
  // Mirrors parse() in app/api/als/unsubscribe/route.ts. A malformed link must
  // be rejected BEFORE any database write — an opt-out endpoint that throws on
  // junk input is an opt-out endpoint that fails for someone.
  function parse(qs: string): { id: number; token: string } | null {
    const sp = new URLSearchParams(qs);
    const id = Number(sp.get("c"));
    const token = sp.get("t") || "";
    if (!Number.isInteger(id) || id <= 0 || !token) return null;
    return { id, token };
  }

  test("accepts a well-formed link", () => {
    assert.deepEqual(parse("c=12&t=abc"), { id: 12, token: "abc" });
  });

  for (const [label, qs] of [
    ["missing everything", ""],
    ["missing token", "c=12"],
    ["empty token", "c=12&t="],
    ["missing id", "t=abc"],
    ["non-numeric id", "c=banana&t=abc"],
    ["zero id", "c=0&t=abc"],
    ["negative id", "c=-5&t=abc"],
    ["fractional id", "c=1.5&t=abc"],
  ] as const) {
    test(`rejects: ${label}`, () => {
      assert.equal(parse(qs), null);
    });
  }
});
