"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import type { Product } from "@/types/commerce";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { SafeProductImage } from "@/components/safe-product-image";

function formatMoney(cents: number) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(cents / 100);
}

export type ProductCardTone = "light" | "dark";

export function ProductCard({ product, tone = "light" }: { product: Product; tone?: ProductCardTone }) {
  const img = product.images[0];
  const onSale = product.compareAtPriceCents && product.compareAtPriceCents > product.priceCents;
  const isNew = Date.now() - new Date((product as { createdAt?: string }).createdAt ?? 0).getTime() < 1000 * 60 * 60 * 24 * 30;
  const isDark = tone === "dark";

  return (
    <motion.div whileHover={{ y: -3 }} transition={{ type: "spring", stiffness: 420, damping: 30 }}>
      <Link href={`/product/${product.slug}`} className="group block">
        <div
          className={cn(
            "overflow-hidden rounded-2xl border shadow-sm transition-all duration-300 group-hover:shadow-lg",
            isDark
              ? "border-slate-700/80 bg-slate-900 ring-1 ring-white/[0.06] group-hover:ring-cyan-400/20"
              : "border-neutral-200/90 bg-white ring-1 ring-black/[0.04] group-hover:ring-black/[0.07]"
          )}
        >
          <div className={cn("relative aspect-[4/5]", isDark ? "bg-slate-800/40" : "bg-stone-100")}>
            <SafeProductImage
              src={img?.url}
              alt={img?.alt ?? product.name}
              fill
              className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.04]"
              sizes="(max-width:768px) 50vw, 25vw"
            />
            <div className="pointer-events-none absolute left-3 top-3 z-10 flex max-w-[calc(100%-1.5rem)] flex-wrap gap-2">
              {product.isFeatured && <Badge variant="onImageFeatured">Featured</Badge>}
              {onSale && <Badge variant="onImageSale">Sale</Badge>}
              {isNew && <Badge variant="onImageNew">New</Badge>}
            </div>
          </div>
          <div className="space-y-1.5 p-4">
            <p className={cn("text-[11px] font-semibold uppercase tracking-[0.2em]", isDark ? "text-slate-500" : "text-neutral-500")}>
              {product.category?.name ?? "Product"}
            </p>
            <h3 className={cn("line-clamp-2 text-[15px] font-medium leading-snug", isDark ? "text-slate-100" : "text-neutral-900")}>
              {product.name}
            </h3>
            <div className="flex items-baseline gap-2 pt-0.5">
              <span className={cn("text-sm font-semibold tabular-nums", isDark ? "text-cyan-300" : "text-neutral-900")}>
                {formatMoney(product.priceCents)}
              </span>
              {onSale && (
                <span className={cn("text-xs line-through", isDark ? "text-slate-500" : "text-neutral-400")}>
                  {formatMoney(product.compareAtPriceCents!)}
                </span>
              )}
            </div>
            {product.stock && (
              <p
                className={cn(
                  "text-xs",
                  product.stock.status === "OUT_OF_STOCK"
                    ? "text-rose-500"
                    : product.stock.status === "LOW_STOCK"
                      ? isDark
                        ? "text-amber-400"
                        : "text-amber-700"
                      : isDark
                        ? "text-emerald-400"
                        : "text-emerald-700"
                )}
              >
                {product.stock.status === "OUT_OF_STOCK"
                  ? "Out of stock"
                  : product.stock.status === "LOW_STOCK"
                    ? "Low stock"
                    : "In stock"}
              </p>
            )}
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
