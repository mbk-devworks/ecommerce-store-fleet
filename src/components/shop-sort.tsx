"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

export function ShopSort({ variant = "fleet" }: { variant?: "lighting" | "fleet" }) {
  const router = useRouter();
  const sp = useSearchParams();
  const sort = sp.get("sort") ?? "newest";
  const chevron =
    variant === "fleet" ? "text-slate-500" : "text-neutral-500";

  return (
    <div className="w-full sm:w-auto sm:shrink-0">
      <label className="sr-only" htmlFor="shop-sort">
        Sort products
      </label>
      <div className="relative">
        <select
          id="shop-sort"
          value={sort}
          className={cn(
            "h-11 w-full min-w-0 cursor-pointer appearance-none rounded-full border py-2.5 pl-4 pr-10 text-sm font-medium shadow-sm transition focus:outline-none focus:ring-2 sm:min-w-[12rem]",
            variant === "fleet"
              ? "border-slate-200 bg-white text-slate-800 focus:ring-cyan-500/30 hover:border-cyan-400/40"
              : "border-neutral-200/90 bg-white text-neutral-800 focus:ring-neutral-900/10 hover:border-neutral-300"
          )}
          onChange={(e) => {
            const u = new URL(window.location.href);
            u.searchParams.set("sort", e.target.value);
            router.push(u.pathname + u.search);
          }}
        >
          <option value="newest">Newest</option>
          <option value="featured">Featured</option>
          <option value="price_asc">Price: Low to High</option>
          <option value="price_desc">Price: High to Low</option>
        </select>
        <span
          className="pointer-events-none absolute inset-y-0 right-0 flex w-10 items-center justify-center"
          aria-hidden
        >
          <ChevronDown className={cn("h-4 w-4 shrink-0", chevron)} strokeWidth={2.25} />
        </span>
      </div>
    </div>
  );
}
