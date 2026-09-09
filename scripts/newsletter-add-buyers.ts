/**
 * Put the mailable buyer list on the weekly newsletter.
 *
 * BILL, 2026-09-09: "Everyone should be getting the routine newsletter now."
 *
 * WHY A SEPARATE SCRIPT FROM newsletter:migrate
 *
 * `migrate-newsletter-audience.ts` folds Resend AUDIENCES into the target. That
 * cannot reach these people, because they are not in any Resend audience.
 *
 * The ALS harvest only ever pushed contacts to Resend once they passed the
 * Kickbox gate — the two ALS audiences hold 1,201 + 1,400 = 2,601, exactly the
 * old `sendable` count. When that gate was dropped today, 3,591 contacts became
 * mailable in Postgres. The LIFECYCLE reads Postgres directly, so those people
 * started receiving lifecycle mail immediately. The NEWSLETTER reads a Resend
 * audience, so they would have kept receiving nothing.
 *
 * Measured 2026-09-09: 5,888 distinct mailable buyer emails, 3,467 of them
 * absent from the newsletter audience (3,270 inquiry, 197 purchaser). Adding
 * them takes weekly reach from 2,625 to about 6,092.
 *
 * OPT-OUTS ARE UNIONED, NOT ASSUMED
 *
 * Lifecycle opt-outs live in Postgres (`unsubscribeContact()` sets
 * `als_buyer_contacts.unsubscribed` and never writes to Resend), and newsletter
 * opt-outs live in the Resend audience. Neither side is complete on its own —
 * measured 2026-08-01, 20 in Postgres and 15 in Resend with ZERO overlap. This
 * script skips anyone unsubscribed on EITHER side, which is the same rule
 * `migrate-newsletter-audience.ts` refuses to run without.
 *
 * Also skips `undeliverable`: a mailbox already confirmed not to exist can only
 * hard-bounce, and bounces on a five-week-old sending domain are expensive.
 *
 * DRY RUN BY DEFAULT. `--apply` to write.
 *
 *   npx tsx scripts/newsletter-add-buyers.ts
 *   npx tsx scripts/newsletter-add-buyers.ts --apply
 */
import { config } from "dotenv";
config({ path: ".env.local", quiet: true } as never);

import { sql } from "drizzle-orm";
import { db } from "../lib/db";
import { fetchAudienceContacts, addContactToAudience } from "../lib/resend";

const APPLY = process.argv.includes("--apply");
const LIMIT = Number(process.argv.find((a) => a.startsWith("--limit="))?.split("=")[1] ?? 0);

async function main() {
  console.log(APPLY ? "=== APPLY ===" : "=== DRY RUN (--apply to write) ===");
  const apiKey = (process.env.RESEND_API_KEY || "").trim();
  const audienceId = (process.env.RESEND_AUDIENCE_ID || "").trim();
  if (!apiKey || !audienceId) throw new Error("RESEND_API_KEY / RESEND_AUDIENCE_ID missing");

  const existing = await fetchAudienceContacts(apiKey, audienceId);
  const onList = new Map(existing.map((c) => [c.email.trim().toLowerCase(), c]));
  const optedOutInResend = new Set(
    existing.filter((c) => c.unsubscribed).map((c) => c.email.trim().toLowerCase()),
  );
  console.log(
    `newsletter audience: ${existing.length} rows, ${existing.length - optedOutInResend.size} mailable`,
  );

  const rows = await db.execute(sql`
    select lower(trim(email)) as email, first_name, last_name, source, unsubscribed
    from als_buyer_contacts
    where email is not null and trim(email) <> ''
      and (kickbox_result is null or kickbox_result <> 'undeliverable')`);
  const buyers = ((rows as { rows?: Record<string, unknown>[] }).rows ?? []) as {
    email: string;
    first_name: string | null;
    last_name: string | null;
    source: string;
    unsubscribed: boolean;
  }[];

  const seen = new Set<string>();
  const toAdd: typeof buyers = [];
  let skippedOptOut = 0;
  let alreadyOn = 0;
  for (const b of buyers) {
    if (!b.email || seen.has(b.email)) continue;
    seen.add(b.email);
    // Either side's opt-out is binding.
    if (b.unsubscribed || optedOutInResend.has(b.email)) {
      skippedOptOut++;
      continue;
    }
    if (onList.has(b.email)) {
      alreadyOn++;
      continue;
    }
    toAdd.push(b);
  }

  const bySource: Record<string, number> = {};
  for (const b of toAdd) bySource[b.source] = (bySource[b.source] ?? 0) + 1;

  console.log(`\ndistinct buyer emails considered: ${seen.size}`);
  console.log(`  already on the newsletter: ${alreadyOn}`);
  console.log(`  skipped, opted out either side: ${skippedOptOut}`);
  console.log(`  TO ADD: ${toAdd.length}`);
  console.table(bySource);
  console.log(
    `\nreach would go ${existing.length - optedOutInResend.size} -> ` +
      `${existing.length - optedOutInResend.size + toAdd.length}`,
  );

  if (!APPLY) {
    console.log("\nnothing written.");
    return;
  }

  const batch = LIMIT > 0 ? toAdd.slice(0, LIMIT) : toAdd;
  console.log(`\nadding ${batch.length}...`);
  let ok = 0;
  const errors: string[] = [];
  for (const [i, b] of batch.entries()) {
    try {
      await addContactToAudience(
        apiKey,
        audienceId,
        b.email,
        b.first_name ?? undefined,
        b.last_name ?? undefined,
      );
      ok++;
    } catch (err) {
      errors.push(`${b.email}: ${err instanceof Error ? err.message : err}`);
    }
    // Resend's write limit is 5/sec; stay well inside it.
    if (i % 4 === 3) await new Promise((r) => setTimeout(r, 1000));
    if (ok > 0 && ok % 250 === 0) console.log(`  ...${ok}/${batch.length}`);
  }
  console.log(`\nadded ${ok}, errors ${errors.length}`);
  for (const e of errors.slice(0, 15)) console.log(`  ${e}`);
}

main()
  .then(() => process.exit(0))
  .catch((e) => {
    console.error("FAILED:", e instanceof Error ? e.message : e);
    process.exit(1);
  });
