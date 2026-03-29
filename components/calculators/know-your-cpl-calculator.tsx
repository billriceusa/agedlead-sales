"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { VERTICALS, type VerticalData } from "@/data/verticals";
import {
  getBenchmarksByVertical,
  formatPrice,
  type PriceBenchmarkData,
} from "@/data/price-benchmarks";

function getAgedBenchmark(
  verticalSlug: string
): PriceBenchmarkData | undefined {
  const benchmarks = getBenchmarksByVertical(verticalSlug);
  return benchmarks.find(
    (b) =>
      b.leadAgeBracket === "31-85-days" &&
      b.exclusivity === "shared" &&
      b.leadType === "internet-form"
  );
}

function getRealTimeBenchmark(
  verticalSlug: string
): PriceBenchmarkData | undefined {
  const benchmarks = getBenchmarksByVertical(verticalSlug);
  return benchmarks.find(
    (b) =>
      b.leadAgeBracket === "real-time" &&
      b.exclusivity === "shared" &&
      b.leadType === "internet-form"
  );
}

export function KnowYourCplCalculator() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const tier1Verticals = VERTICALS.filter((v) => v.tier <= 2);

  // Inputs from URL or defaults
  const [vertical, setVertical] = useState(
    searchParams.get("vertical") || "mortgage"
  );
  const [budget, setBudget] = useState(
    Number(searchParams.get("budget")) || 3000
  );
  const [dealValue, setDealValue] = useState(
    Number(searchParams.get("dealValue")) || 0
  );
  const [closeRate, setCloseRate] = useState(
    Number(searchParams.get("closeRate")) || 0
  );
  const [contactRate, setContactRate] = useState(
    Number(searchParams.get("contactRate")) || 0
  );

  // Auto-fill defaults when vertical changes
  useEffect(() => {
    const v = VERTICALS.find((v) => v.slug === vertical);
    if (!v) return;

    // Only auto-fill if the values are at 0 (initial state or vertical change)
    if (dealValue === 0) setDealValue(v.benchmarkDefaults.avgDealValue);
    if (closeRate === 0)
      setCloseRate(
        Math.round(v.benchmarkDefaults.agedCloseRate * 100 * 10) / 10
      );
    if (contactRate === 0)
      setContactRate(Math.round(v.benchmarkDefaults.agedContactRate * 100));
  }, []); // Only on mount

  function handleVerticalChange(slug: string) {
    setVertical(slug);
    const v = VERTICALS.find((v) => v.slug === slug);
    if (!v) return;
    setDealValue(v.benchmarkDefaults.avgDealValue);
    setCloseRate(
      Math.round(v.benchmarkDefaults.agedCloseRate * 100 * 10) / 10
    );
    setContactRate(Math.round(v.benchmarkDefaults.agedContactRate * 100));
  }

  // Update URL
  useEffect(() => {
    const params = new URLSearchParams({
      vertical,
      budget: String(budget),
      dealValue: String(dealValue),
      closeRate: String(closeRate),
      contactRate: String(contactRate),
    });
    router.replace(`?${params.toString()}`, { scroll: false });
  }, [vertical, budget, dealValue, closeRate, contactRate, router]);

  // Calculations
  const selectedVertical = VERTICALS.find((v) => v.slug === vertical);
  const agedBenchmark = getAgedBenchmark(vertical);
  const realTimeBenchmark = getRealTimeBenchmark(vertical);

  const agedCplLow = agedBenchmark?.priceLow || 1;
  const agedCplHigh = agedBenchmark?.priceHigh || 5;
  const agedCplMedian = agedBenchmark?.priceMedian || 3;
  const rtCplLow = realTimeBenchmark?.priceLow || 20;
  const rtCplHigh = realTimeBenchmark?.priceHigh || 60;
  const rtCplMedian = realTimeBenchmark?.priceMedian || 40;

  const contactRatePct = contactRate / 100;
  const closeRatePct = closeRate / 100;
  const rtContactRate =
    selectedVertical?.benchmarkDefaults.realTimeContactRate || 0.55;
  const rtCloseRate =
    selectedVertical?.benchmarkDefaults.realTimeCloseRate || 0.08;

  // Aged calculations
  const agedLeadsLow = Math.floor(budget / agedCplHigh);
  const agedLeadsHigh = Math.floor(budget / agedCplLow);
  const agedLeadsMedian = Math.floor(budget / agedCplMedian);
  const agedContacts = Math.round(agedLeadsMedian * contactRatePct);
  const agedCloses = Math.round(agedContacts * closeRatePct);
  const agedRevenue = agedCloses * dealValue;
  const agedRoi =
    budget > 0 ? Math.round(((agedRevenue - budget) / budget) * 100) : 0;

  // Real-time calculations
  const rtLeadsLow = Math.floor(budget / rtCplHigh);
  const rtLeadsHigh = Math.floor(budget / rtCplLow);
  const rtLeadsMedian = Math.floor(budget / rtCplMedian);
  const rtContacts = Math.round(rtLeadsMedian * rtContactRate);
  const rtCloses = Math.round(rtContacts * rtCloseRate);
  const rtRevenue = rtCloses * dealValue;
  const rtRoi =
    budget > 0 ? Math.round(((rtRevenue - budget) / budget) * 100) : 0;

  // Max CPL calculation
  const effectiveCloseFromLead = contactRatePct * closeRatePct;
  const revenuePerLead = effectiveCloseFromLead * dealValue;
  const maxCpl = revenuePerLead * 0.5; // 50% margin target

  // Share functionality
  function handleShare() {
    navigator.clipboard.writeText(window.location.href);
  }

  return (
    <div className="space-y-8">
      {/* Inputs */}
      <div className="rounded-xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
        <h2 className="text-lg font-bold text-zinc-900 dark:text-white">
          Your Details
        </h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <div>
            <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
              Vertical
            </label>
            <select
              value={vertical}
              onChange={(e) => handleVerticalChange(e.target.value)}
              className="mt-1 w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"
            >
              {tier1Verticals.map((v) => (
                <option key={v.slug} value={v.slug}>
                  {v.icon} {v.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
              Monthly Lead Budget ($)
            </label>
            <input
              type="number"
              value={budget}
              onChange={(e) => setBudget(Number(e.target.value))}
              min={0}
              className="mt-1 w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
              Average Deal Value ($)
            </label>
            <input
              type="number"
              value={dealValue}
              onChange={(e) => setDealValue(Number(e.target.value))}
              min={0}
              className="mt-1 w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
              Your Close Rate from Contacts (%)
            </label>
            <input
              type="number"
              value={closeRate}
              onChange={(e) => setCloseRate(Number(e.target.value))}
              min={0}
              max={100}
              step={0.1}
              className="mt-1 w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
              Your Aged Lead Contact Rate (%)
            </label>
            <input
              type="number"
              value={contactRate}
              onChange={(e) => setContactRate(Number(e.target.value))}
              min={0}
              max={100}
              className="mt-1 w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"
            />
          </div>
        </div>
      </div>

      {/* Max CPL */}
      <div className="rounded-xl border-2 border-blue-200 bg-blue-50 p-6 dark:border-blue-800 dark:bg-blue-950/30">
        <h2 className="text-lg font-bold text-zinc-900 dark:text-white">
          Your Maximum CPL
        </h2>
        <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
          Based on your close rate and deal value, with a 50% profit margin
          target:
        </p>
        <p className="mt-3 text-4xl font-bold text-blue-700 dark:text-blue-300">
          {formatPrice(maxCpl)}
          <span className="ml-2 text-lg font-normal text-zinc-500">
            per lead max
          </span>
        </p>
        <p className="mt-2 text-xs text-zinc-500 dark:text-zinc-400">
          Formula: (Contact Rate x Close Rate x Deal Value) x 50% margin ={" "}
          {(contactRatePct * 100).toFixed(0)}% x {closeRate}% x{" "}
          {formatPrice(dealValue)} x 50%
        </p>
      </div>

      {/* Side-by-side Comparison */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Aged Leads */}
        <div className="rounded-xl border-2 border-blue-200 bg-white p-6 dark:border-blue-800 dark:bg-zinc-900">
          <h3 className="text-xl font-bold text-blue-600 dark:text-blue-400">
            Aged Leads (31-85 days)
          </h3>
          <p className="mt-1 text-sm text-zinc-500">From our Price Index</p>

          <div className="mt-4 space-y-4">
            <div>
              <span className="text-sm text-zinc-500 dark:text-zinc-400">
                Fair Market CPL
              </span>
              <p className="text-2xl font-bold text-zinc-900 dark:text-white">
                {formatPrice(agedCplLow)} – {formatPrice(agedCplHigh)}
              </p>
            </div>
            <div>
              <span className="text-sm text-zinc-500 dark:text-zinc-400">
                Your budget buys
              </span>
              <p className="text-lg font-semibold text-zinc-900 dark:text-white">
                {agedLeadsLow.toLocaleString()} –{" "}
                {agedLeadsHigh.toLocaleString()} leads
              </p>
            </div>
            <div>
              <span className="text-sm text-zinc-500 dark:text-zinc-400">
                Expected contacts (at {contactRate}%)
              </span>
              <p className="text-lg font-semibold text-zinc-900 dark:text-white">
                {agedContacts.toLocaleString()}
              </p>
            </div>
            <div>
              <span className="text-sm text-zinc-500 dark:text-zinc-400">
                Expected closes (at {closeRate}%)
              </span>
              <p className="text-lg font-semibold text-zinc-900 dark:text-white">
                {agedCloses}
              </p>
            </div>
            <div>
              <span className="text-sm text-zinc-500 dark:text-zinc-400">
                Projected revenue
              </span>
              <p className="text-lg font-semibold text-zinc-900 dark:text-white">
                ${agedRevenue.toLocaleString()}
              </p>
            </div>
            <div className="rounded-lg bg-blue-100 p-3 dark:bg-blue-900/50">
              <span className="text-sm text-blue-600 dark:text-blue-300">
                ROI
              </span>
              <p className="text-2xl font-bold text-blue-700 dark:text-blue-300">
                {agedRoi > 0 ? "+" : ""}
                {agedRoi}%
              </p>
            </div>
          </div>
        </div>

        {/* Real-Time Leads */}
        <div className="rounded-xl border-2 border-zinc-200 bg-white p-6 dark:border-zinc-700 dark:bg-zinc-900">
          <h3 className="text-xl font-bold text-zinc-600 dark:text-zinc-400">
            Real-Time Leads
          </h3>
          <p className="mt-1 text-sm text-zinc-500">From our Price Index</p>

          <div className="mt-4 space-y-4">
            <div>
              <span className="text-sm text-zinc-500 dark:text-zinc-400">
                Fair Market CPL
              </span>
              <p className="text-2xl font-bold text-zinc-900 dark:text-white">
                {formatPrice(rtCplLow)} – {formatPrice(rtCplHigh)}
              </p>
            </div>
            <div>
              <span className="text-sm text-zinc-500 dark:text-zinc-400">
                Your budget buys
              </span>
              <p className="text-lg font-semibold text-zinc-900 dark:text-white">
                {rtLeadsLow.toLocaleString()} – {rtLeadsHigh.toLocaleString()}{" "}
                leads
              </p>
            </div>
            <div>
              <span className="text-sm text-zinc-500 dark:text-zinc-400">
                Expected contacts (at{" "}
                {Math.round(rtContactRate * 100)}%)
              </span>
              <p className="text-lg font-semibold text-zinc-900 dark:text-white">
                {rtContacts.toLocaleString()}
              </p>
            </div>
            <div>
              <span className="text-sm text-zinc-500 dark:text-zinc-400">
                Expected closes (at{" "}
                {Math.round(rtCloseRate * 100)}%)
              </span>
              <p className="text-lg font-semibold text-zinc-900 dark:text-white">
                {rtCloses}
              </p>
            </div>
            <div>
              <span className="text-sm text-zinc-500 dark:text-zinc-400">
                Projected revenue
              </span>
              <p className="text-lg font-semibold text-zinc-900 dark:text-white">
                ${rtRevenue.toLocaleString()}
              </p>
            </div>
            <div className="rounded-lg bg-zinc-100 p-3 dark:bg-zinc-800">
              <span className="text-sm text-zinc-600 dark:text-zinc-400">
                ROI
              </span>
              <p className="text-2xl font-bold text-zinc-700 dark:text-zinc-300">
                {rtRoi > 0 ? "+" : ""}
                {rtRoi}%
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Recommendation */}
      <div className="rounded-xl border border-zinc-200 bg-zinc-50 p-6 dark:border-zinc-800 dark:bg-zinc-900">
        <h3 className="text-lg font-bold text-zinc-900 dark:text-white">
          Recommendation
        </h3>
        <p className="mt-3 text-sm text-zinc-600 dark:text-zinc-400">
          {agedRoi > rtRoi ? (
            <>
              Based on your inputs, <strong>aged leads</strong> deliver{" "}
              {agedCloses > 0 && rtCloses > 0
                ? `${(agedCloses / Math.max(rtCloses, 1)).toFixed(1)}x`
                : "more"}{" "}
              closed deals per dollar spent. You&apos;ll need the dialing capacity
              to work {agedLeadsMedian.toLocaleString()} leads per month (about{" "}
              {Math.round(agedLeadsMedian / 20)} leads per business day).
            </>
          ) : (
            <>
              Based on your inputs, <strong>real-time leads</strong> may deliver
              better ROI for your specific metrics. However, consider that aged
              leads let you test at much lower risk — you can buy a small batch
              for a fraction of the cost.
            </>
          )}
        </p>
        <div className="mt-4 flex flex-wrap gap-3">
          <Link
            href={`/providers/best/${vertical}`}
            className="inline-flex items-center rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
          >
            Best {selectedVertical?.name} Providers &rarr;
          </Link>
          <Link
            href={`/price-index/${vertical}`}
            className="inline-flex items-center rounded-lg border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800"
          >
            Full Pricing Data &rarr;
          </Link>
          <button
            onClick={handleShare}
            className="inline-flex items-center rounded-lg border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800"
          >
            Share Results
          </button>
        </div>
      </div>
    </div>
  );
}
