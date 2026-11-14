# VidoMate

**Your Videos. Your Way. Anywhere.**

A multi-platform media link tool built with Next.js 15 (App Router), TypeScript and Tailwind CSS. Users paste a public link from YouTube, Instagram, Facebook, TikTok, Pinterest, Reddit, Threads or Dailymotion; VidoMate identifies the platform, asks the platform's **official** interface what it can share, and shows verified details plus the options the platform authorizes.

VidoMate deliberately does **not** extract streams, rip audio, strip watermarks, or bypass DRM, private accounts or logins. When something isn't available it says so ("Integration not configured", "Not supported for this link", "Media unavailable") instead of showing fake results.

## Run it

```bash
npm install
cp .env.example .env.local   # optional – see below
npm run dev                  # http://localhost:3000
npm run build && npm start   # production
npm run typecheck
```

## Integration status

| Platform    | Source                                   | Needs config?                                   |
| ----------- | ---------------------------------------- | ----------------------------------------------- |
| YouTube     | Public oEmbed (+ Data API if key set)    | No (`YOUTUBE_API_KEY` adds duration)            |
| TikTok      | Public oEmbed                            | No                                              |
| Dailymotion | Public Data API                          | No                                              |
| Instagram   | Meta oEmbed Read (Graph API)             | Yes – `META_OEMBED_ACCESS_TOKEN`                |
| Facebook    | Meta oEmbed Read (Graph API)             | Yes – `META_OEMBED_ACCESS_TOKEN`                |
| Pinterest   | Pinterest API v5                         | Yes – `PINTEREST_ACCESS_TOKEN`                  |
| Reddit      | Reddit OAuth API (app-only)              | Yes – `REDDIT_CLIENT_ID` / `REDDIT_CLIENT_SECRET` |
| Threads     | None available                           | Always returns `unsupported`                    |

Meta's oEmbed Read feature and Pinterest/Reddit API access require registering a developer app (and, for Meta, feature approval). Until then those platforms report "Integration not configured".

## Architecture

```
app/
  page.tsx                     Homepage
  [platform]/page.tsx          8 platform landing pages (SSG)
  [platform]/[tool]/page.tsx   28 tool pages (SSG, content in lib/content/tools.ts)
  about | contact | privacy | terms
  api/analyze  platforms  health  contact
  sitemap.ts  robots.ts  opengraph-image.tsx
components/  layout/ home/ downloader/ ui/ seo/
lib/
  platforms/  detector.ts types.ts result.ts catalog.ts + one adapter per platform
  validation/ url.ts (isomorphic) ssrf.ts (server: DNS/IP checks)
  utils/      http.ts rateLimit.ts logger.ts request.ts format.ts
  supabase/   server.ts (optional)
  seo/        metadata.ts jsonld.ts
  content/    tools.ts home.ts
types/        platform.ts media.ts
supabase/schema.sql
```

Every adapter implements `PlatformAdapter` (`lib/platforms/types.ts`): `mode`, `isConfigured()` and `analyze(url, ctx)`. Adding or enabling an integration means editing one file.

### Security & privacy

- **SSRF:** only hostnames on the platform allowlist are processed; user URLs are only ever passed as a *query parameter* to fixed API hosts; API fetches use `redirect: "error"`; short-link resolution follows ≤3 hops, each re-validated (http(s) only, no credentials, ports 80/443, DNS must resolve to public IPs, host must stay on the platform).
- **Abuse:** 15 analyses/min and 3 contact messages/10 min per visitor, same-origin check, body-size caps, honeypot on the contact form, 12 s overall timeout, 8 s per upstream call.
- **Rate-limit store:** in-memory by default. On Vercel (multiple instances) set `UPSTASH_REDIS_REST_URL/TOKEN` for a shared limiter.
- **Secrets:** read only in server code (`server-only`); nothing is `NEXT_PUBLIC_` except the site URL and contact email.
- **Logging:** only platform, status and timing. No URLs, IPs or message bodies.
- **Storage:** submitted URLs are never stored. Optional `analysis_history` rows hold only platform + status.

## Optional Supabase

Run `supabase/schema.sql`, then set `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY`. This enables the contact form (without it the form reports that it isn't configured) and, if `ENABLE_ANALYSIS_HISTORY=true`, anonymous usage stats. Row-level security is on with no public policies; only the server's service role can access the tables.

## Deploy to Vercel

1. Push the repo and import it in Vercel (framework preset: Next.js).
2. Add environment variables from `.env.example`. Set `NEXT_PUBLIC_SITE_URL` to your real domain (used for canonicals, sitemap and Open Graph).
3. Deploy. Then submit `https://yourdomain/sitemap.xml` in Google Search Console and Bing Webmaster Tools.

## Before going live – checklist

- [ ] Set `NEXT_PUBLIC_SITE_URL` and `NEXT_PUBLIC_CONTACT_EMAIL`.
- [ ] Have a lawyer review `/privacy` and `/terms` for your jurisdiction and add your legal entity name.
- [ ] Add a cookie/consent banner **before** enabling any ads or analytics, and update the privacy policy.
- [ ] Register the Meta / Pinterest / Reddit developer apps and add credentials.
- [ ] Configure Upstash for shared rate limiting.
- [ ] Test each integration with real links in your deployed environment.

## Notes

- Platform marks are shown as neutral monogram tiles; no third-party logos are embedded. VidoMate is not affiliated with any listed platform.
- Platform APIs change. Re-verify each adapter against the provider's current docs before launch.
