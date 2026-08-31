"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { trackCtaClick } from "./analytics";

interface TrackedInternalLinkProps {
  href: string;
  ctaId: string;
  ctaLocation: string;
  className?: string;
  children: ReactNode;
}

/**
 * An internal <Link> that fires the GA4 `cta_click` event.
 *
 * TrackedOutboundLink is the wrong tool for an internal destination: it forces
 * target="_blank" and rel="nofollow", both of which are wrong for a link into
 * our own comparison cluster — the nofollow in particular would waste the
 * internal link equity this is partly meant to deliver.
 *
 * Outbound clicks are counted by linkDomain in GA4, so an internal CTA is
 * invisible to /api/reports/outbound-clicks by construction. The measurement
 * path is downstream instead: this link raises pageviews on /compare/*, and
 * `affiliate.byPage30d` already reports affiliate clicks per page — so the
 * effect shows up as compare-page affiliate clicks, not as an event on this
 * button. The cta_click here exists to size the top of that funnel.
 */
export function TrackedInternalLink({
  href,
  ctaId,
  ctaLocation,
  className,
  children,
}: TrackedInternalLinkProps) {
  return (
    <Link
      href={href}
      className={className}
      onClick={() => trackCtaClick(ctaId, ctaLocation)}
    >
      {children}
    </Link>
  );
}
