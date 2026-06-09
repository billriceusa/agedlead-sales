export interface LeadTypeData {
  slug: string;
  title: string;
  icon: string;
  heroDescription: string;
  metaTitle: string;
  metaDescription: string;
  primaryKeyword: string;
  secondaryKeywords: string[];
  costRange: string;
  whoItsFor: string[];
  whatYouGet: string[];
  sections: {
    whatAre: string;
    whyUse: string;
    howToWork: string;
    script: { opener: string; whyItWorks: string[] };
    costComparison: { realTime: string; aged: string; savings: string };
    bestPractices: string[];
  };
  /**
   * Optional long-form sections rendered as additional H2 blocks for topical
   * depth (Helpful Content / E-E-A-T). Body supports paragraph breaks via "\n\n".
   * Populated per-vertical as content-depth passes are completed.
   */
  deepDive?: { heading: string; body: string }[];
  faqs: { question: string; answer: string }[];
  getCompareUrl: () => string;
}

export const LEAD_TYPES: Record<string, LeadTypeData> = {
  "mortgage-leads": {
    slug: "mortgage-leads",
    title: "Mortgage Leads",
    icon: "🏠",
    heroDescription:
      "Aged mortgage leads connect you with homebuyers and refinancers who previously expressed interest in mortgage products — at a fraction of the cost of real-time leads.",
    metaTitle: "Aged Mortgage Leads – Buy Affordable Mortgage Leads",
    metaDescription:
      "Buy aged mortgage leads for $0.50–$3 each. Connect with homebuyers and refinancers who expressed interest in mortgage products. 80-90% cheaper than real-time leads.",
    primaryKeyword: "aged mortgage leads",
    secondaryKeywords: [
      "buy mortgage leads",
      "cheap mortgage leads",
      "mortgage lead generation",
      "refinance leads",
      "mortgage broker leads",
    ],
    costRange: "$0.50 – $3.00",
    whoItsFor: [
      "Mortgage brokers and loan officers",
      "Mortgage companies and lenders",
      "Refinance specialists",
      "Real estate professionals",
      "HELOC and reverse mortgage specialists",
    ],
    whatYouGet: [
      "Full name and contact information",
      "Loan type requested (purchase, refinance, HELOC)",
      "Property type and estimated value",
      "Credit score range (when available)",
      "Geographic location (state, zip code)",
    ],
    sections: {
      whatAre:
        "Aged mortgage leads are consumer records from individuals who filled out an online form requesting information about home loans, refinancing, HELOCs, or other mortgage products — typically 30 to 180 days ago. These consumers demonstrated genuine interest by providing their contact information and loan details, but may not have been contacted or may still be shopping for the best rate. Because these leads are older, they cost a fraction of what real-time mortgage leads cost — giving loan officers and brokers the ability to build massive pipelines on a modest budget.",
      whyUse:
        "Real-time mortgage leads cost $15–$60+ each, and you're competing against 5-8 other loan officers who receive the same lead simultaneously. It's a speed-to-call arms race. With aged mortgage leads, you can buy 500-1,000 records for the price of 10-15 real-time leads. Many of these consumers are still in the mortgage process — rates change, circumstances shift, and a large percentage of people who start the mortgage journey don't close for months. By reaching out with a helpful, no-pressure approach, you catch people who are still shopping, have been ghosted by their first lender, or whose financial situation has improved.",
      howToWork:
        "The key to converting aged mortgage leads is positioning yourself as a helpful resource, not a salesperson. These consumers requested mortgage information in the past — they have context. Your job is to check in, see if they've been helped, and offer value. Work your list systematically: segment by loan type (purchase vs. refinance), prioritize by recency (30-60 day leads first), and use a multi-touch cadence of calls, emails, and direct mail over 7-14 days. Expect a 5-15% contact rate and a 1-3% conversion rate — but at $0.50-$3 per lead, even a 1% close rate delivers exceptional ROI.",
      script: {
        opener:
          '"Hi [Name], this is [Your Name]. You had looked into mortgage options a little while back — I\'m just following up to see if you were able to lock in a rate you\'re happy with, or if you\'re still exploring options?"',
        whyItWorks: [
          "Acknowledges they requested information (builds credibility)",
          "Doesn't pretend you have a prior relationship",
          'Low-pressure framing ("still exploring" gives them an easy out)',
          "Opens the door for people who procrastinated or got ghosted by other lenders",
        ],
      },
      costComparison: {
        realTime: "$25–$60 per lead",
        aged: "$0.50–$3.00 per lead",
        savings: "Save 90-95% per lead",
      },
      bestPractices: [
        "Segment leads by loan type (purchase, refinance, HELOC) before calling",
        "Call within business hours, Tuesday-Thursday tends to have the highest contact rates",
        "Lead with current rate information — rates change constantly, and that's your hook",
        "Use a CRM to track every contact attempt and set follow-up reminders",
        "Send a plain-text email after your first call attempt — no HTML templates",
        "For local leads, consider a personalized direct mail piece as your first touch",
        "Don't call the same lead more than 3 times — use other channels instead",
        "Pull a fresh phone and DNC scrub before every campaign — aged data ages between the day it was captured and the day you dial it",
        "Track cost per contact and cost per funded loan, not just cost per lead — the per-lead price is the least important number in the funnel",
      ],
    },
    deepDive: [
      {
        heading: "Aged Mortgage Leads by Loan Type: Purchase, Refinance, HELOC, and Reverse",
        body: "Not all aged mortgage leads behave the same way, and the loan type a consumer originally inquired about should shape how you work the record. Purchase leads are the most time-sensitive: a homebuyer who requested information 60 days ago may already be under contract or, just as often, may have stalled because their first lender was slow or their pre-approval fell through. Those stalled buyers are exactly who an aged list surfaces — people who are still in the market but no longer being chased.\n\nRefinance leads age differently. A refinance inquiry is tied to the rate environment at the moment it was made. When rates drop even a quarter point below where they sat when the lead was captured, a 90- or 180-day-old refi record can re-activate overnight — the consumer's math just changed, and most of the loan officers who originally received that lead have long since moved on. This is the single biggest reason refinance is the highest-leverage aged mortgage vertical for patient operators.\n\nHELOC and home-equity leads track homeowner equity and the consumer's need for cash — debt consolidation, renovations, tuition. These needs rarely resolve in 30 days, so the aged window stays warm longer. Reverse-mortgage leads (consumers 62+) are the slowest-moving of all; the decision cycle is measured in months, and a respectful, education-first follow-up months after the original inquiry often arrives exactly when the household is finally ready to talk. Segment your list by loan type before you dial, and write a distinct opening line for each — a purchase script and a reverse script should not sound the same.",
      },
      {
        heading: "The Real Math: What an Aged Mortgage Lead Actually Costs Per Funded Loan",
        body: "The per-lead price is the number buyers fixate on and the number that matters least. What matters is your fully loaded cost per funded loan. Here is the math, framed as an illustration you should re-run with your own close rate and commission.\n\nSay you buy 1,000 aged mortgage leads at $1.50 each — a $1,500 spend. At a 10% contact rate you reach 100 people. At a 2% overall conversion rate (a reasonable target with disciplined, consistent follow-up) you fund roughly 20 loans. That puts your lead cost per funded loan at about $75. Compare that to real-time leads at, say, $40 each: 1,000 of those would cost $40,000, and even at a higher 6% close you would need a far larger budget to fund the same number of loans.\n\nThe lever most operators ignore is contact rate, not price. Doubling your contact rate from 5% to 10% — through better dialing windows, a fresh DNC scrub, and a real multi-touch cadence — does more for your cost per funded loan than negotiating the per-lead price down by half. Always model the full funnel: leads → contacts → applications → funded loans → commission. When you do, a $1.50 lead that closes at 2% routinely beats a $40 lead that closes at 6%, because volume at low cost absorbs the lower close rate and still wins on total funded production.",
      },
      {
        heading: "Why Aged Refinance Leads Re-Activate When Rates Move",
        body: "A refinance lead is a snapshot of a consumer's interest at a specific rate. The moment rates fall below that snapshot, the economics of refinancing change for everyone who inquired while rates were higher — and your aged list becomes a ready-made call list of people whose break-even math just flipped in their favor.\n\nThis is why experienced operators treat aged refinance inventory as a rate-environment hedge rather than a one-time buy. In a high-rate market, refinance demand looks dead, prices on these leads soften, and most loan officers stop buying them entirely. The patient operator accumulates that inventory cheaply and works it with a low-pressure, stay-in-touch cadence. When the next rate dip arrives — and over a mortgage cycle one always does — they are already in conversation with hundreds of homeowners while competitors are starting from a cold list.\n\nThe practical move: when you call an aged refi lead, lead with current rate information. Rates are the hook because they are the one thing that has objectively changed since the consumer first inquired. You are not pitching; you are delivering a relevant update to someone who already raised their hand.",
      },
      {
        heading: "Building a Multi-Touch Cadence That Converts Aged Mortgage Leads",
        body: "Single-touch outreach wastes aged leads. The contact rates that make the math work assume a structured cadence across channels, spaced over 7 to 14 days, not one phone call and a shrug.\n\nA workable cadence looks like this: Day 1, a manual phone call using a non-pushy opener that acknowledges the consumer's prior inquiry. If you don't connect, leave a brief, specific voicemail. Day 2, a short plain-text email — no HTML template, no images, just a human note that references mortgage rates and offers to help. Day 4, a second call at a different time of day than the first. Day 7, a value-add touch: a rate update, a one-line market note, or a link to a helpful resource. For local leads, a personalized direct-mail piece as an early touch lifts response meaningfully. Day 10 to 14, a final call and a soft close email that leaves the door open.\n\nTwo disciplines separate operators who profit from aged leads from those who churn through them. First, vary the channel and the time of day — calling the same number three times at 10 a.m. is not a cadence. Second, log every attempt in a CRM with the outcome and the next action. Aged-lead profitability is a workflow problem far more than a lead-quality problem; the inventory is cheap enough that process, not luck, decides your return.",
      },
      {
        heading: "Five Mistakes That Destroy Aged Mortgage Lead ROI",
        body: "First, treating aged leads like real-time leads. These consumers inquired weeks or months ago; an opener that pretends the inquiry was yesterday breaks trust instantly. Acknowledge the gap and reframe as a helpful follow-up.\n\nSecond, buying on price alone. A cheaper lead with no phone scrub, stale contact data, or the wrong geography costs more per funded loan than a slightly pricier, cleaner record. Judge inventory on data quality and fit, not headline price.\n\nThird, under-working the list. Operators routinely buy 1,000 leads, make 200 calls, and quit. The math only works if you run the full cadence on the full list. Half-working a list guarantees the disappointing contact rates people then blame on lead quality.\n\nFourth, ignoring compliance until it's a problem. Aged leads are not pre-consented; skipping a DNC and litigator scrub or leaning on prohibited dialing technology turns a profitable channel into legal exposure. Build compliance into the workflow from day one.\n\nFifth, measuring the wrong number. Cost per lead tells you almost nothing. Track cost per contact and cost per funded loan, and optimize the contact rate — that is where the leverage lives.",
      },
      {
        heading: "Working Aged Mortgage Leads Compliantly in 2026",
        body: "Aged mortgage leads are consumer data records, not pre-consented contacts, so you should treat outreach as cold contact and build compliance into your process rather than bolting it on later. That means scrubbing every campaign against the National Do Not Call Registry and a TCPA litigator list before you dial, honoring opt-outs immediately, and relying on manual dialing rather than prohibited automated dialing technology.\n\nThe regulatory picture in 2026 is more workable than the headlines of recent years suggested. The FCC's one-to-one consent rule was vacated in early 2025 before it ever took effect, so the doomsday scenario many lead buyers feared did not materialize. At the same time, several states have active mini-TCPA statutes with their own consent and calling-time rules, so a campaign that is fine federally can still create exposure at the state level. The safe posture is to dial manually, keep clean records of your scrubs and contact attempts, respect state calling windows, and run your specific program past qualified compliance counsel before launch.\n\nFor the full framework — including the conservative-to-aggressive operating modes and the step-by-step consent ladder we use across verticals — see the free playbook. The short version for mortgage: cheap inventory plus a disciplined, compliant workflow is a durable advantage; shortcuts on compliance are the fastest way to lose it.",
      },
    ],
    faqs: [
      {
        question: "What is an aged mortgage lead?",
        answer:
          "An aged mortgage lead is a consumer record from someone who filled out an online form requesting mortgage information 30-180+ days ago. They expressed genuine interest in home loans, refinancing, or other mortgage products but may not have completed their transaction.",
      },
      {
        question: "How much do aged mortgage leads cost?",
        answer:
          "Aged mortgage leads typically cost $0.50 to $3.00 per record, compared to $25-$60+ for real-time leads. The exact price depends on the age of the lead, geographic targeting, and loan type.",
      },
      {
        question: "What conversion rate can I expect from aged mortgage leads?",
        answer:
          "Most mortgage professionals see a 1-3% conversion rate on aged leads with consistent follow-up. While lower than real-time leads (5-10%), the dramatically lower cost means your ROI is often significantly higher — you're working 10-50x more leads for the same budget.",
      },
      {
        question: "Are aged mortgage leads TCPA compliant?",
        answer:
          "Aged mortgage leads are consumer data records, not pre-consented leads. You should treat them as cold outreach and follow TCPA guidelines — use manual dialing, avoid auto-dialers without consent, and consult your compliance team before launching any campaign.",
      },
      {
        question: "How should I contact aged mortgage leads?",
        answer:
          "The most effective approach is a multi-channel cadence: start with a personal phone call using a non-pushy script, follow up with a plain-text email, and consider direct mail for local leads. Space your touches over 7-14 days.",
      },
      {
        question: "Do aged mortgage leads still work in a high-rate market?",
        answer:
          "Yes — arguably better. In a high-rate market, refinance demand looks dead and lead prices soften, so disciplined operators accumulate aged refinance inventory cheaply and stay in low-pressure contact. When rates dip, those records re-activate because the consumer's break-even math has changed, and you're already in the conversation while competitors start cold. Purchase leads work in any rate environment because people still need to buy homes.",
      },
      {
        question: "How old is too old for a mortgage lead?",
        answer:
          "There's no hard cutoff — it depends on loan type and your approach. Purchase leads are most actionable in the 30-90 day window. Refinance, HELOC, and reverse leads stay viable far longer (180 days and beyond) because the underlying need or the rate trigger persists. The key is matching your message to the age: the older the lead, the more your outreach should read as a helpful check-in rather than a response to a fresh inquiry.",
      },
      {
        question: "Should I buy aged purchase or refinance leads?",
        answer:
          "It depends on your business and the rate environment. Purchase leads convert on a shorter timeline and perform consistently regardless of rates. Refinance leads are the higher-leverage play for patient operators because they re-activate when rates move and are cheapest to acquire exactly when competitors stop buying them. Many loan officers run both: purchase for steady near-term production, refinance as an accumulating, rate-sensitive pipeline.",
      },
      {
        question: "Exclusive vs. shared aged mortgage leads — which is better?",
        answer:
          "Exclusive aged leads cost more but you're the only one working them, which lifts contact and conversion rates. Shared leads are cheaper but you may be one of several callers. Because aged leads are already low-competition compared to real-time leads (most original buyers have moved on), shared aged inventory is often a smart value — but if your follow-up process is strong, exclusive aged leads maximize the return on that effort.",
      },
      {
        question: "Where can I buy aged mortgage leads?",
        answer:
          "Several established providers sell aged mortgage leads. Rather than buying on price alone, compare providers on data quality, lead age and filtering options, geographic coverage, and refund or replacement policies. Our independent provider directory rates lead sellers across these dimensions so you can match a provider to your vertical and budget.",
      },
    ],
    getCompareUrl: () =>
      `/providers/best/mortgage`,
  },

  "insurance-leads": {
    slug: "insurance-leads",
    title: "Insurance Leads",
    icon: "🛡️",
    heroDescription:
      "Aged insurance leads give agents access to consumers who previously requested quotes for auto, home, health, or life insurance — at 80-90% less than real-time leads.",
    metaTitle: "Aged Insurance Leads – Affordable Leads for Insurance Agents",
    metaDescription:
      "Buy aged insurance leads for pennies on the dollar. Auto, home, health, and life insurance leads from consumers who requested quotes. Build your pipeline affordably.",
    primaryKeyword: "aged insurance leads",
    secondaryKeywords: [
      "buy insurance leads",
      "cheap insurance leads",
      "insurance lead generation",
      "life insurance leads",
      "auto insurance leads",
    ],
    costRange: "$0.25 – $2.00",
    whoItsFor: [
      "Independent insurance agents",
      "Insurance agency owners",
      "Life insurance agents",
      "P&C insurance agents",
      "Health insurance brokers",
    ],
    whatYouGet: [
      "Full name, phone, email, and address",
      "Insurance type requested (auto, home, life, health)",
      "Coverage details and current policy status",
      "Household information (when available)",
      "Geographic targeting by state and zip code",
    ],
    sections: {
      whatAre:
        "Aged insurance leads are consumer data records from people who previously filled out an online quote request or information form for insurance products — typically 30 to 180 days ago. These consumers actively sought coverage for auto, home, life, health, or other insurance lines by providing their personal and coverage information. Because these leads are not being sold in real-time, they cost a fraction of fresh leads — allowing agents to fill their pipeline with hundreds or thousands of prospects for the price of a handful of real-time leads.",
      whyUse:
        "The insurance industry is one of the most competitive for lead generation. Real-time insurance leads cost $15-$50+ per record, and by the time you call, 5-10 other agents have already reached out. Aged insurance leads eliminate this competition entirely. For $0.25-$2 per lead, you get access to consumers who genuinely needed insurance coverage. Many of these people are still uninsured, underinsured, or unhappy with their current policy. Life events like marriages, home purchases, and health changes keep insurance needs active long after the original inquiry.",
      howToWork:
        "Success with aged insurance leads comes down to volume and consistency. Import your leads into a CRM, segment by insurance type and geography, and work through them systematically. Plan for 5-7 contact attempts per lead across multiple channels. Start with a phone call, follow up with email, and use direct mail for high-value lines like life insurance. Focus on being helpful — ask about their current coverage situation rather than pitching immediately. Cross-selling is a major opportunity: someone who requested auto insurance may also need home or life coverage.",
      script: {
        opener:
          '"Hi [Name], this is [Your Name] with [Agency]. You had looked into [insurance type] coverage a while back — I wanted to check in and see if you found a policy you\'re happy with, or if you\'re still comparing options?"',
        whyItWorks: [
          "References their original intent without being presumptuous",
          "Positions you as a helpful advisor, not a cold caller",
          "Opens the door for cross-selling if they did get coverage",
          'Creates a natural conversation about their current situation',
        ],
      },
      costComparison: {
        realTime: "$15–$50 per lead",
        aged: "$0.25–$2.00 per lead",
        savings: "Save 85-95% per lead",
      },
      bestPractices: [
        "Segment by insurance line first — work one product type per calling session",
        "Cross-sell: auto leads often need home insurance, and vice versa",
        "Life insurance leads are worth calling even 90-180 days later — the need persists",
        "Track every contact attempt and outcome in your CRM",
        "Send a personalized email within 1 hour of your first call attempt",
        "Use current rate comparisons as your hook — premiums change constantly",
        "Ask about life events (new home, new baby, retirement) that create insurance needs",
        "Pull a fresh phone and DNC scrub before every campaign — aged data degrades between capture and dial",
        "Track cost per bound policy and lifetime household value, not just cost per lead — a cross-sold household is worth several times a single policy",
      ],
    },
    deepDive: [
      {
        heading: "Aged Insurance Leads by Line: Auto, Home, Life, and Health",
        body: "Insurance lines age at very different rates, and the line a consumer originally inquired about should dictate how — and how long — you work the record. Auto insurance leads are the most time-sensitive and the most renewable. Policies run on six- or twelve-month terms, so even a consumer who bought elsewhere after their original quote request comes back into play as their renewal approaches. An auto lead that looked cold at 60 days can be perfectly timed at 150 days if it lands a few weeks before their policy renews.\n\nHome insurance leads track the home-buying and mortgage cycle, so they pair naturally with a life event you can ask about directly. Many home-insurance inquiries come from people shopping a new purchase or fighting a premium increase at renewal — both are durable motivations that don't evaporate in 30 days. Life insurance leads are the longest-lived of all. The need behind a life inquiry — a new baby, a mortgage, a gap in coverage — persists for months or years, and the consumer often stalled simply because the decision felt heavy. A respectful follow-up 90 or 180 days later frequently arrives exactly when they're finally ready.\n\nHealth insurance leads are the most calendar-driven: open-enrollment windows and special-enrollment triggers (job loss, marriage, a move) concentrate buying intent into specific periods. An aged health lead worked just before or during open enrollment behaves almost like a fresh one. Segment your list by line before you dial, and write a distinct opener for each — an auto-renewal script and a life-insurance script should not sound the same.",
      },
      {
        heading: "The Real Math: What an Aged Insurance Lead Costs Per Bound Policy",
        body: "The per-lead price is the number agents fixate on and the number that matters least. What matters is your fully loaded cost per bound policy — and, because insurance is a cross-sell business, the lifetime value of the household behind it. Here is the math, framed as an illustration you should re-run with your own numbers.\n\nSay you buy 1,000 aged insurance leads at $1 each — a $1,000 spend. At a 10% contact rate you reach 100 people. At a 2% overall conversion rate you bind roughly 20 policies, putting your lead cost per bound policy around $50. Compare that to real-time leads at, say, $25 each: 1,000 of those would cost $25,000, and even at a higher close rate you'd need a far larger budget to bind the same number of policies. The cheap inventory absorbs a lower close rate and still wins on total policies bound.\n\nThe lever most agents ignore is contact rate, not price. Doubling your contact rate from 5% to 10% — through better dialing windows, a fresh DNC scrub, and a real multi-touch cadence — does more for your cost per bound policy than negotiating the per-lead price in half. And in insurance there's a second multiplier real-time-only agents rarely capture: every bound household is a cross-sell base. When you model the full picture — leads → contacts → bound policies → cross-sold lines → renewals — low-cost aged inventory routinely produces more total premium per dollar spent than a small batch of expensive real-time leads.",
      },
      {
        heading: "Cross-Selling: The Multiplier That Makes Aged Insurance Leads Pay",
        body: "Cross-selling is the single biggest reason aged insurance leads outperform their headline economics, and it's the discipline that separates agents who profit from a list from those who churn through it. A consumer who originally requested an auto quote almost always owns or rents a home, may have a family to protect, and will face renewals across every line they hold. Each bound policy is not an endpoint — it's the start of a household relationship.\n\nThe practical workflow: when you bind one line, you've earned the right to review the rest. An auto policyholder is a natural home- or renters-insurance prospect; a new homeowner needs life coverage to protect the mortgage; a life-insurance buyer often has under-shopped auto and home policies. Because you're already in a trusted advisor conversation — not cold-calling — the second and third policies close at far higher rates than the first, and they cost you nothing in additional lead spend.\n\nThis is why the right success metric for aged insurance leads is lifetime household value, not cost per lead. A single $1 lead that becomes a three-line household with annual renewals can return many multiples of a one-policy close. Build cross-sell prompts into your CRM so every bound policy automatically queues a coverage review on the other lines, and the cheap aged lead becomes the cheapest customer-acquisition channel you have.",
      },
      {
        heading: "Building a Multi-Touch Cadence That Converts Aged Insurance Leads",
        body: "Single-touch outreach wastes aged insurance leads. The contact rates that make the math work assume a structured cadence across channels, spaced over 7 to 14 days — plan for five to seven attempts per lead, not one call and a shrug.\n\nA workable cadence looks like this: Day 1, a manual phone call using a non-pushy opener that acknowledges the consumer's prior quote request. If you don't connect, leave a brief, specific voicemail. Day 1 or 2, a short plain-text email — no HTML template — that references current rates and offers a quick coverage check. Day 3 to 4, a second call at a different time of day than the first. Day 7, a value-add touch: a rate comparison, a note about a renewal window, or a relevant coverage tip. For high-value lines like life insurance, a personalized direct-mail piece lifts response meaningfully. Day 10 to 14, a final call and a soft-close email that leaves the door open.\n\nTwo disciplines decide your return. First, vary the channel and the time of day — three calls at 10 a.m. is not a cadence. Second, log every attempt, outcome, and next action in your CRM, and tag the line of business so cross-sell follow-ups surface automatically. Aged-lead profitability is a workflow problem far more than a lead-quality problem; the inventory is cheap enough that process, not luck, decides the outcome.",
      },
      {
        heading: "Five Mistakes That Destroy Aged Insurance Lead ROI",
        body: "First, treating aged leads like real-time leads. These consumers requested quotes weeks or months ago; an opener that pretends the inquiry was yesterday breaks trust instantly. Acknowledge the gap and reframe as a helpful check-in on their coverage.\n\nSecond, buying on price alone. A cheaper lead with stale contact data, no phone scrub, or the wrong geography costs more per bound policy than a slightly pricier, cleaner record. Judge inventory on data quality and fit, not headline price.\n\nThird, ignoring the cross-sell. Agents who bind one policy and move on leave most of the value on the table. The household behind the lead is the asset; a single-line close is a fraction of what that record can return.\n\nFourth, under-working the list. Buying 1,000 leads, making 200 calls, and quitting guarantees the disappointing contact rates people then blame on lead quality. The math only works when you run the full cadence on the full list.\n\nFifth, treating aged data as pre-consented. Skipping a DNC and litigator scrub or leaning on prohibited dialing technology turns a profitable channel into legal exposure. Build compliance into the workflow from day one rather than bolting it on after a complaint.",
      },
      {
        heading: "Working Aged Insurance Leads Compliantly in 2026",
        body: "Aged insurance leads are consumer data records, not pre-consented contacts, so you should treat outreach as cold contact and build compliance into your process rather than bolting it on later. That means scrubbing every campaign against the National Do Not Call Registry and a TCPA litigator list before you dial, honoring opt-outs immediately, respecting state calling windows, and relying on manual dialing rather than prohibited automated dialing technology.\n\nThe regulatory picture in 2026 is more workable than recent headlines suggested. The FCC's one-to-one consent rule was vacated in early 2025 before it ever took effect, so the disruption many lead buyers feared did not materialize. At the same time, several states run active mini-TCPA statutes with their own consent and calling-time rules, so a campaign that's fine federally can still create exposure at the state level. The safe posture is to dial manually, keep clean records of your scrubs and contact attempts, respect state rules, and run your specific program past qualified compliance counsel before launch.\n\nFor the full framework — including the conservative-to-aggressive operating modes and the step-by-step consent ladder we use across verticals — see the free playbook. The short version for insurance: cheap inventory plus a disciplined, compliant, cross-sell-oriented workflow is a durable advantage; shortcuts on compliance are the fastest way to lose it.",
      },
    ],
    faqs: [
      {
        question: "What types of aged insurance leads are available?",
        answer:
          "Aged insurance leads are available across all major lines: auto insurance, home insurance, life insurance, health insurance, renters insurance, and commercial insurance. You can typically filter by insurance type, geography, and lead age.",
      },
      {
        question: "How much do aged insurance leads cost?",
        answer:
          "Aged insurance leads range from $0.25 to $2.00 per record depending on insurance type, lead age, and geographic targeting. This is 85-95% less than real-time insurance leads.",
      },
      {
        question: "Can I use aged leads with a dialer?",
        answer:
          "Consult your compliance team before using any automated dialing system with aged leads. Since these consumers haven't given specific consent for your agency to contact them, manual dialing is the safest approach. Your compliance and legal team can advise on the appropriate technology for your situation.",
      },
      {
        question: "What's the best way to convert aged insurance leads?",
        answer:
          "The highest-converting approach is a multi-channel cadence: personal phone call with a helpful script, followed by a plain-text email, then a direct mail piece. Focus on identifying current coverage gaps rather than hard-selling a policy. Cross-selling across insurance lines is a major revenue opportunity.",
      },
      {
        question: "How old are aged insurance leads?",
        answer:
          "Aged insurance leads are typically 30-180 days old, with some providers offering leads up to 360 days old. Fresher aged leads (30-60 days) generally have higher contact and conversion rates, while older leads cost less per record.",
      },
      {
        question: "What conversion rate can I expect from aged insurance leads?",
        answer:
          "Most agents see a 1-3% conversion rate on aged insurance leads with consistent, multi-touch follow-up. That's lower than real-time leads, but because aged leads cost a small fraction of the price, you work far more records per dollar — and the cross-sell potential of each bound household lifts the real return well above the single-policy close rate.",
      },
      {
        question: "Do aged life insurance leads still convert months later?",
        answer:
          "Yes — life insurance is the longest-lived aged line. The need behind a life inquiry (a new baby, a mortgage, a coverage gap) persists for months or years, and many consumers simply stalled because the decision felt heavy. A respectful, education-first follow-up 90-180 days after the original request often arrives exactly when the household is finally ready to act, which is why life leads are worth calling far longer than auto.",
      },
      {
        question: "How does cross-selling work with aged insurance leads?",
        answer:
          "Cross-selling is where aged insurance leads pay off. A consumer who requested an auto quote almost always has a home or rental, may need life coverage, and faces renewals across every line. Once you bind one policy you're a trusted advisor, so the second and third lines close at much higher rates — and cost nothing in extra lead spend. Build a coverage-review prompt into your CRM after every bind so cross-sell opportunities surface automatically.",
      },
      {
        question: "Are aged insurance leads TCPA compliant?",
        answer:
          "Aged insurance leads are consumer data records, not pre-consented leads, so treat them as cold outreach. Scrub every campaign against the National Do Not Call Registry and a TCPA litigator list, dial manually rather than using prohibited automated dialing technology, honor opt-outs immediately, and respect state calling windows. The FCC's one-to-one consent rule was vacated in 2025, but several states have active mini-TCPA statutes — run your specific program past qualified compliance counsel before launch.",
      },
      {
        question: "Exclusive vs. shared aged insurance leads — which is better?",
        answer:
          "Exclusive aged leads cost more but you're the only agent working them, which lifts contact and conversion rates. Shared leads are cheaper but you may be one of several callers. Because aged leads are already low-competition compared to real-time leads (most original agents have moved on), shared aged inventory is often strong value — but if your follow-up and cross-sell process is disciplined, exclusive aged leads maximize the return on that effort.",
      },
      {
        question: "Where can I buy aged insurance leads?",
        answer:
          "Several established providers sell aged insurance leads across auto, home, life, and health lines. Rather than buying on price alone, compare providers on data quality, available lines and filters, lead age, geographic coverage, and refund or replacement policies. Our independent provider directory rates lead sellers across these dimensions so you can match a provider to your lines and budget.",
      },
    ],
    getCompareUrl: () =>
      `/providers/best/auto-insurance`,
  },

  "final-expense-leads": {
    slug: "final-expense-leads",
    title: "Final Expense Leads",
    icon: "⚰️",
    heroDescription:
      "Aged final expense leads connect you with seniors who explored burial insurance and end-of-life planning — one of the highest-converting verticals for aged lead campaigns.",
    metaTitle: "Aged Final Expense Leads – Affordable Burial Insurance Leads",
    metaDescription:
      "Buy aged final expense leads at a fraction of real-time cost. Connect with seniors who expressed interest in burial insurance. High-converting vertical for agents.",
    primaryKeyword: "aged final expense leads",
    secondaryKeywords: [
      "buy final expense leads",
      "burial insurance leads",
      "final expense insurance leads",
      "senior life insurance leads",
      "funeral insurance leads",
    ],
    costRange: "$0.50 – $3.00",
    whoItsFor: [
      "Final expense insurance agents",
      "Senior market insurance specialists",
      "Burial insurance agents",
      "Life insurance agents targeting seniors",
      "Insurance agencies with senior-focused teams",
    ],
    whatYouGet: [
      "Full name, phone number, and mailing address",
      "Age and date of birth",
      "Coverage amount requested",
      "Health status indicators (when available)",
      "Beneficiary information (when available)",
    ],
    sections: {
      whatAre:
        "Aged final expense leads are consumer records from seniors (typically ages 50-85) who previously filled out a form expressing interest in burial insurance, funeral insurance, or final expense life insurance policies. These are whole life insurance products designed to cover end-of-life costs — funeral expenses, medical bills, and other debts. Final expense is one of the most popular verticals for aged leads because the need is persistent: seniors who inquired about burial insurance 60-180 days ago still need coverage, and many haven't been served by the agents who originally received their information.",
      whyUse:
        "Final expense is a unique market where aged leads often outperform real-time leads. The reason: seniors take longer to make decisions, they're often comparing multiple agents, and they may have been overwhelmed by aggressive sales tactics from real-time lead buyers. When you reach out 60-180 days later with a gentle, helpful approach, you often catch people who still need coverage but haven't pulled the trigger. Real-time final expense leads cost $20-$40+ each. Aged leads cost $0.50-$3 — giving you 10-40x more prospects to work with.",
      howToWork:
        "The senior market requires a softer, more patient approach. These are often people on fixed incomes who need to feel comfortable and un-pressured. Lead with empathy and education — explain what final expense insurance covers, why it matters for their family, and how affordable the premiums can be. Door knocking is exceptionally effective for final expense if the leads are in your local area. A combination of direct mail (a personal letter, not a flashy postcard) followed by a phone call tends to produce the best results.",
      script: {
        opener:
          '"Hi [Name], this is [Your Name]. I\'m reaching out because you had looked into some information about final expense coverage a little while back. I just wanted to check — did someone help you get that taken care of, or is that still something on your mind?"',
        whyItWorks: [
          "Warm, personal tone appropriate for the senior market",
          'Uses "taken care of" language that resonates with the audience',
          "Doesn't pressure — gives an easy out if they already have coverage",
          "Opens a natural conversation about their family's needs",
        ],
      },
      costComparison: {
        realTime: "$20–$40 per lead",
        aged: "$0.50–$3.00 per lead",
        savings: "Save 85-95% per lead",
      },
      bestPractices: [
        "Use a warm, personal tone — this audience responds to empathy, not urgency",
        "Direct mail is highly effective: send a personal letter before calling",
        "Door knocking converts at 2-5x the rate of phone calls for final expense",
        "Call during daytime hours — seniors are more reachable mid-morning and early afternoon",
        "Keep explanations simple: monthly premium, coverage amount, no medical exam",
        "Ask about their family and who they want to protect — make it personal",
        "Follow up by mail if you can't reach them by phone — seniors often respond to letters",
        "Pull a fresh phone and DNC scrub before every campaign — aged data degrades between capture and dial",
        "Track cost per issued policy and persistency, not cost per lead — a policy that lapses in month three isn't a sale",
      ],
    },
    deepDive: [
      {
        heading: "Why Aged Final Expense Leads Convert When Fresh Ones Burn Out",
        body: "Final expense is the rare vertical where aged leads frequently outperform real-time leads, and understanding why shapes how you work them. The senior buyer moves slowly by nature: they're often on a fixed income, weighing a decision that touches mortality and family, and they want to feel comfortable rather than rushed. Real-time final expense leads are sold to multiple agents who call within minutes, so the senior's first experience is often a wave of aggressive, competing pitches. Many simply shut down and do nothing.\n\nThat stalled senior is exactly who an aged list surfaces. The need hasn't gone away — the desire to spare their family a funeral bill is durable, not seasonal — but the agents who originally bought the lead have long since moved on. When you reach out 60 to 180 days later with a calm, helpful, un-pressured tone, you're often the first person who treated them like a human being rather than a commission. That contrast is your entire advantage, and it's why a gentle aged-lead approach can convert a senior the real-time frenzy drove off.\n\nThe practical implication: your tone is the product. An opener that acknowledges the prior inquiry and offers help, rather than pushing a close, consistently beats the urgency scripts that work in faster verticals. Patience isn't a soft skill here — it's the conversion mechanism.",
      },
      {
        heading: "The Real Math: What an Aged Final Expense Lead Costs Per Issued Policy",
        body: "The per-lead price is the number agents fixate on and the number that matters least. What matters is your fully loaded cost per issued, persisting policy. Here is the math, framed as an illustration you should re-run with your own numbers.\n\nSay you buy 1,000 aged final expense leads at $1.50 each — a $1,500 spend. At a 10% contact rate you reach 100 seniors. At a 2% overall conversion rate you issue roughly 20 policies, putting your lead cost per issued policy around $75. Compare that to real-time leads at, say, $30 each: 1,000 of those would cost $30,000, and even at a higher close rate you'd need a far larger budget to issue the same number of policies. The cheap inventory absorbs a lower close rate and still wins on total policies issued.\n\nTwo levers matter more than price. First, contact rate: doubling it from 5% to 10% — through daytime dialing windows, direct mail ahead of the call, and a real multi-touch cadence — does more for your cost per issued policy than halving the lead price. Second, and unique to this vertical, persistency. A final expense policy that lapses in month three pays you nothing and may trigger a chargeback. Selling a premium the senior can comfortably afford on a fixed income — and confirming it fits their budget before you write it — protects the only number that actually pays: issued business that stays on the books.",
      },
      {
        heading: "Door Knocking and Direct Mail: The Senior-Market Channels That Beat the Phone",
        body: "In most verticals the phone is the primary channel. Final expense is the exception: for local aged leads, door knocking converts at two to five times the rate of phone calls, and a personal letter often outperforms a cold dial. Seniors grew up trusting mail and face-to-face conversation, and they're more comfortable with both than with a phone pitch from a stranger.\n\nThe highest-converting sequence pairs the two. Start with direct mail — a personal letter, not a flashy postcard — that references their prior interest in final expense coverage and signals you'll follow up. The letter warms the contact, so your call or visit isn't truly cold. For leads in your driving radius, an in-person visit is the close: sitting at a kitchen table, explaining a small whole-life policy with no medical exam in plain language, is the single most effective thing you can do in this market. Because aged leads are cheap and plentiful, you can build a route of nearby seniors and work them in person far more economically than real-time-lead economics would ever allow.\n\nThe practical move: load aged final expense leads by zip, plan local routes for door knocking, and use direct mail to soften every contact before you arrive. Reserve the phone for leads outside your driving radius and for follow-up — not as your only tool.",
      },
      {
        heading: "Building a Patient, Empathy-First Cadence for the Senior Market",
        body: "The cadence that works in fast verticals — rapid calls, urgency language, a hard push to close — actively backfires with seniors. Final expense rewards a slower, warmer sequence built around trust.\n\nA workable cadence: begin with a personal letter that references the prior inquiry and says you'll reach out. A few days later, a daytime phone call (mid-morning or early afternoon, when seniors are most reachable) using a gentle opener that asks whether they ever got their coverage 'taken care of.' If you don't connect, follow with another letter rather than hammering the phone. For local leads, schedule an in-person visit; for distant ones, a calm phone conversation that explains the policy simply — monthly premium, coverage amount, no medical exam. Across every touch, keep the focus on their family and their peace of mind, not on closing today.\n\nTwo disciplines separate agents who profit in this market from those who churn through it. First, never let urgency creep into your voice — the moment a senior feels pushed, you've lost the very advantage that aged leads gave you. Second, log every contact and outcome in your CRM and confirm affordability before you write, because in final expense a sale that doesn't persist isn't a sale. Profitability here is a patience-and-process problem far more than a lead-quality one.",
      },
      {
        heading: "Five Mistakes That Destroy Aged Final Expense Lead ROI",
        body: "First, using urgency tactics. The high-pressure scripts that work in faster verticals drive seniors away and squander the calm, helpful positioning that makes aged final expense leads convert in the first place.\n\nSecond, leading with the phone for local leads. Door knocking and direct mail convert far better with this audience; phone-only operators leave the easiest sales on the table.\n\nThird, selling a premium the senior can't sustain. A policy priced above what a fixed income can comfortably carry lapses quickly, pays nothing, and can trigger a chargeback. Confirm affordability before you write.\n\nFourth, under-working the list. Buying thousands of cheap leads and making a few hundred calls guarantees disappointing contact rates that agents then blame on lead quality. The math only works when you run the full cadence — including mail — on the full list.\n\nFifth, getting careless with a vulnerable audience. Seniors warrant extra care on consent, clarity, and honesty. Skipping DNC and litigator scrubs, or blurring how a policy works, turns a profitable channel into both legal exposure and a reputational risk you don't want in the senior market.",
      },
      {
        heading: "Working Aged Final Expense Leads Compliantly in 2026",
        body: "Aged final expense leads are consumer data records, not pre-consented contacts, so treat outreach as cold contact and build compliance into your process. The federal baseline matches every vertical: scrub each campaign against the National Do Not Call Registry and a TCPA litigator list before you dial, honor opt-outs immediately, respect calling windows, and rely on manual dialing rather than prohibited automated dialing technology. The FCC's one-to-one consent rule was vacated in early 2025 before it took effect, and several states run active mini-TCPA statutes, so a campaign that's fine federally can still create state-level exposure.\n\nFinal expense adds a layer of care because the audience is older and, in regulators' eyes, more vulnerable. Be scrupulously clear about what the policy is — a small whole-life insurance product, not a prepaid funeral or a government benefit — and never imply affiliation with Medicare, Social Security, or a government program. Confirm the senior understands the premium, the coverage amount, and any graded-benefit waiting period before issuing. Carriers and state regulators watch senior-market practices closely, so honest, plain-language selling isn't just ethics, it's risk management.\n\nFor the full framework — including the conservative-to-aggressive operating modes and the step-by-step consent ladder we use across verticals — see the free playbook.",
      },
    ],
    faqs: [
      {
        question: "What is a final expense lead?",
        answer:
          "A final expense lead is a consumer record from a senior (typically age 50-85) who previously requested information about burial insurance, funeral insurance, or final expense whole life insurance policies — small face-value policies designed to cover end-of-life costs.",
      },
      {
        question: "Why are aged final expense leads so effective?",
        answer:
          "Seniors take longer to make insurance decisions and are often overwhelmed by aggressive sales tactics from multiple real-time lead buyers. By reaching out 60-180 days later with a gentle, helpful approach, you connect with people who still need coverage but haven't been properly served.",
      },
      {
        question: "What's the best way to reach seniors with aged leads?",
        answer:
          "Direct mail followed by a phone call is the most effective approach for seniors. If leads are in your local area, door knocking has the highest conversion rate of any channel — 2-5x higher than phone calls. Always use a personal, warm tone.",
      },
      {
        question: "How much do aged final expense leads cost?",
        answer:
          "Aged final expense leads typically cost $0.50 to $3.00 per record, compared to $20-$40+ for real-time final expense leads. This allows you to work 10-40x more prospects with the same budget.",
      },
      {
        question: "Can I work aged final expense leads by door knocking?",
        answer:
          "Yes — door knocking is one of the most effective channels for final expense aged leads, especially for local leads. Seniors are often more receptive to in-person visits than phone calls, and conversion rates are significantly higher.",
      },
      {
        question: "What conversion rate can I expect from aged final expense leads?",
        answer:
          "Most agents see a 1-3% overall conversion on aged final expense leads with a patient, multi-touch cadence — higher when door knocking local leads. Because the leads cost a small fraction of real-time prices, you work far more prospects per dollar, and the gentle aged-lead approach often converts seniors who shut down under the real-time sales frenzy.",
      },
      {
        question: "How does persistency affect final expense lead ROI?",
        answer:
          "Persistency is the number that actually pays. A final expense policy that lapses in the first few months earns you little and can trigger a chargeback from the carrier. The fix is to sell a premium the senior can comfortably afford on a fixed income and confirm it fits their budget before writing — so track cost per issued, persisting policy, not cost per lead.",
      },
      {
        question: "Do health issues disqualify aged final expense prospects?",
        answer:
          "Rarely. Most final expense products are simplified-issue or guaranteed-issue whole life with no medical exam, and many carriers offer graded-benefit policies for seniors with health conditions. That's part of why the need persists — applicants who were declined or hesitated elsewhere often still qualify somewhere. Always disclose any graded-benefit waiting period clearly before issuing.",
      },
      {
        question: "Where can I buy aged final expense leads?",
        answer:
          "Several established providers sell aged final expense leads filtered by senior age bands, coverage amount, and geography. Rather than buying on price alone, compare providers on data quality, lead age, local-routing filters for door knocking, and refund or replacement policies. Our independent provider directory rates lead sellers across these dimensions so you can match a provider to your market.",
      },
    ],
    getCompareUrl: () =>
      `/providers/best/final-expense`,
  },

  "iul-leads": {
    slug: "iul-leads",
    title: "IUL Leads",
    icon: "📈",
    heroDescription:
      "Aged IUL leads connect you with consumers who explored Indexed Universal Life insurance — a high-value product with strong commission potential.",
    metaTitle: "Aged IUL Leads – Indexed Universal Life Insurance Leads",
    metaDescription:
      "Buy aged IUL leads from consumers who explored Indexed Universal Life insurance and wealth-building strategies. High-value leads at affordable prices.",
    primaryKeyword: "aged IUL leads",
    secondaryKeywords: [
      "IUL insurance leads",
      "indexed universal life leads",
      "buy IUL leads",
      "cash value life insurance leads",
      "wealth building insurance leads",
    ],
    costRange: "$1.00 – $5.00",
    whoItsFor: [
      "Life insurance agents specializing in IUL",
      "Financial advisors",
      "Wealth management professionals",
      "Insurance agents seeking high-commission products",
      "Retirement planning specialists",
    ],
    whatYouGet: [
      "Full name and contact information",
      "Age and income range (when available)",
      "Investment interest and goals",
      "Current insurance coverage details",
      "Geographic location",
    ],
    sections: {
      whatAre:
        "Aged IUL leads are consumer records from individuals who previously expressed interest in Indexed Universal Life (IUL) insurance products — cash-value life insurance policies that offer market-linked growth with downside protection. These consumers researched wealth-building strategies, tax-advantaged retirement options, or permanent life insurance coverage. IUL is a high-value, high-commission product, and leads from consumers who actively researched it represent some of the most valuable aged leads available.",
      whyUse:
        "IUL is a complex product that requires education and trust-building. Consumers who research IUL are typically higher-income individuals making significant financial decisions — they rarely buy on the first call. This makes aged IUL leads particularly valuable: the consumer has had time to research, compare, and think about their options. Many are still in the decision-making process 60-180 days after their initial inquiry. Real-time IUL leads can cost $30-$75+ each. Aged leads cost $1-$5, giving you a dramatically larger pool of educated, interested prospects.",
      howToWork:
        "IUL leads require a consultative approach. These are financially aware consumers who want education, not a hard pitch. Position yourself as a financial educator: explain how IUL works, the tax advantages, and how it compares to 401(k)s and Roth IRAs. Use real illustrations and examples. The sales cycle for IUL is longer than term life — expect 2-4 conversations before closing. Focus on building a relationship, understanding their financial goals, and demonstrating how IUL fits into their broader strategy.",
      script: {
        opener:
          '"Hi [Name], this is [Your Name]. You had explored some information about Indexed Universal Life insurance a while back — I help people understand how these policies actually work in practice. Did you end up moving forward with a plan, or are you still evaluating your options?"',
        whyItWorks: [
          "Positions you as an educator, not a salesperson",
          'Uses "how these policies actually work" to promise value',
          "Acknowledges the complexity of the product",
          "Opens a consultative conversation about their financial goals",
        ],
      },
      costComparison: {
        realTime: "$30–$75 per lead",
        aged: "$1.00–$5.00 per lead",
        savings: "Save 85-95% per lead",
      },
      bestPractices: [
        "Position yourself as a financial educator, not an insurance salesperson",
        "Prepare IUL illustrations before your call — have real numbers ready",
        "Compare IUL to alternatives (401k, Roth IRA) to demonstrate unique benefits",
        "Ask about their retirement timeline and financial goals before pitching",
        "Use email to share educational content between conversations",
        "Expect a 2-4 conversation sales cycle — IUL is a considered purchase",
        "Focus on high-income zip codes for better conversion rates",
      ],
    },
    faqs: [
      {
        question: "What is an aged IUL lead?",
        answer:
          "An aged IUL lead is a consumer record from someone who previously researched Indexed Universal Life insurance — a cash-value life insurance policy with market-linked growth potential. These leads are 30-180+ days old and cost significantly less than real-time leads.",
      },
      {
        question: "Why are IUL leads more expensive than other aged leads?",
        answer:
          "IUL leads command a premium because the product is high-value — IUL policies generate significantly higher commissions than term life or final expense policies. The consumers are also typically higher-income individuals making substantial financial decisions.",
      },
      {
        question: "What's the typical conversion rate for aged IUL leads?",
        answer:
          "Aged IUL leads typically convert at 1-3% with a consultative, multi-touch approach. While the conversion rate is lower than real-time leads, the high policy values and commissions mean even a small number of conversions delivers strong ROI.",
      },
      {
        question: "How do I approach aged IUL leads differently than other insurance leads?",
        answer:
          "IUL requires education-first selling. These consumers are financially aware and want to understand the product before committing. Use illustrations, comparisons to other retirement vehicles, and focus on their financial goals rather than the insurance product itself.",
      },
    ],
    getCompareUrl: () =>
      `/providers/best/annuity-iul`,
  },

  "ssdi-leads": {
    slug: "ssdi-leads",
    title: "SSDI Leads",
    icon: "⚖️",
    heroDescription:
      "Aged SSDI leads connect disability attorneys and advocates with individuals who previously sought help with Social Security Disability Insurance claims.",
    metaTitle: "Aged SSDI Leads – Social Security Disability Leads",
    metaDescription:
      "Buy aged SSDI leads from individuals seeking disability claim assistance. Connect with people who need legal representation for Social Security Disability cases.",
    primaryKeyword: "aged SSDI leads",
    secondaryKeywords: [
      "SSDI disability leads",
      "social security disability leads",
      "disability attorney leads",
      "buy SSDI leads",
      "disability claim leads",
    ],
    costRange: "$0.50 – $3.00",
    whoItsFor: [
      "Social Security Disability attorneys",
      "Disability law firms",
      "Disability advocacy organizations",
      "Legal intake specialists",
      "Disability claim assistance companies",
    ],
    whatYouGet: [
      "Full name and contact information",
      "Disability type or condition",
      "Claim status (initial, denied, appeal)",
      "Geographic location",
      "Date of inquiry",
    ],
    sections: {
      whatAre:
        "Aged SSDI leads are consumer records from individuals who previously sought assistance with Social Security Disability Insurance claims. These are people who filled out forms requesting help with their disability application, an appeal after denial, or general information about SSDI benefits. SSDI is a long-cycle process — initial applications take 3-6 months, and appeals can take 1-2+ years. This makes aged leads exceptionally valuable: someone who inquired 60-180 days ago is likely still in the process and may still need legal representation.",
      whyUse:
        "The SSDI process is notoriously slow, which works in your favor with aged leads. Over 60% of initial SSDI applications are denied, and many applicants don't seek legal help until they face a denial. A lead that's 60-180 days old may be someone who just received their denial letter and now urgently needs an attorney. Real-time SSDI leads cost $20-$50+ each. Aged leads cost $0.50-$3, giving you a much larger pool of potential clients who are actively navigating the disability claims process.",
      howToWork:
        "SSDI leads require empathy and patience. These are individuals dealing with disabilities and navigating a complex government process — many are frustrated, confused, and overwhelmed. Lead with compassion: ask about their situation, explain the process clearly, and reassure them that help is available. Focus on leads who have been denied — they have the most urgent need for legal representation. The fee structure for SSDI cases (contingency-based) makes this an easy conversation: there's no upfront cost to the client.",
      script: {
        opener:
          '"Hi [Name], this is [Your Name] from [Firm]. You had reached out about help with a Social Security Disability claim a while back. I wanted to check in — have you been able to get your benefits approved, or are you still working through the process?"',
        whyItWorks: [
          "Shows empathy and genuine interest in their situation",
          "Acknowledges the difficulty of the process",
          "Identifies whether they've been denied (your opportunity)",
          "Opens a supportive, non-salesy conversation",
        ],
      },
      costComparison: {
        realTime: "$20–$50 per lead",
        aged: "$0.50–$3.00 per lead",
        savings: "Save 85-95% per lead",
      },
      bestPractices: [
        "Prioritize leads who mention denials — they have the most urgent need",
        "Explain the contingency fee structure upfront — no cost to the client",
        "Be patient and empathetic — these individuals are dealing with serious health issues",
        "Ask about their current status in the process (initial application, denial, appeal)",
        "Follow up persistently but gently — the SSDI process is overwhelming",
        "Provide educational materials about the appeal process",
        "Track the timeline of their claim — urgency increases as deadlines approach",
      ],
    },
    faqs: [
      {
        question: "What is an aged SSDI lead?",
        answer:
          "An aged SSDI lead is a consumer record from someone who previously requested help with a Social Security Disability Insurance claim. These leads are 30-180+ days old and represent individuals who may still be navigating the disability claims process.",
      },
      {
        question: "Why do aged SSDI leads convert well?",
        answer:
          "The SSDI process is extremely slow — initial applications take 3-6 months, and appeals can take over a year. Someone who inquired 60-180 days ago is often still in the process and may have received a denial, creating an urgent need for legal representation.",
      },
      {
        question: "What's the best approach for SSDI leads?",
        answer:
          "Lead with empathy and education. Ask about their claim status, explain the appeal process clearly, and emphasize that legal representation is typically on a contingency basis — no upfront cost. Focus on denied applicants who need help with appeals.",
      },
    ],
    getCompareUrl: () =>
      `/providers/best/life-insurance`,
  },

  "mva-leads": {
    slug: "mva-leads",
    title: "MVA Leads",
    icon: "🚗",
    heroDescription:
      "Aged MVA leads connect personal injury attorneys with individuals who were involved in motor vehicle accidents and sought legal representation.",
    metaTitle: "Aged MVA Leads – Motor Vehicle Accident Leads for Attorneys",
    metaDescription:
      "Buy aged MVA leads from individuals involved in auto accidents seeking legal representation. Affordable leads for personal injury attorneys and law firms.",
    primaryKeyword: "aged MVA leads",
    secondaryKeywords: [
      "motor vehicle accident leads",
      "car accident leads",
      "personal injury leads",
      "buy MVA leads",
      "auto accident attorney leads",
    ],
    costRange: "$1.00 – $5.00",
    whoItsFor: [
      "Personal injury attorneys",
      "Auto accident law firms",
      "Legal intake companies",
      "Personal injury case managers",
      "Accident claim specialists",
    ],
    whatYouGet: [
      "Full name and contact information",
      "Accident date and type",
      "Injury description",
      "Insurance status",
      "Geographic location of the accident",
    ],
    sections: {
      whatAre:
        "Aged MVA (Motor Vehicle Accident) leads are consumer records from individuals who were involved in car accidents and previously sought legal assistance. These consumers filled out forms requesting information about personal injury representation, accident claims, or legal rights after an auto accident. MVA leads are valuable because accident victims often take weeks or months to decide on legal representation — dealing with injuries, insurance companies, and recovery while trying to navigate the legal system.",
      whyUse:
        "Many accident victims don't seek legal representation immediately. They may initially try to handle the insurance claim themselves, only to realize weeks or months later that they need an attorney — especially when the insurance company lowballs their settlement. Aged MVA leads capture these people at exactly the right moment. Real-time MVA leads can cost $50-$200+ each and are sold to multiple firms simultaneously. Aged leads cost $1-$5, giving personal injury firms a dramatically more cost-effective way to fill their case pipeline.",
      howToWork:
        "MVA leads require urgency balanced with sensitivity. These are people dealing with injuries, vehicle damage, and insurance headaches — they need help, but they also need to feel like they're choosing the right attorney. Focus on the statute of limitations (2-3 years in most states) and the risks of waiting too long to file. Explain that most personal injury cases are handled on contingency — no fees unless they win. Ask about their injuries, medical treatment, and what the insurance company has offered. This information helps you evaluate the case while building rapport.",
      script: {
        opener:
          '"Hi [Name], this is [Your Name] from [Firm]. You had reached out about your auto accident a while back — I wanted to check in and see if you were able to get your claim resolved, or if you\'re still dealing with the insurance company?"',
        whyItWorks: [
          "References their specific situation (auto accident)",
          "Acknowledges they may be struggling with insurance",
          "Opens the door for people who were lowballed or denied",
          "Positions you as someone who can help resolve their problem",
        ],
      },
      costComparison: {
        realTime: "$50–$200 per lead",
        aged: "$1.00–$5.00 per lead",
        savings: "Save 90-97% per lead",
      },
      bestPractices: [
        "Ask about the insurance company's offer first — many victims are being lowballed",
        "Explain the contingency fee structure immediately — no cost unless they win",
        "Discuss the statute of limitations to create appropriate urgency",
        "Ask about ongoing medical treatment — active treatment strengthens the case",
        "Follow up within 24 hours of first contact with a case evaluation email",
        "Document everything discussed for case intake purposes",
        "Prioritize leads with recent accident dates (within 6-12 months)",
      ],
    },
    faqs: [
      {
        question: "What is an aged MVA lead?",
        answer:
          "An aged MVA lead is a consumer record from someone involved in a motor vehicle accident who previously sought legal assistance. These leads are 30-180+ days old and often represent accident victims who are still dealing with injuries and insurance claims.",
      },
      {
        question: "Why do accident victims wait to hire an attorney?",
        answer:
          "Many accident victims initially try to handle their insurance claim independently. They often seek legal help weeks or months later when they realize the insurance company is offering a low settlement, denying their claim, or when ongoing medical bills mount up.",
      },
      {
        question: "How much do aged MVA leads cost compared to real-time?",
        answer:
          "Aged MVA leads typically cost $1-$5 per record, compared to $50-$200+ for real-time personal injury leads. This represents a 90-97% cost savings.",
      },
    ],
    getCompareUrl: () =>
      `/providers/best/legal`,
  },

  "solar-leads": {
    slug: "solar-leads",
    title: "Solar Leads",
    icon: "☀️",
    heroDescription:
      "Aged solar leads connect you with homeowners who explored solar panel installation and energy savings — a growing market with strong residential demand.",
    metaTitle: "Aged Solar Leads – Affordable Solar Installation Leads",
    metaDescription:
      "Buy aged solar leads from homeowners interested in solar panel installation. Connect with solar-curious homeowners at a fraction of real-time lead costs.",
    primaryKeyword: "aged solar leads",
    secondaryKeywords: [
      "buy solar leads",
      "solar panel leads",
      "residential solar leads",
      "solar installation leads",
      "cheap solar leads",
    ],
    costRange: "$0.50 – $3.00",
    whoItsFor: [
      "Solar installation companies",
      "Solar sales representatives",
      "Renewable energy companies",
      "Solar financing companies",
      "Energy consultants",
    ],
    whatYouGet: [
      "Homeowner name and contact information",
      "Property address and type",
      "Average monthly electric bill (when available)",
      "Roof type and condition indicators",
      "Utility company and rate information",
    ],
    sections: {
      whatAre:
        "Aged solar leads are homeowner records from individuals who previously requested information about solar panel installation, solar financing, or energy savings. These homeowners filled out forms expressing interest in going solar — they provided their contact information, property details, and electricity costs. Solar is a high-consideration purchase (average residential system costs $15,000-$25,000 before incentives), so many homeowners take months to make a decision. Aged solar leads capture homeowners who are still in the research and comparison phase.",
      whyUse:
        "Solar is one of the longest sales cycles in the aged lead space — homeowners typically take 3-6 months from initial research to signing a contract. This makes aged leads incredibly valuable: a lead that's 60-180 days old is often a homeowner who is deeper into their decision-making process, has compared multiple quotes, and is closer to being ready. Real-time solar leads cost $20-$50+ each. Aged leads cost $0.50-$3, allowing solar companies to work a much larger territory with the same budget.",
      howToWork:
        "Solar leads require education and value demonstration. Homeowners want to understand their savings, the financing options, tax incentives, and the installation process. Lead with their electricity bill: if you know their average monthly cost, you can immediately calculate potential savings. Use local installation examples and current incentive programs as hooks. The solar ITC (Investment Tax Credit) and state-level incentives are powerful motivators that change regularly — use current information as a reason to reconnect.",
      script: {
        opener:
          '"Hi [Name], this is [Your Name] from [Company]. You had looked into solar options for your home a while back — I\'m reaching out because there have been some updates to the solar incentives in [State] that could significantly reduce your costs. Did you end up going solar, or are you still considering it?"',
        whyItWorks: [
          "References their original interest in solar",
          "Leads with new value (updated incentives) rather than a repeat pitch",
          "Creates urgency around changing incentives",
          "Opens a conversation about their decision timeline",
        ],
      },
      costComparison: {
        realTime: "$20–$50 per lead",
        aged: "$0.50–$3.00 per lead",
        savings: "Save 85-95% per lead",
      },
      bestPractices: [
        "Lead with electricity bill savings — homeowners care about monthly cost impact",
        "Reference current federal and state solar incentives (they change annually)",
        "Offer a free home solar assessment as your CTA",
        "Use satellite imagery tools to pre-qualify roof suitability before calling",
        "Focus on homeowners in high-electricity-cost areas for better conversion",
        "Address common objections: roof condition, HOA restrictions, and financing",
        "Send a personalized savings estimate by email after your first conversation",
      ],
    },
    faqs: [
      {
        question: "What is an aged solar lead?",
        answer:
          "An aged solar lead is a homeowner record from someone who previously requested information about solar panel installation or solar energy savings. These leads are 30-180+ days old and represent homeowners who are considering going solar.",
      },
      {
        question: "Why are aged solar leads effective?",
        answer:
          "Solar has one of the longest sales cycles in residential services — homeowners typically take 3-6 months to decide. Aged leads are often homeowners who are deeper into their decision process, have compared quotes, and are closer to signing. They're also 85-95% cheaper than real-time leads.",
      },
      {
        question: "What's the conversion rate for aged solar leads?",
        answer:
          "Aged solar leads typically convert at 1-3% with consistent follow-up. The key is leading with updated incentive information and personalized savings estimates based on their electricity costs and location.",
      },
    ],
    getCompareUrl: () =>
      `/providers/best/solar`,
  },

  "medicare-leads": {
    slug: "medicare-leads",
    title: "Medicare Leads",
    icon: "🏥",
    heroDescription:
      "Aged Medicare leads connect you with seniors exploring Medicare supplement plans, Medicare Advantage, and Part D options — a growing market with high demand.",
    metaTitle: "Aged Medicare Leads – Affordable Medicare Supplement Leads",
    metaDescription:
      "Buy aged Medicare leads from seniors exploring Medicare supplement, Advantage, and Part D plans. Connect with eligible seniors at a fraction of real-time lead costs.",
    primaryKeyword: "aged Medicare leads",
    secondaryKeywords: [
      "buy Medicare leads",
      "Medicare supplement leads",
      "Medicare Advantage leads",
      "Medigap leads",
      "Medicare insurance leads",
    ],
    costRange: "$0.50 – $3.00",
    whoItsFor: [
      "Medicare insurance agents",
      "Medicare supplement specialists",
      "Insurance agencies with Medicare divisions",
      "Senior market insurance agents",
      "Health insurance brokers",
    ],
    whatYouGet: [
      "Full name, phone, and mailing address",
      "Age and Medicare eligibility status",
      "Current Medicare plan type (if applicable)",
      "Interest area (supplement, Advantage, Part D)",
      "Geographic location",
    ],
    sections: {
      whatAre:
        "Aged Medicare leads are consumer records from seniors who previously requested information about Medicare supplement plans (Medigap), Medicare Advantage plans, or Part D prescription drug coverage. These individuals are either approaching Medicare eligibility (turning 65), already on Medicare and looking for better coverage options, or in a special enrollment period due to a qualifying life event. Medicare is a high-demand, recurring market — with 10,000+ Americans turning 65 every day, the pipeline is constantly refreshing.",
      whyUse:
        "Medicare enrollment isn't a one-time event. Open Enrollment happens every year (October 15 - December 7), and Special Enrollment Periods occur throughout the year due to life changes. A senior who inquired about Medicare coverage 60-180 days ago may now be in an enrollment period, dissatisfied with their current plan, or experiencing new health needs that require different coverage. Real-time Medicare leads cost $15-$40+ each during enrollment season. Aged leads cost $0.50-$3, allowing you to build relationships year-round and be their agent when enrollment opens.",
      howToWork:
        "Medicare leads require product knowledge and trust. Seniors are bombarded with Medicare mailers and calls — your differentiator is being helpful, knowledgeable, and patient. Focus on understanding their current coverage, medications, and doctors before recommending a plan. Use the Annual Enrollment Period (AEP) and Open Enrollment Period (OEP) as natural conversation starters. Work your aged leads year-round to build relationships, then convert during enrollment windows when they can actually switch plans.",
      script: {
        opener:
          '"Hi [Name], this is [Your Name]. You had looked into Medicare coverage options a while back. With [upcoming enrollment period / recent changes to plans in your area], I wanted to check in — are you happy with your current Medicare plan, or would you like me to run a quick comparison to see if there\'s something that might save you money?"',
        whyItWorks: [
          "References a specific, timely reason for calling (enrollment period or plan changes)",
          "Offers immediate value (free comparison)",
          "Focuses on savings — a key motivator for seniors on fixed incomes",
          "Non-threatening and helpful tone",
        ],
      },
      costComparison: {
        realTime: "$15–$40 per lead",
        aged: "$0.50–$3.00 per lead",
        savings: "Save 85-95% per lead",
      },
      bestPractices: [
        "Time your outreach around enrollment periods for highest conversion",
        "Know the Medicare plans available in each lead's county — plan availability varies",
        "Ask about medications first — drug coverage drives most plan decisions",
        "Ask about their doctors — network coverage is the second biggest factor",
        "Build relationships year-round, then convert during enrollment windows",
        "Mail a personal letter with your contact info — seniors keep and reference mail",
        "Follow CMS marketing guidelines strictly — Medicare has specific advertising rules",
        "Confirm a valid permission to contact and a documented Scope of Appointment before discussing specific MA/PDP plans",
        "Record beneficiary calls in their entirety where CMS requires it, and track cost per enrolled member plus renewals, not cost per lead",
      ],
    },
    deepDive: [
      {
        heading: "Medicare's Enrollment Calendar: Why Aged Leads Are a Year-Round Relationship Play",
        body: "Medicare is unlike any other aged vertical because conversion is gated by a calendar. A senior can want to switch plans in July, but in most cases they can't actually enroll until a qualifying window opens. That single fact reframes how you work aged Medicare leads: the goal is not to close on the first call, it's to be the trusted agent already in the relationship when the senior's enrollment window arrives.\n\nThe windows that matter: the Annual Enrollment Period (October 15 to December 7), when anyone can change Medicare Advantage and Part D coverage; the Medicare Advantage Open Enrollment Period (January 1 to March 31) for those already in an MA plan; Special Enrollment Periods triggered by life events like a move, a loss of employer coverage, or a plan leaving the market; and the Initial Enrollment Period around a person's 65th birthday. Roughly 10,000 Americans age into Medicare every day, so the aging-in pipeline never stops refreshing.\n\nThis is why aged Medicare inventory is a relationship asset rather than a one-call-close list. You buy cheap, stay in helpful contact year-round, and convert in volume when a window opens. An agent who has been quietly useful to a senior for six months wins the AEP conversation against the wall of mailers and cold calls every other agent unleashes in October.",
      },
      {
        heading: "The Real Math: Cost Per Enrolled Member and the Renewal Annuity",
        body: "The per-lead price matters less in Medicare than almost anywhere, because Medicare pays on renewals. An enrolled member typically generates a commission in year one and a recurring renewal commission for as long as the policy stays active — so the real metric is cost per enrolled member measured against the member's multi-year value, not cost per lead. Here is the math, framed as an illustration you should re-run with your own numbers.\n\nSay you buy 1,000 aged Medicare leads at $1.50 each — a $1,500 spend. Worked patiently across a year and converted around an enrollment window at a 2% overall rate, that's roughly 20 enrolled members, or about $75 in lead cost per member. Now layer in renewals: each member who stays on the books pays you again every year, so a $75 acquisition cost is recovered many times over the life of the relationship. Compare that to real-time enrollment-season leads at $30 or more each, where you'd spend $30,000 to work the same 1,000 prospects.\n\nThe levers are contact rate and retention. A real multi-touch, year-round cadence lifts both how many leads you reach and how many you're still serving at renewal. Because the renewal annuity rewards members who stay, the consultative work of matching a senior to a plan that genuinely fits their drugs and doctors isn't just good service — it's what protects the recurring revenue that makes Medicare the best long-term economics of any aged vertical.",
      },
      {
        heading: "Plan Selection: Drugs First, Doctors Second",
        body: "The fastest way to lose a Medicare prospect is to lead with a plan instead of with their situation. Seniors are buried in generic plan pitches; your differentiator is a genuinely consultative process, and that process has a specific order.\n\nDrugs first. Prescription coverage drives most plan decisions, and the wrong formulary can cost a senior thousands out of pocket. Before you recommend anything, get their medication list and check it against each plan's formulary and pharmacy network. Doctors second. A Medicare Advantage plan that doesn't include their physician or preferred hospital is a non-starter for most seniors, so confirm network coverage before going further. Only after drugs and doctors do plan type, premium, and extra benefits come into play — and even then the right answer is whatever genuinely fits, which sometimes means a Medigap plus standalone Part D rather than an all-in-one Advantage plan.\n\nThis order does double duty. It produces a recommendation the senior trusts because it's built around their actual life, and it protects persistency — members enrolled in a plan that truly covers their drugs and doctors don't churn out at the next enrollment period. In a renewal-driven business, getting the fit right is the whole game.",
      },
      {
        heading: "Building a Year-Round Nurture That Converts at Enrollment",
        body: "Because enrollment is calendar-gated, the Medicare cadence is a marathon, not a sprint. The work is staying genuinely useful for months so that you're the obvious choice when the senior can finally act.\n\nA workable rhythm: an early, permission-respecting introduction that offers a free, no-obligation plan comparison and asks how they'd like to stay in touch. Periodic value touches through the year — a personal letter they can keep with your contact info, a heads-up about plan changes in their county, a reminder of when their enrollment window opens. As AEP approaches, a warmer outreach to schedule the comparison and, where required, to set up a documented Scope of Appointment before discussing specific plans. During the window itself, the conversion conversation you've earned the right to have. After enrollment, you don't go quiet — you check in so the member is still with you at renewal and refers their friends.\n\nTwo disciplines decide your return. First, respect the contact rules at every step (covered below) — Medicare is the most regulated aged vertical and shortcuts are expensive. Second, log every touch, the senior's drugs and doctors, their enrollment window, and their plan in your CRM, so the right conversation happens at the right time. Profitability here is patience plus organization, not dialing volume.",
      },
      {
        heading: "Five Mistakes That Destroy Aged Medicare Lead ROI",
        body: "First, treating Medicare like a one-call close. Enrollment is calendar-gated; pushing for an enrollment outside a valid window is both futile and, in some cases, non-compliant. The win is the relationship that converts when the window opens.\n\nSecond, ignoring the CMS contact rules. Medicare restricts how and when you can market MA and Part D plans far more tightly than other verticals — assuming an old lead gives you free rein to call and pitch plans is the single most dangerous mistake in this market.\n\nThird, leading with a plan instead of the senior's drugs and doctors. It reads as just another generic pitch, and it produces mismatched enrollments that lapse at the next window — destroying the renewal annuity that makes Medicare worthwhile.\n\nFourth, neglecting the year-round nurture. Agents who only show up in October are buried under everyone else's AEP blitz. The cheap aged lead's whole advantage is the months of relationship you can build before the window.\n\nFifth, sloppy documentation. Missing or invalid Scope of Appointment forms, un-recorded calls where recording is required, and no record of permission to contact turn a good enrollment into a compliance liability. In Medicare, the paperwork is part of the sale.",
      },
      {
        heading: "Working Aged Medicare Leads Compliantly in 2026",
        body: "Medicare is the most heavily regulated aged vertical, and the rules go well beyond standard TCPA practice — so approach aged Medicare inventory more conservatively than any other lead type, and treat qualified compliance counsel as mandatory rather than optional. The marketing of Medicare Advantage and Part D plans is governed by CMS, and several requirements bear directly on aged-lead outreach.\n\nPermission to contact is the threshold issue. CMS generally prohibits unsolicited contact to market MA and PDP plans; a consumer's request for information can establish permission to contact, but that permission is event-specific and time-limited — which means an aged Medicare lead's original consent may no longer be valid, and calling on a stale permission is a real risk. Before discussing specific plans you must obtain and document a Scope of Appointment, generally secured ahead of the meeting under CMS timing rules. TPMOs are required to include the CMS disclaimer in marketing and, in many cases, to record beneficiary calls in their entirety, including the enrollment conversation. On top of all that sit the ordinary TCPA baselines — DNC and litigator scrubs, manual dialing, honoring opt-outs, and state mini-TCPA rules.\n\nThe honest takeaway: aged Medicare leads can be valuable as a year-round relationship pipeline, but the compliance surface is large and the penalties are serious. Build SOA, permission-to-contact verification, call recording, and CMS disclaimers into your workflow from day one, confirm current CMS rules each plan year, and run your specific program past qualified Medicare compliance counsel before you launch. For the broader cross-vertical framework — the conservative-to-aggressive operating modes and the consent ladder — see the free playbook, and layer the CMS-specific requirements on top.",
      },
    ],
    faqs: [
      {
        question: "What is an aged Medicare lead?",
        answer:
          "An aged Medicare lead is a consumer record from a senior who previously requested information about Medicare supplement (Medigap), Medicare Advantage, or Part D prescription drug plans. These leads are 30-180+ days old.",
      },
      {
        question: "When is the best time to work aged Medicare leads?",
        answer:
          "The Annual Enrollment Period (October 15 - December 7) is the highest-conversion window, but building relationships year-round with aged leads positions you as their trusted agent when enrollment opens. Special Enrollment Periods also create opportunities throughout the year.",
      },
      {
        question: "What compliance rules apply to Medicare leads?",
        answer:
          "Medicare marketing is regulated by CMS (Centers for Medicare & Medicaid Services) on top of standard TCPA rules. Key requirements include a valid permission to contact, a documented Scope of Appointment before discussing specific plans, the CMS/TPMO disclaimer in marketing, and call recording where required — plus DNC scrubs and manual dialing. This is the most regulated aged vertical; consult qualified Medicare compliance counsel and confirm current CMS rules each plan year before any outreach.",
      },
      {
        question: "Can I cold-call aged Medicare leads to sell a plan?",
        answer:
          "Be very careful here. CMS generally prohibits unsolicited contact to market Medicare Advantage and Part D plans. A consumer's original information request can establish permission to contact, but that permission is event-specific and time-limited — so an aged lead's consent may have expired. Because calling on a stale permission is a real compliance risk, treat aged Medicare leads more conservatively than other verticals and verify a valid permission to contact before you dial. When in doubt, get compliance counsel's sign-off.",
      },
      {
        question: "Why do renewals make Medicare leads valuable long-term?",
        answer:
          "Medicare typically pays a first-year commission plus a recurring renewal commission for as long as the member keeps the plan active. That turns each enrolled member into a multi-year annuity, so a modest cost per enrolled member is recovered many times over. It also means getting the plan fit right — matching the senior's drugs and doctors so they don't switch away — directly protects your recurring revenue.",
      },
      {
        question: "Where can I buy aged Medicare leads?",
        answer:
          "Several established providers sell aged Medicare leads filtered by eligibility status, interest area (supplement, Advantage, Part D), and geography. Because Medicare carries extra compliance requirements, prioritize providers with clean consent documentation and clear sourcing alongside data quality, lead age, and refund policies. Our independent provider directory rates lead sellers across these dimensions so you can match a provider to your market.",
      },
    ],
    getCompareUrl: () =>
      `/providers/best/medicare`,
  },

  "home-services-leads": {
    slug: "home-services-leads",
    title: "Home Services Leads",
    icon: "🔨",
    heroDescription:
      "Aged home services leads connect you with homeowners who requested quotes on roofing, solar, windows, HVAC, remodel, pest, and foundation projects — all at a fraction of real-time lead prices.",
    metaTitle: "Aged Home Services Leads – Buy Affordable Home Services Leads",
    metaDescription:
      "Buy aged home services leads for roofing, solar, windows, HVAC, remodels, and more. 80-95% cheaper than real-time leads, with verified, hygiene-screened contact data.",
    primaryKeyword: "aged home services leads",
    secondaryKeywords: [
      "aged roofing leads",
      "aged solar leads",
      "aged HVAC leads",
      "aged remodel leads",
      "contractor leads",
      "home improvement leads",
    ],
    costRange: "$0.75 – $10.00",
    whoItsFor: [
      "Roofing contractors and crews",
      "Solar installers and EPCs",
      "Window and door replacement companies",
      "HVAC installers",
      "Kitchen and bath remodelers",
      "Pest control companies",
      "Foundation repair contractors",
    ],
    whatYouGet: [
      "Homeowner name and contact information",
      "Property address for field routing",
      "Project type and approximate scope",
      "Timing indicators (immediate, this quarter, this year)",
      "Geographic targeting by zip code",
    ],
    sections: {
      whatAre:
        "Aged home services leads are consumer records from homeowners who previously requested quotes or information on a home improvement, repair, or installation project — typically 30 to 180 days ago. These projects include roofing replacement, solar installation, window and door replacement, HVAC upgrades, kitchen and bath remodels, pest control, and foundation work. The prospect filled out a form, got contacted by one or two contractors, and then either stalled, delayed, or never moved forward. Because the underlying problem — an aging roof, rising utility bill, failing HVAC — doesn't go away on its own, these prospects remain high-intent long after the original inquiry.",
      whyUse:
        "Real-time home services leads routinely run $30-$150 per record, and multiple contractors call within minutes. Aged home services leads cost $0.75-$10 and the prospect is usually past the initial frenzy — easier to have a real conversation, easier to book a clean estimate, easier to win on service rather than price. Average revenue per closed job is high ($2,500 for windows, $4,500 for roofing, $15,000+ for remodels), so even modest contact and close rates produce strong ROI. This is one of the most economically forgiving verticals for aged-lead operations.",
      howToWork:
        "Home services works on a two-step funnel: contact → estimate → sold. Your outbound goal is always booking the estimate, not closing on the phone. Load your leads by zip code so field reps aren't crossing paths. Run a 14-day multi-channel opener cadence (phone + SMS + email) that drives to a scheduled estimate. Field rep closes on the driveway. The 'neighborhood' play — soft outreach to every aged lead in a zip when you complete a nearby job — is unique to home services and produces outstanding nurture conversion.",
      script: {
        opener:
          '"Hey [Name], this is [Your Name] with [Company]. A couple months back you looked at quotes for [roofing / solar / windows / HVAC]. Just checking in — did you get it handled, or is it still on your list?"',
        whyItWorks: [
          "Names the specific project type — shows you're not cold-calling at random",
          "Opens with a neutral question, not a pitch",
          '"Still on your list" gives permission to say yes without commitment',
          "Natural lead-in to booking a no-pressure estimate",
        ],
      },
      costComparison: {
        realTime: "$30–$150 per lead",
        aged: "$0.75–$10 per lead",
        savings: "Save 85-95% per lead",
      },
      bestPractices: [
        "Book estimates, don't close on the phone — home services is a two-step funnel",
        "Load leads by zip to keep field reps efficient",
        "Send appointment reminders (SMS + email) — no-show rate drops from 25% to 8%",
        "Run the 'neighborhood' play — touch every aged lead in a zip when you complete a nearby job",
        "Check state storm moratoriums (FL, TX, LA) before post-storm outreach",
        "Use 'free estimate' not 'free inspection' — the word 'inspection' triggers solicitation rules in some states",
        "Financing disclosures require Regulation Z-compliant script language",
        "Pull a fresh phone and DNC scrub before every campaign — aged data degrades between capture and dial",
        "Track cost per booked estimate and cost per sold job, not cost per lead — the booked estimate is the real unit of work",
      ],
    },
    deepDive: [
      {
        heading: "Aged Home Services Leads by Trade: Roofing, Solar, HVAC, Windows, and Remodel",
        body: "Home services is really a dozen businesses under one label, and the trade a homeowner inquired about should dictate both your timing and your expectations. Roofing leads are driven by a failing or aging roof and, in storm states, by weather events — the underlying problem only worsens with time, so an aged roofing lead stays high-intent for months. The decision cycle is relatively fast once the homeowner re-engages, and average revenue per job (often $4,500 and up) makes even modest close rates pay.\n\nHVAC and foundation leads behave similarly: they're problem-driven, the problem doesn't resolve itself, and homeowners who stalled often did so because the first contractor was slow, pushy, or never followed up. Window and door leads sit in the middle — part comfort, part energy bill, part curb appeal — with moderate cycles and solid per-job revenue. Solar and full remodel leads are the longest-cycle, highest-ticket categories. A solar inquiry can take months to mature as the homeowner weighs financing, incentives, and roof condition; a kitchen or bath remodel can run $15,000 and up with a deliberation period to match. These reward patient, well-designed nurture far more than aggressive calling.\n\nThe practical move: segment your aged list by trade before you dial and set timing expectations accordingly. A roofing record gets a fast, problem-focused booking push; a remodel record gets a longer, value-and-design nurture. One generic script across every trade leaves money on the table.",
      },
      {
        heading: "The Real Math: Cost Per Booked Estimate and Cost Per Sold Job",
        body: "Home services is a two-step funnel — contact, then estimate, then sold — so the per-lead price tells you almost nothing. The two numbers that matter are cost per booked estimate and cost per sold job. Here is the math, framed as an illustration you should re-run with your own close rate and ticket size.\n\nSay you buy 1,000 aged roofing leads at $3 each — a $3,000 spend. At a 10% contact-to-booking rate you book 100 estimates, putting your cost per booked estimate at $30. If your field reps close 25% of estimates, you sell 25 jobs, putting your lead cost per sold job at $120. At a $4,500 average roofing ticket, that's $112,500 in booked revenue against a $3,000 lead spend — and the lead cost is a rounding error against the job value. That economic cushion is exactly why home services is one of the most forgiving verticals for aged-lead operations.\n\nThe lever to optimize is the booked-estimate rate, not the lead price. Better dialing windows, an SMS touch alongside the call, appointment reminders, and zip-based routing that lets you offer tight estimate windows all lift bookings far more than shaving the per-lead cost. Model the full funnel — leads → contacts → booked estimates → sold jobs → revenue — and you'll consistently find that a cheap aged lead worked through a disciplined two-step process beats a small batch of expensive real-time leads on total sold revenue.",
      },
      {
        heading: "The Neighborhood Play: Route Density as a Profit Multiplier",
        body: "The single highest-ROI move unique to aged home services leads is the neighborhood play, and most operators never run it. The idea: when you complete a job, you already have a crew, a truck, and a finished install in a specific zip code. That is the moment to reach out — softly — to every aged lead you hold in that same zip.\n\nThe outreach is low-key and credible: 'We're finishing a roof on [street] this week and will have a crew in your area — since you'd looked at roofing a while back, want us to swing by for a free estimate while we're nearby?' It converts well for three reasons. Proximity is real and verifiable, so it doesn't read as a generic pitch. A nearby completed job is social proof the homeowner can literally drive past. And the offer is convenient — you're already there, so the estimate costs them nothing in friction.\n\nTo run it, your aged leads must be loaded and queryable by zip code, and your CRM should let you pull 'all open aged leads within this zip' on demand when a job wraps. Route density then compounds: tighter estimate clusters mean lower drive time, more estimates per rep-day, and a believable reason to re-contact records that had gone cold. It turns your aged list from a static call file into a geographically activated asset.",
      },
      {
        heading: "Building a 14-Day Estimate-Booking Cadence",
        body: "Single-touch outreach wastes aged home services leads, and because the goal is a booked estimate rather than a phone close, the cadence is built to drive to a calendar slot. Plan for a structured 14-day sequence across phone, SMS, and email — not one call and a shrug.\n\nA workable cadence: Day 1, a manual phone call with a non-pushy opener that names the specific project type and asks whether it's been handled. If you don't connect, leave a brief voicemail and follow within minutes with a short SMS — text often gets a faster reply than voicemail in this vertical. Day 2, a plain-text email offering a free estimate with two concrete time windows. Day 4, a second call at a different time of day plus a follow-up text. Day 7, a value touch — a financing option, a seasonal note ('before winter'), or proof of a nearby completed job. Day 10 to 14, a final call and a soft-close text that leaves the door open. Once an estimate is booked, switch immediately to reminder mode: an SMS-plus-email reminder sequence drops no-show rates dramatically.\n\nTwo disciplines decide your return. First, lead with SMS as a co-channel, not an afterthought — home-services homeowners respond to text. Second, log every attempt, outcome, and the booked-estimate status in your CRM, tagged by trade and zip so the neighborhood play and field routing both stay live. Aged-lead profitability here is a workflow-and-routing problem far more than a lead-quality problem.",
      },
      {
        heading: "Five Mistakes That Destroy Aged Home Services Lead ROI",
        body: "First, trying to close on the phone. Home services is a two-step funnel; the phone's only job is to book the estimate. Pitching price or product on the call kills bookings — let the field rep close on the driveway.\n\nSecond, ignoring SMS. This is the one vertical where text frequently outperforms the call for getting a response and confirming a slot. Operators who run phone-only leave the easiest bookings on the table.\n\nThird, skipping appointment reminders. A booked estimate with no reminder sequence no-shows at a far higher rate. An SMS-plus-email reminder cadence is the cheapest conversion lift available and most teams simply don't run it.\n\nFourth, ignoring geography. Without zip-based loading and routing, field reps cross paths, drive time balloons, and the neighborhood play — the vertical's best move — never happens. Treat location as a first-class field, not an afterthought.\n\nFifth, ignoring trade-specific compliance. Storm-solicitation moratoriums, contractor-board marketing rules, and Regulation Z financing disclosures vary by state and trade. Outreach that's fine in one state can be a violation in another; build the rules into your scripts before you dial.",
      },
      {
        heading: "Working Aged Home Services Leads Compliantly in 2026",
        body: "Aged home services leads are consumer data records, not pre-consented contacts, so treat outreach as cold contact and build compliance into your process. The federal baseline is the same as every vertical: scrub each campaign against the National Do Not Call Registry and a TCPA litigator list before you dial, honor opt-outs immediately, respect calling windows, and rely on manual dialing rather than prohibited automated dialing technology. The FCC's one-to-one consent rule was vacated in early 2025 before it took effect, and several states run active mini-TCPA statutes, so a campaign that's fine federally can still create state-level exposure.\n\nHome services carries trade-specific rules on top of that. Several states restrict roofing and storm-related solicitation for a window after a declared disaster — Florida, Texas, and Louisiana are the most active — so post-storm outreach needs a moratorium check first. Many state contractor boards regulate marketing language and incentives; using 'free estimate' rather than 'free inspection' avoids triggering solicitation rules in some states. And any financing offer must carry Regulation Z-compliant disclosure language in your script. The safe posture: dial manually, keep clean records, check state and trade rules before each campaign, and run your specific program past qualified compliance counsel before launch.\n\nFor the full framework — including the conservative-to-aggressive operating modes and the step-by-step consent ladder we use across verticals — see the free playbook.",
      },
    ],
    faqs: [
      {
        question: "What types of aged home services leads are available?",
        answer:
          "Aged home services leads cover roofing, solar, windows and doors, HVAC, kitchen and bath remodels, pest control, foundation repair, landscaping, and other home improvement categories. You can filter by project type and geographic area.",
      },
      {
        question: "What's the best way to work aged home services leads?",
        answer:
          "Book the estimate — don't try to close on the phone. Run a 14-day multi-channel cadence (phone, SMS, email) designed to land an in-home or virtual estimate. Your field rep closes on the driveway. Pair aged-lead calling with zip-based field routing so your estimators stay efficient.",
      },
      {
        question: "What about storm-chasing and contractor solicitation rules?",
        answer:
          "Several states restrict roofing and related solicitation for a window after declared disasters (Florida, Texas, Louisiana are the most active). Many states also have specific contractor-board rules on marketing language and incentives. Confirm your state's rules before outreach — consult counsel if unsure.",
      },
      {
        question: "Which sub-verticals have the best aged-lead economics?",
        answer:
          "Roofing, HVAC install, pest control, and foundation tend to have the fastest decision cycles and strongest close rates. Solar and remodel leads have longer cycles but higher revenue per close — they reward patient, well-designed nurture sequences.",
      },
      {
        question: "How much do aged home services leads cost?",
        answer:
          "Aged home services leads typically run $0.75 to $10 per record depending on trade, lead age, and geography — versus $30-$150 for real-time leads. Because average revenue per closed job is high ($2,500+ for windows, $4,500+ for roofing, $15,000+ for remodels), the lead cost is a small fraction of the job value, making this one of the most forgiving verticals for aged-lead operations.",
      },
      {
        question: "What close rate can I expect from aged home services leads?",
        answer:
          "Work it as a two-step funnel. Expect to book an estimate from roughly 10% of leads with a disciplined multi-channel cadence, and for field reps to close around 25% of estimates that are run — though both numbers vary widely by trade, market, and rep skill. Optimizing the booked-estimate rate (via SMS, reminders, and zip routing) moves your cost per sold job far more than negotiating the per-lead price.",
      },
      {
        question: "How do I reduce estimate no-shows on aged leads?",
        answer:
          "Run an automated reminder sequence the moment an estimate is booked: an SMS plus email reminder cadence (confirmation, day-before, and morning-of) typically cuts no-show rates from around 25% to under 10%. Reminders are the cheapest conversion lift in home services and most teams skip them.",
      },
      {
        question: "What is the 'neighborhood play' for aged home services leads?",
        answer:
          "When you complete a job, reach out softly to every aged lead you hold in that same zip code — 'we'll have a crew in your area this week, want a free estimate while we're nearby?' It converts well because the proximity is real, a nearby finished job is visible social proof, and the offer is low-friction. It requires loading and querying your aged leads by zip, and it turns a static call file into a geographically activated asset.",
      },
      {
        question: "Where can I buy aged home services leads?",
        answer:
          "Several established providers sell aged home services leads across roofing, solar, HVAC, windows, and remodel categories. Rather than buying on price alone, compare providers on data quality, trade and zip filtering, lead age, and refund or replacement policies. Our independent provider directory rates lead sellers across these dimensions so you can match a provider to your trade and service area.",
      },
    ],
    getCompareUrl: () =>
      `/providers/best/home-improvement`,
  },
};
