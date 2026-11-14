import type { Metadata } from "next";
import { FAQ } from "@/components/home/FAQ";
import { Features } from "@/components/home/Features";
import { Hero } from "@/components/home/Hero";
import { HowItWorks } from "@/components/home/HowItWorks";
import { PlatformGrid } from "@/components/home/PlatformGrid";
import { PopularTools } from "@/components/home/PopularTools";
import { JsonLd } from "@/components/seo/JsonLd";
import { HOME_FAQS } from "@/lib/content/home";
import { buildMetadata } from "@/lib/seo/metadata";
import { faqLd, siteLd } from "@/lib/seo/jsonld";

export const metadata: Metadata = buildMetadata({
  title: "VidoMate – Instagram, TikTok & YouTube Link Checker | Download Options",
  description:
    "Paste an Instagram Reel, TikTok, YouTube, Facebook, Pinterest, Reddit, Threads or Dailymotion link to see verified details and authorized download options.",
  path: "/",
});

export default function HomePage() {
  return (
    <>
      <JsonLd data={[...siteLd(), faqLd(HOME_FAQS)]} />
      <Hero />
      <PlatformGrid />
      <PopularTools />
      <HowItWorks />
      <Features />
      <FAQ faqs={HOME_FAQS} />
    </>
  );
}
