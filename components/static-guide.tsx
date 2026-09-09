import Link from "next/link";
import type { ReactNode } from "react";
import type { GuideData } from "@/data/guides";
import { EmailSequence } from "@/components/email-sequence";
import { ComplianceCallout } from "@/components/compliance-callout";
import { ToolTable } from "@/components/tool-table";
import { CtaBanner } from "@/components/cta-banner";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { JsonLd, breadcrumbJsonLd, faqJsonLd } from "@/components/json-ld";

/**
 * Renders a code-backed operator guide from `data/guides.ts`.
 *
 * Kept out of the route file so the Sanity path and the static path stay legible side by
 * side — the route decides which one applies, this decides how a static one looks.
 *
 * WHAT THIS FIXES THAT `/guides` DID NOT DO
 *
 * The Sanity guide template emits breadcrumb JSON-LD only and renders PortableText
 * WITHOUT the `glossary` prop, so the entire guides tier has had no glossary auto-linking
 * and no FAQ markup. This emits FAQ JSON-LD and takes a `linkGlossary` closure, matching
 * what `app/(site)/lead-types/[slug]/page.tsx` already does.
 *
 * The FAQ markup is emitted ONLY alongside the visible FAQ section below. Structured data
 * for questions a reader cannot see is a Google policy violation, and this codebase
 * already has one instance of that bug on the lead-type route.
 */
export interface StaticGuideProps {
  guide: GuideData;
  baseUrl: string;
  /** From `makeGlossaryLinker(glossary)`. Falls back to identity when unavailable. */
  linkGlossary?: (text: string) => ReactNode;
}

/** Paragraph splitter shared by every prose field. "\n\n" is the repo-wide convention. */
function paras(body: string, link: (t: string) => ReactNode) {
  return body
    .split("\n\n")
    .filter(Boolean)
    .map((p, i) => (
      <p key={i} className="mb-4 leading-relaxed text-zinc-700 dark:text-zinc-300">
        {link(p)}
      </p>
    ));
}

export function StaticGuide({ guide, baseUrl, linkGlossary }: StaticGuideProps) {
  const link = linkGlossary ?? ((t: string) => t);
  const url = `${baseUrl}/guides/${guide.slug}`;

  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", url: baseUrl },
          { name: "Guides", url: `${baseUrl}/guides` },
          { name: guide.title, url },
        ])}
      />
      {guide.faqs.length > 0 && <JsonLd data={faqJsonLd(guide.faqs)} />}

      <article className="bg-white py-12 dark:bg-zinc-950">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <Breadcrumbs items={[{ label: "Guides", href: "/guides" }, { label: guide.title }]} />

          <header className="mb-8">
            <span className="mb-3 inline-block text-sm text-zinc-500">
              {guide.estimatedMinutes} min read &middot; updated{" "}
              {new Date(guide.updatedAt + "T12:00:00Z").toLocaleDateString("en-US", {
                month: "long",
                day: "numeric",
                year: "numeric",
                timeZone: "UTC",
              })}
            </span>
            <h1 className="text-4xl font-bold tracking-tight text-zinc-900 dark:text-white">
              {guide.title}
            </h1>
          </header>

          {/* The direct answer, first. Written for answer engines as much as readers —
              a citable guide leads with the conclusion instead of building to it. */}
          <div className="mb-10 rounded-xl border-l-4 border-blue-500 bg-blue-50 p-6 dark:bg-blue-950/30">
            <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-blue-700 dark:text-blue-400">
              The short version
            </p>
            <p className="leading-relaxed text-zinc-800 dark:text-zinc-200">{guide.summary}</p>
          </div>

          {guide.sections.map((section) => (
            <section key={section.heading} className="mb-8">
              <h2 className="mb-3 text-2xl font-bold text-zinc-900 dark:text-white">
                {link(section.heading)}
              </h2>
              {paras(section.body, link)}
            </section>
          ))}

          {guide.plays && guide.plays.length > 0 && (
            <section className="mb-10">
              <h2 className="mb-2 text-2xl font-bold text-zinc-900 dark:text-white">
                The six plays
              </h2>
              <p className="mb-6 leading-relaxed text-zinc-600 dark:text-zinc-400">
                Each one converts a moment of engagement into permission that names you. Run
                whichever fit your operation; they compound.
              </p>
              <ol className="space-y-5">
                {guide.plays.map((play) => (
                  <li
                    key={play.number}
                    className="rounded-xl border-2 border-zinc-200 p-6 dark:border-zinc-800"
                  >
                    <div className="mb-3 flex items-baseline gap-3">
                      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-blue-100 text-sm font-bold text-blue-800 dark:bg-blue-900/40 dark:text-blue-300">
                        {play.number}
                      </span>
                      <h3 className="text-lg font-semibold text-zinc-900 dark:text-white">
                        {play.name}
                      </h3>
                    </div>
                    {paras(play.body, link)}
                    {play.script && (
                      <>
                        <p className="mb-2 mt-4 text-xs font-semibold uppercase tracking-wider text-zinc-500">
                          Language to lift
                        </p>
                        <blockquote className="border-l-4 border-blue-400 pl-4 text-sm italic leading-relaxed text-zinc-700 dark:text-zinc-300">
                          {play.script}
                        </blockquote>
                      </>
                    )}
                  </li>
                ))}
              </ol>
            </section>
          )}

          {guide.emailSequence && guide.emailSequence.length > 0 && (
            <EmailSequence steps={guide.emailSequence} intro={guide.sequenceIntro} />
          )}

          <ComplianceCallout
            heading={guide.compliance.heading}
            body={guide.compliance.body}
            rules={guide.compliance.rules}
            tone={guide.compliance.tone}
            learnMoreHref={guide.compliance.learnMoreHref}
          />

          {guide.tools && guide.tools.length > 0 && (
            <ToolTable rows={guide.tools} intro={guide.toolsIntro} />
          )}

          {guide.buildSpecs && guide.buildSpecs.length > 0 && (
            <section className="my-10">
              <h2 className="mb-2 text-2xl font-bold text-zinc-900 dark:text-white">
                The build specs
              </h2>
              <p className="mb-6 leading-relaxed text-zinc-600 dark:text-zinc-400">
                Markdown, not PDF — the point is to paste them straight into a coding agent.
              </p>
              <ul className="space-y-3">
                {guide.buildSpecs.map((spec) => (
                  <li
                    key={spec.href}
                    className="rounded-xl border border-zinc-200 p-5 dark:border-zinc-800"
                  >
                    <a
                      href={spec.href}
                      className="font-semibold text-blue-700 underline dark:text-blue-400"
                      download
                    >
                      {spec.label}
                    </a>
                    <p className="mt-1 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
                      {spec.description}
                    </p>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {guide.faqs.length > 0 && (
            <section className="my-10">
              <h2 className="mb-5 text-2xl font-bold text-zinc-900 dark:text-white">
                Common questions
              </h2>
              <div className="space-y-5">
                {guide.faqs.map((faq) => (
                  <div key={faq.question}>
                    <h3 className="mb-2 font-semibold text-zinc-900 dark:text-white">
                      {faq.question}
                    </h3>
                    <p className="leading-relaxed text-zinc-600 dark:text-zinc-400">
                      {link(faq.answer)}
                    </p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {guide.related && guide.related.length > 0 && (
            <section className="my-10 border-t border-zinc-200 pt-8 dark:border-zinc-800">
              <h2 className="mb-4 text-lg font-semibold text-zinc-900 dark:text-white">
                Keep reading
              </h2>
              <ul className="space-y-2">
                {guide.related.map((r) => (
                  <li key={r.href}>
                    <Link
                      href={r.href}
                      className="text-blue-700 underline hover:text-blue-800 dark:text-blue-400"
                    >
                      {r.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          )}
        </div>
      </article>

      <CtaBanner variant="compact" campaign="guide" />
    </>
  );
}
