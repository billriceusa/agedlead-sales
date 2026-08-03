/**
 * Builds the 6 flagship-magnet PDFs from the markdown sources in
 * content/flagship-magnet/ and writes them to public/downloads/.
 *
 * Usage:
 *   pnpm tsx scripts/build-flagship-pdfs.ts
 *   # or
 *   node_modules/.bin/tsx scripts/build-flagship-pdfs.ts
 *
 * Requires Chrome installed at the path in CHROME_PATH (macOS default).
 * Renders markdown → HTML with `marked` → PDF with headless Chrome.
 *
 * Outputs:
 *   public/downloads/aged-lead-operators-system-{vertical}.pdf
 *   public/downloads/aged-lead-operators-workbook-{vertical}.pdf
 */

import { marked } from "marked";
import { execSync } from "node:child_process";
import { mkdirSync, readFileSync, writeFileSync, existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { SITE_HOST, SITE_URL } from "@/lib/site-url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");
const CONTENT_DIR = join(ROOT, "content/flagship-magnet");
const EMAIL_DIR = join(CONTENT_DIR, "emails");
const OUT_DIR = join(ROOT, "public/downloads");
const TMP_DIR = join(ROOT, ".flagship-pdf-tmp");

const CHROME_PATH =
  process.env.CHROME_PATH ||
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";

type Vertical = "mortgage" | "insurance" | "home-services";
const VERTICALS: { slug: Vertical; label: string }[] = [
  { slug: "mortgage", label: "Mortgage" },
  { slug: "insurance", label: "Insurance" },
  { slug: "home-services", label: "Home Services" },
];

/**
 * Read a markdown source, substituting the site's own address.
 *
 * Markdown cannot interpolate, so a host written into playbook-master.md gets
 * baked into a PDF a reader keeps offline — and the migration is exactly when
 * that goes stale. Sources write `{{SITE_HOST}}` / `{{SITE_URL}}` instead, and
 * the PDFs pick up the new address on the next `npm run build:pdfs`.
 */
function read(p: string): string {
  return readFileSync(p, "utf-8")
    .replaceAll("{{SITE_HOST}}", SITE_HOST)
    .replaceAll("{{SITE_URL}}", SITE_URL);
}

marked.setOptions({ gfm: true, breaks: false });

function renderMarkdown(md: string): string {
  return marked.parse(md) as string;
}

function htmlShell(title: string, bodyHtml: string, cover: CoverCopy): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<title>${escapeHtml(title)}</title>
<style>
  :root {
    --navy: #1e3a5f;
    --blue: #2563eb;
    --blue-soft: #eff6ff;
    --blue-border: #bfdbfe;
    --gold: #c9a54e;
    --ink: #1f2937;
    --muted: #6b7280;
    --rule: #e5e7eb;
  }
  @page {
    size: letter;
    margin: 0.85in 0.75in 0.85in 0.75in;
  }
  @page :first { margin: 0; }
  * { box-sizing: border-box; }
  html, body { margin: 0; padding: 0; }
  body {
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
    color: var(--ink);
    font-size: 11pt;
    line-height: 1.55;
  }
  .cover {
    height: 100vh;
    padding: 0 1in;
    background: linear-gradient(155deg, #0f1e33 0%, #1e3a5f 60%, #2463c9 100%);
    color: #ffffff;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    page-break-after: always;
  }
  .cover .brand {
    padding-top: 1.25in;
    font-size: 11pt;
    letter-spacing: 2px;
    text-transform: uppercase;
    color: rgba(255,255,255,0.7);
  }
  .cover h1 {
    margin: 0.6in 0 0 0;
    font-size: 46pt;
    font-weight: 800;
    line-height: 1.05;
    letter-spacing: -0.5pt;
  }
  .cover h2 {
    margin: 0.25in 0 0 0;
    font-size: 16pt;
    font-weight: 400;
    color: rgba(255,255,255,0.82);
    max-width: 5in;
    line-height: 1.4;
  }
  .cover .stat {
    margin-top: 0.6in;
    border-left: 3px solid var(--gold);
    padding: 4pt 0 4pt 14pt;
  }
  .cover .stat .n {
    font-size: 40pt;
    font-weight: 800;
    color: var(--gold);
    line-height: 1;
  }
  .cover .stat .l {
    display: block;
    margin-top: 6pt;
    font-size: 11pt;
    color: rgba(255,255,255,0.8);
    max-width: 4in;
    line-height: 1.45;
  }
  .cover .footer {
    padding-bottom: 0.7in;
    font-size: 10pt;
    color: rgba(255,255,255,0.7);
    border-top: 1px solid rgba(255,255,255,0.18);
    padding-top: 0.25in;
  }
  .cover .footer strong { color: #ffffff; font-weight: 600; }
  .content { padding: 0; }
  h1 {
    color: var(--navy);
    font-size: 22pt;
    font-weight: 800;
    letter-spacing: -0.3pt;
    margin: 0.4in 0 14pt 0;
    padding-top: 12pt;
    page-break-before: always;
    page-break-after: avoid;
    border-top: 3px solid var(--gold);
    padding-top: 18pt;
  }
  h1:first-of-type { page-break-before: auto; }
  h2 {
    color: var(--navy);
    font-size: 15pt;
    font-weight: 700;
    margin: 20pt 0 8pt 0;
    page-break-after: avoid;
  }
  h3 {
    color: var(--ink);
    font-size: 12.5pt;
    font-weight: 700;
    margin: 16pt 0 6pt 0;
    page-break-after: avoid;
  }
  h4 {
    color: var(--ink);
    font-size: 11.5pt;
    font-weight: 700;
    margin: 14pt 0 4pt 0;
    page-break-after: avoid;
  }
  p { margin: 0 0 10pt 0; }
  strong { color: #111827; }
  em { color: #374151; }
  ul, ol { margin: 0 0 12pt 0; padding-left: 20pt; }
  li { margin-bottom: 4pt; }
  li::marker { color: var(--blue); }
  code {
    font-family: "SFMono-Regular", Menlo, Consolas, monospace;
    background: #f3f4f6;
    padding: 1pt 4pt;
    border-radius: 3pt;
    font-size: 9.5pt;
  }
  pre {
    background: #f9fafb;
    border: 1px solid var(--rule);
    border-left: 3px solid var(--blue);
    border-radius: 4pt;
    padding: 10pt 14pt;
    font-family: "SFMono-Regular", Menlo, Consolas, monospace;
    font-size: 9.5pt;
    overflow-x: hidden;
    margin: 10pt 0;
    white-space: pre-wrap;
    page-break-inside: avoid;
  }
  pre code { background: transparent; padding: 0; font-size: inherit; }
  blockquote {
    margin: 14pt 0;
    padding: 14pt 18pt;
    background: var(--blue-soft);
    border: 1px solid var(--blue-border);
    border-left: 4px solid var(--blue);
    border-radius: 6pt;
    color: #1e3a5f;
    page-break-inside: avoid;
  }
  blockquote p:last-child { margin-bottom: 0; }
  blockquote p strong:first-child { color: var(--navy); }
  blockquote h3 {
    margin: 0 0 6pt 0;
    font-size: 11pt;
    color: var(--navy);
    text-transform: none;
  }
  a { color: var(--blue); text-decoration: none; font-weight: 500; }
  a[href^="https://agedleadstore.com"],
  a[href*="agedleadstore.com"] {
    font-weight: 700;
  }
  table {
    width: 100%;
    border-collapse: collapse;
    margin: 14pt 0;
    font-size: 10pt;
    page-break-inside: avoid;
  }
  th {
    background: var(--navy);
    color: #fff;
    padding: 6pt 8pt;
    text-align: left;
    font-weight: 600;
  }
  td {
    padding: 6pt 8pt;
    border-bottom: 1px solid var(--rule);
    vertical-align: top;
  }
  tr:nth-child(even) td { background: #f9fafb; }
  hr { border: none; border-top: 1px solid var(--rule); margin: 16pt 0; }
  .footer-strap {
    margin-top: 0.5in;
    padding-top: 12pt;
    border-top: 1px solid var(--rule);
    font-size: 9.5pt;
    color: var(--muted);
    text-align: center;
  }
  .footer-strap a { color: var(--blue); }
</style>
</head>
<body>
  <section class="cover">
    <div class="brand">${escapeHtml(cover.brand)}</div>
    <div>
      <h1>${escapeHtml(cover.h1)}</h1>
      <h2>${escapeHtml(cover.h2)}</h2>
      ${
        cover.statNumber
          ? `<div class="stat"><span class="n">${escapeHtml(cover.statNumber)}</span><span class="l">${escapeHtml(cover.statLabel || "")}</span></div>`
          : ""
      }
    </div>
    <div class="footer">
      <strong>Work Aged Leads</strong> · ${SITE_HOST}<br/>
      Not legal advice · Consult TCPA-literate counsel before running outreach
    </div>
  </section>
  <section class="content">
    ${bodyHtml}
    <div class="footer-strap">
      Work Aged Leads · <a href="${SITE_URL}">${SITE_HOST}</a> · Operator guidance, not legal advice. TCPA counsel recommended: <a href="https://www.henson-legal.com/">Henson Legal</a>.
    </div>
  </section>
</body>
</html>`;
}

interface CoverCopy {
  brand: string;
  h1: string;
  h2: string;
  statNumber?: string;
  statLabel?: string;
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function renderPdf(htmlPath: string, pdfPath: string) {
  const cmd = [
    `"${CHROME_PATH}"`,
    "--headless=new",
    "--disable-gpu",
    "--no-sandbox",
    "--hide-scrollbars",
    "--virtual-time-budget=5000",
    "--run-all-compositor-stages-before-draw",
    "--no-pdf-header-footer",
    `--print-to-pdf="${pdfPath}"`,
    `"file://${htmlPath}"`,
  ].join(" ");
  execSync(cmd, { stdio: "pipe" });
}

function stripFrontMatterDisclaimer(md: string): string {
  // Keep the Mode A/B/C block in — it's important for each PDF
  return md;
}

function buildPlaybookPdf(vertical: Vertical, label: string) {
  const master = read(join(CONTENT_DIR, "playbook-master.md"));
  const overlay = read(join(CONTENT_DIR, `playbook-${vertical}.md`));

  const combined =
    stripFrontMatterDisclaimer(master) +
    "\n\n\n<hr/>\n\n\n# " +
    label +
    " Overlay\n\n" +
    overlay;

  const bodyHtml = renderMarkdown(combined);
  const statMap: Record<Vertical, { n: string; l: string }> = {
    mortgage: {
      n: "7.5×",
      l: "typical ROI at 15% contact × 4% close on aged mortgage leads",
    },
    insurance: {
      n: "5×",
      l: "typical ROI at 15% contact × 8% close on aged insurance leads",
    },
    "home-services": {
      n: "8×",
      l: "typical ROI at 15% contact × 6% sold on aged roofing leads",
    },
  };
  const stat = statMap[vertical];

  const html = htmlShell(
    `The Aged Lead Operator's System — ${label} Edition`,
    bodyHtml,
    {
      brand: "The Aged Lead Operator's System",
      h1: `The ${label} Edition`,
      h2: `The complete operator's manual for turning aged ${label.toLowerCase()} leads into closed deals — scripts, unit economics, cadence, nurture, and compliance.`,
      statNumber: stat.n,
      statLabel: stat.l,
    }
  );

  const htmlPath = join(TMP_DIR, `playbook-${vertical}.html`);
  const pdfPath = join(OUT_DIR, `aged-lead-operators-system-${vertical}.pdf`);
  writeFileSync(htmlPath, html, "utf-8");
  renderPdf(htmlPath, pdfPath);
  console.log(`  ✓ ${pdfPath}`);
}

function buildWorkbookPdf(vertical: Vertical, label: string) {
  const wb = read(join(CONTENT_DIR, "workbook.md"));
  // Prepend a small vertical-specific intro
  const intro = `> **This is the ${label} Edition workbook.** Complete it alongside your **Aged Lead Operator's System — ${label} Edition** playbook. Answers here become your operating documents — keep them in a binder or a shared drive and revisit quarterly.\n\n`;
  const md = intro + wb;
  const bodyHtml = renderMarkdown(md);

  const html = htmlShell(
    `The Aged Lead Operator's Workbook — ${label} Edition`,
    bodyHtml,
    {
      brand: "The Aged Lead Operator's Workbook",
      h1: `The ${label} Edition`,
      h2: `10 worksheets to turn the playbook into your own operating plan. Fill them in, keep them, revisit quarterly.`,
    }
  );

  const htmlPath = join(TMP_DIR, `workbook-${vertical}.html`);
  const pdfPath = join(OUT_DIR, `aged-lead-operators-workbook-${vertical}.pdf`);
  writeFileSync(htmlPath, html, "utf-8");
  renderPdf(htmlPath, pdfPath);
  console.log(`  ✓ ${pdfPath}`);
}

function main() {
  if (!existsSync(CHROME_PATH)) {
    console.error(`Chrome not found at ${CHROME_PATH}`);
    console.error(
      "Set CHROME_PATH env var or install Google Chrome / Chromium."
    );
    process.exit(1);
  }
  mkdirSync(OUT_DIR, { recursive: true });
  mkdirSync(TMP_DIR, { recursive: true });

  console.log("Building playbooks...");
  for (const v of VERTICALS) {
    buildPlaybookPdf(v.slug, v.label);
  }

  console.log("Building workbooks...");
  for (const v of VERTICALS) {
    buildWorkbookPdf(v.slug, v.label);
  }

  // Silence unused-import warnings
  void EMAIL_DIR;

  console.log("\nDone. 6 PDFs written to public/downloads/.");
}

main();
