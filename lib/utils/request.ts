import "server-only";

/** Reject cross-site browser POSTs. Requests without an Origin header (curl, server-to-server) pass to the rate limiter. */
export function isSameOrigin(req: Request): boolean {
  const origin = req.headers.get("origin");
  if (!origin) return true;
  try {
    const host = req.headers.get("x-forwarded-host") ?? req.headers.get("host");
    return new URL(origin).host === host;
  } catch {
    return false;
  }
}

/** Parse a small JSON body with a hard size cap. Returns null on any problem. */
export async function readJson<T>(req: Request, maxBytes = 8 * 1024): Promise<T | null> {
  const type = req.headers.get("content-type") ?? "";
  if (!type.includes("application/json")) return null;
  const declared = Number(req.headers.get("content-length") ?? 0);
  if (declared > maxBytes) return null;
  try {
    const text = await req.text();
    if (text.length > maxBytes) return null;
    return JSON.parse(text) as T;
  } catch {
    return null;
  }
}
