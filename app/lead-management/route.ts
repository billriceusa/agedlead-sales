/**
 * `/lead-management` — 410 Gone.
 *
 * The generic lead-management / CRM-theory section was deliberately pruned in
 * the workagedleads.com consolidation. This hub is one of the 40 PRUNE rows in
 * data/migration/url-map.csv (empty new_url, 1 click on 1,328 impressions at
 * position 72.8). There is no topic-matched target for it, and redirecting
 * pruned content into a generic hub is the mistake that wasted the /playbooks
 * equity once already — so this is a direct 410, not a redirect.
 *
 * Why a route handler and not next.config.ts: `redirects()` can only emit a
 * 3xx, and `migrationRedirects()` skips PRUNE rows by design because they have
 * no destination. Next has no config surface for a 410 at all, so the status
 * has to come from something that returns a Response. A route handler is the
 * narrowest option available — it affects this one path and nothing else,
 * where a rule in proxy.ts would put a per-path exception list in front of
 * every request on the site.
 *
 * Why 410 rather than the 404 the other PRUNE rows serve: Google reads 410 as
 * a deliberate removal and drops the URL faster, where a 404 stays ambiguous
 * enough to keep earning recrawls. This URL still draws 339 impressions at
 * position 76.7 through the howtoworkleads.com 308, which is what makes the
 * explicit signal worth spending a file on here and not on the other 39.
 *
 * scripts/verify-redirects.mjs already accepts 404 *or* 410 for a PRUNE row,
 * so this needs no change to the cutover gate.
 */

const BODY = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex">
<title>Gone — Work Aged Leads</title>
</head>
<body style="font-family:system-ui,-apple-system,sans-serif;max-width:34rem;margin:4rem auto;padding:0 1rem;line-height:1.6">
<h1 style="font-size:1.5rem">This page is gone</h1>
<p>The general lead-management and CRM-theory section was retired, and it was not replaced. This site covers buying and working aged leads specifically.</p>
<p><a href="/start-here">Start here</a> &middot; <a href="/playbook">The Aged Lead Operator&rsquo;s System</a> &middot; <a href="/lead-types/mortgage-leads">Lead types</a></p>
</body>
</html>
`;

function gone(): Response {
  return new Response(BODY, {
    status: 410,
    headers: {
      "content-type": "text/html; charset=utf-8",
      // Redundant with the 410 for Google, but cheap and unambiguous for any
      // crawler that reads headers and never reads the body.
      "x-robots-tag": "noindex",
      "cache-control": "public, max-age=0, must-revalidate",
    },
  });
}

export function GET(): Response {
  return gone();
}

/**
 * Explicit, because the redirect/status verifier probes with a plain fetch and
 * a HEAD that fell through to a framework default would report the wrong code.
 */
export function HEAD(): Response {
  return gone();
}
