"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Logo } from "@/components/ui/Logo";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { PLATFORM_LIST } from "@/lib/platforms/catalog";
import { MobileNav } from "./MobileNav";

export function Header() {
  const pathname = usePathname();

  const linkClass = (active: boolean) =>
    `rounded-lg px-3 py-2 text-sm font-medium transition ${active ? "bg-primary/15 text-primary" : "text-muted hover:bg-fg/[0.06] hover:text-fg"}`;

  return (
    <header className="sticky top-0 z-50 h-16 border-b border-fg/10 bg-bg/80 backdrop-blur-xl">
      <div className="container-x flex h-full items-center justify-between gap-4">
        <Logo />

        <nav aria-label="Primary" className="hidden items-center gap-0.5 xl:flex">
          <Link href="/" aria-current={pathname === "/" ? "page" : undefined} className={linkClass(pathname === "/")}>
            Home
          </Link>
          {PLATFORM_LIST.map((p) => {
            const active = pathname === `/${p.id}` || pathname.startsWith(`/${p.id}/`);
            return (
              <Link key={p.id} href={`/${p.id}`} aria-current={active ? "page" : undefined} className={linkClass(active)}>
                {p.name}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          <MobileNav />
        </div>
      </div>
    </header>
  );
}
