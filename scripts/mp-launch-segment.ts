/**
 * Build the Resend segment for the mortgage protection launch.
 *
 * WHO (Bill, 2026-09-15)
 *
 * People who asked Aged Lead Store about Life Insurance or Final Expense leads —
 * the agents who already sell the same conversation mortgage protection needs.
 * 2,951 mailable distinct people on the day this was written.
 *
 * WHAT IT WILL NOT DO
 *
 * - **Never re-create an existing contact.** Resend does not document what POST
 *   /contacts does to an address that already exists, and the failure we must
 *   not risk is resetting someone's unsubscribe. Anyone already in the main list
 *   is only ADDED to the segment. Anyone missing from it is looked up by email
 *   first and created only on a 404.
 * - **Never include an unsubscribed contact** — not in our database, and not in
 *   Resend. Unsubscribe is per contact across all segments, so Resend would skip
 *   them anyway; excluding them keeps the count honest.
 * - **Never print an address.** Counts only.
 *
 * RESUMABLE
 *
 * Reads the segment's current membership first and adds only who is missing,
 * so a run interrupted halfway (the 2026-09-09 audience add was killed twice by
 * memory pressure) is finished by running it again. Paced at four requests a
 * second, the rate that job proved safe, with backoff on a 429.
 *
 * DRY RUN BY DEFAULT.
 *
 *   npx tsx scripts/mp-launch-segment.ts
 *   npx tsx scripts/mp-launch-segment.ts --apply
 */
import { config } from "dotenv";
config({ path: ".env.local", quiet: true } as never);

import { readFileSync, writeFileSync, mkdirSync, existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { neon } from "@neondatabase/serverless";

const APPLY = process.argv.includes("--apply");
const RESEND = "https://api.resend.com";
const MP_SEGMENT_NAME ="Mortgage Protection Launch — Life & FE inquirers (2026-09)";
const LEAD_TYPES = ["Life Insurance", "Final Expense"];
const RECORD = join(process.cwd(), "data", "campaigns", "mortgage-protection-launch-2026-09.json");

const KEY = (process.env.RESEND_API_KEY || "").trim();
const MAIN_SEGMENT = (process.env.RESEND_AUDIENCE_ID || "").trim();
const H = { Authorization: `Bearer ${KEY}`, "Content-Type": "application/json" };

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

/**
 * Evenly spaced, not bursted.
 *
 * The first version sent four requests back to back and then slept a second —
 * the pacing the 2026-09-09 audience add used. Resend's default limit is two
 * requests a second, so every burst tripped 429s and the exponential backoff
 * dragged the real rate to about 0.45 a second: 67 contacts in two and a half
 * minutes, which is nearly two hours for this segment. 550 ms between every
 * call is about 1.8 a second, under the limit with room for the listing calls.
 */
const MIN_GAP_MS = 550;
let lastCall = 0;
let rateLimited = 0;

async function paced(url: string, init?: RequestInit): Promise<Response> {
  for (let attempt = 0; attempt < 6; attempt++) {
    const wait = lastCall + MIN_GAP_MS - Date.now();
    if (wait > 0) await sleep(wait);
    lastCall = Date.now();
    const res = await fetch(url, { ...init, headers: { ...H, ...(init?.headers ?? {}) } });
    if (res.status === 429) rateLimited++;
    if (res.status !== 429) return res;
    await sleep(2000 * (attempt + 1));
  }
  throw new Error(`Rate limited repeatedly on ${url.replace(/contacts\/[^/]+/, "contacts/<email>")}`);
}

interface Contact {
  email: string;
  unsubscribed?: boolean;
}

async function allContacts(segmentId: string): Promise<Contact[]> {
  // The legacy audiences path returns the whole segment in one response
  // (verified 2026-09-15: 6,208 rows, has_more false).
  const res = await paced(`${RESEND}/audiences/${segmentId}/contacts`);
  if (!res.ok) throw new Error(`Listing segment contacts failed: ${res.status} ${await res.text()}`);
  const body = await res.json();
  if (body.has_more) throw new Error("Contact listing reported has_more — pagination needed before trusting a count.");
  return body.data ?? [];
}

function readRecord(): Record<string, unknown> {
  return existsSync(RECORD) ? JSON.parse(readFileSync(RECORD, "utf8")) : {};
}

function writeRecord(patch: Record<string, unknown>) {
  mkdirSync(dirname(RECORD), { recursive: true });
  writeFileSync(RECORD, JSON.stringify({ ...readRecord(), ...patch }, null, 2) + "\n");
}

async function main() {
  console.log(APPLY ? "=== APPLY ===" : "=== DRY RUN (--apply to write) ===");
  if (!KEY || !MAIN_SEGMENT) throw new Error("RESEND_API_KEY or RESEND_AUDIENCE_ID missing");

  // 1. Who, from the database.
  const sql = neon(process.env.DATABASE_URL!);
  const rows = (await sql`
    select distinct on (lower(email)) lower(email) as email, first_name
    from als_buyer_contacts
    where source = 'inquiry'
      and lead_type = any(${LEAD_TYPES})
      and unsubscribed = false
      and coalesce(kickbox_result, '') <> 'undeliverable'
    order by lower(email), first_name nulls last`) as { email: string; first_name: string | null }[];
  console.log(`database: ${rows.length} mailable Life Insurance / Final Expense inquirers`);

  // 2. Reconcile against the main Resend list.
  const main = await allContacts(MAIN_SEGMENT);
  const mainByEmail = new Map(main.map((c) => [c.email.toLowerCase(), c]));
  const unsubscribedInResend = rows.filter((r) => mainByEmail.get(r.email)?.unsubscribed).length;
  const eligible = rows.filter((r) => !mainByEmail.get(r.email)?.unsubscribed);
  const missingFromMain = eligible.filter((r) => !mainByEmail.has(r.email));
  console.log(`excluded, unsubscribed in Resend: ${unsubscribedInResend}`);
  console.log(`eligible: ${eligible.length}  (in the main list: ${eligible.length - missingFromMain.length}, not yet in it: ${missingFromMain.length})`);

  // 3. The segment.
  const segRes = await paced(`${RESEND}/segments`);
  const segments: { id: string; name: string }[] = (await segRes.json()).data ?? [];
  const pinned = readRecord().segmentId as string | undefined;
  let segment = pinned
    ? segments.find((s) => s.id === pinned)
    : segments.find((s) => s.name === MP_SEGMENT_NAME);
  if (pinned && !segment) throw new Error(`Pinned segment ${pinned} no longer exists in Resend — refusing to guess.`);

  const current = segment ? await allContacts(segment.id) : [];
  const inSegment = new Set(current.map((c) => c.email.toLowerCase()));
  const toAdd = eligible.filter((r) => !inSegment.has(r.email));
  console.log(`segment: ${segment ? `exists (${current.length} members)` : "not created yet"}; to add: ${toAdd.length}`);

  if (!APPLY) {
    console.log("\nnothing written.");
    return;
  }

  if (!segment) {
    const res = await paced(`${RESEND}/segments`, { method: "POST", body: JSON.stringify({ name: MP_SEGMENT_NAME }) });
    if (!res.ok) throw new Error(`Creating segment failed: ${res.status} ${await res.text()}`);
    segment = await res.json();
    console.log(`created segment ${segment!.id}`);
  }
  writeRecord({ segmentId: segment!.id, segmentName: MP_SEGMENT_NAME });

  let created = 0;
  let added = 0;
  const failures: string[] = [];
  for (const [i, r] of toAdd.entries()) {
    const enc = encodeURIComponent(r.email);
    if (!mainByEmail.has(r.email)) {
      const lookup = await paced(`${RESEND}/contacts/${enc}`);
      if (lookup.status === 404) {
        const res = await paced(`${RESEND}/contacts`, {
          method: "POST",
          body: JSON.stringify({ email: r.email, ...(r.first_name ? { first_name: r.first_name } : {}) }),
        });
        if (!res.ok) {
          failures.push(`create ${res.status}`);
          continue;
        }
        created++;
      } else if (!lookup.ok) {
        failures.push(`lookup ${lookup.status}`);
        continue;
      }
    }
    const res = await paced(`${RESEND}/contacts/${enc}/segments/${segment!.id}`, { method: "POST" });
    if (res.ok) added++;
    else failures.push(`add ${res.status}`);
    if ((i + 1) % 250 === 0) console.log(`  ${i + 1}/${toAdd.length}  (429s so far: ${rateLimited})`);
  }

  const finalCount = (await allContacts(segment!.id)).length;
  writeRecord({ segmentCount: finalCount, segmentBuiltAt: new Date().toISOString() });
  console.log(`\ncreated ${created} contacts, added ${added} to the segment, ${failures.length} failures`);
  if (failures.length) {
    const tally: Record<string, number> = {};
    for (const f of failures) tally[f] = (tally[f] ?? 0) + 1;
    console.log("failures by kind:", tally, "— re-run to retry; it only adds who is missing.");
  }
  console.log(`segment now holds ${finalCount} contacts`);
}

main()
  .then(() => process.exit(0))
  .catch((e) => {
    console.error("FAILED:", e instanceof Error ? e.message : e);
    process.exit(1);
  });
