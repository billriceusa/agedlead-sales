import type { NewsletterContent } from "./newsletter-ai";
import { SITE_HOST } from "@/lib/site-url";
import { rebrandNoticeHtml } from "@/lib/rebrand-notice";
import { STORE_VERTICALS, storeUrl, catalogueUrl } from "@/lib/newsletter/store-links";

/**
 * Tag a link back to our own site so the newsletter's traffic is attributable.
 *
 * The store links have carried UTMs all along; the site links did not. Fifteen
 * of the issue's twenty-seven links pointed home untagged, so every blog read
 * the newsletter drove landed in GA4 as direct or organic and the weekly
 * report's `sessionMedium=email` filter could never see it. The newsletter was
 * doing work it got no credit for, which is indistinguishable from doing none.
 *
 * `utm_content` carries issue AND placement, the same convention the store
 * links use (`lib/newsletter/store-links.ts`), so a footer click is separable
 * from a featured-article click rather than both collapsing into one row.
 */
function siteLink(
  siteUrl: string,
  path: string,
  weekLabel: string,
  placement: string,
): string {
  const params = new URLSearchParams({
    utm_source: "newsletter",
    utm_medium: "email",
    utm_campaign: "weekly-newsletter",
    utm_content: `${weekLabel}-${placement}`,
  });
  return `${siteUrl}${path}?${params.toString()}`;
}

export function buildNewsletterHtml(
  content: NewsletterContent,
  siteUrl: string,
  weekLabel: string
): string {
  // Three store placements, not one. The issue that shipped before carried 21
  // links, 20 of them back to our own site, and its single store link sat at
  // 79% page depth — so a reader who opened, skimmed and left never saw one.
  // Measured 2026-08-27: one such send produced 17 store sessions against the
  // whole site's 5.1/day, which is why placement is the lever here.
  const heroStoreUrl = catalogueUrl(weekLabel, "hero");
  const footerStoreUrl = catalogueUrl(weekLabel, "footer");

  // Self-select rather than list segmentation: one unsegmented send, and the
  // reader picks their own vertical. Rendered as a 3-column table because
  // flex and grid are unreliable in Outlook.
  const verticalRows = STORE_VERTICALS.reduce<(typeof STORE_VERTICALS)[]>((rows, v, i) => {
    if (i % 3 === 0) rows.push([]);
    rows[rows.length - 1].push(v);
    return rows;
  }, []);

  const verticalStripHtml = verticalRows
    .map(
      (row) => `
                      <tr>
                        ${row
                          .map(
                            (v) => `<td width="33%" style="padding: 0 4px 8px 0;"><a href="${storeUrl(
                              weekLabel,
                              `vertical-${v.key}`,
                              v.segment
                            )}" style="display: block; background-color: rgba(255,255,255,0.12); color: #ffffff; padding: 10px 8px; border-radius: 6px; text-decoration: none; font-weight: 600; font-size: 13px; border: 1px solid rgba(255,255,255,0.25); text-align: center;">${v.label}</a></td>`
                          )
                          .join("")}
                        ${row.length < 3 ? `<td width="33%"></td>`.repeat(3 - row.length) : ""}
                      </tr>`
    )
    .join("");
  const introHtml = content.personalIntro
    .split("\n\n")
    .map((p) => `<p style="margin: 0 0 16px 0; line-height: 1.7;">${p}</p>`)
    .join("");

  const tipsHtml = content.quickTips
    .map(
      (tip, i) => `
        <tr>
          <td style="padding: 16px 20px; ${i < content.quickTips.length - 1 ? "border-bottom: 1px solid #e5e7eb;" : ""}">
            <p style="margin: 0 0 6px 0; font-weight: 700; color: #1e40af; font-size: 15px;">${tip.title}</p>
            <p style="margin: 0; color: #374151; line-height: 1.6; font-size: 15px;">${tip.body}</p>
          </td>
        </tr>`
    )
    .join("");

  const digestHtml = content.weeklyDigest
    .map(
      (post) => `
        <tr>
          <td style="padding: 12px 0; border-bottom: 1px solid #f3f4f6;">
            <a href="${siteLink(siteUrl, `/blog/${post.slug}`, weekLabel, "digest")}" style="color: #1e40af; font-weight: 600; text-decoration: none; font-size: 15px;">${post.title}</a>
            <p style="margin: 4px 0 0 0; color: #6b7280; font-size: 14px; line-height: 1.5;">${post.oneLiner}</p>
          </td>
        </tr>`
    )
    .join("");

  return `<!DOCTYPE html>
<html lang="en" xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="color-scheme" content="light">
  <meta name="supported-color-schemes" content="light">
  <title>${content.subject}</title>
  <!--[if mso]>
  <noscript>
    <xml>
      <o:OfficeDocumentSettings>
        <o:PixelsPerInch>96</o:PixelsPerInch>
      </o:OfficeDocumentSettings>
    </xml>
  </noscript>
  <![endif]-->
  <style>
    @media only screen and (max-width: 620px) {
      .container { width: 100% !important; padding: 12px !important; }
      .content { padding: 20px !important; }
      .header { padding: 24px 20px !important; }
      .featured-img { height: 180px !important; }
    }
  </style>
</head>
<body style="margin: 0; padding: 0; background-color: #f3f4f6; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; -webkit-font-smoothing: antialiased; -moz-osx-font-smoothing: grayscale;">

  <!-- Preheader text (hidden) -->
  <div style="display: none; max-height: 0; overflow: hidden; mso-hide: all;">
    ${content.previewText}
    ${"&zwnj;&nbsp;".repeat(20)}
  </div>

  <!-- Outer wrapper -->
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color: #f3f4f6;">
    <tr>
      <td align="center" style="padding: 24px 16px;">

        <!-- Main container -->
        <table role="presentation" class="container" width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">

          <!-- Header -->
          <tr>
            <td class="header" style="background: linear-gradient(135deg, #1e3a5f 0%, #2563eb 100%); padding: 32px; text-align: center;">
              <h1 style="margin: 0; color: #ffffff; font-size: 26px; font-weight: 800; letter-spacing: -0.5px;">Work Aged Leads</h1>
              <p style="margin: 6px 0 0 0; color: rgba(255,255,255,0.85); font-size: 14px; font-weight: 400;">Weekly strategies for sales professionals — by Bill Rice</p>
            </td>
          </tr>

          <!-- Personal Intro -->
          <tr>
            <td class="content" style="padding: 32px 32px 20px;">
              ${introHtml}
            </td>
          </tr>

          <!-- Store CTA 1 of 3: above the fold -->
          <tr>
            <td style="padding: 0 32px 28px;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border: 1px solid #a7f3d0; background-color: #ecfdf5; border-radius: 8px;">
                <tr>
                  <td style="padding: 16px 20px;">
                    <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                      <tr>
                        <td style="color: #065f46; font-size: 14px; line-height: 1.5; padding-right: 12px;">
                          <strong style="color: #064e3b;">Need leads this week?</strong> Browse current aged inventory and pricing.
                        </td>
                        <td width="130" style="text-align: right;">
                          <a href="${heroStoreUrl}" style="display: inline-block; background-color: #059669; color: #ffffff; padding: 10px 18px; border-radius: 6px; text-decoration: none; font-weight: 700; font-size: 14px; white-space: nowrap;">Shop Leads &rarr;</a>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Featured Article -->
          <tr>
            <td style="padding: 0 32px 32px;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color: #eff6ff; border-radius: 10px; overflow: hidden; border: 1px solid #bfdbfe;">
                <tr>
                  <td style="background-color: #1e40af; padding: 14px 20px;">
                    <p style="margin: 0; color: #ffffff; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 1.5px;">Featured This Week</p>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 20px;">
                    <h2 style="margin: 0 0 10px 0; font-size: 20px; color: #111827; line-height: 1.3;">
                      <a href="${siteLink(siteUrl, `/blog/${content.featuredArticle.slug}`, weekLabel, "featured-title")}" style="color: #111827; text-decoration: none;">${content.featuredArticle.title}</a>
                    </h2>
                    <p style="margin: 0 0 16px 0; color: #374151; font-size: 15px; line-height: 1.6;">${content.featuredArticle.spotlight}</p>
                    <a href="${siteLink(siteUrl, `/blog/${content.featuredArticle.slug}`, weekLabel, "featured-button")}" style="display: inline-block; background-color: #1e40af; color: #ffffff; padding: 10px 24px; border-radius: 6px; text-decoration: none; font-weight: 600; font-size: 14px;">Read the Full Article &rarr;</a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Quick Tips -->
          <tr>
            <td style="padding: 0 32px 32px;">
              <h2 style="margin: 0 0 4px 0; font-size: 18px; color: #111827;">Quick Tips From the Trenches</h2>
              <p style="margin: 0 0 16px 0; color: #6b7280; font-size: 13px;">Exclusive insights — only in the newsletter</p>
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color: #f9fafb; border-radius: 10px; border: 1px solid #e5e7eb;">
                ${tipsHtml}
              </table>
            </td>
          </tr>

          <!-- Industry Insight -->
          <tr>
            <td style="padding: 0 32px 32px;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-left: 4px solid #f59e0b; padding-left: 0;">
                <tr>
                  <td style="padding: 16px 20px; background-color: #fffbeb; border-radius: 0 8px 8px 0;">
                    <p style="margin: 0 0 4px 0; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 1.5px; color: #92400e;">Industry Insight</p>
                    <p style="margin: 0 0 6px 0; font-weight: 700; color: #111827; font-size: 16px;">${content.industryInsight.headline}</p>
                    <p style="margin: 0; color: #374151; font-size: 15px; line-height: 1.6;">${content.industryInsight.body}</p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- This Week on the Blog -->
          ${
            content.weeklyDigest.length > 0
              ? `
          <tr>
            <td style="padding: 0 32px 32px;">
              <!-- "From the Blog", not "This Week on the Blog". The digest is
                   the ten most recent Sanity posts, whatever their age — on
                   2026-08-31 the newest was 2026-08-01 and the oldest listed
                   was 2026-07-11, so a "this week" header was simply false and
                   would have been false in every issue during any publishing
                   gap. The header must stay true without anyone remembering to
                   check the publish dates. -->
              <h2 style="margin: 0 0 12px 0; font-size: 18px; color: #111827;">From the Blog</h2>
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                ${digestHtml}
              </table>
            </td>
          </tr>`
              : ""
          }

          <!-- Store CTA 2 of 3: vertical self-select strip -->
          <tr>
            <td style="padding: 0 32px 32px;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background: linear-gradient(135deg, #0f1e33 0%, #1e3a5f 60%, #2463c9 100%); border-radius: 10px; overflow: hidden;">
                <tr>
                  <td style="padding: 24px 24px 20px 24px;">
                    <p style="margin: 0 0 4px 0; color: #93c5fd; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 1.5px;">Buy Aged Leads</p>
                    <p style="margin: 0 0 8px 0; color: #ffffff; font-size: 19px; font-weight: 700;">Pick your vertical</p>
                    <p style="margin: 0 0 16px 0; color: rgba(255,255,255,0.85); font-size: 14px; line-height: 1.55;">Straight to current inventory and live pricing &mdash; no digging.</p>
                    <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                      ${verticalStripHtml}
                    </table>
                    <p style="margin: 12px 0 0 0;"><a href="${catalogueUrl(weekLabel, "vertical-all")}" style="color: #bfdbfe; font-size: 13px; text-decoration: underline;">See all lead types &rarr;</a></p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Store CTA 3 of 3: closing -->
          <tr>
            <td style="padding: 0 32px 32px;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background: linear-gradient(135deg, #059669 0%, #10b981 100%); border-radius: 10px;">
                <tr>
                  <td style="padding: 28px 24px; text-align: center;">
                    <h2 style="margin: 0 0 8px 0; color: #ffffff; font-size: 20px; font-weight: 700;">Ready to Fill Your Pipeline?</h2>
                    <p style="margin: 0 0 18px 0; color: rgba(255,255,255,0.9); font-size: 15px;">Aged leads across insurance, mortgage, home services and solar</p>
                    <a href="${footerStoreUrl}" style="display: inline-block; background-color: #ffffff; color: #059669; padding: 12px 32px; border-radius: 6px; text-decoration: none; font-weight: 700; font-size: 15px;">${content.ctaText}</a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Closing -->
          <tr>
            <td style="padding: 0 32px 24px;">
              <p style="margin: 0 0 6px 0; color: #374151; font-size: 15px; line-height: 1.6;">${content.closingNote}</p>
              <p style="margin: 0; color: #111827; font-weight: 600; font-size: 15px;">— Bill Rice</p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #f9fafb; padding: 24px 32px; border-top: 1px solid #e5e7eb;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="text-align: center;">
                    <p style="margin: 0 0 8px 0; color: #6b7280; font-size: 13px;">
                      <a href="${siteLink(siteUrl, "", weekLabel, "footer-home")}" style="color: #1e40af; text-decoration: none; font-weight: 600;">Work Aged Leads</a> &nbsp;|&nbsp;
                      <a href="${siteLink(siteUrl, "/blog", weekLabel, "footer-blog")}" style="color: #6b7280; text-decoration: none;">Blog</a> &nbsp;|&nbsp;
                      <a href="${siteLink(siteUrl, "/playbook", weekLabel, "footer-playbook")}" style="color: #6b7280; text-decoration: none;">Playbook</a> &nbsp;|&nbsp;
                      <a href="${siteLink(siteUrl, "/glossary", weekLabel, "footer-glossary")}" style="color: #6b7280; text-decoration: none;">Glossary</a> &nbsp;|&nbsp;
                      <a href="${siteLink(siteUrl, "/calculators", weekLabel, "footer-calculators")}" style="color: #6b7280; text-decoration: none;">Calculators</a>
                    </p>
                    <p style="margin: 0 0 8px 0; color: #9ca3af; font-size: 12px;">
                      You're receiving this because you signed up at ${SITE_HOST}.
                    </p>
                    ${rebrandNoticeHtml()}
                    <p style="margin: 0; color: #9ca3af; font-size: 12px;">
                      <a href="{{{RESEND_UNSUBSCRIBE_URL}}}" style="color: #9ca3af; text-decoration: underline;">Unsubscribe</a>
                    </p>
                    <p style="margin: 12px 0 0 0; color: #d1d5db; font-size: 11px;">Week of ${weekLabel}</p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

        </table>
        <!-- /Main container -->

      </td>
    </tr>
  </table>

</body>
</html>`;
}
