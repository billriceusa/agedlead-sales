import Anthropic from "@anthropic-ai/sdk";
import type { NewsletterPlan } from "@/data/newsletter-calendar";

function getAnthropicClient(): Anthropic {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    throw new Error("ANTHROPIC_API_KEY environment variable is not set");
  }
  return new Anthropic({ apiKey });
}

export interface RecentPost {
  title: string;
  slug: string;
  excerpt: string;
  publishedAt: string;
  pillar?: string;
}

export interface NewsletterContent {
  subject: string;
  previewText: string;
  personalIntro: string;
  featuredArticle: {
    title: string;
    slug: string;
    spotlight: string;
  };
  quickTips: {
    title: string;
    body: string;
  }[];
  industryInsight: {
    headline: string;
    body: string;
  };
  weeklyDigest: {
    title: string;
    slug: string;
    oneLiner: string;
  }[];
  closingNote: string;
  ctaText: string;
  ctaUrl: string;
}

const NEWSLETTER_SYSTEM = `You are writing the Aged Lead Sales weekly newsletter on behalf of Bill Rice, a 25+ year veteran of the aged lead industry. Write with authority, warmth, and specificity.

Newsletter Context:
- Audience: insurance agents, mortgage brokers, financial advisors, PI attorneys, solar reps, and other sales professionals who buy and work aged consumer leads
- Goal: deliver weekly value that keeps readers engaged, drives traffic to agedleadsales.com blog content, and positions AgedLeadStore.com as the go-to lead source
- Tone: direct, practical, conversational — never salesy or generic
- Every tip should be actionable with specific frameworks, scripts, or publicly verifiable data points

CRITICAL RULES — DO NOT VIOLATE:
- NEVER fabricate specific experiences (e.g., "I was reviewing call recordings with an agent last week"). You do not know what Bill did this week.
- NEVER invent statistics or data and present them as factual (e.g., "conversion rates up 15-20% vs Q4"). If you cite data, it must be from a real, citable source.
- Illustrative examples and scenarios ARE allowed, but must be clearly framed as hypothetical (e.g., "Say you're an agent who just bought 200 leads..." or "Here's a common scenario...")
- For the Industry Insight section, reference real industry trends, published reports, or regulatory changes — not invented observations. If you cannot cite a source, frame the insight as a general principle or strategic observation rather than a data claim.
- General knowledge from Bill's documented background (25+ years, Quicken Loans, coined "lead management", worked millions of leads) can be referenced. Specific invented anecdotes cannot.`;

export async function generateNewsletterContent(
  plan: NewsletterPlan | null,
  recentPosts: RecentPost[],
  siteUrl: string,
  weekLabel: string
): Promise<NewsletterContent> {
  const client = getAnthropicClient();

  const postsContext = recentPosts
    .map(
      (p) =>
        `- "${p.title}" (${p.publishedAt}) — ${p.excerpt} [slug: ${p.slug}]`
    )
    .join("\n");

  const planContext = plan
    ? `
## Newsletter Calendar Plan for This Week
- Theme: ${plan.theme}
- Focus Vertical: ${plan.focusVertical}
- Planned Exclusive Tip Topics: ${plan.exclusiveTipTopics.join("; ")}
${plan.specialHook ? `- Special Hook: ${plan.specialHook}` : ""}

Follow this plan as a guide, but feel free to adjust if the blog content this week suggests a stronger angle.`
    : `
## No Pre-Planned Newsletter for This Week
Research what's most relevant for our audience right now and create a compelling theme. Consider seasonal factors, industry trends, or timely topics.`;

  const prompt = `Write the content for this week's Aged Lead Sales newsletter.

${planContext}

## This Week's Blog Posts (to feature and digest)
${postsContext || "No blog posts published this week yet — focus on exclusive content and evergreen tips."}

## Site URL
${siteUrl}

## Week Of
${weekLabel}

## Requirements
1. Subject line: compelling, specific, under 60 characters — avoid spam triggers
2. Preview text: the snippet shown in inbox previews, under 90 characters
3. Personal intro: 2-3 short paragraphs from Bill, referencing the theme and setting up the newsletter. Be specific about what happened this week or what readers should focus on.
4. Featured article: pick the BEST blog post from this week's content. Write a 2-3 sentence spotlight that makes readers want to click.
5. Quick tips: 3 exclusive, actionable tips NOT published on the blog. Each should be self-contained and immediately useful. Include specific numbers, scripts, or frameworks.
6. Industry insight: a timely data point, trend, or observation about the aged lead market
7. Weekly digest: one-line summaries for each blog post published this week
8. Closing note: 1-2 sentence personal sign-off
9. CTA: text for the main call-to-action button (drives to AgedLeadStore.com)

Respond with ONLY valid JSON (no markdown fences, no commentary):
{
  "subject": "Subject line here",
  "previewText": "Preview text here",
  "personalIntro": "Multi-paragraph intro with line breaks as \\n\\n",
  "featuredArticle": {
    "title": "Post Title",
    "slug": "post-slug",
    "spotlight": "2-3 sentence spotlight text"
  },
  "quickTips": [
    { "title": "Short tip title", "body": "2-4 sentence actionable tip" },
    { "title": "...", "body": "..." },
    { "title": "...", "body": "..." }
  ],
  "industryInsight": {
    "headline": "Short headline",
    "body": "2-3 sentence insight with a specific data point or trend"
  },
  "weeklyDigest": [
    { "title": "Post Title", "slug": "post-slug", "oneLiner": "Brief summary" }
  ],
  "closingNote": "Personal sign-off",
  "ctaText": "Button text",
  "ctaUrl": "https://agedleadstore.com/all-lead-types/?utm_source=agedleadsales&utm_medium=email&utm_campaign=weekly-newsletter&utm_content=${weekLabel}"
}`;

  const response = await client.messages.create({
    model: "claude-sonnet-4-20250514",
    max_tokens: 4096,
    system: NEWSLETTER_SYSTEM,
    messages: [{ role: "user", content: prompt }],
  });

  const textBlock = response.content.find((b) => b.type === "text");
  if (!textBlock || textBlock.type !== "text") {
    throw new Error("No text response from AI for newsletter generation");
  }

  // Extract JSON — handle potential markdown fences
  let jsonStr = textBlock.text.trim();
  if (jsonStr.startsWith("```")) {
    jsonStr = jsonStr.replace(/^```(?:json)?\n?/, "").replace(/\n?```$/, "");
  }

  return JSON.parse(jsonStr) as NewsletterContent;
}
