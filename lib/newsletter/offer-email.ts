import { rebrandNoticeHtml } from "@/lib/rebrand-notice";
import { STORE_VERTICALS, storeUrl, catalogueUrl } from "./store-links";

/**
 * The direct offer send — one job, pull posture.
 *
 * WHY THIS IS NOT A NEWSLETTER
 *
 * The 2026-09-02 store-side reading (`data/loop/ledger.json`, scoreboardReadings)
 * found that attributed revenue does not track click volume at all. It tracks
 * POSTURE. Two placements in July carried nearly identical traffic and did not
 * remotely earn the same money:
 *
 *   howtoworkleads / website / header-nav   96 sessions   $9,132.60
 *   agedleadsales  / affiliate / cta-banner 91 sessions      $100.50
 *
 * The header link is *pulled* by a reader who has already decided to go buy and
 * is looking for the door. The banner is *pushed* at a reader who has not. The
 * newsletter is, structurally, the second kind: its job is to be read, and the
 * store links ride along beside the content.
 *
 * This email is the first kind. It carries no article, no tips and no
 * roundup — only the door and the nine verticals behind it. A reader who does
 * not want to buy leads today should be able to tell that from the subject
 * line and never open it. That is the design, not a shortcoming: an offer that
 * is easy to ignore is what keeps the newsletter worth opening.
 *
 * POSITIONING — THE READER'S PIPELINE, NOT BILL'S HABITS
 *
 * The first version of this email opened with "the question I get more than any
 * other is where I actually buy", and then "I buy from Aged Lead Store". Both
 * were invented. **Bill is not currently an active lead buyer** (confirmed
 * 2026-09-02, after that version had already mailed), so the email asserted a
 * first-person purchasing habit that does not exist. The repo's AI newsletter
 * prompt has forbidden fabricated first-person experience for months; this
 * template is hand-written and so inherited none of it — the same shape as the
 * price guard that lived on the draft path and not the send path.
 *
 * The correct frame is the reader's, not Bill's. The audience is salespeople
 * who are hungry for opportunities and need them at a budget they can sustain.
 * So the argument is: you can only convert what is in front of you, running dry
 * kills a quarter, and aged leads are affordable enough to buy CONSISTENTLY —
 * a steady restock you keep making, rather than one big order and nothing after
 * it. Affordability framed as sustainability, never as "cheap".
 *
 * Bill's authority here comes from 25+ years building lead programs and working
 * millions of leads. It does not come from being a current customer, and the
 * copy must never borrow that.
 *
 * DELIBERATELY ABSENT
 *
 * - **No first-person purchasing claims.** Enforced by test.
 * - **No paragraph-length affiliate confession.** Disclosure is required and
 *   stays — one short clause beside the links. The earlier draft gave it a
 *   whole paragraph, which made the arrangement the subject of the email
 *   instead of the reader's pipeline. Disclose and move on.
 * - **No prices.** Partner pricing is Troy's to publish and it moves;
 *   `lib/newsletter/issue-gate.ts` blocks a send that quotes one, and it exists
 *   because the 2026-08-10 issue quoted "$0.25" against a real $0.40 floor and
 *   was mailed before anyone noticed. The storefront shows the live price on
 *   landing, which is the only number that cannot go stale.
 * - **No urgency device.** No countdown, no "ends Friday", no invented scarcity
 *   on inventory we do not control.
 * - **No claim about anyone's results but the reader's own decision to look.**
 *
 * The affiliate relationship is stated in the body, above the buttons rather
 * than in small print under them — this list has been sold to before, and the
 * disclosure is worth more than the click it might cost.
 */

export interface OfferContent {
  subject: string;
  previewText: string;
}

/** Campaign name. Separate from `weekly-newsletter` so the offer's performance
 *  can be read on its own rather than averaged into the Tuesday trend. */
export const OFFER_CAMPAIGN = "direct-offer";

export const OFFER_CONTENT: OfferContent = {
  subject: "Don't go into Q4 with a thin pipeline",
  previewText: "Nine verticals, one link each. Restock what you're short on.",
};

/**
 * @param label   Send label, `YYYY-MM-DD`. Rides in every `utm_content`, so it
 *                must match the archive filename or the report cannot join them.
 * @param siteUrl Absolute site origin, from `lib/site-url.ts`. Never hardcode.
 */
export function buildOfferHtml(label: string, siteUrl: string): string {
  const host = siteUrl.replace(/^https?:\/\//, "");

  const verticalButtons = STORE_VERTICALS.map(
    (v) => `
                <tr>
                  <td style="padding: 0 0 10px 0;">
                    <a href="${storeUrl(label, `vertical-${v.key}`, v.segment, OFFER_CAMPAIGN)}"
                       style="display: block; padding: 14px 20px; background-color: #ffffff; border: 1px solid #d4d4d8; border-radius: 8px; color: #18181b; text-decoration: none; font-size: 16px; font-weight: 600;">
                      ${v.label} <span style="color: #2563eb; font-weight: 500;">&rarr;</span>
                    </a>
                  </td>
                </tr>`,
  ).join("");

  return `<!DOCTYPE html>
<html lang="en">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>${OFFER_CONTENT.subject}</title></head>
<body style="margin: 0; padding: 0; background-color: #f3f4f6; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif;">
  <div style="display: none; max-height: 0; overflow: hidden; opacity: 0;">${OFFER_CONTENT.previewText}</div>
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color: #f3f4f6;">
    <tr>
      <td align="center" style="padding: 24px 16px;">
        <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 12px; overflow: hidden;">

          <tr>
            <td style="background: linear-gradient(135deg, #1e3a5f 0%, #2563eb 100%); padding: 28px 32px;">
              <h1 style="margin: 0; color: #ffffff; font-size: 22px; font-weight: 800;">Go into Q4 with a full pipeline</h1>
              <p style="margin: 6px 0 0 0; color: rgba(255,255,255,0.85); font-size: 14px;">One email, one job. Back to the usual Tuesday next week.</p>
            </td>
          </tr>

          <tr>
            <td style="padding: 32px 32px 8px;">
              <p style="margin: 0 0 16px 0; color: #374151; font-size: 16px; line-height: 1.7;">Q4 is the last real selling window of the year, and the people who do well in it walk into October with a pipeline already built — not one they start building in November.</p>

              <p style="margin: 0 0 16px 0; color: #374151; font-size: 16px; line-height: 1.7;">The thing that quietly kills a quarter is running dry. You can only convert what is actually in front of you, and a month with nothing to call is a month that cannot produce, no matter how good you are on the phone.</p>

              <p style="margin: 0 0 24px 0; color: #374151; font-size: 16px; line-height: 1.7;">That is the case for aged leads. Not that they are cheap — that they are affordable enough to buy <em>consistently</em>. A steady monthly restock you can actually sustain beats one big order in January and nothing after it, because the ROI comes from always having opportunities in the pipeline rather than from any single batch.</p>

              <p style="margin: 0 0 20px 0; color: #111827; font-size: 16px; line-height: 1.7; font-weight: 600;">Pick your vertical and see what is in stock right now:</p>
            </td>
          </tr>

          <tr>
            <td style="padding: 0 32px;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                ${verticalButtons}
              </table>
            </td>
          </tr>

          <tr>
            <td style="padding: 20px 32px 8px;">
              <p style="margin: 0 0 20px 0; color: #6b7280; font-size: 14px; line-height: 1.6;">Not listed? <a href="${catalogueUrl(label, "catalogue", OFFER_CAMPAIGN)}" style="color: #2563eb; text-decoration: none; font-weight: 600;">Browse the full catalogue</a>. <span style="color: #9ca3af;">Affiliate links — we may earn a commission at no cost to you.</span></p>

              <p style="margin: 0 0 16px 0; color: #374151; font-size: 16px; line-height: 1.7;">Not sure what you can afford to pay per lead? The <a href="${siteUrl}/calculators/know-your-cpl?utm_source=newsletter&amp;utm_medium=email&amp;utm_campaign=${OFFER_CAMPAIGN}&amp;utm_content=${label}-calculator" style="color: #2563eb; text-decoration: none; font-weight: 600;">cost-per-lead calculator</a> works it out from your own close rate and commission, so you can size a monthly buy you will still be making in March.</p>

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
                You're receiving this because you signed up at ${host}. Links to Aged Lead Store are affiliate links.
              </p>
              ${rebrandNoticeHtml()}
              <p style="margin: 0; color: #9ca3af; font-size: 12px;">
                <a href="{{{RESEND_UNSUBSCRIBE_URL}}}" style="color: #9ca3af; text-decoration: underline;">Unsubscribe</a>
              </p>
              <p style="margin: 12px 0 0 0; color: #d1d5db; font-size: 11px;">${label}</p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}
