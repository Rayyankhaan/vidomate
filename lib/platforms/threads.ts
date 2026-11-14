import "server-only";
import { unsupported } from "./result";
import type { PlatformAdapter } from "./types";

/**
 * Threads has no public media/metadata endpoint that is authorized for arbitrary third-party
 * links, so this adapter is explicit about it instead of scraping or faking data.
 * Swap in a real implementation here if Meta publishes one — the interface will not change.
 */
export const threadsAdapter: PlatformAdapter = {
  id: "threads",
  mode: "unsupported",
  isConfigured: () => false,

  async analyze(url) {
    return unsupported(
      "threads",
      url.toString(),
      "Threads doesn't offer an authorized public interface for reading media details or downloads, so VidoMate can't analyze this link. You can open the original post, or export your own content from your account settings."
    );
  },
};
