import type { AnalysisStatus, PlatformId } from "./platform";

export interface MediaFormat {
  id: string;
  label: string;
  container?: string;
  quality?: string;
  sizeBytes?: number;
  /** Only present when the platform explicitly authorizes this download. */
  href: string;
}

export interface MediaInfo {
  title?: string;
  creator?: string;
  creatorUrl?: string;
  thumbnailUrl?: string;
  durationSeconds?: number;
  mediaType?: "video" | "image" | "audio" | "post" | "unknown";
  canonicalUrl: string;
  /** Authorized formats only. Empty when the platform offers none through a permitted channel. */
  formats: MediaFormat[];
}

export interface MediaAction {
  id: string;
  label: string;
  description?: string;
  href: string;
  kind: "open_original" | "official_help" | "download";
}

export interface AnalysisResult {
  status: AnalysisStatus;
  platform: PlatformId | null;
  /** User-facing explanation for any non-"ok" status (and context for "ok"). */
  message?: string;
  media?: MediaInfo;
  actions: MediaAction[];
  /** Honest statement of whether a download is offered through an authorized channel. */
  downloadSupport: "available" | "not_offered" | "unknown";
  notices?: string[];
}
