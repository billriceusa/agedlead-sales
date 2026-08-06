import { AFFILIATE_UTM_SOURCE } from "./utm";

const AFFILIATE_BASE_URL = "https://agedleadstore.com";
const UTM_SOURCE = AFFILIATE_UTM_SOURCE;
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

/**
 * Lead type → the matching Aged Lead Store category page.
 *
 * Keyed by the Sanity `leadType.title` normalised to a slug ("Mortgage Leads"
 * → "mortgage-leads"), because that title is what every caller actually has.
 *
 * EVERY path here was verified 200 with zero redirects on 2026-08-06. Do not
 * add an entry without checking it the same way — this is the money link, and
 * a 404 here costs a sale rather than losing a ranking. Note the partner's
 * slugs do NOT mirror ours: final expense is `/online-final-expense-leads/`,
 * solar is `/solar-installation-leads/`, and IUL is spelled out. The obvious
 * guesses (`/medicare-leads/`, `/home-services-leads/`) are 404s, and
 * `/solar-leads/` redirects to a blog post rather than a category.
 *
 * Medicare is deliberately ABSENT: the partner has no Medicare category (only
 * `/u65-leads/`, `/aca-leads/`, `/obamacare-leads/`, none of which is the same
 * product). Anything unmapped falls back to the full catalogue, which is a
 * worse landing page but never a broken one.
 */
const STORE_CATEGORY_PATHS: Record<string, string> = {
  "mortgage-leads": "/mortgage-leads/",
  "insurance-leads": "/insurance-leads/",
  "auto-insurance-leads": "/auto-insurance-leads/",
  "health-insurance-leads": "/health-insurance-leads/",
  "life-insurance-leads": "/life-insurance-leads/",
  "final-expense-leads": "/online-final-expense-leads/",
  "iul-leads": "/indexed-universal-life-insurance-leads/",
  // MVA (motor-vehicle accident) and SSDI are both attorney-intake products.
  "mva-leads": "/legal-leads/",
  "ssdi-leads": "/legal-leads/",
  "solar-leads": "/solar-installation-leads/",
  "home-improvement-leads": "/home-improvement-leads/",
  // Legacy slug: the lead-type route 301s to home-improvement-leads, but older
  // content still carries this label.
  "home-services-leads": "/home-improvement-leads/",
  // Short aliases kept for the pre-2026-08 call sites that passed bare keys.
  auto: "/auto-insurance-leads/",
  home: "/home-improvement-leads/",
};

/**
 * The category path for a lead type, or undefined to use the full catalogue.
 *
 * Accepts either a Sanity title ("Auto Insurance Leads") or a slug
 * ("auto-insurance-leads"), and tolerates a caller passing the bare vertical
 * ("mortgage") by retrying with the `-leads` suffix. Returning undefined is a
 * valid answer, not a failure — `affiliateUrl` then uses `/all-lead-types/`.
 */
export function storeCategoryPath(leadType?: string | null): string | undefined {
  if (!leadType) return undefined;
  const key = leadType.trim().toLowerCase().replace(/[\s_]+/g, "-");
  return STORE_CATEGORY_PATHS[key] ?? STORE_CATEGORY_PATHS[`${key}-leads`];
}

/**
 * "Auto Insurance Leads" → "aged auto insurance leads".
 *
 * Strips the trailing "Leads" before re-adding it, so the label cannot read
 * "aged Mortgage Leads leads" — which is what shipped on ~102 posts until
 * 2026-08-06. Acronyms stay upper-case: "IUL Leads" → "aged IUL leads".
 */
export function agedLeadLabel(leadType?: string | null): string {
  if (!leadType) return "aged leads";
  // `(^|\s+)` not `\s+` — a bare "Leads" must strip to nothing and fall back,
  // otherwise it renders "aged leads leads".
  const stripped = leadType.trim().replace(/[-_]+/g, " ").replace(/(^|\s+)leads$/i, "").trim();
  if (!stripped) return "aged leads";
  const words = stripped
    .split(/\s+/)
    .map((w) => (/^[A-Z0-9]{2,}$/.test(w) ? w : w.toLowerCase()))
    .join(" ");
  return `aged ${words} leads`;
}
