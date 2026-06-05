# Toxic Backlink Audit — agedleadsales.com

**Date:** 2026-06-05
**Source:** Ahrefs `site-explorer-referring-domains` (full live profile, DR-ascending)

## Bottom line

The backlink profile is **~95% spam**. Of ~145 referring domains, **146 are an SEO
link-farm / PBN network** and only **4 are legitimate**. This is the most likely
cause of the site's stalled performance: **DR 2.5, 0 organic keywords, 0 organic
traffic** despite 2 months of published content. Google is almost certainly
discounting the domain on the strength (weakness) of this profile.

## What the spam looks like

- **`*-seoexpress-*.store` network** — ~80 domains, all DR ~34, zero traffic,
  nofollow (e.g. `seoexpress-pbn-company.store`, `seoexpress-dr-90-group.store`,
  `master-seoexpress-search-agency.store`). Transparently one operator spinning
  up disposable domains.
- **`.shop` SEO farms** — ~40 domains, DR ~35, names like `thehighrankseo.shop`,
  `rankinghighseo.shop`, `theguestposts.shop`, `pbnseolinks.shop`.
- **Paid-link agencies** — `buybacklinks.agency`, `fiverr-cost-effective-seo.site`,
  `seoagency.sale`, `rankongoogle.agency`, `seo-backlink.agency`.
- Ahrefs flags a large share `is_spam: true`; the unflagged ones are the same
  network, just not yet classified. Nearly all are `dofollow_links: 0` and
  `traffic_domain: 0`. `first_seen` clusters Jan–Jun 2026 and is **ongoing** —
  new spam domains are still appearing weekly.

## Legitimate links (whitelisted — NOT disavowed)

| Domain | DR | Note |
|---|---|---|
| billrice.com | 25 | Bill's own site, 6 dofollow |
| howtoworkleads.com | 3 | BRSG sister site |
| coffee.ai | 32 | Real traffic domain |
| insuranceleadbrokers.com | 2.4 | Niche-relevant, dofollow |

## Action

1. **Submit `disavow.txt`** (this folder) via Google Search Console →
   Disavow Links Tool, on the `agedleadsales.com` domain property. 146 domains,
   domain-level. *(Manual step — no API for the disavow tool.)*
2. **Re-run this audit monthly.** The network keeps adding domains; refresh the
   disavow list and re-upload. Worth scripting into the existing SEO-audit cron.
3. **Set expectations:** disavow recovery is slow (weeks-to-months as Google
   recrawls). It removes a *liability*; it does not add authority. Real
   authority still needs a handful of genuine, relevant links.

## Open question for Bill

Was this a **link-buy that went wrong**, or **negative SEO**? If a vendor was
paid for "backlinks," stop that spend — this profile is net-negative. If it's
unsolicited, the disavow is the defense and nothing else changed on our side.
