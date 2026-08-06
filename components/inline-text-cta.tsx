import Link from "next/link";
import { affiliateUrl, storeCategoryPath, agedLeadLabel } from "@/lib/affiliate";
import { TrackedAffiliateLink } from "./tracked-affiliate-link";

interface InlineTextCtaProps {
  campaign?: string;
  /**
   * A Sanity `leadType.title` ("Mortgage Leads") or a slug. Both work — see
   * `storeCategoryPath`. Omit it and the CTA points at the full catalogue.
   */
  leadType?: string;
  content?: string;
  affiliate?: boolean;
}

export function InlineTextCta({
  campaign = "inline-cta",
  leadType,
  content = "inline-text",
  affiliate = true,
}: InlineTextCtaProps) {
  const verticalLabel = agedLeadLabel(leadType);

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

  const path = storeCategoryPath(leadType);
  const href = affiliateUrl({ path, campaign, content });
  const linkText = `Browse ${verticalLabel} at Aged Lead Store`;

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
      — exclusive and shared leads at a fraction of real-time cost, with
      verified, hygiene-screened contact data.{" "}
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
