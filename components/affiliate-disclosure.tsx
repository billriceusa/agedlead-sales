export function AffiliateDisclosure() {
  return (
    <div className="border-t border-zinc-200 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-950">
      <div className="mx-auto max-w-7xl px-4 py-3 sm:px-6 lg:px-8">
        <p className="text-center text-xs text-zinc-500">
          <strong>Affiliate Disclosure:</strong> Some providers in our
          directory are affiliate partners. We may earn a commission when you
          visit them through our links. This never affects our ratings or
          recommendations.{" "}
          <a href="/methodology" className="underline hover:text-zinc-700 dark:hover:text-zinc-300">
            See our methodology
          </a>
        </p>
      </div>
    </div>
  );
}
