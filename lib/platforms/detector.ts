import type { PlatformId } from "@/types/platform";

/**
 * Pure platform detection (safe for client + server). Only hostnames on this allowlist are
 * ever processed, which is also the strongest SSRF guard: arbitrary hosts are rejected outright.
 */
const HOST_MATCHERS: Record<PlatformId, (host: string) => boolean> = {
  youtube: (h) => h === "youtube.com" || h.endsWith(".youtube.com") || h === "youtu.be" || h === "youtube-nocookie.com",
  instagram: (h) => h === "instagram.com" || h.endsWith(".instagram.com") || h === "instagr.am",
  facebook: (h) => h === "facebook.com" || h.endsWith(".facebook.com") || h === "fb.watch" || h === "fb.com" || h.endsWith(".fb.com"),
  tiktok: (h) => h === "tiktok.com" || h.endsWith(".tiktok.com"),
  pinterest: (h) => /(^|\.)pinterest\.[a-z]{2,3}(\.[a-z]{2})?$/.test(h) || h === "pin.it",
  reddit: (h) => h === "reddit.com" || h.endsWith(".reddit.com") || h === "redd.it",
  threads: (h) => h === "threads.net" || h.endsWith(".threads.net") || h === "threads.com" || h.endsWith(".threads.com"),
  dailymotion: (h) => h === "dailymotion.com" || h.endsWith(".dailymotion.com") || h === "dai.ly",
};

export function normalizeHost(hostname: string): string {
  return hostname.toLowerCase().replace(/\.$/, "").replace(/^www\./, "");
}

export function detectPlatform(url: URL): PlatformId | null {
  const host = normalizeHost(url.hostname);
  for (const id of Object.keys(HOST_MATCHERS) as PlatformId[]) {
    if (HOST_MATCHERS[id](host)) return id;
  }
  return null;
}

export function isHostOfPlatform(platform: PlatformId, url: URL): boolean {
  return HOST_MATCHERS[platform](normalizeHost(url.hostname));
}

export interface MediaRef {
  /** Platform-specific identifier (video id, shortcode, pin id…) when one can be extracted. */
  id?: string;
  /** Coarse content kind derived from the URL path. */
  kind: string;
  /** True for short links that need a (safe) redirect resolution before an id is available. */
  needsResolve?: boolean;
}

const YT_ID = /^[A-Za-z0-9_-]{11}$/;

export function extractMediaRef(platform: PlatformId, url: URL): MediaRef {
  const host = normalizeHost(url.hostname);
  const parts = url.pathname.split("/").filter(Boolean);

  switch (platform) {
    case "youtube": {
      if (host === "youtu.be") return { id: YT_ID.test(parts[0] ?? "") ? parts[0] : undefined, kind: "video" };
      const v = url.searchParams.get("v");
      if (v && YT_ID.test(v)) return { id: v, kind: host.startsWith("music.") ? "music" : "video" };
      const idx = parts.findIndex((p) => ["shorts", "embed", "live", "v"].includes(p));
      if (idx >= 0 && YT_ID.test(parts[idx + 1] ?? "")) {
        return { id: parts[idx + 1], kind: parts[idx] === "shorts" ? "short" : "video" };
      }
      if (["playlist", "channel", "c", "user", "results"].includes(parts[0]) || parts[0]?.startsWith("@")) {
        return { kind: "non-media" };
      }
      return { kind: "unknown" };
    }
    case "instagram": {
      const i = parts.findIndex((p) => ["p", "reel", "reels", "tv"].includes(p));
      if (i >= 0 && parts[i + 1]) {
        const t = parts[i];
        return { id: parts[i + 1], kind: t === "p" ? "post" : t === "tv" ? "igtv" : "reel" };
      }
      if (parts[0] === "stories") return { kind: "story" };
      if (parts.length === 1) return { kind: "profile" };
      return { kind: "unknown" };
    }
    case "facebook": {
      if (host === "fb.watch") return { id: parts[0], kind: "video", needsResolve: true };
      if (parts.includes("reel")) return { id: parts[parts.indexOf("reel") + 1], kind: "reel" };
      if (parts.includes("videos")) return { id: parts[parts.indexOf("videos") + 1], kind: "video" };
      if (parts[0] === "watch" || parts[0] === "share" || parts[0] === "permalink.php") return { kind: "video" };
      return { kind: "unknown" };
    }
    case "tiktok": {
      if (host === "vm.tiktok.com" || host === "vt.tiktok.com") return { id: parts[0], kind: "video", needsResolve: true };
      const i = parts.indexOf("video");
      if (i >= 0 && parts[i + 1]) return { id: parts[i + 1], kind: "video" };
      if (parts[0]?.startsWith("@") && parts.length === 1) return { kind: "profile" };
      return { kind: "unknown" };
    }
    case "pinterest": {
      if (host === "pin.it") return { id: parts[0], kind: "pin", needsResolve: true };
      const i = parts.indexOf("pin");
      if (i >= 0 && /^\d+$/.test(parts[i + 1] ?? "")) return { id: parts[i + 1], kind: "pin" };
      return { kind: "unknown" };
    }
    case "reddit": {
      if (host === "redd.it") return { id: parts[0], kind: "post" };
      const i = parts.indexOf("comments");
      if (i >= 0 && parts[i + 1]) return { id: parts[i + 1], kind: "post" };
      if (parts[2] === "s" && parts[3]) return { kind: "post", needsResolve: true };
      return { kind: "unknown" };
    }
    case "threads": {
      const i = parts.indexOf("post");
      if (i >= 0 && parts[i + 1]) return { id: parts[i + 1], kind: "post" };
      return { kind: "unknown" };
    }
    case "dailymotion": {
      if (host === "dai.ly") return { id: parts[0], kind: "video" };
      const i = parts.indexOf("video");
      if (i >= 0 && parts[i + 1]) return { id: parts[i + 1].split("_")[0], kind: "video" };
      return { kind: "unknown" };
    }
  }
}
