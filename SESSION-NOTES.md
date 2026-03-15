# Session Notes — March 14-15, 2026 (updated March 15)

## What We Built

Transformed `agedlead-sales` from a simple Next.js slide-deck viewer into a full SEO-driven affiliate content platform on Next.js + Sanity.io, deployed on Vercel at `agedleadsales.com`.

## Architecture

- **Framework:** Next.js 16 (App Router) with route groups `(site)` and `(studio)`
- **CMS:** Sanity.io (project ID: `p7rbtajg`, dataset: `production`)
- **Styling:** Tailwind CSS v4
- **Analytics:** GA4 (`G-KMDYLG0QMC`) via direct gtag.js + Google Tag Manager (`GTM-W9MDT8F2`)
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
- **GA4** — Direct `gtag.js` tag via `GoogleAnalyticsTag` component (fixes GA4 tag detection)
- **GTM** — `components/analytics.tsx` with `gtag()` event tracking

## Affiliate Link System

All affiliate links flow through `lib/affiliate.ts`:
- Base URL: `https://agedleadstore.com/all-lead-types/`
- UTM: `utm_source=agedleadsales`, `utm_medium=affiliate`, per-page `utm_campaign`, per-CTA `utm_content`
- To change the destination, edit one line in `lib/affiliate.ts`

## Environment Variables (Vercel)

### Already Set
| Variable | Value |
|----------|-------|
| `NEXT_PUBLIC_SANITY_PROJECT_ID` | `p7rbtajg` |
| `NEXT_PUBLIC_SANITY_DATASET` | `production` |
| `NEXT_PUBLIC_GTM_ID` | `GTM-W9MDT8F2` |
| `NEXT_PUBLIC_GA4_MEASUREMENT_ID` | `G-KMDYLG0QMC` |

### Need to Set (for cron jobs to work)

Set these via Vercel Dashboard or Vercel CLI when available:

| Variable | Purpose | Where to get it |
|----------|---------|-----------------|
| `NEXT_PUBLIC_SITE_URL` | Sitemaps, canonical URLs | `https://agedleadsales.com` |
| `CRON_SECRET` | Secures cron endpoints | Generate any random string |
| `OPENAI_API_KEY` | AI content generation + analysis | [platform.openai.com](https://platform.openai.com) |
| `SANITY_API_TOKEN` | CMS publishing from cron jobs | [sanity.io/manage](https://www.sanity.io/manage) > API > Tokens |
| `RESEND_API_KEY` | Email sending (reports + newsletter) | [resend.com](https://resend.com) |
| `RESEND_FROM_EMAIL` | Sender address for emails | Your verified Resend domain |
| `RESEND_AUDIENCE_ID` | Newsletter broadcast audience | Resend dashboard > Audiences |
| `GITHUB_TOKEN` | Commits reports/backlog to repo | GitHub PAT with `contents:write` scope |
| `GITHUB_REPO` | Target repository | `billriceusa/agedlead-sales` |
| `GITHUB_BRANCH` | Branch for report commits | `main` |
| `GOOGLE_CLIENT_EMAIL` | GA4/GSC API access | Google Cloud service account |
| `GOOGLE_PRIVATE_KEY` | GA4/GSC API auth | Service account JSON key file |
| `GA4_PROPERTY_ID` | Daily performance report | GA4 Admin > Property details (numeric ID) |
| `GSC_SITE_URL` | Search Console data | `https://agedleadsales.com` |

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

## Automated Cron Jobs (added March 15, 2026)

Four Vercel cron jobs that automate the content, newsletter, SEO, and analytics workflows.

### Schedule

| Cron | Schedule | Endpoint |
|------|----------|----------|
| Weekly Content | Sunday 6 AM UTC | `/api/cron/weekly-content` |
| Weekly Newsletter | Sunday 8 AM UTC | `/api/cron/weekly-newsletter` |
| SEO Audit | Wednesday 10 AM UTC | `/api/cron/seo-audit` |
| Daily Performance | Daily 12 PM UTC (8 AM ET) | `/api/cron/daily-performance` |

### 1. Weekly Content (Sunday)
Reviews the SEO strategy, does competitive research on the keyword marketplace, reviews the editorial calendar, writes 3 blog posts (Mon/Wed/Fri) using GPT-4o, publishes them to Sanity CMS, commits a weekly report to GitHub, and emails a summary to bill@billricestrategy.com.

### 2. Weekly Newsletter (Sunday)
Checks the newsletter content calendar (`data/newsletter-calendar.ts`) for a planned theme or has AI research one. Generates a complete newsletter with personal intro, featured article, 3 exclusive tips, industry insight, and blog digest. Builds a responsive HTML email, sends a preview to Bill for review, and schedules the broadcast to subscribers for Tuesday 9 AM ET via Resend.

### 3. SEO Audit (Wednesday)
Researches latest Google algorithm updates (Core, Helpful Content, Spam, etc.). Builds a site snapshot from Sanity CMS. Runs a comprehensive audit across 10 categories (technical SEO, content quality, structured data, E-E-A-T, affiliate compliance, etc.). Maintains a living backlog at `data/seo-backlog.json` — new issues added, resolved issues auto-closed. Emails a full audit report with score, findings, and recommendations.

### 4. Daily Performance (Daily)
Fetches 7-day and 90-day data from GA4 (sessions, users, page views, bounce rate, top pages, traffic sources) and GSC (clicks, impressions, CTR, position, top queries, device breakdown). Calculates daily averages and uses GPT-4o to compare periods, identify trends, and generate recommendations. Emails a performance report with trend arrows and action items. Gracefully handles missing data sources.

### Cron Job Files

| File | Purpose |
|------|---------|
| `app/api/cron/weekly-content/route.ts` | Content strategy + article writing |
| `app/api/cron/weekly-newsletter/route.ts` | Newsletter generation + scheduling |
| `app/api/cron/seo-audit/route.ts` | Google updates research + site audit |
| `app/api/cron/daily-performance/route.ts` | GA4/GSC performance report |
| `lib/cron/ai-content.ts` | AI content planning + article writing |
| `lib/cron/sanity-publish.ts` | Sanity CMS write client |
| `lib/cron/newsletter-ai.ts` | AI newsletter content generation |
| `lib/cron/newsletter-email.ts` | Responsive HTML newsletter template |
| `lib/cron/seo-audit.ts` | Google update research + site auditing |
| `lib/cron/performance-ai.ts` | AI performance analysis |
| `lib/cron/ga4-data.ts` | GA4 Data API client (REST) |
| `lib/cron/gsc-data.ts` | GSC API client (REST) |
| `lib/cron/google-auth.ts` | Google service account auth |
| `lib/cron/git-commit.ts` | GitHub API for committing files |
| `lib/cron/notify.ts` | Email report sending (Resend) |
| `lib/cron/types.ts` | Shared TypeScript types |
| `data/newsletter-calendar.ts` | 12-week newsletter theme plan |
| `data/editorial-calendar.ts` | 12-week blog content plan |

### Design Principles
- **Lazy initialization** — API clients (OpenAI, Sanity, Google) are created at request time, not module load time, so builds succeed without env vars
- **Graceful degradation** — Each data source is optional; reports work with partial data and clearly indicate what's missing
- **Lightweight API clients** — GA4 and GSC use direct REST calls + `google-auth-library` instead of the heavyweight `googleapis` package
- **Parallel execution** — Independent API calls (fetching data, writing articles) run concurrently to stay within the 300s function timeout
- **Idempotent publishing** — Sanity posts check for existing documents by ID before creating, preventing duplicates on retry

## GA4 Tag Fix (March 15, 2026)

GA4 reported "Your Google tag wasn't detected on agedleadsales.com" because the site only loaded GTM without the direct `gtag.js` snippet. Fixed by adding a `GoogleAnalyticsTag` component that loads `gtag.js` with the measurement ID `G-KMDYLG0QMC` directly. GA4 needs this to verify tag installation; GTM alone isn't sufficient for detection.

## Key Files Reference

| File | Purpose |
|------|---------|
| `lib/affiliate.ts` | Centralized affiliate URL builder with UTM tracking |
| `data/lead-types.ts` | Rich SEO content for 8 lead type landing pages |
| `data/glossary-terms.ts` | Static fallback for 77 glossary terms |
| `data/editorial-calendar.ts` | 12-week content plan with briefs |
| `data/newsletter-calendar.ts` | 12-week newsletter theme plan |
| `components/json-ld.tsx` | All structured data generators |
| `components/analytics.tsx` | GA4 gtag.js + GTM + event tracking |
| `components/affiliate-disclosure.tsx` | Site-wide FTC disclosure |

## Next Session Priorities

1. **Set remaining Vercel env vars** — see table above; needed for cron jobs to function
2. **Set up Google Cloud service account** — for GA4/GSC API access in daily performance reports
3. **Set up Resend** — API key, verified domain, audience for newsletter broadcasts
4. **Generate a `CRON_SECRET`** — any random string to secure cron endpoints
5. **Create a GitHub PAT** — with `contents:write` scope for report commits
6. **Verify GA4 tag** — hit Retest in GA4 after deploy with `NEXT_PUBLIC_GA4_MEASUREMENT_ID` set
7. **Build the Outreach Cadence Planner** calculator (4th tool)
8. **Add images** to blog posts and lead type pages via Sanity
9. **Monitor first cron runs** — check logs after env vars are configured

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
