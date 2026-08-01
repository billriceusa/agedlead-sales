"use client";

import { useState } from "react";
import { SITE_URL } from "@/lib/site-url";

interface EmbedCodeProps {
  calculatorName: string;
  calculatorSlug: string;
}

const baseUrl = SITE_URL;

export function EmbedCode({ calculatorName, calculatorSlug }: EmbedCodeProps) {
  const [copied, setCopied] = useState(false);

  const embedUrl = `${baseUrl}/calculators/${calculatorSlug}/embed`;
  const attributionUrl = `${baseUrl}/calculators/${calculatorSlug}?utm_source=embed&utm_medium=iframe&utm_campaign=${calculatorSlug}`;

  const snippet = `<iframe src="${embedUrl}" width="100%" height="700" frameborder="0" title="${calculatorName}" style="border:none;border-radius:12px;"></iframe>\n<p style="font-size:12px;text-align:center;margin-top:8px;">Powered by <a href="${attributionUrl}" target="_blank" rel="noopener">Work Aged Leads</a></p>`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(snippet);
    } catch {
      const textarea = document.createElement("textarea");
      textarea.value = snippet;
      textarea.style.position = "fixed";
      textarea.style.opacity = "0";
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="mt-10 rounded-xl border border-zinc-200 bg-zinc-50 p-6 dark:border-zinc-800 dark:bg-zinc-900">
      <h3 className="mb-2 text-sm font-semibold uppercase tracking-wider text-zinc-500">
        Embed This Calculator
      </h3>
      <p className="mb-4 text-sm text-zinc-600 dark:text-zinc-400">
        Add this calculator to your website. Copy the code below and paste it
        into your HTML.
      </p>
      <pre className="overflow-x-auto rounded-lg border border-zinc-200 bg-white p-4 text-xs leading-relaxed text-zinc-700 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300">
        <code>{snippet}</code>
      </pre>
      <button
        onClick={handleCopy}
        className="mt-3 inline-flex items-center gap-1.5 rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700"
      >
        {copied ? (
          <>
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
            Copied
          </>
        ) : (
          <>
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
            Copy Embed Code
          </>
        )}
      </button>
    </div>
  );
}
