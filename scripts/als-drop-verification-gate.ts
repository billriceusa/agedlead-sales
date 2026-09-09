/**
 * Drop the email-verification gate on the ALS buyer list.
 *
 * BILL'S DECISION, 2026-09-09
 *
 * "We don't need a verification gate — these are opt ins and people who have
 * taken action. Mark them all sendable immediately and going forward. We only
 * verified the early ones because they had been sitting."
 *
 * WHAT THE GATE WAS COSTING
 *
 * `sendable` defaulted to false and was only flipped true by a Kickbox verdict
 * of `deliverable`. Verdicts on 2026-09-09:
 *
 *   unknown        3331   sendable 0   <- 53% of the file, blocked
 *   deliverable    2601   sendable 2601
 *   risky           260   sendable 0
 *   undeliverable    77   sendable 0
 *
 * `unknown` is not a bad address. It is Kickbox declining to reach a verdict —
 * commonly a catch-all domain or a timeout. Blocking it meant 3,591 people who
 * had opted in or submitted a lead-request form could never receive anything.
 *
 * WHAT THIS DOES NOT TOUCH
 *
 *   - `unsubscribed`. An opt-out is a person's decision and is honoured
 *     independently of this flag, everywhere, always. Untouched here.
 *   - `undeliverable` (77). Deliberately still blocked, and this is NOT a
 *     verification gate — it is a mailbox that has already been confirmed not
 *     to exist. Mailing it produces a hard bounce, and hard bounces are the
 *     single fastest way to damage a sending domain. `news.workagedleads.com`
 *     is five weeks old and was silent for 34 days; it has no reputation buffer
 *     to spend. 77 addresses cannot deliver anything, so blocking them costs
 *     zero reach and protects the other 5,912. Pass --include-undeliverable to
 *     override, and expect bounces.
 *
 * DRY RUN BY DEFAULT. `--apply` to write.
 *
 *   npx tsx scripts/als-drop-verification-gate.ts
 *   npx tsx scripts/als-drop-verification-gate.ts --apply
 */
import { config } from "dotenv";
config({ path: ".env.local", quiet: true } as never);

import { sql } from "drizzle-orm";
import { db } from "../lib/db";

const APPLY = process.argv.includes("--apply");
const INCLUDE_UNDELIVERABLE = process.argv.includes("--include-undeliverable");

async function main() {
  console.log(APPLY ? "=== APPLY ===" : "=== DRY RUN (--apply to write) ===");

  const before = await db.execute(sql`
    select coalesce(kickbox_result,'(null)') as kickbox,
           count(*)::int as n,
           sum(case when sendable then 1 else 0 end)::int as sendable_now
    from als_buyer_contacts group by 1 order by 2 desc`);
  console.log("\nBEFORE:");
  console.table((before as { rows?: unknown[] }).rows ?? before);

  const willChange = await db.execute(
    INCLUDE_UNDELIVERABLE
      ? sql`select count(*)::int as n from als_buyer_contacts where sendable = false`
      : sql`select count(*)::int as n from als_buyer_contacts
            where sendable = false
              and (kickbox_result is distinct from 'undeliverable')`,
  );
  const n = Number(
    ((willChange as unknown as { rows?: Record<string, unknown>[] }).rows ?? [])[0]?.n ?? 0,
  );
  console.log(
    `\nWould mark sendable: ${n}` +
      (INCLUDE_UNDELIVERABLE ? " (INCLUDING undeliverable)" : " (excluding 'undeliverable')"),
  );

  if (!APPLY) {
    console.log("nothing written.");
    return;
  }

  const res = INCLUDE_UNDELIVERABLE
    ? await db.execute(sql`update als_buyer_contacts set sendable = true where sendable = false`)
    : await db.execute(sql`
        update als_buyer_contacts set sendable = true
        where sendable = false and (kickbox_result is distinct from 'undeliverable')`);
  console.log(`updated: ${(res as { rowCount?: number }).rowCount ?? n}`);

  const after = await db.execute(sql`
    select count(*)::int as total,
           sum(case when sendable then 1 else 0 end)::int as sendable,
           sum(case when sendable and not unsubscribed then 1 else 0 end)::int as mailable,
           sum(case when unsubscribed then 1 else 0 end)::int as unsubscribed
    from als_buyer_contacts`);
  console.log("\nAFTER:");
  console.table((after as { rows?: unknown[] }).rows ?? after);
}

main()
  .then(() => process.exit(0))
  .catch((e) => {
    console.error("FAILED:", e instanceof Error ? e.message : e);
    process.exit(1);
  });
