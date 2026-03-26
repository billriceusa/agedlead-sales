"use client";

import { useState, useEffect, useCallback } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { affiliateUrl } from "@/lib/affiliate";

export function RoiCalculator() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const [budget, setBudget] = useState(() => Number(searchParams.get("budget")) || 500);
  const [realTimeCost, setRealTimeCost] = useState(() => Number(searchParams.get("rtCost")) || 30);
  const [agedCost, setAgedCost] = useState(() => Number(searchParams.get("agCost")) || 1);
  const [realTimeConversion, setRealTimeConversion] = useState(() => Number(searchParams.get("rtConv")) || 8);
  const [agedConversion, setAgedConversion] = useState(() => Number(searchParams.get("agConv")) || 2);
  const [dealValue, setDealValue] = useState(() => Number(searchParams.get("deal")) || 1000);
  const [copied, setCopied] = useState(false);

  const buildShareUrl = useCallback(() => {
    const params = new URLSearchParams();
    if (budget !== 500) params.set("budget", String(budget));
    if (realTimeCost !== 30) params.set("rtCost", String(realTimeCost));
    if (agedCost !== 1) params.set("agCost", String(agedCost));
    if (realTimeConversion !== 8) params.set("rtConv", String(realTimeConversion));
    if (agedConversion !== 2) params.set("agConv", String(agedConversion));
    if (dealValue !== 1000) params.set("deal", String(dealValue));
    const qs = params.toString();
    return `${window.location.origin}${pathname}${qs ? `?${qs}` : ""}`;
  }, [budget, realTimeCost, agedCost, realTimeConversion, agedConversion, dealValue, pathname]);

  useEffect(() => {
    const params = new URLSearchParams();
    if (budget !== 500) params.set("budget", String(budget));
    if (realTimeCost !== 30) params.set("rtCost", String(realTimeCost));
    if (agedCost !== 1) params.set("agCost", String(agedCost));
    if (realTimeConversion !== 8) params.set("rtConv", String(realTimeConversion));
    if (agedConversion !== 2) params.set("agConv", String(agedConversion));
    if (dealValue !== 1000) params.set("deal", String(dealValue));
    const qs = params.toString();
    router.replace(`${pathname}${qs ? `?${qs}` : ""}`, { scroll: false });
  }, [budget, realTimeCost, agedCost, realTimeConversion, agedConversion, dealValue, pathname, router]);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(buildShareUrl());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const realTimeLeads = Math.floor(budget / realTimeCost);
  const agedLeads = Math.floor(budget / agedCost);
  const realTimeSales = Math.round(realTimeLeads * (realTimeConversion / 100));
  const agedSales = Math.round(agedLeads * (agedConversion / 100));
  const realTimeRevenue = realTimeSales * dealValue;
  const agedRevenue = agedSales * dealValue;
  const realTimeRoi = budget > 0 ? Math.round(((realTimeRevenue - budget) / budget) * 100) : 0;
  const agedRoi = budget > 0 ? Math.round(((agedRevenue - budget) / budget) * 100) : 0;

  return (
    <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900 sm:p-8">
      <h2 className="mb-6 text-2xl font-bold text-zinc-900 dark:text-white">
        Calculate Your ROI
      </h2>

      {/* Inputs */}
      <div className="mb-8 grid gap-5 sm:grid-cols-2">
        <div>
          <label className="mb-1.5 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
            Monthly Lead Budget ($)
          </label>
          <input
            type="number"
            value={budget}
            onChange={(e) => setBudget(Number(e.target.value))}
            min={0}
            className="w-full rounded-lg border border-zinc-300 bg-white px-4 py-2.5 text-zinc-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"
          />
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
            Average Deal Value ($)
          </label>
          <input
            type="number"
            value={dealValue}
            onChange={(e) => setDealValue(Number(e.target.value))}
            min={0}
            className="w-full rounded-lg border border-zinc-300 bg-white px-4 py-2.5 text-zinc-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"
          />
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
            Real-Time Lead Cost ($)
          </label>
          <input
            type="number"
            value={realTimeCost}
            onChange={(e) => setRealTimeCost(Number(e.target.value))}
            min={1}
            className="w-full rounded-lg border border-zinc-300 bg-white px-4 py-2.5 text-zinc-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"
          />
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
            Aged Lead Cost ($)
          </label>
          <input
            type="number"
            value={agedCost}
            onChange={(e) => setAgedCost(Number(e.target.value))}
            min={0.1}
            step={0.1}
            className="w-full rounded-lg border border-zinc-300 bg-white px-4 py-2.5 text-zinc-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"
          />
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
            Real-Time Conversion Rate (%)
          </label>
          <input
            type="number"
            value={realTimeConversion}
            onChange={(e) => setRealTimeConversion(Number(e.target.value))}
            min={0}
            max={100}
            className="w-full rounded-lg border border-zinc-300 bg-white px-4 py-2.5 text-zinc-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"
          />
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
            Aged Lead Conversion Rate (%)
          </label>
          <input
            type="number"
            value={agedConversion}
            onChange={(e) => setAgedConversion(Number(e.target.value))}
            min={0}
            max={100}
            className="w-full rounded-lg border border-zinc-300 bg-white px-4 py-2.5 text-zinc-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"
          />
        </div>
      </div>

      {/* Results */}
      <div className="grid gap-6 sm:grid-cols-2">
        <div className="rounded-xl border-2 border-red-200 bg-red-50 p-5 dark:border-red-900 dark:bg-red-950/30">
          <h3 className="mb-4 text-lg font-bold text-red-700 dark:text-red-400">
            Real-Time Leads
          </h3>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-zinc-600 dark:text-zinc-400">Leads purchased</span>
              <span className="font-semibold text-zinc-900 dark:text-white">{realTimeLeads.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-zinc-600 dark:text-zinc-400">Expected sales</span>
              <span className="font-semibold text-zinc-900 dark:text-white">{realTimeSales.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-zinc-600 dark:text-zinc-400">Revenue</span>
              <span className="font-semibold text-zinc-900 dark:text-white">${realTimeRevenue.toLocaleString()}</span>
            </div>
            <div className="flex justify-between border-t border-red-200 pt-3 dark:border-red-800">
              <span className="font-medium text-zinc-700 dark:text-zinc-300">ROI</span>
              <span className={`text-lg font-bold ${realTimeRoi >= 0 ? "text-green-600" : "text-red-600"}`}>
                {realTimeRoi > 0 ? "+" : ""}{realTimeRoi}%
              </span>
            </div>
          </div>
        </div>

        <div className="rounded-xl border-2 border-blue-200 bg-blue-50 p-5 dark:border-blue-900 dark:bg-blue-950/30">
          <h3 className="mb-4 text-lg font-bold text-blue-700 dark:text-blue-400">
            Aged Leads
          </h3>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-zinc-600 dark:text-zinc-400">Leads purchased</span>
              <span className="font-semibold text-zinc-900 dark:text-white">{agedLeads.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-zinc-600 dark:text-zinc-400">Expected sales</span>
              <span className="font-semibold text-zinc-900 dark:text-white">{agedSales.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-zinc-600 dark:text-zinc-400">Revenue</span>
              <span className="font-semibold text-zinc-900 dark:text-white">${agedRevenue.toLocaleString()}</span>
            </div>
            <div className="flex justify-between border-t border-blue-200 pt-3 dark:border-blue-800">
              <span className="font-medium text-zinc-700 dark:text-zinc-300">ROI</span>
              <span className={`text-lg font-bold ${agedRoi >= 0 ? "text-green-600" : "text-red-600"}`}>
                {agedRoi > 0 ? "+" : ""}{agedRoi}%
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Advantage callout */}
      {agedRevenue > realTimeRevenue && (
        <div className="mt-6 rounded-lg bg-green-50 p-4 text-center dark:bg-green-950/30">
          <p className="font-semibold text-green-700 dark:text-green-400">
            Aged leads generate ${(agedRevenue - realTimeRevenue).toLocaleString()} more revenue with the same ${budget.toLocaleString()} budget
          </p>
        </div>
      )}

      {/* Share Link */}
      <div className="mt-6 flex justify-center">
        <button
          onClick={handleCopyLink}
          className="inline-flex items-center gap-2 rounded-lg border border-zinc-300 bg-white px-4 py-2 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700"
        >
          {copied ? (
            <>
              <svg className="h-4 w-4 text-green-600" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" /></svg>
              Link Copied!
            </>
          ) : (
            <>
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m9.86-2.702a4.5 4.5 0 00-1.242-7.244l-4.5-4.5a4.5 4.5 0 00-6.364 6.364L4.34 8.374" /></svg>
              Share These Results
            </>
          )}
        </button>
      </div>

      {/* CTA */}
      <div className="mt-8 rounded-xl border border-blue-200 bg-blue-50 p-5 text-center dark:border-blue-900 dark:bg-blue-950/50">
        <p className="mb-3 font-semibold text-zinc-900 dark:text-white">
          Ready to see these numbers in action?
        </p>
        <a
          href={affiliateUrl({ campaign: "roi-calculator", content: "results-cta" })}
          target="_blank"
          rel="nofollow sponsored noopener noreferrer"
          className="inline-block rounded-lg bg-blue-600 px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-700"
        >
          Browse Aged Leads at AgedLeadStore.com
        </a>
      </div>
    </div>
  );
}
