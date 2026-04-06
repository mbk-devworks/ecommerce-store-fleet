"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { toast } from "sonner";
import { apiJson } from "@/lib/api";
import { useCart } from "@/context/cart-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Package, ArrowRight, Lock } from "lucide-react";

type CartItem = {
  id: string;
  quantity: number;
  product: {
    id: string;
    name: string;
    slug: string;
    priceCents: number;
    images: { url: string; alt?: string | null }[];
  };
};

function formatPrice(cents: number) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(cents / 100);
}

export default function CartPage() {
  const { refreshCart, withCartMutation } = useCart();
  const [items, setItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);

  const reloadItems = useCallback(async () => {
    const data = await apiJson<{ items: CartItem[] }>("/cart");
    setItems(data.items);
    await refreshCart();
  }, [refreshCart]);

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      const data = await apiJson<{ items: CartItem[] }>("/cart");
      setItems(data.items);
      await refreshCart();
    } catch {
      setItems([]);
    } finally {
      setLoading(false);
    }
  }, [refreshCart]);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  async function updateQty(productId: string, quantity: number) {
    try {
      await withCartMutation(async () => {
        await apiJson(`/cart/items/${productId}`, {
          method: "PATCH",
          body: JSON.stringify({ quantity }),
        });
        toast.success("Cart updated");
        await reloadItems();
      });
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Could not update cart");
    }
  }

  const subtotal = items.reduce((s, i) => s + i.product.priceCents * i.quantity, 0);

  return (
    <div className="border-b border-slate-800/60 bg-gradient-to-b from-slate-100/80 to-white">
      <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-cyan-700">Hardware cart</p>
            <h1 className="mt-2 font-display text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">Cart</h1>
          </div>
          <Link href="/shop" className="text-sm font-semibold text-cyan-700 underline-offset-4 hover:underline">
            Continue shopping
          </Link>
        </div>

        {loading ? (
          <div className="mt-12 space-y-6" aria-busy aria-label="Loading cart">
            {[1, 2, 3].map((k) => (
              <div key={k} className="flex animate-pulse gap-5 rounded-2xl border border-slate-200 bg-white p-6">
                <div className="h-28 w-28 shrink-0 rounded-xl bg-slate-200" />
                <div className="flex-1 space-y-3 pt-2">
                  <div className="h-5 w-2/3 rounded bg-slate-200" />
                  <div className="h-4 w-24 rounded bg-slate-200" />
                </div>
              </div>
            ))}
          </div>
        ) : items.length === 0 ? (
          <Card className="mt-12 border-dashed border-slate-300 py-20 text-center">
            <Package className="mx-auto h-12 w-12 text-slate-300" aria-hidden />
            <p className="mt-6 font-display text-xl font-semibold text-slate-800">Your cart is empty</p>
            <p className="mt-2 text-sm text-slate-500">Add trackers, cameras, and accessories for your next rollout.</p>
            <Button asChild className="mt-8 bg-cyan-500 font-semibold text-slate-950 hover:bg-cyan-400" size="lg">
              <Link href="/shop">Browse catalog</Link>
            </Button>
          </Card>
        ) : (
          <div className="mt-10 grid gap-10 lg:grid-cols-[1fr_380px] lg:items-start">
            <ul className="space-y-4">
              {items.map((i) => (
                <li key={i.id}>
                  <Card className="overflow-hidden border-slate-200 p-0 shadow-md">
                    <div className="flex gap-5 p-5 sm:gap-6 sm:p-6">
                      <Link href={`/product/${i.product.slug}`} className="relative h-28 w-28 shrink-0 overflow-hidden rounded-xl bg-slate-100 ring-1 ring-slate-200 sm:h-32 sm:w-32">
                        {i.product.images[0] && (
                          <Image src={i.product.images[0].url} alt={i.product.name} fill className="object-cover" />
                        )}
                      </Link>
                      <div className="flex min-w-0 flex-1 flex-col justify-between gap-4 sm:flex-row sm:items-center">
                        <div className="min-w-0">
                          <Link href={`/product/${i.product.slug}`} className="font-semibold text-slate-900 hover:text-cyan-700 hover:underline">
                            {i.product.name}
                          </Link>
                          <p className="mt-1 text-sm text-slate-500">{formatPrice(i.product.priceCents)} each</p>
                        </div>
                        <div className="flex flex-wrap items-center gap-3">
                          <Input
                            type="number"
                            min={0}
                            className="h-10 w-20"
                            value={i.quantity}
                            onChange={(e) => updateQty(i.product.id, Number(e.target.value))}
                            aria-label="Quantity"
                          />
                          <Button variant="ghost" size="sm" className="text-slate-500 hover:text-rose-600" onClick={() => updateQty(i.product.id, 0)}>
                            Remove
                          </Button>
                        </div>
                      </div>
                    </div>
                  </Card>
                </li>
              ))}
            </ul>

            <Card className="sticky top-24 border-slate-200 p-6 shadow-xl lg:p-8">
              <h2 className="font-display text-xl font-semibold text-slate-900">Order summary</h2>
              <div className="mt-6 flex items-center justify-between border-b border-slate-100 pb-4 text-sm">
                <span className="text-slate-600">Subtotal</span>
                <span className="text-lg font-bold text-slate-900">{formatPrice(subtotal)}</span>
              </div>
              <p className="mt-4 flex items-start gap-2 text-xs text-slate-500">
                <Lock className="mt-0.5 h-3.5 w-3.5 shrink-0 text-cyan-600" aria-hidden />
                Shipping and tax confirmed at checkout. Secure payment via Stripe or COD where enabled.
              </p>
              <Button asChild className="mt-8 h-12 w-full bg-cyan-500 text-base font-semibold text-slate-950 hover:bg-cyan-400" size="lg">
                <Link href="/checkout" className="inline-flex items-center justify-center gap-2">
                  Checkout
                  <ArrowRight className="h-4 w-4" aria-hidden />
                </Link>
              </Button>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
