import { NextResponse } from "next/server";
import { createClient } from "next-sanity";
import { Resend } from "resend";
import {
  researchGoogleUpdates,
  auditSite,
  mergeBacklog,
  type SiteSnapshot,
} from "@/lib/cron/seo-audit";
import { commitFilesToGitHub } from "@/lib/cron/git-commit";
import { recordCronRun } from "@/lib/cron/heartbeat";
import type {
  SEOAuditReport,
  SEOBacklog,
  GoogleUpdateSummary,
  AuditFinding,
} from "@/lib/cron/types";

export const maxDuration = 300;
export const dynamic = "force-dynamic";

const REPORT_EMAIL = "bill@billricestrategy.com";

function getSanityClient() {
  const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
  const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";
  const token = process.env.SANITY_API_TOKEN;

  if (!projectId || !token) {
    throw new Error(
      "Missing NEXT_PUBLIC_SANITY_PROJECT_ID or SANITY_API_TOKEN"
    );
  }

  return createClient({
    projectId,
    dataset,
    apiVersion: "2026-03-14",
    token,
    useCdn: false,
  });
}

async function buildSiteSnapshot(): Promise<SiteSnapshot> {
  const client = getSanityClient();

  const data = await client.fetch<{
    posts: {
      title: string;
      slug: string;
      excerpt: string;
      hasSeo: boolean;
      hasImage: boolean;
      publishedAt: string;
    }[];
    glossaryCount: number;
    leadTypeCount: number;
    playbookCount: number;
    guideCount: number;
  }>(`{
    "posts": *[_type == "post"] | order(publishedAt desc) {
      title,
      "slug": slug.current,
      excerpt,
      "hasSeo": defined(seo.metaTitle) && defined(seo.metaDescription),
      "hasImage": defined(mainImage),
      publishedAt
    },
    "glossaryCount": count(*[_type == "glossaryTerm"]),
    "leadTypeCount": count(*[_type == "leadType"]),
    "playbookCount": count(*[_type == "playbook"]),
    "guideCount": count(*[_type == "guide"])
  }`);

  const postsMissingSeo = data.posts
    .filter((p) => !p.hasSeo)
    .map((p) => p.slug);

  const postsMissingImages = data.posts
    .filter((p) => !p.hasImage)
    .map((p) => p.slug);

  const postsWithShortExcerpts = data.posts
    .filter((p) => !p.excerpt || p.excerpt.length < 80)
    .map((p) => p.slug);

  const estimatedSitemapEntries =
    8 +
    data.posts.length +
    data.leadTypeCount +
    data.playbookCount +
    data.glossaryCount +
    data.guideCount;

  return {
    totalPosts: data.posts.length,
    totalGlossaryTerms: data.glossaryCount,
    totalLeadTypes: data.leadTypeCount,
    totalPlaybooks: data.playbookCount,
    totalGuides: data.guideCount,
    recentPostTitles: data.posts.slice(0, 10).map((p) => p.title),
    postsMissingSeo,
    postsMissingImages,
    postsWithShortExcerpts,
    affiliateLinkPattern:
      'rel="nofollow sponsored noopener noreferrer" with UTM tracking via lib/affiliate.ts',
    jsonLdTypes: [
      "WebSite",
      "Organization",
      "Person",
      "Article",
      "BreadcrumbList",
      "FAQPage",
      "DefinedTerm",
      "WebApplication",
    ],
    robotsConfig: 'Allow: / | Disallow: /studio, /api/ | Sitemap declared',
    sitemapEntryCount: estimatedSitemapEntries,
    hasCanonicalUrls: true,
    hasOpenGraph: true,
    hasTwitterCards: true,
    authorSetup:
      "Bill Rice — Person schema with sameAs links (Kaleidico, HowToWorkLeads, Medium), knowsAbout topics, worksFor organizations",
    contentPillars: [
      "Vertical Playbooks",
      "Channel Tactics",
      "Role Guides",
      "Metrics & Optimization",
      "Compliance",
    ],
  };
}

async function fetchExistingBacklog(): Promise<SEOBacklog | null> {
  const token = process.env.GITHUB_TOKEN;
  const repo = process.env.GITHUB_REPO;
  const branch = process.env.GITHUB_BRANCH || "main";

  if (!token || !repo) return null;

  try {
    const res = await fetch(
      `https://api.github.com/repos/${repo}/contents/data/seo-backlog.json?ref=${branch}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/vnd.github.v3+json",
        },
      }
    );

    if (!res.ok) return null;

    const data = (await res.json()) as { content?: string };
    if (!data.content) return null;

    const decoded = Buffer.from(data.content, "base64").toString("utf-8");
    return JSON.parse(decoded) as SEOBacklog;
  } catch {
    return null;
  }
}

export async function GET(request: Request) {
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const startTime = Date.now();
  const errors: string[] = [];
  const auditDate = new Date().toISOString().split("T")[0];

  console.log(`[SEO Audit] Starting audit run: ${auditDate}`);

  // ── Step 1: Gather site snapshot ─────────────────────────────
  let snapshot: SiteSnapshot;
  try {
    snapshot = await buildSiteSnapshot();
    console.log(
      `[SEO Audit] Snapshot: ${snapshot.totalPosts} posts, ${snapshot.totalGlossaryTerms} glossary, ${snapshot.totalLeadTypes} lead types`
    );
  } catch (err) {
    const msg = `Failed to build site snapshot: ${err instanceof Error ? err.message : err}`;
    console.error(msg);
    await recordCronRun({
      name: "seo-audit",
      status: "failed",
      detail: msg,
      durationMs: Date.now() - startTime,
    });
    return NextResponse.json(
      { success: false, error: msg, duration: Date.now() - startTime },
      { status: 500 }
    );
  }

  // ── Step 2: Research Google updates ──────────────────────────
  let googleUpdates: GoogleUpdateSummary[] = [];
  try {
    console.log("[SEO Audit] Researching latest Google updates...");
    googleUpdates = await researchGoogleUpdates();
    console.log(
      `[SEO Audit] Found ${googleUpdates.length} relevant updates`
    );
  } catch (err) {
    const msg = `Google updates research failed: ${err instanceof Error ? err.message : err}`;
    console.error(msg);
    errors.push(msg);
  }

  // ── Step 3: Fetch existing backlog ───────────────────────────
  let existingBacklog: SEOBacklog | null = null;
  try {
    existingBacklog = await fetchExistingBacklog();
    if (existingBacklog) {
      const openCount = existingBacklog.items.filter(
        (i) => i.status === "open"
      ).length;
      console.log(
        `[SEO Audit] Existing backlog: ${existingBacklog.items.length} items (${openCount} open)`
      );
    } else {
      console.log("[SEO Audit] No existing backlog found — first audit");
    }
  } catch (err) {
    console.warn("Failed to fetch existing backlog:", err);
  }

  // ── Step 4: Run the audit ────────────────────────────────────
  let findings: AuditFinding[] = [];
  let overallScore = 0;
  let strategyRecommendations: string[] = [];
  let contentStrategyUpdates: string[] = [];
  let summary = "";

  try {
    console.log("[SEO Audit] Running comprehensive site audit...");
    const auditResult = await auditSite(
      snapshot,
      googleUpdates,
      existingBacklog
    );
    findings = auditResult.findings;
    overallScore = auditResult.overallScore;
    strategyRecommendations = auditResult.strategyRecommendations;
    contentStrategyUpdates = auditResult.contentStrategyUpdates;
    summary = auditResult.summary;
    console.log(
      `[SEO Audit] Score: ${overallScore}/100, ${findings.length} findings`
    );
  } catch (err) {
    const msg = `Site audit failed: ${err instanceof Error ? err.message : err}`;
    console.error(msg);
    errors.push(msg);
  }

  // ── Step 5: Merge backlog ────────────────────────────────────
  const updatedBacklog = mergeBacklog(
    existingBacklog,
    findings,
    auditDate
  );

  const newItems = updatedBacklog.items.filter(
    (i) => i.sourceAudit === auditDate && i.status === "open"
  );
  const resolvedItems = updatedBacklog.items.filter(
    (i) =>
      i.status === "completed" &&
      i.notes?.includes(`audit ${auditDate}`)
  );

  console.log(
    `[SEO Audit] Backlog: ${newItems.length} new, ${resolvedItems.length} resolved, ${updatedBacklog.items.filter((i) => i.status === "open").length} total open`
  );

  // ── Step 6: Build report ─────────────────────────────────────
  const report: SEOAuditReport = {
    runDate: new Date().toISOString(),
    googleUpdates,
    overallScore,
    findings,
    strategyRecommendations,
    contentStrategyUpdates,
    backlogItemsCreated: newItems.length,
    backlogItemsResolved: resolvedItems.length,
    summary,
  };

  // ── Step 7: Commit to GitHub ─────────────────────────────────
  try {
    await commitFilesToGitHub(
      [
        {
          path: "data/seo-backlog.json",
          content: JSON.stringify(updatedBacklog, null, 2),
        },
        {
          path: `data/seo-audits/${auditDate}.json`,
          content: JSON.stringify(report, null, 2),
        },
      ],
      `chore(seo): audit report — ${auditDate}\n\nScore: ${overallScore}/100\n${newItems.length} new findings, ${resolvedItems.length} resolved\n${findings.filter((f) => f.severity === "critical" || f.severity === "high").length} critical/high items`
    );
    console.log("[SEO Audit] Committed backlog and audit report to GitHub");
  } catch (err) {
    const msg = `GitHub commit failed: ${err instanceof Error ? err.message : err}`;
    console.error(msg);
    errors.push(msg);
  }

  // ── Step 8: Send email report ────────────────────────────────
  const resendApiKey = process.env.RESEND_API_KEY;
  if (resendApiKey) {
    try {
      const resend = new Resend(resendApiKey);
      const fromEmail =
        process.env.RESEND_FROM_EMAIL ||
        "Work Aged Leads <noreply@agedleadsales.com>";

      await resend.emails.send({
        from: fromEmail,
        to: REPORT_EMAIL,
        subject: `SEO Audit Report — Score: ${overallScore}/100 — ${auditDate}`,
        html: buildAuditEmailHtml(report, updatedBacklog, errors),
      });
      console.log(`[SEO Audit] Report email sent to ${REPORT_EMAIL}`);
    } catch (err) {
      const msg = `Email send failed: ${err instanceof Error ? err.message : err}`;
      console.error(msg);
      errors.push(msg);
    }
  } else {
    errors.push("RESEND_API_KEY not set — audit email not sent");
  }

  const duration = Date.now() - startTime;
  console.log(
    `[SEO Audit] Completed in ${(duration / 1000).toFixed(1)}s — Score: ${overallScore}/100, ${errors.length} errors`
  );

  await recordCronRun({
    name: "seo-audit",
    status: errors.length === 0 ? "ok" : "partial",
    detail:
      errors.length > 0
        ? errors.join("; ")
        : `score=${overallScore} findings=${findings.length} new=${newItems.length} resolved=${resolvedItems.length}`,
    durationMs: duration,
  });

  return NextResponse.json({
    success: errors.length === 0,
    duration,
    auditDate,
    overallScore,
    findingsCount: findings.length,
    backlogOpen: updatedBacklog.items.filter((i) => i.status === "open")
      .length,
    newItems: newItems.length,
    resolvedItems: resolvedItems.length,
    errors,
  });
}

function buildAuditEmailHtml(
  report: SEOAuditReport,
  backlog: SEOBacklog,
  errors: string[]
): string {
  const scoreColor =
    report.overallScore >= 80
      ? "#059669"
      : report.overallScore >= 60
        ? "#d97706"
        : "#dc2626";

  const updatesHtml = report.googleUpdates
    .map(
      (u) => `
      <tr>
        <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; vertical-align: top;">
          <strong style="color: #111827;">${u.updateName}</strong>
          <br><span style="color: #6b7280; font-size: 13px;">${u.dateRange}</span>
        </td>
        <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; vertical-align: top; font-size: 14px; color: #374151;">${u.impactSummary}</td>
        <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; vertical-align: top; font-size: 14px; color: #374151;">${u.relevanceToUs}</td>
        <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; text-align: center; vertical-align: top;">
          ${u.actionRequired ? '<span style="background: #fef2f2; color: #dc2626; padding: 2px 8px; border-radius: 4px; font-size: 12px; font-weight: 600;">Action</span>' : '<span style="background: #f0fdf4; color: #059669; padding: 2px 8px; border-radius: 4px; font-size: 12px; font-weight: 600;">OK</span>'}
        </td>
      </tr>`
    )
    .join("");

  const severityBadge = (severity: string) => {
    const colors: Record<string, string> = {
      critical: "background:#fef2f2;color:#dc2626",
      high: "background:#fff7ed;color:#ea580c",
      medium: "background:#fefce8;color:#ca8a04",
      low: "background:#f0fdf4;color:#059669",
      info: "background:#eff6ff;color:#2563eb",
    };
    return `<span style="${colors[severity] || colors.info};padding:2px 8px;border-radius:4px;font-size:11px;font-weight:600;text-transform:uppercase;">${severity}</span>`;
  };

  const findingsHtml = report.findings
    .sort((a, b) => {
      const order = { critical: 0, high: 1, medium: 2, low: 3, info: 4 };
      return (
        (order[a.severity] ?? 4) - (order[b.severity] ?? 4)
      );
    })
    .map(
      (f) => `
      <tr>
        <td style="padding: 10px 12px; border-bottom: 1px solid #e5e7eb;">${severityBadge(f.severity)}</td>
        <td style="padding: 10px 12px; border-bottom: 1px solid #e5e7eb;">
          <strong style="font-size: 14px; color: #111827;">${f.title}</strong>
          <br><span style="font-size: 13px; color: #6b7280;">${f.category}</span>
        </td>
        <td style="padding: 10px 12px; border-bottom: 1px solid #e5e7eb; font-size: 13px; color: #374151;">${f.recommendation}</td>
        <td style="padding: 10px 12px; border-bottom: 1px solid #e5e7eb; text-align: center; font-size: 13px; color: #6b7280;">${f.effort}</td>
      </tr>`
    )
    .join("");

  const strategyHtml = report.strategyRecommendations
    .map((r) => `<li style="margin-bottom: 8px; line-height: 1.5;">${r}</li>`)
    .join("");

  const contentHtml = report.contentStrategyUpdates
    .map((u) => `<li style="margin-bottom: 8px; line-height: 1.5;">${u}</li>`)
    .join("");

  const openItems = backlog.items.filter((i) => i.status === "open");

  const backlogSummaryHtml = `
    <table style="width: 100%; border-collapse: collapse; margin-bottom: 16px;">
      <tr>
        <td style="padding: 12px; background: #fef2f2; border-radius: 8px 0 0 8px; text-align: center;">
          <div style="font-size: 24px; font-weight: 700; color: #dc2626;">${openItems.filter((i) => i.severity === "critical").length}</div>
          <div style="font-size: 11px; color: #dc2626; text-transform: uppercase;">Critical</div>
        </td>
        <td style="padding: 12px; background: #fff7ed; text-align: center;">
          <div style="font-size: 24px; font-weight: 700; color: #ea580c;">${openItems.filter((i) => i.severity === "high").length}</div>
          <div style="font-size: 11px; color: #ea580c; text-transform: uppercase;">High</div>
        </td>
        <td style="padding: 12px; background: #fefce8; text-align: center;">
          <div style="font-size: 24px; font-weight: 700; color: #ca8a04;">${openItems.filter((i) => i.severity === "medium").length}</div>
          <div style="font-size: 11px; color: #ca8a04; text-transform: uppercase;">Medium</div>
        </td>
        <td style="padding: 12px; background: #f0fdf4; text-align: center;">
          <div style="font-size: 24px; font-weight: 700; color: #059669;">${openItems.filter((i) => i.severity === "low").length}</div>
          <div style="font-size: 11px; color: #059669; text-transform: uppercase;">Low</div>
        </td>
        <td style="padding: 12px; background: #eff6ff; border-radius: 0 8px 8px 0; text-align: center;">
          <div style="font-size: 24px; font-weight: 700; color: #2563eb;">${openItems.filter((i) => i.severity === "info").length}</div>
          <div style="font-size: 11px; color: #2563eb; text-transform: uppercase;">Info</div>
        </td>
      </tr>
    </table>`;

  const errorsHtml =
    errors.length > 0
      ? `<div style="background:#fef2f2;border:1px solid #fecaca;border-radius:8px;padding:16px;margin-top:20px;">
          <h3 style="color:#dc2626;margin:0 0 8px;">Errors During Audit</h3>
          <ul style="margin:0;padding-left:20px;">${errors.map((e) => `<li>${e}</li>`).join("")}</ul>
        </div>`
      : "";

  return `<!DOCTYPE html>
<html><head><meta charset="utf-8"></head>
<body style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;color:#1f2937;max-width:900px;margin:0 auto;padding:20px;">

  <!-- Header -->
  <div style="background:linear-gradient(135deg,#0f172a,#334155);color:white;padding:28px 32px;border-radius:12px;margin-bottom:24px;">
    <table style="width:100%;" cellpadding="0" cellspacing="0">
      <tr>
        <td>
          <h1 style="margin:0 0 4px;font-size:24px;">SEO Audit Report</h1>
          <p style="margin:0;opacity:0.85;font-size:14px;">Work Aged Leads — ${report.runDate.split("T")[0]}</p>
        </td>
        <td style="text-align:right;">
          <div style="display:inline-block;background:${scoreColor};padding:12px 20px;border-radius:10px;">
            <div style="font-size:32px;font-weight:800;line-height:1;">${report.overallScore}</div>
            <div style="font-size:11px;opacity:0.9;text-transform:uppercase;letter-spacing:1px;">Score</div>
          </div>
        </td>
      </tr>
    </table>
  </div>

  <!-- Executive Summary -->
  <div style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:8px;padding:20px;margin-bottom:24px;">
    <h2 style="margin:0 0 12px;font-size:18px;color:#0f172a;">Executive Summary</h2>
    <p style="margin:0;line-height:1.7;white-space:pre-line;">${report.summary}</p>
  </div>

  <!-- Backlog Summary -->
  <h2 style="font-size:18px;border-bottom:2px solid #e5e7eb;padding-bottom:8px;margin-bottom:16px;">Backlog Overview</h2>
  ${backlogSummaryHtml}
  <p style="color:#6b7280;font-size:13px;margin-bottom:24px;">${report.backlogItemsCreated} new items added, ${report.backlogItemsResolved} items resolved since last audit</p>

  <!-- Google Updates -->
  <h2 style="font-size:18px;border-bottom:2px solid #e5e7eb;padding-bottom:8px;margin-bottom:16px;">Google Algorithm Updates</h2>
  <table style="width:100%;border-collapse:collapse;margin-bottom:24px;font-size:14px;">
    <thead>
      <tr style="background:#f9fafb;">
        <th style="padding:8px 12px;text-align:left;border-bottom:2px solid #e5e7eb;width:180px;">Update</th>
        <th style="padding:8px 12px;text-align:left;border-bottom:2px solid #e5e7eb;">Impact</th>
        <th style="padding:8px 12px;text-align:left;border-bottom:2px solid #e5e7eb;">Relevance to Us</th>
        <th style="padding:8px 12px;text-align:center;border-bottom:2px solid #e5e7eb;width:70px;">Status</th>
      </tr>
    </thead>
    <tbody>${updatesHtml}</tbody>
  </table>

  <!-- Findings -->
  <h2 style="font-size:18px;border-bottom:2px solid #e5e7eb;padding-bottom:8px;margin-bottom:16px;">Audit Findings (${report.findings.length})</h2>
  <table style="width:100%;border-collapse:collapse;margin-bottom:24px;font-size:14px;">
    <thead>
      <tr style="background:#f9fafb;">
        <th style="padding:8px 12px;text-align:left;border-bottom:2px solid #e5e7eb;width:80px;">Severity</th>
        <th style="padding:8px 12px;text-align:left;border-bottom:2px solid #e5e7eb;">Finding</th>
        <th style="padding:8px 12px;text-align:left;border-bottom:2px solid #e5e7eb;">Recommendation</th>
        <th style="padding:8px 12px;text-align:center;border-bottom:2px solid #e5e7eb;width:70px;">Effort</th>
      </tr>
    </thead>
    <tbody>${findingsHtml}</tbody>
  </table>

  <!-- SEO Strategy Recommendations -->
  <div style="background:#eff6ff;border:1px solid #bfdbfe;border-radius:8px;padding:20px;margin-bottom:24px;">
    <h2 style="margin:0 0 12px;font-size:18px;color:#1e40af;">SEO Strategy Recommendations</h2>
    <ul style="margin:0;padding-left:20px;color:#1e3a5f;">${strategyHtml}</ul>
  </div>

  <!-- Content Strategy Updates -->
  <div style="background:#f0fdf4;border:1px solid #bbf7d0;border-radius:8px;padding:20px;margin-bottom:24px;">
    <h2 style="margin:0 0 12px;font-size:18px;color:#166534;">Content Strategy Updates</h2>
    <ul style="margin:0;padding-left:20px;color:#14532d;">${contentHtml}</ul>
  </div>

  ${errorsHtml}

  <hr style="border:none;border-top:1px solid #e5e7eb;margin:32px 0 16px;">
  <p style="color:#9ca3af;font-size:12px;">Generated by the Work Aged Leads SEO audit cron job. Full backlog saved to data/seo-backlog.json. Audit details saved to data/seo-audits/${report.runDate.split("T")[0]}.json.</p>
</body></html>`;
}
