import { Geist } from "next/font/google";
import "../globals.css";
import { SITE_URL } from "@/lib/site-url";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

export default function EmbedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} bg-white font-sans antialiased dark:bg-zinc-950`}
      >
        <div className="mx-auto max-w-3xl px-4 py-6">
          {children}
          <p className="mt-6 border-t border-zinc-200 pt-4 text-center text-xs text-zinc-400 dark:border-zinc-800">
            Powered by{" "}
            <a
              href={`${SITE_URL}/calculators?utm_source=embed&utm_medium=iframe`}
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400"
            >
              Work Aged Leads
            </a>
          </p>
        </div>
      </body>
    </html>
  );
}
