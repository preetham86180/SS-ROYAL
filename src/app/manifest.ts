import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "SS Royal Properties & Developers",
    short_name: "SS Royal",
    description:
      "Discover premium properties for sale, rent & investment with SS Royal Properties.",
    start_url: "/",
    display: "standalone",
    background_color: "#0B1120",
    theme_color: "#0B1120",
    orientation: "portrait",
    scope: "/",
    icons: [
      {
        src: "/icon-192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "any maskable",
      },
      {
        src: "/icon-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any maskable",
      },
    ],
    screenshots: [
      {
        src: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=390&q=80",
        sizes: "390x844",
        type: "image/jpeg",
        // @ts-ignore – form_factor is valid but not yet in all TS types
        form_factor: "narrow",
        label: "SS Royal Home Screen",
      },
    ],
    categories: ["real estate", "property", "lifestyle"],
  };
}
