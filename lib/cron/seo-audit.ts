import OpenAI from "openai";
import type {
  GoogleUpdateSummary,
  AuditFinding,
  SEOBacklog,
  BacklogItem,
} from "./types";

function getOpenAIClient(): OpenAI {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error("OPENAI_API_KEY environment variable is not set");
  }
  return new OpenAI({ apiKey });
}

export interface SiteSnapshot {
  totalPosts: number;
  totalGlossaryTerms: number;
  totalLeadTypes: number;
  totalPlaybooks: number;
  totalGuides: number;
  recentPostTitles: string[];
  postsMissingSeo: string[];
  postsMissingImages: string[];
  postsWithShortExcerpts: string[];
  affiliateLinkPattern: string;
  jsonLdTypes: string[];
  robotsConfig: string;
  sitemapEntryCount: number;
  hasCanonicalUrls: boolean;
  hasOpenGraph: boolean;
  hasTwitterCards: boolean;
  authorSetup: string;
  contentPillars: string[];
}

const AUDIT_SYSTEM = `You are a senior technical SEO auditor and Google algorithm specialist. You have deep expertise in:
- Google Search algorithm updates (Core Updates, Helpful Content Updates, Spam Updates, Link Spam Updates)
- Google Search Quality Evaluator Guidelines (E-E-A-T, YMYL, Beneficial Purpose)
- Technical SEO (Core Web Vitals, crawlability, indexing, structured data, canonical URLs)
- Content quality signals (author authority, original research, depth, freshness)
- Affiliate site best practices (FTC compliance, Google's affiliate content guidelines)
- Schema.org structured data validation
- Next.js and Vercel SEO best practices

You are auditing an affiliate content site called Aged Lead Sales (agedleadsales.com) that:
- Promotes AgedLeadStore.com via affiliate links
- Targets insurance agents, mortgage brokers, financial advisors, PI attorneys, and solar reps
- Is built on Next.js 16 + Sanity.io + Vercel
- Uses JSON-LD structured data (WebSite, Organization, Person, Article, BreadcrumbList, FAQPage, DefinedTerm, WebApplication)
- Has named author (Bill Rice) with verifiable credentials and Person schema
- Uses rel="nofollow sponsored noopener noreferrer" on affiliate links
- Has site-wide affiliate disclosure

Your job is to:
1. Research and summarize the latest Google Search algorithm updates and guideline changes
2. Audit the site against current best practices and identify any compliance gaps
3. Generate actionable, prioritized recommendations`;

export async function researchGoogleUpdates(): Promise<GoogleUpdateSummary[]> {
  const client = getOpenAIClient();

  const response = await client.chat.completions.create({
    model: "gpt-4o",
    messages: [
      {
        role: "system",
        content: AUDIT_SYSTEM,
      },
      {
        role: "user",
        content: `Research and summarize the most recent and relevant Google Search updates that could affect an SEO-driven affiliate content site like ours. Include:

1. Any Core Updates from the last 6 months
2. Any Helpful Content system changes
3. Any Spam Updates or Link Spam Updates
4. Any Search Quality Evaluator Guidelines changes
5. Any changes to how Google handles AI-generated content
6. Any changes to affiliate site treatment
7. Any structured data or rich results changes
8. Any Core Web Vitals threshold changes

For each update, assess its specific relevance to an aged-leads affiliate content site with named author, original content, and proper affiliate disclosures.

Respond with valid JSON:
{
  "updates": [
    {
      "updateName": "Name of the update",
      "dateRange": "When it rolled out (e.g., 'January 2026' or 'December 2025 - January 2026')",
      "impactSummary": "2-3 sentence summary of what changed",
      "relevanceToUs": "2-3 sentence assessment of how this specifically affects agedleadsales.com",
      "actionRequired": true/false
    }
  ]
}

Include 4-8 updates, prioritized by relevance to our site.`,
      },
    ],
    temperature: 0.3,
    response_format: { type: "json_object" },
  });

  const content = response.choices[0]?.message?.content;
  if (!content) throw new Error("No response from AI for Google updates research");

  const parsed = JSON.parse(content) as { updates: GoogleUpdateSummary[] };
  return parsed.updates;
}

export async function auditSite(
  snapshot: SiteSnapshot,
  googleUpdates: GoogleUpdateSummary[],
  existingBacklog: SEOBacklog | null
): Promise<{
  findings: AuditFinding[];
  overallScore: number;
  strategyRecommendations: string[];
  contentStrategyUpdates: string[];
  summary: string;
}> {
  const client = getOpenAIClient();

  const existingBacklogContext = existingBacklog
    ? `\n## Existing Backlog (${existingBacklog.items.filter((i) => i.status === "open").length} open items)
${existingBacklog.items
  .filter((i) => i.status === "open")
  .slice(0, 20)
  .map((i) => `- [${i.severity}] ${i.title} (${i.category})`)
  .join("\n")}`
    : "\n## Existing Backlog\nNo existing backlog — this is the first audit.";

  const updatesContext = googleUpdates
    .map(
      (u) =>
        `- ${u.updateName} (${u.dateRange}): ${u.impactSummary} Relevance: ${u.relevanceToUs}`
    )
    .join("\n");

  const response = await client.chat.completions.create({
    model: "gpt-4o",
    messages: [
      {
        role: "system",
        content: AUDIT_SYSTEM,
      },
      {
        role: "user",
        content: `Perform a comprehensive SEO audit of our site based on the current snapshot and recent Google updates.

## Site Snapshot
- Total blog posts: ${snapshot.totalPosts}
- Total glossary terms: ${snapshot.totalGlossaryTerms}
- Total lead type pages: ${snapshot.totalLeadTypes}
- Total playbooks: ${snapshot.totalPlaybooks}
- Total guides: ${snapshot.totalGuides}
- Recent post titles: ${snapshot.recentPostTitles.join("; ")}
- Posts missing SEO meta: ${snapshot.postsMissingSeo.length > 0 ? snapshot.postsMissingSeo.join(", ") : "None"}
- Posts missing images: ${snapshot.postsMissingImages.length > 0 ? snapshot.postsMissingImages.join(", ") : "None"}
- Posts with short excerpts: ${snapshot.postsWithShortExcerpts.length > 0 ? snapshot.postsWithShortExcerpts.join(", ") : "None"}
- Affiliate link pattern: ${snapshot.affiliateLinkPattern}
- JSON-LD types: ${snapshot.jsonLdTypes.join(", ")}
- robots.txt: ${snapshot.robotsConfig}
- Sitemap entries: ${snapshot.sitemapEntryCount}
- Has canonical URLs: ${snapshot.hasCanonicalUrls}
- Has Open Graph: ${snapshot.hasOpenGraph}
- Has Twitter cards: ${snapshot.hasTwitterCards}
- Author setup: ${snapshot.authorSetup}
- Content pillars: ${snapshot.contentPillars.join(", ")}

## Recent Google Updates
${updatesContext}
${existingBacklogContext}

## Audit Categories
For each category, evaluate our current state and identify any issues:

1. **Technical SEO** — robots.txt, sitemap, canonical URLs, crawlability, redirect chains, URL structure
2. **Content Quality** — E-E-A-T signals, content depth, freshness, duplicate content risks, thin content
3. **Structured Data** — JSON-LD completeness, schema validation, rich result eligibility
4. **E-E-A-T** — Author authority, expertise signals, trust signals, experience evidence
5. **Affiliate Compliance** — FTC disclosure, rel attributes, Google affiliate guidelines, value-add assessment
6. **Core Web Vitals** — Performance considerations for Next.js/Vercel, image optimization, JS bundle
7. **Indexing** — Crawl budget, noindex usage, orphan pages, internal linking depth
8. **Internal Linking** — Link structure, glossary cross-links, pillar-cluster architecture
9. **Mobile** — Responsive design, mobile-first indexing, tap targets, font sizes
10. **Security** — HTTPS, mixed content, CSP headers, dependency vulnerabilities

For existing backlog items that appear resolved based on the snapshot, note them for resolution.

Respond with valid JSON:
{
  "overallScore": 85,
  "findings": [
    {
      "id": "finding-001",
      "category": "technical-seo",
      "severity": "high",
      "title": "Short finding title",
      "description": "Detailed description of the issue",
      "currentState": "What we currently have/do",
      "recommendation": "Specific, actionable recommendation with implementation details",
      "effort": "small",
      "affectedPages": ["/path1", "/path2"]
    }
  ],
  "strategyRecommendations": [
    "High-level SEO strategy recommendation based on Google updates..."
  ],
  "contentStrategyUpdates": [
    "Content strategy adjustment based on algorithm changes..."
  ],
  "summary": "3-5 paragraph executive summary of audit results, key risks, and top priorities"
}

Include 8-15 findings across different categories. Prioritize actionable items. The overallScore should be 0-100 reflecting overall SEO health.`,
      },
    ],
    temperature: 0.4,
    response_format: { type: "json_object" },
  });

  const content = response.choices[0]?.message?.content;
  if (!content) throw new Error("No response from AI for site audit");

  return JSON.parse(content) as {
    findings: AuditFinding[];
    overallScore: number;
    strategyRecommendations: string[];
    contentStrategyUpdates: string[];
    summary: string;
  };
}

export function mergeBacklog(
  existingBacklog: SEOBacklog | null,
  newFindings: AuditFinding[],
  auditDate: string
): SEOBacklog {
  const existing = existingBacklog?.items || [];
  const now = new Date().toISOString();

  const existingByTitle = new Map(existing.map((i) => [i.title, i]));

  const updatedItems: BacklogItem[] = [];

  for (const finding of newFindings) {
    const existingItem = existingByTitle.get(finding.title);

    if (existingItem) {
      updatedItems.push({
        ...existingItem,
        updatedAt: now,
        severity: finding.severity,
        description: finding.description,
        recommendation: finding.recommendation,
        effort: finding.effort,
        affectedPages: finding.affectedPages,
        notes: `Re-identified in audit ${auditDate}`,
      });
      existingByTitle.delete(finding.title);
    } else {
      updatedItems.push({
        id: finding.id,
        createdAt: now,
        updatedAt: now,
        status: "open",
        priority: severityToPriority(finding.severity),
        category: finding.category,
        severity: finding.severity,
        title: finding.title,
        description: finding.description,
        recommendation: finding.recommendation,
        effort: finding.effort,
        affectedPages: finding.affectedPages,
        sourceAudit: auditDate,
      });
    }
  }

  for (const [, remaining] of existingByTitle) {
    if (remaining.status === "open") {
      updatedItems.push({
        ...remaining,
        updatedAt: now,
        status: "completed",
        notes: `Not found in audit ${auditDate} — appears resolved`,
      });
    } else {
      updatedItems.push(remaining);
    }
  }

  updatedItems.sort((a, b) => {
    const statusOrder = { open: 0, "in-progress": 1, completed: 2, dismissed: 3 };
    const statusDiff = statusOrder[a.status] - statusOrder[b.status];
    if (statusDiff !== 0) return statusDiff;
    return a.priority - b.priority;
  });

  return {
    lastUpdated: now,
    items: updatedItems,
  };
}

function severityToPriority(severity: AuditFinding["severity"]): number {
  const map = { critical: 1, high: 2, medium: 3, low: 4, info: 5 };
  return map[severity];
}
