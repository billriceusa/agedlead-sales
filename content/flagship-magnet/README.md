# Flagship Lead Magnet — The Aged Lead Operator's System

The site's cornerstone lead magnet. This doc is the authoritative system map for anyone (human or Claude agent) working on it.

## What gets shipped

| Artifact | Count | Source | Output |
|---|---|---|---|
| Playbook PDF (~50 pp) | 3 (1/vertical) | `playbook-master.md` + `playbook-{vertical}.md` | `public/downloads/aged-lead-operators-system-{vertical}.pdf` |
| Workbook PDF (26 pp) | 3 (1/vertical) | `workbook.md` | `public/downloads/aged-lead-operators-workbook-{vertical}.pdf` |
| Email course (5 emails) | 3 (1/vertical) | `emails/{vertical}.md` → `lib/email-course/{vertical}.ts` | Sent via Resend `scheduledAt` on Day 0/2/4/7/10 |
| Landing pages | 4 | `app/(site)/playbook/` | `/playbook`, `/playbook/{vertical}` |
| Thank-you pages | 3 | `app/(site)/playbook/[vertical]/thank-you/` | `/playbook/{vertical}/thank-you` |

Verticals: **mortgage**, **insurance**, **home-services**.

## Data flow (signup)

```
User submits email on /playbook/{vertical}
        │
        ▼
POST /api/flagship/signup
        │
        ├─ Validates email + vertical
        ├─ Adds contact to Resend audience (RESEND_AUDIENCE_ID)
        └─ Calls lib/email-course/schedule.ts → scheduleCourse(vertical, ctx)
                │
                ├─ Resend.emails.send(Day 0)           → sent immediately
                ├─ Resend.emails.send(Day 2 scheduledAt) → queued
                ├─ Resend.emails.send(Day 4 scheduledAt) → queued
                ├─ Resend.emails.send(Day 7 scheduledAt) → queued
                └─ Resend.emails.send(Day 10 scheduledAt)→ queued
        │
        ▼
Redirect to /playbook/{vertical}/thank-you
        │ (two PDF download buttons + affiliate CTA)
```

Unsubscribe: `GET /api/flagship/unsubscribe?email=…` patches the Resend contact to `unsubscribed: true`.

## File map

### Content (canonical source — edit here first)
```
content/flagship-magnet/
├── README.md                      ← you are here
├── playbook-master.md             ← vertical-agnostic core (Parts I-VII)
├── playbook-mortgage.md           ← mortgage overlay
├── playbook-insurance.md          ← insurance overlay
├── playbook-home-services.md      ← home-services overlay
├── workbook.md                    ← 10 worksheets (shared across verticals)
└── emails/
    ├── mortgage.md                ← 5-email course text source
    ├── insurance.md               ← (these are read by humans; the TS
    └── home-services.md             modules in lib/email-course/ are live)
```

### Runtime code
```
lib/email-course/
├── types.ts                       ← CourseEmail, EmailContext, Vertical
├── shared.ts                      ← renderShell(), para/heading/list helpers
├── mortgage.ts                    ← 5 CourseEmail objects (HTML + text)
├── insurance.ts                   ← 5 CourseEmail objects
├── home-services.ts               ← 5 CourseEmail objects
└── schedule.ts                    ← scheduleCourse(vertical, ctx)

app/api/flagship/
├── signup/route.ts                ← POST { email, vertical, firstName? }
└── unsubscribe/route.ts           ← GET ?email=…

app/(site)/playbook/
├── page.tsx                       ← /playbook master selector
└── [vertical]/
    ├── page.tsx                   ← /playbook/{vertical} landing
    └── thank-you/page.tsx         ← /playbook/{vertical}/thank-you

components/flagship/
└── flagship-signup-form.tsx       ← client form component

data/flagship-verticals.ts         ← FLAGSHIP_VERTICALS config (hero copy,
                                     bullets, FAQs, PDF paths, campaign tags)
```

### Tooling
```
scripts/
├── build-flagship-pdfs.ts         ← markdown → HTML → headless Chrome → PDF
├── check-flagship-pdfs.ts         ← timestamp check (mtime MD vs PDF)
└── unpublish-old-playbooks.ts     ← one-off: unpublished 4 legacy Sanity docs
```

### npm scripts
```
npm run build:pdfs        # regenerate all 6 PDFs from markdown
npm run flagship:check    # verify PDFs are up-to-date with markdown sources
```

## Rebuild triggers — when PDFs are stale

**Any of these changes means the PDFs need a rebuild:**

1. Edit `content/flagship-magnet/playbook-master.md` → rebuild all 3 playbook PDFs
2. Edit `content/flagship-magnet/playbook-{vertical}.md` → rebuild that vertical's playbook PDF
3. Edit `content/flagship-magnet/workbook.md` → rebuild all 3 workbook PDFs
4. Edit `scripts/build-flagship-pdfs.ts` (HTML template, styling) → rebuild all 6 PDFs

`scripts/check-flagship-pdfs.ts` detects all 4 cases via file mtime comparison.

**For Claude agents editing content:** after any edit in `content/flagship-magnet/`, run `npm run flagship:check`. If it exits non-zero, run `npm run build:pdfs` and commit the updated PDFs in the same commit as the markdown change.

**For email course text changes:** the markdown files in `emails/*.md` are the human-readable source. The *live* code is `lib/email-course/{vertical}.ts`. If you change the email copy, edit **both** — they can drift. A future improvement is to auto-generate the TS modules from the markdown, but today they're maintained in parallel.

## PDF styling (if you want to change the look)

All styling is inline in `scripts/build-flagship-pdfs.ts` in the `htmlShell()` function:

- Cover page: full-bleed navy → blue gradient with gold accent stat
- Body: serif headings in navy (`#1e3a5f`), blue (`#2563eb`) accents, gold (`#c9a54e`) rules above H1s
- Blockquotes render as blue callout boxes (used for Mode A/B/C, CTAs, worksheet callouts)
- Print CSS: letter size, 0.85in × 0.75in margins, `page-break-before: always` on H1
- Footer strap: navy line with "Not legal advice — [Henson Legal](https://www.henson-legal.com/) recommended"

After changing styles, run `npm run build:pdfs` to see the result.

## Compliance framing (baked into every asset)

All playbooks, overlays, and Day 10 emails share:

- **Mode A/B/C disclaimer block** at the top (Conservative / Operator Standard / Not Recommended)
- **Fresh-Consent Ladder** (6 plays) in master playbook Part IV, with vertical-specific plays in each overlay
- **Henson Legal** as the named counsel recommendation (do not substitute without Bill's approval)
- Current 2026 state: FCC 1:1 rule vacated (Jan 2025) / repealed (Aug 2025), revocation-all delayed to Jan 2027, state mini-TCPAs (FL, OK, WA, MD)

If the legal landscape shifts (e.g. new FCC ruling, new state law), update:
1. `content/flagship-magnet/playbook-master.md` — Part VI (Compliance Foundation)
2. Each `content/flagship-magnet/playbook-{vertical}.md` — overlay-specific compliance section
3. Each `content/flagship-magnet/emails/{vertical}.md` — Day 10 email
4. Each `lib/email-course/{vertical}.ts` — Day 10 HTML + plain-text body
5. Run `npm run build:pdfs` to regenerate PDFs
6. `npm run flagship:check` to confirm

## Verification

Local dev:
```bash
npm run dev
open http://localhost:3000/playbook
# → click each vertical, submit a test email, land on thank-you
# → confirm PDFs download, Day 0 email arrives, Days 2/4/7/10 appear
#   in Resend dashboard as scheduled
```

After any content edit, minimum check sequence:
```bash
npm run flagship:check         # should pass
npm run build                  # should compile cleanly
```

## Deployment

No special steps — pushing to `main` deploys via Vercel. Env vars reused:
- `RESEND_API_KEY` (existing)
- `RESEND_AUDIENCE_ID` (existing — main newsletter audience)
- `NEXT_PUBLIC_SITE_URL` (existing)
- `SANITY_API_TOKEN` (for the unpublish script only; not needed at runtime)

`public/downloads/*.pdf` is committed to the repo (1 MB each) — Vercel serves statics from the build.
