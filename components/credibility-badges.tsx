interface CredibilityBadgesProps {
  publishedAt?: string;
  updatedAt?: string;
  authorName?: string;
  authorRole?: string;
}

export function CredibilityBadges({
  publishedAt,
  updatedAt,
  authorName = "Bill Rice",
  authorRole = "Lead Conversion Expert",
}: CredibilityBadgesProps) {
  // Only show "Updated" if it differs from published by more than 1 day
  const showUpdated =
    updatedAt &&
    publishedAt &&
    updatedAt.split("T")[0] !== publishedAt.split("T")[0];

  return (
    <div className="mt-4 flex flex-wrap items-center gap-3">
      {showUpdated && (
        <span className="text-xs text-zinc-500">
          Updated{" "}
          <time dateTime={updatedAt}>
            {new Date(updatedAt).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            })}
          </time>
        </span>
      )}

      <span className="inline-flex items-center gap-1 rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800 dark:bg-green-900/30 dark:text-green-400">
        <svg
          className="h-3 w-3"
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path
            fillRule="evenodd"
            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
            clipRule="evenodd"
          />
        </svg>
        Human-reviewed
      </span>

      <span className="text-xs text-zinc-500 dark:text-zinc-400">
        Reviewed by {authorName}, {authorRole}
      </span>
    </div>
  );
}
