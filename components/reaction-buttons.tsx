"use client";

import { useState } from "react";
import { trackEvent } from "./analytics";

interface ReactionButtonsProps {
  slug: string;
  contentType?: string;
}

const REACTIONS = [
  { id: "helpful", label: "Helpful", icon: "M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" },
  { id: "surprising", label: "Surprising", icon: "M13 10V3L4 14h7v7l9-11h-7z" },
  { id: "need-more", label: "Need More Detail", icon: "M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" },
] as const;

export function ReactionButtons({ slug, contentType = "article" }: ReactionButtonsProps) {
  const [selected, setSelected] = useState<string | null>(null);

  const handleReaction = (reactionId: string) => {
    if (selected) return; // One reaction per page view
    setSelected(reactionId);
    trackEvent("article_reaction", {
      reaction: reactionId,
      slug,
      content_type: contentType,
    });
  };

  return (
    <div className="mt-10 border-t border-zinc-200 pt-8 dark:border-zinc-800">
      <p className="mb-4 text-sm font-medium text-zinc-700 dark:text-zinc-300">
        {selected ? "Thanks for your feedback" : "Was this article helpful?"}
      </p>
      <div className="flex flex-wrap gap-2">
        {REACTIONS.map((reaction) => (
          <button
            key={reaction.id}
            onClick={() => handleReaction(reaction.id)}
            disabled={selected !== null}
            className={`inline-flex items-center gap-2 rounded-lg border px-4 py-2 text-sm font-medium transition-colors ${
              selected === reaction.id
                ? "border-blue-500 bg-blue-50 text-blue-700 dark:border-blue-600 dark:bg-blue-950/50 dark:text-blue-400"
                : selected
                  ? "cursor-default border-zinc-200 text-zinc-400 dark:border-zinc-800 dark:text-zinc-600"
                  : "border-zinc-200 text-zinc-600 hover:border-zinc-300 hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-400 dark:hover:border-zinc-600 dark:hover:bg-zinc-800"
            }`}
          >
            <svg
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.5}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d={reaction.icon} />
            </svg>
            {reaction.label}
          </button>
        ))}
      </div>
    </div>
  );
}
