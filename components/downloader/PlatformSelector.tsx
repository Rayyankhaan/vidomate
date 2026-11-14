import Link from "next/link";
import { PlatformIcon } from "@/components/ui/PlatformIcon";
import { PLATFORM_LIST } from "@/lib/platforms/catalog";
import type { PlatformId } from "@/types/platform";

/** Row of supported-platform icons. Server component; links to each platform page. */
export function PlatformSelector({ active }: { active?: PlatformId }) {
  return (
    <nav aria-label="Supported platforms" className="flex flex-wrap items-center justify-center gap-2">
      {PLATFORM_LIST.map((p) => (
        <Link
          key={p.id}
          href={`/${p.id}`}
          aria-current={active === p.id ? "page" : undefined}
          className={`group flex items-center gap-2 rounded-full border px-3 py-1.5 text-sm transition ${
            active === p.id ? "border-primary/60 bg-primary/15 text-fg" : "border-fg/10 bg-fg/[0.03] text-muted hover:border-fg/25 hover:text-fg"
          }`}
        >
          <PlatformIcon id={p.id} size={22} />
          {p.name}
        </Link>
      ))}
    </nav>
  );
}
