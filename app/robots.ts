import type { MetadataRoute } from "next";

import { siteConfig } from "@/lib/site-config";

/**
 * Crawl rules.
 *
 * `/insider` is authenticated, `/style-guide` is a dev-only workbench that
 * 404s in production anyway, and `/api` has nothing worth indexing — the
 * diagnostics route is token-gated. Blocking them keeps internal surfaces out
 * of results even if a URL leaks.
 */
export default function robots(): MetadataRoute.Robots {
  const base = process.env.APP_BASE_URL ?? siteConfig.url;

  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/insider", "/style-guide", "/api/"],
    },
    sitemap: `${base}/sitemap.xml`,
  };
}
