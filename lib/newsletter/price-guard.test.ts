import { test, describe } from "node:test";
import assert from "node:assert/strict";
import { scanForPriceClaims } from "./price-guard";

describe("scanForPriceClaims", () => {
  test("catches the exact claim that got through", () => {
    // Verbatim from the 2026-08-31 draft, the first one generated after the
    // system prompt was told never to quote per-lead pricing. $0.30 was also
    // below the partner's real $0.40 floor, so the prompt rule failed twice
    // over: it produced a price, and produced a wrong one.
    const html =
      "<p>why some agents turn $0.30 aged leads into six-figure years</p>";
    assert.deepEqual(scanForPriceClaims(html).blocking, ["$0.30"]);
  });

  test("catches prices spelled out in cents", () => {
    assert.ok(scanForPriceClaims("<p>leads for 25 cents each</p>").blocking.length > 0);
    assert.ok(scanForPriceClaims("<p>pennies — cents per lead</p>").blocking.length > 0);
  });

  test("whole-dollar figures warn but do not block", () => {
    // Fresh-lead costs are the partner's competitors' prices, not ours to
    // misstate, so a sourced $40 is legitimate — but a human should see it.
    const scan = scanForPriceClaims("<p>fresh $40 leads, per LeadsCouncil</p>");
    assert.deepEqual(scan.blocking, []);
    assert.deepEqual(scan.warnings, ["$40"]);
  });

  test("a clean issue passes", () => {
    const scan = scanForPriceClaims(
      "<p>a fraction of what fresh leads cost — see live pricing</p>",
    );
    assert.deepEqual(scan.blocking, []);
    assert.deepEqual(scan.warnings, []);
  });

  test("does not trip on digits inside markup", () => {
    // A tracking URL or a style rule must not read as a price claim.
    const html =
      '<a href="https://store.agedleadstore.com/x/leads?v=0.25" style="margin:0.25rem">Buy</a>';
    assert.deepEqual(scanForPriceClaims(html).blocking, []);
  });

  test("a blocked price is not also reported as a warning", () => {
    const scan = scanForPriceClaims("<p>$0.30 leads</p>");
    assert.deepEqual(scan.blocking, ["$0.30"]);
    assert.ok(!scan.warnings.includes("$0.30"));
  });
});
