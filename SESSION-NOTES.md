# Session Notes — March 14-15, 2026 (Updated March 15)

## What We Built

Transformed `agedlead-sales` from a simple Next.js slide-deck viewer into a full SEO-driven affiliate content platform on Next.js + Sanity.io, deployed on Vercel at `agedleadsales.com`.

## Architecture

- **Framework:** Next.js 16 (App Router) with route groups `(site)` and `(studio)`
- **CMS:** Sanity.io (project ID: `p7rbtajg`, dataset: `production`)
- **Styling:** Tailwind CSS v4
- **Analytics:** Google Tag Manager (`GTM-W9MDT8F2`) + GA4
- **Deployment:** Vercel (auto-deploys from `main` branch)
- **Domain:** `agedleadsales.com`

## Brand Positioning

| Site | Role | Content Focus |
|------|------|---------------|
| **AgedLeadSales.com** (this site) | Vertical specialist | Industry-specific playbooks, role-specific strategies, tools, glossary |
| **AgedLeadStore.com** | The store/vendor | Product pages, pricing, generic guides |
| **HowToWorkLeads.com** | General training hub | How to work leads (all types), CRM guides, sales process |

**Critical rule:** Never publish content that overlaps with the other two sites. Our content must be vertical-specific, role-specific, or tool-based.

## Content Inventory (as of session end)

| Content Type | Count | Location |
|-------------|-------|----------|
| Blog posts | 11 | Sanity CMS |
| Lead type landing pages | 8 | Static (`data/lead-types.ts`) + CMS |
| Glossary terms | 77 | Sanity CMS + static fallback (`data/glossary-terms.ts`) |
| Interactive calculators | 3 | Static pages (ROI, Lead Cost, Pipeline) |
| Categories | 6 | Sanity CMS |
| Author | 1 (Bill Rice) | Sanity CMS |
| Static pages | ~10 | Code (home, about, author, indexes) |
| **Total indexable pages** | **~109** | |

## Sanity CMS Schemas

| Schema | Key Fields |
|--------|-----------|
| `post` | title, slug, excerpt, body, author, categories, leadTypes, contentType (pillar/cluster), pillarPost, seo, isFeatured |
| `leadType` | title, slug, shortDescription, body, icon, affiliateUrl, averageCostPerLead, industries, seo, order |
| `glossaryTerm` | term, slug, definition, body, category, relatedTerms, relatedLeadTypes, seo |
| `guide` | title, slug, excerpt, body, estimatedTime, isGated, leadTypes, author, seo |
| `playbook` | title, slug, excerpt, body, difficulty, estimatedTime, leadTypes, author, seo |
| `author` | name, slug, image, bio, role |
| `category` | title, slug, description |

## SEO Infrastructure

- **robots.txt** — `/robots.ts` blocks `/studio` and `/api`
- **sitemap.xml** — `/sitemap.ts` dynamically pulls all content from CMS
- **JSON-LD** — `components/json-ld.tsx` generates WebSite, Organization, Person, Article, BreadcrumbList, FAQPage, DefinedTerm, WebApplication
- **OG images** — `/api/og` edge route generates branded images dynamically
- **Metadata** — `metadataBase`, title template `%s | Aged Lead Sales`, canonical URLs, Twitter cards
- **Author authority** — Bill Rice with Person schema, `sameAs` links to Kaleidico/HowToWorkLeads/Medium, `knowsAbout` topics
- **Affiliate disclosure** — Site-wide above footer
- **Affiliate link rel** — `rel="nofollow sponsored noopener noreferrer"` on all affiliate links
- **GTM** — `components/analytics.tsx` with `gtag()` event tracking

## Affiliate Link System

All affiliate links flow through `lib/affiliate.ts`:
- Base URL: `https://agedleadstore.com/all-lead-types/`
- UTM: `utm_source=agedleadsales`, `utm_medium=affiliate`, per-page `utm_campaign`, per-CTA `utm_content`
- To change the destination, edit one line in `lib/affiliate.ts`

## Environment Variables (Vercel)

| Variable | Status |
|----------|--------|
| `NEXT_PUBLIC_SANITY_PROJECT_ID` | ✅ Set (`p7rbtajg`) |
| `NEXT_PUBLIC_SANITY_DATASET` | ✅ Set (`production`) |
| `NEXT_PUBLIC_GTM_ID` | ✅ Set (`GTM-W9MDT8F2`) |
| `NEXT_PUBLIC_SITE_URL` | ⚠️ Needs to be set to `https://agedleadsales.com` |
| `NEXT_PUBLIC_SANITY_API_VERSION` | Optional (defaults to `2026-03-14`) |
| `NEXT_PUBLIC_GSC_VERIFICATION` | Not yet set |
| `NEXT_PUBLIC_BING_VERIFICATION` | Not yet set |
| `RESEND_API_KEY` | Not yet set |

## Sanity API Token

Used for seeding scripts. Token: stored locally, NOT in git. Pass via `SANITY_API_TOKEN` env var when running scripts.

## Google Search Console

- Property: `agedleadsales.com`
- Sitemap: Submitted and verified ✅ (7 pages initially, will grow as Vercel rebuilds)

## 12-Week Editorial Calendar

Full calendar with briefs in `data/editorial-calendar.ts`. Cadence: 3 posts/week (Mon/Wed/Fri).

**Published (Weeks 1-2, 6 posts):**
1. Direct Mail Playbook (Mar 17)
2. New Insurance Agent First 90 Days (Mar 19)
3. TCPA Compliance (Mar 21)
4. IUL for Financial Advisors (Mar 24)
5. CRM Setup for Aged Leads (Mar 26)
6. MVA Intake for PI Firms (Mar 28)

**Briefs ready (Weeks 3-12, 30 posts):**
See `data/editorial-calendar.ts` for full details.

## Key Files Reference

| File | Purpose |
|------|---------|
| `lib/affiliate.ts` | Centralized affiliate URL builder with UTM tracking |
| `data/lead-types.ts` | Rich SEO content for 8 lead type landing pages |
| `data/glossary-terms.ts` | Static fallback for 77 glossary terms |
| `data/editorial-calendar.ts` | 12-week content plan with briefs |
| `components/json-ld.tsx` | All structured data generators |
| `components/analytics.tsx` | GTM + event tracking |
| `components/affiliate-disclosure.tsx` | Site-wide FTC disclosure |
| `scripts/seed-sanity.mjs` | Seeds categories, lead types, glossary terms |
| `scripts/seed-author.mjs` | Creates/updates Bill Rice author |
| `scripts/seed-blog-post.mjs` | Original pillar post (now replaced) |
| `scripts/seed-cluster-posts.mjs` | 5 differentiated vertical posts |
| `scripts/seed-glossary-crosslinks.mjs` | Links glossary terms → lead types |
| `scripts/seed-glossary-expansion.mjs` | 20 new terms + 5 enriched |
| `scripts/dedup-and-reposition.mjs` | Deleted overlapping content, published differentiated posts |
| `scripts/seed-week1-2-posts.mjs` | Week 1-2 editorial calendar posts |

## Next Session Priorities

1. **Write and publish Weeks 3-4 posts** (6 posts, briefs ready in editorial calendar)
2. **Set `NEXT_PUBLIC_SITE_URL`** on Vercel if not done yet
3. **Check GSC indexing** — verify pages are being crawled and indexed
4. **Set up Resend** for newsletter — configure API key, create welcome email
5. **Build the Outreach Cadence Planner** calculator (4th tool)
6. **Add images** to blog posts and lead type pages via Sanity
7. **Monitor analytics** — verify GTM is firing, check GA4 for traffic
8. **Continue Weeks 5-12** content production
9. **Enrich more glossary terms** with extended body content
10. **Consider adding a newsletter signup welcome email** via Resend

## Google Algorithm Compliance Notes

Based on research of Dec 2025 Helpful Content Update and Aug 2025 Spam Update:

- ✅ Named author (Bill Rice) with verifiable credentials
- ✅ Person schema with sameAs links to external profiles
- ✅ Original, experience-based content (not AI-generated at scale)
- ✅ Affiliate links properly tagged `rel="nofollow sponsored"`
- ✅ Transparent affiliate disclosure on every page
- ✅ No content duplication across owned properties
- ✅ Each post has a unique competitive angle not covered elsewhere
- ✅ Interactive tools providing genuine user utility
- ✅ FAQPage schema on applicable pages

## Updated Content Inventory (end of session 2)

| Content Type | Count | Location |
|-------------|-------|----------|
| Blog posts | 11 | Sanity CMS |
| Playbooks | 4 | Sanity CMS |
| Lead type landing pages | 8 | Static + CMS |
| Glossary terms | 77 | Sanity CMS + static fallback |
| Interactive calculators | 3 | Static pages |
| Categories | 6 | Sanity CMS |
| Author | 1 (Bill Rice) | Sanity CMS |
| Static pages | ~10 | Code |
| **Total indexable pages** | **~113** | |
| **Editorial briefs ready** | 30 more posts | `data/editorial-calendar.ts` |

## Lessons Learned

### 1. Centralize affiliate links from day one
We initially hardcoded `agedleadstore.com` URLs across dozens of files. When the destination changed to `/all-lead-types/`, we had to hunt through every component and page. The centralized `lib/affiliate.ts` utility fixed this — one file controls every affiliate link on the site. **Lesson: any URL that might change should flow through a single utility.**

### 2. Don't leak internal tools to the public site
The blog and playbooks empty states had "Content is managed via the Sanity Studio" with a link to `/studio`. This is internal infrastructure that visitors shouldn't see. **Lesson: always review empty/fallback states from a visitor's perspective before deploying.**

### 3. Content differentiation across owned properties is critical
We initially published 6 blog posts that directly overlapped with content on AgedLeadStore.com and HowToWorkLeads.com — same topics, same keywords, same author. Google's Dec 2025 Helpful Content Update specifically penalizes this pattern. We had to delete all 6 and rewrite from scratch with differentiated angles. **Lesson: audit competitor content (including your own other sites) before writing a single post. Define clear content lanes upfront.**

### 4. HTML entities don't always work in JSX
`&nearr;` rendered as literal text in React/JSX rather than the ↗ arrow character. Use Unicode characters directly (↗) instead of HTML entities in JSX. `&rarr;` works but `&nearr;` doesn't consistently. **Lesson: use Unicode characters in JSX, not HTML entities.**

### 5. Static data with CMS override is the fastest path to content
Building content as static TypeScript data files (`data/lead-types.ts`, `data/glossary-terms.ts`) with CMS override when Sanity has data gives the best of both worlds: instant indexable pages at build time, plus editorial flexibility through the Studio. **Lesson: don't wait for CMS content to ship pages — build static fallbacks and let CMS content supersede them.**

### 6. The Sanity client needs graceful null handling
When `NEXT_PUBLIC_SANITY_PROJECT_ID` is empty, `createClient` throws. We wrapped the client in a null check so the site builds and renders fallback content even without Sanity configured. Similarly, the sitemap needed a try/catch around the CMS fetch. **Lesson: every CMS call should fail gracefully.**

### 7. `rel="nofollow sponsored"` on affiliate links is non-negotiable
Google's Aug 2025 Spam Update and affiliate site guidelines require explicit `rel="nofollow sponsored"` on all paid/commission links. We initially had only `rel="noopener noreferrer"`. **Lesson: add affiliate rel attributes from the first commit, not as a fix later.**

### 8. Author authority requires a dedicated page and schema
The Dec 2025 Helpful Content Update evaluates author credibility beyond bios. A named author page (`/about/bill-rice`) with Person JSON-LD including `sameAs`, `knowsAbout`, and `worksFor` links allows Google to verify expertise across the web. **Lesson: build the author page and schema before publishing content, not after.**

### 9. Seeding scripts are essential for Sanity-powered sites
Writing content directly in Sanity Studio is slow for bulk content. Seeding scripts (`scripts/seed-*.mjs`) let us publish dozens of documents programmatically with consistent formatting, proper references, and SEO fields. Keep the token out of git and pass via env var. **Lesson: invest in seeding scripts early — they pay back immediately.**

### 10. GSC sitemap "Couldn't fetch" is usually a build-time error
Our first sitemap submission failed because the Sanity fetch was throwing during the Vercel build (no try/catch). The sitemap XML never generated. Adding error handling fixed it immediately. **Lesson: always wrap external API calls in try/catch for statically generated routes.**

## Scripts Reference (run with SANITY_API_TOKEN env var)

```bash
# Seed all base content (categories, lead types, glossary)
SANITY_API_TOKEN=xxx node scripts/seed-sanity.mjs

# Update author to Bill Rice
SANITY_API_TOKEN=xxx node scripts/seed-author.mjs

# Publish differentiated blog posts
SANITY_API_TOKEN=xxx node scripts/dedup-and-reposition.mjs

# Publish Week 1-2 editorial calendar posts
SANITY_API_TOKEN=xxx node scripts/seed-week1-2-posts.mjs

# Publish playbooks
SANITY_API_TOKEN=xxx node scripts/seed-playbooks.mjs

# Add glossary cross-references
SANITY_API_TOKEN=xxx node scripts/seed-glossary-crosslinks.mjs

# Add new glossary terms + enrich existing
SANITY_API_TOKEN=xxx node scripts/seed-glossary-expansion.mjs
```
