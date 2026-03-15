import type { MetadataRoute } from "next";
import { sanityFetch } from "@/sanity/lib/fetch";

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://agedleadsales.com";

type ContentItem = { slug: string; lastModified: string };

async function fetchCmsContent() {
  try {
    const data = await sanityFetch<{
      posts: ContentItem[];
      leadTypes: ContentItem[];
      playbooks: ContentItem[];
      glossaryTerms: ContentItem[];
      guides: ContentItem[];
    }>(`{
      "posts": *[_type == "post"]{ "slug": slug.current, "lastModified": _updatedAt },
      "leadTypes": *[_type == "leadType"]{ "slug": slug.current, "lastModified": _updatedAt },
      "playbooks": *[_type == "playbook"]{ "slug": slug.current, "lastModified": _updatedAt },
      "glossaryTerms": *[_type == "glossaryTerm"]{ "slug": slug.current, "lastModified": _updatedAt },
      "guides": *[_type == "guide"]{ "slug": slug.current, "lastModified": _updatedAt }
    }`);
    return data;
  } catch {
    return null;
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const data = await fetchCmsContent();

  const entries: MetadataRoute.Sitemap = [
    { url: baseUrl, lastModified: new Date(), changeFrequency: "weekly", priority: 1.0 },
    { url: `${baseUrl}/blog`, lastModified: new Date(), changeFrequency: "daily", priority: 0.9 },
    { url: `${baseUrl}/lead-types`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.9 },
    { url: `${baseUrl}/playbooks`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.9 },
    { url: `${baseUrl}/glossary`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.8 },
    { url: `${baseUrl}/guides`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.8 },
    { url: `${baseUrl}/calculators`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.8 },
    { url: `${baseUrl}/about`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.5 },
  ];

  if (data) {
    for (const post of data.posts || []) {
      entries.push({ url: `${baseUrl}/blog/${post.slug}`, lastModified: new Date(post.lastModified), priority: 0.7 });
    }
    for (const lt of data.leadTypes || []) {
      entries.push({ url: `${baseUrl}/lead-types/${lt.slug}`, lastModified: new Date(lt.lastModified), priority: 0.8 });
    }
    for (const pb of data.playbooks || []) {
      entries.push({ url: `${baseUrl}/playbooks/${pb.slug}`, lastModified: new Date(pb.lastModified), priority: 0.7 });
    }
    for (const term of data.glossaryTerms || []) {
      entries.push({ url: `${baseUrl}/glossary/${term.slug}`, lastModified: new Date(term.lastModified), priority: 0.6 });
    }
    for (const guide of data.guides || []) {
      entries.push({ url: `${baseUrl}/guides/${guide.slug}`, lastModified: new Date(guide.lastModified), priority: 0.7 });
    }
  }

  return entries;
}
