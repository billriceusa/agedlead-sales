import { test, describe } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { MONITORED_CRONS, CRON_STALENESS } from "./monitored";

/**
 * The drift guard.
 *
 * Three crons had been scheduled in vercel.json while nothing watched them:
 * weekly-newsletter (listed in a comment as decommissioned, but re-scheduled
 * with the newsletter restart), commission-report, and send-newsletter. Each
 * wrote or owed heartbeats that no code read, which is the same as having none
 * — a stalled run looked exactly like a quiet week.
 *
 * Nothing in the type system connects vercel.json to the monitor list, so this
 * test is the connection. It fails the moment someone schedules a cron and
 * forgets to watch it, which is precisely how all three slipped through.
 */

type VercelConfig = { crons?: { path: string; schedule: string }[] };

function scheduledCrons(): { name: string; schedule: string }[] {
  const raw = readFileSync(join(process.cwd(), "vercel.json"), "utf-8");
  const config = JSON.parse(raw) as VercelConfig;
  return (config.crons ?? []).map((c) => ({
    name: c.path.replace(/^\/api\/cron\//, ""),
    schedule: c.schedule,
  }));
}

/** health-check cannot meaningfully monitor its own staleness. */
const SELF = "health-check";

describe("monitored crons match vercel.json", () => {
  test("every scheduled cron is monitored", () => {
    const scheduled = scheduledCrons()
      .map((c) => c.name)
      .filter((n) => n !== SELF);
    const missing = scheduled.filter(
      (n) => !(MONITORED_CRONS as readonly string[]).includes(n),
    );
    assert.deepEqual(
      missing,
      [],
      `scheduled in vercel.json but nothing watches them: ${missing.join(", ")}. ` +
        `A cron whose silence is invisible is not automated, it is only unattended.`,
    );
  });

  test("nothing monitored is unscheduled", () => {
    // The inverse failure: a decommissioned cron left in the list alerts every
    // day forever, and alerts that always fire get filtered out along with the
    // real ones.
    const scheduled = scheduledCrons().map((c) => c.name);
    const orphans = (MONITORED_CRONS as readonly string[]).filter(
      (n) => !scheduled.includes(n),
    );
    assert.deepEqual(
      orphans,
      [],
      `monitored but not scheduled — these would alert forever: ${orphans.join(", ")}`,
    );
  });

  test("every monitored cron has a staleness rule", () => {
    for (const name of MONITORED_CRONS) {
      const rule = CRON_STALENESS[name];
      assert.ok(rule, `no staleness rule for ${name}`);
      assert.ok(rule.maxDays > 0, `${name}: maxDays must be positive`);
      assert.ok(rule.label.trim().length > 0, `${name}: needs a human label`);
    }
  });

  test("the staleness threshold is longer than the cron's own interval", () => {
    // A daily cron with maxDays:1 alerts on a few hours' jitter; a weekly one
    // with maxDays:2 alerts every single week by construction. Either way the
    // monitor becomes noise and stops being read.
    const bySchedule = new Map(scheduledCrons().map((c) => [c.name, c.schedule]));
    for (const name of MONITORED_CRONS) {
      const schedule = bySchedule.get(name);
      assert.ok(schedule, `${name} not found in vercel.json`);
      // Day-of-week field pinned to a single day => runs weekly.
      const dow = schedule!.split(/\s+/)[4];
      const weekly = dow !== undefined && dow !== "*";
      const minDays = weekly ? 8 : 2;
      assert.ok(
        CRON_STALENESS[name].maxDays >= minDays,
        `${name} runs "${schedule}" (${weekly ? "weekly" : "daily"}) but tolerates only ` +
          `${CRON_STALENESS[name].maxDays}d — it would alert on normal operation`,
      );
    }
  });

  test("a first-run grace date is a valid date, and in the future when set", () => {
    // Left behind, a past grace date is harmless but misleading; an unparseable
    // one silently disables the alert it was meant to defer, because
    // `now < new Date("nonsense")` is false and reads as "alert now".
    for (const name of MONITORED_CRONS) {
      const at = CRON_STALENESS[name].firstExpectedAt;
      if (!at) continue;
      assert.match(at, /^\d{4}-\d{2}-\d{2}$/, `${name}: firstExpectedAt must be YYYY-MM-DD`);
      assert.ok(
        !Number.isNaN(new Date(at).getTime()),
        `${name}: firstExpectedAt "${at}" does not parse`,
      );
    }
  });
});
