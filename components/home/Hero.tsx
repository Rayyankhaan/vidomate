import { PlatformSelector } from "@/components/downloader/PlatformSelector";
import { UrlInput } from "@/components/downloader/UrlInput";

export function Hero() {
  return (
    <section className="hero-glow relative overflow-hidden border-b border-fg/10">
      <div className="container-x py-16 text-center sm:py-24">
        <p className="mx-auto mb-5 inline-flex items-center gap-2 rounded-full border border-fg/15 bg-fg/[0.04] px-3 py-1 text-xs font-medium text-muted">
          <span className="h-1.5 w-1.5 rounded-full bg-accent" aria-hidden="true" />
          Your Videos. Your Way. Anywhere.
        </p>
        <h1 className="mx-auto max-w-3xl text-4xl font-bold tracking-tight sm:text-6xl">
          Download Your <span className="gradient-text">Favourite Media</span>
        </h1>
        <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-muted sm:text-lg">
          Your favourite media tools in one place. Paste a supported link, explore available content and access compatible download options.
        </p>

        <div className="mx-auto mt-10 max-w-3xl">
          <UrlInput large />
        </div>

        <div className="mt-10">
          <PlatformSelector />
        </div>
      </div>
    </section>
  );
}
