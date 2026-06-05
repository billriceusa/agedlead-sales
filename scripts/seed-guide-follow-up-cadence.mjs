import { createClient } from "@sanity/client";

// Rebuilds the "7-Day Aged Lead Follow-Up Cadence" content as a real, indexable
// guide. The old /playbooks/7-day-aged-lead-follow-up-cadence URL ranks page-1
// (pos ~6, 279 impr/3mo) but 301'd to the generic /playbook master — wasting the
// ranking. This restores matching content at /guides/7-day-aged-lead-follow-up-cadence;
// next.config redirects the old URL here (see next.config.ts).

const client = createClient({
  projectId: "p7rbtajg",
  dataset: "production",
  apiVersion: "2026-03-14",
  token: process.env.SANITY_API_TOKEN,
  useCdn: false,
});

function block(text) {
  return {
    _type: "block",
    _key: Math.random().toString(36).slice(2, 10),
    style: "normal",
    markDefs: [],
    children: [{ _type: "span", _key: Math.random().toString(36).slice(2, 10), text, marks: [] }],
  };
}
function heading(text) {
  return {
    _type: "block",
    _key: Math.random().toString(36).slice(2, 10),
    style: "h2",
    markDefs: [],
    children: [{ _type: "span", _key: Math.random().toString(36).slice(2, 10), text, marks: [] }],
  };
}

async function seed() {
  await client.createOrReplace({
    _id: "guide-7-day-aged-lead-follow-up-cadence",
    _type: "guide",
    title: "The 7-Day Aged Lead Follow-Up Cadence That Actually Converts",
    slug: { _type: "slug", current: "7-day-aged-lead-follow-up-cadence" },
    excerpt:
      "A concrete, multi-channel 7-day follow-up cadence for working aged leads — the day-by-day touches, scripts, and timing that turn a ~28% contact rate into booked appointments.",
    leadTypes: [
      { _type: "reference", _ref: "lt-mortgage", _key: "lt1" },
      { _type: "reference", _ref: "lt-insurance", _key: "lt2" },
      { _type: "reference", _ref: "lt-final-expense", _key: "lt3" },
    ],
    seo: {
      metaTitle: "7-Day Aged Lead Follow-Up Cadence (Scripts + Timing)",
      metaDescription:
        "The exact 7-day, multi-channel follow-up cadence for aged leads — day-by-day touches, call and text scripts, and timing. Built for a ~28% contact rate.",
    },
    body: [
      block(
        "Aged leads contact at roughly 28% on average — far lower than a fresh, real-time lead. That single number is why a one-and-done call fails: you'd be writing off nearly three-quarters of a batch you paid for. The fix isn't calling harder, it's calling on a schedule. A structured, multi-channel cadence is what turns a low per-lead contact rate into a profitable per-batch result."
      ),
      block(
        "The good news: with aged leads you are not racing a clock. Nobody else is speed-dialing the same record in the next 90 seconds, so you can run a deliberate sequence of touches across phone, text, and email over a week. This guide gives you that sequence — the exact 7-day cadence, the timing behind each touch, and the scripts to use."
      ),

      heading("Why aged leads need a cadence, not a single call"),
      block(
        "Real-time leads are a sprint; aged leads are a route. Because the consumer inquired weeks ago, the goal of your first touch is not to close — it's to re-open the conversation and find the people in the batch who are still in-market. At a 28% contact rate, most of your connects happen on touches two through five, not touch one. Stop after a single voicemail and you leave the majority of your reachable prospects untouched."
      ),
      block(
        "The economics only work at the batch level. You bought volume cheaply; the cadence is how you convert that volume. Judge the whole batch's cost-per-appointment after seven days of touches — never an individual lead after one dial."
      ),

      heading("The 7-day cadence, touch by touch"),
      block(
        "Day 1 — Text + email (within the first hour you start the batch). Lead with a pattern interrupt that acknowledges time has passed. Short, human, no pitch: \"Hi {first name}, this is {you} — you'd looked into {product} a while back. Are you still sorting that out, or did you already get it handled?\" The acknowledgment of the gap is what separates you from every spammer."
      ),
      block(
        "Day 2 — First phone call, late morning or early evening. If no answer, leave a 12-second voicemail that mirrors the text, then immediately send a follow-up text: \"Just left you a quick voicemail — easier to text if that's better for you.\""
      ),
      block(
        "Day 3 — Plain-text email with one piece of value. No graphics, no template feel. Answer the question they were actually researching (a price range, a common mistake, a quick comparison) and end with a single soft question."
      ),
      block(
        "Day 4 — Second call, at a different time of day than Day 2. Most no-answers are timing, not rejection — if you tried morning, try evening. Different time, same warm opener."
      ),
      block(
        "Day 5 — SMS check-in. One line: \"{First name}, still happy to help you compare {product} options — want me to send a couple of numbers?\" Texts get read; this is often where the quiet ones surface."
      ),
      block(
        "Day 6 — Rest the lead (or, for higher-value verticals, a light email forward of the Day 3 value with a new subject line). Spacing prevents burnout and keeps you out of spam-complaint territory."
      ),
      block(
        "Day 7 — The breakup. A permission-to-close message reliably produces replies: \"{First name}, I don't want to keep bugging you — should I close out your file, or is this still on your radar?\" People who've been silent all week answer this one, because it's easy and it removes pressure."
      ),

      heading("Scripts that fit the cadence"),
      block(
        "Pattern-interrupt opener (calls and first text): acknowledge the gap, ask a yes/no, never assume a relationship. \"You'd looked into {product} a while back — still working on that?\" beats \"I'm following up on your request\" every time, because the second one sounds like a script and the first sounds like a person."
      ),
      block(
        "Voicemail (keep it under 12 seconds): \"Hi {first name}, it's {you} about your {product} question — no rush, just text me back at this number if you still want a hand. Thanks.\" Short voicemails get callbacks; long ones get deleted."
      ),
      block(
        "Breakup (Day 7): \"Should I close out your file, or keep it open?\" The reply rate on a clean breakup is consistently higher than any mid-week nudge — use it."
      ),

      heading("What to do after Day 7"),
      block(
        "Don't delete non-responders — recycle them. Move anyone who never replied into a long-cycle \"infinity\" nurture: a low-frequency email touch every few weeks with genuine value. Markets change, life circumstances change, and a record that was cold in week one can re-enter the market two months later. The cheap cost basis of aged leads is what makes this long tail worth keeping."
      ),

      heading("Common cadence mistakes"),
      block(
        "Calling once and quitting. Most connects happen on later touches; quitting after one dial wastes the batch. Using a single channel. Phone-only ignores the people who will only text or email — and at a 28% contact rate you can't afford to skip a channel. Sounding like a script. The whole edge of the pattern-interrupt opener is that it sounds human; read it robotically and you lose it. Judging single leads. The metric that matters is cost-per-appointment across the batch, not the outcome of any one record."
      ),
      block(
        "Map your own numbers before you start: use the Outreach Cadence Planner to size how many leads and touches you need to hit your appointment target, and the ROI calculator to confirm the batch math pencils out at your close rate and deal value."
      ),
    ],
  });
  console.log("✓ Guide published: 7-day-aged-lead-follow-up-cadence");
}

seed().catch((e) => {
  console.error(e);
  process.exit(1);
});
