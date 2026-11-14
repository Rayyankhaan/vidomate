import { PLATFORMS } from "@/lib/platforms/catalog";
import type { PlatformId } from "@/types/platform";

export function AnalysisLoader({ platform }: { platform: PlatformId | null }) {
  const name = platform ? PLATFORMS[platform].name : "the platform";
  return (
    <div role="status" aria-live="polite" className="card animate-rise p-5 sm:p-6">
      <div className="flex items-center gap-3 text-sm text-muted">
        <span className="h-4 w-4 animate-spin rounded-full border-2 border-primary/30 border-t-primary" aria-hidden="true" />
        Checking your link with {name}…
      </div>
      <div className="mt-5 flex gap-4">
        <div className="skeleton h-24 w-40 shrink-0 animate-shimmer rounded-xl" />
        <div className="flex-1 space-y-3">
          <div className="skeleton h-4 w-3/4 animate-shimmer rounded" />
          <div className="skeleton h-3 w-1/2 animate-shimmer rounded" />
          <div className="skeleton h-3 w-1/3 animate-shimmer rounded" />
        </div>
      </div>
    </div>
  );
}
