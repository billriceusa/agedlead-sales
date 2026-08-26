import { test } from "node:test";
import assert from "node:assert/strict";

import {
  AFFILIATE_ATTRIBUTION_SOURCES,
  AFFILIATE_UTM_SOURCE,
  AFFILIATE_UTM_SOURCE_LEGACY,
  AFFILIATE_UTM_SOURCE_LEGACY_HTWL,
} from "./utm";
import {
  DEFAULT_COMMISSION_RATE,
  InvoiceRefusal,
  assertReconciles,
  assertWindowIsClosed,
  attributionSourceFilter,
  buildInvoiceBasis,
  controlTotalRequest,
  lineItemRequest,
  previousDay,
  roundCents,
  summarizeBySourceMedium,
  todayInPropertyTz,
  warnOnUnknownSources,
} from "./affiliate-invoice";

// ---------------------------------------------------------------------------
// The source list — the single most expensive thing to get wrong
// ---------------------------------------------------------------------------

test("attribution sources include howtoworkleads, which carried most of the revenue", () => {
  // howtoworkleads.com was $18,303.25 in March 2026 and $9,282.60 in July,
  // against $616.50 for both newer sources combined in August. Omitting it does
  // not error — the query just returns less money.
  assert.ok(AFFILIATE_ATTRIBUTION_SOURCES.includes(AFFILIATE_UTM_SOURCE_LEGACY_HTWL));
  assert.ok(AFFILIATE_ATTRIBUTION_SOURCES.includes(AFFILIATE_UTM_SOURCE));
  assert.ok(AFFILIATE_ATTRIBUTION_SOURCES.includes(AFFILIATE_UTM_SOURCE_LEGACY));
  assert.equal(new Set(AFFILIATE_ATTRIBUTION_SOURCES).size, 3);
});

test("the invoice filter keys on source and never constrains medium", () => {
  // howtoworkleads.com tagged its links utm_medium=website, not affiliate.
  // Pinning medium="affiliate" returns $0.00 for every pre-rebrand month while
  // looking perfectly healthy.
  const filter = JSON.stringify(attributionSourceFilter());
  assert.match(filter, /sessionSource/);
  assert.doesNotMatch(filter, /sessionMedium/);
  assert.doesNotMatch(filter, /"affiliate"/);
  for (const source of AFFILIATE_ATTRIBUTION_SOURCES) {
    assert.ok(filter.includes(source), `filter must match ${source}`);
  }
});

test("line-item and control requests both carry the same source filter", () => {
  const line = lineItemRequest("2026-07-27", "2026-08-26");
  const control = controlTotalRequest("2026-07-27", "2026-08-26");
  assert.deepEqual(line.dimensionFilter, control.dimensionFilter);
  // The control query must stay dimensionless — an independent path to the
  // same number is the whole point of the reconciliation guard.
  assert.equal("dimensions" in control, false);
  assert.equal(line.dimensions.length, 3);
});

// ---------------------------------------------------------------------------
// Guard 1 — closed window
// ---------------------------------------------------------------------------

const NOW = new Date("2026-08-26T16:00:00Z"); // 12:00 ET on 2026-08-26

test("todayInPropertyTz resolves in the property's timezone", () => {
  assert.equal(todayInPropertyTz(NOW), "2026-08-26");
  // 01:00Z on the 27th is still the 26th in New York.
  assert.equal(todayInPropertyTz(new Date("2026-08-27T01:00:00Z")), "2026-08-26");
});

test("refuses an end date of today, because GA4 is still writing it", () => {
  assert.throws(
    () => assertWindowIsClosed("2026-08-26", false, NOW),
    (err: Error) => err instanceof InvoiceRefusal && /not a closed day/.test(err.message)
  );
});

test("refuses a future end date", () => {
  assert.throws(() => assertWindowIsClosed("2026-08-27", false, NOW), InvoiceRefusal);
});

test("accepts the last closed day, and honours --allow-partial", () => {
  assert.doesNotThrow(() => assertWindowIsClosed("2026-08-25", false, NOW));
  assert.doesNotThrow(() => assertWindowIsClosed("2026-08-27", true, NOW));
});

test("previousDay crosses month boundaries", () => {
  assert.equal(previousDay("2026-08-26"), "2026-08-25");
  assert.equal(previousDay("2026-08-01"), "2026-07-31");
  assert.equal(previousDay("2026-03-01"), "2026-02-28");
});

// ---------------------------------------------------------------------------
// Guard 2 — reconciliation. The fabricated-row guard.
// ---------------------------------------------------------------------------

test("reconciles when line items match the control total", () => {
  assert.doesNotThrow(() =>
    assertReconciles(616.5, { transactions: 3, revenue: 616.5 }, 3)
  );
});

test("refuses when a phantom row inflates the line items", () => {
  // The real defect: the daily report carried a $5,476.00 row for a source GA4
  // records at $0.00, while its TOTAL still matched the API to $0.75.
  assert.throws(
    () => assertReconciles(6092.5, { transactions: 3, revenue: 616.5 }, 4),
    (err: Error) =>
      err instanceof InvoiceRefusal && /Refusing to invoice an unreconciled basis/.test(err.message)
  );
});

test("tolerates a zero-revenue transaction, but says so out loud", () => {
  // Real shape, June 2026: 7 transactions, one of them id "-1" carrying $0.00.
  // GA4 omits all-zero rows from a dimensioned query but still counts them in
  // `transactions`. Safe ONLY because revenue reconciles exactly — a missing
  // order that reconciles must have contributed nothing.
  const warnings = assertReconciles(1329.95, { transactions: 7, revenue: 1329.95 }, 6);
  assert.equal(warnings.length, 1);
  assert.match(warnings[0], /1 zero-revenue transaction/);
  assert.match(warnings[0], /do not change the amount invoiced/);
});

test("refuses when there are MORE rows than transactions", () => {
  // Cannot be explained by zero-revenue orders in the other direction.
  assert.throws(
    () => assertReconciles(616.5, { transactions: 2, revenue: 616.5 }, 3),
    (err: Error) =>
      err instanceof InvoiceRefusal && /More rows than transactions/.test(err.message)
  );
});

test("a count mismatch does NOT excuse a revenue mismatch", () => {
  assert.throws(
    () => assertReconciles(6092.5, { transactions: 7, revenue: 616.5 }, 6),
    (err: Error) => err instanceof InvoiceRefusal && /delta/.test(err.message)
  );
});

test("tolerates sub-cent float drift only", () => {
  assert.doesNotThrow(() =>
    assertReconciles(616.5000000001, { transactions: 3, revenue: 616.5 }, 3)
  );
  assert.throws(
    () => assertReconciles(616.55, { transactions: 3, revenue: 616.5 }, 3),
    InvoiceRefusal
  );
});

// ---------------------------------------------------------------------------
// Guard 4 — an unrecognised source that looks like ours
// ---------------------------------------------------------------------------

test("warns on a rebrand the source list has not caught up with", () => {
  const warnings = warnOnUnknownSources([
    "workagedleads / affiliate",
    "buyagedleads / affiliate", // the hypothetical next rebrand
    "google / organic",
  ]);
  assert.equal(warnings.length, 1);
  assert.match(warnings[0], /buyagedleads/);
});

test("does not warn on the partner's own source or ordinary traffic", () => {
  const warnings = warnOnUnknownSources([
    "agedleadstore / email", // ALS's own sends, not ours
    "workagedleads / affiliate",
    "howtoworkleads / website",
    "google / cpc",
    "(direct) / (none)",
  ]);
  assert.deepEqual(warnings, []);
});

// ---------------------------------------------------------------------------
// Assembly + math
// ---------------------------------------------------------------------------

function ga4Rows(rows: Array<[string, string, string, string]>) {
  return {
    rows: rows.map(([date, txId, sourceMedium, revenue]) => ({
      dimensionValues: [{ value: date }, { value: txId }, { value: sourceMedium }],
      metricValues: [{ value: revenue }],
    })),
  };
}

function ga4Control(transactions: number, revenue: number) {
  return {
    rows: [
      {
        metricValues: [{ value: String(transactions) }, { value: String(revenue) }],
      },
    ],
  };
}

test("builds the real Jul 27 - Aug 26 basis and applies 20%", () => {
  const basis = buildInvoiceBasis({
    startDate: "2026-07-27",
    endDate: "2026-08-26",
    lineItemResponse: ga4Rows([
      ["20260806", "20260806083124Qr3x", "agedleadsales / affiliate", "255"],
      ["20260812", "20260812091043LPFv", "workagedleads / affiliate", "211.5"],
      ["20260818", "20260818105839Pxoc", "workagedleads / affiliate", "150"],
    ]),
    controlResponse: ga4Control(3, 616.5),
    now: new Date("2026-08-27T16:00:00Z"),
  });

  assert.equal(basis.attributedRevenue, 616.5);
  assert.equal(basis.commission, 123.3);
  assert.equal(basis.rate, DEFAULT_COMMISSION_RATE);
  assert.equal(basis.orders.length, 3);
  assert.deepEqual(basis.warnings, []);
});

test("a window split across the rebrand sums both source values", () => {
  // August 2026 genuinely holds two source names because the emitted value
  // flipped on 2026-08-04. Reporting either alone halves the invoice.
  const basis = buildInvoiceBasis({
    startDate: "2026-08-01",
    endDate: "2026-08-25",
    lineItemResponse: ga4Rows([
      ["20260806", "a", "agedleadsales / affiliate", "255"],
      ["20260812", "b", "workagedleads / affiliate", "211.5"],
      ["20260818", "c", "workagedleads / affiliate", "150"],
    ]),
    controlResponse: ga4Control(3, 616.5),
    now: new Date("2026-08-27T16:00:00Z"),
  });
  assert.equal(basis.bySourceMedium.length, 2);
  assert.equal(basis.attributedRevenue, 616.5);
});

test("an empty window is reported as a stated zero, not a silent one", () => {
  const basis = buildInvoiceBasis({
    startDate: "2026-01-01",
    endDate: "2026-01-31",
    lineItemResponse: { rows: [] },
    controlResponse: ga4Control(0, 0),
    now: new Date("2026-08-27T16:00:00Z"),
  });
  assert.equal(basis.attributedRevenue, 0);
  assert.equal(basis.commission, 0);
  assert.equal(basis.warnings.length, 1);
  assert.match(basis.warnings[0], /real zero, not a\s+failed query/);
});

test("the synthetic -1 transaction id still counts toward revenue", () => {
  // ALS emits -1 on some wire/skip orders. The id is unusable as a key but the
  // money is real, so it must not be dropped.
  const basis = buildInvoiceBasis({
    startDate: "2026-05-01",
    endDate: "2026-05-31",
    lineItemResponse: ga4Rows([
      ["20260501", "-1", "howtoworkleads / website", "488.7"],
      ["20260501", "20260501072424N9Zc", "howtoworkleads / website", "6495"],
    ]),
    controlResponse: ga4Control(2, 6983.7),
    now: new Date("2026-08-27T16:00:00Z"),
  });
  assert.equal(basis.attributedRevenue, 6983.7);
  assert.equal(basis.commission, 1396.74);
});

test("roundCents does not drift on repeated addition", () => {
  const vals = [0.1, 0.2, 255, 211.5, 150, 100.5, 100.5];
  const sum = vals.reduce((a, b) => roundCents(a + b), 0);
  assert.equal(sum, 817.8);
});

test("summarizeBySourceMedium orders by revenue descending", () => {
  const rows = summarizeBySourceMedium([
    { date: "20260806", transactionId: "a", sourceMedium: "agedleadsales / affiliate", revenue: 255 },
    { date: "20260812", transactionId: "b", sourceMedium: "workagedleads / affiliate", revenue: 211.5 },
    { date: "20260818", transactionId: "c", sourceMedium: "workagedleads / affiliate", revenue: 150 },
  ]);
  assert.equal(rows[0].sourceMedium, "workagedleads / affiliate");
  assert.equal(rows[0].revenue, 361.5);
  assert.equal(rows[0].orders, 2);
  assert.equal(rows[1].revenue, 255);
});
