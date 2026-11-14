import "server-only";
import { assertPublicUrl } from "@/lib/validation/ssrf";

const UA = "VidoMate/1.0 (+https://vidomate.app; link metadata lookup)";
const MAX_BYTES = 1_000_000;

export interface JsonResponse<T> {
  ok: boolean;
  status: number;
  data: T | null;
}

/**
 * Fetch JSON from a FIXED, trusted API endpoint (the user's URL is only ever a query parameter).
 * Redirects are refused, a hard timeout applies and response size is capped.
 */
export async function fetchJson<T>(
  endpoint: string,
  opts: { headers?: Record<string, string>; method?: "GET" | "POST"; body?: string; signal?: AbortSignal; timeoutMs?: number } = {}
): Promise<JsonResponse<T>> {
  const timeout = AbortSignal.timeout(opts.timeoutMs ?? 8000);
  const signal = opts.signal ? AbortSignal.any([opts.signal, timeout]) : timeout;

  const res = await fetch(endpoint, {
    method: opts.method ?? "GET",
    headers: { "User-Agent": UA, Accept: "application/json", ...opts.headers },
    body: opts.body,
    redirect: "error",
    cache: "no-store",
    signal,
  });

  const len = Number(res.headers.get("content-length") ?? 0);
  if (len > MAX_BYTES) return { ok: false, status: res.status, data: null };

  const text = await res.text();
  if (text.length > MAX_BYTES) return { ok: false, status: res.status, data: null };

  let data: T | null = null;
  try {
    data = text ? (JSON.parse(text) as T) : null;
  } catch {
    data = null;
  }
  return { ok: res.ok, status: res.status, data };
}

/**
 * Safely resolve a short link (pin.it, redd.it/r/x/s/…, fb.watch …) by following at most 3
 * redirects manually. Every hop must be http(s), resolve to public IPs and satisfy `allowHost`.
 */
export async function resolveRedirect(start: URL, allowHost: (u: URL) => boolean, signal?: AbortSignal): Promise<URL | null> {
  let current = start;
  for (let hop = 0; hop < 3; hop++) {
    if (!allowHost(current)) return null;
    await assertPublicUrl(current);

    const timeout = AbortSignal.timeout(5000);
    const res = await fetch(current, {
      method: "GET",
      redirect: "manual",
      headers: { "User-Agent": UA },
      cache: "no-store",
      signal: signal ? AbortSignal.any([signal, timeout]) : timeout,
    });
    await res.body?.cancel().catch(() => undefined);

    if (res.status >= 300 && res.status < 400) {
      const loc = res.headers.get("location");
      if (!loc) return null;
      try {
        current = new URL(loc, current);
      } catch {
        return null;
      }
      continue;
    }
    return allowHost(current) ? current : null;
  }
  return null;
}
