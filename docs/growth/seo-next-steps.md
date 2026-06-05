# SEO Next Steps — agedleadsales.com

**Created:** 2026-06-05. Companion to [digital-pr-plan.md](digital-pr-plan.md)
(the traffic lever) and [`../../data/backlink-audit/`](../../data/backlink-audit/)
(disavow).

---

## 1. Technical hygiene — audited 2026-06-05 (all healthy, no fixes needed)

Verified against the live site:

| Check | Result |
|---|---|
| `www` → non-www | **308 permanent redirect** (SEO-equivalent to 301) ✓ |
| Canonical tags | Non-www, self-referencing on homepage, blog, lead-types, glossary, calculators ✓ |
| Provider → blog-review canonical | Intentional anti-cannibalization (profile defers to in-depth review) ✓ |
| `robots.txt` | Allows all except `/studio`, `/api/` ✓ |
| Sitemap | Dynamic, comprehensive, non-www base ✓ |
| Accidental `noindex` | None found ✓ |
| Indexation | ~30+ pages live in Google (confirmed via `site:`) ✓ |

**The one "www" page in Google's index** (`www.agedleadsales.com/providers/lead-heroes`)
is stale — the 308 redirect + non-www canonical mean it self-heals on recrawl.
No action required.

**Conclusion:** technical SEO is not the bottleneck. Authority is. See the
digital-PR plan.

---

## 2. CTR baseline — 2026-06-05 (to measure the title changes)

Today we shipped CTR-optimized titles/meta (homepage, `/lead-types`, `/blog`) and
a hero trust strip. To prove they worked, here's the baseline.

**Measurable proxies as of 2026-06-05:**
- Ahrefs Domain Rating: **2.5**; organic keywords: **0**; organic traffic: **0**
- Referring domains: 154 (146 just disavowed → expect this to fall)
- Indexed pages: ~30+
- Google still serving OLD titles in SERPs (not yet recrawled post-deploy)

**Authoritative CTR source = Google Search Console → Performance (last 28 days).**
I can't pull it from here (GSC auth uses Vercel-only Workload Identity Federation,
no local OIDC token). To set the baseline, **record today's GSC Performance
totals**: Clicks, Impressions, CTR, Avg Position — site-wide, and for the 3 pages
we changed (`/`, `/lead-types`, `/blog`).

**Re-measure: ~2026-07-06** (4 weeks; lets Google recrawl + accumulate data).
Success = higher CTR at similar-or-better average position on the changed pages.

**Optional improvement:** the daily-performance cron already fetches GSC but only
persists an AI summary. Persisting the raw daily Clicks/Impressions/CTR/Position
to a JSON would give automatic trend tracking (no manual GSC reads). ~1hr build if
we want it.

---

## 3. Content prune / consolidation framework (needs real GSC data + Bill's call)

The site has a lot of pages for a DR-2.5 domain (50+ provider profiles, 77 glossary
terms, 15+ verticals, 21+ posts). Google's Helpful Content System rewards
*concentration* — thin, zero-traffic pages can dilute the whole domain. Pruning is
a real lever, but it's destructive and needs per-page data, so it's **deliberately
not automated.**

**Decision rule (apply once we have GSC page data, e.g. 90-day):**

| Page state (90-day GSC) | Action |
|---|---|
| 0 impressions, 0 clicks, thin (<300 useful words) | **Prune** (410 or redirect to parent hub) |
| Impressions but 0 clicks, on-topic | **Keep + improve** title/meta (CTR fix), don't cut |
| 2+ pages competing for one query | **Consolidate** to one canonical, 301 the rest |
| Real clicks / links | **Keep** (obviously) |

**Likely prune/consolidate candidates to review first** (verify with data before
cutting — do NOT cut blind):
- **Glossary singles** — 77 individual term pages; many likely zero-traffic. Candidate
  to consolidate thin ones into hub/cluster pages rather than 77 standalone URLs.
- **Low-value provider profiles** — profiles for providers with no search demand.
- **Overlapping lead-type vs blog content** — the cron has repeatedly flagged
  mortgage / IUL / insurance cannibalization; pick one canonical per query.

**Process when ready:** pull GSC page+query export → apply the rule table → I
prepare the redirect/prune list → Bill approves → execute as one clean migration
(with redirects, never bare 404s).

---

## Priority order from here

1. **Digital PR / links** ([plan](digital-pr-plan.md)) — the only real traffic lever now.
2. **Record the CTR baseline** in GSC today; re-measure ~2026-07-06.
3. **Monthly:** refresh disavow + Ahrefs audit (calendar reminder set for 2026-07-06).
4. **When we have GSC page data:** run the prune/consolidation pass.
