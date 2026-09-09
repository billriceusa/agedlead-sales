// ALS buyer email infra — minimal schema (the two tables the lifecycle/harvest use).
// The tables already exist in the shared Postgres (DATABASE_URL); no migration is run.
// Source of truth: copied verbatim from agency-manager src/lib/db/schema.ts.
import {
  pgTable,
  text,
  serial,
  integer,
  timestamp,
  real,
  boolean,
  uniqueIndex,
  index,
} from "drizzle-orm/pg-core";

export const alsBuyerContacts = pgTable(
  "als_buyer_contacts",
  {
    id: serial("id").primaryKey(),
    source: text("source").notNull(), // "purchaser" | "inquiry"
    email: text("email").notNull(),
    firstName: text("first_name"),
    lastName: text("last_name"),
    company: text("company"),
    phone: text("phone"),
    // Inquiry-only qualifiers (null for purchasers)
    buyerType: text("buyer_type"), // "myself" | "sales team" | "call center"
    volume: text("volume"), // "100 - 500", "2000+", …
    leadType: text("lead_type"), // "Final Expense", "Mortgage", …
    leadAge: text("lead_age"), // "15-85 days", …
    states: text("states"), // comma list from "States (ignore the field above)"
    utmSource: text("utm_source"),
    utmCampaign: text("utm_campaign"),
    // Purchaser-only (null for inquiries)
    lifetimeOrders: integer("lifetime_orders"),
    lastOrderAmount: real("last_order_amount"),
    lastOrderAt: timestamp("last_order_at"), // date of the most recent order (from the order-summary email); drives replenishment timing
    // Bookkeeping
    gmailMsgId: text("gmail_msg_id"), // provenance / idempotency
    kickboxResult: text("kickbox_result"), // deliverable|undeliverable|risky|unknown|skipped
    /**
     * Defaults TRUE since 2026-09-09 (Bill): "We don't need a verification
     * gate — these are opt ins and people who have taken action."
     *
     * It used to default false and only flip true on a Kickbox `deliverable`
     * verdict, which blocked 3,591 people — 57% of the file — most of them on
     * `unknown`, which is Kickbox declining to reach a verdict (catch-all
     * domain, timeout), not a bad address. Everyone here either opted in or
     * submitted a lead-request form.
     *
     * This flag now means "not known-undeliverable". It is NOT consent, and it
     * is not the opt-out: `unsubscribed` is separate and is always honoured.
     */
    sendable: boolean("sendable").default(true).notNull(),
    unsubscribed: boolean("unsubscribed").default(false).notNull(), // honored by the lifecycle sender; synced from Resend unsubscribes (go-live: wire the webhook/sync)
    resendPushedAt: timestamp("resend_pushed_at"), // null until added to Resend
    firstSeenAt: timestamp("first_seen_at").defaultNow().notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => [
    uniqueIndex("als_buyer_contacts_email_source").on(table.email, table.source),
  ]
);

// --- Lifecycle email journeys (onboarding "welcome" + replenishment) ---
// State machine for the triggered Aged Leads Insights email program. One row per
// (contact, journey); re-enrollment resets the row. The lifecycle cron advances
// at most one step per journey per run, gated by next_due_at. Standalone, like
// als_buyer_contacts — no hard FK, contact_id references als_buyer_contacts.id.
export const alsBuyerJourneys = pgTable(
  "als_buyer_journeys",
  {
    id: serial("id").primaryKey(),
    contactId: integer("contact_id").notNull(), // → als_buyer_contacts.id
    journey: text("journey").notNull(), // "welcome" | "replenishment"
    step: integer("step").default(0).notNull(), // last step sent (0 = enrolled, none sent yet)
    status: text("status").default("active").notNull(), // active | completed | exited
    anchorAt: timestamp("anchor_at").notNull(), // date offsets are measured from (welcome = firstSeenAt; replenishment = enrollment time)
    nextDueAt: timestamp("next_due_at"), // when the next step should fire; null when completed/exited
    lastSentAt: timestamp("last_sent_at"),
    enteredAt: timestamp("entered_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => [
    uniqueIndex("als_buyer_journeys_contact_journey").on(
      table.contactId,
      table.journey
    ),
    index("als_buyer_journeys_due").on(table.status, table.nextDueAt),
  ]
);

/**
 * Resend delivery and engagement events.
 *
 * WHY THIS TABLE EXISTS (2026-09-09, Bill's call)
 *
 * Resend's API returns NO engagement data. Verified against both endpoints:
 * `GET /broadcasts` returns only id/name/audience_id/status/timestamps, and
 * `GET /broadcasts/{id}` adds only content and headers. There is no open rate,
 * click rate, bounce count or delivery count anywhere in the API — those exist
 * solely in the Resend dashboard.
 *
 * So a daily report can say what was SENT and what it EARNED, but nothing about
 * what happened in between, unless we capture it ourselves. This table is that
 * capture, fed by a Resend webhook.
 *
 * It matters more than usual right now: the verification gate came off on
 * 2026-09-09 and 3,591 never-before-mailed contacts entered the sending pool. If
 * a meaningful share of those hard-bounce, the sending domain pays for it, and
 * without this table the first symptom would be silent deliverability decay.
 *
 * Data accrues from the day the webhook is registered. It is not retroactive.
 */
export const alsEmailEvents = pgTable(
  "als_email_events",
  {
    id: serial("id").primaryKey(),
    /** Svix message id. Unique — Resend retries deliveries, and a retry must not double-count an open. */
    svixId: text("svix_id").notNull(),
    /** email.sent | delivered | opened | clicked | bounced | complained | delivery_delayed */
    eventType: text("event_type").notNull(),
    /** Resend's per-message id. Ties several events to one send. */
    emailId: text("email_id"),
    recipient: text("recipient"),
    subject: text("subject"),
    /** Sender. Gates which events belong here — the webhook is account-wide across 26 domains. */
    fromAddress: text("from_address"),
    /** For email.clicked — which link was followed. Makes per-placement click data possible. */
    linkUrl: text("link_url"),
    /** For email.bounced — hard vs soft decides whether the address gets suppressed. */
    bounceType: text("bounce_type"),
    occurredAt: timestamp("occurred_at").notNull(),
    receivedAt: timestamp("received_at").defaultNow().notNull(),
  },
  (table) => [
    uniqueIndex("als_email_events_svix_id").on(table.svixId),
    index("als_email_events_type_time").on(table.eventType, table.occurredAt),
    index("als_email_events_recipient").on(table.recipient),
  ]
);
