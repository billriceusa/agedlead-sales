import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Aged Lead Sales",
    short_name: "AgedLeadSales",
    description:
      "Sales training, playbooks, and strategies for working aged leads in insurance, mortgage, and more.",
    start_url: "/",
    display: "browser",
    background_color: "#ffffff",
    theme_color: "#2563eb",
    icons: [
      {
        src: "/icon",
        sizes: "32x32",
        type: "image/png",
      },
      {
        src: "/icon.svg",
        sizes: "any",
        type: "image/svg+xml",
      },
    ],
  };
}
