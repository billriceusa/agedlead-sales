"use client";

import { useState, useEffect, useCallback } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import Link from "next/link";

export function LeadCostCalculator() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const [leadCost, setLeadCost] = useState(() => Number(searchParams.get("cost")) || 1);
  const [contactRate, setContactRate] = useState(() => Number(searchParams.get("contact")) || 12);
  const [conversionRate, setConversionRate] = useState(() => Number(searchParams.get("close")) || 2);
  const [dealValue, setDealValue] = useState(() => Number(searchParams.get("deal")) || 1000);
  const [leadsPerMonth, setLeadsPerMonth] = useState(() => Number(searchParams.get("leads")) || 500);
  const [copied, setCopied] = useState(false);

  const buildShareUrl = useCallback(() => {
    const params = new URLSearchParams();
    if (leadCost !== 1) params.set("cost", String(leadCost));
    if (leadsPerMonth !== 500) params.set("leads", String(leadsPerMonth));
    if (contactRate !== 12) params.set("contact", String(contactRate));
    if (conversionRate !== 2) params.set("close", String(conversionRate));
    if (dealValue !== 1000) params.set("deal", String(dealValue));
    const qs = params.toString();
    return `${window.location.origin}${pathname}${qs ? `?${qs}` : ""}`;
  }, [leadCost, leadsPerMonth, contactRate, conversionRate, dealValue, pathname]);

  useEffect(() => {
    const params = new URLSearchParams();
    if (leadCost !== 1) params.set("cost", String(leadCost));
    if (leadsPerMonth !== 500) params.set("leads", String(leadsPerMonth));
    if (contactRate !== 12) params.set("contact", String(contactRate));
    if (conversionRate !== 2) params.set("close", String(conversionRate));
    if (dealValue !== 1000) params.set("deal", String(dealValue));
    const qs = params.toString();
    router.replace(`${pathname}${qs ? `?${qs}` : ""}`, { scroll: false });
  }, [leadCost, leadsPerMonth, contactRate, conversionRate, dealValue, pathname, router]);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(buildShareUrl());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const totalSpend = leadsPerMonth * leadCost;
  const contacted = Math.round(leadsPerMonth * (contactRate / 100));
  const sales = Math.round(leadsPerMonth * (contactRate / 100) * (conversionRate / 100));
  const revenue = sales * dealValue;
  const cpa = sales > 0 ? Math.round(totalSpend / sales) : 0;
  const profit = revenue - totalSpend;
  const roi = totalSpend > 0 ? Math.round((profit / totalSpend) * 100) : 0;
  const breakEvenRate = dealValue > 0 && leadsPerMonth > 0 && contactRate > 0
    ? ((totalSpend / dealValue) / (leadsPerMonth * (contactRate / 100)) * 100).toFixed(1)
    : "0";

  return (
    <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900 sm:p-8">
      <h2 className="mb-6 text-2xl font-bold text-zinc-900 dark:text-white">
        Calculate Your True Lead Cost
      </h2>

      <div className="mb-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        <div>
          <label className="mb-1.5 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
            Cost Per Lead ($)
          </label>
          <input type="number" value={leadCost} onChange={(e) => setLeadCost(Number(e.target.value))} min={0.1} step={0.1}
            className="w-full rounded-lg border border-zinc-300 bg-white px-4 py-2.5 text-zinc-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white" />
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
            Leads Per Month
          </label>
          <input type="number" value={leadsPerMonth} onChange={(e) => setLeadsPerMonth(Number(e.target.value))} min={1}
            className="w-full rounded-lg border border-zinc-300 bg-white px-4 py-2.5 text-zinc-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white" />
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
            Contact Rate (%)
          </label>
          <input type="number" value={contactRate} onChange={(e) => setContactRate(Number(e.target.value))} min={0} max={100}
            className="w-full rounded-lg border border-zinc-300 bg-white px-4 py-2.5 text-zinc-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white" />
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
            Close Rate of Contacts (%)
          </label>
          <input type="number" value={conversionRate} onChange={(e) => setConversionRate(Number(e.target.value))} min={0} max={100}
            className="w-full rounded-lg border border-zinc-300 bg-white px-4 py-2.5 text-zinc-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white" />
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
            Revenue Per Sale ($)
          </label>
          <input type="number" value={dealValue} onChange={(e) => setDealValue(Number(e.target.value))} min={0}
            className="w-full rounded-lg border border-zinc-300 bg-white px-4 py-2.5 text-zinc-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white" />
        </div>
      </div>

      {/* Results */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: "Monthly Lead Spend", value: `$${totalSpend.toLocaleString()}`, color: "text-zinc-900 dark:text-white" },
          { label: "Prospects Contacted", value: contacted.toLocaleString(), color: "text-zinc-900 dark:text-white" },
          { label: "Expected Sales", value: sales.toLocaleString(), color: "text-blue-600 dark:text-blue-400" },
          { label: "Cost Per Acquisition", value: `$${cpa.toLocaleString()}`, color: sales > 0 ? "text-blue-600 dark:text-blue-400" : "text-zinc-400" },
        ].map((r) => (
          <div key={r.label} className="rounded-xl border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-800 dark:bg-zinc-950">
            <p className="text-xs font-medium uppercase tracking-wider text-zinc-500">{r.label}</p>
            <p className={`mt-1 text-2xl font-bold ${r.color}`}>{r.value}</p>
          </div>
        ))}
      </div>

      {/* P&L Summary */}
      <div className="mt-6 rounded-xl border border-zinc-200 bg-zinc-50 p-5 dark:border-zinc-800 dark:bg-zinc-950">
        <div className="grid gap-4 sm:grid-cols-3">
          <div>
            <p className="text-xs font-medium uppercase tracking-wider text-zinc-500">Revenue</p>
            <p className="mt-1 text-xl font-bold text-zinc-900 dark:text-white">${revenue.toLocaleString()}</p>
          </div>
          <div>
            <p className="text-xs font-medium uppercase tracking-wider text-zinc-500">Profit</p>
            <p className={`mt-1 text-xl font-bold ${profit >= 0 ? "text-green-600" : "text-red-600"}`}>${profit.toLocaleString()}</p>
          </div>
          <div>
            <p className="text-xs font-medium uppercase tracking-wider text-zinc-500">ROI</p>
            <p className={`mt-1 text-xl font-bold ${roi >= 0 ? "text-green-600" : "text-red-600"}`}>{roi > 0 ? "+" : ""}{roi}%</p>
          </div>
        </div>
        <p className="mt-4 text-sm text-zinc-500">
          Break-even close rate: <span className="font-semibold text-zinc-700 dark:text-zinc-300">{breakEvenRate}%</span> of contacted leads
        </p>
      </div>

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
      <div className="mt-6 rounded-xl border border-blue-200 bg-blue-50 p-5 text-center dark:border-blue-900 dark:bg-blue-950/50">
        <p className="mb-3 font-semibold text-zinc-900 dark:text-white">
          See these numbers with real leads
        </p>
        <Link href="/providers"
          className="inline-block rounded-lg bg-blue-600 px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-700">
          Compare Lead Providers
        </Link>
      </div>
    </div>
  );
}
