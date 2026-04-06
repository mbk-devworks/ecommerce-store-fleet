import Link from "next/link";
import type { ReactNode } from "react";
import type { Category } from "@/types/commerce";
import { cn } from "@/lib/utils";

export type ShopBreadcrumb = { href: string; label: string; current?: boolean };

export function ShopShell({
  categories,
  activeSlug,
  title,
  eyebrow = "Catalog",
  productCount,
  breadcrumbs,
  headerRight,
  sidebarFooter,
  children,
}: {
  categories: Category[];
  activeSlug?: string | null;
  title: string;
  eyebrow?: string;
  productCount?: number;
  breadcrumbs?: ShopBreadcrumb[];
  headerRight?: ReactNode;
  sidebarFooter?: ReactNode;
  children: ReactNode;
}) {
  return (
    <div className="border-b border-slate-800/60 bg-gradient-to-b from-slate-200/30 via-slate-50 to-white">
      <div className="mx-auto max-w-7xl px-4 pb-20 pt-6 sm:px-6 lg:px-8">
        {breadcrumbs && breadcrumbs.length > 0 && (
          <nav className="flex flex-wrap items-center gap-2 text-xs text-slate-500" aria-label="Breadcrumb">
            {breadcrumbs.map((b, i) => (
              <span key={`${b.href}-${i}`} className="flex items-center gap-2">
                {i > 0 && <span className="text-slate-400" aria-hidden>/</span>}
                {b.current ? (
                  <span className="font-medium text-slate-800">{b.label}</span>
                ) : (
                  <Link href={b.href} className="transition hover:text-slate-900">
                    {b.label}
                  </Link>
                )}
              </span>
            ))}
          </nav>
        )}

        <div className={cn("flex flex-col gap-10 lg:flex-row lg:gap-12", breadcrumbs?.length ? "mt-6" : "mt-2")}>
          <aside className="lg:w-72 lg:shrink-0">
            <div className="lg:sticky lg:top-24">
              <div className="rounded-2xl border border-slate-800 bg-gradient-to-b from-slate-950 to-slate-900 p-6 shadow-[0_0_0_1px_rgba(34,211,238,0.08),0_24px_48px_-20px_rgba(0,0,0,0.5)]">
                <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-cyan-500/80">{eyebrow}</p>
                <ul className="mt-5 space-y-1">
                  <li>
                    <Link
                      href="/shop"
                      className={cn(
                        "block rounded-xl px-3 py-2.5 text-sm transition",
                        !activeSlug
                          ? "bg-cyan-500 font-medium text-slate-950"
                          : "text-slate-300 hover:bg-white/5 hover:text-white"
                      )}
                    >
                      All products
                    </Link>
                  </li>
                  {categories.map((c) => {
                    const active = c.slug === activeSlug;
                    return (
                      <li key={c.id}>
                        <Link
                          href={`/shop/${c.slug}`}
                          className={cn(
                            "block rounded-xl px-3 py-2.5 text-sm transition",
                            active
                              ? "bg-cyan-500 font-medium text-slate-950"
                              : "text-slate-300 hover:bg-white/5 hover:text-white"
                          )}
                        >
                          {c.name}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </div>
              {sidebarFooter ? (
                <div className="mt-6 rounded-2xl border border-slate-800 bg-gradient-to-b from-slate-950 to-slate-900 p-6 shadow-[0_0_0_1px_rgba(34,211,238,0.08),0_24px_48px_-20px_rgba(0,0,0,0.5)]">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-cyan-500/80">Filters</p>
                  <div className="mt-4">{sidebarFooter}</div>
                </div>
              ) : null}
            </div>
          </aside>

          <div className="min-w-0 flex-1">
            <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xl shadow-slate-200/50 sm:p-8">
              <div className="flex flex-col gap-4 border-b border-slate-100 pb-6 sm:flex-row sm:items-center sm:justify-between sm:gap-6">
                <div className="min-w-0 shrink-0">
                  <h1 className="font-display text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">{title}</h1>
                  {productCount != null && (
                    <p className="mt-2 text-sm text-slate-500">
                      <span className="font-semibold text-slate-800">{productCount}</span>{" "}
                      {productCount === 1 ? "SKU" : "SKUs"} in view
                    </p>
                  )}
                </div>
                {headerRight ? (
                  <div className="flex w-full min-w-0 flex-col gap-3 sm:w-auto sm:max-w-[min(100%,32rem)] sm:flex-row sm:flex-wrap sm:items-center sm:justify-end">
                    {headerRight}
                  </div>
                ) : null}
              </div>
              <div className="mt-10">{children}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
