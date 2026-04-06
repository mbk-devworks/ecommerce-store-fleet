import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { serverApi } from "@/lib/api-server";
import type { Product } from "@/types/commerce";
import { ProductCard } from "@/components/product-card";
import { AddToCart } from "@/components/add-to-cart";
import { Badge } from "@/components/ui/badge";
import { Cpu, Radio, Zap } from "lucide-react";
import { ProductImageGallery } from "@/components/product-image-gallery";

type Detail = Product & {
  shipping?: { weightLb: number; lengthIn: number; widthIn: number; heightIn: number } | null;
  related?: Product[];
  stock?: { total: number; status: string };
};

function money(c: number) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(c / 100);
}

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  try {
    const p = await serverApi<Detail>(`/storefront/products/by-slug/${slug}`);
    return {
      title: p.seoTitle ?? p.name,
      description: p.seoDescription ?? p.shortDescription ?? p.description.slice(0, 160),
      openGraph: { images: p.images[0]?.url ? [p.images[0].url] : [] },
    };
  } catch {
    return { title: "Product" };
  }
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params;
  let p: Detail;
  try {
    p = await serverApi<Detail>(`/storefront/products/by-slug/${slug}`);
  } catch {
    notFound();
  }

  const maxQty = p.stock?.total ?? 0;
  const onSale = p.compareAtPriceCents && p.compareAtPriceCents > p.priceCents;
  const cat = p.category;

  return (
    <div className="border-b border-slate-800/60 bg-gradient-to-b from-slate-100/80 to-white">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
        <nav className="flex flex-wrap items-center gap-2 text-xs text-slate-500" aria-label="Breadcrumb">
          <Link href="/" className="transition hover:text-slate-900">
            Home
          </Link>
          <span className="text-slate-300">/</span>
          <Link href="/shop" className="transition hover:text-slate-900">
            Shop
          </Link>
          {cat ? (
            <>
              <span className="text-slate-300">/</span>
              <Link href={`/shop/${cat.slug}`} className="transition hover:text-cyan-700">
                {cat.name}
              </Link>
            </>
          ) : null}
          <span className="text-slate-300">/</span>
          <span className="font-medium text-slate-800">{p.name}</span>
        </nav>

        <div className="mt-8 grid gap-12 lg:grid-cols-2 lg:gap-16">
          <div>
            <ProductImageGallery images={p.images} productName={p.name} />
          </div>

          <div className="rounded-2xl border border-slate-200/90 bg-white p-6 shadow-xl shadow-slate-200/40 sm:p-8">
            {cat ? (
              <Link
                href={`/shop/${cat.slug}`}
                className="text-[11px] font-semibold uppercase tracking-[0.2em] text-cyan-600 transition hover:text-cyan-500"
              >
                {cat.name}
              </Link>
            ) : (
              <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-cyan-600">Hardware</p>
            )}
            <h1 className="mt-3 font-display text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">{p.name}</h1>
            <div className="mt-6 flex flex-wrap items-baseline gap-3">
              <span className="text-3xl font-bold tracking-tight text-slate-900">{money(p.priceCents)}</span>
              {onSale && <span className="text-lg text-slate-400 line-through">{money(p.compareAtPriceCents!)}</span>}
              {p.isFeatured && (
                <Badge className="rounded-full border-0 bg-cyan-500 px-3 py-0.5 text-[10px] font-bold uppercase tracking-wider text-slate-950">
                  Featured
                </Badge>
              )}
            </div>
            {p.shortDescription ? <p className="mt-6 text-base leading-relaxed text-slate-600">{p.shortDescription}</p> : null}

            <ul className="mt-8 flex flex-wrap gap-3 text-sm text-slate-600">
              <li className="flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-4 py-2">
                <Radio className="h-4 w-4 text-cyan-600" aria-hidden />
                4G / LTE ready
              </li>
              <li className="flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-4 py-2">
                <Cpu className="h-4 w-4 text-cyan-600" aria-hidden />
                Field-tested firmware
              </li>
              <li className="flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-4 py-2">
                <Zap className="h-4 w-4 text-cyan-600" aria-hidden />
                Low idle draw
              </li>
            </ul>

            <div className="mt-10 rounded-xl border border-slate-100 bg-slate-50/80 p-5">
              <p className="text-sm font-semibold text-slate-900">Availability</p>
              <p className="mt-1 text-sm text-slate-600">
                {p.stock?.status === "OUT_OF_STOCK"
                  ? "Out of stock"
                  : p.stock?.status === "LOW_STOCK"
                    ? "Low stock — order soon"
                    : "In stock — ships from warehouse"}
              </p>
              <div className="mt-5">
                <AddToCart productId={p.id} maxQty={maxQty} />
              </div>
            </div>

            {p.shipping ? (
              <div className="mt-6 rounded-xl border border-cyan-500/15 bg-cyan-50/40 p-5 text-sm text-slate-600">
                <p className="font-semibold text-slate-900">Shipping preview</p>
                <p className="mt-2">
                  Weight {p.shipping.weightLb} lb · {p.shipping.lengthIn}×{p.shipping.widthIn}×{p.shipping.heightIn} in
                </p>
                <p className="mt-2 text-xs text-slate-500">Rates calculated at checkout from your destination.</p>
              </div>
            ) : null}

            <div className="mt-10 border-t border-slate-100 pt-8">
              <h2 className="font-display text-xl font-semibold text-slate-900">Specifications</h2>
              <div className="mt-4 leading-relaxed text-slate-600">
                <p>{p.description}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {p.related && p.related.length > 0 ? (
        <section className="border-t border-slate-800 bg-gradient-to-b from-slate-950 to-[var(--fleet-hero)] py-16 text-white">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-cyan-400/90">Compatible gear</p>
                <h2 className="mt-2 font-display text-3xl font-semibold">Related hardware</h2>
              </div>
              <Link href="/shop" className="text-sm font-semibold text-cyan-300 underline-offset-4 hover:underline">
                Full catalog
              </Link>
            </div>
            <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {p.related.map((r) => (
                <ProductCard key={r.id} product={r} tone="dark" />
              ))}
            </div>
          </div>
        </section>
      ) : null}

      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50/80 px-6 py-12 text-center">
          <p className="font-display text-lg font-semibold text-slate-800">Fleet deployment notes</p>
          <p className="mt-2 text-sm text-slate-500">Ask sales for bulk SIM provisioning and installer documentation.</p>
        </div>
      </div>
    </div>
  );
}
