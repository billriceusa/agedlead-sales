---
title: "The ChatGPT Prompt Library for Aged Lead Outreach (2026)"
slug: chatgpt-prompts-aged-leads
excerpt: "Generic AI sales prompts produce generic AI sales scripts. This is a working library of prompts engineered for the aged-lead context — segmentation, call openers, re-engagement emails, voicemails, objection handlers, and call-disposition summaries. Copy them into ChatGPT or Claude and use them this week."
publishedAt: 2026-05-11T09:00:00.000Z
author: bill-rice
category: tactics
primaryKeyword: chatgpt prompts aged leads
contentType: utility
wordCount: ~2700
---

# The ChatGPT Prompt Library for Aged Lead Outreach (2026)

Generic AI sales prompts produce generic AI sales scripts. The aged-lead context — calling someone whose interest is 30 to 180 days old, with a specific product mix, against a TCPA-aware compliance frame, and inside a 14-day six-touch cadence — needs prompts engineered for that context.

This article is a working prompt library. Every prompt below is copy-pasteable into ChatGPT, Claude, or any LLM. Each one is tuned to the aged-lead context that no general "ChatGPT for sales" article addresses. Use these this week.

## Three principles before the library

A few things worth understanding before you start running prompts in production.

**Specificity beats sophistication.** A prompt that names the vertical, the lead age, the product, the consumer's stated original intent, and the agent's specific commission structure outperforms a "write me a sales email" prompt every time. The model is a junior copywriter — give it specifications, not vibes.

**Compliance constraints belong in the system prompt.** Don't ask the model to draft outreach and then check it for TCPA issues after the fact. Tell it the rules upfront: no false urgency, no implied prior contact you didn't have, no "I see you're interested in" phrasing if the original interest is 90 days old. Bake the constraints in.

**The model is not a senior strategist.** Don't ask it to decide your strategy. Don't ask it whether you should buy aged or real-time. Don't ask it which vertical to focus on. Decide your strategy yourself, then use the model to execute on it.

## The foundation system prompt

Paste this at the top of any ChatGPT or Claude thread to set context once. After this block, every subsequent prompt will operate inside the rules and posture you've established. Edit the bracketed fields for your specific operation.

```
You are an experienced sales support assistant for an independent
[mortgage broker / P&C agent / life insurance agent / Medicare broker]
working aged internet-form leads. The leads are typically 30 to 180
days old. The consumer originally requested a quote for [PRODUCT] and
has not been actively contacted by an agent in at least 30 days.

Voice and posture:
- Consultative, calm, peer-to-peer. Not pushy, not salesy.
- Treat the consumer as an adult professional, not a "prospect."
- Specific numbers and concrete value, never hype or vague benefits.
- Sentences are short to medium length. No corporate jargon.

Compliance constraints (do not violate, ever):
- Do NOT claim a prior conversation that did not happen.
- Do NOT use phrases like "as we discussed," "per our conversation,"
  or "just following up on our chat."
- Do NOT invent fake deadlines, fake price increases, or fake scarcity.
- Do NOT claim the consumer is on a list, was selected, or qualified
  for anything they did not actually qualify for.
- Phrasing for old interest must acknowledge time elapsed honestly:
  "You requested a quote a few months ago" not "I noticed you're
  interested in."

Output format:
- When asked for scripts or emails, return them in the exact format
  requested with no preamble or commentary.
- When asked to analyze data, show your work briefly before the answer.
- When asked for multiple options, label them clearly (Option A, B, C).
```

That block is the foundation. Every prompt below assumes you've pasted it once at the top of the thread.

## Lead segmentation prompts

When you receive a batch of aged leads, the first decision is how to prioritize calling order. Volume alone isn't enough — you want to call the highest-conversion-probability records first.

**Prompt: Prioritize a batch by likely conversion**

```
I'm going to paste a CSV of [N] aged [VERTICAL] leads. Each row has:
- Date of original form submission
- ZIP code
- State
- Original loan amount or coverage amount requested
- Stated intent (purchase, refinance, term, IUL, etc.)

Sort the records into three priority tiers:

Tier 1 (call first): records with the highest combination of recency,
in-state geography (my state is [STATE]), and intent specificity.

Tier 2 (call within week): records that are valuable but lower priority.

Tier 3 (call last or not at all): records that are unlikely to convert.

Return the records as three separate CSV blocks, with a one-line
explanation of why each tier was sorted that way. Do not invent or
infer data — only use the columns provided.
```

**Prompt: Split a mixed mortgage batch into purchase vs refinance**

```
Here is a CSV of aged mortgage leads. The "stated intent" column may
say "purchase," "refinance," "rate quote," "first time buyer," or be
ambiguous.

Split the records into:
- Definite purchase leads
- Definite refinance leads
- Ambiguous (need follow-up to clarify)

For ambiguous records, suggest one short discovery question that would
clarify intent without being intrusive.
```

**Prompt: Identify likely duplicates across multiple aged batches**

```
I'm pasting two aged-lead batches I bought from different providers.
Match records that are likely the same consumer based on phone, email,
and/or name + ZIP combination. Return the duplicates as pairs and
recommend which record to keep based on freshness and data completeness.
```

## Outbound call script prompts

These are the prompts I use to draft initial-call openers, voicemails, and live transition language.

**Prompt: 30-second cold call opener for aged refinance**

```
Write a 30-second cold call opener for a mortgage broker calling a
homeowner who requested a refinance quote 60 days ago. The opener must:

- Acknowledge the time elapsed honestly (not pretend it's recent)
- Anchor on the rate environment specifically (note: 30-year fixed has
  moved [UP / DOWN] [N] basis points since their original inquiry)
- Make a low-friction ask (2 minutes to compare new rates)
- Include a graceful exit ("if it's not the right time, no problem")

Format: write the opener as if I'm reading it aloud. No stage directions.
Aim for 70-90 spoken words.
```

**Prompt: Voicemail under 17 seconds**

```
Write a voicemail message for an aged [VERTICAL] lead who didn't pick
up. The message must be under 17 seconds when spoken at a normal pace
(roughly 50-55 words).

Constraints:
- State who I am and where I'm calling from (use [AGENT NAME] and
  [COMPANY])
- Reference the original quote request honestly
- Give one specific, low-friction reason to call back
- Leave my callback number twice (start and end)
- No mention of urgency, deadline, or limited-time anything

Return three options with slightly different tones: consultative,
direct, and warm.
```

**Prompt: Live transition from opener to discovery to quote**

```
For an aged [VERTICAL] lead, write the verbal transition script that
takes me from the 30-second opener through discovery questions and
into the quote presentation. The transition should:

- Confirm the consumer is willing to talk now
- Ask 3-5 discovery questions in plain language (not a checklist)
- Naturally lead into "let me put numbers in front of you"

Include light scripted responses for the most common consumer reactions
(yes, hesitant, "I'm busy right now").
```

## Email re-engagement prompts

Email is the lowest-cost touch in any aged-lead cadence. These prompts produce the email content; you handle the send via your CRM or ESP.

**Prompt: Five-email re-engagement sequence for aged refinance**

```
Write a five-email re-engagement sequence for aged refinance leads
30-90 days old. The sequence runs over 14 days.

Email 1 (Day 1): Rate-update hook. Tell them honestly that rates have
moved since their original inquiry. Specific number if possible. Make
an offer to compare numbers without obligation.

Email 2 (Day 4): Value-add. Share one specific insight about the
current rate environment that's useful even if they don't engage with me.

Email 3 (Day 7): Soft deadline. Reference a real, externally verifiable
window (e.g., "if you want to lock before the next Fed meeting").
NEVER fabricate a deadline.

Email 4 (Day 11): Social proof. Reference how a similar borrower in the
same situation evaluated their options recently. Use a generic reference
that's truthful — not a fake testimonial.

Email 5 (Day 14): Breakup email. Tell them I won't reach out again
unless they want me to. Make it easy to say "yes still interested" or
"no, please remove me."

For each email return: subject line, preheader, body. Plain prose, no
formatting flourishes. Maximum 120 words per body.
```

**Prompt: Three-email sequence for aged final expense**

```
Write a three-email re-engagement sequence for aged final expense
leads 60-180 days old. The audience is seniors aged 60+.

Tone: gentle, education-first, no pressure. Long-form messages don't
fit this audience — keep each email under 90 words. No bullet lists.
No urgency tactics. Frame the conversation around peace of mind for
loved ones, not on price or product features.

Email 1: Permission-based reintroduction. Acknowledge time has passed.
Offer to send a one-page comparison of monthly cost ranges, no
obligation.

Email 2: Useful content. Share one practical tip about funeral cost
planning (real, factual).

Email 3: Soft close. Make a specific offer (a 10-minute call to walk
through options) and a clear opt-out.

Return subject, preheader, body for each.
```

**Prompt: Single re-engagement email for aged IUL**

```
Write one re-engagement email for an aged IUL lead 60+ days old.
Audience: high-net-worth, financially literate, often a small-business
owner or executive.

The email must demonstrate competence — not just sales positioning.
Include one specific factual reference about the current IUL/index
landscape (e.g., specific cap rates, participation rates, or carrier
trend) that signals I know the product. Then a low-friction ask: a
20-minute call to walk through their specific scenario.

Maximum 200 words. Subject line, preheader, body.
```

**Prompt: Subject line generator**

```
Generate 10 subject lines for re-engagement emails to aged [VERTICAL]
leads. Constraints:

- Maximum 50 characters
- No clickbait, no all-caps, no excessive punctuation
- No false urgency ("Last chance!" "Don't miss out!")
- No false personalization ("Re:" "Following up" if there was no
  prior conversation)
- Half should be question-based, half statement-based
- Tone: professional, calm, useful

For each subject line, indicate the predicted angle (rate-driven,
value-add, social proof, soft urgency, breakup).
```

## Text and SMS prompts

SMS is the highest-response channel in most aged-lead cadences but also the most TCPA-sensitive. Use carefully.

**Prompt: Permission-first SMS opener**

```
Write a permission-first SMS opener for an aged [VERTICAL] lead who
provided a phone number on the original form. Must include:

- My identity and where I'm calling from
- Honest reference to the original quote request
- A clear permission ask: "OK if I send you a quick rate update?" or
  similar
- A clear opt-out path: "reply STOP to unsubscribe"

Maximum 160 characters total. Conversational, not corporate.
```

**Prompt: Re-engagement SMS for someone who responded once**

```
A consumer responded to my first SMS with a brief acknowledgment
("yeah maybe" or "send it") and then went silent for 7 days. Write a
follow-up SMS that:

- References their earlier reply naturally
- Adds new value (a specific reason to engage now, not before)
- Doesn't pressure or guilt
- Has a clear next step

Three options, max 160 characters each.
```

## LinkedIn and multichannel prompts

For aged leads with professional-tier contact data, LinkedIn can complement phone and email.

**Prompt: LinkedIn connection request**

```
Write a LinkedIn connection request to send to an aged [VERTICAL]
lead I've identified on LinkedIn. The request must:

- Reference a specific detail from their LinkedIn profile (provide
  bracketed placeholder I'll fill in: [PROFILE_DETAIL])
- Mention I had reached out about [PRODUCT] previously without
  pressuring engagement
- Be useful even if they don't respond

Maximum 300 characters.
```

**Prompt: Sequenced 14-day multichannel cadence**

```
Design a 14-day, six-touch outreach cadence for an aged [VERTICAL]
lead, integrating phone, email, SMS, and LinkedIn (where the lead has
a profile). For each touch, specify:

- Day
- Channel
- Message type (script reference, email subject, SMS content)
- What action triggers movement to the next step
- What action removes the lead from the cadence

Output as a structured table.
```

## Call summary and disposition prompts

Used after a call to convert messy notes into clean CRM dispositions.

**Prompt: Post-call summary**

```
I just finished a call with an aged [VERTICAL] lead. Here are my rough
notes: [PASTE NOTES]

Convert this into a clean CRM disposition with:

- One-sentence call summary
- Disposition category (interested, not interested, callback,
  voicemail, do-not-call, wrong number)
- Specific next-action recommendation
- Specific date/time for next contact (if applicable)
- Any quote-related details to retain (loan amount, premium target,
  carrier preference)

Output as a structured block I can copy directly into CRM fields.
```

**Prompt: Pipeline-status update**

```
Here are my call dispositions from the past week: [PASTE]

Generate a Monday-morning pipeline review:

- Total contacts made
- Conversations vs voicemails
- Quoted opportunities
- Bound policies / closed loans
- Cost per acquisition vs target ($[TARGET])
- Three things that are working
- Three things to fix this week

Output as a brief, actionable summary I can paste into my weekly review.
```

## Objection-handling prompts

When a real objection comes up that you haven't built a response for, run it through the model in real time.

**Prompt: Generate objection responses**

```
Objection from an aged [VERTICAL] lead: "[PASTE EXACT OBJECTION]"

Generate three response options with different tones:

Option A: Consultative — acknowledge the concern, reframe the
conversation around value, ask a clarifying question.

Option B: Direct — address the objection head-on with specific data or
context that contradicts the assumption.

Option C: Soft — validate the concern, offer to send information for
later review, exit gracefully.

For each, include the specific words I'd say. Aim for 30-50 spoken
words per option.
```

## Compliance considerations for AI-drafted outreach

This is the section that protects you.

AI-drafted scripts and emails are not exempt from TCPA. The compliance burden is the same as if you wrote every word yourself. The model isn't a co-defendant — you are.

A few specific risks to watch for, especially in mini-TCPA states (Florida FTSA, Oklahoma OTSA, Washington HB 1497, Maryland, Texas):

The model can hallucinate prior conversations. If your prompt isn't tight, ChatGPT will write phrases like "as we discussed last month" or "thanks for the chat earlier" — both of which are false statements about a contact that didn't happen. Some plaintiffs' attorneys treat fabricated prior-contact language as evidence of bad faith. Bake the prohibition into your system prompt and review every output before sending.

The model can invent deadlines. "Rates are increasing on Friday" or "this offer expires at midnight" — both fine if real, both actionable in some states if invented. Tell the model explicitly never to fabricate scarcity.

The model can imply qualifications the consumer doesn't have. "You qualify for our preferred rate" or "you've been pre-approved" — never let an AI assert qualifications it can't verify. Your system prompt should forbid this language.

Save the prompt and the generated output. If you ever have to defend a piece of outreach in a TCPA action, you want the audit trail showing what you instructed the model to produce. A simple Google Doc or CRM-attached note per output is enough.

AI voice agents calling aged leads are a separate category and deserve a longer treatment. The FCC's February 2024 ruling classified AI-generated voice as "artificial voice" under TCPA § 227(b)(1). That means marketing calls using AI voice require prior express written consent — and most aged-lead consent on the original form does not specifically cover AI-voice outreach. Before deploying any voice-AI workflow on aged leads, talk to your provider about the specific consent language on the form and run the workflow past TCPA counsel. The team at [Henson Legal](https://www.henson-legal.com/) is who I'd ask.

The full TCPA framework for aged leads is in [TCPA Compliance When Calling Aged Leads](/blog/tcpa-compliance-calling-aged-leads).

## Integrating prompts into your CRM workflow

Running prompts manually in a ChatGPT browser tab is fine for ad-hoc work. For volume, integrate them.

Most modern CRMs — HubSpot, Salesforce, Better Agency, AgencyZoom, Radius — have either native AI integrations or third-party connectors that pipe lead data into an OpenAI or Anthropic API call and write the output back to the lead record. The advantage isn't speed. It's consistency: every lead gets a script tuned to its specific record (vertical, age, original intent, geography), and every output is automatically logged for compliance audit.

If you don't have CRM integration yet, the manual workflow that works:

Create a prompt template per use case (initial cold call, voicemail, follow-up email, objection handler). Save them in a shared doc your team can pull from.

Pre-populate the template with CRM data before you run it. Don't ask ChatGPT to "write a script" — ask it to "write a script for a 65-day-old aged refinance lead in Texas with an original loan amount of $325,000 and a stated intent of cash-out."

Save the AI output to the lead record. Even if you edit it before using it, log the original AI generation as part of the lead's contact history.

## What this means for you

The right way to use ChatGPT and Claude for aged-lead outreach is as a high-volume junior copywriter operating inside a tight set of compliance and voice constraints. You define the strategy. The model executes the writing. You review and approve before anything goes out.

A few takeaways:

- The system prompt is the most important element of any AI workflow. Bake your compliance posture and voice guidelines into it once and reuse the thread.
- Specificity in your prompts produces specificity in the output. Generic prompts produce generic scripts.
- AI-drafted outreach is subject to the same TCPA framework as human-drafted outreach. The model isn't a defense — you are responsible for what gets sent.
- Save every prompt and every output. The audit trail is your safety net.
- AI voice agents are not aged-leads-ready under current FCC rules. Don't deploy them without explicit per-call consent.

Pair this prompt library with [Aged Lead Scripts That Actually Work](/blog/aged-lead-scripts-actually-work-examples) and [Email Outreach for Aged Leads: Five Templates That Get Replies](/blog/email-outreach-aged-leads-templates) — those two pieces have the script and email examples that this article's prompts are designed to generate at scale. The [Outreach Cadence Calculator](/calculators/outreach-cadence) will model the multichannel cadence prompts against your specific volume and call capacity.

The right AI workflow for aged leads in 2026 isn't replacing human judgment. It's removing the friction between strategy and execution so the human can spend more time on the conversations that close.
