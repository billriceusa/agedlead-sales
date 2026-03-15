import type { Metadata } from "next";
import { sanityFetch } from "@/sanity/lib/fetch";
import { playbooksQuery } from "@/sanity/lib/queries";
import { PlaybookCard } from "@/components/playbook-card";
import { CtaBanner } from "@/components/cta-banner";

export const metadata: Metadata = {
  title: "Sales Playbooks",
  description:
    "Step-by-step sales playbooks and training guides for working aged leads. Strategies for insurance, mortgage, final expense, and more.",
};

export default async function PlaybooksPage() {
  const playbooks = (await sanityFetch(playbooksQuery)) || [];

  return (
    <>
      <section className="bg-white py-16 dark:bg-zinc-950">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-12">
            <h1 className="text-4xl font-bold text-zinc-900 dark:text-white">
              Sales Playbooks
            </h1>
            <p className="mt-4 max-w-2xl text-lg text-zinc-600 dark:text-zinc-400">
              Step-by-step guides and proven frameworks to help you master aged
              lead prospecting and close more deals.
            </p>
          </div>

          {playbooks.length > 0 ? (
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {playbooks.map(
                (pb: {
                  _id: string;
                  title: string;
                  slug: { current: string };
                  excerpt: string;
                  mainImage?: { asset?: { _ref: string }; alt?: string };
                  difficulty?: string;
                  estimatedTime?: string;
                }) => (
                  <PlaybookCard
                    key={pb._id}
                    title={pb.title}
                    slug={pb.slug.current}
                    excerpt={pb.excerpt}
                    mainImage={pb.mainImage}
                    difficulty={pb.difficulty}
                    estimatedTime={pb.estimatedTime}
                  />
                )
              )}
            </div>
          ) : (
            <div className="rounded-xl border border-zinc-200 bg-zinc-50 p-12 text-center dark:border-zinc-800 dark:bg-zinc-900">
              <p className="text-lg text-zinc-600 dark:text-zinc-400">
                Playbooks are coming soon. Check back for step-by-step guides
                on aged lead prospecting strategies.
              </p>
            </div>
          )}
        </div>
      </section>

      <CtaBanner />
    </>
  );
}
