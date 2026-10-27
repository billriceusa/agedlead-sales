/**
 * Checks whether any flagship-magnet PDFs are stale relative to their
 * markdown sources.
 *
 * Usage:
 *   npm run flagship:check
 *
 * WHY THIS IS NOT mtime-BASED (fixed 2026-10-27)
 *
 * The original version compared `statSync().mtimeMs` of the sources against
 * the PDFs. Filesystem mtimes are not a property of the content — git resets
 * them whenever it writes a file, so a branch switch, a `git checkout`, or a
 * fresh clone assigns new mtimes in an order that has nothing to do with what
 * actually changed. A fresh clone gives every file the clone time, which makes
 * the comparison pure coin-flip on any machine that did not build the PDFs
 * locally.
 *
 * It had in fact been failing since 2026-08-12 on exactly that artifact: a
 * branch switch rewrote scripts/build-flagship-pdfs.ts with byte-identical
 * content and bumped its mtime 11 days past the PDFs, so the guard reported
 * all six as stale for two and a half months while the content was current.
 * A guard that cries wolf gets ignored, and then it is no guard at all.
 *
 * So: ask git, which records what changed and when as part of the commit.
 *   - An uncommitted edit to a source => stale. That is the case the guard
 *     exists for: you changed the markdown and have not rebuilt.
 *   - Otherwise compare the last COMMIT that touched each source against the
 *     last commit that touched the PDF. Commit timestamps travel with the
 *     repository, so every machine reaches the same verdict.
 *
 * Behavior:
 *   - Exits 0 if all PDFs are up-to-date.
 *   - Exits 1 with a stale report if any are behind.
 *
 * After editing any file in content/flagship-magnet/, run this. If it reports
 * stale PDFs, run `npm run build:pdfs` and commit the PDFs in the SAME commit
 * as the markdown change.
 */

import { existsSync } from "node:fs";
import { join, dirname, relative } from "node:path";
import { fileURLToPath } from "node:url";
import { execFileSync } from "node:child_process";

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

function git(args: string[]): string {
  try {
    return execFileSync("git", args, {
      cwd: ROOT,
      encoding: "utf8",
      stdio: ["ignore", "pipe", "ignore"],
    }).trim();
  } catch {
    return "";
  }
}

/** Unix seconds of the last commit touching `path`, or 0 if never committed. */
function lastCommitTime(path: string): number {
  const out = git(["log", "-1", "--format=%ct", "--", relative(ROOT, path)]);
  return out ? Number(out) : 0;
}

/** True if `path` has staged or unstaged changes in the working tree. */
function isDirty(path: string): boolean {
  return git(["status", "--porcelain", "--", relative(ROOT, path)]) !== "";
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

interface Stale {
  check: Check;
  reason: string;
}

function evaluate(check: Check): Stale | null {
  const rel = (p: string) => relative(ROOT, p);

  if (!existsSync(check.output)) {
    return { check, reason: "PDF is missing" };
  }

  // An uncommitted source edit is the case this guard exists for.
  const dirtySources = check.sources.filter(isDirty);
  if (dirtySources.length > 0) {
    return {
      check,
      reason: `uncommitted change in ${dirtySources.map(rel).join(", ")} — rebuild before committing`,
    };
  }

  // A freshly built, not-yet-committed PDF is up to date by definition.
  if (isDirty(check.output)) return null;

  const outputCommit = lastCommitTime(check.output);
  if (outputCommit === 0) {
    return { check, reason: "PDF exists on disk but was never committed" };
  }

  let newestSource = "";
  let newestCommit = 0;
  for (const src of check.sources) {
    const t = lastCommitTime(src);
    if (t > newestCommit) {
      newestCommit = t;
      newestSource = src;
    }
  }

  if (newestCommit > outputCommit) {
    const days = Math.round((newestCommit - outputCommit) / 86400);
    return {
      check,
      reason: `${rel(newestSource)} was committed ${days}d after the PDF`,
    };
  }

  return null;
}

function main() {
  if (git(["rev-parse", "--is-inside-work-tree"]) !== "true") {
    console.error("Not inside a git work tree — cannot check PDF freshness.");
    process.exit(1);
  }

  const stale = buildChecks()
    .map(evaluate)
    .filter((s): s is Stale => s !== null);

  if (stale.length === 0) {
    console.log("✓ All 6 flagship PDFs are up-to-date with their markdown sources.");
    process.exit(0);
  }

  console.log(`✗ ${stale.length} flagship PDF(s) are STALE:\n`);
  for (const s of stale) {
    console.log(`  ${s.check.label}`);
    console.log(`    ${s.reason}`);
    console.log(`    output:       ${relative(ROOT, s.check.output)}\n`);
  }
  console.log("Run `npm run build:pdfs` to rebuild.\n");
  process.exit(1);
}

main();
