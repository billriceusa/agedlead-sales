import { Resend } from "resend";
import type { CourseModule, EmailContext, Vertical } from "./types";
import { FROM_EMAIL } from "./shared";
import { mortgageCourse } from "./mortgage";
import { insuranceCourse } from "./insurance";
import { homeServicesCourse } from "./home-services";

const COURSES: Record<Vertical, CourseModule> = {
  mortgage: mortgageCourse,
  insurance: insuranceCourse,
  "home-services": homeServicesCourse,
};

export function getCourse(vertical: Vertical): CourseModule {
  return COURSES[vertical];
}

export interface ScheduleResult {
  sentImmediately: number;
  scheduled: number;
  errors: string[];
}

/**
 * Schedules the full 5-email course for a new signup.
 * Day 0 email goes out immediately. Days 2/4/7/10 use Resend's scheduledAt.
 *
 * Note: Resend scheduled sends respect the unsubscribed flag at send time,
 * so an opt-out during the course will skip remaining deliveries for that audience
 * contact. Transactional sends (our case) follow the sender's suppression logic.
 */
export async function scheduleCourse(
  vertical: Vertical,
  ctx: EmailContext
): Promise<ScheduleResult> {
  const apiKey = process.env.RESEND_API_KEY;
  const fromEmail = process.env.RESEND_FROM_EMAIL || FROM_EMAIL;

  const result: ScheduleResult = {
    sentImmediately: 0,
    scheduled: 0,
    errors: [],
  };

  if (!apiKey) {
    result.errors.push("RESEND_API_KEY not set — skipping schedule");
    return result;
  }

  const resend = new Resend(apiKey);
  const course = getCourse(vertical);
  const now = Date.now();

  for (const email of course.emails) {
    try {
      const html = email.buildHtml(ctx);
      const text = email.buildText(ctx);

      const basePayload = {
        from: fromEmail,
        to: ctx.recipientEmail,
        subject: email.subject,
        html,
        text,
        headers: {
          "X-Course-Day": String(email.day),
          "X-Course-Vertical": vertical,
        },
      };

      if (email.day === 0) {
        await resend.emails.send(basePayload);
        result.sentImmediately += 1;
      } else {
        const scheduledAt = new Date(
          now + email.day * 24 * 60 * 60 * 1000
        ).toISOString();

        await resend.emails.send({
          ...basePayload,
          scheduledAt,
        });
        result.scheduled += 1;
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : "unknown";
      result.errors.push(`Day ${email.day}: ${msg}`);
    }
  }

  return result;
}
