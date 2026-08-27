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

## 4. Attribution defects to fix

**a) The verification step reads the wrong row.** The standing plan says to
measure success by comparing `workagedleads / affiliate` against the 5.6/day
baseline. Newsletter clicks land under `workagedleads / **email**`. That check
would show zero newsletter impact forever, no matter how well the newsletter
performed.

**b) `utm_content` carries the issue date, not the placement.** Today:
`utm_content=2026-08-10`. That tells you *which issue*, never *which link*.
With three placements you cannot tell which one earned the click.

Fix: `utm_content={date}-{placement}` — e.g. `2026-08-10-hero`,
`2026-08-10-vertical-mortgage`, `2026-08-10-footer`. Keeps issue-level
rollup, adds placement-level truth.

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

## 6. Decisions needed from Bill

| # | Decision | Recommendation |
|---|---|---|
| **MEMO 1** | Three CTA placements, or keep one? | **Three.** This is the 2.1× lever. |
| **MEMO 2** | Vertical self-select strip vs. segmented sends? | **Self-select.** Keeps one send; preserves the standing decision. |
| **MEMO 3** | Which 4 verticals in the strip? | Mortgage, final expense, auto, legal — but this should follow Troy's current inventory, not our guess. |
| **MEMO 4** | Displace the Flagship Playbook Strip? | **Yes.** It is prime real estate pointing at our own site. |
| **MEMO 5** | Cadence — hold weekly? | **Weekly.** The arithmetic above assumes it. |

### The one input we do not have

Ranking channels by *revenue* rather than *sessions* requires
revenue-per-store-session — conversion rate and commission. That number is not
in GA4, the repo, or any system readable from here. Everything above is
denominated in sessions because that is the honest unit available.

**Phase 0: get effective revenue per referred session from Troy.** Until then
"the #1 affiliate revenue channel" is being measured by its best available
proxy, not by revenue itself.

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
