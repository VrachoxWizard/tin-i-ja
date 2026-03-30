const rateMap = new Map<string, { count: number; resetAt: number }>();

/**
 * Simple in-memory rate limiter.
 * @param key - Unique identifier (e.g. IP address)
 * @param limit - Max requests allowed in the window
 * @param windowMs - Time window in milliseconds
 * @returns true if the request is allowed, false if rate-limited
 */
export function rateLimit(
  key: string,
  limit: number = 5,
  windowMs: number = 60_000
): boolean {
  const now = Date.now();
  const entry = rateMap.get(key);

  if (!entry || now > entry.resetAt) {
    rateMap.set(key, { count: 1, resetAt: now + windowMs });
    return true;
  }

  if (entry.count >= limit) {
    return false;
  }

  entry.count++;
  return true;
}

// Periodic cleanup to prevent memory leaks (every 5 minutes)
if (typeof setInterval !== "undefined") {
  setInterval(() => {
    const now = Date.now();
    for (const [key, entry] of rateMap) {
      if (now > entry.resetAt) {
        rateMap.delete(key);
      }
    }
  }, 5 * 60_000);
}
