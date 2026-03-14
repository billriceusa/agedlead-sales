"use client";

import { useState, useMemo } from "react";
import Link from "next/link";

interface GlossaryTerm {
  _id: string;
  term: string;
  slug: { current: string };
  definition: string;
  category?: string;
}

interface GlossarySearchProps {
  terms: GlossaryTerm[];
}

const CATEGORIES = [
  { value: "", label: "All" },
  { value: "general", label: "General" },
  { value: "insurance", label: "Insurance" },
  { value: "mortgage", label: "Mortgage" },
  { value: "legal", label: "Legal" },
  { value: "sales", label: "Sales" },
  { value: "marketing", label: "Marketing" },
  { value: "compliance", label: "Compliance" },
  { value: "lead-generation", label: "Lead Generation" },
  { value: "finance", label: "Finance" },
];

export function GlossarySearch({ terms }: GlossarySearchProps) {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");

  const filteredTerms = useMemo(() => {
    return terms.filter((t) => {
      const matchesSearch =
        !search ||
        t.term.toLowerCase().includes(search.toLowerCase()) ||
        t.definition.toLowerCase().includes(search.toLowerCase());
      const matchesCategory = !category || t.category === category;
      return matchesSearch && matchesCategory;
    });
  }, [terms, search, category]);

  const letters = useMemo(() => {
    const unique = new Set(filteredTerms.map((t) => t.term[0].toUpperCase()));
    return Array.from(unique).sort();
  }, [filteredTerms]);

  const groupedTerms = useMemo(() => {
    const groups: Record<string, GlossaryTerm[]> = {};
    for (const term of filteredTerms) {
      const letter = term.term[0].toUpperCase();
      if (!groups[letter]) groups[letter] = [];
      groups[letter].push(term);
    }
    return groups;
  }, [filteredTerms]);

  return (
    <div>
      {/* Search and Filter */}
      <div className="mb-8 flex flex-col gap-4 sm:flex-row">
        <div className="flex-1">
          <input
            type="text"
            placeholder="Search terms..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-lg border border-zinc-300 bg-white px-4 py-2.5 text-sm text-zinc-900 placeholder-zinc-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white dark:placeholder-zinc-500"
          />
        </div>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="rounded-lg border border-zinc-300 bg-white px-4 py-2.5 text-sm text-zinc-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"
        >
          {CATEGORIES.map((cat) => (
            <option key={cat.value} value={cat.value}>
              {cat.label}
            </option>
          ))}
        </select>
      </div>

      {/* Letter Navigation */}
      <div className="mb-8 flex flex-wrap gap-1">
        {Array.from("ABCDEFGHIJKLMNOPQRSTUVWXYZ").map((letter) => (
          <a
            key={letter}
            href={letters.includes(letter) ? `#letter-${letter}` : undefined}
            className={`flex h-8 w-8 items-center justify-center rounded text-sm font-medium transition-colors ${
              letters.includes(letter)
                ? "bg-blue-100 text-blue-700 hover:bg-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:hover:bg-blue-900/50"
                : "bg-zinc-100 text-zinc-400 dark:bg-zinc-800 dark:text-zinc-600"
            }`}
          >
            {letter}
          </a>
        ))}
      </div>

      {/* Results count */}
      <p className="mb-6 text-sm text-zinc-500">
        {filteredTerms.length} {filteredTerms.length === 1 ? "term" : "terms"}
        {search && ` matching "${search}"`}
        {category && ` in ${CATEGORIES.find((c) => c.value === category)?.label}`}
      </p>

      {/* Term Groups */}
      <div className="space-y-10">
        {letters.map((letter) => (
          <div key={letter} id={`letter-${letter}`}>
            <h2 className="mb-4 border-b border-zinc-200 pb-2 text-2xl font-bold text-zinc-900 dark:border-zinc-800 dark:text-white">
              {letter}
            </h2>
            <div className="grid gap-4 sm:grid-cols-2">
              {groupedTerms[letter]?.map((term) => (
                <Link
                  key={term._id}
                  href={`/glossary/${term.slug.current}`}
                  className="group rounded-lg border border-zinc-200 bg-white p-4 transition-all hover:border-blue-300 hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-blue-700"
                >
                  <h3 className="font-semibold text-zinc-900 group-hover:text-blue-600 dark:text-white dark:group-hover:text-blue-400">
                    {term.term}
                  </h3>
                  <p className="mt-1 text-sm text-zinc-600 line-clamp-2 dark:text-zinc-400">
                    {term.definition}
                  </p>
                  {term.category && (
                    <span className="mt-2 inline-block rounded-full bg-zinc-100 px-2 py-0.5 text-xs text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400">
                      {term.category}
                    </span>
                  )}
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>

      {filteredTerms.length === 0 && (
        <p className="py-12 text-center text-zinc-500">
          No terms found. Try a different search or category.
        </p>
      )}
    </div>
  );
}
