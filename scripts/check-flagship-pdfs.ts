/**
 * Checks whether any flagship-magnet PDFs are stale relative to their
 * markdown sources.
 *
 * Usage:
 *   npm run flagship:check
 *
 * Behavior:
 *   - For each vertical (mortgage, insurance, home-services):
 *     - Compares mtimes of master + vertical-overlay markdown to the
 *       playbook PDF.
 *     - Compares mtime of workbook.md (plus the vertical label baked into
 *       the script) to the workbook PDF.
 *   - Exits 0 if all PDFs are up-to-date.
 *   - Exits 1 with a stale report if any are behind.
 *
 * Use in Claude agent workflow: after editing any file in
 * content/flagship-magnet/, run this. If it reports stale PDFs, run
 * `npm run build:pdfs` before committing.
 */

import { statSync, existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");
const CONTENT_DIR = join(ROOT, "content/flagship-magnet");
const OUT_DIR = join(ROOT, "public/downloads");

type Vertical = "mortgage" | "insurance" | "home-services";
const VERTICALS: Vertical[] = ["mortgage", "insurance", "home-services"];

interface Check {
  label: string;
  sources: string[];
  output: string;
}

function mtime(p: string): number {
  if (!existsSync(p)) return -1;
  return statSync(p).mtimeMs;
}

function buildChecks(): Check[] {
  const checks: Check[] = [];
  const master = join(CONTENT_DIR, "playbook-master.md");
  const workbook = join(CONTENT_DIR, "workbook.md");
  const buildScript = join(ROOT, "scripts/build-flagship-pdfs.ts");

  for (const v of VERTICALS) {
    checks.push({
      label: `playbook/${v}`,
      sources: [master, join(CONTENT_DIR, `playbook-${v}.md`), buildScript],
      output: join(OUT_DIR, `aged-lead-operators-system-${v}.pdf`),
    });
    checks.push({
      label: `workbook/${v}`,
      sources: [workbook, buildScript],
      output: join(OUT_DIR, `aged-lead-operators-workbook-${v}.pdf`),
    });
  }
  return checks;
}

function main() {
  const checks = buildChecks();
  const stale: { check: Check; latestSource: string; sourceMtime: number; outputMtime: number }[] = [];

  for (const check of checks) {
    const outputMtime = mtime(check.output);
    if (outputMtime < 0) {
      stale.push({
        check,
        latestSource: "(PDF missing)",
        sourceMtime: 0,
        outputMtime: -1,
      });
      continue;
    }
    let latestSource = "";
    let latestMtime = 0;
    for (const src of check.sources) {
      const m = mtime(src);
      if (m > latestMtime) {
        latestMtime = m;
        latestSource = src;
      }
    }
    if (latestMtime > outputMtime) {
      stale.push({
        check,
        latestSource: latestSource.replace(ROOT + "/", ""),
        sourceMtime: latestMtime,
        outputMtime,
      });
    }
  }

  if (stale.length === 0) {
    console.log("✓ All 6 flagship PDFs are up-to-date with their markdown sources.");
    process.exit(0);
  }

  console.log(`✗ ${stale.length} flagship PDF(s) are STALE:\n`);
  for (const s of stale) {
    console.log(`  ${s.check.label}`);
    console.log(`    newer source: ${s.latestSource}`);
    if (s.outputMtime >= 0) {
      const ageSec = Math.round((s.sourceMtime - s.outputMtime) / 1000);
      console.log(`    PDF is ${ageSec}s behind`);
    } else {
      console.log(`    PDF is missing`);
    }
    console.log(`    output:       ${s.check.output.replace(ROOT + "/", "")}\n`);
  }
  console.log("Run `npm run build:pdfs` to rebuild.\n");
  process.exit(1);
}

main();
