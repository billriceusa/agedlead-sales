/**
 * Reschedule lifecycle journey rows so a cohort drips instead of firing in one
 * cron run. Two modes:
 *
 *   RELEASE (default) — move the earliest scheduled cohort to now, so the
 *   program sends today instead of waiting for its staggered date.
 *
 *   --restagger — spread rows across days under a per-day budget. This is the
 *   safety mode: it is what stops a held-back journey from mailing everyone at
 *   once the moment it is re-enabled.
 *
 * The anchor is recomputed as `due - offset[nextStep]`, never set naively to
 * the due date, so the steps that follow keep their designed spacing measured
 * from the new date. See `anchorFor` in lib/als/restagger.ts.
 *
 * Skips unsubscribed contacts. In replenishment it also skips rows the cron
 * will close as reorder-exits — releasing them would only make the cron exit
 * them a day early.
 *
 * DRY RUN BY DEFAULT. `--apply` to write. Sends nothing itself — the cron does
 * the sending.
 *
 *   npx tsx scripts/lifecycle-release-cohort.ts
 *   npx tsx scripts/lifecycle-release-cohort.ts --apply
 *   npx tsx scripts/lifecycle-release-cohort.ts --journey=welcome --restagger
 *   npx tsx scripts/lifecycle-release-cohort.ts --journey=welcome --restagger \
 *     --per-day=18 --combined-max=40 --start=2026-09-10 --apply
 *
 * WHY --journey EXISTS (Phase 2, 2026-09-09)
 *
 * This script was written for replenishment and hard-coded it in two places:
 * the offsets it read and the rows it selected. Phase 2 needs the same pacing
 * for welcome, whose offsets are 3/7/14 rather than 0/11/24 — re-dating welcome
 * rows with replenishment offsets would have mis-spaced every follow-on email.
 */
import { config } from "dotenv";
config({ path: ".env.local", quiet: true } as never);

import { and, eq, sql, isNotNull, asc, ne } from "drizzle-orm";
import { db } from "../lib/db";
import { alsBuyerContacts, alsBuyerJourneys } from "../lib/db/schema";
import { lifecycleStepIndex, type JourneyName } from "../lib/als/lifecycle";
import { planRestagger, anchorFor, dayKey, DAY_MS } from "../lib/als/restagger";

const APPLY = process.argv.includes("--apply");
const RESTAGGER = process.argv.includes("--restagger");

function arg(name: string): string | undefined {
  return process.argv.find((a) => a.startsWith(`--${name}=`))?.split("=")[1];
}
function numArg(name: string, fallback: number): number {
  const n = Number(arg(name));
  return Number.isFinite(n) && n >= 0 ? Math.floor(n) : fallback;
}

const JOURNEY = (arg("journey") ?? "replenishment") as JourneyName;
const LIMIT = numArg("limit", 18);

/** Max rows of THIS journey allowed to land on one day. */
const PER_DAY = numArg("per-day", 18);
/**
 * Max rows across ALL journeys on one day. 0 disables the check.
 *
 * Matters because the journeys share one send budget and one sending domain.
 * On 2026-09-09 replenishment already carried 36/day on 09-17..09-20, so
 * pacing welcome to 18/day in isolation would still have put 54 on those days.
 */
const COMBINED_MAX = numArg("combined-max", 0);

/** Offsets read from the program for THIS journey, never restated locally. */
const OFFSETS: number[] = lifecycleStepIndex()
  .filter((s) => s.journey === JOURNEY)
  .sort((a, b) => a.step - b.step)
  .map((s) => s.offsetDays);

function startDay(): Date {
  const raw = arg("start");
  if (raw) return new Date(raw + "T12:00:00.000Z");
  // Default to tomorrow: today's run may already have fired.
  return new Date(Date.now() + DAY_MS);
}

async function main() {
  console.log(APPLY ? "=== APPLY ===" : "=== DRY RUN (--apply to write) ===");
  console.log(`journey: ${JOURNEY}   offsets: ${OFFSETS.join("/")}`);
  if (OFFSETS.length === 0) {
    throw new Error(`No steps defined for journey "${JOURNEY}" — check --journey.`);
  }
  const now = new Date();

  // Restagger deliberately includes PAST-DUE rows; release only future ones.
  //
  // A past-due row is precisely the row that fires in the next cron run, so
  // excluding it from the restagger excluded the entire problem. The old
  // implementation filtered `next_due_at > now()` and would have selected none
  // of the 123 July-dated welcome rows while reporting success.
  const dueFilter = RESTAGGER
    ? sql`true`
    : sql`${alsBuyerJourneys.nextDueAt} > now()`;

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
        eq(alsBuyerJourneys.journey, JOURNEY),
        eq(alsBuyerJourneys.status, "active"),
        isNotNull(alsBuyerJourneys.nextDueAt),
        dueFilter,
        eq(alsBuyerContacts.unsubscribed, false),
      ),
    )
    .orderBy(asc(alsBuyerJourneys.nextDueAt));

  // A buyer who ordered again since the cycle began gets closed, not nudged.
  // Only replenishment has reorder-exits; welcome is education, not a nudge.
  const eligible =
    JOURNEY === "replenishment"
      ? rows.filter(
          (r) => !(r.lastOrderAt && r.anchorAt && new Date(r.lastOrderAt) > new Date(r.anchorAt)),
        )
      : rows;

  if (RESTAGGER) {
    // What the OTHER journeys already have booked, so the combined ceiling is
    // measured against reality rather than this journey alone.
    //
    // Always loaded, even when the ceiling is off. The dry run is what someone
    // reads before deciding to send, and a table showing "0 other journeys"
    // beside a day already carrying 36 replenishment rows would misinform
    // exactly the decision this script exists to protect.
    const occupancy = new Map<string, number>();
    {
      const others = await db
        .select({
          day: sql<string>`to_char(date_trunc('day', ${alsBuyerJourneys.nextDueAt}), 'YYYY-MM-DD')`,
          n: sql<number>`count(*)::int`,
        })
        .from(alsBuyerJourneys)
        .innerJoin(alsBuyerContacts, eq(alsBuyerContacts.id, alsBuyerJourneys.contactId))
        .where(
          and(
            ne(alsBuyerJourneys.journey, JOURNEY),
            eq(alsBuyerJourneys.status, "active"),
            isNotNull(alsBuyerJourneys.nextDueAt),
            eq(alsBuyerContacts.unsubscribed, false),
          ),
        )
        .groupBy(sql`1`);
      for (const o of others) occupancy.set(o.day, o.n);
    }

    const start = startDay();
    const { moves, perDayPlan, unplaced } = planRestagger({
      rows: eligible.map((r) => ({ jid: r.jid, step: r.step, nextDueAt: r.nextDueAt! })),
      perDay: PER_DAY,
      combinedMax: COMBINED_MAX,
      occupancy,
      start,
    });

    console.log(`eligible rows: ${eligible.length}`);
    console.log(
      `budget: ${PER_DAY}/day for ${JOURNEY}` +
        (COMBINED_MAX > 0
          ? `, ${COMBINED_MAX}/day across all journeys`
          : ", no combined ceiling (other-journey load shown but NOT enforced)"),
    );
    console.log(`schedule starts ${dayKey(start)}`);
    console.log("\n  day          this journey   other journeys   combined");
    let peak = 0;
    for (const [day, n] of [...perDayPlan.entries()].sort()) {
      const others = occupancy.get(day) ?? 0;
      peak = Math.max(peak, n + others);
      console.log(
        `  ${day}   ${String(n).padStart(6)}         ${String(others).padStart(6)}       ${String(n + others).padStart(6)}`,
      );
    }
    console.log(`\npeak combined day: ${peak} email(s)`);
    console.log(`rows to move: ${moves.length} (of ${eligible.length} eligible)`);
    if (unplaced > 0) {
      console.log(`WARNING: ${unplaced} row(s) could not be placed inside the horizon.`);
    }
    if (!APPLY) {
      console.log("nothing written.");
      return;
    }
    for (const m of moves) {
      await db
        .update(alsBuyerJourneys)
        .set({
          anchorAt: anchorFor(m.to, m.step, OFFSETS),
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
    await db
      .update(alsBuyerJourneys)
      .set({
        anchorAt: anchorFor(now, r.step, OFFSETS),
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
