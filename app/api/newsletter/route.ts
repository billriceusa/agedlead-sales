import { NextResponse } from "next/server";

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

    // Resend integration — uncomment and configure when ready
    // const RESEND_API_KEY = process.env.RESEND_API_KEY;
    // if (RESEND_API_KEY) {
    //   await fetch("https://api.resend.com/contacts", {
    //     method: "POST",
    //     headers: {
    //       Authorization: `Bearer ${RESEND_API_KEY}`,
    //       "Content-Type": "application/json",
    //     },
    //     body: JSON.stringify({
    //       email,
    //       audience_id: process.env.RESEND_AUDIENCE_ID,
    //       unsubscribed: false,
    //     }),
    //   });
    // }

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
