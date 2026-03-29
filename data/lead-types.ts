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
      ],
    },
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
      ],
    },
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
      ],
    },
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
      ],
    },
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
          "Medicare marketing is regulated by CMS (Centers for Medicare & Medicaid Services). You must follow specific guidelines around scope of appointment, plan comparisons, and marketing materials. Consult your compliance team and follow CMS guidelines for all Medicare outreach.",
      },
    ],
    getCompareUrl: () =>
      `/providers/best/medicare`,
  },
};
