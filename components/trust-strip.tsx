import Link from "next/link";

// Real E-E-A-T trust signals for the homepage hero. Every claim is one the site
// already states elsewhere and links to the page that backs it up — no
// fabricated counts, no testimonials. Intentionally avoids "Join N subscribers"
// framing while the audience is still small.
const SIGNALS: { label: string; href: string }[] = [
  { label: "30+ years of lead-gen expertise", href: "/about/bill-rice" },
  { label: "Independent provider reviews", href: "/methodology" },
  { label: "Human-reviewed content", href: "/editorial-process" },
  { label: "Transparent affiliate disclosure", href: "/affiliate-disclosure" },
];

function CheckIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-4 w-4 shrink-0 text-blue-400"
    >
      <path d="M20 6 9 17l-5-5" />
    </svg>
  );
}

export function TrustStrip({ className = "" }: { className?: string }) {
  return (
    <ul
      className={`flex flex-wrap items-center gap-x-6 gap-y-3 text-sm text-zinc-300 ${className}`}
    >
      {SIGNALS.map((s) => (
        <li key={s.href}>
          <Link
            href={s.href}
            className="inline-flex items-center gap-2 transition-colors hover:text-white"
          >
            <CheckIcon />
            {s.label}
          </Link>
        </li>
      ))}
    </ul>
  );
}
