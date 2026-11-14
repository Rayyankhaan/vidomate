export const PLATFORM_IDS = [
  "youtube",
  "instagram",
  "facebook",
  "tiktok",
  "pinterest",
  "reddit",
  "threads",
  "dailymotion",
] as const;

export type PlatformId = (typeof PLATFORM_IDS)[number];

export function isPlatformId(value: string): value is PlatformId {
  return (PLATFORM_IDS as readonly string[]).includes(value);
}

/** Result of one analysis request. Never "ok" unless verified data was actually returned. */
export type AnalysisStatus =
  | "ok" // verified metadata returned
  | "not_configured" // integration needs server credentials
  | "unsupported" // operation not permitted / not offered by the platform
  | "unavailable" // media private, removed, or not publicly accessible
  | "invalid_url"
  | "rate_limited"
  | "error";
