# Migration data — workagedleads.com consolidation

Working data for consolidating howtoworkleads.com and agedleadsales.com onto
workagedleads.com. `url-map.csv` is the single source of truth for the redirect
map (Phase 2c), the cutover (Phase 5) and the agedleadstore.com link swap
(Phase 6).

Regenerate with `node scripts/build-url-map.mjs`.

## Files

| File | What |
|---|---|
| `url-map.csv` | 421 rows — every live URL across both sites, one row each |
| `htwl-sitemap.txt` | 175 howtoworkleads.com URLs (live sitemap, 2026-07-29) |
| `alsales-sitemap.txt` | 246 agedleadsales.com URLs (live sitemap, 2026-07-29) |
| `htwl-gsc-pages.json` | GSC page performance, www/non-www normalized |
| `htwl-published-at.json` | publishedAt per slug, from the Sanity export |

## url-map.csv columns

`old_url, new_url, action, risk, clicks, impr, pos, notes`

| Action | Count | Meaning |
|---|---|---|
| `REHOST` | 246 | agedleadsales.com page, path unchanged, host swap only |
| `MIGRATE` | 71 | howtoworkleads page moves across at the same path |
| `PRUNE` | 59 | Dropped — generic theory, zero-impression, dead hubs |
| `FOLD` | 27 | `/buying-leads/*` and category hubs into `/lead-types/*` |
| `MERGE` | 18 | Content merged into an existing target page, then 301 |

Every row is resolved — no `REVIEW` rows remain. All 23 distinct `FOLD`/`MERGE`
destinations were verified live at HTTP 200 on 2026-07-29.

## The four high-risk rows

`/buying-leads/*` is **73% of howtoworkleads clicks and 42% of its
impressions** — the fold is not a low-stakes cleanup. Four rows are marked
`risk=high` because they are page-1 assets:

| Position | Clicks | Impressions | Page |
|---|---|---|---|
| 8.7 | 62 | 3,891 | `/buying-leads/buy-iul-leads` |
| 12.7 | 12 | 5,170 | `/buying-leads/buy-home-improvement-leads` |
| 14.6 | 1 | 65 | `/buying-leads/buy-mortgage-protection-leads` |
| 6.3 | 1 | 56 | `/buying-leads/buy-non-qm-mortgage-leads` |

`buy-iul-leads` is the strongest page on either site. Harvest its copy into the
destination `leadType` **before** the redirect fires, not after.

## Near-duplicate resolution — 7 of 13 were false positives

The pairs were surfaced by slug-token similarity, which is noisy. Reading the
actual titles, only 6 were real duplicates. The rest are distinct work and
migrate intact — most importantly `aged-lead-pricing-guide` (pricing), which
had matched `aged-lead-crm-setup-guide` (CRM setup) on shared tokens alone and
sits at position 4.8 with 2,959 impressions. The "how to **work** aged X leads"
vertical guides likewise matched "how to **buy** aged leads" — different job,
different intent.

The 6 real merges are listed in `MERGE_INTO` in the generator with a one-line
rationale each. Take the best of both into the destination; the howtoworkleads
version is often the more thorough one.

## Lead types — done

The four destination lead types now exist in Sanity (`lt-life-insurance`,
`lt-auto-insurance`, `lt-health-insurance`, `lt-home-improvement`), created by
`scripts/create-lead-types.mjs`. All four pages render live. This brings
`leadType` to the same 12-vertical spine `/price-index/*` and
`/providers/best/*` already use.

`data/lead-type-vertical-map.ts` was updated in both directions. That also fixed
a pre-existing live bug: `home-improvement` pointed at `home-services-leads`, a
lead type that no longer exists, so the cluster links on
`/price-index/home-improvement` and `/providers/best/home-improvement` were dead.

`averageCostPerLead` is deliberately unset on the new lead types. The reliable
benchmarks for these verticals span mixed age brackets and produce misleading
ranges ($20–$100 for aged auto, $1.00–$1.00 for life). Benchmarks are
human-verified quarterly here and never auto-generated — fill these in on the
next quarterly pass.

## Data vintage — read this before trusting the prune list

`htwl-gsc-pages.json` is a **3-month GSC window ending 2026-06-05**, taken from
`data/gsc-export-2026-06-05/Pages.csv` in the howtoworkleads repo. It is the
best available: the GSC MCP account lost read access to the property partway
through this work, and BRSG properties need service-account impersonation.

Because the window is stale, zero impressions can mean "published after the
window closed" rather than "dead". The generator guards on `publishedAt` — 9
posts, including the entire IUL cluster and the 5-post compliance cluster, are
marked `MIGRATE` with a note rather than pruned.

**Refresh the GSC data before executing the prune list.** 33 pages are slated
for deletion on a two-month-old measurement.

## Expect impressions to drop at cutover

The 16 generic pages carry ~27,000 impressions (37% of the site total) against
11 clicks, at positions 39–70. Pruning them is correct, but it will show up as a
large impressions decline in GSC. That is the intended outcome, not a
regression. Track clicks and conversions, not impressions, through the cutover.
