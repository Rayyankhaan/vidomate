import Link from "next/link";
import { PlatformIcon } from "@/components/ui/PlatformIcon";
import { PLATFORM_LIST } from "@/lib/platforms/catalog";

export function PlatformGrid() {
  return (
    <section aria-labelledby="platforms-heading" className="container-x pt-20">
      <div className="max-w-2xl">
        <h2 id="platforms-heading" className="text-3xl font-bold tracking-tight">
          Choose your platform
        </h2>
        <p className="mt-3 text-muted">Each platform has its own page that explains exactly what's supported — and what isn't.</p>
      </div>
      <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {PLATFORM_LIST.map((p) => (
          <li key={p.id}>
            <Link href={`/${p.id}`} className="card group flex h-full flex-col gap-4 p-5 transition hover:-translate-y-0.5 hover:border-primary/50 hover:shadow-glow">
              <PlatformIcon id={p.id} size={44} />
              <div>
                <h3 className="text-lg font-semibold">{p.name}</h3>
                <p className="mt-1 text-xs font-medium uppercase tracking-wider text-accent">{p.short}</p>
                <p className="mt-3 text-sm leading-relaxed text-muted">{p.blurb}</p>
              </div>
              <span className="mt-auto text-sm font-semibold text-primary">
                Open {p.name} tools <span aria-hidden="true" className="inline-block transition group-hover:translate-x-1">→</span>
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
