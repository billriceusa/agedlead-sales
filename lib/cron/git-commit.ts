interface GitHubFile {
  path: string;
  content: string;
}

export async function commitFilesToGitHub(
  files: GitHubFile[],
  commitMessage: string
): Promise<string | null> {
  const token = process.env.GITHUB_TOKEN;
  const repo = process.env.GITHUB_REPO;
  const branch = process.env.GITHUB_BRANCH || "main";

  if (!token || !repo) {
    console.warn(
      "GITHUB_TOKEN or GITHUB_REPO not set — skipping git commit"
    );
    return null;
  }

  const headers = {
    Authorization: `Bearer ${token}`,
    Accept: "application/vnd.github.v3+json",
    "Content-Type": "application/json",
  };

  const apiBase = `https://api.github.com/repos/${repo}`;

  const refRes = await fetch(`${apiBase}/git/ref/heads/${branch}`, {
    headers,
  });
  if (!refRes.ok) {
    throw new Error(
      `Failed to get branch ref: ${refRes.status} ${await refRes.text()}`
    );
  }
  const refData = (await refRes.json()) as {
    object: { sha: string };
  };
  const latestCommitSha = refData.object.sha;

  const commitRes = await fetch(
    `${apiBase}/git/commits/${latestCommitSha}`,
    { headers }
  );
  if (!commitRes.ok) {
    throw new Error(`Failed to get commit: ${commitRes.status}`);
  }
  const commitData = (await commitRes.json()) as {
    tree: { sha: string };
  };
  const baseTreeSha = commitData.tree.sha;

  const treeItems = await Promise.all(
    files.map(async (file) => {
      const blobRes = await fetch(`${apiBase}/git/blobs`, {
        method: "POST",
        headers,
        body: JSON.stringify({
          content: file.content,
          encoding: "utf-8",
        }),
      });
      if (!blobRes.ok) {
        throw new Error(`Failed to create blob for ${file.path}`);
      }
      const blobData = (await blobRes.json()) as { sha: string };
      return {
        path: file.path,
        mode: "100644" as const,
        type: "blob" as const,
        sha: blobData.sha,
      };
    })
  );

  const treeRes = await fetch(`${apiBase}/git/trees`, {
    method: "POST",
    headers,
    body: JSON.stringify({
      base_tree: baseTreeSha,
      tree: treeItems,
    }),
  });
  if (!treeRes.ok) {
    throw new Error(`Failed to create tree: ${treeRes.status}`);
  }
  const treeData = (await treeRes.json()) as { sha: string };

  const newCommitRes = await fetch(`${apiBase}/git/commits`, {
    method: "POST",
    headers,
    body: JSON.stringify({
      message: commitMessage,
      tree: treeData.sha,
      parents: [latestCommitSha],
    }),
  });
  if (!newCommitRes.ok) {
    throw new Error(`Failed to create commit: ${newCommitRes.status}`);
  }
  const newCommitData = (await newCommitRes.json()) as { sha: string };

  const updateRefRes = await fetch(
    `${apiBase}/git/refs/heads/${branch}`,
    {
      method: "PATCH",
      headers,
      body: JSON.stringify({ sha: newCommitData.sha }),
    }
  );
  if (!updateRefRes.ok) {
    throw new Error(`Failed to update ref: ${updateRefRes.status}`);
  }

  console.log(`Committed ${files.length} files: ${newCommitData.sha}`);
  return newCommitData.sha;
}
