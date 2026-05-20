import Link from "next/link";
import { ProviderRatingBadge } from "./provider-rating-badge";
import { FreshnessIndicator } from "./freshness-indicator";

interface ProviderCardProps {
  name: string;
  slug: string;
  shortDescription: string;
  overallRating: number;
  lastVerified: string;
  pricingModel: string;
  leadTypes: string[];
  verticals: { name: string; slug: string; icon?: string }[];
  isFeatured?: boolean;
}

const LEAD_TYPE_LABELS: Record<string, string> = {
  aged: "Aged",
  "real-time": "Real-Time",
  "live-transfer": "Live Transfer",
  trigger: "Trigger",
  "data-list": "Data List",
  "direct-mail": "Direct Mail",
};

const PRICING_LABELS: Record<string, string> = {
  transparent: "Transparent Pricing",
  "semi-transparent": "Semi-Transparent",
  "sales-required": "Contact for Pricing",
};

export function ProviderCard({
  name,
  slug,
  shortDescription,
  overallRating,
  lastVerified,
  pricingModel,
  leadTypes,
  verticals,
  isFeatured,
}: ProviderCardProps) {
  return (
    <div
      className={`group relative flex flex-col rounded-xl border bg-white p-6 transition-all hover:shadow-lg dark:bg-zinc-900 ${
        isFeatured
          ? "border-blue-400 ring-1 ring-blue-400/40 hover:border-blue-500 dark:border-blue-500 dark:ring-blue-500/30 dark:hover:border-blue-400"
          : "border-zinc-200 hover:border-blue-300 dark:border-zinc-800 dark:hover:border-blue-700"
      }`}
    >
      {isFeatured && (
        <span className="absolute -top-2 left-4 rounded-full bg-blue-600 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-white shadow-sm">
          Featured Partner
        </span>
      )}
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <h3 className="text-lg font-semibold text-zinc-900 dark:text-white">
            <Link
              href={`/providers/${slug}`}
              className="after:absolute after:inset-0"
            >
              {name}
            </Link>
          </h3>
          <FreshnessIndicator lastVerified={lastVerified} />
        </div>
        <ProviderRatingBadge score={overallRating} size="sm" />
      </div>

      <p className="mt-3 flex-1 text-sm text-zinc-600 dark:text-zinc-400">
        {shortDescription}
      </p>

      {/* Lead Types */}
      <div className="mt-3 flex flex-wrap gap-1.5">
        {leadTypes.map((lt) => (
          <span
            key={lt}
            className="rounded-full bg-zinc-100 px-2 py-0.5 text-xs font-medium text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400"
          >
            {LEAD_TYPE_LABELS[lt] || lt}
          </span>
        ))}
      </div>

      {/* Verticals (show up to 4) */}
      <div className="mt-2 flex flex-wrap gap-1">
        {verticals.slice(0, 4).map((v) => (
          <span
            key={v.slug}
            className="text-xs text-zinc-500 dark:text-zinc-500"
          >
            {v.icon} {v.name}
          </span>
        ))}
        {verticals.length > 4 && (
          <span className="text-xs text-zinc-400 dark:text-zinc-500">
            +{verticals.length - 4} more
          </span>
        )}
      </div>

      <div className="mt-4 flex items-center justify-between">
        <span className="text-xs text-zinc-500 dark:text-zinc-400">
          {PRICING_LABELS[pricingModel] || pricingModel}
        </span>
        <span className="relative z-10 text-sm font-medium text-blue-600 dark:text-blue-400">
          View Profile &rarr;
        </span>
      </div>
    </div>
  );
}
