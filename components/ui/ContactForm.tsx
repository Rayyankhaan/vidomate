"use client";

import { useState } from "react";
import { ErrorState } from "@/components/downloader/ErrorState";

type Status = { phase: "idle" } | { phase: "sending" } | { phase: "sent" } | { phase: "error"; message: string };

export function ContactForm({ fallbackEmail }: { fallbackEmail?: string }) {
  const [status, setStatus] = useState<Status>({ phase: "idle" });

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form)) as Record<string, string>;
    setStatus({ phase: "sending" });
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const json = (await res.json().catch(() => ({}))) as { ok?: boolean; error?: string };
      if (res.ok && json.ok) {
        form.reset();
        setStatus({ phase: "sent" });
      } else {
        setStatus({ phase: "error", message: json.error ?? "Something went wrong. Please try again." });
      }
    } catch {
      setStatus({ phase: "error", message: "We couldn't reach the server. Please try again." });
    }
  }

  if (status.phase === "sent") {
    return (
      <div role="status" className="card p-6 text-center">
        <p className="text-lg font-semibold">Message sent</p>
        <p className="mt-2 text-sm text-muted">Thanks for getting in touch. We&apos;ll reply by email.</p>
      </div>
    );
  }

  const field = "w-full rounded-xl border border-fg/10 bg-bg px-4 py-3 text-sm text-fg placeholder:text-muted/70 focus:border-primary/60 focus:outline-none focus:ring-2 focus:ring-primary/30";

  return (
    <form onSubmit={onSubmit} className="card space-y-4 p-6" noValidate>
      {/* Honeypot: hidden from people, tempting for bots */}
      <div className="absolute -left-[9999px] h-0 w-0 overflow-hidden" aria-hidden="true">
        <label>
          Website
          <input type="text" name="website" tabIndex={-1} autoComplete="off" />
        </label>
      </div>

      <div>
        <label htmlFor="c-name" className="mb-1.5 block text-sm font-medium">
          Name
        </label>
        <input id="c-name" name="name" required maxLength={100} autoComplete="name" className={field} />
      </div>
      <div>
        <label htmlFor="c-email" className="mb-1.5 block text-sm font-medium">
          Email
        </label>
        <input id="c-email" name="email" type="email" required maxLength={254} autoComplete="email" className={field} />
      </div>
      <div>
        <label htmlFor="c-message" className="mb-1.5 block text-sm font-medium">
          Message
        </label>
        <textarea id="c-message" name="message" required minLength={10} maxLength={2000} rows={6} className={field} />
      </div>

      {status.phase === "error" && (
        <ErrorState title="Couldn't send your message" message={fallbackEmail && status.message.includes("isn't configured") ? `${status.message}` : status.message} />
      )}

      <button type="submit" disabled={status.phase === "sending"} className="btn-primary w-full">
        {status.phase === "sending" ? "Sending…" : "Send message"}
      </button>
    </form>
  );
}
