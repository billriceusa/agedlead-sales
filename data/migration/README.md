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
| `MIGRATE` | 67 | howtoworkleads blog post moves across at the same path |
| `PRUNE` | 49 | Dropped — 16 generic CRM/sales theory, 33 zero-impression |
| `REVIEW` | 35 | **Needs a human call before Phase 2** |
| `FOLD` | 23 | `/buying-leads/*` collapses into `/lead-types/*` |
| `MERGE` | 1 | `/resources/about` into the existing `/about` |

## Before this is executable

The 35 `REVIEW` rows need decisions — 13 near-duplicate pairs where a winner
must be picked, plus unclassified URLs. Nothing in Phase 2 should run until
those are resolved.

Four `FOLD` rows are marked `risk=high`. These are page-1 assets, and
`/buying-leads/buy-iul-leads` (position 8.7, 62 clicks, 3,891 impressions) is
the strongest page on either site. Harvest the copy into the destination
`leadType` **before** the redirect fires, not after.

Four destination lead types do not exist in Sanity yet and must be created
first: `life-insurance-leads`, `auto-insurance-leads`, `health-insurance-leads`,
`home-improvement-leads`. This brings `leadType` in line with the 11–12 vertical
taxonomy `/price-index/*` and `/providers/best/*` already use.

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
