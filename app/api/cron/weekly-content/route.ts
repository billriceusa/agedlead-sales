import { NextResponse } from "next/server";
import { EDITORIAL_CALENDAR } from "@/data/editorial-calendar";
import { GLOSSARY_TERMS } from "@/data/glossary-terms";
import { analyzeAndPlan, writeArticle } from "@/lib/cron/ai-content";
import {
  getExistingPostSlugs,
  getGlossaryTermSlugs,
  getLeadTypeSlugs,
  publishArticle,
} from "@/lib/cron/sanity-publish";
import { commitFilesToGitHub } from "@/lib/cron/git-commit";
import { sendWeeklyReport } from "@/lib/cron/notify";
import type { WeeklyReport, GeneratedArticle } from "@/lib/cron/types";

export const maxDuration = 300;
export const dynamic = "force-dynamic";

const REPORT_EMAIL = "bill@billricestrategy.com";

function getWeekDates(): {
  monday: string;
  wednesday: string;
  friday: string;
  weekLabel: string;
} {
  const now = new Date();
  const dayOfWeek = now.getDay(); // 0 = Sunday
  const daysUntilMonday = dayOfWeek === 0 ? 1 : 8 - dayOfWeek;

  const monday = new Date(now);
  monday.setDate(now.getDate() + daysUntilMonday);

  const wednesday = new Date(monday);
  wednesday.setDate(monday.getDate() + 2);

  const friday = new Date(monday);
  friday.setDate(monday.getDate() + 4);

  const fmt = (d: Date) => d.toISOString().split("T")[0];

  return {
    monday: fmt(monday),
    wednesday: fmt(wednesday),
    friday: fmt(friday),
    weekLabel: fmt(monday),
  };
}

export async function GET(request: Request) {
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const startTime = Date.now();
  const errors: string[] = [];
  const weekDates = getWeekDates();

  console.log(
    `[Weekly Content] Starting run for week of ${weekDates.weekLabel}`
  );

  // ── Step 1: Gather current state ─────────────────────────────
  let existingPostSlugs: string[] = [];
  let glossaryTermSlugs: string[] = [];
  let leadTypeSlugs: string[] = [];

  try {
    [existingPostSlugs, glossaryTermSlugs, leadTypeSlugs] =
      await Promise.all([
        getExistingPostSlugs(),
        getGlossaryTermSlugs(),
        getLeadTypeSlugs(),
      ]);

    if (glossaryTermSlugs.length === 0) {
      glossaryTermSlugs = GLOSSARY_TERMS.map((t) => t.slug);
    }

    console.log(
      `[State] ${existingPostSlugs.length} posts, ${glossaryTermSlugs.length} glossary terms, ${leadTypeSlugs.length} lead types`
    );
  } catch (err) {
    const msg = `Failed to fetch current state from Sanity: ${err instanceof Error ? err.message : err}`;
    console.error(msg);
    errors.push(msg);
    glossaryTermSlugs = GLOSSARY_TERMS.map((t) => t.slug);
  }

  // ── Step 2: SEO Analysis & Content Planning ──────────────────
  let plan;
  try {
    console.log("[Planning] Analyzing SEO strategy and creating content plan...");
    plan = await analyzeAndPlan(
      existingPostSlugs,
      EDITORIAL_CALENDAR,
      glossaryTermSlugs,
      leadTypeSlugs,
      weekDates
    );
    console.log(
      `[Planning] Created plan with ${plan.briefs.length} briefs`
    );
  } catch (err) {
    const msg = `Content planning failed: ${err instanceof Error ? err.message : err}`;
    console.error(msg);
    errors.push(msg);

    return NextResponse.json(
      {
        success: false,
        error: "Content planning failed",
        errors,
        duration: Date.now() - startTime,
      },
      { status: 500 }
    );
  }

  // ── Step 3: Write articles in parallel ───────────────────────
  const articles: GeneratedArticle[] = [];

  console.log("[Writing] Generating articles in parallel...");
  const writeResults = await Promise.allSettled(
    plan.briefs.map((brief) =>
      writeArticle(brief, glossaryTermSlugs, leadTypeSlugs)
    )
  );

  for (let i = 0; i < writeResults.length; i++) {
    const result = writeResults[i];
    if (result.status === "fulfilled") {
      articles.push(result.value);
      console.log(`[Writing] Completed: ${plan.briefs[i].title}`);
    } else {
      const msg = `Failed to write article "${plan.briefs[i].title}": ${result.reason}`;
      console.error(msg);
      errors.push(msg);
    }
  }

  // ── Step 4: Publish to Sanity ────────────────────────────────
  const publishedArticles: WeeklyReport["articlesPublished"] = [];

  for (const article of articles) {
    try {
      const result = await publishArticle(article);
      publishedArticles.push({
        title: article.brief.title,
        slug: result.slug,
        publishDate: article.brief.publishDate,
        primaryKeyword: article.brief.primaryKeyword,
        pillar: article.brief.pillar,
      });
      console.log(`[Publish] Published: ${article.brief.title}`);
    } catch (err) {
      const msg = `Failed to publish "${article.brief.title}": ${err instanceof Error ? err.message : err}`;
      console.error(msg);
      errors.push(msg);
    }
  }

  // ── Step 5: Build the report ─────────────────────────────────
  const report: WeeklyReport = {
    runDate: new Date().toISOString(),
    weekStartDate: weekDates.weekLabel,
    analysis: plan.analysis,
    articlesPublished: publishedArticles,
    newBriefs: plan.briefs,
    nextWeekPlan: plan.calendarNotes,
    errors,
  };

  // ── Step 6: Commit report to GitHub ──────────────────────────
  try {
    const reportFilename = `data/weekly-reports/${weekDates.weekLabel}.json`;

    const strategyUpdate = {
      lastRun: report.runDate,
      weekOf: weekDates.weekLabel,
      analysis: plan.analysis,
      articlesPublished: publishedArticles,
      briefsForNextWeek: plan.calendarNotes,
    };

    await commitFilesToGitHub(
      [
        {
          path: reportFilename,
          content: JSON.stringify(report, null, 2),
        },
        {
          path: "data/seo-strategy-latest.json",
          content: JSON.stringify(strategyUpdate, null, 2),
        },
      ],
      `chore(content): weekly content run — ${weekDates.weekLabel}\n\nPublished ${publishedArticles.length} articles:\n${publishedArticles.map((a) => `- ${a.title}`).join("\n")}`
    );
    console.log("[Git] Committed weekly report and strategy update");
  } catch (err) {
    const msg = `GitHub commit failed: ${err instanceof Error ? err.message : err}`;
    console.error(msg);
    errors.push(msg);
  }

  // ── Step 7: Send email report ────────────────────────────────
  try {
    await sendWeeklyReport(report, REPORT_EMAIL);
    console.log(`[Email] Report sent to ${REPORT_EMAIL}`);
  } catch (err) {
    const msg = `Email send failed: ${err instanceof Error ? err.message : err}`;
    console.error(msg);
    errors.push(msg);
  }

  const duration = Date.now() - startTime;
  console.log(
    `[Weekly Content] Completed in ${(duration / 1000).toFixed(1)}s — ${publishedArticles.length} articles published, ${errors.length} errors`
  );

  return NextResponse.json({
    success: errors.length === 0,
    duration,
    weekOf: weekDates.weekLabel,
    articlesPublished: publishedArticles.length,
    errors,
  });
}
