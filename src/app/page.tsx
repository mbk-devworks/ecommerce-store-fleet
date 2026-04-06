import Link from "next/link";
import { serverApi } from "@/lib/api-server";
import type { Category, Product } from "@/types/commerce";
import { ProductCard } from "@/components/product-card";
import { ScrollReveal } from "@/components/scroll-reveal";
import { Button } from "@/components/ui/button";
import { ArrowRight, MapPin, Radio, Shield } from "lucide-react";
import { FleetHeroVisual } from "@/components/fleet-hero-visual";

export default async function HomePage() {
  const [categories, featured] = await Promise.all([
    serverApi<Category[]>("/storefront/categories"),
    serverApi<Product[]>("/storefront/products/featured"),
  ]);

  return (
    <div className="bg-slate-950 text-slate-50">
      <ScrollReveal>
      <section className="relative overflow-hidden bg-gradient-to-b from-slate-900 via-slate-950 to-slate-950">
        <div
          className="pointer-events-none absolute left-1/2 top-0 h-[500px] w-[800px] -translate-x-1/2 bg-[radial-gradient(ellipse_at_center,rgba(34,211,238,0.12),transparent_65%)]"
          aria-hidden
        />
        <div className="relative mx-auto grid max-w-7xl gap-12 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:items-center lg:gap-16 lg:py-28 lg:px-8">
          <div>
            <p className="inline-flex items-center gap-2 rounded-full border border-cyan-500/25 bg-cyan-500/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-cyan-300">
              <Radio className="h-3.5 w-3.5" aria-hidden />
              Fleet intelligence
            </p>
            <h1 className="mt-6 font-display text-4xl font-semibold leading-[1.1] tracking-tight sm:text-5xl lg:text-6xl">
              Know where every asset is — in real time.
            </h1>
            <p className="mt-6 max-w-lg text-lg leading-relaxed text-slate-400">
              Hardened GPS trackers, dual-channel dash cameras, and field-proven accessories. Built for installers who
              cannot afford blind spots.
            </p>
            <div className="mt-10 flex flex-wrap gap-3">
              <Button asChild size="lg" className="h-12 bg-cyan-500 px-8 text-base font-semibold text-slate-950 shadow-lg shadow-cyan-500/25 hover:bg-cyan-400">
                <Link href="/shop">Shop hardware</Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="h-12 border-slate-500 bg-slate-900/40 px-8 text-base text-slate-100 hover:bg-slate-800/80">
                <Link href="/contact">Talk to sales</Link>
              </Button>
            </div>
          </div>
          <div className="relative">
            <div className="relative aspect-[4/5] overflow-hidden rounded-[2rem] border border-slate-800/80 shadow-[0_32px_64px_-20px_rgba(34,211,238,0.15)] ring-1 ring-cyan-500/10">
              <FleetHeroVisual />
            </div>
            <div className="absolute -bottom-5 -right-2 hidden max-w-[220px] rounded-2xl border border-slate-700 bg-slate-900/95 p-4 shadow-xl backdrop-blur sm:block">
              <p className="text-xs font-semibold text-white">Enterprise rollout</p>
              <p className="mt-1 text-[11px] leading-snug text-slate-400">Bulk pricing &amp; onboarding for 50+ vehicles.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-slate-800/80 bg-slate-900/60 py-12">
        <div className="mx-auto flex max-w-7xl flex-wrap justify-center gap-12 px-4 sm:gap-20 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="font-display text-4xl font-semibold tabular-nums text-white">{categories.length}</p>
            <p className="mt-2 text-[11px] font-semibold uppercase tracking-widest text-slate-500">Categories</p>
          </div>
          <div className="text-center">
            <p className="font-display text-4xl font-semibold tabular-nums text-cyan-400">{featured.length}</p>
            <p className="mt-2 text-[11px] font-semibold uppercase tracking-widest text-slate-500">Featured SKUs</p>
          </div>
          <div className="text-center">
            <p className="font-display text-4xl font-semibold tabular-nums text-white">24/7</p>
            <p className="mt-2 text-[11px] font-semibold uppercase tracking-widest text-slate-500">Live tracking</p>
          </div>
        </div>
      </section>
      </ScrollReveal>

      <ScrollReveal>
      <section className="border-b border-slate-200 bg-slate-100 py-20 text-slate-900">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <p className="text-center text-[11px] font-semibold uppercase tracking-[0.2em] text-cyan-700">Why operators choose us</p>
          <h2 className="mt-3 text-center font-display text-3xl font-semibold sm:text-4xl">Built for the field</h2>
          <div className="mt-14 grid gap-8 md:grid-cols-3">
            <div className="rounded-2xl border border-slate-200/80 bg-white p-8 shadow-sm">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-cyan-500/15 text-cyan-700">
                <MapPin className="h-6 w-6" aria-hidden />
              </div>
              <h3 className="mt-6 font-display text-xl font-semibold">Sub-meter accuracy</h3>
              <p className="mt-3 text-sm leading-relaxed text-slate-600">
                Reliable fixes in urban canyons and rural routes — hardware tuned for moving vehicles, not lab demos.
              </p>
            </div>
            <div className="rounded-2xl border border-slate-200/80 bg-white p-8 shadow-sm">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-cyan-500/15 text-cyan-700">
                <Shield className="h-6 w-6" aria-hidden />
              </div>
              <h3 className="mt-6 font-display text-xl font-semibold">Hardened &amp; tamper-aware</h3>
              <p className="mt-3 text-sm leading-relaxed text-slate-600">
                Enclosures and cabling designed for fleet depots, contractors, and high-vibration installs.
              </p>
            </div>
            <div className="rounded-2xl border border-slate-200/80 bg-white p-8 shadow-sm">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-cyan-500/15 text-cyan-700">
                <Radio className="h-6 w-6" aria-hidden />
              </div>
              <h3 className="mt-6 font-display text-xl font-semibold">Always-on connectivity</h3>
              <p className="mt-3 text-sm leading-relaxed text-slate-600">
                4G-first modules with sensible failover stories — fewer dead assets on your map.
              </p>
            </div>
          </div>
        </div>
      </section>
      </ScrollReveal>

      <ScrollReveal>
      <section className="border-y border-slate-800 bg-slate-900/50 py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-cyan-400/90">Catalog</p>
              <h2 className="mt-2 font-display text-3xl font-semibold sm:text-4xl">Shop by category</h2>
            </div>
            <Link href="/shop" className="inline-flex items-center gap-2 text-sm font-semibold text-cyan-300 transition hover:gap-3">
              View all
              <ArrowRight className="h-4 w-4" aria-hidden />
            </Link>
          </div>
          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {categories.map((c) => (
              <Link
                key={c.id}
                href={`/shop/${c.slug}`}
                className="group rounded-2xl border border-slate-800 bg-gradient-to-br from-slate-950 to-slate-900 p-8 transition hover:border-cyan-500/40 hover:shadow-lg hover:shadow-cyan-500/5"
              >
                <p className="font-display text-lg font-semibold text-white">{c.name}</p>
                <p className="mt-2 text-sm text-slate-400">View products</p>
                <span className="mt-6 inline-flex items-center gap-1 text-xs font-semibold uppercase tracking-wider text-cyan-400 opacity-0 transition group-hover:opacity-100">
                  Open
                  <ArrowRight className="h-3 w-3" aria-hidden />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-cyan-400/90">Staff picks</p>
              <h2 className="mt-2 font-display text-3xl font-semibold sm:text-4xl">Featured hardware</h2>
              <p className="mt-2 max-w-lg text-sm text-slate-400">SKUs our team deploys on real fleets first.</p>
            </div>
            <Link href="/shop?sort=featured" className="text-sm font-semibold text-cyan-300 underline-offset-4 hover:underline">
              Browse featured
            </Link>
          </div>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {featured.map((p) => (
              <ProductCard key={p.id} product={p} tone="dark" />
            ))}
          </div>
        </div>
      </section>
      </ScrollReveal>

      <ScrollReveal>
      <section className="border-t border-slate-800 bg-gradient-to-t from-slate-950 to-slate-900 py-20">
        <div className="mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
          <h2 className="font-display text-3xl font-semibold">Deploy at scale</h2>
          <p className="mt-4 text-slate-400">
            Need staging, SIM kits, or white-glove onboarding? Our sales team works with ops and IT together.
          </p>
          <div className="mt-10 flex flex-wrap justify-center gap-3">
            <Button asChild size="lg" className="bg-cyan-500 font-semibold text-slate-950 hover:bg-cyan-400">
              <Link href="/contact">Book a consult</Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="border-slate-500 bg-slate-950/40 text-slate-100 hover:bg-slate-900">
              <Link href="/shop">Browse store</Link>
            </Button>
          </div>
        </div>
      </section>
      </ScrollReveal>
    </div>
  );
}
