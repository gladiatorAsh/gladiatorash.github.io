import type { MetadataRoute } from "next";
import { learnPaths } from "@/lib/learn";
import { caseStudies } from "@/lib/work";

export const dynamic = "force-static";

const BASE = "https://www.ashutoshysingh.com";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: `${BASE}/`, changeFrequency: "monthly", priority: 1 },
    { url: `${BASE}/learn/`, changeFrequency: "monthly", priority: 0.7 },
    { url: `${BASE}/play/`, changeFrequency: "daily", priority: 0.4 },
    { url: `${BASE}/work/`, changeFrequency: "monthly", priority: 0.8 },
    ...caseStudies.map((c) => ({ url: `${BASE}/work/${c.slug}/`, changeFrequency: "monthly" as const, priority: 0.8 })),
    { url: `${BASE}/news/`, changeFrequency: "daily", priority: 0.5 },
    ...learnPaths.map((p) => ({ url: `${BASE}/learn/${p.slug}/`, changeFrequency: "monthly" as const, priority: 0.6 }))
  ];
}
