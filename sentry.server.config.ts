import * as Sentry from "@sentry/nextjs";

// Server-side (Node.js runtime) Sentry initialisation. Loaded from
// `instrumentation.ts`. No-ops when NEXT_PUBLIC_SENTRY_DSN is unset.
Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  enabled: Boolean(process.env.NEXT_PUBLIC_SENTRY_DSN),
  environment: process.env.VERCEL_ENV ?? process.env.NODE_ENV,

  // Sample everything in non-production; dial down once traffic is real.
  tracesSampleRate: process.env.NODE_ENV === "production" ? 0.1 : 1.0,

  // Never send request bodies or headers that could carry credentials.
  sendDefaultPii: false,

  debug: false,
});
