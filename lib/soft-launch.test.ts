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
  test("suppresses the migration host on apex and www", () => {
    assert.equal(shouldNoindexHost("workagedleads.com"), true);
    assert.equal(shouldNoindexHost("www.workagedleads.com"), true);
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

  test("an explicitly empty value suppresses nothing — the cutover switch", () => {
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
