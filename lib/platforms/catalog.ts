import type { PlatformId } from "@/types/platform";

export interface PlatformMeta {
  id: PlatformId;
  name: string;
  glyph: string;
  /** Brand-neutral tile color (used only for the monogram tile). */
  tint: string;
  short: string;
  /** One-sentence card description. */
  blurb: string;
  /** Page-level SEO. */
  seoTitle: string;
  seoDescription: string;
  h1: string;
  intro: string[];
  supports: string[];
  limits: string[];
  officialHelpUrl: string;
  officialOptionsNote: string;
  faqs: { q: string; a: string }[];
}

export const PLATFORMS: Record<PlatformId, PlatformMeta> = {
  youtube: {
    id: "youtube",
    name: "YouTube",
    glyph: "Yt",
    tint: "#FF4E45",
    short: "Videos, Shorts, Music",
    blurb: "Check YouTube video, Shorts and Music links and see the official ways to watch offline.",
    seoTitle: "YouTube Downloader – Check Links & Official Offline Options",
    seoDescription:
      "Paste a YouTube link to see its title, creator and thumbnail, then jump to YouTube's official offline-viewing options. No account needed, no stream extraction.",
    h1: "YouTube Downloader",
    intro: [
      "VidoMate's YouTube tool reads a public YouTube link and shows you what YouTube itself publishes about it: the title, the channel, the thumbnail and, when the video allows it, the duration. From there you get a direct link back to the video and to YouTube's own offline-viewing help.",
      "YouTube only permits downloading through its own apps (for example with YouTube Premium) or when a creator has explicitly enabled a download for their own content. VidoMate does not rip streams, extract audio or remove protections, so the tool is honest about what is and isn't available for each link.",
    ],
    supports: [
      "Public watch links (youtube.com/watch?v=…)",
      "Short links (youtu.be/…)",
      "YouTube Shorts links",
      "YouTube Music track links (metadata only)",
    ],
    limits: [
      "Private, unlisted-and-removed or age-restricted videos can't be analyzed.",
      "Playlists, channels and search pages are not supported — paste a single video link.",
      "VidoMate never provides stream downloads, audio extraction or DRM-protected content.",
    ],
    officialHelpUrl: "https://support.google.com/youtube",
    officialOptionsNote: "Offline viewing is offered inside the official YouTube app (e.g. with YouTube Premium).",
    faqs: [
      {
        q: "Can VidoMate download any YouTube video?",
        a: "No. VidoMate only shows information YouTube makes public and points you to official options. It does not extract streams, so you will not get a direct file for typical videos.",
      },
      {
        q: "Why does my YouTube link say the video is unavailable?",
        a: "The video may be private, removed, region-restricted or have embedding disabled by its owner. Open the link in YouTube to confirm it plays for you.",
      },
      {
        q: "How do I watch YouTube videos offline legitimately?",
        a: "Use the Download button in the official YouTube app where it's available to you, or download your own uploads from YouTube Studio.",
      },
    ],
  },
  instagram: {
    id: "instagram",
    name: "Instagram",
    glyph: "Ig",
    tint: "#E1306C",
    short: "Reels, Posts, Stories",
    blurb: "Analyze public Instagram Reels, posts and carousels and find authorized ways to save your own media.",
    seoTitle: "Instagram Downloader – Reels, Photos & Video Link Checker",
    seoDescription:
      "Paste a public Instagram Reel, photo or video link to check what's accessible. Respects privacy: no private-account access, no login bypass.",
    h1: "Instagram Downloader",
    intro: [
      "Paste a public Instagram link and VidoMate checks whether it can be read through Instagram's official embed interface. When it can, you see the author and thumbnail, plus a direct link to open the original.",
      "Private accounts, Stories behind a login and anything that needs authentication are never accessed. If you want to keep your own content, Instagram's Accounts Center lets you download a copy of your information.",
    ],
    supports: [
      "Public Reels (instagram.com/reel/…)",
      "Public photo and video posts (instagram.com/p/…)",
      "Public carousel posts",
      "Public IGTV links (instagram.com/tv/…)",
    ],
    limits: [
      "Stories and profile pages are not available through Instagram's public embed interface.",
      "Private accounts and login-gated content are never accessed.",
      "This integration requires server credentials; if missing, VidoMate will say so.",
    ],
    officialHelpUrl: "https://help.instagram.com",
    officialOptionsNote: "Use 'Download your information' in Instagram's Accounts Center to export your own media.",
    faqs: [
      {
        q: "Can I download a Reel from a private account?",
        a: "No. VidoMate never accesses private accounts or anything that needs a login. Only public content can be analyzed.",
      },
      {
        q: "How do I save my own Instagram content?",
        a: "Open Instagram's Accounts Center and request a copy of your information, or save the original file from your phone before posting.",
      },
      {
        q: "Why does VidoMate say 'Integration not configured' for Instagram?",
        a: "Instagram's embed API needs a developer token. When the site owner hasn't added one, VidoMate shows that message instead of faking a result.",
      },
    ],
  },
  facebook: {
    id: "facebook",
    name: "Facebook",
    glyph: "Fb",
    tint: "#4C8DFF",
    short: "Videos & Reels",
    blurb: "Check public Facebook video and Reel links and open them from the original post.",
    seoTitle: "Facebook Video Downloader – Check Public Video Links",
    seoDescription:
      "Check whether a public Facebook video or Reel link is accessible and view its details. Public content only — no login bypass or private video access.",
    h1: "Facebook Video Downloader",
    intro: [
      "VidoMate checks public Facebook video and Reel links through Facebook's official embed interface and shows whatever verified details it returns, such as the author name.",
      "Videos shared with friends, in private groups or behind a login can't be inspected, and VidoMate doesn't try to work around that. Pages and creators can download their own videos from Meta Business Suite and Creator Studio.",
    ],
    supports: ["Public video posts", "Public Reels", "Watch links", "fb.watch short links (where resolvable)"],
    limits: [
      "Friends-only, group and private videos are never accessed.",
      "Requires server-side Meta credentials; otherwise the tool reports 'Integration not configured'.",
    ],
    officialHelpUrl: "https://www.facebook.com/help",
    officialOptionsNote: "Owners can download their own videos from Meta Business Suite or Creator Studio.",
    faqs: [
      {
        q: "Does VidoMate work with private Facebook videos?",
        a: "No. Only publicly viewable videos can be checked, and nothing that requires you to be logged in.",
      },
      {
        q: "How do I download my own Facebook video?",
        a: "Open the video from your Page or profile; owners can download uploaded videos from Meta Business Suite, Creator Studio or the video's menu where offered.",
      },
      {
        q: "Why is my fb.watch link not working?",
        a: "Short links must resolve to a public Facebook video. If it redirects somewhere private or unsupported, VidoMate will report it as unavailable.",
      },
    ],
  },
  tiktok: {
    id: "tiktok",
    name: "TikTok",
    glyph: "Tk",
    tint: "#2FE4D3",
    short: "Videos & Creators",
    blurb: "Look up public TikTok videos and see which official save options the creator allows.",
    seoTitle: "TikTok Video Downloader – Link Checker & Official Save Options",
    seoDescription:
      "Paste a public TikTok link to see the video's title, creator and thumbnail, and learn how to save videos using TikTok's own download setting.",
    h1: "TikTok Video Downloader",
    intro: [
      "VidoMate looks up public TikTok links through TikTok's official oEmbed endpoint and returns the title, creator and thumbnail it publishes. You get a link back to the original video.",
      "TikTok lets each creator decide whether others can download their videos. When a creator allows it, the Save video option appears inside the TikTok app. VidoMate does not strip watermarks or bypass that setting.",
    ],
    supports: ["Public video links (tiktok.com/@user/video/…)", "Short links (vm.tiktok.com/…)", "Public creator video pages"],
    limits: [
      "Private videos and region-blocked videos can't be analyzed.",
      "Downloads are only available through TikTok's own app when the creator allows them.",
    ],
    officialHelpUrl: "https://support.tiktok.com",
    officialOptionsNote: "Use 'Save video' in the TikTok app when the creator has allowed downloads.",
    faqs: [
      {
        q: "Can VidoMate remove the TikTok watermark?",
        a: "No. VidoMate doesn't alter or re-host videos. It shows verified information and points you to TikTok's own options.",
      },
      {
        q: "Why can't I save some TikTok videos in the app?",
        a: "Creators can turn off downloads for their videos. If the option is missing, the creator hasn't allowed it.",
      },
      {
        q: "What links does the TikTok tool accept?",
        a: "Public video links from tiktok.com and vm.tiktok.com short links. Profile pages and search URLs are not supported.",
      },
    ],
  },
  pinterest: {
    id: "pinterest",
    name: "Pinterest",
    glyph: "Pi",
    tint: "#F2506B",
    short: "Pins, Images, Video",
    blurb: "Check Pinterest pins and see authorized ways to save images and videos you have rights to.",
    seoTitle: "Pinterest Downloader – Pin Image & Video Link Checker",
    seoDescription:
      "Check a Pinterest pin to see its title and media type, and learn how to save your own pins. Authorized access only, through Pinterest's official API.",
    h1: "Pinterest Downloader",
    intro: [
      "Paste a Pinterest pin link and VidoMate checks it through Pinterest's official API when the site owner has connected an access token. You'll see the pin title and media type, and a link to open the original.",
      "Pins are usually created by someone else, so reuse requires the creator's permission. For your own pins, Pinterest's settings let you download your data.",
    ],
    supports: ["Pin links (pinterest.com/pin/…)", "pin.it short links", "Image and video pins (metadata)"],
    limits: [
      "The Pinterest API only returns pins the connected account is allowed to access.",
      "Requires a server-side access token; otherwise the tool reports 'Integration not configured'.",
    ],
    officialHelpUrl: "https://help.pinterest.com",
    officialOptionsNote: "Request your own data and media from Pinterest's account settings.",
    faqs: [
      {
        q: "Can I download any pin from Pinterest?",
        a: "Not through VidoMate. Only pins accessible via the official API are inspected, and you still need the creator's permission to reuse them.",
      },
      {
        q: "How do I get my own pins back?",
        a: "Use Pinterest's data request in your account settings to download your pins and boards.",
      },
      {
        q: "Does VidoMate work with pin.it links?",
        a: "Yes. Short links are safely resolved to the pin they point to, as long as they lead to Pinterest.",
      },
    ],
  },
  reddit: {
    id: "reddit",
    name: "Reddit",
    glyph: "Rd",
    tint: "#FF7A45",
    short: "Posts & Videos",
    blurb: "Look up Reddit posts with media and open them on Reddit.",
    seoTitle: "Reddit Video Downloader – Post & Media Link Checker",
    seoDescription:
      "Paste a Reddit post link to view its title, author and media type through Reddit's official API, then open the original post.",
    h1: "Reddit Video Downloader",
    intro: [
      "VidoMate reads Reddit post links through Reddit's official API (using app credentials configured by the site owner) and shows the post title, author, thumbnail and whether it contains video.",
      "Media on Reddit belongs to its uploaders. VidoMate gives you verified details and a link to the original post, and does not re-host or extract the video files.",
    ],
    supports: ["Post links (reddit.com/r/…/comments/…)", "redd.it short links", "Share links (r/…/s/…) where resolvable"],
    limits: [
      "Private, quarantined and removed posts can't be analyzed.",
      "Requires Reddit API credentials on the server; otherwise the tool reports 'Integration not configured'.",
    ],
    officialHelpUrl: "https://support.reddithelp.com",
    officialOptionsNote: "Open the post on Reddit to use any save or share options the uploader allows.",
    faqs: [
      {
        q: "Does VidoMate download Reddit videos?",
        a: "VidoMate shows verified post details and links to the original. It doesn't extract or host the video files.",
      },
      {
        q: "Why can't it find my Reddit post?",
        a: "The post may be removed, private, or in a restricted community. Check that it's visible when logged out.",
      },
      {
        q: "Are NSFW posts supported?",
        a: "Adult-marked posts are identified with a notice and their thumbnails are not displayed.",
      },
    ],
  },
  threads: {
    id: "threads",
    name: "Threads",
    glyph: "Th",
    tint: "#C9CEDD",
    short: "Posts & Media",
    blurb: "Open Threads posts and learn about authorized ways to save media you own.",
    seoTitle: "Threads Media Viewer & Authorized Downloader Guide",
    seoDescription:
      "Understand what's possible with Threads media: open public posts, and learn how to export your own Threads content using official tools.",
    h1: "Threads Media Viewer",
    intro: [
      "Threads does not currently offer a public media endpoint that VidoMate can use to read post details or file downloads for arbitrary links. Rather than pretend otherwise, this page validates your link and sends you to the original post.",
      "If you want to keep your own Threads content, use the data download tools in your Threads/Instagram account settings.",
    ],
    supports: ["Recognition of threads.net / threads.com post links", "Direct link to open the original post"],
    limits: [
      "No media details or downloads are retrieved — this operation is explicitly marked unsupported.",
      "Private profiles and login-gated posts are never accessed.",
    ],
    officialHelpUrl: "https://help.instagram.com",
    officialOptionsNote: "Download your Threads information from your account settings.",
    faqs: [
      {
        q: "Why doesn't VidoMate show Threads media?",
        a: "There is no authorized public interface for it. VidoMate reports 'unsupported' instead of inventing a result.",
      },
      {
        q: "How do I export my own Threads posts?",
        a: "Request a copy of your information from your Threads or Instagram account settings.",
      },
      {
        q: "Will Threads support be added?",
        a: "If Meta publishes a public media API, an adapter can be enabled without changing the interface.",
      },
    ],
  },
  dailymotion: {
    id: "dailymotion",
    name: "Dailymotion",
    glyph: "Dm",
    tint: "#5B9CFF",
    short: "Videos & Channels",
    blurb: "Look up public Dailymotion videos with verified title, channel and duration.",
    seoTitle: "Dailymotion Video Downloader – Link Checker & Video Info",
    seoDescription:
      "Paste a Dailymotion link to see the verified title, channel, duration and thumbnail from Dailymotion's public API, then open the video.",
    h1: "Dailymotion Video Downloader",
    intro: [
      "VidoMate looks up public Dailymotion videos through Dailymotion's open Data API, which needs no key for public videos. You get the title, channel, duration and thumbnail.",
      "The API does not provide downloadable files, so VidoMate links you to the video on Dailymotion rather than offering a file. Partners and uploaders can download their own content from their Dailymotion studio.",
    ],
    supports: ["Video links (dailymotion.com/video/…)", "dai.ly short links", "Public videos only"],
    limits: [
      "Private, password-protected and removed videos can't be analyzed.",
      "No downloadable files are offered through the public API.",
    ],
    officialHelpUrl: "https://faq.dailymotion.com",
    officialOptionsNote: "Uploaders can manage and export their own videos from their Dailymotion account.",
    faqs: [
      {
        q: "Is the Dailymotion lookup real-time?",
        a: "Yes. Each lookup queries Dailymotion's API at the moment you submit the link; VidoMate doesn't cache or store the result.",
      },
      {
        q: "Why is no download button shown?",
        a: "Dailymotion's public API doesn't expose downloadable files, so VidoMate shows an 'Open on Dailymotion' action only.",
      },
      {
        q: "Does it work for private videos?",
        a: "No. Private or password-protected videos return an unavailable message.",
      },
    ],
  },
};

export const PLATFORM_LIST: PlatformMeta[] = Object.values(PLATFORMS);

export function getPlatform(id: string): PlatformMeta | undefined {
  return (PLATFORMS as Record<string, PlatformMeta>)[id];
}
