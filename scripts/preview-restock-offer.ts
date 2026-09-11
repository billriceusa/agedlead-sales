/**
 * Render every restock-offer edition to one reviewable HTML page.
 *
 * WHY THIS EXISTS
 *
 * The monthly offer rotates through six editions, and only one of them lands in
 * any given inbox in any given month. So the normal review path — read the
 * preview email the Sunday cron sends — shows a sixth of the program and takes
 * six months to show the rest. Copy that nobody has read end to end is copy
 * that drifts, and this one mails the whole list.
 *
 * This renders all six side by side, offline, touching nothing. It sends no
 * email, writes no archive, and commits nothing.
 *
 *   npx tsx scripts/preview-restock-offer.ts
 *   npx tsx scripts/preview-restock-offer.ts --out /some/path.html
 */
import { writeFileSync } from "node:fs";
import { join } from "node:path";
import {
  buildRestockHtml,
  editionFor,
  firstSundayLabel,
  RESTOCK_EDITIONS,
} from "../lib/newsletter/restock-offer";
import { checkIssueHtml } from "../lib/newsletter/issue-gate";

const SITE = process.env.NEXT_PUBLIC_SITE_URL || "https://workagedleads.com";

function outPath(): string {
  const i = process.argv.indexOf("--out");
  if (i !== -1 && process.argv[i + 1]) return process.argv[i + 1];
  return join(process.cwd(), "restock-offer-preview.html");
}

/** Which month each edition lands in, so the reviewer can see the cadence. */
function monthsFor(key: string): string[] {
  const names = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
  ];
  return names.filter((_, m) => editionFor(new Date(Date.UTC(2026, m, 15))).key === key);
}

function main() {
  const label = firstSundayLabel(new Date());
  const sections = RESTOCK_EDITIONS.map((edition) => {
    const html = buildRestockHtml(edition, label, SITE);
    const gate = checkIssueHtml(html);
    const months = monthsFor(edition.key).join(", ");
    const status = gate.ok
      ? `<span style="color:#166534;font-weight:700;">gate: pass</span>`
      : `<span style="color:#991b1b;font-weight:700;">gate: BLOCKED — ${gate.reason}</span>`;
    return `
<section style="margin:0 0 48px;">
  <div style="max-width:640px;margin:0 auto 12px;padding:12px 16px;background:#111827;color:#fff;border-radius:8px;font-family:-apple-system,sans-serif;">
    <p style="margin:0;font-size:15px;font-weight:700;">${edition.key} &nbsp;·&nbsp; mails in ${months}</p>
    <p style="margin:4px 0 0;font-size:13px;color:#d1d5db;">Subject: ${edition.subject}</p>
    <p style="margin:2px 0 0;font-size:13px;color:#d1d5db;">Preview: ${edition.previewText}</p>
    <p style="margin:6px 0 0;font-size:12px;">${status} &nbsp;·&nbsp; ${(html.length / 1024).toFixed(1)} KB</p>
  </div>
  ${html.replace(/^[\s\S]*?<body[^>]*>/, "").replace(/<\/body>[\s\S]*$/, "")}
</section>`;
  }).join("\n");

  const page = `<!DOCTYPE html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Restock offer — all editions</title></head>
<body style="margin:0;padding:32px 0;background:#e5e7eb;">
<div style="max-width:640px;margin:0 auto 32px;padding:20px 24px;background:#fff;border-radius:12px;font-family:-apple-system,sans-serif;">
  <h1 style="margin:0 0 8px;font-size:20px;">Monthly restock offer — the whole rotation</h1>
  <p style="margin:0 0 8px;color:#374151;font-size:14px;line-height:1.6;">Six editions, one per month, rotating. Nothing here has been sent. Links are tagged <code>restock-offer</code> and rendered against <code>${SITE}</code> with the label <code>${label}</code>.</p>
  <p style="margin:0;color:#6b7280;font-size:13px;">Schedule: drafts the first Sunday of each month and mails Bill a preview with a STOP link, then sends the following Thursday unless stopped.</p>
</div>
${sections}
</body></html>`;

  const path = outPath();
  writeFileSync(path, page, "utf-8");
  console.log(`Rendered ${RESTOCK_EDITIONS.length} editions to ${path}`);
  for (const e of RESTOCK_EDITIONS) {
    console.log(`  ${e.key.padEnd(20)} ${monthsFor(e.key).join(", ").padEnd(12)} ${e.subject}`);
  }
}

main();
