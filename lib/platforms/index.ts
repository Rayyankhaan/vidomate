import "server-only";
import type { PlatformId } from "@/types/platform";
import { dailymotionAdapter } from "./dailymotion";
import { facebookAdapter } from "./facebook";
import { instagramAdapter } from "./instagram";
import { pinterestAdapter } from "./pinterest";
import { redditAdapter } from "./reddit";
import { threadsAdapter } from "./threads";
import { tiktokAdapter } from "./tiktok";
import type { PlatformAdapter } from "./types";
import { youtubeAdapter } from "./youtube";

export const ADAPTERS: Record<PlatformId, PlatformAdapter> = {
  youtube: youtubeAdapter,
  instagram: instagramAdapter,
  facebook: facebookAdapter,
  tiktok: tiktokAdapter,
  pinterest: pinterestAdapter,
  reddit: redditAdapter,
  threads: threadsAdapter,
  dailymotion: dailymotionAdapter,
};

export function getAdapter(id: PlatformId): PlatformAdapter {
  return ADAPTERS[id];
}
