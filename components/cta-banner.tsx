import Link from "next/link";
import { affiliateUrl } from "@/lib/affiliate";
import { TrackedAffiliateLink } from "./tracked-affiliate-link";

interface CtaBannerProps {
  headline?: string;
  description?: string;
  buttonText?: string;
  buttonHref?: string;
  secondaryText?: string;
  secondaryHref?: string;
  campaign?: string;
  variant?: "default" | "compact";
  affiliate?: boolean;
  affiliateContent?: string;
  affiliatePath?: string;
}

export function CtaBanner({
  headline,
  description,
  buttonText,
  buttonHref,
  secondaryText,
  secondaryHref,
  campaign = "cta-banner",
  variant = "default",
  affiliate = true,
  affiliateContent = "primary",
  affiliatePath,
}: CtaBannerProps) {
  const useAffiliate = affiliate && !buttonHref;

  const finalHeadline =
    headline ??
    (useAffiliate
      ? "Ready to Buy Aged Leads?"
      : "Find the Right Lead Provider");
  const finalDescription =
    description ??
    (useAffiliate
      ? "Browse aged leads across mortgage, insurance, home services, and more — with data verification and hygiene, suppression support, and fair-market pricing."
      : "Compare providers, check fair market pricing, and calculate your ROI — all with our free tools.");
  const finalButtonText =
    buttonText ??
    (useAffiliate ? "Browse Aged Leads at Aged Lead Store" : "Compare Providers");
  const finalSecondaryText =
    secondaryText ?? (useAffiliate ? "Compare All Providers" : "Check Pricing");
  const finalSecondaryHref = useAffiliate
    ? secondaryHref ?? "/providers"
    : secondaryHref ?? "/price-index";

  const primaryUrl = useAffiliate
    ? affiliateUrl({ path: affiliatePath, campaign, content: affiliateContent })
    : buttonHref ?? "/providers";

  if (variant === "compact") {
    return (
      <div className="rounded-xl border border-blue-200 bg-blue-50 p-6 dark:border-blue-900 dark:bg-blue-950/50">
        <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-between">
          <div>
            <h3 className="font-semibold text-zinc-900 dark:text-white">
              {finalHeadline}
            </h3>
            <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
              {finalDescription}
            </p>
          </div>
          {useAffiliate ? (
            <TrackedAffiliateLink
              href={primaryUrl}
              ctaId={`cta-banner-${campaign}-${affiliateContent}`}
              ctaLocation="cta-banner-compact"
              className="shrink-0 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-700"
            >
              {finalButtonText}
            </TrackedAffiliateLink>
          ) : (
            <Link
              href={primaryUrl}
              className="shrink-0 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-700"
            >
              {finalButtonText}
            </Link>
          )}
        </div>
        {useAffiliate && (
          <p className="mt-3 text-xs text-zinc-500">
            Affiliate link — we may earn a commission at no cost to you, and it
            never affects our ratings.{" "}
            <Link
              href="/affiliate-disclosure"
              className="underline hover:text-zinc-700 dark:hover:text-zinc-300"
            >
              Disclosure
            </Link>
          </p>
        )}
      </div>
    );
  }

  return (
    <section className="bg-gradient-to-br from-blue-600 to-blue-800 dark:from-blue-800 dark:to-blue-950">
      <div className="mx-auto max-w-4xl px-4 py-16 text-center sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
          {finalHeadline}
        </h2>
        <p className="mx-auto mt-4 max-w-2xl text-lg text-blue-100">
          {finalDescription}
        </p>
        <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
          {useAffiliate ? (
            <TrackedAffiliateLink
              href={primaryUrl}
              ctaId={`cta-banner-${campaign}-${affiliateContent}`}
              ctaLocation="cta-banner"
              className="rounded-lg bg-white px-8 py-3 text-base font-semibold text-blue-700 shadow-lg transition-colors hover:bg-blue-50"
            >
              {finalButtonText}
            </TrackedAffiliateLink>
          ) : (
            <Link
              href={primaryUrl}
              className="rounded-lg bg-white px-8 py-3 text-base font-semibold text-blue-700 shadow-lg transition-colors hover:bg-blue-50"
            >
              {finalButtonText}
            </Link>
          )}
          <Link
            href={finalSecondaryHref}
            className="rounded-lg border-2 border-white/30 px-8 py-3 text-base font-semibold text-white transition-colors hover:bg-white/10"
          >
            {finalSecondaryText}
          </Link>
        </div>
        {useAffiliate && (
          <p className="mx-auto mt-6 max-w-2xl text-xs text-blue-100/80">
            Affiliate link — we may earn a commission at no cost to you, and it
            never affects our ratings or recommendations.{" "}
            <Link href="/affiliate-disclosure" className="underline hover:text-white">
              Disclosure
            </Link>
          </p>
        )}
      </div>
    </section>
  );
}
