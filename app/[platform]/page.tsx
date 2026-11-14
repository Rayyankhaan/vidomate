import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ToolLayout } from "@/components/downloader/ToolLayout";
import { getToolsFor, stepsFor, toolPath } from "@/lib/content/tools";
import { PLATFORM_LIST, getPlatform } from "@/lib/platforms/catalog";
import { breadcrumbLd, faqLd, webAppLd } from "@/lib/seo/jsonld";
import { buildMetadata } from "@/lib/seo/metadata";

export const dynamicParams = false;

export function generateStaticParams() {
  return PLATFORM_LIST.map((p) => ({ platform: p.id }));
}

export async function generateMetadata({ params }: { params: Promise<{ platform: string }> }): Promise<Metadata> {
  const { platform } = await params;
  const p = getPlatform(platform);
  if (!p) return {};
  return buildMetadata({ title: p.seoTitle, description: p.seoDescription, path: `/${p.id}` });
}

export default async function PlatformPage({ params }: { params: Promise<{ platform: string }> }) {
  const { platform } = await params;
  const p = getPlatform(platform);
  if (!p) notFound();

  const tools = getToolsFor(p.id);
  const crumbs = [
    { name: "Home", href: "/" },
    { name: p.name, href: `/${p.id}` },
  ];

  return (
    <ToolLayout
      platform={p.id}
      h1={p.h1}
      lead={p.seoDescription}
      about={p.intro}
      steps={stepsFor({ noun: `${p.name} media`, where: `Open the media in ${p.name}, use Share, then Copy link — or copy the address from your browser.` })}
      supports={p.supports}
      limits={p.limits}
      faqs={p.faqs}
      crumbs={crumbs}
      relatedTitle={`More ${p.name} tools`}
      related={tools.map((t) => ({ href: toolPath(t), name: t.name, desc: t.lead }))}
      jsonLd={[breadcrumbLd(crumbs.map((c) => ({ name: c.name, path: c.href }))), faqLd(p.faqs), webAppLd(p.h1, p.seoDescription, `/${p.id}`)]}
    />
  );
}
