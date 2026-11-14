export const SITE = {
  name: "VidoMate",
  tagline: "Your Videos. Your Way. Anywhere.",
  url: (process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000").replace(/\/$/, ""),
  contactEmail: process.env.NEXT_PUBLIC_CONTACT_EMAIL || "",
  description:
    "VidoMate is a multi-platform media link tool. Paste a supported link, explore available content and access compatible, authorized download options.",
} as const;

export function absoluteUrl(path = "/"): string {
  return `${SITE.url}${path.startsWith("/") ? path : `/${path}`}`;
}
