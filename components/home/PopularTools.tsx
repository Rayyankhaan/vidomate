import Link from "next/link";
import { PlatformIcon } from "@/components/ui/PlatformIcon";
import { POPULAR_TOOLS, toolPath } from "@/lib/content/tools";

export function PopularTools() {
  return (
    <section aria-labelledby="popular-heading" className="container-x pt-20">
      <div className="max-w-2xl">
        <h2 id="popular-heading" className="text-3xl font-bold tracking-tight">
          Popular tools
        </h2>
        <p className="mt-3 text-muted">Jump straight to the link checker you need.</p>
      </div>
      <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {POPULAR_TOOLS.map((t) => (
          <li key={toolPath(t)}>
            <Link href={toolPath(t)} className="card flex h-full items-start gap-4 p-5 transition hover:border-primary/50 hover:bg-fg/[0.03]">
              <PlatformIcon id={t.platform} size={40} />
              <span>
                <span className="block font-semibold">{t.name}</span>
                <span className="mt-1 block text-sm leading-relaxed text-muted">{t.lead}</span>
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
