import "server-only";
import { fetchJson, resolveRedirect } from "@/lib/utils/http";
import { extractMediaRef, isHostOfPlatform } from "./detector";
import { failed, notConfigured, okResult, unavailable, unsupported } from "./result";
import type { PlatformAdapter } from "./types";

interface RedditPost {
  title?: string;
  author?: string;
  permalink?: string;
  over_18?: boolean;
  is_video?: boolean;
  thumbnail?: string;
  preview?: { images?: { source?: { url?: string } }[] };
  media?: { reddit_video?: { duration?: number } } | null;
  post_hint?: string;
}
interface InfoResponse {
  data?: { children?: { data?: RedditPost }[] };
}

let cached: { token: string; exp: number } | null = null;

const configured = () => Boolean(process.env.REDDIT_CLIENT_ID && process.env.REDDIT_CLIENT_SECRET);
const userAgent = () => `web:vidomate:1.0 (by /u/${process.env.REDDIT_CONTACT_USERNAME || "vidomate"})`;

async function getToken(signal: AbortSignal): Promise<string | null> {
  if (cached && cached.exp > Date.now() + 30_000) return cached.token;
  const basic = Buffer.from(`${process.env.REDDIT_CLIENT_ID}:${process.env.REDDIT_CLIENT_SECRET}`).toString("base64");
  const res = await fetchJson<{ access_token?: string; expires_in?: number }>("https://www.reddit.com/api/v1/access_token", {
    method: "POST",
    headers: { Authorization: `Basic ${basic}`, "Content-Type": "application/x-www-form-urlencoded", "User-Agent": userAgent() },
    body: "grant_type=client_credentials",
    signal,
  });
  if (!res.ok || !res.data?.access_token) return null;
  cached = { token: res.data.access_token, exp: Date.now() + (res.data.expires_in ?? 3600) * 1000 };
  return cached.token;
}

export const redditAdapter: PlatformAdapter = {
  id: "reddit",
  mode: "needs_config",
  isConfigured: configured,

  async analyze(url, ctx) {
    let ref = extractMediaRef("reddit", url);
    if (ref.kind === "unknown") {
      return unsupported("reddit", url.toString(), "Paste a link to a single Reddit post. Subreddit and user pages aren't supported.");
    }
    if (!configured()) return notConfigured("reddit", url.toString());

    try {
      let target = url;
      if (ref.needsResolve) {
        const resolved = await resolveRedirect(url, (u) => isHostOfPlatform("reddit", u), ctx.signal);
        if (!resolved) return unavailable("reddit", url.toString(), "This share link doesn't lead to a public Reddit post.");
        target = resolved;
        ref = extractMediaRef("reddit", target);
      }
      if (!ref.id || !/^[a-z0-9]{4,10}$/i.test(ref.id)) {
        return unavailable("reddit", target.toString(), "We couldn't find a post ID in this link.");
      }

      const token = await getToken(ctx.signal);
      if (!token) return notConfigured("reddit", target.toString());

      const res = await fetchJson<InfoResponse>(`https://oauth.reddit.com/api/info?id=t3_${ref.id}&raw_json=1`, {
        headers: { Authorization: `Bearer ${token}`, "User-Agent": userAgent() },
        signal: ctx.signal,
      });
      const post = res.data?.data?.children?.[0]?.data;
      if (res.ok && post) {
        const canonical = post.permalink ? `https://www.reddit.com${post.permalink}` : target.toString();
        const preview = post.preview?.images?.[0]?.source?.url;
        const thumb = post.over_18 ? undefined : preview ?? (post.thumbnail?.startsWith("http") ? post.thumbnail : undefined);
        return okResult(
          "reddit",
          {
            canonicalUrl: canonical,
            title: post.title,
            creator: post.author ? `u/${post.author}` : undefined,
            creatorUrl: post.author ? `https://www.reddit.com/user/${post.author}` : undefined,
            thumbnailUrl: thumb,
            durationSeconds: post.media?.reddit_video?.duration,
            mediaType: post.is_video ? "video" : post.post_hint === "image" ? "image" : "post",
          },
          post.over_18 ? { notices: ["This post is marked 18+. The thumbnail is hidden."] } : {}
        );
      }
      if (res.ok) return unavailable("reddit", target.toString(), "This post was removed, is private, or isn't available.");
      if (res.status === 401 || res.status === 403) return notConfigured("reddit", target.toString());
      return failed("reddit");
    } catch {
      return failed("reddit");
    }
  },
};
