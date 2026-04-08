import Link from "next/link";
import { NewsletterSignup } from "./newsletter-signup";

const footerLinks = {
  "Lead Types": [
    { name: "Mortgage Leads", href: "/lead-types/mortgage-leads" },
    { name: "Insurance Leads", href: "/lead-types/insurance-leads" },
    { name: "Final Expense Leads", href: "/lead-types/final-expense-leads" },
    { name: "IUL Leads", href: "/lead-types/iul-leads" },
    { name: "All Lead Types", href: "/lead-types" },
  ],
  Resources: [
    { name: "Blog", href: "/blog" },
    { name: "Playbooks", href: "/playbooks" },
    { name: "Glossary", href: "/glossary" },
    { name: "Guides", href: "/guides" },
    { name: "Calculators", href: "/calculators" },
    { name: "Newsletter", href: "/newsletter" },
    { name: "About", href: "/about" },
    { name: "Contact", href: "/contact" },
  ],
  "Lead Marketwatch": [
    { name: "Provider Directory", href: "/providers" },
    { name: "Price Index", href: "/price-index" },
    { name: "Know Your CPL", href: "/calculators/know-your-cpl" },
    { name: "Our Methodology", href: "/methodology" },
  ],
};

export function Footer() {
  return (
    <footer className="border-t border-zinc-200 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-950">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-5">
          {/* Brand + Newsletter */}
          <div className="lg:col-span-2">
            <Link
              href="/"
              className="text-lg font-bold text-zinc-900 dark:text-white"
            >
              Aged Lead Sales
            </Link>
            <p className="mt-3 text-sm text-zinc-600 dark:text-zinc-400">
              The independent lead buying intelligence platform. Compare
              providers, benchmark pricing, and make informed decisions about
              your lead spend.
            </p>
            <div className="mt-6">
              <NewsletterSignup
                variant="inline"
                context="footer"
                buttonText="Join"
              />
            </div>
          </div>

          {/* Link columns */}
          {Object.entries(footerLinks).map(([heading, links]) => (
            <div key={heading}>
              <h3 className="text-sm font-semibold uppercase tracking-wider text-zinc-900 dark:text-white">
                {heading}
              </h3>
              <ul className="mt-3 space-y-2">
                {links.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="text-sm text-zinc-600 transition-colors hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 border-t border-zinc-200 pt-8 dark:border-zinc-800">
          <div className="mb-4 flex flex-wrap justify-center gap-x-6 gap-y-2">
            <Link
              href="/editorial-process"
              className="text-sm text-zinc-500 transition-colors hover:text-zinc-700 dark:hover:text-zinc-300"
            >
              Editorial Process
            </Link>
            <Link
              href="/affiliate-disclosure"
              className="text-sm text-zinc-500 transition-colors hover:text-zinc-700 dark:hover:text-zinc-300"
            >
              Affiliate Disclosure
            </Link>
            <Link
              href="/privacy"
              className="text-sm text-zinc-500 transition-colors hover:text-zinc-700 dark:hover:text-zinc-300"
            >
              Privacy Policy
            </Link>
            <Link
              href="/terms"
              className="text-sm text-zinc-500 transition-colors hover:text-zinc-700 dark:hover:text-zinc-300"
            >
              Terms of Service
            </Link>
          </div>
          <p className="text-center text-sm text-zinc-500 dark:text-zinc-500">
            &copy; {new Date().getFullYear()} Aged Lead Sales. All rights
            reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
