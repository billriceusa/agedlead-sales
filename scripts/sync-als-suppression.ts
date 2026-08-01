/**
 * Carry Resend-side opt-outs back into Postgres.
 *
 * THE PROBLEM THIS EXISTS FOR
 *
 * Opt-outs for the ALS lifecycle program are recorded in two places that do not
 * talk to each other:
 *
 *   - Postgres `als_buyer_contacts.unsubscribed`, written by
 *     `unsubscribeContact()` in lib/als/lifecycle.ts when someone clicks the
 *     HMAC-signed link in a lifecycle email.
 *   - The Resend audience `unsubscribed` flag, set when someone uses Resend's
 *     own unsubscribe on a broadcast, or by the newsletter/flagship routes.
 *
 * `lib/als/lifecycle.ts` decides who to mail by reading Postgres — at four
 * separate gates (lines ~541, ~571, ~604 and ~848). It never reads Resend. So a
 * Resend-side opt-out does not stop lifecycle mail, and the person keeps
 * receiving it daily.
 *
 * `npm run newsletter:migrate` already closes the other direction: it unions the
 * Postgres opt-outs into the merged audience so nobody is resubscribed on the
 * new list. This script closes THIS direction, which is the one that is actively
 * sending mail to people who asked it to stop.
 *
 * Measured 2026-08-01: 20 opt-outs in Postgres, 15 in Resend, zero overlap.
 *
 * ONE-WAY BY CONSTRUCTION
 *
 * The only write is `unsubscribed = false -> true`, plus exiting any active
 * journey, which is exactly what `unsubscribeContact()` does. There is no path
 * here that clears the flag, and none that inserts a contact. A false positive
 * costs one person some email they did not ask to stop; the opposite error
 * cannot be walked back.
 *
 * Usage:
 *   npm run als:sync-suppression              # dry run, prints the plan
 *   npm run als:sync-suppression -- --apply   # writes to Postgres
 *
 * Required env (loaded from .env.local): RESEND_API_KEY, DATABASE_URL
 *
 * This is a stopgap for a split-brain, not the fix. The fix is a single
 * unsubscribe endpoint that writes both systems; until that ships, run this
 * before any lifecycle send that follows a broadcast.
 */

import { config as loadEnv } from "dotenv";
loadEnv({ path: ".env.local" });
loadEnv();

import { neon } from "@neondatabase/serverless";

const RESEND_BASE = "https://api.resend.com";

/** Every audience whose opt-out flag should stop ALS lifecycle mail: the three
 * buyer audiences and the consolidated list they were folded into. */
const AUDIENCES: [string, string][] = [
  ["workagedleads.com", "43fe6675-cc8f-44f3-9c1c-70a094b2d47d"],
  ["ALS Aged-Lead Buyers — Purchasers", "9657093e-99fe-4a34-9846-946be85b64f7"],
  ["ALS Aged-Lead Buyers — Inquiries", "83613b84-c1fd-4362-9dd1-8914533e30f8"],
  ["ALS Store Self-Serve — Inquiries", "74476de7-677f-4686-bfb9-d6fe66a5d855"],
];

interface ResendContactRow {
  email: string;
  unsubscribed?: boolean;
}

async function getContacts(
  apiKey: string,
  audienceId: string,
): Promise<ResendContactRow[]> {
  const res = await fetch(`${RESEND_BASE}/audiences/${audienceId}/contacts`, {
    headers: { Authorization: `Bearer ${apiKey}` },
    cache: "no-store",
  });
  if (!res.ok) {
    throw new Error(
      `Resend list contacts ${audienceId} failed ${res.status}: ${await res.text()}`,
    );
  }
  const body = (await res.json()) as {
    data?: ResendContactRow[];
    has_more?: boolean;
  };
  if (body.has_more) {
    throw new Error(
      `Audience ${audienceId} returned has_more=true — this script reads a single ` +
        `page and would miss opt-outs on the rest. Add pagination before rerunning.`,
    );
  }
  return body.data ?? [];
}

async function main() {
  const apply = process.argv.slice(2).includes("--apply");
  const apiKey = (process.env.RESEND_API_KEY || "").trim();
  const databaseUrl = (process.env.DATABASE_URL || "").trim();

  if (!apiKey || !databaseUrl) {
    console.error(
      "RESEND_API_KEY and DATABASE_URL must both be set (looked in .env.local and .env).",
    );
    process.exit(1);
  }

  // Read Resend first. If this throws we have written nothing.
  const optedOut = new Set<string>();
  for (const [name, id] of AUDIENCES) {
    const rows = await getContacts(apiKey, id);
    const out = rows.filter((r) => r.unsubscribed);
    for (const r of out) optedOut.add(r.email.trim().toLowerCase());
    console.log(
      `  ${name.padEnd(36)} ${String(rows.length).padStart(5)} contacts  ` +
        `${String(out.length).padStart(4)} opted out`,
    );
  }
  console.log(`\nDistinct opted out in Resend: ${optedOut.size}`);

  const sql = neon(databaseUrl);
  const emails = [...optedOut];

  // Rows Resend says are opted out and Postgres still has as subscribed. The
  // dedupe key on als_buyer_contacts is (email, source), so one address can hold
  // a purchaser row and an inquiry row — both have to be flagged.
  const stale = (await sql`
    select id, lower(email) as email, source
    from als_buyer_contacts
    where lower(email) = any(${emails})
      and not unsubscribed
    order by email, source
  `) as { id: number; email: string; source: string }[];

  const alreadyFlagged = (await sql`
    select count(distinct lower(email))::int as n
    from als_buyer_contacts
    where lower(email) = any(${emails}) and unsubscribed
  `) as { n: number }[];

  const distinctStale = new Set(stale.map((r) => r.email));

  console.log(
    `Of those, already flagged in Postgres: ${alreadyFlagged[0].n} address(es)`,
  );
  console.log(
    `Still receiving lifecycle mail:        ${distinctStale.size} address(es), ` +
      `${stale.length} contact row(s)\n`,
  );

  if (!stale.length) {
    console.log("Postgres already honors every Resend opt-out. Nothing to do.");
    return;
  }

  for (const r of stale) console.log(`  ${r.email.padEnd(44)} ${r.source}`);

  if (!apply) {
    console.log("\nDry run — re-run with --apply to write to Postgres.");
    return;
  }

  const ids = stale.map((r) => r.id);

  // Mirrors unsubscribeContact(): set the flag, then exit any active journey so
  // the state machine does not hold a row that will never advance.
  const flagged = (await sql`
    update als_buyer_contacts
    set unsubscribed = true
    where id = any(${ids}) and not unsubscribed
    returning id
  `) as { id: number }[];

  const exited = (await sql`
    update als_buyer_journeys
    set status = 'exited', next_due_at = null, updated_at = now()
    where contact_id = any(${ids}) and status = 'active'
    returning id
  `) as { id: number }[];

  console.log(
    `\nApplied: ${flagged.length} contact row(s) suppressed, ` +
      `${exited.length} active journey(s) exited.`,
  );

  // Re-read rather than trusting the update's own count.
  const remaining = (await sql`
    select count(*)::int as n
    from als_buyer_contacts
    where lower(email) = any(${emails}) and not unsubscribed
  `) as { n: number }[];
  console.log(
    remaining[0].n === 0
      ? "Verified: every Resend opt-out is now honored in Postgres."
      : `WARNING: ${remaining[0].n} row(s) still unsuppressed — investigate.`,
  );
}

main().catch((err) => {
  console.error(err instanceof Error ? err.message : err);
  process.exit(1);
});
