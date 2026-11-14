import type { AnalysisResult } from "@/types/media";
import type { PlatformId } from "@/types/platform";

export interface AdapterContext {
  signal: AbortSignal;
}

/** Every platform adapter implements this interface. */
export interface PlatformAdapter {
  readonly id: PlatformId;
  /**
   * "ready"          – works with no secrets (public keyless API)
   * "needs_config"   – requires server credentials; returns not_configured without them
   * "unsupported"    – no authorized public interface exists; always returns unsupported
   */
  readonly mode: "ready" | "needs_config" | "unsupported";
  isConfigured(): boolean;
  analyze(url: URL, ctx: AdapterContext): Promise<AnalysisResult>;
}
