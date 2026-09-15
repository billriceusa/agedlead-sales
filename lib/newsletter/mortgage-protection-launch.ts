import { rebrandNoticeHtml } from "@/lib/rebrand-notice";
import { senderAddressHtml } from "@/lib/sender";
import { landingPageUrl } from "./store-links";

/**
 * Mortgage protection launch — an announcement and a reminder.
 *
 * WHY (2026-09-15)
 *
 * Aged Lead Store added mortgage protection leads. Troy asked for an
 * announcement to life insurance agents specifically, to move the new
 * inventory quickly. Bill asked for it linked to the product's landing page
 * with affiliate UTMs, plus a reminder the same week.
 *
 * WHO RECEIVES IT
 *
 * People who asked the store about Life Insurance or Final Expense leads —
 * 2,951 mailable on 2026-09-15. Mortgage protection is sold by the same agents,
 * on the same conversation, so this is the one group for whom the announcement
 * is news rather than noise. Built as a Resend segment by
 * scripts/mp-launch-segment.ts; unsubscribe is per contact, so opting out here
 * opts out everywhere.
 *
 * WHEN
 *
 * Wednesday 2026-09-23 and Friday 2026-09-25, 13:00 UTC. Scheduled in Resend
 * before Bill travels. Not Tuesday: the weekly newsletter owns that morning.
 *
 * DELIBERATELY ABSENT — each of these is a rule, not a style choice
 *
 * - **No prices.** Partner pricing moves, and `lib/newsletter/issue-gate.ts`
 *   blocks a send that quotes one. The landing page shows the live price.
 * - **No homeowner-verification claim.** Troy described the store's check in
 *   email, but the newest band may not be checked yet, and Bill chose to leave
 *   the claim out of the announcement entirely rather than word it loosely.
 * - **No urgency device.** No "limited", no deadline. Troy wants inventory to
 *   move; inventing scarcity on stock we do not control is how a list stops
 *   trusting the sender.
 * - **No first-person buying claim.** Bill is not a current lead buyer.
 * - **No narrating the send itself.** The reminder stands on its own and never
 *   refers to "Wednesday's email" — readers are not shown the sequence.
 *
 * EVERY STORE LINK is the landing page, never the storefront app, because this
 * is a product launch and the landing page is where the product is explained.
 */

export const MP_LAUNCH_CAMPAIGN = "mortgage-protection-launch";

export interface LaunchEmail {
  /** Send label, YYYY-MM-DD. Rides in every utm_content. */
  label: string;
  /** Stable key for the placement tags and the broadcast name. */
  key: "announce" | "reminder";
  subject: string;
  previewText: string;
  headline: string;
  subhead: string;
  body: string[];
  cta: string;
}

export const MP_ANNOUNCEMENT: LaunchEmail = {
  label: "2026-09-23",
  key: "announce",
  subject: "Mortgage protection leads are now in stock",
  previewText: "Homeowners who asked about protecting their mortgage payment.",
  headline: "Mortgage protection leads, now in stock",
  subhead: "For agents already selling term and final expense.",
  body: [
    "Aged Lead Store now carries mortgage protection leads. These are homeowners with a recent mortgage who asked about covering the payment if something happened to them.",
    "If you sell term or final expense, you already know this conversation. It is the same need with a clearer reason attached: a specific monthly payment the family would have to keep making. That makes the policy easier to size and easier to explain.",
    "They come in three age bands: 3 to 30 days, 31 to 85 days, and 86 to 365 days.",
    "One thing makes them work. Open as yourself, by name and company. Many homeowners get mortgage protection mail designed to look like it came from their lender, and anything that sounds like more of it ends the call fast.",
  ],
  cta: "See the mortgage protection leads",
};

export const MP_REMINDER: LaunchEmail = {
  label: "2026-09-25",
  key: "reminder",
  subject: "A new lead type for term and final expense agents",
  previewText: "Mortgage protection leads, now at Aged Lead Store.",
  headline: "Mortgage protection leads are in stock",
  subhead: "Three age bands, from 3 days to a year.",
  body: [
    "Aged Lead Store now stocks mortgage protection leads: homeowners with a recent mortgage who asked about covering the payment.",
    "If you sell term or final expense, it is a conversation you already know how to have, with the monthly number built in.",
  ],
  cta: "See the mortgage protection leads",
};

export const MP_LAUNCH_EMAILS: LaunchEmail[] = [MP_ANNOUNCEMENT, MP_REMINDER];

function button(href: string, text: string): string {
  return `<table role="presentation" cellpadding="0" cellspacing="0" style="margin: 8px 0 24px 0;">
                <tr>
                  <td style="border-radius: 8px; background-color: #2563eb;">
                    <a href="${href}" style="display: inline-block; padding: 14px 24px; color: #ffffff; text-decoration: none; font-size: 16px; font-weight: 700; border-radius: 8px;">${text} &rarr;</a>
                  </td>
                </tr>
              </table>`;
}

/**
 * @param email   Which email, from MP_LAUNCH_EMAILS.
 * @param siteUrl Absolute site origin from lib/site-url.ts. Never hardcode.
 */
export function buildLaunchHtml(email: LaunchEmail, siteUrl: string): string {
  const link = (placement: string) =>
    landingPageUrl("mortgage-protection", email.label, `${email.key}-${placement}`, MP_LAUNCH_CAMPAIGN);

  const paragraphs = email.body
    .map(
      (text) =>
        `<p style="margin: 0 0 16px 0; color: #374151; font-size: 16px; line-height: 1.7;">${text}</p>`,
    )
    .join("\n              ");

  return `<!DOCTYPE html>
<html lang="en">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>${email.subject}</title></head>
<body style="margin: 0; padding: 0; background-color: #f3f4f6; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif;">
  <div style="display: none; max-height: 0; overflow: hidden; opacity: 0;">${email.previewText}</div>
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color: #f3f4f6;">
    <tr>
      <td align="center" style="padding: 24px 16px;">
        <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 12px; overflow: hidden;">

          <tr>
            <td style="background: linear-gradient(135deg, #1e3a5f 0%, #2563eb 100%); padding: 28px 32px;">
              <h1 style="margin: 0; color: #ffffff; font-size: 22px; font-weight: 800;">${email.headline}</h1>
              <p style="margin: 6px 0 0 0; color: rgba(255,255,255,0.85); font-size: 14px;">${email.subhead}</p>
            </td>
          </tr>

          <tr>
            <td style="padding: 32px 32px 8px;">
              ${button(link("top-cta"), email.cta)}
              ${paragraphs}
              ${button(link("bottom-cta"), email.cta)}
              <p style="margin: 0 0 20px 0; color: #9ca3af; font-size: 13px; line-height: 1.6;">Affiliate links — we may earn a commission at no cost to you.</p>
              <p style="margin: 0 0 4px 0; color: #111827; font-weight: 600; font-size: 16px;">— Bill Rice</p>
            </td>
          </tr>

          <tr>
            <td style="background-color: #f9fafb; padding: 24px 32px; border-top: 1px solid #e5e7eb; text-align: center;">
              <p style="margin: 0 0 8px 0; color: #6b7280; font-size: 13px;">
                <a href="${siteUrl}" style="color: #1e40af; text-decoration: none; font-weight: 600;">Work Aged Leads</a> &nbsp;|&nbsp;
                <a href="${siteUrl}/playbook" style="color: #6b7280; text-decoration: none;">Playbook</a> &nbsp;|&nbsp;
                <a href="${siteUrl}/calculators" style="color: #6b7280; text-decoration: none;">Calculators</a>
              </p>
              <p style="margin: 0 0 8px 0; color: #9ca3af; font-size: 12px;">
                You're receiving Aged Leads Insights — practical coaching on working aged leads — published by Bill Rice. Links to Aged Lead Store are affiliate links.
              </p>
              ${senderAddressHtml()}
              ${rebrandNoticeHtml()}
              <p style="margin: 0; color: #9ca3af; font-size: 12px;">
                <a href="{{{RESEND_UNSUBSCRIBE_URL}}}" style="color: #9ca3af; text-decoration: underline;">Unsubscribe</a>
              </p>
              <p style="margin: 12px 0 0 0; color: #d1d5db; font-size: 11px;">${email.label}</p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}
