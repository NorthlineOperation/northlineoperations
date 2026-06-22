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

type Bucket = { count: number; reset: number };

/**
 * In-memory fixed-window rate limiter.
 *
 * Note: state lives in the server instance's memory. On a single warm instance
 * (typical for low/medium traffic) this reliably throttles bursty abuse from an
 * IP. For multi-instance, high-scale guarantees, swap the store below for a
 * shared backend (e.g. Upstash Redis / `@upstash/ratelimit`) — the call sites
 * don't need to change.
 */
const store = new Map<string, Bucket>();
let lastSweep = 0;

function sweepExpired(now: number) {
  if (now - lastSweep < 60_000) return;
  lastSweep = now;
  for (const [key, bucket] of store) {
    if (bucket.reset <= now) {
      store.delete(key);
    }
  }
}

export function rateLimit(
  key: string,
  { limit, windowMs }: RateLimitOptions,
): RateLimitResult {
  const now = Date.now();
  sweepExpired(now);

  const existing = store.get(key);
  let bucket: Bucket;

  if (!existing || existing.reset <= now) {
    bucket = { count: 0, reset: now + windowMs };
    store.set(key, bucket);
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
