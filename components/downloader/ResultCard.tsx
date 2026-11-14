"use client";

import { useState } from "react";
import { PlatformIcon } from "@/components/ui/PlatformIcon";
import { PLATFORMS } from "@/lib/platforms/catalog";
import { formatDuration, isHttpsUrl } from "@/lib/utils/format";
import type { AnalysisResult } from "@/types/media";

const BANNERS: Record<string, { title: string; tone: string }> = {
  not_configured: { title: "Integration not configured", tone: "border-amber-400/30 bg-amber-400/10" },
  unsupported: { title: "Not supported for this link", tone: "border-primary/30 bg-primary/10" },
  unavailable: { title: "Media unavailable", tone: "border-amber-400/30 bg-amber-400/10" },
};

export function ResultCard({ result }: { result: AnalysisResult }) {
  const [thumbFailed, setThumbFailed] = useState(false);
  if (!result.platform) return null;

  const platform = PLATFORMS[result.platform];
  const media = result.media;
  const banner = BANNERS[result.status];
  const duration = formatDuration(media?.durationSeconds);
  const showThumb = isHttpsUrl(media?.thumbnailUrl) && !thumbFailed;

  return (
    <article aria-label="Analysis result" className="card animate-rise overflow-hidden text-left">
      {banner && (
        <div className={`border-b px-5 py-3 ${banner.tone}`}>
          <p className="text-sm font-semibold">{banner.title}</p>
          {result.message && <p className="mt-1 text-sm leading-relaxed text-fg/80">{result.message}</p>}
        </div>
      )}

      <div className="p-5 sm:p-6">
        {media && (
          <div className="flex flex-col gap-5 sm:flex-row">
            {showThumb && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={media.thumbnailUrl}
                alt={media.title ? `Thumbnail for ${media.title}` : "Media thumbnail"}
                loading="lazy"
                decoding="async"
                referrerPolicy="no-referrer"
                onError={() => setThumbFailed(true)}
                className="aspect-video w-full rounded-xl border border-fg/10 bg-bg object-cover sm:w-56"
              />
            )}
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2 text-xs text-muted">
                <PlatformIcon id={platform.id} size={24} />
                <span>{platform.name}</span>
                {media.mediaType && media.mediaType !== "unknown" && <span className="rounded-full bg-fg/[0.07] px-2 py-0.5 capitalize">{media.mediaType}</span>}
              </div>
              <h3 className="mt-2 line-clamp-3 text-lg font-semibold leading-snug">{media.title || "Untitled media"}</h3>
              <dl className="mt-3 grid grid-cols-[auto_1fr] gap-x-4 gap-y-1 text-sm">
                {media.creator && (
                  <>
                    <dt className="text-muted">Creator</dt>
                    <dd className="truncate">{media.creator}</dd>
                  </>
                )}
                {duration && (
                  <>
                    <dt className="text-muted">Duration</dt>
                    <dd>{duration}</dd>
                  </>
                )}
              </dl>
            </div>
          </div>
        )}

        {result.status === "ok" && (
          <div className="mt-5">
            <h4 className="text-sm font-semibold">Available formats</h4>
            {media && media.formats.length > 0 ? (
              <ul className="mt-2 space-y-2 text-sm">
                {media.formats.map((f) => (
                  <li key={f.id} className="flex items-center justify-between rounded-lg border border-fg/10 px-3 py-2">
                    <span>
                      {f.label}
                      {f.quality ? ` · ${f.quality}` : ""}
                      {f.container ? ` · ${f.container.toUpperCase()}` : ""}
                    </span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-1 text-sm leading-relaxed text-muted">{result.message}</p>
            )}
          </div>
        )}

        {result.actions.length > 0 && (
          <div className="mt-5 flex flex-wrap gap-3">
            {result.actions.map((a) => (
              <a
                key={a.id}
                href={a.href}
                target="_blank"
                rel="noopener noreferrer"
                title={a.description}
                className={a.kind === "download" ? "btn-primary" : "btn-ghost"}
              >
                {a.label}
                <span aria-hidden="true">↗</span>
                <span className="sr-only"> (opens in a new tab)</span>
              </a>
            ))}
          </div>
        )}

        {result.notices && result.notices.length > 0 && (
          <ul className="mt-5 space-y-1 border-t border-fg/10 pt-4 text-xs leading-relaxed text-muted">
            {result.notices.map((n) => (
              <li key={n}>{n}</li>
            ))}
          </ul>
        )}
      </div>
    </article>
  );
}
