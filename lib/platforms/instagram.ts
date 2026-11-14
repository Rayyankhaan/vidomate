import "server-only";
import { fetchJson } from "@/lib/utils/http";
import { extractMediaRef } from "./detector";
import { failed, notConfigured, okResult, unavailable, unsupported } from "./result";
import type { PlatformAdapter } from "./types";

interface MetaOEmbed {
  author_name?: string;
  author_url?: string;
  title?: string;
  thumbnail_url?: string;
}

const token = () => process.env.META_OEMBED_ACCESS_TOKEN;

export const instagramAdapter: PlatformAdapter = {
  id: "instagram",
  mode: "needs_config",
  isConfigured: () => Boolean(token()),

  async analyze(url, ctx) {
    const ref = extractMediaRef("instagram", url);
    const original = url.toString();

    // Stories and profiles are not exposed by Instagram's public oEmbed interface.
    if (ref.kind === "story") {
      return unsupported("instagram", original, "Instagram Stories aren't available through Instagram's public embed interface, and VidoMate never accesses login-gated content. Use Instagram's own tools to save your own Stories (Archive or Accounts Center).");
    }
    if (ref.kind === "profile") {
      return unsupported("instagram", original, "Profile pages can't be analyzed. Paste a link to a single public Reel, photo or video post.");
    }
    if (!ref.id) {
      return unsupported("instagram", original, "We couldn't find a post in this link. Paste a public Reel, photo, video or carousel link.");
    }

    const canonicalPath = ref.kind === "reel" ? "reel" : ref.kind === "igtv" ? "tv" : "p";
    const canonical = `https://www.instagram.com/${canonicalPath}/${ref.id}/`;

    const t = token();
    if (!t) return notConfigured("instagram", canonical);

    try {
      const api = `https://graph.facebook.com/v21.0/instagram_oembed?url=${encodeURIComponent(canonical)}&omitscript=true&access_token=${encodeURIComponent(t)}`;
      const res = await fetchJson<MetaOEmbed>(api, { signal: ctx.signal });
      if (res.ok && res.data) {
        return okResult("instagram", {
          canonicalUrl: canonical,
          title: res.data.title,
          creator: res.data.author_name,
          creatorUrl: res.data.author_url,
          thumbnailUrl: res.data.thumbnail_url,
          mediaType: ref.kind === "post" ? "post" : "video",
        });
      }
      if (res.status === 400 || res.status === 404) {
        return unavailable("instagram", canonical, "This post is private, removed, or can't be embedded, so it isn't accessible.");
      }
      if (res.status === 401 || res.status === 403) return notConfigured("instagram", canonical);
      return failed("instagram");
    } catch {
      return failed("instagram");
    }
  },
};
