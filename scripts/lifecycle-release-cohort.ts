/**
 * Release the next scheduled replenishment cohort so it sends on this run
 * instead of waiting for its staggered date.
 *
 * `lifecycle-phase1-restart.ts` spread 124 re-anchored journeys across seven
 * days starting tomorrow. That is the right default, but it also means the
 * program sends nothing today — and after 34 dark days the first send is worth
 * getting out rather than waiting one more cron tick.
 *
 * Moves the EARLIEST scheduled cohort to now. The anchor is recomputed as
 * `now - offset[nextStep]`, not simply set to `now`, so the steps that follow
 * keep the designed 0/11/24 spacing measured from today. Setting the anchor
 * naively would push a mid-sequence row's next step 24 days out.
 *
 * Skips unsubscribed contacts and rows the cron will close as reorder-exits.
 *
 * DRY RUN BY DEFAULT. `--apply` to write. Sends nothing itself — the cron does
 * the sending.
 *
 *   npx tsx scripts/lifecycle-release-cohort.ts
 *   npx tsx scripts/lifecycle-release-cohort.ts --apply
 */
import { config } from "dotenv";
config({ path: ".env.local", quiet: true } as never);

import { and, eq, sql, isNotNull, asc } from "drizzle-orm";
import { db } from "../lib/db";
import { alsBuyerContacts, alsBuyerJourneys } from "../lib/db/schema";
import { lifecycleStepIndex } from "../lib/als/lifecycle";

const APPLY = process.argv.includes("--apply");
const DAY_MS = 86_400_000;
const LIMIT = Number(process.argv.find((a) => a.startsWith("--limit="))?.split("=")[1] ?? 18);
/**
 * `--restagger` spreads any future day holding more than PER_DAY rows across
 * following days instead of releasing a cohort early. Needed after 2026-09-04,
 * when 128 sends in one run left 129 second-step rows all landing on 09-15.
 */
const RESTAGGER = process.argv.includes("--restagger");
const PER_DAY = 18;

/** Offsets read from the program, never restated locally. */
const OFFSETS: number[] = lifecycleStepIndex()
  .filter((s) => s.journey === "replenishment")
  .sort((a, b) => a.step - b.step)
  .map((s) => s.offsetDays);

async function main() {
  console.log(APPLY ? "=== APPLY ===" : "=== DRY RUN (--apply to write) ===");
  const now = new Date();

  const rows = await db
    .select({
      jid: alsBuyerJourneys.id,
      step: alsBuyerJourneys.step,
      anchorAt: alsBuyerJourneys.anchorAt,
      nextDueAt: alsBuyerJourneys.nextDueAt,
      email: alsBuyerContacts.email,
      unsubscribed: alsBuyerContacts.unsubscribed,
      sendable: alsBuyerContacts.sendable,
      lastOrderAt: alsBuyerContacts.lastOrderAt,
    })
    .from(alsBuyerJourneys)
    .innerJoin(alsBuyerContacts, eq(alsBuyerContacts.id, alsBuyerJourneys.contactId))
    .where(
      and(
        eq(alsBuyerJourneys.journey, "replenishment"),
        eq(alsBuyerJourneys.status, "active"),
        isNotNull(alsBuyerJourneys.nextDueAt),
        sql`${alsBuyerJourneys.nextDueAt} > now()`,
        eq(alsBuyerContacts.unsubscribed, false),
      ),
    )
    .orderBy(asc(alsBuyerJourneys.nextDueAt));

  // A buyer who ordered again since the cycle began gets closed, not nudged —
  // releasing them would only make the cron exit them a day early.
  const eligible = rows.filter(
    (r) => !(r.lastOrderAt && r.anchorAt && new Date(r.lastOrderAt) > new Date(r.anchorAt)),
  );
  // --- restagger: flatten any future day carrying more than PER_DAY ---------
  if (RESTAGGER) {
    const byDay = new Map<string, typeof eligible>();
    for (const r of eligible) {
      const k = r.nextDueAt!.toISOString().slice(0, 10);
      (byDay.get(k) ?? byDay.set(k, []).get(k)!).push(r);
    }
    const moves: { jid: number; step: number; to: Date }[] = [];
    for (const [day, group] of [...byDay.entries()].sort()) {
      if (group.length <= PER_DAY) continue;
      console.log(`  ${day}: ${group.length} rows — spreading the surplus`);
      const base = new Date(day + "T12:00:00.000Z");
      group.forEach((r, i) => {
        const offset = Math.floor(i / PER_DAY);
        if (offset === 0) return;
        moves.push({ jid: r.jid, step: r.step, to: new Date(base.getTime() + offset * DAY_MS) });
      });
    }
    console.log(`rows to move: ${moves.length}`);
    if (!APPLY) { console.log("nothing written."); return; }
    for (const m of moves) {
      const nextStepOffset = OFFSETS[Math.min(m.step + 1, OFFSETS.length) - 1] ?? 0;
      await db
        .update(alsBuyerJourneys)
        .set({
          anchorAt: new Date(m.to.getTime() - nextStepOffset * DAY_MS),
          nextDueAt: m.to,
          updatedAt: now,
        })
        .where(eq(alsBuyerJourneys.id, m.jid));
    }
    console.log(`restaggered ${moves.length} row(s).`);
    return;
  }

  const cohort = eligible.slice(0, LIMIT);

  console.log(`scheduled-future rows: ${rows.length}, eligible: ${eligible.length}`);
  console.log(`releasing ${cohort.length} (limit ${LIMIT}) to send now`);
  if (cohort.length > 0) {
    const from = cohort[0].nextDueAt, to = cohort[cohort.length - 1].nextDueAt;
    console.log(
      `  their scheduled dates ran ${from?.toISOString().slice(0, 10)} .. ${to?.toISOString().slice(0, 10)}`,
    );
    console.log(`  steps: ${[...new Set(cohort.map((c) => c.step))].sort().join(", ")}`);
  }

  if (!APPLY) {
    console.log("nothing written.");
    return;
  }

  for (const r of cohort) {
    const nextStepOffset = OFFSETS[Math.min(r.step + 1, OFFSETS.length) - 1] ?? 0;
    await db
      .update(alsBuyerJourneys)
      .set({
        anchorAt: new Date(now.getTime() - nextStepOffset * DAY_MS),
        nextDueAt: now,
        updatedAt: now,
      })
      .where(eq(alsBuyerJourneys.id, r.jid));
  }
  console.log(`released ${cohort.length} row(s) — due now.`);
}

main()
  .then(() => process.exit(0))
  .catch((e) => {
    console.error("FAILED:", e instanceof Error ? e.message.split("\n")[0] : e);
    const c = (e as { cause?: unknown })?.cause;
    console.error("CAUSE:", c instanceof Error ? c.message : c);
    process.exit(1);
  });
