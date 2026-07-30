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
| `htwl-gsc-pages.json` | Current GSC window, www/non-www/#fragment normalized |
| `htwl-gsc-pages-2026-06-05.json` | The **prior** window. Keep it — prune eligibility is the intersection of the two |
| `htwl-published-at.json` | publishedAt per slug, from the Sanity export |

## url-map.csv columns

`old_url, new_url, action, risk, clicks, impr, pos, notes`

| Action | Count | Meaning |
|---|---|---|
| `REHOST` | 246 | agedleadsales.com page, path unchanged, host swap only |
| `MIGRATE` | 81 | howtoworkleads page moves across at the same path |
| `PRUNE` | 49 | Dropped — generic theory, zero-impression, dead hubs |
| `FOLD` | 27 | `/buying-leads/*` and category hubs into `/lead-types/*` |
| `MERGE` | 18 | Content merged into an existing target page, then 301 |

Risk: 409 low, 8 medium, 4 high.

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

## Open decision — `/lead-order`

`howtoworkleads.com/lead-order` is marked `PRUNE`, but it is not content: it 307s
to `agedleadstore.com/all-lead-types/` with `utm_source=howtoworkleads`. It is an
affiliate exit, and judging it by its 25 search impressions is the wrong
instrument — nobody searches for a redirect endpoint, they click it. 36 link
instances across 17 pages point at it, six of them on pages that survive the
migration, including two body-copy links in the cornerstone article.

Pruning it 404s those links. Resolving it needs the Phase 0 attribution question
answered first — the correct replacement URL depends on whether affiliate credit
is keyed to `utm_source` or the referring domain.

## Expect impressions to drop at cutover

The 16 generic pages carry ~27,000 impressions (37% of the site total) against
11 clicks, at positions 39–70. Pruning them is correct, but it will show up as a
large impressions decline in GSC. That is the intended outcome, not a
regression. Track clicks and conversions, not impressions, through the cutover.
