interface ProviderRatingBarProps {
  label: string;
  score: number;
  weight?: string;
}

function getBarColor(score: number): string {
  if (score >= 7) return "bg-green-500 dark:bg-green-400";
  if (score >= 4) return "bg-yellow-500 dark:bg-yellow-400";
  return "bg-red-500 dark:bg-red-400";
}

export function ProviderRatingBar({
  label,
  score,
  weight,
}: ProviderRatingBarProps) {
  const widthPercent = (score / 10) * 100;

  return (
    <div className="flex items-center gap-3">
      <div className="w-44 shrink-0">
        <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
          {label}
        </span>
        {weight && (
          <span className="ml-1 text-xs text-zinc-400 dark:text-zinc-500">
            ({weight})
          </span>
        )}
      </div>
      <div className="flex-1">
        <div className="h-2.5 w-full rounded-full bg-zinc-200 dark:bg-zinc-700">
          <div
            className={`h-2.5 rounded-full transition-all ${getBarColor(score)}`}
            style={{ width: `${widthPercent}%` }}
          />
        </div>
      </div>
      <span className="w-8 text-right text-sm font-semibold text-zinc-900 dark:text-white">
        {score}
      </span>
    </div>
  );
}
