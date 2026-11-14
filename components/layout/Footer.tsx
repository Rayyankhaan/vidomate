import Link from "next/link";
import { Logo } from "@/components/ui/Logo";
import { PLATFORM_LIST } from "@/lib/platforms/catalog";
import { SITE } from "@/lib/site";

export function Footer() {
  return (
    <footer className="mt-24 border-t border-fg/10 bg-surface/40">
      <div className="container-x grid gap-10 py-12 md:grid-cols-[1.4fr_1fr_1fr]">
        <div>
          <Logo />
          <p className="mt-4 max-w-sm text-sm leading-relaxed text-muted">
            {SITE.tagline} VidoMate helps you check media links and find official, authorized options. We respect each platform&apos;s terms and creators&apos; rights.
          </p>
        </div>

        <nav aria-label="Platforms">
          <h2 className="text-sm font-semibold text-fg">Platforms</h2>
          <ul className="mt-4 grid grid-cols-2 gap-x-4 gap-y-2 text-sm text-muted">
            {PLATFORM_LIST.map((p) => (
              <li key={p.id}>
                <Link href={`/${p.id}`} className="transition hover:text-fg">
                  {p.name}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <nav aria-label="Company">
          <h2 className="text-sm font-semibold text-fg">Company</h2>
          <ul className="mt-4 space-y-2 text-sm text-muted">
            {[
              ["/about", "About"],
              ["/contact", "Contact"],
              ["/privacy", "Privacy Policy"],
              ["/terms", "Terms of Service"],
            ].map(([href, label]) => (
              <li key={href}>
                <Link href={href} className="transition hover:text-fg">
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      <div className="border-t border-fg/10">
        <div className="container-x flex flex-col gap-2 py-6 text-xs text-muted sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} VidoMate. All rights reserved.</p>
          <p>VidoMate is not affiliated with or endorsed by any platform listed. All trademarks belong to their owners.</p>
        </div>
      </div>
    </footer>
  );
}
