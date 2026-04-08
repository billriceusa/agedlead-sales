"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface NextReadBarProps {
  title: string;
  slug: string;
  basePath?: string;
}

export function NextReadBar({
  title,
  slug,
  basePath = "/blog",
}: NextReadBarProps) {
  const [visible, setVisible] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    // Check if already dismissed this session for this page
    const key = `nrb-dismissed-${slug}`;
    if (sessionStorage.getItem(key)) {
      setDismissed(true);
      return;
    }

    function handleScroll() {
      const scrollTop = window.scrollY;
      const docHeight =
        document.documentElement.scrollHeight - window.innerHeight;
      if (docHeight > 0) {
        setVisible(scrollTop / docHeight > 0.6);
      }
    }

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [slug]);

  if (dismissed) return null;

  const handleDismiss = () => {
    setDismissed(true);
    sessionStorage.setItem(`nrb-dismissed-${slug}`, "1");
  };

  return (
    <div
      className={`fixed bottom-0 left-0 right-0 z-40 transform border-t border-zinc-200 bg-white/95 backdrop-blur-sm transition-transform duration-300 dark:border-zinc-700 dark:bg-zinc-900/95 ${
        visible ? "translate-y-0" : "translate-y-full"
      }`}
    >
      <div className="mx-auto flex max-w-3xl items-center gap-3 px-4 py-3 sm:px-6">
        <span className="shrink-0 text-xs font-semibold uppercase tracking-wider text-blue-600 dark:text-blue-400">
          Read Next
        </span>
        <Link
          href={`${basePath}/${slug}`}
          className="min-w-0 flex-1 truncate text-sm font-medium text-zinc-900 hover:text-blue-600 dark:text-white dark:hover:text-blue-400"
        >
          {title}
        </Link>
        <Link
          href={`${basePath}/${slug}`}
          className="shrink-0 rounded-md bg-blue-600 px-3 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-blue-700"
        >
          Read &rarr;
        </Link>
        <button
          onClick={handleDismiss}
          className="shrink-0 p-1 text-zinc-400 transition-colors hover:text-zinc-600 dark:hover:text-zinc-300"
          aria-label="Dismiss"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  );
}
