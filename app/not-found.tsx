import Link from "next/link";
import { PlatformSelector } from "@/components/downloader/PlatformSelector";

export default function NotFound() {
  return (
    <div className="container-x py-24 text-center">
      <p className="text-sm font-semibold text-accent">404</p>
      <h1 className="mt-2 text-4xl font-bold tracking-tight">Page not found</h1>
      <p className="mx-auto mt-4 max-w-md text-muted">That page doesn&apos;t exist. Pick a platform below or head back home.</p>
      <div className="mt-8">
        <PlatformSelector />
      </div>
      <Link href="/" className="btn-primary mt-8">
        Back to home
      </Link>
    </div>
  );
}
