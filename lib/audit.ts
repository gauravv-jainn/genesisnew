import "server-only";

import * as Sentry from "@sentry/nextjs";

import { getPrisma, isDatabaseConfigured } from "./db";

/**
 * Append-only audit trail.
 *
 * Nothing beyond auth events writes here in Phase 0, but the table and this
 * helper exist now so the Workspace build (clients/projects/invoices) can
 * start recording immediately without a schema migration.
 */

export type AuditEntry = {
  /** Dotted verb: `auth.login`, `contact.submitted`, `insider.denied`. */
  action: string;
  /** Entity type the action applies to: `user`, `contact_submission`. */
  entity: string;
  entityId?: string;
  /** Local `User.id`, when the actor is a known user. */
  actorId?: string;
  /** Auth0 `sub`, retained even if the user row is later deleted. */
  actorSub?: string;
  metadata?: Record<string, unknown>;
  ipAddress?: string;
  userAgent?: string;
};

/**
 * Writes an audit entry, returning whether it persisted.
 *
 * Deliberately non-throwing: an audit write must never break the request that
 * triggered it (a failed insert here would otherwise block a user's login).
 * Failures are reported to Sentry so they stay visible rather than silent.
 */
export async function recordAuditLog(entry: AuditEntry): Promise<boolean> {
  if (!isDatabaseConfigured()) return false;

  try {
    await getPrisma().auditLog.create({
      data: {
        action: entry.action,
        entity: entry.entity,
        entityId: entry.entityId ?? null,
        actorId: entry.actorId ?? null,
        actorSub: entry.actorSub ?? null,
        metadata: (entry.metadata ?? undefined) as never,
        ipAddress: entry.ipAddress ?? null,
        userAgent: entry.userAgent ?? null,
      },
    });
    return true;
  } catch (error) {
    Sentry.captureException(error, {
      tags: { subsystem: "audit" },
      extra: { action: entry.action, entity: entry.entity },
    });
    return false;
  }
}

/**
 * Pulls the client IP and user agent off a request for audit records.
 * On Vercel the client IP arrives in `x-forwarded-for`; we take the first
 * entry, which is the original client rather than an intermediate proxy.
 */
export function requestContext(request: Request): {
  ipAddress?: string;
  userAgent?: string;
} {
  const forwarded = request.headers.get("x-forwarded-for");
  return {
    ipAddress:
      forwarded?.split(",")[0]?.trim() ||
      request.headers.get("x-real-ip") ||
      undefined,
    userAgent: request.headers.get("user-agent") ?? undefined,
  };
}
