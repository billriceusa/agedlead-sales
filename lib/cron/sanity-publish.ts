import { createClient } from "next-sanity";
import type { GeneratedArticle } from "./types";
import { sectionsToPortableText } from "./ai-content";
import { notifyIndexNow } from "@/lib/indexnow";

function getSanityWriteClient() {
  const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
  const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";
  const token = (process.env.SANITY_API_TOKEN || "").trim();

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

export type ExistingPost = { id: string; slug: string; title: string };

export async function getExistingPosts(): Promise<ExistingPost[]> {
  const client = getSanityWriteClient();
  return client.fetch<ExistingPost[]>(
    `*[_type == "post"]{ "id": _id, "slug": slug.current, title }`
  );
}

export async function getExistingPostSlugs(): Promise<string[]> {
  const posts = await getExistingPosts();
  return posts.map((p) => p.slug);
}

const TITLE_STOP_WORDS = new Set([
  "the","a","an","and","or","but","for","of","to","in","on","at","by","with",
  "is","are","be","how","what","your","you","this","that","from","as","it",
  "2024","2025","2026","guide","complete","ultimate","beginner","beginners",
  "aged","lead","leads",
]);

function normalizeTitleTokens(title: string): Set<string> {
  const normalized = title
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  return new Set(
    normalized
      .split(" ")
      .filter((w) => w.length > 2 && !TITLE_STOP_WORDS.has(w))
  );
}

export function titleSimilarity(a: string, b: string): number {
  const ta = normalizeTitleTokens(a);
  const tb = normalizeTitleTokens(b);
  if (ta.size === 0 || tb.size === 0) return 0;
  let shared = 0;
  for (const t of ta) if (tb.has(t)) shared++;
  const union = new Set([...ta, ...tb]).size;
  return shared / union;
}

export function findSimilarPost(
  title: string,
  existing: ExistingPost[],
  threshold = 0.7
): ExistingPost | null {
  for (const p of existing) {
    if (titleSimilarity(title, p.title) >= threshold) return p;
  }
  return null;
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

export type PublishOutcome =
  | { status: "created"; id: string; slug: string }
  | { status: "skipped"; id: string; slug: string; reason: string };

export async function publishArticle(
  article: GeneratedArticle,
  existingPosts?: ExistingPost[]
): Promise<PublishOutcome> {
  const client = getSanityWriteClient();
  const postId = `post-${article.brief.slug}`;
  const posts = existingPosts ?? (await getExistingPosts());

  const idMatch = posts.find((p) => p.id === postId);
  if (idMatch) {
    return {
      status: "skipped",
      id: postId,
      slug: article.brief.slug,
      reason: `ID already exists: ${postId}`,
    };
  }

  const slugMatch = posts.find((p) => p.slug === article.brief.slug);
  if (slugMatch) {
    return {
      status: "skipped",
      id: postId,
      slug: article.brief.slug,
      reason: `Slug already used by post "${slugMatch.title}" (${slugMatch.id})`,
    };
  }

  const similar = findSimilarPost(article.brief.title, posts);
  if (similar) {
    return {
      status: "skipped",
      id: postId,
      slug: article.brief.slug,
      reason: `Title too similar to existing post "${similar.title}" (${similar.slug})`,
    };
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

  return { status: "created", id: postId, slug: article.brief.slug };
}
