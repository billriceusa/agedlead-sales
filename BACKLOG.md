# AgedLeadSales.com Backlog

> Prioritized backlog of features, enhancements, and fixes. Audited against [lead-gen-patterns.md](../_shared-docs/lead-gen-patterns.md) on 2026-04-04.
>
> **Priority levels:** P0 = critical gap, P1 = high value, P2 = important, P3 = future growth

---

## 2026-07-14 — Portfolio Performance Report priority anchor
<!-- added 2026-07-14 — cross-portfolio prioritization from the BRSG Portfolio Performance Report (daily) -->

**Report snapshot (2026-07-14 daily):** 450 sessions (+172.8%), **27 conv** — the portfolio's #1 converter.

**Portfolio rank: TIER 1 — the top converter** (AEO-driven; AI assistants are the best-converting channel). Scale and defend. Work these existing items, in order:

1. **Refresh + resubmit the disavow** (P0 below) — the toxic-backlink attack is ongoing and this is **overdue** (due ~2026-07-06); avg position is eroding 25.4 → 32.3. Diff new spam domains; Bill re-submits in GSC. Authority is the binding traffic constraint — this stops the bleeding.
2. **Feature the pipeline calculator** (P1 below) — it converted **9 of 16 sessions** (best on-site converter) but is starved of traffic; surface in nav/homepage + internal-link + add SoftwareApplication/HowTo JSON-LD so it also *earns* organic landings.
3. **Ship the next `/compare/*` AEO wave** (P1 below) — AI Assistants are the best-converting channel and cite this format; build `final-expense-vs-term-life`, `medicare-vs-aca` on the existing template.
4. **Attribution config fix** (P1 below) — enable bot exclusion + referral review so the 66% "Direct" stops poisoning measurement (fleet pattern; code is already correct).

*Next content lever: build the 3 missing lead-type guides — health-insurance, debt-settlement, mca-business-loans (P1 below).*

---

## 2026-07-21 — /brsg-session

**Position has recovered, contrary to the 07-14 note above.** Rolling-7d GSC: avg position **32.3 (Jun 25) → 21.76**, CTR **0.62% → 1.02%**, clicks **14 → 33**. Impressions cooled (4,122 → 3,223). Ahrefs: DR low, org traffic ~26/mo, 6 organic keywords.

Shipped this session:

- [x] **Disavow refreshed to 291 domains (+41).** Attack still running — refdomains **252 (06-29) → 292 (07-20)**, and **all 70 newest referring domains were spam** (100% of the new cohort). Bill uploaded to GSC 2026-07-21. The P0 above is now closed.
- [x] **SERP title truncation fixed sitewide — 34 → 241 of 246 pages within budget (`e74d4bd`).** 212 of 246 titles exceeded the ~60-char SERP budget. Root cause was the layout `title.template` appending `" | Aged Lead Sales"` to every page; that suffix was redundant because the `WebSite`/`Organization` schema already declares the site name, which is how Google sources it. Dropping it alone recovered 182 pages. Also shortened the compare/glossary/provider-review templated patterns, fixed the worst hardcoded titles, and added "aged" — the money term — to the `/providers` title, which omitted it entirely. Verified by measuring all 246 sitemap URLs against a served production build.
- [x] **Toxic-backlink classification automated (`2cb7742`).** `lib/backlink-audit/spam-classifier.ts` + `scripts/refresh-disavow.ts` + 37 tests (`npm test`, `node:test`, no new dependency). Validated against real ground truth — the 291 domains already disavowed: calls **none** of them clean, auto-flags **270 (93%)**, defers 21 genuinely ambiguous ones to a human. Deliberately three-verdict, not boolean: wrongly disavowing a genuine editorial link costs far more than deferring one spam domain.
- [x] **Comparison cluster de-orphaned (`091a03a`).** A crawl of the in-body link graph found **16 of 17 indexed `/compare/*` pages had zero inbound links from anywhere** — not nav, footer, or body — reachable only via the sitemap. Root cause: `ProviderCompareSelector` is a `<select>` + `router.push()`, emitting no `<a href>`, and no `/compare` index existed. This matters because it is the **best-converting format on the site** — `/compare/aged-lead-store-vs-the-leads-warehouse` ranks position 9 at **5.97% CTR**, the highest of any page, on zero internal link equity. Built the `/compare` hub (17 comparisons, ItemList + breadcrumb JSON-LD, in sitemap), added it to header nav + footer, and gave every provider page a real crawlable link to its own head-to-head.

Still open from this session:

- [ ] **5 Sanity post metaTitles/metaDescriptions still truncated — needs Bill's go-ahead.** A seeding pass clipped values to satisfy the 60/160 caps, shipping **10 metaTitles and 12 metaDescriptions ending in a literal `…`** that Google renders verbatim — including the site's best-ranked page (`aged-lead-store-review-2026`, position 6.25, 251 impr/wk, showing "…Honest Assessment of the L…" and converting at only **1.59% CTR** against a ~5–7% expectation for that position). Rewrites are drafted and dry-run clean for all 17 affected posts; the write was blocked by the permission gate because it mutates live production Sanity. Rollback snapshot of all 76 posts saved. The schema now rejects ellipsis-terminated values so this cannot recur. **Action:** approve the Sanity write. *Effort: S.*

## Done

<!-- added 2026-06-13 editorial session -->
- [x] **5 editorial briefs written + published** (2026-06-13) — wrote and published the five ready weeks-13–14 briefs from the email-program audit, in Bill's voice (answer-first H2s for AEO, glossary auto-links, branded Unsplash featured images, no fabricated stats; legal/AI-voice claims web-verified + cited): **Call Recording Consent by State** (`/blog/aged-lead-call-recording-consent-by-state`), **The Aged-Lead Sales Stack Under $100/Month** (`/blog/aged-lead-sales-stack-under-100-month`, affiliate angle), **Put Your CRM on Autopilot: AI Agents + MCP** (`/blog/crm-autopilot-ai-agents-mcp-aged-leads`), **Scheduling Links That Book + Capture Consent** (`/blog/scheduling-links-book-calls-capture-consent`), **AI Guardrails for Aged-Lead Agents** (`/blog/ai-guardrails-aged-lead-agents`). Source markdown in `content/drafts-2026-06-13/`; published via `scripts/publish-drafts-2026-06-13.ts` with **staggered publishedAt** (recent Mon/Wed/Fri, not a same-day batch — avoids the scaled-content signal). Calendar entries flipped to `status:"published"`. Posts are 71→76. Verified live (200, og:image, Article JSON-LD).
- [x] **Re-angled the Week-9 SMS brief to consent-first** (2026-06-13) — `aged-lead-text-sms-strategies` brief in `data/editorial-calendar.ts` flipped from pro-SMS to "earn consent first" (cold-texting purchased/aged data is a TCPA trap; email-first warm-up + booking-link consent capture, then text only the consented). Bill's call.

<!-- added 2026-06-13 content session -->
- [x] **AEO comparison cluster — 3 new answer pages** (2026-06-13) — built a reusable `components/comparison-page.tsx` (answer-first intro + Key Takeaways + real `<table>` + visible FAQ mirrored by FAQPage JSON-LD + cite + RelatedLinks) and shipped three coded `/compare/*` routes targeting high-intent informational queries (AEO play — ChatGPT is the #3 traffic source): **`/compare/aged-vs-real-time-leads`** (the category's #1 comparison query — data-backed table from `data/verticals.ts` benchmark defaults, per-vertical not averaged), **`/compare/medicare-advantage-vs-supplement`**, **`/compare/iul-vs-term-life`**. Each funnels to its lead-type page (medicare-leads / iul-leads) and is in the sitemap. Cross-linked from the `/price-index` hero + `/lead-types` hub. No fabricated stats (real benchmark defaults; product facts only; close-rate formatter shows 1 decimal so 1.5% doesn't round to 2%).
- [x] **Thin programmatic pages noindexed (not fabricated)** (2026-06-13) — every vertical auto-generates a `/price-index/[vertical]` and `/providers/best/[vertical]` page, but the niche ones were live, sitemapped thin content. Added a shared `lib/benchmark-coverage.ts` (Sanity-or-static load + `providersSampled>=2` trust gate, React-`cache()`d so page+metadata share one fetch). Now noindex+follow and dropped from the sitemap when a price-index vertical has no reliable benchmark (`homeowners-insurance`, `long-term-care`, `auto-warranty`, `home-security`, `annuity-iul`) or a best-providers vertical has <2 reviewed providers (`home-security`, `long-term-care`, `auto-warranty`, `annuity-iul`). They auto-rejoin the index when real data/providers are added. Verified in built HTML + live sitemap.
- [x] **SSDI compare-link bug fixed** (2026-06-13) — `ssdi-leads` pointed to `/providers/best/life-insurance` in both `data/lead-types.ts` (`getCompareUrl`) and `data/lead-type-vertical-map.ts`. SSDI is disability-legal; corrected both to `/providers/best/legal` (same as `mva-leads`; legal vertical has 3 providers). Verified live: SSDI page CTA now resolves to `/providers/best/legal`.

<!-- added 2026-06-08 /brsg-session -->
- [x] **ALL 9 lead-type pages now have full content-depth passes** (2026-06-09) — every `/lead-types/*` page expanded from ~700 to ~2,600 words to match mortgage: each got 6 deep-dive H2 sections + 2 added best practices + 5-6 long-tail FAQs (site-wide FAQ count ~40→72). Verticals: mortgage (2026-06-08), insurance, home-services, final-expense, medicare, IUL, SSDI, MVA, solar. Each deep-dive is vertical-specific — e.g. home-services "neighborhood play" + cost-per-booked-estimate; final-expense persistency + door-knock economics; **medicare conservative CMS section** (permission-to-contact, Scope of Appointment, call recording, TPMO disclaimer); **SSDI + MVA legal-advertising/anti-solicitation** sections (no outcome guarantees, bar rules, contingency math); IUL suitability/illustration honesty; solar FTC savings-claim + Reg Z. Renders via generic `[slug]/page.tsx` (deepDive + static glossary linker). No fabricated stats (reused existing cost/conversion ranges; illustrative math labeled). Goal: Helpful Content / YMYL depth + long-tail FAQ-schema capture (traffic + CTR).
- [x] **Insurance-leads content-depth pass** (2026-06-08) — first vertical after mortgage; cross-sell multiplier + cost-per-bound-policy math. (Now part of the full 9-vertical pass above.)
- [x] **Removed dead OPENAI_API_KEY from .env.example** (2026-06-08) — zero code references; site uses ANTHROPIC_API_KEY. Confirmed not used.
- [x] **Glossary internal-linking — static path + crawlable** (2026-06-08) — (1) lead-type CMS body passes `glossary` to `PortableText` (wired but dormant; no lead-type has a CMS body yet); (2) new static-path linker (`components/glossary-static.tsx`) auto-links the 77-term glossary in lead-type static content (`data/lead-types.ts`) including the deep-dive sections; (3) **fixed a site-wide SEO gap** — `GlossaryTooltip` only rendered its `/glossary/` link inside the hover popup (not in SSR HTML, so uncrawlable); the inline term is now an always-rendered `<a href="/glossary/…">`, making every glossary mention a real internal link across blog, playbook, and lead-type pages.
- [x] **Mortgage-leads content-depth pass** (2026-06-08) — `/lead-types/mortgage-leads` expanded ~700 → ~2,600 words: 6 deep-dive H2 sections, 5 new long-tail FAQs (FAQ schema auto-extends), 2 best practices. Addresses Helpful Content / YMYL thin-content risk.
- [x] **Provider-count overclaim fix** (2026-06-08) — homepage stat and affiliate-disclosure said "50+ providers reviewed" but the directory has 15 (`data/providers.ts`) and `/providers` says "15+". Corrected both to "15+".

- [x] **Privacy Policy page** (`/privacy`) — legal requirement, trust signal
- [x] **Terms of Service page** (`/terms`) — legal requirement
- [x] **Affiliate Disclosure page** (`/affiliate-disclosure`) — standalone FTC-compliant route
- [x] **Editorial Process page** (`/editorial-process`) — E-E-A-T trust page, linked from article footer
- [x] **Breadcrumbs component** — reusable visual breadcrumb nav, deployed on blog posts
- [x] **ScrollProgressBar component** — thin progress bar on article pages showing read progress
- [x] **IndexNow integration** — API key hosted, utility created, fires on content publish
- [x] **Footer legal links** — Privacy, Terms, Affiliate Disclosure, Editorial Process added
- [x] **Sitemap updated** — new pages included with correct priorities
- [x] **Glossary Tooltip Integration** (2026-04-08) — auto-links first occurrence of 77 glossary terms in blog + playbook articles with hover tooltips
- [x] **Blog Category Hub Pages** (2026-04-08) — `/blog/category/[slug]` with filtered posts, breadcrumbs, JSON-LD, sitemap
- [x] **Contact Page** (2026-04-08) — `/contact` with Resend-powered form, added to footer + sitemap
- [x] **StickyTOC** (2026-04-08) — floating desktop sidebar with IntersectionObserver active-section highlighting, h2 IDs on all articles
- [x] **KeyTakeawayBox** (2026-04-08) — TL;DR summary card from excerpt, deployed on blog + playbook pages
- [x] **ContentCheckpoint** (2026-04-08) — stat callout cards interleaved with mid-article CTAs in PortableText
- [x] **NextReadBar** (2026-04-08) — sticky bottom bar at 60% scroll with related article, dismissible
- [x] **ExpandableDeepDive** (2026-04-08) — styled details/summary component
- [x] **Statistics/Data Page** (2026-04-08) — `/blog/aged-lead-industry-statistics` link-magnet with pricing tables, provider landscape, lead economics, Cite This buttons, Dataset JSON-LD

- [x] **Breadcrumbs on all sub-pages** (2026-04-08) — Breadcrumbs component with dark variant, deployed on playbooks, lead-types, guides, glossary, providers, and all 5 calculator pages
- [x] **Speakable Schema** (2026-04-08) — SpeakableSpecification in Article JSON-LD targeting key-takeaway-box and first paragraph after H2s
- [x] **Answer-First Paragraphs** (2026-04-08) — Content cron prompt updated to generate 40-60 word direct answers after every H2
- [x] **Calculator Embed Codes** (2026-04-08) — Embed routes at /calculators/[name]/embed (no site chrome), EmbedCode component with copy-to-clipboard on all 5 calculator pages, UTM-tracked attribution links
- [x] **Article Credibility Enhancements** (2026-04-08) — CredibilityBadges component with updated date, "Human-reviewed" badge, "Reviewed by" line on blog + playbook pages
- [x] **CopyableStatCard + ShareableQuote** (2026-04-08) — Copyable stat cards with rich clipboard + attribution, shareable quotes with LinkedIn/X/copy buttons, deployed on statistics page
- [x] **Resources Hub Page** (2026-04-08) — `/resources` with all 5 lead magnet PDFs, email-gated downloads, calculator links, added to footer + sitemap
- [x] **Cite This on price-index + comparisons** (2026-04-08) — CiteThisButton deployed on price-index overview, vertical detail, and comparison pages
- [x] **Author Hub Page** (2026-04-08) — `/authors` with Bill Rice profile, article/playbook counts, credentials, LinkedIn link
- [x] **Reaction Buttons** (2026-04-08) — "Helpful / Surprising / Need More Detail" on blog + playbook pages, tracked via GTM events

---

## P1 — High Value Engagement & Traffic

### Homepage Social Proof & Trust Indicators — DONE 2026-06-09 (verified)
- [x] **Trust indicators** — `TrustStrip` in the hero shows real E-E-A-T signals (30+ yrs expertise, independent reviews, human-reviewed, transparent disclosure), each linking to the page that backs it.
- [x] **Positioning statement** — present in the hero.
- [n/a] **Subscriber count** — deliberately omitted. Real Resend audience is only **39** contacts (verified live); "Join 39" undercuts trust and we won't fabricate a bigger number. Revisit once the list is materially larger.
- [n/a] **Testimonial cards** — no real testimonials exist; won't fabricate. Add when genuine ones are collected.
- **Impact:** Conversion rate, trust, first-impression authority

---

## P1 — SEO & Visibility

<!-- added 2026-06-08 /brsg-session — cold-start diagnosis: Ahrefs DR 2.5, ~0 backlinks, 1 organic keyword, ~2 organic visits/mo. Site is fully indexed (30+ pages) but does not rank. Ceiling is authority + content depth, not technical SEO. SEO audit score 78/100 (2026-06-03). -->

<!-- Authority / backlink campaign removed 2026-06-09 — tracked as offline work (digital PR, HARO, partnerships), not a repo task. -->

### /website-audit 2026-06-13 — fresh GSC/GA4 findings <!-- added 2026-06-13 /website-audit -->
Site is healthy and the on-page work is largely done (FAQPage schema present, data-led internal-linking pass shipped 2026-06-09, AEO clusters live, thin pages noindexed). 28d snapshot: GA4 597 sessions (+36%), **15 key events / 1.01% conv**, GSC 43 clicks, impressions **+252% to 5,730**, avg pos 32.4, DR 2.5. The remaining levers are position (a cluster of money pages just off page 1) and the two things converting best (AI assistants + the pipeline calculator). Concrete, fresh-data items:
- [ ] **Next internal-linking pass: target the off-page-1 cluster.** Highest-impression pages stuck at pos 12-38: **/providers** (454 impr, pos 18), **/blog** (392 impr, pos 12), **/lead-types/insurance-leads** (378 impr, pos 33), **/lead-types/iul-leads** (145 impr, pos 24). Point more internal links (descriptive anchors) at these from high-traffic pages — same play as the 2026-06-09 pass, refreshed against this month's GSC.
- [ ] **Feature the pipeline calculator more prominently** — it converted **9 of 16 sessions** (`/calculators/pipeline-calculator`), by far the best on-site converter, but barely gets traffic. Surface it in nav/homepage + internal-link from the lead-type and playbook pages. <!-- 2026-06-19 confirmed: still the top converter (pipeline 9/15 key events = 6.7%, ROI calc 4.8%) and still under-fed by organic. Pair the placement work with calculator SEO: add `SoftwareApplication`/`HowTo` JSON-LD + target "aged lead ROI calculator"-type queries so the page also *earns* organic landings, not just receives internal traffic. -->
- [ ] **Lean harder into AEO** — the **AI-Assistant channel drove 10 of 15 key events** (ChatGPT). The comparison/provider content is exactly what assistants cite; keep expanding the `/compare/*` cluster and provider-directory depth. Biggest ROI front and doesn't need authority.
- [ ] **Attribution (config only — code already correct):** analytics already loads `afterInteractive`, so the 66% "Direct" is GA4/GTM-config + bots, not code. In GA4 Admin enable bot-traffic exclusion + review referral exclusions; confirm the GTM page_view tag isn't dropping `page_referrer`. Fleet-wide BRSG pattern (proinvestorhub shows it too) — worth fixing once at the template/container level.
- [ ] **Stretch:** push "aged lead store reviews" (already pos 8, page 1) toward top-3 / featured snippet — high-intent buyer query that already converts.

### /website-audit 2026-06-19 — refresh + new findings <!-- added 2026-06-19 /website-audit -->
Deep audit (live GA4 528489903 + GSC + PSI + Ahrefs). **28d snapshot (May 22 – Jun 18):** GA4 595 sessions (+8.4%), **43 key events / 2.18% conv** (tracking now firing, was 0); GSC **47 clicks / 6,725 impr (+198%) / 0.70% CTR / avg pos 32.1 (down from 25.4)**; PSI mobile 96–100 / desktop 100 (performance is **not** a lever); DR **3.3**, 164 referring domains. The four 2026-06-13 items above (internal-linking cluster, feature the pipeline calculator, lean into AEO, attribution config, push "aged lead store reviews") are **re-confirmed by this month's data and remain open — not re-listed here.** Report: `~/website-audits/agedleadsales.com-2026-06-19.html`. New, non-duplicate items, ordered by impact on the primary goals (traffic, then conversion):

**P0 — Defend authority (traffic is actively eroding)**
- [ ] **Refresh the disavow — the toxic-backlink attack is ongoing.** The profile is ~95% spam PBNs at DR 3.3, and **fresh spam landed *after* the 2026-05 disavow** (e.g. `rankyour.website` DR74 seen 2026-05-08, `linkrankboost.shop` 2026-05-13, `ranklinkpro.shop` 2026-05-15, plus a cluster of `*.shop` link farms). This correlates with avg position sliding **25.4 → 32.1** while impressions tripled. **Action:** pull current referring domains (Ahrefs), diff against the existing disavow, add the new spam domains, and Bill re-submits in GSC (URL-prefix property). Authority is the binding constraint on traffic — this stops the bleeding. *Effort: S (Bill submits).* <!-- 2026-06-29 /brsg-session: re-flagged — the ~monthly re-audit cadence makes this DUE ~2026-07-06 (≈1 week out, per project memory). Latest rolling-7d GSC (2026-06-25): 14 clk / 2,267 impr / 0.62% CTR / avg pos 32.3 — position still eroding, so the diff-and-resubmit above is the next concrete step. --> <!-- 2026-07-03 /brsg-session: DIFF DONE. Pulled 249 live referring domains (Ahrefs), diffed vs the 146 disavowed + 4-domain whitelist → 106 new un-disavowed. Added **104** to `data/backlink-audit/disavow.txt` (now 250 domains): 101 Ahrefs-spam-flagged (new `outrank-hq`/`rank-forge`/`link-baron` PBN clusters + `.shop` link farms) + a 3-domain content-mirror cluster (`mav.website`/`rocketq.link`/`rquote.link` all duplicating one editorial post). KEPT 2 genuine editorial links (NOT disavowed): **hiremav.com** (DR 28, Mav recruiting-AI blog citing the ALS founder) and **startkadence.com** (unique substantive posts w/ contextual anchors). File ready for Bill to upload in GSC → then this item closes. --> <!-- 2026-07-21 /brsg-session: REFRESHED AGAIN — the 2026-07-03 file was never uploaded and went stale. Ahrefs refdomains history confirms the attack is **still running**: 252 (2026-06-29) → **292 (2026-07-20)**, and **all 70 newest referring domains are spam** (100% of the new cohort). Diffed → **41** not-yet-disavowed, all unambiguous link-farm spam (`.store`/`.shop`/`.site` SEO-jargon naming; `outrank-hq`, `link-baron`, `seoexpress` clusters) — **zero judgment calls in this batch**. `data/backlink-audit/disavow.txt` now **291 domains**. Branch rebased onto main. Still blocked on Bill's GSC upload. -->

- [ ] **Make the disavow a recurring task + detection.** Stand up a monthly job that snapshots referring domains and flags new ones matching the spam pattern (`*.shop`/`*.site`/`buybacklinks`/`seoexpress`-style farms) so additions are caught in weeks, not at the next audit. Extend the existing `data/gsc-trend.json` persistence to also record DR + refdomain count for an attack tripwire. *Effort: M.* <!-- 2026-07-03: DETECTION HALF SHIPPED. The `gsc-trend` persistence + tripwire is now a dedicated daily cron (`app/api/cron/gsc-trend`, 12:00 UTC, commits `data/gsc-trend.json`) with a **health-check staleness monitor** (2-day threshold) — closes the observability gap that let the June WIF break freeze the trend silently for 4 days. STILL OPEN: the *referring-domains* snapshot + spam-pattern auto-flag (this refresh was still a manual Ahrefs pull) and recording DR/refdomain count into the tripwire. --> <!-- 2026-07-21 /brsg-session: PRIORITY UP — promote to P0-adjacent. The 18 days between the 07-03 and 07-21 refreshes accrued **41 new spam domains with nothing watching**, which is exactly the failure this item exists to prevent. The auto-flag is also now trivially cheap: the new cohort is 100% machine-classifiable on naming alone — TLD in {.store,.shop,.site,.website,.link} plus SEO-jargon tokens (`link-`, `backlink`, `seo`, `rank`, `outrank-hq`, `link-baron`, `niche-edit`, `do-follow`, `serp-boost`). A weekly Ahrefs refdomains pull + regex flag + append-to-disavow would have caught all 41 automatically. *Effort: S-M now, not M.* -->

**P1 — Net-new rankable + AEO surface (traffic, no authority needed)**
- [ ] **Build the missing lead-type guides: `health-insurance`, `debt-settlement`, `mca-business-loans`.** Price data + providers already exist for these but there's no `/lead-types/*` depth page, so the demand is uncaptured. Same ~2,600-word deep-dive + FAQ-schema template as the existing 9 (note `mca-business-loans` is business-purpose/RESPA-exempt — keep the consumer/business framing separate). Net-new commercial pages on existing data. *Effort: M.*
- [ ] **Next `/compare/*` AEO wave + "definitive answer" hubs.** AI Assistants are the best-converting channel per session (22 sessions → 10 key events); the `/compare/*` and answer-hub format is exactly what they cite. Build the next high-intent comparisons (`final-expense-vs-term-life`, `medicare-vs-aca`, per-vertical real-time-vs-aged) on the existing `components/comparison-page.tsx`, plus citeable answer hubs for the head questions ("are aged leads worth it", "how old is too old", "best aged lead providers"). *Effort: M.* (Extends the open "lean into AEO" item with concrete deliverables.)

**P2 — AEO hygiene, measurement, and long-tail (compounding)**
- [ ] **AEO hygiene: add `llms.txt` + audit answer-snippet/speakable coverage.** Confirm each answer-first H2 returns a clean 40–60-word extract and that `speakable` JSON-LD covers the key blocks across blog/lead-type/compare. Cheap, helps the converting channel. *Effort: S.*
- [ ] **Brand-entity reinforcement (distinct from the Wikidata entry below).** Strengthen `Organization` schema `sameAs` links + consistent NAP/entity signals so Google and assistants resolve "Aged Lead Sales" as a known entity — aids AI citation and the brand SERP. *Effort: S.*
- [ ] **Long-tail vertical answer posts for the pos 50–90 queries** surfacing real impressions: "accident leads" (37 impr, pos 54), "burial insurance leads" (pos 65), "final expense leads" (pos 56), annuity/AEP-Medicare-enrollment terms. Staggered cadence per the content rule. Feeds both organic and AEO. *Effort: M.*
- [ ] **Key-event tracking audit + AI-referral segmentation.** Conversion tracking only just started firing (0 → 43 key events) — verify *which* events are wired (calculator completion, playbook download, email signup, the agedleadstore.com outbound = the money conversion) and that none are missing. Then segment AI referrers to explain the gap (chatgpt.com 16 sessions → **0** key events vs copilot.com 6 → **10**); land each AI source on its best-matching answer page. *Effort: M.* Prereq: the open attribution-config fix (line above) so the data is trustworthy.
- [ ] **Track AEO share-of-voice (Ahrefs Brand Radar)** to measure brand mentions in AI answers over time, not just referral sessions — so the AEO investment has a leading indicator. *Effort: S.*

### Content depth for Helpful Content / Dec-2024 Core Update
Audit's #1 high finding: thin affiliate content is demoted post-update.
- [x] **Lead-type pages — DONE 2026-06-09.** All 9 `/lead-types/*` pages expanded to ~2,600 words with deep-dive sections, vertical-specific compliance, and long-tail FAQs.
- [x] **Flagship playbook pages — DONE 2026-06-09.** All 3 `/playbook/{mortgage,insurance,home-services}` conversion landing pages got a below-the-fold SEO depth pass: 4 deep-dive sections each (operator/"build-a-system" intent — deliberately distinct from the lead-types buyer intent to avoid cannibalization), FAQs 3→7, crawlable glossary links, **added the previously-missing FAQ JSON-LD** (CTR rich results), and a second signup form at the bottom so deep-scrollers convert. Hero + form above the fold untouched (conversion preserved). Edited `data/flagship-verticals.ts` + the page component only — NOT `content/flagship-magnet/` markdown, so PDFs are unaffected (flagship:check shows a worktree-mtime false positive; no PDF source changed).
- [ ] **Stretch:** push the highest-impression lead-type pages from ~2,600 to 3,000+ words with original data/visuals once GSC shows which earn impressions.
- **Impact:** Ranking eligibility + YMYL trust.

### YMYL author-expertise demonstration — DONE 2026-06-09 (verified)
`/about/bill-rice` is already a strong E-E-A-T page: 30+ years, detailed verifiable career (AFOSI special agent → DeepGreen Bank employee #7 → Quicken Loans COO/VP → founder of Kaleidico/BRSG/Verified Vector), `personPageJsonLd` Person schema, and it's linked from the homepage TrustStrip. Articles carry a "Human-reviewed / Reviewed by Bill Rice" credibility line. Considered sufficient for YMYL; optional micro-win later = make the article byline link to the author page.
- **Impact:** YMYL ranking trust.

### FTC affiliate-disclosure prominence — DONE 2026-06-09
Sitewide disclosure already renders above the footer on every page, but it wasn't adjacent to the affiliate CTAs. Added an inline FTC micro-disclosure inside `CtaBanner` (both default + compact variants, affiliate mode only) — "Affiliate link — we may earn a commission at no cost to you, and it never affects our ratings," linking to `/affiliate-disclosure`. `CtaBanner` is the primary affiliate CTA across blog/playbook/lead-type pages, so the disclosure is now clear-and-conspicuous right at the action on every content page.
- **Impact:** Compliance + trust signal.

### Entity SEO — Wikidata Entry (OFFLINE / manual)
Create/claim a Wikidata entry for "Aged Lead Sales" with proper classification. Entity-recognized brands see more AI-sourced traffic. **Note:** like the backlink campaign, this is a manual off-site task, not a repo change — tracked here but executed externally.
- **Impact:** Knowledge graph, AI citation

---

## P2 — Engagement & Retention

### Save for Later (Email-Gated)
Bookmark icon on articles that prompts for email to save to reading list.
- Weekly digest of saved + recommended articles
- **Impact:** Lead capture, return visits, email list growth

### Content Series with Email Drip
Structure cornerstone content as 3-5 part series. Gate parts 2+ behind email. Each drip drives a return visit.
- **Impact:** Email list growth, return visits, Google quality signal

---

## P2 — Information Architecture

### Add `homeowners-insurance` vertical to taxonomy — DONE 2026-06-09
- [x] New `VERTICALS` entry (tier 1, order 8, 🏡, benchmarkDefaults consistent with the other personal lines).
- [x] Provider audit done via live-site verification (not guessed): added `homeowners-insurance` to the **6** providers confirmed to sell it — Aged Lead Store, iLeads, DataToLeads, Aged Leads Depot, QuoteWizard, SmartFinancial. The Leads Warehouse, Badass Insurance Leads, and Brokers Data verified as NOT selling it (excluded); LeadsData unverifiable (excluded — no assumption).
- [x] `/providers/best/homeowners-insurance` auto-generates (page builds from VERTICALS) with the 6 providers sorted by rating. Price-index handles it like the existing data-less `long-term-care` vertical (overview card shows "Benchmark data coming soon"; `getDecayProfile` falls back to DEFAULT_PROFILE — verified `long-term-care` renders 200 live, same path).
- Note: this is a **vertical** (provider categorization), distinct from the 9 `/lead-types/*` content pages. A dedicated `/lead-types/homeowners-insurance` depth page is a separate, optional follow-up.
- **Impact:** Completeness of provider directory; a major insurance category was previously uncounted.

### Cross-provider vertical audit — automated pass attempted 2026-06-09, NOT applied
An automated live-site audit of the other 14 providers was run but found **too unreliable to apply**: it produced false removals from failed/encoding-broken scrapes (e.g., DataToLeads → "remove 9 verticals" when the page simply didn't render; we'd separately verified DataToLeads sells homeowners) and false additions from weak keyword/imagery inference (e.g., SmartFinancial "+solar/+mortgage/+legal" inferred from a stock image and the sentence "mortgage lenders require homeowners insurance"; QuoteWizard "+mortgage" from a licensing footer). Curated `lastVerified`-dated data was left untouched — per no-fabrication, not overwritten with low-quality scrape inferences. **Needs deliberate per-provider human verification** (the homeowners-insurance add was done that way and is trustworthy). The only concretely-evidenced automated finding worth a manual re-check: Aged Leads Depot may also sell medicare + health (explicit `/aged-medicare-leads`, `/aged-health-insurance-leads` pages).

### Additional Lead Magnets
Only 1 active lead magnet (prospecting checklist). Playbook says 1-2 per site minimum:
- ROI analysis template (PDF)
- Aged lead scripts bundle
- Vertical-specific buying guides
- See [project_als_lead_magnets.md] for planned items

---

## Done — data-led internal linking (2026-06-09)

### Internal-linking pass (driven by GSC/GA4 analysis) — DONE 2026-06-09
Analyzed the GSC export (3 mo: 8,551 impr, 44 clicks, avg pos ~28) + GA4. Finding: high-demand commercial pages (`/lead-types/*`, `/providers/best/*`) rank deep (pos 30–58) while the best-ranking page type (provider profiles, pos ~11) didn't link to them. Built a bidirectional internal-link cluster per vertical: **lead-type guide ↔ price index ↔ best providers ↔ provider profile.**
- [x] `data/lead-type-vertical-map.ts` — single curated source of truth for the lead-type ↔ vertical relationship (both directions hand-curated to avoid mislinks). **Bug fixed:** `home-services-leads` had no mapping → fell back to `home-services` (not a real vertical) → broken `/price-index/home-services` + `/providers/best/home-services` links on that page. Now correctly → `home-improvement` (verified live).
- [x] `components/related-links.tsx` — reusable crawlable cross-link grid (SSR, deduped).
- [x] Provider profiles → link to lead-type guides + best-in-vertical for the verticals they serve (funnels equity from the best-ranking pages to the deep-ranking high-demand pages).
- [x] `providers/best/[vertical]` + `price-index/[vertical]` → link to their sibling cluster pages + the stats page. Also fixed a stray "Updated monthly" → "Verified quarterly" on providers/best.
- **Bottleneck noted:** rankings are page 2–6 because the site is young/low-authority; the biggest remaining lever (backlinks) is Bill's offline track. AI-assistant traffic is real (ChatGPT = 3rd-biggest source in GA4), which the data-study assets feed.

## P2 — Technical & Accuracy

<!-- added 2026-06-08 /brsg-session -->

### Product / Review schema on provider pages — DONE 2026-06-09
~~15 provider review pages lack Product + Review JSON-LD — missing rich-result eligibility (stars in SERP).~~ The pages emitted `Organization` + `AggregateRating` (ratingCount: 1), which Google does NOT grant review-star snippets for (and a single-count aggregate is an anti-pattern). Replaced with a proper **`Product` reviewed by Aged Lead Sales** carrying our editorial star rating (`Review` + `reviewRating`, bestRating 10) — legitimate third-party (non-self-serving) review schema, the structure eligible for star rich results. Identity `Organization` node retained without the rating. The 1 provider with a canonical blog review (`aged-lead-store` → `aged-lead-store-review-2026`) had its rating schema dropped on the profile but the article never actually emitted Review schema — fixed by attaching the Product/Review to the blog article via `reviewArticleSlug` lookup, so all 15 providers now have star schema on their canonical URL.
- **Impact:** SERP CTR via rich results.

### Provider-count overclaims — DONE 2026-06-09
- [x] Homepage/site root meta+OG description said "Compare **50+** lead providers" — this lived in code (`app/(site)/layout.tsx:31`, NOT Sanity; the dataset has no siteSettings/homepage doc type) → changed to "15+".
- [x] `/price-index` "Our team researches **50+** lead providers monthly" → reframed to "researches the aged-lead provider market monthly" (removed the unverified count rather than swapping a new number, to avoid any overclaim).
- **Impact:** Credibility / no-overclaim.

### Price index repositioned as a quarterly verified study — DONE 2026-06-09
Bill's call after the data-integrity dig below: the Lead Price Index is now framed as a **quarterly human-verified study**, not a live monthly AI-estimated feed — matches what the data supports and makes it a stronger citable/link asset.
- [x] All "monthly" / "Updated <Month>" copy → "quarterly verified" / "Verified Q# YYYY" (new `quarterLabel()` helper, derived from latest reliable month) across `/price-index`, `/price-index/[vertical]`, `/methodology`, statistics page. Dataset JSON-LD + meta + citations updated.
- [x] Methodology now states benchmarks are human-reviewed, never auto-generated; AI only flags changes for verification between cycles.
- [x] **Removed the AI-estimate dependency at the source:** marketwatch cron no longer synthesizes/publishes benchmark estimates — it now only monitors provider sites for pricing changes, flags "pricing signals to verify" for a human, stamps lastVerified, and emails the team. Benchmarks remain human-curated; display-side trustworthy gate stays as a backstop.
- **Maintenance:** each quarter, a human verifies pricing and updates benchmark data (Sanity or `data/price-benchmarks.ts`); the "Verified Q#" stamp advances automatically from the latest reliable month.

### Price-index data integrity — single-provider cron junk — DONE 2026-06-09
The marketwatch cron (`app/api/cron/marketwatch` → `lib/cron/marketwatch-ai.ts`) **LLM-synthesizes** monthly benchmarks from scraped provider sites and was publishing single-provider, low-confidence estimates that collapsed to meaningless flat ranges (auto-insurance aged rendered a literal **"$1 – $1"**; mca real-time produced a $150–$2,500 / median $1,325 one-provider guess). Because the index read only the latest month with no quality bar, that junk overwrote the real multi-provider March/April data in the public cards and produced fake "trends" driven by sampling noise.
- [x] `isTrustworthyBenchmark` (≥2 providers sampled) in `data/price-benchmarks.ts`. Single-provider rows stay in Sanity but never surface as headline pricing or trend points.
- [x] `/price-index` now pulls every tracked month (`recentStaticShapedBenchmarksQuery`) and shows each vertical's latest *reliable* benchmark (auto aged now reads the real **$0.25 – $0.50**); freshness date = latest reliable month.
- [x] `/price-index/[vertical]` filters to reliable benchmarks before the gap-fill model, tables, "last updated", and trend chart consume them. Trend chart now renders only where 3+ multi-provider months exist (**mca only** — flat $0.03 data-list, legit); auto/life noise lines correctly suppressed.
- [x] Publish-side guard in `lib/cron/marketwatch-publish.ts` drops sub-2-provider estimates at the source so the junk never gets written again.
- **NOTE / open:** existing single-provider rows (2026-05/06) remain in Sanity, filtered from display. The deeper question — whether an LLM-estimated "monthly index" is the right product vs. a periodic human-verified benchmark study — is a positioning call for Bill. **Impact:** Credibility, no-fabrication, honest trends (#1 traffic/CTR asset).

### Empty pricing comparison table on statistics page — DONE 2026-06-09
- [x] `getPricingDistributionStats` (`lib/statistics.ts`) filtered aged benchmarks on `"31-85 days"` (space) vs the data's `"31-85-days"` (hyphens) → aged column always empty → the flagship **"Real-Time vs. Aged Leads by Vertical"** table on `/blog/aged-lead-industry-statistics` rendered **zero rows**. Fixed; table now populates all 10 verticals (real-time, aged, savings %). **Impact:** flagship statistics page (key linkable/SEO asset) was silently broken.

### Stat-card value overflow — DONE 2026-06-09
- [x] `CopyableStatCard` long values ("$225-$5,000") overflowed the card at the `lg` 4-column layout (`text-3xl`). Held at `text-2xl` + `tabular-nums` + `break-words` so the value stays on one clean line. **Impact:** visible UI breakage on the statistics page.

### Featured images on 2 recent posts — DONE 2026-06-09
Two posts lacked `mainImage` (`life-insurance-aged-lead-roi`, `smart-agents-buy-aged-leads-instead-facebook-ads`) — now 71/71 posts have one. Generated via the existing `scripts/generate-featured-images.mjs` (Unsplash photo, scored for real people in a professional setting, + brand-blue gradient/title overlay → uploaded to Sanity → patched `mainImage`), keeping them visually consistent with the other 69. Sanity-only change; blog renders on-demand so it went live with no redeploy. Verified: hero `<img>` + og:image + twitter:image on both.

### Migrate in-repo crons to central automation
6 crons still live in `app/api/cron/*` (seo-audit, marketwatch, daily-performance, health-check, weekly-content, weekly-newsletter). Per brsg-website-automation, crons are migrating OUT of site repos to the central system. Remove once the central system covers this site.
- **Impact:** Tech-debt / single-source automation.

### Clean up 27 orphaned `seo-draft` PRs (#3–#36) <!-- added 2026-07-03 /brsg-session -->
27 open draft PRs on `seo-draft/*` branches (#3–#36) left by an earlier content-automation routine that opened a PR per draft but never merged/closed them. They clutter the PR list and obscure real review items (this session's PR #40 was buried among them). **Action:** triage — a draft still worth publishing gets folded into the editorial pipeline; the rest get closed + branches deleted. Likely bulk-closable (`gh pr close` + `git push --delete`) after a quick scan confirms none carry unshipped content Bill wants. *Effort: S.*
- **Impact:** Repo hygiene; unblocks legible PR review.
- [x] **DONE 2026-07-21 /brsg-session.** All 27 closed; **0 open PRs** remain. Branches left in place so nothing is lost. Confirmed superseded: 20 targeted "aged life insurance leads" and 7 targeted "aged final expense leads" — the routine re-picked the same two keywords for three months, and each PR wrote to a *different* directory convention (`content/drafts-<date>/`, `content/drafts/<date>-<slug>.md`, `content/drafts/<slug>/draft.md`) so they never collided. Both topics already covered by published posts. **#3 was the exception** — it also carried `lib/cron/model-config.ts`, and that idea was right: see the new P1 note below.

---

## P1 — Reliability (added 2026-07-21 /brsg-session)

- [x] **Dead Anthropic model IDs in four cron modules — FIXED (`8100c18`).** `claude-sonnet-4-20250514` retired 2026-06-15 and started 404ing every run. `marketwatch-ai.ts` was fixed at the time; `ai-content.ts` (×2), `newsletter-ai.ts`, `seo-audit.ts` (×2) and `performance-ai.ts` were missed and still pointed at the dead ID **over a month later**. Nothing was failing in production only because none of those four routes (`weekly-content`, `weekly-newsletter`, `seo-audit`, `daily-performance`) are scheduled in `vercel.json` — re-enable any one and it 404s. `lib/cron/model-config.ts` is now the single source of truth with env-var overrides. Salvaged from abandoned PR #3.
- [ ] **The weekly-content routine still has no dedupe gate.** Root cause of the 27-PR pile-up: it re-picked "aged life insurance leads" 20 times and "aged final expense leads" 7 times across three months without noticing. The route is currently unscheduled so this is latent, **but do not re-enable `weekly-content` until a dedupe gate exists** — check both published Sanity slugs *and* open PR titles before drafting. Also collapse the three competing `content/drafts*` path conventions into one. *Effort: M.* <!-- added 2026-07-21 /brsg-session -->

---

## P3 — Future Growth

### Multi-Step Lead Qualification Quiz
Survey-style funnel: lead type, volume, experience, budget, email. Outputs personalized provider recommendation. Deferred until traffic supports monetization (10K+ uniques/month).
- **Impact:** Primary conversion mechanism, lead capture, qualification data

### Programmatic Geo Pages
`/lead-types/[type]/[state]` style pages adding hundreds of rankable pages.
- Only with real local data (state regulations, market pricing, local providers)
- Minimum 3 unique data dimensions per page

### Original Data Visualizations
- [x] **Price trend charts on price-index pages — DONE 2026-06-09.** Zero-dependency, server-rendered SVG (`components/price-trend-chart.tsx`, crawlable, no client JS). Plots the median aged-lead price + low/high range band across tracked months, picking the best-covered single aged series per vertical (no mixed denominators), 0-baseline, observed data only (no interpolation/model-fills), and only renders with 3+ real months. Live on auto-insurance, life-insurance, mca-business-loans now; more appear as the marketwatch cron accumulates months. Makes the price-index a more linkable data-study asset.
- [x] **Vertical comparison visualization — DONE 2026-06-09.** `components/vertical-savings-chart.tsx` on `/price-index`: horizontal bars ranking verticals by how much cheaper aged is vs real-time (savings %), each bar labeled with the underlying real-time → aged medians so the % is auditable. Rows computed from the same reliable benchmarks the cards show (chart and cards never disagree). Live: Auto 99% → Legal 82%.
- [x] **Provider rating radar charts — DONE 2026-06-09.** `components/provider-rating-radar.tsx` on `/providers/[slug]`: 6-axis radar (transparency, value, compliance, flexibility, platform, reputation) on a fixed 0-10 scale, shown beside the existing rating bars.
- (Charts are SSR SVG by design — no Recharts/client dep needed; honest by construction with full-range axes + role=img aria-labels.)

### Video Content (YouTube)
60-90 second summary videos for key articles, published to YouTube with `VideoObject` schema on the blog post. Google Discover prioritizes video.

### Web Push Notifications
Prompt only after 2+ page views. Use for genuinely valuable triggers (new tool, major data update). 5-15% opt-in when timed correctly.

### Embeddable Charts/Infographics
Beyond calculator embeds — create embeddable data visualizations with attribution links for price benchmarks and market data.

### Digital PR / Source of Sources Profile
Set up profiles on Source of Sources, Featured.com, QWOTED for expert quote opportunities and editorial backlinks.

### Cross-Platform Distribution
- Share every article on X with a strong hook
- LinkedIn carousels repurposing article data
- Repurpose calculator results into shareable social content

---

## Editorial / Content — from the Aged Leads Insights email-program audit (2026-06-13)

Audited the email program (welcome + AI + replenishment series) against the live site. The editorial calendar is already deep, so only the **genuine gaps** were added as `status: "brief"` items in `data/editorial-calendar.ts` (weeks 13–14) — ready for a writing session:

- [ ] **Call Recording Consent by State** (Compliance) — the consent-law map + universal-safe disclosure; pairs with the email's record-every-call lesson (existing call-recording-analysis post is about *analysis*, not consent).
- [ ] **The Aged-Lead Sales Stack <$100/mo** (Metrics) — software recommender (Workspace + dialer + CRM + drip + recording + scheduling); `/providers` covers lead sellers, not tools. **Affiliate-monetizable.**
- [ ] **Put Your CRM on Autopilot: AI Agents + MCP** (Metrics) — the 2026 auto-documentation angle the existing crm-setup/ai-lead-scoring posts predate.
- [ ] **Scheduling Links That Book + Capture Consent** (Channel Tactics) — booking links as a consent-capture mechanism.
- [ ] **AI Guardrails for Aged-Lead Agents** (Compliance) — the responsible-AI companion to the prompts content.
- [ ] **FLAG — revise existing Week-9 brief** `aged-lead-text-sms-strategies`: it leans pro-SMS, which **conflicts** with the program's stance (don't text non-consent purchased data; earn consent first). Re-angle it around earning consent, or retire it. **Bill's call.**
- Full reasoning: `~/Documents/agedleadstore/agedleadsales-integration-audit.html`.

## Notes

- Audit reference: `_shared-docs/lead-gen-patterns.md` (Sections 1-18)
- Monetization: No display ads or premium features until 10K uniques/month
- Content cadence: 3 articles/week via automated cron, staggered publication dates
- All cron jobs run on Vercel, never locally
