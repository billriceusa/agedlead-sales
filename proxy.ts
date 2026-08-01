import { NextResponse, type NextRequest } from "next/server";
import {
  NOINDEX_HEADER,
  parseNoindexHosts,
  shouldNoindexHost,
} from "@/lib/soft-launch";

/**
 * Keep the soft-launch domain out of the index while it serves the same pages
 * as the live site. The decision lives in lib/soft-launch.ts, which is where
 * the reasoning and the tests are.
 *
 * Read once at module scope: the host list is configuration, not per-request
 * state. Changing NOINDEX_HOSTS takes a redeploy, which is what cutover is.
 */
const NOINDEX_HOSTS = parseNoindexHosts(process.env.NOINDEX_HOSTS);

export default function proxy(request: NextRequest) {
  const response = NextResponse.next();

  if (shouldNoindexHost(request.headers.get("host"), NOINDEX_HOSTS)) {
    response.headers.set("X-Robots-Tag", NOINDEX_HEADER);
  }

  return response;
}

export const config = {
  /**
   * Everything except Next's own build output and the image optimizer.
   *
   * The lead-magnet PDFs under /downloads are deliberately in scope: an
   * X-Robots-Tag header is the only way to keep a PDF out of the index, since
   * it cannot carry a meta robots tag.
   *
   * Note what this does NOT do: robots.txt keeps `allow: /` on every host. A
   * crawler blocked by robots.txt never reads the noindex header, and the URL
   * can still surface from third-party links. Crawlable plus noindex is what
   * actually keeps a host out of the index; Disallow alone is not.
   */
  matcher: ["/((?!_next/static|_next/image).*)"],
};
