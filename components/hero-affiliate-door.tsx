import Link from "next/link";
import { affiliateUrl, storeCategoryPath, agedLeadLabel } from "@/lib/affiliate";
import { TrackedAffiliateLink } from "./tracked-affiliate-link";

/**
 * The above-the-fold outbound door for commercial pages.
 *
 * WHY THIS EXISTS
 *
 * The 2026-08-18 scoreboard reading (data/loop/ledger.json) separated demand
 * from conversion for the first time. `/providers/aged-lead-store` converted at
 * 43.33% on 90 views and supplied 39 of 69 affiliate clicks; the four biggest
 * `/lead-types/*` pages carried 629 views and converted at ~0.95%.
 *
 * The gap was not CTA *count* — the lead-type pages already carried more
 * affiliate surfaces than the provider page. It was position and destination.
 * The provider page puts an outbound door in the hero
 * (`providers/[slug]/page.tsx`, "Visit Website"); the lead-type heroes offered
 * only two internal links, so a reader at peak intent was routed to another
 * page on this site instead of to the merchant.
 *
 * This component is that missing door, deep-linked to the specific lead type's
 * category rather than the generic catalogue.
 *
 * Intent on a guide page is genuinely lower than on a provider review, so the
 * 43% rate is not the target. The hypothesis under test is 5% — see `nextPick`
 * in the ledger. Measure via `utm_content=hero-door` in
 * `/api/reports/outbound-clicks`, and kill this if it does not move.
 */
interface HeroAffiliateDoorProps {
  /**
   * A Sanity `leadType.title` ("Mortgage Leads") or a slug — `storeCategoryPath`
   * accepts both. Omit for the hub page, which lands on the full catalogue.
   */
  leadType?: string;
  campaign: string;
  content?: string;
  /** Secondary links rendered beside the door, in order. */
  secondary?: { label: string; href: string }[];
  /**
   * Which background this sits on. `dark` is the gradient hero on
   * `/lead-types/[slug]`; `light` is the plain hub header. Getting this wrong
   * renders a white button on a white background, so it is explicit rather
   * than inferred.
   */
  tone?: "dark" | "light";
}

const TONE = {
  dark: {
    primary:
      "bg-white text-blue-900 shadow-lg hover:bg-blue-50",
    secondary:
      "border-2 border-white/30 text-white hover:bg-white/10",
    disclosure: "text-zinc-400",
    disclosureLink: "underline hover:text-zinc-200",
  },
  light: {
    primary:
      "bg-blue-600 text-white shadow-lg hover:bg-blue-700",
    // border-zinc-400 clears the 3:1 non-text contrast bar on white; the
    // zinc-300 used for decorative rules elsewhere does not.
    secondary:
      "border-2 border-zinc-400 text-zinc-800 hover:bg-zinc-100 dark:border-zinc-600 dark:text-zinc-100 dark:hover:bg-zinc-800",
    disclosure: "text-zinc-500 dark:text-zinc-400",
    disclosureLink: "underline hover:text-zinc-800 dark:hover:text-zinc-200",
  },
} as const;

export function HeroAffiliateDoor({
  leadType,
  campaign,
  content = "hero-door",
  secondary = [],
  tone = "dark",
}: HeroAffiliateDoorProps) {
  const t = TONE[tone];
  const href = affiliateUrl({
    path: storeCategoryPath(leadType),
    campaign,
    content,
  });

  return (
    <div className="mt-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:flex-wrap">
        <TrackedAffiliateLink
          href={href}
          ctaId={`hero-door-${campaign}-${content}`}
          ctaLocation="hero-affiliate-door"
          className={`inline-flex items-center justify-center gap-2 rounded-lg px-8 py-3 text-center font-semibold transition-colors ${t.primary}`}
        >
          Browse {agedLeadLabel(leadType)} at Aged Lead Store
          <svg
            className="h-3.5 w-3.5"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M4.5 19.5l15-15m0 0H8.25m11.25 0v11.25"
            />
          </svg>
        </TrackedAffiliateLink>

        {/* Secondary paths keep their place — the internal compare and pricing
            routes are how this site earns the trust that makes the door work.
            They lose the primary styling, not the position. */}
        {secondary.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={`rounded-lg px-8 py-3 text-center font-semibold transition-colors ${t.secondary}`}
          >
            {link.label}
          </Link>
        ))}
      </div>

      <p className={`mt-4 max-w-2xl text-xs ${t.disclosure}`}>
        Affiliate link — we may earn a commission at no cost to you, and it never
        affects our ratings or recommendations.{" "}
        <Link href="/affiliate-disclosure" className={t.disclosureLink}>
          Disclosure
        </Link>
      </p>
    </div>
  );
}
