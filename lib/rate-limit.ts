import "server-only";

import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

import { upstashConfigured } from "./env";

/**
 * Rate limiting for public-facing forms (contact, waitlist).
 *
 * Upstash Redis is the real limiter — it is shared across Vercel's serverless
 * instances, which an in-process counter cannot be. The in-memory fallback
 * exists only so local development works without Redis credentials; it is
 * per-instance and therefore NOT sufficient protection in production.
 */

export type RateLimitResult = {
  success: boolean;
  limit: number;
  remaining: number;
  /** Unix ms when the current window resets. */
  reset: number;
  /** True when the weak per-instance fallback served this decision. */
  degraded: boolean;
};

const WINDOW_SECONDS = 60;
const MAX_REQUESTS = 5;

let upstashLimiter: Ratelimit | undefined;

function getUpstashLimiter(): Ratelimit | null {
  if (!upstashConfigured()) return null;
  if (!upstashLimiter) {
    upstashLimiter = new Ratelimit({
      redis: Redis.fromEnv(),
      limiter: Ratelimit.slidingWindow(MAX_REQUESTS, `${WINDOW_SECONDS} s`),
      analytics: true,
      prefix: "genesis:ratelimit",
    });
  }
  return upstashLimiter;
}

/** Per-instance sliding window used only when Upstash is unconfigured. */
const memoryHits = new Map<string, number[]>();

function memoryLimit(key: string): RateLimitResult {
  const now = Date.now();
  const windowMs = WINDOW_SECONDS * 1000;
  const cutoff = now - windowMs;

  const hits = (memoryHits.get(key) ?? []).filter((time) => time > cutoff);
  hits.push(now);
  memoryHits.set(key, hits);

  // Opportunistic sweep so the map cannot grow without bound.
  if (memoryHits.size > 5_000) {
    for (const [existingKey, times] of memoryHits) {
      if (times.every((time) => time <= cutoff)) memoryHits.delete(existingKey);
    }
  }

  return {
    success: hits.length <= MAX_REQUESTS,
    limit: MAX_REQUESTS,
    remaining: Math.max(0, MAX_REQUESTS - hits.length),
    reset: (hits[0] ?? now) + windowMs,
    degraded: true,
  };
}

/**
 * Consumes one token for `identifier` (typically a client IP plus form name).
 *
 * Fails **open** if Upstash itself errors: a Redis outage should degrade the
 * contact form to unprotected rather than take it offline entirely. The
 * failure is surfaced via `degraded` so callers can log it.
 */
export async function checkRateLimit(
  identifier: string,
): Promise<RateLimitResult> {
  const limiter = getUpstashLimiter();
  if (!limiter) return memoryLimit(identifier);

  try {
    const result = await limiter.limit(identifier);
    return {
      success: result.success,
      limit: result.limit,
      remaining: result.remaining,
      reset: result.reset,
      degraded: false,
    };
  } catch {
    return memoryLimit(identifier);
  }
}

/** Builds a stable rate-limit key from the request's client IP and a scope. */
export function rateLimitKey(request: Request, scope: string): string {
  const forwarded = request.headers.get("x-forwarded-for");
  const ip =
    forwarded?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "unknown";
  return `${scope}:${ip}`;
}
