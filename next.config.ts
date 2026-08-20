import { withSentryConfig } from "@sentry/nextjs";
import type { NextConfig } from "next";

import { securityHeaders } from "./lib/security-headers";

const nextConfig: NextConfig = {
  reactStrictMode: true,

  // `googleapis` is a very large CJS package that should not be traced into
  // the serverless bundle; Next loads it from node_modules at runtime instead.
  serverExternalPackages: ["googleapis"],

  images: {
    /**
     * YouTube still frames for the journal's video-linked articles. Scoped to
     * the thumbnail host only — a permissive pattern here would let any URL
     * in the app become an optimisation request against arbitrary origins.
     */
    remotePatterns: [
      { protocol: "https", hostname: "i.ytimg.com", pathname: "/vi/**" },
    ],
  },

  async headers() {
    return [
      {
        // Applies to every route, including static assets and API handlers.
        source: "/:path*",
        headers: [...securityHeaders],
      },
    ];
  },
};

/**
 * Sentry wraps the config to upload source maps at build time and instrument
 * the server. Source map upload is skipped automatically when
 * SENTRY_AUTH_TOKEN is absent, so local builds work without Sentry set up.
 */
export default withSentryConfig(nextConfig, {
  org: process.env.SENTRY_ORG,
  project: process.env.SENTRY_PROJECT,
  authToken: process.env.SENTRY_AUTH_TOKEN,

  // Quiet unless there is something actionable; CI logs stay readable.
  silent: !process.env.CI,

  // Upload source maps for the client bundle but do not ship them publicly.
  widenClientFileUpload: true,
  sourcemaps: {
    deleteSourcemapsAfterUpload: true,
  },

  // NOTE: `disableLogger` is deliberately omitted. It is deprecated in favour
  // of `webpack.treeshake.removeDebugLogging`, which has no effect under
  // Turbopack — the default bundler in Next 16. Setting either one only emits
  // a deprecation warning on every build without shrinking the bundle.
});
