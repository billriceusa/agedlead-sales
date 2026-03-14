import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { sanityFetch } from "@/sanity/lib/fetch";
import { playbookBySlugQuery } from "@/sanity/lib/queries";
import { urlForImage } from "@/sanity/lib/image";
import { PortableText } from "@/components/portable-text";
import { PlaybookCard } from "@/components/playbook-card";
import { CtaBanner } from "@/components/cta-banner";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const playbook: any = await sanityFetch(playbookBySlugQuery, { slug });
  if (!playbook) return {};

  return {
    title: playbook.seoTitle || playbook.title,
    description: playbook.seoDescription || playbook.excerpt,
    openGraph: {
      title: playbook.seoTitle || playbook.title,
      description: playbook.seoDescription || playbook.excerpt,
      ...(playbook.mainImage && {
        images: [
          {
            url:
              urlForImage(playbook.mainImage)?.width(1200).height(630).url() ||
              "",
          },
        ],
      }),
    },
  };
}

export default async function PlaybookPage({ params }: Props) {
  const { slug } = await params;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const playbook: any = await sanityFetch(playbookBySlugQuery, { slug });
  if (!playbook) notFound();

  const imageUrl = playbook.mainImage
    ? urlForImage(playbook.mainImage)?.width(1200).url()
    : undefined;

  const difficultyLabel = playbook.difficulty
    ? playbook.difficulty.charAt(0).toUpperCase() + playbook.difficulty.slice(1)
    : null;

  return (
    <>
      <article className="bg-white py-12 dark:bg-zinc-950">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb */}
          <nav className="mb-8 text-sm text-zinc-500">
            <Link
              href="/playbooks"
              className="hover:text-zinc-700 dark:hover:text-zinc-300"
            >
              Playbooks
            </Link>
            <span className="mx-2">/</span>
            <span className="text-zinc-900 dark:text-white">
              {playbook.title}
            </span>
          </nav>

          {/* Header */}
          <header className="mb-10">
            <div className="mb-4 flex flex-wrap items-center gap-3">
              {difficultyLabel && (
                <span
                  className={`rounded-full px-3 py-1 text-xs font-medium ${
                    playbook.difficulty === "beginner"
                      ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                      : playbook.difficulty === "intermediate"
                        ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400"
                        : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
                  }`}
                >
                  {difficultyLabel}
                </span>
              )}
              {playbook.estimatedTime && (
                <span className="text-sm text-zinc-500">
                  {playbook.estimatedTime}
                </span>
              )}
            </div>

            <h1 className="text-3xl font-bold text-zinc-900 dark:text-white sm:text-4xl lg:text-5xl">
              {playbook.title}
            </h1>
            <p className="mt-4 text-lg text-zinc-600 dark:text-zinc-400">
              {playbook.excerpt}
            </p>

            {playbook.author && (
              <div className="mt-6 flex items-center gap-3">
                {playbook.author.image && (
                  <div className="h-10 w-10 overflow-hidden rounded-full bg-zinc-200 dark:bg-zinc-700">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={
                        urlForImage(playbook.author.image)
                          ?.width(80)
                          .height(80)
                          .url() || ""
                      }
                      alt={playbook.author.name}
                      className="h-full w-full object-cover"
                    />
                  </div>
                )}
                <div>
                  <p className="text-sm font-medium text-zinc-900 dark:text-white">
                    {playbook.author.name}
                  </p>
                  {playbook.author.role && (
                    <p className="text-xs text-zinc-500">
                      {playbook.author.role}
                    </p>
                  )}
                </div>
              </div>
            )}
          </header>

          {/* Featured Image */}
          {imageUrl && (
            <div className="mb-10 overflow-hidden rounded-xl">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={imageUrl}
                alt={playbook.mainImage?.alt || playbook.title}
                className="w-full"
              />
            </div>
          )}

          {/* Related Lead Types */}
          {playbook.leadTypes && playbook.leadTypes.length > 0 && (
            <div className="mb-8 rounded-lg border border-blue-200 bg-blue-50 p-4 dark:border-blue-900 dark:bg-blue-950/50">
              <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                Applies to:{" "}
              </span>
              {playbook.leadTypes.map(
                (
                  lt: {
                    title: string;
                    slug: { current: string };
                    icon?: string;
                  },
                  i: number
                ) => (
                  <span key={lt.slug.current}>
                    <Link
                      href={`/lead-types/${lt.slug.current}`}
                      className="text-sm font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400"
                    >
                      {lt.icon} {lt.title}
                    </Link>
                    {i < playbook.leadTypes.length - 1 && (
                      <span className="text-zinc-400">, </span>
                    )}
                  </span>
                )
              )}
            </div>
          )}

          {/* Body */}
          {playbook.body && (
            <div className="prose-wrapper">
              <PortableText value={playbook.body} />
            </div>
          )}

          {/* Inline CTA */}
          <div className="mt-12">
            <CtaBanner variant="compact" />
          </div>
        </div>
      </article>

      {/* Related Playbooks */}
      {playbook.relatedPlaybooks && playbook.relatedPlaybooks.length > 0 && (
        <section className="border-t border-zinc-200 bg-zinc-50 py-16 dark:border-zinc-800 dark:bg-zinc-900">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <h2 className="mb-8 text-2xl font-bold text-zinc-900 dark:text-white">
              More Playbooks
            </h2>
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {playbook.relatedPlaybooks.map(
                (rp: {
                  _id: string;
                  title: string;
                  slug: { current: string };
                  excerpt: string;
                  mainImage?: { asset?: { _ref: string }; alt?: string };
                  difficulty?: string;
                  estimatedTime?: string;
                }) => (
                  <PlaybookCard
                    key={rp._id}
                    title={rp.title}
                    slug={rp.slug.current}
                    excerpt={rp.excerpt}
                    mainImage={rp.mainImage}
                    difficulty={rp.difficulty}
                    estimatedTime={rp.estimatedTime}
                  />
                )
              )}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
