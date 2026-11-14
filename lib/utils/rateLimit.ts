import "server-only";
import { createHash } from "node:crypto";

/**
 * Fixed-window rate limiter.
 * - If UPSTASH_REDIS_REST_URL/TOKEN are set → shared limit across serverless instances.
 * - Otherwise → in-memory (per instance; fine for dev / single server, weaker on Vercel).
 * Keys are salted SHA-256 hashes of the client IP, so raw IPs are never stored or logged.
 */

interface Bucket {
  count: number;
  resetAt: number;
}
const memory = new Map<string, Bucket>();

function sweep(now: number) {
  if (memory.size < 5000) return;
  for (const [k, b] of memory) if (b.resetAt <= now) memory.delete(k);
}

export function clientKey(headers: Headers, scope: string): string {
  const fwd = headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  const ip = fwd || headers.get("x-real-ip") || "unknown";
  const salt = process.env.RATE_LIMIT_SALT ?? "vidomate";
  return `rl:${scope}:${createHash("sha256").update(`${salt}:${ip}`).digest("hex").slice(0, 32)}`;
}

export interface RateLimitResult {
  allowed: boolean;
  retryAfterSec: number;
}

async function upstash(key: string, limit: number, windowSec: number): Promise<RateLimitResult | null> {
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) return null;
  try {
    const res = await fetch(`${url}/pipeline`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      body: JSON.stringify([
        ["INCR", key],
        ["EXPIRE", key, String(windowSec), "NX"],
        ["TTL", key],
      ]),
      signal: AbortSignal.timeout(1500),
      cache: "no-store",
    });
    if (!res.ok) return null;
    const out = (await res.json()) as { result: number }[];
    const count = Number(out[0]?.result ?? 0);
    const ttl = Number(out[2]?.result ?? windowSec);
    return { allowed: count <= limit, retryAfterSec: Math.max(ttl, 1) };
  } catch {
    return null; // fall back to memory
  }
}

export async function rateLimit(key: string, limit: number, windowSec: number): Promise<RateLimitResult> {
  const shared = await upstash(key, limit, windowSec);
  if (shared) return shared;

  const now = Date.now();
  sweep(now);
  const b = memory.get(key);
  if (!b || b.resetAt <= now) {
    memory.set(key, { count: 1, resetAt: now + windowSec * 1000 });
    return { allowed: true, retryAfterSec: windowSec };
  }
  b.count += 1;
  return { allowed: b.count <= limit, retryAfterSec: Math.max(Math.ceil((b.resetAt - now) / 1000), 1) };
}
