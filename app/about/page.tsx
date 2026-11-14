import type { Metadata } from "next";
import Link from "next/link";
import { PageShell } from "@/components/ui/PageShell";
import { buildMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = buildMetadata({
  title: "About VidoMate – Authorized Media Link Tools",
  description: "VidoMate is a multi-platform media link checker that shows verified details and authorized options, built around creators' rights and user privacy.",
  path: "/about",
});

export default function AboutPage() {
  return (
    <PageShell title="About VidoMate" intro="Your Videos. Your Way. Anywhere." crumbs={[{ name: "Home", href: "/" }, { name: "About", href: "/about" }]}>
      <h2>What VidoMate does</h2>
      <p>
        VidoMate is a utility for checking media links. Paste a public link from YouTube, Instagram, Facebook, TikTok, Pinterest, Reddit, Threads or Dailymotion and VidoMate identifies the platform, asks the platform&apos;s official interface what it can share, and shows
        you the result: title, creator, thumbnail and duration where available, plus the options the platform authorizes.
      </p>
      <h2>What VidoMate does not do</h2>
      <p>
        VidoMate does not bypass DRM, private accounts, logins or download protections, and it does not claim a download succeeded when it didn&apos;t. When an integration isn&apos;t configured, or a platform offers no authorized route, we tell you plainly and link you to
        the platform&apos;s own tools.
      </p>
      <h2>Why we built it this way</h2>
      <p>Creators own their work. Using official interfaces keeps the tool reliable, keeps your data private and respects the people who make the media you enjoy.</p>
      <p>
        Questions? Visit the <Link href="/contact">contact page</Link>, or read our <Link href="/privacy">Privacy Policy</Link> and <Link href="/terms">Terms of Service</Link>.
      </p>
    </PageShell>
  );
}
