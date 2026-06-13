/**
 * 12-Week Editorial Calendar for Aged Lead Sales
 *
 * Cadence: 3 posts/week (Monday, Wednesday, Friday)
 * Starting: March 17, 2026
 *
 * Content Pillars (differentiated from AgedLeadStore.com + HowToWorkLeads.com):
 *   1. VERTICAL PLAYBOOKS — Industry-specific deep dives
 *   2. CHANNEL TACTICS — Specific outreach channel strategies
 *   3. ROLE GUIDES — Content for specific job roles
 *   4. METRICS & OPTIMIZATION — Data-driven performance content
 *   5. COMPLIANCE — Regulatory deep dives by industry
 *
 * Rules:
 *   - Rotate pillars so no two consecutive posts are the same pillar
 *   - Every post links to 2+ glossary terms, 1+ calculator, 1+ lead type page
 *   - Every post has a unique angle NOT covered on the other two sites
 *   - Every post by Bill Rice with real experience and specifics
 */

export interface ContentBrief {
  week: number;
  day: "Mon" | "Wed" | "Fri";
  publishDate: string;
  slug: string;
  title: string;
  pillar: string;
  primaryKeyword: string;
  secondaryKeywords: string[];
  targetLeadTypes: string[];
  wordCount: string;
  competitiveAngle: string;
  outline: string[];
  internalLinks: string[];
  status: "published" | "scheduled" | "brief";
}

export const EDITORIAL_CALENDAR: ContentBrief[] = [
  // ── WEEK 1 (Mar 17-21) ──
  {
    week: 1, day: "Mon", publishDate: "2026-03-17",
    slug: "direct-mail-aged-leads-playbook",
    title: "The Direct Mail Playbook for Aged Leads: Letters, Postcards & Yellow Letters",
    pillar: "Channel Tactics",
    primaryKeyword: "direct mail aged leads",
    secondaryKeywords: ["yellow letter aged leads", "postcard aged leads", "direct mail insurance leads"],
    targetLeadTypes: ["lt-final-expense", "lt-insurance"],
    wordCount: "2,500-3,000",
    competitiveAngle: "Neither other site covers direct mail as a dedicated channel for aged leads. We go deep on formats, copy, timing, and A/B testing.",
    outline: [
      "Why direct mail works for aged leads (pattern interrupt, seniors prefer mail)",
      "Three formats compared: yellow letters vs postcards vs printed letters",
      "Copy templates for each format with real examples",
      "Timing: when to mail relative to your calling cadence",
      "Cost analysis: per-piece costs, expected response rates, ROI math",
      "A/B testing your mailers: what to test and how to track",
      "Combining mail with phone and door knocking for maximum conversion",
    ],
    internalLinks: ["/glossary/yellow-letter", "/glossary/follow-up-cadence", "/calculators/lead-cost-calculator", "/lead-types/final-expense-leads"],
    status: "scheduled",
  },
  {
    week: 1, day: "Wed", publishDate: "2026-03-19",
    slug: "new-insurance-agent-aged-leads-first-90-days",
    title: "New Insurance Agent? Here's Your First 90 Days with Aged Leads",
    pillar: "Role Guides",
    primaryKeyword: "new insurance agent aged leads",
    secondaryKeywords: ["new agent lead strategy", "first year insurance agent", "insurance agent training aged leads"],
    targetLeadTypes: ["lt-insurance", "lt-final-expense"],
    wordCount: "2,500-3,000",
    competitiveAngle: "Targets brand-new agents specifically — a huge audience that neither other site addresses. Combines aged lead strategy with new-agent reality (low budget, no book).",
    outline: [
      "Why aged leads are the best starting point for new agents (low cost, low risk, real practice)",
      "Month 1: The learning month — 200 leads, script practice, CRM setup",
      "Month 2: The optimization month — track numbers, refine scripts, identify best calling times",
      "Month 3: The scaling month — increase volume, add direct mail, start door knocking",
      "Budget planning: how to allocate $500-$1,000/month as a new agent",
      "Common new-agent mistakes with aged leads (and how to avoid them)",
      "Building your book of business from aged lead conversions",
    ],
    internalLinks: ["/glossary/book-of-business", "/glossary/crm", "/calculators/pipeline-calculator", "/lead-types/insurance-leads"],
    status: "scheduled",
  },
  {
    week: 1, day: "Fri", publishDate: "2026-03-21",
    slug: "tcpa-compliance-calling-aged-leads",
    title: "TCPA Compliance When Calling Aged Leads: What You Need to Know",
    pillar: "Compliance",
    primaryKeyword: "TCPA aged leads",
    secondaryKeywords: ["TCPA compliance calling leads", "can I call aged leads", "aged leads DNC"],
    targetLeadTypes: ["lt-insurance", "lt-mortgage", "lt-final-expense"],
    wordCount: "2,000-2,500",
    competitiveAngle: "Neither site has a dedicated TCPA compliance guide for aged leads. This fills a critical trust/authority gap and addresses a top concern for buyers.",
    outline: [
      "What the TCPA actually says (plain English, not legal jargon)",
      "The consent question: aged leads and prior express consent",
      "Manual dialing vs auto-dialers: what's allowed",
      "DNC scrubbing: how to do it and why it's non-negotiable",
      "State-specific calling rules that go beyond TCPA",
      "Record-keeping requirements for compliance protection",
      "What to tell your compliance team when they ask about aged leads",
    ],
    internalLinks: ["/glossary/tcpa", "/glossary/dnc-list", "/glossary/opt-in", "/lead-types/insurance-leads"],
    status: "scheduled",
  },

  // ── WEEK 2 (Mar 24-28) ──
  {
    week: 2, day: "Mon", publishDate: "2026-03-24",
    slug: "iul-leads-financial-advisors-playbook",
    title: "IUL Lead Conversion for Financial Advisors: The Consultative Approach",
    pillar: "Vertical Playbooks",
    primaryKeyword: "IUL leads financial advisors",
    secondaryKeywords: ["indexed universal life leads", "sell IUL with aged leads", "IUL prospecting"],
    targetLeadTypes: ["lt-iul"],
    wordCount: "2,500-3,000",
    competitiveAngle: "No one covers IUL aged leads from the financial advisor's perspective. IUL requires education-first selling — completely different from term or final expense.",
    outline: [
      "Why IUL leads are different from other insurance leads (complex product, educated buyer)",
      "The consultative framework: education before product",
      "Preparing IUL illustrations before your call",
      "Script for IUL prospects: leading with financial goals, not insurance",
      "Comparing IUL to 401k and Roth IRA for the prospect (your differentiator)",
      "The 2-4 conversation sales cycle: what to cover in each meeting",
      "Qualifying IUL prospects: income, age, and risk tolerance criteria",
    ],
    internalLinks: ["/glossary/indexed-universal-life", "/calculators/roi-calculator", "/lead-types/iul-leads"],
    status: "scheduled",
  },
  {
    week: 2, day: "Wed", publishDate: "2026-03-26",
    slug: "aged-lead-crm-setup-guide",
    title: "Setting Up Your CRM for Aged Leads: The System That Prevents Lost Deals",
    pillar: "Metrics & Optimization",
    primaryKeyword: "CRM aged leads setup",
    secondaryKeywords: ["aged lead CRM", "lead management aged leads", "CRM for insurance agents"],
    targetLeadTypes: ["lt-insurance", "lt-mortgage"],
    wordCount: "2,000-2,500",
    competitiveAngle: "HowToWorkLeads covers CRM broadly. We focus specifically on the aged lead workflow — status tracking, cadence automation, and the metrics that matter.",
    outline: [
      "Why you can't work aged leads at volume without a CRM",
      "The 6 lead statuses you need: New, Attempted, Contacted, Appointment, Sold, Dead",
      "Setting up your follow-up cadence as automated tasks",
      "The daily dashboard: what to look at every morning before calling",
      "Tracking the numbers that matter: dials, contacts, conversations, appointments, sales",
      "Weekly review process: identifying where your funnel is breaking",
      "Recommended CRM options for different budgets (free to $99/month)",
    ],
    internalLinks: ["/glossary/crm", "/glossary/follow-up-cadence", "/glossary/contact-rate", "/calculators/pipeline-calculator"],
    status: "scheduled",
  },
  {
    week: 2, day: "Fri", publishDate: "2026-03-28",
    slug: "mva-leads-personal-injury-intake-playbook",
    title: "MVA Lead Intake for Personal Injury Firms: Screening, Scripts & Case Building",
    pillar: "Vertical Playbooks",
    primaryKeyword: "MVA leads personal injury",
    secondaryKeywords: ["motor vehicle accident leads", "personal injury lead intake", "car accident leads attorneys"],
    targetLeadTypes: ["lt-mva"],
    wordCount: "2,500-3,000",
    competitiveAngle: "Zero coverage of MVA/PI aged leads on either other site. Huge market for PI firms. Covers legal intake specifically — screening criteria, statute issues, case evaluation.",
    outline: [
      "Why aged MVA leads work for PI firms (accident victims delay seeking attorneys)",
      "The intake screening checklist: 8 questions to qualify a case in 5 minutes",
      "Script for accident victims: empathy-first, then case evaluation",
      "Statute of limitations urgency: state-by-state considerations",
      "Evaluating case value from an aged lead: what data to gather",
      "The follow-up system for 'not ready yet' prospects",
      "Tracking intake metrics: leads → screens → retainers → case values",
    ],
    internalLinks: ["/glossary/mva", "/glossary/statute-of-limitations", "/glossary/contingency-fee", "/lead-types/mva-leads"],
    status: "scheduled",
  },

  // ── WEEK 3 (Mar 31 - Apr 4) ──
  {
    week: 3, day: "Mon", publishDate: "2026-03-31",
    slug: "email-outreach-aged-leads-templates",
    title: "Email Outreach for Aged Leads: 5 Templates That Get Replies",
    pillar: "Channel Tactics",
    primaryKeyword: "email aged leads templates",
    secondaryKeywords: ["aged lead email scripts", "cold email insurance leads", "follow up email leads"],
    targetLeadTypes: ["lt-insurance", "lt-mortgage", "lt-solar"],
    wordCount: "2,000-2,500",
    competitiveAngle: "Other sites mention email in passing. We provide actual copy-paste templates for each vertical with subject lines, body copy, and A/B testing guidance.",
    outline: [
      "Why plain text beats HTML for aged lead emails",
      "Template 1: The first-touch follow-up (after phone attempt)",
      "Template 2: The value-add (sharing a relevant resource or rate update)",
      "Template 3: The social proof (referencing other clients in their area)",
      "Template 4: The last-chance (creating polite urgency)",
      "Template 5: The re-engagement (for leads 90+ days with no contact)",
      "Subject lines that get opened: tested examples with open rates",
      "Sending frequency and timing: when to email and how often",
    ],
    internalLinks: ["/glossary/drip-campaign", "/glossary/multi-channel-outreach", "/lead-types/insurance-leads"],
    status: "scheduled",
  },
  {
    week: 3, day: "Wed", publishDate: "2026-04-02",
    slug: "scaling-aged-lead-operation-from-solo-to-team",
    title: "Scaling Your Aged Lead Operation: From Solo Agent to Team",
    pillar: "Role Guides",
    primaryKeyword: "scaling aged leads team",
    secondaryKeywords: ["aged lead call center", "hiring agents aged leads", "insurance agency scaling"],
    targetLeadTypes: ["lt-insurance", "lt-final-expense"],
    wordCount: "2,500-3,000",
    competitiveAngle: "Covers the growth trajectory that neither site addresses — taking a proven solo system and building a team around it. Includes hiring, training, and economics.",
    outline: [
      "When to scale: the metrics that tell you you're ready",
      "The economics of adding a second caller (lead costs, splits, break-even)",
      "Hiring your first agent: what to look for and what to train",
      "Building a training program around your proven scripts and cadence",
      "Lead distribution: how to split leads fairly and maximize conversion",
      "Quality control: monitoring calls and tracking per-agent metrics",
      "The agency owner's dashboard: managing by numbers, not feelings",
    ],
    internalLinks: ["/glossary/close-rate", "/glossary/appointment-set-rate", "/calculators/pipeline-calculator", "/lead-types/insurance-leads"],
    status: "brief",
  },
  {
    week: 3, day: "Fri", publishDate: "2026-04-04",
    slug: "auto-insurance-aged-leads-cross-sell-strategy",
    title: "Auto Insurance Aged Leads: The Cross-Sell Strategy That Doubles Revenue",
    pillar: "Vertical Playbooks",
    primaryKeyword: "auto insurance aged leads",
    secondaryKeywords: ["car insurance aged leads", "auto insurance cross selling", "P&C aged leads"],
    targetLeadTypes: ["lt-insurance"],
    wordCount: "2,000-2,500",
    competitiveAngle: "Auto insurance is the highest-volume aged lead type but gets generic treatment elsewhere. Our angle: the cross-sell from auto → home → life → umbrella.",
    outline: [
      "Auto insurance aged leads: what makes them different (high volume, low cost, low margin)",
      "The cross-sell opportunity: why auto leads are your entry point, not your end game",
      "The 'policy review' script: opening auto leads up to home, life, and umbrella",
      "Bundling strategies: discount stacking to increase close rate and policy count",
      "Retention economics: why a multi-policy customer is worth 3-5x a single-policy customer",
      "Working auto leads by state: rate shopping patterns and seasonal trends",
    ],
    internalLinks: ["/glossary/cross-selling", "/glossary/p-and-c-insurance", "/calculators/roi-calculator", "/lead-types/insurance-leads"],
    status: "brief",
  },

  // ── WEEK 4 (Apr 7-11) ──
  {
    week: 4, day: "Mon", publishDate: "2026-04-07",
    slug: "tracking-aged-lead-metrics-weekly-review",
    title: "The Weekly Numbers Review: How to Track and Improve Your Aged Lead Performance",
    pillar: "Metrics & Optimization",
    primaryKeyword: "tracking aged lead metrics",
    secondaryKeywords: ["aged lead KPIs", "sales metrics tracking", "lead conversion metrics"],
    targetLeadTypes: ["lt-insurance", "lt-mortgage"],
    wordCount: "2,000-2,500",
    competitiveAngle: "Goes beyond 'track your numbers' advice and provides the actual weekly review framework — what to measure, what the benchmarks are, and what to change when numbers are off.",
    outline: [
      "The 5 metrics that determine your profitability (and nothing else matters)",
      "Building your weekly scorecard (template provided)",
      "Benchmark ranges by industry — how to know if your numbers are good",
      "Diagnosing problems: low contact rate vs low conversion vs low volume",
      "The optimization loop: change one variable at a time, measure for 2 weeks",
      "When to buy more leads vs when to fix your system first",
    ],
    internalLinks: ["/glossary/conversion-rate", "/glossary/contact-rate", "/glossary/cost-per-acquisition", "/calculators/lead-cost-calculator"],
    status: "brief",
  },
  {
    week: 4, day: "Wed", publishDate: "2026-04-09",
    slug: "solar-door-knocking-aged-leads",
    title: "Door Knocking Aged Solar Leads: The In-Person Approach That Closes Deals",
    pillar: "Vertical Playbooks",
    primaryKeyword: "solar door knocking aged leads",
    secondaryKeywords: ["solar sales door knocking", "solar leads in person", "knocking solar leads"],
    targetLeadTypes: ["lt-solar"],
    wordCount: "2,500-3,000",
    competitiveAngle: "Combines two high-converting tactics (door knocking + aged leads) for solar specifically. Includes roof assessment at the door, incentive hooks, and same-day close tactics.",
    outline: [
      "Why door knocking is solar's secret weapon (homeowners want to see a person, not get a call)",
      "Pre-visit prep: satellite roof assessment and estimated savings before you knock",
      "The door script for solar: leading with their electricity bill, not your product",
      "The instant estimate: showing savings on the spot with a tablet/phone",
      "Handling HOA and roof condition objections at the door",
      "The same-day close: from door knock to signed contract in one visit",
      "Route planning for solar: prioritizing high-electricity-cost neighborhoods",
    ],
    internalLinks: ["/glossary/solar-itc", "/glossary/net-metering", "/glossary/door-knocking", "/lead-types/solar-leads"],
    status: "brief",
  },
  {
    week: 4, day: "Fri", publishDate: "2026-04-11",
    slug: "medicare-compliance-aged-leads-guide",
    title: "Medicare Compliance for Aged Leads: CMS Rules Every Agent Must Follow",
    pillar: "Compliance",
    primaryKeyword: "Medicare compliance aged leads",
    secondaryKeywords: ["CMS rules Medicare leads", "Medicare marketing compliance", "SOA requirements Medicare"],
    targetLeadTypes: ["lt-medicare"],
    wordCount: "2,000-2,500",
    competitiveAngle: "No one has a dedicated Medicare compliance guide for aged leads. This is critical trust-building content for Medicare agents who worry about regulatory risk.",
    outline: [
      "CMS marketing rules that apply to aged Medicare leads",
      "Scope of Appointment (SOA) requirements: when you need one and how to collect it",
      "What you can and can't say before October 1 (pre-AEP rules)",
      "Plan comparison rules: how to present options without violating CMS guidelines",
      "Record-keeping requirements for Medicare sales interactions",
      "Common CMS violations and how to avoid them",
      "Working with your FMO/upline on compliance approval",
    ],
    internalLinks: ["/glossary/scope-of-appointment", "/glossary/cms-guidelines", "/glossary/annual-enrollment-period", "/lead-types/medicare-leads"],
    status: "brief",
  },

  // ── WEEKS 5-12 (Briefs Only) ──
  // Week 5
  { week: 5, day: "Mon", publishDate: "2026-04-14", slug: "health-insurance-aca-aged-leads", title: "ACA Health Insurance Aged Leads: Open Enrollment and SEP Strategies", pillar: "Vertical Playbooks", primaryKeyword: "ACA health insurance aged leads", secondaryKeywords: ["health insurance leads", "open enrollment leads"], targetLeadTypes: ["lt-insurance"], wordCount: "2,500", competitiveAngle: "ACA/health insurance aged leads with enrollment window strategies — unique angle.", outline: ["ACA enrollment windows", "SEP qualifying events as hooks", "Subsidy calculation as a selling tool", "Scripts for health insurance prospects"], internalLinks: ["/glossary/open-enrollment-period", "/lead-types/insurance-leads"], status: "brief" },
  { week: 5, day: "Wed", publishDate: "2026-04-16", slug: "aged-lead-objection-handling-guide", title: "The Complete Objection Handling Guide for Aged Leads (By Industry)", pillar: "Channel Tactics", primaryKeyword: "aged lead objection handling", secondaryKeywords: ["objections aged leads", "handling objections insurance"], targetLeadTypes: ["lt-insurance", "lt-mortgage", "lt-final-expense"], wordCount: "3,000", competitiveAngle: "Industry-specific objection responses, not generic. Final expense objections differ from mortgage objections.", outline: ["Universal objections and responses", "Insurance-specific objections", "Mortgage-specific objections", "Final expense/senior objections", "Solar objections", "Legal/SSDI objections"], internalLinks: ["/glossary/objection-handling", "/glossary/close-rate"], status: "brief" },
  { week: 5, day: "Fri", publishDate: "2026-04-18", slug: "reverse-mortgage-aged-leads-strategy", title: "Working Aged Reverse Mortgage Leads: A Specialist's Guide", pillar: "Vertical Playbooks", primaryKeyword: "reverse mortgage aged leads", secondaryKeywords: ["reverse mortgage leads", "HECM leads"], targetLeadTypes: ["lt-mortgage"], wordCount: "2,500", competitiveAngle: "Reverse mortgage is a specialized niche within mortgage — nobody covers aged leads for this product.", outline: ["Why reverse mortgage leads age well", "Qualifying: age 62+, equity requirements", "Scripts for reverse mortgage prospects", "Common myths to address", "Working with adult children"], internalLinks: ["/glossary/reverse-mortgage", "/lead-types/mortgage-leads"], status: "brief" },

  // Week 6
  { week: 6, day: "Mon", publishDate: "2026-04-21", slug: "call-center-aged-leads-operations", title: "Running an Aged Lead Call Center: Operations Playbook for Managers", pillar: "Role Guides", primaryKeyword: "aged lead call center", secondaryKeywords: ["call center aged leads", "dialer aged leads"], targetLeadTypes: ["lt-insurance", "lt-mortgage"], wordCount: "3,000", competitiveAngle: "Call center operations — specific to managers scaling aged lead teams. Dialer setup, agent management, performance tracking.", outline: ["Dialer configuration for aged leads", "Agent training program", "Performance metrics and dashboards", "Lead distribution strategies", "Quality assurance process", "Scaling from 2 to 20 agents"], internalLinks: ["/glossary/dialer", "/glossary/contact-rate", "/calculators/pipeline-calculator"], status: "brief" },
  { week: 6, day: "Wed", publishDate: "2026-04-23", slug: "life-insurance-aged-leads-term-vs-whole", title: "Aged Life Insurance Leads: Term vs. Whole Life Sales Strategies", pillar: "Vertical Playbooks", primaryKeyword: "aged life insurance leads", secondaryKeywords: ["life insurance leads", "term life leads", "whole life leads"], targetLeadTypes: ["lt-insurance"], wordCount: "2,500", competitiveAngle: "Product-specific strategies for different life insurance types from the same aged lead pool.", outline: ["Identifying term vs whole life buyers from lead data", "Scripts for each product type", "Converting term inquiries to whole life conversations", "Premium presentation strategies", "Underwriting shortcuts for faster closes"], internalLinks: ["/glossary/term-life-insurance", "/glossary/underwriting", "/lead-types/insurance-leads"], status: "brief" },
  { week: 6, day: "Fri", publishDate: "2026-04-25", slug: "aged-lead-voicemail-scripts-that-get-callbacks", title: "Voicemail Scripts for Aged Leads: 6 Messages That Get Callbacks", pillar: "Channel Tactics", primaryKeyword: "voicemail scripts aged leads", secondaryKeywords: ["voicemail aged leads", "leave voicemail leads", "callback voicemail"], targetLeadTypes: ["lt-insurance", "lt-mortgage", "lt-solar"], wordCount: "2,000", competitiveAngle: "Dedicated voicemail strategy — most agents leave terrible voicemails. Specific scripts with timing and delivery tips.", outline: ["Why voicemail matters (20-30% of callbacks come from VM)", "The 15-second rule", "6 voicemail templates by purpose", "Voicemail drop technology: pros, cons, compliance", "Timing: when to leave VM vs hang up and try again"], internalLinks: ["/glossary/voicemail-drop", "/glossary/contact-rate"], status: "brief" },

  // Week 7
  { week: 7, day: "Mon", publishDate: "2026-04-28", slug: "home-improvement-aged-leads-playbook", title: "Aged Home Improvement Leads: Roofing, Windows, HVAC & Bathroom Remodel", pillar: "Vertical Playbooks", primaryKeyword: "home improvement aged leads", secondaryKeywords: ["roofing leads", "window leads", "HVAC leads"], targetLeadTypes: [], wordCount: "2,500", competitiveAngle: "Home improvement is a major aged lead vertical that neither site covers as a dedicated playbook.", outline: ["Home improvement lead types and pricing", "Seasonal strategies by trade", "The in-home estimate as your close", "Scripts for roofing, windows, and HVAC", "Working storm damage leads"], internalLinks: ["/glossary/door-knocking", "/calculators/roi-calculator"], status: "brief" },
  { week: 7, day: "Wed", publishDate: "2026-04-30", slug: "aged-lead-ab-testing-scripts-cadences", title: "A/B Testing Your Aged Lead Operation: Scripts, Cadences & Channels", pillar: "Metrics & Optimization", primaryKeyword: "A/B testing aged leads", secondaryKeywords: ["test aged lead scripts", "optimize lead conversion"], targetLeadTypes: ["lt-insurance", "lt-mortgage"], wordCount: "2,000", competitiveAngle: "Data-driven optimization content that goes beyond 'track your numbers' into how to run actual tests.", outline: ["What to test first (scripts, timing, channels)", "How to run a valid test (sample size, duration)", "Testing scripts: A/B framework", "Testing cadences: how many touches", "Testing channels: phone vs mail vs door", "Documenting and implementing winners"], internalLinks: ["/glossary/conversion-rate", "/glossary/contact-rate", "/calculators/lead-cost-calculator"], status: "brief" },
  { week: 7, day: "Fri", publishDate: "2026-05-01", slug: "tax-debt-aged-leads-strategy", title: "Working Aged Tax Debt Leads: A Guide for Tax Resolution Firms", pillar: "Vertical Playbooks", primaryKeyword: "tax debt aged leads", secondaryKeywords: ["tax resolution leads", "IRS debt leads"], targetLeadTypes: [], wordCount: "2,500", competitiveAngle: "Tax debt/resolution is a growing vertical that nobody covers for aged leads specifically.", outline: ["Why tax debt leads age well (IRS problems don't go away)", "Qualifying prospects: owed amount, years, compliance status", "Scripts for tax debt prospects", "The free consultation as your conversion event", "Seasonal timing: pre-filing season vs post-filing season"], internalLinks: ["/glossary/contingency-fee", "/calculators/roi-calculator"], status: "brief" },

  // Week 8
  { week: 8, day: "Mon", publishDate: "2026-05-04", slug: "building-referral-engine-aged-leads", title: "Turning Aged Lead Clients into a Referral Engine", pillar: "Metrics & Optimization", primaryKeyword: "referrals from aged leads", secondaryKeywords: ["referral strategy insurance", "client referrals aged leads"], targetLeadTypes: ["lt-insurance", "lt-mortgage"], wordCount: "2,000", competitiveAngle: "The long-game: aged lead clients become referral sources. Nobody covers the referral loop from aged leads.", outline: ["The compounding value of aged lead clients", "Post-sale referral request system", "Timing referral asks for maximum results", "Referral incentive programs that work", "Tracking referral sources in your CRM"], internalLinks: ["/glossary/ltv", "/glossary/book-of-business"], status: "brief" },
  { week: 8, day: "Wed", publishDate: "2026-05-06", slug: "aged-leads-budget-allocation-guide", title: "How to Allocate Your Aged Lead Budget: By Vertical, Age & Channel", pillar: "Metrics & Optimization", primaryKeyword: "aged lead budget allocation", secondaryKeywords: ["how much to spend aged leads", "aged lead budget planning"], targetLeadTypes: ["lt-insurance", "lt-mortgage", "lt-solar"], wordCount: "2,500", competitiveAngle: "Practical budget planning nobody covers — how to split spend across lead types, lead ages, and outreach channels.", outline: ["Starting budget by income goal", "Allocating across verticals based on your products", "Balancing lead freshness vs volume on a fixed budget", "Channel budget split: leads + mail + tools", "When to increase your budget (and when not to)"], internalLinks: ["/calculators/pipeline-calculator", "/calculators/lead-cost-calculator", "/glossary/cost-per-lead"], status: "brief" },
  { week: 8, day: "Fri", publishDate: "2026-05-08", slug: "debt-settlement-aged-leads-playbook", title: "Aged Debt Settlement Leads: Scripts and Strategies for Debt Relief Companies", pillar: "Vertical Playbooks", primaryKeyword: "debt settlement aged leads", secondaryKeywords: ["debt relief leads", "credit card debt leads"], targetLeadTypes: [], wordCount: "2,500", competitiveAngle: "Debt settlement/relief is a high-value vertical that nobody covers for aged leads.", outline: ["Why debt settlement leads age well", "Screening for viable clients", "Scripts for debt-stressed consumers", "Compliance in debt relief advertising", "Conversion benchmarks for the industry"], internalLinks: ["/glossary/contact-rate", "/calculators/roi-calculator"], status: "brief" },

  // Weeks 9-12 continue the pattern...
  { week: 9, day: "Mon", publishDate: "2026-05-11", slug: "spanish-speaking-market-aged-leads", title: "Reaching the Spanish-Speaking Market with Aged Leads", pillar: "Role Guides", primaryKeyword: "Spanish speaking aged leads", secondaryKeywords: ["bilingual agent aged leads", "Hispanic market insurance"], targetLeadTypes: ["lt-insurance", "lt-mortgage"], wordCount: "2,500", competitiveAngle: "Completely unserved topic — bilingual agents are a growing force and have unique advantages with aged leads.", outline: ["The bilingual advantage in aged lead sales", "Spanish-language scripts", "Cultural considerations in sales approach", "Markets with highest Spanish-speaking lead volume"], internalLinks: ["/glossary/contact-rate", "/lead-types/insurance-leads"], status: "brief" },
  { week: 9, day: "Wed", publishDate: "2026-05-13", slug: "aged-lead-text-sms-strategies", title: "Text and SMS Strategies for Aged Leads: What Works (and What's Legal)", pillar: "Channel Tactics", primaryKeyword: "SMS aged leads", secondaryKeywords: ["text message aged leads", "SMS lead follow up"], targetLeadTypes: ["lt-insurance", "lt-solar"], wordCount: "2,000", competitiveAngle: "SMS is increasingly used but compliance is tricky. We cover what works legally.", outline: ["TCPA rules for text messages", "Opt-in requirements for SMS", "Text templates that work", "SMS as part of multi-channel cadence", "Tools and platforms for compliant texting"], internalLinks: ["/glossary/tcpa", "/glossary/multi-channel-outreach"], status: "brief" },
  { week: 9, day: "Fri", publishDate: "2026-05-15", slug: "aged-leads-recession-proof-strategy", title: "Recession-Proofing Your Sales Operation with Aged Leads", pillar: "Metrics & Optimization", primaryKeyword: "aged leads recession", secondaryKeywords: ["low cost leads recession", "sales during recession"], targetLeadTypes: ["lt-insurance", "lt-mortgage"], wordCount: "2,000", competitiveAngle: "Economic angle nobody covers — why aged leads become MORE valuable during downturns.", outline: ["Why aged leads outperform in a downturn", "Verticals that thrive in recessions", "Cutting real-time leads, not volume", "Adjusting your approach for cost-conscious prospects"], internalLinks: ["/glossary/cost-per-lead", "/glossary/roi", "/calculators/roi-calculator"], status: "brief" },

  { week: 10, day: "Mon", publishDate: "2026-05-18", slug: "final-expense-telesales-aged-leads", title: "Final Expense Telesales with Aged Leads: The Remote Selling Playbook", pillar: "Vertical Playbooks", primaryKeyword: "final expense telesales aged leads", secondaryKeywords: ["telesales final expense", "phone sales burial insurance"], targetLeadTypes: ["lt-final-expense"], wordCount: "2,500", competitiveAngle: "Telesales-specific (not door knocking) for agents who work remotely. Different scripts, different close.", outline: ["Telesales vs door knocking: when each works", "Phone-only cadence for final expense", "Building rapport without face-to-face", "Phone presentation structure", "Taking applications over the phone", "Overcoming 'I need to think about it' on the phone"], internalLinks: ["/glossary/final-expense-insurance", "/glossary/close-rate", "/lead-types/final-expense-leads"], status: "brief" },
  { week: 10, day: "Wed", publishDate: "2026-05-20", slug: "aged-lead-data-hygiene-cleaning-guide", title: "Cleaning Your Aged Lead Data: The Hygiene Checklist Before You Dial", pillar: "Metrics & Optimization", primaryKeyword: "aged lead data cleaning", secondaryKeywords: ["data hygiene leads", "clean lead list", "DNC scrub leads"], targetLeadTypes: ["lt-insurance", "lt-mortgage"], wordCount: "2,000", competitiveAngle: "Practical, step-by-step data cleaning process. Most agents skip this and waste time calling dead numbers.", outline: ["Why data hygiene directly impacts ROI", "Step-by-step cleaning checklist", "DNC scrubbing tools and process", "Phone number validation services", "Deduplication strategies", "Segmenting clean data for outreach"], internalLinks: ["/glossary/data-hygiene", "/glossary/dnc-list", "/glossary/lead-validation"], status: "brief" },
  { week: 10, day: "Fri", publishDate: "2026-05-22", slug: "mortgage-refinance-rate-drop-aged-leads", title: "Rate Drop? How to Activate Your Aged Mortgage Leads Instantly", pillar: "Vertical Playbooks", primaryKeyword: "rate drop aged mortgage leads", secondaryKeywords: ["refinance rate drop leads", "mortgage rate change strategy"], targetLeadTypes: ["lt-mortgage"], wordCount: "2,000", competitiveAngle: "Rate-event-triggered playbook — what to do the day rates drop significantly. Timely, actionable, unique.", outline: ["Setting up rate alerts for activation triggers", "The 'rate drop' calling blitz system", "Script customized for rate drop context", "Prioritizing your list by original rate inquiry", "Converting rate shoppers to locked applications"], internalLinks: ["/glossary/rate-lock", "/glossary/refinance-lead", "/lead-types/mortgage-leads"], status: "brief" },

  { week: 11, day: "Mon", publishDate: "2026-05-25", slug: "aged-leads-for-p-and-c-agencies", title: "P&C Agency Growth with Aged Leads: Auto, Home & Commercial", pillar: "Vertical Playbooks", primaryKeyword: "P&C agency aged leads", secondaryKeywords: ["P&C insurance leads", "commercial insurance leads aged"], targetLeadTypes: ["lt-insurance"], wordCount: "2,500", competitiveAngle: "P&C agency-specific — multi-line agencies that need volume across auto, home, and commercial.", outline: ["P&C aged lead economics by line", "Multi-line quoting from a single lead", "Commercial insurance prospecting with aged data", "Agency workflow for high-volume P&C aged leads"], internalLinks: ["/glossary/p-and-c-insurance", "/glossary/cross-selling", "/lead-types/insurance-leads"], status: "brief" },
  { week: 11, day: "Wed", publishDate: "2026-05-27", slug: "seasonal-calling-patterns-aged-leads", title: "When to Call Aged Leads: Day, Time & Seasonal Patterns That Maximize Contact Rates", pillar: "Metrics & Optimization", primaryKeyword: "when to call aged leads", secondaryKeywords: ["best time call leads", "calling schedule leads"], targetLeadTypes: ["lt-insurance", "lt-mortgage", "lt-final-expense"], wordCount: "2,000", competitiveAngle: "Data-backed calling windows by vertical. Seniors have different optimal times than working-age prospects.", outline: ["Best days of the week by vertical", "Best times of day by prospect demographic", "Seasonal patterns and how to leverage them", "Holiday and weather considerations", "Building your weekly calling schedule"], internalLinks: ["/glossary/contact-rate", "/glossary/speed-to-lead", "/calculators/pipeline-calculator"], status: "brief" },
  { week: 11, day: "Fri", publishDate: "2026-05-29", slug: "aged-leads-independent-vs-captive-agents", title: "Aged Leads for Independent vs. Captive Agents: Different Playbooks", pillar: "Role Guides", primaryKeyword: "aged leads independent vs captive agent", secondaryKeywords: ["independent agent leads", "captive agent lead strategy"], targetLeadTypes: ["lt-insurance"], wordCount: "2,500", competitiveAngle: "Independent and captive agents have fundamentally different constraints. Nobody addresses this distinction.", outline: ["Why the aged lead strategy differs by agent type", "Captive agent: working within carrier constraints", "Independent agent: the multi-carrier advantage with aged leads", "Product selection strategies for each type", "Budget and ROI differences"], internalLinks: ["/glossary/underwriting", "/glossary/cross-selling", "/lead-types/insurance-leads"], status: "brief" },

  { week: 12, day: "Mon", publishDate: "2026-06-01", slug: "solar-financing-options-aged-lead-sales", title: "Selling Solar Financing to Aged Leads: Loans, Leases, and PPAs Explained", pillar: "Vertical Playbooks", primaryKeyword: "solar financing aged leads", secondaryKeywords: ["solar loan leads", "solar lease leads", "PPA solar leads"], targetLeadTypes: ["lt-solar"], wordCount: "2,500", competitiveAngle: "Financing is the #1 objection in solar sales. Nobody covers how to present financing options to aged leads specifically.", outline: ["The three financing options explained simply", "Matching financing to prospect profiles", "Scripts for presenting each financing option", "Overcoming 'I can't afford solar' with financing", "Comparing monthly payments to current electric bill"], internalLinks: ["/glossary/power-purchase-agreement", "/glossary/solar-itc", "/lead-types/solar-leads"], status: "brief" },
  { week: 12, day: "Wed", publishDate: "2026-06-03", slug: "aged-lead-annual-planning-12-month-strategy", title: "Your 12-Month Aged Lead Plan: Annual Strategy for Consistent Growth", pillar: "Metrics & Optimization", primaryKeyword: "aged lead annual plan", secondaryKeywords: ["yearly lead strategy", "annual lead plan insurance"], targetLeadTypes: ["lt-insurance", "lt-mortgage", "lt-solar", "lt-medicare"], wordCount: "3,000", competitiveAngle: "Big-picture planning content. Maps out the full year including seasonal peaks, enrollment periods, and growth milestones.", outline: ["Month-by-month planning template", "Seasonal lead buying strategies", "Aligning lead volume with enrollment periods", "Quarterly review and adjustment process", "Year-over-year growth benchmarks"], internalLinks: ["/glossary/annual-enrollment-period", "/glossary/book-of-business", "/calculators/pipeline-calculator"], status: "brief" },
  { week: 12, day: "Fri", publishDate: "2026-06-05", slug: "aged-leads-customer-lifetime-value-analysis", title: "The Hidden Value of Aged Lead Clients: Lifetime Value Analysis by Industry", pillar: "Metrics & Optimization", primaryKeyword: "aged lead customer lifetime value", secondaryKeywords: ["LTV aged leads", "client value insurance"], targetLeadTypes: ["lt-insurance", "lt-mortgage", "lt-medicare"], wordCount: "2,500", competitiveAngle: "Goes beyond cost-per-lead thinking into lifetime economics. Renewals, referrals, and compounding value that justify the aged lead investment.", outline: ["Calculating LTV by vertical", "The renewal multiplier in insurance and Medicare", "Referral value from aged lead clients", "How LTV changes the lead budget conversation", "Building a business model on aged lead LTV"], internalLinks: ["/glossary/ltv", "/glossary/book-of-business", "/glossary/persistency-rate", "/calculators/roi-calculator"], status: "brief" },

  // ── Email-Program Integration backlog (added 2026-06-13) ──
  // Net-new briefs surfaced by auditing the Aged Leads Insights email program
  // against the live site — the genuine gaps (tooling, recording-consent, AI
  // automation, scheduling-consent) NOT already covered above. See the
  // integration audit. NOTE: the Week 9 brief "aged-lead-text-sms-strategies"
  // leans pro-SMS and should be revised to match the program's stance: don't
  // text non-consent purchased data — earn consent first (see the scheduling
  // brief below). Flagged for Bill's decision, not auto-edited.
  { week: 13, day: "Mon", publishDate: "2026-06-08", slug: "aged-lead-call-recording-consent-by-state", title: "Call Recording Consent by State: The 2026 Map for Sales Agents", pillar: "Compliance", primaryKeyword: "call recording consent laws by state", secondaryKeywords: ["one party consent states", "two party consent recording", "recording sales calls legally"], targetLeadTypes: ["lt-insurance", "lt-mortgage"], wordCount: "2,500", competitiveAngle: "Recording every call is the biggest follow-up upgrade an agent can make — but consent law trips people up. A plain-English, state-by-state map plus the one-line disclosure that keeps you safe everywhere. Pairs with the email program's record-every-call lesson; the existing call-recording-analysis post covers analysis, not the consent law.", outline: ["Federal one-party rule vs the ~dozen all-party states", "Which states require all-party consent (CA, FL, IL, PA, WA and more)", "Interstate calls: when the stricter state's law applies", "The universal-safe move: announce + get a verbal yes", "A recording-disclosure line you can use on every call", "Where consent gets captured (and recording tools)", "General guidance, not legal advice — when to check counsel"], internalLinks: ["/glossary/tcpa", "/glossary/dnc-list", "/lead-types/insurance-leads"], status: "brief" },
  { week: 13, day: "Wed", publishDate: "2026-06-10", slug: "aged-lead-sales-stack-under-100-month", title: "The Aged-Lead Sales Stack: Every Tool You Need for Under $100/Month", pillar: "Metrics & Optimization", primaryKeyword: "aged lead sales tools stack", secondaryKeywords: ["best tools for aged leads", "cheap sales stack agents", "dialer crm for aged leads"], targetLeadTypes: ["lt-insurance", "lt-mortgage", "lt-final-expense"], wordCount: "2,500", competitiveAngle: "Nobody assembles the full, affordable software stack for an aged-lead operator (the /providers pages cover lead sellers, not software). The honest build — Google Workspace + dialer + CRM + drip tool (QuickMail) + call recording/transcription (Granola) + scheduling (Calendly) — with what to skip until you scale. Affiliate-friendly.", outline: ["The whole stack at a glance (under $100/mo)", "Email + calendar + meet: Google Workspace as the base", "Dialing: manual-dial tools that stay compliant", "CRM: pick one your AI can read and write", "Drip email: a personal-feel drip tool, not a mass-blaster", "Call recording + transcription: capture every conversation", "Scheduling + consent capture", "What to skip until you scale"], internalLinks: ["/glossary/dialer", "/calculators/lead-cost-calculator", "/calculators/roi-calculator"], status: "brief" },
  { week: 13, day: "Fri", publishDate: "2026-06-12", slug: "crm-autopilot-ai-agents-mcp-aged-leads", title: "Put Your CRM on Autopilot: AI Agents, MCP, and Auto-Documenting Every Call", pillar: "Metrics & Optimization", primaryKeyword: "AI CRM automation aged leads", secondaryKeywords: ["MCP CRM AI agent", "automate CRM data entry sales", "AI follow up CRM"], targetLeadTypes: ["lt-insurance", "lt-mortgage"], wordCount: "2,500", competitiveAngle: "Beyond 'set up your CRM' (existing post) into the 2026 reality: an AI agent reads the call transcript and writes the summary, updates fields, and sets the next task — via the CRM's MCP server or API. Names what supports it today (HubSpot, GoHighLevel official MCP; Salesforce in preview; API + Zapier for the dialer-CRMs).", outline: ["The busywork that kills momentum", "Transcript -> summary -> CRM note -> next task, automatically", "What an MCP server is, in plain English", "CRMs with official AI connectors today + Salesforce preview", "API/Zapier path for Ricochet360, VanillaSoft, Ringy", "A first automation to set up this week", "The payoff: a self-documenting book for renewals + re-engagement"], internalLinks: ["/glossary/follow-up-cadence", "/glossary/book-of-business", "/lead-types/insurance-leads"], status: "brief" },
  { week: 14, day: "Mon", publishDate: "2026-06-15", slug: "scheduling-links-book-calls-capture-consent", title: "Scheduling Links That Book More Calls - and Capture Consent", pillar: "Channel Tactics", primaryKeyword: "scheduling link sales calls", secondaryKeywords: ["calendly for insurance agents", "booking link aged leads", "capture phone consent booking"], targetLeadTypes: ["lt-insurance", "lt-mortgage", "lt-solar"], wordCount: "2,000", competitiveAngle: "Two ideas nobody combines: a scheduling link books more calls because it hands the prospect control, AND the booking form is the cleanest way to capture phone + text consent — turning a cold purchased lead into a consented one. Free Calendly / Google Calendar setup.", outline: ["Why a scheduling link beats phone tag", "Putting the link in every email and voicemail", "Free options: Calendly free plan, Google Calendar appointments", "The consent-capture move: ask for phone + text permission at booking", "Turning a cold purchased lead into a consented one", "Booking-page copy that converts"], internalLinks: ["/glossary/tcpa", "/glossary/speed-to-lead", "/calculators/pipeline-calculator"], status: "brief" },
  { week: 14, day: "Wed", publishDate: "2026-06-17", slug: "ai-guardrails-aged-lead-agents", title: "AI Guardrails for Aged-Lead Agents: Using It Without Crossing the Line", pillar: "Compliance", primaryKeyword: "AI compliance sales agents", secondaryKeywords: ["AI sales guardrails", "AI privacy sales leads", "AI voice calls TCPA"], targetLeadTypes: ["lt-insurance", "lt-mortgage"], wordCount: "2,000", competitiveAngle: "The responsible-AI companion to the prompts content: AI is the best free assistant an agent has — and a liability if misused. The clear lines, in one place.", outline: ["AI removes friction, but you're the human in the loop", "Get consent before you record", "Never let AI invent facts, rates, or details about a person", "Keep transcripts and client data in tools you trust", "Never put an AI/synthetic voice on a non-consent call (TCPA)", "A quick self-check before you use any AI output"], internalLinks: ["/glossary/tcpa", "/glossary/data-hygiene", "/lead-types/insurance-leads"], status: "brief" },
];
