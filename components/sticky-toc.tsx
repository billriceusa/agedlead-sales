"use client";

import { useEffect, useState } from "react";

interface StickyTocProps {
  headings: { id: string; text: string }[];
}

export function StickyToc({ headings }: StickyTocProps) {
  const [activeId, setActiveId] = useState<string>("");

  useEffect(() => {
    if (headings.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        // Find the first heading that is intersecting
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
            break;
          }
        }
      },
      {
        rootMargin: "-80px 0px -70% 0px",
        threshold: 0,
      }
    );

    // Observe all heading elements
    for (const { id } of headings) {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    }

    return () => observer.disconnect();
  }, [headings]);

  if (headings.length < 3) return null;

  const handleClick = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <nav
      className="hidden xl:block absolute right-0 top-0 w-56 translate-x-[calc(100%+2rem)]"
      aria-label="Table of contents"
    >
      <div className="sticky top-20">
        <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
          On this page
        </p>
        <ul className="space-y-1.5 border-l border-zinc-200 dark:border-zinc-800">
          {headings.map(({ id, text }) => (
            <li key={id}>
              <button
                onClick={() => handleClick(id)}
                className={`block w-full border-l-2 py-1 pl-3 text-left text-xs leading-snug transition-colors ${
                  activeId === id
                    ? "border-blue-500 font-medium text-blue-600 dark:text-blue-400"
                    : "border-transparent text-zinc-500 hover:text-zinc-700 dark:text-zinc-500 dark:hover:text-zinc-300"
                }`}
              >
                {text}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}
