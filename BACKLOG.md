# AgedLeadSales.com Backlog

> Prioritized backlog of features, enhancements, and fixes. Audited against [lead-gen-patterns.md](../_shared-docs/lead-gen-patterns.md) on 2026-04-04.
>
> **Priority levels:** P0 = critical gap, P1 = high value, P2 = important, P3 = future growth

---

## Done

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

### Homepage Social Proof & Trust Indicators
Homepage has stat cards but is missing:
- [ ] Subscriber count near newsletter CTA: "Join X sales professionals"
- [ ] Trust badges or credential indicators
- [ ] Clear positioning statement per the playbook formula
- [ ] Testimonial cards (when available)
- **Impact:** Conversion rate, trust, first-impression authority

---

## P1 — SEO & Visibility

<!-- added 2026-06-08 /brsg-session — cold-start diagnosis: Ahrefs DR 2.5, ~0 backlinks, 1 organic keyword, ~2 organic visits/mo. Site is fully indexed (30+ pages) but does not rank. Ceiling is authority + content depth, not technical SEO. SEO audit score 78/100 (2026-06-03). -->

### Authority / backlink campaign (the real ranking ceiling)
DR is **2.5** with near-zero referring domains — this caps every page regardless of on-page quality. Needs an off-site campaign: digital PR, guest posts, data-study link bait (the price-index is a natural asset), HARO/Source-of-Sources, partnerships. Off-site, multi-week — not a single session.
- **Impact:** Unlocks ranking ability sitewide. Highest ceiling, slowest payoff.

### Content depth for Helpful Content / Dec-2024 Core Update
Audit's #1 high finding: thin affiliate content is demoted post-update.
- [x] **Lead-type pages — DONE 2026-06-09.** All 9 `/lead-types/*` pages expanded to ~2,600 words with deep-dive sections, vertical-specific compliance, and long-tail FAQs.
- [x] **Flagship playbook pages — DONE 2026-06-09.** All 3 `/playbook/{mortgage,insurance,home-services}` conversion landing pages got a below-the-fold SEO depth pass: 4 deep-dive sections each (operator/"build-a-system" intent — deliberately distinct from the lead-types buyer intent to avoid cannibalization), FAQs 3→7, crawlable glossary links, **added the previously-missing FAQ JSON-LD** (CTR rich results), and a second signup form at the bottom so deep-scrollers convert. Hero + form above the fold untouched (conversion preserved). Edited `data/flagship-verticals.ts` + the page component only — NOT `content/flagship-magnet/` markdown, so PDFs are unaffected (flagship:check shows a worktree-mtime false positive; no PDF source changed).
- [ ] **Stretch:** push the highest-impression lead-type pages from ~2,600 to 3,000+ words with original data/visuals once GSC shows which earn impressions.
- **Impact:** Ranking eligibility + YMYL trust.

### YMYL author-expertise demonstration
Strengthen Bill Rice author profile (verifiable industry experience, credentials) on author + about pages; financial-lead content is YMYL and needs stronger E-E-A-T signals.
- **Impact:** YMYL ranking trust.

### FTC affiliate-disclosure prominence
Audit flags the site-wide disclosure may not meet "clear and conspicuous" 2024 FTC standards. Make per-page disclosure more prominent near affiliate CTAs.
- **Impact:** Compliance + trust signal.

### Entity SEO — Wikidata Entry
Create/claim a Wikidata entry for "Aged Lead Sales" with proper classification. Entity-recognized brands see 3.4x more AI-sourced traffic.
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

### Add `homeowners-insurance` vertical to taxonomy
`data/verticals.ts` is missing a homeowners-insurance vertical. Aged Lead Store features "Home Insurance" as one of its 8 main aged-lead category cards; other multi-line insurance marketplaces likely sell it too. Adding it requires:
- New entry in `VERTICALS` with slug, icon, description, tier, order, and `benchmarkDefaults` (real-time + aged contact/close rates, avg deal value)
- Audit all 15 providers in `data/providers.ts` and add `homeowners-insurance` to whichever already sell it (start with aged-lead-store)
- Verify the new vertical surfaces correctly on `/providers/best/homeowners-insurance` and the lead-types index
- **Impact:** Completeness of provider directory; missing this vertical undercounts a major insurance category

### Cross-provider vertical audit
Aged Lead Store's verticals were corrected on 2026-05-20 after the original list overstated their offering (medicare, mca-business-loans, debt-settlement, auto-warranty all removed — they don't sell those). The other 14 providers in `data/providers.ts` likely have similar drift. A pass per provider against their live site (~5-10 min each) would tighten the directory's accuracy.

### Additional Lead Magnets
Only 1 active lead magnet (prospecting checklist). Playbook says 1-2 per site minimum:
- ROI analysis template (PDF)
- Aged lead scripts bundle
- Vertical-specific buying guides
- See [project_als_lead_magnets.md] for planned items

---

## P2 — Technical & Accuracy

<!-- added 2026-06-08 /brsg-session -->

### Product / Review schema on provider pages
15 provider review pages lack Product + Review JSON-LD — missing rich-result eligibility (stars in SERP). Reuse the existing `json-ld` component pattern.
- **Impact:** SERP CTR via rich results.

### Verify "researches 50+ lead providers monthly" claim (`/price-index`)
Left unchanged on 2026-06-08 because "researches monthly" is a broader process claim than the 15-provider directory — but confirm the real number so it isn't an overclaim. Align if needed.
- **Impact:** Credibility / no-overclaim.

### Featured images on 2 recent posts
Audit (2026-06-03) flags two recent blog posts missing featured images — engagement + OG-share signal.

### Migrate in-repo crons to central automation
6 crons still live in `app/api/cron/*` (seo-audit, marketwatch, daily-performance, health-check, weekly-content, weekly-newsletter). Per brsg-website-automation, crons are migrating OUT of site repos to the central system. Remove once the central system covers this site.
- **Impact:** Tech-debt / single-source automation.

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
One original chart per key article. Interactive with embed codes (Recharts).
- Price trend charts for price-index pages
- Vertical comparison visualizations
- Provider rating radar charts

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

## Notes

- Audit reference: `_shared-docs/lead-gen-patterns.md` (Sections 1-18)
- Monetization: No display ads or premium features until 10K uniques/month
- Content cadence: 3 articles/week via automated cron, staggered publication dates
- All cron jobs run on Vercel, never locally
