import { createClient } from "@sanity/client";

const client = createClient({
  projectId: "p7rbtajg",
  dataset: "production",
  apiVersion: "2026-03-14",
  token: process.env.SANITY_API_TOKEN,
  useCdn: false,
});

async function seed() {
  console.log("Publishing author and blog post to Sanity...\n");

  // Author
  await client.createOrReplace({
    _id: "author-aged-lead-sales",
    _type: "author",
    name: "Aged Lead Sales",
    slug: { _type: "slug", current: "aged-lead-sales" },
    bio: "Sales training and aged lead strategies for insurance agents, mortgage brokers, and sales professionals.",
    role: "Editorial Team",
  });
  console.log("✓ Author: Aged Lead Sales");

  // Blog post: What Are Aged Leads?
  await client.createOrReplace({
    _id: "post-what-are-aged-leads",
    _type: "post",
    title: "What Are Aged Leads? The Complete Guide for Sales Professionals",
    slug: { _type: "slug", current: "what-are-aged-leads" },
    excerpt: "Everything you need to know about aged leads — what they are, how they compare to real-time leads, what they cost, and how to work them for maximum ROI.",
    publishedAt: "2026-03-14T12:00:00Z",
    contentType: "pillar",
    isFeatured: true,
    author: { _type: "reference", _ref: "author-aged-lead-sales" },
    categories: [{ _type: "reference", _ref: "cat-getting-started", _key: "c1" }],
    leadTypes: [
      { _type: "reference", _ref: "lt-insurance", _key: "lt1" },
      { _type: "reference", _ref: "lt-mortgage", _key: "lt2" },
      { _type: "reference", _ref: "lt-final-expense", _key: "lt3" },
    ],
    seo: {
      metaTitle: "What Are Aged Leads? Complete Guide for Sales Pros (2026)",
      metaDescription: "Aged leads are consumer records from people who expressed interest 30-180+ days ago. Learn what they cost, how to work them, and why they deliver better ROI than real-time leads.",
    },
    body: [
      block("An aged lead is a consumer data record from someone who previously expressed interest in a product or service — typically 30 to 180+ days ago. These are real people who filled out a form online, requested a quote, or submitted an inquiry for services like insurance, mortgage loans, solar installation, legal representation, or Medicare coverage."),
      block("The \"aged\" part simply means the lead is older. When a consumer fills out a form, that lead is initially sold as a \"real-time\" or \"fresh\" lead to agents and salespeople who pay a premium to contact the consumer immediately. After 30+ days, those same records become \"aged leads\" and are resold at a dramatically lower price — often 80-95% less."),
      block("The key insight: most of these consumers still need the product they searched for. Life doesn't stop after 30 days. Mortgages still need closing, insurance coverage is still needed, disability claims are still pending, and solar panels still save money. Aged leads give you access to these consumers at a price that makes high-volume prospecting financially viable."),

      heading("How Aged Leads Work"),
      block("The aged lead lifecycle follows a predictable path. First, a consumer searches for insurance quotes, mortgage rates, or legal help online and fills out a form with their contact information. That lead is immediately sold in real-time to 3-8 buyers for $15-$60+ each — a speed-to-call race begins."),
      block("After 30+ days, the real-time window closes. Many consumers were never successfully contacted, lost interest in one vendor but not the product, or are still comparison shopping. The same record is now available as an aged lead for $0.25-$5. Sales professionals buy these records in bulk and work them through personal, multi-channel outreach."),

      heading("Aged Leads vs. Real-Time Leads"),
      block("The differences come down to cost, competition, and approach. Real-time leads cost $15-$60+ per lead with 5-10 simultaneous buyers competing, response rates of 20-40%, and conversion rates of 5-15%. You must call within seconds. A $500 budget gets you 10-30 leads."),
      block("Aged leads cost $0.25-$5 per lead with little to no competition. Response rates are 5-15% and conversion rates are 1-5%, but you work at your own pace. A $500 budget gets you 100-2,000 leads. The volume advantage is what makes the math work."),

      heading("How Much Do Aged Leads Cost?"),
      block("Aged lead pricing varies by industry, lead age, and geographic targeting. Insurance leads cost $0.25-$2 (vs $15-$50 real-time). Mortgage leads cost $0.50-$3 (vs $25-$60). Final expense leads cost $0.50-$3 (vs $20-$40). IUL leads cost $1-$5 (vs $30-$75). Solar leads cost $0.50-$3 (vs $20-$50). Medicare leads cost $0.50-$3 (vs $15-$40). SSDI leads cost $0.50-$3 (vs $20-$50). MVA leads cost $1-$5 (vs $50-$200)."),

      heading("Types of Aged Leads"),
      block("Aged leads are available across virtually every industry where consumers request information online. The most popular verticals include mortgage leads (home purchase, refinance, HELOC), insurance leads (auto, home, life, health), final expense leads (burial and funeral insurance), IUL leads (Indexed Universal Life), solar leads (solar panel installation), Medicare leads (supplement, Advantage, Part D), SSDI leads (disability claims), and MVA leads (auto accident and personal injury)."),

      heading("How to Work Aged Leads"),
      block("The biggest mistake with aged leads is treating them like real-time leads. You can't call once and expect a sale. Success comes from a systematic, multi-channel follow-up cadence."),
      block("Day 1: Send a personal letter or postcard — something physical that stands out. Day 3: Phone call using the Honest Follow-Up script. Day 4: Send a plain-text email — personal and conversational. Day 7: Second call at a different time of day. Day 10: Final touch — door knock if local, or send a second email with additional value."),

      heading("The \"Honest Follow-Up\" Script"),
      block("The single most effective approach for aged leads is radical honesty. Don't pretend you have a relationship that doesn't exist. Here's the script:"),
      block("\"Hi [Name], this is [Your Name]. I'm doing a follow-up on some older inquiry records from [Month] regarding [Product/Service]. It doesn't look like we ever spoke, so I wanted to make sure you were able to get what you needed — or is this still on your to-do list?\""),
      block("This works because it acknowledges the timeline honestly, doesn't fake a relationship, uses low-pressure framing, and captures procrastinators while giving others an easy out."),

      heading("ROI: The Math That Makes It Work"),
      block("Here's why aged leads deliver better ROI despite lower conversion rates. Consider a $500 monthly budget. With real-time leads at $30 each, you get 16 leads. At a 10% conversion rate, that's approximately 2 sales. With aged leads at $1 each, you get 500 leads. At a 2% conversion rate, that's approximately 10 sales — 5x more sales from the same budget."),
      block("That's the aged lead advantage. The lower conversion rate is dramatically offset by the volume you can achieve at lower cost."),

      heading("Getting Started with Aged Leads"),
      block("Choose your lead type — pick the vertical that matches your business. Start small with 100-200 leads to test your process. Set up a CRM to track every contact attempt. Use the Honest Follow-Up script. Plan for 5-7 touches across phone, email, and mail over 10-14 days. Track your numbers — measure contact rate, conversion rate, and cost per acquisition, then adjust and scale."),
    ],
  });
  console.log("✓ Post: What Are Aged Leads?");

  console.log("\nDone!");
}

function block(text) {
  return {
    _type: "block",
    _key: Math.random().toString(36).slice(2, 10),
    style: "normal",
    markDefs: [],
    children: [
      {
        _type: "span",
        _key: Math.random().toString(36).slice(2, 10),
        text,
        marks: [],
      },
    ],
  };
}

function heading(text) {
  return {
    _type: "block",
    _key: Math.random().toString(36).slice(2, 10),
    style: "h2",
    markDefs: [],
    children: [
      {
        _type: "span",
        _key: Math.random().toString(36).slice(2, 10),
        text,
        marks: [],
      },
    ],
  };
}

seed().catch(console.error);
