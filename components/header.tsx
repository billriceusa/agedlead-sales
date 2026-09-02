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
 *   May 2026  howtoworkleads / website / cta         79 sessions  $16,834.60  (10 txn)
 *   Jul 2026  howtoworkleads / website / header-nav  96 sessions   $9,132.60  ( 6 txn)
 *
 * That is 99% of May's attributed store revenue and 91% of July's, from a link
 * in the site header. Over the same July, this site's own pushed placements
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
 */
const STORE_HREF = affiliateUrl({ campaign: "header-nav", content: "header" });

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

        {/* Desktop nav */}
        <div className="hidden items-center gap-1 md:flex">
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

        {/* Mobile menu button */}
        <button
          type="button"
          className="inline-flex items-center justify-center rounded-lg p-2 text-zinc-600 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-800 md:hidden"
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
      </nav>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="border-t border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950 md:hidden">
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
              href={STORE_HREF}
              ctaId="header-nav"
              ctaLocation="header-mobile"
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
