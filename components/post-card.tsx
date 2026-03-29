import Link from "next/link";
import { urlForImage } from "@/sanity/lib/image";

interface PostCardProps {
  title: string;
  slug: string;
  excerpt: string;
  mainImage?: {
    asset?: { _ref: string };
    alt?: string;
  };
  publishedAt?: string;
  author?: {
    name: string;
  };
}

export function PostCard({
  title,
  slug,
  excerpt,
  mainImage,
  publishedAt,
  author,
}: PostCardProps) {
  const imageUrl = mainImage
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
        {(publishedAt || author) && (
          <div className="mb-2 flex items-center gap-2 text-xs text-zinc-500 dark:text-zinc-500">
            {publishedAt && (
              <time dateTime={publishedAt}>
                {new Date(publishedAt).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}
              </time>
            )}
            {publishedAt && author && <span>&middot;</span>}
            {author && <span>{author.name}</span>}
          </div>
        )}
        <h3 className="text-lg font-semibold text-zinc-900 dark:text-white">
          <Link href={`/blog/${slug}`} className="after:absolute after:inset-0">
            {title}
          </Link>
        </h3>
        <p className="mt-2 flex-1 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
          {excerpt}
        </p>
        <span className="mt-4 text-sm font-medium text-blue-600 dark:text-blue-400">
          Read more &rarr;
        </span>
      </div>
    </article>
  );
}
