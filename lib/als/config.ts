// AgedLeadStore report configuration.

export const ALS_GA4_PROPERTY = "357329146";
export const ALS_GSC_SITE = "sc-domain:agedleadstore.com";
export const ALS_GOOGLE_ADS_CUSTOMER_ID = "1601746316";
export const ALS_KALYTICS_TABLE = "aged_lead_store";
export const ALS_GMAIL_QUERY =
  "label:ALS-orders from:customercare@nextwavemarketingstrategies.com";
export const ALS_SENDER = "bill.rice@kaleidico.com";
export const KALEIDICO_MCC_ID = "1943183034";

// --- Aged-lead-buyer harvest → Resend audiences ---
// Inbound lead-BUYING form fills from agedleadstore.com/lead-request/.
export const ALS_INQUIRY_GMAIL_QUERY =
  'from:support@kaleidimail.com subject:"New submission from Leads Progressive Form"';
// Two standing Resend audiences, resolved by name via ensureAudience().
export const ALS_AUDIENCE_PURCHASERS = "ALS Aged-Lead Buyers — Purchasers";
export const ALS_AUDIENCE_INQUIRIES = "ALS Aged-Lead Buyers — Inquiries";

// --- Lifecycle email program (Aged Leads Insights) ---
// Co-branded value/education series (Work Aged Leads = Bill Rice's expertise;
// AgedLeadStore = the exclusive buy CTA). Subtle, value-first — NOT a
// transactional "thanks for your order" welcome (AgedLeadStore already sends
// registration + first-order email). Positions aged leads as a consistent,
// affordable revenue engine vs. real-time leads + referrals.
//
// From-name lockup "Bill Rice · Aged Leads Insights". Sender + reply-to stay env
// overridable; the default now points at the isolated news.workagedleads.com
// subdomain, verified in Resend 2026-08-05.
//
// Sending stays on an isolated subdomain deliberately: a 2,400-contact buyer
// program and the site's transactional mail should not share a reputation, so
// a bad week for one cannot take the other down with it.
export const ALS_LIFECYCLE_FROM =
  process.env.ALS_LIFECYCLE_FROM ||
  '"Bill Rice · Aged Leads Insights" <bill@news.workagedleads.com>';
export const ALS_LIFECYCLE_REPLY_TO =
  process.env.ALS_LIFECYCLE_REPLY_TO || "bill@billricestrategy.com";

// Standing "Buy Aged Leads" CTA target (UTM params appended per email).
export const ALS_BUY_URL = "https://agedleadstore.com/all-lead-types/";

// HARD SAFETY GATE. The lifecycle cron only makes real Resend send calls when
// this env is exactly "true". Until then it computes + (optionally) records
// journey state and renders previews, but sends nothing. Flip on ONLY after
// Bill approves the templates AND the sending subdomain is verified.
export const ALS_LIFECYCLE_SEND_ENABLED =
  process.env.ALS_LIFECYCLE_SEND_ENABLED === "true";

// A positive integer from env, or the default. Guards the throughput knobs:
// `Number("250 ")` is fine but `Number("250/day")` is NaN, and a NaN cap makes
// Math.max(0, cap) NaN too, so every downstream slice() silently takes nothing.
// A mistyped env var must not read as "send no email today".
function positiveIntFromEnv(raw: string | undefined, fallback: number): number {
  const n = Number(raw);
  return Number.isFinite(n) && n > 0 ? Math.floor(n) : fallback;
}

// Max emails actually sent per cron run — caps the first-launch drip to the
// existing list so it warms up instead of blasting. Remaining fire next run.
export const ALS_LIFECYCLE_SEND_CAP = positiveIntFromEnv(
  process.env.ALS_LIFECYCLE_SEND_CAP,
  150
);

/**
 * Slots inside the daily cap held for the replenishment journey.
 *
 * WHY THIS EXISTS (Bill, 2026-09-02)
 *
 * Sends were selected oldest-due-first and truncated at the cap. With a backlog
 * of ~715 due against 150/day, replenishment queued behind welcome and
 * ai-series purely by age — and those are not equal in value:
 *
 *   replenish-r1   6 sessions -> $420.00   $70.00/session
 *   welcome-e2    23 sessions ->   $0.00    $0.00/session
 *
 * (GA4 357329146, 2026-06-01 to 2026-09-02.) $70/session emails were waiting
 * behind $0/session emails, which is why replenishment produced 6 store
 * sessions in a quarter while 326 buyers sat eligible for it. Someone who
 * already bought and is running low is the purest buying signal in the system;
 * making them wait on an education backlog wastes the one moment that converts.
 *
 * A FLOOR, NOT A CEILING. If fewer replenishment emails are due than the
 * reserve, the spare slots go to the value track rather than idling — and if
 * the value track is short, replenishment backfills past its reserve. Nothing
 * is throttled that could otherwise send; only the ORDER of contention changes.
 *
 * The education arc is not abandoned, just slightly slower under contention.
 * That was the deliberate "value track first" policy and it still holds for
 * everyone not signalling intent.
 *
 * PROPORTIONAL TO THE CAP (corrected 2026-09-03). This comment previously said
 * the reserve "scales with [the cap] and needs no change". It did not: the
 * reserve was the absolute 50, and `allocateDueSlots` gives the value track
 * `cap - reserve`, so raising the cap 150 -> 250 would have handed all 100 new
 * slots to welcome/ai-series and left the buyer list moving at exactly its old
 * pace. The stated reason for raising the cap was to clear the replenishment
 * backlog faster, so the knob has to actually do that.
 *
 * Derived as `max(50, round(cap * share))`: 150 -> 60, 250 -> 100, 400 -> 160.
 * The 50 floor keeps small caps from starving the buyer track back out.
 *
 * `ALS_LIFECYCLE_REPLENISH_RESERVE` still overrides with an absolute number if
 * it is ever set, which is the escape hatch for pinning a value during a
 * deliverability incident without touching the cap.
 */
export const ALS_LIFECYCLE_REPLENISH_SHARE = (() => {
  const n = Number(process.env.ALS_LIFECYCLE_REPLENISH_SHARE);
  return Number.isFinite(n) && n > 0 && n <= 1 ? n : 0.4;
})();

/** Floor below which the buyer track is never squeezed, whatever the cap. */
export const ALS_LIFECYCLE_REPLENISH_FLOOR = 50;

/**
 * Exported as a function so the derivation is testable. The consts below are
 * evaluated once at module load from `process.env`, which makes the formula
 * itself unreachable from a test without import gymnastics — and this formula
 * is exactly the thing that must not quietly stop scaling again.
 */
export function replenishReserveFor(cap: number, share: number): number {
  if (!Number.isFinite(cap) || cap <= 0) return 0;
  const safeShare = Number.isFinite(share) && share > 0 && share <= 1 ? share : 0.4;
  return Math.min(cap, Math.max(ALS_LIFECYCLE_REPLENISH_FLOOR, Math.round(cap * safeShare)));
}

export const ALS_LIFECYCLE_REPLENISH_RESERVE = positiveIntFromEnv(
  process.env.ALS_LIFECYCLE_REPLENISH_RESERVE,
  replenishReserveFor(ALS_LIFECYCLE_SEND_CAP, ALS_LIFECYCLE_REPLENISH_SHARE)
);

/**
 * Which journeys may enroll and send. Comma-separated, e.g. "replenishment" or
 * "welcome,replenishment".
 *
 * WHY AN ALLOWLIST AND NOT THE CAP (Bill, 2026-09-04)
 *
 * The lifecycle sent nothing from 2026-08-01 to 2026-09-04 — a malformed
 * opt-out query, fixed separately. That left 715 journeys due and 4,151 emails
 * owed, and firing them would have put 483 people on seven emails in seven
 * consecutive days against copy that promises one idea every few days.
 *
 * The cap cannot express "restart this track and not that one" — it only
 * throttles a blend. So the restart is scoped by journey instead, and the
 * default here is the SAFE state rather than the previous one: an absent or
 * malformed env restarts replenishment alone, never the whole backlog.
 *
 * Replenishment first because it is the only lifecycle track with a sale
 * against its name — July: `replenish-r1`, 1 session, 1 transaction, $420,
 * while all seven welcome emails together took 46 sessions to zero. It is also
 * ~20-40 sends/day, which is a gentle warm-up for a domain that has been
 * silent for a month.
 *
 * Widening this is a deliberate act. Add "welcome" once the Phase 2
 * re-introduction has run and people have chosen to keep hearing from us.
 */
export const ALS_LIFECYCLE_JOURNEYS: string[] = (() => {
  const raw = (process.env.ALS_LIFECYCLE_JOURNEYS || "").trim();
  if (!raw) return ["replenishment"];
  const parsed = raw
    .split(",")
    .map((s) => s.trim().toLowerCase())
    .filter(Boolean);
  return parsed.length > 0 ? parsed : ["replenishment"];
})();

/** True when `journey` is cleared to enroll and send. */
export function journeyEnabled(journey: string): boolean {
  return ALS_LIFECYCLE_JOURNEYS.includes(journey);
}

/**
 * How many replenishment journeys may become due on the SAME day through
 * enrollment. Surplus enrollments are dated forward, one bucket per day.
 *
 * WHY THIS EXISTS — 2026-09-04, and it cost a real send
 *
 * Replenishment step 1 is `offsetDays: 0`, and enrollment runs BEFORE the due
 * scan inside the same run. So a newly enrolled row is due the instant it is
 * created and ships in that very run: N enrollments == N immediate sends,
 * bounded only by the daily cap.
 *
 * That stayed invisible while enrollment trickled. Then the Phase 1 migration
 * exited 397 ai-series journeys, which had been blocking replenishment
 * enrollment via the "don't stack on another active journey" guard. 111
 * purchasers became eligible at once and the next run mailed 128 people —
 * against a staggered plan of 18/day, on a domain that had been silent for 34
 * days. The re-anchor stagger could not help: it had re-dated the EXISTING
 * rows, and these did not exist yet.
 *
 * Pacing the enrollment itself is the fix that holds no matter what unblocks a
 * cohort. In steady state (~a handful of purchasers cross 21 days per day)
 * every enrollment still lands due immediately and nothing changes.
 */
export const ALS_LIFECYCLE_ENROLL_PER_DAY = positiveIntFromEnv(
  process.env.ALS_LIFECYCLE_ENROLL_PER_DAY,
  18,
);

// Launch-date guard. Even when SEND_ENABLED is true, no email goes out before
// this date (ISO, e.g. "2026-06-16"). Lets us pre-configure everything and have
// the daily cron self-launch on the date — no manual flip at the moment.
// Empty = no date restriction (only the enabled flag gates).
export const ALS_LIFECYCLE_LAUNCH_AT = process.env.ALS_LIFECYCLE_LAUNCH_AT || "";

// Unsubscribe link signing + public base URL of this app (for the absolute
// unsubscribe URL in every email). Falls back to CRON_SECRET for signing.
export const ALS_UNSUB_SECRET =
  process.env.ALS_UNSUB_SECRET || process.env.CRON_SECRET || "";
export const ALS_PUBLIC_APP_URL = (
  process.env.ALS_PUBLIC_APP_URL ||
  process.env.NEXT_PUBLIC_APP_URL ||
  "https://app.myagencyco.com"
).replace(/\/$/, "");

// Revenue targets
export const ALS_MRR_TARGET = 100_000;
export const ALS_ARR_TARGET = 1_200_000;
export const ALS_AOV_TARGET = 300;
export const ALS_RETURNING_TARGET = 0.6; // 60%

// Draft mode — review before sending
export const ALS_RECIPIENTS_DEFAULT = [
  "troy@nextwavemarketingstrategies.com",
  "dev@nextwavemarketingstrategies.com",
];

export function getRecipients(): { to: string[]; cc: string[] } {
  const envRecipients = process.env.ALS_REPORT_RECIPIENTS;
  if (envRecipients) {
    const all = envRecipients.split(",").map((e) => e.trim()).filter(Boolean);
    return { to: all, cc: ["bill.rice@kaleidico.com"] };
  }
  return { to: ALS_RECIPIENTS_DEFAULT, cc: ["bill.rice@kaleidico.com"] };
}

// Customer status based on MTD orders vs lifetime order count
export function customerStatus(
  mtdOrders: number,
  lifetimeOrders: number
): string {
  // Brand new — first order ever
  if (lifetimeOrders <= 1) return "New \u2014 cultivate";
  // Anchor — long-time loyal customer
  if (lifetimeOrders >= 100) return "Anchor buyer";
  // Active repeat — established customer coming back
  if (lifetimeOrders >= 10) return "Active repeat";
  // Early repeat — second or third order ever
  if (lifetimeOrders <= 2) return "Early repeat";
  // Growing — ordering multiple times, building relationship
  return "Growing";
}
