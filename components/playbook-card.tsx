import Link from "next/link";
import { urlForImage } from "@/sanity/lib/image";

interface PlaybookCardProps {
  title: string;
  slug: string;
  excerpt: string;
  mainImage?: {
    asset?: { _ref: string };
    alt?: string;
  };
  difficulty?: string;
  estimatedTime?: string;
}

const difficultyColors: Record<string, string> = {
  beginner:
    "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
  intermediate:
    "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",
  advanced: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
};

export function PlaybookCard({
  title,
  slug,
  excerpt,
  mainImage,
  difficulty,
  estimatedTime,
}: PlaybookCardProps) {
  const imageUrl = mainImage?.asset?._ref
    ? urlForImage(mainImage)?.width(600).height(340).url()
    : undefined;

  return (
    <article className="group relative flex flex-col overflow-hidden rounded-xl border border-zinc-200 bg-white transition-all hover:border-zinc-300 hover:shadow-lg dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-zinc-700">
      {imageUrl && (
        <div className="aspect-video overflow-hidden bg-zinc-100 dark:bg-zinc-800">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={imageUrl}
            alt={mainImage?.alt || title}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            loading="lazy"
          />
        </div>
      )}
      <div className="flex flex-1 flex-col p-5">
        <div className="mb-3 flex flex-wrap items-center gap-2">
          {difficulty && (
            <span
              className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${difficultyColors[difficulty] || ""}`}
            >
              {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
            </span>
          )}
          {estimatedTime && (
            <span className="text-xs text-zinc-500 dark:text-zinc-500">
              {estimatedTime}
            </span>
          )}
        </div>
        <h3 className="text-lg font-semibold text-zinc-900 dark:text-white">
          <Link
            href={`/playbooks/${slug}`}
            className="after:absolute after:inset-0"
          >
            {title}
          </Link>
        </h3>
        <p className="mt-2 flex-1 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
          {excerpt}
        </p>
        <span className="mt-4 text-sm font-medium text-blue-600 dark:text-blue-400">
          View playbook &rarr;
        </span>
      </div>
    </article>
  );
}
