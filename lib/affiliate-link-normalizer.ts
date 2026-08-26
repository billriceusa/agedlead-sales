/**
 * Repair affiliate links that were authored by hand in Sanity body content.
 *
 * WHY
 * ---
 * A crawl of all 330 live pages on 2026-08-26 found 499 outbound links to the
 * partner, of which 72 across 57 blog posts were failing to earn attribution:
 *
 *   27  ?ref=howtoworkleads          legacy referral param, no UTMs at all
 *   ~30 bare URLs, no query string   invisible to the GA4 source filter
 *    9  utm_source=howtoworkleads    credits the retired property, not this one
 *    1  utm_campaign only            no source, no medium
 *
 * Every one of those is an order that can never appear on an invoice, because
 * the invoice keys on `sessionSource` and these carry none.
 *
 * WHY HERE AND NOT IN THE CONTENT
 * -------------------------------
 * Fixing 57 documents in Sanity fixes today and nothing else — the next author
 * pastes the next bare URL and the leak reopens silently. Normalising at render
 * time fixes all 72 at once and makes the failure mode impossible going
 * forward: whatever an author pastes, the reader gets a correctly tagged link.
 *
 * Deliberately NOT done here: remapping the destination path. If an author
 * linked a specific landing page, that is an editorial decision and it is
 * preserved exactly. This function only ever rewrites the query string.
 */

import { affiliateUrl } from "./affiliate";
import { AFFILIATE_UTM_SOURCE } from "./utm";

const AFFILIATE_HOST = "agedleadstore.com";

/** True for agedleadstore.com and any subdomain of it. */
export function isAffiliateHost(hostname: string): boolean {
  const h = hostname.toLowerCase().replace(/\.$/, "");
  return h === AFFILIATE_HOST || h.endsWith(`.${AFFILIATE_HOST}`);
}

/**
 * Returns a correctly tagged affiliate URL, or null when `href` is not an
 * affiliate link and should be rendered untouched.
 */
export function normalizeAffiliateHref(
  href: string | undefined | null,
  opts: { campaign: string; content?: string }
): string | null {
  if (!href) return null;

  let url: URL;
  try {
    url = new URL(href);
  } catch {
    return null; // relative or malformed — internal link, leave alone
  }

  if (url.protocol !== "http:" && url.protocol !== "https:") return null;
  if (!isAffiliateHost(url.hostname)) return null;

  const content = opts.content ?? "body-link";
  const path = url.pathname || "/";

  // Apex and www normalise through the shared helper, so there is exactly one
  // place that decides what a correct affiliate URL looks like.
  const host = url.hostname.toLowerCase().replace(/^www\./, "");
  if (host === AFFILIATE_HOST) {
    const rebuilt = affiliateUrl({ path, campaign: opts.campaign, content });
    return url.hash ? `${rebuilt}${url.hash}` : rebuilt;
  }

  // Any other subdomain (e.g. store.agedleadstore.com) keeps its host. House
  // rule is that CTAs belong on the marketing pages rather than the store UI,
  // but silently redirecting an author's chosen destination is the wrong fix —
  // getting the link credited is what matters here. Flag it in review instead.
  const out = new URL(`${url.protocol}//${url.hostname}${path}`);
  out.searchParams.set("utm_source", AFFILIATE_UTM_SOURCE);
  out.searchParams.set("utm_medium", "affiliate");
  out.searchParams.set("utm_campaign", opts.campaign);
  out.searchParams.set("utm_content", content);
  return url.hash ? `${out.toString()}${url.hash}` : out.toString();
}
