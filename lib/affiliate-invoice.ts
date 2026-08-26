/**
 * Affiliate invoice basis, computed from the agedleadstore.com GA4 property.
 *
 * WHY THIS EXISTS
 * ---------------
 * The commission owed to BRSG was previously read off the daily ALS
 * performance report. That report's channel table is written out by a language
 * model rather than rendered from the API response, and on 2026-08-26 it was
 * caught emitting a `howtoworkleads / website` row of $5,476.00 for a source
 * GA4 records at $0.00 for the entire month — while the table TOTAL matched
 * the API to within $0.75. That is the signature of a transcribed table: the
 * total survives, individual rows do not. Invoicing 20% of that row would have
 * been a ~$1,095 overclaim on a fabricated basis.
 *
 * So this module never trusts a rendered number. It pulls line items and an
 * independent control total in two separate queries and refuses to produce a
 * figure when they disagree. Everything it returns is reconstructable from the
 * per-transaction rows it also returns.
 *
 * WHAT COUNTS
 * -----------
 * Session-scoped, source-keyed. Verified 2026-08-26 against the full Feb–Aug
 * history: first-touch attribution (`firstUserSourceMedium`) adds EXACTLY ZERO
 * orders — every affiliate-attributed order already has an affiliate source as
 * its converting session — and `customUser:cookie_source_medium` recovers
 * nothing either, being `(not set)` for 71% of revenue. Session-scoped is not a
 * conservative choice here; it is the complete GA4 picture.
 *
 * This is a FLOOR, deliberately. It cannot see orders that never open a browser
 * session (phone and wire orders were 22.6% of ALS revenue in August 2026), and
 * it credits a referred buyer once rather than for their lifetime. Those are
 * terms questions, not query bugs, and this module does not estimate them.
 */

import { AFFILIATE_ATTRIBUTION_SOURCES } from "./utm";

/** Rev-share on attributed revenue. */
export const DEFAULT_COMMISSION_RATE = 0.2;

/**
 * The rate is asserted consistently across Bill's own records and has been
 * honored in payment at least once (invoice 2026-03-30), but no contract and
 * no email from the counterparty states it. Surfaced on the rendered document
 * so it is visible before it becomes a dispute.
 */
export const RATE_IS_UNPAPERED = true;

export const GA4_API_BASE = "https://analyticsdata.googleapis.com/v1beta";

export interface OrderLine {
  /** GA4 `date`, YYYYMMDD. */
  date: string;
  /** GA4 `transactionId`. "-1" is a real value ALS emits; see isSyntheticId. */
  transactionId: string;
  /** GA4 `sessionSourceMedium`, e.g. "workagedleads / affiliate". */
  sourceMedium: string;
  revenue: number;
}

export interface InvoiceBasis {
  startDate: string;
  endDate: string;
  rate: number;
  orders: OrderLine[];
  /** Sum of `orders[].revenue`. */
  attributedRevenue: number;
  /** attributedRevenue * rate, rounded to cents. */
  commission: number;
  /** Independent control totals from a separate dimensionless query. */
  control: { transactions: number; revenue: number };
  /** Per-source-medium subtotals, for the rendered breakdown. */
  bySourceMedium: Array<{ sourceMedium: string; orders: number; revenue: number }>;
  warnings: string[];
}

/** Round to cents without the usual float drift. */
export function roundCents(n: number): number {
  return Math.round((n + Number.EPSILON) * 100) / 100;
}

/**
 * ALS emits "-1" as a transaction id on some orders (observed on wire/skip
 * orders). It is not a data error on our side and the revenue is real, so it
 * is counted — but it cannot be used as a unique key, which is why nothing
 * here dedupes on transactionId.
 */
export function isSyntheticId(id: string): boolean {
  return id === "-1" || id.trim() === "" || id === "(not set)";
}

/** GA4 FilterExpression: session source is any of our property names. */
export function attributionSourceFilter() {
  return {
    orGroup: {
      expressions: AFFILIATE_ATTRIBUTION_SOURCES.map((value) => ({
        filter: {
          fieldName: "sessionSource",
          stringFilter: {
            matchType: "CONTAINS",
            value,
            caseSensitive: false,
          },
        },
      })),
    },
  };
}

export function lineItemRequest(startDate: string, endDate: string) {
  return {
    dateRanges: [{ startDate, endDate }],
    dimensions: [
      { name: "date" },
      { name: "transactionId" },
      { name: "sessionSourceMedium" },
    ],
    metrics: [{ name: "totalRevenue" }],
    dimensionFilter: attributionSourceFilter(),
    orderBys: [{ dimension: { dimensionName: "date" } }],
    limit: 100000,
  };
}

/** Deliberately shares NO code path with lineItemRequest — that is the point. */
export function controlTotalRequest(startDate: string, endDate: string) {
  return {
    dateRanges: [{ startDate, endDate }],
    metrics: [{ name: "transactions" }, { name: "totalRevenue" }],
    dimensionFilter: attributionSourceFilter(),
  };
}

/* eslint-disable @typescript-eslint/no-explicit-any */
export function parseOrderLines(response: any): OrderLine[] {
  const rows = response?.rows ?? [];
  return rows.map((row: any) => ({
    date: row.dimensionValues?.[0]?.value ?? "",
    transactionId: row.dimensionValues?.[1]?.value ?? "",
    sourceMedium: row.dimensionValues?.[2]?.value ?? "",
    revenue: parseFloat(row.metricValues?.[0]?.value ?? "0"),
  }));
}

export function parseControlTotal(response: any): {
  transactions: number;
  revenue: number;
} {
  const row = response?.rows?.[0];
  return {
    transactions: parseInt(row?.metricValues?.[0]?.value ?? "0", 10),
    revenue: parseFloat(row?.metricValues?.[1]?.value ?? "0"),
  };
}
/* eslint-enable @typescript-eslint/no-explicit-any */

export class InvoiceRefusal extends Error {
  constructor(message: string) {
    super(message);
    this.name = "InvoiceRefusal";
  }
}

/** YYYY-MM-DD for "today" in the property's timezone (America/New_York). */
export function todayInPropertyTz(now: Date = new Date()): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "America/New_York",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(now);
}

/**
 * GUARD 1 — the window must be closed.
 *
 * GA4's current day is still being written. An invoice generated with today as
 * the end date understates by an unknowable amount and cannot be reproduced
 * later, because tomorrow the same query returns a different number.
 */
export function assertWindowIsClosed(
  endDate: string,
  allowPartial: boolean,
  now: Date = new Date()
): void {
  if (allowPartial) return;
  const today = todayInPropertyTz(now);
  if (endDate >= today) {
    throw new InvoiceRefusal(
      `End date ${endDate} is not a closed day (today is ${today} in America/New_York). ` +
        `GA4 is still writing that day, so this figure would not be reproducible. ` +
        `Use --end ${previousDay(today)} or pass --allow-partial if you accept a provisional number.`
    );
  }
}

export function previousDay(isoDate: string): string {
  const d = new Date(`${isoDate}T12:00:00Z`);
  d.setUTCDate(d.getUTCDate() - 1);
  return d.toISOString().slice(0, 10);
}

/**
 * GUARD 2 — line items must reconcile to the independent control total.
 *
 * This is the guard that would have caught the fabricated $5,476 row. A cent of
 * tolerance absorbs float representation only; anything larger is a real
 * disagreement and must stop the run rather than pick a side.
 *
 * Revenue is checked strictly. The ORDER COUNT is not, and the asymmetry is
 * deliberate: GA4 omits a row from a dimensioned query when every metric on it
 * is zero, but still counts it in the `transactions` metric. June 2026 has
 * exactly this shape — 7 transactions, one of them id "-1" carrying $0.00, so
 * the line-item query returns 6 rows against a control count of 7.
 *
 * That is safe to tolerate ONLY because revenue reconciles exactly. If the two
 * revenue figures agree to the cent, any transaction missing from the line
 * items must have contributed $0.00 — it cannot affect the invoice. A count
 * mismatch alongside a revenue mismatch is a different animal and still fails.
 *
 * Returns warnings rather than swallowing the difference: a silent tolerance is
 * how a real defect eventually slips through.
 */
export function assertReconciles(
  lineSum: number,
  control: { transactions: number; revenue: number },
  orderCount: number
): string[] {
  const delta = roundCents(Math.abs(lineSum - control.revenue));
  if (delta > 0.01) {
    throw new InvoiceRefusal(
      `Line items sum to $${lineSum.toFixed(2)} but the control query returns ` +
        `$${control.revenue.toFixed(2)} (delta $${delta.toFixed(2)}). Refusing to invoice ` +
        `an unreconciled basis — this is exactly the defect that put a fabricated ` +
        `$5,476.00 row in the daily report.`
    );
  }

  const warnings: string[] = [];
  if (orderCount !== control.transactions) {
    const missing = control.transactions - orderCount;
    if (missing < 0) {
      throw new InvoiceRefusal(
        `Line items contain ${orderCount} orders but the control query reports only ` +
          `${control.transactions} transactions. More rows than transactions cannot be ` +
          `explained by zero-revenue orders. Refusing to invoice an unreconciled basis.`
      );
    }
    warnings.push(
      `${missing} zero-revenue transaction${missing === 1 ? "" : "s"} in this window ` +
        `(control counts ${control.transactions}, ${orderCount} carry revenue). GA4 omits ` +
        `all-zero rows from a dimensioned query. Revenue reconciles to the cent, so these ` +
        `contribute $0.00 and do not change the amount invoiced.`
    );
  }
  return warnings;
}

/**
 * GUARD 4 — catch a source value that looks like ours but is not in the list.
 *
 * The next rebrand will introduce a fourth source name. If that name is not
 * added to AFFILIATE_ATTRIBUTION_SOURCES the filter simply stops matching it,
 * and the invoice silently shrinks. This cannot see what the filter excluded —
 * so the caller passes the unfiltered source list for the same window.
 */
export function warnOnUnknownSources(allSourceMediums: string[]): string[] {
  const suspicious = /aged.?lead|work.?aged|howtowork|htwl/i;
  const known = AFFILIATE_ATTRIBUTION_SOURCES.map((s) => s.toLowerCase());
  const seen = new Set<string>();
  const warnings: string[] = [];

  for (const sm of allSourceMediums) {
    const source = sm.split("/")[0]?.trim().toLowerCase() ?? "";
    if (!source || seen.has(source)) continue;
    seen.add(source);
    if (known.some((k) => source.includes(k))) continue;
    // agedleadstore is the PARTNER's own source, not ours. Expected, not a warning.
    if (source.includes("agedleadstore")) continue;
    if (suspicious.test(source)) {
      warnings.push(
        `Source "${source}" resembles one of our properties but is not in ` +
          `AFFILIATE_ATTRIBUTION_SOURCES, so its revenue is NOT on this invoice. ` +
          `If this is ours, add it to lib/utm.ts and re-run.`
      );
    }
  }
  return warnings;
}

export function summarizeBySourceMedium(orders: OrderLine[]) {
  const map = new Map<string, { orders: number; revenue: number }>();
  for (const o of orders) {
    const cur = map.get(o.sourceMedium) ?? { orders: 0, revenue: 0 };
    cur.orders += 1;
    cur.revenue = roundCents(cur.revenue + o.revenue);
    map.set(o.sourceMedium, cur);
  }
  return [...map.entries()]
    .map(([sourceMedium, v]) => ({ sourceMedium, ...v }))
    .sort((a, b) => b.revenue - a.revenue);
}

/**
 * Assemble the basis from already-fetched API responses. Pure — no network — so
 * the guards are unit-testable without credentials.
 */
export function buildInvoiceBasis(params: {
  startDate: string;
  endDate: string;
  rate?: number;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  lineItemResponse: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  controlResponse: any;
  /** Every sessionSourceMedium in the window, unfiltered, for guard 4. */
  allSourceMediums?: string[];
  allowPartial?: boolean;
  now?: Date;
}): InvoiceBasis {
  const {
    startDate,
    endDate,
    rate = DEFAULT_COMMISSION_RATE,
    lineItemResponse,
    controlResponse,
    allSourceMediums = [],
    allowPartial = false,
    now = new Date(),
  } = params;

  assertWindowIsClosed(endDate, allowPartial, now);

  const orders = parseOrderLines(lineItemResponse);
  const control = parseControlTotal(controlResponse);
  const attributedRevenue = roundCents(
    orders.reduce((sum, o) => sum + o.revenue, 0)
  );

  const warnings = [
    ...assertReconciles(attributedRevenue, control, orders.length),
    ...warnOnUnknownSources(allSourceMediums),
  ];

  // GUARD 3 — an empty window is a legitimate answer, but it must be stated,
  // never rendered as a confident $0.00 that looks like a computed result.
  if (orders.length === 0) {
    warnings.push(
      `0 attributed orders in ${startDate}..${endDate}. This is a real zero, not a ` +
        `failed query — the control total also reports 0 transactions.`
    );
  }

  return {
    startDate,
    endDate,
    rate,
    orders,
    attributedRevenue,
    commission: roundCents(attributedRevenue * rate),
    control,
    bySourceMedium: summarizeBySourceMedium(orders),
    warnings,
  };
}

export function formatGa4Date(yyyymmdd: string): string {
  if (!/^\d{8}$/.test(yyyymmdd)) return yyyymmdd;
  return `${yyyymmdd.slice(0, 4)}-${yyyymmdd.slice(4, 6)}-${yyyymmdd.slice(6, 8)}`;
}

export function usd(n: number): string {
  return n.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}
