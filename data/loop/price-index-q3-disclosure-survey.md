# Lead Price Index — Q3 price-disclosure survey

**Run 2026-09-02.** Scope: the 12 worksheet cells for `mortgage` and `final-expense`.
Method: fetched each rated provider's public site and read for a per-lead price
stated at the granularity the index needs — vertical x lead-age bracket x
exclusivity x lead type.

> **No cell was filled.** Not one of the 12 reached the 2-provider trust gate, so
> nothing was imported. That is the result, not a failure to finish: the prices
> are not public, and inventing them is the one thing this study must never do.

## Scope correction

Bill asked for mortgage, final-expense and life-insurance. **`life-insurance`
already has 3 reliable months and already renders its trend chart** — it needs
nothing. The real gap in that set is `mortgage` (8 cells) and `final-expense` (4).

## What the field actually publishes

| provider | publishes a per-lead price? | what is public |
|---|---|---|
| **Aged Lead Store** | **yes — full table** | 9 verticals with price, age band and exclusivity |
| **Badass Insurance Leads** | **yes — partial** | Life $1.00, Spanish life $1.85; 3–12 months; exclusive. Final expense listed, price not shown |
| Lead Heroes | package only | "$800.00 – $3,400.00" per package; no age, exclusivity or type |
| Brokers Data | floor only | "daily mortgage trigger leads as low as 20 cents each" — real-time trigger, and a floor is not a range |
| Synergy Direct Solution | adjacent only | "aged business loan leads, UCC leads, and trigger leads are 1-5 cents each" — not mortgage or final expense |
| DataToLeads | adjacent only | $0.01/record B2B enrichment data, not consumer leads |
| Aged Leads Depot | no | quote / strategy call |
| The Leads Warehouse | no | "talk pricing" by phone |
| Lead Tycoons | no | none found |
| Need-A-Lead | no | "Get your free quote"; direct mail, exclusive |
| SmartFinancial | no | asks "How much does it cost?" and does not answer |
| iLeads | no | book a demo |
| LeadsData | n/a — **see flag below** | $49/mo analytics tiers, $0.18/resolution |

**1 of 13 rated providers publishes per-lead pricing at usable granularity.**
Two more publish something price-shaped that cannot be used: a package total and
a floor.

## Why nothing could be imported

The 12 open cells skew toward **real-time** and **exclusive**:

- 6 of 12 are real-time (3 mortgage, 3 final-expense)
- 5 of 12 are exclusive

The providers that publish anything are **aged, shared** sellers. Aged Lead
Store's table covers `mortgage / 31-85-days / shared / internet-form` exactly —
$1.50–2.50 — but a cell needs **two** distinct providers, and no second provider
publishes that cell. One good citation is not a benchmark.

Real-time pricing is quoted, not published, across the entire field. That is
consistent: real-time price moves with auction demand, so publishing it commits
the seller to a number they re-price weekly.

## The finding worth publishing

Bill's instinct was right — **non-disclosure is the story.** A market where 1 in
13 sellers will state a price is a market where buyers cannot comparison-shop,
and that is precisely the gap the Lead Price Index exists to close. It also
means the index's data can never come from scraping; it has to come from quotes.

This survey is itself citable content: "we asked 13 lead providers what they
charge; one told us" is a stronger opening than any individual price.

## What would actually fill the cells

Public sources are exhausted. The remaining routes, in order of cost:

1. **Quote requests.** Most of these vendors quote by email or phone within a
   day. Twelve cells x two providers is roughly 15–20 outbound asks. A quoted
   price with a dated email is a legitimate citation for this index — the
   worksheet's `sourceUrl` column would need a companion for "quote on file".
2. **Storefront checkout.** Some sellers show price only inside a logged-in
   cart. That is public-ish but needs an account per vendor.
3. **Narrow the index.** Publish only the cells the market will actually
   disclose — aged/shared — and say plainly that real-time pricing is not
   published anywhere. That converts a data gap into an editorial position, and
   it is the only route that needs no new outreach.

## FLAG — a rated provider that may not sell leads

`data/providers.ts` rates **LeadsData** (slug `leadsdata`, `lastVerified:
2026-04-28`) as a *"self-serve marketplace for aged data and real-time lead feeds
with transparent pricing and TCPA compliance focus"*, scoring it across six
dimensions and publishing it at `/providers/leadsdata`.

`leadsdata.com` on 2026-09-02 presents as a **behaviour-analytics and
identity-resolution platform** — a Signals module at $49/mo for 10k sessions and
an Identity module at $0.18 per activatable resolution. It describes itself as
not a lead generation or resale service.

Either the company pivoted since April, the domain changed hands, or the entry
was wrong when written. **Not resolved here, and deliberately not edited** — a
published rating is editorial and Bill's to change. But the site currently rates
a lead marketplace whose website does not appear to sell leads, on a page whose
whole value is independent verification. Worth a look before the next
`lastVerified` sweep.
