/**
 * Is the monthly restock offer actually going to happen?
 *
 * WHY THIS EXISTS
 *
 * The offer mails once a month, which means the gap between "we shipped it" and
 * "we find out whether it works" is four weeks. Everything about that shape is
 * hostile to noticing failure: a cron Vercel never registered, a route that
 * 404s after a bad deploy, and a perfectly healthy month with nothing to do all
 * look identical from the outside — nothing arrives, and nothing was supposed
 * to arrive yet.
 *
 * Both crons fire WEEKLY and no-op on the weeks that are not theirs, so a fresh
 * heartbeat is the proof that the schedule is alive. This reads them and says
 * plainly whether the next send is on track.
 *
 * Read-only. Sends nothing, writes nothing, commits nothing.
 *
 *   npx tsx scripts/check-restock-schedule.ts
 */
import { config } from "dotenv";
config({ path: ".env.local", quiet: true } as never);

import { createClient } from "@sanity/client";
import { CRON_STALENESS } from "../lib/cron/monitored";
import { editionFor, nextDraftLabel } from "../lib/newsletter/restock-offer";

const WATCHED = ["restock-offer-draft", "restock-offer-send"] as const;

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "p7rbtajg",
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || "production",
  apiVersion: "2026-03-14",
  useCdn: false,
});

const DAY = 86_400_000;

/** The Thursday on or after the month's draft Sunday, which is when it mails. */
function sendDayFor(label: string): string {
  const sunday = new Date(`${label}T00:00:00Z`);
  return new Date(sunday.getTime() + 4 * DAY).toISOString().slice(0, 10);
}

async function main() {
  const now = new Date();
  const label = nextDraftLabel(now);
  const edition = editionFor(new Date(`${label}T12:00:00Z`));

  console.log(`\nMonthly restock offer — schedule check, ${now.toISOString().slice(0, 10)}\n`);
  console.log(`  next draft day   ${label}  (preview to Bill, with the STOP link)`);
  console.log(`  next send day    ${sendDayFor(label)}  (to the list, unless stopped)`);
  console.log(`  edition due      ${edition.key} — "${edition.subject}"\n`);

  const rows: { name: string; status: string; ranAt: string; detail: string }[] =
    await client.fetch(
      `*[_type == "cronHeartbeat" && name in $names]{ name, status, ranAt, detail }`,
      { names: [...WATCHED] },
    );
  const byName = new Map(rows.map((r) => [r.name, r]));

  let healthy = true;
  let proven = true; // has every cron actually fired at least once?
  for (const name of WATCHED) {
    const rule = CRON_STALENESS[name];
    const hb = byName.get(name);

    if (!hb) {
      const waiting = rule.firstExpectedAt && now < new Date(rule.firstExpectedAt);
      // Before the first expected run this is ordinary. After it, the cron has
      // never fired — which on Vercel usually means it was never registered.
      console.log(
        waiting
          ? `  WAITING  ${rule.label}\n           no heartbeat yet; first run expected by ${rule.firstExpectedAt}`
          : `  BROKEN   ${rule.label}\n           NEVER RUN. Expected a first beat by ${rule.firstExpectedAt}. ` +
              `Check the cron is listed on the production deployment in Vercel.`,
      );
      if (!waiting) healthy = false;
      proven = false;
      continue;
    }

    const ageDays = (now.getTime() - new Date(hb.ranAt).getTime()) / DAY;
    const stale = ageDays > rule.maxDays;
    const tag = stale ? "STALE  " : hb.status === "ok" ? "OK     " : hb.status.toUpperCase().padEnd(7);
    console.log(`  ${tag}  ${rule.label}`);
    console.log(`           last run ${hb.ranAt.slice(0, 16).replace("T", " ")}Z (${ageDays.toFixed(1)}d ago, tolerance ${rule.maxDays}d)`);
    console.log(`           ${hb.detail}`);
    if (stale || hb.status === "failed") healthy = false;
  }

  // "Not broken yet" is not the same as "proven to work", and saying the crons
  // are firing before either has ever fired is the kind of false reassurance
  // this script exists to replace.
  if (!healthy) {
    console.log(`\n  NOT on track — see above. The offer will not mail until this is fixed.\n`);
  } else if (proven) {
    console.log(
      `\n  On track. Both crons are firing on schedule. The ${label} draft will mail Bill a ` +
        `preview, and it sends on ${sendDayFor(label)} unless stopped.\n`,
    );
  } else {
    const unfired = WATCHED.filter((n) => !byName.has(n)).map((n) => CRON_STALENESS[n].label);
    console.log(
      `\n  Not yet proven. Nothing is wrong, but ${unfired.length === WATCHED.length ? "neither cron has" : `${unfired.join(" and ")} has not`} ` +
        `fired yet, so the schedule is only partly verified. Re-run after its first run date above — ` +
        `if it still shows no heartbeat then, Vercel did not register it.\n`,
    );
  }
  process.exit(healthy ? 0 : 1);
}

main().catch((e) => {
  console.error("FAILED:", e instanceof Error ? e.message : e);
  process.exit(1);
});
