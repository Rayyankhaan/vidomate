import type { Metadata } from "next";
import Link from "next/link";
import { PageShell } from "@/components/ui/PageShell";
import { buildMetadata } from "@/lib/seo/metadata";
import { SITE } from "@/lib/site";

export const metadata: Metadata = buildMetadata({
  title: "Privacy Policy – How VidoMate Handles Your Data",
  description: "What VidoMate processes when you analyze a link, what it doesn't store, and how to contact us about privacy.",
  path: "/privacy",
});

export default function PrivacyPage() {
  return (
    <PageShell title="Privacy Policy" intro="Last updated: November 14, 2026" crumbs={[{ name: "Home", href: "/" }, { name: "Privacy Policy", href: "/privacy" }]}>
      <p>This policy explains what happens to information when you use VidoMate. We aim to collect as little as possible.</p>

      <h2>Links you analyze</h2>
      <p>
        When you press Analyze Link, your browser sends the link to our server. The server validates it and asks the relevant platform&apos;s official interface for public details about that media. The link is used for that request only and is not stored in our database or logs.
        Because the platform receives the link in order to answer, its own privacy policy applies to that request.
      </p>

      <h2>What we log</h2>
      <p>
        Server logs record only coarse events such as the platform, result status and response time. They do not contain submitted links, IP addresses or message text. Our hosting provider may keep standard infrastructure logs (which can include IP addresses) under its own policy.
      </p>

      <h2>Rate limiting and abuse prevention</h2>
      <p>To prevent abuse we limit how often a visitor can submit requests. This uses a salted, one-way hash of the visitor&apos;s IP address held temporarily (typically one minute to ten minutes) — never the raw address.</p>

      <h2>Optional anonymous statistics</h2>
      <p>If enabled by the site operator, we record the platform and result status of each analysis (for example “tiktok / ok”). We never record the link, an IP address or any account identifier with it.</p>

      <h2>Contact messages</h2>
      <p>If you use the contact form, we store your name, email address and message so we can reply. We use them only for that purpose.</p>

      <h2>Cookies and local storage</h2>
      <p>VidoMate stores one preference in your browser&apos;s local storage: your light/dark theme choice. We don&apos;t set tracking cookies. If advertising or analytics services are added to this site, this policy and any required consent notices will be updated before they are enabled.</p>

      <h2>Accounts</h2>
      <p>You don&apos;t need an account to analyze links.</p>

      <h2>Your rights and contact</h2>
      <p>
        Depending on where you live, you may have rights to access, correct or delete personal data we hold (such as a contact message). To make a request, use the <Link href="/contact">contact page</Link>
        {SITE.contactEmail ? (
          <>
            {" "}
            or email <a href={`mailto:${SITE.contactEmail}`}>{SITE.contactEmail}</a>
          </>
        ) : null}
        .
      </p>

      <h2>Changes</h2>
      <p>We may update this policy and will change the date above when we do.</p>
    </PageShell>
  );
}
