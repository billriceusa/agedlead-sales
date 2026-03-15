const AFFILIATE_BASE_URL = "https://agedleadstore.com";
const UTM_SOURCE = "agedleadsales";
const UTM_MEDIUM = "affiliate";

interface AffiliateLink {
  path?: string;
  campaign: string;
  content: string;
}

export function affiliateUrl({ path = "/all-lead-types/", campaign, content }: AffiliateLink): string {
  const base = `${AFFILIATE_BASE_URL}${path}`;
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
