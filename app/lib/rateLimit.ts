/**
 * Light in-memory per-IP rate limiting for API routes.
 *
 * A spam speed-bump, not a hard guarantee: the bucket map lives on a single
 * serverless instance, so limits are enforced per-instance rather than
 * globally. Adequate for low-volume B2B endpoints that send email or create
 * orders, alongside other defences (honeypots, validation).
 *
 * Each call to createRateLimiter owns its own bucket map, so different routes
 * get independent counts.
 */

export interface RateLimitOptions {
  /** Max requests allowed from one IP within the window. */
  max: number;
  /** Rolling window length in milliseconds. */
  windowMs: number;
}

export function createRateLimiter({ max, windowMs }: RateLimitOptions) {
  const hits = new Map<string, number[]>();

  return function isRateLimited(ip: string): boolean {
    const now = Date.now();
    const recent = (hits.get(ip) ?? []).filter((t) => now - t < windowMs);
    recent.push(now);
    hits.set(ip, recent);

    // Opportunistic cleanup so the map cannot grow unbounded across many IPs.
    if (hits.size > 5000) {
      for (const [key, times] of hits) {
        if (times.every((t) => now - t >= windowMs)) hits.delete(key);
      }
    }

    return recent.length > max;
  };
}

/** Best-effort client IP from the proxy headers. Falls back to "unknown". */
export function getClientIp(request: Request): string {
  return (
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown"
  );
}
