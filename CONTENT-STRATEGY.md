# workagedleads.com — Content Strategy (AEO/SEO)

**Written:** 2026-08-28  **Standard:** ../_portfolio/AEO-SEO-STANDARD-2026.md

> Written against `origin/main`. Route and content inventory below was read from
> `data/lead-types.ts`, `data/providers.ts`, `data/migration/alsales-sitemap.txt`,
> `data/migration/htwl-sitemap.txt` and `data/migration/url-map.csv` on that branch — not
> guessed. Where I could not verify something, it says so.

---

## What this site can win, and what it cannot

### Cannot win

**Head informational terms in the aged-lead and insurance-lead space.** The property is a
DR 0–25 affiliate/comparison site, which is the precise profile
`AEO-SEO-STANDARD-2026.md` §4 identifies as the worst-positioned category in search right now:
Google's **March 2026 core update explicitly demoted aggregators, directories and comparison
platforms** in favor of primary and institutional sources; **24.1% of top-10 pages fell out of
the top 100 entirely**; affiliate sites sit at ~34% of peak organic traffic and information
blogs at ~28%.

The AI channel is no friendlier. **65.3% of pages ChatGPT cites are DR 81+, median DR 90.** This
site is nowhere near that, and no amount of on-page work closes a 70-point DR gap.

And there is direct local evidence, not just category evidence: **76 published posts produced
34 clicks in 80 days** (`data/gsc-baseline-2026-06-05.json`, 2026-03-14 → 2026-06-01, 0.5% CTR,
avg position ~27). The site now carries ~154 posts. The informational play has been run at
scale here and measured. It does not work.

Add the migration: `workagedleads.com` sits at **average position 65.31 with 0 clicks** on
262 rolling-7d impressions (`data/gsc-trend.json`, 2026-08-27). Any strategy that requires the
new domain to rank in the next quarter is a strategy with no evidence behind it.

### Can win

**Merchant-name and competitor-name queries.** These are the one class of query where authority
barely matters, because the searcher already knows who they want and the page only has to be
findable and honest. The evidence is on the scoreboard:

| Evidence | Value | Source |
|---|---|---|
| `/providers/aged-lead-store` outbound click rate | **43.33%** (39 clicks / 90 views) | `data/loop/ledger.json`, read 2026-08-18 |
| `"the leads warehouse reviews"` | 2 clicks, **position 1.33** | `data/gsc-trend.json`, 2026-08-27 |
| `"aged lead store reviews"` | 1 click, **position 1.13** | `data/gsc-trend.json`, 2026-08-27 |
| Site-wide average position | 19.42 | same |

Two merchant-review queries rank at position ~1 on a domain whose average is 19. That is what
"low authority dependency" looks like in practice.

**Original price data.** The Lead Price Index (106 `priceBenchmark` docs, 81 clearing the
two-provider trust gate, `data/loop/price-index-q3-gap.md`) is the only thing on this property
that is primary research rather than aggregation. Per §3.2 and §4 that is the one asset class
that survives the March 2026 update and reliably earns third-party mentions. Price-index pages
already convert at 8.33–12.50% on 8–24 views each — high conversion, almost no traffic.

**Price-shopping long tail.** The baseline capture's second-largest query cluster is explicitly
price-driven: "leads price", "insurance leads cost", "exclusive life insurance leads price".
That maps directly onto the price index, which is the asset that is stale.

### The blunt version

This site's realistic ceiling is a **few hundred high-intent visits a month converting at
10–40%**, not a traffic property. Every hour spent trying to make it a traffic property is an
hour taken from the pages that already convert at 43%.

---

## Audience and the queries that matter

**Who actually buys:** working producers and small agency owners — insurance agents (life, final
expense, IUL, Medicare, P&C), loan officers and mortgage brokers, personal-injury and SSDI
intake teams, solar and home-services closers. They are buying a **dialing list at cents per
record**, not a lead-gen program. They are price-sensitive, compliance-nervous, and they have
usually been burned by a vendor before.

**Who does not buy:** people researching "what is lead management" or "the customer journey."
Those were the `howtoworkleads.com` `/crm-systems/`, `/lead-management/` and `/sales-process/`
sections — and all 12 of those URLs were correctly marked **PRUNE** in `url-map.csv`. That
judgment was right and should govern future commissioning too.

Query classes, ranked by measured value to this business:

| # | Class | Example | Why it ranks here |
|---|---|---|---|
| 1 | **Merchant navigational/review** | "aged lead store reviews", "agedleadstore" | 43% click-through to the paid event; ranks at position ~1 on a DR-0 domain |
| 2 | **Competitor-brand review** | "the leads warehouse reviews", "lead heroes review" | Already ranking (pos 1.33); 14 head-to-head pages already built |
| 3 | **Price-shopping** | "aged final expense leads price", "insurance leads cost" | Second-largest cluster in the baseline; maps to the Price Index |
| 4 | **Commercial vertical** | "aged mortgage leads", "aged final expense leads" | Highest raw traffic (629 views/mo on four hubs) but converts at ~0.95% |
| 5 | **Compliance / can-I-legally** | "is it legal to call purchased leads", "TCPA aged leads" | High anxiety, high trust-building value, near-zero direct conversion |
| 6 | **Operational how-to** | "aged lead scripts", "best time to call" | The 154-post archive. Measured at 34 clicks / 80 days. Maintain, do not feed |

**Two verticals to stop commissioning against:** Medicare and solar carry 23 URLs and 2,181
impressions but the partner **does not currently sell them** (`BACKLOG.md`, destination set
confirmed by Bill 2026-08-06). Existing pages earn topical authority and stay. New Medicare and
solar content is unmonetizable by construction.

---

## Fan-out coverage map

The method is `AEO-SEO-STANDARD-2026.md` §3.1: an assistant decomposes a head query into
sub-questions and retrieves against those, not against the SERP. Only **37.9%** of
AI-Overview-cited URLs appear in the top 10 at all, and 31–37% of citations come from beyond
position 100 — which is exactly why a DR-0 site with broad sub-question coverage is not
hopeless even though its head-term ranking is.

**GAP = no page on this property answers this sub-question directly under a heading.**
The GAPs are the content queue. Nothing else is.

Coverage was checked against the route inventory and the 154-post slug list on `origin/main`.
Where a section heading exists in a template (e.g. `/lead-types/[slug]`), it is named.

---

### Money page 1 — `/providers/aged-lead-store`
**Head query:** "aged lead store review" / "is aged lead store legit"
**Why it is first:** 39 of the site's 69 affiliate clicks (2026-08-18 reading). Highest `C` on
the property by an order of magnitude.

| # | Sub-question | Answered at |
|---|---|---|
| 1 | Is Aged Lead Store legitimate? | `/providers/aged-lead-store` → **"Our Take"**; `/blog/aged-lead-store-review-2026` |
| 2 | What does it cost per lead? | `/providers/aged-lead-store` → **"Pricing Model"**; `/price-index/{vertical}` |
| 3 | What is the minimum order? | `/providers/aged-lead-store` → **"Minimums"** |
| 4 | Is a contract required? | `/providers/aged-lead-store` → **"Contract Required"** |
| 5 | What happens if the leads are bad — refund or replace? | `/providers/aged-lead-store` → **"Return / Refund Policy"** |
| 6 | Which verticals do they sell? | `/providers/aged-lead-store` → **"Lead Types"** |
| 7 | How are leads delivered (CSV, CRM push, API)? | `/providers/aged-lead-store` → **"Delivery Methods"** |
| 8 | Are the records DNC/TCPA-scrubbed before delivery? | `/providers/aged-lead-store` → **"Compliance Features"**; `/blog/tcpa-compliance-calling-aged-leads`; `/blog/dnc-scrubbing-on-a-budget` |
| 9 | How does it compare to <competitor>? | **All 14** `/compare/aged-lead-store-vs-{slug}` pages exist and are indexed (`app/(site)/compare/[pair]/page.tsx` — the other 91 pairs are deliberately noindex) |
| 10 | How old are the leads / what age brackets? | `/price-index/{vertical}` age-bracket tables; `/lead-types/[slug]` → **"What You Get with Each Lead"** |
| 11 | What conversion rate should I expect? | `/blog/aged-lead-conversion-rates-by-industry-data-benchmarks`; `/blog/aged-lead-performance-benchmarks-2026` |
| 12 | Who runs it / how long have they been around? | `/providers/aged-lead-store` → founded year, HQ state, BBB rating fields |
| 13 | Has anyone actually made money with their leads? | **GAP** — no ALS-specific outcome content. The two operator stories (`/blog/solo-insurance-agent-47-policies-90-days-aged-leads`, `/blog/from-2-to-6-closings-per-month-with-aged-mortgage-leads`) are vendor-agnostic |
| 14 | Can I get a sample file or test batch first? | **GAP** |
| 15 | How does this site make money recommending them? | `/affiliate-disclosure`; `/methodology` → **"Editorial Independence"** |

**Queue from this page:** #13 and #14. Both are short additions to the existing provider page,
not new URLs — §3.1 step 5 prefers a section on a strong page over a new thin one, and this is
the strongest page on the site.

---

### Money page 2 — `/lead-types/mortgage-leads`
**Head query:** "aged mortgage leads"
**Why:** highest-traffic lead-type hub (150 views/30d) and the largest conversion gap on the
site — 1.33% against the provider page's 43.33%.

| # | Sub-question | Answered at |
|---|---|---|
| 1 | What are aged mortgage leads? | `/lead-types/mortgage-leads` → **"What Are Aged Mortgage Leads?"** |
| 2 | What do they cost vs real-time? | same page → **"Why Use…"** cost-comparison block; `/price-index/mortgage` |
| 3 | What data comes on the record? | same page → **"What You Get with Each Lead"** |
| 4 | Who should buy them? | same page → **"Who Uses Aged Mortgage Leads?"** |
| 5 | How do I work them — cadence and channel? | same page → **"How to Work Aged Mortgage Leads"**; `/guides/7-day-aged-lead-follow-up-cadence` |
| 6 | What do I say on the first call? | same page → script block; `/blog/aged-lead-scripts-that-work`; `/blog/mortgage-lead-conversion-playbook` |
| 7 | Refi vs purchase — do they behave differently? | `/blog/aged-refinance-leads-most-undervalued-mortgage-asset`; `/blog/how-to-work-refinance-mortgage-leads`; `/blog/how-to-work-purchase-mortgage-leads` was **PRUNED** — purchase intent now has no dedicated page |
| 8 | Are these trigger leads? Is that legal now? | `/blog/aged-mortgage-leads-vs-trigger-leads-what-loan-officers-need-to-know`; `/blog/trigger-lead-ban-mortgage-buyers` |
| 9 | Can I legally call a purchased mortgage record? | `/blog/is-it-legal-to-call-purchased-leads`; `/blog/tcpa-compliance-lead-buyers`; `/blog/state-by-state-lead-compliance-guide` |
| 10 | What about non-QM / DSCR / bank-statement / HELOC? | `/blog/how-to-work-non-qm-mortgage-leads`, `/how-to-work-dscr-loan-leads`, `/how-to-work-bank-statement-loan-leads`, `/how-to-work-heloc-leads` — all four survived migration as REHOST |
| 11 | What conversion rate do LOs actually get? | `/blog/from-2-to-6-closings-per-month-with-aged-mortgage-leads`; `/blog/aged-lead-conversion-rates-by-industry-data-benchmarks` |
| 12 | How old is too old for a mortgage record? | **GAP** — rate-sensitivity makes decay steeper here than in any other vertical, and nothing on the site says so |
| 13 | How much should I budget to start? | `/blog/insurance-agent-lead-budget` (insurance-framed); `/calculators/know-your-cpl`. **Partial GAP** — no mortgage-specific version |
| 14 | Where do I buy them? | Hero affiliate door (added iteration 2, 2026-08-18); `/providers/best/mortgage` |
| 15 | Aged vs live transfers for mortgage? | `/blog/aged-leads-vs-live-transfers-better-roi-2026` (cross-vertical) |

**Queue:** #12 (as a deep-dive H2 on the existing hub — it is a genuine expertise answer nobody
else publishes and it feeds the price index's age-bracket tables), #7's purchase-intent
replacement, #13 as a paragraph rather than a post.

---

### Money page 3 — `/price-index/final-expense` (pattern for all 11 verticals)
**Head query:** "how much do aged final expense leads cost"
**Why:** price-index pages convert at 8.33–12.50% on 8–24 views. High `C`, no `D`. The missing
trend chart is the reason there is no `D`.

| # | Sub-question | Answered at |
|---|---|---|
| 1 | What do final expense leads cost right now? | `/price-index/final-expense` price tables (4 cells, last verified **2026-04**) |
| 2 | Aged vs real-time price? | same page — `31-85-days` and `real-time` brackets side by side |
| 3 | Exclusive vs shared price? | same page — exclusivity is a table dimension |
| 4 | Direct mail vs internet form? | same page — lead type is a table dimension |
| 5 | Is the price going up or down? | **GAP for 9 of 11 verticals.** `components/price-trend-chart.tsx` needs 3 reliable months; only `life-insurance` and `mca-business-loans` have them. **This is the single highest-leverage gap on the property** — one verified month closes it across nine pages at once |
| 6 | Where do these numbers come from? | `/methodology` → **"How We Collect Pricing Data"**, **"Confidence Levels"**, **"Our Pricing Model"** |
| 7 | How recent is this data? | on-page "Last verified" line + observed/model-estimated counts. Currently reads 2026-04 for most verticals — **honest, and embarrassing** |
| 8 | What is a fair price to pay? | `/calculators/know-your-cpl`, linked from the page header |
| 9 | Who sells at these prices? | `/providers/best/final-expense`, linked from the page header |
| 10 | What do prices look like in my vertical? | `/price-index` hub → 11 verticals |
| 11 | Why are aged leads so much cheaper? | `/lead-types/final-expense-leads` → **"Why Use…"**; `/blog/economics-of-aged-leads` |
| 12 | Does a cheaper lead mean a worse lead? | **GAP** — the central objection to the entire category, and there is no page whose job is to answer it |
| 13 | How do I negotiate a better price? | `/blog/lead-vendor-negotiation-guide` |
| 14 | Can I cite these figures? | `CiteThisButton` + `Dataset` JSON-LD on the statistics page. **Partial** — verify the price-index pages carry the same affordance |

**Queue:** #5 (the Q3 study — this is action 2 in `WORK-PLAN.md` and it closes nine pages),
then #12 as a page-level answer block reused across all 11 price-index pages, then #14 as a
one-line check.

---

### Money page 4 — `/providers/best/final-expense` (pattern for all 12)
**Head query:** "best aged final expense lead providers"
**Why:** `/providers/best/final-expense` earned 3–4 clicks/7d at position ~16 through July
(`data/gsc-trend.json`, 2026-07-10 and 07-11 snapshots) — one of the few pages with both
demand and intent.

| # | Sub-question | Answered at |
|---|---|---|
| 1 | Who are the best final-expense lead vendors? | `/providers/best/final-expense` ranked list |
| 2 | How were they ranked? | `/methodology` → **"How We Rate Providers"**, **"Rating Dimensions"**, **"Scoring Scale"** |
| 3 | What does each one cost? | per-provider **"Pricing Model"**; `/price-index/final-expense` |
| 4 | Which has the best return policy? | **GAP** — the field exists per provider but there is no cross-provider comparison of it. This is a high-anxiety buying criterion |
| 5 | Which has the lowest minimum? | **GAP** — same shape as #4 |
| 6 | Which is best for a brand-new agent? | per-provider **"Best For"** / **"Not Ideal For"**; `/blog/new-insurance-agent-aged-leads-first-90-days` |
| 7 | How do I evaluate a vendor myself? | `/blog/how-to-evaluate-lead-vendor`; `/blog/aged-lead-vendor-scorecard-evaluation` |
| 8 | How do I tell if leads are fake or recycled? | `/blog/lead-fraud-detection-fake-leads`; `/blog/aged-lead-quality-control-checklist` |
| 9 | Should I use more than one vendor? | `/blog/managing-multiple-lead-vendors` |
| 10 | Head-to-head: X vs Y? | 14 `/compare/aged-lead-store-vs-*` pages. **Structural gap:** every comparison has Aged Lead Store on one side. A buyer comparing two competitors finds nothing — deliberate (the other 91 pairs are noindex) and probably correct, but it caps the cluster |
| 11 | Are these reviews paid placements? | `/affiliate-disclosure`; `/methodology` → **"Editorial Independence"** |
| 12 | What do other buyers say? | **GAP** — no first-party review, rating or testimonial surface anywhere on the property |
| 13 | Which vendors are compliant? | per-provider **"Compliance Features"** |
| 14 | Where do I actually buy? | affiliate CTAs |

**Queue:** #4 and #5 together as one comparison table on the `/providers/best/[vertical]`
template — the data already exists in `data/providers.ts` and needs rendering, not writing.
That is a code change producing a differentiated table on twelve pages. It should be scored as
a Click Loop candidate ahead of any new prose.

---

### Money page 5 — `/compare/aged-vs-real-time-leads`
**Head query:** "aged leads vs real time leads"
**Why:** the category-entry question; also the merge target for `howtoworkleads.com/blog/real-cost-aged-vs-fresh-leads-2026`.

| # | Sub-question | Answered at |
|---|---|---|
| 1 | What is the actual price difference? | `/compare/aged-vs-real-time-leads`; `/price-index/{vertical}` (both brackets on one table) |
| 2 | What is the conversion-rate difference? | `/blog/aged-lead-conversion-rates-by-industry-data-benchmarks` |
| 3 | Which has better ROI per dollar? | `/blog/aged-lead-roi-calculation-methodology-by-industry`; `/calculators/roi-calculator` |
| 4 | Does speed-to-lead matter if the lead is 90 days old? | **GAP** — `howtoworkleads.com/blog/speed-to-lead-aged-leads` was **PRUNED** in the migration and nothing replaced it. This is the #1 objection to the category and the site no longer answers it |
| 5 | Aren't aged leads just other people's rejects? | **GAP** — `/lead-types/auto-insurance-leads` answers it well for one vertical ("They Already Bought — That Is the Point") but there is no cross-vertical answer |
| 6 | What volume do I need for aged to work? | `/lead-types/[slug]` → best-practices blocks; `/blog/aged-lead-budget-allocation-strategy`. **Partial** |
| 7 | What about live transfers? | `/blog/aged-leads-vs-live-transfers-better-roi-2026` |
| 8 | What about Facebook ads instead? | `/blog/smart-agents-buy-aged-leads-instead-facebook-ads` |
| 9 | Fresh vs aged — same question, different words | `/blog/aged-leads-vs-fresh-leads`; `/blog/aged-leads-vs-real-time-leads-cost-comparison` |
| 10 | Can I legally call an aged record? | `/blog/is-it-legal-to-call-purchased-leads`; `/blog/tcpa-compliance-calling-aged-leads`; `/blog/tcpa-litigator-scrub` |
| 11 | How old is too old? | **GAP** (cross-vertical version of money page 2 #12) |
| 12 | Which should a beginner start with? | `/start-here`; `/blog/how-to-buy-aged-leads` |
| 13 | Does the answer differ by vertical? | Implicitly across 13 `/lead-types/*` hubs. **No single page states the comparison** |

**Queue:** #4 and #11 are the same gap seen twice and should be one asset — a "lead age and
decay" answer block, placed on `/compare/aged-vs-real-time-leads` and syndicated as a section
on the lead-type hubs. #5 likewise.

---

### The consolidated content queue

Ranked by expected outbound clicks, not by interest. Score with `D × P × C` per
`CLICK-LOOP.md` step 2 before committing.

| # | Gap | Where it lands | Type |
|---|---|---|---|
| 1 | Q3 Price Index — one verified month | 9 `/price-index/{vertical}` pages | Research (Bill) |
| 2 | Return-policy + minimum-order comparison table | `/providers/best/[vertical]` template ×12 | Code, data exists |
| 3 | "How old is too old" / lead decay | `/compare/aged-vs-real-time-leads` + lead-type hubs | Writing, ~1 section |
| 4 | Speed-to-lead for aged records (replaces a PRUNEd page) | `/compare/aged-vs-real-time-leads` | Writing, ~1 section |
| 5 | "Does cheap mean bad?" objection block | `/price-index` template | Writing, ~1 section |
| 6 | Sample-file / test-batch answer + ALS outcome evidence | `/providers/aged-lead-store` | Writing, ~2 paragraphs |
| 7 | `/lead-types/debt-settlement-leads`, `/lead-types/mca-business-loans-leads` | new URLs | Both have price-index verticals and provider coverage but no hub |
| 8 | ACA / Obamacare / homeowners-insurance lead types | new URLs | The partner **sells** these and `lib/affiliate.ts` already maps them; zero coverage here |

Items 1–6 are sections on pages that already exist and already convert. Items 7–8 are the only
new URLs this plan endorses, and they come last.

---

## Content formats that earn here

**Earn their place:**

- **Provider profiles.** 43% click rate, measured. The format works because it is a decision
  document, not an article.
- **Head-to-head comparisons where one side is the merchant.** All 14 built. Caveat below.
- **Dated price tables with a stated method.** The only primary research on the property.
- **Calculators.** `/calculators/pipeline-calculator` converted 9 of 16 sessions — the best
  on-site converter measured — and `/(embed)/calculators/[name]/embed` exists and is **unused**.
  An embed program produces referral traffic and earned mentions without needing a ranking,
  which per §2.2 is worth more than link building.
- **Operator-voice deep dives.** `data/lead-types.ts` already contains genuinely good ones —
  "They Already Bought — That Is the Point," "The Bundle Is the Business." Per §3.2, first-hand
  operator experience is one of only two differentiators this fleet has against DR-90
  encyclopedias. Bill has actually bought and worked these leads. Most of the site does not
  read as though that is true.

**Do not earn their place:**

- **New blog posts as a volume play.** 76 → 34 clicks. Settled.
- **New `/compare/*` pages beyond the 14.** The ledger records comparison pages drawing ~2
  views each. This corrects `CLICK-LOOP.md` Engine A — see the corrections section.
- **Programmatic geo pages** (open P3). A large thin programmatic surface is precisely what
  March 2026 demoted.
- **New Medicare or solar content.** Unmonetizable; the partner does not sell them.

---

## Cadence

**Honest capacity assessment:** since 2026-08-18 the only commits on `origin/main` have been
automated GSC and email cron snapshots. Ten days, zero human commits, on the portfolio's only
revenue-bearing property. `CLICK-LOOP.md` declares a weekly build iteration; iteration 3 was
due ~2026-08-25 and did not happen.

So the defensible cadence is not the one already written down:

| Stream | Cadence | Basis |
|---|---|---|
| Scoreboard read + ledger append | Weekly | Automated; costs nothing |
| Build iteration (one finished asset) | **Fortnightly** | What has actually been sustained. Weekly has lapsed once already |
| Price Index study | Quarterly, next due now | Already lapsed once and cost two months |
| Blog publishing | **Zero scheduled** | Not a pause — a decision. Posts only as fan-out gap fills against a named money page |
| Newsletter | Weekly, running | 2,464 subscribers; the only lever with same-day effect and the one that does not wait on Google |

Per §3.3 there is **no credible 2026 study on optimal publishing cadence** and any number
presented as optimal is invented. The two rules that survive: never batch-publish, and stop
volume plays already measured as failing. Both point the same way here.

If Bill can sustain weekly, raise it after two consecutive weeks of actually doing it — not
before. A documented cadence the site does not keep is worse than an honest fortnightly one.

---

## Page shape standard

Per §2.3 (Indig, 1.2M AI answers / 18,012 verified citations — one analyst's study, not
replicated, but the edits are cheap):

1. **Answer in the first 30%.** 44.2% of citations come from the opening third. The
   `/lead-types/[slug]` template currently opens with a hero, a stat strip, and an affiliate
   door before the first substantive sentence. The direct answer to "what are aged X leads" is
   below all of it. Move an extractable 40–60-word answer above the fold.
2. **Question-formatted H2/H3s.** 78.4% of question-linked citations came from headings. The
   lead-type template already does this well ("What Are Aged Mortgage Leads?", "Why Use…",
   "How to Work…"). The provider template does not — "Our Take," "What They Offer" and
   "Ratings Breakdown" are labels, not questions. Rename them to the questions buyers ask:
   "Is Aged Lead Store worth using?", "What does Aged Lead Store sell, and at what price?",
   "How did we score Aged Lead Store?"
3. **Name entities explicitly.** Highly-cited content averaged 20.6% proper nouns vs 5–8% for
   standard English. Write "AgedLeadStore" and "The Leads Warehouse", not "the vendor" or
   "the platform". This is a mechanical editing pass across the provider and compare templates.
4. **One honest table per commercial page.** Already true on price-index and compare; missing
   on `/providers/best/[vertical]`, which is queue item 2.
5. **Cite the method wherever a number appears.** `/methodology` link. Credibility is the moat
   on a review site — it is why the merchant queries convert at 43%.

---

## Schema: keep / don't bother

Per §1.3: an Ahrefs difference-in-differences study (1,885 pages vs ~4,000 matched controls)
found adding JSON-LD produced **AI Mode +2.4%, ChatGPT +2.2% (both indistinguishable from
zero), Google AI Overviews −4.6%**. Google's own May 2026 guidance: "there's no special
schema.org markup you need to add." **Schema does not buy AI citations.** Keep it only for
rich results that still render, and for entity disambiguation.

**Keep:**

| Type | Where | Why |
|---|---|---|
| `Product` / `Offer` / `AggregateRating` | `/providers/[slug]` | Still renders; provider pages carry real ratings |
| `Review` | provider + review posts | Still renders |
| `Dataset` | `/blog/aged-lead-industry-statistics`, `/price-index/*` | Correct type for the citable asset |
| `Breadcrumb` | site-wide | Still renders |
| `Article` | blog | Still renders |
| `Organization` + `Person` with canonical `@id` and full `sameAs` | site-wide | §1.3 calls the entity layer "genuinely load-bearing." **Needs a rewrite:** the entity almost certainly still resolves to "Aged Lead Sales" on the old domain. Re-point it at Work Aged Leads |
| `SoftwareApplication` | `/calculators/*` | Still renders |

**Stop:**

| Type | Why |
|---|---|
| `FAQPage` | FAQ rich results **stopped appearing 2026-05-07**; Search Console reporting removed June 2026, API support ended August 2026. `CLICK-LOOP.md` step 4 still lists it as a WIRE requirement — remove that line. **Keep writing the Q&A blocks** (every lead-type hub has 6–11 and they are good fan-out coverage per §3.2); just stop justifying them with markup |
| `HowTo` | Gone since 2023. An open backlog item still proposes it for the calculators |
| `Speakable` | No current evidence. `AEO-SEO-STANDARD-2026.md` §1.3 names this site's open "speakable JSON-LD audit" specifically and says to close it unfunded |
| `llms.txt` | Not schema, same category of error. §1.1 — Google: "will neither harm nor help." 97% of published files got zero traffic; AI retrieval bots were 1.1% of requests; when bots requested a *missing* llms.txt the AI-bot share was **zero**. The file is already shipped; leave it, delete the backlog item |

---

## Measurement

**No Ahrefs.** Bill no longer has an account (§5). Two open backlog items on this site depend
on Ahrefs — "Track AEO share-of-voice (Ahrefs Brand Radar)" and the monthly referring-domains
pull behind "Make the disavow a recurring task." Both are unbuildable as written. `CLICK-LOOP.md`
step 2 also lists "Ahrefs / GSC" as the source for the `D` term; it is **GSC impressions only**.

| Need | Tool | Status here |
|---|---|---|
| **Outbound clicks to agedleadstore.com** (the KPI) | `GET /api/reports/outbound-clicks`, GA4 528489903 | Built and working. **One reading exists** (2026-08-18). Weekly reading is the loop's step 1 |
| Per-page click rate (`C`) | same, `affiliate.byPage30d` | Built in iteration 0 |
| Leakage to non-monetized hosts | same | 47% at last reading |
| Organic clicks / impressions / position | GSC via `data/gsc-trend.json` cron | Working daily for both domains — the fleet's only ground truth |
| Query demand (`D`) | GSC impressions as proxy | Directionally sufficient; do not quote Ahrefs volumes |
| **AI citation share** | **Bing Webmaster Tools → AI Performance** | **Not registered.** Free, and the closest first-party substitute for Brand Radar. Named in the portfolio plan as the highest-value unclaimed tool in the fleet |
| Generative AI impressions | GSC Search Generative AI report | Launched Jun 2026. Impressions only, no clicks. AI Mode is folded into the general report, not broken out |
| AI referral sessions | **GA4 source-only custom channel group** | **Not built.** The native "AI Assistant" channel matches source *and* medium, so ChatGPT fragments across three channels; Claude was removed from the list and Perplexity was never in it. Domain set in §5. Applies retroactively |
| Backlink monitoring | GSC Links report | Lower resolution than Ahrefs. Accept it — §2.2 puts backlinks at the bottom of the correlation table |
| Migration progress | `data/gsc-trend.json`, both properties | Working |

**Two KPIs, not one** (§5, Semrush × Indig, 3,981 domain appearances): **62% of AI citations
produce no brand mention.** Track citations and mentions separately once BWT is registered.

**Reality check before over-investing in AI referral:** across 6.77M LLM sessions on 166 GA4
properties, the split was ChatGPT 92.4%, Gemini 3.2%, Perplexity 2.6%, Claude 1.3%, Copilot
0.5%. AI-referral work is ChatGPT work. Note this cuts against an open backlog item on this
site which reads Copilot's 6 sessions → 10 key events as a signal; at that sample size it is
noise.

**One flag on the KPI itself:** the ledger's own note warns that the 2.3 affiliate clicks/day
from `/api/reports/outbound-clicks` counts GA4 outbound click *events*, while the 5.4/day
baseline counts *sessions arriving at* agedleadstore.com. Different denominators. Trend each
series against itself; never subtract one from the other.

---

## What not to write

- **Post #155.** The archive is complete and measured. Every new piece must name the money page
  and fan-out sub-question it closes, or it does not get written.
- **New `/compare/*` pages.** All 14 commercially meaningful pairs exist. **This corrects
  `CLICK-LOOP.md` Engine A**, whose first bullet reads "`aged-lead-store-vs-{competitor}` for
  each of the 14 partner hosts. One exists (`vs-badass-insurance-leads`); 13 do not." All
  fourteen are generated by `generateStaticParams()` in `app/(site)/compare/[pair]/page.tsx`
  and appear in the pre-migration sitemap. The Engine A work is not building them — it is
  finding out why 14 indexed comparison pages draw ~2 views each, and whether the answer is
  demand, ranking, or the pages themselves.
- **New Medicare or solar content.** Partner does not sell them. 23 URLs already earn topical
  authority there; adding more converts nothing.
- **Anything that requires the new domain to rank this quarter.** Position 65.31, 0 clicks.
- **`dateModified` churn.** §2.4 — cited content averages ~1,064 days old; authority beats
  freshness, and refreshing dates without substantive change violates Google guidance and has
  no evidence behind it. Two open backlog items imply date-refresh passes.
- **The five 2026-06-13 editorial briefs** (call-recording consent, sales stack, CRM autopilot,
  scheduling links, AI guardrails) — as posts. Three already shipped as posts and the
  remaining ones should be reclassified as fan-out gap fills or closed.
- **Generic "what is lead management" content.** The `howtoworkleads.com` `/crm-systems/`,
  `/lead-management/` and `/sales-process/` sections — 12 URLs — were all correctly PRUNEd.
  Do not rebuild that surface under a new name.
