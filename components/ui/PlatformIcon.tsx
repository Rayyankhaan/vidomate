import { PLATFORMS } from "@/lib/platforms/catalog";
import type { PlatformId } from "@/types/platform";

/** Neutral monogram tile (no third-party logos are embedded). */
export function PlatformIcon({ id, size = 40 }: { id: PlatformId; size?: number }) {
  const p = PLATFORMS[id];
  return (
    <span
      aria-hidden="true"
      className="inline-flex shrink-0 items-center justify-center rounded-xl font-bold tracking-tight"
      style={{
        width: size,
        height: size,
        fontSize: Math.round(size * 0.38),
        backgroundColor: `${p.tint}26`,
        color: p.tint,
        boxShadow: `inset 0 0 0 1px ${p.tint}40`,
      }}
    >
      {p.glyph}
    </span>
  );
}
