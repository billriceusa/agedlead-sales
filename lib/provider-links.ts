/**
 * Provider-agnostic link builder with UTM tracking.
 * Affiliate partners get utm_medium=affiliate; others get utm_medium=referral.
 */

import { AFFILIATE_UTM_SOURCE } from "./utm";

const UTM_SOURCE = AFFILIATE_UTM_SOURCE;

interface ProviderConfig {
  baseUrl: string;
  defaultPath: string;
  isAffiliate: boolean;
}

/**
 * Registry of providers with affiliate or referral tracking config.
 * Add new affiliate partners here as relationships are established.
 */
const PROVIDER_CONFIG: Record<string, ProviderConfig> = {
  "aged-lead-store": {
    baseUrl: "https://agedleadstore.com",
    defaultPath: "/all-lead-types/",
    isAffiliate: true,
  },
  // Future affiliate partners can be added here:
  // "provider-slug": { baseUrl: "https://...", defaultPath: "/", isAffiliate: true },
};

interface ProviderLinkOptions {
  path?: string;
  campaign: string;
  content: string;
}

/**
 * Generate a tracked URL for a known provider (by slug).
 * Returns the provider's website URL with UTM parameters.
 * Falls back to undefined if provider is not in config.
 */
export function providerUrl(
  slug: string,
  { path, campaign, content }: ProviderLinkOptions
): string | undefined {
  const config = PROVIDER_CONFIG[slug];
  if (!config) return undefined;

  const base = `${config.baseUrl}${path || config.defaultPath}`;
  const params = new URLSearchParams({
    utm_source: UTM_SOURCE,
    utm_medium: config.isAffiliate ? "affiliate" : "referral",
    utm_campaign: campaign,
    utm_content: content,
  });
  return `${base}?${params.toString()}`;
}

/**
 * Generate a tracked URL for ANY provider website (by URL string).
 * Works for providers not in our config — uses referral tracking.
 */
export function providerWebsiteUrl(
  websiteUrl: string,
  { campaign, content }: { campaign: string; content: string }
): string {
  // Check if this website matches a known affiliate partner
  const affiliateEntry = Object.values(PROVIDER_CONFIG).find((config) =>
    websiteUrl.startsWith(config.baseUrl)
  );

  const separator = websiteUrl.includes("?") ? "&" : "?";
  const params = new URLSearchParams({
    utm_source: UTM_SOURCE,
    utm_medium: affiliateEntry?.isAffiliate ? "affiliate" : "referral",
    utm_campaign: campaign,
    utm_content: content,
  });
  return `${websiteUrl}${separator}${params.toString()}`;
}

/**
 * Check if a provider slug has an affiliate relationship.
 */
export function isAffiliateProvider(slug: string): boolean {
  return PROVIDER_CONFIG[slug]?.isAffiliate ?? false;
}
