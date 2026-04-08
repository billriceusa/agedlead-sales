import Link from "next/link";

interface StatCardProps {
  value: string;
  label: string;
  context?: string;
  sourceLabel?: string;
  sourceHref?: string;
}

export function StatCard({
  value,
  label,
  context,
  sourceLabel,
  sourceHref,
}: StatCardProps) {
  return (
    <div className="rounded-xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900">
      <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">
        {value}
      </p>
      <p className="mt-1 text-sm font-medium text-zinc-900 dark:text-white">
        {label}
      </p>
      {context && (
        <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
          {context}
        </p>
      )}
      {sourceLabel && sourceHref && (
        <Link
          href={sourceHref}
          className="mt-2 inline-block text-xs text-zinc-400 underline decoration-zinc-300 hover:text-zinc-600 dark:text-zinc-500 dark:decoration-zinc-700"
        >
          Source: {sourceLabel}
        </Link>
      )}
    </div>
  );
}
