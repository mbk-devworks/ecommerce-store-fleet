import type { ReactNode } from "react";

export function MarketingLayout({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children: ReactNode;
}) {
  return (
    <>
      <section className="relative overflow-hidden border-b border-slate-800 bg-gradient-to-br from-slate-950 via-slate-900 to-[var(--fleet-hero)] px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
        <div
          className="pointer-events-none absolute -left-10 top-1/2 h-72 w-72 -translate-y-1/2 rounded-full bg-cyan-500/15 blur-3xl"
          aria-hidden
        />
        <div className="relative mx-auto max-w-3xl text-center">
          <p className="text-[11px] font-semibold uppercase tracking-[0.25em] text-cyan-400/90">FleetTrack Pro</p>
          <h1 className="mt-3 font-display text-4xl font-semibold tracking-tight text-white sm:text-5xl">{title}</h1>
          {subtitle ? <p className="mx-auto mt-5 max-w-xl text-lg leading-relaxed text-slate-400">{subtitle}</p> : null}
        </div>
      </section>
      <div className="mx-auto max-w-3xl px-4 py-14 sm:px-6 sm:py-20 lg:px-8">
        <div className="prose prose-slate prose-lg max-w-none prose-headings:font-display prose-headings:font-semibold prose-h2:mt-10 prose-h2:mb-3 prose-p:leading-relaxed prose-strong:text-slate-800 prose-li:marker:text-slate-400">
          {children}
        </div>
      </div>
    </>
  );
}
