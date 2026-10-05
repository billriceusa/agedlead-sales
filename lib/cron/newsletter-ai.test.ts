import { test, describe } from "node:test";
import assert from "node:assert/strict";
import { extractJsonObject } from "./newsletter-ai";

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
