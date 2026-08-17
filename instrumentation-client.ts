import * as Sentry from "@sentry/nextjs";

// Browser-side Sentry initialisation. Next.js loads this file automatically
// on the client (the successor to `sentry.client.config.ts`).
Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  enabled: Boolean(process.env.NEXT_PUBLIC_SENTRY_DSN),
  environment: process.env.NEXT_PUBLIC_VERCEL_ENV ?? process.env.NODE_ENV,

  tracesSampleRate: process.env.NODE_ENV === "production" ? 0.1 : 1.0,

  // Session Replay stays off for now — it records user sessions and needs a
  // privacy review plus a decision on the cookie/consent banner first.
  replaysSessionSampleRate: 0,
  replaysOnErrorSampleRate: 0,

  sendDefaultPii: false,
  debug: false,
});

/** Instruments client-side navigations for tracing. */
export const onRouterTransitionStart = Sentry.captureRouterTransitionStart;
