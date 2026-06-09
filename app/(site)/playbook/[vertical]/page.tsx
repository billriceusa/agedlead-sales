import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { FLAGSHIP_VERTICALS, allFlagshipVerticals } from "@/data/flagship-verticals";
import type { Vertical } from "@/lib/email-course/types";
import { FlagshipSignupForm } from "@/components/flagship/flagship-signup-form";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { JsonLd, breadcrumbJsonLd, faqJsonLd } from "@/components/json-ld";
import { sanityFetch } from "@/sanity/lib/fetch";
import { glossaryTooltipQuery } from "@/sanity/lib/queries";
import { makeGlossaryLinker } from "@/components/glossary-static";

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://agedleadsales.com";

interface PageProps {
  params: Promise<{ vertical: string }>;
}

function isVertical(v: string): v is Vertical {
  return v === "mortgage" || v === "insurance" || v === "home-services";
}

export async function generateStaticParams() {
  return allFlagshipVerticals().map((v) => ({ vertical: v.slug }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { vertical } = await params;
  if (!isVertical(vertical)) return {};
  const config = FLAGSHIP_VERTICALS[vertical];
  return {
    title: config.metaTitle,
    description: config.metaDescription,
    alternates: { canonical: `${baseUrl}/playbook/${vertical}` },
    openGraph: {
      title: config.metaTitle,
      description: config.metaDescription,
      url: `${baseUrl}/playbook/${vertical}`,
      type: "website",
    },
  };
}

export default async function FlagshipVerticalPage({ params }: PageProps) {
  const { vertical } = await params;
  if (!isVertical(vertical)) notFound();

  const config = FLAGSHIP_VERTICALS[vertical];

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const glossary: any = await sanityFetch(glossaryTooltipQuery);
  const linkGlossary = makeGlossaryLinker(glossary || []);

  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", url: baseUrl },
          { name: "Playbook", url: `${baseUrl}/playbook` },
          { name: config.title, url: `${baseUrl}/playbook/${vertical}` },
        ])}
      />
      <JsonLd
        data={faqJsonLd(
          config.faqs.map((f) => ({ question: f.q, answer: f.a }))
        )}
      />

      <section className="bg-gradient-to-br from-zinc-950 via-blue-950 to-zinc-900 py-20 text-white">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <p className="text-sm font-semibold uppercase tracking-wider text-blue-300">
            {config.title} Edition
          </p>
          <h1 className="mt-3 text-4xl font-bold tracking-tight sm:text-5xl">
            {config.heroHeadline}
          </h1>
          <p className="mt-6 max-w-2xl text-lg text-zinc-300">
            {config.heroSubhead}
          </p>

          <div className="mt-12 rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm sm:p-8">
            <p className="text-sm font-semibold uppercase tracking-wider text-blue-300">
              What&apos;s inside
            </p>
            <ul className="mt-4 space-y-2">
              {config.bullets.map((b) => (
                <li key={b} className="flex items-start gap-3 text-zinc-200">
                  <span className="mt-1 text-blue-400">✓</span>
                  <span className="text-sm sm:text-base">{b}</span>
                </li>
              ))}
            </ul>
            <FlagshipSignupForm
              vertical={config.slug}
              verticalTitle={config.title}
              context={`flagship-landing-${config.slug}`}
            />
          </div>

          <div className="mt-8 flex items-baseline justify-center gap-3 rounded-xl bg-white/5 p-4">
            <span className="text-3xl font-bold text-blue-300">
              {config.proofStat.number}
            </span>
            <span className="text-sm text-zinc-300">{config.proofStat.label}</span>
          </div>
        </div>
      </section>

      <section className="bg-white py-16 dark:bg-zinc-950">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <Breadcrumbs
            items={[
              { label: "Playbook", href: "/playbook" },
              { label: config.title },
            ]}
          />

          <div className="mt-8 grid gap-12 md:grid-cols-2">
            <div>
              <h2 className="text-2xl font-bold text-zinc-900 dark:text-white">
                Who it&apos;s for
              </h2>
              <ul className="mt-4 space-y-2 text-zinc-700 dark:text-zinc-300">
                {config.targetAudience.map((a) => (
                  <li key={a} className="flex items-start gap-2">
                    <span className="mt-1 text-blue-500">→</span>
                    <span>{a}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-zinc-900 dark:text-white">
                The 10-day email course
              </h2>
              <ul className="mt-4 space-y-2 text-zinc-700 dark:text-zinc-300">
                {config.cadenceTease.map((c) => (
                  <li key={c} className="flex items-start gap-2">
                    <span className="mt-1 text-blue-500">·</span>
                    <span>{c}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="mt-16 rounded-2xl border border-zinc-200 bg-zinc-50 p-8 dark:border-zinc-800 dark:bg-zinc-900">
            <h2 className="text-2xl font-bold text-zinc-900 dark:text-white">
              Frequently asked
            </h2>
            <div className="mt-6 space-y-6">
              {config.faqs.map((f) => (
                <div key={f.q}>
                  <h3 className="font-semibold text-zinc-900 dark:text-white">
                    {f.q}
                  </h3>
                  <p className="mt-2 text-zinc-600 dark:text-zinc-400">{f.a}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Long-form SEO depth — operator/"build-a-system" intent, kept BELOW
              the conversion fold so it doesn't dilute the signup form above.
              Glossary terms link to /glossary/* (crawlable internal links). */}
          {config.deepDive && config.deepDive.length > 0 && (
            <div className="mt-16 space-y-12">
              {config.deepDive.map((block) => (
                <article key={block.heading}>
                  <h2 className="mb-5 text-2xl font-bold text-zinc-900 dark:text-white sm:text-3xl">
                    {block.heading}
                  </h2>
                  {block.body.split("\n\n").map((para, i) => (
                    <p
                      key={i}
                      className="mb-4 leading-relaxed text-zinc-600 dark:text-zinc-400"
                    >
                      {linkGlossary(para)}
                    </p>
                  ))}
                </article>
              ))}
            </div>
          )}

          {/* Closing CTA — repeat the signup so deep-scrollers can convert
              without scrolling back to the hero form. */}
          <div className="mt-16 rounded-2xl border border-blue-200 bg-blue-50 p-6 dark:border-blue-900/50 dark:bg-blue-950/30 sm:p-8">
            <h2 className="text-2xl font-bold text-zinc-900 dark:text-white">
              Get the {config.title} edition free
            </h2>
            <p className="mt-3 max-w-2xl text-zinc-600 dark:text-zinc-300">
              The complete playbook, workbook, and 10-day email course —
              everything above, built into a system you can run this week.
            </p>
            <FlagshipSignupForm
              vertical={config.slug}
              verticalTitle={config.title}
              context={`flagship-landing-${config.slug}-footer`}
            />
          </div>

          <div className="mt-12 text-center">
            <p className="text-sm text-zinc-500">
              Not your vertical?{" "}
              <Link
                href="/playbook"
                className="font-semibold text-blue-600 hover:text-blue-700 dark:text-blue-400"
              >
                See all editions
              </Link>
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
