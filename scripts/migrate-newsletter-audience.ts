/**
 * Fold the retiring audiences into the Work Aged Leads audience.
 *
 * agedleadsales.com and howtoworkleads.com each carry their own Resend
 * audience, and the Aged Lead Store buyer-activation program carries three more.
 * workagedleads.com gets one list. This copies all five source audiences into
 * the target, deduped, with every unsubscribe carried across.
 *
 * Run it TWICE. Once now, to seed the list, and again on cutover day — both old
 * sites keep capturing signups into their own audiences until their forms stop
 * serving, and the ALS buyer harvest cron adds contacts daily. Those late
 * arrivals are invisible to the first run. The plan is a diff against the
 * target's current state, so a second run writes only what changed.
 *
 * Usage:
 *   npm run newsletter:migrate              # dry run, prints the plan
 *   npm run newsletter:migrate -- --apply   # writes to the target audience
 *   npm run newsletter:migrate -- --target <audience-id> --source <id> [--source <id>]
 *
 * Required env (loaded from .env.local):
 *   RESEND_API_KEY
 *   DATABASE_URL — required whenever an ALS audience is a source (see below)
 *
 * WHY DATABASE_URL IS NOT OPTIONAL HERE
 *
 * The ALS lifecycle program sends transactionally and records opt-outs in
 * Postgres: `unsubscribeContact()` in lib/als/lifecycle.ts sets
 * `als_buyer_contacts.unsubscribed` and never writes to the Resend audience. So
 * the audience rows this script reads say `unsubscribed: false` for people who
 * have already unsubscribed. Measured 2026-08-01: 20 opt-outs in Postgres, 15
 * in the Resend audiences, ZERO overlap. Merging from Resend alone would have
 * moved all 20 onto the new list as sendable. This script therefore reads the
 * Postgres opt-out set and unions it in, and refuses to run without it.
 */

import { config as loadEnv } from "dotenv";
loadEnv({ path: ".env.local" });
loadEnv();

import {
  applyWrites,
  DEFAULT_TARGET,
  loadSyncPlan,
  resendWriter,
  getContacts,
} from "../lib/newsletter-audience/sync";

// The reads, writes and throttle live in lib/newsletter-audience/sync.ts, shared
// with the daily cron (app/api/cron/newsletter-audience-sync) so the two cannot
// drift. This script is the manual path: it prints the whole plan.

function collectFlag(args: string[], flag: string): string[] {
  const out: string[] = [];
  for (let i = 0; i < args.length; i++) {
    if (args[i] === flag && args[i + 1]) out.push(args[++i]);
  }
  return out;
}

async function main() {
  const args = process.argv.slice(2);
  const apply = args.includes("--apply");
  const targetId = collectFlag(args, "--target")[0] ?? DEFAULT_TARGET;
  const sourceIds = collectFlag(args, "--source");

  const apiKey = (process.env.RESEND_API_KEY || "").trim();
  if (!apiKey) {
    console.error("RESEND_API_KEY is not set (looked in .env.local and .env).");
    process.exit(1);
  }

  const { target, targetContacts, stats, actions, summary } = await loadSyncPlan({
    apiKey,
    databaseUrl: (process.env.DATABASE_URL || "").trim(),
    targetId,
    sourceIds,
  });

  console.log(`Target: ${target.name} (${target.id}) — ${targetContacts.length} contacts today\n`);
  console.log("Sources");
  for (const s of stats.perSource) {
    console.log(
      `  ${s.name.padEnd(32)} ${String(s.rows).padStart(5)} rows  ` +
        `${String(s.distinct).padStart(5)} distinct  ${String(s.unsubscribed).padStart(4)} unsubscribed`,
    );
  }
  if (stats.perSuppression.length) {
    console.log("\nSuppression lists (opt-outs held outside the audience)");
    for (const s of stats.perSuppression) {
      console.log(
        `  ${s.name.padEnd(44)} ${String(s.listed).padStart(4)} listed  ` +
          `${String(s.matched).padStart(4)} on a source  ` +
          `${String(s.newlySuppressed).padStart(4)} the audience had as SUBSCRIBED`,
      );
    }
  }

  console.log(
    `\nMerged: ${stats.distinct} distinct — ${stats.sendable} sendable, ` +
      `${stats.suppressed} unsubscribed, ${stats.onMoreThanOneSource} on more than one source\n`,
  );

  if (stats.skipped.length) {
    console.log(`Skipped ${stats.skipped.length} unusable address(es):`);
    for (const s of stats.skipped) console.log(`  ${s.email} — ${s.reason}`);
    console.log("");
  }

  console.log("Plan");
  console.log(`  create              ${summary.create} (${summary.createSuppressed} of them already unsubscribed)`);
  console.log(`  suppress on target  ${summary.suppress}`);
  console.log(`  no change           ${summary.unchanged}`);

  const protectedOptOuts = actions.filter(
    (a) => a.kind === "unchanged" && a.reason.includes("never resubscribe"),
  );
  if (protectedOptOuts.length) {
    console.log(
      `\n  ${protectedOptOuts.length} contact(s) opted out on the target and are left alone:`,
    );
    for (const a of protectedOptOuts) console.log(`    ${a.contact.email}`);
  }

  if (summary.create === 0 && summary.suppress === 0) {
    console.log("\nTarget is already in sync with every source. Nothing to do.");
    return;
  }

  if (!apply) {
    console.log("\nDry run — re-run with --apply to write to Resend.");
    return;
  }

  const { created, suppressed } = await applyWrites(actions, resendWriter(apiKey, target.id));

  const after = await getContacts(apiKey, target.id);
  const afterUnsub = after.filter((c) => c.unsubscribed).length;
  console.log(`\nApplied: ${created} created, ${suppressed} suppressed.`);
  console.log(
    `Target now holds ${after.length} contacts — ${after.length - afterUnsub} sendable, ${afterUnsub} unsubscribed.`,
  );
  if (after.length !== stats.distinct) {
    console.log(
      `NOTE: target count (${after.length}) differs from merged count (${stats.distinct}) — ` +
        `expected only if the target already held addresses that are on neither source.`,
    );
  }
}

main().catch((err) => {
  console.error(err instanceof Error ? err.message : err);
  process.exit(1);
});
