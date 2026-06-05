// Persist daily-performance recommendations to data/performance-backlog.json
// in GitHub. Dedupes recurring recommendations into a single row with a repeat
// counter — repetition is the signal that an item is structurally stuck.
//
// Dedup strategy (in priority order):
//   1. topicKey — a stable kebab-case slug the AI assigns and is told to REUSE
//      across runs for the same underlying issue. This is the primary key.
//   2. Fuzzy title backstop — if a rec carries no matching topicKey, its title
//      tokens are compared against open items; a high-overlap match is treated
//      as a repeat. This catches topicKey drift / older items without a key.
//   3. Per-run cap — at most MAX_NEW_PER_RUN genuinely-new items are admitted
//      per run, so a hallucinating run can't flood the backlog.
//
// History: dedup used to key on sha1(normalized title). The AI rewords titles
// every run ("position 7.3" -> "7.4" -> "branded dominance"), so the key never
// matched and the backlog grew ~5 new rows/day of the same ~4 real issues.

import { createHash } from "crypto";

export interface Recommendation {
  priority: "high" | "medium" | "low";
  title: string;
  description: string;
  expectedImpact: string;
  /** Stable kebab-case issue identifier; the AI is told to reuse it across runs. */
  topicKey?: string;
}

export interface PerformanceBacklogItem {
  id: string;
  title: string;
  description: string;
  expectedImpact: string;
  priority: "high" | "medium" | "low";
  firstSeen: string;
  lastSeen: string;
  timesRepeated: number;
  status: "open" | "done" | "ignored";
  /** Stable dedup key once known (from AI topicKey or migration). */
  topicKey?: string;
}

export interface PerformanceBacklog {
  lastUpdated: string;
  items: PerformanceBacklogItem[];
}

const PRIORITY_RANK: Record<PerformanceBacklogItem["priority"], number> = {
  high: 3,
  medium: 2,
  low: 1,
};

// Max genuinely-new items admitted per run. Backstop against a run that
// hallucinates a pile of fresh "issues"; real net-new is normally 0-2/day.
const MAX_NEW_PER_RUN = 4;

// Title-token overlap above which a keyless rec is treated as a repeat of an
// existing open item. This is only a backstop — topicKey is the primary dedup
// key — so it's tuned to catch rewordings (0.5) rather than to be conservative.
const FUZZY_MERGE_THRESHOLD = 0.5;

// Volatile words that carry no topic signal — verbs, filler, and the
// position/CTR vocabulary the AI permutes every run.
const STOPWORDS = new Set(
  "optimize optimise enhance improve fix implement create scale capitalize capitalise leverage expand consolidate strengthen audit investigate immediately existing for to and the of on in a an page pages query queries content review reviews position ranking rank break ceiling dominance eliminate prevent reduce strategy campaign initiative deep dive immediate better best high low zero click clicks ctr traffic search seo".split(
    " "
  )
);

function normalizeTitle(s: string): string {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9\s]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function titleId(title: string): string {
  return createHash("sha1").update(normalizeTitle(title)).digest("hex").slice(0, 12);
}

export function slugifyTopicKey(s: string): string {
  return s
    .toLowerCase()
    .replace(/\d+/g, "") // strip positions/dates — they're volatile
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60)
    .replace(/^-+|-+$/g, "");
}

/** Significant (non-stopword, non-numeric) tokens of a title, for fuzzy match. */
function titleTokens(title: string): Set<string> {
  return new Set(
    normalizeTitle(title)
      .replace(/\d+/g, " ")
      .split(/\s+/)
      .filter((w) => w.length > 2 && !STOPWORDS.has(w))
  );
}

function jaccard(a: Set<string>, b: Set<string>): number {
  if (a.size === 0 || b.size === 0) return 0;
  let inter = 0;
  for (const t of a) if (b.has(t)) inter++;
  return inter / (a.size + b.size - inter);
}

/** Resolve the dedup key for a recommendation. */
function keyForRec(rec: Recommendation): string {
  const slug = rec.topicKey ? slugifyTopicKey(rec.topicKey) : "";
  return slug || titleId(rec.title);
}

/** Resolve the dedup key an existing item is stored under. */
function keyForItem(item: PerformanceBacklogItem): string {
  const slug = item.topicKey ? slugifyTopicKey(item.topicKey) : "";
  return slug || item.id;
}

function maxPriority(
  a: PerformanceBacklogItem["priority"],
  b: PerformanceBacklogItem["priority"]
): PerformanceBacklogItem["priority"] {
  return PRIORITY_RANK[a] >= PRIORITY_RANK[b] ? a : b;
}

export async function fetchPerformanceBacklog(): Promise<PerformanceBacklog | null> {
  const token = process.env.GITHUB_TOKEN;
  const repo = process.env.GITHUB_REPO;
  const branch = process.env.GITHUB_BRANCH || "main";

  if (!token || !repo) return null;

  try {
    const res = await fetch(
      `https://api.github.com/repos/${repo}/contents/data/performance-backlog.json?ref=${branch}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/vnd.github.v3+json",
        },
      }
    );
    if (!res.ok) return null;

    const data = (await res.json()) as { content?: string };
    if (!data.content) return null;

    const decoded = Buffer.from(data.content, "base64").toString("utf-8");
    return JSON.parse(decoded) as PerformanceBacklog;
  } catch {
    return null;
  }
}

export function mergeRecommendations(
  existing: PerformanceBacklog | null,
  recs: Recommendation[],
  today: string
): { backlog: PerformanceBacklog; changed: boolean } {
  const existingItems = existing?.items ?? [];
  const byKey = new Map<string, PerformanceBacklogItem>();
  for (const i of existingItems) byKey.set(keyForItem(i), { ...i });
  let changed = false;

  // Token sets for open items, recomputed lazily for the fuzzy backstop.
  const openTokenIndex = (): { key: string; tokens: Set<string> }[] =>
    Array.from(byKey.values())
      .filter((i) => i.status === "open")
      .map((i) => ({ key: keyForItem(i), tokens: titleTokens(i.title) }));

  const bumpRepeat = (item: PerformanceBacklogItem, rec: Recommendation) => {
    if (item.status !== "open") return;
    if (item.lastSeen !== today) {
      item.lastSeen = today;
      item.timesRepeated += 1;
      changed = true;
    }
    const np = maxPriority(item.priority, rec.priority);
    if (np !== item.priority) {
      item.priority = np;
      changed = true;
    }
    // Backfill a topicKey onto a legacy item the first time the AI tags it.
    if (!item.topicKey && rec.topicKey) {
      item.topicKey = slugifyTopicKey(rec.topicKey);
      changed = true;
    }
  };

  const newItems: { rec: Recommendation; key: string }[] = [];

  for (const rec of recs) {
    const key = keyForRec(rec);
    const direct = byKey.get(key);
    if (direct) {
      bumpRepeat(direct, rec);
      continue;
    }

    // Fuzzy backstop: does this look like an existing open item reworded?
    const recTokens = titleTokens(rec.title);
    let best: { key: string; score: number } | null = null;
    for (const cand of openTokenIndex()) {
      const score = jaccard(recTokens, cand.tokens);
      if (score >= FUZZY_MERGE_THRESHOLD && (!best || score > best.score)) {
        best = { key: cand.key, score };
      }
    }
    if (best) {
      bumpRepeat(byKey.get(best.key)!, rec);
      continue;
    }

    newItems.push({ rec, key });
  }

  // Admit at most MAX_NEW_PER_RUN new items, highest priority first.
  newItems.sort((a, b) => PRIORITY_RANK[b.rec.priority] - PRIORITY_RANK[a.rec.priority]);
  for (const { rec, key } of newItems.slice(0, MAX_NEW_PER_RUN)) {
    byKey.set(key, {
      id: key,
      title: rec.title,
      description: rec.description,
      expectedImpact: rec.expectedImpact,
      priority: rec.priority,
      firstSeen: today,
      lastSeen: today,
      timesRepeated: 1,
      status: "open",
      topicKey: rec.topicKey ? slugifyTopicKey(rec.topicKey) : undefined,
    });
    changed = true;
  }

  const items = Array.from(byKey.values()).sort((a, b) => {
    if (a.status !== b.status) return a.status === "open" ? -1 : 1;
    if (a.priority !== b.priority)
      return PRIORITY_RANK[b.priority] - PRIORITY_RANK[a.priority];
    if (a.timesRepeated !== b.timesRepeated)
      return b.timesRepeated - a.timesRepeated;
    return a.firstSeen.localeCompare(b.firstSeen);
  });

  return {
    backlog: {
      lastUpdated: changed
        ? new Date().toISOString()
        : existing?.lastUpdated ?? new Date().toISOString(),
      items,
    },
    changed,
  };
}

export function serializeBacklog(backlog: PerformanceBacklog): string {
  return JSON.stringify(backlog, null, 2) + "\n";
}
