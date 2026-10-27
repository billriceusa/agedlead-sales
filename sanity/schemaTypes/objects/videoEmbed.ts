import { defineField, defineType } from "sanity";

/**
 * A YouTube video inside a Portable Text body.
 *
 * WHY THIS EXISTS (2026-10-07)
 *
 * Someone pasted a raw `<iframe>` tag into the body of
 * /blog/how-to-work-aged-leads-the-complete-system-for-maximum-roi. Portable
 * Text has no notion of raw HTML, so it rendered as a literal wall of escaped
 * markup in the middle of the site's highest-traffic blog post, and its
 * unbreakable src= URL pushed the page 31px sideways on a phone.
 *
 * The paste was removed, but the underlying gap was real: an author wanted a
 * video, the schema had no way to express one, and the nearest available action
 * produced broken output that nothing caught. Adding the type is the root-cause
 * fix — the next person who wants a video now has somewhere to put it.
 *
 * STORES AN ID, NOT A URL OR AN EMBED. The renderer builds the iframe, so
 * markup can never come from content again, and the privacy-preserving
 * youtube-nocookie host is applied in one place rather than remembered per
 * post. The input accepts a full YouTube URL and extracts the id, because
 * asking an author to dig an id out of a URL is how you get a URL in the field.
 */

const YOUTUBE_ID = /^[A-Za-z0-9_-]{11}$/;

/** Pull the 11-character id out of any common YouTube URL shape. */
export function extractYouTubeId(input: string): string | null {
  const raw = (input || "").trim();
  if (!raw) return null;
  if (YOUTUBE_ID.test(raw)) return raw;

  const patterns = [
    /youtube\.com\/watch\?(?:.*&)?v=([A-Za-z0-9_-]{11})(?![A-Za-z0-9_-])/,
    /youtu\.be\/([A-Za-z0-9_-]{11})(?![A-Za-z0-9_-])/,
    /youtube(?:-nocookie)?\.com\/embed\/([A-Za-z0-9_-]{11})(?![A-Za-z0-9_-])/,
    /youtube\.com\/shorts\/([A-Za-z0-9_-]{11})(?![A-Za-z0-9_-])/,
    /youtube\.com\/live\/([A-Za-z0-9_-]{11})(?![A-Za-z0-9_-])/,
  ];
  for (const re of patterns) {
    const m = raw.match(re);
    if (m) return m[1];
  }
  return null;
}

export const videoEmbedType = defineType({
  name: "videoEmbed",
  title: "Video",
  type: "object",
  fields: [
    defineField({
      name: "url",
      title: "YouTube URL or video ID",
      type: "string",
      description:
        "Paste the full YouTube link — watch, youtu.be, shorts and embed URLs all work. Do NOT paste an <iframe> tag; the site builds the player itself.",
      validation: (rule) =>
        rule.required().custom((value) => {
          if (typeof value !== "string" || !value.trim()) return "Required";
          if (/<\s*iframe/i.test(value)) {
            return "Paste the video URL, not an embed tag — the site builds the player.";
          }
          return extractYouTubeId(value)
            ? true
            : "Could not find a YouTube video ID in that. Check the link.";
        }),
    }),
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      description:
        "Used as the player's accessible name. Describe the video, e.g. 'How to Work Aged Leads'.",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "caption",
      title: "Caption",
      type: "string",
      description: "Optional line shown under the video.",
    }),
  ],
  preview: {
    select: { title: "title", subtitle: "url" },
    prepare: ({ title, subtitle }) => ({
      title: title || "Video",
      subtitle: extractYouTubeId(subtitle || "") ?? subtitle,
    }),
  },
});
