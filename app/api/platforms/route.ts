import { NextResponse } from "next/server";
import { ADAPTERS } from "@/lib/platforms";
import { PLATFORM_LIST } from "@/lib/platforms/catalog";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** Public platform list with an honest readiness flag (never exposes which secrets are set). */
export function GET() {
  const platforms = PLATFORM_LIST.map((p) => {
    const a = ADAPTERS[p.id];
    const status = a.mode === "unsupported" ? "unsupported" : a.isConfigured() ? "ready" : "not_configured";
    return { id: p.id, name: p.name, path: `/${p.id}`, status };
  });
  return NextResponse.json({ platforms }, { headers: { "Cache-Control": "no-store" } });
}
