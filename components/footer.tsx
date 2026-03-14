import Link from "next/link";

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
    { name: "About", href: "/about" },
  ],
  "Aged Lead Store": [
    {
      name: "Browse Leads",
      href: "https://agedleadstore.com",
      external: true,
    },
    {
      name: "Create Free Account",
      href: "https://agedleadstore.com/register",
      external: true,
    },
  ],
};

export function Footer() {
  return (
    <footer className="border-t border-zinc-200 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-950">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div className="lg:col-span-1">
            <Link href="/" className="text-lg font-bold text-zinc-900 dark:text-white">
              Aged Lead Store
            </Link>
            <p className="mt-3 text-sm text-zinc-600 dark:text-zinc-400">
              Learn how to grow your sales business with aged leads. Training,
              playbooks, and strategies for insurance agents, mortgage brokers,
              and sales professionals.
            </p>
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
                    {"external" in link && link.external ? (
                      <a
                        href={link.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-zinc-600 transition-colors hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white"
                      >
                        {link.name} ↗
                      </a>
                    ) : (
                      <Link
                        href={link.href}
                        className="text-sm text-zinc-600 transition-colors hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white"
                      >
                        {link.name}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 border-t border-zinc-200 pt-8 dark:border-zinc-800">
          <p className="text-center text-sm text-zinc-500 dark:text-zinc-500">
            &copy; {new Date().getFullYear()} Aged Lead Store. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
