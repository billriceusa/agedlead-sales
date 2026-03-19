"use client";

import { trackCtaClick } from "./analytics";
import type { ReactNode } from "react";

interface TrackedAffiliateLinkProps {
  href: string;
  ctaId: string;
  ctaLocation: string;
  className?: string;
  children: ReactNode;
}

export function TrackedAffiliateLink({
  href,
  ctaId,
  ctaLocation,
  className,
  children,
}: TrackedAffiliateLinkProps) {
  return (
    <a
      href={href}
      target="_blank"
      rel="nofollow sponsored noopener noreferrer"
      className={className}
      onClick={() => trackCtaClick(ctaId, ctaLocation)}
    >
      {children}
    </a>
  );
}
