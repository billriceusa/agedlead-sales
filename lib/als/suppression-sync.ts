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
 * buyer audiences and the consolidated list they were folded into on
 * 2026-08-01. An opt-out anywhere on the one list stops everything.
 */
export const SUPPRESSION_AUDIENCES: { name: string; id: string }[] = [
  { name: "workagedleads.com", id: "43fe6675-cc8f-44f3-9c1c-70a094b2d47d" },
  { name: "ALS Buyers — Purchasers", id: "9657093e-99fe-4a34-9846-946be85b64f7" },
  { name: "ALS Buyers — Inquiries", id: "83613b84-c1fd-4362-9dd1-8914533e30f8" },
  { name: "ALS Store Self-Serve", id: "74476de7-677f-4686-bfb9-d6fe66a5d855" },
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

  // The dedupe key on als_buyer_contacts is (email, source), so one address can
  // hold both a purchaser row and an inquiry row. Both have to be flagged.
  const stale = await db
    .select({ id: alsBuyerContacts.id })
    .from(alsBuyerContacts)
    .where(
      and(
        rawSql`lower(${alsBuyerContacts.email}) = any(${emails})`,
        eq(alsBuyerContacts.unsubscribed, false),
      ),
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
