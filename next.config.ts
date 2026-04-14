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
