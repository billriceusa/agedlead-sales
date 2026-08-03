import type { Metadata } from "next";
import { siteUrl } from "@/lib/site-url";
import { sanityFetch } from "@/sanity/lib/fetch";
import { glossaryTermsQuery } from "@/sanity/lib/queries";
import { GlossarySearch } from "@/components/glossary-search";
import { CtaBanner } from "@/components/cta-banner";
import { GLOSSARY_TERMS } from "@/data/glossary-terms";

export const metadata: Metadata = {
  title: "Sales & Lead Generation Glossary",
  description:
    "A comprehensive glossary of sales, insurance, mortgage, and lead generation terms. Learn the language of aged leads and prospecting.",
  alternates: { canonical: siteUrl("/glossary") },
};

export default async function GlossaryPage() {
  const cmsTerms = await sanityFetch(glossaryTermsQuery);

  const terms =
    Array.isArray(cmsTerms) && cmsTerms.length > 0
      ? cmsTerms
      : GLOSSARY_TERMS.map((t) => ({
          _id: t.slug,
          term: t.term,
          slug: { current: t.slug },
          definition: t.definition,
          category: t.category,
        }));

  return (
    <>
      <section className="bg-white py-16 dark:bg-zinc-950">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-12">
            <h1 className="text-4xl font-bold text-zinc-900 dark:text-white">
              Glossary
            </h1>
            <p className="mt-4 max-w-2xl text-lg text-zinc-600 dark:text-zinc-400">
              {GLOSSARY_TERMS.length}+ terms covering sales, insurance,
              mortgage, legal, and lead generation. Your reference guide for
              working with aged leads.
            </p>
          </div>

          <GlossarySearch terms={terms} />
        </div>
      </section>

      <CtaBanner campaign="glossary" />
    </>
  );
}
