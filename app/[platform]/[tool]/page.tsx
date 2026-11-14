import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ToolLayout } from "@/components/downloader/ToolLayout";
import { TOOLS, getTool, getToolsFor, stepsFor, toolPath } from "@/lib/content/tools";
import { getPlatform } from "@/lib/platforms/catalog";
import { breadcrumbLd, faqLd, webAppLd } from "@/lib/seo/jsonld";
import { buildMetadata } from "@/lib/seo/metadata";

export const dynamicParams = false;

export function generateStaticParams() {
  return TOOLS.map((t) => ({ platform: t.platform, tool: t.slug }));
}

type Params = Promise<{ platform: string; tool: string }>;

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { platform, tool } = await params;
  const t = getTool(platform, tool);
  if (!t) return {};
  return buildMetadata({ title: t.seoTitle, description: t.description, path: toolPath(t) });
}

export default async function ToolPage({ params }: { params: Params }) {
  const { platform, tool } = await params;
  const t = getTool(platform, tool);
  const p = getPlatform(platform);
  if (!t || !p) notFound();

  const crumbs = [
    { name: "Home", href: "/" },
    { name: p.name, href: `/${p.id}` },
    { name: t.name, href: toolPath(t) },
  ];

  const siblings = getToolsFor(p.id).filter((x) => x.slug !== t.slug);
  const preferred = t.related.map((slug) => siblings.find((s) => s.slug === slug)).filter((x): x is NonNullable<typeof x> => Boolean(x));
  const related = [
    { href: `/${p.id}`, name: `${p.name} overview`, desc: p.blurb },
    ...[...preferred, ...siblings.filter((s) => !preferred.includes(s))].slice(0, 5).map((s) => ({ href: toolPath(s), name: s.name, desc: s.lead })),
  ];

  return (
    <ToolLayout
      platform={p.id}
      h1={t.h1}
      lead={t.lead}
      about={t.about}
      steps={stepsFor(t)}
      supports={t.supports}
      limits={t.limits}
      faqs={t.faqs}
      crumbs={crumbs}
      relatedTitle={`Related ${p.name} tools`}
      related={related}
      jsonLd={[breadcrumbLd(crumbs.map((c) => ({ name: c.name, path: c.href }))), faqLd(t.faqs), webAppLd(t.name, t.description, toolPath(t))]}
    />
  );
}
