import { NextResponse } from "next/server";
import { revalidateTag } from "next/cache";
import { SANITY_CACHE_TAG } from "@/sanity/lib/fetch";

export const dynamic = "force-dynamic";

/**
 * On-demand cache purge for Sanity content.
 *
 * Every Sanity-backed page is prerendered, so a Studio publish used to sit
 * invisible until the next deploy. sanity/lib/fetch.ts now tags each query and
 * bounds its staleness; this route is the fast path that collapses that window
 * to zero when the Studio fires a webhook at it.
 *
 * Auth is a shared bearer rather than Sanity's HMAC signature: the operation is
 * idempotent and non-destructive — the worst an attacker achieves is making the
 * site re-render itself — so signature verification would buy little for the
 * extra dependency and key rotation. SANITY_REVALIDATE_SECRET is preferred;
 * CRON_SECRET is accepted so the route works without new Vercel config.
 *
 * Configure in Sanity: Manage -> API -> Webhooks
 *   URL:     https://workagedleads.com/api/revalidate
 *   Trigger: create, update, delete   (dataset: production)
 *   Header:  Authorization: Bearer <secret>
 */
export async function POST(request: Request) {
  const secret = (
    process.env.SANITY_REVALIDATE_SECRET ||
    process.env.CRON_SECRET ||
    ""
  ).trim();

  // Never let a missing secret degrade into an open endpoint.
  if (!secret) {
    return NextResponse.json(
      { error: "Revalidation not configured" },
      { status: 503 }
    );
  }

  const authHeader = request.headers.get("authorization");
  const querySecret = new URL(request.url).searchParams.get("secret");
  if (authHeader !== `Bearer ${secret}` && querySecret !== secret) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // `{ expire: 0 }` rather than the usual "max" profile: that one only marks
  // the tag stale and serves stale-while-revalidate, so the first visitor after
  // a publish would still see the old page. This route exists precisely because
  // an external system says the content changed, which is the case Next calls
  // out for immediate expiration. (`updateTag`, the other immediate option, is
  // Server-Action-only and cannot be used from a webhook.)
  revalidateTag(SANITY_CACHE_TAG, { expire: 0 });

  // Echo what Sanity said changed. The purge is global either way — this is for
  // the Vercel log, so a stale page can be traced back to a publish (or its
  // absence) instead of guessed at.
  let documentType: string | undefined;
  let documentId: string | undefined;
  try {
    const body = (await request.json()) as {
      _type?: string;
      _id?: string;
    } | null;
    documentType = body?._type;
    documentId = body?._id;
  } catch {
    // Sanity's "test" button and manual curls send no body. Not an error.
  }

  console.log(
    `[Revalidate] purged tag "${SANITY_CACHE_TAG}"` +
      (documentType ? ` after ${documentType} ${documentId ?? ""}`.trimEnd() : "")
  );

  return NextResponse.json({
    revalidated: true,
    tag: SANITY_CACHE_TAG,
    documentType: documentType ?? null,
    now: new Date().toISOString(),
  });
}

/** Health probe, so the wiring can be checked without a publish. */
export async function GET() {
  const configured = Boolean(
    process.env.SANITY_REVALIDATE_SECRET || process.env.CRON_SECRET
  );
  return NextResponse.json({
    ok: true,
    configured,
    tag: SANITY_CACHE_TAG,
    method: "POST",
  });
}
