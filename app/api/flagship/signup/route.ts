import { NextResponse } from "next/server";
import { Resend } from "resend";
import { scheduleCourse } from "@/lib/email-course/schedule";
import type { Vertical } from "@/lib/email-course/types";
import {
  isGibberishName,
  isGoodOrigin,
  isHoneypotFilled,
} from "@/lib/anti-spam";
// This route used to read NEXT_PUBLIC_SITE_URL with its own
// `|| "https://www.agedleadsales.com"` fallback — the only `www.` variant in
// the repo, and a bypass of the one module whose entire purpose is to be the
// single place the site's own address is written down. It builds the playbook,
// workbook and unsubscribe URLs, so a drift here mails dead links.
import { SITE_URL } from "@/lib/site-url";

const VALID_VERTICALS: Vertical[] = ["mortgage", "insurance", "home-services"];

function isVertical(v: unknown): v is Vertical {
  return typeof v === "string" && (VALID_VERTICALS as string[]).includes(v);
}

function pdfUrls(vertical: Vertical): { playbookUrl: string; workbookUrl: string } {
  return {
    playbookUrl: `${SITE_URL}/downloads/aged-lead-operators-system-${vertical}.pdf`,
    workbookUrl: `${SITE_URL}/downloads/aged-lead-operators-workbook-${vertical}.pdf`,
  };
}

export async function POST(request: Request) {
  try {
    if (!isGoodOrigin(request)) {
      return NextResponse.json({ success: true });
    }

    const body = await request.json();

    if (isHoneypotFilled(body)) {
      return NextResponse.json({ success: true });
    }

    const { email, vertical, firstName } = body as {
      email?: string;
      vertical?: string;
      firstName?: string;
    };

    if (isGibberishName(firstName)) {
      console.warn(`[Flagship] Rejected gibberish firstName: "${firstName}" email=${email}`);
      return NextResponse.json({ success: true });
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

    if (!isVertical(vertical)) {
      return NextResponse.json(
        { error: "Invalid vertical — choose mortgage, insurance, or home-services" },
        { status: 400 }
      );
    }

    const apiKey = process.env.RESEND_API_KEY;
    const audienceId = process.env.RESEND_AUDIENCE_ID;

    const { playbookUrl, workbookUrl } = pdfUrls(vertical);
    const unsubscribeUrl = `${SITE_URL}/api/flagship/unsubscribe?email=${encodeURIComponent(email)}`;

    if (!apiKey) {
      console.warn("[Flagship] RESEND_API_KEY not set — signup accepted, no email sent");
      return NextResponse.json({
        success: true,
        message: "Subscribed! Your downloads are ready.",
        playbookUrl,
        workbookUrl,
      });
    }

    const resend = new Resend(apiKey);

    if (audienceId) {
      try {
        await resend.contacts.create({
          email,
          audienceId,
          unsubscribed: false,
          ...(firstName ? { firstName } : {}),
        });
      } catch (err) {
        // Contact may already exist — not an error
        console.log(
          `[Flagship] Contact create: ${err instanceof Error ? err.message : "unknown"}`
        );
      }
    }

    const result = await scheduleCourse(vertical, {
      recipientEmail: email,
      firstName: firstName?.trim() || undefined,
      playbookUrl,
      workbookUrl,
      unsubscribeUrl,
      vertical,
    });

    console.log(
      `[Flagship] Signup: ${email} (vertical=${vertical}) sent=${result.sentImmediately} scheduled=${result.scheduled} errors=${result.errors.length}`
    );
    if (result.errors.length) {
      console.error("[Flagship] Schedule errors:", result.errors);
    }

    return NextResponse.json({
      success: true,
      message: "You're in. Your downloads are ready.",
      playbookUrl,
      workbookUrl,
      courseSummary: {
        sentImmediately: result.sentImmediately,
        scheduled: result.scheduled,
      },
    });
  } catch (err) {
    console.error("[Flagship] Signup error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
