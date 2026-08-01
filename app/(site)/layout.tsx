import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { AffiliateDisclosure } from "@/components/affiliate-disclosure";
import { GoogleAnalyticsTag, GoogleTagManager } from "@/components/analytics";
import { OutboundTracker } from "@/components/outbound-tracker";
import "../globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  display: "swap",
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://agedleadsales.com";

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    default: "Work Aged Leads: Pricing, Provider Reviews & Playbooks",
    // No brand suffix. Google sources the SERP site name from the WebSite /
    // Organization schema (both declare "Work Aged Leads"), so appending it here
    // was redundant — and its 18 chars pushed 212 of 246 page titles past the
    // ~60-char SERP budget, truncating them. Dropping it brings 182 back in range.
    template: "%s",
  },
  description:
    "Buy aged leads the smart way. Compare 15+ lead providers, see real price benchmarks, and get free playbooks that turn cheap aged leads into closed deals.",
  alternates: {
    canonical: baseUrl,
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "Work Aged Leads",
    url: baseUrl,
    images: [
      {
        url: `/api/og?title=${encodeURIComponent("Work Aged Leads: Pricing, Provider Reviews & Playbooks")}`,
        width: 1200,
        height: 630,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
  },
  icons: {
    icon: [
      { url: "/icon", type: "image/png", sizes: "32x32" },
      { url: "/icon.svg", type: "image/svg+xml" },
    ],
    apple: "/apple-icon",
  },
  verification: {
    google: process.env.NEXT_PUBLIC_GSC_VERIFICATION || undefined,
    other: process.env.NEXT_PUBLIC_BING_VERIFICATION
      ? { "msvalidate.01": process.env.NEXT_PUBLIC_BING_VERIFICATION }
      : undefined,
  },
};

export default function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <GoogleAnalyticsTag />
        <GoogleTagManager />
        <OutboundTracker />
        <div className="flex min-h-screen flex-col">
          <Header />
          <main className="flex-1">{children}</main>
          <AffiliateDisclosure />
          <Footer />
        </div>
      </body>
    </html>
  );
}
