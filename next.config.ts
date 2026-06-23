import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.sanity.io",
      },
    ],
  },
  async redirects() {
    return [
      // Specific deprecated /playbooks pages that still hold page-1 rankings get
      // remapped to MATCHING content (not the generic master) so the equity isn't
      // wasted on a topic mismatch. Must come BEFORE the catch-all (first match wins).
      {
        // Ranks ~pos 6 for "follow-up cadence" intent — rebuilt as a real guide.
        source: "/playbooks/7-day-aged-lead-follow-up-cadence",
        destination: "/guides/7-day-aged-lead-follow-up-cadence",
        permanent: true,
      },
      {
        source: "/playbooks/mortgage-rate-shopping-playbook",
        destination: "/lead-types/mortgage-leads",
        permanent: true,
      },
      {
        source: "/playbooks/tracking-aged-lead-roi-metrics",
        destination: "/calculators/roi-calculator",
        permanent: true,
      },

      // Near-duplicate blog posts produced by the (now-disabled) weekly-content
      // cron. Each pair cannibalized the same query; the canonical (older, more
      // comprehensive) post wins and the cron dupe 308-redirects into it. The
      // redirected slugs are unpublished in Sanity so they also drop from the
      // sitemap (scripts/unpublish-duplicate-posts.mjs). Disabled 2026-06-23.
      {
        source: "/blog/aged-lead-budget-allocation-roi-optimization",
        destination: "/blog/aged-lead-budget-allocation-strategy",
        permanent: true,
      },
      {
        source: "/blog/aged-lead-team-training-playbook-managers",
        destination: "/blog/training-aged-lead-sales-team",
        permanent: true,
      },
      {
        source: "/blog/summer-solar-aged-lead-activation-strategy",
        destination: "/blog/summer-solar-sales-aged-leads-q2-strategy",
        permanent: true,
      },

      // Old plural /playbooks routes funnel into the new flagship /playbook master.
      // The 4 old Sanity-backed playbook pages are deprecated in favor of the
      // consolidated "Aged Lead Operator's System" flagship magnet.
      {
        source: "/playbooks",
        destination: "/playbook",
        permanent: true,
      },
      {
        source: "/playbooks/:slug*",
        destination: "/playbook",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
