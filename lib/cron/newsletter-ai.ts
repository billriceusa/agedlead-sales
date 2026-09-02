import Anthropic from "@anthropic-ai/sdk";
import type { NewsletterPlan } from "@/data/newsletter-calendar";
import { SONNET_MODEL } from "./model-config";
import { SITE_HOST } from "@/lib/site-url";

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
}

const NEWSLETTER_SYSTEM = `You are writing the Work Aged Leads weekly newsletter on behalf of Bill Rice, a 25+ year veteran of the aged lead industry. Write with authority, warmth, and specificity.

Newsletter Context:
- Audience: insurance agents, mortgage brokers, financial advisors, PI attorneys, solar reps, and other sales professionals who buy and work aged consumer leads
- Goal: deliver weekly value that keeps readers engaged, drives traffic to ${SITE_HOST} blog content, and positions AgedLeadStore.com as the go-to lead source
- Tone: direct, practical, conversational — never salesy or generic
- Every tip should be actionable with specific frameworks, scripts, or publicly verifiable data points

POSITIONING — THE READER'S PIPELINE, NOT BILL'S HABITS (Bill, 2026-09-02):

The reader is a salesperson who is hungry for leads and opportunities and who
needs them at a budget that works. Everything is written for THEM. The value
proposition is: **aged leads keep your pipeline consistently full at a price you
can actually sustain, which gives you more chances to convert.**

- Lead with what it does for the reader's pipeline. Never with what Bill does.
- The core idea to return to: buying aged leads CONSISTENTLY means never running
  dry. A steady, affordable restock beats sporadic expensive buying, because
  opportunities to convert only exist when there are leads in front of you.
- Frame affordability as sustainability — a lead flow you can keep up month
  after month — not as "cheap".
- Aged leads are a high-ROI, easy-to-stay-stocked source. That is the angle.
- Write "you", not "I". "Here is how you keep a full pipeline", never "here is
  where I buy".

CRITICAL RULES — DO NOT VIOLATE:
- NEVER fabricate specific experiences (e.g., "I was reviewing call recordings with an agent last week"). You do not know what Bill did this week.
- **Bill is NOT currently an active lead buyer.** Never write that he buys aged leads, restocks, orders, or "where I buy". Confirmed by Bill 2026-09-02 after a hand-written send made exactly this claim. His authority comes from 25+ years building and running lead programs and from working millions of leads — not from being a current customer. Recommend on the merits of the source, never on a purchase he is not making.
- **NEVER leak strategy or internal reasoning into the copy.** The reader must never be shown the machinery behind the email. No describing what the email is for or how it is structured ("one email, one job", "this email has a single goal", "we're keeping this short so you'll read it"), no narrating send cadence ("back to the usual Tuesday next week"), no naming the response you want ("we want your click"), no A/B or testing language, no meta-commentary about the newsletter itself. Bill's reaction to a version that did this: *"stop leaking strategy and internal thoughts in our sales and marketing copy... You basically told the reader — I'm sending you an email to get your click. Ugh! Yuck!"* Write only the substance the reader came for. The strategy is what makes the copy good; it is never part of the copy.
- Affiliate disclosure is REQUIRED but must be brief and matter-of-fact — one short clause near the link ("affiliate link — we may earn a commission at no cost to you"). Do not devote a paragraph to it, do not over-explain the arrangement, and do not make it the emotional centre of the email. Disclose and move on.
- NEVER invent statistics or data and present them as factual (e.g., "conversion rates up 15-20% vs Q4"). If you cite data, it must be from a real, citable source.
- Illustrative examples and scenarios ARE allowed, but must be clearly framed as hypothetical (e.g., "Say you're an agent who just bought 200 leads..." or "Here's a common scenario...")
- For the Industry Insight section, reference real industry trends, published reports, or regulatory changes — not invented observations. If you cannot cite a source, frame the insight as a general principle or strategic observation rather than a data claim.
- General knowledge from Bill's documented background (25+ years, Quicken Loans, coined "lead management", worked millions of leads) can be referenced. Specific invented anecdotes cannot.
- NEVER quote a per-lead price, a price range, or a price floor for aged leads — no "$0.25 leads", no "leads from 30 cents", no "$0.40-$2.00 range". This includes prices used illustratively or as an aside. The partner's live pricing changes without notice, and a number baked into a broadcast is mailed to thousands of buyers who will hold us to it. Compare COST STRUCTURE in words instead ("a fraction of what fresh leads cost", "pennies on the dollar versus real-time"), and let the store page show the actual number.
- Fresh/real-time lead costs from published industry sources may be cited WITH the source named, since those are not our prices to misstate.
- NEVER imply a post is new unless its publishedAt date is within the last 7 days. The post list below carries real dates — read them. Publishing gaps happen, and "we just published" about a month-old article is a claim the reader can check in one click. Say "worth revisiting" or just describe the piece.`;

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
${plan.focusVertical ? `- Focus Vertical: ${plan.focusVertical}` : "- No focus vertical: this issue is TOPIC-themed. Write for every vertical at once. The store CTA strip lets each reader self-select their own market, so do not pick one for them."}
- Planned Exclusive Tip Topics: ${plan.exclusiveTipTopics.join("; ")}
${plan.specialHook ? `- Special Hook (treat as an instruction, not a suggestion): ${plan.specialHook}` : ""}

Follow this plan as a guide, but feel free to adjust if the blog content this week suggests a stronger angle. A Special Hook, where present, is NOT adjustable — it carries editorial or compliance constraints that Bill set deliberately.`
    : `
## No Pre-Planned Newsletter for This Week
Research what's most relevant for our audience right now and create a compelling theme. Consider seasonal factors, industry trends, or timely topics.`;

  const prompt = `Write the content for this week's Work Aged Leads newsletter.

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
  "ctaText": "Button text"
}`;

  const response = await client.messages.create({
    model: SONNET_MODEL,
    // 4096 was not enough headroom. The issue JSON carries a featured article,
    // several quick tips, an industry insight and a weekly digest, and a
    // slightly wordier-than-usual draft runs past 4k mid-string. The failure
    // then surfaces as `Unterminated string in JSON at position N` from the
    // parse below, which reads like the model emitted malformed JSON rather
    // than like the response was cut off — see the stop_reason guard.
    max_tokens: 8192,
    system: NEWSLETTER_SYSTEM,
    messages: [{ role: "user", content: prompt }],
  });

  // Truncation is not a parse problem, and it must not be reported as one.
  // A cut-off response is still syntactically fine right up to the cut, so
  // JSON.parse blames whatever character happened to be last. Checking
  // stop_reason names the real cause at the point it happens.
  if (response.stop_reason === "max_tokens") {
    throw new Error(
      `Newsletter generation hit the ${8192}-token cap and was truncated mid-response. ` +
        `The output is incomplete, not malformed — raise max_tokens or shorten the prompt. ` +
        `Do NOT "fix" this by making the JSON parser more forgiving.`,
    );
  }

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
