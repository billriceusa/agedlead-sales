interface ExpandableDeepDiveProps {
  title: string;
  children: React.ReactNode;
}

export function ExpandableDeepDive({ title, children }: ExpandableDeepDiveProps) {
  return (
    <details className="group my-6 rounded-lg border border-zinc-200 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900">
      <summary className="flex cursor-pointer select-none items-center justify-between px-5 py-4 text-sm font-semibold text-zinc-900 dark:text-white">
        <span>{title}</span>
        <svg
          className="h-4 w-4 shrink-0 text-zinc-400 transition-transform duration-200 group-open:rotate-180"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </summary>
      <div className="border-t border-zinc-200 px-5 py-4 text-sm leading-relaxed text-zinc-600 dark:border-zinc-800 dark:text-zinc-400">
        {children}
      </div>
    </details>
  );
}
