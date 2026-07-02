import Anthropic from "@anthropic-ai/sdk";

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY || "",
});

export interface ScrapedProviderData {
  providerSlug: string;
  providerName: string;
  websiteUrl: string;
  scrapedContent: string;
  scrapedAt: string;
}

export interface ExtractedProviderUpdate {
  providerSlug: string;
  providerName: string;
  pricingChanges: string[];
  policyChanges: string[];
  newVerticals: string[];
  newLeadTypes: string[];
  notableChanges: string[];
  rawPricingData: {
    vertical: string;
    leadType: string;
    ageBracket: string;
    priceRange: string;
  }[];
}

export interface BenchmarkEstimate {
  vertical: string;
  leadAgeBracket: string;
  exclusivity: string;
  leadType: string;
  priceLow: number;
  priceMedian: number;
  priceHigh: number;
  providersSampled: number;
  confidence: "high" | "medium" | "low";
  notes: string;
}

/**
 * Scrape a provider website using Firecrawl or fallback to fetch.
 * In production this would use the Firecrawl MCP; for now, we do a basic fetch.
 */
export async function scrapeProviderWebsite(
  url: string
): Promise<string> {
  try {
    const response = await fetch(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (compatible; AgedLeadSales/1.0; +https://agedleadsales.com)",
      },
      signal: AbortSignal.timeout(15000),
    });

    if (!response.ok) {
      return `[Failed to fetch: HTTP ${response.status}]`;
    }

    const html = await response.text();
    // Strip HTML tags for a rough text extraction
    const text = html
      .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, "")
      .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, "")
      .replace(/<[^>]+>/g, " ")
      .replace(/\s+/g, " ")
      .trim()
      .slice(0, 15000); // Limit to ~15k chars for API context

    return text;
  } catch (err) {
    return `[Scrape error: ${err instanceof Error ? err.message : String(err)}]`;
  }
}

/**
 * Use Claude to extract structured provider data from scraped content.
 */
export async function extractProviderData(
  providerSlug: string,
  providerName: string,
  scrapedContent: string,
  existingProfile: {
    pricingModel: string;
    leadTypes: string[];
    verticals: string[];
    returnPolicy: string;
  }
): Promise<ExtractedProviderUpdate> {
  if (!process.env.ANTHROPIC_API_KEY) {
    return {
      providerSlug,
      providerName,
      pricingChanges: [],
      policyChanges: [],
      newVerticals: [],
      newLeadTypes: [],
      notableChanges: ["Skipped: ANTHROPIC_API_KEY not configured"],
      rawPricingData: [],
    };
  }

  const message = await anthropic.messages.create({
    // claude-sonnet-4 retired 2026-06-15 (was 404ing every run). Thinking is
    // explicitly disabled so content[0] stays a text block for the parser
    // below and max_tokens isn't consumed by thinking output.
    model: "claude-sonnet-5",
    thinking: { type: "disabled" },
    max_tokens: 2000,
    messages: [
      {
        role: "user",
        content: `Analyze this scraped website content from the lead provider "${providerName}" and extract any pricing, policy, or product information.

Current profile data we have:
- Pricing model: ${existingProfile.pricingModel}
- Lead types: ${existingProfile.leadTypes.join(", ")}
- Verticals: ${existingProfile.verticals.join(", ")}
- Return policy: ${existingProfile.returnPolicy}

Scraped content:
${scrapedContent}

Respond with ONLY valid JSON in this exact format:
{
  "pricingChanges": ["list of any pricing changes or new pricing info found"],
  "policyChanges": ["list of any policy changes (returns, minimums, contracts)"],
  "newVerticals": ["any new verticals/industries mentioned not in current profile"],
  "newLeadTypes": ["any new lead types mentioned not in current profile"],
  "notableChanges": ["any other notable changes or information"],
  "rawPricingData": [
    {
      "vertical": "e.g. mortgage",
      "leadType": "e.g. aged, real-time, live-transfer",
      "ageBracket": "e.g. 31-85-days",
      "priceRange": "e.g. $0.50-$2.00"
    }
  ]
}

If no relevant information is found, return empty arrays. Do NOT fabricate data.`,
      },
    ],
  });

  try {
    const content = message.content[0];
    if (content.type !== "text") throw new Error("Unexpected response type");

    // Extract JSON from response (handle possible markdown wrapping)
    const jsonStr = content.text
      .replace(/^```json?\s*/i, "")
      .replace(/\s*```$/i, "")
      .trim();

    const parsed = JSON.parse(jsonStr);

    return {
      providerSlug,
      providerName,
      pricingChanges: parsed.pricingChanges || [],
      policyChanges: parsed.policyChanges || [],
      newVerticals: parsed.newVerticals || [],
      newLeadTypes: parsed.newLeadTypes || [],
      notableChanges: parsed.notableChanges || [],
      rawPricingData: parsed.rawPricingData || [],
    };
  } catch (err) {
    return {
      providerSlug,
      providerName,
      pricingChanges: [],
      policyChanges: [],
      newVerticals: [],
      newLeadTypes: [],
      notableChanges: [
        `Parse error: ${err instanceof Error ? err.message : String(err)}`,
      ],
      rawPricingData: [],
    };
  }
}

/**
 * Use Claude to generate updated benchmark estimates from aggregated scraped data.
 */
export async function generateBenchmarkEstimates(
  allProviderUpdates: ExtractedProviderUpdate[],
  existingBenchmarks: BenchmarkEstimate[]
): Promise<BenchmarkEstimate[]> {
  if (!process.env.ANTHROPIC_API_KEY) {
    console.warn("ANTHROPIC_API_KEY not set — skipping benchmark generation");
    return [];
  }

  // Collect all raw pricing data across providers
  const allPricingData = allProviderUpdates.flatMap((u) =>
    u.rawPricingData.map((d) => ({
      provider: u.providerName,
      ...d,
    }))
  );

  if (allPricingData.length === 0) {
    console.log("No new pricing data collected — keeping existing benchmarks");
    return [];
  }

  const message = await anthropic.messages.create({
    // Same retired-model swap + explicit no-thinking as extractProviderData.
    model: "claude-sonnet-5",
    thinking: { type: "disabled" },
    max_tokens: 4000,
    messages: [
      {
        role: "user",
        content: `You are a lead pricing analyst. Based on the following scraped pricing data from multiple lead providers, generate updated fair market price benchmarks.

New pricing data collected this month:
${JSON.stringify(allPricingData, null, 2)}

Existing benchmarks for reference:
${JSON.stringify(
  existingBenchmarks.map((b) => ({
    vertical: b.vertical,
    ageBracket: b.leadAgeBracket,
    exclusivity: b.exclusivity,
    leadType: b.leadType,
    low: b.priceLow,
    median: b.priceMedian,
    high: b.priceHigh,
  })),
  null,
  2
)}

Generate updated benchmark estimates. For each data point, provide:
- vertical: slug (e.g. "mortgage", "auto-insurance")
- leadAgeBracket: "real-time", "1-7-days", "8-30-days", "31-85-days", "86-180-days", "181-365-days"
- exclusivity: "exclusive", "semi-exclusive", "shared"
- leadType: "internet-form", "live-transfer", "trigger-credit", "direct-mail", "data-list"
- priceLow, priceMedian, priceHigh (numbers in dollars)
- providersSampled (count of data points)
- confidence: "high", "medium", or "low"
- notes: brief explanation

Only generate benchmarks where you have actual data. Do NOT fabricate data points.
Respond with ONLY a valid JSON array of benchmark objects.`,
      },
    ],
  });

  try {
    const content = message.content[0];
    if (content.type !== "text") return [];

    const jsonStr = content.text
      .replace(/^```json?\s*/i, "")
      .replace(/\s*```$/i, "")
      .trim();

    const parsed = JSON.parse(jsonStr);
    if (!Array.isArray(parsed)) return [];

    return parsed as BenchmarkEstimate[];
  } catch (err) {
    console.error("Failed to parse benchmark estimates:", err);
    return [];
  }
}

/**
 * Build the monthly marketwatch report.
 */
export function buildMarketwatchReport(
  providerUpdates: ExtractedProviderUpdate[],
  newBenchmarks: BenchmarkEstimate[],
  staleProviders: string[],
  errors: string[]
): {
  runDate: string;
  month: string;
  providersScanned: number;
  providersWithChanges: number;
  newBenchmarksGenerated: number;
  staleProviders: string[];
  providerUpdates: ExtractedProviderUpdate[];
  errors: string[];
} {
  const now = new Date();
  return {
    runDate: now.toISOString(),
    month: `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`,
    providersScanned: providerUpdates.length,
    providersWithChanges: providerUpdates.filter(
      (u) =>
        u.pricingChanges.length > 0 ||
        u.policyChanges.length > 0 ||
        u.newVerticals.length > 0 ||
        u.newLeadTypes.length > 0
    ).length,
    newBenchmarksGenerated: newBenchmarks.length,
    staleProviders,
    providerUpdates,
    errors,
  };
}
