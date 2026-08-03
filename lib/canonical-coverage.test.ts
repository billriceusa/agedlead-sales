import { test, describe } from "node:test";
import assert from "node:assert/strict";
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";

/**
 * Every static route must declare its own canonical.
 *
 * `app/layout.tsx` sets `alternates.canonical` to the site root, and Next
 * inherits metadata down the tree. So a page that does not override it tells
 * Google it is a duplicate of the homepage — which is a request not to index
 * it, made by the page least likely to be checked.
 *
 * Found on 2026-08-03 during cutover: seven hub pages were inheriting it,
 * including /lead-types, /guides and /playbooks, all three of which are
 * destinations in url-map.csv. The wrong canonical was there long before the
 * migration; what the migration changed is the cost, because the whole corpus
 * was about to be recrawled on a new domain and those pages get one clean
 * shot at being indexed there.
 *
 * Dynamic segments are exempt: they build their canonical from the slug at
 * request time and cannot state it as a literal.
 */

const SITE_DIR = join(process.cwd(), "app", "(site)");

function staticPageFiles(dir: string, acc: string[] = []): string[] {
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) {
      // Dynamic segments build canonicals at request time.
      if (entry.startsWith("[")) continue;
      staticPageFiles(full, acc);
    } else if (entry === "page.tsx") {
      acc.push(full);
    }
  }
  return acc;
}

describe("canonical coverage", () => {
  test("every static page declares its own canonical", () => {
    const missing = staticPageFiles(SITE_DIR)
      .filter((f) => !readFileSync(f, "utf8").includes("alternates"))
      // The homepage inherits the root canonical, which for it is correct.
      .filter((f) => f !== join(SITE_DIR, "page.tsx"))
      .map((f) => f.slice(process.cwd().length + 1));

    assert.deepEqual(
      missing,
      [],
      "these pages inherit the homepage canonical and are asking Google not to index them",
    );
  });

  test("the walker actually finds pages — a silent empty pass is not a pass", () => {
    assert.ok(
      staticPageFiles(SITE_DIR).length > 10,
      "found suspiciously few page.tsx files; the walker is probably looking in the wrong place",
    );
  });
});
