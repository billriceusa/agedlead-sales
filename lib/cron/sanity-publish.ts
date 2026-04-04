import { createClient } from "next-sanity";
import type { GeneratedArticle } from "./types";
import { sectionsToPortableText } from "./ai-content";
import { notifyIndexNow } from "@/lib/indexnow";

function getSanityWriteClient() {
  const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
  const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";
  const token = process.env.SANITY_API_TOKEN;

  if (!projectId || !token) {
    throw new Error(
      "Missing NEXT_PUBLIC_SANITY_PROJECT_ID or SANITY_API_TOKEN"
    );
  }

  return createClient({
    projectId,
    dataset,
    apiVersion: "2026-03-14",
    token,
    useCdn: false,
  });
}

function randomKey(): string {
  return Math.random().toString(36).slice(2, 10);
}

function ref(id: string) {
  return { _type: "reference", _ref: id, _key: randomKey() };
}

const LEAD_TYPE_MAP: Record<string, string> = {
  "lt-insurance": "lt-insurance",
  "lt-mortgage": "lt-mortgage",
  "lt-final-expense": "lt-final-expense",
  "lt-iul": "lt-iul",
  "lt-medicare": "lt-medicare",
  "lt-mva": "lt-mva",
  "lt-solar": "lt-solar",
  "lt-ssdi": "lt-ssdi",
};

const PILLAR_CATEGORY_MAP: Record<string, string> = {
  "Vertical Playbooks": "cat-lead-types",
  "Channel Tactics": "cat-strategies",
  "Role Guides": "cat-getting-started",
  "Metrics & Optimization": "cat-strategies",
  "Compliance": "cat-compliance",
};

export async function getExistingPostSlugs(): Promise<string[]> {
  const client = getSanityWriteClient();
  const posts = await client.fetch<{ slug: string }[]>(
    `*[_type == "post"]{ "slug": slug.current }`
  );
  return posts.map((p) => p.slug);
}

export async function getGlossaryTermSlugs(): Promise<string[]> {
  const client = getSanityWriteClient();
  const terms = await client.fetch<{ slug: string }[]>(
    `*[_type == "glossaryTerm"]{ "slug": slug.current }`
  );
  return terms.map((t) => t.slug);
}

export async function getLeadTypeSlugs(): Promise<string[]> {
  const client = getSanityWriteClient();
  const types = await client.fetch<{ slug: string; id: string }[]>(
    `*[_type == "leadType"]{ "slug": slug.current, "id": _id }`
  );
  return types.map((t) => t.slug);
}

export async function publishArticle(
  article: GeneratedArticle
): Promise<{ id: string; slug: string }> {
  const client = getSanityWriteClient();
  const postId = `post-${article.brief.slug}`;

  const existing = await client.fetch<{ _id: string } | null>(
    `*[_type == "post" && _id == $id][0]{ _id }`,
    { id: postId }
  );
  if (existing) {
    console.log(`Post already exists: ${postId}, skipping`);
    return { id: postId, slug: article.brief.slug };
  }

  const categoryId =
    PILLAR_CATEGORY_MAP[article.brief.pillar] || "cat-strategies";

  const leadTypeRefs = article.brief.targetLeadTypes
    .filter((lt) => LEAD_TYPE_MAP[lt])
    .map((lt) => ref(LEAD_TYPE_MAP[lt]));

  const publishedAt = new Date(
    article.brief.publishDate + "T09:00:00Z"
  ).toISOString();

  const doc = {
    _id: postId,
    _type: "post" as const,
    title: article.brief.title,
    slug: { _type: "slug" as const, current: article.brief.slug },
    excerpt: article.excerpt,
    publishedAt,
    contentType: article.contentType,
    isFeatured: false,
    author: ref("author-bill-rice"),
    categories: [ref(categoryId)],
    leadTypes: leadTypeRefs.length > 0 ? leadTypeRefs : undefined,
    seo: {
      metaTitle: article.seoTitle,
      metaDescription: article.seoDescription,
    },
    body: sectionsToPortableText(article.sections),
  };

  await client.createOrReplace(doc);
  console.log(`Published: ${article.brief.title}`);

  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL || "https://agedleadsales.com";
  await notifyIndexNow(`${siteUrl}/blog/${article.brief.slug}`);

  return { id: postId, slug: article.brief.slug };
}
