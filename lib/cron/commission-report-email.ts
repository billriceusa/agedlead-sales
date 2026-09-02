import type { StoreRevenueReport } from "@/lib/reports/store-revenue";

/**
 * The daily commission email.
 *
 * WHAT IT IS FOR
 *
 * Until 2026-09-02 the only way to know what the affiliate relationship earned
 * was to ask someone to query GA4 by hand. This puts the one number that
 * matters — commission so far this month — in front of Bill every morning,
 * with enough context to know whether to act.
 *
 * DESIGN RULES IT FOLLOWS
 *
 * - **Quote `commissionLikely`, never the ceiling.** GA4 attributed revenue is
 *   a ceiling; the books realise about 80% of the nominal 20%. Leading with the
 *   ceiling would overstate earnings every single morning.
 * - **A quiet day is stated, not dressed up.** Zero is a real answer and the
 *   email says zero. GA4 also lags 24-48h, so an empty yesterday early in the
 *   month is usually latency rather than a collapse — the email says which.
 * - **Pace, not just total.** "$400 of $2,000" means very different things on
 *   the 3rd and the 27th, so every percentage is shown against how much of the
 *   month has actually elapsed.
 * - **Placement is the actionable unit.** The 2026-09-02 finding was that
 *   revenue tracks WHERE a click came from, not how many there were — $95/session
 *   from a header link against $1.10 from a banner. So the breakdown leads on
 *   revenue-per-session rather than volume.
 */

function usd(n: number): string {
  return `$${n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

function usd0(n: number): string {
  return `$${Math.round(n).toLocaleString("en-US")}`;
}

const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

function monthLabel(yearMonth: string): string {
  const y = yearMonth.slice(0, 4);
  const m = Number(yearMonth.slice(4, 6));
  return `${MONTH_NAMES[m - 1] ?? yearMonth} ${y}`;
}

export function commissionReportSubject(r: StoreRevenueReport): string {
  const mtd = usd0(r.mtd.commissionLikely);
  const pace = r.goal.onPace ? "on pace" : "behind pace";
  return `Affiliate commission — ${mtd} MTD, ${r.goal.pctOfGoal}% of ${usd0(r.goal.target)} (${pace})`;
}

export function buildCommissionReportEmail(r: StoreRevenueReport): string {
  const elapsedPct = Math.round(r.goal.monthElapsed * 100);
  const paceColor = r.goal.onPace ? "#166534" : "#b45309";
  const paceBg = r.goal.onPace ? "#f0fdf4" : "#fffbeb";
  const paceBorder = r.goal.onPace ? "#86efac" : "#fcd34d";

  const quietYesterday = r.yesterday.sessions === 0;

  const placements = r.byPlacement
    .filter((p) => p.sessions > 0)
    .slice(0, 8)
    .map(
      (p) => `
        <tr>
          <td style="padding:8px 10px;border-top:1px solid #e5e7eb;font-size:13px;color:#111827;">${p.key || "(untagged)"}</td>
          <td style="padding:8px 10px;border-top:1px solid #e5e7eb;font-size:13px;color:#374151;text-align:right;">${p.sessions}</td>
          <td style="padding:8px 10px;border-top:1px solid #e5e7eb;font-size:13px;color:#374151;text-align:right;">${usd(p.revenue)}</td>
          <td style="padding:8px 10px;border-top:1px solid #e5e7eb;font-size:13px;font-weight:700;color:#111827;text-align:right;">${usd(p.revenuePerSession)}</td>
        </tr>`,
    )
    .join("");

  const months = r.monthly
    .slice(-7)
    .map((m) => {
      const isCurrent = m.key === r.window.start.slice(0, 7).replace("-", "");
      return `
        <tr${isCurrent ? ' style="background:#eff6ff;"' : ""}>
          <td style="padding:7px 10px;border-top:1px solid #e5e7eb;font-size:13px;color:#111827;">${monthLabel(m.key)}${isCurrent ? " <span style=\"color:#2563eb;font-size:11px;\">so far</span>" : ""}</td>
          <td style="padding:7px 10px;border-top:1px solid #e5e7eb;font-size:13px;color:#374151;text-align:right;">${m.sessions}</td>
          <td style="padding:7px 10px;border-top:1px solid #e5e7eb;font-size:13px;color:#374151;text-align:right;">${usd(m.revenue)}</td>
          <td style="padding:7px 10px;border-top:1px solid #e5e7eb;font-size:13px;font-weight:700;color:#111827;text-align:right;">${usd(m.commissionLikely)}</td>
        </tr>`;
    })
    .join("");

  return `<!DOCTYPE html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Affiliate commission</title></head>
<body style="margin:0;padding:0;background:#f3f4f6;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Arial,sans-serif;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f3f4f6;">
<tr><td align="center" style="padding:24px 16px;">
<table role="presentation" width="640" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:12px;overflow:hidden;max-width:640px;">

  <tr><td style="background:linear-gradient(135deg,#1e3a5f 0%,#2563eb 100%);padding:24px 28px;">
    <p style="margin:0;color:rgba(255,255,255,0.8);font-size:12px;font-weight:700;letter-spacing:1.2px;text-transform:uppercase;">Affiliate commission &middot; ${r.window.start} to ${r.window.end}</p>
    <h1 style="margin:8px 0 0;color:#ffffff;font-size:34px;font-weight:800;">${usd(r.mtd.commissionLikely)}</h1>
    <p style="margin:4px 0 0;color:rgba(255,255,255,0.85);font-size:14px;">month to date &middot; ${usd(r.mtd.attributedRevenue)} in attributed store revenue</p>
  </td></tr>

  <tr><td style="padding:20px 28px 0;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${paceBg};border:1px solid ${paceBorder};border-radius:8px;">
      <tr><td style="padding:14px 16px;">
        <p style="margin:0;font-size:15px;font-weight:700;color:${paceColor};">
          ${r.goal.pctOfGoal}% of the ${usd0(r.goal.target)} goal, with ${elapsedPct}% of the month gone &mdash; ${r.goal.onPace ? "on pace" : "behind pace"}
        </p>
        ${
          r.goal.revenueStillNeeded > 0
            ? `<p style="margin:6px 0 0;font-size:13px;color:#4b5563;">Needs a further <strong>${usd0(r.goal.revenueStillNeeded)}</strong> of store revenue to clear it.</p>`
            : `<p style="margin:6px 0 0;font-size:13px;color:#4b5563;">Goal cleared.</p>`
        }
      </td></tr>
    </table>
  </td></tr>

  <tr><td style="padding:20px 28px 0;">
    <h2 style="margin:0 0 10px;font-size:13px;font-weight:700;letter-spacing:0.6px;text-transform:uppercase;color:#6b7280;">Yesterday</h2>
    ${
      quietYesterday
        ? `<p style="margin:0;font-size:14px;line-height:1.6;color:#4b5563;">No attributed sessions. GA4 lags 24&ndash;48 hours, so a quiet yesterday is usually latency rather than a real zero &mdash; judge it on the month-to-date line above, not on one day.</p>`
        : `<p style="margin:0;font-size:14px;line-height:1.6;color:#4b5563;">
             <strong>${r.yesterday.sessions}</strong> session${r.yesterday.sessions === 1 ? "" : "s"} &middot;
             <strong>${r.yesterday.transactions}</strong> order${r.yesterday.transactions === 1 ? "" : "s"} &middot;
             <strong>${usd(r.yesterday.attributedRevenue)}</strong> revenue &middot;
             <strong>${usd(r.yesterday.commissionLikely)}</strong> commission</p>`
    }
  </td></tr>

  ${
    placements
      ? `<tr><td style="padding:22px 28px 0;">
    <h2 style="margin:0 0 4px;font-size:13px;font-weight:700;letter-spacing:0.6px;text-transform:uppercase;color:#6b7280;">Where it came from</h2>
    <p style="margin:0 0 10px;font-size:12px;color:#9ca3af;">Sorted by revenue. The right-hand column is what matters &mdash; a header link has historically earned ~$95 a session against ~$1 for a banner.</p>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #e5e7eb;border-radius:8px;border-collapse:separate;border-spacing:0;overflow:hidden;">
      <tr style="background:#f9fafb;">
        <td style="padding:8px 10px;font-size:11px;font-weight:700;color:#6b7280;text-transform:uppercase;">Placement</td>
        <td style="padding:8px 10px;font-size:11px;font-weight:700;color:#6b7280;text-transform:uppercase;text-align:right;">Sess.</td>
        <td style="padding:8px 10px;font-size:11px;font-weight:700;color:#6b7280;text-transform:uppercase;text-align:right;">Revenue</td>
        <td style="padding:8px 10px;font-size:11px;font-weight:700;color:#6b7280;text-transform:uppercase;text-align:right;">Per sess.</td>
      </tr>
      ${placements}
    </table>
  </td></tr>`
      : `<tr><td style="padding:22px 28px 0;">
    <h2 style="margin:0 0 4px;font-size:13px;font-weight:700;letter-spacing:0.6px;text-transform:uppercase;color:#6b7280;">Where it came from</h2>
    <p style="margin:0;font-size:14px;line-height:1.6;color:#4b5563;">No tagged sessions yet this month.</p>
  </td></tr>`
  }

  <tr><td style="padding:22px 28px 0;">
    <h2 style="margin:0 0 10px;font-size:13px;font-weight:700;letter-spacing:0.6px;text-transform:uppercase;color:#6b7280;">Recent months</h2>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #e5e7eb;border-radius:8px;border-collapse:separate;border-spacing:0;overflow:hidden;">
      <tr style="background:#f9fafb;">
        <td style="padding:8px 10px;font-size:11px;font-weight:700;color:#6b7280;text-transform:uppercase;">Month</td>
        <td style="padding:8px 10px;font-size:11px;font-weight:700;color:#6b7280;text-transform:uppercase;text-align:right;">Sess.</td>
        <td style="padding:8px 10px;font-size:11px;font-weight:700;color:#6b7280;text-transform:uppercase;text-align:right;">Revenue</td>
        <td style="padding:8px 10px;font-size:11px;font-weight:700;color:#6b7280;text-transform:uppercase;text-align:right;">Commission</td>
      </tr>
      ${months}
    </table>
  </td></tr>

  <tr><td style="padding:22px 28px 26px;">
    <p style="margin:0;font-size:12px;line-height:1.7;color:#9ca3af;">
      Commission is estimated at ${Math.round(0.2 * 100)}% of attributed store revenue, discounted to the ~80% realisation the books actually showed in March 2026 &mdash; that model reproduced March to within 0.4%. It is an estimate, not a statement; the books are the record.
      <br><br>
      Source: GA4 property ${r.propertyId} (Aged Lead Store), sessions attributed to ${r.sources.join(", ")}. Generated ${r.generatedAt}.
    </p>
  </td></tr>

</table>
</td></tr></table>
</body></html>`;
}
