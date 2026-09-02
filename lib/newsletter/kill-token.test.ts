import { test, describe, before, after } from "node:test";
import assert from "node:assert/strict";
import { killToken, verifyKillToken, killUrl } from "./kill-token";

const ORIGINAL = process.env.CRON_SECRET;

before(() => {
  process.env.CRON_SECRET = "test-secret-for-kill-tokens";
});
after(() => {
  if (ORIGINAL === undefined) delete process.env.CRON_SECRET;
  else process.env.CRON_SECRET = ORIGINAL;
});

describe("killToken", () => {
  test("is stable for the same date", () => {
    assert.equal(killToken("2026-09-08"), killToken("2026-09-08"));
  });

  test("differs per date", () => {
    // A token that worked for any date would let one leaked link stop every
    // future issue, not just the one it was minted for.
    assert.notEqual(killToken("2026-09-08"), killToken("2026-09-15"));
  });

  test("is not the secret, and does not contain it", () => {
    // The whole reason this module exists: the link goes in an email, and
    // CRON_SECRET authorises every cron route in the app.
    const t = killToken("2026-09-08");
    assert.equal(t.includes("test-secret-for-kill-tokens"), false);
    assert.notEqual(t, process.env.CRON_SECRET);
    assert.match(t, /^[0-9a-f]{64}$/);
  });

  test("changes if the secret changes", () => {
    const before = killToken("2026-09-08");
    process.env.CRON_SECRET = "a-different-secret";
    const after = killToken("2026-09-08");
    process.env.CRON_SECRET = "test-secret-for-kill-tokens";
    assert.notEqual(before, after);
  });
});

describe("verifyKillToken", () => {
  test("accepts a matching token", () => {
    assert.equal(verifyKillToken("2026-09-08", killToken("2026-09-08")), true);
  });

  test("rejects a token minted for another date", () => {
    assert.equal(verifyKillToken("2026-09-08", killToken("2026-09-15")), false);
  });

  test("rejects missing, empty and malformed tokens", () => {
    assert.equal(verifyKillToken("2026-09-08", null), false);
    assert.equal(verifyKillToken("2026-09-08", undefined), false);
    assert.equal(verifyKillToken("2026-09-08", ""), false);
    assert.equal(verifyKillToken("2026-09-08", "not-hex-at-all"), false);
    assert.equal(verifyKillToken("2026-09-08", "abc"), false);
  });

  test("rejects a token that is one character off", () => {
    const good = killToken("2026-09-08");
    const bad = good.slice(0, -1) + (good.endsWith("a") ? "b" : "a");
    assert.equal(verifyKillToken("2026-09-08", bad), false);
  });

  test("does not throw when CRON_SECRET is absent — it returns false", () => {
    // A missing secret must fail closed and quietly. Throwing here would turn
    // a misconfigured deployment into a 500 on a link Bill clicked in a panic.
    const saved = process.env.CRON_SECRET;
    delete process.env.CRON_SECRET;
    assert.equal(verifyKillToken("2026-09-08", "a".repeat(64)), false);
    process.env.CRON_SECRET = saved;
  });
});

describe("killUrl", () => {
  test("builds an absolute link carrying date and token", () => {
    const u = new URL(killUrl("https://workagedleads.com", "2026-09-08"));
    assert.equal(u.origin, "https://workagedleads.com");
    assert.equal(u.pathname, "/api/newsletter/kill");
    assert.equal(u.searchParams.get("date"), "2026-09-08");
    assert.equal(verifyKillToken("2026-09-08", u.searchParams.get("t")), true);
  });

  test("tolerates a trailing slash on the origin", () => {
    const u = new URL(killUrl("https://workagedleads.com/", "2026-09-08"));
    assert.equal(u.pathname, "/api/newsletter/kill");
    assert.equal(u.href.includes("//api/"), false);
  });

  test("never puts CRON_SECRET in the URL", () => {
    assert.equal(
      killUrl("https://workagedleads.com", "2026-09-08").includes(
        "test-secret-for-kill-tokens",
      ),
      false,
    );
  });
});
