import { defineQuery } from "next-sanity";

// ── Lead Types ──────────────────────────────────────────────
export const leadTypesQuery = defineQuery(
  `*[_type == "leadType"] | order(order asc) {
    _id,
    title,
    slug,
    shortDescription,
    mainImage,
    icon,
    affiliateUrl,
    averageCostPerLead,
    industries
  }`
);

export const leadTypeBySlugQuery = defineQuery(
  `*[_type == "leadType" && slug.current == $slug][0] {
    _id,
    title,
    slug,
    shortDescription,
    mainImage,
    icon,
    body,
    affiliateUrl,
    averageCostPerLead,
    industries,
    seoTitle,
    seoDescription,
    "relatedPosts": *[_type == "post" && references(^._id)] | order(publishedAt desc)[0...3] {
      _id,
      title,
      slug,
      excerpt,
      mainImage,
      publishedAt
    },
    "relatedPlaybooks": *[_type == "playbook" && references(^._id)] | order(publishedAt desc)[0...3] {
      _id,
      title,
      slug,
      excerpt,
      mainImage,
      difficulty,
      estimatedTime
    }
  }`
);

// ── Blog Posts ───────────────────────────────────────────────
export const postsQuery = defineQuery(
  `*[_type == "post"] | order(publishedAt desc) {
    _id,
    title,
    slug,
    excerpt,
    mainImage,
    publishedAt,
    author->{name, slug, image},
    categories[]->{title, slug},
    leadTypes[]->{title, slug}
  }`
);

export const postBySlugQuery = defineQuery(
  `*[_type == "post" && slug.current == $slug][0] {
    _id,
    title,
    slug,
    excerpt,
    mainImage,
    body,
    publishedAt,
    author->{name, slug, image, bio, role},
    categories[]->{title, slug},
    leadTypes[]->{title, slug, icon},
    seoTitle,
    seoDescription,
    "relatedPosts": *[_type == "post" && slug.current != $slug && count(categories[@._ref in ^.^.categories[]._ref]) > 0] | order(publishedAt desc)[0...3] {
      _id,
      title,
      slug,
      excerpt,
      mainImage,
      publishedAt
    }
  }`
);

export const recentPostsQuery = defineQuery(
  `*[_type == "post"] | order(publishedAt desc)[0...$limit] {
    _id,
    title,
    slug,
    excerpt,
    mainImage,
    publishedAt,
    author->{name, slug, image},
    categories[]->{title, slug}
  }`
);

// ── Playbooks ───────────────────────────────────────────────
export const playbooksQuery = defineQuery(
  `*[_type == "playbook"] | order(publishedAt desc) {
    _id,
    title,
    slug,
    excerpt,
    mainImage,
    difficulty,
    estimatedTime,
    author->{name, slug, image},
    leadTypes[]->{title, slug}
  }`
);

export const playbookBySlugQuery = defineQuery(
  `*[_type == "playbook" && slug.current == $slug][0] {
    _id,
    title,
    slug,
    excerpt,
    mainImage,
    body,
    difficulty,
    estimatedTime,
    publishedAt,
    author->{name, slug, image, bio, role},
    leadTypes[]->{title, slug, icon},
    seoTitle,
    seoDescription,
    "relatedPlaybooks": *[_type == "playbook" && slug.current != $slug] | order(publishedAt desc)[0...3] {
      _id,
      title,
      slug,
      excerpt,
      mainImage,
      difficulty,
      estimatedTime
    }
  }`
);

// ── Categories ──────────────────────────────────────────────
export const categoriesQuery = defineQuery(
  `*[_type == "category"] | order(title asc) {
    _id,
    title,
    slug,
    description
  }`
);

// ── Homepage ────────────────────────────────────────────────
export const homepageDataQuery = defineQuery(
  `{
    "leadTypes": *[_type == "leadType"] | order(order asc)[0...8] {
      _id,
      title,
      slug,
      shortDescription,
      mainImage,
      icon,
      affiliateUrl
    },
    "recentPosts": *[_type == "post"] | order(publishedAt desc)[0...6] {
      _id,
      title,
      slug,
      excerpt,
      mainImage,
      publishedAt,
      author->{name, image}
    },
    "featuredPlaybooks": *[_type == "playbook"] | order(publishedAt desc)[0...3] {
      _id,
      title,
      slug,
      excerpt,
      mainImage,
      difficulty,
      estimatedTime
    }
  }`
);
