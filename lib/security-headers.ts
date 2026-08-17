/**
 * Security headers applied to every response.
 *
 * Kept in one place and consumed from `next.config.ts` so the policy is
 * defined once. This module must stay dependency-free and importable from
 * the Next config (which is evaluated outside the app runtime).
 */

const isDev = process.env.NODE_ENV === "development";

/**
 * Content-Security-Policy.
 *
 * KNOWN LIMITATION — `script-src` includes `'unsafe-inline'`. Next.js inlines
 * its hydration/bootstrap payload in `<script>` tags, so a nonce-free policy
 * has to allow inline scripts. Eliminating it requires nonce injection at the
 * proxy layer, which conflicts with the Auth0 proxy owning the response for
 * every request (see PROGRESS.md → Hardening follow-ups). The policy still
 * meaningfully constrains *origins*: no third-party scripts, no framing, no
 * plugins, no off-site form posts.
 */
function contentSecurityPolicy(): string {
  const directives: Record<string, string[]> = {
    "default-src": ["'self'"],
    "base-uri": ["'self'"],
    "object-src": ["'none'"],
    "frame-ancestors": ["'none'"],
    "form-action": ["'self'"],
    // 'unsafe-eval' is required by the dev-mode React refresh runtime only.
    "script-src": ["'self'", "'unsafe-inline'", ...(isDev ? ["'unsafe-eval'"] : [])],
    // Tailwind and Framer Motion both write inline style attributes.
    "style-src": ["'self'", "'unsafe-inline'"],
    "img-src": ["'self'", "data:", "blob:", "https:"],
    "font-src": ["'self'", "data:"],
    "media-src": ["'self'", "https:"],
    "worker-src": ["'self'", "blob:"],
    "manifest-src": ["'self'"],
    "connect-src": [
      "'self'",
      // Sentry ingest (region-specific subdomains).
      "https://*.ingest.sentry.io",
      "https://*.ingest.us.sentry.io",
      "https://*.ingest.de.sentry.io",
      // Auth0 tenant endpoints.
      "https://*.auth0.com",
      // Vercel Analytics posts same-origin via /_vercel/insights, but Speed
      // Insights reports to this host.
      "https://vitals.vercel-insights.com",
      // Dev server websocket for hot reload.
      ...(isDev ? ["ws:", "http://localhost:*"] : []),
    ],
  };

  const policy = Object.entries(directives)
    .map(([directive, values]) => `${directive} ${values.join(" ")}`)
    .join("; ");

  // Only meaningful over HTTPS; harmless locally.
  return isDev ? policy : `${policy}; upgrade-insecure-requests`;
}

export const securityHeaders = [
  {
    key: "Content-Security-Policy",
    value: contentSecurityPolicy(),
  },
  {
    // 2 years, matching the HSTS preload list requirement.
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
  {
    // Redundant with `frame-ancestors` above, kept for older browsers.
    key: "X-Frame-Options",
    value: "DENY",
  },
  {
    key: "X-Content-Type-Options",
    value: "nosniff",
  },
  {
    key: "Referrer-Policy",
    value: "strict-origin-when-cross-origin",
  },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), payment=(), usb=()",
  },
  {
    key: "Cross-Origin-Opener-Policy",
    value: "same-origin",
  },
  {
    key: "X-DNS-Prefetch-Control",
    value: "on",
  },
] as const;
