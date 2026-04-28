import { createClient } from "@sanity/client";
import sharp from "sharp";

const IMAGE_WIDTH = 1200;
const IMAGE_HEIGHT = 630;
const BRAND_BLUE = "#2563eb";

function getSanityWriteClient() {
  const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
  const token = (process.env.SANITY_API_TOKEN || "").trim();
  if (!projectId || !token) {
    throw new Error("Missing NEXT_PUBLIC_SANITY_PROJECT_ID or SANITY_API_TOKEN");
  }
  return createClient({
    projectId,
    dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || "production",
    apiVersion: "2026-03-14",
    token,
    useCdn: false,
  });
}

const STOP_WORDS = new Set([
  "a", "an", "the", "and", "or", "but", "in", "on", "at", "to", "for", "of",
  "with", "by", "from", "is", "are", "was", "were", "be", "been", "how",
  "what", "why", "when", "who", "which", "that", "this", "your", "their",
  "should", "about", "into", "through", "during", "before", "after", "above",
  "below", "between", "same", "than", "too", "very", "can", "will", "just",
  "don", "now", "also", "do", "does", "complete", "guide", "ultimate", "best",
  "top", "step",
]);

function buildSearchQuery(title: string): string {
  const titleWords = title
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, "")
    .split(/\s+/)
    .filter((w) => w.length > 2 && !STOP_WORDS.has(w));
  const keywords = [...titleWords.slice(0, 2), "sales", "people", "professional"];
  return keywords.join(" ");
}

interface UnsplashPhoto {
  id: string;
  urls: { raw: string };
  links: { download_location: string };
  user: { name: string };
  description?: string;
  alt_description?: string;
  tags?: { title: string }[];
}

class UnsplashRateLimitError extends Error {
  status: number;
  constructor(status: number) {
    super(`Unsplash rate limited (HTTP ${status})`);
    this.status = status;
  }
}

function scorePhoto(photo: UnsplashPhoto): number {
  let score = 0;
  const text = [
    photo.description || "",
    photo.alt_description || "",
    ...(photo.tags?.map((t) => t.title) || []),
  ]
    .join(" ")
    .toLowerCase();

  const peopleWords = [
    "person", "people", "woman", "man", "team", "group", "meeting",
    "professional", "business", "office", "working", "conference",
    "entrepreneur", "executive", "colleague", "coworker", "handshake",
    "laptop", "desk", "suit", "portrait", "discussion", "collaboration",
    "phone", "call", "calling", "headset", "sales", "agent",
  ];
  for (const word of peopleWords) if (text.includes(word)) score += 3;

  const proWords = [
    "corporate", "workplace", "startup", "boardroom", "presentation",
    "strategy", "finance", "technology", "modern", "consulting",
    "insurance", "mortgage", "real estate", "leads", "crm",
  ];
  for (const word of proWords) if (text.includes(word)) score += 2;

  const penaltyWords = [
    "illustration", "icon", "graphic", "vector", "flat", "cartoon", "text",
    "letter", "word", "typography", "font", "sign", "logo", "screenshot",
    "screen", "mockup", "template", "banner", "poster", "abstract", "pattern",
    "texture", "background", "wallpaper", "drawing", "sketch", "clipart",
    "infographic", "diagram", "chart",
  ];
  for (const word of penaltyWords) if (text.includes(word)) score -= 5;

  const alt = (photo.alt_description || "").toLowerCase();
  if (/\b(man|woman|person|people|team|group)\b/.test(alt)) score += 5;

  return score;
}

/**
 * Search Unsplash for a single best photo.
 *
 * Throws UnsplashRateLimitError on 403/429 so callers can distinguish
 * rate-limiting from genuine empty results.
 *
 * Returns null only when the API responded successfully but no photos
 * matched the query.
 *
 * The optional excludePhotoIds set lets callers running a batch (e.g.
 * the weekly cron publishing 3 articles) avoid having every post in the
 * batch get the same photo.
 */
async function searchUnsplash(
  query: string,
  accessKey: string,
  excludePhotoIds: Set<string> = new Set()
): Promise<UnsplashPhoto | null> {
  const url = new URL("https://api.unsplash.com/search/photos");
  url.searchParams.set("query", query);
  url.searchParams.set("per_page", "20");
  url.searchParams.set("orientation", "landscape");
  url.searchParams.set("content_filter", "high");

  const res = await fetch(url.toString(), {
    headers: { Authorization: `Client-ID ${accessKey}` },
  });

  if (res.status === 403 || res.status === 429) {
    throw new UnsplashRateLimitError(res.status);
  }
  if (!res.ok) return null;

  const data = await res.json();
  const photos: UnsplashPhoto[] = data.results || [];
  if (photos.length === 0) return null;

  const eligible = photos.filter((p) => !excludePhotoIds.has(p.id));
  // If everything in the result set is already used, fall back to the
  // full set (better to repeat than to ship with no image).
  const candidates = eligible.length > 0 ? eligible : photos;

  const scored = candidates.map((photo) => ({ photo, score: scorePhoto(photo) }));
  scored.sort((a, b) => b.score - a.score);
  const best = scored[0].photo;

  // Trigger Unsplash download tracking (per their API attribution rules)
  fetch(best.links.download_location, {
    headers: { Authorization: `Client-ID ${accessKey}` },
  }).catch(() => {});

  return best;
}

/**
 * One-retry wrapper. Retries once after `delayMs` on transient failures
 * (rate limits, 5xx, network). Does not retry on auth failures or
 * permanent errors.
 */
async function withRetry<T>(
  fn: () => Promise<T>,
  delayMs = 2000
): Promise<T> {
  try {
    return await fn();
  } catch (e: unknown) {
    const err = e as Error & { status?: number };
    const isTransient =
      err instanceof UnsplashRateLimitError ||
      err.status === 429 ||
      (typeof err.status === "number" && err.status >= 500) ||
      err.name === "FetchError" ||
      err.message?.includes("ECONNRESET") ||
      err.message?.includes("ETIMEDOUT") ||
      err.message?.includes("network");

    if (!isTransient) throw e;
    await new Promise((r) => setTimeout(r, delayMs));
    return await fn();
  }
}

function blueGradientSvg(width: number, height: number): Buffer {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}">
    <defs>
      <linearGradient id="g" x1="0%" y1="100%" x2="100%" y2="0%">
        <stop offset="0%" style="stop-color:${BRAND_BLUE};stop-opacity:0.85"/>
        <stop offset="50%" style="stop-color:${BRAND_BLUE};stop-opacity:0.6"/>
        <stop offset="100%" style="stop-color:${BRAND_BLUE};stop-opacity:0.25"/>
      </linearGradient>
    </defs>
    <rect width="${width}" height="${height}" fill="url(#g)"/>
  </svg>`;
  return Buffer.from(svg);
}

function dotPatternSvg(width: number, height: number): Buffer {
  const dotRadius = 2;
  const spacing = 48;
  const startY = Math.floor(height * 0.1);
  const endY = Math.floor(height * 0.45);
  const circles: string[] = [];
  for (let y = startY; y < endY; y += spacing) {
    for (let x = 20; x < width; x += spacing) {
      circles.push(`<circle cx="${x}" cy="${y}" r="${dotRadius}" fill="white" opacity="0.15"/>`);
    }
  }
  return Buffer.from(
    `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}">${circles.join("")}</svg>`
  );
}

function titleOverlaySvg(width: number, height: number, title: string): Buffer {
  let fontSize = 48;
  if (title.length > 60) fontSize = 36;
  if (title.length > 90) fontSize = 30;

  const padding = 80;
  const textWidth = width - padding * 2;
  const textY = height - 200;
  const safeTitle = title
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

  const charWidth = fontSize * 0.55;
  const maxCharsPerLine = Math.floor(textWidth / charWidth);
  const lineHeight = fontSize * 1.3;
  const words = safeTitle.split(" ");
  const lines: string[] = [];
  let currentLine = "";
  for (const word of words) {
    const testLine = currentLine ? `${currentLine} ${word}` : word;
    if (testLine.length > maxCharsPerLine && currentLine) {
      lines.push(currentLine);
      currentLine = word;
    } else {
      currentLine = testLine;
    }
  }
  if (currentLine) lines.push(currentLine);

  const totalHeight = lines.length * lineHeight;
  const adjustedStartY = textY - totalHeight + lineHeight;
  const tspans = lines
    .map((line, i) => `<tspan x="${padding}" dy="${i === 0 ? 0 : lineHeight}">${line}</tspan>`)
    .join("");

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}">
    <style>.t{font-family:Arial,Helvetica,sans-serif;font-size:${fontSize}px;font-weight:700;fill:white;}</style>
    <text class="t" x="${padding}" y="${adjustedStartY}">${tspans}</text>
  </svg>`;
  return Buffer.from(svg);
}

async function buildBrandedJpeg(photo: UnsplashPhoto, title: string): Promise<Buffer> {
  const downloadUrl = `${photo.urls.raw}&w=${IMAGE_WIDTH}&h=${IMAGE_HEIGHT}&fit=crop&crop=faces,center&q=80`;
  const res = await fetch(downloadUrl);
  if (!res.ok) {
    const err = new Error(`Unsplash download failed: ${res.status}`) as Error & { status?: number };
    err.status = res.status;
    throw err;
  }
  const rawBuffer = Buffer.from(await res.arrayBuffer());

  return sharp(rawBuffer)
    .resize(IMAGE_WIDTH, IMAGE_HEIGHT, { fit: "cover", position: "centre" })
    .composite([
      { input: blueGradientSvg(IMAGE_WIDTH, IMAGE_HEIGHT), blend: "over" },
      { input: dotPatternSvg(IMAGE_WIDTH, IMAGE_HEIGHT), blend: "over" },
      { input: titleOverlaySvg(IMAGE_WIDTH, IMAGE_HEIGHT, title), blend: "over" },
    ])
    .jpeg({ quality: 85 })
    .toBuffer();
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 60);
}

/**
 * Discriminated outcome type. Callers can branch on `status` and, for
 * skips, on `reason`. The `photoId` returned with `created` lets a batch
 * caller add it to its dedup set so the next post in the batch picks a
 * different photo.
 */
export type FeaturedImageOutcome =
  | {
      status: "created";
      postId: string;
      assetId: string;
      photoId: string;
      photographer: string;
    }
  | {
      status: "skipped";
      postId: string;
      reason: "no-key" | "no-results" | "rate-limited" | "upload-failed";
      detail?: string;
    };

export interface GenerateOptions {
  /** Photos already used in this batch — will be excluded from selection. */
  excludePhotoIds?: Set<string>;
}

export async function generateAndAttachFeaturedImage(
  postId: string,
  title: string,
  options: GenerateOptions = {}
): Promise<FeaturedImageOutcome> {
  const accessKey = process.env.UNSPLASH_ACCESS_KEY;
  if (!accessKey) {
    return { status: "skipped", postId, reason: "no-key" };
  }

  const exclude = options.excludePhotoIds || new Set<string>();

  // Try the title-derived query first, with one retry on transient errors,
  // then a generic fallback.
  let photo: UnsplashPhoto | null = null;
  try {
    const primaryQuery = buildSearchQuery(title);
    photo = await withRetry(() => searchUnsplash(primaryQuery, accessKey, exclude));
    if (!photo) {
      photo = await withRetry(() =>
        searchUnsplash("people in an office setting professional", accessKey, exclude)
      );
    }
  } catch (e: unknown) {
    if (e instanceof UnsplashRateLimitError) {
      return {
        status: "skipped",
        postId,
        reason: "rate-limited",
        detail: e.message,
      };
    }
    return {
      status: "skipped",
      postId,
      reason: "upload-failed",
      detail: (e as Error).message,
    };
  }

  if (!photo) {
    return { status: "skipped", postId, reason: "no-results" };
  }

  let buffer: Buffer;
  try {
    buffer = await withRetry(() => buildBrandedJpeg(photo!, title));
  } catch (e: unknown) {
    return {
      status: "skipped",
      postId,
      reason: "upload-failed",
      detail: (e as Error).message,
    };
  }

  const client = getSanityWriteClient();

  let assetId: string;
  try {
    const asset = await withRetry(() =>
      client.assets.upload("image", buffer, {
        filename: `featured-${slugify(title)}.jpg`,
        contentType: "image/jpeg",
      })
    );
    assetId = asset._id;

    await withRetry(() =>
      client
        .patch(postId)
        .set({
          mainImage: {
            _type: "image",
            alt: title,
            asset: { _type: "reference", _ref: asset._id },
          },
        })
        .commit()
    );
  } catch (e: unknown) {
    return {
      status: "skipped",
      postId,
      reason: "upload-failed",
      detail: (e as Error).message,
    };
  }

  return {
    status: "created",
    postId,
    assetId,
    photoId: photo.id,
    photographer: photo.user.name,
  };
}
