import type { CronName } from "./heartbeat";

/**
 * Which crons the health check watches, and how long a silence is allowed.
 *
 * Lives here rather than in the health-check route so it can be tested. The
 * drift this file guards against is specific and had happened three times over:
 * a cron gets scheduled in vercel.json, writes heartbeats nobody reads, and its
 * silence is therefore indistinguishable from a quiet week. `monitored.test.ts`
 * reconciles this list against vercel.json so the next one cannot slip through.
 *
 * Only crons still SCHEDULED in vercel.json belong here. weekly-content,
 * seo-audit, and daily-performance were decommissioned 2026-07-02 (superseded
 * by the consolidated BRSG Portfolio Performance Report in
 * billricestrategy.com) — their routes remain but are unscheduled, so a
 * staleness check on them would alert forever.
 */
export const MONITORED_CRONS = [
  "marketwatch",
  // Replaced the Sunday `als-email-report` on 2026-09-09 (Bill). That route
  // still exists for manual runs but is unscheduled, so it must NOT be watched
  // — a staleness check on an unscheduled cron alerts forever.
  "als-daily-report",
  "gsc-trend",
  "als-lifecycle",
  "commission-report",
  "weekly-newsletter",
  "send-newsletter",
  "restock-offer-draft",
  "restock-offer-send",
] as const satisfies readonly CronName[];

export type MonitoredCron = (typeof MONITORED_CRONS)[number];

export type StalenessRule = {
  maxDays: number;
  label: string;
  /**
   * ISO date before which a MISSING heartbeat is not an alert.
   *
   * Adding a weekly cron to this list otherwise alerts every day until its next
   * scheduled slot — five days of false alarms for send-newsletter, whose first
   * Tuesday after being added was 2026-09-08. Alerts that cry wolf get filtered,
   * and then the real one is missed too. A missing heartbeat AFTER this date is
   * a genuine failure and alerts normally.
   */
  firstExpectedAt?: string;
};

export const CRON_STALENESS: Record<MonitoredCron, StalenessRule> = {
  "marketwatch": { maxDays: 35, label: "Marketwatch cron" },
  // Runs daily at 12:30 UTC, after the 10:50 lifecycle run. This is now the
  // only report that says whether the email program sent anything, so its own
  // silence is the failure it exists to catch — 2 days, like the other dailies.
  "als-daily-report": { maxDays: 2, label: "Daily email report cron", firstExpectedAt: "2026-09-10" },
  // Runs daily; a 2-day gap means it stalled. This is the tripwire that would
  // have caught the 2026-06 Vercel WIF break (froze gsc-trend 4 days, silent).
  "gsc-trend": { maxDays: 2, label: "GSC trend snapshot cron" },
  // Runs daily and is the only cron that mails the buyer list. A stalled run is
  // invisible from the outside — no bounce, no error, just no revenue — which
  // is how the replenishment track sat starved through August.
  "als-lifecycle": { maxDays: 2, label: "ALS lifecycle cron" },
  // Runs daily at 10:00 UTC. It wrote heartbeats from the day it shipped and
  // nothing read them. This is the cron whose silence is hardest to notice: it
  // reports revenue, so a stalled run means no morning email — which looks
  // exactly like a quiet sales day, the thing the report exists to tell apart.
  // It already fails loudly on a GA4 403 rather than mailing a false $0.00;
  // this closes the other half, where it stops running at all.
  "commission-report": { maxDays: 2, label: "Commission report cron" },
  // Sunday 14:00 UTC — drafts the issue and mails Bill the preview carrying the
  // STOP link. If this stalls there is no preview to notice missing, and the
  // Tuesday sender then finds no archive and correctly does nothing. The whole
  // week goes quiet with every component behaving exactly as designed.
  "weekly-newsletter": { maxDays: 8, label: "Newsletter draft cron (Sunday)" },
  // Tuesday 13:00 UTC — the send half of the opt-out window. 8 days rather than
  // 2: it runs weekly, and a skipped Tuesday with no archived issue is a
  // legitimate `ok`, so staleness is the only signal that it stopped firing.
  "send-newsletter": {
    maxDays: 8,
    label: "Newsletter send cron (Tuesday)",
    firstExpectedAt: "2026-09-09",
  },
  // Both restock crons fire WEEKLY and no-op on the weeks that are not theirs,
  // so a heartbeat is expected every week even though the offer mails monthly.
  // That is the whole reason they are watchable: if the beat were monthly, an
  // 8-day window could not tell a stalled cron from a normal off-week.
  "restock-offer-draft": {
    maxDays: 8,
    label: "Restock offer draft cron (Sunday)",
    firstExpectedAt: "2026-10-05",
  },
  // The send half. Its silence is the expensive one — the draft would still
  // archive an offer and mail Bill a preview announcing a Thursday send that
  // then never happens, which looks like everything working.
  "restock-offer-send": {
    maxDays: 8,
    label: "Restock offer send cron (Thursday)",
    firstExpectedAt: "2026-10-09",
  },
};
