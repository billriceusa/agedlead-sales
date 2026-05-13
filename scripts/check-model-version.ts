/**
 * Checks whether the Anthropic models in lib/cron/model-config.ts are still
 * the latest available for each family (Opus, Sonnet, Haiku), and rewrites
 * the file's default strings in-place if a newer model exists.
 *
 * Usage:
 *   npm run check:models
 *
 * Requires ANTHROPIC_API_KEY in the environment. The script loads .env.local
 * automatically when present so it works without a manual export step.
 */

import Anthropic from "@anthropic-ai/sdk";
import { readFileSync, writeFileSync, existsSync } from "fs";
import { resolve } from "path";

// ── Load .env.local if available (Node 20.12+) ───────────────────────────────
try {
  (process as unknown as { loadEnvFile?: (p: string) => void }).loadEnvFile?.(
    ".env.local"
  );
} catch {
  // env already set or file absent — not an error
}

// ── Types ─────────────────────────────────────────────────────────────────────

interface ModelInfo {
  id: string;
  display_name: string;
  created_at: string;
  type: string;
}

type Family = "opus" | "sonnet" | "haiku";

const FAMILY_PATTERNS: Record<Family, RegExp> = {
  opus: /^claude-opus-/,
  sonnet: /^claude-sonnet-/,
  haiku: /^claude-haiku-/,
};

// The env-var name and model-config.ts constant name for each family.
const FAMILY_META: Record<Family, { envVar: string; constant: string }> = {
  opus: { envVar: "ANTHROPIC_OPUS_MODEL", constant: "OPUS_MODEL" },
  sonnet: { envVar: "ANTHROPIC_SONNET_MODEL", constant: "SONNET_MODEL" },
  haiku: { envVar: "ANTHROPIC_HAIKU_MODEL", constant: "HAIKU_MODEL" },
};

// ── Helpers ───────────────────────────────────────────────────────────────────

function latestPerFamily(models: ModelInfo[]): Partial<Record<Family, string>> {
  const buckets: Record<Family, ModelInfo[]> = {
    opus: [],
    sonnet: [],
    haiku: [],
  };

  for (const m of models) {
    for (const [family, pattern] of Object.entries(FAMILY_PATTERNS) as [
      Family,
      RegExp,
    ][]) {
      if (pattern.test(m.id)) {
        buckets[family].push(m);
        break;
      }
    }
  }

  const result: Partial<Record<Family, string>> = {};
  for (const family of Object.keys(buckets) as Family[]) {
    const sorted = buckets[family].sort(
      (a, b) =>
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );
    if (sorted.length > 0) result[family] = sorted[0].id;
  }
  return result;
}

/** Read the current hardcoded default from model-config.ts for one family. */
function currentDefault(src: string, family: Family): string | null {
  const { envVar } = FAMILY_META[family];
  // Matches:  process.env.ANTHROPIC_OPUS_MODEL ?? "claude-opus-4-7"
  const re = new RegExp(
    `process\\.env\\.${envVar}\\s*\\?\\?\\s*"([^"]+)"`
  );
  return src.match(re)?.[1] ?? null;
}

/** Replace the hardcoded default string in model-config.ts source. */
function patchDefault(src: string, family: Family, newModel: string): string {
  const { envVar } = FAMILY_META[family];
  return src.replace(
    new RegExp(
      `(process\\.env\\.${envVar}\\s*\\?\\?\\s*)"[^"]*"`
    ),
    `$1"${newModel}"`
  );
}

// ── Main ─────────────────────────────────────────────────────────────────────

async function main() {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    console.error(
      "✗ ANTHROPIC_API_KEY is not set. Export it or add it to .env.local."
    );
    process.exit(1);
  }

  const client = new Anthropic({ apiKey });

  console.log("Fetching available Anthropic models…");
  const page = await client.models.list({ limit: 100 });
  const models: ModelInfo[] = [];
  for await (const m of page) {
    models.push(m as ModelInfo);
  }
  console.log(`  ${models.length} models returned by the API.\n`);

  const latest = latestPerFamily(models);

  const configPath = resolve("lib/cron/model-config.ts");
  if (!existsSync(configPath)) {
    console.error(`✗ Could not find ${configPath}`);
    process.exit(1);
  }

  let src = readFileSync(configPath, "utf-8");
  const families: Family[] = ["opus", "sonnet", "haiku"];
  let changed = false;

  for (const family of families) {
    const { constant } = FAMILY_META[family];
    const apiLatest = latest[family];
    const configured = currentDefault(src, family);

    if (!apiLatest) {
      console.log(`  ${constant}: no ${family} models found in API — skipped`);
      continue;
    }

    if (!configured) {
      console.log(
        `  ${constant}: could not parse current default in model-config.ts — skipped`
      );
      continue;
    }

    if (apiLatest === configured) {
      console.log(`  ${constant}: ✓ already latest (${configured})`);
    } else {
      console.log(
        `  ${constant}: updating  ${configured}  →  ${apiLatest}`
      );
      src = patchDefault(src, family, apiLatest);
      changed = true;
    }
  }

  if (changed) {
    writeFileSync(configPath, src, "utf-8");
    console.log(`\n✓ lib/cron/model-config.ts updated. Commit the change:\n`);
    console.log(
      `  git add lib/cron/model-config.ts && git commit -m "chore(models): update to latest Anthropic model IDs"`
    );
  } else {
    console.log("\n✓ All models are up to date — no changes written.");
  }
}

main().catch((err) => {
  console.error("check-model-version failed:", err);
  process.exit(1);
});
