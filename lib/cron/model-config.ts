// Anthropic model IDs — single source of truth for all cron jobs and scripts.
// Updated automatically by: npm run check:models
// Override at runtime via env vars (zero-deploy model changes, e.g. canary testing):
//   ANTHROPIC_OPUS_MODEL=claude-opus-4-8 npm run build:pdfs
export const OPUS_MODEL =
  process.env.ANTHROPIC_OPUS_MODEL ?? "claude-opus-4-7";

export const SONNET_MODEL =
  process.env.ANTHROPIC_SONNET_MODEL ?? "claude-sonnet-4-6";

export const HAIKU_MODEL =
  process.env.ANTHROPIC_HAIKU_MODEL ?? "claude-haiku-4-5-20251001";
