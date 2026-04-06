"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useCart } from "@/context/cart-context";

export function AddToCart({ productId, maxQty }: { productId: string; maxQty: number }) {
  const { addToCart } = useCart();
  const [qty, setQty] = useState(1);
  const [adding, setAdding] = useState(false);

  async function add() {
    if (maxQty <= 0) return;
    setAdding(true);
    try {
      await addToCart(productId, qty);
    } finally {
      setAdding(false);
    }
  }

  return (
    <div className="flex flex-wrap items-end gap-3">
      <div>
        <label className="text-xs text-slate-500">Qty</label>
        <Input
          type="number"
          min={1}
          max={maxQty}
          value={qty}
          onChange={(e) => setQty(Math.max(1, Math.min(maxQty, Number(e.target.value) || 1)))}
          className="mt-1 w-24"
        />
      </div>
      <Button onClick={add} disabled={adding || maxQty <= 0} size="lg">
        {maxQty <= 0 ? "Out of stock" : adding ? "Adding…" : "Add to cart"}
      </Button>
    </div>
  );
}
