import "server-only";
import { fetchJson, resolveRedirect } from "@/lib/utils/http";
import { extractMediaRef, isHostOfPlatform } from "./detector";
import { failed, notConfigured, okResult, unavailable, unsupported } from "./result";
import type { PlatformAdapter } from "./types";

interface MetaOEmbed {
  author_name?: string;
  author_url?: string;
  title?: string;
  thumbnail_url?: string;
}

const token = () => process.env.META_OEMBED_ACCESS_TOKEN;

export const facebookAdapter: PlatformAdapter = {
  id: "facebook",
  mode: "needs_config",
  isConfigured: () => Boolean(token()),

  async analyze(url, ctx) {
    const ref = extractMediaRef("facebook", url);
    if (ref.kind === "unknown") {
      return unsupported("facebook", url.toString(), "We couldn't find a video in this link. Paste a public Facebook video, Watch or Reel link.");
    }

    const t = token();
    if (!t) return notConfigured("facebook", url.toString());

    try {
      let target = url;
      if (ref.needsResolve) {
        const resolved = await resolveRedirect(url, (u) => isHostOfPlatform("facebook", u), ctx.signal);
        if (!resolved) return unavailable("facebook", url.toString(), "This short link doesn't lead to a public Facebook video.");
        target = resolved;
      }

      const api = `https://graph.facebook.com/v21.0/oembed_video?url=${encodeURIComponent(target.toString())}&omitscript=true&access_token=${encodeURIComponent(t)}`;
      const res = await fetchJson<MetaOEmbed>(api, { signal: ctx.signal });
      if (res.ok && res.data) {
        return okResult("facebook", {
          canonicalUrl: target.toString(),
          title: res.data.title,
          creator: res.data.author_name,
          creatorUrl: res.data.author_url,
          thumbnailUrl: res.data.thumbnail_url,
          mediaType: "video",
        });
      }
      if (res.status === 400 || res.status === 404) {
        return unavailable("facebook", target.toString(), "This video is private, removed, or not shared publicly, so it isn't accessible.");
      }
      if (res.status === 401 || res.status === 403) return notConfigured("facebook", target.toString());
      return failed("facebook");
    } catch {
      return failed("facebook");
    }
  },
};
