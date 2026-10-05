/**
 * Anthropic model IDs — single source of truth for every cron job and script.
 *
 * Why this exists: model IDs were hardcoded in six places across five files.
 * When claude-sonnet-4 retired on 2026-06-15 it started 404ing every run, and
 * only lib/cron/marketwatch-ai.ts was updated. The other four
 * (ai-content, newsletter-ai, seo-audit, performance-ai) still pointed at the
 * dead ID for over a month. They went unnoticed only because none of their
 * routes are currently scheduled in vercel.json — re-enable one and it fails.
 *
 * Bumped to the current generation on 2026-10-05: claude-sonnet-5 and
 * claude-opus-4-8 are previous-generation IDs. Two request-shape rules come with
 * Sonnet 5.x and are already applied at every call site — keep them if you
 * change these IDs:
 *   1. No `temperature` / `top_p` / `top_k`. Sampling params are rejected (400).
 *   2. No `thinking: { type: "disabled" }` (also a 400). Thinking is on by
 *      default, so never read `response.content[0]` — find the first block whose
 *      `type === "text"`, or an empty thinking block silently eats the response.
 *
 * Override at runtime for a zero-deploy change (e.g. canary testing a new model):
 *   ANTHROPIC_SONNET_MODEL=claude-sonnet-6 vercel env add ...
 */

export const OPUS_MODEL = process.env.ANTHROPIC_OPUS_MODEL ?? "claude-opus-5-5";

export const SONNET_MODEL =
  process.env.ANTHROPIC_SONNET_MODEL ?? "claude-sonnet-5-5";

export const HAIKU_MODEL =
  process.env.ANTHROPIC_HAIKU_MODEL ?? "claude-haiku-4-5-20251001";
