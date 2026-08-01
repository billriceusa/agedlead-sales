# GSC refresh — 2026-07-29

The prune list in `url-map.csv` was originally built on a GSC window that closed
**2026-06-05**, nearly two months stale. This is the re-check against fresh
"Last 3 months" exports (window ≈ 2026-04-29 → 2026-07-29) for both properties,
pulled from the Search Console UI because the MCP account lost access to the
BRSG properties.

**Headline: the strategy holds, but the prune list did not. Eleven pages came
off it once the refresh was run through the script rather than read by eye.**

`PRUNE` went from 59 rows to 49; `MIGRATE` from 71 to 81.

## 1. The zero-impression prune list moved — eleven reversals

An earlier draft of this document claimed no prune decision reversed. That was
wrong, and it was wrong because it was a manual read of the export. Running the
refreshed data through `build-url-map.mjs` produced eleven changes:

**Nine rescued by the 90-day grace window** (published late May–early June 2026,
still at zero impressions, but far too new to judge):
`compliance-automation-workflows-2026`, `conversion-psychology-internet-leads`,
`crm-integration-checklist-lead-tools`,
`lead-qualification-framework-internet-leads`,
`lead-quality-metrics-kpis-lead-buyers-track`, `lead-source-roi-tracking-system`,
`lead-velocity-optimization-guide`, `managing-multiple-lead-vendors`,
`solar-lead-conversion-internet-leads`.

**One rescued by fresh impressions:**
`/blog/cross-channel-lead-attribution-tracking` — 5 impressions at position 21.6.
Thin, but it is being served, so it migrates rather than dies.

**One rescued by the two-window rule** — see section 8. That one was the
dangerous miss.

The remaining zero-impression posts stay pruned, and now carry a note recording
that they were absent from **both** windows rather than just the latest.

## 2. The publishedAt guard was the right call — now provable

Nine posts were rescued from the prune list because they were published *after*
the old window closed, so their zero impressions meant "not measured yet". Fresh
data confirms they are live and earning:

| Page | Clicks | Impressions | Position |
|---|---|---|---|
| `/blog/dnc-scrubbing-on-a-budget` | 4 | 122 | 12.1 |
| `/blog/is-it-legal-to-call-purchased-leads` | 1 | 40 | 6.2 |
| `/blog/remove-landlines-disconnected-numbers` | 1 | 51 | 10.4 |
| `/blog/tcpa-litigator-scrub` | 0 | 59 | 13.1 |
| `/blog/lead-data-hygiene-checklist` | 0 | 11 | 6.3 |
| `/blog/iul-appointment-setting` | 0 | 5 | 5.6 |
| `/blog/iul-lead-objection-scripts` | 0 | 3 | 5.0 |

A naive prune would have deleted 6 clicks and the whole compliance cluster —
including three pages already sitting inside the top 10.

## 3. The generic cluster still justifies pruning

The 16 generic CRM/sales-theory pages produced roughly **12 clicks in three
months** across ~27 URLs (counting www duplicates), at positions 18–83.

Decay is visible: `/crm-systems/what-is-a-crm-system` carried 5,065 impressions
at position 70 in the old window and has now dropped out of the top 200
completely.

## 4. The fold is validated by the target site's own data

`/lead-types/*` is the **best-performing page type on agedleadsales.com** —
roughly 77 clicks across the 8 pages in this window:

| Page | Clicks | Position |
|---|---|---|
| `/lead-types/insurance-leads` | 22 | 25.4 |
| `/lead-types/mortgage-leads` | 17 | 36.8 |
| `/lead-types/final-expense-leads` | 11 | 32.4 |
| `/lead-types/mva-leads` | 8 | 46.6 |
| `/lead-types/iul-leads` | 7 | 20.4 |
| `/lead-types/ssdi-leads` | 5 | 20.7 |
| `/lead-types/medicare-leads` | 5 | 41.8 |
| `/lead-types/solar-leads` | 2 | 44.5 |

Folding the `/buying-leads/*` pages here sends them into the page type that
already converts best. The review/compare layer corroborates the strategy too:
`/blog/aged-lead-store-review-2026` at 18 clicks (pos 7.2), `/providers` at 16,
`/providers/aged-lead-store` at 8 (pos 8.9), and
`/compare/aged-lead-store-vs-the-leads-warehouse` at 7 (pos 10.6).

## 5. Position changes on the high-risk fold rows

Positions below are **impression-weighted** across the www, non-www and
`#fragment` rows that fold into each page. That weighting is itself a fix — see
section 6.

| Page | Old pos | Fresh pos | Old clicks | Fresh clicks | Risk |
|---|---|---|---|---|---|
| `/buying-leads/buy-iul-leads` | 8.7 | **13.3** | 62 | **67** | high |
| `/buying-leads/buy-life-insurance-leads` | 34.3 | 33.6 | 41 | **51** | high |
| `/buying-leads/buy-mortgage-protection-leads` | 14.6 | 12.4 | 1 | 1 | high |
| `/buying-leads/buy-non-qm-mortgage-leads` | 6.3 | 10.7 | 1 | 3 | high |
| `/buying-leads/buy-home-improvement-leads` | 12.7 | **15.0** | 12 | 9 | medium |
| `/buying-leads/buy-refinance-mortgage-leads` | — | 25.6 | — | 3 | low |

`buy-iul-leads` slipped off page 1 but **grew clicks to 67** — still the single
strongest page across both sites. The lesson for the risk column: position alone
is the wrong signal. A page earning 67 clicks at position 13 deserves more care
than one earning 1 click at position 12. The rule now leads with clicks, which
immediately caught `buy-life-insurance-leads` — 51 clicks at position 33.6, the
second-strongest page in the fold, which a position-only rule had rated low.

Risk labels are advisory metadata only — no destination or action changes.

## 6. Fragment rows were faking page-1 rankings

Anchor-fragment URLs fold into their base path, which is right for clicks and
impressions but was quietly corrupting position. The rows are wildly unequal:
`buy-refinance-mortgage-leads` has one real row at **position 30.4 on 166
impressions**, plus seven zero-click `#fragment` rows sitting at positions 6–8.2
on 1–14 impressions each. A flat mean reported the page at **9.9** and the risk
rule promoted it to `high` as a "page-1 asset." It is nothing of the kind.

`refresh-gsc-input.mjs` now weights position by impressions. Effects:

| Page | Flat mean | Impression-weighted | Actual base row |
|---|---|---|---|
| `/buying-leads/buy-iul-leads` | 8.3 | **13.3** | 16.2 |
| `/buying-leads/buy-refinance-mortgage-leads` | 9.9 | **25.6** | 30.4 |

High-risk rows went from 5 to 4. No action or destination changed — but had this
gone unnoticed, harvesting effort would have been aimed at a page ranking 30th
while the map understated how far `buy-iul-leads` had actually fallen.

## 7. howtoworkleads is growing

Site-wide clicks went from ~179 in the old three-month window to ~260 in this
one. Worth knowing before cutover: the baseline is moving up, so a flat
post-migration reading would actually represent a loss.

## 8. The near-miss: one window is not enough evidence to delete a page

`/blog/how-to-work-aged-leads-the-complete-system-for-maximum-roi` was marked
`PRUNE` on the refreshed data. It is the **namesake cornerstone article** of
howtoworkleads.com, and eight weeks earlier it sat at **position 6.2 with 151
impressions**. It is simply absent from the 2026-07-29 export.

Two things made it invisible to the prune guard:

1. It has **no `publishedAt` field in Sanity** (one of three such posts, all from
   December 2025), so the grace window could not protect it.
2. The rule only ever looked at the newest window, so a page that decayed to zero
   between two overlapping windows read identically to a page that never ranked.

Fix: `htwl-gsc-pages-2026-06-05.json` is now retained in the repo, and prune
eligibility requires zero impressions in **both** windows. Prune rows also now
flag when a post has no `publishedAt`, so an unverifiable age is visible in the
CSV instead of silently defaulting to "old enough to delete."

**When the next refresh lands, add the window — do not replace the old one.**

The other two undated posts:
`how-to-work-leads-the-simple-4-step-system-for-sales-professionals` migrates on
its own merits (1 click, 58 impressions, pos 7.5); `how-to-buy-mortgage-leads` is
absent from both windows and stays pruned.

## Still expected at cutover

A large impressions decline. The pruned generic cluster carries tens of
thousands of impressions against ~12 clicks. That drop is the intended outcome.
Track clicks and `/register` conversions through the migration, not impressions.
