import type { MetadataRoute } from "next";
import { sanityFetch } from "@/sanity/lib/fetch";

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://agedleadstore.com";

const sitemapContentQuery = `{
  "posts": *[_type == "post"] | order(publishedAt desc) {
    "slug": slug.current,
    "lastModified": _updatedAt
  },
  "leadTypes": *[_type == "leadType"] | order(order asc) {
    "slug": slug.current,
    "lastModified": _updatedAt
  },
  "playbooks": *[_type == "playbook"] | order(publishedAt desc) {
    "slug": slug.current,
    "lastModified": _updatedAt
  },
  "glossaryTerms": *[_type == "glossaryTerm"] | order(term asc) {
    "slug": slug.current,
    "lastModified": _updatedAt
  },
  "guides": *[_type == "guide"] | order(publishedAt desc) {
    "slug": slug.current,
    "lastModified": _updatedAt
  }
}`;

type ContentItem = { slug: string; lastModified: string };

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const data = await sanityFetch<{
    posts: ContentItem[];
    leadTypes: ContentItem[];
    playbooks: ContentItem[];
    glossaryTerms: ContentItem[];
    guides: ContentItem[];
  }>(sitemapContentQuery);

  const posts = data?.posts || [];
  const leadTypes = data?.leadTypes || [];
  const playbooks = data?.playbooks || [];
  const glossaryTerms = data?.glossaryTerms || [];
  const guides = data?.guides || [];

  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1.0,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/lead-types`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/playbooks`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/glossary`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/guides`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.5,
    },
  ];

  const postEntries: MetadataRoute.Sitemap = posts.map((post) => ({
    url: `${baseUrl}/blog/${post.slug}`,
    lastModified: new Date(post.lastModified),
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  const leadTypeEntries: MetadataRoute.Sitemap = leadTypes.map((lt) => ({
    url: `${baseUrl}/lead-types/${lt.slug}`,
    lastModified: new Date(lt.lastModified),
    changeFrequency: "monthly",
    priority: 0.8,
  }));

  const playbookEntries: MetadataRoute.Sitemap = playbooks.map((pb) => ({
    url: `${baseUrl}/playbooks/${pb.slug}`,
    lastModified: new Date(pb.lastModified),
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  const glossaryEntries: MetadataRoute.Sitemap = glossaryTerms.map((term) => ({
    url: `${baseUrl}/glossary/${term.slug}`,
    lastModified: new Date(term.lastModified),
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  const guideEntries: MetadataRoute.Sitemap = guides.map((guide) => ({
    url: `${baseUrl}/guides/${guide.slug}`,
    lastModified: new Date(guide.lastModified),
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  return [
    ...staticPages,
    ...leadTypeEntries,
    ...postEntries,
    ...playbookEntries,
    ...glossaryEntries,
    ...guideEntries,
  ];
}
