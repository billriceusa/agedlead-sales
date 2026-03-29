import Link from "next/link";

interface CtaBannerProps {
  headline?: string;
  description?: string;
  buttonText?: string;
  buttonHref?: string;
  secondaryText?: string;
  secondaryHref?: string;
  campaign?: string;
  variant?: "default" | "compact";
}

export function CtaBanner({
  headline = "Find the Right Lead Provider",
  description = "Compare providers, check fair market pricing, and calculate your ROI — all with our free tools.",
  buttonText = "Compare Providers",
  buttonHref = "/providers",
  secondaryText = "Check Pricing",
  secondaryHref = "/price-index",
  variant = "default",
}: CtaBannerProps) {
  if (variant === "compact") {
    return (
      <div className="rounded-xl border border-blue-200 bg-blue-50 p-6 dark:border-blue-900 dark:bg-blue-950/50">
        <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-between">
          <div>
            <h3 className="font-semibold text-zinc-900 dark:text-white">
              {headline}
            </h3>
            <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
              {description}
            </p>
          </div>
          <Link
            href={buttonHref}
            className="shrink-0 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-700"
          >
            {buttonText}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <section className="bg-gradient-to-br from-blue-600 to-blue-800 dark:from-blue-800 dark:to-blue-950">
      <div className="mx-auto max-w-4xl px-4 py-16 text-center sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
          {headline}
        </h2>
        <p className="mx-auto mt-4 max-w-2xl text-lg text-blue-100">
          {description}
        </p>
        <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
          <Link
            href={buttonHref}
            className="rounded-lg bg-white px-8 py-3 text-base font-semibold text-blue-700 shadow-lg transition-colors hover:bg-blue-50"
          >
            {buttonText}
          </Link>
          <Link
            href={secondaryHref}
            className="rounded-lg border-2 border-white/30 px-8 py-3 text-base font-semibold text-white transition-colors hover:bg-white/10"
          >
            {secondaryText}
          </Link>
        </div>
      </div>
    </section>
  );
}
