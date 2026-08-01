import type { Metadata } from "next";
import { ContactForm } from "./contact-form";
import { JsonLd, breadcrumbJsonLd } from "@/components/json-ld";

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://agedleadsales.com";

export const metadata: Metadata = {
  title: "Contact — Work Aged Leads",
  description:
    "Have a question about aged leads, need help choosing a provider, or want to discuss a partnership? Get in touch with Bill Rice.",
  alternates: { canonical: `${baseUrl}/contact` },
};

export default function ContactPage() {
  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", url: baseUrl },
          { name: "Contact", url: `${baseUrl}/contact` },
        ])}
      />

      <section className="bg-white py-16 dark:bg-zinc-950">
        <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold text-zinc-900 dark:text-white">
            Contact
          </h1>
          <p className="mt-4 text-lg text-zinc-600 dark:text-zinc-400">
            Have a question about aged leads, need help choosing a provider, or
            want to discuss a partnership? I typically respond within 1-2
            business days.
          </p>

          <div className="mt-10">
            <ContactForm />
          </div>

          <div className="mt-12 rounded-xl border border-zinc-200 bg-zinc-50 p-6 dark:border-zinc-800 dark:bg-zinc-900">
            <h2 className="text-lg font-semibold text-zinc-900 dark:text-white">
              Other ways to connect
            </h2>
            <ul className="mt-4 space-y-3 text-sm text-zinc-600 dark:text-zinc-400">
              <li>
                <span className="font-medium text-zinc-900 dark:text-white">
                  Email:{" "}
                </span>
                <a
                  href="mailto:bill@agedleadsales.com"
                  className="text-blue-600 hover:text-blue-700 dark:text-blue-400"
                >
                  bill@agedleadsales.com
                </a>
              </li>
              <li>
                <span className="font-medium text-zinc-900 dark:text-white">
                  LinkedIn:{" "}
                </span>
                <a
                  href="https://www.linkedin.com/in/billrice/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-700 dark:text-blue-400"
                >
                  linkedin.com/in/billrice
                </a>
              </li>
            </ul>
          </div>
        </div>
      </section>
    </>
  );
}
