/**
 * Draft a weekly newsletter issue into the local archive.
 *
 * WHY THIS EXISTS
 *
 * The Sunday cron (`app/api/cron/weekly-newsletter/route.ts`) was the only way
 * to produce an issue, and its last step commits the archive to `main` through
 * the GitHub API. That makes it unusable for a local dry run: you cannot draft
 * an issue to look at it without writing to the production branch first.
 *
 * This script is steps 1-3 of that route — Sanity pull, calendar lookup, AI
 * generation, HTML render — writing the same two archive files to disk and
 * nothing else. No GitHub commit, no preview email, no broadcast. The output is
 * byte-identical in shape to what the cron archives, so
 * `scripts/send-newsletter.ts` treats both the same.
 *
 * ENVIRONMENT — READ THIS BEFORE RUNNING
 *
 * The checked-out `.env.local` in this repo has been observed STALE: it carried
 * NEXT_PUBLIC_SITE_URL=agedleadsales.com (the retired domain), the 187-contact
 * newsletter-only audience, and a noreply@agedleadsales.com sender. Drafting
 * against it silently produces an issue whose every site link points at the
 * dead brand. Pull production env and pass it explicitly:
 *
 *   vercel env pull /tmp/env.vercel --environment=production
 *   npx tsx --env-file=/tmp/env.vercel scripts/draft-newsletter.ts
 *
 * dotenv does not override variables already present in process.env, so the
 * --env-file values win over .env.local. This script prints the resolved site
 * URL and refuses to run if it still looks like the retired domain.
 *
 * Usage:
 *   npm run newsletter:draft                    # next Tuesday's issue
 *   npm run newsletter:draft -- --date 2026-09-07   # a specific week label
 */

import { config as loadEnv } from "dotenv";
loadEnv({ path: ".env.local" });
loadEnv();

import { writeFileSync, existsSync, mkdirSync } from "node:fs";
import { join } from "node:path";
import { createClient } from "next-sanity";
import { calendarStatus } from "../data/newsletter-calendar";
import {
  generateNewsletterContent,
  type RecentPost,
  type NewsletterContent,
} from "../lib/cron/newsletter-ai";
import { buildNewsletterHtml } from "../lib/cron/newsletter-email";
import { checkIssueHtml } from "../lib/newsletter/issue-gate";

const ARCHIVE_DIR = join(process.cwd(), "data", "newsletter-archive");

/** The domain this site consolidated ONTO. A draft that renders links to
 * anything else means stale env, and the issue is not worth reviewing. */
const EXPECTED_SITE_HOST = "workagedleads.com";

function flag(args: string[], name: string): string | undefined {
  const i = args.indexOf(name);
  return i >= 0 ? args[i + 1] : undefined;
}

function getWeekDates(): { tuesday: string; weekLabel: string } {
  const now = new Date();
  const dayOfWeek = now.getDay(); // 0 = Sunday
  const daysUntilTuesday = dayOfWeek <= 2 ? 2 - dayOfWeek : 9 - dayOfWeek;

  const tuesday = new Date(now);
  tuesday.setDate(now.getDate() + daysUntilTuesday);
  tuesday.setHours(9, 0, 0, 0);

  const monday = new Date(tuesday);
  monday.setDate(tuesday.getDate() - 1);

  const fmt = (d: Date) => d.toISOString().split("T")[0];
  return { tuesday: fmt(tuesday), weekLabel: fmt(monday) };
}

// Plan lookup lives in data/newsletter-calendar.ts now — matched EXACTLY, with
// `calendarStatus()` reporting a miss in words. The +/-7-day fallback that used
// to live here could serve the PREVIOUS week's plan for a send, which reads as
// deliberate and is worse than serving none.

async function fetchRecentPosts(): Promise<RecentPost[]> {
  const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
  const token = process.env.SANITY_API_TOKEN;
  if (!projectId || !token) {
    throw new Error("Missing NEXT_PUBLIC_SANITY_PROJECT_ID or SANITY_API_TOKEN");
  }
  const client = createClient({
    projectId,
    dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || "production",
    apiVersion: "2026-03-14",
    token,
    useCdn: false,
  });
  return client.fetch<RecentPost[]>(
    `*[_type == "post"] | order(publishedAt desc)[0...10] {
      title, "slug": slug.current, excerpt, publishedAt,
      "pillar": categories[0]->title
    }`,
  );
}

/**
 * Delegates to the shared gate so this script, the Sunday cron and the sender
 * all apply the same policy. It used to hold its own copy of the check — which
 * is how the cron came to have none at all.
 */
function assertNoLeadPriceClaim(html: string): void {
  const gate = checkIssueHtml(html);
  if (!gate.ok) {
    console.error(`\nRefusing to archive: ${gate.reason}`);
    process.exit(1);
  }
  for (const w of gate.warnings) {
    console.warn(`Note: ${w}`);
  }
}

async function main() {
  const args = process.argv.slice(2);
  const override = flag(args, "--date");
  if (override && !/^\d{4}-\d{2}-\d{2}$/.test(override)) {
    console.error("--date must be YYYY-MM-DD");
    process.exit(1);
  }

  const dates = getWeekDates();
  const weekLabel = override ?? dates.weekLabel;
  const sendDate = override ?? dates.tuesday;

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "";
  if (!siteUrl.includes(EXPECTED_SITE_HOST)) {
    console.error(
      `NEXT_PUBLIC_SITE_URL is "${siteUrl || "(unset)"}", which is not ${EXPECTED_SITE_HOST}.\n\n` +
        `Every site link in the issue is built from this value, so drafting now would\n` +
        `produce an issue pointing at a retired domain — and it would look fine.\n\n` +
        `Fix:\n` +
        `  vercel env pull /tmp/env.vercel --environment=production\n` +
        `  npx tsx --env-file=/tmp/env.vercel scripts/draft-newsletter.ts`,
    );
    process.exit(1);
  }

  if (!process.env.ANTHROPIC_API_KEY) {
    console.error("ANTHROPIC_API_KEY is not set — cannot generate copy.");
    process.exit(1);
  }

  const jsonPath = join(ARCHIVE_DIR, `${weekLabel}.json`);
  if (existsSync(jsonPath)) {
    console.error(
      `An issue for ${weekLabel} already exists at ${jsonPath}.\n` +
        `Refusing to overwrite — a redraft would replace copy that may already have\n` +
        `been reviewed. Delete it deliberately, or draft a different week.`,
    );
    process.exit(1);
  }

  console.log(`Week label : ${weekLabel}`);
  console.log(`Send date  : ${sendDate}`);
  console.log(`Site URL   : ${siteUrl}`);

  const posts = await fetchRecentPosts();
  console.log(`Sanity     : ${posts.length} recent posts`);

  const status = calendarStatus(sendDate);
  const plan = status.plan;
  console.log(`Calendar   : ${status.message}`);

  console.log("Generating copy...");
  const content: NewsletterContent = await generateNewsletterContent(
    plan ?? null,
    posts,
    siteUrl,
    weekLabel,
  );
  console.log(`Subject    : ${content.subject}`);

  const html = buildNewsletterHtml(content, siteUrl, weekLabel);
  console.log(`HTML       : ${(html.length / 1024).toFixed(1)} KB`);

  assertNoLeadPriceClaim(html);

  if (!existsSync(ARCHIVE_DIR)) mkdirSync(ARCHIVE_DIR, { recursive: true });

  const record = {
    runDate: new Date().toISOString(),
    weekOf: weekLabel,
    sendDate,
    theme: plan?.theme || "AI-generated",
    focusVertical: plan?.focusVertical || "topic-themed",
    subject: content.subject,
    previewText: content.previewText,
    html: `${weekLabel}.html`,
    sent: false,
    featuredArticle: content.featuredArticle,
    quickTips: content.quickTips.map((t) => t.title),
    industryInsight: content.industryInsight.headline,
    draftedBy: "scripts/draft-newsletter.ts",
    errors: [] as string[],
  };

  writeFileSync(jsonPath, JSON.stringify(record, null, 2) + "\n");
  writeFileSync(join(ARCHIVE_DIR, `${weekLabel}.html`), html);

  console.log(`\nArchived:\n  ${jsonPath}\n  ${join(ARCHIVE_DIR, `${weekLabel}.html`)}`);
  console.log(`\nNothing was sent. Next:`);
  console.log(`  npm run newsletter:send -- --date ${weekLabel} --seed you@example.com --confirm`);
}

main().catch((err) => {
  console.error(err instanceof Error ? err.message : err);
  process.exit(1);
});
