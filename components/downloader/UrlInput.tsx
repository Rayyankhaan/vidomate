"use client";

import Link from "next/link";
import { useId, useMemo, useRef, useState } from "react";
import { PlatformIcon } from "@/components/ui/PlatformIcon";
import { PLATFORM_LIST, PLATFORMS } from "@/lib/platforms/catalog";
import { detectPlatform } from "@/lib/platforms/detector";
import { parseUserUrl } from "@/lib/validation/url";
import type { AnalysisResult } from "@/types/media";
import type { PlatformId } from "@/types/platform";
import { AnalysisLoader } from "./AnalysisLoader";
import { ErrorState } from "./ErrorState";
import { ResultCard } from "./ResultCard";

type State =
  | { phase: "idle" }
  | { phase: "loading"; platform: PlatformId | null }
  | { phase: "done"; result: AnalysisResult }
  | { phase: "error"; title?: string; message: string };

const SUPPORTED_NAMES = PLATFORM_LIST.map((p) => p.name).join(", ");

export function UrlInput({ platformHint, large = false }: { platformHint?: PlatformId; large?: boolean }) {
  const inputId = useId();
  const hintId = useId();
  const [value, setValue] = useState("");
  const [state, setState] = useState<State>({ phase: "idle" });
  const [pasteNote, setPasteNote] = useState<string | null>(null);
  const abortRef = useRef<AbortController | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const detected = useMemo<PlatformId | null>(() => {
    if (!value.trim()) return null;
    const parsed = parseUserUrl(value);
    return parsed.ok ? detectPlatform(parsed.url) : null;
  }, [value]);

  const mismatch = platformHint && detected && detected !== platformHint ? detected : null;

  async function analyze(e?: React.FormEvent) {
    e?.preventDefault();
    setPasteNote(null);

    const parsed = parseUserUrl(value);
    if (!parsed.ok) {
      setState({ phase: "error", title: "Check your link", message: parsed.reason });
      inputRef.current?.focus();
      return;
    }
    const platform = detectPlatform(parsed.url);
    if (!platform) {
      setState({ phase: "error", title: "Unsupported platform", message: `This link isn't from a supported platform. Supported: ${SUPPORTED_NAMES}.` });
      inputRef.current?.focus();
      return;
    }

    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;
    setState({ phase: "loading", platform });

    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: parsed.url.toString() }),
        signal: AbortSignal.any([controller.signal, AbortSignal.timeout(20_000)]),
      });
      const data = (await res.json()) as AnalysisResult;
      if (!data || typeof data.status !== "string") throw new Error("bad response");

      if (data.status === "invalid_url" || data.status === "rate_limited" || data.status === "error") {
        setState({
          phase: "error",
          title: data.status === "rate_limited" ? "Slow down a little" : data.status === "invalid_url" ? "Check your link" : "Couldn't complete the check",
          message: data.message ?? "Something went wrong. Please try again.",
        });
      } else {
        setState({ phase: "done", result: data });
      }
    } catch (err) {
      if (controller.signal.aborted) return;
      setState({
        phase: "error",
        title: "Network problem",
        message: err instanceof DOMException && err.name === "TimeoutError" ? "The request took too long. Please try again." : "We couldn't reach VidoMate. Check your connection and try again.",
      });
    }
  }

  async function paste() {
    try {
      const text = await navigator.clipboard.readText();
      if (!text.trim()) {
        setPasteNote("Your clipboard is empty.");
        return;
      }
      setValue(text.trim());
      setPasteNote(null);
      setState({ phase: "idle" });
      inputRef.current?.focus();
    } catch {
      setPasteNote("Clipboard access was blocked. Click the box and press Ctrl/⌘ + V instead.");
      inputRef.current?.focus();
    }
  }

  function clear() {
    abortRef.current?.abort();
    setValue("");
    setPasteNote(null);
    setState({ phase: "idle" });
    inputRef.current?.focus();
  }

  const loading = state.phase === "loading";

  return (
    <div className="w-full">
      <form onSubmit={analyze} noValidate className={`card flex flex-col gap-3 p-3 shadow-glow sm:flex-row sm:items-center ${large ? "sm:p-4" : ""}`}>
        <label htmlFor={inputId} className="sr-only">
          Media URL
        </label>
        <div className="relative flex-1">
          <input
            ref={inputRef}
            id={inputId}
            type="url"
            inputMode="url"
            autoComplete="off"
            autoCapitalize="off"
            spellCheck={false}
            value={value}
            onChange={(e) => {
              setValue(e.target.value);
              if (state.phase === "error") setState({ phase: "idle" });
            }}
            placeholder="Paste your video or media URL here..."
            aria-describedby={hintId}
            className={`w-full rounded-xl border border-fg/10 bg-bg px-4 pr-20 text-fg placeholder:text-muted/70 focus:border-primary/60 focus:outline-none focus:ring-2 focus:ring-primary/30 ${large ? "h-14 text-base" : "h-12 text-sm"}`}
          />
          {value && (
            <button type="button" onClick={clear} aria-label="Clear link" className="absolute right-12 top-1/2 -translate-y-1/2 rounded-md p-1.5 text-muted hover:text-fg">
              ✕
            </button>
          )}
          <button
            type="button"
            onClick={paste}
            className="absolute right-2 top-1/2 -translate-y-1/2 rounded-lg bg-fg/[0.08] px-2.5 py-1.5 text-xs font-semibold text-fg transition hover:bg-fg/[0.15]"
          >
            Paste
          </button>
        </div>
        <button type="submit" disabled={loading} className={`btn-primary ${large ? "h-14 px-8" : "h-12"}`}>
          {loading ? "Analyzing…" : "Analyze Link"}
        </button>
      </form>

      <div id={hintId} className="mt-3 min-h-6 text-center text-sm text-muted" aria-live="polite">
        {detected ? (
          <span className="inline-flex items-center gap-2 text-fg">
            <PlatformIcon id={detected} size={20} />
            Detected: <strong>{PLATFORMS[detected].name}</strong>
          </span>
        ) : pasteNote ? (
          pasteNote
        ) : (
          "Supports public links from YouTube, Instagram, Facebook, TikTok, Pinterest, Reddit, Threads and Dailymotion."
        )}
      </div>

      {mismatch && (
        <p className="mt-2 text-center text-sm text-muted">
          This looks like a {PLATFORMS[mismatch].name} link.{" "}
          <Link href={`/${mismatch}`} className="text-accent underline-offset-4 hover:underline">
            Visit the {PLATFORMS[mismatch].name} page
          </Link>{" "}
          — or just press Analyze Link.
        </p>
      )}

      <div className="mt-6" aria-live="polite">
        {state.phase === "loading" && <AnalysisLoader platform={state.platform} />}
        {state.phase === "error" && <ErrorState title={state.title} message={state.message} onRetry={value ? () => void analyze() : undefined} />}
        {state.phase === "done" && <ResultCard result={state.result} />}
      </div>
    </div>
  );
}
