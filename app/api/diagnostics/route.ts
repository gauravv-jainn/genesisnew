import { timingSafeEqual } from "node:crypto";

import * as Sentry from "@sentry/nextjs";
import { NextResponse } from "next/server";
import { z } from "zod";

import { recordAuditLog, requestContext } from "@/lib/audit";
import { isDatabaseConfigured, pingDatabase } from "@/lib/db";
import { isAuth0Configured } from "@/lib/auth0";
import { isPlaceholder, sentryConfigured, upstashConfigured } from "@/lib/env";
import { isDriveConfigured, verifyDriveAccess } from "@/lib/google-drive";

/**
 * Phase 0 verification endpoint.
 *
 * Runs every "definition of done" check in one request so the infrastructure
 * can be validated the moment real credentials land:
 *   - the database is reachable
 *   - a write to `audit_logs` succeeds
 *   - the Google Drive service account authenticates
 *   - Sentry is receiving events
 *
 * Gated by a shared secret because it writes to the database and reveals
 * configuration state. Never exposed unauthenticated.
 */

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const querySchema = z.object({
  // `?sentry=throw` deliberately reports a test error to Sentry.
  sentry: z.enum(["throw"]).optional(),
});

/** Constant-time token comparison — avoids leaking the secret by timing. */
function tokenMatches(provided: string | null, expected: string): boolean {
  if (!provided) return false;

  const a = Buffer.from(provided);
  const b = Buffer.from(expected);
  if (a.length !== b.length) return false;

  return timingSafeEqual(a, b);
}

type CheckStatus = "ok" | "failed" | "skipped";

type Check = {
  status: CheckStatus;
  detail?: string;
  [key: string]: unknown;
};

export async function GET(request: Request) {
  const expectedToken = process.env.DIAGNOSTICS_TOKEN;

  // Refuse to run at all if the gate itself is unset or still a placeholder —
  // otherwise the endpoint would be effectively public.
  if (isPlaceholder(expectedToken)) {
    return NextResponse.json(
      {
        error:
          "DIAGNOSTICS_TOKEN is not set. Generate one with `openssl rand -hex 32`.",
      },
      { status: 503 },
    );
  }

  if (!tokenMatches(request.headers.get("x-diagnostics-token"), expectedToken!)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const parsedQuery = querySchema.safeParse(
    Object.fromEntries(new URL(request.url).searchParams),
  );
  if (!parsedQuery.success) {
    return NextResponse.json(
      { error: "Invalid query", issues: parsedQuery.error.issues },
      { status: 400 },
    );
  }

  const checks: Record<string, Check> = {};

  // --- Database -----------------------------------------------------------
  if (!isDatabaseConfigured()) {
    checks.database = { status: "skipped", detail: "DATABASE_URL not set" };
    checks.auditLogWrite = { status: "skipped", detail: "database not configured" };
  } else {
    try {
      await pingDatabase();
      checks.database = { status: "ok" };
    } catch (error) {
      checks.database = {
        status: "failed",
        detail: error instanceof Error ? error.message : String(error),
      };
    }

    // --- audit_logs write -------------------------------------------------
    if (checks.database.status === "ok") {
      const written = await recordAuditLog({
        action: "diagnostics.run",
        entity: "system",
        metadata: { source: "/api/diagnostics" },
        ...requestContext(request),
      });
      checks.auditLogWrite = written
        ? { status: "ok" }
        : { status: "failed", detail: "insert into audit_logs failed" };
    } else {
      checks.auditLogWrite = {
        status: "skipped",
        detail: "database unreachable",
      };
    }
  }

  // --- Google Drive -------------------------------------------------------
  if (!isDriveConfigured()) {
    checks.googleDrive = {
      status: "skipped",
      detail: "GOOGLE_SERVICE_ACCOUNT_JSON not set",
    };
  } else {
    const result = await verifyDriveAccess();
    checks.googleDrive = result.ok
      ? {
          status: "ok",
          serviceAccountEmail: result.serviceAccountEmail,
          rootFolderName: result.rootFolderName,
        }
      : { status: "failed", detail: result.error };
  }

  // --- Sentry -------------------------------------------------------------
  if (!sentryConfigured()) {
    checks.sentry = {
      status: "skipped",
      detail: "NEXT_PUBLIC_SENTRY_DSN not set",
    };
  } else if (parsedQuery.data.sentry === "throw") {
    const eventId = Sentry.captureException(
      new Error("Genesis diagnostics: test error (intentional)"),
      { tags: { subsystem: "diagnostics" } },
    );
    await Sentry.flush(2000);
    checks.sentry = {
      status: "ok",
      detail: "test error sent",
      eventId,
    };
  } else {
    checks.sentry = {
      status: "ok",
      detail: "DSN configured; add ?sentry=throw to send a test error",
    };
  }

  // --- Auth0 / rate limiting (configuration reporting only) ---------------
  checks.auth0 = isAuth0Configured()
    ? { status: "ok", detail: "credentials present; verify via /insider" }
    : { status: "skipped", detail: "Auth0 credentials not set" };

  checks.rateLimiter = upstashConfigured()
    ? { status: "ok", detail: "Upstash Redis" }
    : {
        status: "skipped",
        detail: "in-memory fallback — per-instance only, not production-safe",
      };

  const failed = Object.values(checks).some((check) => check.status === "failed");

  return NextResponse.json(
    {
      ok: !failed,
      environment: process.env.VERCEL_ENV ?? process.env.NODE_ENV,
      checks,
    },
    {
      status: failed ? 500 : 200,
      headers: { "Cache-Control": "no-store" },
    },
  );
}
