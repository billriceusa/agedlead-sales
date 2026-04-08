"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";

interface GlossaryTooltipProps {
  term: string;
  definition: string;
  slug: string;
  children: React.ReactNode;
}

export function GlossaryTooltip({
  term,
  definition,
  slug,
  children,
}: GlossaryTooltipProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [position, setPosition] = useState<"above" | "below">("below");
  const triggerRef = useRef<HTMLSpanElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  useEffect(() => {
    if (isOpen && triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect();
      const spaceBelow = window.innerHeight - rect.bottom;
      setPosition(spaceBelow < 160 ? "above" : "below");
    }
  }, [isOpen]);

  // Close on outside click (mobile)
  useEffect(() => {
    if (!isOpen) return;
    function handleClick(e: MouseEvent) {
      if (
        triggerRef.current &&
        !triggerRef.current.contains(e.target as Node) &&
        tooltipRef.current &&
        !tooltipRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    }
    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, [isOpen]);

  const show = () => {
    clearTimeout(timeoutRef.current);
    setIsOpen(true);
  };

  const hide = () => {
    timeoutRef.current = setTimeout(() => setIsOpen(false), 150);
  };

  return (
    <span className="relative inline">
      <span
        ref={triggerRef}
        onMouseEnter={show}
        onMouseLeave={hide}
        onClick={() => setIsOpen((o) => !o)}
        className="cursor-help border-b border-dashed border-blue-400/50 text-inherit transition-colors hover:border-blue-500 dark:border-blue-500/40 dark:hover:border-blue-400"
      >
        {children}
      </span>
      {isOpen && (
        <span
          ref={tooltipRef}
          onMouseEnter={show}
          onMouseLeave={hide}
          className={`absolute left-1/2 z-50 w-64 -translate-x-1/2 rounded-lg border border-zinc-200 bg-white p-3 shadow-lg dark:border-zinc-700 dark:bg-zinc-800 sm:w-72 ${
            position === "above" ? "bottom-full mb-2" : "top-full mt-2"
          }`}
          role="tooltip"
        >
          <span className="mb-1 block text-xs font-semibold uppercase tracking-wider text-blue-600 dark:text-blue-400">
            {term}
          </span>
          <span className="block text-sm leading-relaxed text-zinc-600 dark:text-zinc-300">
            {definition}
          </span>
          <Link
            href={`/glossary/${slug}`}
            className="mt-2 block text-xs font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400"
          >
            Full definition &rarr;
          </Link>
        </span>
      )}
    </span>
  );
}
