import type { MetadataRoute } from "next";
import { TOOLS, toolPath } from "@/lib/content/tools";
import { PLATFORM_LIST } from "@/lib/platforms/catalog";
import { absoluteUrl } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return [
    { url: absoluteUrl("/"), lastModified: now, changeFrequency: "weekly", priority: 1 },
    ...PLATFORM_LIST.map((p) => ({ url: absoluteUrl(`/${p.id}`), lastModified: now, changeFrequency: "weekly" as const, priority: 0.9 })),
    ...TOOLS.map((t) => ({ url: absoluteUrl(toolPath(t)), lastModified: now, changeFrequency: "monthly" as const, priority: 0.8 })),
    ...["/about", "/contact", "/privacy", "/terms"].map((path) => ({ url: absoluteUrl(path), lastModified: now, changeFrequency: "yearly" as const, priority: 0.3 })),
  ];
}
