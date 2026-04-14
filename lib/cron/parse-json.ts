// Anthropic and other LLMs sometimes wrap JSON responses in ```json fences
// or include leading/trailing prose. This helper extracts the JSON payload
// before parsing so cron jobs don't fail on cosmetic formatting differences.

export function parseJsonResponse<T = unknown>(raw: string): T {
  const cleaned = extractJson(raw);
  try {
    return JSON.parse(cleaned) as T;
  } catch (err) {
    const preview = cleaned.slice(0, 200).replace(/\s+/g, " ");
    throw new Error(
      `Failed to parse JSON response: ${err instanceof Error ? err.message : err}. Preview: ${preview}`
    );
  }
}

function extractJson(raw: string): string {
  const trimmed = raw.trim();

  const fenceMatch = trimmed.match(/```(?:json)?\s*([\s\S]*?)\s*```/i);
  if (fenceMatch) return fenceMatch[1].trim();

  const firstBrace = trimmed.indexOf("{");
  const firstBracket = trimmed.indexOf("[");
  const start =
    firstBrace === -1
      ? firstBracket
      : firstBracket === -1
        ? firstBrace
        : Math.min(firstBrace, firstBracket);

  if (start === -1) return trimmed;

  const lastBrace = trimmed.lastIndexOf("}");
  const lastBracket = trimmed.lastIndexOf("]");
  const end = Math.max(lastBrace, lastBracket);

  if (end <= start) return trimmed;

  return trimmed.slice(start, end + 1);
}
