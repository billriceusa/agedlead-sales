import { readFileSync } from "node:fs";
import { join } from "node:path";

/**
 * Path-level redirects for the workagedleads.com consolidation, derived from
 * data/migration/url-map.csv so the CSV stays the single source of truth. Edit
 * the CSV (or regenerate it with scripts/build-url-map.mjs), never this list.
 *
 * Only rows whose PATH changes produce a rule. MIGRATE and REHOST rows keep
 * their path, so the cross-domain 301 from the retired hosts is enough. PRUNE
 * rows have no destination and are deliberately left to 404 — there is no
 * topic-matched target for them, and redirecting pruned content to a generic
 * hub is the mistake that wasted the /playbooks equity once already.
 *
 * Runs at build time in next.config.ts, so a malformed CSV fails the build
 * rather than silently shipping a broken redirect table.
 */

const NEW_HOST = "https://workagedleads.com";
const RETIRED_HOSTS = ["https://howtoworkleads.com", "https://agedleadsales.com"];

export interface MigrationRedirect {
  source: string;
  destination: string;
  permanent: true;
}

/** Host condition Next.js matches before applying a rule. */
interface HostGuard {
  type: "host";
  value: string;
}

export interface HostScopedRedirect extends MigrationRedirect {
  has: HostGuard[];
}

/** Matches the retiring host and its www form, and nothing else. */
const RETIRING_HOST: HostGuard[] = [
  { type: "host", value: "(www\\.)?agedleadsales\\.com" },
];

/** Minimal CSV row splitter — handles the quoted `notes` column. */
function splitRow(line: string): string[] {
  const out: string[] = [];
  let cur = "";
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (ch === '"') {
      if (inQuotes && line[i + 1] === '"') {
        cur += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (ch === "," && !inQuotes) {
      out.push(cur);
      cur = "";
    } else {
      cur += ch;
    }
  }
  out.push(cur);
  return out;
}

const toPath = (url: string, hosts: string[]): string | null => {
  for (const h of hosts) {
    if (url === h) return "/";
    if (url.startsWith(`${h}/`)) return url.slice(h.length);
  }
  return null;
};

export function migrationRedirects(): MigrationRedirect[] {
  const csv = readFileSync(
    join(process.cwd(), "data", "migration", "url-map.csv"),
    "utf8"
  );

  const rules: MigrationRedirect[] = [];
  const seen = new Set<string>();

  for (const line of csv.split("\n").slice(1)) {
    if (!line.trim()) continue;
    const [oldUrl, newUrl] = splitRow(line);
    if (!newUrl) continue; // PRUNE

    const from = toPath(oldUrl, RETIRED_HOSTS);
    const to = toPath(newUrl, [NEW_HOST]);
    if (!from || !to) {
      throw new Error(`url-map.csv: unrecognised host in row -> ${oldUrl} | ${newUrl}`);
    }
    if (from === to) continue; // MIGRATE / REHOST — path unchanged

    // A source can appear once only; Next silently uses the first match and a
    // duplicate almost always means the CSV has drifted.
    if (seen.has(from)) {
      throw new Error(`url-map.csv: duplicate redirect source ${from}`);
    }
    seen.add(from);

    rules.push({ source: from, destination: to, permanent: true });
  }

  return rules;
}

/**
 * The same path changes, but scoped to the retiring host and pointing at an
 * absolute URL on the target.
 *
 * Without these, a path-changing URL on agedleadsales.com takes two hops: a
 * rule above rewrites the path on the old host, and only then does the host
 * swap in proxy.ts move it across. Sending the final URL from the first rule
 * makes it one.
 *
 * This has to live in next.config.ts rather than proxy.ts. Next runs
 * `redirects()` BEFORE middleware, so a path rule here always wins and any
 * equivalent mapping in the middleware would be unreachable.
 *
 * Same shape as the cross-host table the howtoworkleads repo generates from
 * this CSV — one idiom, both retiring hosts.
 */
export function legacyHostPathChanges(): HostScopedRedirect[] {
  return migrationRedirects()
    .filter((r) => legacyPathChangeSources().has(r.source))
    .map((r) => ({
      source: r.source,
      has: RETIRING_HOST,
      destination: `${NEW_HOST}${r.destination}`,
      permanent: true as const,
    }));
}

/** Sources whose old URL sat on the retiring host — the rest are howtoworkleads. */
function legacyPathChangeSources(): Set<string> {
  const csv = readFileSync(
    join(process.cwd(), "data", "migration", "url-map.csv"),
    "utf8"
  );
  const out = new Set<string>();
  for (const line of csv.split("\n").slice(1)) {
    if (!line.trim()) continue;
    const [oldUrl, newUrl] = splitRow(line);
    if (!newUrl) continue;
    if (!oldUrl.startsWith("https://agedleadsales.com")) continue;
    const from = toPath(oldUrl, RETIRED_HOSTS);
    const to = toPath(newUrl, [NEW_HOST]);
    if (from && to && from !== to) out.add(from);
  }
  return out;
}
