# Newsletter & Email Strategy — Work Aged Leads

**Session date:** 2026-08-27
**Goal on the table (Bill):** make email the #1 affiliate revenue channel.
**Scoreboard:** sessions into agedleadstore.com, GA4 property `357329146`.

---

## 1. What the data actually says

Measurement window **2026-06-01 → 2026-08-26** (87 days), all figures are
sessions arriving at agedleadstore.com, pulled from GA4 `357329146` by
`sessionSource / sessionMedium / sessionCampaignName`.

| Channel | Sessions (87d) | Per month | Note |
|---|---:|---:|---|
| **Site link-outs** (`*/affiliate`) | 440 | **154** | Both source labels: `agedleadsales` 343 + `workagedleads` 97 |
| **Lifecycle drip** (`agedleadsales/email`, welcome + replenish) | 91 | **32** | Daily cron, per-contact journeys |
| **Weekly newsletter** (`workagedleads/email/weekly-newsletter`) | **17** | — | **One single send**, 2026-08-12 |

**Deliberately excluded:** `agedleadstore / email / registration_no_order`
(130 sessions). That is Aged Lead Store mailing its *own* registrants. It is
Troy's traffic, not a channel we operate, and counting it would overstate our
contribution by ~30%.

### The finding

One newsletter send produced **17 sessions**. The entire website produces
**5.1/day**. A single email therefore delivered roughly **3.3 days of total
site output** — and it did so with **one** store link, the generic
`/all-lead-types/` catalogue, sitting at **79% page depth**.

Email is already the highest-leverage channel per unit of effort. It is simply
being run as a content newsletter rather than a revenue one.

### The link budget

Both the sent 2026-08-10 issue and the retired 2026-08-17 issue contain
**21 links**:

- **20** point back to workagedleads.com (blog ×11, playbook ×4, glossary,
  calculators, home, blog index, plus the featured article repeated 3×)
- **1** points to agedleadstore.com

The email spends its entire click budget sending readers to content that then
has to convert them a second time. `lib/affiliate.ts` maps **15 store buy
pages** by lead type. The newsletter uses **none** of them.

---

## 2. What has to be true to win

To become the #1 channel, the newsletter must beat **154 sessions/month**.

| Scenario | Per send | Cadence | Per month |
|---|---:|---:|---:|
| Today | 17 | weekly | 74 |
| **Target** | **36** | weekly | **156** |

That is a **2.1× lift in per-send yield** — not a traffic problem, a
placement problem. The site already proves the lever works on this exact
audience:

| Site placement | Sessions (87d) |
|---|---:|
| `cta-banner` (banner block) | 209 |
| `blog-post` (inline text links) | 88 |

Banner placements outperform inline text links by **2.4×** on-domain. The
newsletter currently has zero banner placements above 79% depth.

Newsletter at 156/mo + lifecycle at 32/mo = **188/month**, versus the site's
154/month. Email becomes the #1 channel.

---

## 3. CTA architecture (the design change)

Current template section order — `lib/cron/newsletter-email.ts`:

```
Header → Intro → Featured Article → Quick Tips → Industry Insight
  → This Week on the Blog → Flagship Playbook Strip → [CTA] → Closing → Footer
```

The only store link is at line 190 of 241.

**Proposed — three placements, not one:**

1. **Above the fold.** A single store CTA immediately after the intro, before
   the featured article. The reader who opens, skims, and leaves currently
   never sees a store link at all.
2. **Vertical self-select strip.** Replace the generic catalogue link with
   4 lead-type deep links (mortgage / final expense / auto / legal) built from
   `storeCategoryPath()`. The reader picks their own vertical — this captures
   deep-link value **without segmenting the send**.
3. **Closing CTA.** Keep the existing one, at its current position.

The Flagship Playbook Strip already occupies prime real estate at 66% depth
with three buttons pointing at our own site. That is the natural home for
placement 2.

### Why self-select instead of list segmentation

The audience is 2,584: Purchasers (~1,038), Inquiries (~1,267),
newsletter-only (~226), store self-serve (~71). Those are genuinely different
intents, and the instinct is to segment.

**Recommendation: don't.** One send, vertical-aware CTAs. Reasons: the
lifecycle drip already segments behaviourally; splitting the broadcast
multiplies the approval burden on the one step that has already failed twice
(see §5); and a self-select strip recovers most of the deep-link upside at a
fraction of the operational cost. Revisit only after the CTA change has been
measured.

This preserves the 2026-08-10 plan decision ("one unsegmented send") rather
than reversing it.

---

## 4. Attribution defects — ALL FIXED 2026-09-02

**a) The verification step read the wrong row. FIXED.** This plan used to say
measure success by comparing `workagedleads / affiliate` against the 5.6/day
baseline. Newsletter clicks land under `workagedleads / **email**`, so that
check would have shown zero newsletter impact **forever**, no matter how well
the newsletter performed — and it would have read as a failed experiment rather
than a broken query.

**The correct check is `sessionMedium = email`.** `lib/cron/als-email-report.ts`
already filters on exactly that, so the code was right and this document was
wrong; the risk was that someone would implement what the plan said. If you are
measuring newsletter impact, medium is `email`. Affiliate medium belongs to
on-site CTAs (`lib/affiliate.ts`), which is a different question entirely.

**b) `utm_content` carried the issue date, not the placement. FIXED.**
It now carries both — `2026-08-31-hero`, `2026-08-31-vertical-mortgage`,
`2026-08-31-footer` (`lib/newsletter/store-links.ts`). Issue-level rollup
survives; placement-level truth is added.

Read it back at `GET /api/reports/store-revenue`, which reports
`sessionManualAdContent` **against revenue** rather than sessions. That matters:
the 2026-09-02 reading found placements with near-identical session counts and
~86x different revenue, so a placement report measured in sessions would have
ranked them as equals.

**c) Site links in the newsletter were untagged. FIXED.** Fifteen of the issue's
twenty-seven links pointed back at our own site with no UTMs, so any blog read
the newsletter drove arrived as direct or organic and the `sessionMedium=email`
filter in (a) could never see it — the newsletter was doing work it got no
credit for, which looks identical to doing none. `siteLink()` in
`lib/cron/newsletter-email.ts` now tags all of them with the same
`{issue}-{placement}` convention.

Because of that, `als-email-report.ts` moved its landing-page dimension from
`landingPagePlusQueryString` to `landingPage`. With UTMs present the
query-string variant splits one article into a row per issue per placement, and
a top-10 fills with fragments of the same page.

**c) Resend exposes no engagement data via API.** The broadcast endpoint
returns no `delivered` / `opened` / `clicked` fields — open and click rates
exist only in the Resend dashboard. GA4 store sessions are therefore the only
programmatically verifiable measure of newsletter performance. Treat the
GA4 row as the scoreboard; treat dashboard opens as context.

---

## 5. The repeatable process (what actually broke)

Bill asked for a "consistent, persistent, repeatable, reliable process." The
current one is sound in design and has failed twice in execution:

- **2026-08-10** — drafted 08-10, sent **08-12**, two days late.
- **2026-08-17** — drafted 08-16, **never sent**, retired 08-27.

The Sunday cron drafts and previews correctly. The weak link is the manual
send step: it has no deadline, no reminder, and no signal when an issue is
sitting in limbo. An archived draft looks sendable forever — only the date
ages.

**Fixes:**

1. **`killed` flag + refusal guard** — shipped this session. A retired issue
   can no longer be revived by reaching for the newest archive file.
   `scripts/send-newsletter.ts` exits 1 on `killed: true`.
2. **Expiry in the preview email.** State plainly: *"Send by Wednesday or this
   issue retires."* A draft with no deadline is a draft that rots.
3. **`newsletter:status` check.** Report any archive that is neither `sent`
   nor `killed`, so limbo is visible rather than silent. Wire into the
   existing health-check.

---

## 6. Decisions — all five made (Bill, 2026-08-27)

| # | Decision | Outcome |
|---|---|---|
| **MEMO 1** | Three CTA placements, or keep one? | **Three.** Shipped. |
| **MEMO 2** | Vertical self-select strip vs. segmented sends? | **Self-select.** One unsegmented send stands. |
| **MEMO 3** | Which verticals in the strip? | **All nine cards** on `/all-lead-types/`. Bill: "simply a mapping to this page's cards, which doesn't change often." |
| **MEMO 4** | Displace the Flagship Playbook Strip? | **Yes.** Replaced by the vertical strip; the playbook keeps its footer nav link. |
| **MEMO 5** | Cadence — hold weekly? | **Weekly.** |

### What the card grid changed

Reading Troy's inventory properly turned up three things our code had wrong:

1. **The cards link to the storefront, not the marketing pages.** Every card
   points at `store.agedleadstore.com/{segment}/leads` — the ordering app —
   skipping the marketing page the site's own `lib/affiliate.ts` map uses.
   That is one fewer click before an order. Verified safe: that host is
   tracked in the **same** GA4 property commission is computed from
   (`357329146` — 7,610 sessions / 47,524 pageviews over the window), so the
   shorter path does not break attribution.
2. **Solar is stocked.** `lib/affiliate.ts` carried a note saying Troy sold
   neither Medicare nor solar, "confirmed 2026-08-06." The grid has a Solar
   Installation card. Medicare is still genuinely absent; the solar half was
   stale. Comment corrected; the site's solar lead-type page still falls back
   to the catalogue and is now a live deep-link opportunity.
3. **The closing CTA quoted a price we cannot support.** It read "Aged leads
   from $0.25." The cheapest card on the grid is $0.40–0.75. Removed rather
   than re-quoted — see below.

**Prices are deliberately not in the email.** They are a strong self-select
signal, but hard-coding them means a price change silently mails a wrong
number to 2,584 buyers. The storefront shows live pricing on landing.

### A 200 cannot validate these links

`store.agedleadstore.com/bogus_vertical/leads` returns **200**, not 404 — the
storefront serves a page for any slug. What separates a real vertical from a
typo is the body: the nine real verticals rendered 85–90 KB and named their own
vertical ~11 times each; the bogus slug rendered 30 KB. Recorded in
`lib/newsletter/store-links.ts` so the next person does not check a status code
and call it verified.

### 7. Revenue per referred session — a candidate rate, with one open question

The missing input has a first estimate. ALS's books carry an **Affiliate Rev
Share** line: $0 for every month of 2025 and Jan–Feb 2026, then **$2,918 in
March 2026**.

March 2026 referral sessions into agedleadstore.com (GA4 `357329146`,
independently re-queried 2026-08-27):

| Source / medium | Sessions |
|---|---:|
| howtoworkleads / website | 352 |
| howtoworkleads / blog | 9 |
| agedleadsales / affiliate | 11 |
| agedleadsales / email | 1 |
| **Total** | **373** |

**$2,918 ÷ 373 = $7.82 per referred session.**

| Scenario | Sessions/mo | Revenue/mo |
|---|---:|---:|
| Today (newsletter effectively dark) | 186 | $1,455 |
| Newsletter weekly, old design | 260 | $2,033 |
| **Target (36/send)** | **342** | **$2,674** |

**Incremental from this rebuild: +156 sessions/mo → +$1,220/mo, ~$14,600/yr.**

The most useful thing this reveals: **the 342-session target is not blue-sky
growth. March 2026 already did 373.** Affiliate volume roughly halved through
the consolidation, and we are at ~186/month now. So the target is *recovery to
a level already achieved* — through a channel that does not wait on Google.
That is a materially stronger claim than a 2.1× lift argued from first
principles.

**The open question, and it halves the forecast if it goes the other way.**
March 2026 is the *first* month rev share appears at all. If that $2,918 was a
true-up covering Q1 rather than March alone, the real rate is ~$2.61/session
and the target case drops to **$892/month**. The P&L cannot settle it.

> **Ask Troy:** "Was the March affiliate rev-share payment for March only, or
> catch-up for Q1?"

Other limits, stated plainly: **n = 1 month**. The line is labelled
HowToWorkLeads, so it may exclude the 12 agedleadsales sessions (that only
moves the rate to $8.08). And the P&L stops at March — a later file
(*Next Wave Marketing Strategies Inc. Financials 7-31-26.xlsx*, attached to
Troy's 2026-08-08 "ALS July books" email) would carry Apr–Jul and is the better
input. Re-run this with that line before treating $7.82 as settled.

---

## Appendix — provenance

- Channel figures: GA4 property `357329146`, 2026-06-01 → 2026-08-26,
  dimensions `sessionSource`, `sessionMedium`, `sessionCampaignName`.
- Link counts: `grep -oE 'href="[^"]+"'` over
  `data/newsletter-archive/2026-08-{10,17}.html`.
- CTA depth: `lib/cron/newsletter-email.ts`, CTA block at line 190 of 241.
- Store buy-page map: `lib/affiliate.ts`, `STORE_CATEGORY_PATHS` (15 entries).
- Audience size: `npm run newsletter:migrate` output, 2026-08-27 —
  2,677 total / 2,584 sendable / 93 unsubscribed.
- `workagedleads.com` GA4 (`528489903`) returned **403** to this service
  account, so clicks *into the site* from email could not be measured. That
  is the open GA4-access loop, and it is the reason §1 counts only store-side
  sessions.
