/**
 * Make the ALS lifecycle honour opt-outs that were recorded in Resend.
 *
 * THE SPLIT-BRAIN
 *
 * Opt-outs land in two places that do not talk to each other:
 *
 *   - Postgres `als_buyer_contacts.unsubscribed`, written by
 *     `unsubscribeContact()` when someone clicks the signed link in a
 *     lifecycle email.
 *   - The Resend audience `unsubscribed` flag, set when someone uses Resend's
 *     own unsubscribe on a broadcast.
 *
 * `runLifecycle()` decides who to mail by reading Postgres and never reads
 * Resend, so a broadcast opt-out did not stop lifecycle mail. Measured
 * 2026-08-01: 20 opt-outs in Postgres, 15 in Resend, zero overlap.
 *
 * The re-introduction broadcast uses Resend's `{{{RESEND_UNSUBSCRIBE_URL}}}`
 * merge tag, which is the right call — Resend hosts that page and it depends on
 * none of our domains. But it means Resend-only opt-outs will keep being
 * created, so this cannot be a one-time cleanup. The lifecycle cron runs this
 * before every send, which makes the divergence self-healing instead of
 * something a human has to remember.
 *
 * ONE-WAY BY CONSTRUCTION
 *
 * The only write is `unsubscribed = false -> true`, plus exiting active
 * journeys — exactly what `unsubscribeContact()` does. Nothing here clears a
 * flag or inserts a contact.
 */

import { and, eq, inArray, sql as rawSql } from "drizzle-orm";
import { db } from "@/lib/db";
import { alsBuyerContacts, alsBuyerJourneys } from "@/lib/db/schema";

const RESEND_BASE = "https://api.resend.com";

/**
 * Every audience whose opt-out flag must stop ALS lifecycle mail: the three
 * buyer audiences, the two retired site newsletters, and the consolidated list
 * they were all folded into on 2026-08-01. An opt-out anywhere on the one list
 * stops everything.
 *
 * This list must stay in step with DEFAULT_SOURCES in
 * scripts/migrate-newsletter-audience.ts. Anything merged INTO the consolidated
 * audience has to be readable FROM here, or an unsubscribe recorded on a source
 * never reaches the lifecycle. The two newsletters were merge sources from the
 * start and were missing here until 2026-08-10.
 *
 * DELIBERATELY ABSENT: "Mortgage Lead-Buyers — Explicit (Tier 1)"
 * (278a89f9-b915-437a-9242-91085a65a0e9, 112 contacts). That is a Kaleidico
 * list — its one campaign sent from go.kaleidico.com — not a Work Aged Leads
 * one. It is not a merge source and must not become one: folding it would mix
 * a separate entity's consent basis into this program. See docs/email-infra.md.
 */
export const SUPPRESSION_AUDIENCES: { name: string; id: string }[] = [
  { name: "workagedleads.com", id: "43fe6675-cc8f-44f3-9c1c-70a094b2d47d" },
  { name: "ALS Aged-Lead Buyers — Purchasers", id: "9657093e-99fe-4a34-9846-946be85b64f7" },
  { name: "ALS Aged-Lead Buyers — Inquiries", id: "83613b84-c1fd-4362-9dd1-8914533e30f8" },
  { name: "ALS Store Self-Serve — Inquiries", id: "74476de7-677f-4686-bfb9-d6fe66a5d855" },
  { name: "agedleadsales-newsletter", id: "d579bf1f-0467-45a3-ad6b-52460920a903" },
  { name: "howtoworkleads-newsletter", id: "8a35228e-149f-4b15-8e24-26a24e3d6e98" },
];

export interface SuppressionSyncResult {
  /** Distinct addresses Resend reports as opted out, across all audiences. */
  resendOptOuts: number;
  /** Contact rows flipped to unsubscribed by this run. */
  suppressed: number;
  /** Active journeys closed for those contacts. */
  journeysExited: number;
}

/** Read every opt-out Resend knows about, normalized. Throws rather than
 * returning a partial set — a short read here would look like "nobody opted
 * out" and let the send proceed. */
export async function fetchResendOptOuts(apiKey: string): Promise<Set<string>> {
  const optedOut = new Set<string>();

  for (const audience of SUPPRESSION_AUDIENCES) {
    const res = await fetch(`${RESEND_BASE}/audiences/${audience.id}/contacts`, {
      headers: { Authorization: `Bearer ${apiKey}` },
      cache: "no-store",
    });
    if (!res.ok) {
      throw new Error(
        `Resend list contacts ${audience.name} failed ${res.status}: ${await res.text()}`,
      );
    }
    const body = (await res.json()) as {
      data?: { email: string; unsubscribed?: boolean }[];
      has_more?: boolean;
    };
    if (body.has_more) {
      throw new Error(
        `Audience ${audience.name} returned has_more=true — this reads a single ` +
          `page and would miss opt-outs on the rest. Add pagination before rerunning.`,
      );
    }
    for (const row of body.data ?? []) {
      if (row.unsubscribed) optedOut.add(row.email.trim().toLowerCase());
    }
  }

  return optedOut;
}

/**
 * Match a contact row against the opted-out address list, case-insensitively.
 *
 * The dedupe key on als_buyer_contacts is (email, source), so one address can
 * hold both a purchaser row and an inquiry row. Both have to be flagged.
 *
 * WHY THIS IS A NAMED FUNCTION AND NOT AN INLINE PREDICATE
 *
 * It was written as ``rawSql`lower(email) = any(${emails})` ``. Interpolating a
 * JS array into a `sql` template expands it to a placeholder LIST, not an
 * array — `= any(($1, $2, $3))` — which is a row constructor, and `= ANY`
 * wants an array or a subquery. Postgres rejected it on every call.
 *
 * The sync fails closed by design, so the whole lifecycle program went dark
 * from 2026-08-01 (the day this shipped) to 2026-09-04: 34 days, ~150
 * sends/day, and a 715-journey backlog that read as a throughput problem and
 * drew a cap raise that could never have helped.
 *
 * `inArray` compiles to `in ($1, $2, $3)` — what was meant, and the form the
 * two updates in the sync already used. Pulling it out here gives
 * suppression-sync.test.ts something it can compile and assert on without a
 * database, which is the check that was missing.
 */
export function matchesOptedOutEmail(emails: string[]) {
  return inArray(rawSql`lower(${alsBuyerContacts.email})`, emails);
}

/**
 * Carry Resend's opt-outs into Postgres.
 *
 * Reads Resend first: if that throws, nothing has been written.
 */
export async function syncSuppressionToPostgres(
  apiKey: string,
): Promise<SuppressionSyncResult> {
  const optedOut = await fetchResendOptOuts(apiKey);
  if (optedOut.size === 0) {
    return { resendOptOuts: 0, suppressed: 0, journeysExited: 0 };
  }

  const emails = [...optedOut];

  const stale = await db
    .select({ id: alsBuyerContacts.id })
    .from(alsBuyerContacts)
    .where(
      and(matchesOptedOutEmail(emails), eq(alsBuyerContacts.unsubscribed, false)),
    );

  if (stale.length === 0) {
    return { resendOptOuts: optedOut.size, suppressed: 0, journeysExited: 0 };
  }

  const ids = stale.map((r) => r.id);

  const suppressed = await db
    .update(alsBuyerContacts)
    .set({ unsubscribed: true })
    .where(
      and(inArray(alsBuyerContacts.id, ids), eq(alsBuyerContacts.unsubscribed, false)),
    )
    .returning({ id: alsBuyerContacts.id });

  const exited = await db
    .update(alsBuyerJourneys)
    .set({ status: "exited", nextDueAt: null, updatedAt: new Date() })
    .where(
      and(
        inArray(alsBuyerJourneys.contactId, ids),
        eq(alsBuyerJourneys.status, "active"),
      ),
    )
    .returning({ id: alsBuyerJourneys.id });

  return {
    resendOptOuts: optedOut.size,
    suppressed: suppressed.length,
    journeysExited: exited.length,
  };
}
