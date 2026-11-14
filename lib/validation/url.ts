/**
 * Pure, isomorphic URL validation (safe to import in client components).
 * Server-only network checks live in ./ssrf.ts.
 */

export const MAX_URL_LENGTH = 2048;

export type ParseResult = { ok: true; url: URL } | { ok: false; reason: string };

// Control chars, zero-width and bidi characters that are sometimes pasted along with links.
const INVISIBLE = /[\u0000-\u001F\u007F​-‏‪-‮⁠﻿]/g;

export function sanitizeUrlInput(raw: string): string {
  return raw
    .replace(INVISIBLE, "")
    .trim()
    .replace(/^[<"'`(\[]+/, "")
    .replace(/[>"'`)\].,;]+$/, "")
    .trim();
}

const IPV4_LITERAL = /^\d{1,3}(\.\d{1,3}){3}$/;

export function parseUserUrl(raw: string): ParseResult {
  if (typeof raw !== "string") return { ok: false, reason: "Please enter a link." };

  const cleaned = sanitizeUrlInput(raw);
  if (!cleaned) return { ok: false, reason: "Paste a link to get started." };
  if (cleaned.length > MAX_URL_LENGTH) return { ok: false, reason: "That link is too long." };
  if (/\s/.test(cleaned)) return { ok: false, reason: "A link can't contain spaces. Paste a single URL." };

  // Allow "instagram.com/reel/xyz" without a scheme, but never accept other schemes.
  let candidate = cleaned;
  if (/^[a-z][a-z0-9+.-]*:/i.test(candidate) && !/^https?:\/\//i.test(candidate)) {
    return { ok: false, reason: "Only http(s) links are supported." };
  }
  if (!/^https?:\/\//i.test(candidate)) candidate = `https://${candidate}`;

  let url: URL;
  try {
    url = new URL(candidate);
  } catch {
    return { ok: false, reason: "That doesn't look like a valid link." };
  }

  if (url.protocol !== "https:" && url.protocol !== "http:") {
    return { ok: false, reason: "Only http(s) links are supported." };
  }
  if (url.username || url.password) {
    return { ok: false, reason: "Links containing credentials are not accepted." };
  }

  const host = url.hostname.toLowerCase();
  if (
    !host.includes(".") ||
    host === "localhost" ||
    host.endsWith(".localhost") ||
    host.endsWith(".local") ||
    host.endsWith(".internal") ||
    IPV4_LITERAL.test(host) ||
    host.startsWith("[")
  ) {
    return { ok: false, reason: "Enter a link from a supported platform." };
  }

  return { ok: true, url };
}
