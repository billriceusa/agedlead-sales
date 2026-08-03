import { test, describe } from "node:test";
import assert from "node:assert/strict";
import {
  DEFAULT_NOINDEX_HOSTS,
  normalizeHost,
  parseNoindexHosts,
  shouldNoindexHost,
} from "./soft-launch";

describe("normalizeHost", () => {
  test("lowercases, drops the port, the trailing dot and a leading www", () => {
    assert.equal(normalizeHost("WWW.WorkAgedLeads.com:3000"), "workagedleads.com");
    assert.equal(normalizeHost("workagedleads.com."), "workagedleads.com");
    assert.equal(normalizeHost("  workagedleads.com "), "workagedleads.com");
  });

  test("returns empty for a missing header rather than throwing", () => {
    assert.equal(normalizeHost(null), "");
    assert.equal(normalizeHost(undefined), "");
  });
});

describe("shouldNoindexHost", () => {
  test("no production host is suppressed by default after cutover", () => {
    // The soft launch ended 2026-08-03. workagedleads.com is the live site now
    // and must be indexable; a regression here deindexes it silently, and the
    // only visible symptom is rankings that never arrive.
    assert.equal(shouldNoindexHost("workagedleads.com"), false);
    assert.equal(shouldNoindexHost("www.workagedleads.com"), false);
  });

  test("the mechanism still works when a host is named", () => {
    const hosts = parseNoindexHosts("workagedleads.com");
    assert.equal(shouldNoindexHost("workagedleads.com", hosts), true);
    assert.equal(shouldNoindexHost("www.workagedleads.com", hosts), true);
  });

  test("NEVER suppresses the live indexed site", () => {
    // This is the assertion that matters. A regression here deindexes a site
    // that is currently earning.
    assert.equal(shouldNoindexHost("agedleadsales.com"), false);
    assert.equal(shouldNoindexHost("www.agedleadsales.com"), false);
    assert.equal(shouldNoindexHost("AgedLeadSales.com:443"), false);
  });

  test("suppresses Vercel preview deployments", () => {
    assert.equal(shouldNoindexHost("agedlead-sales-abc123.vercel.app"), true);
  });

  test("does not suppress a host that merely contains the name", () => {
    assert.equal(shouldNoindexHost("workagedleads.com.example.net"), false);
    assert.equal(shouldNoindexHost("notworkagedleads.com"), false);
    assert.equal(shouldNoindexHost("vercel.app.example.com"), false);
  });

  test("a missing Host header is not suppressed", () => {
    assert.equal(shouldNoindexHost(null), false);
    assert.equal(shouldNoindexHost(""), false);
  });
});

describe("parseNoindexHosts", () => {
  test("unset falls back to the defaults", () => {
    assert.deepEqual(parseNoindexHosts(undefined), DEFAULT_NOINDEX_HOSTS);
  });

  test("an explicitly empty value suppresses nothing", () => {
    // Kept as a property of the parser, but it is no longer how cutover
    // happens: Vercel discards an empty-string env var, so this value never
    // reaches production. Ending the soft launch changed the default instead.
    assert.deepEqual(parseNoindexHosts(""), []);
    assert.equal(shouldNoindexHost("workagedleads.com", parseNoindexHosts("")), false);
  });

  test("parses a list, tolerating spacing and case", () => {
    assert.deepEqual(
      parseNoindexHosts("WorkAgedLeads.com, www.staging.example.com "),
      ["workagedleads.com", "staging.example.com"],
    );
  });

  test("an override still cannot un-suppress a preview deployment", () => {
    assert.equal(
      shouldNoindexHost("agedlead-sales-abc123.vercel.app", parseNoindexHosts("")),
      true,
    );
  });
});
