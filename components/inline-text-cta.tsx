import Link from "next/link";
import { affiliateUrl } from "@/lib/affiliate";
import { TrackedAffiliateLink } from "./tracked-affiliate-link";

interface InlineTextCtaProps {
  campaign?: string;
  leadType?: string;
  content?: string;
  affiliate?: boolean;
}

const LEAD_TYPE_PATHS: Record<string, string> = {
  mortgage: "/mortgage-leads/",
  insurance: "/insurance-leads/",
  "final-expense": "/final-expense-leads/",
  medicare: "/medicare-leads/",
  auto: "/auto-insurance-leads/",
  home: "/home-services-leads/",
  "home-services": "/home-services-leads/",
  solar: "/solar-leads/",
};

export function InlineTextCta({
  campaign = "inline-cta",
  leadType,
  content = "inline-text",
  affiliate = true,
}: InlineTextCtaProps) {
  const verticalLabel = leadType
    ? `aged ${leadType.replace("-", " ")} leads`
    : "aged leads";

  if (!affiliate) {
    return (
      <p className="mb-8 rounded-lg border-l-4 border-blue-500 bg-blue-50 px-4 py-3 text-sm leading-relaxed text-zinc-700 dark:bg-blue-950/30 dark:text-zinc-300">
        <strong className="text-zinc-900 dark:text-white">
          Looking for {verticalLabel}?
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

  const path = leadType ? LEAD_TYPE_PATHS[leadType] : undefined;
  const href = affiliateUrl({ path, campaign, content });
  const linkText = leadType
    ? `Browse ${verticalLabel} at Aged Lead Store`
    : "Browse aged leads at Aged Lead Store";

  return (
    <p className="mb-8 rounded-lg border-l-4 border-blue-500 bg-blue-50 px-4 py-3 text-sm leading-relaxed text-zinc-700 dark:bg-blue-950/30 dark:text-zinc-300">
      <strong className="text-zinc-900 dark:text-white">
        Looking for {verticalLabel}?
      </strong>{" "}
      <TrackedAffiliateLink
        href={href}
        ctaId={`inline-cta-${campaign}-${content}`}
        ctaLocation="inline-text-cta"
        className="font-medium text-blue-600 underline decoration-blue-600/30 hover:text-blue-700 hover:decoration-blue-700/50 dark:text-blue-400"
      >
        {linkText}
      </TrackedAffiliateLink>{" "}
      — exclusive and shared leads at a fraction of real-time cost, with consent
      documentation included.{" "}
      <Link
        href="/providers"
        className="text-zinc-600 underline decoration-zinc-400 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-200"
      >
        Or compare other providers
      </Link>
      .
    </p>
  );
}
