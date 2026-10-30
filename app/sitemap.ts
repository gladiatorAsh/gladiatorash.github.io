import type { MetadataRoute } from "next";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: "https://www.ashutoshysingh.com/", changeFrequency: "monthly", priority: 1 },
    { url: "https://www.ashutoshysingh.com/learn/mcp/", changeFrequency: "monthly", priority: 0.6 }
  ];
}
