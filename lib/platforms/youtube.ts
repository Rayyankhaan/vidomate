import "server-only";
import { fetchJson } from "@/lib/utils/http";
import { extractMediaRef } from "./detector";
import { failed, okResult, unavailable, unsupported } from "./result";
import type { PlatformAdapter } from "./types";

interface OEmbed {
  title?: string;
  author_name?: string;
  author_url?: string;
  thumbnail_url?: string;
}
interface VideosList {
  items?: {
    snippet?: { title?: string; channelTitle?: string; channelId?: string; thumbnails?: Record<string, { url: string }> };
    contentDetails?: { duration?: string };
  }[];
}

function isoDurationToSeconds(iso?: string): number | undefined {
  const m = iso?.match(/^PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?$/);
  if (!m) return undefined;
  return Number(m[1] ?? 0) * 3600 + Number(m[2] ?? 0) * 60 + Number(m[3] ?? 0);
}

export const youtubeAdapter: PlatformAdapter = {
  id: "youtube",
  mode: "ready", // oEmbed needs no key; YOUTUBE_API_KEY only enriches the result
  isConfigured: () => true,

  async analyze(url, ctx) {
    const ref = extractMediaRef("youtube", url);
    const original = url.toString();

    if (!ref.id) {
      return unsupported(
        "youtube",
        original,
        ref.kind === "non-media"
          ? "Playlists, channels and search pages aren't supported. Paste a link to a single video."
          : "We couldn't find a video in this link. Paste a full YouTube video, Shorts or Music link."
      );
    }

    const canonical = `https://www.youtube.com/watch?v=${ref.id}`;
    const key = process.env.YOUTUBE_API_KEY;

    try {
      if (key) {
        const api = `https://www.googleapis.com/youtube/v3/videos?part=snippet,contentDetails&id=${ref.id}&key=${encodeURIComponent(key)}`;
        const res = await fetchJson<VideosList>(api, { signal: ctx.signal });
        const item = res.data?.items?.[0];
        if (res.ok && item) {
          const thumbs = item.snippet?.thumbnails;
          return okResult("youtube", {
            canonicalUrl: canonical,
            title: item.snippet?.title,
            creator: item.snippet?.channelTitle,
            creatorUrl: item.snippet?.channelId ? `https://www.youtube.com/channel/${item.snippet.channelId}` : undefined,
            thumbnailUrl: (thumbs?.maxres ?? thumbs?.high ?? thumbs?.medium ?? thumbs?.default)?.url,
            durationSeconds: isoDurationToSeconds(item.contentDetails?.duration),
            mediaType: "video",
          });
        }
        if (res.ok && !item) {
          return unavailable("youtube", canonical, "This video is private, removed or not available in our region.");
        }
        // fall through to oEmbed on quota/credential errors
      }

      const res = await fetchJson<OEmbed>(`https://www.youtube.com/oembed?format=json&url=${encodeURIComponent(canonical)}`, { signal: ctx.signal });
      if (res.ok && res.data) {
        return okResult("youtube", {
          canonicalUrl: canonical,
          title: res.data.title,
          creator: res.data.author_name,
          creatorUrl: res.data.author_url,
          thumbnailUrl: res.data.thumbnail_url,
          mediaType: "video",
        });
      }
      if (res.status === 401 || res.status === 403 || res.status === 404) {
        return unavailable("youtube", canonical, "This video is private, removed, age-restricted or has embedding disabled, so no details can be shown.");
      }
      return failed("youtube");
    } catch {
      return failed("youtube");
    }
  },
};
