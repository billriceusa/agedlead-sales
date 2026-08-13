import { test, describe } from "node:test";
import assert from "node:assert/strict";
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";
import {
  SANITY_CACHE_TAG,
  SANITY_REVALIDATE_SECONDS,
} from "../sanity/lib/fetch";

/**
 * Sanity-backed pages are prerendered. Their freshness comes entirely from the
 * cache tag and staleness window that sanity/lib/fetch.ts attaches to every
 * query — nothing else in the app revalidates. These tests pin that contract.
 *
 * The failure this guards against is silent by construction: a page that calls
 * the Sanity client directly still renders perfectly, it just freezes at
 * build-time content forever. That is exactly how the /lead-types index kept
 * serving a stale list while /lead-types/[slug] showed the new document.
 */

// tsx runs these through the CJS loader, where import.meta.dirname is
// undefined. `npm test` always runs from the repo root.
const repoRoot = process.cwd();

function walk(dir: string): string[] {
  const out: string[] = [];
  for (const entry of readdirSync(dir)) {
    if (entry === "node_modules" || entry === ".next" || entry === ".git") {
      continue;
    }
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) {
      out.push(...walk(full));
    } else if (entry.endsWith(".ts") || entry.endsWith(".tsx")) {
      out.push(full);
    }
  }
  return out;
}

describe("Sanity cache contract", () => {
  test("the cache tag is a stable non-empty string", () => {
    // revalidateTag() silently no-ops on an empty tag, which would leave the
    // webhook returning 200 while purging nothing.
    assert.equal(typeof SANITY_CACHE_TAG, "string");
    assert.ok(SANITY_CACHE_TAG.length > 0);
  });

  test("the staleness window is bounded and positive", () => {
    // 0 or false would opt these pages out of caching entirely (a Sanity
    // request per view); a very long window recreates the original bug in
    // slow motion.
    assert.ok(Number.isFinite(SANITY_REVALIDATE_SECONDS));
    assert.ok(SANITY_REVALIDATE_SECONDS > 0);
    assert.ok(SANITY_REVALIDATE_SECONDS <= 3600);
  });

  test("sanityFetch tags every query it issues", () => {
    // The tag and the window are applied in one place. If that call ever loses
    // its `next` option, every page silently reverts to build-time-forever.
    const source = readFileSync(
      join(repoRoot, "sanity/lib/fetch.ts"),
      "utf8"
    );
    assert.match(source, /next:\s*\{/);
    assert.match(source, /tags:\s*\[\s*SANITY_CACHE_TAG/);
    assert.match(source, /revalidate:/);
  });

  test("no route reads Sanity outside sanityFetch", () => {
    // Importing the raw client inside app/ bypasses the tagging above. The API
    // routes under app/api are exempt: they are force-dynamic, build their own
    // authenticated client for writes, and never render cached HTML.
    const offenders = walk(join(repoRoot, "app"))
      .filter((f) => !f.includes(`${join("app", "api")}${"/"}`))
      .filter((f) => {
        const src = readFileSync(f, "utf8");
        return (
          /from\s+["']@\/sanity\/client["']/.test(src) ||
          /createClient\(/.test(src)
        );
      })
      .map((f) => f.slice(repoRoot.length + 1));

    assert.deepEqual(
      offenders,
      [],
      `these render Sanity data without the cache tag, so they will freeze at ` +
        `build-time content: ${offenders.join(", ")}`
    );
  });
});
