import type { Metadata } from "next";
import { ContactForm } from "@/components/ui/ContactForm";
import { PageShell } from "@/components/ui/PageShell";
import { buildMetadata } from "@/lib/seo/metadata";
import { SITE } from "@/lib/site";

export const metadata: Metadata = buildMetadata({
  title: "Contact VidoMate – Support, Feedback & Copyright Requests",
  description: "Get in touch with VidoMate for support, feedback or copyright and takedown requests.",
  path: "/contact",
});

export default function ContactPage() {
  return (
    <PageShell title="Contact us" intro="Questions, feedback or a copyright concern? Send us a message." crumbs={[{ name: "Home", href: "/" }, { name: "Contact", href: "/contact" }]}>
      {SITE.contactEmail && (
        <p className="text-center">
          Prefer email? Write to <a href={`mailto:${SITE.contactEmail}`}>{SITE.contactEmail}</a>.
        </p>
      )}
      <ContactForm fallbackEmail={SITE.contactEmail || undefined} />
    </PageShell>
  );
}
