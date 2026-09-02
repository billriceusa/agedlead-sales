import { test, describe } from "node:test";
import assert from "node:assert/strict";
import {
  PRICE_DISCLOSURE,
  DISCLOSURE_META,
  getDisclosure,
  providersPublishingPrices,
  disclosureStats,
} from "./price-disclosure";
import { PROVIDERS } from "./providers";

describe("PRICE_DISCLOSURE integrity", () => {
  test("covers every rated provider", () => {
    // A directory that rates a provider but has no disclosure record for it
    // would show an incomplete survey as if it were complete.
    const missing = PROVIDERS.filter((p) => !getDisclosure(p.slug)).map((p) => p.slug);
    assert.deepEqual(missing, [], `providers with no disclosure record: ${missing}`);
  });

  test("has no entry for a provider that does not exist", () => {
    const slugs = new Set(PROVIDERS.map((p) => p.slug));
    const orphans = PRICE_DISCLOSURE.filter((d) => !slugs.has(d.slug)).map((d) => d.slug);
    assert.deepEqual(orphans, [], `disclosure records with no provider: ${orphans}`);
  });

  test("one record per provider", () => {
    const slugs = PRICE_DISCLOSURE.map((d) => d.slug);
    assert.equal(new Set(slugs).size, slugs.length, "duplicate disclosure record");
  });

  test("every claim carries a source and a date", () => {
    // These are public claims about named companies. An uncited one is an
    // assertion, and the panel invites readers to check it themselves.
    for (const d of PRICE_DISCLOSURE) {
      assert.match(d.sourceUrl, /^https?:\/\//, `${d.slug}: sourceUrl must be a URL`);
      assert.match(d.verified, /^\d{4}-\d{2}-\d{2}$/, `${d.slug}: verified must be YYYY-MM-DD`);
      assert.ok(d.note.trim().length > 20, `${d.slug}: note is too thin to be evidence`);
    }
  });

  test("every level has display metadata", () => {
    for (const d of PRICE_DISCLOSURE) {
      assert.ok(DISCLOSURE_META[d.level], `no metadata for level ${d.level}`);
    }
  });
});

describe("derived figures", () => {
  test("stats are computed, never hand-written", () => {
    // The panel prints "N / M publish any price". If that were a literal it
    // would drift the moment a provider changed, and the page would state a
    // number its own data contradicts.
    const s = disclosureStats();
    const comparable = PRICE_DISCLOSURE.filter((d) => d.level !== "not-applicable");
    assert.equal(s.total, comparable.length);
    assert.equal(
      s.publishing,
      comparable.filter((d) => d.level === "published" || d.level === "partial").length,
    );
    assert.equal(s.quoteOnly, comparable.filter((d) => d.level === "quote-only").length);
  });

  test("publishing count never exceeds the surveyed total", () => {
    const s = disclosureStats();
    assert.ok(s.publishing <= s.total);
    assert.ok(s.quoteOnly <= s.total);
  });

  test("providersPublishingPrices returns only providers that publish something", () => {
    for (const d of providersPublishingPrices()) {
      assert.ok(
        d.level === "published" || d.level === "partial",
        `${d.slug} (${d.level}) should not appear as a publisher`,
      );
    }
  });

  test("publishers are ordered best disclosure first", () => {
    const ranks = providersPublishingPrices().map((d) => DISCLOSURE_META[d.level].rank);
    assert.deepEqual(ranks, [...ranks].sort((a, b) => a - b));
  });

  test("the survey's headline claim still holds", () => {
    // The panel's whole argument is that disclosure is rare. If that stopped
    // being true the copy would be wrong, and this should fail loudly rather
    // than let the page keep asserting it.
    const s = disclosureStats();
    assert.ok(
      s.publishing < s.total / 2,
      `${s.publishing}/${s.total} now publish — the "almost nobody publishes" framing needs rewriting`,
    );
  });
});
