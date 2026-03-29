import Link from "next/link";

interface InlineTextCtaProps {
  campaign?: string;
  leadType?: string;
}

export function InlineTextCta({
  campaign = "inline-text-cta",
  leadType,
}: InlineTextCtaProps) {
  return (
    <p className="mb-8 rounded-lg border-l-4 border-blue-500 bg-blue-50 px-4 py-3 text-sm leading-relaxed text-zinc-700 dark:bg-blue-950/30 dark:text-zinc-300">
      <strong className="text-zinc-900 dark:text-white">
        Looking for aged leads?
      </strong>{" "}
      <Link
        href="/providers"
        className="font-medium text-blue-600 underline decoration-blue-600/30 hover:text-blue-700 hover:decoration-blue-700/50 dark:text-blue-400"
      >
        Compare top providers in our directory
      </Link>{" "}
      — thousands of exclusive and shared leads at a fraction of real-time cost.
    </p>
  );
}
