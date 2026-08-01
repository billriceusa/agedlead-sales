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

import { neon } from "@neondatabase/serverless";
import {
  mergeAudiences,
  planWrites,
  summarizePlan,
  type AudienceSource,
  type ResendContactRow,
  type SuppressionSource,
  type WriteAction,
} from "../lib/newsletter-audience/merge";

const RESEND_BASE = "https://api.resend.com";

/** The Work Aged Leads audience — created 2026-08-01, the consolidated list. */
const DEFAULT_TARGET = "43fe6675-cc8f-44f3-9c1c-70a094b2d47d";

/** The ALS buyer-activation audiences. Folded in per Bill 2026-08-01 — buyers
 * consent to the newsletter in the buy/order flow, so it is one list. These are
 * the audiences whose opt-out state lives in Postgres, not in Resend. */
const ALS_AUDIENCES = new Set([
  "9657093e-99fe-4a34-9846-946be85b64f7", // ALS Aged-Lead Buyers — Purchasers
  "83613b84-c1fd-4362-9dd1-8914533e30f8", // ALS Aged-Lead Buyers — Inquiries
  "74476de7-677f-4686-bfb9-d6fe66a5d855", // ALS Store Self-Serve — Inquiries
]);

/** The retiring audiences. The two newsletters keep receiving signups until
 * their sites stop serving forms, and the ALS harvest cron adds buyers daily —
 * which is why this script is re-runnable.
 *
 * Every address on Self-Serve is already in `als_buyer_contacts`, so the
 * Postgres opt-out set covers it the same way it covers the other two. */
const DEFAULT_SOURCES = [
  "d579bf1f-0467-45a3-ad6b-52460920a903", // agedleadsales-newsletter
  "8a35228e-149f-4b15-8e24-26a24e3d6e98", // howtoworkleads-newsletter
  "9657093e-99fe-4a34-9846-946be85b64f7", // ALS Aged-Lead Buyers — Purchasers
  "83613b84-c1fd-4362-9dd1-8914533e30f8", // ALS Aged-Lead Buyers — Inquiries
  "74476de7-677f-4686-bfb9-d6fe66a5d855", // ALS Store Self-Serve — Inquiries
];

interface Audience {
  id: string;
  name: string;
}

function authHeaders(apiKey: string): Record<string, string> {
  return {
    Authorization: `Bearer ${apiKey}`,
    "Content-Type": "application/json",
  };
}

/**
 * Resend allows 10 requests per second and 429s the rest.
 *
 * This matters more on the write path than the read path. Applying the ALS fold
 * is ~2,200 sequential contact creates; unthrottled, that 429s a few hundred in
 * and leaves a partially migrated audience — which looks exactly like a
 * finished one until someone counts. Every Resend call goes through here: a
 * fixed floor between requests, plus a bounded retry that honours the reset
 * header when the floor is not enough.
 */
const MIN_REQUEST_INTERVAL_MS = 150; // ~6.6/s, comfortably under the 10/s cap
const MAX_RETRIES = 5;

let nextRequestAt = 0;

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function resendFetch(url: string, init: RequestInit): Promise<Response> {
  for (let attempt = 0; ; attempt++) {
    const wait = nextRequestAt - Date.now();
    if (wait > 0) await sleep(wait);
    nextRequestAt = Date.now() + MIN_REQUEST_INTERVAL_MS;

    const res = await fetch(url, init);
    if (res.status !== 429 || attempt >= MAX_RETRIES) return res;

    // `ratelimit-reset` is in seconds; fall back to exponential backoff.
    const reset = Number(res.headers.get("ratelimit-reset"));
    const backoff = Number.isFinite(reset) && reset > 0
      ? reset * 1000
      : MIN_REQUEST_INTERVAL_MS * 2 ** (attempt + 1);
    await sleep(backoff);
  }
}

async function getAudience(apiKey: string, id: string): Promise<Audience> {
  const res = await resendFetch(`${RESEND_BASE}/audiences/${id}`, {
    headers: authHeaders(apiKey),
    cache: "no-store",
  });
  if (!res.ok) {
    throw new Error(
      `Resend get audience ${id} failed ${res.status}: ${await res.text()}`,
    );
  }
  const data = await res.json();
  return { id: data.id as string, name: data.name as string };
}

/** Reads every contact in an audience.
 *
 * Resend returns the full list in one response today. If that ever changes,
 * `has_more` goes true and this throws rather than quietly migrating a prefix
 * of the list — a half-copied audience looks exactly like a finished one. */
async function getContacts(
  apiKey: string,
  audienceId: string,
): Promise<ResendContactRow[]> {
  const res = await resendFetch(`${RESEND_BASE}/audiences/${audienceId}/contacts`, {
    headers: authHeaders(apiKey),
    cache: "no-store",
  });
  if (!res.ok) {
    throw new Error(
      `Resend list contacts ${audienceId} failed ${res.status}: ${await res.text()}`,
    );
  }
  const body = (await res.json()) as {
    data?: ResendContactRow[];
    has_more?: boolean;
  };
  if (body.has_more) {
    throw new Error(
      `Audience ${audienceId} returned has_more=true — this script reads a single ` +
        `page and would migrate only part of the list. Add pagination before rerunning.`,
    );
  }
  return body.data ?? [];
}

async function createContact(
  apiKey: string,
  audienceId: string,
  action: Extract<WriteAction, { kind: "create" }>,
): Promise<void> {
  const res = await resendFetch(`${RESEND_BASE}/audiences/${audienceId}/contacts`, {
    method: "POST",
    headers: authHeaders(apiKey),
    body: JSON.stringify({
      email: action.contact.email,
      ...(action.contact.firstName ? { first_name: action.contact.firstName } : {}),
      ...(action.contact.lastName ? { last_name: action.contact.lastName } : {}),
      unsubscribed: action.contact.unsubscribed,
    }),
  });
  // 409 means it landed between the read and the write. Harmless: the next run
  // sees it and reconciles the unsubscribed flag.
  if (!res.ok && res.status !== 409) {
    throw new Error(
      `create ${action.contact.email} failed ${res.status}: ${await res.text()}`,
    );
  }
}

async function suppressContact(
  apiKey: string,
  audienceId: string,
  action: Extract<WriteAction, { kind: "suppress" }>,
): Promise<void> {
  const res = await resendFetch(
    `${RESEND_BASE}/audiences/${audienceId}/contacts/${action.targetContactId}`,
    {
      method: "PATCH",
      headers: authHeaders(apiKey),
      body: JSON.stringify({ unsubscribed: true }),
    },
  );
  if (!res.ok) {
    throw new Error(
      `suppress ${action.contact.email} failed ${res.status}: ${await res.text()}`,
    );
  }
}

/**
 * Every address that has opted out of ALS lifecycle email.
 *
 * This is the authoritative opt-out record for the ALS audiences — the Resend
 * flag on those rows is not. Read it before merging them, never after.
 */
async function getAlsOptOuts(databaseUrl: string): Promise<string[]> {
  const sql = neon(databaseUrl);
  const rows = (await sql`
    select distinct lower(email) as email
    from als_buyer_contacts
    where unsubscribed
  `) as { email: string }[];
  return rows.map((r) => r.email);
}

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
  const resolvedSources = sourceIds.length ? sourceIds : DEFAULT_SOURCES;

  const apiKey = (process.env.RESEND_API_KEY || "").trim();
  if (!apiKey) {
    console.error("RESEND_API_KEY is not set (looked in .env.local and .env).");
    process.exit(1);
  }

  if (resolvedSources.includes(targetId)) {
    console.error("Target audience is also listed as a source — refusing to run.");
    process.exit(1);
  }

  // Refuse to migrate an ALS audience without its opt-out record. Merging one
  // of these on the Resend flag alone resubscribes people who unsubscribed.
  const alsSources = resolvedSources.filter((id) => ALS_AUDIENCES.has(id));
  const databaseUrl = (process.env.DATABASE_URL || "").trim();
  if (alsSources.length && !databaseUrl) {
    console.error(
      "DATABASE_URL is not set, and an ALS buyer audience is a source.\n" +
        "ALS opt-outs live in Postgres (als_buyer_contacts.unsubscribed), not in\n" +
        "the Resend audience — merging without them would resubscribe people who\n" +
        "have already unsubscribed. Set DATABASE_URL, or drop the ALS sources.",
    );
    process.exit(1);
  }

  const target = await getAudience(apiKey, targetId);
  const sources: AudienceSource[] = [];
  for (const id of resolvedSources) {
    const audience = await getAudience(apiKey, id);
    sources.push({ name: audience.name, contacts: await getContacts(apiKey, id) });
  }
  const targetContacts = await getContacts(apiKey, targetId);

  const suppression: SuppressionSource[] = [];
  if (alsSources.length) {
    suppression.push({
      name: "als_buyer_contacts.unsubscribed (Postgres)",
      emails: await getAlsOptOuts(databaseUrl),
    });
  }

  const { contacts, stats } = mergeAudiences(sources, suppression);
  const actions = planWrites(contacts, targetContacts);
  const summary = summarizePlan(actions);

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

  let created = 0;
  let suppressed = 0;
  for (const action of actions) {
    if (action.kind === "create") {
      await createContact(apiKey, targetId, action);
      created++;
    } else if (action.kind === "suppress") {
      await suppressContact(apiKey, targetId, action);
      suppressed++;
    }
  }

  const after = await getContacts(apiKey, targetId);
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
