import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { sanityFetch } from "@/sanity/lib/fetch";
import { guideBySlugQuery } from "@/sanity/lib/queries";
import { urlForImage } from "@/sanity/lib/image";
import { PortableText } from "@/components/portable-text";
import { CtaBanner } from "@/components/cta-banner";
import { JsonLd, breadcrumbJsonLd } from "@/components/json-ld";

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://agedleadsales.com";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const guide: any = await sanityFetch(guideBySlugQuery, { slug });
  if (!guide) return {};

  const title = guide.seo?.metaTitle || guide.title;
  const description = guide.seo?.metaDescription || guide.excerpt;

  return {
    title,
    description,
    alternates: { canonical: `${baseUrl}/guides/${slug}` },
    openGraph: {
      title,
      description,
      url: `${baseUrl}/guides/${slug}`,
      images: [
        {
          url: guide.mainImage
            ? urlForImage(guide.mainImage)?.width(1200).height(630).url() || ""
            : `${baseUrl}/api/og?title=${encodeURIComponent(guide.title)}&type=guide`,
        },
      ],
    },
  };
}

export default async function GuidePage({ params }: Props) {
  const { slug } = await params;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const guide: any = await sanityFetch(guideBySlugQuery, { slug });
  if (!guide) notFound();

  const imageUrl = guide.mainImage
    ? urlForImage(guide.mainImage)?.width(1200).url()
    : undefined;

  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", url: baseUrl },
          { name: "Guides", url: `${baseUrl}/guides` },
          { name: guide.title, url: `${baseUrl}/guides/${guide.slug.current}` },
        ])}
      />

      <article className="bg-white py-12 dark:bg-zinc-950">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <nav className="mb-8 text-sm text-zinc-500">
            <Link href="/guides" className="hover:text-zinc-700 dark:hover:text-zinc-300">
              Guides
            </Link>
            <span className="mx-2">/</span>
            <span className="text-zinc-900 dark:text-white">{guide.title}</span>
          </nav>

          <header className="mb-10">
            {guide.estimatedTime && (
              <span className="mb-3 inline-block text-sm text-zinc-500">
                {guide.estimatedTime}
              </span>
            )}
            <h1 className="text-3xl font-bold text-zinc-900 dark:text-white sm:text-4xl lg:text-5xl">
              {guide.title}
            </h1>
            <p className="mt-4 text-lg text-zinc-600 dark:text-zinc-400">
              {guide.excerpt}
            </p>

            {guide.author && (
              <div className="mt-6 flex items-center gap-3">
                {guide.author.image && (
                  <div className="h-10 w-10 overflow-hidden rounded-full bg-zinc-200 dark:bg-zinc-700">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={urlForImage(guide.author.image)?.width(80).height(80).url() || ""}
                      alt={guide.author.name}
                      className="h-full w-full object-cover"
                    />
                  </div>
                )}
                <div>
                  <p className="text-sm font-medium text-zinc-900 dark:text-white">
                    {guide.author.name}
                  </p>
                  {guide.author.role && (
                    <p className="text-xs text-zinc-500">{guide.author.role}</p>
                  )}
                </div>
              </div>
            )}
          </header>

          {imageUrl && (
            <div className="mb-10 overflow-hidden rounded-xl">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={imageUrl} alt={guide.mainImage?.alt || guide.title} className="w-full" />
            </div>
          )}

          {guide.leadTypes && guide.leadTypes.length > 0 && (
            <div className="mb-8 rounded-lg border border-blue-200 bg-blue-50 p-4 dark:border-blue-900 dark:bg-blue-950/50">
              <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                Applies to:{" "}
              </span>
              {guide.leadTypes.map(
                (lt: { title: string; slug: { current: string }; icon?: string }, i: number) => (
                  <span key={lt.slug.current}>
                    <Link
                      href={`/lead-types/${lt.slug.current}`}
                      className="text-sm font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400"
                    >
                      {lt.icon} {lt.title}
                    </Link>
                    {i < guide.leadTypes.length - 1 && <span className="text-zinc-400">, </span>}
                  </span>
                )
              )}
            </div>
          )}

          {guide.body && (
            <div className="prose-wrapper">
              <PortableText value={guide.body} />
            </div>
          )}

          <div className="mt-12">
            <CtaBanner variant="compact" />
          </div>
        </div>
      </article>

      {guide.relatedGuides && guide.relatedGuides.length > 0 && (
        <section className="border-t border-zinc-200 bg-zinc-50 py-16 dark:border-zinc-800 dark:bg-zinc-900">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <h2 className="mb-8 text-2xl font-bold text-zinc-900 dark:text-white">
              More Guides
            </h2>
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {guide.relatedGuides.map(
                (rg: {
                  _id: string;
                  title: string;
                  slug: { current: string };
                  excerpt: string;
                  estimatedTime?: string;
                }) => (
                  <Link
                    key={rg._id}
                    href={`/guides/${rg.slug.current}`}
                    className="rounded-xl border border-zinc-200 bg-white p-6 transition-all hover:border-zinc-300 hover:shadow-lg dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-zinc-700"
                  >
                    <h3 className="font-semibold text-zinc-900 dark:text-white">
                      {rg.title}
                    </h3>
                    <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
                      {rg.excerpt}
                    </p>
                    {rg.estimatedTime && (
                      <span className="mt-3 inline-block text-xs text-zinc-500">
                        {rg.estimatedTime}
                      </span>
                    )}
                  </Link>
                )
              )}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
