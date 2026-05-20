import { ProviderRatingBadge } from "./provider-rating-badge";
import { ProviderRatingBar } from "./provider-rating-bar";
import { FreshnessIndicator } from "./freshness-indicator";
import type { ProviderData } from "@/data/providers";

interface ComparisonTableProps {
  providerA: ProviderData;
  providerB: ProviderData;
}

const LEAD_TYPE_LABELS: Record<string, string> = {
  aged: "Aged",
  "real-time": "Real-Time",
  "live-transfer": "Live Transfer",
  trigger: "Trigger",
  "data-list": "Data List",
  "direct-mail": "Direct Mail",
};

const COMPLIANCE_LABELS: Record<string, string> = {
  "tcpa-docs": "TCPA Paperwork",
  "dnc-scrubbing": "DNC Scrub",
};

function WinnerDot({ a, b }: { a: number; b: number }) {
  if (a === b) return null;
  return (
    <span
      className={`inline-block h-2 w-2 rounded-full ${
        a > b ? "bg-green-500" : "bg-zinc-300 dark:bg-zinc-600"
      }`}
    />
  );
}

export function ComparisonTable({
  providerA,
  providerB,
}: ComparisonTableProps) {
  const dimensions = [
    { label: "Pricing Transparency", keyA: providerA.ratingTransparency, keyB: providerB.ratingTransparency },
    { label: "Value", keyA: providerA.ratingValue, keyB: providerB.ratingValue },
    { label: "Data Quality & Compliance", keyA: providerA.ratingCompliance, keyB: providerB.ratingCompliance },
    { label: "Flexibility", keyA: providerA.ratingFlexibility, keyB: providerB.ratingFlexibility },
    { label: "Platform & Delivery", keyA: providerA.ratingPlatform, keyB: providerB.ratingPlatform },
    { label: "Reputation", keyA: providerA.ratingReputation, keyB: providerB.ratingReputation },
  ];

  const aWins = dimensions.filter((d) => d.keyA > d.keyB).length;
  const bWins = dimensions.filter((d) => d.keyB > d.keyA).length;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="grid grid-cols-2 gap-6">
        <div className="text-center">
          <ProviderRatingBadge score={providerA.overallRating} size="lg" />
          <h2 className="mt-3 text-xl font-bold text-zinc-900 dark:text-white">
            {providerA.name}
          </h2>
          <FreshnessIndicator lastVerified={providerA.lastVerified} />
        </div>
        <div className="text-center">
          <ProviderRatingBadge score={providerB.overallRating} size="lg" />
          <h2 className="mt-3 text-xl font-bold text-zinc-900 dark:text-white">
            {providerB.name}
          </h2>
          <FreshnessIndicator lastVerified={providerB.lastVerified} />
        </div>
      </div>

      {/* Summary */}
      <div className="rounded-lg border border-zinc-200 bg-zinc-50 p-4 text-center dark:border-zinc-700 dark:bg-zinc-800">
        <p className="text-sm text-zinc-600 dark:text-zinc-400">
          <strong className="text-zinc-900 dark:text-white">
            {providerA.name}
          </strong>{" "}
          wins on {aWins} dimension{aWins !== 1 && "s"} &middot;{" "}
          <strong className="text-zinc-900 dark:text-white">
            {providerB.name}
          </strong>{" "}
          wins on {bWins} dimension{bWins !== 1 && "s"}
          {aWins === bWins && " — it's a close match"}
        </p>
      </div>

      {/* Rating Dimensions */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-zinc-900 dark:text-white">
          Ratings Comparison
        </h3>
        {dimensions.map((dim) => (
          <div key={dim.label} className="space-y-2">
            <div className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
              {dim.label}
            </div>
            <div className="grid grid-cols-2 gap-6">
              <div className="flex items-center gap-2">
                <WinnerDot a={dim.keyA} b={dim.keyB} />
                <div className="flex-1">
                  <div className="h-2 w-full rounded-full bg-zinc-200 dark:bg-zinc-700">
                    <div
                      className={`h-2 rounded-full ${dim.keyA >= 7 ? "bg-green-500" : dim.keyA >= 4 ? "bg-yellow-500" : "bg-red-500"}`}
                      style={{ width: `${(dim.keyA / 10) * 100}%` }}
                    />
                  </div>
                </div>
                <span className="w-6 text-right text-sm font-semibold text-zinc-900 dark:text-white">
                  {dim.keyA}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <WinnerDot a={dim.keyB} b={dim.keyA} />
                <div className="flex-1">
                  <div className="h-2 w-full rounded-full bg-zinc-200 dark:bg-zinc-700">
                    <div
                      className={`h-2 rounded-full ${dim.keyB >= 7 ? "bg-green-500" : dim.keyB >= 4 ? "bg-yellow-500" : "bg-red-500"}`}
                      style={{ width: `${(dim.keyB / 10) * 100}%` }}
                    />
                  </div>
                </div>
                <span className="w-6 text-right text-sm font-semibold text-zinc-900 dark:text-white">
                  {dim.keyB}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Feature Comparison */}
      <div className="overflow-hidden rounded-xl border border-zinc-200 dark:border-zinc-700">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-zinc-200 bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-800">
              <th className="px-4 py-3 text-left font-medium text-zinc-600 dark:text-zinc-400">
                Feature
              </th>
              <th className="px-4 py-3 text-left font-medium text-zinc-600 dark:text-zinc-400">
                {providerA.name}
              </th>
              <th className="px-4 py-3 text-left font-medium text-zinc-600 dark:text-zinc-400">
                {providerB.name}
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-200 dark:divide-zinc-700">
            <tr>
              <td className="px-4 py-3 font-medium text-zinc-700 dark:text-zinc-300">
                Founded
              </td>
              <td className="px-4 py-3 text-zinc-600 dark:text-zinc-400">
                {providerA.foundedYear}
              </td>
              <td className="px-4 py-3 text-zinc-600 dark:text-zinc-400">
                {providerB.foundedYear}
              </td>
            </tr>
            <tr>
              <td className="px-4 py-3 font-medium text-zinc-700 dark:text-zinc-300">
                BBB Rating
              </td>
              <td className="px-4 py-3 text-zinc-600 dark:text-zinc-400">
                {providerA.bbbRating}
              </td>
              <td className="px-4 py-3 text-zinc-600 dark:text-zinc-400">
                {providerB.bbbRating}
              </td>
            </tr>
            <tr>
              <td className="px-4 py-3 font-medium text-zinc-700 dark:text-zinc-300">
                Lead Types
              </td>
              <td className="px-4 py-3 text-zinc-600 dark:text-zinc-400">
                {providerA.leadTypes.map((lt) => LEAD_TYPE_LABELS[lt] || lt).join(", ")}
              </td>
              <td className="px-4 py-3 text-zinc-600 dark:text-zinc-400">
                {providerB.leadTypes.map((lt) => LEAD_TYPE_LABELS[lt] || lt).join(", ")}
              </td>
            </tr>
            <tr>
              <td className="px-4 py-3 font-medium text-zinc-700 dark:text-zinc-300">
                Pricing Model
              </td>
              <td className="px-4 py-3 text-zinc-600 dark:text-zinc-400">
                {providerA.pricingModel}
              </td>
              <td className="px-4 py-3 text-zinc-600 dark:text-zinc-400">
                {providerB.pricingModel}
              </td>
            </tr>
            <tr>
              <td className="px-4 py-3 font-medium text-zinc-700 dark:text-zinc-300">
                Minimums
              </td>
              <td className="px-4 py-3 text-zinc-600 dark:text-zinc-400">
                {providerA.hasMinimums ? providerA.minimumDescription || "Yes" : "No"}
              </td>
              <td className="px-4 py-3 text-zinc-600 dark:text-zinc-400">
                {providerB.hasMinimums ? providerB.minimumDescription || "Yes" : "No"}
              </td>
            </tr>
            <tr>
              <td className="px-4 py-3 font-medium text-zinc-700 dark:text-zinc-300">
                Contract
              </td>
              <td className="px-4 py-3 text-zinc-600 dark:text-zinc-400">
                {providerA.contractRequired ? "Required" : "No contract"}
              </td>
              <td className="px-4 py-3 text-zinc-600 dark:text-zinc-400">
                {providerB.contractRequired ? "Required" : "No contract"}
              </td>
            </tr>
            <tr>
              <td className="px-4 py-3 font-medium text-zinc-700 dark:text-zinc-300">
                Return Policy
              </td>
              <td className="px-4 py-3 text-zinc-600 dark:text-zinc-400">
                {providerA.returnPolicy}
              </td>
              <td className="px-4 py-3 text-zinc-600 dark:text-zinc-400">
                {providerB.returnPolicy}
              </td>
            </tr>
            <tr>
              <td className="px-4 py-3 font-medium text-zinc-700 dark:text-zinc-300">
                Compliance
              </td>
              <td className="px-4 py-3 text-zinc-600 dark:text-zinc-400">
                {providerA.complianceFeatures
                  .map((cf) => COMPLIANCE_LABELS[cf] || cf)
                  .join(", ")}
              </td>
              <td className="px-4 py-3 text-zinc-600 dark:text-zinc-400">
                {providerB.complianceFeatures
                  .map((cf) => COMPLIANCE_LABELS[cf] || cf)
                  .join(", ")}
              </td>
            </tr>
            <tr>
              <td className="px-4 py-3 font-medium text-zinc-700 dark:text-zinc-300">
                Verticals
              </td>
              <td className="px-4 py-3 text-zinc-600 dark:text-zinc-400">
                {providerA.verticals.length} verticals
              </td>
              <td className="px-4 py-3 text-zinc-600 dark:text-zinc-400">
                {providerB.verticals.length} verticals
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
