/**
 * Toxic-backlink classifier for agedleadsales.com.
 *
 * Context: the site is under a sustained PBN/link-farm attack. Referring
 * domains went 9 (2026-04-06) -> 292 (2026-07-20), and every one of the 70
 * newest was spam. Between the 2026-07-03 and 2026-07-21 disavow refreshes,
 * 41 new spam domains accrued with nothing watching — because each refresh
 * was a manual Ahrefs pull plus human eyeballing.
 *
 * The attack is highly patterned, which is what makes this tractable: the
 * domains are throwaway registrations on cheap TLDs, named out of a bag of
 * SEO-services jargon ("contextual-link-baron-services.store",
 * "backlink-pro-anchor-text-and-click-through-hub.store", "seogear.shop").
 *
 * This module turns that pattern into a decision. It deliberately returns
 * three verdicts rather than a boolean — "review" exists because a real
 * editorial link can legitimately mention SEO, and disavowing a genuine link
 * is far more costly than leaving one spam domain for the next pass.
 */

export type Verdict = "spam" | "review" | "clean";

export interface Classification {
  domain: string;
  verdict: Verdict;
  /** Human-readable reasons, for the audit trail in the disavow file. */
  reasons: string[];
}

/**
 * Domains confirmed as genuine inbound links. These are never disavowed
 * regardless of what they look like, and the list is the reason this module
 * takes a whitelist rather than hard-coding one: it has to stay in sync with
 * the header of data/backlink-audit/disavow.txt.
 */
export const DEFAULT_WHITELIST = [
  "billrice.com",
  "howtoworkleads.com",
  "coffee.ai",
  "insuranceleadbrokers.com",
  // Judged genuine editorial during the 2026-07-03 audit.
  "hiremav.com",
  "startkadence.com",
];

/**
 * TLDs that carry essentially no legitimate inbound links for this site.
 * Cheap, bulk-registerable, and the entire observed attack lives here.
 * A spammy TLD alone is NOT enough to disavow — it must pair with a
 * naming signal below.
 */
const SPAMMY_TLDS = new Set([
  "store",
  "shop",
  "site",
  "website",
  "link",
  "click",
  "xyz",
  "top",
  "agency",
  "sale",
]);

/**
 * Named clusters observed in this specific attack. A hit here is conclusive on
 * its own — these strings do not appear in legitimate domain names.
 */
const KNOWN_NETWORKS = [
  "seoexpress",
  "outrank-hq",
  "link-baron",
  "rank-forge",
  "backlinkmasters",
  "backlinksplace",
];

/**
 * SEO-services vocabulary. Individually these are ordinary words; what marks
 * the attack is finding them in a *domain name* on a throwaway TLD.
 */
const SEO_JARGON = [
  "anchor-text",
  "authority-link",
  "backlink",
  "click-through",
  "contextual-link",
  "crawl-budget",
  "digital-pr",
  "do-follow",
  "dofollow",
  "domain-rating",
  "guest-post",
  "guest-posting",
  "high-da",
  "index-rate",
  "keyword-rank",
  "link-building",
  "link-equity",
  "link-juice",
  "link-velocity",
  "linkbuilding",
  "niche-edit",
  "outreach-pro",
  "page-rank",
  "ranking-signal",
  "search-rank",
  "serp-boost",
  "tier-one",
  "traffic-surge",
];

/**
 * Bare SEO tokens. The *.shop cluster names itself by gluing one of these to
 * an arbitrary noun — seogear, linktrove, rankmall, seochest, rankdepot,
 * theguestpost — so an exhaustive suffix list is hopeless. On a low-trust TLD
 * the presence of any of these is conclusive; on a normal TLD it is only a
 * hint, because ordinary companies do contain them (linkedin.com).
 */
const SEO_TOKENS = ["seo", "rank", "link", "backlink", "pbn", "guestpost"];

function tld(domain: string): string {
  const parts = domain.toLowerCase().split(".");
  return parts[parts.length - 1] ?? "";
}

/** The registrable label, e.g. "seogear" from "seogear.shop". */
function label(domain: string): string {
  const parts = domain.toLowerCase().split(".");
  return parts.slice(0, -1).join(".");
}

function isWhitelisted(domain: string, whitelist: string[]): boolean {
  const d = domain.toLowerCase();
  return whitelist.some((w) => d === w || d.endsWith(`.${w}`));
}

/** SEO tokens present anywhere in the label, ignoring hyphens. */
function seoTokensIn(name: string): string[] {
  const flat = name.replace(/-/g, "");
  return SEO_TOKENS.filter((t) => flat.includes(t));
}

export function classifyDomain(
  domain: string,
  whitelist: string[] = DEFAULT_WHITELIST,
): Classification {
  const d = domain.trim().toLowerCase().replace(/^www\./, "");
  const reasons: string[] = [];

  if (!d || !d.includes(".")) {
    return { domain, verdict: "review", reasons: ["unparseable domain"] };
  }

  if (isWhitelisted(d, whitelist)) {
    return { domain: d, verdict: "clean", reasons: ["whitelisted"] };
  }

  const name = label(d);
  const ext = tld(d);
  const spammyTld = SPAMMY_TLDS.has(ext);

  const network = KNOWN_NETWORKS.find((n) => name.includes(n));
  if (network) {
    // Conclusive on its own — these strings identify the attacking network.
    return {
      domain: d,
      verdict: "spam",
      reasons: [`known link-farm network: "${network}"`],
    };
  }

  const jargon = SEO_JARGON.filter((j) => name.includes(j));
  if (jargon.length) reasons.push(`SEO-services jargon: ${jargon.join(", ")}`);

  const hyphens = (name.match(/-/g) ?? []).length;
  if (hyphens >= 4) reasons.push(`${hyphens} hyphens (keyword-stuffed name)`);

  const tokens = seoTokensIn(name);
  if (tokens.length) reasons.push(`SEO token in name: ${tokens.join(", ")}`);

  if (spammyTld) reasons.push(`low-trust TLD: .${ext}`);

  // A low-trust TLD is necessary-but-not-sufficient on its own — plenty of the
  // disavowed .shop domains are just named "…shop" and are indistinguishable
  // from a real store by name alone. Pair the TLD with any naming signal and
  // it's conclusive. Naming signals on a normal TLD (a real agency on .com, or
  // linkedin.com matching "link") go to review rather than auto-disavow,
  // because wrongly disavowing a genuine link costs far more than deferring
  // one spam domain to the next pass.
  const namingSignals = reasons.filter((r) => !r.startsWith("low-trust TLD"));

  if (spammyTld && namingSignals.length > 0) {
    return { domain: d, verdict: "spam", reasons };
  }
  if (jargon.length && (hyphens >= 4 || jargon.length >= 2)) {
    return { domain: d, verdict: "spam", reasons };
  }
  if (namingSignals.length > 0 || spammyTld) {
    return { domain: d, verdict: "review", reasons };
  }
  return { domain: d, verdict: "clean", reasons: [] };
}

export function classifyDomains(
  domains: string[],
  whitelist: string[] = DEFAULT_WHITELIST,
): Classification[] {
  return domains.map((d) => classifyDomain(d, whitelist));
}
