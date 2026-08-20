import type { MetadataRoute } from "next";

import { getAllPosts } from "@/lib/blog";
import { siteConfig } from "@/lib/site-config";

/**
 * Sitemap.
 *
 * Only public, indexable routes. Blog entries come from the same MDX loader
 * the pages use, which already excludes drafts in production — so an
 * unpublished post can never be advertised here.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const base = process.env.APP_BASE_URL ?? siteConfig.url;
  const now = new Date();

  const routes: MetadataRoute.Sitemap = [
    { url: `${base}/`, lastModified: now, changeFrequency: "weekly", priority: 1 },
    { url: `${base}/our-work`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: `${base}/content-creation`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${base}/influencer-campaigns`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${base}/creator`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${base}/careers`, lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    { url: `${base}/blog`, lastModified: now, changeFrequency: "weekly", priority: 0.8 },
  ];

  for (const post of getAllPosts()) {
    routes.push({
      url: `${base}/blog/${post.slug}`,
      lastModified: new Date(post.date),
      changeFrequency: "yearly",
      priority: 0.6,
    });
  }

  return routes;
}
