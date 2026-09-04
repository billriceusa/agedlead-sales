import { test, describe } from "node:test";
import assert from "node:assert/strict";
import { PgDialect } from "drizzle-orm/pg-core";
import { matchesOptedOutEmail } from "./suppression-sync";

/**
 * The suppression sync reads Resend's opt-outs and flags them in Postgres
 * BEFORE the lifecycle decides who to mail, and it fails closed: if it throws,
 * nothing is sent.
 *
 * That made a single malformed predicate silent and total. The opted-out match
 * was written as ``sql`lower(email) = any(${emails})` ``, which drizzle expands
 * to `= any(($1, $2, $3))` — a row constructor where `= ANY` needs an array.
 * Postgres rejected it every time, the sync threw every time, and the lifecycle
 * sent nothing from 2026-08-01 to 2026-09-04. Sends had been running ~150/day.
 *
 * Nothing caught it. The heartbeat said "failed" only after 2026-09-03, the
 * backlog it produced looked like a throughput problem, and the response was to
 * raise the send cap — a knob upstream of the code that was actually failing.
 *
 * These tests compile the predicate and read the SQL. No database, no network:
 * the defect was always visible in the generated string.
 */

const dialect = new PgDialect();

function compile(emails: string[]) {
  return dialect.sqlToQuery(matchesOptedOutEmail(emails).getSQL());
}

describe("matchesOptedOutEmail", () => {
  test("does not compile to a row constructor on the right of ANY", () => {
    const { sql } = compile(["a@x.com", "b@x.com", "c@x.com"]);

    // The exact shape that took the program dark. `any((` is the tell: a
    // parenthesised placeholder list rather than a single array parameter.
    assert.ok(
      !sql.includes("any(("),
      `predicate compiled to a row constructor Postgres will reject: ${sql}`
    );
  });

  test("matches every supplied address, not just the first", () => {
    const { sql, params } = compile(["a@x.com", "b@x.com", "c@x.com"]);

    assert.equal(params.length, 3, `expected 3 bound params, got: ${sql}`);
    assert.ok(
      sql.includes("$1") && sql.includes("$2") && sql.includes("$3"),
      `not every address reached the query: ${sql}`
    );
  });

  test("compares case-insensitively on the column, not the parameter", () => {
    const { sql } = compile(["a@x.com"]);

    // Resend addresses are lowercased on the way in; the column is not
    // normalised in storage, so the lower() has to sit on the column side or
    // mixed-case rows silently keep receiving mail after opting out.
    assert.match(sql, /lower\("als_buyer_contacts"\."email"\)/);
  });

  test("scales to a realistic opt-out list", () => {
    // 111 addresses is what Resend actually held on 2026-09-04.
    const emails = Array.from({ length: 111 }, (_, i) => `buyer${i}@example.com`);
    const { sql, params } = compile(emails);

    assert.equal(params.length, 111);
    assert.ok(!sql.includes("any(("), "row constructor reappeared at scale");
  });
});
