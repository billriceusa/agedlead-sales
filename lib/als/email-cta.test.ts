import { test, describe } from "node:test";
import assert from "node:assert/strict";
import { renderLifecycleEmail, lifecycleStepIndex } from "./lifecycle";

/**
 * The buy door has to sit in the top third of every lifecycle email.
 *
 * This list has already shown intent — they either bought aged leads or asked
 * how to buy them. Burying the only buy button under the whole email taxes
 * exactly the people most likely to act on it (Bill, 2026-09-04).
 *
 * Measured against the body region, not the raw document, so the header table
 * and the footer's unsubscribe boilerplate cannot flatter the number.
 */

const ctx = {
  firstName: "Dana",
  vertical: null,
  states: null,
  lastOrderAmount: null,
  lifetimeOrders: null,
};

/** The copy region: everything between the body cell and the closing CTA. */
function bodyRegion(html: string): string {
  const start = html.indexOf("font-size:15px;line-height:1.62");
  const end = html.indexOf("standing-cta");
  assert.ok(start !== -1 && end > start, "could not locate the body region");
  return html.slice(start, end);
}

describe("buy CTA placement", () => {
  for (const s of lifecycleStepIndex()) {
    test(`${s.journey} step ${s.step} (${s.campaign}) puts a buy door in the top third`, () => {
      const { html } = renderLifecycleEmail(s.journey, s.step, ctx);
      const body = bodyRegion(html);
      const at = body.indexOf("top-cta");

      assert.ok(at !== -1, "no top CTA rendered");
      const position = at / body.length;
      assert.ok(
        position < 1 / 3,
        `top CTA sits ${(position * 100).toFixed(0)}% into the body, not the top third`,
      );
    });

    test(`${s.journey} step ${s.step} keeps both doors tagged to the campaign`, () => {
      const { html, campaign } = renderLifecycleEmail(s.journey, s.step, ctx);
      // Both placements carry the campaign, and differ only by utm_content, so
      // the scoreboard can say which position earned rather than guessing.
      assert.ok(html.includes(`utm_campaign=${campaign}&utm_content=top-cta`));
      assert.ok(html.includes(`utm_campaign=${campaign}&utm_content=standing-cta`));
    });
  }

  test("the top door never precedes the greeting", () => {
    // It goes after the opening paragraph, not above it — leading with a button
    // before a word of copy reads as an ad, which is what loses this audience.
    const { html } = renderLifecycleEmail("welcome", 1, ctx);
    const body = bodyRegion(html);
    assert.ok(body.indexOf("Hi Dana") < body.indexOf("top-cta"));
  });
});
