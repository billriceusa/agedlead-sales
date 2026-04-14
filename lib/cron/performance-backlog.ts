// Persist daily-performance recommendations to data/performance-backlog.json
// in GitHub. Dedupes by normalized title so recurring recommendations get a
// repeat counter instead of a duplicate row — repetition is the signal that
// an item is structurally stuck and should promote itself.

import { createHash } from "crypto";

export interface Recommendation {
  priority: "high" | "medium" | "low";
  title: string;
  description: string;
  expectedImpact: string;
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
  const byId = new Map(existingItems.map((i) => [i.id, { ...i }]));
  let changed = false;

  for (const rec of recs) {
    const id = titleId(rec.title);
    const existing = byId.get(id);

    if (!existing) {
      byId.set(id, {
        id,
        title: rec.title,
        description: rec.description,
        expectedImpact: rec.expectedImpact,
        priority: rec.priority,
        firstSeen: today,
        lastSeen: today,
        timesRepeated: 1,
        status: "open",
      });
      changed = true;
      continue;
    }

    if (existing.status !== "open") continue;

    const newPriority = maxPriority(existing.priority, rec.priority);
    const priorityChanged = newPriority !== existing.priority;
    const alreadyCountedToday = existing.lastSeen === today;

    if (!alreadyCountedToday) {
      existing.lastSeen = today;
      existing.timesRepeated += 1;
      changed = true;
    }
    if (priorityChanged) {
      existing.priority = newPriority;
      changed = true;
    }
  }

  const items = Array.from(byId.values()).sort((a, b) => {
    if (a.status !== b.status) return a.status === "open" ? -1 : 1;
    if (a.priority !== b.priority)
      return PRIORITY_RANK[b.priority] - PRIORITY_RANK[a.priority];
    if (a.timesRepeated !== b.timesRepeated)
      return b.timesRepeated - a.timesRepeated;
    return a.firstSeen.localeCompare(b.firstSeen);
  });

  return {
    backlog: {
      lastUpdated: changed ? new Date().toISOString() : existing?.lastUpdated ?? new Date().toISOString(),
      items,
    },
    changed,
  };
}

export function serializeBacklog(backlog: PerformanceBacklog): string {
  return JSON.stringify(backlog, null, 2) + "\n";
}
