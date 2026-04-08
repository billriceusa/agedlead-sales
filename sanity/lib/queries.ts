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
    seo,
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
    contentType,
    isFeatured,
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
    _updatedAt,
    contentType,
    author->{name, slug, image, bio, role},
    categories[]->{title, slug},
    leadTypes[]->{title, slug, icon},
    pillarPost->{title, slug},
    seo,
    "clusterPosts": *[_type == "post" && pillarPost._ref == ^._id] | order(publishedAt desc) {
      _id,
      title,
      slug,
      excerpt
    },
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
    seo,
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

// ── Glossary ────────────────────────────────────────────────
export const glossaryTermsQuery = defineQuery(
  `*[_type == "glossaryTerm"] | order(term asc) {
    _id,
    term,
    slug,
    definition,
    category
  }`
);

export const glossaryTermBySlugQuery = defineQuery(
  `*[_type == "glossaryTerm" && slug.current == $slug][0] {
    _id,
    term,
    slug,
    definition,
    body,
    category,
    seo,
    relatedTerms[]->{term, slug, definition},
    relatedLeadTypes[]->{title, slug, icon, affiliateUrl},
    "relatedPosts": *[_type == "post" && references(^._id)] | order(publishedAt desc)[0...3] {
      _id,
      title,
      slug,
      excerpt,
      mainImage,
      publishedAt
    }
  }`
);

// ── Glossary (lightweight for tooltips) ────────────────────
export const glossaryTooltipQuery = defineQuery(
  `*[_type == "glossaryTerm"] {
    "term": term,
    "slug": slug.current,
    definition
  }`
);

// ── Categories (with post counts) ─────────────────────────
export const categoryBySlugQuery = defineQuery(
  `*[_type == "category" && slug.current == $slug][0] {
    _id,
    title,
    slug,
    description
  }`
);

export const postsByCategoryQuery = defineQuery(
  `*[_type == "post" && $categoryId in categories[]._ref] | order(publishedAt desc) {
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

// ── Guides ──────────────────────────────────────────────────
export const guidesQuery = defineQuery(
  `*[_type == "guide"] | order(publishedAt desc) {
    _id,
    title,
    slug,
    excerpt,
    mainImage,
    estimatedTime,
    author->{name, slug, image},
    leadTypes[]->{title, slug}
  }`
);

export const guideBySlugQuery = defineQuery(
  `*[_type == "guide" && slug.current == $slug][0] {
    _id,
    title,
    slug,
    excerpt,
    mainImage,
    body,
    estimatedTime,
    isGated,
    publishedAt,
    author->{name, slug, image, bio, role},
    leadTypes[]->{title, slug, icon},
    seo,
    "relatedGuides": *[_type == "guide" && slug.current != $slug] | order(publishedAt desc)[0...3] {
      _id,
      title,
      slug,
      excerpt,
      mainImage,
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

// ── Verticals ──────────────────────────────────────────────
export const verticalsQuery = defineQuery(
  `*[_type == "vertical"] | order(tier asc, order asc) {
    _id,
    name,
    slug,
    icon,
    description,
    tier,
    order
  }`
);

export const verticalBySlugQuery = defineQuery(
  `*[_type == "vertical" && slug.current == $slug][0] {
    _id,
    name,
    slug,
    icon,
    description,
    tier
  }`
);

// ── Lead Providers ─────────────────────────────────────────
export const providersQuery = defineQuery(
  `*[_type == "leadProvider"] {
    _id,
    name,
    slug,
    shortDescription,
    logo,
    website,
    foundedYear,
    bbbRating,
    bestFor,
    notIdealFor,
    ratingTransparency,
    ratingValue,
    ratingCompliance,
    ratingFlexibility,
    ratingPlatform,
    ratingReputation,
    "overallRating": round(
      ratingTransparency * 0.20 +
      ratingValue * 0.20 +
      ratingCompliance * 0.20 +
      ratingFlexibility * 0.15 +
      ratingPlatform * 0.15 +
      ratingReputation * 0.10
    , 1),
    lastVerified,
    verticals[]->{name, slug, icon},
    leadTypes,
    pricingModel,
    isFeatured
  } | order(overallRating desc)`
);

export const providerBySlugQuery = defineQuery(
  `*[_type == "leadProvider" && slug.current == $slug][0] {
    _id,
    name,
    slug,
    shortDescription,
    logo,
    website,
    foundedYear,
    bbbRating,
    headquartersState,
    body,
    bestFor,
    notIdealFor,
    ratingTransparency,
    ratingValue,
    ratingCompliance,
    ratingFlexibility,
    ratingPlatform,
    ratingReputation,
    "overallRating": round(
      ratingTransparency * 0.20 +
      ratingValue * 0.20 +
      ratingCompliance * 0.20 +
      ratingFlexibility * 0.15 +
      ratingPlatform * 0.15 +
      ratingReputation * 0.10
    , 1),
    ratingNotes,
    lastVerified,
    verticals[]->{name, slug, icon},
    leadTypes,
    pricingModel,
    hasMinimums,
    minimumDescription,
    contractRequired,
    returnPolicy,
    deliveryMethods,
    complianceFeatures,
    affiliateUrl,
    isFeatured,
    seo,
    "relatedPosts": *[_type == "post"] | order(publishedAt desc)[0...3] {
      _id,
      title,
      slug,
      excerpt,
      mainImage,
      publishedAt
    },
    "relatedPlaybooks": *[_type == "playbook"] | order(publishedAt desc)[0...3] {
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

export const providersByVerticalQuery = defineQuery(
  `*[_type == "leadProvider" && $verticalId in verticals[]._ref] {
    _id,
    name,
    slug,
    shortDescription,
    logo,
    website,
    foundedYear,
    bbbRating,
    bestFor,
    ratingTransparency,
    ratingValue,
    ratingCompliance,
    ratingFlexibility,
    ratingPlatform,
    ratingReputation,
    "overallRating": round(
      ratingTransparency * 0.20 +
      ratingValue * 0.20 +
      ratingCompliance * 0.20 +
      ratingFlexibility * 0.15 +
      ratingPlatform * 0.15 +
      ratingReputation * 0.10
    , 1),
    lastVerified,
    verticals[]->{name, slug, icon},
    leadTypes,
    pricingModel,
    isFeatured
  } | order(overallRating desc)`
);

export const providerPairQuery = defineQuery(
  `*[_type == "leadProvider" && slug.current in [$slugA, $slugB]] {
    _id,
    name,
    slug,
    shortDescription,
    logo,
    website,
    foundedYear,
    bbbRating,
    headquartersState,
    bestFor,
    notIdealFor,
    ratingTransparency,
    ratingValue,
    ratingCompliance,
    ratingFlexibility,
    ratingPlatform,
    ratingReputation,
    "overallRating": round(
      ratingTransparency * 0.20 +
      ratingValue * 0.20 +
      ratingCompliance * 0.20 +
      ratingFlexibility * 0.15 +
      ratingPlatform * 0.15 +
      ratingReputation * 0.10
    , 1),
    lastVerified,
    verticals[]->{name, slug, icon},
    leadTypes,
    pricingModel,
    hasMinimums,
    minimumDescription,
    contractRequired,
    returnPolicy,
    deliveryMethods,
    complianceFeatures,
    affiliateUrl,
    isFeatured
  } | order(name asc)`
);

export const allProviderSlugsQuery = defineQuery(
  `*[_type == "leadProvider"] { "slug": slug.current }`
);

// ── Price Benchmarks ───────────────────────────────────────
export const priceBenchmarksByVerticalQuery = defineQuery(
  `*[_type == "priceBenchmark" && vertical->slug.current == $verticalSlug] | order(month desc, leadAgeBracket asc) {
    _id,
    "verticalSlug": vertical->slug.current,
    "verticalName": vertical->name,
    leadAgeBracket,
    exclusivity,
    leadType,
    month,
    priceLow,
    priceMedian,
    priceHigh,
    providersSampled,
    confidence,
    notes
  }`
);

export const priceBenchmarkLatestQuery = defineQuery(
  `{
    "benchmarks": *[_type == "priceBenchmark"] | order(month desc) {
      _id,
      "verticalSlug": vertical->slug.current,
      "verticalName": vertical->name,
      "verticalIcon": vertical->icon,
      leadAgeBracket,
      exclusivity,
      leadType,
      month,
      priceLow,
      priceMedian,
      priceHigh,
      providersSampled,
      confidence
    },
    "latestMonth": *[_type == "priceBenchmark"] | order(month desc)[0].month
  }`
);

export const allBenchmarkVerticalsQuery = defineQuery(
  `array::unique(*[_type == "priceBenchmark"].vertical->slug.current)`
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
    },
    "recentGlossaryTerms": *[_type == "glossaryTerm"] | order(_createdAt desc)[0...6] {
      _id,
      term,
      slug,
      definition
    }
  }`
);
