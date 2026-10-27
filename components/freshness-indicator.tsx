interface FreshnessIndicatorProps {
  /**
   * When a human last read this profile and confirmed it still describes what
   * the company sells. Editorial. Only ever advanced by a person.
   */
  lastVerified: string; // ISO date string
  /**
   * When the automated marketwatch scan last ran against this provider, if
   * ever. NOT a review — see the note below.
   */
  lastScanned?: string;
}

/**
 * WHY THIS SHOWS TWO DATES (2026-10-07)
 *
 * It used to show one, labelled "Verified", and that label was doing work the
 * underlying check could not support.
 *
 * The marketwatch cron stamped `lastVerified` on every successful scan, with a
 * comment explaining that otherwise the freshness indicator "never advances".
 * So all fifteen providers displayed "Verified Sep 2026" while the human review
 * dates underneath were 138-160 days old. The scan is a real content
 * extraction, but it looks for PRICING AND POLICY CHANGES — which is how it
 * reported zero changes for LeadsData across weeks in which that company
 * stopped selling aged leads entirely and became a behavior-analytics SaaS. A
 * separate data file caught it on 2026-09-02 and flagged it for editorial
 * review; nothing routed the flag anywhere, and it sat for 33 days.
 *
 * On a directory whose entire value proposition is independent verification,
 * telling readers something was "verified" when only its pricing was diffed is
 * the one claim we cannot afford to be loose about. So the two facts are now
 * separate and separately labelled: a human review date that only a human
 * advances, and an automated scan date that says exactly what it is.
 *
 * The colour tracks the REVIEW date, not the scan, because the review is the
 * claim a reader is relying on. A nightly scan must not be able to turn a
 * stale profile green.
 */
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

export function FreshnessIndicator({ lastVerified, lastScanned }: FreshnessIndicatorProps) {
  const days = getDaysSince(lastVerified);

  let dotColor: string;
  let label: string;

  if (days <= 60) {
    dotColor = "bg-green-500";
    label = `Reviewed ${formatDate(lastVerified)}`;
  } else if (days <= 120) {
    dotColor = "bg-yellow-500";
    label = `Reviewed ${formatDate(lastVerified)}`;
  } else {
    dotColor = "bg-red-500";
    label = `Last reviewed ${formatDate(lastVerified)} — may be outdated`;
  }

  // Only worth showing when it is actually newer than the review; otherwise it
  // is noise. Phrased as a scan, never as a verification.
  const showScan =
    !!lastScanned && new Date(lastScanned).getTime() > new Date(lastVerified).getTime();

  return (
    <span className="inline-flex flex-wrap items-center gap-x-1.5 gap-y-0.5 text-xs text-zinc-500 dark:text-zinc-400">
      <span className={`inline-block h-2 w-2 shrink-0 rounded-full ${dotColor}`} />
      <span>{label}</span>
      {showScan && (
        <span
          className="text-zinc-400 dark:text-zinc-500"
          title="An automated check of this provider's public pricing and policy pages. It is not an editorial review."
        >
          · automated price check {formatDate(lastScanned!)}
        </span>
      )}
    </span>
  );
}
