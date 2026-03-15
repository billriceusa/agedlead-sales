const AFFILIATE_BASE_URL = "https://agedleadstore.com";
const UTM_SOURCE = "agedleadsales";
const UTM_MEDIUM = "affiliate";

interface AffiliateLink {
  path?: string;
  campaign: string;
  content: string;
}

export function affiliateUrl({ path = "", campaign, content }: AffiliateLink): string {
  const base = path ? `${AFFILIATE_BASE_URL}${path}` : AFFILIATE_BASE_URL;
  const params = new URLSearchParams({
    utm_source: UTM_SOURCE,
    utm_medium: UTM_MEDIUM,
    utm_campaign: campaign,
    utm_content: content,
  });
  return `${base}?${params.toString()}`;
}

export function affiliateRegisterUrl(campaign: string, content: string): string {
  return affiliateUrl({ path: "/register", campaign, content });
}
