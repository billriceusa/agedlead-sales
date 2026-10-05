import { test, describe } from "node:test";
import assert from "node:assert/strict";
import { extractJsonObject, assertNewsletterShape } from "./newsletter-ai";

/**
 * These pin the 2026-10-04 outage.
 *
 * The Sunday generation run died on "Unexpected non-whitespace character after
 * JSON at position 1187", nothing was archived, and the Tuesday send had nothing
 * to mail — two weeks of the site's best-earning email, lost to text sitting
 * outside an otherwise perfectly good object.
 */
describe("extractJsonObject", () => {
  const obj = '{"subject":"Q4 math","body":"Work the renewal clock."}';

  test("plain object", () => {
    assert.equal(extractJsonObject(obj), obj);
  });

  test("trailing commentary after the object — the actual 2026-10-04 failure", () => {
    assert.equal(
      extractJsonObject(`${obj}\n\nLet me know if you'd like a different angle.`),
      obj,
    );
  });

  test("preamble before the object", () => {
    assert.equal(extractJsonObject(`Here is this week's issue:\n\n${obj}`), obj);
  });

  test("markdown fence, with and without a language tag", () => {
    assert.equal(extractJsonObject("```json\n" + obj + "\n```"), obj);
    assert.equal(extractJsonObject("```\n" + obj + "\n```"), obj);
  });

  test("preamble AND fence AND trailing note together", () => {
    assert.equal(
      extractJsonObject("Sure!\n\n```json\n" + obj + "\n```\n\nHope that works."),
      obj,
    );
  });

  test("braces inside string values do not end the object early", () => {
    // Newsletter copy really does contain braces — merge tags like {{first_name}}.
    const braces = '{"subject":"Hi {{first_name}}","body":"Use {{confirm_link}} to opt in."}';
    assert.equal(extractJsonObject(`noise ${braces} noise`), braces);
    assert.deepEqual(JSON.parse(extractJsonObject(braces)).subject, "Hi {{first_name}}");
  });

  test("escaped quotes and backslashes do not break string tracking", () => {
    const tricky = '{"subject":"He said \\"buy aged\\"","body":"A backslash: \\\\ and a brace: }"}';
    const parsed = JSON.parse(extractJsonObject(`lead-in ${tricky} trailer`));
    assert.equal(parsed.subject, 'He said "buy aged"');
    assert.equal(parsed.body, "A backslash: \\ and a brace: }");
  });

  test("nested objects return the OUTER object, not the first inner one", () => {
    const nested = '{"a":{"b":{"c":1}},"d":2}';
    assert.equal(extractJsonObject(nested), nested);
  });

  test("a truncated object still throws, and says so plainly", () => {
    // The forgiving parser must NOT paper over a cut-off response.
    assert.throws(
      () => extractJsonObject('{"subject":"Q4 math","body":"Work the ren'),
      /TRUNCATED/,
    );
  });

  test("no object at all throws with the start of the response", () => {
    assert.throws(() => extractJsonObject("I cannot help with that."), /No JSON object/);
  });
});

/**
 * These pin the OTHER half of the 2026-10-04 class of failure.
 *
 * extractJsonObject only guarantees the bytes parse. `JSON.parse(...) as
 * NewsletterContent` then asserts a shape nobody checked, and a response
 * missing quickTips threw a TypeError inside buildNewsletterHtml — which sat
 * outside any try block, so the route 500'd BEFORE recording a heartbeat and
 * the health check stayed quiet for eight days. Failing in the validator makes
 * it a retryable generation error instead.
 */
describe("assertNewsletterShape", () => {
  const valid = () => ({
    subject: "Q4 math",
    previewText: "Work the renewal clock.",
    personalIntro: "Hello.",
    featuredArticle: { title: "T", slug: "t", spotlight: "S" },
    quickTips: [{ title: "Tip", body: "Body" }],
    industryInsight: { headline: "H", body: "B" },
    weeklyDigest: [{ title: "D", slug: "d", oneLiner: "O" }],
    closingNote: "Bye.",
    ctaText: "Browse leads",
  });

  test("a complete issue passes", () => {
    assert.doesNotThrow(() => assertNewsletterShape(valid()));
  });

  test("an empty weeklyDigest is legitimate — a quiet week is still an issue", () => {
    assert.doesNotThrow(() => assertNewsletterShape({ ...valid(), weeklyDigest: [] }));
  });

  test("missing quickTips throws and names the field — the real downstream crash", () => {
    const o = valid() as Record<string, unknown>;
    delete o.quickTips;
    assert.throws(() => assertNewsletterShape(o), /quickTips/);
  });

  test("a quickTip missing its body throws", () => {
    assert.throws(
      () => assertNewsletterShape({ ...valid(), quickTips: [{ title: "Tip" }] }),
      /quickTips/,
    );
  });

  test("a blank subject throws — whitespace is not a subject line", () => {
    assert.throws(() => assertNewsletterShape({ ...valid(), subject: "   " }), /subject/);
  });

  test("missing featuredArticle slug throws", () => {
    assert.throws(
      () => assertNewsletterShape({ ...valid(), featuredArticle: { title: "T" } }),
      /featuredArticle/,
    );
  });

  test("missing industryInsight throws", () => {
    const o = valid() as Record<string, unknown>;
    delete o.industryInsight;
    assert.throws(() => assertNewsletterShape(o), /industryInsight/);
  });

  test("null and a bare string are rejected, not coerced", () => {
    assert.throws(() => assertNewsletterShape(null), /not an object/);
    assert.throws(() => assertNewsletterShape("an issue"), /not an object/);
  });

  test("every missing field is reported at once, not one per round trip", () => {
    const err = (() => {
      try {
        assertNewsletterShape({ subject: "S" });
        return null;
      } catch (e) {
        return e as Error;
      }
    })();
    assert.ok(err, "expected a throw");
    for (const f of ["previewText", "quickTips", "industryInsight", "featuredArticle"]) {
      assert.match(err!.message, new RegExp(f));
    }
  });
});
