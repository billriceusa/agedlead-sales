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
// From-name lockup "Bill Rice · Aged Leads Insights". Sender + reply-to are env
// overridable so we can point at the isolated news.agedleadsales.com subdomain
// once it's verified in Resend (until then this default uses the root domain).
export const ALS_LIFECYCLE_FROM =
  process.env.ALS_LIFECYCLE_FROM ||
  '"Bill Rice · Aged Leads Insights" <bill@agedleadsales.com>';
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

// Max emails actually sent per cron run — caps the first-launch drip to the
// existing list so it warms up instead of blasting. Remaining fire next run.
export const ALS_LIFECYCLE_SEND_CAP = Number(
  process.env.ALS_LIFECYCLE_SEND_CAP || "150"
);

// AI-for-aged-leads series gate. Ships dark — the series enrolls/sends only when
// this is "true". Flip on after the AI copy is approved. Independent of
// ALS_LIFECYCLE_SEND_ENABLED, which still gates ALL sending.
export const ALS_AI_SERIES_ENABLED =
  process.env.ALS_AI_SERIES_ENABLED === "true";

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
