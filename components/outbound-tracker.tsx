"use client";

// Global outbound-click listener. Fires a single GA4 event for every click on
// an outbound <a> anywhere on the site — including Sanity-authored body
// content where we can't wrap each link by hand. The event name is one of
// affiliate_click | partner_click | outbound_click (see lib/outbound-classify.ts).
//
// Mark "affiliate_click" as a Key Event in GA4 admin to count it as a
// conversion. To promote a known partner to paid-affiliate status, add it to
// PROVIDER_CONFIG in lib/provider-links.ts — the classifier then re-categorises
// its clicks as affiliate_click without further code changes.

import { useEffect } from "react";
import { classifyOutboundUrl, eventNameFor } from "@/lib/outbound-classify";
import { trackOutboundClick } from "./analytics";

export function OutboundTracker() {
  useEffect(() => {
    function handle(event: MouseEvent) {
      const target = event.target;
      if (!(target instanceof Element)) return;
      const anchor = target.closest("a");
      if (!(anchor instanceof HTMLAnchorElement)) return;

      // Escape hatch — opt a specific anchor out of tracking.
      if (anchor.hasAttribute("data-no-outbound-track")) return;

      const rawHref = anchor.getAttribute("href");
      if (!rawHref) return;

      let url: URL;
      try {
        url = new URL(rawHref, window.location.href);
      } catch {
        return;
      }
      if (url.protocol !== "http:" && url.protocol !== "https:") return;

      const linkHost = url.hostname.replace(/^www\./i, "").toLowerCase();
      const siteHost = window.location.hostname.replace(/^www\./i, "").toLowerCase();
      if (linkHost === siteHost || linkHost.endsWith(`.${siteHost}`)) return;

      const classification = classifyOutboundUrl(url.href);
      const linkText = (anchor.textContent || "").trim().slice(0, 100);

      trackOutboundClick({
        eventName: eventNameFor(classification.kind),
        partnerSlug: classification.partnerSlug,
        partnerName: classification.partnerName,
        linkUrl: url.href,
        linkDomain: linkHost,
        linkText: linkText || undefined,
        linkLocation: window.location.pathname,
      });
    }

    document.addEventListener("click", handle, { capture: true });
    document.addEventListener("auxclick", handle, { capture: true });
    return () => {
      document.removeEventListener("click", handle, { capture: true });
      document.removeEventListener("auxclick", handle, { capture: true });
    };
  }, []);

  return null;
}
