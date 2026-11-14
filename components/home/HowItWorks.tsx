import { HOW_IT_WORKS } from "@/lib/content/home";

export function HowItWorks() {
  return (
    <section aria-labelledby="how-heading" className="container-x pt-20">
      <h2 id="how-heading" className="text-3xl font-bold tracking-tight">
        How it works
      </h2>
      <ol className="mt-8 grid gap-4 md:grid-cols-3">
        {HOW_IT_WORKS.map((s, i) => (
          <li key={s.title} className="card relative p-6">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-gradient text-base font-bold text-[#0b0f1f]" aria-hidden="true">
              {i + 1}
            </span>
            <h3 className="mt-4 text-lg font-semibold">{s.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted">{s.body}</p>
          </li>
        ))}
      </ol>
    </section>
  );
}
