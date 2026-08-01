# Migration data — workagedleads.com consolidation

Working data for consolidating howtoworkleads.com and agedleadsales.com onto
workagedleads.com. `url-map.csv` is the single source of truth for the redirect
map (Phase 2c), the cutover (Phase 5) and the agedleadstore.com link swap
(Phase 6).

**`MIGRATION-PLAN.md` in this directory is the plan** — phases, gates, rollback,
point of no return, and current status. Read it before acting on anything here.
This README covers the data files only.

Regenerate with `node scripts/build-url-map.mjs`.

## Files

| File | What |
|---|---|
| `url-map.csv` | 421 rows — every live URL across both sites, one row each |
| `htwl-sitemap.txt` | 175 howtoworkleads.com URLs (live sitemap, 2026-07-29) |
| `alsales-sitemap.txt` | 246 agedleadsales.com URLs (live sitemap, 2026-07-29) |
| `htwl-gsc-pages.json` | Current GSC window, www/non-www/#fragment normalized |
| `htwl-gsc-pages-2026-06-05.json` | The **prior** window. Keep it — prune eligibility is the intersection of the two |
| `htwl-published-at.json` | publishedAt per slug, from the Sanity export |
| `backlinks-2026-08-01.json` | Live referring domains per URL, both sites (Ahrefs). Prune eligibility now requires zero impressions **and** zero referring domains |

## url-map.csv columns

`old_url, new_url, action, risk, clicks, impr, pos, notes`

| Action | Count | Meaning |
|---|---|---|
| `REHOST` | 246 | agedleadsales.com page, path unchanged, host swap only |
| `MIGRATE` | 82 | howtoworkleads page moves across at the same path |
| `PRUNE` | 41 | Dropped — generic theory, zero-impression, dead hubs |
| `FOLD` | 27 | `/buying-leads/*` and category hubs into `/lead-types/*` |
| `MERGE` | 25 | Content merged into an existing target page, then 301 |

## Backlinks are a prune input, and were not until 2026-08-01

The prune rule keys on search impressions. A page can hold inbound links while
earning no impressions at all, and seven pruned pages did — a `PRUNE` row emits
no destination, so each would have 404'd at cutover and thrown its links away.
One was linked from kaleidico.com at DR 38.

`refdomains` is now a column, and the generator **fails the build** if any
`PRUNE` row still holds referring domains. Rescues live in
`LINKED_PRUNE_RESCUE` with a written reason each.

The constraint on a rescue is the plan's own rule: topic-matched destination,
never the homepage and never a generic hub. Google treats a topically unrelated
301 as a soft 404, so a bad destination is the same outcome as deleting the page
with extra clutter. Two of the seven are marked `weak` — the target site is
B2C-only and has no B2C-funnel equivalent — and want an editorial second opinion
before cutover.

Same lesson `/lead-order` already taught: **a URL's search metrics do not
measure its inbound links.** Check what points at a page before deleting it.

Risk: 408 low, 9 medium, 4 high.

Every row is resolved — no `REVIEW` rows remain. All 23 distinct `FOLD`/`MERGE`
destinations were verified live at HTTP 200 on 2026-07-29.

## The four high-risk rows

`/buying-leads/*` is **60% of howtoworkleads clicks and 51% of its
impressions** — the fold is not a low-stakes cleanup. Four rows are marked
`risk=high`:

| Position | Clicks | Impressions | Page |
|---|---|---|---|
| 13.3 | 67 | 3,346 | `/buying-leads/buy-iul-leads` |
| 33.6 | 51 | 20,714 | `/buying-leads/buy-life-insurance-leads` |
| 12.4 | 1 | 138 | `/buying-leads/buy-mortgage-protection-leads` |
| 10.7 | 3 | 278 | `/buying-leads/buy-non-qm-mortgage-leads` |

`buy-iul-leads` is the strongest page on either site. Harvest its copy into the
destination `leadType` **before** the redirect fires, not after.

The risk rule leads with **clicks, not position**. Position alone rated
`buy-life-insurance-leads` low — 51 clicks, the second-strongest page in the
fold, on 20,714 impressions at position 33.6. A page earning 67 clicks at
position 13 deserves more care than one earning 1 click at position 12.

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

## Data vintage — refreshed 2026-07-29

`htwl-gsc-pages.json` is now the 3-month window ending **2026-07-29**, and
`htwl-gsc-pages-2026-06-05.json` retains the previous one. See
`GSC-REFRESH-2026-07-29.md` for what the refresh changed — eleven pages came
off the prune list.

Two rules exist because a single window is not evidence:

- **Prune eligibility is the intersection.** Zero impressions in the latest
  export reads identically to a page that decayed off page 1. Retaining the
  prior window is what stopped the namesake cornerstone article from being
  deleted at position 6.2.
- **Position is impression-weighted, never a flat mean.** A page appears in the
  export as several rows (www, non-www, every `#fragment`); averaging them flat
  fabricated page-1 rankings.

**When the next export lands, add the window — do not replace the old one.**

## Redirect topology at cutover

`lib/migration-redirects.ts` emits **path-level** rules only. The host change is
a separate 301, so a URL whose path also changes takes two hops:
`agedleadsales.com/old` → `workagedleads.com/old` → `workagedleads.com/new`.
That is fine — Google follows short chains and passes equity.

What is **not** fine is the third hop. `www.` is a serving domain on both sites
today and its URLs are indexed and earning (`www.agedleadsales.com/providers/lead-heroes`
was at 168 impressions / position 7.2). Right now www 301s to the bare host in
one hop. If the bare host is then pointed at workagedleads.com, every www URL
becomes a three-hop chain.

**Point the `www.` redirect at workagedleads.com directly, not at its bare-domain
sibling.** This is Vercel domain configuration, not code — there is nothing in
this repo to change, which is exactly why it is easy to miss.

Verify with `node scripts/verify-redirects.mjs --mode=post`, which probes every
row **and its www variant** and fails on hop count, wrong destination, or a
`PRUNE` row that still resolves.

## Phase 2a content normalization

Portable Text is less portable than it looks. howtoworkleads.com parses markdown
*inside* span text at render time, so its documents store raw `**bold**`,
`[text](url)`, a leading `# Title` line, and — on six posts — the authoring brief
as a "Sanity CMS Fields" blockquote listing slug, SEO title, meta description and
excerpt. That brief is publicly visible on howtoworkleads.com today.

This project renders with `@portabletext/react`, which prints span text verbatim.
Imported as-is, 30 of the staged drafts would have published literal markdown.

`scripts/lib/normalize-imported-blocks.mjs` fixes this in the import path, so a
re-import cannot reintroduce it. `scripts/repair-imported-drafts.mjs` applied the
same normalization to drafts already staged (2026-07-30): 42 brief blocks
dropped, 17 duplicate `# Title` blocks dropped, 29 links and 37 bold spans
converted to real marks and markDefs.

Use `--new-only` when re-running the import. The write is `createOrReplace`, so a
plain re-run silently discards editorial work on drafts already staged.

## `/lead-order` — the CTA endpoint that was nearly pruned

`howtoworkleads.com/lead-order` was marked `PRUNE` as a "utility page with no
unique content". True, and beside the point: it is not a page. It 307s to
`agedleadstore.com/all-lead-types/` with UTM tagging — an affiliate exit.

Judging it by its 25 search impressions was the wrong instrument. Nobody
searches for a redirect endpoint; they click it. A crawl of all 175 source URLs
found **36 link instances across 17 pages** pointing at it, six of them on pages
that survive the migration, including two body-copy links in the cornerstone
article. It is also the **only** pruned URL still linked from a surviving page —
that sweep is worth re-running if the prune list changes.

Now `MIGRATE`, and recreated as a redirect in `next.config.ts`. Deliberately
**not** `permanent`: a 301 invites search engines to treat an affiliate exit as
the canonical destination. The UTM source comes from `lib/affiliate.ts`, so it
changes in one place at cutover — once Troy has confirmed whether affiliate
credit is keyed to `utm_source` or the referring domain (Phase 0, still open).

The general lesson: **a redirect endpoint's search metrics measure nothing.**
Before pruning any zero-content URL, check what links to it.

## Expect impressions to drop at cutover

The 16 generic pages carry ~27,000 impressions (37% of the site total) against
11 clicks, at positions 39–70. Pruning them is correct, but it will show up as a
large impressions decline in GSC. That is the intended outcome, not a
regression. Track clicks and conversions, not impressions, through the cutover.
