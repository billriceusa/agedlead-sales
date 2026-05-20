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
    categories[defined(@->)]->{title, slug},
    leadTypes[defined(@->)]->{title, slug}
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
    categories[defined(@->)]->{title, slug},
    leadTypes[defined(@->)]->{title, slug, icon},
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
    categories[defined(@->)]->{title, slug}
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
    leadTypes[defined(@->)]->{title, slug}
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
    _updatedAt,
    author->{name, slug, image, bio, role},
    leadTypes[defined(@->)]->{title, slug, icon},
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
    relatedTerms[defined(@->)]->{term, slug, definition},
    relatedLeadTypes[defined(@->)]->{title, slug, icon, affiliateUrl},
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
    categories[defined(@->)]->{title, slug}
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
    leadTypes[defined(@->)]->{title, slug}
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
    leadTypes[defined(@->)]->{title, slug, icon},
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
    verticals[defined(@->)]->{name, slug, icon},
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
    verticals[defined(@->)]->{name, slug, icon},
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
    verticals[defined(@->)]->{name, slug, icon},
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
    verticals[defined(@->)]->{name, slug, icon},
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

// Lightweight query for the listing page: only the cron-managed lastVerified
// field per provider, keyed by slug. Editorial content (ratings, descriptions,
// lead types, pricing) is sourced from data/providers.ts — see the comment in
// app/(site)/providers/page.tsx.
export const providersLastVerifiedQuery = defineQuery(
  `*[_type == "leadProvider"] { "slug": slug.current, lastVerified }`
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

// Returns benchmarks for the latest month in the shape of
// data/price-benchmarks.ts PriceBenchmarkData (uses `vertical` slug, not the
// `verticalSlug` projection used by the listing/index queries above).
export const latestStaticShapedBenchmarksQuery = defineQuery(
  `*[_type == "priceBenchmark" && month == *[_type == "priceBenchmark"] | order(month desc)[0].month] {
    "vertical": vertical->slug.current,
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

// Recent published posts in any of the supplied category slugs. Used by
// the /playbook and /price-index pillar pages to surface their topical
// cluster — strategies+scripts+compliance for the operations playbook,
// roi-analytics for the price index.
export const postsByCategorySlugsQuery = defineQuery(
  `*[_type == "post" && count(categories[@->slug.current in $slugs]) > 0]
    | order(publishedAt desc)[0...8] {
      _id,
      title,
      slug,
      excerpt,
      mainImage,
      publishedAt
    }`
);

export const staticShapedBenchmarksByVerticalQuery = defineQuery(
  `*[_type == "priceBenchmark" && vertical->slug.current == $vertical] | order(month desc) {
    "vertical": vertical->slug.current,
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

