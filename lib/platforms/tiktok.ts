import "server-only";
import { fetchJson, resolveRedirect } from "@/lib/utils/http";
import { extractMediaRef, isHostOfPlatform } from "./detector";
import { failed, okResult, unavailable, unsupported } from "./result";
import type { PlatformAdapter } from "./types";

interface TikTokOEmbed {
  title?: string;
  author_name?: string;
  author_url?: string;
  thumbnail_url?: string;
}

export const tiktokAdapter: PlatformAdapter = {
  id: "tiktok",
  mode: "ready", // TikTok's oEmbed endpoint is public and keyless
  isConfigured: () => true,

  async analyze(url, ctx) {
    const ref = extractMediaRef("tiktok", url);
    if (ref.kind === "profile" || ref.kind === "unknown") {
      return unsupported("tiktok", url.toString(), "Paste a link to a single public TikTok video. Profile and search pages aren't supported.");
    }

    try {
      let target = url;
      if (ref.needsResolve) {
        const resolved = await resolveRedirect(url, (u) => isHostOfPlatform("tiktok", u), ctx.signal);
        if (!resolved) return unavailable("tiktok", url.toString(), "This short link doesn't lead to a public TikTok video.");
        target = resolved;
      }
      // Drop tracking parameters; the video path is all oEmbed needs.
      const clean = new URL(target.origin + target.pathname);

      const res = await fetchJson<TikTokOEmbed>(`https://www.tiktok.com/oembed?url=${encodeURIComponent(clean.toString())}`, { signal: ctx.signal });
      if (res.ok && res.data && (res.data.title || res.data.author_name)) {
        return okResult("tiktok", {
          canonicalUrl: clean.toString(),
          title: res.data.title,
          creator: res.data.author_name,
          creatorUrl: res.data.author_url,
          thumbnailUrl: res.data.thumbnail_url,
          mediaType: "video",
        });
      }
      if (res.status >= 400 && res.status < 500) {
        return unavailable("tiktok", clean.toString(), "This video is private, removed or not available in your region, so it can't be shown.");
      }
      return failed("tiktok");
    } catch {
      return failed("tiktok");
    }
  },
};
