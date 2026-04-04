# AgedLeadSales.com Backlog

> Prioritized backlog of features, enhancements, and fixes. Audited against [lead-gen-patterns.md](../_shared-docs/lead-gen-patterns.md) on 2026-04-04.
>
> **Priority levels:** P0 = critical gap, P1 = high value, P2 = important, P3 = future growth

---

## Done (2026-04-04)

- [x] **Privacy Policy page** (`/privacy`) — legal requirement, trust signal
- [x] **Terms of Service page** (`/terms`) — legal requirement
- [x] **Affiliate Disclosure page** (`/affiliate-disclosure`) — standalone FTC-compliant route
- [x] **Editorial Process page** (`/editorial-process`) — E-E-A-T trust page, linked from article footer
- [x] **Breadcrumbs component** — reusable visual breadcrumb nav, deployed on blog posts
- [x] **ScrollProgressBar component** — thin progress bar on article pages showing read progress
- [x] **IndexNow integration** — API key hosted, utility created, fires on content publish
- [x] **Footer legal links** — Privacy, Terms, Affiliate Disclosure, Editorial Process added
- [x] **Sitemap updated** — new pages included with correct priorities

---

## P0 — Critical Gaps

### Glossary Tooltip Integration in Article Body
77 glossary terms exist but are not linked inline within blog post body text. The playbook requires: "First occurrence of a glossary term in any article gets a tooltip link."
- Build a `GlossaryTooltip` component (hover/tap shows definition)
- Integrate into the `PortableText` renderer as a custom mark or auto-detect
- Auto-link first occurrence of known terms in article body
- **Impact:** Internal linking, dwell time, user education, SEO

### Blog Category Hub Pages (`/blog/category/[slug]`)
Categories exist in Sanity schema and on posts, but no dedicated category pages exist.
- Create `/blog/category/[slug]` route with filtered post listing
- Add pagination and category description
- Link from blog index category badges
- Add to sitemap
- **Impact:** Topical authority, internal link equity, hub-and-spoke architecture

### Contact Page (`/contact`)
The playbook Trust Stack requires About + Contact + Editorial Independence. No contact page exists. For YMYL sites, "thin contact pages destroy credibility."
- Name, email, expected response time
- Optional lightweight contact form (Resend)
- **Impact:** E-E-A-T trust signal, YMYL compliance

---

## P1 — High Value Conversion & Engagement

### Multi-Step Lead Qualification Quiz
Zero multi-step forms exist. The playbook's primary lead funnel is survey-style, one-question-at-a-time.
- Step 1: "What type of leads are you looking for?" (lead type cards)
- Step 2: "How many leads do you need per month?" (volume qualifier)
- Step 3: "What's your experience with aged leads?" (skill level)
- Step 4: "What's your budget per lead?" (price qualifier)
- Step 5: Contact info (name, email) + newsletter subscribe
- Output: Personalized provider/resource recommendation
- **Impact:** Primary conversion mechanism, lead capture, qualification data

### Engagement Components (Dwell Time / NavBoost)
Section 14 of the playbook is entirely unimplemented:
- [ ] `StickyTOC` / `TableOfContents` — floating TOC highlighting current section on long articles
- [ ] `KeyTakeawayBox` — TL;DR summary card at top of long articles with "Read full analysis" anchor
- [ ] `ContentCheckpoint` — visual break elements (pull quote, stat card, callout) every 300-400 words
- [ ] `NextReadBar` — slim sticky bottom bar appearing at 60% scroll with ONE recommended next article
- [ ] `ExpandableDeepDive` — `<details>/<summary>` for advanced sub-topics within articles
- **Impact:** Time-on-page, scroll depth, pages-per-session, NavBoost ranking signal

### Article Credibility Enhancements
Trust signals missing from blog posts per playbook Section 9:
- [ ] Fact-checked date — separate from "Updated" date
- [ ] "Reviewed by" line — visible reviewer credit linked to profile
- [ ] Source citations — verify every article has sourced claims with hyperlinks
- [ ] "Human-reviewed content" label
- **Impact:** E-E-A-T, YMYL trust, content credibility

### Homepage Social Proof & Trust Indicators
Homepage has stat cards but is missing:
- [ ] Subscriber count near newsletter CTA: "Join X sales professionals"
- [ ] Trust badges or credential indicators
- [ ] Clear positioning statement per the playbook formula
- [ ] Testimonial cards (when available)
- **Impact:** Conversion rate, trust, first-impression authority

### Statistics/Data Page (Link Magnet)
The playbook ranks this as the #1 natural link earner. Create:
- `/blog/aged-lead-industry-statistics` or dedicated route
- Bold key stats, cite sources, "Cite This" snippets with copy buttons
- "Last updated" / "Last verified" header
- Include original data from existing price-index data
- Update quarterly
- **Impact:** Passive backlinks, authority, journalist citations

---

## P1 — SEO & Visibility

### Speakable Schema
Add `speakable` property to Article JSON-LD on key content pages. Flags the most citable passage for AI synthesis.
- **Impact:** AI Overview citation, voice search

### Calculator Embed Codes
5 calculators exist but none offer embed snippets. Add "Embed this calculator" button with pre-built iframe code + attribution link.
- **Impact:** Passive backlinks from sites that embed the tools

### Answer-First Paragraph Structure
Playbook Section 16: "Place a 40-60 word direct answer immediately after each H2 heading." Audit existing articles and update content cron to generate answer-first structure.
- **Impact:** AI Overview citation, featured snippets

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

### Shareable/Copyable Content Elements
- `CopyableStatCard` — data point card with copy-to-clipboard (formatted stat + attribution link)
- `ShareableQuote` — styled blockquote with "Share this" button for LinkedIn/X
- Especially valuable on price-index and provider comparison pages
- **Impact:** Social sharing, passive backlinks

### Content Series with Email Drip
Structure cornerstone content as 3-5 part series. Gate parts 2+ behind email. Each drip drives a return visit.
- **Impact:** Email list growth, return visits, Google quality signal

### "Cite This" Blocks
On price-index pages, provider comparisons, and statistics content — pre-formatted citation HTML with copy button.
- **Impact:** Passive backlinks from content writers

---

## P2 — Information Architecture

### `/resources` Hub Page
Centralized page for all lead magnets and downloadable resources. As more are added beyond the prospecting checklist, they need a browsable hub.

### Breadcrumbs on All Sub-Pages
Breadcrumbs component is built and deployed on blog posts. Extend to:
- [ ] Lead type detail pages
- [ ] Playbook detail pages
- [ ] Guide detail pages
- [ ] Glossary term detail pages
- [ ] Calculator pages
- [ ] Provider detail pages
- [ ] Price index vertical pages
- [ ] Comparison pages

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
