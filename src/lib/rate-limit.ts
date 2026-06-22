import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
import { NextResponse } from "next/server";

type RateLimitOptions = {
  /** Max requests allowed within the window. */
  limit: number;
  /** Window length in milliseconds. */
  windowMs: number;
};

export type RateLimitResult = {
  success: boolean;
  limit: number;
  remaining: number;
  /** Epoch ms when the current window resets. */
  reset: number;
  retryAfterSeconds: number;
};

/* ------------------------------------------------------------------ *
 * In-memory store — default, and the fallback if Redis is unreachable.
 * Reliable on a single warm instance; not shared across instances.
 * ------------------------------------------------------------------ */

type Bucket = { count: number; reset: number };
const memoryStore = new Map<string, Bucket>();
let lastSweep = 0;

function sweepExpired(now: number) {
  if (now - lastSweep < 60_000) return;
  lastSweep = now;
  for (const [key, bucket] of memoryStore) {
    if (bucket.reset <= now) {
      memoryStore.delete(key);
    }
  }
}

function memoryRateLimit(
  key: string,
  { limit, windowMs }: RateLimitOptions,
): RateLimitResult {
  const now = Date.now();
  sweepExpired(now);

  const existing = memoryStore.get(key);
  let bucket: Bucket;

  if (!existing || existing.reset <= now) {
    bucket = { count: 0, reset: now + windowMs };
    memoryStore.set(key, bucket);
  } else {
    bucket = existing;
  }

  bucket.count += 1;

  return {
    success: bucket.count <= limit,
    limit,
    remaining: Math.max(0, limit - bucket.count),
    reset: bucket.reset,
    retryAfterSeconds: Math.max(1, Math.ceil((bucket.reset - now) / 1000)),
  };
}

/* ------------------------------------------------------------------ *
 * Upstash Redis — distributed, used automatically when configured.
 * Supports both the Upstash-native and Vercel KV env var names.
 * ------------------------------------------------------------------ */

const redisUrl =
  process.env.UPSTASH_REDIS_REST_URL ?? process.env.KV_REST_API_URL;
const redisToken =
  process.env.UPSTASH_REDIS_REST_TOKEN ?? process.env.KV_REST_API_TOKEN;

const redis =
  redisUrl && redisToken
    ? new Redis({ url: redisUrl, token: redisToken })
    : null;

// One Ratelimit instance per (limit, window) pair.
const limiters = new Map<string, Ratelimit>();

function getLimiter(limit: number, windowMs: number): Ratelimit | null {
  if (!redis) return null;

  const cacheKey = `${limit}:${windowMs}`;
  let limiter = limiters.get(cacheKey);
  if (!limiter) {
    limiter = new Ratelimit({
      redis,
      prefix: "northline-rl",
      analytics: false,
      limiter: Ratelimit.slidingWindow(limit, `${windowMs} ms` as `${number} ms`),
    });
    limiters.set(cacheKey, limiter);
  }
  return limiter;
}

/**
 * Rate limit by key. Uses Upstash Redis when configured (works across all
 * serverless instances), otherwise an in-memory window. Falls back to
 * in-memory if Redis is temporarily unavailable so the form still throttles.
 */
export async function rateLimit(
  key: string,
  options: RateLimitOptions,
): Promise<RateLimitResult> {
  const limiter = getLimiter(options.limit, options.windowMs);

  if (limiter) {
    try {
      const result = await limiter.limit(key);
      const now = Date.now();
      return {
        success: result.success,
        limit: result.limit,
        remaining: Math.max(0, result.remaining),
        reset: result.reset,
        retryAfterSeconds: Math.max(1, Math.ceil((result.reset - now) / 1000)),
      };
    } catch {
      return memoryRateLimit(key, options);
    }
  }

  return memoryRateLimit(key, options);
}

/** Best-effort client IP from proxy headers (Vercel sets x-forwarded-for). */
export function getClientIp(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) {
    return forwarded.split(",")[0]?.trim() || "unknown";
  }
  return request.headers.get("x-real-ip")?.trim() || "unknown";
}

/** Standard 429 response with rate-limit headers. */
export function tooManyRequestsResponse(result: RateLimitResult) {
  return NextResponse.json(
    {
      error: `Too many requests. Please wait ${result.retryAfterSeconds} seconds and try again.`,
    },
    {
      status: 429,
      headers: {
        "Retry-After": String(result.retryAfterSeconds),
        "RateLimit-Limit": String(result.limit),
        "RateLimit-Remaining": String(result.remaining),
        "RateLimit-Reset": String(Math.ceil(result.reset / 1000)),
      },
    },
  );
}
