/**
 * 5-Email Welcome Sequence for Aged Lead Sales Newsletter
 *
 * Triggered when a new subscriber signs up. Each email delivers value,
 * builds trust, and drives traffic back to the site's best content.
 *
 * Schedule: Day 0, Day 2, Day 4, Day 6, Day 8
 * Then transitions to the weekly newsletter cadence.
 */

export const welcomeSequence = [
  {
    day: 0,
    subject: "Welcome — here's your aged lead cheat sheet",
    preheader:
      "The 5 numbers that determine whether aged leads work for you",
    body: `Hi {{firstName}},

Welcome to Aged Lead Sales. You just joined a community of sales professionals who've figured out that $1 leads can outperform $50 leads — when you have the right system.

Let's start with the fundamentals. Here are the **5 numbers that determine your aged lead ROI**:

1. **Lead cost** — Aged leads run $0.50–$5.00 each. The cheaper they are, the more you can buy.
2. **Contact rate** — Expect 12–18% with a multi-touch cadence (phone + text + email).
3. **Conversion rate** — 1–5% of contacts, depending on your industry and skill.
4. **Deal value** — Your commission or revenue per closed sale.
5. **Follow-up consistency** — The #1 factor. Agents who make 5–7 touches convert 2–3x more than those who quit after 1–2.

**Your first step:** Plug your numbers into our free [ROI Calculator](https://agedleadsales.com/calculators/roi-calculator) to see exactly what aged leads could produce for your business.

Talk soon,
Bill Rice
Aged Lead Sales`,
    cta: {
      text: "Calculate Your ROI",
      url: "https://agedleadsales.com/calculators/roi-calculator",
    },
  },
  {
    day: 2,
    subject: "The 7-day follow-up cadence that actually works",
    preheader: "Most agents stop after 1-2 calls. Here's what winners do.",
    body: `{{firstName}},

The single biggest mistake with aged leads? Giving up too soon.

Most sales professionals call an aged lead once, maybe twice, then move on. But the data is clear: **it takes 5–7 touches to convert a prospect into a sale**.

Here's the exact 7-day cadence our top-performing readers use:

**Day 1:** Phone call + voicemail drop
**Day 2:** Text message ("Hi [Name], I left you a voicemail about...")
**Day 3:** Email with educational content
**Day 5:** Second phone call
**Day 7:** Final text + voicemail

The key: mix channels. Phone alone won't cut it. But phone + text + email? That's a 30–50% boost in contact rate.

**Tool recommendation:** Use our free [Outreach Cadence Planner](https://agedleadsales.com/calculators/outreach-cadence-planner) to build a custom cadence based on your capacity and channels.

Tomorrow: The scripts that turn contacts into conversations.

Bill`,
    cta: {
      text: "Plan Your Cadence",
      url: "https://agedleadsales.com/calculators/outreach-cadence-planner",
    },
  },
  {
    day: 4,
    subject: "Scripts that work for aged leads (by industry)",
    preheader: "What to say when they answer — without sounding like a telemarketer",
    body: `{{firstName}},

When an aged lead picks up the phone, you have about 10 seconds before they decide to keep listening or hang up.

The secret? **Acknowledge the time gap, don't fake familiarity.**

Here's the framework:

> "Hi [Name], this is [You] with [Company]. I'm following up on [the quote/inquiry] you submitted a while back. I know it's been some time — [relevant hook]. Do you have a couple of minutes?"

The **relevant hook** changes by industry:

**Insurance:** "...rates have been really competitive lately, and I wanted to make sure you didn't miss out."

**Mortgage:** "...rates have moved since then, and I wanted to see if the numbers might work better for you now."

**Solar:** "...a lot has changed with battery storage and incentives. Have you looked into whole-home backup?"

**Final Expense:** "...I help families in [area] make sure their final expenses are taken care of. Do you have a couple of minutes?"

**Medicare:** "...I'm a local Medicare specialist and I wanted to check if your coverage is still working for you."

The full scripts with objection handling for every industry are here:
→ [Aged Lead Scripts That Actually Work](https://agedleadsales.com/blog/aged-lead-scripts-that-work)

Bill`,
    cta: {
      text: "Get All the Scripts",
      url: "https://agedleadsales.com/blog/aged-lead-scripts-that-work",
    },
  },
  {
    day: 6,
    subject: "How much should you spend on aged leads? (pricing breakdown)",
    preheader: "Exact costs by industry — mortgage, insurance, solar, Medicare, and more",
    body: `{{firstName}},

The most common question I get: "How much do aged leads actually cost?"

Here's the quick breakdown for 2026:

| Industry | 30-Day Leads | 60-Day Leads | 90+ Day Leads |
|----------|-------------|-------------|---------------|
| Mortgage | $2–$5 | $1–$3 | $0.50–$1.50 |
| Insurance | $1.50–$4 | $0.75–$2 | $0.50–$1.25 |
| Final Expense | $1.50–$3.50 | $1–$2 | $0.50–$1.50 |
| Medicare | $1.50–$3 | $0.75–$2 | $0.50–$1.50 |
| Solar | $2–$5 | $1–$3 | $0.50–$2 |
| MVA | $3–$8 | $1.50–$5 | $1–$3 |

**My recommendation for first-timers:** Start with 500 leads in the 30–60 day range. That's typically $750–$2,000 depending on your industry. Work them through a full 7-day cadence before judging results.

The full pricing guide with ROI math for every vertical:
→ [Aged Leads Cost 2026: Complete Pricing Guide](https://agedleadsales.com/blog/aged-leads-pricing-2026-complete-industry-guide)

Bill`,
    cta: {
      text: "See Full Pricing Guide",
      url: "https://agedleadsales.com/blog/aged-leads-pricing-2026-complete-industry-guide",
    },
  },
  {
    day: 8,
    subject: "Your aged lead toolkit (all free)",
    preheader: "4 calculators, 4 playbooks, and the one thing most agents skip",
    body: `{{firstName}},

You now know the fundamentals: pricing, cadences, scripts, and ROI math. Here's your complete toolkit to put it all into action.

**Free Calculators:**
→ [ROI Calculator](https://agedleadsales.com/calculators/roi-calculator) — Compare aged vs real-time lead ROI
→ [Lead Cost Calculator](https://agedleadsales.com/calculators/lead-cost-calculator) — Find your true cost per acquisition
→ [Pipeline Calculator](https://agedleadsales.com/calculators/pipeline-calculator) — How many leads to hit your income goal
→ [Cadence Planner](https://agedleadsales.com/calculators/outreach-cadence-planner) — Build your multi-channel follow-up plan

**Playbooks:**
→ [7-Day Follow-Up Cadence](https://agedleadsales.com/playbooks/7-day-aged-lead-follow-up-cadence)
→ [Tracking Aged Lead ROI](https://agedleadsales.com/playbooks/tracking-aged-lead-roi-metrics)
→ [Mortgage Rate Shopping Playbook](https://agedleadsales.com/playbooks/mortgage-rate-shopping-playbook)
→ [Final Expense Kitchen Table Close](https://agedleadsales.com/playbooks/final-expense-kitchen-table-close)

**The one thing most agents skip:** Setting up a CRM before buying leads. Even a free CRM (HubSpot, Close trial) will 2–3x your results because you never lose track of who to call next.

→ [How to Build Your Follow-Up Machine](https://agedleadsales.com/blog/aged-lead-follow-up-machine-crm-dialer)

From here, you'll get our weekly newsletter with strategies, scripts, and industry insights every Tuesday. Welcome aboard.

Bill Rice
Aged Lead Sales`,
    cta: {
      text: "Browse All Free Tools",
      url: "https://agedleadsales.com/calculators",
    },
  },
];
