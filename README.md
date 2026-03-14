# Aged Lead Store – Sales Training & Strategies

A Next.js + Sanity.io affiliate content site that helps sales professionals learn how to incorporate aged leads into their sales operations. The site drives traffic to [AgedLeadStore.com](https://agedleadstore.com) where visitors can purchase aged leads.

## Tech Stack

- **Framework:** [Next.js](https://nextjs.org/) (App Router)
- **CMS:** [Sanity.io](https://www.sanity.io/) (embedded studio at `/studio`)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/) v4
- **Deployment:** [Vercel](https://vercel.com/)

## Getting Started

### 1. Clone and Install

```bash
git clone <repo-url>
cd agedleadstore-site
npm install
```

### 2. Set Up Sanity

1. Create a project at [sanity.io/manage](https://www.sanity.io/manage)
2. Copy your project ID
3. Create `.env.local` from the example:

```bash
cp .env.example .env.local
```

4. Fill in your Sanity project ID in `.env.local`:

```
NEXT_PUBLIC_SANITY_PROJECT_ID="your-project-id"
NEXT_PUBLIC_SANITY_DATASET="production"
NEXT_PUBLIC_SANITY_API_VERSION="2026-03-14"
```

5. Add `http://localhost:3000` to your Sanity project's CORS origins at [sanity.io/manage](https://www.sanity.io/manage)

### 3. Run Development Server

```bash
npm run dev
```

- **Site:** [http://localhost:3000](http://localhost:3000)
- **Sanity Studio:** [http://localhost:3000/studio](http://localhost:3000/studio)

## Project Structure

```
├── app/
│   ├── (site)/                    # Public-facing site
│   │   ├── page.tsx               # Homepage
│   │   ├── layout.tsx             # Site layout (header + footer)
│   │   ├── blog/                  # Blog listing & posts
│   │   ├── lead-types/            # Lead type pages (mortgage, insurance, etc.)
│   │   ├── playbooks/             # Sales playbooks & guides
│   │   └── about/                 # About page
│   ├── (studio)/                  # Sanity Studio (embedded)
│   │   └── studio/[[...tool]]/    # Studio catch-all route
│   └── globals.css
├── components/                    # Shared React components
│   ├── header.tsx
│   ├── footer.tsx
│   ├── cta-banner.tsx
│   ├── post-card.tsx
│   ├── lead-type-card.tsx
│   ├── playbook-card.tsx
│   └── portable-text.tsx
├── sanity/
│   ├── client.ts                  # Sanity client
│   ├── env.ts                     # Environment variables
│   ├── lib/
│   │   ├── queries.ts             # GROQ queries
│   │   └── image.ts               # Image URL builder
│   └── schemaTypes/               # Content schemas
│       ├── post.ts                # Blog posts
│       ├── leadType.ts            # Lead type pages
│       ├── playbook.ts            # Sales playbooks
│       ├── author.ts              # Authors
│       └── category.ts            # Categories
├── sanity.config.ts               # Sanity studio configuration
└── sanity.cli.ts                  # Sanity CLI configuration
```

## Content Types (Sanity Schemas)

| Type | Description |
|------|-------------|
| **Lead Type** | Industry-specific pages (mortgage, insurance, etc.) with SEO fields and affiliate URLs |
| **Blog Post** | Articles with rich text, images, author, categories, and lead type associations |
| **Playbook** | Step-by-step sales guides with difficulty levels and estimated read times |
| **Author** | Content author profiles |
| **Category** | Blog post categories |

## Lead Types Covered

- Mortgage Leads
- Insurance Leads
- Final Expense Leads
- IUL (Indexed Universal Life) Leads
- SSDI (Social Security Disability) Leads
- MVA (Motor Vehicle Accident) Leads
- Solar Leads
- Medicare Leads

## Deployment

Deploy to Vercel:

```bash
vercel
```

Make sure to set the environment variables in your Vercel project settings and add your production domain to Sanity's CORS origins.
