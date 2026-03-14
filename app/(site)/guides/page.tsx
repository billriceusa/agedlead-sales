import type { Metadata } from "next";
import Link from "next/link";
import { sanityFetch } from "@/sanity/lib/fetch";
import { guidesQuery } from "@/sanity/lib/queries";
import { urlForImage } from "@/sanity/lib/image";
import { CtaBanner } from "@/components/cta-banner";

export const metadata: Metadata = {
  title: "Guides & Resources",
  description:
    "Comprehensive guides, checklists, and resources for sales professionals working with aged leads across insurance, mortgage, legal, and more.",
};

export default async function GuidesPage() {
  const guides = (await sanityFetch(guidesQuery)) || [];

  return (
    <>
      <section className="bg-white py-16 dark:bg-zinc-950">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-12">
            <h1 className="text-4xl font-bold text-zinc-900 dark:text-white">
              Guides & Resources
            </h1>
            <p className="mt-4 max-w-2xl text-lg text-zinc-600 dark:text-zinc-400">
              Comprehensive guides, checklists, and downloadable resources to
              help you master aged lead prospecting.
            </p>
          </div>

          {Array.isArray(guides) && guides.length > 0 ? (
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {guides.map(
                (guide: {
                  _id: string;
                  title: string;
                  slug: { current: string };
                  excerpt: string;
                  mainImage?: { asset?: { _ref: string }; alt?: string };
                  estimatedTime?: string;
                  author?: { name: string };
                }) => {
                  const imageUrl = guide.mainImage
                    ? urlForImage(guide.mainImage)?.width(600).height(340).url()
                    : undefined;

                  return (
                    <article
                      key={guide._id}
                      className="group relative flex flex-col overflow-hidden rounded-xl border border-zinc-200 bg-white transition-all hover:border-zinc-300 hover:shadow-lg dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-zinc-700"
                    >
                      {imageUrl && (
                        <div className="aspect-video overflow-hidden bg-zinc-100 dark:bg-zinc-800">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={imageUrl}
                            alt={guide.mainImage?.alt || guide.title}
                            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                            loading="lazy"
                          />
                        </div>
                      )}
                      <div className="flex flex-1 flex-col p-5">
                        {guide.estimatedTime && (
                          <span className="mb-2 text-xs text-zinc-500">
                            {guide.estimatedTime}
                          </span>
                        )}
                        <h3 className="text-lg font-semibold text-zinc-900 dark:text-white">
                          <Link
                            href={`/guides/${guide.slug.current}`}
                            className="after:absolute after:inset-0"
                          >
                            {guide.title}
                          </Link>
                        </h3>
                        <p className="mt-2 flex-1 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
                          {guide.excerpt}
                        </p>
                        <span className="mt-4 text-sm font-medium text-blue-600 dark:text-blue-400">
                          Read guide &rarr;
                        </span>
                      </div>
                    </article>
                  );
                }
              )}
            </div>
          ) : (
            <div className="rounded-xl border border-zinc-200 bg-zinc-50 p-12 text-center dark:border-zinc-800 dark:bg-zinc-900">
              <p className="text-lg text-zinc-600 dark:text-zinc-400">
                Guides are coming soon. Check back for comprehensive resources
                on aged lead prospecting.
              </p>
            </div>
          )}
        </div>
      </section>

      <CtaBanner />
    </>
  );
}
