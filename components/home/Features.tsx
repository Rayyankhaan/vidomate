import { FEATURES } from "@/lib/content/home";

export function Features() {
  return (
    <section aria-labelledby="features-heading" className="container-x pt-20">
      <h2 id="features-heading" className="text-3xl font-bold tracking-tight">
        Built to be fast, clear and honest
      </h2>
      <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {FEATURES.map((f) => (
          <li key={f.title} className="card p-6">
            <span className="block h-1 w-8 rounded-full bg-brand-gradient" aria-hidden="true" />
            <h3 className="mt-4 text-base font-semibold">{f.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted">{f.body}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}
