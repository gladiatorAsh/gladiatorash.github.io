import type { MetadataRoute } from "next";
import { learnPaths } from "@/lib/learn";

export const dynamic = "force-static";

const BASE = "https://www.ashutoshysingh.com";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: `${BASE}/`, changeFrequency: "monthly", priority: 1 },
    { url: `${BASE}/learn/`, changeFrequency: "monthly", priority: 0.7 },
    ...learnPaths.map((p) => ({ url: `${BASE}/learn/${p.slug}/`, changeFrequency: "monthly" as const, priority: 0.6 }))
  ];
}
