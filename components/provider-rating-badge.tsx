interface ProviderRatingBadgeProps {
  score: number;
  size?: "sm" | "md" | "lg";
}

function getRatingColor(score: number): string {
  if (score >= 7) return "text-green-600 dark:text-green-400";
  if (score >= 4) return "text-yellow-600 dark:text-yellow-400";
  return "text-red-600 dark:text-red-400";
}

function getRatingBg(score: number): string {
  if (score >= 7) return "bg-green-50 border-green-200 dark:bg-green-950/30 dark:border-green-800";
  if (score >= 4) return "bg-yellow-50 border-yellow-200 dark:bg-yellow-950/30 dark:border-yellow-800";
  return "bg-red-50 border-red-200 dark:bg-red-950/30 dark:border-red-800";
}

const sizeClasses = {
  sm: "h-10 w-10 text-sm",
  md: "h-14 w-14 text-lg",
  lg: "h-20 w-20 text-2xl",
};

export function ProviderRatingBadge({
  score,
  size = "md",
}: ProviderRatingBadgeProps) {
  return (
    <div
      className={`inline-flex items-center justify-center rounded-full border font-bold ${getRatingColor(score)} ${getRatingBg(score)} ${sizeClasses[size]}`}
      title={`${score}/10 overall rating`}
    >
      {score.toFixed(1)}
    </div>
  );
}
