import { NextResponse } from "next/server";
import { Resend } from "resend";
import {
  scrapeProviderWebsite,
  extractProviderData,
  generateBenchmarkEstimates,
  buildMarketwatchReport,
  type ExtractedProviderUpdate,
} from "@/lib/cron/marketwatch-ai";
import {
  getProviderProfiles,
  upsertPriceBenchmarks,
  findStaleProviders,
  getExistingBenchmarks,
} from "@/lib/cron/marketwatch-publish";
import { commitFilesToGitHub } from "@/lib/cron/git-commit";

export const maxDuration = 300;
export const dynamic = "force-dynamic";

const REPORT_EMAIL = "bill@billricestrategy.com";

export async function GET(request: Request) {
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const startTime = Date.now();
  const errors: string[] = [];
  const now = new Date();
  const month = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;

  console.log(`[Marketwatch] Starting monthly run for ${month}`);

  // ── Step 1: Fetch all provider profiles from Sanity ──────────
  let providers: Awaited<ReturnType<typeof getProviderProfiles>> = [];
  try {
    providers = await getProviderProfiles();
    console.log(`[Marketwatch] Found ${providers.length} providers in Sanity`);
  } catch (err) {
    const msg = `Failed to fetch providers from Sanity: ${err instanceof Error ? err.message : err}`;
    console.error(msg);
    errors.push(msg);

    // If Sanity fails entirely, we can't do anything useful
    if (providers.length === 0) {
      return NextResponse.json(
        { success: false, error: "No providers found", errors },
        { status: 500 }
      );
    }
  }

  // ── Step 2: Scrape each provider's website ───────────────────
  console.log("[Marketwatch] Scraping provider websites...");
  const providerUpdates: ExtractedProviderUpdate[] = [];

  // Process providers in batches of 5 to avoid overwhelming targets
  const BATCH_SIZE = 5;
  for (let i = 0; i < providers.length; i += BATCH_SIZE) {
    const batch = providers.slice(i, i + BATCH_SIZE);

    const batchResults = await Promise.allSettled(
      batch.map(async (provider) => {
        if (!provider.website) {
          return {
            providerSlug: provider.slug,
            providerName: provider.name,
            pricingChanges: [],
            policyChanges: [],
            newVerticals: [],
            newLeadTypes: [],
            notableChanges: ["No website URL configured"],
            rawPricingData: [],
          } as ExtractedProviderUpdate;
        }

        console.log(`[Scrape] ${provider.name}: ${provider.website}`);
        const scrapedContent = await scrapeProviderWebsite(provider.website);

        if (scrapedContent.startsWith("[")) {
          // Error occurred during scraping
          return {
            providerSlug: provider.slug,
            providerName: provider.name,
            pricingChanges: [],
            policyChanges: [],
            newVerticals: [],
            newLeadTypes: [],
            notableChanges: [scrapedContent],
            rawPricingData: [],
          } as ExtractedProviderUpdate;
        }

        console.log(
          `[Extract] ${provider.name}: analyzing ${scrapedContent.length} chars`
        );
        return extractProviderData(
          provider.slug,
          provider.name,
          scrapedContent,
          {
            pricingModel: provider.pricingModel || "unknown",
            leadTypes: provider.leadTypes || [],
            verticals: provider.verticals || [],
            returnPolicy: provider.returnPolicy || "Unknown",
          }
        );
      })
    );

    for (let j = 0; j < batchResults.length; j++) {
      const result = batchResults[j];
      const provider = batch[j];
      if (result.status === "fulfilled") {
        providerUpdates.push(result.value);
        const changes =
          result.value.pricingChanges.length +
          result.value.policyChanges.length;
        if (changes > 0) {
          console.log(`[Extract] ${provider.name}: ${changes} changes found`);
        }
      } else {
        const msg = `Failed to process ${provider.name}: ${result.reason}`;
        console.error(msg);
        errors.push(msg);
      }
    }
  }

  // ── Step 3: Generate updated benchmark estimates ─────────────
  console.log("[Marketwatch] Generating benchmark estimates...");
  let existingBenchmarks: Awaited<ReturnType<typeof getExistingBenchmarks>> =
    [];
  try {
    existingBenchmarks = await getExistingBenchmarks();
  } catch (err) {
    console.warn("Could not fetch existing benchmarks:", err);
  }

  let newBenchmarks: Awaited<ReturnType<typeof generateBenchmarkEstimates>> =
    [];
  try {
    newBenchmarks = await generateBenchmarkEstimates(
      providerUpdates,
      existingBenchmarks
    );
    console.log(
      `[Marketwatch] Generated ${newBenchmarks.length} benchmark estimates`
    );
  } catch (err) {
    const msg = `Benchmark generation failed: ${err instanceof Error ? err.message : err}`;
    console.error(msg);
    errors.push(msg);
  }

  // ── Step 4: Publish benchmarks to Sanity ─────────────────────
  let benchmarksPublished = 0;
  if (newBenchmarks.length > 0) {
    try {
      benchmarksPublished = await upsertPriceBenchmarks(
        newBenchmarks,
        month
      );
      console.log(
        `[Publish] Published ${benchmarksPublished} benchmarks to Sanity`
      );
    } catch (err) {
      const msg = `Failed to publish benchmarks: ${err instanceof Error ? err.message : err}`;
      console.error(msg);
      errors.push(msg);
    }
  }

  // ── Step 5: Flag stale providers ─────────────────────────────
  let staleProviders: string[] = [];
  try {
    staleProviders = await findStaleProviders(30);
    if (staleProviders.length > 0) {
      console.log(
        `[Stale] ${staleProviders.length} providers need re-verification`
      );
    }
  } catch (err) {
    console.warn("Could not check stale providers:", err);
  }

  // ── Step 6: Build the report ─────────────────────────────────
  const report = buildMarketwatchReport(
    providerUpdates,
    newBenchmarks,
    staleProviders,
    errors
  );

  // ── Step 7: Commit report to GitHub ──────────────────────────
  try {
    const reportPath = `data/marketwatch-reports/${month}.json`;
    await commitFilesToGitHub(
      [
        {
          path: reportPath,
          content: JSON.stringify(report, null, 2),
        },
      ],
      `chore(marketwatch): monthly research — ${month}\n\nScanned ${report.providersScanned} providers, ${report.providersWithChanges} with changes.\nGenerated ${report.newBenchmarksGenerated} benchmark estimates.`
    );
    console.log("[Git] Committed marketwatch report");
  } catch (err) {
    const msg = `GitHub commit failed: ${err instanceof Error ? err.message : err}`;
    console.error(msg);
    errors.push(msg);
  }

  // ── Step 8: Send email summary ───────────────────────────────
  try {
    await sendMarketwatchEmail(report, REPORT_EMAIL);
    console.log(`[Email] Report sent to ${REPORT_EMAIL}`);
  } catch (err) {
    const msg = `Email send failed: ${err instanceof Error ? err.message : err}`;
    console.error(msg);
    errors.push(msg);
  }

  const duration = Date.now() - startTime;
  console.log(
    `[Marketwatch] Completed in ${(duration / 1000).toFixed(1)}s — ${report.providersScanned} scanned, ${benchmarksPublished} benchmarks published, ${errors.length} errors`
  );

  return NextResponse.json({
    success: errors.length === 0,
    duration,
    month,
    providersScanned: report.providersScanned,
    providersWithChanges: report.providersWithChanges,
    benchmarksPublished,
    staleProviders: staleProviders.length,
    errors,
  });
}

// ── Email Helper ──────────────────────────────────────────────

async function sendMarketwatchEmail(
  report: ReturnType<typeof buildMarketwatchReport>,
  recipientEmail: string
) {
  const apiKey = process.env.RESEND_API_KEY;
  const fromEmail =
    process.env.RESEND_FROM_EMAIL || "noreply@agedleadsales.com";

  if (!apiKey) {
    console.warn("RESEND_API_KEY not set — skipping email");
    return;
  }

  const resend = new Resend(apiKey);

  const changedProviders = report.providerUpdates.filter(
    (u) =>
      u.pricingChanges.length > 0 ||
      u.policyChanges.length > 0
  );

  const changesHtml = changedProviders.length > 0
    ? changedProviders
        .map(
          (u) => `
      <div style="margin-bottom: 16px; padding: 12px; background: #f9fafb; border-radius: 8px;">
        <strong>${u.providerName}</strong>
        ${u.pricingChanges.length > 0 ? `<br>Pricing: ${u.pricingChanges.join("; ")}` : ""}
        ${u.policyChanges.length > 0 ? `<br>Policy: ${u.policyChanges.join("; ")}` : ""}
      </div>`
        )
        .join("")
    : "<p>No significant changes detected this month.</p>";

  const staleHtml =
    report.staleProviders.length > 0
      ? `<ul>${report.staleProviders.map((s) => `<li>${s}</li>`).join("")}</ul>`
      : "<p>All providers verified within 30 days.</p>";

  const errorsHtml =
    report.errors.length > 0
      ? `<div style="background: #fef2f2; border: 1px solid #fecaca; border-radius: 8px; padding: 16px; margin-top: 16px;">
          <h3 style="color: #dc2626; margin-top: 0;">Errors</h3>
          <ul>${report.errors.map((e) => `<li>${e}</li>`).join("")}</ul>
        </div>`
      : "";

  const html = `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; color: #1f2937; max-width: 800px; margin: 0 auto; padding: 20px;">
  <div style="background: linear-gradient(135deg, #1e40af, #3b82f6); color: white; padding: 24px 32px; border-radius: 12px; margin-bottom: 24px;">
    <h1 style="margin: 0 0 4px 0; font-size: 24px;">Lead Marketwatch Report</h1>
    <p style="margin: 0; opacity: 0.9;">${report.month} Monthly Research</p>
    <p style="margin: 8px 0 0 0; opacity: 0.7; font-size: 14px;">Run: ${report.runDate}</p>
  </div>

  <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; margin-bottom: 24px;">
    <div style="background: #f0fdf4; border-radius: 8px; padding: 16px; text-align: center;">
      <div style="font-size: 28px; font-weight: bold; color: #166534;">${report.providersScanned}</div>
      <div style="font-size: 12px; color: #6b7280;">Providers Scanned</div>
    </div>
    <div style="background: #eff6ff; border-radius: 8px; padding: 16px; text-align: center;">
      <div style="font-size: 28px; font-weight: bold; color: #1e40af;">${report.providersWithChanges}</div>
      <div style="font-size: 12px; color: #6b7280;">With Changes</div>
    </div>
    <div style="background: #fefce8; border-radius: 8px; padding: 16px; text-align: center;">
      <div style="font-size: 28px; font-weight: bold; color: #92400e;">${report.newBenchmarksGenerated}</div>
      <div style="font-size: 12px; color: #6b7280;">Benchmarks Updated</div>
    </div>
    <div style="background: ${report.staleProviders.length > 0 ? "#fef2f2" : "#f0fdf4"}; border-radius: 8px; padding: 16px; text-align: center;">
      <div style="font-size: 28px; font-weight: bold; color: ${report.staleProviders.length > 0 ? "#dc2626" : "#166534"};">${report.staleProviders.length}</div>
      <div style="font-size: 12px; color: #6b7280;">Stale Profiles</div>
    </div>
  </div>

  <h2 style="font-size: 18px; border-bottom: 2px solid #e5e7eb; padding-bottom: 8px;">Provider Changes</h2>
  ${changesHtml}

  <h2 style="font-size: 18px; border-bottom: 2px solid #e5e7eb; padding-bottom: 8px;">Stale Profiles (Need Re-verification)</h2>
  ${staleHtml}

  ${errorsHtml}

  <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 32px 0 16px;">
  <p style="color: #9ca3af; font-size: 12px;">Generated by the Aged Lead Sales Marketwatch cron. <a href="https://agedleadsales.com/providers">View live directory</a></p>
</body>
</html>`;

  await resend.emails.send({
    from: fromEmail,
    to: recipientEmail,
    subject: `Lead Marketwatch Report — ${report.month}`,
    html,
  });
}
