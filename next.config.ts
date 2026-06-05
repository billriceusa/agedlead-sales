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
