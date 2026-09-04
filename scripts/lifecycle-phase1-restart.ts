/**
 * Phase 1 restart — reconcile als_buyer_journeys to the shortened program and
 * stagger replenishment back on.
 *
 * WHY THIS EXISTS
 *
 * The lifecycle sent nothing from 2026-08-01 to 2026-09-04 (a malformed opt-out
 * query, fixed in lib/als/suppression-sync.ts). Because `next_due_at` is derived
 * from a FIXED `anchor_at`, every step a journey missed is also overdue — so the
 * first working run would not have sent one email per person, it would have sent
 * them daily until each caught up. Measured on 2026-09-04: 715 due journeys,
 * 4,151 emails owed, and 483 people facing seven emails on seven consecutive
 * days against copy that promises one idea every few days.
 *
 * That backlog is not deliverable. Sustained demand is ~170/day against a
 * 150/day cap, so there is no spare capacity to catch up — and pushing 4,151
 * low-engagement emails out of a domain that has been silent for a month is how
 * a sender lands in spam, which would take the newsletter and the one lifecycle
 * track that earns down with it.
 *
 * So the backlog is forgiven, not replayed:
 *
 *   1. ai-series  — dropped from the program entirely (Bill, 2026-09-04). All
 *      397 rows sit at step 0: this series never sent a single email. Exited.
 *   2. welcome    — shortened 7 -> 3. Rows already past the new final step are
 *      completed rather than resurrected. Rows within it stay put; welcome is
 *      not on the allowlist yet and returns in Phase 2 behind a re-introduction.
 *   3. replenishment — re-anchored and staggered so each contact resumes at the
 *      designed 0/11/24 spacing from their own restart date, never a burst.
 *
 * Replenishment goes first because it is the only lifecycle track with a sale
 * against its name (July: `replenish-r1`, 1 session, 1 transaction, $420, while
 * all seven welcome emails together took 46 sessions to zero) and because at
 * ~20-40 sends/day it warms the domain gently.
 *
 * DRY RUN BY DEFAULT. Pass --apply to write. Nothing here sends email.
 *
 *   npx tsx scripts/lifecycle-phase1-restart.ts
 *   npx tsx scripts/lifecycle-phase1-restart.ts --apply
 */
import { config } from "dotenv";
config({ path: ".env.local", quiet: true } as never);

import { and, eq, lte, sql, inArray, isNotNull } from "drizzle-orm";
import { db } from "../lib/db";
import { alsBuyerContacts, alsBuyerJourneys } from "../lib/db/schema";
import { journeyLength, lifecycleStepIndex } from "../lib/als/lifecycle";

const APPLY = process.argv.includes("--apply");
const DAY_MS = 86_400_000;

/**
 * Restarts per day. 124 mailable rows over 7 days is ~18 activations/day; each
 * then steps at 0/11/24, so the domain sees a gentle ramp rather than a wall.
 * Deliberately below the 150/day this domain has previously sustained, because
 * it has now been silent for a month and that is not the same starting point.
 */
const RESTARTS_PER_DAY = 18;

/** Replenishment step offsets, read from the source of truth, not restated. */
const REPLENISH_STEPS = journeyLength("replenishment");

function log(...a: unknown[]) {
  console.log(...a);
}

async function main() {
  log(APPLY ? "=== APPLY (writing) ===" : "=== DRY RUN (no writes; --apply to commit) ===");
  log("");

  // -------------------------------------------------------------------------
  // 1. ai-series — exit every active row.
  // -------------------------------------------------------------------------
  const aiRows = await db
    .select({ n: sql<number>`count(*)::int` })
    .from(alsBuyerJourneys)
    .where(and(eq(alsBuyerJourneys.journey, "ai-series"), eq(alsBuyerJourneys.status, "active")));
  const aiCount = aiRows[0]?.n ?? 0;
  log(`1. ai-series: ${aiCount} active row(s) -> exited (series removed from the program)`);
  if (APPLY && aiCount > 0) {
    await db
      .update(alsBuyerJourneys)
      .set({ status: "exited", nextDueAt: null, updatedAt: new Date() })
      .where(
        and(eq(alsBuyerJourneys.journey, "ai-series"), eq(alsBuyerJourneys.status, "active")),
      );
  }

  // -------------------------------------------------------------------------
  // 2. welcome — complete anything past the new final step.
  // -------------------------------------------------------------------------
  const welcomeLen = journeyLength("welcome");
  const pastEnd = await db
    .select({ n: sql<number>`count(*)::int` })
    .from(alsBuyerJourneys)
    .where(
      and(
        eq(alsBuyerJourneys.journey, "welcome"),
        eq(alsBuyerJourneys.status, "active"),
        sql`${alsBuyerJourneys.step} >= ${welcomeLen}`,
      ),
    );
  const pastEndCount = pastEnd[0]?.n ?? 0;
  log(
    `2. welcome: series is now ${welcomeLen} steps; ${pastEndCount} active row(s) are at or past ` +
      `step ${welcomeLen} -> completed (they already received more than the new series contains)`,
  );
  if (APPLY && pastEndCount > 0) {
    await db
      .update(alsBuyerJourneys)
      .set({ status: "completed", nextDueAt: null, updatedAt: new Date() })
      .where(
        and(
          eq(alsBuyerJourneys.journey, "welcome"),
          eq(alsBuyerJourneys.status, "active"),
          sql`${alsBuyerJourneys.step} >= ${welcomeLen}`,
        ),
      );
  }

  const remainingWelcome = await db
    .select({ n: sql<number>`count(*)::int` })
    .from(alsBuyerJourneys)
    .where(and(eq(alsBuyerJourneys.journey, "welcome"), eq(alsBuyerJourneys.status, "active")));
  // In a dry run nothing was completed yet, so subtract to report the state the
  // apply would leave behind rather than the one it started from.
  const projectedWelcome = (remainingWelcome[0]?.n ?? 0) - (APPLY ? 0 : pastEndCount);
  log(
    `   ${projectedWelcome} welcome row(s) remain active and PAUSED — welcome is not on ` +
      `ALS_LIFECYCLE_JOURNEYS. They resume in Phase 2, after the re-introduction.`,
  );

  // -------------------------------------------------------------------------
  // 3. replenishment — re-anchor the overdue rows on a stagger.
  // -------------------------------------------------------------------------
  const due = await db
    .select({
      jid: alsBuyerJourneys.id,
      contactId: alsBuyerJourneys.contactId,
      step: alsBuyerJourneys.step,
      anchorAt: alsBuyerJourneys.anchorAt,
      nextDueAt: alsBuyerJourneys.nextDueAt,
      lastOrderAt: alsBuyerContacts.lastOrderAt,
      unsubscribed: alsBuyerContacts.unsubscribed,
    })
    .from(alsBuyerJourneys)
    .innerJoin(alsBuyerContacts, eq(alsBuyerContacts.id, alsBuyerJourneys.contactId))
    .where(
      and(
        eq(alsBuyerJourneys.journey, "replenishment"),
        eq(alsBuyerJourneys.status, "active"),
        isNotNull(alsBuyerJourneys.nextDueAt),
        lte(alsBuyerJourneys.nextDueAt, new Date()),
      ),
    )
    .orderBy(alsBuyerJourneys.nextDueAt);

  // The cron exits these itself on the next run (they reordered after the cycle
  // started, so the nudge is moot). Counted here so the arithmetic reconciles.
  const reordered = due.filter(
    (r) => r.lastOrderAt && r.anchorAt && new Date(r.lastOrderAt) > new Date(r.anchorAt),
  );
  const suppressed = due.filter((r) => r.unsubscribed);
  const toRestart = due.filter(
    (r) =>
      !r.unsubscribed &&
      !(r.lastOrderAt && r.anchorAt && new Date(r.lastOrderAt) > new Date(r.anchorAt)),
  );

  log("");
  log(`3. replenishment: ${due.length} due row(s)`);
  log(`   - ${reordered.length} reordered since the cycle began (cron marks these completed)`);
  log(`   - ${suppressed.length} unsubscribed (cron exits these)`);
  log(`   - ${toRestart.length} to re-anchor, ${RESTARTS_PER_DAY}/day`);

  // Stagger: day N gets the next RESTARTS_PER_DAY contacts, oldest-due first, so
  // the longest-waiting buyer restarts first. anchor is set so THIS step lands on
  // the restart date and the remaining steps keep their designed spacing.
  const startOfTomorrow = new Date();
  startOfTomorrow.setUTCHours(0, 0, 0, 0);
  startOfTomorrow.setUTCDate(startOfTomorrow.getUTCDate() + 1);

  const plan: { jid: number; step: number; restartOn: Date; newAnchor: Date }[] = [];
  for (let i = 0; i < toRestart.length; i++) {
    const row = toRestart[i];
    const dayOffset = Math.floor(i / RESTARTS_PER_DAY);
    const restartOn = new Date(startOfTomorrow.getTime() + dayOffset * DAY_MS);
    // nextDueAt = anchorAt + offsets[nextStep]. Solve for the anchor that puts
    // the NEXT step on restartOn, leaving later steps correctly spaced after it.
    const nextStepOffsetDays = stepOffsetDays(row.step + 1);
    const newAnchor = new Date(restartOn.getTime() - nextStepOffsetDays * DAY_MS);
    plan.push({ jid: row.jid, step: row.step, restartOn, newAnchor });
  }

  const byDay = new Map<string, number>();
  for (const p of plan) {
    const k = p.restartOn.toISOString().slice(0, 10);
    byDay.set(k, (byDay.get(k) ?? 0) + 1);
  }
  log("");
  log("   restart schedule:");
  for (const [d, n] of [...byDay.entries()].sort()) log(`     ${d}: ${n}`);

  const maxDay = [...byDay.values()].reduce((a, b) => Math.max(a, b), 0);
  log("");
  log(
    `   peak restarts in a day: ${maxDay}. Each contact then steps at the designed ` +
      `${REPLENISH_OFFSETS.join("/")}-day spacing across ${REPLENISH_STEPS} emails — ` +
      `no one receives two in a row.`,
  );

  if (APPLY) {
    for (const p of plan) {
      await db
        .update(alsBuyerJourneys)
        .set({ anchorAt: p.newAnchor, nextDueAt: p.restartOn, updatedAt: new Date() })
        .where(eq(alsBuyerJourneys.id, p.jid));
    }
    log(`   re-anchored ${plan.length} row(s).`);
  }

  // -------------------------------------------------------------------------
  // Verification: what would the next run actually send?
  // -------------------------------------------------------------------------
  const nowDue = await db
    .select({ n: sql<number>`count(*)::int` })
    .from(alsBuyerJourneys)
    .where(
      and(
        eq(alsBuyerJourneys.status, "active"),
        isNotNull(alsBuyerJourneys.nextDueAt),
        lte(alsBuyerJourneys.nextDueAt, new Date()),
        inArray(alsBuyerJourneys.journey, ["replenishment"]),
      ),
    );
  log("");
  log(
    APPLY
      ? `AFTER: ${nowDue[0]?.n ?? 0} replenishment row(s) due right now (expect 0 — the first ` +
          `cohort starts tomorrow).`
      : `Re-run with --apply to commit. Nothing was written.`,
  );
}

/**
 * Offset in days for a replenishment step, read from the program itself.
 *
 * Deliberately NOT a local copy of [0, 11, 24]. A restated schedule is the
 * defect that put this program in the state it is in — a constant duplicated
 * away from its source drifts silently, and the drift only shows up as mail
 * landing on the wrong day for real people. `lifecycleStepIndex()` is the
 * exported source of truth; if the cadence changes, this follows it.
 */
const REPLENISH_OFFSETS: number[] = lifecycleStepIndex()
  .filter((s) => s.journey === "replenishment")
  .sort((a, b) => a.step - b.step)
  .map((s) => s.offsetDays);

function stepOffsetDays(step: number): number {
  if (step < 1) return REPLENISH_OFFSETS[0] ?? 0;
  return REPLENISH_OFFSETS[Math.min(step, REPLENISH_OFFSETS.length) - 1] ?? 0;
}

main()
  .then(() => process.exit(0))
  .catch((e) => {
    console.error("FAILED:", e instanceof Error ? e.message : e);
    process.exit(1);
  });
