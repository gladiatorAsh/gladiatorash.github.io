import type { MetadataRoute } from "next";

export const dynamic = "force-static";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Ashutosh Singh — AI Engineer",
    short_name: "Ashutosh",
    start_url: "/",
    display: "standalone",
    background_color: "#0b1120",
    theme_color: "#0b1120",
    description: "Enterprise AI systems, RAG, document intelligence, and agentic workflows.",
    icons: [
      { src: "/android-chrome-192x192.png", sizes: "192x192", type: "image/png" },
      { src: "/android-chrome-384x384.png", sizes: "384x384", type: "image/png" }
    ]
  };
}
