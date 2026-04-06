"use client";

import { useCallback, useEffect, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

export function ShopFilters({ variant = "fleet" }: { variant?: "lighting" | "fleet" }) {
  const router = useRouter();
  const pathname = usePathname();
  const sp = useSearchParams();
  const [minP, setMinP] = useState("");
  const [maxP, setMaxP] = useState("");
  const [finish, setFinish] = useState("");
  const [inStock, setInStock] = useState(false);
  const fleet = variant === "fleet";

  const sync = useCallback(() => {
    setMinP(sp.get("minPrice") ?? "");
    setMaxP(sp.get("maxPrice") ?? "");
    setFinish(sp.get("finish") ?? "");
    setInStock(sp.get("inStock") === "1");
  }, [sp]);

  useEffect(() => {
    sync();
  }, [sync]);

  function apply() {
    const next = new URLSearchParams(sp.toString());
    if (minP.trim()) next.set("minPrice", minP.trim());
    else next.delete("minPrice");
    if (maxP.trim()) next.set("maxPrice", maxP.trim());
    else next.delete("maxPrice");
    if (finish.trim()) next.set("finish", finish.trim());
    else next.delete("finish");
    if (inStock) next.set("inStock", "1");
    else next.delete("inStock");
    const qs = next.toString();
    router.push(qs ? `${pathname}?${qs}` : pathname);
  }

  const inputClass = fleet
    ? "h-10 rounded-xl border-slate-600 bg-slate-950/50 text-sm text-slate-100 placeholder:text-slate-500"
    : "h-10 rounded-xl border-neutral-200 text-sm";

  return (
    <div className="flex w-full flex-col gap-3">
      <div className="grid grid-cols-2 gap-2">
        <div>
          <label className="sr-only" htmlFor="filter-min-price">
            Min price USD
          </label>
          <Input
            id="filter-min-price"
            inputMode="decimal"
            placeholder="Min $"
            className={inputClass}
            value={minP}
            onChange={(e) => setMinP(e.target.value)}
          />
        </div>
        <div>
          <label className="sr-only" htmlFor="filter-max-price">
            Max price USD
          </label>
          <Input
            id="filter-max-price"
            inputMode="decimal"
            placeholder="Max $"
            className={inputClass}
            value={maxP}
            onChange={(e) => setMaxP(e.target.value)}
          />
        </div>
      </div>
      <div>
        <label className="sr-only" htmlFor="filter-finish">
          Finish / SKU text
        </label>
        <Input
          id="filter-finish"
          placeholder="Finish"
          className={inputClass}
          value={finish}
          onChange={(e) => setFinish(e.target.value)}
        />
      </div>
      <label
        className={cn(
          "flex h-10 cursor-pointer items-center gap-2 rounded-xl border px-3 text-sm shadow-sm",
          fleet
            ? "border-slate-600 bg-slate-950/40 text-slate-200"
            : "border-neutral-200 bg-white text-neutral-800"
        )}
      >
        <input
          type="checkbox"
          checked={inStock}
          onChange={(e) => setInStock(e.target.checked)}
          className={cn("rounded", fleet ? "border-slate-500" : "border-neutral-300")}
        />
        In stock only
      </label>
      <Button
        type="button"
        className={cn(
          "h-10 w-full rounded-xl",
          fleet && "bg-cyan-500 font-semibold text-slate-950 hover:bg-cyan-400"
        )}
        variant={fleet ? "default" : "secondary"}
        onClick={apply}
      >
        Apply filters
      </Button>
    </div>
  );
}
