# AgedLeadSales.com Backlog

> Prioritized backlog of features, enhancements, and fixes. Audited against [lead-gen-patterns.md](../_shared-docs/lead-gen-patterns.md) on 2026-04-04.
>
> **Priority levels:** P0 = critical gap, P1 = high value, P2 = important, P3 = future growth

---

## Done

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

### Entity SEO — Wikidata Entry
Create/claim a Wikidata entry for "Aged Lead Sales" with proper classification. Entity-recognized brands see 3.4x more AI-sourced traffic.
- **Impact:** Knowledge graph, AI citation

---

## P2 — Engagement & Retention

### Reaction Buttons
Lightweight engagement at article bottom: "Helpful / Surprising / Need More Detail"
- Zero moderation required
- Track as GTM events
- Feed into content quality scoring
- **Impact:** Engagement signal, content feedback loop

### Save for Later (Email-Gated)
Bookmark icon on articles that prompts for email to save to reading list.
- Weekly digest of saved + recommended articles
- **Impact:** Lead capture, return visits, email list growth

### Content Series with Email Drip
Structure cornerstone content as 3-5 part series. Gate parts 2+ behind email. Each drip drives a return visit.
- **Impact:** Email list growth, return visits, Google quality signal

### "Cite This" Blocks
On price-index pages, provider comparisons, and statistics content — pre-formatted citation HTML with copy button.
- **Impact:** Passive backlinks from content writers

---

## P2 — Information Architecture

### Author Hub Page (`/authors`)
Currently `/about/bill-rice` exists. Create `/authors` as a hub for future contributors, and ensure the author page has: list of all articles, LinkedIn link, and all credentials.

### Additional Lead Magnets
Only 1 active lead magnet (prospecting checklist). Playbook says 1-2 per site minimum:
- ROI analysis template (PDF)
- Aged lead scripts bundle
- Vertical-specific buying guides
- See [project_als_lead_magnets.md] for planned items

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
