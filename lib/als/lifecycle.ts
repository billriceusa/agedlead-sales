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
import { and, eq, isNull, lte, gte, asc, sql, inArray, notInArray } from "drizzle-orm";
import { db } from "@/lib/db";
import { alsBuyerContacts, alsBuyerJourneys } from "@/lib/db/schema";
import { sendSingleEmail } from "@/lib/resend";
import {
  ALS_BUY_URL,
  ALS_LIFECYCLE_FROM,
  ALS_LIFECYCLE_REPLY_TO,
  ALS_LIFECYCLE_SEND_CAP,
  ALS_LIFECYCLE_REPLENISH_RESERVE,
  ALS_UNSUB_SECRET,
  ALS_PUBLIC_APP_URL,
  ALS_LIFECYCLE_JOURNEYS,
  ALS_LIFECYCLE_ENROLL_PER_DAY,
  journeyEnabled,
} from "@/lib/als/config";
import { SITE_HOST, SITE_URL } from "@/lib/site-url";
import { AFFILIATE_UTM_SOURCE } from "@/lib/utm";

const DAY_MS = 86_400_000;
const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

export type JourneyName = "welcome" | "replenishment";

// Replenishment window: nudge buyers whose last order is 21–90 days old. Older
// than 90d with no reorder → lapsed, handled by the (future) reactivation track.
const REPLENISH_MIN_DAYS = 21;
const REPLENISH_MAX_DAYS = 90;
const WELCOME_START_DAYS = 3; // first welcome email fires this many days after list arrival

// Caps so the first launch over the existing list ramps instead of blasting.
const ENROLL_CAP = 400;

/**
 * How many due rows to load before allocating the daily cap.
 *
 * Must exceed the cap, and comfortably exceed the backlog, or the reserve is
 * meaningless: the previous code applied `.limit(cap)` in SQL, so when the
 * value track had an older backlog the replenishment rows were never loaded at
 * all and no downstream ordering could reach them. Sized well above the ~715
 * observed on 2026-09-02 so the allocation sees the whole queue.
 */
const DUE_SCAN_LIMIT = 5000;

/**
 * Split one run's send budget between replenishment and the value track.
 *
 * Pure and exported so it can be tested without a database. The rules, in
 * order, and each exists for a reason:
 *
 * 1. Replenishment takes up to `reserve` slots first. Without this, plain
 *    oldest-due-first buried $70/session emails under a $0/session backlog.
 * 2. The value track fills whatever remains.
 * 3. Either side backfills slots the other did not use. The reserve is a FLOOR
 *    on contention, never a throttle — a run still sends exactly `cap`, or
 *    everything due when that is fewer. A reserve that left slots idle would
 *    make the backlog worse, not better.
 * 4. The final batch is ordered oldest-due-first, so within the chosen set the
 *    longest-waiting contact still goes first.
 *
 * `input` is assumed already sorted by due date ascending.
 */
export function allocateDueSlots<T extends { journey: string; nextDueAt?: Date | null }>(
  input: T[],
  cap: number,
  reserve: number,
): { selected: T[]; replenishCount: number; valueCount: number } {
  const safeCap = Math.max(0, cap);
  const safeReserve = Math.min(Math.max(0, reserve), safeCap);

  const replenish = input.filter((r) => r.journey === "replenishment");
  const value = input.filter((r) => r.journey !== "replenishment");

  const takeReplenish = replenish.slice(0, safeReserve);
  const takeValue = value.slice(0, Math.max(0, safeCap - takeReplenish.length));

  // Rule 3 — hand unused slots back rather than idling them.
  const spare = safeCap - takeReplenish.length - takeValue.length;
  const backfill =
    spare > 0
      ? replenish.slice(takeReplenish.length, takeReplenish.length + spare)
      : [];

  const selected = [...takeReplenish, ...backfill, ...takeValue].sort(
    (a, b) => (a.nextDueAt?.getTime() ?? 0) - (b.nextDueAt?.getTime() ?? 0),
  );

  return {
    selected,
    replenishCount: takeReplenish.length + backfill.length,
    valueCount: takeValue.length,
  };
}

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
/** The buy button. Two per email — see `layout`. */
function ctaBlock(href: string): string {
  return `<div style="text-align:center;margin:20px 0 18px;">
      <a href="${href}" style="display:inline-block;background:#e8a020;color:#1c2530;font-weight:800;text-decoration:none;padding:13px 28px;border-radius:8px;font-size:15px;">Buy Aged Leads &rarr;</a>
    </div>`;
}

function layout(opts: {
  preheader: string;
  bodyHtml: string;
  campaign: string;
  ctaContent?: string;
}): string {
  const cta = buyUrl(opts.campaign, opts.ctaContent || "standing-cta");

  // A second buy button directly under the opening paragraph, so the door sits
  // in the top third instead of behind the whole email (Bill, 2026-09-04).
  //
  // This list has already shown intent — they either bought aged leads or asked
  // how to. Making a buyer read to the end before they can act taxes the people
  // most likely to convert. `top-cta` vs `standing-cta` are distinct
  // `utm_content` values, so the placement scoreboard reads which one earns
  // rather than leaving it to opinion.
  const topCta = buyUrl(opts.campaign, "top-cta");
  const afterFirstPara = opts.bodyHtml.indexOf("</p>");
  const bodyHtml =
    afterFirstPara === -1
      ? ctaBlock(topCta) + opts.bodyHtml
      : opts.bodyHtml.slice(0, afterFirstPara + 4) +
        ctaBlock(topCta) +
        opts.bodyHtml.slice(afterFirstPara + 4);
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
    ${bodyHtml}
    ${ctaBlock(cta)}
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

// --- Welcome series (3 emails): the case, the method, the rhythm ---
//
// SHORTENED 7 -> 3 ON 2026-09-04 (Bill's call), and the second seven-email
// "AI for aged leads" series removed entirely.
//
// WHY, IN NUMBERS
//
// At ~11 new contacts a day, seven welcome emails plus a seven-email follow-on
// series is ~154 sends/day of structural demand against a 150/day cap. The
// program was oversubscribed by its own design, which is why a backlog existed
// before the August outage and would have rebuilt itself after any cap raise.
//
// It also had nothing to show for the volume. Across July, with the lifecycle
// sending ~150/day, all seven welcome emails together took 46 store sessions to
// ZERO transactions (GA4 357329146, store-side). The one lifecycle sale on
// record is replenishment: `replenish-r1`, 1 session, 1 transaction, $420.
//
// Three emails at 3/7/14 days takes the same population to ~33 sends/day. That
// is sustainable indefinitely, cannot build a backlog, and leaves the domain
// headroom for the track that actually earns.
//
// WHICH THREE
//
// Kept the argument (`welcome-e2`), the method (`welcome-e3` — the only one
// with a swipeable asset), and the close (`welcome-e7` — the only one that ends
// at a reorder). Dropped the standalone intro, the booking email and the
// objection email. The compliance email is dropped as a send but its rules are
// folded into the method email below rather than lost: working purchased data
// legally is this brand's whole differentiator, not a nice-to-have.
//
// WHY THE SLUGS LOOK OUT OF ORDER
//
// The campaigns stay `welcome-e2` / `-e3` / `-e7` even though they are now
// steps 1/2/3. Their content is substantially unchanged, so keeping the slugs
// keeps the GA4 scoreboard readable as one continuous series across the change
// — the same reasoning that kept `header-nav` when howtoworkleads.com was
// retired into this domain. Renaming them would silently reset the only
// performance history this program has.
const WELCOME: StepDef[] = [
  {
    offsetDays: WELCOME_START_DAYS, // 3
    campaign: "welcome-e2",
    subject: () => "Cost per lead is the wrong number",
    preheader: "The simple math behind why aged leads win.",
    body: (c) =>
      p(
        `Hi ${hi(c)} — most agents shop on <i>cost per lead</i>. That's the wrong number. The only one that pays your bills is <b>cost per sale</b>.`,
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
    offsetDays: 7,
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
        `The rest of staying clean on purchased data, four things. (Guidance, not legal advice — your compliance is on you.)`,
        `<b>1. Scrub before you dial.</b> Run the list against federal and applicable state Do-Not-Call registries plus your own internal DNC. You'll need a SAN for the federal list.<br>
         <b>2. Dial by hand.</b> Skip autodialers, prerecorded or artificial voice, and ringless voicemail on this data.<br>
         <b>3. Don't text it.</b> Covered above — it's the one that bites hardest.<br>
         <b>4. Honor every "no."</b> If someone asks not to be contacted, log it and stop.`,
        `And the move most agents miss: use the email to <b>earn</b> the right to call and text. Email is allowed on this data, so let it do the heavy lifting — put a scheduling link in it that asks for a phone number and permission to text when someone books. The moment they fill that out, a cold purchased lead has become a <b>consented</b> one. Calendly and free Google Calendar booking both capture it for you. It's the cleanest way to build a list you can legally work hard.`,
        `Want more to swipe? Here's a stack of <a href="${tool("/blog/email-outreach-aged-leads-templates", "welcome-e3", "deep-read")}" style="color:#0b6bcb;">aged-lead email templates</a>.`,
        `Last one: how to turn this from a good month into a steady paycheck.<br>— Bill`
      ),
  },
  {
    offsetDays: 14,
    campaign: "welcome-e7",
    subject: () => "Turning aged leads into a steady paycheck",
    preheader: "The difference between a gamble and a revenue engine.",
    body: (c) =>
      p(
        `Hi ${hi(c)} — here's the piece that actually builds income: <b>do it on a rhythm.</b>`,
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
        `Hi ${hi(c)} — if you've been working your last batch, you've probably reached the easy contacts by now.`,
        `That's exactly the moment most agents let the pipeline go thin. The ones who keep their income steady reload <b>before</b> they run dry, so there's always a fresh batch behind the one they're finishing.`,
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
        `Hi ${hi(c)} — most agents work a batch top to bottom and call it done. Try this instead.`,
        `On your next list, send the warm-up email to <i>everyone</i> first, then prioritize your calls toward the people who opened or replied. You'll spend your dialing hours on the warmest names and your contact rate climbs.`,
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

const STEPS: Record<JourneyName, StepDef[]> = {
  welcome: WELCOME,
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
  welcomeEligible: number; // purchasers ready to enroll in welcome
  replenishEligible: number; // purchasers ready to enroll/refresh replenishment
  activeWelcome: number; // journeys currently active
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

async function journeyCount(journey: JourneyName, status: string): Promise<number> {
  const r = await db
    .select({ n: sql<number>`count(*)::int` })
    .from(alsBuyerJourneys)
    .where(and(eq(alsBuyerJourneys.journey, journey), eq(alsBuyerJourneys.status, status)));
  return r[0]?.n ?? 0;
}

export async function getLifecyclePlan(sendEnabled: boolean): Promise<LifecyclePlan> {
  const [welcome, replenish, activeWelcome, activeRepl, due] =
    await Promise.all([
      eligibleWelcome().then((r) => r.length),
      replenishCandidates().then((r) => r.length),
      journeyCount("welcome", "active"),
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
    welcomeEligible: welcome,
    replenishEligible: replenish,
    activeWelcome,
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
  enrolledReplenishment: number;
  sent: number;
  completed: number;
  reorderExits: number;
  /** Due rows loaded before cap allocation — shows the size of the backlog. */
  dueScanned: number;
  /** Due rows held back by ALS_LIFECYCLE_JOURNEYS. A paused track, not an empty one. */
  duePaused: number;
  /** How many of this run's slots went to replenishment. */
  replenishReserved: number;
  /** How many went to the value track (welcome). */
  valueSelected: number;
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
  // Pace the batch. Step 1 is offsetDays 0 and enrollment runs before the due
  // scan, so every row created here is due immediately and ships in this same
  // run — N enrollments are N sends. Fine while enrollment trickles; on
  // 2026-09-04 a migration unblocked 111 at once and the run mailed 128 against
  // a planned 18/day. Surplus is dated forward a day at a time.
  let enrolledToday = 0;
  const dueForIndex = (i: number) =>
    new Date(now.getTime() + Math.floor(i / ALS_LIFECYCLE_ENROLL_PER_DAY) * DAY_MS);

  for (const c of candidates) {
    const journeys = byContact.get(c.contactId) || [];
    // Don't stack a sales nudge on top of any other running journey. Named by
    // exclusion rather than by listing journeys, so a retired one still left in
    // the table (the 'ai-series' rows) keeps blocking until it is exited.
    if (journeys.some((j) => j.journey !== "replenishment" && j.status === "active"))
      continue;
    const repl = journeys.find((j) => j.journey === "replenishment");
    if (repl) {
      if (repl.status === "active") continue; // already running this cycle
      // Completed/exited: re-enroll only if they reordered since (lastOrderAt newer than the cycle anchor).
      if (!c.lastOrderAt || !repl.anchorAt || new Date(c.lastOrderAt) <= new Date(repl.anchorAt))
        continue;
      const due = dueForIndex(enrolledToday++);
      await db
        .update(alsBuyerJourneys)
        .set({ step: 0, status: "active", anchorAt: due, nextDueAt: due, lastSentAt: null, updatedAt: now })
        .where(eq(alsBuyerJourneys.id, repl.id));
      n++;
    } else {
      const due = dueForIndex(enrolledToday++);
      await db.insert(alsBuyerJourneys).values({
        contactId: c.contactId,
        journey: "replenishment",
        step: 0,
        status: "active",
        anchorAt: due,
        nextDueAt: due,
      });
      n++;
    }
  }
  return n;
}

export async function runLifecycle(
  apiKey: string,
  opts: { sendEnabled: boolean; sendCap?: number; replenishReserve?: number } = {
    sendEnabled: false,
  }
): Promise<LifecycleResult> {
  const result: LifecycleResult = {
    sendEnabled: opts.sendEnabled,
    enrolledWelcome: 0,
    enrolledReplenishment: 0,
    sent: 0,
    completed: 0,
    reorderExits: 0,
    dueScanned: 0,
    duePaused: 0,
    replenishReserved: 0,
    valueSelected: 0,
    errors: [],
  };

  // Dry run: change nothing, just report the plan.
  if (!opts.sendEnabled) {
    result.plan = await getLifecyclePlan(false);
    return result;
  }

  // 1. Enroll, welcome before replenishment so a buyer gets the education arc
  //    before a sales nudge. Both are gated by ALS_LIFECYCLE_JOURNEYS: enrolling
  //    into a journey that cannot send would quietly rebuild the backlog that
  //    took this program down, so the gate has to sit on enrollment too, not
  //    only on the send.
  result.enrolledWelcome = journeyEnabled("welcome") ? await enrollWelcome() : 0;
  result.enrolledReplenishment = journeyEnabled("replenishment")
    ? await enrollReplenishment()
    : 0;

  // 2. Advance due steps, oldest-due first, capped — with a reserved share for
  //    replenishment. See ALS_LIFECYCLE_REPLENISH_RESERVE for the reasoning:
  //    plain oldest-due-first put $70/session emails behind $0/session ones.
  //
  //    The scan deliberately reaches PAST the cap. Selecting inside the cap was
  //    the bug — replenishment rows were never even loaded when the value track
  //    had an older backlog, so no amount of reordering downstream could have
  //    seen them.
  const cap = opts.sendCap ?? ALS_LIFECYCLE_SEND_CAP;
  const reserve = Math.min(
    opts.replenishReserve ?? ALS_LIFECYCLE_REPLENISH_RESERVE,
    cap,
  );
  const dueScan = await db
    .select({
      jid: alsBuyerJourneys.id,
      journey: alsBuyerJourneys.journey,
      step: alsBuyerJourneys.step,
      anchorAt: alsBuyerJourneys.anchorAt,
      // Selected so allocateDueSlots can re-sort the chosen batch oldest-first.
      // SQL already orders by it, but the allocation interleaves two buckets.
      nextDueAt: alsBuyerJourneys.nextDueAt,
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
        lte(alsBuyerJourneys.nextDueAt, new Date()),
        // The guard that keeps a paused track paused. Without it the first run
        // after the outage fix would have sent 4,151 owed emails — 483 people
        // on seven consecutive days — because every missed step of an overdue
        // journey is also overdue. Anything not on the allowlist stays put and
        // is reported separately, not silently dropped.
        inArray(alsBuyerJourneys.journey, ALS_LIFECYCLE_JOURNEYS)
      )
    )
    .orderBy(asc(alsBuyerJourneys.nextDueAt))
    .limit(DUE_SCAN_LIMIT);

  // Due rows the allowlist is holding back. Reported so a paused backlog stays
  // visible in the heartbeat instead of looking like an empty queue.
  const [paused] = await db
    .select({ n: sql<number>`count(*)::int` })
    .from(alsBuyerJourneys)
    .where(
      and(
        eq(alsBuyerJourneys.status, "active"),
        lte(alsBuyerJourneys.nextDueAt, new Date()),
        notInArray(alsBuyerJourneys.journey, ALS_LIFECYCLE_JOURNEYS)
      )
    );
  result.duePaused = paused?.n ?? 0;

  const { selected, replenishCount, valueCount } = allocateDueSlots(dueScan, cap, reserve);
  const due = selected;

  result.dueScanned = dueScan.length;
  result.replenishReserved = replenishCount;
  result.valueSelected = valueCount;

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
