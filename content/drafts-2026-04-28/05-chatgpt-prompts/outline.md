# Article 5: The ChatGPT Prompt Library for Aged Lead Outreach

## Target query
Primary: "ChatGPT prompts for sales", "AI prompts insurance sales", "ChatGPT for cold calling", "AI sales scripts"
Secondary: "ChatGPT for aged leads", "AI lead outreach prompts", "AI follow-up email"

## Strategic role
Tactical/utility piece. NOT generic AI talk. Has to deliver real, copy-pasteable prompts that solve real aged-lead workflow problems. Differentiation: every prompt is grounded in aged-lead-specific operating context that no general "ChatGPT for sales" article addresses.

## Hook / thesis
Most "AI for sales" content is generic. This article is a working library of prompts an agent can use this week to segment aged lead lists, draft outreach scripts, write email re-engagement sequences, generate objection-handling responses, and summarize call dispositions. Each prompt is engineered for the aged-lead context: 30-180 day data, low-temperature calls, compliance-aware language, multi-product lookups.

## Length target
2,400-2,800 words

## Structure

### Opening (200 words)
Generic AI sales prompts produce generic AI sales scripts. The aged-lead context — calling someone whose interest is 30-180 days old, with a specific product mix, against a TCPA-aware compliance frame, and with a 14-day six-touch cadence — needs prompts engineered for that context. This article is a working library you can copy directly into ChatGPT (or Claude, or any LLM) and use this week. It's not a "how AI changes sales" think piece. It's the prompts I actually use.

### H2: How to think about AI prompts for aged-lead outreach
Three principles before the library:

1. **Specificity beats sophistication.** A prompt that names the vertical, the lead age, the product, the consumer's stated original intent, and the agent's specific commission structure outperforms a "write me a sales email" prompt every time.

2. **Compliance constraints belong in the system prompt.** Don't ask the model to draft outreach and then check it for TCPA issues. Tell it the rules upfront: no false urgency, no implied prior contact you didn't have, no "I see you're interested in" phrasing if the original interest was 90 days old.

3. **The model is a junior copywriter, not a senior strategist.** Don't ask it to decide your strategy. Ask it to execute on a strategy you've already decided.

### H2: The foundation system prompt
A reusable system-prompt block agents can paste at the top of any ChatGPT thread to set context once. Includes:
- Role definition (aged-lead sales agent)
- Vertical and product
- Compliance posture (TCPA-aware, no false urgency, no false implied prior contact)
- Voice guidelines (consultative, calm, peer-to-peer)
- Forbidden phrases ("I noticed you...", "Just following up on your interest...", "Per our conversation...")

Show the actual block. Make it copy-pasteable.

### H2: Lead segmentation prompts
- Prompt for sorting a CSV of aged leads by likely conversion priority (recency, vertical, geography, price tier)
- Prompt for splitting a mixed batch into purchase vs refinance (mortgage), term vs IUL (life), under-65 vs Medicare-eligible (health)
- Prompt for identifying duplicates across multiple aged batches in a CRM

### H2: Outbound call script prompts
- 30-second cold call opener for aged mortgage refi, aged auto, aged final expense, aged Medicare
- Voicemail message that maximizes callback probability (under 17 seconds)
- Live transition prompt: opener → discovery → quote
- "Calling from days/weeks/months ago" framing — handling the lead-age question
- Objection handlers (4-5 most common per vertical)

### H2: Email re-engagement prompts
- 5-email sequence for aged refi (rate-driven hook, value-driven, deadline-driven, social proof, breakup)
- 3-email sequence for aged FE (different framing — soft, education-first)
- Single re-engagement email for IUL after 60 days of no contact
- Subject-line generator for aged-lead emails (compliance-aware, no clickbait)

### H2: Text and SMS prompts
- Permission-first SMS opener (TCPA-compliant)
- Re-engagement SMS for someone who responded once and went silent
- Appointment-confirmation SMS that minimizes no-shows

### H2: LinkedIn / multichannel prompts
- LinkedIn connection request for aged leads who appear on LinkedIn (verification + warm-up)
- LinkedIn DM that doesn't sound like a cold pitch
- Sequencing across phone → email → SMS → LinkedIn over 14 days

### H2: Call summary and disposition prompts
- Post-call summary generator (input: rough notes; output: clean CRM disposition)
- Next-action recommendation based on call disposition
- Pipeline-status updater prompt (weekly review automation)

### H2: Objection-handling library
- Prompt that takes an objection ("rates dropped, I already refinanced") and returns 3 response options with different tones (consultative, direct, soft)
- Prompt for generating fresh objection-handling language by vertical

### H2: Follow-up cadence design prompts
- Generate a custom 14-day cadence based on vertical, product, and commission structure
- Adapt cadence to senior demographic (FE) vs younger demographic (term, ACA SEP)

### H2: Compliance considerations for AI-drafted outreach
This is the section that earns the article and protects the agent.

- AI-drafted scripts and emails are not exempt from TCPA. The compliance burden is the same as if you wrote it yourself.
- Don't ever let AI claim a prior conversation that didn't happen, an existing customer relationship that doesn't exist, or a deadline that isn't real.
- Run AI-drafted scripts past legal counsel before using them in volume — especially in mini-TCPA states (FL, OK, WA, MD, TX).
- Save the system prompt and the generated output for your records. If you have to defend a script in a TCPA action, you want the audit trail.
- AI voice agents calling aged leads are a separate matter. The FCC's February 2024 ruling classified AI-generated voice as "artificial voice" under TCPA, which means marketing calls require prior express written consent — and most aged-lead consent doesn't cover AI-voice outreach. Ask your provider explicitly before deploying any voice-AI workflow.

Reference Henson Legal as TCPA counsel of record.

### H2: Integrating prompts into your CRM workflow
- Don't run prompts manually. Build them into your CRM as templates or integrate via the OpenAI API.
- Pre-populate prompts with CRM data (lead vertical, age, original product, last contact date) before the model runs.
- Save the AI-generated output to the lead record for compliance audit.

### Close
Bullet of 5-7 takeaways + soft CTA to scripts post and outreach cadence calculator.

## Voice notes
- More tactical, less narrative than cost articles. More section breaks, more code-block-style prompt blocks.
- Each prompt should be copyable verbatim — use code blocks for prompt content.
- Bill's voice: still skeptical, still math-aware, still compliance-aware. Treat AI as a tool the agent already understands needs to be used carefully.

## Links to wire
- /blog/aged-lead-scripts-actually-work-examples
- /blog/email-outreach-aged-leads-templates
- /blog/aged-lead-nurture-sequences-insurance-agents
- /blog/how-to-leave-a-voicemail-that-gets-callbacks-from-aged-leads
- /blog/tcpa-compliance-calling-aged-leads
- /calculators/outreach-cadence
- External: henson-legal.com
