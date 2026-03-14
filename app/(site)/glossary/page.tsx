import type { Metadata } from "next";
import { sanityFetch } from "@/sanity/lib/fetch";
import { glossaryTermsQuery } from "@/sanity/lib/queries";
import { GlossarySearch } from "@/components/glossary-search";
import { CtaBanner } from "@/components/cta-banner";

export const metadata: Metadata = {
  title: "Sales & Lead Generation Glossary",
  description:
    "A comprehensive glossary of sales, insurance, mortgage, and lead generation terms. Learn the language of aged leads and prospecting.",
};

export default async function GlossaryPage() {
  const terms = (await sanityFetch(glossaryTermsQuery)) || [];

  return (
    <>
      <section className="bg-white py-16 dark:bg-zinc-950">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-12">
            <h1 className="text-4xl font-bold text-zinc-900 dark:text-white">
              Glossary
            </h1>
            <p className="mt-4 max-w-2xl text-lg text-zinc-600 dark:text-zinc-400">
              Key terms and definitions for sales professionals, insurance
              agents, mortgage brokers, and anyone working with aged leads.
            </p>
          </div>

          {Array.isArray(terms) && terms.length > 0 ? (
            <GlossarySearch terms={terms} />
          ) : (
            <div className="rounded-xl border border-zinc-200 bg-zinc-50 p-12 text-center dark:border-zinc-800 dark:bg-zinc-900">
              <p className="text-lg text-zinc-600 dark:text-zinc-400">
                Glossary terms are being added. Check back soon for
                comprehensive definitions of sales and lead generation
                terminology.
              </p>
            </div>
          )}
        </div>
      </section>

      <CtaBanner />
    </>
  );
}
