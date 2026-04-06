"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { usePathname } from "next/navigation";
import { toast } from "sonner";
import { apiJson } from "@/lib/api";

type CartContextValue = {
  itemCount: number;
  refreshCart: () => Promise<void>;
  addToCart: (productId: string, quantity: number) => Promise<void>;
  cartLoading: boolean;
  cartOverlayLabel: string;
  withCartMutation: <T>(fn: () => Promise<T>, label?: string) => Promise<T>;
};

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [itemCount, setItemCount] = useState(0);
  const [mutationDepth, setMutationDepth] = useState(0);
  const [overlayLabel, setOverlayLabel] = useState("Updating cart…");

  const loadCart = useCallback(async () => {
    try {
      const data = await apiJson<{ items: { quantity: number }[] }>("/cart");
      const n = data.items.reduce((s, i) => s + i.quantity, 0);
      setItemCount(n);
    } catch {
      setItemCount(0);
    }
  }, []);

  useEffect(() => {
    void loadCart();
  }, [pathname, loadCart]);

  const withCartMutation = useCallback(async <T,>(fn: () => Promise<T>, label?: string): Promise<T> => {
    setOverlayLabel(label ?? "Updating cart…");
    setMutationDepth((d) => d + 1);
    try {
      return await fn();
    } finally {
      setMutationDepth((d) => d - 1);
    }
  }, []);

  const refreshCart = useCallback(async () => {
    await loadCart();
  }, [loadCart]);

  const addToCart = useCallback(
    async (productId: string, quantity: number) => {
      await withCartMutation(async () => {
        try {
          await toast.promise(
            apiJson("/cart/items", {
              method: "POST",
              body: JSON.stringify({ productId, quantity }),
            }),
            {
              loading: "Adding to cart…",
              success: "Added to cart",
              error: (err) => (err instanceof Error ? err.message : "Could not add to cart"),
            }
          );
          await loadCart();
        } catch {
          /* toast surfaced error */
        }
      }, "Adding to cart…");
    },
    [loadCart, withCartMutation]
  );

  const cartLoading = mutationDepth > 0;

  const value = useMemo(
    () => ({ itemCount, refreshCart, addToCart, cartLoading, cartOverlayLabel: overlayLabel, withCartMutation }),
    [itemCount, refreshCart, addToCart, cartLoading, overlayLabel, withCartMutation]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
