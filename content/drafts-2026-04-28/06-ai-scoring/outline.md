# Article 6: AI Lead Scoring for Aged Lists — Rank Your Buy List Before You Dial

## Target query
Primary: "AI lead scoring", "lead scoring aged leads", "rank aged leads"
Secondary: "lead scoring for sales", "lead scoring spreadsheet", "lead prioritization", "AI lead prioritization"

## Strategic role
Strategic + tactical piece. Turns the question "I just bought 5,000 aged leads — now what?" into a clear three-tier methodology for ranking the list before the first dial. Differentiation: most "AI lead scoring" content is B2B-focused (Warmly, Clay, Common Room) and doesn't apply to B2C aged-lead workflows.

## Hook / thesis
Most aged-lead operations treat their lists as undifferentiated piles. They dial in the order leads arrived in the CRM. That's the slowest possible path to revenue. A simple weighted scoring model — built in a spreadsheet, augmented by AI for the messier signals — can double your contact-to-conversion rate by ensuring you call the highest-probability records first. This article shows how, in three escalating sophistication tiers.

## Length target
2,300-2,700 words

## Structure

### Opening (200 words)
You bought 5,000 aged leads. They sit in your CRM. The question every operator faces next is: which ones do I call first? Most agents answer with "the order they arrived," which is the slowest possible path to revenue. The high-probability records — the ones most likely to answer the phone, have a real conversation, and bind a policy — are scattered randomly through the file. The agent who works the file in arrival order is calling those records on day 21, 22, 23 of the cadence, not day 1 or 2 when conversion math is sharpest.

This article walks the methodology for ranking aged leads before you dial. It's three tiers of sophistication: a spreadsheet-based weighted score anyone can build in 30 minutes, an AI-augmented version that handles messy signals in batches, and an API-integrated version for high-volume operations. Pick the tier that matches your scale.

### H2: Why scoring matters more for aged leads than for any other inventory
- Real-time leads come pre-scored: the carrier or aggregator already filtered them. You're paying for that filtering.
- Aged leads are deliberately unfiltered or lightly filtered. That's why they're cheap. The filtering work transfers to you.
- The conversion math compresses fast: a 25% cumulative contact rate over 14 days means most conversion happens in the first 7 days. If you're calling the highest-probability records on day 1, your effective conversion is 30-40% higher than calling them in arrival order.

### H2: The variables that actually predict aged-lead conversion
Six variables, ranked by predictive power:

1. **Lead age** (recency to original form fill). Newer = higher contact rate, but the curve flattens past 90 days.
2. **Original intent specificity**. A consumer who entered a specific loan amount, coverage amount, or vehicle make/model converts better than one who entered defaults.
3. **Source quality**. Aggregator (LendingTree, Bankrate, EverQuote) > niche site > affiliate co-registration > social/Facebook lead-gen.
4. **Geography fit**. In-state vs out-of-state, target ZIP density, urban vs rural. (Higher fit = higher conversion because your underwriting is sharper there.)
5. **Phone validation**. Validated mobile > validated landline > unvalidated. Disconnected numbers = zero conversion.
6. **Demographic fit for the product**. Age band, income proxy, household composition. Most relevant for FE, IUL, ACA.

Each variable is independently weak. The combination is powerful.

### H2: Tier 1 — A simple weighted scoring model in a spreadsheet
Anyone can build this in 30 minutes. Show the formula structure.

Weighted scoring example:
- Lead age: 25% (newer = higher score)
- Original intent specificity: 20%
- Source quality: 20%
- Geography fit: 15%
- Phone validation: 10%
- Demographic fit: 10%

Each variable scored 1-10. Multiply by weight, sum, get a 1-10 composite. Sort descending. Call top 20% first, top 50% by week one, bottom 50% by week two.

Provide a CSV/spreadsheet column setup pattern.

Show a worked example with three sample records.

This is enough for most solo agents. Don't reach for AI before you've built this.

### H2: Tier 2 — AI-augmented scoring for batches
When does AI add real value beyond a spreadsheet? When you have unstructured signals that don't fit a 1-10 score:

- Free-text comment fields ("interested in a 30-year fixed for a duplex in Phoenix" vs blank)
- Form-fill timestamps that suggest engagement (filled at 2 AM = different signal than 11 AM weekday)
- Cross-batch deduplication that flags consumers who appeared on 2+ aged batches (high-intent signal)
- Sentiment analysis on any prior interaction notes in your CRM

Show a batch-scoring prompt for ChatGPT or Claude that takes a CSV and returns the spreadsheet score plus a "qualitative signal" override that bumps records up or down.

Sample prompt:
```
You are scoring aged [VERTICAL] leads for dial priority. Each record has:
[FIELDS]

Apply the weighted score [WEIGHTS] to compute a 1-10 base score.

Then apply qualitative overrides based on:
- Free-text comments suggesting active interest (+0.5 to +1.5)
- Form fill timestamps suggesting engagement (+0.3 if 9am-9pm weekday)
- Multi-batch deduplication signal (+1.0 if appears in 2+ batches)
- Negative signals (anger language, opt-out indication, generic data) (-0.5 to -2.0)

Return the records sorted by final score with a one-line justification.
```

Note: use this approach in batches of 50-200 records, not 5,000 at a time. Token economics and accuracy degrade past that batch size. For a 5,000-record file, run 25 batches of 200.

### H2: Tier 3 — API-based scoring for high-volume operations
For operations buying 10,000+ aged leads per month, manual or batch-LLM workflows don't scale. The API integration approach:

- OpenAI or Anthropic API call per record (or per micro-batch of 10-20)
- Triggered automatically on lead import to CRM
- Output written to a "score" custom field, indexed for sort
- Daily rebuild as new leads arrive

Tooling: most modern CRMs (HubSpot, Better Agency, Radius) support API workflows. For volume operations, building a thin Python or Node.js service that sits between the lead import and the CRM is straightforward. Reference cost: roughly $0.001-0.005 per record using GPT-4o-mini or Claude Haiku, well below the cost of the lead itself.

Caveat: don't build Tier 3 before you've validated Tier 1 actually works for your operation. The number of agents who built sophisticated scoring infrastructure before they understood which variables predict conversion in their specific market is non-trivial.

### H2: Where commercial tools fit
Brief honest assessment of B2B lead-scoring tools (Clay, Warmly, Common Room, Apollo) for B2C aged leads:

- Most B2B tools assume firmographic signals (company size, industry, tech stack) that don't apply to B2C insurance/mortgage/Medicare.
- Most assume intent signals from B2B sources (Bombora, 6sense, G2 visits) that aren't relevant for individual consumers.
- A handful of insurance-specific platforms (lead distribution platforms with built-in scoring like LeadConduit, ActiveProspect) work for real-time leads but generally don't process aged inventory.

For B2C aged leads in 2026, the practical landscape is: build it yourself with a spreadsheet or LLM, or use the limited scoring features inside your CRM.

### H2: Validating your scoring model — the 30-day review
You can't tell if your scoring works without measuring. After 30 days of scored dialing:

- Compare top-quintile conversion to bottom-quintile conversion
- If top quintile is 2x+ better than bottom quintile, your model is working
- If top quintile is 1.2x or less better than bottom quintile, your weights are wrong (or the variables you're using don't predict conversion in your specific market)
- Reweight based on actual conversion data, not gut

This is the part most operators skip. The scoring model that doesn't get tuned with real conversion data is worth less than no scoring model at all.

### H2: Common scoring mistakes
- Weighting freshness too heavily (the curve isn't linear past 30 days)
- Ignoring source quality (aggregator vs affiliate is the second-biggest predictor after age)
- Over-fitting to small samples (don't reweight after 50 calls; wait for 500)
- Scoring once and never retuning
- Trusting AI-generated qualitative scores without spot-checking the model's reasoning

### H2: How scoring integrates with your cadence
Your scored list feeds your 14-day cadence:

- Day 1-2: top 20% (highest score)
- Day 3-5: next 30%
- Day 6-9: next 30%
- Day 10-14: bottom 20%

Each tier gets the same six-touch cadence — but the timing of the FIRST touch is what scoring drives. The records most likely to convert get the freshest call window.

### Close
Bullet of 5-7 takeaways + soft CTA.

## Voice notes
- Tactical, less narrative than cost articles
- Real numbers, real prompts, real CSV examples
- Don't oversell AI — be honest about when a spreadsheet is enough
- Compliance is briefer here (the article is operational, not regulatory)

## Links to wire
- /blog/aged-lead-conversion-rates-by-industry-data-benchmarks
- /blog/aged-lead-follow-up-machine-crm-dialer
- /blog/setting-up-your-crm-for-aged-leads
- /blog/the-weekly-numbers-review
- /calculators/outreach-cadence
- /calculators/lead-cost
