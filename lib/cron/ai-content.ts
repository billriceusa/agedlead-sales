import Anthropic from "@anthropic-ai/sdk";
import type { ContentBrief } from "@/data/editorial-calendar";
import type {
  ContentPlan,
  WeeklyBrief,
  GeneratedArticle,
  ArticleSection,
} from "./types";
import { parseJsonResponse } from "./parse-json";
import { OPUS_MODEL } from "./model-config";

function getAnthropicClient(): Anthropic {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    throw new Error("ANTHROPIC_API_KEY environment variable is not set");
  }
  return new Anthropic({ apiKey });
}

const SYSTEM_CONTEXT = `You are the AI content strategist for Aged Lead Sales (agedleadsales.com), an SEO-driven affiliate site that educates sales professionals on how to buy and work aged leads effectively. The site promotes AgedLeadStore.com via affiliate links.

ICP (Ideal Customer Profile):
- Insurance agents (life, health, P&C, final expense, Medicare)
- Mortgage brokers and loan officers
- Financial advisors (IUL, retirement planning)
- Personal injury attorneys and legal intake teams
- Solar sales representatives
- Home improvement contractors
- Debt settlement and tax resolution firms

Competitors:
- AgedLeadStore.com — the lead vendor's own content (product-focused, not strategy-focused)
- HowToWorkLeads.com — general lead-working advice (broad, not vertical-specific)

Content Pillars:
1. VERTICAL PLAYBOOKS — Industry-specific deep dives
2. CHANNEL TACTICS — Specific outreach channel strategies
3. ROLE GUIDES — Content for specific job roles
4. METRICS & OPTIMIZATION — Data-driven performance content
5. COMPLIANCE — Regulatory deep dives by industry

Content Rules:
- Rotate pillars so no two consecutive posts use the same pillar
- Every post links to 2+ glossary terms, 1+ calculator, 1+ lead type page
- Every post has a unique angle NOT covered on AgedLeadStore.com or HowToWorkLeads.com
- All content is authored by Bill Rice with 20+ years of experience
- Posts are 2,000-3,500 words with practical, actionable advice
- Tone: authoritative but conversational

CRITICAL CONTENT INTEGRITY RULES — NEVER VIOLATE THESE:
- NEVER fabricate personal experiences, anecdotes, or case studies attributed to Bill Rice or any named person
- NEVER write "I did X", "I experienced X", "A client of mine...", "I've seen...", or "In my experience..." followed by invented specifics
- NEVER invent specific dollar amounts, penalties, percentages, or statistics and present them as factual
- You MAY use clearly hypothetical examples ("Let's say an insurance agent buys 200 leads...", "Consider a scenario where...")
- You MAY cite publicly available data WITH source URLs
- You MAY reference Bill's verifiable background: 25+ years, coined "lead management", worked millions of leads
- You MAY use general industry patterns: "Many agents find...", "A common pattern is..."
- When in doubt, frame as hypothetical rather than as personal experience
- Making up stories and presenting them as real experiences is LYING — it destroys credibility`;

export async function analyzeAndPlan(
  existingPosts: { slug: string; title: string }[],
  editorialCalendar: ContentBrief[],
  glossaryTermSlugs: string[],
  leadTypeSlugs: string[],
  weekDates: { monday: string; wednesday: string; friday: string }
): Promise<ContentPlan> {
  const existingSlugs = new Set(existingPosts.map((p) => p.slug));
  const unpublishedBriefs = editorialCalendar.filter(
    (b) => b.status !== "published" && !existingSlugs.has(b.slug)
  );

  const publishedSlugs = editorialCalendar
    .filter((b) => b.status === "published" || existingSlugs.has(b.slug))
    .map((b) => b.slug);

  const prompt = `Analyze the current state of our content strategy and create a plan for this week.

## Current Content State
- Published posts (${existingPosts.length} total). Recent titles: ${existingPosts.slice(-40).map((p) => `"${p.title}"`).join("; ")}
- Editorial calendar briefs not yet published (${unpublishedBriefs.length}): ${unpublishedBriefs.map((b) => `"${b.title}" [${b.pillar}]`).join("; ")}
- Available glossary terms for linking: ${glossaryTermSlugs.slice(0, 40).join(", ")}
- Available lead type pages for linking: ${leadTypeSlugs.join(", ")}
- Already published from calendar: ${publishedSlugs.join(", ")}

## CRITICAL: Avoid Duplicate Content
You MUST NOT propose any brief whose title substantially overlaps with an existing post above. "Substantial overlap" means covering the same primary topic, even with different wording. If your first instinct is a topic near a published one, pick a different angle, a sub-topic, or a narrower case study. Published posts listed above are OFF-LIMITS as topics.

## This Week's Publishing Dates
- Monday: ${weekDates.monday}
- Wednesday: ${weekDates.wednesday}
- Friday: ${weekDates.friday}

## Your Tasks
1. **SEO Strategy Review**: Assess current content gaps and strengths based on our published content vs the full editorial plan.
2. **Competitive Research**: Identify keyword opportunities, trending topics, or new angles in the aged lead space that we haven't covered. Think about what insurance agents, mortgage brokers, solar reps, and attorneys are searching for RIGHT NOW.
3. **Content Plan**: Select 3 content briefs for this week. Prefer existing unpublished briefs from the editorial calendar when they're timely and relevant. Create new briefs only if you identify a compelling opportunity that outranks existing options.

Respond with valid JSON matching this structure exactly:
{
  "analysis": {
    "strategyReview": "2-3 paragraph assessment of current content strategy strengths and gaps",
    "competitiveInsights": "2-3 paragraph competitive analysis with specific keyword and topic opportunities",
    "newOpportunities": ["opportunity 1", "opportunity 2", ...],
    "trendingTopics": ["topic 1", "topic 2", ...],
    "recommendedUpdates": ["update 1", "update 2", ...]
  },
  "briefs": [
    {
      "day": "Mon",
      "publishDate": "${weekDates.monday}",
      "slug": "slug-here",
      "title": "Title Here",
      "pillar": "Pillar Name",
      "primaryKeyword": "keyword",
      "secondaryKeywords": ["kw1", "kw2", "kw3"],
      "targetLeadTypes": ["lt-insurance", "lt-mortgage"],
      "wordCount": "2,500-3,000",
      "competitiveAngle": "What makes this unique vs competitors",
      "outline": ["Section 1 topic", "Section 2 topic", ...],
      "internalLinks": ["/glossary/term", "/calculators/calculator", "/lead-types/type"]
    },
    { "day": "Wed", ... },
    { "day": "Fri", ... }
  ],
  "calendarNotes": "Summary of calendar decisions and reasoning"
}`;

  const client = getAnthropicClient();
  const response = await client.messages.create({
    model: OPUS_MODEL,
    max_tokens: 4096,
    system: SYSTEM_CONTEXT,
    messages: [
      { role: "user", content: prompt + "\n\nRespond ONLY with valid JSON, no other text." },
    ],
    temperature: 0.7,
  });

  const content = response.content[0]?.type === "text" ? response.content[0].text : null;
  if (!content) throw new Error("No response from AI for content planning");

  return parseJsonResponse<ContentPlan>(content);
}

export async function writeArticle(
  brief: WeeklyBrief,
  glossaryTermSlugs: string[],
  leadTypeSlugs: string[]
): Promise<GeneratedArticle> {
  const prompt = `Write a complete blog post based on this content brief.

## Brief
- Title: ${brief.title}
- Primary Keyword: ${brief.primaryKeyword}
- Secondary Keywords: ${brief.secondaryKeywords.join(", ")}
- Pillar: ${brief.pillar}
- Target Word Count: ${brief.wordCount}
- Competitive Angle: ${brief.competitiveAngle}
- Outline: ${brief.outline.map((s, i) => `${i + 1}. ${s}`).join("\n")}
- Internal Links to Include: ${brief.internalLinks.join(", ")}

## Available Internal Links
- Glossary terms: ${glossaryTermSlugs.slice(0, 30).join(", ")}
- Lead type pages: ${leadTypeSlugs.join(", ")}
- Calculators: /calculators/roi-calculator, /calculators/lead-cost-calculator, /calculators/pipeline-calculator

## Writing Requirements
- Write as Bill Rice, 20+ year industry veteran
- 2,000-3,500 words of substantive, actionable content
- Use actionable frameworks, publicly verifiable data, and clearly hypothetical examples — never fabricate personal anecdotes or case studies
- Naturally incorporate the primary keyword 3-5 times and secondary keywords 1-2 times each
- Reference internal links naturally within the content (mention the topic, readers can find the link)
- Include practical templates, scripts, checklists, or frameworks the reader can use immediately
- Tone: authoritative, direct, conversational — like an experienced mentor
- Answer-first format: after every H2 heading, the FIRST paragraph MUST be a direct, concise 40-60 word answer to the section topic. Lead with the key fact or recommendation. This paragraph should work as a standalone answer for voice search and featured snippets. Follow it with supporting detail, examples, and frameworks

Respond with valid JSON matching this structure:
{
  "excerpt": "2-3 sentence compelling excerpt for the post listing (under 200 chars)",
  "seoTitle": "SEO title under 60 characters with primary keyword",
  "seoDescription": "Meta description under 160 characters with primary keyword",
  "contentType": "pillar" or "cluster",
  "sections": [
    { "text": "Opening paragraph text...", "style": "normal" },
    { "text": "Section Heading", "style": "h2" },
    { "text": "Subsection heading", "style": "h3" },
    { "text": "Body paragraph text...", "style": "normal" },
    ...
  ]
}

Write the FULL article with all sections. Each "sections" entry is one paragraph or heading. Use "h2" for main sections, "h3" for subsections, and "normal" for body paragraphs. Include at least 15-25 sections for a complete article.`;

  const client = getAnthropicClient();
  const response = await client.messages.create({
    model: OPUS_MODEL,
    max_tokens: 8192,
    system: `${SYSTEM_CONTEXT}\n\nYou are now writing as Bill Rice. Write with authority and specificity. Use clearly hypothetical examples, publicly sourced data with citations, and actionable frameworks. Never fabricate personal experiences or case studies. Every paragraph should teach something actionable.`,
    messages: [
      { role: "user", content: prompt + "\n\nRespond ONLY with valid JSON, no other text." },
    ],
    temperature: 0.8,
  });

  const content = response.content[0]?.type === "text" ? response.content[0].text : null;
  if (!content) throw new Error(`No response from AI for article: ${brief.title}`);

  const parsed = parseJsonResponse<{
    excerpt: string;
    seoTitle: string;
    seoDescription: string;
    contentType: "pillar" | "cluster";
    sections: ArticleSection[];
  }>(content);

  return {
    brief,
    ...parsed,
  };
}

export function sectionsToPortableText(
  sections: ArticleSection[]
): Record<string, unknown>[] {
  return sections.map((section) => ({
    _type: "block",
    _key: randomKey(),
    style: section.style,
    markDefs: [],
    children: [
      {
        _type: "span",
        _key: randomKey(),
        text: section.text,
        marks: [],
      },
    ],
  }));
}

function randomKey(): string {
  return Math.random().toString(36).slice(2, 10);
}
