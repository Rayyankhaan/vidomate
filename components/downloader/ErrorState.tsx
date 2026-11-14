export function ErrorState({ title = "Something went wrong", message, onRetry }: { title?: string; message: string; onRetry?: () => void }) {
  return (
    <div role="alert" className="animate-rise rounded-2xl border border-red-400/30 bg-red-500/10 p-5">
      <p className="font-semibold text-red-300 [html[data-theme=light]_&]:text-red-700">{title}</p>
      <p className="mt-1 text-sm leading-relaxed text-fg/80">{message}</p>
      {onRetry && (
        <button type="button" onClick={onRetry} className="btn-ghost mt-4 !px-4 !py-2">
          Try again
        </button>
      )}
    </div>
  );
}
