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
    sendable: boolean("sendable").default(false).notNull(),
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
