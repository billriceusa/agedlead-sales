interface FreshnessIndicatorProps {
  lastVerified: string; // ISO date string
}

function getDaysSince(dateStr: string): number {
  const now = new Date();
  const then = new Date(dateStr);
  return Math.floor((now.getTime() - then.getTime()) / (1000 * 60 * 60 * 24));
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "short",
    year: "numeric",
  });
}

export function FreshnessIndicator({ lastVerified }: FreshnessIndicatorProps) {
  const days = getDaysSince(lastVerified);

  let dotColor: string;
  let label: string;

  if (days <= 30) {
    dotColor = "bg-green-500";
    label = `Verified ${formatDate(lastVerified)}`;
  } else if (days <= 60) {
    dotColor = "bg-yellow-500";
    label = `Verified ${formatDate(lastVerified)}`;
  } else {
    dotColor = "bg-red-500";
    label = `Last verified ${formatDate(lastVerified)} — may be outdated`;
  }

  return (
    <span className="inline-flex items-center gap-1.5 text-xs text-zinc-500 dark:text-zinc-400">
      <span className={`inline-block h-2 w-2 rounded-full ${dotColor}`} />
      {label}
    </span>
  );
}
