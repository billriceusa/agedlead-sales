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

/** The issue record, or null when no issue is archived for that date. */
export async function readIssue(date: string): Promise<ArchivedIssue | null> {
  const raw = await fetchRaw(`data/newsletter-archive/${date}.json`);
  if (raw === null) return null;
  return JSON.parse(raw) as ArchivedIssue;
}

/** The rendered HTML — the exact bytes that get mailed. */
export async function readIssueHtml(date: string): Promise<string | null> {
  return fetchRaw(`data/newsletter-archive/${date}.html`);
}

export const archivePaths = {
  json: (date: string) => `data/newsletter-archive/${date}.json`,
  html: (date: string) => `data/newsletter-archive/${date}.html`,
};
