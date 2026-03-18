import {
  PortableText as PortableTextComponent,
  type PortableTextComponents,
} from "@portabletext/react";
import type { PortableTextBlock } from "sanity";
import { urlForImage } from "@/sanity/lib/image";
import { affiliateUrl } from "@/lib/affiliate";

const MID_ARTICLE_CTAS = [
  {
    text: "Need aged leads?",
    link: "Shop aged leads at AgedLeadStore.com",
    suffix: "— starting under $1 per lead with no minimums.",
    content: "mid-article-1",
  },
  {
    text: "Ready to put this into practice?",
    link: "Browse leads by type at AgedLeadStore.com",
    suffix: "— insurance, mortgage, solar, Medicare, and more.",
    content: "mid-article-2",
  },
  {
    text: "Want to test this approach?",
    link: "Grab a starter batch at AgedLeadStore.com",
    suffix: "— no contracts, no commitments.",
    content: "mid-article-3",
  },
];

function MidArticleCta({ index, campaign }: { index: number; campaign: string }) {
  const cta = MID_ARTICLE_CTAS[index % MID_ARTICLE_CTAS.length];
  const href = affiliateUrl({ campaign, content: cta.content });

  return (
    <p className="my-8 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
      <strong className="text-zinc-800 dark:text-zinc-200">
        {cta.text}
      </strong>{" "}
      <a
        href={href}
        target="_blank"
        rel="nofollow sponsored noopener noreferrer"
        className="font-medium text-blue-600 underline decoration-blue-600/30 hover:text-blue-700 hover:decoration-blue-700/50 dark:text-blue-400"
      >
        {cta.link}
      </a>{" "}
      {cta.suffix}
    </p>
  );
}

const components: PortableTextComponents = {
  block: {
    h1: ({ children }) => (
      <h1 className="mb-6 mt-10 text-3xl font-bold text-zinc-900 dark:text-white sm:text-4xl">
        {children}
      </h1>
    ),
    h2: ({ children }) => (
      <h2 className="mb-4 mt-8 text-2xl font-bold text-zinc-900 dark:text-white sm:text-3xl">
        {children}
      </h2>
    ),
    h3: ({ children }) => (
      <h3 className="mb-3 mt-6 text-xl font-semibold text-zinc-900 dark:text-white sm:text-2xl">
        {children}
      </h3>
    ),
    h4: ({ children }) => (
      <h4 className="mb-2 mt-4 text-lg font-semibold text-zinc-900 dark:text-white">
        {children}
      </h4>
    ),
    normal: ({ children }) => (
      <p className="mb-4 leading-relaxed text-zinc-700 dark:text-zinc-300">
        {children}
      </p>
    ),
    blockquote: ({ children }) => (
      <blockquote className="my-6 border-l-4 border-blue-500 pl-4 italic text-zinc-600 dark:text-zinc-400">
        {children}
      </blockquote>
    ),
  },
  list: {
    bullet: ({ children }) => (
      <ul className="mb-4 ml-6 list-disc space-y-2 text-zinc-700 dark:text-zinc-300">
        {children}
      </ul>
    ),
    number: ({ children }) => (
      <ol className="mb-4 ml-6 list-decimal space-y-2 text-zinc-700 dark:text-zinc-300">
        {children}
      </ol>
    ),
  },
  listItem: {
    bullet: ({ children }) => <li className="leading-relaxed">{children}</li>,
    number: ({ children }) => <li className="leading-relaxed">{children}</li>,
  },
  marks: {
    strong: ({ children }) => (
      <strong className="font-semibold text-zinc-900 dark:text-white">
        {children}
      </strong>
    ),
    em: ({ children }) => <em>{children}</em>,
    code: ({ children }) => (
      <code className="rounded bg-zinc-100 px-1.5 py-0.5 font-mono text-sm dark:bg-zinc-800">
        {children}
      </code>
    ),
    link: ({ children, value }) => (
      <a
        href={value?.href}
        target={value?.href?.startsWith("http") ? "_blank" : undefined}
        rel={value?.href?.startsWith("http") ? "noopener noreferrer" : undefined}
        className="text-blue-600 underline decoration-blue-600/30 transition-colors hover:text-blue-700 hover:decoration-blue-700/50 dark:text-blue-400 dark:decoration-blue-400/30"
      >
        {children}
      </a>
    ),
  },
  types: {
    image: ({ value }) => {
      const imageUrl = urlForImage(value)?.width(1200).url();
      if (!imageUrl) return null;

      return (
        <figure className="my-8">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={imageUrl}
            alt={value.alt || ""}
            className="w-full rounded-lg"
            loading="lazy"
          />
          {value.caption && (
            <figcaption className="mt-2 text-center text-sm text-zinc-500 dark:text-zinc-500">
              {value.caption}
            </figcaption>
          )}
        </figure>
      );
    },
  },
};

// Insert interval: place a CTA after every N h2 headings
const CTA_EVERY_N_SECTIONS = 3;
// Minimum blocks before first CTA (skip short articles)
const MIN_BLOCKS_FOR_CTAS = 25;

interface PortableTextProps {
  value: PortableTextBlock[];
  campaign?: string;
}

export function PortableText({ value, campaign = "article" }: PortableTextProps) {
  if (!value || value.length < MIN_BLOCKS_FOR_CTAS) {
    return <PortableTextComponent components={components} value={value} />;
  }

  // Find h2 positions to insert CTAs between sections
  const h2Indices: number[] = [];
  for (let i = 0; i < value.length; i++) {
    const block = value[i] as { _type?: string; style?: string };
    if (block._type === "block" && block.style === "h2") {
      h2Indices.push(i);
    }
  }

  // Not enough sections for mid-article CTAs
  if (h2Indices.length < CTA_EVERY_N_SECTIONS + 1) {
    return <PortableTextComponent components={components} value={value} />;
  }

  // Determine split points: after every Nth h2 (insert CTA before the next h2)
  const splitPoints: number[] = [];
  for (let i = CTA_EVERY_N_SECTIONS; i < h2Indices.length; i += CTA_EVERY_N_SECTIONS) {
    splitPoints.push(h2Indices[i]);
  }

  // Build chunks
  const chunks: PortableTextBlock[][] = [];
  let start = 0;
  for (const splitAt of splitPoints) {
    chunks.push(value.slice(start, splitAt));
    start = splitAt;
  }
  chunks.push(value.slice(start));

  return (
    <>
      {chunks.map((chunk, i) => (
        <div key={i}>
          {i > 0 && <MidArticleCta index={i - 1} campaign={campaign} />}
          <PortableTextComponent components={components} value={chunk} />
        </div>
      ))}
    </>
  );
}
