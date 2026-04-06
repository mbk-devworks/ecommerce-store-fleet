import Link from "next/link";
import { serverApi } from "@/lib/api-server";
import type { Category, Product } from "@/types/commerce";
import { ProductCard } from "@/components/product-card";
import { ShopSort } from "@/components/shop-sort";
import { ShopFilters } from "@/components/shop-filters";
import { ShopShell } from "@/components/shop-shell";
import { Suspense } from "react";

type Props = {
  searchParams: Promise<{ q?: string; sort?: string; minPrice?: string; maxPrice?: string; finish?: string; inStock?: string }>;
};

export default async function ShopPage({ searchParams }: Props) {
  const sp = await searchParams;
  const qs = new URLSearchParams();
  if (sp.q) qs.set("q", sp.q);
  if (sp.sort) qs.set("sort", sp.sort);
  if (sp.minPrice) qs.set("minPrice", sp.minPrice);
  if (sp.maxPrice) qs.set("maxPrice", sp.maxPrice);
  if (sp.finish) qs.set("finish", sp.finish);
  if (sp.inStock) qs.set("inStock", sp.inStock);
  const path = `/storefront/products${qs.toString() ? `?${qs}` : ""}`;
  const [products, categories] = await Promise.all([
    serverApi<Product[]>(path),
    serverApi<Category[]>("/storefront/categories"),
  ]);

  return (
    <ShopShell
      categories={categories}
      title="Shop hardware"
      eyebrow="Categories"
      productCount={products.length}
      breadcrumbs={[
        { href: "/", label: "Home" },
        { href: "/shop", label: "Shop", current: true },
      ]}
      sidebarFooter={
        <Suspense fallback={<div className="h-44 animate-pulse rounded-xl bg-slate-800/60" aria-hidden />}>
          <ShopFilters variant="fleet" />
        </Suspense>
      }
      headerRight={
        <Suspense fallback={<div className="h-11 w-full max-w-[12rem] animate-pulse rounded-full bg-slate-200 sm:ml-auto" aria-hidden />}>
          <ShopSort variant="fleet" />
        </Suspense>
      }
    >
      {products.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50/80 py-20 text-center">
          <p className="font-display text-xl font-semibold text-slate-800">No hardware matches this view.</p>
          <p className="mt-2 text-sm text-slate-500">Clear price or stock filters, or open another category.</p>
          <div className="mt-6 flex flex-wrap justify-center gap-4">
            <Link href="/shop" className="text-sm font-semibold text-cyan-700 underline-offset-4 hover:underline">
              Reset catalog view
            </Link>
            <Link href="/account/login" className="text-sm text-slate-600 underline-offset-4 hover:underline">
              Sign in for order history
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}
    </ShopShell>
  );
}
