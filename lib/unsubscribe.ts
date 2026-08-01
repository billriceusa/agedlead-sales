/**
 * One opt-out, both systems.
 *
 * The site has two suppression stores and a person who unsubscribes has to land
 * in both of them:
 *
 *   - the Resend audience flag, which governs broadcasts and the newsletter;
 *   - `als_buyer_contacts.unsubscribed` in Postgres, which is the only thing
 *     `runLifecycle()` reads when deciding who gets lifecycle mail.
 *
 * Before this, `/api/newsletter/unsubscribe` and `/api/flagship/unsubscribe`
 * wrote Resend only. Someone on the merged list who is also an ALS buyer — and
 * after the 2026-08-01 fold most of the list is — could click unsubscribe on a
 * newsletter, get suppressed in Resend, and keep receiving lifecycle mail
 * because Postgres never heard about it.
 *
 * Best effort per store, never partial silence. Each store is attempted
 * independently so one being down cannot stop the other from honouring the
 * request, and the caller is told what actually happened rather than being
 * given a success page over a failed write.
 */

import { and, eq, sql as rawSql } from "drizzle-orm";
import { db } from "@/lib/db";
import { alsBuyerContacts, alsBuyerJourneys } from "@/lib/db/schema";

const RESEND_BASE = "https://api.resend.com";

export interface UnsubscribeResult {
  email: string;
  /** Suppressed on the Resend audience. Null when not attempted. */
  resend: { ok: boolean; found: boolean; error?: string } | null;
  /** Suppressed in Postgres. Null when not attempted. */
  postgres: { ok: boolean; rows: number; journeysExited: number; error?: string } | null;
  /** True when at least one store recorded the opt-out. */
  suppressedSomewhere: boolean;
}

export function normalizeEmail(raw: string | null | undefined): string {
  return (raw ?? "").trim().toLowerCase();
}

/** Flag the contact on a Resend audience. A contact that is not on the audience
 * is not an error — the person may only exist in the ALS tables. */
async function suppressInResend(
  apiKey: string,
  audienceId: string,
  email: string,
): Promise<{ ok: boolean; found: boolean; error?: string }> {
  try {
    const listRes = await fetch(
      `${RESEND_BASE}/audiences/${audienceId}/contacts?email=${encodeURIComponent(email)}`,
      { headers: { Authorization: `Bearer ${apiKey}` }, cache: "no-store" },
    );
    if (!listRes.ok) {
      return { ok: false, found: false, error: `lookup ${listRes.status}` };
    }
    const data = (await listRes.json()) as { data?: { id: string }[] };
    const contact = data.data?.[0];
    if (!contact) return { ok: true, found: false };

    const patchRes = await fetch(
      `${RESEND_BASE}/audiences/${audienceId}/contacts/${contact.id}`,
      {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ unsubscribed: true }),
      },
    );
    if (!patchRes.ok) {
      return { ok: false, found: true, error: `patch ${patchRes.status}` };
    }
    return { ok: true, found: true };
  } catch (err) {
    return {
      ok: false,
      found: false,
      error: err instanceof Error ? err.message : String(err),
    };
  }
}

/** Flag every als_buyer_contacts row for this address and close active
 * journeys. The dedupe key is (email, source), so one person can hold both a
 * purchaser row and an inquiry row — both have to be flagged. */
async function suppressInPostgres(
  email: string,
): Promise<{ ok: boolean; rows: number; journeysExited: number; error?: string }> {
  try {
    const rows = await db
      .update(alsBuyerContacts)
      .set({ unsubscribed: true })
      .where(
        and(
          rawSql`lower(${alsBuyerContacts.email}) = ${email}`,
          eq(alsBuyerContacts.unsubscribed, false),
        ),
      )
      .returning({ id: alsBuyerContacts.id });

    if (rows.length === 0) return { ok: true, rows: 0, journeysExited: 0 };

    const exited = await db
      .update(alsBuyerJourneys)
      .set({ status: "exited", nextDueAt: null, updatedAt: new Date() })
      .where(
        and(
          rawSql`${alsBuyerJourneys.contactId} = any(${rows.map((r) => r.id)})`,
          eq(alsBuyerJourneys.status, "active"),
        ),
      )
      .returning({ id: alsBuyerJourneys.id });

    return { ok: true, rows: rows.length, journeysExited: exited.length };
  } catch (err) {
    return {
      ok: false,
      rows: 0,
      journeysExited: 0,
      error: err instanceof Error ? err.message : String(err),
    };
  }
}

/**
 * Honour an opt-out everywhere it needs to land.
 *
 * Postgres reporting `rows: 0` is normal and not a failure — it means the
 * address is a newsletter subscriber who was never an ALS buyer.
 */
export async function unsubscribeEverywhere(
  rawEmail: string,
): Promise<UnsubscribeResult> {
  const email = normalizeEmail(rawEmail);
  const apiKey = process.env.RESEND_API_KEY;
  const audienceId = process.env.RESEND_AUDIENCE_ID;

  const [resend, postgres] = await Promise.all([
    apiKey && audienceId
      ? suppressInResend(apiKey, audienceId, email)
      : Promise.resolve(null),
    process.env.DATABASE_URL ? suppressInPostgres(email) : Promise.resolve(null),
  ]);

  return {
    email,
    resend,
    postgres,
    suppressedSomewhere: Boolean(resend?.ok || postgres?.ok),
  };
}
