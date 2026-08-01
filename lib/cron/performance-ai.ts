import Anthropic from "@anthropic-ai/sdk";
import type { GA4Report } from "./ga4-data";
import type { GSCReport } from "./gsc-data";
import { parseJsonResponse } from "./parse-json";
import {
  fetchContentInventory,
  renderContentInventory,
} from "./content-inventory";
import { SONNET_MODEL } from "./model-config";
import { SITE_HOST } from "@/lib/site-url";

function getAnthropicClient(): Anthropic {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    throw new Error("ANTHROPIC_API_KEY environment variable is not set");
  }
  return new Anthropic({ apiKey });
}

export interface PerformanceInsight {
  category: string;
  trend: "improving" | "declining" | "stable" | "new";
  title: string;
  detail: string;
  metric7d: string;
  metric90d: string;
  change: string;
}

export interface PerformanceAnalysis {
  overallAssessment: string;
  insights: PerformanceInsight[];
  recommendations: {
    priority: "high" | "medium" | "low";
    title: string;
    description: string;
    expectedImpact: string;
    topicKey: string;
  }[];
  contentPerformance: string;
  seoPerformance: string;
  trafficAnalysis: string;
  nextSteps: string[];
}

function pct(n: number): string {
  return (n * 100).toFixed(2) + "%";
}

function num(n: number): string {
  return n.toLocaleString("en-US", { maximumFractionDigits: 1 });
}

function changeStr(sevenDay: number, ninetyDay: number): string {
  if (ninetyDay === 0) return sevenDay > 0 ? "+∞" : "N/A";
  const change = ((sevenDay - ninetyDay) / ninetyDay) * 100;
  const sign = change >= 0 ? "+" : "";
  return `${sign}${change.toFixed(1)}%`;
}

export async function analyzePerformance(
  ga4: GA4Report,
  gsc: GSCReport
): Promise<PerformanceAnalysis> {
  const client = getAnthropicClient();

  const contentInventory = await fetchContentInventory();

  let dataContext = "## Performance Data (7-Day Rolling Average vs 90-Day Average)\n\n";

  if (ga4.available) {
    const s = ga4.sevenDay.dailyAverage;
    const n = ga4.ninetyDay.dailyAverage;
    dataContext += `### Google Analytics 4 — Daily Averages
| Metric | 7-Day Avg | 90-Day Avg | Change |
|--------|-----------|------------|--------|
| Sessions | ${num(s.sessions)} | ${num(n.sessions)} | ${changeStr(s.sessions, n.sessions)} |
| Active Users | ${num(s.activeUsers)} | ${num(n.activeUsers)} | ${changeStr(s.activeUsers, n.activeUsers)} |
| New Users | ${num(s.newUsers)} | ${num(n.newUsers)} | ${changeStr(s.newUsers, n.newUsers)} |
| Page Views | ${num(s.screenPageViews)} | ${num(n.screenPageViews)} | ${changeStr(s.screenPageViews, n.screenPageViews)} |
| Avg Session Duration | ${num(s.averageSessionDuration)}s | ${num(n.averageSessionDuration)}s | ${changeStr(s.averageSessionDuration, n.averageSessionDuration)} |
| Bounce Rate | ${pct(s.bounceRate)} | ${pct(n.bounceRate)} | ${changeStr(s.bounceRate, n.bounceRate)} |
| Engagement Rate | ${pct(s.engagementRate)} | ${pct(n.engagementRate)} | ${changeStr(s.engagementRate, n.engagementRate)} |

**Top Pages (Last 7 Days):**
${ga4.sevenDay.topPages.map((p) => `- ${p.path}: ${num(p.views)} views, ${num(p.users)} users`).join("\n")}

**Top Traffic Sources (Last 7 Days):**
${ga4.sevenDay.topSources.map((s) => `- ${s.source} / ${s.medium}: ${num(s.sessions)} sessions`).join("\n")}
`;
  } else {
    dataContext += `### Google Analytics 4\nNot available: ${ga4.error || "Not configured"}\n\n`;
  }

  if (gsc.available) {
    const s = gsc.sevenDay.dailyAverage;
    const n = gsc.ninetyDay.dailyAverage;
    dataContext += `### Google Search Console — Daily Averages
| Metric | 7-Day Avg | 90-Day Avg | Change |
|--------|-----------|------------|--------|
| Clicks | ${num(s.clicks)} | ${num(n.clicks)} | ${changeStr(s.clicks, n.clicks)} |
| Impressions | ${num(s.impressions)} | ${num(n.impressions)} | ${changeStr(s.impressions, n.impressions)} |
| CTR | ${pct(s.ctr)} | ${pct(n.ctr)} | ${changeStr(s.ctr, n.ctr)} |
| Avg Position | ${num(s.position)} | ${num(n.position)} | ${changeStr(n.position, s.position)} |

**Top Search Queries (Last 7 Days):**
${gsc.sevenDay.topQueries.map((q) => `- "${q.query}": ${q.clicks} clicks, ${q.impressions} impressions, pos ${q.position.toFixed(1)}`).join("\n")}

**Top Pages by Search Clicks (Last 7 Days):**
${gsc.sevenDay.topPages.map((p) => `- ${p.page}: ${p.clicks} clicks, pos ${p.position.toFixed(1)}`).join("\n")}

**Device Breakdown (Last 7 Days):**
${gsc.sevenDay.devices.map((d) => `- ${d.device}: ${d.clicks} clicks, ${d.impressions} impressions`).join("\n")}

**Top Search Queries (90-Day — for comparison):**
${gsc.ninetyDay.topQueries.slice(0, 10).map((q) => `- "${q.query}": ${q.clicks} clicks, pos ${q.position.toFixed(1)}`).join("\n")}
`;
  } else {
    dataContext += `### Google Search Console\nNot available: ${gsc.error || "Not configured"}\n\n`;
  }

  dataContext += `\n## Site Content Inventory\n\n${renderContentInventory(
    contentInventory
  )}\n`;

  const response = await client.messages.create({
    model: SONNET_MODEL,
    max_tokens: 4096,
    system: `You are a senior digital marketing analyst reviewing the daily performance of Work Aged Leads (${SITE_HOST}), an SEO-driven affiliate content site targeting insurance agents, mortgage brokers, financial advisors, PI attorneys, and solar reps. The site promotes AgedLeadStore.com via affiliate links.

Analyze the 7-day rolling average vs 90-day average performance data and provide actionable insights. Focus on:
- Traffic trends and anomalies
- Content performance (which pages/topics are growing or declining)
- Search visibility and ranking changes
- User engagement quality
- Conversion-oriented recommendations
- Specific, data-backed suggestions (not generic advice)

CRITICAL RECOMMENDATION RULES — these override the instinct to recommend new content:

1. OPTIMIZE, DON'T CREATE. A "Site Content Inventory" of every published URL is
   provided in the data. Before recommending any new page, scan that inventory.
   If a query underperforms (low clicks, stuck on page 2, position 8-30) and a
   relevant page ALREADY EXISTS in the inventory, the problem is a ranking/CTR
   ceiling on that page — NOT a missing page. Recommend optimizing or
   consolidating the SPECIFIC existing URL (name it), never "create a page."
   Only recommend net-new content when NO inventory URL covers the topic.

2. FLAG CANNIBALIZATION. If two or more inventory URLs target the same query or
   cluster (e.g. a /blog review, a /blog comparison, and a /providers page all
   about the same brand), a query stuck on page 2 is likely keyword
   cannibalization. Recommend picking ONE canonical URL and consolidating
   internal links + intent to it — do not recommend adding another page, which
   makes cannibalization worse.

3. AFFILIATE ALIGNMENT — AgedLeadStore.com is THIS SITE'S PAID AFFILIATE
   PARTNER, not a competitor. For AgedLeadStore-branded queries ("aged lead
   store", "aged lead store reviews", "is aged lead store legit", etc.) the
   goal is to capture that branded research traffic and forward it through
   affiliate links. Recommend "affirm-and-forward" optimization of the existing
   review/provider page. NEVER recommend competitor-comparison, "position
   against", or review-rebuttal framing aimed at AgedLeadStore — that would
   divert revenue away from the partner the site monetizes through.

4. STABLE topicKey PER RECOMMENDATION. Every recommendation must carry a
   "topicKey": a short, stable kebab-case slug naming the UNDERLYING issue, not
   today's phrasing. CRITICAL: reuse the EXACT same topicKey on every run for
   the same underlying issue so it is tracked as a recurring item, not
   duplicated. The slug must contain NO numbers, positions, dates, or volatile
   words — it identifies the problem, not its current state. Recurring issues
   on this site and their canonical keys:
     - agedleadstore-branded-ctr   (capturing AgedLeadStore branded queries)
     - mortgage-leads-cannibalization
     - iul-leads-cannibalization
     - insurance-leads-cannibalization
     - calculator-page-ctr
     - mobile-search-experience
     - high-impression-low-click-pages
   Invent a new kebab-case key only for a genuinely new issue not in this list.`,
    messages: [
      {
        role: "user",
        content: `Analyze today's performance data and provide a comprehensive assessment with recommendations.

${dataContext}

Respond with valid JSON:
{
  "overallAssessment": "2-3 paragraph executive summary of current performance, trends, and key takeaways",
  "insights": [
    {
      "category": "Traffic|Search|Engagement|Content|Conversion",
      "trend": "improving|declining|stable|new",
      "title": "Short insight title",
      "detail": "1-2 sentence explanation",
      "metric7d": "7-day value",
      "metric90d": "90-day value",
      "change": "+X% or -X%"
    }
  ],
  "recommendations": [
    {
      "priority": "high|medium|low",
      "title": "Recommendation title",
      "description": "Specific, actionable recommendation with implementation steps",
      "expectedImpact": "What improvement to expect",
      "topicKey": "stable-kebab-case-issue-slug (reuse across runs; no numbers/dates)"
    }
  ],
  "contentPerformance": "2-3 paragraph analysis of content performance — which pages are performing well, which need attention",
  "seoPerformance": "2-3 paragraph analysis of search performance — ranking trends, query opportunities, CTR optimization",
  "trafficAnalysis": "2-3 paragraph analysis of traffic sources and user behavior patterns",
  "nextSteps": ["Specific action item 1", "Specific action item 2", ...]
}

Include 5-8 insights and 4-6 recommendations. Be specific with numbers.

Respond ONLY with valid JSON, no other text.`,
      },
    ],
    temperature: 0.4,
  });

  const content = response.content[0]?.type === "text" ? response.content[0].text : null;
  if (!content) throw new Error("No response from AI for performance analysis");

  return parseJsonResponse<PerformanceAnalysis>(content);
}
