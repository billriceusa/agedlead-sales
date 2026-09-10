/**
 * Open the five channel posts with the consent doctrine, and point them at the ladder.
 *
 * WHY (Bill, 2026-09-09 and 2026-09-10)
 *
 * The site publishes SMS templates for three verticals and two dialer setup guides. The
 * doctrine for aged leads is Mode A — you dial manually and you email until the prospect
 * gives your company permission directly. That rule lived only inside the gated flagship
 * playbook, so the public posts read as though the consent attached to a purchased record
 * were enough.
 *
 * Bill's call was to REFRAME rather than unpublish. `sms-templates-insurance-leads` ranks
 * at position 27 on 88 impressions; deleting the URLs would throw away the traffic and the
 * chance to redirect the reader somewhere better. Each post now opens with what the reader
 * gains from doing it properly, links to the Fresh-Consent Ladder guide, and presents the
 * templates as what you send once permission is yours.
 *
 * VOICE. Per Bill's 2026-09-10 copy standard, this leads with the benefit rather than the
 * prohibition. No "you may not", no "we won't", no announcing a limitation as a heading —
 * those are the tell that internal reasoning has been committed to the page. The reader
 * gets a better reply rate and a list that appreciates; the constraint follows as method.
 *
 * IDEMPOTENT. Skips any post whose opening already mentions the ladder, so a re-run after
 * a partial failure is safe.
 *
 * DRY RUN BY DEFAULT. `--apply` to write.
 *
 *   npx tsx scripts/reframe-consent-doctrine.ts
 *   npx tsx scripts/reframe-consent-doctrine.ts --apply
 */
import { config } from "dotenv";
config({ path: ".env.local", quiet: true } as never);

import { createClient } from "@sanity/client";

const APPLY = process.argv.includes("--apply");
const LADDER = "/guides/fresh-consent-ladder";
const MARKER = "Fresh-Consent Ladder";

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "p7rbtajg",
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || "production",
  apiVersion: "2026-03-14",
  token: process.env.SANITY_API_TOKEN,
  useCdn: false,
});

const key = () => Math.random().toString(36).slice(2, 12);

interface Span {
  _type: "span";
  _key: string;
  text: string;
  marks: string[];
}
interface Block {
  _type: "block";
  _key: string;
  style: string;
  markDefs: { _key: string; _type: string; href?: string }[];
  children: Span[];
}

function block(text: string, style = "normal"): Block {
  return {
    _type: "block",
    _key: key(),
    style,
    markDefs: [],
    children: [{ _type: "span", _key: key(), text, marks: [] }],
  };
}

/** A paragraph with one inline link. `before` + linked `linkText` + `after`. */
function linkedBlock(before: string, linkText: string, after: string, href: string): Block {
  const linkKey = key();
  return {
    _type: "block",
    _key: key(),
    style: "normal",
    markDefs: [{ _key: linkKey, _type: "link", href }],
    children: [
      { _type: "span", _key: key(), text: before, marks: [] },
      { _type: "span", _key: key(), text: linkText, marks: [linkKey] },
      { _type: "span", _key: key(), text: after, marks: [] },
    ],
  };
}

const SMS_FRAME = (): Block[] => [
  block("Text the people who asked you to", "h2"),
  block(
    "These templates work hardest with prospects who have given your company permission directly. That permission is straightforward to earn, and everything after it gets easier: replies come faster, complaints stay near zero, and the list becomes an asset you can contact for years.",
  ),
  linkedBlock(
    "The consent that arrives with a purchased record names the publisher who captured it, often several months ago. The ",
    "Fresh-Consent Ladder",
    " sets out six plays that turn it into permission of your own, usually within a couple of weeks. Work through those first, then use everything below.",
    LADDER,
  ),
  block(
    "Until then, manual dialing and plain email do the work of re-opening the conversation — and they are what the best aged-lead operations run on anyway.",
  ),
];

const DIALER_FRAME = (): Block[] => [
  block("The dialer mode that fits aged leads", "h2"),
  block(
    "Preview dialing, where you see the record and start each call yourself, is the mode built for this work. It gives you the few seconds of context that make an opening line land on someone who filled in a form months ago, and it keeps you on solid ground with numbers whose consent came from a publisher rather than from you.",
  ),
  linkedBlock(
    "Predictive and parallel modes belong with prospects who have given your company permission covering automated calls. The ",
    "Fresh-Consent Ladder",
    " shows six ways to earn that, and once a prospect is on your own consent record you can dial them any way you like.",
    LADDER,
  ),
];

const TARGETS: { slug: string; frame: () => Block[] }[] = [
  { slug: "sms-templates-insurance-leads", frame: SMS_FRAME },
  { slug: "sms-templates-mortgage-leads", frame: SMS_FRAME },
  { slug: "sms-templates-home-services-leads", frame: SMS_FRAME },
  { slug: "dialer-setup-aged-leads", frame: DIALER_FRAME },
  { slug: "aged-lead-follow-up-machine-crm-dialer", frame: DIALER_FRAME },
];

async function main() {
  console.log(APPLY ? "=== APPLY ===" : "=== DRY RUN (--apply to write) ===");
  if (APPLY && !process.env.SANITY_API_TOKEN) {
    throw new Error("SANITY_API_TOKEN missing — cannot write.");
  }

  const slugs = TARGETS.map((t) => t.slug);
  const posts: { _id: string; slug: string; title: string; body?: Block[] }[] =
    await client.fetch(
      `*[_type == "post" && slug.current in $slugs]{ _id, title, "slug": slug.current, body }`,
      { slugs },
    );

  const missing = slugs.filter((s) => !posts.some((p) => p.slug === s));
  if (missing.length > 0) console.log("NOT FOUND in Sanity:", missing.join(", "));

  let changed = 0;
  for (const target of TARGETS) {
    const post = posts.find((p) => p.slug === target.slug);
    if (!post) continue;

    const body = post.body ?? [];
    // Idempotency: look for the marker anywhere in the first few blocks.
    const opening = body
      .slice(0, 8)
      .flatMap((b) => (b.children ?? []).map((c) => c.text))
      .join(" ");
    if (opening.includes(MARKER)) {
      console.log(`  skip    ${target.slug} — already reframed`);
      continue;
    }

    // Insert AFTER a leading h1 if the post has one, so the title stays first.
    const insertAt = body[0]?.style === "h1" ? 1 : 0;
    const next = [...body.slice(0, insertAt), ...target.frame(), ...body.slice(insertAt)];

    console.log(
      `  REFRAME ${target.slug} — ${body.length} blocks -> ${next.length}, inserting at ${insertAt}`,
    );
    if (!APPLY) continue;

    await client.patch(post._id).set({ body: next }).commit();
    changed++;
    await new Promise((r) => setTimeout(r, 250));
  }

  console.log(APPLY ? `\nreframed ${changed} post(s).` : "\nnothing written.");
}

main()
  .then(() => process.exit(0))
  .catch((e) => {
    console.error("FAILED:", e instanceof Error ? e.message : e);
    process.exit(1);
  });
