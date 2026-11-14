import "server-only";
import { fetchJson, resolveRedirect } from "@/lib/utils/http";
import { extractMediaRef, isHostOfPlatform } from "./detector";
import { failed, notConfigured, okResult, unavailable, unsupported } from "./result";
import type { PlatformAdapter } from "./types";

interface PinResponse {
  title?: string | null;
  description?: string | null;
  link?: string | null;
  media?: {
    media_type?: string;
    images?: Record<string, { url: string }>;
  };
}

const token = () => process.env.PINTEREST_ACCESS_TOKEN;

export const pinterestAdapter: PlatformAdapter = {
  id: "pinterest",
  mode: "needs_config",
  isConfigured: () => Boolean(token()),

  async analyze(url, ctx) {
    let ref = extractMediaRef("pinterest", url);
    if (ref.kind === "unknown") {
      return unsupported("pinterest", url.toString(), "Paste a link to a single pin (pinterest.com/pin/…). Boards and profiles aren't supported.");
    }

    const t = token();
    if (!t) return notConfigured("pinterest", url.toString());

    try {
      let target = url;
      if (ref.needsResolve) {
        const resolved = await resolveRedirect(url, (u) => isHostOfPlatform("pinterest", u), ctx.signal);
        if (!resolved) return unavailable("pinterest", url.toString(), "This short link doesn't lead to a Pinterest pin.");
        target = resolved;
        ref = extractMediaRef("pinterest", target);
      }
      if (!ref.id || !/^\d+$/.test(ref.id)) {
        return unavailable("pinterest", target.toString(), "We couldn't find a pin ID in this link.");
      }

      const canonical = `https://www.pinterest.com/pin/${ref.id}/`;
      const res = await fetchJson<PinResponse>(`https://api.pinterest.com/v5/pins/${ref.id}`, {
        headers: { Authorization: `Bearer ${t}` },
        signal: ctx.signal,
      });

      if (res.ok && res.data) {
        const imgs = res.data.media?.images;
        const thumb = imgs ? (imgs["600x"] ?? imgs["400x300"] ?? Object.values(imgs)[0])?.url : undefined;
        const type = res.data.media?.media_type;
        return okResult("pinterest", {
          canonicalUrl: canonical,
          title: res.data.title || res.data.description || undefined,
          thumbnailUrl: thumb,
          mediaType: type === "video" ? "video" : type === "image" ? "image" : "post",
        });
      }
      if (res.status === 401 || res.status === 403) {
        return unavailable("pinterest", canonical, "The connected Pinterest account isn't permitted to access this pin, so no details can be shown.");
      }
      if (res.status === 404) return unavailable("pinterest", canonical, "This pin was removed or isn't public.");
      return failed("pinterest");
    } catch {
      return failed("pinterest");
    }
  },
};
