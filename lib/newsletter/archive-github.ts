/**
 * Read newsletter archive files from GitHub at request time.
 *
 * WHY NOT THE FILESYSTEM
 *
 * The Sunday cron writes the archive by committing to `main` through the GitHub
 * API. The Tuesday sender runs in a different deployment and must read what that
 * commit produced, which the local bundle may not contain:
 *
 *   - The Sunday commit triggers a redeploy, but the sender could run against a
 *     deployment built before it — or after a later unrelated deploy.
 *   - Any correction Bill makes to the copy is another commit. Sending stale
 *     bytes that a human already fixed is the exact failure this must not have.
 *   - Marking an issue killed is a commit too, and a sender reading a stale
 *     bundle would not see it. A kill that does not stop the send is worse than
 *     no kill switch, because it is trusted.
 *
 * So the branch is the source of truth for both the bytes and the flags, and
 * both are fetched fresh on every run.
 */

/**
 * Which archive an issue belongs to.
 *
 * The weekly newsletter and the monthly restock offer are both "an issue that
 * gets archived, previewed, optionally killed, then sent", so they share every
 * mechanism here. They must NOT share a slot: the archive is keyed by date, the
 * offer drafts on a Sunday like the newsletter does, and one would silently
 * overwrite the other. Separate directories keep the two cadences independent
 * and keep each one's performance readable on its own.
 */
export type ArchiveKind = "newsletter" | "offer";

const ARCHIVE_DIRS: Record<ArchiveKind, string> = {
  newsletter: "data/newsletter-archive",
  offer: "data/offer-archive",
};

export interface ArchivedIssue {
  weekOf: string;
  sendDate?: string;
  subject: string;
  previewText: string;
  theme?: string;
  campaign?: string;
  sent?: boolean;
  sentAt?: string;
  broadcastId?: string;
  killed?: boolean;
  killedAt?: string;
  killedReason?: string;
  html?: string;
  [key: string]: unknown;
}

function repoConfig(): { token: string; repo: string; branch: string } {
  const token = process.env.GITHUB_TOKEN;
  const repo = process.env.GITHUB_REPO;
  const branch = process.env.GITHUB_BRANCH || "main";
  if (!token || !repo) {
    throw new Error("GITHUB_TOKEN or GITHUB_REPO not set — cannot read the archive");
  }
  return { token, repo, branch };
}

async function fetchRaw(path: string): Promise<string | null> {
  const { token, repo, branch } = repoConfig();
  const res = await fetch(
    `https://api.github.com/repos/${repo}/contents/${path}?ref=${branch}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        // Raw beats base64 here: the HTML runs to tens of KB and decoding it
        // ourselves is one more place to corrupt the bytes we are about to mail.
        Accept: "application/vnd.github.v3.raw",
      },
      cache: "no-store",
    },
  );
  if (res.status === 404) return null;
  if (!res.ok) {
    throw new Error(`GitHub read failed for ${path}: ${res.status} ${await res.text()}`);
  }
  return res.text();
}

/**
 * The issue record, or null when no issue is archived for that date.
 *
 * `kind` defaults to "newsletter" so every caller that predates the offer
 * archive keeps reading exactly what it read before.
 */
export async function readIssue(
  date: string,
  kind: ArchiveKind = "newsletter",
): Promise<ArchivedIssue | null> {
  const raw = await fetchRaw(archivePaths.json(date, kind));
  if (raw === null) return null;
  return JSON.parse(raw) as ArchivedIssue;
}

/** The rendered HTML — the exact bytes that get mailed. */
export async function readIssueHtml(
  date: string,
  kind: ArchiveKind = "newsletter",
): Promise<string | null> {
  return fetchRaw(archivePaths.html(date, kind));
}

export const archivePaths = {
  json: (date: string, kind: ArchiveKind = "newsletter") =>
    `${ARCHIVE_DIRS[kind]}/${date}.json`,
  html: (date: string, kind: ArchiveKind = "newsletter") =>
    `${ARCHIVE_DIRS[kind]}/${date}.html`,
};
