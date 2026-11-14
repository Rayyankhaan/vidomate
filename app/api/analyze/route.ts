import { NextResponse } from "next/server";
import { PLATFORM_LIST } from "@/lib/platforms/catalog";
import { detectPlatform } from "@/lib/platforms/detector";
import { getAdapter } from "@/lib/platforms";
import { failed } from "@/lib/platforms/result";
import { recordAnalysis } from "@/lib/supabase/server";
import { logEvent } from "@/lib/utils/logger";
import { clientKey, rateLimit } from "@/lib/utils/rateLimit";
import { isSameOrigin, readJson } from "@/lib/utils/request";
import { parseUserUrl } from "@/lib/validation/url";
import type { AnalysisResult } from "@/types/media";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 20;

const HEADERS = { "Cache-Control": "no-store" };

function respond(result: AnalysisResult, status = 200, extra: Record<string, string> = {}) {
  return NextResponse.json(result, { status, headers: { ...HEADERS, ...extra } });
}

export async function POST(req: Request) {
  const started = Date.now();

  if (!isSameOrigin(req)) {
    return respond({ status: "error", platform: null, message: "Cross-site requests are not allowed.", actions: [], downloadSupport: "unknown" }, 403);
  }

  const rl = await rateLimit(clientKey(req.headers, "analyze"), 15, 60);
  if (!rl.allowed) {
    return respond(
      { status: "rate_limited", platform: null, message: `Too many requests. Please wait ${rl.retryAfterSec}s and try again.`, actions: [], downloadSupport: "unknown" },
      429,
      { "Retry-After": String(rl.retryAfterSec) }
    );
  }

  const body = await readJson<{ url?: unknown }>(req);
  if (!body || typeof body.url !== "string") {
    return respond({ status: "invalid_url", platform: null, message: "Send a JSON body like { \"url\": \"https://…\" }.", actions: [], downloadSupport: "unknown" }, 400);
  }

  const parsed = parseUserUrl(body.url);
  if (!parsed.ok) {
    return respond({ status: "invalid_url", platform: null, message: parsed.reason, actions: [], downloadSupport: "unknown" }, 400);
  }

  const platform = detectPlatform(parsed.url);
  if (!platform) {
    const names = PLATFORM_LIST.map((p) => p.name).join(", ");
    return respond({ status: "invalid_url", platform: null, message: `This link isn't from a supported platform. Supported: ${names}.`, actions: [], downloadSupport: "unknown" }, 400);
  }

  let result: AnalysisResult;
  try {
    result = await getAdapter(platform).analyze(parsed.url, { signal: AbortSignal.timeout(12_000) });
  } catch {
    result = failed(platform);
  }

  logEvent("analyze", { platform, status: result.status, ms: Date.now() - started });
  void recordAnalysis(platform, result.status);

  return respond(result, result.status === "error" ? 502 : 200);
}
