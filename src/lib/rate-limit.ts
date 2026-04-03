import { createHash } from "node:crypto";
import { createClient } from "@/lib/supabase/server";

const fallbackRateMap = new Map<string, { count: number; resetAt: number }>();

function hashKey(value: string) {
  return createHash("sha256").update(value).digest("hex");
}

function fallbackRateLimit(key: string, limit: number, windowMs: number) {
  const now = Date.now();
  const entry = fallbackRateMap.get(key);

  if (!entry || now > entry.resetAt) {
    fallbackRateMap.set(key, { count: 1, resetAt: now + windowMs });
    return true;
  }

  if (entry.count >= limit) {
    return false;
  }

  entry.count += 1;
  return true;
}

export async function enforceRateLimit(input: {
  key: string;
  route: string;
  limit?: number;
  windowMs?: number;
}) {
  const limit = input.limit ?? 5;
  const windowMs = input.windowMs ?? 60_000;
  const keyHash = hashKey(input.key);

  try {
    const supabase = await createClient();
    const { data, error } = await supabase.rpc("check_rate_limit", {
      p_key_hash: keyHash,
      p_limit: limit,
      p_route: input.route,
      p_window_seconds: Math.ceil(windowMs / 1000),
    });

    if (!error && typeof data === "boolean") {
      return data;
    }
  } catch {
    // Fall back in environments where the DB function has not been applied yet.
  }

  return fallbackRateLimit(`${input.route}:${keyHash}`, limit, windowMs);
}
