import { createClient } from "@sanity/client";

const client = createClient({
  projectId: "p7rbtajg",
  dataset: "production",
  apiVersion: "2026-03-14",
  token: process.env.SANITY_API_TOKEN,
  useCdn: false,
});

async function createOrReplace(doc) {
  try {
    await client.createOrReplace(doc);
    console.log(`  ✓ ${doc._type}: ${doc._id}`);
  } catch (err) {
    console.error(`  ✗ ${doc._type}: ${doc._id} — ${err.message}`);
  }
}

// ── Categories ──────────────────────────────────────────────
const categories = [
  { _id: "cat-getting-started", title: "Getting Started", slug: "getting-started", description: "Beginner guides and fundamentals for working with aged leads" },
  { _id: "cat-strategies", title: "Strategies", slug: "strategies", description: "Advanced tactics and approaches for maximizing aged lead performance" },
  { _id: "cat-lead-types", title: "Lead Types", slug: "lead-types", description: "Industry-specific guides for different aged lead verticals" },
  { _id: "cat-scripts", title: "Scripts & Outreach", slug: "scripts-outreach", description: "Call scripts, email templates, and outreach frameworks" },
  { _id: "cat-roi", title: "ROI & Analytics", slug: "roi-analytics", description: "Measuring performance, tracking metrics, and optimizing returns" },
  { _id: "cat-compliance", title: "Compliance", slug: "compliance", description: "TCPA, DNC, and regulatory guidance for lead outreach" },
];

// ── Lead Types ──────────────────────────────────────────────
const leadTypes = [
  {
    _id: "lt-mortgage",
    title: "Mortgage Leads",
    slug: "mortgage-leads",
    icon: "🏠",
    shortDescription: "Connect with homebuyers and refinancers who expressed interest in mortgage products. High-intent data at a fraction of real-time cost.",
    affiliateUrl: "https://agedleadstore.com",
    averageCostPerLead: "$0.50 – $3.00",
    industries: ["Mortgage", "Real Estate", "Lending"],
    order: 1,
  },
  {
    _id: "lt-insurance",
    title: "Insurance Leads",
    slug: "insurance-leads",
    icon: "🛡️",
    shortDescription: "Reach consumers who previously requested quotes for auto, home, health, or life insurance products.",
    affiliateUrl: "https://agedleadstore.com",
    averageCostPerLead: "$0.25 – $2.00",
    industries: ["Insurance", "Life Insurance", "P&C Insurance"],
    order: 2,
  },
  {
    _id: "lt-final-expense",
    title: "Final Expense Leads",
    slug: "final-expense-leads",
    icon: "⚰️",
    shortDescription: "Access aged final expense and burial insurance leads — a proven market with high close rates using the right approach.",
    affiliateUrl: "https://agedleadstore.com",
    averageCostPerLead: "$0.50 – $3.00",
    industries: ["Final Expense", "Senior Market", "Life Insurance"],
    order: 3,
  },
  {
    _id: "lt-iul",
    title: "IUL Leads",
    slug: "iul-leads",
    icon: "📈",
    shortDescription: "Indexed Universal Life leads from consumers who explored cash-value life insurance and wealth-building strategies.",
    affiliateUrl: "https://agedleadstore.com",
    averageCostPerLead: "$1.00 – $5.00",
    industries: ["Life Insurance", "Financial Planning", "Wealth Management"],
    order: 4,
  },
  {
    _id: "lt-ssdi",
    title: "SSDI Leads",
    slug: "ssdi-leads",
    icon: "⚖️",
    shortDescription: "Social Security Disability Insurance leads from individuals who sought assistance with their disability claims.",
    affiliateUrl: "https://agedleadstore.com",
    averageCostPerLead: "$0.50 – $3.00",
    industries: ["Legal", "Disability Law", "Advocacy"],
    order: 5,
  },
  {
    _id: "lt-mva",
    title: "MVA Leads",
    slug: "mva-leads",
    icon: "🚗",
    shortDescription: "Motor Vehicle Accident leads for personal injury attorneys and legal services professionals.",
    affiliateUrl: "https://agedleadstore.com",
    averageCostPerLead: "$1.00 – $5.00",
    industries: ["Personal Injury", "Legal", "Insurance Claims"],
    order: 6,
  },
  {
    _id: "lt-solar",
    title: "Solar Leads",
    slug: "solar-leads",
    icon: "☀️",
    shortDescription: "Homeowners who expressed interest in solar panel installation and renewable energy savings.",
    affiliateUrl: "https://agedleadstore.com",
    averageCostPerLead: "$0.50 – $3.00",
    industries: ["Solar", "Renewable Energy", "Home Improvement"],
    order: 7,
  },
  {
    _id: "lt-medicare",
    title: "Medicare Leads",
    slug: "medicare-leads",
    icon: "🏥",
    shortDescription: "Seniors approaching or in Medicare eligibility who explored supplement and advantage plan options.",
    affiliateUrl: "https://agedleadstore.com",
    averageCostPerLead: "$0.50 – $3.00",
    industries: ["Medicare", "Health Insurance", "Senior Market"],
    order: 8,
  },
];

// ── Glossary Terms ──────────────────────────────────────────
const glossaryTerms = [
  { term: "Aged Lead", slug: "aged-lead", definition: "A consumer data record from someone who previously expressed interest in a product or service, typically 30-180+ days ago. Aged leads cost significantly less than real-time leads and are worked through personal outreach.", category: "lead-generation" },
  { term: "Real-Time Lead", slug: "real-time-lead", definition: "A lead delivered to buyers within seconds or minutes of the consumer filling out a form. Real-time leads cost $15-$60+ and are often sold to multiple buyers simultaneously.", category: "lead-generation" },
  { term: "Exclusive Lead", slug: "exclusive-lead", definition: "A lead sold to only one buyer. Exclusive leads cost more but eliminate competition. Most aged leads are non-exclusive.", category: "lead-generation" },
  { term: "Shared Lead", slug: "shared-lead", definition: "A lead sold to multiple buyers simultaneously. Most real-time leads are shared among 3-8 buyers, creating a speed-to-call competition.", category: "lead-generation" },
  { term: "Lead Age", slug: "lead-age", definition: "The number of days since a consumer originally submitted their information. Common ranges are 30-60, 60-90, 90-180, and 180+ days.", category: "lead-generation" },
  { term: "Lead Source", slug: "lead-source", definition: "The website, advertisement, or channel where a consumer originally submitted their information.", category: "lead-generation" },
  { term: "Lead Vendor", slug: "lead-vendor", definition: "A company that generates or aggregates consumer leads and sells them to sales professionals.", category: "lead-generation" },
  { term: "Cost Per Lead (CPL)", slug: "cost-per-lead", definition: "The price paid for each individual lead record. Aged leads typically cost $0.25-$5, while real-time leads cost $15-$60+.", category: "lead-generation" },
  { term: "Cost Per Acquisition (CPA)", slug: "cost-per-acquisition", definition: "The total cost to acquire one paying customer, calculated by dividing total lead spend by the number of closed deals.", category: "lead-generation" },
  { term: "Lead Validation", slug: "lead-validation", definition: "The process of verifying that lead data is accurate — confirming phone numbers, email addresses, and mailing addresses are current.", category: "lead-generation" },
  { term: "Consumer Intent", slug: "consumer-intent", definition: "The demonstrated interest a consumer showed by filling out a form or requesting information. Aged leads carry historical intent.", category: "lead-generation" },
  { term: "Pipeline", slug: "pipeline", definition: "The collection of prospects currently being worked by a salesperson. Aged leads are used to fill the pipeline affordably.", category: "sales" },
  { term: "Speed to Lead", slug: "speed-to-lead", definition: "The time between a consumer submitting information and receiving first contact. Critical for real-time leads, less important for aged leads.", category: "sales" },
  { term: "Contact Rate", slug: "contact-rate", definition: "The percentage of leads where the salesperson successfully reaches the consumer. Aged leads typically have 5-15% phone contact rates.", category: "sales" },
  { term: "Conversion Rate", slug: "conversion-rate", definition: "The percentage of leads that result in a closed sale. Real-time leads convert at 5-15%; aged leads at 1-5%.", category: "sales" },
  { term: "Follow-Up Cadence", slug: "follow-up-cadence", definition: "The scheduled sequence of contact attempts across multiple channels used to work a lead. Most sales happen after 5-7 touches.", category: "sales" },
  { term: "Multi-Channel Outreach", slug: "multi-channel-outreach", definition: "Contacting leads through multiple channels — phone, email, direct mail, text, and door knocking — to maximize conversion.", category: "sales" },
  { term: "Cold Calling", slug: "cold-calling", definition: "Contacting a prospect with no prior relationship. Aged leads are 'warm cold calls' — the consumer previously expressed interest.", category: "sales" },
  { term: "Warm Lead", slug: "warm-lead", definition: "A prospect who has previously expressed interest. Aged leads fall between cold and warm — intent exists but no personal relationship.", category: "sales" },
  { term: "Objection Handling", slug: "objection-handling", definition: "Addressing a prospect's concerns during a sales conversation. Common aged lead objections: 'I already handled that' and 'I don't remember.'", category: "sales" },
  { term: "Close Rate", slug: "close-rate", definition: "The percentage of qualified prospects that become paying customers. Differs from conversion rate — only counts contacted and qualified prospects.", category: "sales" },
  { term: "Drip Campaign", slug: "drip-campaign", definition: "An automated sequence of emails or messages sent to leads over time to nurture prospects who aren't ready to buy immediately.", category: "marketing" },
  { term: "CRM", slug: "crm", definition: "Customer Relationship Management software used to track leads, contact attempts, and deal status. Essential for working aged leads at volume.", category: "sales" },
  { term: "Dialer", slug: "dialer", definition: "Software that automates phone dialing. Power, predictive, and progressive dialers each have different compliance implications with aged leads.", category: "sales" },
  { term: "Door Knocking", slug: "door-knocking", definition: "In-person sales visits. Highly effective for aged leads in final expense, insurance, and solar with 2-5x higher conversion than phone.", category: "sales" },
  { term: "Final Expense Insurance", slug: "final-expense-insurance", definition: "Whole life insurance with small face value ($5K-$50K) covering funeral and end-of-life costs. One of the most popular aged lead verticals.", category: "insurance" },
  { term: "Indexed Universal Life (IUL)", slug: "indexed-universal-life", definition: "Permanent life insurance with cash value linked to a market index with downside protection. High-value, high-commission product.", category: "insurance" },
  { term: "Term Life Insurance", slug: "term-life-insurance", definition: "Life insurance for a specific period (10-30 years). Simpler and cheaper than permanent coverage, easier to sell via aged leads.", category: "insurance" },
  { term: "Medicare Supplement (Medigap)", slug: "medicare-supplement", definition: "Private insurance covering costs not paid by Original Medicare — copayments, coinsurance, and deductibles.", category: "insurance" },
  { term: "Medicare Advantage", slug: "medicare-advantage", definition: "Alternative to Original Medicare offered by private insurers, bundling Parts A, B, and often D with additional benefits.", category: "insurance" },
  { term: "Annual Enrollment Period (AEP)", slug: "annual-enrollment-period", definition: "October 15 - December 7 yearly window for Medicare beneficiaries to change plans. Highest-conversion period for Medicare leads.", category: "insurance" },
  { term: "Open Enrollment Period (OEP)", slug: "open-enrollment-period", definition: "January 1 - March 31 for Medicare Advantage switches. November 1 - January 15 for ACA health insurance.", category: "insurance" },
  { term: "P&C Insurance", slug: "p-and-c-insurance", definition: "Property and Casualty insurance — auto, home, renters, and commercial policies.", category: "insurance" },
  { term: "Cross-Selling", slug: "cross-selling", definition: "Selling additional products to a prospect. Key aged lead strategy — an auto insurance lead may also need home or life coverage.", category: "insurance" },
  { term: "Underwriting", slug: "underwriting", definition: "The process insurers use to evaluate risk and determine pricing. Understanding basics helps agents pre-qualify aged lead prospects.", category: "insurance" },
  { term: "Refinance Lead", slug: "refinance-lead", definition: "A consumer interested in refinancing their existing mortgage for a lower rate, reduced payments, or equity access.", category: "mortgage" },
  { term: "Purchase Lead", slug: "purchase-lead", definition: "A consumer actively looking to buy a home and seeking mortgage pre-approval or financing.", category: "mortgage" },
  { term: "HELOC", slug: "heloc", definition: "Home Equity Line of Credit — revolving credit secured by home equity for renovations, debt consolidation, or other purposes.", category: "mortgage" },
  { term: "Reverse Mortgage", slug: "reverse-mortgage", definition: "A loan allowing homeowners 62+ to convert equity into cash without monthly payments. Repaid when the homeowner sells or passes away.", category: "mortgage" },
  { term: "Loan Officer", slug: "loan-officer", definition: "Licensed professional helping consumers obtain mortgages. Primary buyers of aged mortgage leads for pipeline building.", category: "mortgage" },
  { term: "Pre-Qualification", slug: "pre-qualification", definition: "Preliminary creditworthiness assessment based on self-reported info. Natural next step when converting aged mortgage leads.", category: "mortgage" },
  { term: "SSDI", slug: "ssdi", definition: "Social Security Disability Insurance — federal program providing benefits to people unable to work due to qualifying disability.", category: "legal" },
  { term: "MVA (Motor Vehicle Accident)", slug: "mva", definition: "Motor vehicle accident involving cars, trucks, or motorcycles. MVA leads connect attorneys with accident victims seeking representation.", category: "legal" },
  { term: "Personal Injury Lead", slug: "personal-injury-lead", definition: "Consumer record from someone seeking legal representation after injury from negligence — auto accidents, slip and falls, workplace injuries.", category: "legal" },
  { term: "Contingency Fee", slug: "contingency-fee", definition: "Fee arrangement where the attorney only gets paid if they win. Standard in PI and SSDI cases. Removes a major barrier with aged leads.", category: "legal" },
  { term: "Statute of Limitations", slug: "statute-of-limitations", definition: "Legal deadline for filing a lawsuit — typically 2-3 years for personal injury. Creates natural urgency with aged MVA leads.", category: "legal" },
  { term: "TCPA", slug: "tcpa", definition: "Telephone Consumer Protection Act — federal law regulating telemarketing. Requires prior consent for auto-dialed calls. Critical for aged lead compliance.", category: "compliance" },
  { term: "DNC List", slug: "dnc-list", definition: "Do Not Call registry of phone numbers opted out of telemarketing. Always scrub aged lead lists against the National DNC Registry.", category: "compliance" },
  { term: "Opt-In", slug: "opt-in", definition: "Consumer's explicit agreement to receive communications. Aged leads may not have specific consent for your company — consult compliance.", category: "compliance" },
  { term: "FTC Disclosure", slug: "ftc-disclosure", definition: "Federal Trade Commission-required disclosures for advertising and affiliate relationships.", category: "compliance" },
  { term: "CMS Guidelines", slug: "cms-guidelines", definition: "Centers for Medicare & Medicaid Services marketing rules governing Medicare product advertising and sales.", category: "compliance" },
  { term: "SEO", slug: "seo", definition: "Search Engine Optimization — improving website visibility in organic search results to drive free traffic.", category: "marketing" },
  { term: "UTM Parameters", slug: "utm-parameters", definition: "URL tracking tags (utm_source, utm_medium, utm_campaign, utm_content) for measuring traffic sources in analytics tools.", category: "marketing" },
  { term: "Affiliate Marketing", slug: "affiliate-marketing", definition: "Revenue model earning commissions by referring customers to another company's products via tracked links.", category: "marketing" },
  { term: "ROI (Return on Investment)", slug: "roi", definition: "Profitability measure: (Revenue - Cost) / Cost × 100. Aged leads typically deliver higher ROI than real-time due to lower cost.", category: "finance" },
  { term: "CAC (Customer Acquisition Cost)", slug: "cac", definition: "Total cost to acquire one customer including leads, time, and overhead. Aged leads significantly reduce CAC.", category: "finance" },
  { term: "LTV (Lifetime Value)", slug: "ltv", definition: "Total revenue a customer generates over the full relationship. High-LTV products (IUL, Medicare) justify higher lead costs.", category: "finance" },
];

async function seed() {
  console.log("Seeding Sanity...\n");

  console.log("Categories:");
  for (const cat of categories) {
    await createOrReplace({
      _id: cat._id,
      _type: "category",
      title: cat.title,
      slug: { _type: "slug", current: cat.slug },
      description: cat.description,
    });
  }

  console.log("\nLead Types:");
  for (const lt of leadTypes) {
    await createOrReplace({
      _id: lt._id,
      _type: "leadType",
      title: lt.title,
      slug: { _type: "slug", current: lt.slug },
      icon: lt.icon,
      shortDescription: lt.shortDescription,
      affiliateUrl: lt.affiliateUrl,
      averageCostPerLead: lt.averageCostPerLead,
      industries: lt.industries,
      order: lt.order,
    });
  }

  console.log("\nGlossary Terms:");
  for (const gt of glossaryTerms) {
    await createOrReplace({
      _id: `glossary-${gt.slug}`,
      _type: "glossaryTerm",
      term: gt.term,
      slug: { _type: "slug", current: gt.slug },
      definition: gt.definition,
      category: gt.category,
    });
  }

  console.log(`\nDone! Seeded ${categories.length} categories, ${leadTypes.length} lead types, ${glossaryTerms.length} glossary terms.`);
}

seed().catch(console.error);
