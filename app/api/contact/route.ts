import { NextResponse } from "next/server";
import { Resend } from "resend";
import {
  isGibberishName,
  isGoodOrigin,
  isHoneypotFilled,
} from "@/lib/anti-spam";

export async function POST(request: Request) {
  try {
    if (!isGoodOrigin(request)) {
      return NextResponse.json({ success: true });
    }

    const body = await request.json();

    if (isHoneypotFilled(body)) {
      return NextResponse.json({ success: true });
    }

    const { name, email, message } = body;

    if (isGibberishName(name)) {
      console.warn(`[Contact] Rejected gibberish name: "${name}" email=${email}`);
      return NextResponse.json({ success: true });
    }

    if (!name || typeof name !== "string" || name.trim().length < 2) {
      return NextResponse.json(
        { error: "Please enter your name" },
        { status: 400 }
      );
    }

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

    if (!message || typeof message !== "string" || message.trim().length < 10) {
      return NextResponse.json(
        { error: "Please enter a message (at least 10 characters)" },
        { status: 400 }
      );
    }

    const apiKey = process.env.RESEND_API_KEY;
    const toEmail = process.env.CONTACT_TO_EMAIL || "bill@billricestrategy.com";
    const fromEmail =
      process.env.RESEND_FROM_EMAIL ||
      "Work Aged Leads <noreply@agedleadsales.com>";

    if (!apiKey) {
      console.warn("[Contact] RESEND_API_KEY not set");
      return NextResponse.json({ success: true });
    }

    const resend = new Resend(apiKey);

    await resend.emails.send({
      from: fromEmail,
      to: toEmail,
      replyTo: email,
      subject: `Contact form: ${name.trim()}`,
      html: `<!DOCTYPE html>
<html lang="en">
<head><meta charset="utf-8"></head>
<body style="margin:0;padding:0;background-color:#f3f4f6;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Arial,sans-serif;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#f3f4f6;">
    <tr>
      <td align="center" style="padding:24px 16px;">
        <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="background-color:#ffffff;border-radius:12px;overflow:hidden;">
          <tr>
            <td style="background:linear-gradient(135deg,#1e3a5f 0%,#2563eb 100%);padding:24px 32px;">
              <h1 style="margin:0;color:#ffffff;font-size:20px;font-weight:700;">New Contact Form Submission</h1>
            </td>
          </tr>
          <tr>
            <td style="padding:32px;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="padding:0 0 16px 0;">
                    <p style="margin:0 0 4px 0;font-size:12px;font-weight:600;text-transform:uppercase;letter-spacing:1px;color:#6b7280;">Name</p>
                    <p style="margin:0;font-size:16px;color:#111827;">${name.trim()}</p>
                  </td>
                </tr>
                <tr>
                  <td style="padding:0 0 16px 0;">
                    <p style="margin:0 0 4px 0;font-size:12px;font-weight:600;text-transform:uppercase;letter-spacing:1px;color:#6b7280;">Email</p>
                    <p style="margin:0;font-size:16px;color:#111827;"><a href="mailto:${email}" style="color:#2563eb;text-decoration:none;">${email}</a></p>
                  </td>
                </tr>
                <tr>
                  <td style="padding:0;">
                    <p style="margin:0 0 4px 0;font-size:12px;font-weight:600;text-transform:uppercase;letter-spacing:1px;color:#6b7280;">Message</p>
                    <p style="margin:0;font-size:16px;color:#374151;line-height:1.7;white-space:pre-wrap;">${message.trim()}</p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <tr>
            <td style="background-color:#f9fafb;padding:16px 32px;border-top:1px solid #e5e7eb;text-align:center;">
              <p style="margin:0;color:#9ca3af;font-size:12px;">Sent from agedleadsales.com contact form</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`,
    });

    console.log(`[Contact] Form submission from ${name.trim()} <${email}>`);

    return NextResponse.json({
      success: true,
      message: "Message sent! I'll get back to you within 1-2 business days.",
    });
  } catch (err) {
    console.error("[Contact] Error:", err);
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}
