export interface ProviderData {
  name: string;
  slug: string;
  shortDescription: string;
  website: string;
  foundedYear: number;
  bbbRating: string;
  headquartersState: string;
  bestFor: string[];
  notIdealFor: string[];
  /** Ratings: each 1-10 */
  ratingTransparency: number;
  ratingValue: number;
  ratingCompliance: number;
  ratingFlexibility: number;
  ratingPlatform: number;
  ratingReputation: number;
  /** Computed: weighted overall (0.20, 0.20, 0.20, 0.15, 0.15, 0.10) */
  overallRating: number;
  ratingNotes: string;
  lastVerified: string;
  verticals: string[];
  leadTypes: string[];
  pricingModel: "transparent" | "semi-transparent" | "sales-required";
  hasMinimums: boolean;
  minimumDescription?: string;
  contractRequired: boolean;
  returnPolicy: string;
  deliveryMethods: string[];
  complianceFeatures: string[];
  isFeatured: boolean;
  /** Editorial review paragraphs */
  editorialReview: string;
  /**
   * Slug of a dedicated in-depth blog review for this provider, if one exists.
   * When set, this profile defers to that article as the SEO canonical for
   * "{name} review" intent: the profile retargets to a directory framing,
   * canonicalizes to the article, drops its duplicate rating schema, and
   * surfaces a prominent link to it. Prevents the templated provider profile
   * from cannibalizing the long-form review for branded review queries.
   */
  reviewArticleSlug?: string;
}

function computeOverall(p: {
  ratingTransparency: number;
  ratingValue: number;
  ratingCompliance: number;
  ratingFlexibility: number;
  ratingPlatform: number;
  ratingReputation: number;
}): number {
  const score =
    p.ratingTransparency * 0.2 +
    p.ratingValue * 0.2 +
    p.ratingCompliance * 0.2 +
    p.ratingFlexibility * 0.15 +
    p.ratingPlatform * 0.15 +
    p.ratingReputation * 0.1;
  return Math.round(score * 10) / 10;
}

const rawProviders: Omit<ProviderData, "overallRating">[] = [
  {
    name: "Aged Lead Store",
    slug: "aged-lead-store",
    reviewArticleSlug: "aged-lead-store-review-2026",
    shortDescription:
      "The largest on-demand aged internet lead marketplace with fully transparent per-lead pricing across 15+ verticals.",
    website: "https://agedleadstore.com",
    foundedYear: 1999,
    bbbRating: "A+",
    headquartersState: "FL",
    bestFor: [
      "Beginners",
      "Solo agents",
      "Transparent pricing",
      "No minimums",
      "Multi-vertical buyers",
    ],
    notIdealFor: [
      "Real-time lead buyers",
      "Enterprise API needs",
      "Live transfer buyers",
    ],
    ratingTransparency: 10,
    ratingValue: 8,
    ratingCompliance: 7,
    ratingFlexibility: 9,
    ratingPlatform: 8,
    ratingReputation: 9,
    ratingNotes:
      "Market leader in aged leads. Fully self-service e-commerce with published per-lead pricing. 25+ years in business, A+ BBB. No minimums, no contracts. Up to 20% return cap. Advanced filtering by state, zip, phone type, lead age. Flexibility dinged slightly for aged-only (no real-time, live transfer, or API options). Platform strong but lacks CRM integration or API delivery.",
    lastVerified: "2026-04-28",
    verticals: [
      "mortgage",
      "auto-insurance",
      "life-insurance",
      "final-expense",
      "health-insurance",
      "medicare",
      "solar",
      "home-improvement",
      "debt-settlement",
      "mca-business-loans",
      "legal",
      "auto-warranty",
      "annuity-iul",
    ],
    leadTypes: ["aged"],
    pricingModel: "transparent",
    hasMinimums: false,
    contractRequired: false,
    returnPolicy: "Up to 20% return cap for wrong/disconnected numbers",
    deliveryMethods: ["instant-download", "email"],
    complianceFeatures: ["tcpa-docs", "dnc-scrubbing"],
    isFeatured: false,
    editorialReview:
      "Aged Lead Store is the clear market leader in aged internet leads. With 25+ years in business and an A+ BBB rating, they've served over 40,000 agents. Their biggest strength is complete transparency — every lead type has a published per-lead price, you can buy as few or as many as you want, and there are zero contracts or commitments. The self-service platform offers advanced filtering by geography, phone type, and lead age. Their return policy allows up to 20% credits for wrong numbers, which is generous by industry standards. The main limitation is that they only sell aged leads — no real-time leads, live transfers, or trigger data. If you need fresh leads or call transfers, you'll need a different provider. But for aged lead buying, this is the benchmark.",
  },
  {
    name: "The Leads Warehouse",
    slug: "the-leads-warehouse",
    shortDescription:
      "Established multi-vertical lead provider offering aged, real-time, live transfers, and direct mail across 15+ industries.",
    website: "https://theleadswarehouse.com",
    foundedYear: 2003,
    bbbRating: "A",
    headquartersState: "FL",
    bestFor: [
      "Multi-channel buyers",
      "Agents wanting aged + real-time mix",
      "Direct mail campaigns",
    ],
    notIdealFor: [
      "Price-sensitive buyers",
      "Self-service shoppers",
      "Those needing published pricing",
    ],
    ratingTransparency: 4,
    ratingValue: 7,
    ratingCompliance: 7,
    ratingFlexibility: 6,
    ratingPlatform: 6,
    ratingReputation: 8,
    ratingNotes:
      "Wide product range including aged, real-time, call transfer, direct mail, and cold call lists. 20+ years in business. Major downside: pricing is not published — you must contact sales. This makes comparison shopping difficult and suggests higher margins on quotes.",
    lastVerified: "2026-04-28",
    verticals: [
      "mortgage",
      "auto-insurance",
      "life-insurance",
      "final-expense",
      "health-insurance",
      "medicare",
      "solar",
      "home-improvement",
      "debt-settlement",
      "mca-business-loans",
      "legal",
      "auto-warranty",
    ],
    leadTypes: ["aged", "real-time", "live-transfer", "direct-mail", "data-list"],
    pricingModel: "sales-required",
    hasMinimums: true,
    minimumDescription: "Varies by product — contact sales",
    contractRequired: false,
    returnPolicy: "Credits for invalid data — terms vary by product",
    deliveryMethods: ["instant-download", "email", "real-time-post"],
    complianceFeatures: ["tcpa-docs", "dnc-scrubbing"],
    isFeatured: false,
    editorialReview:
      "The Leads Warehouse has been in business for 20+ years and offers a wider product range than most competitors — aged leads, real-time internet leads, live call transfers, direct mail leads, and cold call lists across 15+ verticals. That breadth is their main advantage. The significant downside is pricing opacity. You cannot see prices on their website and must contact sales for quotes. This makes it harder to comparison shop and may mean higher per-lead costs compared to transparent providers. If you value having a single provider for multiple lead types and channels, they're worth evaluating. But go in knowing the price you'll need to negotiate.",
  },
  {
    name: "iLeads",
    slug: "ileads",
    shortDescription:
      "CoreLogic-owned provider specializing in credit-triggered and intent-based leads with 271+ data points per record.",
    website: "https://ileads.com",
    foundedYear: 1996,
    bbbRating: "A",
    headquartersState: "CA",
    bestFor: [
      "Mortgage lenders",
      "Data-driven buyers",
      "Enterprise-grade compliance",
      "Trigger lead buyers",
    ],
    notIdealFor: [
      "Budget-conscious agents",
      "Small volume buyers",
      "Insurance-only agents",
    ],
    ratingTransparency: 3,
    ratingValue: 7,
    ratingCompliance: 9,
    ratingFlexibility: 4,
    ratingPlatform: 8,
    ratingReputation: 9,
    ratingNotes:
      "Premium data provider owned by CoreLogic. Proprietary homeowner database covers 99.8% of US households with 271+ data points. Excellent for mortgage and insurance verticals. Enterprise-grade compliance. Pricing is sales-driven and premium.",
    lastVerified: "2026-04-28",
    verticals: ["mortgage", "auto-insurance", "life-insurance", "health-insurance"],
    leadTypes: ["real-time", "trigger", "data-list"],
    pricingModel: "sales-required",
    hasMinimums: true,
    minimumDescription: "Enterprise minimums — contact sales",
    contractRequired: true,
    returnPolicy: "Negotiated per contract",
    deliveryMethods: ["api", "crm-push", "real-time-post"],
    complianceFeatures: [
      "tcpa-docs",
      "trustedform",
      "jornaya",
      "dnc-scrubbing",
      "consent-verification",
    ],
    isFeatured: false,
    editorialReview:
      "iLeads is a different animal from most providers on this list. Owned by CoreLogic, they have access to a proprietary homeowner database covering 99.8% of US households with 271+ data points per record. They specialize in credit-triggered leads — identifying consumers who have recently pulled credit or made financial inquiries. This is premium data that commands premium pricing. Best suited for mortgage lenders and large insurance operations with enterprise budgets. If you're a solo agent buying 200 leads a month, iLeads isn't built for you. But if you're a lender or call center running high-volume campaigns with sophisticated targeting needs, the data quality is hard to match.",
  },
  {
    name: "Need-A-Lead",
    slug: "need-a-lead",
    shortDescription:
      "Senior insurance specialist using direct mail to generate 100% exclusive leads with 90-day territorial exclusivity.",
    website: "https://needalead.com",
    foundedYear: 1982,
    bbbRating: "A+",
    headquartersState: "OH",
    bestFor: [
      "Senior insurance agents",
      "Final expense specialists",
      "Medicare agents",
      "Agents wanting exclusive territories",
    ],
    notIdealFor: [
      "Multi-vertical buyers",
      "Digital-first agents",
      "Budget buyers wanting volume",
    ],
    ratingTransparency: 6,
    ratingValue: 7,
    ratingCompliance: 8,
    ratingFlexibility: 5,
    ratingPlatform: 4,
    ratingReputation: 9,
    ratingNotes:
      "Longest-running provider on our list (since 1982). Specializes exclusively in senior insurance via direct mail. 100% exclusive leads with 90-day exclusivity on mailed areas. Premium but high quality. Limited to a narrow niche.",
    lastVerified: "2026-04-28",
    verticals: ["final-expense", "medicare", "long-term-care", "life-insurance"],
    leadTypes: ["direct-mail"],
    pricingModel: "semi-transparent",
    hasMinimums: true,
    minimumDescription: "Minimum direct mail order — contact for details",
    contractRequired: false,
    returnPolicy: "Replacement leads for undeliverable mail",
    deliveryMethods: ["email"],
    complianceFeatures: ["tcpa-docs", "dnc-scrubbing"],
    isFeatured: false,
    editorialReview:
      "Need-A-Lead has been in business since 1982 — the longest track record of any provider we review. They serve a narrow niche (senior insurance) but serve it well. Their model is unique: direct mail lead generation with 100% exclusive leads and 90-day territorial exclusivity. This means nobody else gets the same leads in your area for 3 months. The trade-off is higher per-lead costs compared to internet leads and limited to the senior insurance market. Not for multi-vertical buyers, but for final expense, Medicare, and LTC agents who want truly exclusive leads with high intent, Need-A-Lead has earned its 40+ year reputation.",
  },
  {
    name: "LeadPoint",
    slug: "leadpoint",
    shortDescription:
      "Mortgage-focused lead provider offering both an aged lead store and real-time lead distribution with zip-code filtering.",
    website: "https://leadpoint.com",
    foundedYear: 2004,
    bbbRating: "A",
    headquartersState: "CA",
    bestFor: [
      "Mortgage professionals",
      "Loan officers wanting aged + real-time",
      "Geographic targeting",
    ],
    notIdealFor: [
      "Insurance agents",
      "Non-mortgage verticals",
      "Small budget buyers",
    ],
    ratingTransparency: 5,
    ratingValue: 7,
    ratingCompliance: 7,
    ratingFlexibility: 6,
    ratingPlatform: 7,
    ratingReputation: 7,
    ratingNotes:
      "Solid mortgage-focused provider with both aged and real-time options. Zip-code level filtering is useful for LOs. Limited to mortgage vertical.",
    lastVerified: "2026-04-28",
    verticals: ["mortgage"],
    leadTypes: ["aged", "real-time"],
    pricingModel: "semi-transparent",
    hasMinimums: false,
    contractRequired: false,
    returnPolicy: "Credits for invalid contact data",
    deliveryMethods: ["instant-download", "email", "real-time-post"],
    complianceFeatures: ["tcpa-docs", "dnc-scrubbing"],
    isFeatured: false,
    editorialReview:
      "LeadPoint is a solid choice for mortgage professionals specifically. They offer both an aged lead store and real-time lead distribution, letting loan officers mix strategies. The zip-code level filtering is particularly useful for LOs focused on specific MSAs. Pricing is semi-transparent — ranges are available but exact quotes may require contact. The limitation is clear: this is mortgage only. If you need insurance, solar, or other verticals, look elsewhere. But for mortgage LOs and brokers, the combination of aged and real-time with geographic precision makes LeadPoint worth testing.",
  },
  {
    name: "Badass Insurance Leads",
    slug: "badass-insurance-leads",
    shortDescription:
      "Boutique insurance lead provider known for personal service and competitive aged lead pricing at $1-$4 per lead.",
    website: "https://badassinsuranceleads.com",
    foundedYear: 2015,
    bbbRating: "NR",
    headquartersState: "TX",
    bestFor: [
      "Insurance agents wanting personal service",
      "Budget-conscious buyers",
      "Agents buying 100-500 leads",
    ],
    notIdealFor: [
      "High volume call centers",
      "Non-insurance verticals",
      "Enterprise buyers",
    ],
    ratingTransparency: 7,
    ratingValue: 8,
    ratingCompliance: 6,
    ratingFlexibility: 7,
    ratingPlatform: 5,
    ratingReputation: 6,
    ratingNotes:
      "Boutique operation with good value pricing. Known for personal service and responsive support. Limited scale and platform sophistication. No BBB rating. 5 insurance verticals.",
    lastVerified: "2026-04-28",
    verticals: [
      "auto-insurance",
      "life-insurance",
      "final-expense",
      "health-insurance",
      "medicare",
    ],
    leadTypes: ["aged"],
    pricingModel: "transparent",
    hasMinimums: true,
    minimumDescription: "100 leads minimum order",
    contractRequired: false,
    returnPolicy: "Credits for disconnected numbers",
    deliveryMethods: ["instant-download", "email"],
    complianceFeatures: ["tcpa-docs"],
    isFeatured: false,
    editorialReview:
      "Badass Insurance Leads is a smaller, boutique operation that competes on price and personal service. Their aged insurance leads range from $1-$4 per lead, which is competitive. What you gain in personal attention and support, you trade off in platform sophistication — don't expect the filtering options or instant self-service of larger providers. There's a 100-lead minimum, which is reasonable. The lack of a BBB rating is a minor concern for a newer company. Best for insurance agents who value a relationship with their lead provider and buy in moderate volumes (100-500 leads at a time).",
  },
  {
    name: "Brokers Data",
    slug: "brokers-data",
    shortDescription:
      "Real-time mortgage internet leads plus aged insurance leads with consumer data overlay capabilities.",
    website: "https://brokersdata.com",
    foundedYear: 2005,
    bbbRating: "A",
    headquartersState: "FL",
    bestFor: [
      "Mortgage brokers wanting real-time leads",
      "Agents needing consumer data overlays",
      "Multi-product financial professionals",
    ],
    notIdealFor: [
      "Non-financial verticals",
      "Self-service shoppers",
      "Budget aged lead buyers",
    ],
    ratingTransparency: 5,
    ratingValue: 6,
    ratingCompliance: 7,
    ratingFlexibility: 5,
    ratingPlatform: 6,
    ratingReputation: 7,
    ratingNotes:
      "Niche player focused on mortgage and insurance with consumer data capabilities. Data overlay is a differentiator. Limited vertical coverage.",
    lastVerified: "2026-04-28",
    verticals: ["mortgage", "auto-insurance", "life-insurance", "health-insurance"],
    leadTypes: ["real-time", "aged", "data-list"],
    pricingModel: "semi-transparent",
    hasMinimums: true,
    minimumDescription: "Varies by product",
    contractRequired: false,
    returnPolicy: "Credits for invalid data",
    deliveryMethods: ["email", "instant-download", "api"],
    complianceFeatures: ["tcpa-docs", "dnc-scrubbing"],
    isFeatured: false,
    editorialReview:
      "Brokers Data serves the mortgage and insurance intersection with both real-time internet leads and aged leads, plus consumer data list capabilities. The data overlay feature — appending credit, property, and demographic data to leads — is a genuine differentiator for sophisticated buyers. Pricing isn't fully transparent and requires engagement with their team. Best for mortgage brokers and financial professionals who need enriched lead data, not just names and phone numbers. Not the best choice for budget aged lead buying or non-financial verticals.",
  },
  {
    name: "DataToLeads",
    slug: "datatoleads",
    shortDescription:
      "White-label data marketplace with 335M+ consumer records, enabling both buying and selling of aged lead data.",
    website: "https://datatoleads.com",
    foundedYear: 2018,
    bbbRating: "NR",
    headquartersState: "FL",
    bestFor: [
      "High-volume data buyers",
      "Companies wanting to resell leads",
      "Marketers building custom lists",
    ],
    notIdealFor: [
      "Solo agents buying small batches",
      "Those wanting curated lead quality",
      "Compliance-focused buyers",
    ],
    ratingTransparency: 7,
    ratingValue: 8,
    ratingCompliance: 5,
    ratingFlexibility: 8,
    ratingPlatform: 7,
    ratingReputation: 5,
    ratingNotes:
      "Marketplace model with massive data scale (335M+ records). Very low CPL (from $0.001). Quality varies significantly depending on data source and age. Compliance documentation less rigorous than dedicated lead providers.",
    lastVerified: "2026-04-28",
    verticals: [
      "mortgage",
      "auto-insurance",
      "life-insurance",
      "final-expense",
      "health-insurance",
      "solar",
      "home-improvement",
      "debt-settlement",
      "mca-business-loans",
    ],
    leadTypes: ["aged", "data-list"],
    pricingModel: "transparent",
    hasMinimums: false,
    contractRequired: false,
    returnPolicy: "Varies by data provider on the platform",
    deliveryMethods: ["instant-download", "api"],
    complianceFeatures: ["dnc-scrubbing"],
    isFeatured: false,
    editorialReview:
      "DataToLeads (also operating as AvocaData) is a two-sided marketplace where data providers list and sell aged leads and consumer data. With 335M+ individual consumer records, the scale is impressive and the per-lead costs can be extremely low — fractions of a penny for bulk data. However, quality is highly variable. This is raw data at scale, not curated lead quality. Compliance documentation is less rigorous than dedicated lead providers, which is a concern for TCPA-sensitive operations. Best for high-volume operators who have their own scrubbing and compliance processes. Not recommended for agents who need turnkey, compliance-ready leads.",
  },
  {
    name: "LeadsData",
    slug: "leadsdata",
    shortDescription:
      "Self-serve marketplace for aged data and real-time lead feeds with transparent pricing and TCPA compliance focus.",
    website: "https://leadsdata.com",
    foundedYear: 2019,
    bbbRating: "NR",
    headquartersState: "TX",
    bestFor: [
      "Self-service buyers",
      "Mixed aged + real-time strategy",
      "TCPA-conscious buyers",
    ],
    notIdealFor: [
      "Enterprise volume",
      "Non-digital lead types",
      "Those needing established track record",
    ],
    ratingTransparency: 8,
    ratingValue: 7,
    ratingCompliance: 7,
    ratingFlexibility: 7,
    ratingPlatform: 7,
    ratingReputation: 4,
    ratingNotes:
      "Newer marketplace with good transparency and self-service UX. TCPA compliance messaging is strong. Limited track record as a younger company.",
    lastVerified: "2026-04-28",
    verticals: [
      "auto-insurance",
      "life-insurance",
      "final-expense",
      "health-insurance",
      "medicare",
      "solar",
      "debt-settlement",
    ],
    leadTypes: ["aged", "real-time"],
    pricingModel: "transparent",
    hasMinimums: false,
    contractRequired: false,
    returnPolicy: "Credits for invalid data within defined criteria",
    deliveryMethods: ["instant-download", "email", "real-time-post"],
    complianceFeatures: ["tcpa-docs", "dnc-scrubbing", "consent-verification"],
    isFeatured: false,
    editorialReview:
      "LeadsData positions itself as a modern, self-serve lead marketplace with transparent pricing and strong TCPA compliance messaging. The platform is clean and easy to use. They offer both aged data and real-time feeds across insurance and financial verticals. The main concern is limited track record — founded in 2019 with no BBB rating yet. For buyers who prioritize transparency and self-service, it's worth testing with a small batch. The compliance-first positioning is encouraging, but verify their data verification, hygiene, and DNC-scrubbing standards match your requirements.",
  },
  {
    name: "Lead Heroes",
    slug: "lead-heroes",
    shortDescription:
      "Insurance lead provider offering both fresh exclusive leads ($15-$30) and aged leads ($6-$12) for life, final expense, and Medicare.",
    website: "https://leadheroes.com",
    foundedYear: 2014,
    bbbRating: "A",
    headquartersState: "WA",
    bestFor: [
      "Insurance agents wanting fresh + aged mix",
      "Final expense specialists",
      "Medicare agents",
    ],
    notIdealFor: [
      "Non-insurance verticals",
      "Budget buyers wanting sub-$5 leads",
      "High-volume call centers",
    ],
    ratingTransparency: 7,
    ratingValue: 6,
    ratingCompliance: 7,
    ratingFlexibility: 6,
    ratingPlatform: 6,
    ratingReputation: 7,
    ratingNotes:
      "Solid insurance-focused provider with clear pricing tiers. Fresh exclusive leads are premium priced. Aged leads are in the $6-12 range which is higher than some competitors. Good reputation in insurance agent communities.",
    lastVerified: "2026-04-28",
    verticals: ["life-insurance", "final-expense", "medicare"],
    leadTypes: ["aged", "real-time"],
    pricingModel: "transparent",
    hasMinimums: false,
    contractRequired: false,
    returnPolicy: "Credits for bad phone numbers within 48 hours",
    deliveryMethods: ["email", "crm-push"],
    complianceFeatures: ["tcpa-docs", "dnc-scrubbing"],
    isFeatured: false,
    editorialReview:
      "Lead Heroes serves the insurance market with a clear two-tier offering: fresh exclusive leads at $15-$30 and aged leads at $6-$12. This pricing is transparent and straightforward, though the aged lead pricing is on the higher end compared to providers like Aged Lead Store. The advantage is that Lead Heroes focuses on lead quality over rock-bottom pricing. They have a solid reputation in insurance agent forums and communities. Best for life insurance, final expense, and Medicare agents who want a reliable insurance-specific provider with both fresh and aged options.",
  },
  {
    name: "Synergy Direct Solution",
    slug: "synergy-direct-solution",
    shortDescription:
      "MCA and business loan lead specialist with extremely competitive aged data pricing from $0.01/lead and live transfers at $50.",
    website: "https://synergydirectsolution.com",
    foundedYear: 2017,
    bbbRating: "NR",
    headquartersState: "NY",
    bestFor: [
      "MCA brokers",
      "Business loan officers",
      "High-volume data buyers",
      "Live transfer buyers",
    ],
    notIdealFor: [
      "Insurance agents",
      "Mortgage professionals",
      "Consumer lead buyers",
    ],
    ratingTransparency: 8,
    ratingValue: 8,
    ratingCompliance: 5,
    ratingFlexibility: 7,
    ratingPlatform: 5,
    ratingReputation: 5,
    ratingNotes:
      "Very competitive pricing in the MCA/business loan niche. Published pricing is a plus. Data quality at the $0.01-$0.05 tier is raw bulk data. Higher tiers (appointments, live transfers) offer better quality. Limited track record.",
    lastVerified: "2026-04-28",
    verticals: ["mca-business-loans"],
    leadTypes: ["aged", "live-transfer", "data-list"],
    pricingModel: "transparent",
    hasMinimums: true,
    minimumDescription: "Varies by product tier",
    contractRequired: false,
    returnPolicy: "Credits for disconnected transfers",
    deliveryMethods: ["instant-download", "email"],
    complianceFeatures: ["tcpa-docs"],
    isFeatured: false,
    editorialReview:
      "Synergy Direct Solution is a niche player focused entirely on MCA and business loan leads. Their pricing is among the most competitive in this space: aged data from $0.01-$0.05 per lead, appointment leads at $20, and live transfers at $50. The published pricing is refreshing for a vertical where opaque pricing is common. At the penny-per-lead tier, expect raw bulk data that requires significant scrubbing and filtering. The higher-tier products (appointments and transfers) offer better quality but higher cost. Best for MCA brokers and business loan shops that have the dialing capacity to work high volumes.",
  },
  {
    name: "Aged Leads Depot",
    slug: "aged-leads-depot",
    shortDescription:
      "Multi-vertical aged lead provider covering insurance, solar, mortgage, MCA, and MVA leads with simple ordering.",
    website: "https://agedleadsdepot.com",
    foundedYear: 2019,
    bbbRating: "NR",
    headquartersState: "TX",
    bestFor: [
      "Multi-vertical aged lead buyers",
      "Budget-conscious agents",
      "Simple ordering experience",
    ],
    notIdealFor: [
      "Real-time lead needs",
      "Enterprise compliance requirements",
      "Those wanting established track record",
    ],
    ratingTransparency: 7,
    ratingValue: 7,
    ratingCompliance: 5,
    ratingFlexibility: 7,
    ratingPlatform: 5,
    ratingReputation: 4,
    ratingNotes:
      "Newer multi-vertical aged lead provider. Competitive pricing and simple ordering. Limited track record and less robust compliance documentation than established providers.",
    lastVerified: "2026-04-28",
    verticals: [
      "auto-insurance",
      "life-insurance",
      "final-expense",
      "solar",
      "mortgage",
      "mca-business-loans",
      "legal",
    ],
    leadTypes: ["aged"],
    pricingModel: "transparent",
    hasMinimums: false,
    contractRequired: false,
    returnPolicy: "Credits for disconnected numbers",
    deliveryMethods: ["instant-download", "email"],
    complianceFeatures: ["tcpa-docs"],
    isFeatured: false,
    editorialReview:
      "Aged Leads Depot is a newer entrant offering aged leads across multiple verticals with straightforward ordering. Pricing is competitive and transparent. The main concern is limited track record — no BBB rating and less robust compliance documentation compared to established providers. For budget buyers willing to test with small batches, it's worth a trial. But verify data quality carefully before scaling, and confirm their data verification, hygiene, and DNC-scrubbing practices meet your compliance requirements.",
  },
  {
    name: "Lead Tycoons",
    slug: "lead-tycoons",
    shortDescription:
      "Business loan and MCA lead specialist sourcing from both online and offline channels with moderate pricing.",
    website: "https://leadtycoons.com",
    foundedYear: 2016,
    bbbRating: "NR",
    headquartersState: "NY",
    bestFor: [
      "MCA and business loan brokers",
      "Agents wanting online + offline leads",
    ],
    notIdealFor: [
      "Consumer lead buyers",
      "Insurance agents",
      "Enterprise compliance needs",
    ],
    ratingTransparency: 5,
    ratingValue: 6,
    ratingCompliance: 5,
    ratingFlexibility: 6,
    ratingPlatform: 5,
    ratingReputation: 5,
    ratingNotes:
      "Niche MCA/business loan provider. Mix of online and offline sourced leads is interesting but raises compliance questions on offline-sourced data.",
    lastVerified: "2026-04-28",
    verticals: ["mca-business-loans"],
    leadTypes: ["aged", "data-list"],
    pricingModel: "semi-transparent",
    hasMinimums: true,
    minimumDescription: "Contact for minimum orders",
    contractRequired: false,
    returnPolicy: "Limited credits — contact for terms",
    deliveryMethods: ["email", "instant-download"],
    complianceFeatures: ["tcpa-docs"],
    isFeatured: false,
    editorialReview:
      "Lead Tycoons focuses on the MCA and business loan space, sourcing leads from both online form fills and offline channels. The multi-source approach can be an advantage for diversity, but raises questions about consent documentation for offline-sourced data that buyers should verify carefully. Pricing is semi-transparent with ranges available. A reasonable option for MCA brokers to test alongside other providers in the space, but not a standout in any particular dimension.",
  },
  {
    name: "QuoteWizard",
    slug: "quotewizard",
    shortDescription:
      "LendingTree-owned insurance lead marketplace connecting agents with real-time shared leads across auto, home, health, and life.",
    website: "https://quotewizard.com",
    foundedYear: 2006,
    bbbRating: "A+",
    headquartersState: "WA",
    bestFor: [
      "Established agencies with budget",
      "Agents wanting real-time leads",
      "Multi-line insurance agents",
    ],
    notIdealFor: [
      "Budget buyers",
      "Those wanting exclusive leads",
      "Aged lead buyers",
      "Solo agents with limited call capacity",
    ],
    ratingTransparency: 5,
    ratingValue: 5,
    ratingCompliance: 8,
    ratingFlexibility: 5,
    ratingPlatform: 7,
    ratingReputation: 8,
    ratingNotes:
      "Backed by LendingTree, so strong brand and compliance infrastructure. Leads are shared among multiple agents (typically 3-5), which means speed-to-contact is critical. Higher CPL than aged leads. Good for agents with dialing capacity and budget.",
    lastVerified: "2026-04-28",
    verticals: [
      "auto-insurance",
      "life-insurance",
      "health-insurance",
      "medicare",
    ],
    leadTypes: ["real-time"],
    pricingModel: "sales-required",
    hasMinimums: true,
    minimumDescription: "Monthly spend minimums — varies by market",
    contractRequired: true,
    returnPolicy: "Credits for leads outside your filters",
    deliveryMethods: ["real-time-post", "email", "crm-push"],
    complianceFeatures: [
      "tcpa-docs",
      "trustedform",
      "jornaya",
      "dnc-scrubbing",
      "consent-verification",
    ],
    isFeatured: false,
    editorialReview:
      "QuoteWizard, owned by LendingTree, is one of the largest insurance lead marketplaces in the U.S. The LendingTree backing means strong compliance infrastructure — TrustedForm, Jornaya, and robust consent documentation. The trade-off is that leads are shared among 3-5 agents, making speed-to-contact critical. Pricing requires a sales conversation and typically involves monthly minimums and contracts. This is a real-time lead provider, not aged — expect higher CPLs but fresher intent. Best for established agencies with the budget and call capacity to compete on speed. Not suitable for budget-conscious agents or those wanting aged leads.",
  },
  {
    name: "SmartFinancial",
    slug: "smartfinancial",
    shortDescription:
      "Insurance lead marketplace using AI matching to connect agents with real-time auto, home, health, and life leads.",
    website: "https://smartfinancial.com",
    foundedYear: 2015,
    bbbRating: "A",
    headquartersState: "OH",
    bestFor: [
      "Tech-forward insurance agents",
      "Agencies wanting AI-matched leads",
      "Multi-line insurance producers",
    ],
    notIdealFor: [
      "Aged lead buyers",
      "Non-insurance verticals",
      "Low-budget agents",
      "Agents without a dialer",
    ],
    ratingTransparency: 5,
    ratingValue: 6,
    ratingCompliance: 8,
    ratingFlexibility: 5,
    ratingPlatform: 8,
    ratingReputation: 7,
    ratingNotes:
      "Modern platform with AI lead matching. Good technology and compliance. Pricing is sales-driven. Leads are shared. Best for agents with the tech setup to capitalize on real-time delivery.",
    lastVerified: "2026-04-28",
    verticals: [
      "auto-insurance",
      "life-insurance",
      "health-insurance",
      "medicare",
    ],
    leadTypes: ["real-time", "live-transfer"],
    pricingModel: "sales-required",
    hasMinimums: true,
    minimumDescription: "Monthly minimums — contact sales",
    contractRequired: true,
    returnPolicy: "Credits for leads not matching filters",
    deliveryMethods: ["real-time-post", "crm-push", "api"],
    complianceFeatures: [
      "tcpa-docs",
      "trustedform",
      "dnc-scrubbing",
      "consent-verification",
    ],
    isFeatured: false,
    editorialReview:
      "SmartFinancial brings modern technology to insurance lead distribution, using AI matching to connect agents with consumers based on fit and likelihood of conversion. The platform is polished and integrates well with common insurance CRMs. Like most real-time lead providers, pricing requires a sales conversation and involves minimums and contracts. Leads are shared, so speed matters. The AI matching is a differentiator — in theory, you get leads better matched to your products and geography. Best for tech-forward agents and agencies with the infrastructure to handle real-time leads. Not for aged lead buyers or budget-constrained agents.",
  },
];

export const PROVIDERS: ProviderData[] = rawProviders.map((p) => ({
  ...p,
  overallRating: computeOverall(p),
}));

// Build-time drift check: PARTNER_HOSTS (the slim client-bundle mirror used by
// lib/outbound-classify.ts) must list every provider here. The check runs at
// module load on the server, so any production build that loads providers.ts
// (sitemap, providers/[slug], etc.) will fail the build if the mirrors drift.
if (typeof window === "undefined") {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { PARTNER_HOSTS } = require("./partner-hosts") as {
    PARTNER_HOSTS: { slug: string; hostname: string }[];
  };
  const partnerSlugs = new Set(PARTNER_HOSTS.map((p) => p.slug));
  const missing = PROVIDERS.filter((p) => !partnerSlugs.has(p.slug)).map((p) => p.slug);
  if (missing.length > 0) {
    throw new Error(
      `data/partner-hosts.ts is missing entries for: ${missing.join(", ")}. ` +
        `Update partner-hosts.ts to mirror providers.ts.`
    );
  }
}

/** Lookup a provider by slug */
export function getProvider(slug: string): ProviderData | undefined {
  return PROVIDERS.find((p) => p.slug === slug);
}

/** Get providers filtered by vertical slug */
export function getProvidersByVertical(verticalSlug: string): ProviderData[] {
  return PROVIDERS.filter((p) => p.verticals.includes(verticalSlug)).sort(
    (a, b) => b.overallRating - a.overallRating
  );
}

/** Get all unique pairs of provider slugs (alphabetically ordered) for comparison pages */
export function getProviderPairs(): [string, string][] {
  const slugs = PROVIDERS.map((p) => p.slug).sort();
  const pairs: [string, string][] = [];
  for (let i = 0; i < slugs.length; i++) {
    for (let j = i + 1; j < slugs.length; j++) {
      pairs.push([slugs[i], slugs[j]]);
    }
  }
  return pairs;
}
