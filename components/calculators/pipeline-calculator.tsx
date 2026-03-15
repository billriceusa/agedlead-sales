"use client";

import { useState } from "react";
import { affiliateUrl } from "@/lib/affiliate";

export function PipelineCalculator() {
  const [monthlyIncome, setMonthlyIncome] = useState(10000);
  const [dealValue, setDealValue] = useState(1000);
  const [contactRate, setContactRate] = useState(12);
  const [closeRate, setCloseRate] = useState(2);
  const [leadCost, setLeadCost] = useState(1);

  const dealsNeeded = dealValue > 0 ? Math.ceil(monthlyIncome / dealValue) : 0;
  const contactsNeeded = closeRate > 0 ? Math.ceil(dealsNeeded / (closeRate / 100)) : 0;
  const leadsNeeded = contactRate > 0 ? Math.ceil(contactsNeeded / (contactRate / 100)) : 0;
  const dialsPer = 7; // average dials per lead over a cadence
  const totalDials = leadsNeeded * dialsPer;
  const workingDays = 22;
  const dialsPerDay = Math.ceil(totalDials / workingDays);
  const leadBudget = leadsNeeded * leadCost;
  const costPerDeal = dealsNeeded > 0 ? Math.round(leadBudget / dealsNeeded) : 0;

  return (
    <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900 sm:p-8">
      <h2 className="mb-6 text-2xl font-bold text-zinc-900 dark:text-white">
        Build Your Pipeline Plan
      </h2>

      <div className="mb-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        <div>
          <label className="mb-1.5 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
            Target Monthly Income ($)
          </label>
          <input type="number" value={monthlyIncome} onChange={(e) => setMonthlyIncome(Number(e.target.value))} min={0}
            className="w-full rounded-lg border border-zinc-300 bg-white px-4 py-2.5 text-zinc-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white" />
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
            Revenue Per Sale ($)
          </label>
          <input type="number" value={dealValue} onChange={(e) => setDealValue(Number(e.target.value))} min={1}
            className="w-full rounded-lg border border-zinc-300 bg-white px-4 py-2.5 text-zinc-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white" />
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
            Contact Rate (%)
          </label>
          <input type="number" value={contactRate} onChange={(e) => setContactRate(Number(e.target.value))} min={1} max={100}
            className="w-full rounded-lg border border-zinc-300 bg-white px-4 py-2.5 text-zinc-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white" />
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
            Close Rate of Contacts (%)
          </label>
          <input type="number" value={closeRate} onChange={(e) => setCloseRate(Number(e.target.value))} min={0.1} max={100} step={0.1}
            className="w-full rounded-lg border border-zinc-300 bg-white px-4 py-2.5 text-zinc-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white" />
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
            Cost Per Lead ($)
          </label>
          <input type="number" value={leadCost} onChange={(e) => setLeadCost(Number(e.target.value))} min={0.1} step={0.1}
            className="w-full rounded-lg border border-zinc-300 bg-white px-4 py-2.5 text-zinc-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white" />
        </div>
      </div>

      {/* Pipeline Funnel */}
      <div className="space-y-3">
        {[
          { label: "Leads to buy this month", value: leadsNeeded.toLocaleString(), bg: "bg-blue-600", width: "100%" },
          { label: "Prospects you'll contact", value: contactsNeeded.toLocaleString(), bg: "bg-blue-500", width: `${Math.min((contactRate), 100)}%` },
          { label: "Deals you'll close", value: dealsNeeded.toLocaleString(), bg: "bg-green-500", width: `${Math.min((contactRate / 100) * closeRate, 100)}%` },
        ].map((step) => (
          <div key={step.label}>
            <div className="mb-1 flex items-center justify-between text-sm">
              <span className="text-zinc-600 dark:text-zinc-400">{step.label}</span>
              <span className="font-bold text-zinc-900 dark:text-white">{step.value}</span>
            </div>
            <div className="h-3 overflow-hidden rounded-full bg-zinc-200 dark:bg-zinc-800">
              <div className={`h-full rounded-full ${step.bg}`} style={{ width: step.width }} />
            </div>
          </div>
        ))}
      </div>

      {/* Activity Plan */}
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: "Monthly Lead Budget", value: `$${leadBudget.toLocaleString()}` },
          { label: "Cost Per Deal", value: `$${costPerDeal.toLocaleString()}` },
          { label: "Total Dials/Month", value: totalDials.toLocaleString() },
          { label: "Dials Per Day", value: dialsPerDay.toLocaleString() },
        ].map((r) => (
          <div key={r.label} className="rounded-xl border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-800 dark:bg-zinc-950">
            <p className="text-xs font-medium uppercase tracking-wider text-zinc-500">{r.label}</p>
            <p className="mt-1 text-2xl font-bold text-zinc-900 dark:text-white">{r.value}</p>
          </div>
        ))}
      </div>

      {/* CTA */}
      <div className="mt-6 rounded-xl border border-blue-200 bg-blue-50 p-5 text-center dark:border-blue-900 dark:bg-blue-950/50">
        <p className="mb-3 font-semibold text-zinc-900 dark:text-white">
          Ready to fill your pipeline?
        </p>
        <a href={affiliateUrl({ campaign: "pipeline-calculator", content: "results-cta" })} target="_blank"
          rel="nofollow sponsored noopener noreferrer"
          className="inline-block rounded-lg bg-blue-600 px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-700">
          Browse Aged Leads at AgedLeadStore.com
        </a>
      </div>
    </div>
  );
}
