import Link from "next/link";

export function LogoMark({ size = 36 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" aria-hidden="true" focusable="false">
      <defs>
        <linearGradient id="vm-logo-g" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#8B7CFF" />
          <stop offset="1" stopColor="#43D9E8" />
        </linearGradient>
      </defs>
      <rect width="64" height="64" rx="18" fill="url(#vm-logo-g)" />
      <path d="M25 18.5v27a2 2 0 0 0 3 1.7l23-13.5a2 2 0 0 0 0-3.4L28 16.8a2 2 0 0 0-3 1.7Z" fill="#101426" />
    </svg>
  );
}

export function Logo({ className = "" }: { className?: string }) {
  return (
    <Link href="/" aria-label="VidoMate home" className={`inline-flex items-center gap-2.5 ${className}`}>
      <LogoMark />
      <span className="text-xl font-bold tracking-tight">
        <span className="text-primary">Vido</span>
        <span className="text-accent">Mate</span>
      </span>
    </Link>
  );
}
