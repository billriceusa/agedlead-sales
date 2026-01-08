export default function Home() {
  const presentations = [
    {
      id: "sample-presentation",
      title: "Sample presentation",
      description: "A sample sales presentation to get you started",
      href: "/presentations/sample-presentation",
    },
  ];

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black">
      <main className="container mx-auto px-4 py-16 max-w-4xl">
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-black dark:text-zinc-50 mb-4">
            Sales presentations
          </h1>
          <p className="text-lg text-zinc-600 dark:text-zinc-400">
            Browse and access your collection of sales presentations and materials.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {presentations.map((presentation) => (
            <a
              key={presentation.id}
              href={presentation.href}
              className="block p-6 bg-white dark:bg-zinc-900 rounded-lg border border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700 transition-colors"
            >
              <h2 className="text-xl font-semibold text-black dark:text-zinc-50 mb-2">
                {presentation.title}
              </h2>
              <p className="text-zinc-600 dark:text-zinc-400">
                {presentation.description}
              </p>
            </a>
          ))}
        </div>
      </main>
    </div>
  );
}
