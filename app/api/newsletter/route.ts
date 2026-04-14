import { NextResponse } from "next/server";
import { Resend } from "resend";

const LEAD_MAGNET_DOWNLOADS: Record<string, { name: string; url: string }> = {
  "7-day-cadence": {
    name: "7-Day Follow-Up Cadence Cheat Sheet",
    url: "https://www.agedleadsales.com/downloads/7-day-follow-up-cadence.pdf",
  },
  "scripts-bundle": {
    name: "Aged Lead Scripts Bundle",
    url: "https://www.agedleadsales.com/downloads/aged-lead-scripts-bundle.pdf",
  },
  "roi-scorecard": {
    name: "Weekly ROI Scorecard",
    url: "https://www.agedleadsales.com/downloads/weekly-roi-scorecard.pdf",
  },
  "lead-buying-checklist": {
    name: "Lead Buying Checklist",
    url: "https://www.agedleadsales.com/downloads/lead-buying-checklist.pdf",
  },
  "door-knocking-planner": {
    name: "Door-Knocking Route Planner",
    url: "https://www.agedleadsales.com/downloads/door-knocking-route-planner.pdf",
  },
};

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, leadMagnet } = body;

    if (!email || typeof email !== "string") {
      return NextResponse.json(
        { error: "Email is required" },
        { status: 400 }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Please enter a valid email address" },
        { status: 400 }
      );
    }

    const apiKey = process.env.RESEND_API_KEY;
    const audienceId = process.env.RESEND_AUDIENCE_ID;
    const fromEmail =
      process.env.RESEND_FROM_EMAIL || "Aged Lead Sales <noreply@agedleadsales.com>";

    if (!apiKey) {
      console.warn("[Newsletter] RESEND_API_KEY not set");
      return NextResponse.json({ success: true, message: "Subscribed!" });
    }

    const resend = new Resend(apiKey);

    // Add contact to audience
    if (audienceId) {
      try {
        await resend.contacts.create({
          email,
          audienceId,
          unsubscribed: false,
        });
      } catch (err) {
        // Contact may already exist — that's fine
        console.log(`[Newsletter] Contact create: ${err instanceof Error ? err.message : "unknown"}`);
      }
    }

    // Send welcome email (with lead magnet download if applicable)
    const magnet = leadMagnet ? LEAD_MAGNET_DOWNLOADS[leadMagnet] : null;

    const subject = magnet
      ? `Your download: ${magnet.name}`
      : "Welcome to Aged Lead Sales";

    const downloadBlock = magnet
      ? `
        <tr>
          <td style="padding: 0 32px 24px;">
            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color: #eff6ff; border: 1px solid #bfdbfe; border-radius: 10px;">
              <tr>
                <td style="padding: 24px; text-align: center;">
                  <p style="margin: 0 0 6px 0; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 1.5px; color: #1e40af;">Your Download</p>
                  <p style="margin: 0 0 16px 0; font-size: 18px; font-weight: 700; color: #111827;">${magnet.name}</p>
                  <a href="${magnet.url}" style="display: inline-block; background-color: #2563eb; color: #ffffff; padding: 12px 32px; border-radius: 6px; text-decoration: none; font-weight: 600; font-size: 15px;">Download PDF</a>
                </td>
              </tr>
            </table>
          </td>
        </tr>`
      : "";

    const html = `<!DOCTYPE html>
<html lang="en">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body style="margin: 0; padding: 0; background-color: #f3f4f6; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color: #f3f4f6;">
    <tr>
      <td align="center" style="padding: 24px 16px;">
        <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 12px; overflow: hidden;">
          <tr>
            <td style="background: linear-gradient(135deg, #1e3a5f 0%, #2563eb 100%); padding: 32px; text-align: center;">
              <h1 style="margin: 0; color: #ffffff; font-size: 24px; font-weight: 800;">Aged Lead Sales</h1>
              <p style="margin: 6px 0 0 0; color: rgba(255,255,255,0.85); font-size: 14px;">Sales training from someone who actually dials</p>
            </td>
          </tr>
          ${downloadBlock}
          <tr>
            <td style="padding: 32px;">
              <p style="margin: 0 0 16px 0; color: #374151; font-size: 16px; line-height: 1.7;">Hey — Bill Rice here. Thanks for signing up.</p>
              <p style="margin: 0 0 16px 0; color: #374151; font-size: 16px; line-height: 1.7;">I built Aged Lead Sales because I got tired of watching salespeople fail with aged leads — not because aged leads don't work, but because the advice they're following comes from people who've never dialed one.</p>
              <p style="margin: 0 0 16px 0; color: #374151; font-size: 16px; line-height: 1.7;">Here's what you'll get from me:</p>
              <ul style="margin: 0 0 16px 0; padding-left: 20px; color: #374151; font-size: 15px; line-height: 1.8;">
                <li>Scripts that have been tested across millions of leads</li>
                <li>Frameworks based on real campaign data, not theory</li>
                <li>Weekly strategies for insurance, mortgage, solar, and more</li>
              </ul>
              <p style="margin: 0 0 24px 0; color: #374151; font-size: 16px; line-height: 1.7;">Start here if you're new: <a href="https://www.agedleadsales.com/start-here" style="color: #2563eb; text-decoration: none; font-weight: 600;">Your Complete Guide to Working Aged Leads</a></p>
              <p style="margin: 0; color: #111827; font-weight: 600; font-size: 16px;">— Bill Rice</p>
            </td>
          </tr>
          <tr>
            <td style="background-color: #f9fafb; padding: 20px 32px; border-top: 1px solid #e5e7eb; text-align: center;">
              <p style="margin: 0 0 8px 0; color: #6b7280; font-size: 13px;">
                <a href="https://www.agedleadsales.com" style="color: #2563eb; text-decoration: none; font-weight: 600;">Aged Lead Sales</a> &nbsp;|&nbsp;
                <a href="https://www.agedleadsales.com/playbook" style="color: #6b7280; text-decoration: none;">Playbook</a> &nbsp;|&nbsp;
                <a href="https://www.agedleadsales.com/calculators" style="color: #6b7280; text-decoration: none;">Calculators</a>
              </p>
              <p style="margin: 0; color: #9ca3af; font-size: 12px;">
                <a href="https://www.agedleadsales.com/api/newsletter/unsubscribe?email=${encodeURIComponent(email)}" style="color: #9ca3af; text-decoration: underline;">Unsubscribe</a>
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;

    try {
      await resend.emails.send({
        from: fromEmail,
        to: email,
        subject,
        html,
      });
    } catch (emailErr) {
      console.error("[Newsletter] Welcome email failed:", emailErr);
      // Don't fail the signup if email fails
    }

    console.log(
      `[Newsletter] New signup: ${email}${leadMagnet ? ` (lead magnet: ${leadMagnet})` : ""}`
    );

    return NextResponse.json({
      success: true,
      message: "Successfully subscribed!",
    });
  } catch {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
