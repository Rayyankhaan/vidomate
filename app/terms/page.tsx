import type { Metadata } from "next";
import Link from "next/link";
import { PageShell } from "@/components/ui/PageShell";
import { buildMetadata } from "@/lib/seo/metadata";
import { SITE } from "@/lib/site";

export const metadata: Metadata = buildMetadata({
  title: "Terms of Service – Using VidoMate Responsibly",
  description: "The rules for using VidoMate, including respect for copyright, platform terms and privacy.",
  path: "/terms",
});

export default function TermsPage() {
  return (
    <PageShell title="Terms of Service" intro="Last updated: November 14, 2026" crumbs={[{ name: "Home", href: "/" }, { name: "Terms of Service", href: "/terms" }]}>
      <p>By using VidoMate you agree to these terms. If you don&apos;t agree, please don&apos;t use the service.</p>

      <h2>1. What the service is</h2>
      <p>VidoMate lets you paste a media link, identifies its platform and shows public details and authorized options provided by that platform. It is provided “as is”, and availability depends on third-party platforms outside our control.</p>

      <h2>2. Your responsibilities</h2>
      <ul>
        <li>Only use media you own, have permission to use, or that a platform explicitly authorizes for download.</li>
        <li>Follow the terms of service of each platform you use and applicable copyright and privacy laws.</li>
        <li>Don&apos;t attempt to access private, login-gated or protected content through VidoMate, or to circumvent DRM or other technical protections.</li>
        <li>Don&apos;t abuse the service: no automated bulk requests, scraping, attempts to bypass rate limits, or attacks on our systems or on third-party platforms.</li>
      </ul>

      <h2>3. Intellectual property</h2>
      <p>All media you look up remains the property of its owners. VidoMate doesn&apos;t host, store or claim rights to any third-party media. VidoMate&apos;s own design, text and code are protected by applicable law.</p>

      <h2>4. Copyright concerns</h2>
      <p>
        If you believe content is being handled in a way that infringes your rights, contact us through the <Link href="/contact">contact page</Link>
        {SITE.contactEmail ? (
          <>
            {" "}
            or <a href={`mailto:${SITE.contactEmail}`}>{SITE.contactEmail}</a>
          </>
        ) : null}{" "}
        with the link in question and details of your claim, and we will review it promptly.
      </p>

      <h2>5. Third-party platforms</h2>
      <p>VidoMate is not affiliated with, endorsed by or sponsored by YouTube, Instagram, Facebook, TikTok, Pinterest, Reddit, Threads, Dailymotion or their owners. Names and trademarks belong to their respective owners and are used only to identify supported services.</p>

      <h2>6. Disclaimers and liability</h2>
      <p>To the fullest extent permitted by law, VidoMate makes no warranty that results will be accurate, complete or uninterrupted, and isn&apos;t liable for losses arising from use of the service or from your use of third-party content. Nothing here is legal advice.</p>

      <h2>7. Changes and termination</h2>
      <p>We may change these terms or the service at any time and may suspend access for misuse. Continued use after changes means you accept them.</p>

      <h2>8. Privacy</h2>
      <p>
        Our <Link href="/privacy">Privacy Policy</Link> explains how we handle information.
      </p>
    </PageShell>
  );
}
