import Link from "next/link";

interface LeadTypeCardProps {
  title: string;
  slug: string;
  shortDescription: string;
  icon?: string;
}

export function LeadTypeCard({
  title,
  slug,
  shortDescription,
  icon,
}: LeadTypeCardProps) {
  return (
    <div className="group relative flex flex-col rounded-xl border border-zinc-200 bg-white p-6 transition-all hover:border-blue-300 hover:shadow-lg dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-blue-700">
      {icon && (
        <span className="mb-3 text-3xl" aria-hidden="true">
          {icon}
        </span>
      )}
      <h3 className="text-lg font-semibold text-zinc-900 dark:text-white">
        <Link href={`/lead-types/${slug}`} className="after:absolute after:inset-0">
          {title}
        </Link>
      </h3>
      <p className="mt-2 flex-1 text-sm text-zinc-600 dark:text-zinc-400">
        {shortDescription}
      </p>
      <div className="mt-4 flex items-center gap-3">
        <span className="text-sm font-medium text-blue-600 dark:text-blue-400">
          Learn more &rarr;
        </span>
      </div>
    </div>
  );
}
