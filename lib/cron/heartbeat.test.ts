import { test, describe } from "node:test";
import assert from "node:assert/strict";
import { describeError } from "./heartbeat";

/**
 * On 2026-09-04 the als-lifecycle heartbeat recorded a failure and still could
 * not tell anyone what had failed. Drizzle's query error puts the real Postgres
 * message in `.cause` and fills `.message` with the SQL plus every bound
 * parameter, so the 2000-char cap in recordCronRun spent its budget on a
 * placeholder list and 111 customer email addresses, truncating before the
 * actual error — which then also sat in a Sanity document.
 */

/** The shape drizzle actually throws. */
function drizzleError(causeMessage: string, params: string[]) {
  const err = new Error(
    `Failed query: select "id" from "als_buyer_contacts" where lower("email") = any(($1, $2))\nparams: ${params.join(",")}`
  );
  (err as Error & { cause?: unknown }).cause = new Error(causeMessage);
  return err;
}

describe("describeError", () => {
  const cause = "op ANY/ALL (array) requires array on right side";

  test("surfaces the underlying cause, which is what says what broke", () => {
    const out = describeError(drizzleError(cause, ["a@x.com", "b@x.com"]));
    assert.ok(out.includes(cause), `cause was lost: ${out}`);
  });

  test("never leaks bound parameters — they are customer email addresses", () => {
    const out = describeError(drizzleError(cause, ["buyer@example.com", "b@x.com"]));
    assert.ok(!out.includes("buyer@example.com"), `leaked a contact address: ${out}`);
    assert.ok(!out.includes("params:"), `leaked the params dump: ${out}`);
  });

  test("drops the SQL dump that crowded out the message", () => {
    const out = describeError(drizzleError(cause, ["a@x.com"]));
    assert.ok(!out.includes("Failed query:"), `kept the SQL dump: ${out}`);
  });

  test("stays short enough to survive the heartbeat's 2000-char cap", () => {
    const out = describeError(drizzleError(cause, Array(500).fill("a@example.com")));
    assert.ok(out.length <= 300, `too long to be safe: ${out.length}`);
  });

  test("handles a plain Error with no cause", () => {
    assert.equal(describeError(new Error("Resend returned 401")), "Resend returned 401");
  });

  test("handles a non-Error throw", () => {
    assert.equal(describeError("something went wrong"), "something went wrong");
  });

  test("never returns an empty string", () => {
    assert.equal(describeError(new Error("")), "unknown error");
  });
});
