import Link from "next/link";
import { notFound } from "next/navigation";
import { serverApi } from "@/lib/api-server";
import type { Category, Product } from "@/types/commerce";
import { ProductCard } from "@/components/product-card";
import { ShopSort } from "@/components/shop-sort";
import { ShopFilters } from "@/components/shop-filters";
import { ShopShell } from "@/components/shop-shell";
import { Suspense } from "react";

type Props = {
  params: Promise<{ categorySlug: string }>;
  searchParams: Promise<{ sort?: string; q?: string; minPrice?: string; maxPrice?: string; finish?: string; inStock?: string }>;
};

export default async function CategoryShopPage({ params, searchParams }: Props) {
  const { categorySlug } = await params;
  const sp = await searchParams;
  const qs = new URLSearchParams({ categorySlug });
  if (sp.sort) qs.set("sort", sp.sort);
  if (sp.q) qs.set("q", sp.q);
  if (sp.minPrice) qs.set("minPrice", sp.minPrice);
  if (sp.maxPrice) qs.set("maxPrice", sp.maxPrice);
  if (sp.finish) qs.set("finish", sp.finish);
  if (sp.inStock) qs.set("inStock", sp.inStock);
  const [products, categories] = await Promise.all([
    serverApi<Product[]>(`/storefront/products?${qs}`),
    serverApi<Category[]>("/storefront/categories"),
  ]);
  const cat = categories.find((c) => c.slug === categorySlug);
  if (!cat) notFound();

  return (
    <ShopShell
      categories={categories}
      activeSlug={categorySlug}
      title={cat.name}
      eyebrow="Categories"
      productCount={products.length}
      breadcrumbs={[
        { href: "/", label: "Home" },
        { href: "/shop", label: "Shop" },
        { href: `/shop/${cat.slug}`, label: cat.name, current: true },
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
      {cat.description ? <p className="mb-10 max-w-2xl text-sm leading-relaxed text-slate-600">{cat.description}</p> : null}
      {products.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50/80 py-20 text-center">
          <p className="font-display text-xl font-semibold text-slate-800">No SKUs in this category yet.</p>
          <Link href="/shop" className="mt-6 inline-block text-sm font-semibold text-cyan-700 underline-offset-4 hover:underline">
            View full catalog
          </Link>
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
