import { test, describe } from "node:test";
import assert from "node:assert/strict";
import { applyWrites } from "./sync";
import type { MergedContact, WriteAction } from "./merge";

const contact = (email: string): MergedContact => ({
  email,
  firstName: null,
  lastName: null,
  unsubscribed: false,
  sources: ["s"],
});

const create = (email: string): WriteAction => ({ kind: "create", contact: contact(email) });
const suppress = (email: string): WriteAction => ({
  kind: "suppress",
  contact: contact(email),
  targetContactId: `id-${email}`,
});
const unchanged = (email: string): WriteAction => ({
  kind: "unchanged",
  contact: contact(email),
  reason: "already in sync",
});

describe("applyWrites", () => {
  test("suppressions run before creates, and unchanged rows are never written", async () => {
    const order: string[] = [];
    const result = await applyWrites(
      [create("a"), unchanged("b"), suppress("c"), create("d"), suppress("e")],
      async (a) => {
        order.push(`${a.kind}:${a.contact.email}`);
      },
    );
    assert.deepEqual(order, ["suppress:c", "suppress:e", "create:a", "create:d"]);
    assert.deepEqual(result, { created: 2, suppressed: 2, remaining: 0, stoppedBy: "done" });
  });

  // The property the cron rests on: a run cut short leaves new signups for
  // tomorrow, never an opt-out.
  test("a write cap keeps every suppression and drops creates first", async () => {
    const written: string[] = [];
    const result = await applyWrites(
      [create("a"), create("b"), suppress("c"), create("d")],
      async (a) => {
        written.push(a.contact.email);
      },
      { maxWrites: 2 },
    );
    assert.deepEqual(written, ["c", "a"]);
    assert.deepEqual(result, { created: 1, suppressed: 1, remaining: 2, stoppedBy: "max-writes" });
  });

  test("the deadline stops before the next write, not after", async () => {
    let clock = 0;
    const written: string[] = [];
    const result = await applyWrites(
      [create("a"), create("b"), create("c")],
      async (a) => {
        written.push(a.contact.email);
        clock += 100;
      },
      { deadline: 150, now: () => clock },
    );
    assert.deepEqual(written, ["a", "b"]);
    assert.equal(result.remaining, 1);
    assert.equal(result.stoppedBy, "deadline");
  });

  test("a failed write propagates so the cron records it", async () => {
    await assert.rejects(
      applyWrites([create("a")], async () => {
        throw new Error("boom");
      }),
      /boom/,
    );
  });
});
