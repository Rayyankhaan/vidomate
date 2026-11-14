import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase/server";
import { logEvent } from "@/lib/utils/logger";
import { clientKey, rateLimit } from "@/lib/utils/rateLimit";
import { isSameOrigin, readJson } from "@/lib/utils/request";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const clean = (v: unknown, max: number) =>
  typeof v === "string" ? v.replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, "").trim().slice(0, max) : "";

const json = (body: object, status = 200, headers: Record<string, string> = {}) =>
  NextResponse.json(body, { status, headers: { "Cache-Control": "no-store", ...headers } });

export async function POST(req: Request) {
  if (!isSameOrigin(req)) return json({ error: "Cross-site requests are not allowed." }, 403);

  const rl = await rateLimit(clientKey(req.headers, "contact"), 3, 600);
  if (!rl.allowed) return json({ error: "Too many messages. Please try again later." }, 429, { "Retry-After": String(rl.retryAfterSec) });

  const body = await readJson<Record<string, unknown>>(req, 8 * 1024);
  if (!body) return json({ error: "Invalid request." }, 400);

  // Honeypot: real users never fill this hidden field. Pretend success so bots learn nothing.
  if (typeof body.website === "string" && body.website.trim() !== "") return json({ ok: true });

  const name = clean(body.name, 100);
  const email = clean(body.email, 254);
  const message = clean(body.message, 2000);

  if (!name) return json({ error: "Please enter your name." }, 400);
  if (!EMAIL.test(email)) return json({ error: "Please enter a valid email address." }, 400);
  if (message.length < 10) return json({ error: "Your message should be at least 10 characters." }, 400);

  const db = getSupabaseAdmin();
  if (!db) {
    return json({ error: "The contact form isn't configured on this site yet. Please use the email address shown on this page." }, 503);
  }

  const { error } = await db.from("contact_messages").insert({ name, email, message });
  if (error) {
    logEvent("contact_failed", { code: error.code ?? "unknown" });
    return json({ error: "We couldn't save your message. Please try again later." }, 500);
  }
  logEvent("contact_saved", { route: "contact" });
  return json({ ok: true });
}
