/** Accessible, JS-free accordion built on <details>. */
export function FAQ({ faqs, heading = "Frequently asked questions", id = "faq" }: { faqs: { q: string; a: string }[]; heading?: string; id?: string }) {
  return (
    <section aria-labelledby={`${id}-heading`} className="container-x pt-20">
      <h2 id={`${id}-heading`} className="text-3xl font-bold tracking-tight">
        {heading}
      </h2>
      <div className="mt-8 max-w-3xl space-y-3">
        {faqs.map((f) => (
          <details key={f.q} className="card group p-5 open:border-primary/40">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-semibold [&::-webkit-details-marker]:hidden">
              {f.q}
              <span aria-hidden="true" className="text-primary transition group-open:rotate-45">
                +
              </span>
            </summary>
            <p className="mt-3 text-sm leading-relaxed text-muted">{f.a}</p>
          </details>
        ))}
      </div>
    </section>
  );
}
