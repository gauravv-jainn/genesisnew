import * as Sentry from "@sentry/nextjs";

/**
 * Next.js instrumentation hook — runs once per server runtime at startup.
 * Sentry's server/edge SDKs must be initialised here rather than at module
 * scope so they load before any application code.
 */
export async function register() {
  if (process.env.NEXT_RUNTIME === "nodejs") {
    await import("./sentry.server.config");
  }

  if (process.env.NEXT_RUNTIME === "edge") {
    await import("./sentry.edge.config");
  }
}

/** Forwards uncaught server-side rendering/route errors to Sentry. */
export const onRequestError = Sentry.captureRequestError;
