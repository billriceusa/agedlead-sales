import type { EmailContext, Vertical } from "./types";
import { SITE_URL } from "@/lib/site-url";
import { rebrandNoticeHtml } from "@/lib/rebrand-notice";
import { AFFILIATE_UTM_SOURCE } from "@/lib/utm";
// Maps a vertical to the partner's buy page. "insurance" is UNMAPPED by
// decision — there is no generic-insurance buy page to point at — so it falls
// back to the full catalogue rather than to a guess.
import { storeCategoryPath } from "@/lib/affiliate";

export { SITE_URL };
export const FROM_EMAIL = "Bill Rice <bill@workagedleads.com>";

export interface ShellOptions {
  bodyHtml: string;
  ctx: EmailContext;
}

export function renderShell({ bodyHtml, ctx }: ShellOptions): string {
  return `<!DOCTYPE html>
<html lang="en">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body style="margin: 0; padding: 0; background-color: #f3f4f6; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color: #f3f4f6;">
    <tr>
      <td align="center" style="padding: 24px 16px;">
        <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 12px; overflow: hidden; max-width: 600px;">
          <tr>
            <td style="background: linear-gradient(135deg, #1e3a5f 0%, #2563eb 100%); padding: 28px 32px; text-align: center;">
              <h1 style="margin: 0; color: #ffffff; font-size: 22px; font-weight: 800; letter-spacing: -0.3px;">Work Aged Leads</h1>
              <p style="margin: 4px 0 0 0; color: rgba(255,255,255,0.82); font-size: 13px;">The Aged Lead Operator's System</p>
            </td>
          </tr>
          <tr>
            <td style="padding: 32px;">
              ${bodyHtml}
            </td>
          </tr>
          <tr>
            <td style="padding: 0 32px 24px;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color: #f9fafb; border: 1px solid #e5e7eb; border-radius: 10px;">
                <tr>
                  <td style="padding: 16px 20px; text-align: center;">
                    <p style="margin: 0 0 4px 0; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 1.2px; color: #6b7280;">Your Downloads</p>
                    <p style="margin: 0;">
                      <a href="${ctx.playbookUrl}" style="color: #2563eb; text-decoration: none; font-weight: 600; font-size: 14px;">Playbook (PDF)</a>
                      <span style="color: #d1d5db; padding: 0 8px;">·</span>
                      <a href="${ctx.workbookUrl}" style="color: #2563eb; text-decoration: none; font-weight: 600; font-size: 14px;">Workbook (PDF)</a>
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <tr>
            <td style="background-color: #f9fafb; padding: 20px 32px; border-top: 1px solid #e5e7eb; text-align: center;">
              <p style="margin: 0 0 8px 0; color: #6b7280; font-size: 13px;">
                <a href="${SITE_URL}" style="color: #2563eb; text-decoration: none; font-weight: 600;">Work Aged Leads</a> &nbsp;|&nbsp;
                <a href="${SITE_URL}/playbook" style="color: #6b7280; text-decoration: none;">Playbooks</a> &nbsp;|&nbsp;
                <a href="${SITE_URL}/calculators" style="color: #6b7280; text-decoration: none;">Calculators</a>
              </p>
              ${rebrandNoticeHtml()}
              <p style="margin: 0; color: #9ca3af; font-size: 12px;">
                <a href="${ctx.unsubscribeUrl}" style="color: #9ca3af; text-decoration: underline;">Unsubscribe</a>
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

export function greet(firstName?: string): string {
  if (!firstName) return "Hey,";
  const clean = firstName.trim();
  if (!clean) return "Hey,";
  return `Hey ${clean},`;
}

export function para(text: string): string {
  return `<p style="margin: 0 0 16px 0; color: #374151; font-size: 16px; line-height: 1.7;">${text}</p>`;
}

export function heading(text: string): string {
  return `<h2 style="margin: 24px 0 12px 0; color: #111827; font-size: 20px; font-weight: 700; letter-spacing: -0.2px;">${text}</h2>`;
}

export function list(items: string[]): string {
  const lis = items
    .map((i) => `<li style="margin-bottom: 8px;">${i}</li>`)
    .join("");
  return `<ul style="margin: 0 0 16px 0; padding-left: 20px; color: #374151; font-size: 16px; line-height: 1.7;">${lis}</ul>`;
}

export function signoff(): string {
  return `<p style="margin: 0; color: #111827; font-weight: 600; font-size: 16px;">— Bill</p>`;
}

/**
 * The store link for a course email.
 *
 * WHY THE COPY CHANGES BY EMAIL NUMBER
 *
 * This block used to appear once, in email 5. Putting the identical banner in
 * all five would read as the same ad stapled to five lessons — which is the
 * "push" placement the store-side data says earns almost nothing ($0.96/session
 * for `cta-banner` against $59-70 for surfaces a reader chooses to use).
 *
 * So each email's line ties the link to what that email just taught. A reader
 * who has been told to build a 14-day cadence and is then shown where to get
 * leads to run it against is being helped, not sold at. Same link, different
 * reason, and only the reason makes it a pull.
 *
 * Deep-links to the reader's own vertical where the partner stocks it; verticals
 * they do not stock fall back to the full catalogue rather than a guess.
 *
 * The disclosure is one clause and it always ships. Required, and brief on
 * purpose — a paragraph of it makes the commission arrangement the subject of
 * the email instead of the reader's pipeline.
 */
const CTA_LINES: Record<number, string> = {
  1: "Nothing to buy yet — read Part I first. When you do want inventory to practise on, this is where it lives.",
  2: "A cheap stack only helps if the lead flow is affordable too. That is the whole argument for aged.",
  3: "A cadence needs leads to run against. A small batch is enough to test whether yours works.",
  4: "Working the long tail only pays if the top of the funnel stays stocked.",
  5: "When you're ready to run leads, start with a test batch — enough volume to measure, not so much that a bad assumption hurts.",
};

export function affiliateCtaBlock(vertical: Vertical, emailNumber: number): string {
  const campaign = `flagship-${vertical}`;
  const content = `email-${emailNumber}`;
  const path = storeCategoryPath(vertical) ?? "/all-lead-types/";
  const url = `https://agedleadstore.com${path}?utm_source=${AFFILIATE_UTM_SOURCE}&utm_medium=email&utm_campaign=${campaign}&utm_content=${content}`;
  const label = verticalLabel(vertical);
  const line = CTA_LINES[emailNumber] ?? CTA_LINES[5];
  return `
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin: 24px 0; background-color: #eff6ff; border: 1px solid #bfdbfe; border-radius: 10px;">
      <tr>
        <td style="padding: 20px 24px; text-align: center;">
          <p style="margin: 0 0 14px 0; color: #1f2937; font-size: 15px; line-height: 1.5;">${line}</p>
          <a href="${url}" style="display: inline-block; background-color: #2563eb; color: #ffffff; padding: 10px 22px; border-radius: 6px; text-decoration: none; font-weight: 600; font-size: 14px;">See aged ${label.toLowerCase()} leads &rarr;</a>
          <p style="margin: 12px 0 0 0; color: #6b7280; font-size: 12px;">Affiliate link — we may earn a commission at no cost to you.</p>
        </td>
      </tr>
    </table>`;
}

/** Plain-text twin of {@link affiliateCtaBlock}, for the text/plain part. */
export function affiliateCtaText(vertical: Vertical, emailNumber: number): string {
  const campaign = `flagship-${vertical}`;
  const content = `email-${emailNumber}`;
  const path = storeCategoryPath(vertical) ?? "/all-lead-types/";
  const url = `https://agedleadstore.com${path}?utm_source=${AFFILIATE_UTM_SOURCE}&utm_medium=email&utm_campaign=${campaign}&utm_content=${content}`;
  const line = CTA_LINES[emailNumber] ?? CTA_LINES[5];
  return `${line}
See aged ${verticalLabel(vertical).toLowerCase()} leads: ${url}
(Affiliate link — we may earn a commission at no cost to you.)`;
}

export function verticalLabel(vertical: Vertical): string {
  switch (vertical) {
    case "mortgage":
      return "Mortgage";
    case "insurance":
      return "Insurance";
    case "home-services":
      return "Home Services";
  }
}
