import { test, describe } from "node:test";
import assert from "node:assert/strict";
import { extractYouTubeId } from "./videoEmbed";

/**
 * The whole point of this type is that an author never hand-writes markup
 * again. These pin the input side of that promise: whatever shape of YouTube
 * link someone pastes, we get an id — and when we cannot, we say so rather than
 * rendering a broken player.
 *
 * The case that created this type is the last one in the first block: a raw
 * <iframe> tag, which is exactly what got pasted into a post body and rendered
 * as escaped markup on the site's highest-traffic blog post.
 */
const ID = "4m9p9hdcaC8"; // the video that was lost in that post

describe("extractYouTubeId", () => {
  for (const [label, input] of [
    ["a bare id", ID],
    ["watch URL", `https://www.youtube.com/watch?v=${ID}`],
    ["watch URL with extra params first", `https://www.youtube.com/watch?feature=share&v=${ID}`],
    ["watch URL with trailing params", `https://www.youtube.com/watch?v=${ID}&t=42s`],
    ["youtu.be short link", `https://youtu.be/${ID}`],
    ["youtu.be with a timestamp", `https://youtu.be/${ID}?t=90`],
    ["embed URL", `https://www.youtube.com/embed/${ID}`],
    ["nocookie embed URL", `https://www.youtube-nocookie.com/embed/${ID}`],
    ["shorts URL", `https://www.youtube.com/shorts/${ID}`],
    ["live URL", `https://www.youtube.com/live/${ID}`],
    ["surrounding whitespace", `   https://youtu.be/${ID}   `],
    [
      "the raw iframe that caused all this",
      `<iframe width="560" height="315" src="https://www.youtube.com/embed/${ID}" title="How to Work Aged Leads" frameborder="0" allowfullscreen></iframe>`,
    ],
  ] as const) {
    test(`extracts from ${label}`, () => {
      assert.equal(extractYouTubeId(input), ID);
    });
  }

  for (const [label, input] of [
    ["empty string", ""],
    ["whitespace only", "   "],
    ["a sentence", "watch the video on our channel"],
    ["a non-YouTube URL", "https://vimeo.com/123456789"],
    ["a too-short id", "abc123"],
    ["a YouTube channel URL", "https://www.youtube.com/@AgedLeadStore"],
  ] as const) {
    test(`returns null for ${label}`, () => {
      assert.equal(extractYouTubeId(input), null);
    });
  }

  test("an id is exactly 11 chars — a 12-char lookalike is not silently truncated", () => {
    // Guards the regex: {11} must not match the first 11 of a longer token.
    assert.equal(extractYouTubeId("https://youtu.be/aaaaaaaaaaaa"), null);
  });

  test("never returns markup, whatever is pasted", () => {
    const out = extractYouTubeId(`<script>alert(1)</script>https://youtu.be/${ID}`);
    assert.equal(out, ID);
    assert.ok(!/[<>]/.test(out!), "extracted id must never contain markup characters");
  });
});
