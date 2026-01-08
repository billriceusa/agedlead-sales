export default async function PresentationPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  // This is a sample presentation structure
  // You can customize this based on your needs
  const presentationContent: Record<string, { title: string; slides: string[] }> = {
    "sample-presentation": {
      title: "Sample presentation",
      slides: [
        "Welcome to our sales presentation",
        "Our products and services",
        "Key benefits and features",
        "Pricing and packages",
        "Next steps and call to action",
      ],
    },
  };

  const presentation = presentationContent[slug] || {
    title: "Presentation not found",
    slides: [],
  };

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black">
      <main className="container mx-auto px-4 py-16 max-w-4xl">
        <a
          href="/"
          className="inline-flex items-center text-zinc-600 dark:text-zinc-400 hover:text-black dark:hover:text-zinc-50 mb-8"
        >
          ← Back to presentations
        </a>

        <div className="bg-white dark:bg-zinc-900 rounded-lg border border-zinc-200 dark:border-zinc-800 p-8">
          <h1 className="text-3xl font-bold text-black dark:text-zinc-50 mb-8">
            {presentation.title}
          </h1>

          <div className="space-y-6">
            {presentation.slides.map((slide, index) => (
              <div
                key={index}
                className="p-6 bg-zinc-50 dark:bg-zinc-800 rounded-lg border border-zinc-200 dark:border-zinc-700"
              >
                <div className="flex items-center gap-3 mb-2">
                  <span className="flex items-center justify-center w-8 h-8 rounded-full bg-black dark:bg-zinc-700 text-white dark:text-zinc-50 text-sm font-semibold">
                    {index + 1}
                  </span>
                  <h2 className="text-xl font-semibold text-black dark:text-zinc-50">
                    Slide {index + 1}
                  </h2>
                </div>
                <p className="text-zinc-700 dark:text-zinc-300 ml-11">
                  {slide}
                </p>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
