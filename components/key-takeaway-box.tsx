import Link from "next/link";

interface KeyTakeawayBoxProps {
  excerpt: string;
  firstHeadingId?: string;
}

export function KeyTakeawayBox({ excerpt, firstHeadingId }: KeyTakeawayBoxProps) {
  if (!excerpt) return null;

  // Split excerpt into bullet points on sentence boundaries
  const sentences = excerpt
    .split(/(?<=[.!?])\s+/)
    .filter((s) => s.trim().length > 10)
    .slice(0, 5);

  // Fall back to full excerpt if splitting doesn't produce good results
  const useBullets = sentences.length >= 2;

  return (
    <div className="key-takeaway-box mb-8 rounded-lg border-l-4 border-blue-500 bg-blue-50 p-5 dark:bg-blue-950/30">
      <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-blue-700 dark:text-blue-400">
        Key Takeaways
      </p>
      {useBullets ? (
        <ul className="space-y-1.5 text-sm leading-relaxed text-zinc-700 dark:text-zinc-300">
          {sentences.map((sentence, i) => (
            <li key={i} className="flex gap-2">
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-blue-500" />
              <span>{sentence}</span>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-sm leading-relaxed text-zinc-700 dark:text-zinc-300">
          {excerpt}
        </p>
      )}
      {firstHeadingId && (
        <Link
          href={`#${firstHeadingId}`}
          className="mt-3 inline-block text-sm font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400"
        >
          Read full analysis &darr;
        </Link>
      )}
    </div>
  );
}
