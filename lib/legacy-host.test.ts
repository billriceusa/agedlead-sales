import { test, describe } from "node:test";
import assert from "node:assert/strict";
import { legacyRedirectTarget, LEGACY_HOSTS, TARGET_HOST } from "./legacy-host";

describe("legacyRedirectTarget", () => {
  test("redirects the retiring apex and its www, preserving the path", () => {
    assert.equal(
      legacyRedirectTarget("agedleadsales.com", "https://agedleadsales.com/start-here"),
      "https://workagedleads.com/start-here",
    );
    assert.equal(
      legacyRedirectTarget("www.agedleadsales.com", "https://www.agedleadsales.com/blog/x"),
      "https://workagedleads.com/blog/x",
    );
  });

  test("preserves the query string — UTMs and affiliate params ride along", () => {
    assert.equal(
      legacyRedirectTarget(
        "agedleadsales.com",
        "https://agedleadsales.com/lead-types?utm_source=agedleadsales&utm_medium=email",
      ),
      "https://workagedleads.com/lead-types?utm_source=agedleadsales&utm_medium=email",
    );
  });

  test("NEVER redirects the target host — that is a loop", () => {
    assert.equal(legacyRedirectTarget(TARGET_HOST, `https://${TARGET_HOST}/`), null);
    assert.equal(legacyRedirectTarget(`www.${TARGET_HOST}`, `https://www.${TARGET_HOST}/x`), null);
  });

  test("leaves /api on the old host so an in-flight POST is not turned into a GET", () => {
    // A 301 drops the method and body. Redirecting these would silently lose a
    // lead submitted from a page someone already had open.
    for (const p of ["/api", "/api/newsletter", "/api/contact", "/api/flagship/signup"]) {
      assert.equal(
        legacyRedirectTarget("agedleadsales.com", `https://agedleadsales.com${p}`),
        null,
        `${p} should not redirect`,
      );
    }
  });

  test("does not treat a path that merely starts with the same letters as /api", () => {
    assert.equal(
      legacyRedirectTarget("agedleadsales.com", "https://agedleadsales.com/apiary-leads"),
      "https://workagedleads.com/apiary-leads",
    );
  });

  test("ignores hosts that merely contain the retiring name", () => {
    assert.equal(
      legacyRedirectTarget("notagedleadsales.com", "https://notagedleadsales.com/"),
      null,
    );
    assert.equal(
      legacyRedirectTarget("agedleadsales.com.example.net", "https://agedleadsales.com.example.net/"),
      null,
    );
  });

  test("a missing or unparseable input serves normally rather than throwing", () => {
    assert.equal(legacyRedirectTarget(null, "https://agedleadsales.com/"), null);
    assert.equal(legacyRedirectTarget("", "https://agedleadsales.com/"), null);
    assert.equal(legacyRedirectTarget("agedleadsales.com", "not a url"), null);
  });

  test("drops the port so a proxied request cannot leak one into the redirect", () => {
    assert.equal(
      legacyRedirectTarget("agedleadsales.com:443", "https://agedleadsales.com:443/x"),
      "https://workagedleads.com/x",
    );
  });

  test("howtoworkleads.com is not handled here — it is a different Vercel project", () => {
    assert.ok(!LEGACY_HOSTS.includes("howtoworkleads.com"));
    assert.equal(
      legacyRedirectTarget("howtoworkleads.com", "https://howtoworkleads.com/"),
      null,
    );
  });
});
