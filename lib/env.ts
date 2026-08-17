import "server-only";

import { z } from "zod";

/**
 * Environment access for server-side code.
 *
 * Validation is *lazy and feature-scoped* rather than one eager top-level
 * parse. Two reasons:
 *
 *  1. `next build` must succeed before real credentials exist. An eager parse
 *     at import time would fail the build on a machine that only has
 *     placeholders.
 *  2. A missing Sentry DSN should not take down database access. Each
 *     subsystem validates only the variables it actually needs, and reports
 *     precisely which ones are missing.
 *
 * Client-side code must never import this module — `server-only` enforces it
 * at build time. Browser-visible config goes through `NEXT_PUBLIC_*` and is
 * read directly where used.
 */

/**
 * Values shipped as placeholders in `.env.example` / `.env.local`.
 * `REPLACE_ME` is the explicit sentinel; the rest catch the illustrative
 * sample values so a half-filled environment is never mistaken for a real one.
 */
const PLACEHOLDER_PATTERNS = [
  /^$/,
  /REPLACE_ME/,
  /^placeholder/i,
  /^your-/i,
  /^0{32,}$/,
  /USER:PASSWORD/i,
  /examplePublicKey/,
];

/** True when a value is absent or is still one of the shipped placeholders. */
export function isPlaceholder(value: string | undefined): boolean {
  if (value === undefined) return true;
  return PLACEHOLDER_PATTERNS.some((pattern) => pattern.test(value));
}

class MissingEnvError extends Error {
  constructor(subsystem: string, issues: string[]) {
    super(
      `[env] ${subsystem} is not configured. Fix these environment variables:\n` +
        issues.map((issue) => `  - ${issue}`).join("\n") +
        `\n\nSee .env.example for the expected format.`,
    );
    this.name = "MissingEnvError";
  }
}

/**
 * Parses `schema` against `process.env`, caching the result so repeated calls
 * are free. Throws a `MissingEnvError` naming the offending variables.
 */
function lazyEnv<T extends z.ZodType>(subsystem: string, schema: T) {
  let cached: z.infer<T> | undefined;

  return (): z.infer<T> => {
    if (cached !== undefined) return cached;

    const parsed = schema.safeParse(process.env);
    if (!parsed.success) {
      throw new MissingEnvError(
        subsystem,
        parsed.error.issues.map(
          (issue) => `${issue.path.join(".") || "(root)"}: ${issue.message}`,
        ),
      );
    }

    cached = parsed.data;
    return cached;
  };
}

const required = (name: string) =>
  z
    .string()
    .min(1, `${name} is required`)
    .refine((value) => !isPlaceholder(value), {
      message: `${name} is still set to a placeholder value`,
    });

// --- Database --------------------------------------------------------------

export const dbEnv = lazyEnv(
  "Neon/Postgres",
  z.object({
    DATABASE_URL: required("DATABASE_URL").refine(
      (url) => !/\bsslmode=disable\b/.test(url),
      { message: "DATABASE_URL must not disable TLS (sslmode=disable)" },
    ),
  }),
);

// --- Auth0 -----------------------------------------------------------------

export const auth0Env = lazyEnv(
  "Auth0",
  z.object({
    AUTH0_DOMAIN: required("AUTH0_DOMAIN"),
    AUTH0_CLIENT_ID: required("AUTH0_CLIENT_ID"),
    AUTH0_CLIENT_SECRET: required("AUTH0_CLIENT_SECRET"),
    AUTH0_SECRET: required("AUTH0_SECRET").refine(
      (value) => /^[0-9a-f]{64}$/i.test(value),
      { message: "AUTH0_SECRET must be 32 bytes hex — `openssl rand -hex 32`" },
    ),
  }),
);

/** Namespaced custom claim an Auth0 Action writes roles into. */
export const AUTH0_ROLES_CLAIM =
  process.env.AUTH0_ROLES_CLAIM || "https://genesismedia.co/roles";

// --- Google Drive ----------------------------------------------------------

export const driveEnv = lazyEnv(
  "Google Drive",
  z.object({
    GOOGLE_SERVICE_ACCOUNT_JSON: required("GOOGLE_SERVICE_ACCOUNT_JSON"),
    GOOGLE_DRIVE_ROOT_FOLDER_ID: z.string().optional(),
  }),
);

// --- Diagnostics -----------------------------------------------------------

export const diagnosticsEnv = lazyEnv(
  "Diagnostics endpoint",
  z.object({
    DIAGNOSTICS_TOKEN: required("DIAGNOSTICS_TOKEN"),
  }),
);

// --- Optional subsystems ---------------------------------------------------
// These degrade rather than throw: the app must run without them.

export const sentryConfigured = () =>
  !isPlaceholder(process.env.NEXT_PUBLIC_SENTRY_DSN);

export const upstashConfigured = () =>
  !isPlaceholder(process.env.UPSTASH_REDIS_REST_URL) &&
  !isPlaceholder(process.env.UPSTASH_REDIS_REST_TOKEN);

export const isProduction = process.env.NODE_ENV === "production";
