const INDEXNOW_KEY = "3af0b98696984205a902c5c28d9be6d0";
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://agedleadsales.com";

/**
 * Notify IndexNow (Bing, Yandex, Naver) about new or updated URLs.
 * Call this after publishing or updating content.
 */
export async function notifyIndexNow(urls: string | string[]): Promise<void> {
  const urlList = Array.isArray(urls) ? urls : [urls];

  if (urlList.length === 0) return;

  try {
    const host = new URL(SITE_URL).host;

    if (urlList.length === 1) {
      // Single URL — simple GET request
      const params = new URLSearchParams({
        url: urlList[0],
        key: INDEXNOW_KEY,
      });
      await fetch(`https://api.indexnow.org/IndexNow?${params}`, {
        method: "GET",
      });
    } else {
      // Multiple URLs — batch POST
      await fetch("https://api.indexnow.org/IndexNow", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          host,
          key: INDEXNOW_KEY,
          keyLocation: `${SITE_URL}/${INDEXNOW_KEY}.txt`,
          urlList,
        }),
      });
    }
  } catch (error) {
    // IndexNow failures should never block publishing
    console.error("[IndexNow] Notification failed:", error);
  }
}
