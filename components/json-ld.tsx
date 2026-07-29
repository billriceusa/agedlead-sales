import { billRicePersonRef } from "@/lib/identity";

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
    // SearchAction removed: it advertised /glossary?q={search_term_string}, but
    // <GlossarySearch> filters from local useState and never reads a `q` URL
    // param — the link did nothing. Wiring the component to seed its query from
    // ?q= would make the declaration true and let this come back.
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
    // Canonical person URI, shared across every property Bill owns. This used
    // to mint agedleadsales.com/about/bill-rice#person — a third distinct Bill
    // Rice, unconnected to any other site.
    ...billRicePersonRef,
    jobTitle: "Founder & Lead Conversion Expert",
    description:
      "30+ years building lead conversion systems across insurance, mortgage, solar, and home improvement. Founder of Kaleidico. Marketing director for Aged Lead Store.",
    knowsAbout: [
      "Aged Leads",
      "Lead Generation",
      "Lead Conversion",
      "Insurance Sales",
      "Mortgage Sales",
      "Sales Training",
      "Digital Marketing",
    ],
    // sameAs comes from billRicePersonRef. The two entries removed here —
    // howtoworkleads.com/resources/about and kaleidico.com/bill-rice/ — are
    // pages *about* Bill, not profiles that *are* him; Kaleidico is already
    // expressed below as worksFor, which is the accurate relationship.
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
    speakable: {
      "@type": "SpeakableSpecification",
      cssSelector: [".key-takeaway-box", ".prose-wrapper h2 + p"],
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

export function howToJsonLd({
  name,
  description,
  steps,
}: {
  name: string;
  description: string;
  steps: { name: string; text: string }[];
}) {
  return {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name,
    description,
    step: steps.map((s, index) => ({
      "@type": "HowToStep",
      position: index + 1,
      name: s.name,
      text: s.text,
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
