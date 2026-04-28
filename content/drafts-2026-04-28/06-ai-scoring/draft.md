---
title: "AI Lead Scoring for Aged Lists: Rank Your Buy List Before You Dial"
slug: ai-lead-scoring-aged-leads
excerpt: "Most aged-lead operations dial in the order leads arrived in the CRM — the slowest possible path to revenue. A simple weighted scoring model, augmented with AI for the messier signals, can double your contact-to-conversion rate by ensuring you call the highest-probability records first. Here's how, in three escalating tiers of sophistication."
publishedAt: 2026-05-13T09:00:00.000Z
author: bill-rice
category: tactics
primaryKeyword: AI lead scoring aged leads
contentType: methodology
wordCount: ~2500
---

# AI Lead Scoring for Aged Lists: Rank Your Buy List Before You Dial

You bought 5,000 aged leads. They're sitting in your CRM. The question every operator faces next is the one almost nobody answers well: which records do I call first?

Most agents answer with "the order they arrived." That's the slowest possible path to revenue. The high-probability records — the ones most likely to answer the phone, have a real conversation, and bind a policy — are scattered randomly through the file. The agent who works the file in arrival order is calling those records on day 21, 22, 23 of the cadence, when conversion math has already decayed by 30-40%.

The agent who scores the file before dialing — even with a five-minute spreadsheet model — calls those high-probability records on day one. That single change can double the conversion rate of the same exact inventory.

This article walks the methodology in three escalating tiers. Pick the tier that matches your scale.

## Why scoring matters more for aged leads than for any other inventory

It's worth understanding why aged leads, specifically, reward scoring more than other lead types.

Real-time leads come pre-scored. The aggregator or carrier who sold the lead to you has already filtered the consumer through an underwriting screen, a fraud screen, a duplicate screen, and usually an intent-tier algorithm. You're paying $30-$100 per real-time lead in part because the filtering work has been done before delivery. The marginal value of additional scoring on a real-time list is small.

Aged leads are deliberately unfiltered or lightly filtered. That's why they're cheap. The filtering work transfers to you. A $0.40 aged auto lead and a $40 real-time auto lead may carry identical underlying consumer data, but the real-time record has been pre-screened on six dimensions and the aged record has been screened on roughly two (geography and basic data validity).

That's not a flaw in aged inventory. It's the source of the price advantage. But it does mean the operator has to do screening work that the aggregator was doing before. Scoring is that work.

The conversion math also compresses fast on aged inventory. A 25% cumulative contact rate over a 14-day, six-touch cadence means most of the conversion happens in the first seven days. After that, the prospects who were going to engage have engaged, and the ones who weren't are increasingly unreachable. If you're calling your highest-probability records on day one and your lowest-probability records on day twelve, your effective conversion is 30-40% higher than calling them in arrival order.

## The variables that actually predict aged-lead conversion

Six variables, ranked roughly by predictive power. The exact ranking varies by vertical and by market, but this is a defensible starting point.

**Lead age** — recency to original form fill. Newer = higher contact rate, but the curve is not linear. A 30-day lead converts roughly 1.5x as well as a 90-day lead, not 3x. Past 90 days, the conversion rate flattens.

**Original intent specificity**. A consumer who entered a specific loan amount, coverage amount, vehicle make/model, or stated need (refi vs purchase, term vs whole life) converts substantially better than one who left fields blank or used defaults. The act of typing specific numbers signals real intent. The blank-field consumer was test-driving the form.

**Source quality**. Where the original form lived. Aggregator (LendingTree, Bankrate, EverQuote, QuoteWizard) is the highest-converting source tier — these consumers were in active rate-shop mode. Niche site (a category-specific quote engine) is second. Affiliate co-registration (a form embedded inside an unrelated quiz or sweepstakes) is third. Social media lead gen (Facebook, Instagram lead forms) is fourth and converts notably worse than the others.

**Geography fit**. In-state vs out-of-state, target ZIP density, urban vs rural. Higher fit = higher conversion because your underwriting and rate competitiveness are sharper in your home market.

**Phone validation**. Validated mobile > validated landline > unvalidated number > known-disconnected. Disconnected numbers convert at zero, full stop. If your provider does phone validation at delivery, use that data ruthlessly.

**Demographic fit for the product**. Age band (especially relevant for FE, MedSupp, IUL), income proxy (relevant for IUL and high face-amount term), household composition (relevant for term life and ACA family plans). The more demographic data you have, the more this variable can carry.

Each variable is independently weak. The combination is powerful.

## Tier 1: A simple weighted scoring model in a spreadsheet

This is enough for most solo agents. You can build it in 30 minutes. Don't reach for AI before you've built this.

The structure: each record gets scored 1-10 on each of the six variables. Each variable is weighted. The weighted scores sum to a composite 1-10. You sort the file descending and dial in score order.

Suggested weights for a starting point — adjust based on your data:

| Variable | Weight | Score 10 | Score 1 |
|---|---|---|---|
| Lead age | 25% | 8-30 days | 181-365 days |
| Intent specificity | 20% | All fields filled with specific values | Mostly blank or default |
| Source quality | 20% | Major aggregator | Social or unknown |
| Geography fit | 15% | In target ZIP cluster | Out of state |
| Phone validation | 10% | Validated mobile | Unvalidated or known bad |
| Demographic fit | 10% | Strong product match | Poor product match |

Composite score = (age × 0.25) + (intent × 0.20) + (source × 0.20) + (geography × 0.15) + (phone × 0.10) + (demographic × 0.10).

Walk through three sample aged mortgage records:

**Record 1.** 45-day-old refinance lead from LendingTree. Loan amount $325K specified, in-state, validated mobile, demographic fits target.
- Age 8, intent 9, source 10, geography 10, phone 10, demographic 9
- Composite = (8 × 0.25) + (9 × 0.20) + (10 × 0.20) + (10 × 0.15) + (10 × 0.10) + (9 × 0.10) = **9.2 — call day 1.**

**Record 2.** 120-day-old purchase lead from a co-registration affiliate site. No loan amount specified, in-state, validated landline, demographic generic.
- Age 4, intent 3, source 4, geography 8, phone 6, demographic 5
- Composite = (4 × 0.25) + (3 × 0.20) + (4 × 0.20) + (8 × 0.15) + (6 × 0.10) + (5 × 0.10) = **4.7 — call week 2.**

**Record 3.** 200-day-old refi lead from Bankrate. Specific loan amount, out-of-state, unverified phone, demographic neutral.
- Age 2, intent 9, source 10, geography 2, phone 4, demographic 6
- Composite = (2 × 0.25) + (9 × 0.20) + (10 × 0.20) + (2 × 0.15) + (4 × 0.10) + (6 × 0.10) = **5.6 — call mid-week 1.**

That's the entire model. Build it in Google Sheets or Excel, sort the column, dial in order. For most solo and small-team aged-lead operations, this is enough.

## Tier 2: AI-augmented scoring for batches

When does AI add real value beyond the spreadsheet? When you have unstructured signals that don't fit a 1-10 score.

The four signals worth running an LLM against:

Free-text comment fields. A consumer who typed "interested in a 30-year fixed for a duplex in Phoenix" in a comment box is qualitatively different from one who left it blank. The LLM can read the comment and apply a contextual score adjustment.

Form-fill timestamps that suggest engagement quality. A form filled at 2 AM has different intent than one filled at 11 AM on a weekday. A form filled three times in 90 minutes (the consumer tested the system) has different intent than a single submission.

Cross-batch deduplication. If a consumer appears in two or three aged batches you've bought from different providers, that's a signal of ongoing intent — they kept filling forms after the original. That signal is invisible to your spreadsheet model unless you build deduplication separately.

Sentiment analysis on prior interaction notes. If the consumer has any prior contact in your CRM (inbound call, email reply, SMS), an LLM can read the notes and flag positive or negative sentiment that should adjust the score.

A working batch-scoring prompt for ChatGPT or Claude:

```
You are scoring aged [VERTICAL] leads for dial priority. Each record
has the following fields: [FIELDS].

Step 1: Apply the weighted base score using these weights:
- Lead age: 25%
- Intent specificity: 20%
- Source quality: 20%
- Geography fit: 15% (in-state = high, out-of-state = low; my state
  is [STATE])
- Phone validation: 10%
- Demographic fit: 10%

Score each variable 1-10 and compute a weighted base score.

Step 2: Apply qualitative overrides:
- Free-text comments suggesting specific active interest: +0.5 to +1.5
- Form fill timestamp 9am-9pm weekday: +0.3
- Form fill timestamp suggests testing (multiple submissions in same
  session): -0.3
- Multi-batch deduplication signal (record appears 2+ times): +1.0
- Negative signals (anger language, explicit opt-out indication,
  obviously generic placeholder data): -0.5 to -2.0

Step 3: Return the records sorted by final score, with a one-line
justification per record. Do not invent data or signals not present
in the record.
```

Run this in batches of 50-200 records. Not 5,000 at a time. Token economics and output accuracy degrade past that batch size. For a 5,000-record file, run 25 batches of 200 over the course of an afternoon.

Cost reference: at GPT-4o-mini or Claude Haiku pricing, scoring a 5,000-record file end-to-end costs roughly $5-$25 in API or web-tier tokens. That's well under the cost of a single bound policy.

## Tier 3: API-based scoring for high-volume operations

For operations buying 10,000+ aged leads per month, manual or web-tier batch workflows don't scale. The API integration approach handles it automatically.

The architecture is simple. On lead import to your CRM, an API call (or a thin Python or Node.js service that sits between the lead import and the CRM) sends each record — or a micro-batch of 10-20 — to the OpenAI or Anthropic API. The response writes a score to a custom field on the lead record. The CRM sorts on that field for dial priority.

Most modern CRMs support this workflow either natively or through standard integrations. HubSpot, Salesforce, Better Agency, AgencyZoom, Radius, and Bonzo all have API hooks that can write a score field on import. If you don't have a CRM with native API support, a 200-line Python service running on a $5/month VPS does the job.

Reference cost at scale: roughly $0.001-$0.005 per record using GPT-4o-mini or Claude Haiku. At $0.003 per record × 10,000 records per month = $30/month. The cost is negligible relative to lead spend.

One caveat that matters: don't build Tier 3 before you've validated that Tier 1 actually works for your operation. I've seen agents build sophisticated scoring infrastructure before they understood which variables actually predict conversion in their specific market — and end up with a beautifully automated system optimizing for the wrong variables. Build the spreadsheet first. Tune it on real conversion data. Then automate.

## Where commercial tools fit

A brief honest assessment, because the AI-tools market for sales is loud and most of it doesn't apply to B2C aged leads.

Most B2B lead-scoring tools (Clay, Warmly, Common Room, Apollo, Bombora, 6sense) assume firmographic signals — company size, industry, tech stack — and behavioral intent signals from B2B data sources. None of those apply to individual consumers buying insurance, mortgage, or Medicare. Don't pay for B2B tooling and try to retrofit it onto B2C aged leads. It won't work, and the cost is not trivial.

A handful of insurance-specific lead distribution platforms (LeadConduit, ActiveProspect, Boberdoo) include scoring features that work well for real-time lead routing. They generally don't process aged inventory after the fact — they're built for live distribution decisions, not for ranking a static aged batch.

For B2C aged leads in 2026, the practical landscape is: build the model yourself with a spreadsheet (Tier 1), augment with LLM batches (Tier 2), or integrate via API at scale (Tier 3). The off-the-shelf tooling that does this specifically and well doesn't really exist yet.

## Validating your scoring model — the 30-day review

You can't tell if your scoring works without measuring. This is the part most operators skip, and it's the difference between scoring that compounds value and scoring that's a waste of effort.

After 30 days of scored dialing, run this analysis:

Split your scored records into quintiles by composite score. Top 20% (quintile 1) through bottom 20% (quintile 5).

Compare conversion rates across quintiles. Specifically: contact rate, conversation rate, quote rate, bind rate. The four metrics should show a steady gradient from top quintile to bottom.

The diagnostic:

If quintile 1 converts 2x or better than quintile 5, your model is working. Keep the weights, refine the qualitative overrides, expand the AI batch coverage.

If quintile 1 converts 1.5-2x better than quintile 5, the model has signal but the weights need tuning. Look at which variables actually correlate with conversion in your data and reweight accordingly.

If quintile 1 converts 1.2x or less better than quintile 5, the variables you're using don't predict conversion in your specific market. Either the variables are wrong, the weights are wrong, or your sample size is too small to draw conclusions. Most likely the third — wait until you have at least 500 calls before drawing strong conclusions.

The scoring model that doesn't get tuned with real conversion data is worth less than no scoring model at all.

## Common scoring mistakes

A few patterns that consistently cost agents money on aged lead scoring:

Weighting freshness too heavily. The age curve isn't linear past 30 days. A 30-day lead is roughly 1.5x as good as a 90-day lead, not 3x. If your lead-age weight is producing scores that put 30-day leads dramatically above 90-day leads, you're over-weighting it.

Ignoring source quality. The aggregator-vs-affiliate distinction is the second-biggest predictor of conversion after age, and most spreadsheet models don't capture it because the data isn't always cleanly tagged. Get the source data from your provider before you start scoring.

Over-fitting to small samples. Don't reweight your model after 50 calls. Wait for 500. Random variance in small samples will tell you a lot of false stories about what's working.

Scoring once and never retuning. Markets change. Your underwriting changes. Your scripts change. The scoring model that worked in Q1 may not work in Q4. Plan to revisit weights every 90 days.

Trusting AI-generated qualitative scores without spot-checking. The LLM will sometimes apply qualitative overrides based on text that doesn't actually justify them. Spot-check 10-20 records per batch and verify the model's reasoning makes sense before trusting it at scale.

## How scoring integrates with your cadence

The scored list feeds your existing 14-day cadence. Each tier gets the same six-touch sequence — but the timing of the FIRST touch is what scoring drives.

A common allocation that works:

- Day 1-2: top quintile (highest scores). Initial call, voicemail, follow-up call.
- Day 3-5: second quintile. Same six-touch cadence offset by 2 days.
- Day 6-9: third quintile. Same cadence offset by 5 days.
- Day 10-14: bottom two quintiles. Same cadence offset by 9 days.

The records most likely to convert get the freshest call window. The records least likely to convert get the residual capacity at the end of the week. Same cadence, same effort, dramatically different conversion math because the highest-probability records aren't waiting until day 12 to receive their first dial.

Pair this with the [outreach cadence calculator](/calculators/outreach-cadence) to model the touches against your specific volume and call capacity.

## What this means for you

Scoring aged leads before you dial isn't a technology question. It's a sequencing question. The same 5,000 records you bought are going to convert differently depending on whether you call the high-probability ones first or last. The scoring methodology — spreadsheet, AI-augmented, or API-integrated — is just the mechanism for ensuring you make the right sequencing decision.

A few takeaways:

- Build the spreadsheet model before you build anything else. Most aged-lead operations never need to graduate past it.
- The six variables that predict conversion are: lead age, intent specificity, source quality, geography fit, phone validation, and demographic fit. The combination is more predictive than any one alone.
- AI augmentation is most valuable for unstructured signals — comment fields, timestamps, sentiment, deduplication — that don't fit cleanly in a spreadsheet.
- Validate your model after 30 days of scored dialing. If your top quintile isn't converting 2x your bottom quintile, the model needs tuning.
- The goal of scoring isn't accuracy. It's sequencing. Call the highest-probability records first.

Pair this methodology with [Setting Up Your CRM for Aged Leads](/blog/setting-up-your-crm-for-aged-leads) for the CRM data structure that supports scoring at scale, and [The Weekly Numbers Review](/blog/the-weekly-numbers-review) for the disciplined measurement habit that turns a one-time scoring model into a continuously-tuned operating advantage.

The agents who run scored cadences in 2026 aren't more technically sophisticated than the agents who don't. They're more disciplined about deciding which records to call first.
