import Link from "next/link";

export interface RelatedLink {
  href: string;
  label: string;
  description?: string;
}

/**
 * A clean grid of internal cross-links used to tie the vertical content cluster
 * together (lead-type guide ↔ price index ↔ best providers ↔ provider profile).
 * Pure server component — the links are real crawlable <a> tags in the SSR HTML,
 * which is the whole point: concentrate internal link equity on the high-demand
 * commercial pages.
 */
export function RelatedLinks({
  title = "Related resources",
  intro,
  links,
}: {
  title?: string;
  intro?: string;
  links: (RelatedLink | null | undefined)[];
}) {
  // Dedupe by href and drop empties so callers can pass conditional entries.
  const seen = new Set<string>();
  const items = links.filter((l): l is RelatedLink => {
    if (!l || !l.href || seen.has(l.href)) return false;
    seen.add(l.href);
    return true;
  });
  if (items.length === 0) return null;

  return (
    <section className="border-t border-zinc-200 bg-zinc-50 py-12 dark:border-zinc-800 dark:bg-zinc-900">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <h2 className="text-xl font-bold text-zinc-900 dark:text-white">
          {title}
        </h2>
        {intro && (
          <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
            {intro}
          </p>
        )}
        <ul className="mt-6 grid gap-3 sm:grid-cols-2">
          {items.map((l) => (
            <li key={l.href}>
              <Link
                href={l.href}
                className="group flex h-full flex-col rounded-lg border border-zinc-200 bg-white p-4 transition-colors hover:border-blue-300 dark:border-zinc-800 dark:bg-zinc-950 dark:hover:border-blue-700"
              >
                <span className="text-sm font-semibold text-blue-600 group-hover:text-blue-700 dark:text-blue-400">
                  {l.label} &rarr;
                </span>
                {l.description && (
                  <span className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
                    {l.description}
                  </span>
                )}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
