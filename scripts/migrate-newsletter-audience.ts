/**
 * Fold the two retiring newsletter audiences into the Work Aged Leads audience.
 *
 * agedleadsales.com and howtoworkleads.com each carry their own Resend audience.
 * workagedleads.com gets one list. This copies both source audiences into the
 * target, deduped, with every unsubscribe carried across.
 *
 * Run it TWICE. Once now, to seed the list, and again on cutover day — both old
 * sites keep capturing signups into their own audiences until their forms stop
 * serving, and those late subscribers are invisible to the first run. The plan
 * is a diff against the target's current state, so a second run writes only what
 * changed.
 *
 * Usage:
 *   npm run newsletter:migrate              # dry run, prints the plan
 *   npm run newsletter:migrate -- --apply   # writes to the target audience
 *   npm run newsletter:migrate -- --target <audience-id> --source <id> [--source <id>]
 *
 * Required env (loaded from .env.local):
 *   RESEND_API_KEY
 *
 * Scope: this is the SITE NEWSLETTER only. The Aged Lead Store buyer-activation
 * audiences ("ALS Aged-Lead Buyers — Purchasers" / "— Inquiries") are a separate
 * program on a separate consent basis, documented in docs/email-infra.md. They
 * are not sources here and must not be folded into a newsletter list.
 */

import { config as loadEnv } from "dotenv";
loadEnv({ path: ".env.local" });
loadEnv();

import {
  mergeAudiences,
  planWrites,
  summarizePlan,
  type AudienceSource,
  type ResendContactRow,
  type WriteAction,
} from "../lib/newsletter-audience/merge";

const RESEND_BASE = "https://api.resend.com";

/** The Work Aged Leads audience — created 2026-08-01, the consolidated list. */
const DEFAULT_TARGET = "43fe6675-cc8f-44f3-9c1c-70a094b2d47d";

/** The two retiring newsletter audiences. Both keep receiving signups until
 * their sites stop serving forms, which is why this script is re-runnable. */
const DEFAULT_SOURCES = [
  "d579bf1f-0467-45a3-ad6b-52460920a903", // agedleadsales-newsletter
  "8a35228e-149f-4b15-8e24-26a24e3d6e98", // howtoworkleads-newsletter
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

async function getAudience(apiKey: string, id: string): Promise<Audience> {
  const res = await fetch(`${RESEND_BASE}/audiences/${id}`, {
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
  const res = await fetch(`${RESEND_BASE}/audiences/${audienceId}/contacts`, {
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
  const res = await fetch(`${RESEND_BASE}/audiences/${audienceId}/contacts`, {
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
  const res = await fetch(
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

  const target = await getAudience(apiKey, targetId);
  const sources: AudienceSource[] = [];
  for (const id of resolvedSources) {
    const audience = await getAudience(apiKey, id);
    sources.push({ name: audience.name, contacts: await getContacts(apiKey, id) });
  }
  const targetContacts = await getContacts(apiKey, targetId);

  const { contacts, stats } = mergeAudiences(sources);
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
    console.log("\nTarget is already in sync with both sources. Nothing to do.");
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
