import * as Sentry from "@sentry/nextjs";

// Edge runtime Sentry initialisation. Loaded from `instrumentation.ts`.
// Next 16's proxy runs on Node, but route handlers may opt into edge.
Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  enabled: Boolean(process.env.NEXT_PUBLIC_SENTRY_DSN),
  environment: process.env.VERCEL_ENV ?? process.env.NODE_ENV,
  tracesSampleRate: process.env.NODE_ENV === "production" ? 0.1 : 1.0,
  sendDefaultPii: false,
  debug: false,
});
