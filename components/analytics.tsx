import Script from "next/script";

const GTM_ID = process.env.NEXT_PUBLIC_GTM_ID;
const GA4_ID = process.env.NEXT_PUBLIC_GA4_MEASUREMENT_ID;

/**
 * Standalone GA4 — only loads if GTM is NOT configured.
 * When GTM is active, GA4 fires through GTM (no need to load gtag.js twice).
 */
export function GoogleAnalyticsTag() {
  // Skip standalone GA4 if GTM handles it — avoids loading gtag.js twice (~170KB saved)
  if (!GA4_ID || GTM_ID) return null;

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GA4_ID}`}
        strategy="afterInteractive"
      />
      <Script
        id="ga4-config"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', '${GA4_ID}');`,
        }}
      />
    </>
  );
}

/**
 * Google Tag Manager — deferred to lazyOnload so it doesn't block LCP/FCP.
 * GTM handles GA4, conversion tracking, and any other tags configured in the container.
 */
export function GoogleTagManager() {
  if (!GTM_ID) return null;

  return (
    <>
      <Script
        id="gtm-script"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','${GTM_ID}');`,
        }}
      />
      <noscript>
        <iframe
          src={`https://www.googletagmanager.com/ns.html?id=${GTM_ID}`}
          height="0"
          width="0"
          style={{ display: "none", visibility: "hidden" }}
        />
      </noscript>
    </>
  );
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type GtagArgs = [string, ...any[]];

function gtag(...args: GtagArgs) {
  if (typeof window !== "undefined" && "dataLayer" in window) {
    (window as unknown as { dataLayer: GtagArgs[] }).dataLayer.push(args);
  }
}

export function trackEvent(name: string, params?: Record<string, string>) {
  gtag("event", name, params);
}

export function trackNewsletterSignup(location: string, email: string) {
  trackEvent("newsletter_signup", {
    signup_location: location,
    email_domain: email.split("@")[1],
  });
}

export function trackCtaClick(id: string, location: string) {
  trackEvent("cta_click", {
    cta_id: id,
    cta_location: location,
  });
}
