import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const email = searchParams.get("email");

  if (!email) {
    return new NextResponse(buildPage("Missing email", "No email address was provided."), {
      status: 400,
      headers: { "Content-Type": "text/html" },
    });
  }

  const apiKey = process.env.RESEND_API_KEY;
  const audienceId = process.env.RESEND_AUDIENCE_ID;

  if (apiKey && audienceId) {
    try {
      // Find the contact by email
      const listRes = await fetch(
        `https://api.resend.com/audiences/${audienceId}/contacts?email=${encodeURIComponent(email)}`,
        { headers: { Authorization: `Bearer ${apiKey}` } }
      );

      if (listRes.ok) {
        const data = (await listRes.json()) as { data?: { id: string }[] };
        const contact = data.data?.[0];

        if (contact) {
          // Update contact to unsubscribed
          await fetch(
            `https://api.resend.com/audiences/${audienceId}/contacts/${contact.id}`,
            {
              method: "PATCH",
              headers: {
                Authorization: `Bearer ${apiKey}`,
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ unsubscribed: true }),
            }
          );
        }
      }
    } catch (err) {
      console.error("[Unsubscribe] Error:", err);
    }
  }

  console.log(`[Newsletter] Unsubscribed: ${email}`);

  return new NextResponse(
    buildPage(
      "You've been unsubscribed",
      "You won't receive any more emails from Work Aged Leads. If this was a mistake, you can re-subscribe at agedleadsales.com anytime."
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
    <a href="https://www.agedleadsales.com">Back to Work Aged Leads</a>
  </div>
</body>
</html>`;
}
