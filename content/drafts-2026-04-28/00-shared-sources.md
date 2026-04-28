# Shared sources & 2026 industry data

Authoritative pool every draft pulls from. Don't re-fetch — update this file if anything is wrong.

## Internal canonical data (use these for cross-article consistency)

- **Price benchmarks**: `/data/price-benchmarks.ts` — site's authoritative pricing table, March 2026 sourced. **Always reconcile prices in articles to this file.**
- **Provider profiles**: `/data/providers.ts` — 16 providers with 6-dimension ratings.
- **Verticals**: `/data/verticals.ts` — 15+ vertical metadata.
- **Lead types**: `/data/lead-types.ts` — 9 lead-type pages.
- **Glossary**: 77 terms, auto-tooltipped on first mention.
- **Calculators**: ROI, Lead Cost, Pipeline, Outreach Cadence, Know Your CPL — all embeddable.

## Mortgage — pricing benchmarks (2026)

Internal `/data/price-benchmarks.ts` mortgage section:

| Type | Age | Exclusivity | Low | Median | High |
|------|-----|-------------|-----|--------|------|
| Internet form | Real-time | Shared | $20 | $45 | $100 |
| Internet form | Real-time | Exclusive | $50 | $100 | $200 |
| Live transfer | Real-time | Exclusive | $75 | $120 | $175 |
| Internet form | 8-30 days | Shared | $3 | $7 | $15 |
| Internet form | 31-85 days | Shared | $2 | $4 | $8 |
| Internet form | 86-180 days | Shared | $0.50 | $2 | $5 |
| Internet form | 181-365 days | Shared | $0.25 | $1 | $3 |
| Trigger/credit | 31-85 days | Shared | $0.15 | $0.35 | $0.50 |

External cross-references:
- Bankrate per-lead (2026): ~$100-250+
- LendingTree: $30-100, sold to 5+ lenders
- Zillow: $75-150
- Aged at major aggregator (AgedLeadStore): $0.25-1.50 typical

## Mortgage — regulatory: trigger leads ban (CRITICAL CONTEXT)

**Homebuyers Privacy Protection Act (S.1467 / H.R.2808)**:
- Signed into law: **September 5, 2025**
- Effective date: **March 5, 2026** (already in effect at time of writing)
- Amends the Fair Credit Reporting Act (FCRA)
- Bans consumer reporting agencies from furnishing trigger leads to third parties **except where the third party has an existing relationship with the consumer** (current servicer, current bank, etc.)
- Sponsored by Senators Jack Reed (D-RI) and Bill Hagerty (R-TN)

**What this means operationally:**
- Trigger leads as a category are effectively dead for cold-outreach loan officers
- The largest "non-referral, non-internet-form" mortgage lead source has been eliminated
- Aged internet-form mortgage leads, refinance specifically, become the dominant low-cost channel for non-referral acquisition
- Real-time internet-form leads (Bankrate/LendingTree/Zillow) will likely see price pressure UP as displaced trigger-lead buyers enter that auction

**This is the single most important context for the mortgage pillar article.**

## Auto insurance — pricing (2026)

| Type | Pricing |
|------|---------|
| Shared real-time internet form | $10-30 (industry), $20-45 (site benchmark) |
| Exclusive real-time | $25-100 |
| Live transfer | $25-75 |
| Aged 31-85 days shared | $0.25-0.50 |
| Aged 86-180 days shared | $0.25-0.50 |

Key context: Auto carriers heavily use telematics (Progressive Snapshot, State Farm Drive Safe & Save, Allstate Drivewise) — pricing for "good driver" vs "non-standard" splits the lead-buying market. Non-standard auto agents (high-risk SR-22 drivers) are the sub-segment most willing to pay for aged leads — they're working a smaller, harder-to-place pool.

## Life insurance — pricing (2026)

| Sub-vertical | Real-time | Aged |
|---|---|---|
| Term life (mid-market) | $30-50 | $5-15 |
| Final expense (internet form) | $15-65 | $0.62-1.88 |
| Final expense (direct mail response, exclusive) | n/a | $8-25 |
| Final expense (live transfer) | $50-80 | n/a |
| IUL (high-net-worth) | $40+ | $2-6 (CPS $40-200) |

Commission context (Bill should know but worth noting):
- Term: low premiums ($40/mo for healthy 40yo, $500K), low FYC, high volume model
- Final expense: $30-80/mo premiums, often whole life, ~$500-1,500 FYC per sale
- IUL: $300-1,000+/mo premiums, $3,000-10,000+ FYC per sale — math justifies higher CPL

## Health insurance — pricing & regulatory (2026)

| Vertical | Real-time | Aged |
|---|---|---|
| Health/ACA | $20-40 shared, $50-100 exclusive | $0.50-0.94 (31-85 day shared) |
| Medicare (MA/MAPD) | $30-60 shared, $75-150 exclusive | $1.50-8 (limited supply) |
| Medicare live transfer | $50-100 | n/a |

**CMS final rule (CY 2025, in effect since October 1, 2024)** — *still applies in 2026*:
- TPMOs (third-party marketing organizations, including agents and lead generators) **must obtain prior express written consent BEFORE sharing a beneficiary's personal data with another TPMO** for marketing/enrollment purposes
- Consent must be obtained **separately for each TPMO** that receives the data
- "Clear and conspicuous disclosure" required
- Blanket "I agree to be contacted by partners" consent is no longer sufficient
- Citation: 42 CFR 422 Subpart V; CMS-4205-F (CY 2025) and CMS-4208-F (CY 2026)

**Operational implication for aged Medicare lead buyers:**
- Many "aged Medicare leads" sold today were originated under the old broad-consent regime → may not hold up under current CMS rules if you're a TPMO contacting the beneficiary for enrollment
- Cleanest path: aged Medicare leads originated post-October-2024 with TPMO-specific consent on the original form, OR leads worked outside TPMO scope (Medicare Supplement is regulated separately and is more flexible)
- Final Expense and Med Supp aged leads remain operationally cleaner than aged MA leads

**ACA / Marketplace 2026:**
- Plan Year 2026 marketplace open enrollment: Nov 1, 2025 – Jan 15, 2026 (already past)
- Annual cycle creates a Q4 demand surge → aged ACA leads from Q1-Q2 2026 will be at the bottom of the pricing curve in Q3-Q4 2026

## TCPA — current state of play (2026)

Pulled from memory + Henson Legal recent work:

- **FCC 1:1 consent rule**: vacated by 11th Circuit (Insurance Marketing Coalition v. FCC) Jan 2025; FCC formally repealed it Aug 2025. → Consumers no longer required to give per-seller consent on lead-gen forms; one-to-many disclosed consent OK federally.
- **Consent revocation**: FCC rule effective April 2025 — consumers may revoke via "any reasonable means," and revocation must be honored within **10 business days** (was 30). Revocation made on an informational call applies to all marketing as well.
- **AI voice = "artificial voice" under TCPA § 227(b)(1)** (FCC Feb 2024 ruling). Marketing calls using AI voice require **prior express written consent**.
- **Bradford v. Salesloft (5th Cir., Feb 2026)**: oral consent can serve as TCPA defense in TX, LA, MS — **but written consent is still the only safe path nationally**.
- **State mini-TCPAs active**: FL FTSA, OK OTSA, WA HB 1497, MD, TX. State statutes can be more restrictive than federal.
- **Big Jan 2027 wildcard**: original FCC revocation-all rule (revocation of ANY communication revokes ALL marketing) was delayed to Jan 2027 effective date. Watch this carefully.
- **Henson Legal** is the named TCPA counsel referenced across the flagship system — link to https://www.henson-legal.com/ when citing.

## AI in sales — 2026 landscape

- **OpenAI Apps Platform**: Better launched conversational mortgage credit decision engine inside ChatGPT (April 2026). Tuio (home insurance, EU) was first insurer approved on the platform (Feb 2026). Distribution is shifting.
- **AI voice agents**: Bigly Sales, Air.ai, Synthflow, Retell AI are the live category leaders. All face the FCC artificial-voice TCPA rule.
- **Lead scoring tools**: Warmly, Common Room, Clay (B2B-focused). For B2C aged leads, no off-the-shelf tool dominates — most operators DIY with GPT-4/Claude over CSVs.
- **CRM-side AI**: HubSpot, Salesforce, Lofty, Better Agency all shipping AI lead scoring. Predictive scoring for B2C insurance/mortgage is harder than B2B because intent changes daily and there's no firmographic signal — just demographic + behavioral.

## AgedLeadStore — review research data

**Company facts:**
- Founded: 1999 (Tustin, CA — though FL HQ per site listing; verify)
- BBB: A+
- Tagline: "the largest on-demand aged internet lead marketplace"
- Verticals offered: 13+ (mortgage, auto, life, FE, health, Medicare, solar, home improvement, debt, MCA, legal, auto warranty, annuity/IUL)
- Pricing model: fully transparent published per-lead pricing
- Minimums: none
- Contracts: none
- Return policy: up to 20% return cap for wrong/disconnected numbers

**Customer review signal:**
- Birdeye: 4.6/5 (25 reviews)
- ProvenExpert: 3.70/5
- Trustpilot: presence, mixed reviews (need to verify current count)
- Insurance-Forums.com threads: longstanding discussions, generally positive on transparency, mixed on lead quality variance
- Common positive signal: Troy (customer service) responsive; transparent pricing; no surprise minimums
- Common negative signal: lead quality variance (one reported 180/344 solar leads bad); aged-only limitation
- Operational claim: 75% more callable leads vs competitors via internal/external phone validation

**Direct competitors for the review:**
- The Leads Warehouse — multi-vertical, broader product line (real-time, live transfer, direct mail), less transparent pricing
- iLeads (CoreLogic-owned) — credit-triggered focus, premium pricing, enterprise
- LeadPoint — aged + real-time mix, recommends combining the two
- Need-A-Lead — smaller, niche
- LeadsData, Aged Leads Depot — value-tier

**Site's own provider comparison:**
- AgedLeadStore overall rating in `/data/providers.ts`: 8.65 weighted (10/8/7/9/8/9 across transparency/value/compliance/flexibility/platform/reputation)
- Best for: beginners, solo agents, transparent pricing, no minimums, multi-vertical buyers
- Not ideal for: real-time buyers, enterprise API needs, live transfer buyers

## Cross-article internal links to be aware of

When drafting, link to these existing posts where the topic intersects (preserves topical authority):

- `/blog/how-much-do-aged-leads-cost-2026` — overall pricing pillar
- `/blog/aged-mortgage-leads-vs-trigger-leads-what-loan-officers-need-to-know` — *needs update post-trigger ban*
- `/blog/aged-refinance-leads-most-undervalued-mortgage-asset`
- `/blog/from-2-to-6-closings-per-month-with-aged-mortgage-leads` (scenario)
- `/blog/mortgage-broker-pipeline-aged-leads`
- `/blog/aged-leads-vs-real-time-leads-cost-comparison`
- `/blog/economics-of-aged-leads`
- `/blog/aged-life-insurance-leads-scripts-strategies-agents`
- `/blog/aged-auto-insurance-leads-overlooked-goldmine-pc-agents`
- `/blog/auto-insurance-aged-leads-cross-sell-strategy-double-revenue`
- `/blog/aged-health-insurance-leads-open-enrollment-sep-strategies-2026`
- `/blog/year-round-medicare-prospecting-aged-leads-beyond-aep`
- `/blog/medicare-aep-strategy-aged-leads-open-enrollment`
- `/blog/how-to-sell-iul-using-aged-leads-consultative-approach`
- `/blog/iul-lead-conversion-financial-advisors-consultative`
- `/blog/final-expense-telesales-close-aged-leads-over-phone`
- `/blog/tcpa-compliance-calling-aged-leads`
- `/blog/best-aged-lead-providers-compared-where-to-buy-aged-leads-2026`
- `/blog/aged-lead-scripts-actually-work-examples`
- `/blog/aged-lead-follow-up-machine-crm-dialer`
- `/blog/aged-lead-conversion-rates-by-industry-data-benchmarks`
- `/calculators/roi`, `/calculators/lead-cost`, `/calculators/pipeline`, `/calculators/outreach-cadence`, `/calculators/know-your-cpl`
- `/providers/aged-lead-store`, `/price-index/*`

## Affiliate convention reminder

- All AgedLeadStore.com links go through `lib/affiliate.ts` for UTM tagging.
- Soft mention near the close, never in lede.
- The review article (#7) is the exception — that's a category review, prominent disclosure above the fold required (FTC).
