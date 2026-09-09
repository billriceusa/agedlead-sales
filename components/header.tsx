"use client";

import Link from "next/link";
import { useState } from "react";
import { affiliateUrl } from "@/lib/affiliate";
import { TrackedAffiliateLink } from "./tracked-affiliate-link";

const navigation = [
  { name: "Start Here", href: "/start-here" },
  { name: "Lead Types", href: "/lead-types" },
  { name: "Providers", href: "/providers" },
  { name: "Compare", href: "/compare" },
  { name: "Price Index", href: "/price-index" },
  { name: "Blog", href: "/blog" },
  { name: "Playbook", href: "/playbook" },
  { name: "Calculators", href: "/calculators" },
];

/**
 * The persistent store door.
 *
 * WHY THIS REPLACED AN INTERNAL BUTTON
 *
 * Read the store-side scoreboard (GA4 `357329146`, the property where
 * commission is actually computed) by placement, and the whole business turns
 * out to have run through this one surface on the retired domain:
 *
 *   Jul 2026  howtoworkleads / website / header-nav  96 sessions   $9,132.60  ( 6 txn)
 *
 * That is 91% of July's attributed store revenue, from a link in the site
 * header.
 *
 * CORRECTION 2026-09-09. This comment previously also cited
 * `May 2026  howtoworkleads / website / cta  79 sessions  $16,834.60 (10 txn)`
 * as "99% of May's attributed store revenue" from this same placement. That
 * attribution was wrong and it overstated the case for the header. The retired
 * site's button component defaulted its campaign — `utmCampaign || 'cta'` in
 * `apps/web/components/ui/Button.tsx:93` — so `cta` was the catch-all bucket
 * for every untagged button site-wide, not this link. The header was always
 * explicitly tagged `header-nav` (`HeaderClient.tsx:295`). The July figure
 * above is uniquely tagged and stands; the May figure has been removed rather
 * than restated, because there is no way to recover which placements it held.
 *
 * Over the same July, this site's own pushed placements
 * carried comparable traffic and earned almost nothing — `cta-banner` took 91
 * sessions to $100.50, and `blog-post` took 57 sessions to $0. Roughly $95-213
 * per session against ~$1.
 *
 * The difference is not volume, it is posture. A header link is *pulled* by a
 * reader who has decided to go buy; a banner under an article is *pushed* at a
 * reader who has not. When howtoworkleads.com was retired into this domain on
 * 2026-08-03 the header link went with it — `header-nav` fell from 96 sessions
 * to 2 — and August attributed revenue fell to $616.50.
 *
 * What stood here instead was a blue "Find Providers" button pointing at
 * `/providers`, duplicating the "Providers" item already third in the nav above
 * and sending peak intent to the worst-converting page on the site (165 views,
 * 0.61%). Swapping it costs no navigation and restores the one placement with a
 * measured record of earning.
 *
 * The campaign is deliberately `header-nav`, matching the retired site's, so
 * the scoreboard reads as one continuous series across the consolidation.
 *
 * Editorially this is safe in the header: `AffiliateDisclosure` renders
 * site-wide from `app/(site)/layout.tsx`, `TrackedAffiliateLink` emits
 * `rel="nofollow sponsored"`, and the provider reviews below stay independent —
 * that independence is the asset and nothing here touches it.
 *
 * Measure `utm_campaign=header-nav` in GA4 `357329146` — store-side sessions,
 * not clicks on this site — and kill it if it does not move.
 *
 * WHY THERE ARE THREE HREFS, NOT ONE (2026-09-09)
 *
 * Until today every render site shared one constant, so desktop and mobile
 * were indistinguishable in the scoreboard. That mattered because the retired
 * site DID separate them (`header-nav` vs `header-nav-mobile`), which means
 * July's 96 sessions were desktop-only and any comparison against a blended
 * figure is not like-for-like. Splitting `utm_content` keeps the campaign — and
 * therefore the continuous series — while making the next reading attributable.
 *
 * The bug this fixes: the store button rendered only inside `md:flex` and
 * inside the collapsed mobile menu. Below 768px it was `display:none` unless
 * the reader opened the hamburger, so roughly 40% of the audience had no
 * header door at all. Verified live at 390px: hamburger only, no button.
 */
const STORE_HREF = affiliateUrl({ campaign: "header-nav", content: "header" });
/** Always visible in the mobile bar — the gap this fixes. */
const STORE_HREF_MOBILE = affiliateUrl({
  campaign: "header-nav",
  content: "header-mobile",
});
/** Inside the opened menu. Kept, and now separable from the bar button. */
const STORE_HREF_MOBILE_MENU = affiliateUrl({
  campaign: "header-nav",
  content: "header-mobile-menu",
});

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-zinc-200 bg-white/80 backdrop-blur-lg dark:border-zinc-800 dark:bg-zinc-950/80">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2">
          <span className="text-xl font-bold tracking-tight text-zinc-900 dark:text-white">
            Work Aged Leads
          </span>
        </Link>

        {/*
          Desktop nav. `xl` (1280px), not `md` (768px).

          Eight nav items plus the store button do not fit below ~1200px. At 768
          the row overflowed its container and the button clipped past the
          viewport edge; `lg` (1024) was tried first and still wrapped both the
          wordmark and the button onto two lines — screenshotted, not assumed.
          1280 is the first width that renders on one clean line.

          Everything below now gets the mobile bar, which since today carries an
          always-visible store button. A hamburger at 1024 is a real cost, but a
          clipped nav with a two-line button is a worse one, and the store door
          is now present at every width instead of vanishing below 768.
        */}
        <div className="hidden items-center gap-1 xl:flex">
          {navigation.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className="rounded-lg px-3 py-2 text-sm font-medium text-zinc-600 transition-colors hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-white"
            >
              {item.name}
            </Link>
          ))}
          <TrackedAffiliateLink
            href={STORE_HREF}
            ctaId="header-nav"
            ctaLocation="header"
            className="ml-3 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-blue-700"
          >
            Buy Aged Leads
          </TrackedAffiliateLink>
        </div>

        {/* Mobile bar — store door beside the hamburger, not hidden inside it */}
        <div className="flex items-center gap-2 xl:hidden">
          {/*
            The label is shortened from "Buy Aged Leads" purely to fit beside a
            165px wordmark and the hamburger at 390px. The destination is the
            same aged-lead catalogue and the surrounding page says "aged" in the
            headline, so nothing is misrepresented by the shorter text.
          */}
          <TrackedAffiliateLink
            href={STORE_HREF_MOBILE}
            ctaId="header-nav"
            ctaLocation="header-mobile-bar"
            className="rounded-lg bg-blue-600 px-3 py-2 text-sm font-semibold whitespace-nowrap text-white transition-colors hover:bg-blue-700"
          >
            Buy Leads
          </TrackedAffiliateLink>
          <button
            type="button"
            className="inline-flex items-center justify-center rounded-lg p-2 text-zinc-600 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-800"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
          {mobileMenuOpen ? (
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
            </svg>
          )}
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="border-t border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950 xl:hidden">
          <div className="space-y-1 px-4 py-3">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="block rounded-lg px-3 py-2 text-base font-medium text-zinc-600 transition-colors hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-white"
                onClick={() => setMobileMenuOpen(false)}
              >
                {item.name}
              </Link>
            ))}
            <TrackedAffiliateLink
              href={STORE_HREF_MOBILE_MENU}
              ctaId="header-nav"
              ctaLocation="header-mobile-menu"
              className="mt-2 block rounded-lg bg-blue-600 px-4 py-2 text-center text-base font-semibold text-white transition-colors hover:bg-blue-700"
            >
              Buy Aged Leads
            </TrackedAffiliateLink>
          </div>
        </div>
      )}
    </header>
  );
}
