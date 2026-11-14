import Link from "next/link";
import { FAQ } from "@/components/home/FAQ";
import { JsonLd } from "@/components/seo/JsonLd";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { PlatformIcon } from "@/components/ui/PlatformIcon";
import { PLATFORM_LIST } from "@/lib/platforms/catalog";
import type { PlatformId } from "@/types/platform";
import { PlatformSelector } from "./PlatformSelector";
import { UrlInput } from "./UrlInput";

export interface RelatedLink {
  href: string;
  name: string;
  desc?: string;
}

interface Props {
  platform: PlatformId;
  h1: string;
  lead: string;
  about: string[];
  steps: { title: string; body: string }[];
  supports: string[];
  limits: string[];
  faqs: { q: string; a: string }[];
  crumbs: { name: string; href: string }[];
  relatedTitle: string;
  related: RelatedLink[];
  jsonLd: object[];
}

/** Shared layout for platform landing pages and individual tool pages. */
export function ToolLayout(p: Props) {
  const others = PLATFORM_LIST.filter((x) => x.id !== p.platform);

  return (
    <>
      <JsonLd data={p.jsonLd} />

      <section className="hero-glow border-b border-fg/10">
        <div className="container-x py-12 text-center sm:py-20">
          <Breadcrumbs items={p.crumbs} />
          <h1 className="mx-auto max-w-3xl text-4xl font-bold tracking-tight sm:text-5xl">
            <span className="gradient-text">{p.h1}</span>
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-muted sm:text-lg">{p.lead}</p>
          <div className="mx-auto mt-8 max-w-3xl">
            <UrlInput platformHint={p.platform} />
          </div>
          <div className="mt-8">
            <PlatformSelector active={p.platform} />
          </div>
        </div>
      </section>

      <div className="container-x">
        <article className="prose-vm max-w-3xl pt-4">
          <h2>About this tool</h2>
          {p.about.map((t) => (
            <p key={t.slice(0, 40)}>{t}</p>
          ))}

          <h2>How to use it</h2>
          <ol className="not-prose mb-4 space-y-4">
            {p.steps.map((s, i) => (
              <li key={s.title} className="card flex gap-4 p-4">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-brand-gradient text-sm font-bold text-[#0b0f1f]" aria-hidden="true">
                  {i + 1}
                </span>
                <div>
                  <h3 className="!mb-1 !mt-0 text-base font-semibold text-fg">{s.title}</h3>
                  <p className="!mb-0 text-sm leading-relaxed text-muted">{s.body}</p>
                </div>
              </li>
            ))}
          </ol>

          <h2>Supported content</h2>
          <ul>
            {p.supports.map((s) => (
              <li key={s}>{s}</li>
            ))}
          </ul>

          <h2>Good to know</h2>
          <ul>
            {p.limits.map((s) => (
              <li key={s}>{s}</li>
            ))}
          </ul>
          <p>
            VidoMate only works with media you own, have permission to use, or that a platform explicitly authorizes for download. Read our{" "}
            <Link href="/terms">Terms of Service</Link> and <Link href="/privacy">Privacy Policy</Link>.
          </p>
        </article>
      </div>

      <FAQ faqs={p.faqs} heading={`${p.h1} FAQ`} id="tool-faq" />

      <section aria-labelledby="related-heading" className="container-x pt-20">
        <h2 id="related-heading" className="text-2xl font-bold tracking-tight">
          {p.relatedTitle}
        </h2>
        <ul className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {p.related.map((r) => (
            <li key={r.href}>
              <Link href={r.href} className="card block h-full p-5 transition hover:border-primary/50">
                <span className="block font-semibold">{r.name}</span>
                {r.desc && <span className="mt-1 block text-sm leading-relaxed text-muted">{r.desc}</span>}
              </Link>
            </li>
          ))}
        </ul>

        <h3 className="mt-12 text-lg font-semibold">Other platforms</h3>
        <ul className="mt-4 flex flex-wrap gap-3">
          {others.map((o) => (
            <li key={o.id}>
              <Link href={`/${o.id}`} className="flex items-center gap-2 rounded-full border border-fg/10 bg-fg/[0.03] px-3 py-1.5 text-sm text-muted transition hover:border-fg/25 hover:text-fg">
                <PlatformIcon id={o.id} size={22} />
                {o.name}
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </>
  );
}
