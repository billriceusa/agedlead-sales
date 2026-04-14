# Flagship Lead Magnet — The Aged Lead Operator's System

Source content for the flagship lead magnet. All text here is the canonical source; the PDFs in `public/downloads/` are produced from these markdown files.

## Files

| File | Purpose |
|---|---|
| `playbook-master.md` | Vertical-agnostic core playbook (unit economics, setup, outreach framework, nurture, compliance, diagnostic) |
| `playbook-mortgage.md` | Mortgage-specific overlay — scripts, benchmarks, TCPA/LO compliance |
| `playbook-insurance.md` | Insurance-specific overlay — scripts, benchmarks, state DOI rules |
| `playbook-home-services.md` | Home Services overlay — scripts, benchmarks, door-to-door rules |
| `workbook.md` | 10 fillable worksheets (print or PDF form fields) |
| `emails/mortgage.md` | 5 emails, Days 0/2/4/7/10 |
| `emails/insurance.md` | 5 emails, Days 0/2/4/7/10 |
| `emails/home-services.md` | 5 emails, Days 0/2/4/7/10 |

## PDF production workflow

We don't auto-generate PDFs. The markdown is the editable source; the PDF is the branded, laid-out deliverable.

1. Paste `playbook-master.md` + one vertical overlay into a Google Doc.
2. Apply the Aged Lead Sales brand template: navy (`#1e3a5f`) headers, serif body, pullquote boxes, section dividers.
3. Export as PDF.
4. Save to `public/downloads/aged-lead-operators-system-{vertical}.pdf`.
5. Repeat for each vertical (3 playbook PDFs total) and the workbook (3 workbook PDFs total, one per vertical — the workbook body is the same but the examples reference the vertical).

## When content changes

Edit the markdown first. Re-export the PDF. Commit both. The email course (in `lib/email-course/`) is a separate TS source — keep the email TS modules in sync with `emails/*.md` when copy changes.

## Distribution

- Playbook PDFs are served from `public/downloads/` (static, no gate — the gate is the landing page).
- Workbook PDFs ship alongside the playbook on the thank-you page.
- Email course fires via `lib/email-course/schedule.ts` on signup.

## Compliance framing (applies across all assets)

Every playbook + overlay + email carries a Mode A/B/C compliance framing:

- **Mode A** — Conservative: manual dial, plain-text email, fresh-consent ladder. **The recommended default.**
- **Mode B** — Operator Standard: preview dial, SMS only on verified/fresh PEWC, 10DLC, quarterly counsel review.
- **Mode C** — Not recommended: predictive/parallel dialing on inherited consent, RVM at scale, SMS without verified consent.

**Named counsel recommendation across all assets: [Henson Legal](https://www.henson-legal.com/).** Do not substitute a different firm without Bill's approval.

**The Fresh-Consent Ladder** (master playbook, Part IV) is the core operational guidance — the idea that the aged-lead cadence's job is to earn fresh PEWC from each prospect, not to run automation on inherited consent forever. Every vertical overlay includes vertical-specific fresh-consent plays.

When updating compliance language in any file, cross-check the others — rules evolve and language needs to stay consistent across the asset set.
