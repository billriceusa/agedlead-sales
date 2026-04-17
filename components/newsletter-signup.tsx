"use client";

import { useState, type FormEvent } from "react";
import { trackNewsletterSignup } from "./analytics";
import { HoneypotInput } from "./honeypot-input";

interface NewsletterSignupProps {
  variant?: "inline" | "card" | "banner";
  heading?: string;
  description?: string;
  buttonText?: string;
  context?: string;
}

export function NewsletterSignup({
  variant = "card",
  heading = "Get Smarter About Aged Leads",
  description = "Weekly strategies, scripts, and insights for sales professionals. Free, no spam, unsubscribe anytime.",
  buttonText = "Subscribe",
  context = "default",
}: NewsletterSignupProps) {
  const [email, setEmail] = useState("");
  const [website, setWebsite] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setStatus("loading");
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, website }),
      });

      if (res.ok) {
        setStatus("success");
        setMessage("You're in! Check your email for a welcome message.");
        trackNewsletterSignup(context, email);
        setEmail("");
      } else {
        const data = await res.json();
        setStatus("error");
        setMessage(data.error || "Something went wrong. Please try again.");
      }
    } catch {
      setStatus("error");
      setMessage("Something went wrong. Please try again.");
    }
  };

  if (variant === "inline") {
    return (
      <form onSubmit={handleSubmit} className="flex items-center gap-2">
        <HoneypotInput value={website} onChange={setWebsite} />
        <input
          type="email"
          placeholder="Your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="flex-1 rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 placeholder-zinc-400 focus:border-blue-500 focus:outline-none dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"
          disabled={status === "loading" || status === "success"}
        />
        <button
          type="submit"
          disabled={status === "loading" || status === "success"}
          className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-blue-700 disabled:opacity-50"
        >
          {status === "loading" ? "..." : status === "success" ? "Done!" : buttonText}
        </button>
      </form>
    );
  }

  if (variant === "banner") {
    return (
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 dark:from-blue-800 dark:to-blue-950">
        <div className="mx-auto max-w-4xl px-4 py-12 text-center sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-white sm:text-3xl">{heading}</h2>
          <p className="mx-auto mt-3 max-w-xl text-blue-100">{description}</p>
          {status === "success" ? (
            <p className="mt-6 text-lg font-medium text-white">{message}</p>
          ) : (
            <form
              onSubmit={handleSubmit}
              className="mx-auto mt-6 flex max-w-md flex-col gap-3 sm:flex-row"
            >
              <HoneypotInput value={website} onChange={setWebsite} />
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="flex-1 rounded-lg border-0 bg-white/10 px-4 py-3 text-white placeholder-blue-200 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-white/50"
                disabled={status === "loading"}
              />
              <button
                type="submit"
                disabled={status === "loading"}
                className="rounded-lg bg-white px-6 py-3 font-semibold text-blue-700 transition-colors hover:bg-blue-50 disabled:opacity-50"
              >
                {status === "loading" ? "Subscribing..." : buttonText}
              </button>
            </form>
          )}
          {status === "error" && (
            <p className="mt-3 text-sm text-red-200">{message}</p>
          )}
        </div>
      </section>
    );
  }

  return (
    <div className="rounded-xl border border-zinc-200 bg-zinc-50 p-6 dark:border-zinc-800 dark:bg-zinc-900">
      <h3 className="text-lg font-semibold text-zinc-900 dark:text-white">
        {heading}
      </h3>
      <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
        {description}
      </p>
      {status === "success" ? (
        <p className="mt-4 text-sm font-medium text-green-600 dark:text-green-400">
          {message}
        </p>
      ) : (
        <form onSubmit={handleSubmit} className="mt-4 flex flex-col gap-3 sm:flex-row">
          <HoneypotInput value={website} onChange={setWebsite} />
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="flex-1 rounded-lg border border-zinc-300 bg-white px-4 py-2.5 text-sm text-zinc-900 placeholder-zinc-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"
            disabled={status === "loading"}
          />
          <button
            type="submit"
            disabled={status === "loading"}
            className="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-700 disabled:opacity-50"
          >
            {status === "loading" ? "Subscribing..." : buttonText}
          </button>
        </form>
      )}
      {status === "error" && (
        <p className="mt-2 text-sm text-red-600 dark:text-red-400">{message}</p>
      )}
    </div>
  );
}
