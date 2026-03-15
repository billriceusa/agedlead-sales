const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://agedleadsales.com";

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
    name: "Aged Lead Sales",
    url: baseUrl,
    description:
      "Learn how to grow your sales business with aged leads. Training, playbooks, and strategies for insurance agents, mortgage brokers, and sales professionals.",
    publisher: personJsonLdData(),
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
    name: "Aged Lead Sales",
    url: baseUrl,
    founder: personJsonLdData(),
    description:
      "Sales training platform and aged lead strategies for insurance agents, mortgage brokers, and sales professionals.",
  };
}

export function personJsonLdData() {
  return {
    "@type": "Person",
    "@id": `${baseUrl}/about/bill-rice#person`,
    name: "Bill Rice",
    url: `${baseUrl}/about/bill-rice`,
    jobTitle: "Founder & Lead Conversion Expert",
    description:
      "20+ years building lead conversion systems across insurance, mortgage, solar, and home improvement. Founder of Kaleidico. Marketing director for Aged Lead Store.",
    knowsAbout: [
      "Aged Leads",
      "Lead Generation",
      "Lead Conversion",
      "Insurance Sales",
      "Mortgage Sales",
      "Sales Training",
      "Digital Marketing",
    ],
    sameAs: [
      "https://www.howtoworkleads.com/resources/about",
      "https://kaleidico.com/bill-rice/",
      "https://medium.com/@billrice",
    ],
    worksFor: [
      {
        "@type": "Organization",
        name: "Aged Lead Sales",
        url: baseUrl,
      },
      {
        "@type": "Organization",
        name: "Kaleidico",
        url: "https://kaleidico.com",
      },
    ],
  };
}

export function personPageJsonLd() {
  return {
    "@context": "https://schema.org",
    ...personJsonLdData(),
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
  const isKnownAuthor = authorName === "Bill Rice";

  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: title,
    description,
    url: `${baseUrl}/blog/${slug}`,
    ...(publishedAt && { datePublished: publishedAt }),
    ...(modifiedAt && { dateModified: modifiedAt }),
    author: isKnownAuthor
      ? personJsonLdData()
      : authorName
        ? { "@type": "Person", name: authorName }
        : personJsonLdData(),
    ...(imageUrl && { image: imageUrl }),
    publisher: {
      "@type": "Organization",
      name: "Aged Lead Sales",
      url: baseUrl,
    },
  };
}

export function breadcrumbJsonLd(items: { name: string; url: string }[]) {
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

export function faqJsonLd(questions: { question: string; answer: string }[]) {
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
      name: "Aged Lead Sales Glossary",
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
