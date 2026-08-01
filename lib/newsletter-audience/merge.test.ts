import { test, describe } from "node:test";
import assert from "node:assert/strict";
import {
  isPlausibleEmail,
  mergeAudiences,
  normalizeEmail,
  planWrites,
  summarizePlan,
  type ResendContactRow,
} from "./merge";

/** The property the whole migration rests on: a suppressed source contact must
 * reach the target suppressed, and a target opt-out must survive every rerun. */
function endToEndStates(
  sources: Parameters<typeof mergeAudiences>[0],
  suppression: Parameters<typeof mergeAudiences>[1],
  target: ResendContactRow[],
) {
  const { contacts } = mergeAudiences(sources, suppression);
  return planWrites(contacts, target);
}

function row(
  email: string,
  extra: Partial<ResendContactRow> = {},
): ResendContactRow {
  return { email, unsubscribed: false, ...extra };
}

describe("normalizeEmail / isPlausibleEmail", () => {
  test("normalizes case and surrounding whitespace", () => {
    assert.equal(normalizeEmail("  Bill@Example.COM "), "bill@example.com");
    assert.equal(normalizeEmail(null), "");
  });

  test("rejects the shapes that would 422 one at a time against the API", () => {
    for (const bad of ["", "nope", "a@b", "two@at@signs.com", "a b@c.com", "a@.com", "a@com."]) {
      assert.equal(isPlausibleEmail(bad), false, `expected ${bad} to be rejected`);
    }
    assert.equal(isPlausibleEmail("bill@example.com"), true);
  });
});

describe("mergeAudiences", () => {
  test("dedupes across sources, case-insensitively, and records both sources", () => {
    const { contacts, stats } = mergeAudiences([
      { name: "als", contacts: [row("Bill@Example.com"), row("solo@als.com")] },
      { name: "htwl", contacts: [row("bill@example.com"), row("solo@htwl.com")] },
    ]);

    assert.equal(stats.distinct, 3);
    assert.equal(stats.onMoreThanOneSource, 1);
    const shared = contacts.find((c) => c.email === "bill@example.com");
    assert.deepEqual(shared?.sources, ["als", "htwl"]);
  });

  test("unsubscribed wins no matter which source carries it, in either order", () => {
    const suppressedFirst = mergeAudiences([
      { name: "als", contacts: [row("x@y.com", { unsubscribed: true })] },
      { name: "htwl", contacts: [row("x@y.com", { unsubscribed: false })] },
    ]);
    const suppressedSecond = mergeAudiences([
      { name: "als", contacts: [row("x@y.com", { unsubscribed: false })] },
      { name: "htwl", contacts: [row("x@y.com", { unsubscribed: true })] },
    ]);

    assert.equal(suppressedFirst.contacts[0].unsubscribed, true);
    assert.equal(suppressedSecond.contacts[0].unsubscribed, true);
    assert.equal(suppressedFirst.stats.suppressed, 1);
    assert.equal(suppressedFirst.stats.sendable, 0);
  });

  test("keeps the first non-empty name regardless of source order", () => {
    const { contacts } = mergeAudiences([
      { name: "als", contacts: [row("x@y.com", { first_name: "", last_name: null })] },
      { name: "htwl", contacts: [row("x@y.com", { first_name: "Bill", last_name: "Rice" })] },
    ]);

    assert.equal(contacts[0].firstName, "Bill");
    assert.equal(contacts[0].lastName, "Rice");
  });

  test("an external suppression list overrides a source that says subscribed", () => {
    // The ALS case: the audience row reads subscribed because the opt-out was
    // recorded in Postgres, not in Resend.
    const { contacts, stats } = mergeAudiences(
      [{ name: "als-purchasers", contacts: [row("optedout@y.com"), row("fine@y.com")] }],
      [{ name: "postgres als_buyer_contacts", emails: ["OptedOut@Y.com "] }],
    );

    assert.equal(contacts.find((c) => c.email === "optedout@y.com")?.unsubscribed, true);
    assert.equal(contacts.find((c) => c.email === "fine@y.com")?.unsubscribed, false);
    assert.equal(stats.suppressed, 1);
    assert.equal(stats.sendable, 1);
    assert.deepEqual(stats.perSuppression, [
      {
        name: "postgres als_buyer_contacts",
        listed: 1,
        matched: 1,
        newlySuppressed: 1,
      },
    ]);
  });

  test("a suppression list never resubscribes and never adds anyone", () => {
    const { contacts, stats } = mergeAudiences(
      [{ name: "als", contacts: [row("already@y.com", { unsubscribed: true })] }],
      [
        { name: "list", emails: ["already@y.com", "not-on-any-source@y.com", "junk"] },
      ],
    );

    assert.deepEqual(
      contacts.map((c) => c.email),
      ["already@y.com"],
      "suppression must not introduce an address the audiences do not carry",
    );
    assert.equal(contacts[0].unsubscribed, true);
    assert.deepEqual(stats.perSuppression, [
      { name: "list", listed: 2, matched: 1, newlySuppressed: 0 },
    ]);
  });

  test("suppression lists union rather than override each other", () => {
    const { stats } = mergeAudiences(
      [{ name: "als", contacts: [row("a@y.com"), row("b@y.com"), row("c@y.com")] }],
      [
        { name: "postgres", emails: ["a@y.com"] },
        { name: "resend-flags", emails: ["b@y.com"] },
      ],
    );

    assert.equal(stats.suppressed, 2);
    assert.equal(stats.sendable, 1);
  });

  test("skips unusable addresses instead of shipping them to the API", () => {
    const { contacts, stats } = mergeAudiences([
      { name: "als", contacts: [row("good@y.com"), row(""), row("bad")] },
    ]);

    assert.deepEqual(
      contacts.map((c) => c.email),
      ["good@y.com"],
    );
    assert.equal(stats.skipped.length, 2);
    assert.equal(stats.perSource[0].rows, 3);
    assert.equal(stats.perSource[0].distinct, 1);
  });
});

describe("planWrites", () => {
  const merged = mergeAudiences([
    {
      name: "als",
      contacts: [
        row("new@y.com"),
        row("present@y.com"),
        row("newly-unsubbed@y.com", { unsubscribed: true }),
        row("optedout-on-target@y.com"),
        row("suppressed-new@y.com", { unsubscribed: true }),
      ],
    },
  ]).contacts;

  const target: ResendContactRow[] = [
    { id: "c1", email: "present@y.com", unsubscribed: false },
    { id: "c2", email: "newly-unsubbed@y.com", unsubscribed: false },
    { id: "c3", email: "OptedOut-On-Target@y.com", unsubscribed: true },
  ];

  test("creates only what the target is missing, carrying suppression in", () => {
    const actions = planWrites(merged, target);
    const created = actions.filter((a) => a.kind === "create");

    assert.deepEqual(
      created.map((a) => a.contact.email).sort(),
      ["new@y.com", "suppressed-new@y.com"],
    );
    assert.equal(
      created.find((a) => a.contact.email === "suppressed-new@y.com")?.contact
        .unsubscribed,
      true,
      "a suppressed source contact must land on the target already suppressed",
    );
  });

  test("suppresses a target contact the source says has opted out", () => {
    const actions = planWrites(merged, target);
    const suppress = actions.filter((a) => a.kind === "suppress");

    assert.equal(suppress.length, 1);
    assert.equal(suppress[0].contact.email, "newly-unsubbed@y.com");
    assert.equal(
      suppress[0].kind === "suppress" ? suppress[0].targetContactId : null,
      "c2",
    );
  });

  test("NEVER resubscribes someone who opted out on the target", () => {
    const actions = planWrites(merged, target);
    const optedOut = actions.find(
      (a) => a.contact.email === "optedout-on-target@y.com",
    );

    assert.equal(optedOut?.kind, "unchanged");
    assert.match(
      optedOut?.kind === "unchanged" ? optedOut.reason : "",
      /never resubscribe/,
    );
  });

  test("is idempotent — replanning against the applied state writes nothing", () => {
    const applied: ResendContactRow[] = merged.map((c, i) => ({
      id: `t${i}`,
      email: c.email,
      unsubscribed: c.unsubscribed,
    }));

    const summary = summarizePlan(planWrites(merged, applied));
    assert.deepEqual(summary, {
      create: 0,
      createSuppressed: 0,
      suppress: 0,
      unchanged: merged.length,
    });
  });

  test("a Postgres-only opt-out lands on the target already suppressed", () => {
    // End to end, this is the ALS bug: the audience says subscribed, Postgres
    // says opted out, and the target has never seen the address.
    const actions = endToEndStates(
      [{ name: "als-purchasers", contacts: [row("buyer@y.com")] }],
      [{ name: "postgres als_buyer_contacts", emails: ["buyer@y.com"] }],
      [],
    );

    assert.equal(actions.length, 1);
    assert.equal(actions[0].kind, "create");
    assert.equal(
      actions[0].contact.unsubscribed,
      true,
      "an opt-out recorded outside Resend must not be migrated as sendable",
    );
  });

  test("does not emit a suppress it cannot execute", () => {
    const actions = planWrites(
      mergeAudiences([
        { name: "als", contacts: [row("x@y.com", { unsubscribed: true })] },
      ]).contacts,
      [{ email: "x@y.com", unsubscribed: false }],
    );

    assert.equal(actions[0].kind, "unchanged");
  });
});
