import { NextResponse } from "next/server";
import { fetchStoreRevenue, REV_SHARE, REALISATION } from "@/lib/reports/store-revenue";

/**
 * The commission scoreboard as JSON, on demand.
 *
 * A thin wrapper now. The query and the arithmetic live in
 * `lib/reports/store-revenue.ts`, shared with the daily commission email, so
 * the two cannot drift — two copies of a revenue calculation eventually
 * disagree, and the first anyone notices is a report and an endpoint quoting
 * different totals for the same month.
 *
 * Reads GA4 `357329146` (the STORE property, Kaleidico account) rather than
 * `528489903` (this site, BRSG account). Site-side clicks are a poor proxy for
 * money: in July `header-nav` took 96 sessions to $9,132.60 while `cta-banner`
 * took 91 — the same click volume — to $100.50.
 *
 * Requires the WIF service account to hold Viewer in the Kaleidico Analytics
 * account, granted 2026-09-02. A 403 here is an access fact, never "no data".
 */

export const dynamic = "force-dynamic";
export const maxDuration = 60;

export async function GET(request: Request) {
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const url = new URL(request.url);

  try {
    const report = await fetchStoreRevenue({
      start: url.searchParams.get("start") ?? undefined,
      end: url.searchParams.get("end") ?? undefined,
      goal: Number(url.searchParams.get("goal") ?? 2000),
    });

    return NextResponse.json({
      scoreboard: "store-side attributed revenue — the basis commission is paid on",
      ...report,
      commissionNote:
        `commissionCeiling = ${REV_SHARE * 100}% of GA4 attributed revenue. commissionLikely applies the ` +
        `~${REALISATION * 100}% realisation observed in March 2026 ($2,918 booked against $18,303.25 ` +
        `attributed); that model reproduces March to within 0.4%. Quote commissionLikely, never the ceiling.`,
    });
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    const forbidden = msg.includes("403");
    return NextResponse.json(
      {
        error: msg,
        hint: forbidden
          ? "403 means the WIF service account lost Viewer on the Kaleidico property. That is an access fact, not an absence of data."
          : undefined,
      },
      { status: forbidden ? 403 : 500 },
    );
  }
}
