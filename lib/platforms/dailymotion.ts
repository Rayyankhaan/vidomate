import "server-only";
import { fetchJson } from "@/lib/utils/http";
import { extractMediaRef } from "./detector";
import { failed, okResult, unavailable, unsupported } from "./result";
import type { PlatformAdapter } from "./types";

interface DmVideo {
  title?: string;
  "owner.screenname"?: string;
  "owner.url"?: string;
  thumbnail_720_url?: string;
  duration?: number;
  url?: string;
  private?: boolean;
}

export const dailymotionAdapter: PlatformAdapter = {
  id: "dailymotion",
  mode: "ready", // Dailymotion's Data API serves public video fields without a key
  isConfigured: () => true,

  async analyze(url, ctx) {
    const ref = extractMediaRef("dailymotion", url);
    if (!ref.id || !/^[a-z0-9]{4,12}$/i.test(ref.id)) {
      return unsupported("dailymotion", url.toString(), "Paste a link to a single public Dailymotion video (dailymotion.com/video/… or dai.ly/…).");
    }
    const canonical = `https://www.dailymotion.com/video/${ref.id}`;
    const fields = "title,owner.screenname,owner.url,thumbnail_720_url,duration,url,private";

    try {
      const res = await fetchJson<DmVideo>(`https://api.dailymotion.com/video/${ref.id}?fields=${fields}`, { signal: ctx.signal });
      if (res.ok && res.data && !res.data.private) {
        return okResult("dailymotion", {
          canonicalUrl: res.data.url || canonical,
          title: res.data.title,
          creator: res.data["owner.screenname"],
          creatorUrl: res.data["owner.url"],
          thumbnailUrl: res.data.thumbnail_720_url,
          durationSeconds: res.data.duration,
          mediaType: "video",
        });
      }
      if (res.ok || res.status === 403 || res.status === 404) {
        return unavailable("dailymotion", canonical, "This video is private, password-protected or removed, so no details can be shown.");
      }
      return failed("dailymotion");
    } catch {
      return failed("dailymotion");
    }
  },
};
