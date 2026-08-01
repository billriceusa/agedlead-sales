# agedleadsales.com — Email Infrastructure

> **Status:** documented 2026-06-18 as the *as-is* prior to migrating the engine out of `agency-manager`.
> This file is the source of truth for how the Aged Lead Store buyer-activation email program works.

## What this is

A triggered, value-first **lifecycle email program** ("Aged Leads Insights") to Aged Lead Store's
**lead buyers** — people who inquired about or purchased aged leads. Co-branded: agedleadsales.com
(Bill Rice's expertise) is the voice; **agedleadstore.com is the single buy CTA**. Goal: convert
one-time/never buyers into recurring revenue by positioning aged leads as a consistent, affordable
revenue engine — and drive agedleadstore.com traffic + orders.

## Where it runs (today → target)

| | Today (as-is) | Target |
|---|---|---|
| Code | `agency-manager` (Vercel `agency-manager-v2`) | **agedleadsales.com** repo |
| Datastore | Postgres (`DATABASE_URL`, drizzle) | **same Postgres**, shared |
| Sends from | `"Bill Rice · Aged Leads Insights" <bill@news.agedleadsales.com>` (Resend, verified) | unchanged |
| Reply-to | `bill@billricestrategy.com` | unchanged |
| Unsubscribe | `https://email.agedleadsales.com/api/als/unsubscribe` (HMAC of `ALS_UNSUB_SECRET`) | repointed to agedleadsales.com deploy |

## Datastore (Postgres, drizzle)

- **`als_buyer_contacts`** — harvested buyers. `source` = `purchaser` | `inquiry`; dedupe key `(email, source)`.
  Verification gate via `sendable` / `kickbox_result`; `unsubscribed` honored before every send;
  `resend_pushed_at` tracks Resend-audience membership.
- **`als_buyer_journeys`** — the lifecycle state machine. One row per `(contact, journey)`, unique-indexed.
  `journey` = `welcome` | `ai-series` | `replenishment`. Advances **≤1 step per run**, gated by `next_due_at`.
  This gating is the double-send safety net during cutover.

> A second datastore exists for analytics: **`als-buyers-db`** (SQLite, ~5,147 distinct buyer emails).
> It is the canonical deduped universe and the **backfill source** for the Resend audiences.

## Cadence & gating (env)

- `ALS_LIFECYCLE_SEND_ENABLED=true` — hard send gate (off = compute plan only, send nothing).
- `ALS_LIFECYCLE_LAUNCH_AT=2026-06-16` — no send before this date even when enabled.
- `ALS_AI_SERIES_ENABLED=true` — gates the AI-for-aged-leads series.
- `ALS_LIFECYCLE_SEND_CAP=150` — max real sends per cron run (warm-up ramp).
- `WELCOME_START_DAYS=3` — welcome email #1 fires 3 days *after* a contact lands on the list.
  *(This is why the first visible welcome batch went out Thu 6/18, not the 6/16 launch date.)*

## Sequences

- **welcome** (~10 steps) — #1 *"The most underrated revenue source in your business"*, then cost-per-lead,
  dialing approach, booking, objections, compliance, steady-paycheck, replenish nudge…
- **ai-series** (~7 steps) — AI tooling for aged-lead workflows (gated separately).
- **replenishment** — buyers 21–90 days since last order.

Single CTA → `https://agedleadstore.com/all-lead-types/` with UTMs
`utm_source=agedleadsales&utm_medium=email&utm_campaign=<journey>&utm_content=<step>`.
Free-tool sub-links point at agedleadsales.com calculators (same UTM scheme).

## Crons (UTC) — in `agency-manager` today

- `als-buyer-sync` **10:40** — harvest new buyers from Gmail (inquiry-form + order-summary emails),
  upsert `als_buyer_contacts`, verify, push verified to Resend audiences.
- `als-lifecycle` **10:50** — advance journeys, render, send (capped 150/run), honor unsubscribes.
- *(Not part of this infra: `als-report` 10:35, `als-month-end`, `sales-deals` — GA4/GSC marketing reports.)*

## Resend (account: billrice Pro)

- **Sending domains (verified):** `news.agedleadsales.com` (lifecycle), `agedleadsales.com`, `go.kaleidico.com` (Tier-1 promo),
  `workagedleads.com` (verified 2026-08-01 — the post-cutover site sender) and
  `news.workagedleads.com` (verified 2026-08-01 — the post-cutover lifecycle sender).
- **Audiences (measured 2026-08-01):** `ALS Aged-Lead Buyers — Purchasers` (1,029),
  `ALS Aged-Lead Buyers — Inquiries` (1,245), `ALS Store Self-Serve — Inquiries` (31),
  `Mortgage Lead-Buyers — Explicit (Tier 1)` (112), and the consolidated
  `workagedleads.com` audience (`43fe6675-cc8f-44f3-9c1c-70a094b2d47d`).

> **One list, as of 2026-08-01 (Bill).** The three ALS buyer audiences have been
> folded into the `workagedleads.com` audience alongside the two site
> newsletters — buyers consent to the newsletter in the buy/order flow, so this
> is one audience, not two programs with two lists. Run
> `npm run newsletter:migrate`; see `data/migration/MIGRATION-PLAN.md` § 2d.
>
> **The merge needs `DATABASE_URL`, and the script refuses to run without it.**
> ALS opt-outs are recorded in Postgres — `unsubscribeContact()` in
> `lib/als/lifecycle.ts` sets `als_buyer_contacts.unsubscribed` and never writes
> to the Resend audience. Measured on 2026-08-01 the two records had **zero**
> overlap: 20 opt-outs in Postgres, 15 in Resend. Merging on the Resend flag
> alone would have moved all 20 onto the new list as sendable.
>
> Retiring the agedleadsales.com *site* does not by itself retire this program.
> The lifecycle sender moves to `news.workagedleads.com` at cutover; keeping the
> subdomain separate from the bare domain is deliberate, so a 2,200-contact
> buyer program cannot spend the newsletter's sending reputation.
- **Campaigns sent:** `Lead-Buyer Promo — Tier 1` broadcast (2026-06-09, 112 recipients,
  "Exclusive DSCR & Non-QM leads — $75/lead").
- **Audience coverage gap (2026-06-18):** only **~918** of the **5,147** universe emails are loaded;
  **~4,297 missing** (≈4,185 inquiry-only). Backfill = import from `als-buyers-db` → verify → push.

## Deliverability (15-day window, as of 2026-06-18)

939 emails sent · **98.4% delivered** · **1.6% bounce** (10 transient / 5 permanent) · **0% complaints**.
`news.agedleadsales.com` warming cleanly.

## Reporting

No webhooks (deliberate — avoid deliverability/complexity risk). Performance is read from the
**Resend dashboard** (deliverability/bounce/complaint) + built from the **Resend API**
(audience size/growth, unsubscribe rate, broadcasts) and **GA4** via the `utm_source=agedleadsales`
UTMs (email → site clicks → agedleadstore.com orders/revenue).

## Key files (in `agency-manager`, pre-migration)

- `src/lib/als/{config,lifecycle,buyer-harvest,email-builder,gmail-parser,inquiry-parser}.ts`
- `src/lib/campaigns/{lead-buyer-promo,email-verify}.ts`, `src/lib/resend.ts`, `src/lib/google-auth.ts`
- `src/app/api/cron/{als-buyer-sync,als-lifecycle}/route.ts`, `src/app/api/campaigns/lead-buyer-promo/route.ts`,
  `src/app/api/als/unsubscribe/route.ts`
- `src/lib/db/schema.ts` → tables `als_buyer_contacts`, `als_buyer_journeys`
