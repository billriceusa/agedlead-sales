import { NextResponse } from "next/server";
import { unsubscribeEverywhere } from "@/lib/unsubscribe";
import { SITE_HOST, SITE_URL } from "@/lib/site-url";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const email = searchParams.get("email");

  if (!email) {
    return new NextResponse(
      buildPage("Missing email", "No email address was provided."),
      { status: 400, headers: { "Content-Type": "text/html" } }
    );
  }

  // Writes BOTH suppression stores. Resend alone is not enough: the
  // lifecycle sender gates on als_buyer_contacts.unsubscribed in Postgres and
  // never reads Resend, and after the 2026-08-01 list fold most of this
  // audience are ALS buyers. See lib/unsubscribe.ts.
  const result = await unsubscribeEverywhere(email);

  console.log(
    `[Flagship] Unsubscribed ${result.email} — resend=${result.resend?.ok ?? "skipped"} ` +
      `postgres=${result.postgres?.ok ?? "skipped"} (${result.postgres?.rows ?? 0} row(s))`
  );

  // Never show a success page over a failed write. If neither store took the
  // opt-out, say so and give them a way through rather than telling them they
  // are unsubscribed when they are not.
  if (!result.suppressedSomewhere) {
    return new NextResponse(
      buildPage(
        "We could not complete that",
        "Something went wrong on our end and your request was not recorded. Please email bill@billricestrategy.com and it will be handled manually."
      ),
      { status: 500, headers: { "Content-Type": "text/html" } }
    );
  }

  return new NextResponse(
    buildPage(
      "You've been unsubscribed",
      `You won't receive any more emails from the Aged Lead Operator's System course. Note: emails already scheduled may arrive for up to 24 hours as Resend processes the suppression. If this was a mistake, you can re-subscribe at ${SITE_HOST} anytime.`
    ),
    { status: 200, headers: { "Content-Type": "text/html" } }
  );
}

function buildPage(title: string, message: string): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title} — Work Aged Leads</title>
  <style>
    body { margin: 0; padding: 40px 20px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif; background: #f3f4f6; color: #1f2937; }
    .card { max-width: 480px; margin: 0 auto; background: white; border-radius: 12px; padding: 40px; text-align: center; box-shadow: 0 1px 3px rgba(0,0,0,0.1); }
    h1 { font-size: 24px; margin: 0 0 12px; }
    p { color: #6b7280; line-height: 1.6; margin: 0 0 24px; }
    a { color: #2563eb; text-decoration: none; font-weight: 600; }
  </style>
</head>
<body>
  <div class="card">
    <h1>${title}</h1>
    <p>${message}</p>
    <a href="${SITE_URL}">Back to Work Aged Leads</a>
  </div>
</body>
</html>`;
}
