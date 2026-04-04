"use client";

import Link from "next/link";

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
}

export function Breadcrumbs({ items }: BreadcrumbsProps) {
  return (
    <nav aria-label="Breadcrumb" className="mb-8 text-sm text-zinc-500">
      <ol className="flex flex-wrap items-center gap-1">
        <li>
          <Link
            href="/"
            className="transition-colors hover:text-zinc-700 dark:hover:text-zinc-300"
          >
            Home
          </Link>
        </li>
        {items.map((item, index) => (
          <li key={index} className="flex items-center gap-1">
            <span className="mx-1 text-zinc-400">/</span>
            {item.href && index < items.length - 1 ? (
              <Link
                href={item.href}
                className="transition-colors hover:text-zinc-700 dark:hover:text-zinc-300"
              >
                {item.label}
              </Link>
            ) : (
              <span className="text-zinc-900 dark:text-white">
                {item.label}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
