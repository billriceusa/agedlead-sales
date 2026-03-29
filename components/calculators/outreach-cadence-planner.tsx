"use client";

import { useState, useEffect, useCallback } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import Link from "next/link";

type Channel = "phone" | "email" | "mail" | "doorKnock" | "sms";

interface ChannelConfig {
  label: string;
  color: string;
  shortLabel: string;
  minutesPer: number;
}

const CHANNEL_META: Record<Channel, ChannelConfig> = {
  phone: { label: "Phone", color: "bg-blue-500", shortLabel: "Phone", minutesPer: 2 },
  email: { label: "Email", color: "bg-green-500", shortLabel: "Email", minutesPer: 1 },
  mail: { label: "Direct Mail", color: "bg-amber-500", shortLabel: "Mail", minutesPer: 0 },
  doorKnock: { label: "Door Knock", color: "bg-purple-500", shortLabel: "Door", minutesPer: 15 },
  sms: { label: "Text/SMS", color: "bg-teal-500", shortLabel: "SMS", minutesPer: 0.5 },
};

const ALL_CHANNELS: Channel[] = ["phone", "email", "mail", "doorKnock", "sms"];

// Cadence templates: which channel on which day
function buildCadence(days: 7 | 14 | 21, channels: Channel[]): { day: number; channel: Channel }[] {
  if (channels.length === 0) return [];

  // Preferred ordering for cadence variety
  const preferredOrder: Channel[] = ["mail", "phone", "email", "sms", "doorKnock"];
  const active = preferredOrder.filter((c) => channels.includes(c));

  const touchCounts: Record<number, number> = { 7: 5, 14: 8, 21: 11 };
  const totalTouches = touchCounts[days];

  const cadence: { day: number; channel: Channel }[] = [];

  // Spread touches across the cadence length
  const spacing = Math.max(1, Math.floor(days / totalTouches));
  let currentDay = 1;

  for (let i = 0; i < totalTouches; i++) {
    const channel = active[i % active.length];
    cadence.push({ day: Math.min(currentDay, days), channel });
    currentDay += spacing;
    if (currentDay > days) currentDay = days;
  }

  return cadence;
}

export function OutreachCadencePlanner() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const [numLeads, setNumLeads] = useState(() => Number(searchParams.get("leads")) || 100);
  const [cadenceLength, setCadenceLength] = useState<7 | 14 | 21>(() => {
    const v = Number(searchParams.get("days"));
    return v === 7 || v === 14 || v === 21 ? v : 7;
  });
  const [channels, setChannels] = useState<Set<Channel>>(() => {
    const raw = searchParams.get("channels");
    if (raw) {
      const parsed = raw.split(",").filter((c): c is Channel => ALL_CHANNELS.includes(c as Channel));
      return parsed.length > 0 ? new Set(parsed) : new Set(ALL_CHANNELS);
    }
    return new Set(ALL_CHANNELS);
  });
  const [callsPerDay, setCallsPerDay] = useState(() => Number(searchParams.get("calls")) || 80);
  const [workingDays, setWorkingDays] = useState(() => Number(searchParams.get("workDays")) || 5);
  const [copied, setCopied] = useState(false);

  const buildShareUrl = useCallback(() => {
    const params = new URLSearchParams();
    if (numLeads !== 100) params.set("leads", String(numLeads));
    if (cadenceLength !== 7) params.set("days", String(cadenceLength));
    if (callsPerDay !== 80) params.set("calls", String(callsPerDay));
    if (workingDays !== 5) params.set("workDays", String(workingDays));
    const activeArr = ALL_CHANNELS.filter((c) => channels.has(c));
    if (activeArr.length !== ALL_CHANNELS.length) params.set("channels", activeArr.join(","));
    const qs = params.toString();
    return `${window.location.origin}${pathname}${qs ? `?${qs}` : ""}`;
  }, [numLeads, cadenceLength, callsPerDay, workingDays, channels, pathname]);

  useEffect(() => {
    const params = new URLSearchParams();
    if (numLeads !== 100) params.set("leads", String(numLeads));
    if (cadenceLength !== 7) params.set("days", String(cadenceLength));
    if (callsPerDay !== 80) params.set("calls", String(callsPerDay));
    if (workingDays !== 5) params.set("workDays", String(workingDays));
    const activeArr = ALL_CHANNELS.filter((c) => channels.has(c));
    if (activeArr.length !== ALL_CHANNELS.length) params.set("channels", activeArr.join(","));
    const qs = params.toString();
    router.replace(`${pathname}${qs ? `?${qs}` : ""}`, { scroll: false });
  }, [numLeads, cadenceLength, callsPerDay, workingDays, channels, pathname, router]);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(buildShareUrl());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const toggleChannel = (ch: Channel) => {
    const next = new Set(channels);
    if (next.has(ch)) {
      if (next.size > 1) next.delete(ch);
    } else {
      next.add(ch);
    }
    setChannels(next);
  };

  const touchCounts: Record<number, number> = { 7: 5, 14: 8, 21: 11 };
  const touchesPerLead = touchCounts[cadenceLength];
  const totalTouches = numLeads * touchesPerLead;

  const activeChannels = ALL_CHANNELS.filter((c) => channels.has(c));
  const cadence = buildCadence(cadenceLength, activeChannels);

  // Count touches per channel in the cadence
  const channelTouchCount: Partial<Record<Channel, number>> = {};
  for (const t of cadence) {
    channelTouchCount[t.channel] = (channelTouchCount[t.channel] || 0) + 1;
  }

  // Daily breakdown: distribute total touches by channel ratio across working days
  const workingDaysPerCycle = Math.ceil((cadenceLength / 7) * workingDays);
  const daysToComplete = callsPerDay > 0 ? Math.ceil((numLeads * (channelTouchCount.phone || 0)) / callsPerDay) : workingDaysPerCycle;
  const effectiveDays = Math.max(daysToComplete, workingDaysPerCycle);

  const dailyBreakdown = activeChannels.map((ch) => {
    const touchesForChannel = numLeads * (channelTouchCount[ch] || 0);
    const perDay = effectiveDays > 0 ? Math.ceil(touchesForChannel / effectiveDays) : 0;
    return { channel: ch, total: touchesForChannel, perDay };
  });

  // Time estimate
  const totalMinutesPerDay = dailyBreakdown.reduce((sum, b) => {
    return sum + b.perDay * CHANNEL_META[b.channel].minutesPer;
  }, 0);
  const hoursPerDay = Math.floor(totalMinutesPerDay / 60);
  const minsPerDay = Math.round(totalMinutesPerDay % 60);

  return (
    <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900 sm:p-8">
      <h2 className="mb-6 text-2xl font-bold text-zinc-900 dark:text-white">
        Plan Your Outreach Cadence
      </h2>

      <div className="mb-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        <div>
          <label className="mb-1.5 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
            Number of Leads
          </label>
          <input type="number" value={numLeads} onChange={(e) => setNumLeads(Number(e.target.value))} min={1}
            className="w-full rounded-lg border border-zinc-300 bg-white px-4 py-2.5 text-zinc-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white" />
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
            Cadence Length
          </label>
          <select value={cadenceLength} onChange={(e) => setCadenceLength(Number(e.target.value) as 7 | 14 | 21)}
            className="w-full rounded-lg border border-zinc-300 bg-white px-4 py-2.5 text-zinc-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white">
            <option value={7}>7 days (5 touches)</option>
            <option value={14}>14 days (8 touches)</option>
            <option value={21}>21 days (11 touches)</option>
          </select>
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
            Calls Per Day Capacity
          </label>
          <input type="number" value={callsPerDay} onChange={(e) => setCallsPerDay(Number(e.target.value))} min={1}
            className="w-full rounded-lg border border-zinc-300 bg-white px-4 py-2.5 text-zinc-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white" />
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
            Working Days Per Week
          </label>
          <select value={workingDays} onChange={(e) => setWorkingDays(Number(e.target.value))}
            className="w-full rounded-lg border border-zinc-300 bg-white px-4 py-2.5 text-zinc-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white">
            <option value={5}>5 days</option>
            <option value={6}>6 days</option>
            <option value={7}>7 days</option>
          </select>
        </div>
        <div className="sm:col-span-2 lg:col-span-2">
          <label className="mb-1.5 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
            Channels
          </label>
          <div className="flex flex-wrap gap-2">
            {ALL_CHANNELS.map((ch) => (
              <button key={ch} type="button" onClick={() => toggleChannel(ch)}
                className={`rounded-lg border px-3 py-2 text-sm font-medium transition-colors ${
                  channels.has(ch)
                    ? "border-blue-500 bg-blue-50 text-blue-700 dark:border-blue-400 dark:bg-blue-950 dark:text-blue-300"
                    : "border-zinc-300 bg-white text-zinc-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-400"
                }`}>
                {CHANNEL_META[ch].label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Results Cards */}
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: "Touches Per Lead", value: touchesPerLead.toString() },
          { label: "Total Touches Needed", value: totalTouches.toLocaleString() },
          { label: "Days to Complete", value: effectiveDays.toLocaleString() },
          { label: "Estimated Time/Day", value: hoursPerDay > 0 ? `${hoursPerDay}h ${minsPerDay}m` : `${minsPerDay}m` },
        ].map((r) => (
          <div key={r.label} className="rounded-xl border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-800 dark:bg-zinc-950">
            <p className="text-xs font-medium uppercase tracking-wider text-zinc-500">{r.label}</p>
            <p className="mt-1 text-2xl font-bold text-zinc-900 dark:text-white">{r.value}</p>
          </div>
        ))}
      </div>

      {/* Daily Activity Breakdown */}
      <div className="mt-8">
        <h3 className="mb-4 text-lg font-semibold text-zinc-900 dark:text-white">Daily Activity Breakdown</h3>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {dailyBreakdown.map((b) => (
            <div key={b.channel} className="flex items-center gap-3 rounded-lg border border-zinc-200 bg-white p-3 dark:border-zinc-800 dark:bg-zinc-900">
              <div className={`h-3 w-3 rounded-full ${CHANNEL_META[b.channel].color}`} />
              <div className="flex-1">
                <p className="text-sm font-medium text-zinc-900 dark:text-white">{CHANNEL_META[b.channel].label}</p>
                <p className="text-xs text-zinc-500">{b.total.toLocaleString()} total</p>
              </div>
              <p className="text-lg font-bold text-zinc-900 dark:text-white">{b.perDay}/day</p>
            </div>
          ))}
        </div>
      </div>

      {/* Cadence Timeline */}
      <div className="mt-8">
        <h3 className="mb-4 text-lg font-semibold text-zinc-900 dark:text-white">
          {cadenceLength}-Day Cadence Timeline
        </h3>
        <div className="overflow-x-auto">
          <div className="flex gap-1.5" style={{ minWidth: `${cadence.length * 72}px` }}>
            {cadence.map((t, i) => (
              <div key={i} className="flex flex-col items-center">
                <span className="mb-1 text-xs font-medium text-zinc-500">Day {t.day}</span>
                <div className={`flex h-16 w-16 items-center justify-center rounded-lg text-xs font-bold text-white ${CHANNEL_META[t.channel].color}`}>
                  {CHANNEL_META[t.channel].shortLabel}
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="mt-3 flex flex-wrap gap-3">
          {activeChannels.map((ch) => (
            <div key={ch} className="flex items-center gap-1.5 text-xs text-zinc-500">
              <div className={`h-2.5 w-2.5 rounded-full ${CHANNEL_META[ch].color}`} />
              {CHANNEL_META[ch].label}
            </div>
          ))}
        </div>
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
          Need leads to fill your cadence?
        </p>
        <Link href="/providers"
          className="inline-block rounded-lg bg-blue-600 px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-700">
          Compare Lead Providers
        </Link>
      </div>
    </div>
  );
}
