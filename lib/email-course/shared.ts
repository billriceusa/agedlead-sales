import type { EmailContext, Vertical } from "./types";
import { SITE_URL } from "@/lib/site-url";
import { rebrandNoticeHtml } from "@/lib/rebrand-notice";

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

export function affiliateCtaBlock(vertical: Vertical, emailNumber: number): string {
  const campaign = `flagship-${vertical}`;
  const content = `email-${emailNumber}`;
  const url = `https://agedleadstore.com/all-lead-types/?utm_source=agedleadsales&utm_medium=email&utm_campaign=${campaign}&utm_content=${content}`;
  const label = verticalLabel(vertical);
  return `
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin: 24px 0; background-color: #eff6ff; border: 1px solid #bfdbfe; border-radius: 10px;">
      <tr>
        <td style="padding: 20px 24px; text-align: center;">
          <p style="margin: 0 0 10px 0; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 1.2px; color: #1e40af;">Your Next Move</p>
          <p style="margin: 0 0 14px 0; color: #1f2937; font-size: 15px; line-height: 1.5;">When you're ready to run leads, start with a test batch of aged ${label.toLowerCase()} leads.</p>
          <a href="${url}" style="display: inline-block; background-color: #2563eb; color: #ffffff; padding: 10px 22px; border-radius: 6px; text-decoration: none; font-weight: 600; font-size: 14px;">See aged ${label.toLowerCase()} leads →</a>
        </td>
      </tr>
    </table>`;
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
