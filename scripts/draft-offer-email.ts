/**
 * Draft the one-off direct offer send into the local archive.
 *
 * WHY IT ARCHIVES INTO THE NEWSLETTER FOLDER
 *
 * `scripts/send-newsletter.ts` is the only path in this repo that can mail the
 * list, and it carries every guard worth having: the price gate re-scanned at
 * the moment of transmission, the `killed` flag, the `sent` idempotence check,
 * and the 500-recipient floor that catches a wrong audience id. Building a
 * second sender for this email would mean either duplicating all of that or
 * quietly shipping without it.
 *
 * So this writes the same two files in the same shape into
 * `data/newsletter-archive/`, and the existing sender mails it unmodified:
 *
 *   npm run offer:draft -- --date 2026-09-11
 *   npm run newsletter:send -- --date 2026-09-11 --seed bill@billricestrategy.com --confirm
 *   npm run newsletter:send -- --date 2026-09-11 --confirm
 *
 * PICK A DATE THAT IS NOT A MONDAY. The Sunday cron writes
 * `{weekOf}.json` keyed to a Monday, and an offer archived under the same label
 * would collide with it — which is exactly the collision that put two different
 * issues under `2026-08-31` and produced a merge conflict on 2026-09-02. This
 * script refuses a Monday for that reason.
 *
 * ENVIRONMENT
 *
 * The checked-out `.env.local` has been observed stale, carrying the retired
 * domain. Every site link is built from NEXT_PUBLIC_SITE_URL, so drafting
 * against it produces an email pointing at a dead brand that looks fine. Pull
 * production env and pass it explicitly — dotenv does not override what is
 * already in process.env, so --env-file wins:
 *
 *   vercel env pull /tmp/env.vercel --environment=production
 *   npx tsx --env-file=/tmp/env.vercel scripts/draft-offer-email.ts --date 2026-09-11
 */

import { config as loadEnv } from "dotenv";
loadEnv({ path: ".env.local" });
loadEnv();

import { writeFileSync, existsSync, mkdirSync } from "node:fs";
import { join } from "node:path";
import { buildOfferHtml, OFFER_CONTENT, OFFER_CAMPAIGN } from "../lib/newsletter/offer-email";
import { checkIssueHtml } from "../lib/newsletter/issue-gate";

const ARCHIVE_DIR = join(process.cwd(), "data", "newsletter-archive");
const EXPECTED_SITE_HOST = "workagedleads.com";

function flag(args: string[], name: string): string | undefined {
  const i = args.indexOf(name);
  return i >= 0 ? args[i + 1] : undefined;
}

function main() {
  const args = process.argv.slice(2);
  const date = flag(args, "--date");

  if (!date || !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    console.error("Usage: npm run offer:draft -- --date YYYY-MM-DD");
    process.exit(1);
  }

  // Monday is the weekly cron's key space. Two writers, one filename.
  const parsed = new Date(`${date}T12:00:00Z`);
  if (Number.isNaN(parsed.getTime())) {
    console.error(`--date "${date}" is not a real date.`);
    process.exit(1);
  }
  if (parsed.getUTCDay() === 1) {
    console.error(
      `${date} is a Monday, which is the weekly cron's archive key.\n` +
        `Pick another day so the offer cannot collide with an issue.`,
    );
    process.exit(1);
  }

  const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || "").replace(/\/$/, "");
  if (!siteUrl.includes(EXPECTED_SITE_HOST)) {
    console.error(
      `NEXT_PUBLIC_SITE_URL is "${siteUrl || "(unset)"}", which is not ${EXPECTED_SITE_HOST}.\n\n` +
        `Every site link in this email is built from it, so drafting now would\n` +
        `produce a send pointing at a retired domain — and it would look fine.\n\n` +
        `Fix:\n` +
        `  vercel env pull /tmp/env.vercel --environment=production\n` +
        `  npx tsx --env-file=/tmp/env.vercel scripts/draft-offer-email.ts --date ${date}`,
    );
    process.exit(1);
  }

  const jsonPath = join(ARCHIVE_DIR, `${date}.json`);
  const htmlPath = join(ARCHIVE_DIR, `${date}.html`);
  if (existsSync(jsonPath) || existsSync(htmlPath)) {
    console.error(
      `An archived send already exists for ${date}:\n  ${jsonPath}\n` +
        `Refusing to overwrite — it may already have been reviewed or mailed.`,
    );
    process.exit(1);
  }

  const html = buildOfferHtml(date, siteUrl);

  // Same gate the sender re-runs at transmission. Failing here is cheaper.
  const gate = checkIssueHtml(html);
  if (!gate.ok) {
    console.error(`\nRefusing to archive: ${gate.reason}`);
    process.exit(1);
  }
  for (const w of gate.warnings) console.warn(`Note: ${w}`);

  if (!existsSync(ARCHIVE_DIR)) mkdirSync(ARCHIVE_DIR, { recursive: true });

  const record = {
    runDate: new Date().toISOString(),
    weekOf: date,
    sendDate: date,
    theme: "Direct offer — vertical self-select",
    focusVertical: "reader-selected",
    campaign: OFFER_CAMPAIGN,
    subject: OFFER_CONTENT.subject,
    previewText: OFFER_CONTENT.previewText,
    html: `${date}.html`,
    sent: false,
    draftedBy: "scripts/draft-offer-email.ts",
    errors: [] as string[],
  };

  writeFileSync(jsonPath, JSON.stringify(record, null, 2) + "\n");
  writeFileSync(htmlPath, html);

  console.log(`Site URL : ${siteUrl}`);
  console.log(`Subject  : ${OFFER_CONTENT.subject}`);
  console.log(`Campaign : ${OFFER_CAMPAIGN}`);
  console.log(`HTML     : ${(html.length / 1024).toFixed(1)} KB`);
  console.log(`\nArchived:\n  ${jsonPath}\n  ${htmlPath}`);
  console.log(`\nNothing was sent. Next:`);
  console.log(`  npm run newsletter:send -- --date ${date} --seed you@example.com --confirm`);
}

main();
