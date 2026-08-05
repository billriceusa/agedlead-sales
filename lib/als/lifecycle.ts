// Aged Leads Insights — lifecycle email engine (welcome + replenishment).
//
// A triggered, value-first email program layered on the harvested buyer list
// ([[als_buyer_contacts]]). Co-branded: Work Aged Leads (Bill Rice's expertise) is
// the voice; AgedLeadStore is the single buy CTA. The "welcome" series is NOT a
// transactional order receipt — AgedLeadStore already sends registration +
// first-order email. This is subtle, never references a specific order, starts 3
// days after a contact lands on the list, and positions aged leads as a
// consistent, affordable revenue engine vs. real-time leads + referrals.
//
// SAFETY: all real sending is gated by ALS_LIFECYCLE_SEND_ENABLED. While off,
// runLifecycle persists nothing and sends nothing — it only computes a plan.
//
// State lives in als_buyer_journeys (one row per contact+journey). The cron
// advances at most one step per journey per run, gated by next_due_at, capped
// by ALS_LIFECYCLE_SEND_CAP so the first launch drips instead of blasting.

import { createHmac, timingSafeEqual } from "crypto";
import { and, eq, isNull, lte, gte, asc, sql } from "drizzle-orm";
import { db } from "@/lib/db";
import { alsBuyerContacts, alsBuyerJourneys } from "@/lib/db/schema";
import { sendSingleEmail } from "@/lib/resend";
import {
  ALS_BUY_URL,
  ALS_LIFECYCLE_FROM,
  ALS_LIFECYCLE_REPLY_TO,
  ALS_LIFECYCLE_SEND_CAP,
  ALS_UNSUB_SECRET,
  ALS_PUBLIC_APP_URL,
  ALS_AI_SERIES_ENABLED,
} from "@/lib/als/config";
import { SITE_HOST, SITE_URL } from "@/lib/site-url";
import { AFFILIATE_UTM_SOURCE } from "@/lib/utm";

const DAY_MS = 86_400_000;
const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

export type JourneyName = "welcome" | "ai-series" | "replenishment";

// Replenishment window: nudge buyers whose last order is 21–90 days old. Older
// than 90d with no reorder → lapsed, handled by the (future) reactivation track.
const REPLENISH_MIN_DAYS = 21;
const REPLENISH_MAX_DAYS = 90;
const WELCOME_START_DAYS = 3; // first welcome email fires this many days after list arrival

// Caps so the first launch over the existing list ramps instead of blasting.
const ENROLL_CAP = 400;

// ---------------------------------------------------------------------------
// Rendering
// ---------------------------------------------------------------------------

interface RenderCtx {
  firstName: string;
  vertical: string | null; // leadType (inquiries only); null for purchasers
  states: string | null;
  lastOrderAmount: number | null;
  lifetimeOrders: number | null;
}

function esc(s: string): string {
  return s.replace(/[&<>"]/g, (c) =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c] as string
  );
}

// Standing Buy CTA with UTMs. Vertical deep-linking is deferred until the exact
// storefront category slugs are verified (avoid shipping 404s) — everything
// points at /all-lead-types/ for now.
function buyUrl(campaign: string, content: string): string {
  const p = new URLSearchParams({
    utm_source: AFFILIATE_UTM_SOURCE,
    utm_medium: "email",
    utm_campaign: campaign,
    utm_content: content,
  });
  return `${ALS_BUY_URL}?${p.toString()}`;
}

// Link to Bill's free tools/calculators on the site (planning aids),
// UTM-tagged. These are real, live pages: /calculators/{pipeline-calculator,
// roi-calculator, lead-cost-calculator, know-your-cpl, outreach-cadence-planner}.
function tool(path: string, campaign: string, content: string): string {
  const p = new URLSearchParams({
    utm_source: AFFILIATE_UTM_SOURCE,
    utm_medium: "email",
    utm_campaign: campaign,
    utm_content: content,
  });
  return `${SITE_URL}${path}?${p.toString()}`;
}

// --- Unsubscribe (per-recipient signed link, honored before every send) ---
function unsubToken(contactId: number): string {
  return createHmac("sha256", ALS_UNSUB_SECRET)
    .update(`als-unsub:${contactId}`)
    .digest("hex")
    .slice(0, 32);
}

export function unsubUrl(contactId: number): string {
  return `${ALS_PUBLIC_APP_URL}/api/als/unsubscribe?c=${contactId}&t=${unsubToken(contactId)}`;
}

export function verifyUnsubToken(contactId: number, token: string): boolean {
  const a = Buffer.from(token);
  const b = Buffer.from(unsubToken(contactId));
  return a.length === b.length && timingSafeEqual(a, b);
}

// Mark a contact unsubscribed and stop any active journeys. One opt-out kills
// all lifecycle email to that address.
export async function unsubscribeContact(contactId: number): Promise<void> {
  const now = new Date();
  await db
    .update(alsBuyerContacts)
    .set({ unsubscribed: true })
    .where(eq(alsBuyerContacts.id, contactId));
  await db
    .update(alsBuyerJourneys)
    .set({ status: "exited", nextDueAt: null, updatedAt: now })
    .where(
      and(
        eq(alsBuyerJourneys.contactId, contactId),
        eq(alsBuyerJourneys.status, "active")
      )
    );
}

// Shared email shell: lockup header, body, standing CTA button, BRC LLC footer.
function layout(opts: {
  preheader: string;
  bodyHtml: string;
  campaign: string;
  ctaContent?: string;
}): string {
  const cta = buyUrl(opts.campaign, opts.ctaContent || "standing-cta");
  return `<!doctype html><html><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;background:#eceff3;font-family:-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif;color:#1c2530;">
<span style="display:none;max-height:0;overflow:hidden;opacity:0;">${esc(opts.preheader)}</span>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#eceff3;"><tr><td align="center" style="padding:24px 12px;">
<table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:#ffffff;border-radius:12px;overflow:hidden;border:1px solid #d8dee6;">
  <tr><td style="background:#0f2233;padding:16px 24px;">
    <div style="font-size:12px;letter-spacing:.16em;text-transform:uppercase;color:#9fb3c4;">Aged Leads Insights</div>
    <div style="font-size:18px;font-weight:700;color:#ffffff;margin-top:2px;">Bill Rice</div>
  </td></tr>
  <tr><td style="padding:26px 28px 8px;font-size:15px;line-height:1.62;color:#1c2530;">
    ${opts.bodyHtml}
    <div style="text-align:center;margin:24px 0 10px;">
      <a href="${cta}" style="display:inline-block;background:#e8a020;color:#1c2530;font-weight:800;text-decoration:none;padding:13px 28px;border-radius:8px;font-size:15px;">Buy Aged Leads &rarr;</a>
    </div>
  </td></tr>
  <tr><td style="border-top:1px solid #eef1f5;padding:16px 28px 22px;color:#7c8a99;font-size:12px;line-height:1.5;">
    You're receiving Aged Leads Insights — practical coaching on working aged leads — published by Bill Rice.<br>
    Bill Rice Strategy Group &middot; 750 E. Hurd Rd., Monroe, MI 48162 &middot; <a href="{{UNSUBSCRIBE_URL}}" style="color:#7c8a99;">Unsubscribe</a>
  </td></tr>
</table>
</td></tr></table></body></html>`;
}

function p(...paras: string[]): string {
  return paras
    .map((t) => `<p style="margin:0 0 13px;">${t}</p>`)
    .join("");
}

interface StepDef {
  offsetDays: number; // measured from the journey's anchorAt
  campaign: string;
  subject: (c: RenderCtx) => string;
  preheader: string;
  body: (c: RenderCtx) => string;
}

const hi = (c: RenderCtx) => esc(c.firstName || "there");

// --- Welcome series (purchasers): value-first, subtle, never references an order ---
const WELCOME: StepDef[] = [
  {
    offsetDays: WELCOME_START_DAYS, // 3
    campaign: "welcome-e1",
    subject: () => "The most underrated revenue source in your business",
    preheader: "A quick note from Bill on getting the most out of aged leads.",
    body: (c) =>
      p(
        `Hi ${hi(c)} — I'm Bill Rice. If you're working aged leads (or thinking about it), this short series is for you.`,
        `Here's the case I want to make over the next couple of weeks: worked correctly, aged leads are the most <b>consistent, affordable</b> source of new business you have. More predictable than waiting on real-time leads to come in, and far faster than waiting for referrals to trickle back.`,
        `The catch is in those two words — "worked correctly." Most agents treat a list of aged leads like a lottery ticket: dial a few, get discouraged, move on. The ones who build a real, repeatable revenue stream do a handful of things differently. That's what I'll walk you through — one idea per email, no fluff.`,
        `First one lands in a couple of days. It's the simplest change that makes everything else work: how you make first contact.`,
        `Want the full breakdown first? I laid out the numbers here: <a href="${tool("/blog/economics-of-aged-leads", "welcome-e1", "deep-read")}" style="color:#0b6bcb;">the economics of aged leads</a>.`,
        `Talk soon,<br>Bill`
      ),
  },
  {
    offsetDays: 6,
    campaign: "welcome-e2",
    subject: () => "Cost per lead is the wrong number",
    preheader: "The simple math behind why aged leads win.",
    body: (c) =>
      p(
        `Hi ${hi(c)} — let's talk numbers, because once you see this math you'll never look at a lead price the same way again.`,
        `Most agents shop on <i>cost per lead</i>. That's the wrong number. The only one that pays your bills is <b>cost per sale</b>.`,
        `Here it is in round numbers. A fresh lead might cost $50 and close 1 in 10 — about $500 a sale. An aged lead might cost a dollar or two and close closer to 1 in 30 — call it $30–60 a sale. Same effort per dial, a fraction of the cost per sale. You trade a little contact rate for a big cost advantage, and at volume that math is lopsided in your favor.`,
        `Your real numbers will be different — that's exactly the point. Don't take my word for it; model your own. I built free calculators on ${SITE_HOST} so you can, before you spend a dollar:`,
        `<b><a href="${tool("/calculators/pipeline-calculator", "welcome-e2", "pipeline-calc")}" style="color:#0b6bcb;">Pipeline Calculator</a></b> — enter your revenue goal and close rate; it tells you how many aged leads you actually need.<br>
         <b><a href="${tool("/calculators/roi-calculator", "welcome-e2", "roi-calc")}" style="color:#0b6bcb;">ROI Calculator</a></b> — model the return on a batch at your own numbers.`,
        `Run them once and you'll know exactly how to plan aged leads into your month — how many to buy, what to expect, what it costs to hit your goal. That's how "buying leads" becomes a budget line that pays.`,
        `Want the data behind the math? Here are the <a href="${tool("/blog/aged-lead-conversion-rates-by-industry-data-benchmarks", "welcome-e2", "deep-read")}" style="color:#0b6bcb;">conversion-rate benchmarks by industry</a>.`,
        `Next: the simplest change that makes those numbers actually happen — how you make first contact.<br>— Bill`
      ),
  },
  {
    offsetDays: 9,
    campaign: "welcome-e3",
    subject: () => "Don't dial first. Do this instead.",
    preheader: "The simple warm-up that makes your first call welcome.",
    body: (c) =>
      p(
        `Hi ${hi(c)} — most agents open the list and start dialing. The ones who do best send a short email first.`,
        `Here's why: a brief, helpful email puts your name in front of someone before you call, and it surfaces the people who are actually still in the market. Dial someone who saw your note yesterday and you're not a stranger anymore.`,
        `There's also a compliance reason this matters. These are purchased leads — the people on your list never gave you permission to text them. <b>Texting that data is a real danger zone</b>; it's where agents get themselves in trouble. Email and the phone are the safe, effective path. Skip the texting.`,
        `A warm-up email you can steal:`,
        `<span style="display:block;border-left:3px solid #0b6bcb;background:#f3f7fb;padding:10px 14px;border-radius:0 6px 6px 0;color:#33424f;font-size:14px;">Hi [First name], I'm [Name], a licensed [type] in [state]. I help people in your area find better options on [coverage], and I'd be glad to take a quick look at where you stand. Would a short call this week be useful? No pressure either way. — [Name], [phone]</span>`,
        `To send these without it feeling like marketing, use a simple <b>drip tool</b> that sends one personal-looking email at a time — I like <b>QuickMail</b>. Skip the mass-blast platforms like Constant Contact; their emails look like ads, which is exactly what you don't want here. Plain text from your own Gmail works too.`,
        `Notice the email never mentions a form from months ago, and it doesn't pitch. It offers a look. That's the whole job of the first touch.`,
        `Want more to swipe? Here's a stack of <a href="${tool("/blog/email-outreach-aged-leads-templates", "welcome-e3", "deep-read")}" style="color:#0b6bcb;">aged-lead email templates</a>.`,
        `Next: turning that into a booked conversation.<br>— Bill`
      ),
  },
  {
    offsetDays: 12,
    campaign: "welcome-e4",
    subject: () => "Stop pitching. Start booking.",
    preheader: "Why the appointment beats the pitch on aged leads.",
    body: (c) =>
      p(
        `Hi ${hi(c)} — the biggest mistake on aged leads is trying to close on the first contact. The person doesn't remember the form, doesn't know you, and won't buy from a stranger in ninety seconds.`,
        `So don't sell. <b>Book a conversation.</b> Your only goal on first contact is a short, no-pressure appointment to review their situation: "Let me take a look at what you've got and tell you honestly whether there's a better option." People say yes to help. They say no to a pitch.`,
        `Then make saying yes effortless — put a <b>scheduling link</b> right in your email and your voicemail. When someone can pick their own time in a couple of taps, they feel in control, and that control builds trust faster than anything you can say on the phone. It's also frictionless, which means more booked calls and fewer games of phone tag.`,
        `You don't need fancy software: Calendly's free plan works, and Google Calendar's appointment scheduling is free with any Google account. Pick one, put the link everywhere, and let people book themselves.`,
        `On the phone, keep it just as soft:`,
        `<span style="display:block;border-left:3px solid #0b6bcb;background:#f3f7fb;padding:10px 14px;border-radius:0 6px 6px 0;color:#33424f;font-size:14px;">"Hi [First name], this is [Name], a licensed [type] here in [state]. I sent you a note — I help folks in your area make sure they're not overpaying for [coverage]. Do you have two minutes now, or would it be easier if I sent you a link to grab a time that works for you?"</span>`,
        `Present tense. Value. A question, not a monologue. If they're busy, you're booking a time — that's a win, not a rejection.`,
        `Want a deeper script library? Here are the <a href="${tool("/blog/aged-lead-scripts-that-work", "welcome-e4", "deep-read")}" style="color:#0b6bcb;">aged-lead scripts that work</a>.`,
        `Next: the part almost everyone gets wrong.<br>— Bill`
      ),
  },
  {
    offsetDays: 15,
    campaign: "welcome-e5",
    subject: () => 'Why most aged leads "don\'t work"',
    preheader: "Most agents quit after one or two tries. Here's the data.",
    body: (c) =>
      p(
        `Hi ${hi(c)} — here's the uncomfortable truth about why most aged leads "don't work": the agent gave up too soon.`,
        `In one of the largest studies ever done on lead conversion, <b>93% of the leads that eventually converted were reached within six attempts</b> — but the average agent stops after one or two. They call once, get voicemail, and write the lead off. The person who keeps showing up gets the sale.`,
        `I call it <b>polite persistence</b>. Not pestering — persistence with manners. You reach out again because you genuinely believe you can help, and you respect their time every time.`,
        `A humane two-week rhythm: a few calls the first week (vary the time) plus your warm-up email; a few more the second week plus one more short note; then a light monthly check-in for the ones who went quiet. Call when people answer — <a href="${tool("/blog/best-time-to-call-aged-insurance-leads", "welcome-e5", "deep-read")}" style="color:#0b6bcb;">late morning and late afternoon</a>. Dial by hand, list scrubbed (more on that next).`,
        `If you'd rather not map it by hand, I built a free <a href="${tool("/calculators/outreach-cadence-planner", "welcome-e5", "cadence-planner")}" style="color:#0b6bcb;">outreach cadence planner</a> on ${SITE_HOST} — plug in your batch and it lays the touches out day by day.`,
        `That's the whole campaign. Politely persistent, by phone and email, every name treated like the person it is.<br>— Bill`
      ),
  },
  {
    offsetDays: 18,
    campaign: "welcome-e6",
    subject: () => "Work them hard — and stay out of trouble",
    preheader: "The 5-minute compliance version for purchased leads.",
    body: (c) =>
      p(
        `Hi ${hi(c)} — let me make this simple, because it matters and most agents never get a straight answer. (This is guidance, not legal advice — your compliance is on you.)`,
        `When you work purchased leads, the consumer didn't give you consent, and that changes the rules. Four things keep you clean:`,
        `<b>1. Scrub before you dial.</b> Run the list against federal and applicable state Do-Not-Call registries plus your own internal DNC. You'll need a SAN for the federal list.<br>
         <b>2. Dial by hand.</b> Skip autodialers, prerecorded or artificial voice, and ringless voicemail on this data.<br>
         <b>3. Don't text it.</b> Texting consumers who never consented is the fastest route to a TCPA problem. Email and phone.<br>
         <b>4. Honor every "no."</b> If someone asks not to be contacted, log it and stop.`,
        `Now the pro move most agents miss: use your emails to <b>earn</b> the right to call and text. Email is allowed on this data, so let it do the heavy lifting. Put a scheduling link in your emails that asks for a phone number and permission to text when someone books — the moment they fill that out, you've turned a cold purchased lead into a fully <b>consented</b> one. Calendly and free Google Calendar booking both capture it for you. It's the cleanest way to build a list you can legally work hard.`,
        `Do all this and you can work aggressively without looking over your shoulder. Polite persistence, inside the lines.`,
        `Last one next: how to make this a steady paycheck instead of a one-off.<br>— Bill`
      ),
  },
  {
    offsetDays: 21,
    campaign: "welcome-e7",
    subject: () => "Turning aged leads into a steady paycheck",
    preheader: "The difference between a gamble and a revenue engine.",
    body: (c) =>
      p(
        `Hi ${hi(c)} — we've covered the whole method: warm up with an email, earn a conversation, then be politely persistent on the phone — all scrubbed and compliant.`,
        `Here's the last piece, and it's the one that actually builds income: <b>do it on a rhythm.</b>`,
        `The agents who turn aged leads into real money don't buy when they're desperate and then go quiet. They keep a steady flow — a fresh batch every few weeks, worked the same way each time. That consistency is what makes aged leads beat the alternatives: you're not waiting on real-time leads to show up or hoping referrals trickle in. You control the tap.`,
        `And keep your tools simple and cheap — you don't need an expensive sales suite for this. <b>Google Workspace</b> covers almost everything: Gmail for outreach, Google Calendar for booking and consent, Google Meet for the appointments, Docs and Slides for anything you present. Add one drip email tool — I like <b>QuickMail</b> — and that's the whole stack. Affordable, frictionless, and it scales as you do.`,
        `A thin pipeline is a stressful pipeline, and stress shows up on the phone. Keep the engine running — line up your next batch before you finish this one:`,
        `And do me a favor: hit reply and tell me how it's going. Wins, questions, where you're stuck. I read every one.<br>— Bill Rice, Aged Leads Insights`
      ),
  },
];

// --- Replenishment series (purchasers, 21–90d since last order) ---
const REPLENISHMENT: StepDef[] = [
  {
    offsetDays: 0, // anchor = enrollment (≈21d after last order)
    campaign: "replenish-r1",
    subject: () => "Keep the engine running",
    preheader: "The agents who win keep a steady flow.",
    body: (c) =>
      p(
        `Hi ${hi(c)} — quick nudge from Bill.`,
        `If you've been working your last batch, you've probably reached the easy contacts by now — and that's exactly the moment most agents let the pipeline go thin. The ones who keep their income steady reload <b>before</b> they run dry, so there's always a fresh batch behind the one they're finishing.`,
        `That steady rhythm is the whole advantage of aged leads over waiting on real-time leads or referrals: you decide when the next wave of opportunity shows up. Line it up:`,
        `— Bill`
      ),
  },
  {
    offsetDays: 11, // ≈32d since last order
    campaign: "replenish-r2",
    subject: () => "One thing to do differently on your next batch",
    preheader: "A small tweak that lifts your contact rate.",
    body: (c) =>
      p(
        `Hi ${hi(c)} — one tip before your next run.`,
        `Most agents work a batch top to bottom and call it done. Try this instead: on your next list, send the warm-up email to <i>everyone</i> first, then prioritize your calls toward the people who opened or replied. You'll spend your dialing hours on the warmest names and your contact rate climbs.`,
        `Small change, real difference — and it only works if there's a fresh batch to run it on. Ready when you are:`,
        `— Bill`
      ),
  },
  {
    offsetDays: 24, // ≈45d since last order
    campaign: "replenish-r3",
    subject: () => "Don't let your pipeline go cold",
    preheader: "A nudge before the momentum's gone.",
    body: (c) =>
      p(
        `Hi ${hi(c)} — it's been a little while since your last batch, and I don't want your momentum to slip.`,
        `The hardest part of any sales month is starting from an empty pipeline. The fix is simple — keep a steady flow of opportunity coming in so you're never starting cold. Aged leads make that affordable to do every few weeks.`,
        `If now's the time, here's where to reload. Whenever you're ready, I'm in your corner:`,
        `— Bill`
      ),
  },
];

// --- AI-for-aged-leads series (after a contact completes welcome) ---
// Value continuation. Anti-hype: AI removes friction (blank page + busywork),
// never replaces the agent, never invents facts, never goes on the call.
const AI_SERIES: StepDef[] = [
  {
    offsetDays: 0, // anchor = enrollment (right after welcome completes)
    campaign: "ai-e1",
    subject: () => "The unfair advantage hiding in plain sight",
    preheader: "AI won't dial for you — but it kills the two things that slow you down.",
    body: (c) =>
      p(
        `Hi ${hi(c)} — quick one. You've got the method down: warm up, book a conversation, politely persist. Now let me hand you the thing that makes all of it faster — AI.`,
        `Let me be straight: AI is not magic and it won't dial a single lead for you. What it kills is the two things that actually slow agents down — the blank page and the busywork. Drafting the email, building the script, writing the follow-up, prepping for a call. Minutes instead of hours.`,
        `One rule before we start: <b>AI writes the draft; you own the facts.</b> Never let it invent a rate, a quote, or a detail about a person. Everything it gives you is a first draft to check, not gospel. (More on the lines you don't cross at the end of this series.)`,
        `I put my go-to prompts in one place — steal them: <a href="${tool("/blog/chatgpt-prompts-aged-leads", "ai-e1", "prompt-library")}" style="color:#0b6bcb;">the ChatGPT Prompt Library for aged-lead outreach</a>. Over the next few emails I'll show you exactly how I use the best ones.`,
        `First up: writing your warm-up email in about 30 seconds, in your own voice.<br>— Bill`
      ),
  },
  {
    offsetDays: 3,
    campaign: "ai-e2",
    subject: () => "Write your warm-up email in 30 seconds",
    preheader: "The prompt — plus how to make it sound like you, not a robot.",
    body: (c) =>
      p(
        `Hi ${hi(c)} — remember the warm-up email, the one that makes your first call welcome? Here's how to write it in seconds without it sounding like a robot.`,
        `Paste this into ChatGPT (or any AI), filling in the brackets:`,
        `<span style="display:block;border-left:3px solid #0b6bcb;background:#f3f7fb;padding:10px 14px;border-radius:0 6px 6px 0;color:#33424f;font-size:14px;">"You're helping a licensed [type] agent in [state] write a SHORT, warm, plain-text email to someone who asked about [coverage] a while back. Goal: a quick, no-pressure phone call. No hype, no jargon, under 90 words, friendly and human. Don't mention a 'form.' Give me 3 versions."</span>`,
        `The trick that makes it sound like <i>you</i>: paste in one or two emails you've actually written and add "match this voice." AI is a great mimic — give it a sample and it stops sounding generic.`,
        `Then read it out loud before you send. If it sounds like a brochure, tell it "make it more casual, like a note to a neighbor." Thirty seconds, three drafts, pick the one that sounds like you.`,
        `And the rule again: it can write the words, but you check every fact. Don't let it promise a rate or a product you can't stand behind.`,
        `Want more angles to start from? Here's a library of <a href="${tool("/blog/email-outreach-aged-leads-templates", "ai-e2", "deep-read")}" style="color:#0b6bcb;">aged-lead email templates</a>.`,
        `Tomorrow: a call script built for your exact leads.<br>— Bill`
      ),
  },
  {
    offsetDays: 6,
    campaign: "ai-e3",
    subject: () => "A call script built for your exact leads",
    preheader: "Stop using someone else's generic script.",
    body: (c) =>
      p(
        `Hi ${hi(c)} — a generic script feels generic on the phone. Here's how to get one built for your product, your state, your objections — in about two minutes.`,
        `The prompt:`,
        `<span style="display:block;border-left:3px solid #0b6bcb;background:#f3f7fb;padding:10px 14px;border-radius:0 6px 6px 0;color:#33424f;font-size:14px;">"Act as a sales coach for [type] insurance. Write a short, natural phone script for calling aged leads who inquired about [coverage]. Open with present-tense value (never 'you filled out a form'). The goal is to book a quick review, not to close. Then give me responses to the 3 objections I hear most: [your objections]. Keep it conversational, not salesy."</span>`,
        `Feed it the objections that actually stop you and it'll hand you language for each. Tweak, don't recite — you want a script that sounds like you talking, not reading.`,
        `One hard line, because it matters: use AI to <b>prep</b> the call, never to <b>make</b> it. AI voice agents and synthetic or prerecorded voices on non-consented leads are a TCPA minefield. You dial, you talk. The AI just gets you ready.`,
        `Want a head start to feed it? Here are proven <a href="${tool("/blog/aged-lead-scripts-that-work", "ai-e3", "deep-read")}" style="color:#0b6bcb;">aged-lead scripts that work</a>.`,
        `Next: turning every call into your next move — automatically.<br>— Bill`
      ),
  },
  {
    offsetDays: 9,
    campaign: "ai-e4",
    subject: () => "Turn every call into your next move",
    preheader: "The after-the-call busywork, done in seconds.",
    body: (c) =>
      p(
        `Hi ${hi(c)} — the thing that kills momentum isn't the calls, it's everything after: notes, logging, the follow-up email, remembering to circle back. AI eats that for breakfast.`,
        `Right after a call, jot 3–4 messy bullets — what they said, their situation, the next step. Then:`,
        `<span style="display:block;border-left:3px solid #0b6bcb;background:#f3f7fb;padding:10px 14px;border-radius:0 6px 6px 0;color:#33424f;font-size:14px;">"Here are my rough notes from a call with an aged lead: [paste bullets]. 1) Clean these into 2–3 sentences for my CRM. 2) Draft a short, friendly follow-up email matching what we discussed. 3) Tell me the single best next action, and when."</span>`,
        `You get tidy notes, a ready-to-edit follow-up, and a clear next step — in the time it takes to grab coffee. Do it between calls and you never lose a lead to "I'll get to it later."`,
        `Same rule: it organizes what <i>you</i> said happened. It doesn't get to invent what was discussed or what you promised.`,
        `Want your CRM set up to catch all this automatically? Here's the <a href="${tool("/blog/aged-lead-crm-setup-guide", "ai-e4", "deep-read")}" style="color:#0b6bcb;">aged-lead CRM setup guide</a>.`,
        `Next, for the advanced crowd: stop taking notes on your calls altogether.<br>— Bill`
      ),
  },
  {
    offsetDays: 12,
    campaign: "ai-e5",
    subject: () => "Stop taking notes. Record the whole call.",
    preheader: "The upgrade serious operators use — done the compliant way.",
    body: (c) =>
      p(
        `Hi ${hi(c)} — last email you jotted a few notes after each call. Here's the upgrade serious operators use: don't take notes at all. <b>Record and transcribe the whole conversation.</b>`,
        `Why it changes everything: you stop splitting your attention between listening and scribbling, so you're fully present — and you capture every detail, including the offhand nuance (a kid starting college, a renewal coming up, "call me after the holidays") that's worth money later and that handwritten notes always miss.`,
        `Then AI reads the full transcript and writes a follow-up that references what they <i>actually said</i>, in their own words. That's the difference between "great talking to you" and a note that proves you listened — the first gets ignored, the second books the next call.`,
        `The tool I use is <b>Granola</b> — it runs quietly in the background and transcribes. Two things so you use it right: for a call you take <b>on your computer</b> (a softphone or dialer on your laptop) it captures both sides cleanly; for a <b>cell call</b>, put it on speaker with the app open — or just turn on your dialer's built-in recording. (Granola doesn't tap the phone line itself.) <a href="https://granola.ai" style="color:#0b6bcb;">granola.ai</a>`,
        `And the one rule you can't skip: <b>get consent to record.</b> Federal law allows one-party consent, but about a dozen states — California, Florida, Illinois, Pennsylvania, Washington and more — require <i>everyone</i> on the call to agree, and on an out-of-state call the stricter law can apply. So make it bulletproof: open every call with "I record my calls so I can follow up accurately — is that okay with you?" and wait for a yes. That one sentence keeps you safe everywhere. (General guidance, not legal advice — check your state if unsure.)`,
        `Want to go deeper on what to do with the recordings? Here's the full <a href="${tool("/blog/aged-lead-call-recording-analysis", "ai-e5", "deep-read")}" style="color:#0b6bcb;">call-recording analysis playbook</a>.`,
        `Next: how to make all of this document itself.<br>— Bill`
      ),
  },
  {
    offsetDays: 15,
    campaign: "ai-e6",
    subject: () => "Your database should document itself",
    preheader: "Let AI + your CRM do the data entry — and pay you for years.",
    body: (c) =>
      p(
        `Hi ${hi(c)} — here's where it all comes together, and where a lot of money quietly hides: in the leads you already talked to.`,
        `Once you're recording and transcribing, an AI agent can do the busywork you hate — take the transcript, write a clean summary, log it as a note in your CRM, update the fields (budget, timeline, renewal date), and set your next follow-up task. Automatically, while you're already on the next call.`,
        `This isn't hypothetical. The big CRMs now plug straight into AI: <b>HubSpot</b> and <b>GoHighLevel</b> both have official connectors (they call them MCP servers) that let an AI assistant read and write your records — Salesforce has one in early release. And the dialer-CRMs a lot of agents use — Ricochet360, VanillaSoft, Ringy — all have APIs, so the same automation works with a little setup (or a tool like Zapier in between).`,
        `Now the payoff. Every conversation you capture turns your database into a complete, searchable history of every relationship — and that's a goldmine you can work for years:`,
        `<span style="display:block;border-left:3px solid #0b6bcb;background:#f3f7fb;padding:10px 14px;border-radius:0 6px 6px 0;color:#33424f;font-size:14px;"><b>Renewals:</b> AI flags every policy coming up and drafts the check-in.<br><b><a href="${tool("/blog/aged-refinance-leads-most-undervalued-mortgage-asset", "ai-e6", "deep-read-refi")}" style="color:#0b6bcb;">Refinance re-engagement:</a></b> the day rates drop, you've got a documented book of past mortgage prospects to call — with notes on exactly what each one needed.<br><b>Nurture &amp; win-back:</b> the folks who said "not now" told you when "now" would be. The transcript remembered, even if you didn't.</span>`,
        `Most agents let that history evaporate. The ones who capture it never start from zero again — every lead they've ever touched becomes an asset they can re-engage on command. That's how a list of aged leads turns into a book of business.`,
        `Want the full build? Here's how to turn your CRM into a <a href="${tool("/blog/aged-lead-follow-up-machine-crm-dialer", "ai-e6", "deep-read")}" style="color:#0b6bcb;">follow-up machine</a>.`,
        `One more, the last one — using all this power without crossing the line.<br>— Bill`
      ),
  },
  {
    offsetDays: 18,
    campaign: "ai-e7",
    subject: () => "Using all this power without crossing the line",
    preheader: "The guardrails that keep AI an asset, not a liability.",
    body: (c) =>
      p(
        `Hi ${hi(c)} — last one, and it's the most important: how to use everything in this series without getting yourself in trouble.`,
        `Quick win first: before a block of calls, have AI prep your talking points for the vertical and the area — common concerns for [coverage] buyers in [state], good questions to ask, what tends to matter to them. You'll sound like you did your homework, because you did.`,
        `Now the lines you don't cross — this is where AI gets agents in trouble:`,
        `<span style="display:block;border-left:3px solid #b4690e;background:#fdf3e6;padding:10px 14px;border-radius:0 6px 6px 0;color:#5b4a2e;font-size:14px;"><b>Get consent before you record</b> — every call, every time. Never feed AI a real person's private info and ask it to "find" more. Never let it generate facts, rates, or claims about an individual. Keep transcripts and client data in tools you trust — not pasted into random free websites. Never write something you wouldn't say to their face. And never put an AI voice on the actual call.</span>`,
        `Used right, AI is the best assistant you'll ever have — it removes the friction so you spend your time where the money is: talking to people. Used wrong, it invents things and creates risk. You're the human in the loop. Keep it that way.`,
        `That's the series. Go put it to work — and keep a fresh batch in the pipeline so there's always someone to call:<br>— Bill Rice, Aged Leads Insights`
      ),
  },
];

const STEPS: Record<JourneyName, StepDef[]> = {
  welcome: WELCOME,
  "ai-series": AI_SERIES,
  replenishment: REPLENISHMENT,
};

export function journeyLength(journey: JourneyName): number {
  return STEPS[journey].length;
}

// Render one email (1-based step). Used by the cron to send and by ?mode=render.
export function renderLifecycleEmail(
  journey: JourneyName,
  step: number,
  ctx: RenderCtx
): { subject: string; html: string; campaign: string } {
  const def = STEPS[journey][step - 1];
  if (!def) throw new Error(`No ${journey} step ${step}`);
  return {
    subject: def.subject(ctx),
    html: layout({ preheader: def.preheader, bodyHtml: def.body(ctx), campaign: def.campaign }),
    campaign: def.campaign,
  };
}

function ctxFromRow(row: {
  firstName: string | null;
  leadType: string | null;
  states: string | null;
  lastOrderAmount: number | null;
  lifetimeOrders: number | null;
}): RenderCtx {
  return {
    firstName: row.firstName || "",
    vertical: row.leadType,
    states: row.states,
    lastOrderAmount: row.lastOrderAmount,
    lifetimeOrders: row.lifetimeOrders,
  };
}

// ---------------------------------------------------------------------------
// Eligibility (read-only)
// ---------------------------------------------------------------------------

export interface LifecyclePlan {
  sendEnabled: boolean;
  aiSeriesEnabled: boolean;
  welcomeEligible: number; // purchasers ready to enroll in welcome
  aiSeriesEligible: number; // welcome-completed contacts ready for the AI series
  replenishEligible: number; // purchasers ready to enroll/refresh replenishment
  activeWelcome: number; // journeys currently active
  activeAiSeries: number;
  activeReplenishment: number;
  dueNow: number; // active steps past due (would send this run)
}

// Purchasers eligible to START the welcome series: on the list ≥3 days, sendable,
// not unsubscribed, no welcome journey row yet.
async function eligibleWelcome(limit?: number) {
  const cutoff = new Date(Date.now() - WELCOME_START_DAYS * DAY_MS);
  const q = db
    .select({
      contactId: alsBuyerContacts.id,
      firstSeenAt: alsBuyerContacts.firstSeenAt,
      firstName: alsBuyerContacts.firstName,
      leadType: alsBuyerContacts.leadType,
      states: alsBuyerContacts.states,
      lastOrderAmount: alsBuyerContacts.lastOrderAmount,
      lifetimeOrders: alsBuyerContacts.lifetimeOrders,
      jid: alsBuyerJourneys.id,
    })
    .from(alsBuyerContacts)
    .leftJoin(
      alsBuyerJourneys,
      and(
        eq(alsBuyerJourneys.contactId, alsBuyerContacts.id),
        eq(alsBuyerJourneys.journey, "welcome")
      )
    )
    .where(
      and(
        eq(alsBuyerContacts.source, "purchaser"),
        eq(alsBuyerContacts.sendable, true),
        eq(alsBuyerContacts.unsubscribed, false),
        lte(alsBuyerContacts.firstSeenAt, cutoff),
        isNull(alsBuyerJourneys.id)
      )
    )
    .orderBy(asc(alsBuyerContacts.firstSeenAt));
  return limit ? await q.limit(limit) : await q;
}

// Purchasers whose last order is 21–90 days old and who aren't mid-welcome.
// JS-filters for the replenishment re-enroll rules (handled by the caller).
async function replenishCandidates(limit?: number) {
  const now = Date.now();
  const minDate = new Date(now - REPLENISH_MAX_DAYS * DAY_MS); // oldest allowed
  const maxDate = new Date(now - REPLENISH_MIN_DAYS * DAY_MS); // most recent allowed
  const q = db
    .select({
      contactId: alsBuyerContacts.id,
      lastOrderAt: alsBuyerContacts.lastOrderAt,
      firstName: alsBuyerContacts.firstName,
      leadType: alsBuyerContacts.leadType,
      states: alsBuyerContacts.states,
      lastOrderAmount: alsBuyerContacts.lastOrderAmount,
      lifetimeOrders: alsBuyerContacts.lifetimeOrders,
    })
    .from(alsBuyerContacts)
    .where(
      and(
        eq(alsBuyerContacts.source, "purchaser"),
        eq(alsBuyerContacts.sendable, true),
        eq(alsBuyerContacts.unsubscribed, false),
        gte(alsBuyerContacts.lastOrderAt, minDate),
        lte(alsBuyerContacts.lastOrderAt, maxDate)
      )
    )
    .orderBy(asc(alsBuyerContacts.lastOrderAt));
  return limit ? await q.limit(limit) : await q;
}

// Contacts who COMPLETED the welcome series — the pool for the AI series.
async function aiSeriesCandidates(limit?: number) {
  const q = db
    .select({
      contactId: alsBuyerContacts.id,
      firstName: alsBuyerContacts.firstName,
      leadType: alsBuyerContacts.leadType,
      states: alsBuyerContacts.states,
      lastOrderAmount: alsBuyerContacts.lastOrderAmount,
      lifetimeOrders: alsBuyerContacts.lifetimeOrders,
    })
    .from(alsBuyerContacts)
    .innerJoin(
      alsBuyerJourneys,
      and(
        eq(alsBuyerJourneys.contactId, alsBuyerContacts.id),
        eq(alsBuyerJourneys.journey, "welcome"),
        eq(alsBuyerJourneys.status, "completed")
      )
    )
    .where(
      and(
        eq(alsBuyerContacts.source, "purchaser"),
        eq(alsBuyerContacts.sendable, true),
        eq(alsBuyerContacts.unsubscribed, false)
      )
    )
    .orderBy(asc(alsBuyerContacts.firstSeenAt));
  return limit ? await q.limit(limit) : await q;
}

async function journeyCount(journey: JourneyName, status: string): Promise<number> {
  const r = await db
    .select({ n: sql<number>`count(*)::int` })
    .from(alsBuyerJourneys)
    .where(and(eq(alsBuyerJourneys.journey, journey), eq(alsBuyerJourneys.status, status)));
  return r[0]?.n ?? 0;
}

export async function getLifecyclePlan(sendEnabled: boolean): Promise<LifecyclePlan> {
  const [welcome, aiElig, replenish, activeWelcome, activeAi, activeRepl, due] =
    await Promise.all([
      eligibleWelcome().then((r) => r.length),
      aiSeriesCandidates().then((r) => r.length),
      replenishCandidates().then((r) => r.length),
      journeyCount("welcome", "active"),
      journeyCount("ai-series", "active"),
      journeyCount("replenishment", "active"),
      db
        .select({ n: sql<number>`count(*)::int` })
        .from(alsBuyerJourneys)
        .where(
          and(
            eq(alsBuyerJourneys.status, "active"),
            lte(alsBuyerJourneys.nextDueAt, new Date())
          )
        )
        .then((r) => r[0]?.n ?? 0),
    ]);
  return {
    sendEnabled,
    aiSeriesEnabled: ALS_AI_SERIES_ENABLED,
    welcomeEligible: welcome,
    aiSeriesEligible: aiElig,
    replenishEligible: replenish,
    activeWelcome,
    activeAiSeries: activeAi,
    activeReplenishment: activeRepl,
    dueNow: due,
  };
}

// ---------------------------------------------------------------------------
// Run (enroll + advance). Only persists/sends when sendEnabled.
// ---------------------------------------------------------------------------

export interface LifecycleResult {
  sendEnabled: boolean;
  enrolledWelcome: number;
  enrolledAiSeries: number;
  enrolledReplenishment: number;
  sent: number;
  completed: number;
  reorderExits: number;
  errors: string[];
  plan?: LifecyclePlan; // included on dry runs
}

async function enrollWelcome(): Promise<number> {
  const eligible = await eligibleWelcome(ENROLL_CAP);
  let n = 0;
  for (const c of eligible) {
    const anchor = c.firstSeenAt;
    const due = new Date(new Date(anchor).getTime() + WELCOME_START_DAYS * DAY_MS);
    await db
      .insert(alsBuyerJourneys)
      .values({
        contactId: c.contactId,
        journey: "welcome",
        step: 0,
        status: "active",
        anchorAt: anchor,
        nextDueAt: due,
      })
      .onConflictDoNothing({
        target: [alsBuyerJourneys.contactId, alsBuyerJourneys.journey],
      });
    n++;
  }
  return n;
}

// Enroll welcome-completed contacts into the AI series. Gated by
// ALS_AI_SERIES_ENABLED so it ships dark until the copy is approved. One-time
// per contact; never overlaps another active journey.
async function enrollAiSeries(): Promise<number> {
  if (!ALS_AI_SERIES_ENABLED) return 0;
  const candidates = await aiSeriesCandidates(ENROLL_CAP);
  if (candidates.length === 0) return 0;

  const ids = candidates.map((c) => c.contactId);
  const existing = await db
    .select()
    .from(alsBuyerJourneys)
    .where(sql`${alsBuyerJourneys.contactId} in (${sql.join(ids, sql`,`)})`);
  const byContact = new Map<number, typeof existing>();
  for (const j of existing) {
    const arr = byContact.get(j.contactId) || [];
    arr.push(j);
    byContact.set(j.contactId, arr);
  }

  const now = new Date();
  let n = 0;
  for (const c of candidates) {
    const journeys = byContact.get(c.contactId) || [];
    if (journeys.some((j) => j.journey === "ai-series")) continue; // one-time series
    if (journeys.some((j) => j.status === "active")) continue; // don't overlap an active journey
    await db.insert(alsBuyerJourneys).values({
      contactId: c.contactId,
      journey: "ai-series",
      step: 0,
      status: "active",
      anchorAt: now,
      nextDueAt: now,
    });
    n++;
  }
  return n;
}

async function enrollReplenishment(): Promise<number> {
  const candidates = await replenishCandidates(ENROLL_CAP);
  if (candidates.length === 0) return 0;

  // Load existing journeys for these contacts to apply re-enroll rules.
  const ids = candidates.map((c) => c.contactId);
  const existing = await db
    .select()
    .from(alsBuyerJourneys)
    .where(sql`${alsBuyerJourneys.contactId} in (${sql.join(ids, sql`,`)})`);
  const byContact = new Map<number, typeof existing>();
  for (const j of existing) {
    const arr = byContact.get(j.contactId) || [];
    arr.push(j);
    byContact.set(j.contactId, arr);
  }

  const now = new Date();
  let n = 0;
  for (const c of candidates) {
    const journeys = byContact.get(c.contactId) || [];
    // Skip if a welcome or AI-series journey is still active (don't double up).
    if (
      journeys.some(
        (j) =>
          (j.journey === "welcome" || j.journey === "ai-series") &&
          j.status === "active"
      )
    )
      continue;
    const repl = journeys.find((j) => j.journey === "replenishment");
    if (repl) {
      if (repl.status === "active") continue; // already running this cycle
      // Completed/exited: re-enroll only if they reordered since (lastOrderAt newer than the cycle anchor).
      if (!c.lastOrderAt || !repl.anchorAt || new Date(c.lastOrderAt) <= new Date(repl.anchorAt))
        continue;
      await db
        .update(alsBuyerJourneys)
        .set({ step: 0, status: "active", anchorAt: now, nextDueAt: now, lastSentAt: null, updatedAt: now })
        .where(eq(alsBuyerJourneys.id, repl.id));
      n++;
    } else {
      await db.insert(alsBuyerJourneys).values({
        contactId: c.contactId,
        journey: "replenishment",
        step: 0,
        status: "active",
        anchorAt: now,
        nextDueAt: now,
      });
      n++;
    }
  }
  return n;
}

export async function runLifecycle(
  apiKey: string,
  opts: { sendEnabled: boolean; sendCap?: number } = { sendEnabled: false }
): Promise<LifecycleResult> {
  const result: LifecycleResult = {
    sendEnabled: opts.sendEnabled,
    enrolledWelcome: 0,
    enrolledAiSeries: 0,
    enrolledReplenishment: 0,
    sent: 0,
    completed: 0,
    reorderExits: 0,
    errors: [],
  };

  // Dry run: change nothing, just report the plan.
  if (!opts.sendEnabled) {
    result.plan = await getLifecyclePlan(false);
    return result;
  }

  // 1. Enroll. Value track first (welcome → AI series), then replenishment, so
  //    a buyer gets the full education arc before sales nudges. AI series is
  //    self-gated by ALS_AI_SERIES_ENABLED.
  result.enrolledWelcome = await enrollWelcome();
  result.enrolledAiSeries = await enrollAiSeries();
  result.enrolledReplenishment = await enrollReplenishment();

  // 2. Advance due steps, oldest-due first, capped.
  const cap = opts.sendCap ?? ALS_LIFECYCLE_SEND_CAP;
  const due = await db
    .select({
      jid: alsBuyerJourneys.id,
      journey: alsBuyerJourneys.journey,
      step: alsBuyerJourneys.step,
      anchorAt: alsBuyerJourneys.anchorAt,
      contactId: alsBuyerJourneys.contactId,
      email: alsBuyerContacts.email,
      unsubscribed: alsBuyerContacts.unsubscribed,
      lastOrderAt: alsBuyerContacts.lastOrderAt,
      firstName: alsBuyerContacts.firstName,
      leadType: alsBuyerContacts.leadType,
      states: alsBuyerContacts.states,
      lastOrderAmount: alsBuyerContacts.lastOrderAmount,
      lifetimeOrders: alsBuyerContacts.lifetimeOrders,
    })
    .from(alsBuyerJourneys)
    .innerJoin(alsBuyerContacts, eq(alsBuyerContacts.id, alsBuyerJourneys.contactId))
    .where(
      and(
        eq(alsBuyerJourneys.status, "active"),
        lte(alsBuyerJourneys.nextDueAt, new Date())
      )
    )
    .orderBy(asc(alsBuyerJourneys.nextDueAt))
    .limit(cap);

  for (const row of due) {
    const journey = row.journey as JourneyName;
    const now = new Date();

    // Suppress unsubscribed contacts (close the journey).
    if (row.unsubscribed) {
      await db
        .update(alsBuyerJourneys)
        .set({ status: "exited", nextDueAt: null, updatedAt: now })
        .where(eq(alsBuyerJourneys.id, row.jid));
      continue;
    }

    // Replenishment reorder-exit: if they bought again since this cycle started,
    // they're back in the flow — stop nudging and mark the cycle a success.
    if (
      journey === "replenishment" &&
      row.lastOrderAt &&
      row.anchorAt &&
      new Date(row.lastOrderAt) > new Date(row.anchorAt)
    ) {
      await db
        .update(alsBuyerJourneys)
        .set({ status: "completed", nextDueAt: null, updatedAt: now })
        .where(eq(alsBuyerJourneys.id, row.jid));
      result.reorderExits++;
      continue;
    }

    const nextStep = row.step + 1;
    const total = journeyLength(journey);
    let email;
    try {
      email = renderLifecycleEmail(journey, nextStep, ctxFromRow(row));
    } catch (err) {
      result.errors.push(`render ${journey} ${nextStep}: ${err instanceof Error ? err.message : err}`);
      continue;
    }

    // Throttle to stay under Resend's 5 req/sec write limit.
    await sleep(250);
    try {
      const link = unsubUrl(row.contactId);
      await sendSingleEmail(apiKey, {
        from: ALS_LIFECYCLE_FROM,
        to: [row.email],
        subject: email.subject,
        html: email.html.replace("{{UNSUBSCRIBE_URL}}", link),
        replyTo: ALS_LIFECYCLE_REPLY_TO,
        headers: {
          "List-Unsubscribe": `<${link}>`,
          "List-Unsubscribe-Post": "List-Unsubscribe=One-Click",
        },
      });
    } catch (err) {
      result.errors.push(`send ${row.email} (${journey} ${nextStep}): ${err instanceof Error ? err.message : err}`);
      continue; // leave state so it retries next run
    }
    result.sent++;

    // Advance state. Last step → completed; else schedule the next.
    if (nextStep >= total) {
      await db
        .update(alsBuyerJourneys)
        .set({ step: nextStep, status: "completed", lastSentAt: now, nextDueAt: null, updatedAt: now })
        .where(eq(alsBuyerJourneys.id, row.jid));
      result.completed++;
    } else {
      const nextDue = new Date(
        new Date(row.anchorAt).getTime() + STEPS[journey][nextStep].offsetDays * DAY_MS
      );
      await db
        .update(alsBuyerJourneys)
        .set({ step: nextStep, lastSentAt: now, nextDueAt: nextDue, updatedAt: now })
        .where(eq(alsBuyerJourneys.id, row.jid));
    }
  }

  return result;
}

// Metadata for the preview dashboard (journey/step listing).
export function lifecycleStepIndex(): Array<{ journey: JourneyName; step: number; campaign: string; subject: string; offsetDays: number }> {
  const out: Array<{ journey: JourneyName; step: number; campaign: string; subject: string; offsetDays: number }> = [];
  (Object.keys(STEPS) as JourneyName[]).forEach((j) => {
    STEPS[j].forEach((s, i) => {
      out.push({
        journey: j,
        step: i + 1,
        campaign: s.campaign,
        subject: s.subject({ firstName: "", vertical: null, states: null, lastOrderAmount: null, lifetimeOrders: null }),
        offsetDays: s.offsetDays,
      });
    });
  });
  return out;
}
