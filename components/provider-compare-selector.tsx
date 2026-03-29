"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface ProviderOption {
  name: string;
  slug: string;
}

interface ProviderCompareSelectorProps {
  currentSlug: string;
  providers: ProviderOption[];
}

export function ProviderCompareSelector({
  currentSlug,
  providers,
}: ProviderCompareSelectorProps) {
  const router = useRouter();
  const [selectedSlug, setSelectedSlug] = useState("");

  const otherProviders = providers.filter((p) => p.slug !== currentSlug);

  function handleCompare() {
    if (!selectedSlug) return;
    // Alphabetical ordering for canonical URLs
    const [a, b] =
      currentSlug < selectedSlug
        ? [currentSlug, selectedSlug]
        : [selectedSlug, currentSlug];
    router.push(`/compare/${a}-vs-${b}`);
  }

  return (
    <div className="flex items-center gap-2">
      <select
        value={selectedSlug}
        onChange={(e) => setSelectedSlug(e.target.value)}
        className="rounded-lg border border-zinc-600 bg-zinc-800/80 px-3 py-2.5 text-sm text-white backdrop-blur-sm"
      >
        <option value="">Compare with...</option>
        {otherProviders.map((p) => (
          <option key={p.slug} value={p.slug}>
            {p.name}
          </option>
        ))}
      </select>
      <button
        onClick={handleCompare}
        disabled={!selectedSlug}
        className="rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
      >
        Compare
      </button>
    </div>
  );
}
