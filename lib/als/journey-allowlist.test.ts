import { test, describe } from "node:test";
import assert from "node:assert/strict";
import { journeyLength, lifecycleStepIndex, type JourneyName } from "./lifecycle";

/**
 * Guards on the shape of the program after the 2026-09-04 restart.
 *
 * The lifecycle went dark for 34 days on a broken opt-out query. Because
 * next_due_at derives from a fixed anchor, every missed step of an overdue
 * journey is ALSO overdue, so the first working run would have sent 4,151 owed
 * emails — 483 people on seven consecutive days. The response was to shorten
 * the program to what the evidence supports and gate restarts by journey.
 *
 * These tests pin the decisions so a later edit cannot quietly undo them.
 */

describe("program shape after the Phase 1 restart", () => {
  test("welcome is three emails, not seven", () => {
    assert.equal(journeyLength("welcome"), 3);
  });

  test("ai-series is gone from the program", () => {
    const journeys = new Set(lifecycleStepIndex().map((s) => s.journey));
    assert.ok(!journeys.has("ai-series" as JourneyName), "ai-series still enrollable");
    assert.deepEqual([...journeys].sort(), ["replenishment", "welcome"]);
  });

  test("welcome keeps its original campaign slugs so GA4 history survives", () => {
    // Renaming these would reset the only performance record this program has.
    // Same reasoning that kept `header-nav` across the howtoworkleads retirement.
    const slugs = lifecycleStepIndex()
      .filter((s) => s.journey === "welcome")
      .sort((a, b) => a.step - b.step)
      .map((s) => s.campaign);
    assert.deepEqual(slugs, ["welcome-e2", "welcome-e3", "welcome-e7"]);
  });

  test("welcome cadence never puts two emails on consecutive days", () => {
    const offsets = lifecycleStepIndex()
      .filter((s) => s.journey === "welcome")
      .sort((a, b) => a.step - b.step)
      .map((s) => s.offsetDays);
    for (let i = 1; i < offsets.length; i++) {
      assert.ok(
        offsets[i] - offsets[i - 1] >= 3,
        `steps ${i} and ${i + 1} are ${offsets[i] - offsets[i - 1]} day(s) apart`,
      );
    }
  });

  test("the shortened program fits under the send cap at the observed arrival rate", () => {
    // ~11 new contacts/day. Seven welcome + seven ai-series was ~154/day of
    // structural demand against a 150/day cap — oversubscribed by design, which
    // is why a backlog existed before the outage and would rebuild after it.
    const ARRIVALS_PER_DAY = 11;
    const CAP = 150;
    const perContact = lifecycleStepIndex().filter((s) => s.journey === "welcome").length;
    assert.ok(
      ARRIVALS_PER_DAY * perContact < CAP,
      `welcome alone would demand ${ARRIVALS_PER_DAY * perContact}/day against a ${CAP} cap`,
    );
  });
});

/**
 * The alarm that was missing. A zero-send run looked exactly like a quiet day
 * for 34 days. Expressed here as the predicate the route applies, so the
 * conditions stay pinned even though the route itself needs a live request.
 */
function sentNothingWhileDue(
  live: boolean,
  sent: number,
  dueScanned: number,
  reorderExits = 0,
): boolean {
  return live && sent === 0 && dueScanned - reorderExits > 0;
}

describe("zero-send alarm", () => {
  test("fires when rows were due and nothing moved — the 34-day failure", () => {
    assert.equal(sentNothingWhileDue(true, 0, 715), true);
  });

  test("stays quiet on a genuinely empty queue", () => {
    assert.equal(sentNothingWhileDue(true, 0, 0), false);
  });

  test("stays quiet on a normal run", () => {
    assert.equal(sentNothingWhileDue(true, 40, 124), false);
  });

  test("stays quiet on a dry run, which sends nothing by design", () => {
    assert.equal(sentNothingWhileDue(false, 0, 715), false);
  });

  test("stays quiet when the whole queue was reorder-exits", () => {
    // Those rows close without sending because the buyer already bought again.
    // A run like that sent zero and was entirely healthy — flagging it would
    // train the alarm to be ignored, which is how the last outage was missed.
    assert.equal(sentNothingWhileDue(true, 0, 9, 9), false);
  });

  test("still fires when only SOME of the queue was reorder-exits", () => {
    assert.equal(sentNothingWhileDue(true, 0, 27, 9), true);
  });
});
