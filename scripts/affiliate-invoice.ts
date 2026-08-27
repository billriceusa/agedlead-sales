/**
 * Generate the affiliate invoice basis for a billing window.
 *
 *   npx tsx scripts/affiliate-invoice.ts --start 2026-07-27 --end 2026-08-26
 *
 * Auth: Application Default Credentials.
 *
 *   gcloud auth application-default login
 *
 * NOT the Vercel-OIDC service account the crons use. That account authenticates
 * only inside a Vercel deployment, and it cannot read the agedleadstore.com
 * property at all (lib/cron/als-email-report.ts degrades with a note when
 * ALS_STORE_GA4_PROPERTY_ID is unreadable). The invoice needs that property, so
 * it runs as Bill.
 *
 * Writes an HTML backing document and a CSV of line items. The number printed
 * at the end is the one to key into FreshBooks.
 */

import { spawnSync } from "node:child_process";
import { writeFileSync, mkdirSync, existsSync, statSync } from "node:fs";
import { join, resolve } from "node:path";
import { GoogleAuth } from "google-auth-library";

import {
  DEFAULT_COMMISSION_RATE,
  GA4_API_BASE,
  InvoiceRefusal,
  buildInvoiceBasis,
  controlTotalRequest,
  formatGa4Date,
  lineItemRequest,
  usd,
  type InvoiceBasis,
} from "../lib/affiliate-invoice";
import { AFFILIATE_ATTRIBUTION_SOURCES } from "../lib/utm";

const ALS_PROPERTY_ID = process.env.ALS_STORE_GA4_PROPERTY_ID || "357329146";

const DEFAULT_OUT = join(
  process.env.HOME || ".",
  "Documents/brsg/sites/agedleadsales/invoices"
);

interface Args {
  start: string;
  end: string;
  rate: number;
  out: string;
  allowPartial: boolean;
  label?: string;
}

function parseArgs(argv: string[]): Args {
  const get = (name: string): string | undefined => {
    const i = argv.indexOf(`--${name}`);
    return i >= 0 ? argv[i + 1] : undefined;
  };
  const start = get("start");
  const end = get("end");
  if (!start || !end) {
    console.error(
      "Usage: tsx scripts/affiliate-invoice.ts --start YYYY-MM-DD --end YYYY-MM-DD\n" +
        "       [--rate 0.2] [--out DIR] [--label \"Jul 2026\"] [--allow-partial]"
    );
    process.exit(2);
  }
  for (const [n, v] of [["start", start], ["end", end]] as const) {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(v)) {
      console.error(`--${n} must be YYYY-MM-DD, got "${v}"`);
      process.exit(2);
    }
  }
  if (start > end) {
    console.error(`--start ${start} is after --end ${end}`);
    process.exit(2);
  }
  return {
    start,
    end,
    rate: get("rate") ? Number(get("rate")) : DEFAULT_COMMISSION_RATE,
    out: resolve(get("out") || DEFAULT_OUT),
    allowPartial: argv.includes("--allow-partial"),
    label: get("label"),
  };
}

async function ga4(
  client: Awaited<ReturnType<GoogleAuth["getClient"]>>,
  body: unknown
) {
  const res = await client.request({
    url: `${GA4_API_BASE}/properties/${ALS_PROPERTY_ID}:runReport`,
    method: "POST",
    data: body,
  });
  return res.data;
}

/** Every source/medium in the window, unfiltered — feeds the unknown-source guard. */
function allSourceMediumsRequest(startDate: string, endDate: string) {
  return {
    dateRanges: [{ startDate, endDate }],
    dimensions: [{ name: "sessionSourceMedium" }],
    metrics: [{ name: "sessions" }],
    limit: 500,
  };
}

function esc(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/**
 * Print the backing document to PDF, because the PDF is what actually gets
 * attached to the FreshBooks invoice.
 *
 * Headless Chrome, with `--no-pdf-header-footer` deliberately: Chrome's default
 * footer stamps the source `file:///Users/billrice/...` path across the bottom
 * of every page, and this document goes to the partner.
 *
 * Returns null rather than throwing if no browser is installed. The HTML and
 * CSV are already on disk at that point and the commission figure is already
 * computed — refusing to finish over a missing convenience would be worse than
 * telling the caller to print it themselves. A refusal here would also be
 * indistinguishable from the reconciliation guards, which mean something.
 */
function renderPdf(htmlPath: string, pdfPath: string): string | null {
  const candidates = [
    process.env.CHROME_BIN,
    "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
    "/Applications/Chromium.app/Contents/MacOS/Chromium",
    "/Applications/Microsoft Edge.app/Contents/MacOS/Microsoft Edge",
  ].filter((p): p is string => Boolean(p));
  const chrome = candidates.find((p) => existsSync(p));
  if (!chrome) {
    console.warn(
      `\n  ! No Chrome/Chromium found, so no PDF was written. Open the HTML and\n` +
        `    print to PDF, or set CHROME_BIN. Looked in:\n` +
        candidates.map((p) => `      ${p}`).join("\n")
    );
    return null;
  }

  const res = spawnSync(
    chrome,
    [
      "--headless",
      "--disable-gpu",
      "--no-pdf-header-footer",
      `--print-to-pdf=${pdfPath}`,
      `file://${htmlPath}`,
    ],
    { encoding: "utf8", timeout: 60_000 }
  );

  // Chrome exits 0 and chatters unrelated warnings to stderr even on success,
  // so trust the artifact, not the exit code: a non-empty file is the proof.
  if (!existsSync(pdfPath) || statSync(pdfPath).size === 0) {
    console.warn(
      `\n  ! Chrome did not produce a PDF (exit ${res.status}). HTML and CSV are\n` +
        `    still written; print the HTML manually.\n` +
        (res.stderr ? `    ${res.stderr.trim().split("\n").slice(-3).join("\n    ")}\n` : "")
    );
    return null;
  }
  return pdfPath;
}

function renderCsv(basis: InvoiceBasis): string {
  const lines = ["date,transaction_id,source_medium,attributed_revenue_usd"];
  for (const o of basis.orders) {
    lines.push(
      [
        formatGa4Date(o.date),
        `"${o.transactionId.replace(/"/g, '""')}"`,
        `"${o.sourceMedium.replace(/"/g, '""')}"`,
        o.revenue.toFixed(2),
      ].join(",")
    );
  }
  lines.push(`TOTAL,,,${basis.attributedRevenue.toFixed(2)}`);
  lines.push(
    `COMMISSION @ ${(basis.rate * 100).toFixed(0)}%,,,${basis.commission.toFixed(2)}`
  );
  return lines.join("\n") + "\n";
}

function renderHtml(basis: InvoiceBasis, label: string): string {
  const period = `${basis.startDate} to ${basis.endDate}`;
  const rows = basis.orders
    .map(
      (o) => `      <tr>
        <td class="mono">${esc(formatGa4Date(o.date))}</td>
        <td class="mono id">${esc(o.transactionId)}</td>
        <td class="mono">${esc(o.sourceMedium)}</td>
        <td class="mono num">${esc(usd(o.revenue))}</td>
      </tr>`
    )
    .join("\n");

  const breakdown = basis.bySourceMedium
    .map(
      (s) => `      <tr>
        <td class="mono">${esc(s.sourceMedium)}</td>
        <td class="mono num">${s.orders}</td>
        <td class="mono num">${esc(usd(s.revenue))}</td>
      </tr>`
    )
    .join("\n");

  const warnings = basis.warnings.length
    ? `<div class="warn"><strong>Notes</strong><ul>${basis.warnings
        .map((w) => `<li>${esc(w)}</li>`)
        .join("")}</ul></div>`
    : "";

  const emptyState = basis.orders.length
    ? ""
    : `<p class="empty">No attributed orders in this window. The control query independently
       reports 0 transactions, so this is a measured zero rather than a failed query.</p>`;

  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>Affiliate Commission ${esc(label)} &mdash; ${esc(period)}</title>
<style>
  :root{ --ink:#14181d; --muted:#5d6b76; --rule:#e2e7ea; --bg:#ffffff; --accent:#0f6fb0; --zebra:#f7f9fa; }
  *{box-sizing:border-box}
  body{margin:0;padding:44px 32px 72px;background:var(--bg);color:var(--ink);
    font:15px/1.6 -apple-system,BlinkMacSystemFont,"Segoe UI",Helvetica,Arial,sans-serif;}
  .doc{max-width:900px;margin:0 auto}
  h1{font-size:23px;margin:0 0 4px;letter-spacing:-.01em}
  .sub{color:var(--muted);font-size:14px;margin:0 0 28px}
  .box{border:1px solid var(--rule);border-radius:8px;padding:20px 24px;margin:0 0 26px;background:var(--bg)}
  .headline{display:flex;flex-wrap:wrap;gap:28px;align-items:flex-end;justify-content:space-between}
  .amt{font-size:34px;font-weight:600;letter-spacing:-.02em;font-variant-numeric:tabular-nums}
  .amt .lab{display:block;font-size:11px;font-weight:500;letter-spacing:.09em;
    text-transform:uppercase;color:var(--muted);margin-bottom:5px}
  .calc{color:var(--muted);font-size:13.5px;font-variant-numeric:tabular-nums}
  h2{font-size:13px;letter-spacing:.08em;text-transform:uppercase;color:var(--muted);
    margin:34px 0 10px;font-weight:600}
  table{width:100%;border-collapse:collapse;font-size:13.5px}
  th,td{text-align:left;padding:8px 10px;border-bottom:1px solid var(--rule)}
  th{font-size:11px;letter-spacing:.07em;text-transform:uppercase;color:var(--muted);font-weight:600}
  tbody tr:nth-child(even){background:var(--zebra)}
  .mono{font-family:ui-monospace,SFMono-Regular,Menlo,monospace;font-variant-numeric:tabular-nums}
  .num{text-align:right}
  .id{color:var(--muted);font-size:12.5px}
  tfoot td{border-top:2px solid var(--ink);border-bottom:none;font-weight:600;padding-top:10px}
  .warn{border-left:3px solid #c8801a;background:#fdf6ec;padding:12px 16px;border-radius:0 6px 6px 0;margin:22px 0;font-size:13.5px}
  .warn ul{margin:6px 0 0;padding-left:18px}
  .empty{color:var(--muted);font-style:italic}
  .method{font-size:13px;color:var(--muted);line-height:1.65}
  .method code{font-family:ui-monospace,Menlo,monospace;font-size:12.5px;background:#f2f5f7;padding:1px 4px;border-radius:3px}
  .method li{margin:6px 0}
  footer{margin-top:38px;padding-top:16px;border-top:1px solid var(--rule);font-size:12px;color:var(--muted)}
  /* Print is the primary delivery format — this document is attached to a
     FreshBooks invoice as a PDF. A short window must land on one page; the
     method notes spilling three orphan lines onto a second sheet reads as
     careless on something a partner receives. Long windows (the Apr-Jul
     catch-up carries 35 orders) legitimately paginate. */
  @page{size:letter;margin:14mm 13mm}
  @media print{
    body{padding:0;font-size:14px}
    .box{break-inside:avoid;padding:15px 20px;margin-bottom:18px}
    /* Per-ROW, not per-table: the orders table runs to 35 rows on a catch-up
       window and is taller than a sheet, so a whole-table break-inside:avoid would
       be an unsatisfiable hint that just strands a blank page ahead of it.
       (Rule written without backticks on purpose: this CSS lives inside a
       template literal.)
       Repeat the header on each page instead. */
    tr{break-inside:avoid}
    thead{display:table-header-group}
    tfoot{display:table-row-group}
    th,td{padding:6px 10px}
    h1{font-size:21px}
    .sub{margin-bottom:18px}
    .amt{font-size:29px}
    h2{margin:18px 0 7px}
    .method{font-size:11.6px;line-height:1.5}
    .method li{margin:3px 0}
    .method code{font-size:11px}
    footer{margin-top:18px;padding-top:11px}
  }
</style>
</head>
<body>
<div class="doc">

  <h1>Affiliate Commission &mdash; ${esc(label)}</h1>
  <p class="sub">Bill Rice Strategy Group &middot; referred revenue to agedleadstore.com &middot; ${esc(period)}</p>

  <div class="box headline">
    <div class="amt"><span class="lab">Commission due</span>${esc(usd(basis.commission))}</div>
    <div class="calc">
      ${esc(usd(basis.attributedRevenue))} attributed revenue &times; ${(basis.rate * 100).toFixed(0)}%<br>
      ${basis.orders.length} order${basis.orders.length === 1 ? "" : "s"} across ${basis.bySourceMedium.length} source${basis.bySourceMedium.length === 1 ? "" : "s"}
    </div>
  </div>

  ${warnings}
  ${emptyState}

  ${
    basis.bySourceMedium.length
      ? `<h2>By source</h2>
  <table>
    <thead><tr><th>Source / medium</th><th class="num">Orders</th><th class="num">Revenue</th></tr></thead>
    <tbody>
${breakdown}
    </tbody>
  </table>`
      : ""
  }

  ${
    basis.orders.length
      ? `<h2>Orders</h2>
  <table>
    <thead><tr><th>Date</th><th>Transaction ID</th><th>Source / medium</th><th class="num">Revenue</th></tr></thead>
    <tbody>
${rows}
    </tbody>
    <tfoot>
      <tr>
        <td colspan="3">Attributed revenue</td>
        <td class="mono num">${esc(usd(basis.attributedRevenue))}</td>
      </tr>
      <tr>
        <td colspan="3">Commission at ${(basis.rate * 100).toFixed(0)}%</td>
        <td class="mono num">${esc(usd(basis.commission))}</td>
      </tr>
    </tfoot>
  </table>`
      : ""
  }

  <h2>Method</h2>
  <ul class="method">
    <li>Source: Google Analytics 4 property <code>${esc(ALS_PROPERTY_ID)}</code> (agedleadstore.com), Data API <code>runReport</code>.</li>
    <li>Included: sessions whose <code>sessionSource</code> is any of
        ${AFFILIATE_ATTRIBUTION_SOURCES.map((s) => `<code>${esc(s)}</code>`).join(", ")}
        &mdash; every value these properties have emitted. Matched on source only:
        howtoworkleads.com tagged its links <code>utm_medium=website</code>, so a
        medium-constrained filter would report zero for those months.</li>
    <li>Attribution: session-scoped (the converting session's source). Verified against the
        full Feb&ndash;Aug 2026 history &mdash; first-touch attribution adds no additional orders,
        and the first-party <code>cookie_source_medium</code> dimension recovers none either.</li>
    <li>Every figure above is the sum of the itemised orders. Line items were reconciled against an
        independent dimensionless control query before this document was written; a mismatch of more
        than one cent aborts generation rather than picking a side.</li>
    <li>This is a floor. GA4 cannot see orders placed without a browser session (phone and wire
        orders), and a referred buyer is credited once rather than for their lifetime.</li>
    <li>Rate applied: ${(basis.rate * 100).toFixed(0)}%. Not established by a countersigned
        agreement &mdash; noted here so it is settled deliberately rather than discovered in dispute.</li>
  </ul>

  <footer>
    Generated ${new Date().toISOString().slice(0, 10)} by <code>scripts/affiliate-invoice.ts</code>.
    Control total: ${basis.control.transactions} transactions / ${esc(usd(basis.control.revenue))}.
  </footer>

</div>
</body>
</html>
`;
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const label = args.label || `${args.start} to ${args.end}`;

  const auth = new GoogleAuth({
    scopes: ["https://www.googleapis.com/auth/analytics.readonly"],
  });

  let client;
  try {
    client = await auth.getClient();
  } catch {
    console.error(
      "Could not load Application Default Credentials.\n" +
        "Run: gcloud auth application-default login"
    );
    process.exit(1);
  }

  const [lineItemResponse, controlResponse, allSourcesResponse] = await Promise.all([
    ga4(client, lineItemRequest(args.start, args.end)),
    ga4(client, controlTotalRequest(args.start, args.end)),
    ga4(client, allSourceMediumsRequest(args.start, args.end)),
  ]);

  /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
  const allSourceMediums: string[] = ((allSourcesResponse as any)?.rows ?? []).map(
    /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
    (r: any) => r.dimensionValues?.[0]?.value ?? ""
  );

  let basis: InvoiceBasis;
  try {
    basis = buildInvoiceBasis({
      startDate: args.start,
      endDate: args.end,
      rate: args.rate,
      lineItemResponse,
      controlResponse,
      allSourceMediums,
      allowPartial: args.allowPartial,
    });
  } catch (err) {
    if (err instanceof InvoiceRefusal) {
      console.error(`\nREFUSED: ${err.message}\n`);
      process.exit(1);
    }
    throw err;
  }

  mkdirSync(args.out, { recursive: true });
  const slug = `${args.start}_${args.end}`;
  const htmlPath = join(args.out, `affiliate-commission-${slug}.html`);
  const csvPath = join(args.out, `affiliate-commission-${slug}.csv`);
  writeFileSync(htmlPath, renderHtml(basis, label), "utf8");
  writeFileSync(csvPath, renderCsv(basis), "utf8");
  const pdfPath = renderPdf(htmlPath, join(args.out, `affiliate-commission-${slug}.pdf`));

  const pad = (s: string) => s.padStart(13);
  console.log(`\n  ${label}   (${args.start} to ${args.end})`);
  console.log("  " + "-".repeat(52));
  for (const s of basis.bySourceMedium) {
    console.log(
      `  ${s.sourceMedium.padEnd(30)}${String(s.orders).padStart(4)}  ${pad(usd(s.revenue))}`
    );
  }
  console.log("  " + "-".repeat(52));
  console.log(
    `  ${"Attributed revenue".padEnd(30)}${String(basis.orders.length).padStart(4)}  ${pad(usd(basis.attributedRevenue))}`
  );
  console.log(
    `  ${`COMMISSION @ ${(basis.rate * 100).toFixed(0)}%`.padEnd(34)}  ${pad(usd(basis.commission))}`
  );
  for (const w of basis.warnings) console.log(`\n  ! ${w}`);
  console.log(`\n  ${htmlPath}\n  ${csvPath}`);
  console.log(pdfPath ? `  ${pdfPath}   <- attach this to FreshBooks\n` : "");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
