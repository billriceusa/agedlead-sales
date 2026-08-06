import { test, describe } from "node:test";
import assert from "node:assert/strict";
import { fitMetaDescription, META_DESCRIPTION_MAX } from "./meta-description";

const within = (s: string) =>
  assert.ok(s.length <= META_DESCRIPTION_MAX, `${s.length} chars: ${s}`);

describe("fitMetaDescription", () => {
  test("leaves a description that already fits completely alone", () => {
    const s = "Aged leads are consumer records from people who requested a quote and were never reached.";
    assert.equal(fitMetaDescription(s), s);
  });

  test("cuts on a sentence boundary when one is available", () => {
    const s =
      "An aged lead is a consumer record from someone who asked for a quote and was never reached or never closed. " +
      "Price tracks freshness far more closely than it tracks quality, which is why the oldest brackets sell for cents.";
    const out = fitMetaDescription(s);
    within(out);
    assert.ok(out.endsWith("."), out);
    assert.ok(!out.endsWith("…"), "a clean sentence break needs no ellipsis");
  });

  test("never ends mid-word — the bug this exists to prevent", () => {
    // 12 posts shipped "...in the categor…" before 2026-08-06.
    const s = "x".repeat(40) + " " + "supercalifragilistic ".repeat(12);
    const out = fitMetaDescription(s);
    within(out);
    const body = out.replace(/…$/, "");
    assert.ok(
      s.startsWith(body),
      "output must be a prefix of the input, not a re-cut word",
    );
    assert.ok(/(\s|^)\S+$/.test(body), out);
  });

  test("does not split a decimal or an abbreviation into a sentence end", () => {
    const s =
      "Aged records sample at a $1.25 median across four providers versus $22 for shared real-time, " +
      "which is the spread that decides whether volume or speed is the right operating model for you.";
    const out = fitMetaDescription(s);
    within(out);
    assert.ok(!out.endsWith("$1."), out);
    assert.ok(!/\d\.$/.test(out), `must not stop after a decimal point: ${out}`);
  });

  test("falls back to a word cut when the first sentence is itself too long", () => {
    const s =
      "This single sentence runs well past the display limit without any internal punctuation to break on " +
      "and therefore has to be cut on a word boundary instead of a sentence boundary entirely";
    const out = fitMetaDescription(s);
    within(out);
    assert.ok(out.endsWith("…"), out);
  });

  test("does not leave dangling punctuation before the ellipsis", () => {
    const s = "One clause here, another clause there, " + "and more text ".repeat(20);
    const out = fitMetaDescription(s);
    within(out);
    assert.ok(!/[,;:–—-]…$/.test(out), out);
  });

  test("collapses whitespace so multi-line prose measures honestly", () => {
    assert.equal(fitMetaDescription("a  b\n\nc\t d"), "a b c d");
  });

  test("missing input is an empty string, not a crash or 'undefined'", () => {
    for (const v of [undefined, null, "", "   "]) {
      assert.equal(fitMetaDescription(v), "");
    }
  });

  test("respects a caller-supplied budget", () => {
    const s = "word ".repeat(60);
    assert.ok(fitMetaDescription(s, 40).length <= 40);
  });
});
