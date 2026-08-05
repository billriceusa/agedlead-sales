import { test } from "node:test";
import assert from "node:assert/strict";

import {
  AFFILIATE_UTM_SOURCE,
  AFFILIATE_UTM_SOURCE_LEGACY,
  AFFILIATE_UTM_SOURCES,
} from "./utm";
import { affiliateUrl } from "./affiliate";

test("affiliate links emit the current brand as the source", () => {
  const url = affiliateUrl({ campaign: "test", content: "unit" });
  assert.match(url, /utm_source=workagedleads/);
  assert.doesNotMatch(url, /utm_source=agedleadsales/);
});

test("the reporting source list spans the rebrand", () => {
  // GA4 never rewrites history: sessions recorded under the old source stay
  // under it. Drop the legacy value and every pre-2026-08-05 session silently
  // disappears from the email-attribution report — a query that stops matching,
  // presenting as a traffic collapse.
  assert.ok(AFFILIATE_UTM_SOURCES.includes(AFFILIATE_UTM_SOURCE));
  assert.ok(AFFILIATE_UTM_SOURCES.includes(AFFILIATE_UTM_SOURCE_LEGACY));
  assert.notEqual(AFFILIATE_UTM_SOURCE, AFFILIATE_UTM_SOURCE_LEGACY);
});
