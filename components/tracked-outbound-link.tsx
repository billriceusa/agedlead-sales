"use client";

import { trackCtaClick } from "./analytics";
import type { ReactNode } from "react";

interface TrackedOutboundLinkProps {
  href: string;
  ctaId: string;
  ctaLocation: string;
  isAffiliate?: boolean;
  className?: string;
  children: ReactNode;
}

export function TrackedOutboundLink({
  href,
  ctaId,
  ctaLocation,
  isAffiliate = false,
  className,
  children,
}: TrackedOutboundLinkProps) {
  return (
    <a
      href={href}
      target="_blank"
      rel={
        isAffiliate
          ? "nofollow sponsored noopener noreferrer"
          : "nofollow noopener noreferrer"
      }
      className={className}
      onClick={() => trackCtaClick(ctaId, ctaLocation)}
    >
      {children}
    </a>
  );
}
