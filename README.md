# Aged Lead Store – Sales Training & Aged Lead Strategies

A Next.js + Sanity.io SEO-driven affiliate content site that helps sales professionals learn how to incorporate aged leads into their sales operations. The site drives traffic to [AgedLeadStore.com](https://agedleadstore.com) where visitors can purchase aged leads across insurance, mortgage, legal, solar, and other verticals.

## Tech Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| **Framework** | [Next.js](https://nextjs.org/) 16 (App Router) | Static generation, server components, API routes |
| **CMS** | [Sanity.io](https://www.sanity.io/) | Structured content, embedded studio at `/studio` |
| **Styling** | [Tailwind CSS](https://tailwindcss.com/) v4 | Responsive design, dark mode |
| **Analytics** | Google Tag Manager + GA4 | Event tracking, conversion measurement |
| **Email** | [Resend](https://resend.com/) (ready to configure) | Newsletter, welcome emails |
| **Deployment** | [Vercel](https://vercel.com/) | Edge performance, ISR, preview deployments |

## Getting Started

### 1. Clone and Install

```bash
git clone <repo-url>
cd agedleadstore-site
npm install
```

### 2. Set Up Sanity

1. Create a project at [sanity.io/manage](https://www.sanity.io/manage)
2. Copy `.env.example` to `.env.local` and fill in your Sanity project ID
3. Add `http://localhost:3000` to your Sanity project's CORS origins

### 3. Run Development Server

```bash
npm run dev
```

- **Site:** [http://localhost:3000](http://localhost:3000)
- **Sanity Studio:** [http://localhost:3000/studio](http://localhost:3000/studio)

## Project Structure

```
├── app/
│   ├── (site)/                         # Public site (shared header/footer layout)
│   │   ├── page.tsx                    # Homepage (hero, lead types, blog, playbooks)
│   │   ├── layout.tsx                  # Site layout (metadata, GTM, fonts)
│   │   ├── blog/                       # Blog listing + [slug] posts
│   │   ├── lead-types/                 # Lead type listing + [slug] detail
│   │   ├── playbooks/                  # Playbook listing + [slug] detail
│   │   ├── glossary/                   # Glossary index (A-Z, search) + [slug] terms
│   │   ├── guides/                     # Guide listing + [slug] detail
│   │   ├── calculators/                # Calculator tools (placeholder)
│   │   └── about/                      # About page
│   ├── (studio)/                       # Sanity Studio (separate layout)
│   │   └── studio/[[...tool]]/         # Studio catch-all route
│   ├── api/
│   │   ├── newsletter/                 # Newsletter signup endpoint
│   │   └── og/                         # Dynamic OG image generation
│   ├── robots.ts                       # Programmatic robots.txt
│   ├── sitemap.ts                      # Dynamic XML sitemap
│   └── globals.css
├── components/
│   ├── analytics.tsx                   # GTM + dataLayer event tracking
│   ├── json-ld.tsx                     # Structured data generators
│   ├── newsletter-signup.tsx           # Newsletter form (inline/card/banner)
│   ├── lead-magnet-cta.tsx             # Lead magnet CTA (inline/card/banner)
│   ├── cta-banner.tsx                  # Affiliate CTA banner
│   ├── glossary-search.tsx             # Client-side glossary search + filter
│   ├── portable-text.tsx               # Sanity rich text renderer
│   ├── header.tsx / footer.tsx         # Site chrome
│   └── *-card.tsx                      # Content listing cards
├── sanity/
│   ├── client.ts                       # Sanity client
│   ├── env.ts                          # Environment variables
│   ├── lib/
│   │   ├── queries.ts                  # All GROQ queries
│   │   ├── fetch.ts                    # Null-safe fetch wrapper
│   │   └── image.ts                    # Image URL builder
│   └── schemaTypes/                    # Content models
│       ├── post.ts                     # Blog posts (pillar/cluster)
│       ├── leadType.ts                 # Lead type pages
│       ├── playbook.ts                 # Sales playbooks
│       ├── glossaryTerm.ts             # Glossary terms
│       ├── guide.ts                    # Guides & resources
│       ├── author.ts / category.ts     # Supporting types
│       └── objects/seo.ts              # Reusable SEO field group
├── sanity.config.ts                    # Studio configuration
└── sanity.cli.ts                       # CLI configuration
```

## Content Types

| Type | Schema Fields | SEO Features |
|------|--------------|-------------|
| **Blog Post** | title, slug, excerpt, body, author, categories, leadTypes, contentType (pillar/cluster), pillarPost reference | Grouped SEO object, Article JSON-LD, OG images, breadcrumbs |
| **Lead Type** | title, slug, description, body, icon, affiliateUrl, costPerLead, industries | SEO object, canonical URLs, OG images, breadcrumbs |
| **Playbook** | title, slug, excerpt, body, difficulty, estimatedTime, leadTypes, author | SEO object, breadcrumbs, OG images |
| **Glossary Term** | term, slug, definition, body, category, relatedTerms, relatedLeadTypes | DefinedTerm JSON-LD, SEO object, OG images |
| **Guide** | title, slug, excerpt, body, estimatedTime, isGated, leadTypes, author | SEO object, breadcrumbs, OG images |
| **Author** | name, slug, image, bio, role | — |
| **Category** | title, slug, description | — |

## SEO Infrastructure

- **robots.txt** — Programmatic, blocks `/studio` and `/api`
- **sitemap.xml** — Dynamic, pulls all content from CMS with priorities and lastModified dates
- **JSON-LD** — WebSite, Organization, Article, BreadcrumbList, FAQPage, DefinedTerm, WebApplication
- **OG Images** — Dynamic generation at `/api/og` with brand-consistent styling
- **Metadata** — Template-based titles, canonical URLs, Twitter cards, search engine verification
- **Pillar-Cluster Model** — Blog posts support parent/child relationships for topical authority

## Lead Generation

- **Newsletter Signup** — 3 variants (inline, card, banner) with API route and Resend integration
- **Lead Magnet CTA** — 3 variants with feature lists and email capture
- **Affiliate CTAs** — Contextual banners driving to AgedLeadStore.com
- **GTM Analytics** — dataLayer events for newsletter signups, CTA clicks, calculator usage

## Lead Types Covered

Mortgage, Insurance, Final Expense, IUL, SSDI, MVA, Solar, Medicare (with fallback content when CMS is empty)

## Environment Variables

See `.env.example` for all available configuration options.

| Variable | Required | Purpose |
|----------|----------|---------|
| `NEXT_PUBLIC_SANITY_PROJECT_ID` | Yes | Sanity project ID |
| `NEXT_PUBLIC_SANITY_DATASET` | Yes | Sanity dataset name |
| `NEXT_PUBLIC_SITE_URL` | Yes | Canonical site URL |
| `NEXT_PUBLIC_GTM_ID` | No | Google Tag Manager container |
| `RESEND_API_KEY` | No | Email service (newsletter) |

## Deployment

Deploy to Vercel, set environment variables, and add your production domain to Sanity's CORS origins.
