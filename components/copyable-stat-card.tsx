"use client";

import { useState } from "react";

interface CopyableStatCardProps {
  value: string;
  label: string;
  source: string;
  sourceUrl: string;
}

export function CopyableStatCard({
  value,
  label,
  source,
  sourceUrl,
}: CopyableStatCardProps) {
  const [copied, setCopied] = useState(false);

  const plainText = `${value} — ${label} (Source: ${source}, ${sourceUrl})`;
  const htmlText = `<strong>${value}</strong> — ${label} (Source: <a href="${sourceUrl}">${source}</a>)`;

  const handleCopy = async () => {
    try {
      // Try rich clipboard with both HTML and plain text
      if (navigator.clipboard.write) {
        const blob = new Blob([htmlText], { type: "text/html" });
        const plainBlob = new Blob([plainText], { type: "text/plain" });
        await navigator.clipboard.write([
          new ClipboardItem({
            "text/html": blob,
            "text/plain": plainBlob,
          }),
        ]);
      } else {
        await navigator.clipboard.writeText(plainText);
      }
    } catch {
      await navigator.clipboard.writeText(plainText);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="group relative rounded-xl border border-zinc-200 bg-white p-5 transition-colors hover:border-blue-200 dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-blue-800">
      <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">
        {value}
      </p>
      <p className="mt-1 text-sm font-medium text-zinc-900 dark:text-white">
        {label}
      </p>
      <p className="mt-1 text-xs text-zinc-400">Source: {source}</p>
      <button
        onClick={handleCopy}
        className="mt-3 inline-flex items-center gap-1.5 rounded-md border border-zinc-200 bg-zinc-50 px-3 py-1.5 text-xs font-medium text-zinc-600 transition-colors hover:bg-zinc-100 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-400 dark:hover:bg-zinc-700"
        title="Copy stat with attribution"
      >
        {copied ? (
          <>
            <svg className="h-3.5 w-3.5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
            Copied
          </>
        ) : (
          <>
            <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
            Copy Stat
          </>
        )}
      </button>
    </div>
  );
}
