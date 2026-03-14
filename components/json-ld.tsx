const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://agedleadstore.com";

interface JsonLdProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: Record<string, any>;
}

export function JsonLd({ data }: JsonLdProps) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

export function websiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Aged Lead Store",
    url: baseUrl,
    description:
      "Learn how to grow your sales business with aged leads. Training, playbooks, and strategies for insurance agents, mortgage brokers, and sales professionals.",
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${baseUrl}/glossary?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };
}

export function organizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Aged Lead Store",
    url: baseUrl,
    sameAs: ["https://agedleadstore.com"],
    description:
      "Sales training platform and aged lead marketplace for insurance agents, mortgage brokers, and sales professionals.",
  };
}

export function articleJsonLd({
  title,
  description,
  slug,
  publishedAt,
  modifiedAt,
  authorName,
  imageUrl,
}: {
  title: string;
  description: string;
  slug: string;
  publishedAt?: string;
  modifiedAt?: string;
  authorName?: string;
  imageUrl?: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: title,
    description,
    url: `${baseUrl}/blog/${slug}`,
    ...(publishedAt && { datePublished: publishedAt }),
    ...(modifiedAt && { dateModified: modifiedAt }),
    ...(authorName && {
      author: { "@type": "Person", name: authorName },
    }),
    ...(imageUrl && { image: imageUrl }),
    publisher: {
      "@type": "Organization",
      name: "Aged Lead Store",
      url: baseUrl,
    },
  };
}

export function breadcrumbJsonLd(
  items: { name: string; url: string }[]
) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

export function faqJsonLd(
  questions: { question: string; answer: string }[]
) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: questions.map((q) => ({
      "@type": "Question",
      name: q.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: q.answer,
      },
    })),
  };
}

export function glossaryTermJsonLd({
  term,
  definition,
  slug,
}: {
  term: string;
  definition: string;
  slug: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "DefinedTerm",
    name: term,
    description: definition,
    url: `${baseUrl}/glossary/${slug}`,
    inDefinedTermSet: {
      "@type": "DefinedTermSet",
      name: "Aged Lead Store Glossary",
      url: `${baseUrl}/glossary`,
    },
  };
}

export function webApplicationJsonLd({
  name,
  description,
  slug,
}: {
  name: string;
  description: string;
  slug: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name,
    description,
    url: `${baseUrl}/calculators/${slug}`,
    applicationCategory: "BusinessApplication",
    operatingSystem: "Any",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
  };
}
