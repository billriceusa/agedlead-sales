const HONEYPOT_FIELD = "website";

/**
 * Origin allowlist for every capture route. Note that isGoodOrigin() returns a
 * FAKE SUCCESS on failure (see below) — so a host missing from this set does
 * not error, it silently drops the lead. Any new domain must be added here
 * BEFORE it serves traffic.
 *
 * workagedleads.com is listed ahead of the consolidation so capture works from
 * the moment the domain is attached. Keeping the agedleadsales hosts through
 * cutover is deliberate: they keep serving until the 301s are live.
 */
const ALLOWED_HOSTS = new Set([
  "workagedleads.com",
  "www.workagedleads.com",
  "agedleadsales.com",
  "www.agedleadsales.com",
  "localhost",
  "localhost:3000",
  "localhost:3001",
]);

export function isHoneypotFilled(body: Record<string, unknown>): boolean {
  const v = body[HONEYPOT_FIELD];
  return typeof v === "string" && v.trim().length > 0;
}

export function isGoodOrigin(request: Request): boolean {
  if (process.env.NODE_ENV !== "production") return true;

  const origin = request.headers.get("origin");
  const referer = request.headers.get("referer");
  const source = origin || referer;
  if (!source) return false;

  try {
    const host = new URL(source).host;
    return ALLOWED_HOSTS.has(host);
  } catch {
    return false;
  }
}

/**
 * Rejects the bot signature we saw 2026-04-14 onward: random mixed-case
 * alphanumeric strings 15+ chars with no vowels clustered normally.
 * Real first names are <=25 chars, have vowels, and don't look like base64.
 */
export function isGibberishName(name: string | undefined | null): boolean {
  if (!name) return false;
  const trimmed = name.trim();
  if (trimmed.length === 0) return false;
  if (trimmed.length > 40) return true;

  // Vowel ratio — random alpha strings hover ~0.15-0.25, English names ~0.35+
  const letters = trimmed.replace(/[^a-zA-Z]/g, "");
  if (letters.length >= 12) {
    const vowels = (letters.match(/[aeiouyAEIOUY]/g) || []).length;
    if (vowels / letters.length < 0.28) return true;
  }

  // Mixed-case with no separators (space/hyphen/apostrophe) beyond 15 chars — bot pattern
  if (
    trimmed.length >= 15 &&
    /[a-z]/.test(trimmed) &&
    /[A-Z]/.test(trimmed) &&
    !/[\s\-'.]/.test(trimmed)
  ) {
    return true;
  }

  return false;
}
