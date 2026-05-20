// Classifies an external URL into one of three GA4 event categories:
//   - "affiliate" — a paid affiliate partner (currently aged-lead-store). Fires
//     event "affiliate_click". Bill marks this event as a GA4 Key Event
//     (conversion) in GA4 admin.
//   - "partner"   — a known lead provider catalogued in data/partner-hosts.ts
//     (the slim mirror of data/providers.ts) but not yet under a paid affiliate
//     relationship. Fires event "partner_click". Promote to a Key Event later
//     by adding the slug to PROVIDER_CONFIG in lib/provider-links.ts — the
//     classifier then re-categorises its clicks as affiliate_click without
//     further code changes.
//   - "outbound"  — any other external URL (citations, news, etc.). Fires
//     event "outbound_click".
//
// The same registry split also drives UTM tagging in provider-links.ts
// (utm_medium=affiliate vs referral), so promoting a partner is a one-line
// change that flips both the event name and the UTM medium together.

import { findPartnerByHost } from "@/data/partner-hosts";
import { isAffiliateProvider } from "./provider-links";

export type OutboundKind = "affiliate" | "partner" | "outbound";

export interface OutboundClassification {
  kind: OutboundKind;
  /** Provider slug when kind is "affiliate" or "partner". Undefined for "outbound". */
  partnerSlug?: string;
  /** Provider display name when known. Undefined for "outbound". */
  partnerName?: string;
}

/**
 * Classify an absolute external URL.
 * Caller is responsible for ensuring the URL is external (not same-origin).
 */
export function classifyOutboundUrl(url: string): OutboundClassification {
  let host: string;
  try {
    host = new URL(url).hostname;
  } catch {
    return { kind: "outbound" };
  }

  const partner = findPartnerByHost(host);
  if (!partner) return { kind: "outbound" };

  return {
    kind: isAffiliateProvider(partner.slug) ? "affiliate" : "partner",
    partnerSlug: partner.slug,
    partnerName: partner.name,
  };
}

/** Event name emitted to GA4 for each classification. */
export function eventNameFor(kind: OutboundKind): string {
  switch (kind) {
    case "affiliate":
      return "affiliate_click";
    case "partner":
      return "partner_click";
    case "outbound":
      return "outbound_click";
  }
}
