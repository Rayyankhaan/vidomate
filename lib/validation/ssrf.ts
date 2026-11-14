import "server-only";
import dns from "node:dns/promises";
import net from "node:net";

/** True for loopback, private, link-local, CGNAT, multicast, reserved and unspecified addresses. */
export function isPrivateIp(ip: string): boolean {
  if (net.isIPv4(ip)) {
    const [a, b, c] = ip.split(".").map(Number);
    return (
      a === 0 ||
      a === 10 ||
      a === 127 ||
      (a === 100 && b >= 64 && b <= 127) ||
      (a === 169 && b === 254) ||
      (a === 172 && b >= 16 && b <= 31) ||
      (a === 192 && b === 0 && c === 0) ||
      (a === 192 && b === 168) ||
      (a === 198 && (b === 18 || b === 19)) ||
      a >= 224
    );
  }
  if (net.isIPv6(ip)) {
    const v = ip.toLowerCase();
    if (v === "::" || v === "::1") return true;
    const mapped = v.match(/^::ffff:(\d+\.\d+\.\d+\.\d+)$/);
    if (mapped) return isPrivateIp(mapped[1]);
    return v.startsWith("fc") || v.startsWith("fd") || v.startsWith("fe8") || v.startsWith("fe9") || v.startsWith("fea") || v.startsWith("feb") || v.startsWith("ff");
  }
  return true; // not a valid IP → treat as unsafe
}

export class UnsafeUrlError extends Error {}

/**
 * Throws unless the URL is http(s), has no credentials, uses a standard port and every
 * address its hostname resolves to is publicly routable.
 */
export async function assertPublicUrl(url: URL): Promise<void> {
  if (url.protocol !== "https:" && url.protocol !== "http:") throw new UnsafeUrlError("Blocked protocol");
  if (url.username || url.password) throw new UnsafeUrlError("Credentials not allowed");
  if (url.port && url.port !== "80" && url.port !== "443") throw new UnsafeUrlError("Blocked port");

  const host = url.hostname.toLowerCase();
  if (host === "localhost" || host.endsWith(".localhost") || host.endsWith(".local") || host.endsWith(".internal")) {
    throw new UnsafeUrlError("Blocked host");
  }

  const bare = host.replace(/^\[|\]$/g, "");
  if (net.isIP(bare)) {
    if (isPrivateIp(bare)) throw new UnsafeUrlError("Blocked address");
    return;
  }

  let addrs: { address: string }[];
  try {
    addrs = await dns.lookup(bare, { all: true });
  } catch {
    throw new UnsafeUrlError("Host did not resolve");
  }
  if (addrs.length === 0 || addrs.some((a) => isPrivateIp(a.address))) {
    throw new UnsafeUrlError("Blocked address");
  }
}
