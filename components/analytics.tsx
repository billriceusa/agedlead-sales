import Script from "next/script";

const GTM_ID = process.env.NEXT_PUBLIC_GTM_ID;

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

type DataLayerEvent = {
  event: string;
  [key: string]: unknown;
};

export function trackEvent(eventData: DataLayerEvent) {
  if (typeof window !== "undefined" && "dataLayer" in window) {
    (window as unknown as { dataLayer: DataLayerEvent[] }).dataLayer.push(
      eventData
    );
  }
}

export function trackNewsletterSignup(location: string, email: string) {
  trackEvent({
    event: "newsletter_signup",
    signup_location: location,
    email_domain: email.split("@")[1],
  });
}

export function trackCtaClick(
  type: "affiliate" | "lead_magnet" | "cta",
  id: string,
  location: string
) {
  trackEvent({
    event: "cta_click",
    cta_type: type,
    cta_id: id,
    cta_location: location,
  });
}
