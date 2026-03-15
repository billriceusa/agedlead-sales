# Vercel Cron Job Setup Guide

A step-by-step guide for adding automated content, newsletter, SEO audit, and performance reporting cron jobs to any Next.js website deployed on Vercel.

---

## Overview

This system adds four automated jobs to a website:

| Job | Runs | What it does |
|-----|------|-------------|
| **Weekly Content** | Sunday morning | AI writes and publishes blog posts to the CMS |
| **Weekly Newsletter** | Sunday morning | AI writes a newsletter, sends preview, schedules broadcast |
| **SEO Audit** | Wednesday | Researches Google updates, audits the site, maintains a backlog |
| **Daily Performance** | Every morning | Pulls GA4 + GSC data, compares 7-day vs 90-day averages, emails analysis |

All reports are emailed to the site owner. All jobs are secured with a shared secret and fail gracefully if a service isn't configured yet.

---

## Prerequisites

Before starting, you need:

- A **Next.js** project (App Router) deployed on **Vercel**
- A **CMS** with API write access (this guide assumes Sanity.io, but the pattern adapts)
- Node.js 18+ locally for testing

### Third-Party Accounts

| Service | Free tier? | What it's used for |
|---------|------------|-------------------|
| [OpenAI](https://platform.openai.com) | Pay-as-you-go | AI content generation, analysis, auditing |
| [Resend](https://resend.com) | 3,000 emails/month free | Email reports, newsletter sending |
| [Sanity.io](https://www.sanity.io) | Free for small projects | CMS for content publishing |
| [Google Cloud](https://console.cloud.google.com) | Free | Service account for GA4/GSC API access |
| [GitHub](https://github.com) | Free | Personal access token for committing reports |

---

## Step 1: Install Dependencies

```bash
npm install openai resend google-auth-library
```

These three packages cover all the cron jobs:
- `openai` — AI content generation and analysis (all four jobs)
- `resend` — email sending and newsletter broadcasts
- `google-auth-library` — lightweight Google API authentication (daily performance only)

Do **not** install `googleapis` — it adds 40MB+ to the bundle. The daily performance job uses direct REST calls to the GA4 and GSC APIs instead.

---

## Step 2: Create the Cron Job Files

### Directory structure

```
app/api/cron/
  weekly-content/route.ts      # Blog content generation
  weekly-newsletter/route.ts   # Newsletter writing + scheduling
  seo-audit/route.ts           # Google updates + site audit
  daily-performance/route.ts   # GA4/GSC performance report

lib/cron/
  types.ts                     # Shared TypeScript types
  ai-content.ts                # AI content planning + article writing
  sanity-publish.ts            # CMS write client
  newsletter-ai.ts             # AI newsletter content generation
  newsletter-email.ts          # HTML newsletter template
  seo-audit.ts                 # Google update research + auditing
  performance-ai.ts            # AI performance analysis
  ga4-data.ts                  # GA4 Data API client (REST)
  gsc-data.ts                  # GSC API client (REST)
  google-auth.ts               # Google service account auth
  git-commit.ts                # GitHub API for committing files
  notify.ts                    # Email report sending

data/
  editorial-calendar.ts        # Blog content plan
  newsletter-calendar.ts       # Newsletter theme plan
```

Copy the `lib/cron/` and `app/api/cron/` directories from the reference implementation. The `data/` calendar files are site-specific and need to be written for each site.

### Key pattern: every route handler follows the same structure

```typescript
import { NextResponse } from "next/server";

export const maxDuration = 300;     // 5 minute timeout (Vercel Pro)
export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  // 1. Verify the cron secret
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // 2. Gather data
  // 3. Process with AI
  // 4. Publish / commit / email
  // 5. Return status

  return NextResponse.json({ success: true });
}
```

---

## Step 3: Site-Specific Customization

Each site needs these files customized:

### AI System Prompt (`lib/cron/ai-content.ts`)

Update the `SYSTEM_CONTEXT` string with:
- The site name, URL, and what it does
- The ICP (ideal customer profile) — who reads this site
- Competitors — who the content must differentiate from
- Content pillars — the topic categories
- Content rules — word count, tone, linking requirements
- Author info — who writes the content and their credentials

### Editorial Calendar (`data/editorial-calendar.ts`)

Create a content plan specific to the site with:
- Content briefs (title, keyword, outline, target pages)
- Publishing cadence (how many posts per week)
- Pillar rotation rules

### Newsletter Calendar (`data/newsletter-calendar.ts`)

Create a newsletter theme plan with:
- Weekly themes
- Focus verticals
- Exclusive tip topics for each week

### Report Email Address

In each route file, update the `REPORT_EMAIL` constant:

```typescript
const REPORT_EMAIL = "your-email@example.com";
```

### Sanity Publish (`lib/cron/sanity-publish.ts`)

Update the category and lead type ID maps to match the CMS document IDs for the specific site:

```typescript
const PILLAR_CATEGORY_MAP: Record<string, string> = {
  "Your Pillar Name": "cat-your-category-id",
};
```

### Newsletter Email Template (`lib/cron/newsletter-email.ts`)

Update branding: site name, colors, footer links, CTA URLs, affiliate tracking parameters.

---

## Step 4: Configure `vercel.json`

Add the `crons` array to your existing `vercel.json`:

```json
{
  "crons": [
    {
      "path": "/api/cron/weekly-content",
      "schedule": "0 6 * * 0"
    },
    {
      "path": "/api/cron/weekly-newsletter",
      "schedule": "0 8 * * 0"
    },
    {
      "path": "/api/cron/seo-audit",
      "schedule": "0 10 * * 3"
    },
    {
      "path": "/api/cron/daily-performance",
      "schedule": "0 12 * * *"
    }
  ]
}
```

### Cron schedule reference (UTC)

| Expression | Meaning |
|-----------|---------|
| `0 6 * * 0` | Sunday at 6:00 AM UTC |
| `0 8 * * 0` | Sunday at 8:00 AM UTC |
| `0 10 * * 3` | Wednesday at 10:00 AM UTC |
| `0 12 * * *` | Every day at 12:00 PM UTC (8 AM ET) |

Adjust times as needed. The weekly content job should run before the newsletter job so the newsletter can reference the new blog posts.

### Vercel plan requirements

| Plan | Max cron jobs | Function timeout | Cron frequency |
|------|--------------|-----------------|----------------|
| Hobby | 2 | 60s | Daily minimum |
| Pro | 40 | 300s | Every minute |
| Enterprise | 100 | 900s | Every minute |

The weekly content and newsletter jobs need Pro or higher for the 300s timeout (AI calls take time). The daily performance job can work on Hobby if GA4/GSC API calls are fast.

---

## Step 5: Set Up Third-Party Services

### 5A: OpenAI

1. Go to [platform.openai.com](https://platform.openai.com)
2. Create an API key under API Keys
3. Add billing (pay-as-you-go)
4. Note the API key for later

**Cost estimate:** ~$0.50-$2.00 per weekly content run (3 articles), ~$0.05-$0.10 per daily performance report.

### 5B: Resend

1. Go to [resend.com](https://resend.com) and create an account
2. **Add and verify a domain** (Settings > Domains) — required for sending from your domain
3. **Create an API key** (Settings > API Keys)
4. **Create an audience** (Audiences > Create) — this is your subscriber list for newsletter broadcasts
5. Note the API key, audience ID, and your verified sender address (e.g., `newsletter@yourdomain.com`)

### 5C: Sanity API Token

1. Go to [sanity.io/manage](https://www.sanity.io/manage)
2. Select your project
3. Go to API > Tokens
4. Create a new token with **Editor** permissions (needs write access)
5. Note the token

### 5D: GitHub Personal Access Token

1. Go to [github.com/settings/tokens](https://github.com/settings/tokens)
2. Generate a new **Fine-grained token**
3. Select the specific repository
4. Under Permissions > Repository permissions, set **Contents** to **Read and write**
5. Note the token

### 5E: Google Cloud Service Account (for Daily Performance)

1. Go to [console.cloud.google.com](https://console.cloud.google.com)
2. Create a new project (or select an existing one)
3. **Enable APIs:**
   - Search for "Google Analytics Data API" and enable it
   - Search for "Google Search Console API" (or "Search Console API") and enable it
4. **Create a service account:**
   - Go to IAM & Admin > Service Accounts
   - Click "Create Service Account"
   - Give it a name (e.g., "website-cron-reports")
   - Skip the optional role assignment
   - Click "Done"
5. **Create a key:**
   - Click on the service account you just created
   - Go to Keys > Add Key > Create new key > JSON
   - Download the JSON file
   - From this file, you need: `client_email` and `private_key`
6. **Grant GA4 access:**
   - Go to [analytics.google.com](https://analytics.google.com)
   - Admin > Property > Property Access Management
   - Click the + button, add the service account email as **Viewer**
7. **Grant GSC access:**
   - Go to [search.google.com/search-console](https://search.google.com/search-console)
   - Settings > Users and permissions
   - Add the service account email as **Restricted** user
8. **Find your GA4 Property ID:**
   - GA4 Admin > Property > Property details
   - The numeric ID (e.g., `123456789`)

---

## Step 6: Set Environment Variables

Set all variables in the Vercel Dashboard (Settings > Environment Variables) or via Vercel CLI.

### Required for all cron jobs

| Variable | Example | Notes |
|----------|---------|-------|
| `CRON_SECRET` | `my-random-secret-string-here` | Any random string; Vercel sends this in the Authorization header |
| `OPENAI_API_KEY` | `sk-...` | From OpenAI dashboard |
| `RESEND_API_KEY` | `re_...` | From Resend dashboard |
| `RESEND_FROM_EMAIL` | `Aged Lead Sales <newsletter@agedleadsales.com>` | Must be a verified Resend domain |

### Required for content publishing

| Variable | Example | Notes |
|----------|---------|-------|
| `SANITY_API_TOKEN` | `sk...` | Editor-level token from Sanity |
| `NEXT_PUBLIC_SANITY_PROJECT_ID` | `p7rbtajg` | Your Sanity project ID |
| `NEXT_PUBLIC_SANITY_DATASET` | `production` | Usually `production` |

### Required for newsletter broadcasts

| Variable | Example | Notes |
|----------|---------|-------|
| `RESEND_AUDIENCE_ID` | `78261eea-...` | From Resend Audiences |

### Required for GitHub report commits

| Variable | Example | Notes |
|----------|---------|-------|
| `GITHUB_TOKEN` | `github_pat_...` | Fine-grained PAT with contents:write |
| `GITHUB_REPO` | `yourname/your-repo` | Owner/repo format |
| `GITHUB_BRANCH` | `main` | Branch to commit to |

### Required for daily performance reports

| Variable | Example | Notes |
|----------|---------|-------|
| `GOOGLE_CLIENT_EMAIL` | `cron@project.iam.gserviceaccount.com` | From service account JSON |
| `GOOGLE_PRIVATE_KEY` | `-----BEGIN PRIVATE KEY-----\n...` | From service account JSON; keep the `\n` escapes |
| `GA4_PROPERTY_ID` | `123456789` | Numeric ID from GA4 Admin |
| `GSC_SITE_URL` | `https://yourdomain.com` | Exactly as registered in GSC |

### Important: `GOOGLE_PRIVATE_KEY` formatting

The private key from the JSON file contains literal newlines. When pasting into Vercel, paste the full value including the `\n` sequences. The code handles converting `\n` strings to actual newlines:

```typescript
const privateKey = process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, "\n");
```

---

## Step 7: Deploy and Verify

### Initial deploy

1. Commit and push all changes
2. Vercel will auto-deploy
3. Check that the build succeeds — the cron routes should appear as dynamic (`ƒ`) routes:

```
ƒ /api/cron/daily-performance
ƒ /api/cron/seo-audit
ƒ /api/cron/weekly-content
ƒ /api/cron/weekly-newsletter
```

### Test a cron job manually

You can trigger any cron job manually with `curl`:

```bash
curl -X GET "https://yourdomain.com/api/cron/daily-performance" \
  -H "Authorization: Bearer YOUR_CRON_SECRET"
```

Or from the Vercel Dashboard: Settings > Crons > click the run button next to any job.

### Check logs

After a cron job runs, check the function logs in Vercel Dashboard > Logs. Each job logs its progress:

```
[Performance] Starting daily report: 2026-03-15
[Performance] GA4: 142 sessions (7d), 890 sessions (90d)
[Performance] GSC: 45 clicks (7d), 312 clicks (90d)
[Performance] Running AI analysis...
[Performance] Report sent to bill@billricestrategy.com
[Performance] Completed in 8.2s — 0 errors
```

### Incremental setup

You don't have to configure everything at once. The jobs degrade gracefully:

| What's configured | What works |
|-------------------|-----------|
| Only `OPENAI_API_KEY` + `CRON_SECRET` | Content planning and writing (logs output, no publishing) |
| + `SANITY_API_TOKEN` | Content gets published to CMS |
| + `RESEND_API_KEY` | Email reports start arriving |
| + `RESEND_AUDIENCE_ID` | Newsletter broadcasts get scheduled |
| + `GITHUB_TOKEN` + `GITHUB_REPO` | Reports and backlog get committed to repo |
| + Google credentials | Daily performance reports include real GA4/GSC data |

---

## Step 8: Adapting for a New Website

When adding these cron jobs to a new site, follow this checklist:

### Checklist

- [ ] Copy `lib/cron/` directory to the new project
- [ ] Copy `app/api/cron/` directory to the new project
- [ ] Install dependencies: `npm install openai resend google-auth-library`
- [ ] Update `SYSTEM_CONTEXT` in `lib/cron/ai-content.ts` with site-specific details
- [ ] Update `NEWSLETTER_SYSTEM` in `lib/cron/newsletter-ai.ts` with site-specific details
- [ ] Update `AUDIT_SYSTEM` in `lib/cron/seo-audit.ts` with site-specific details
- [ ] Update `REPORT_EMAIL` in each route file
- [ ] Create `data/editorial-calendar.ts` for the site's content plan
- [ ] Create `data/newsletter-calendar.ts` for the site's newsletter plan
- [ ] Update `PILLAR_CATEGORY_MAP` and `LEAD_TYPE_MAP` in `lib/cron/sanity-publish.ts` to match the site's CMS document IDs
- [ ] Update newsletter email branding in `lib/cron/newsletter-email.ts`
- [ ] Add `crons` to `vercel.json`
- [ ] Set all environment variables in Vercel
- [ ] Deploy and test each job manually
- [ ] Monitor the first automated runs in Vercel logs

### What stays the same across sites

These files are reusable without changes:

- `lib/cron/google-auth.ts` — Google authentication
- `lib/cron/ga4-data.ts` — GA4 data fetching
- `lib/cron/gsc-data.ts` — GSC data fetching
- `lib/cron/git-commit.ts` — GitHub commit API
- `lib/cron/types.ts` — TypeScript type definitions

### What changes per site

These files need site-specific updates:

- `lib/cron/ai-content.ts` — System prompt describing the site, its ICP, competitors, and content pillars
- `lib/cron/newsletter-ai.ts` — System prompt for newsletter voice and audience
- `lib/cron/newsletter-email.ts` — Branding, colors, links, CTA URLs
- `lib/cron/seo-audit.ts` — System prompt describing the site's SEO setup and tech stack
- `lib/cron/sanity-publish.ts` — CMS document ID mappings
- `lib/cron/notify.ts` — Only if you change the report email format
- `data/editorial-calendar.ts` — Entirely site-specific
- `data/newsletter-calendar.ts` — Entirely site-specific
- Route files — `REPORT_EMAIL` constant

---

## Architecture Principles

These principles keep the system simple and reliable across all sites:

1. **Direct REST calls over SDK wrappers** — GA4 and GSC use `fetch()` + `google-auth-library` instead of the 40MB `googleapis` package. Less code, smaller bundles, fewer dependency conflicts.

2. **Lazy initialization** — Never instantiate API clients at module scope. Always create them inside the request handler or a function called at runtime. This ensures builds succeed without environment variables configured.

3. **Graceful degradation** — Every external dependency is optional. If GA4 isn't configured, the performance report still works with GSC data. If GitHub isn't configured, reports still get emailed. If Resend isn't configured, reports log to the console.

4. **One concern per file** — Each `lib/cron/` file handles one thing: Google auth, GA4 data, newsletter AI, etc. This makes it easy to swap or update individual pieces.

5. **Parallel where possible, sequential where necessary** — API calls that don't depend on each other (fetching GA4 + GSC data, writing 3 articles) run in parallel with `Promise.all` or `Promise.allSettled`. Steps that depend on previous results run sequentially.

6. **Idempotent operations** — Publishing checks if a document already exists before creating it. This prevents duplicates if a cron job retries after a timeout.

7. **All secrets in environment variables** — No credentials, tokens, or keys in code. Everything is configured through Vercel environment variables.

8. **Shared `CRON_SECRET`** — All cron endpoints use the same secret. Vercel automatically sends `Authorization: Bearer <CRON_SECRET>` when triggering cron jobs.

---

## Troubleshooting

### Build fails with "Missing credentials" or API key errors

API clients are being instantiated at module scope. Wrap them in a function:

```typescript
// Bad — runs at build time
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// Good — runs at request time
function getClient() {
  return new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
}
```

### Cron job returns 401 Unauthorized

The `CRON_SECRET` environment variable isn't set in Vercel, or doesn't match what the route checks. Verify it's set for the correct environment (Production).

### GA4 / GSC returns 403 Forbidden

The service account doesn't have access to the property. Re-check that the service account email was added as a Viewer in GA4 and a Restricted user in GSC.

### `GOOGLE_PRIVATE_KEY` doesn't work

The private key contains `\n` sequences that need to be converted to real newlines. Make sure your code includes:

```typescript
const key = process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, "\n");
```

When pasting into Vercel, paste the raw value from the JSON file including the `\n` escape sequences.

### Newsletter broadcast fails

Verify that `RESEND_AUDIENCE_ID` is set and the audience exists in Resend. The sender address in `RESEND_FROM_EMAIL` must be from a verified domain in Resend.

### Function times out (300s)

The 300s limit is tight for the weekly content job (which writes 3 articles). If it times out:
- Reduce the number of articles per run
- Use a smaller AI model (e.g., `gpt-4o-mini`) for some calls
- Split the work across multiple cron jobs

### GitHub commit fails

Verify `GITHUB_TOKEN` has `contents:write` permission on the specific repository, and `GITHUB_REPO` is in the correct `owner/repo` format.
