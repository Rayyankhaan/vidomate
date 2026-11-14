import { Breadcrumbs } from "./Breadcrumbs";

/** Simple long-form page wrapper for About / Privacy / Terms / Contact. */
export function PageShell({ title, intro, crumbs, children }: { title: string; intro?: string; crumbs: { name: string; href: string }[]; children: React.ReactNode }) {
  return (
    <div className="container-x py-14 sm:py-20">
      <div className="mx-auto max-w-3xl">
        <Breadcrumbs items={crumbs} />
        <h1 className="text-center text-4xl font-bold tracking-tight sm:text-5xl">
          <span className="gradient-text">{title}</span>
        </h1>
        {intro && <p className="mx-auto mt-4 max-w-2xl text-center text-muted">{intro}</p>}
        <div className="prose-vm mt-10">{children}</div>
      </div>
    </div>
  );
}
