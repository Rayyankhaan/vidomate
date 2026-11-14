import "server-only";

/**
 * Privacy-conscious logging: callers pass only coarse, non-identifying fields
 * (platform, status, duration). URLs, IPs and message bodies must never be logged.
 */
const ALLOWED = new Set(["platform", "status", "ms", "route", "code", "reason"]);

export function logEvent(event: string, fields: Record<string, string | number | undefined> = {}): void {
  const safe: Record<string, string | number> = {};
  for (const [k, v] of Object.entries(fields)) {
    if (ALLOWED.has(k) && v !== undefined) safe[k] = v;
  }
  console.log(JSON.stringify({ t: new Date().toISOString(), event, ...safe }));
}
