export interface StaticBlogPost {
  slug: string;
  title: string;
  excerpt: string;
  metaTitle: string;
  metaDescription: string;
  publishedAt: string;
  category: string;
  contentHtml: string;
}

export const STATIC_BLOG_POSTS: Record<string, StaticBlogPost> = {
  "what-are-aged-leads": {
    slug: "what-are-aged-leads",
    title: "What Are Aged Leads? The Complete Guide for Sales Professionals",
    excerpt:
      "Everything you need to know about aged leads — what they are, how they compare to real-time leads, what they cost, and how to work them for maximum ROI.",
    metaTitle: "What Are Aged Leads? Complete Guide for Sales Pros (2026)",
    metaDescription:
      "Aged leads are consumer records from people who expressed interest 30-180+ days ago. Learn what they cost, how to work them, and why they deliver better ROI than real-time leads.",
    publishedAt: "2026-03-14",
    category: "Getting Started",
    contentHtml: "",
  },
};
