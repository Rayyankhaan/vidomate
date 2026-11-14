import "server-only";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";

let client: SupabaseClient | null | undefined;

/** Server-only Supabase client (service role). Returns null when Supabase isn't configured. */
export function getSupabaseAdmin(): SupabaseClient | null {
  if (client !== undefined) return client;
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  client = url && key ? createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } }) : null;
  return client;
}

/**
 * Anonymous, privacy-preserving usage stat. Stores ONLY platform + status — never the submitted URL,
 * IP address or any identifier. Disabled unless ENABLE_ANALYSIS_HISTORY=true.
 */
export async function recordAnalysis(platform: string, status: string): Promise<void> {
  if (process.env.ENABLE_ANALYSIS_HISTORY !== "true") return;
  const db = getSupabaseAdmin();
  if (!db) return;
  try {
    await db.from("analysis_history").insert({ platform, status });
  } catch {
    /* stats are best-effort and must never break a request */
  }
}
