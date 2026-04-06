"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { apiJson } from "@/lib/api";
import { LoadingOverlay } from "@/components/loading-overlay";
import { Card, CardContent } from "@/components/ui/card";

type Order = {
  id: string;
  orderNumber: string;
  totalCents: number;
  subtotalCents: number;
  discountCents: number;
  couponCode?: string | null;
  shippingCents: number;
  paymentStatus: string;
  fulfillmentStatus: string;
  paymentMethod?: string;
  orderChannel?: string;
  shippingMethodLabel?: string | null;
  items: { productName: string; quantity: number; lineTotalCents: number; sku: string }[];
};

export default function AccountOrderDetailPage() {
  const params = useParams();
  const id = typeof params.id === "string" ? params.id : "";
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    apiJson<Order>(`/storefront/orders/${id}`)
      .then(setOrder)
      .catch(() => setOrder(null))
      .finally(() => setLoading(false));
  }, [id]);

  return (
    <div className="relative min-h-[55vh] border-b border-slate-800/60 bg-gradient-to-b from-slate-100/80 to-white px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
      <LoadingOverlay show={loading} label="Loading order…" />
      <div className="mx-auto max-w-2xl">
        <Link href="/account/orders" className="inline-flex items-center gap-1 text-sm font-medium text-cyan-700 hover:text-cyan-600">
          ← All orders
        </Link>
        {!loading && !order && <p className="mt-10 text-center text-rose-600">Order not found.</p>}
        {order && (
          <Card className="mt-8 border-slate-200 shadow-xl">
            <CardContent className="space-y-6 p-6 sm:p-8">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-cyan-700">Order</p>
                <h1 className="mt-2 font-display text-3xl font-semibold text-slate-900">{order.orderNumber}</h1>
              </div>
              <div className="rounded-xl border border-slate-100 bg-slate-50 p-4 text-sm text-slate-600">
                <p>
                  <span className="font-semibold text-slate-800">Status:</span> {order.paymentStatus} / {order.fulfillmentStatus}
                </p>
                {order.paymentMethod && (
                  <p className="mt-1">
                    <span className="font-semibold text-slate-800">Payment:</span> {order.paymentMethod}
                  </p>
                )}
                {order.orderChannel && (
                  <p className="mt-1">
                    <span className="font-semibold text-slate-800">Channel:</span> {order.orderChannel}
                  </p>
                )}
                {order.shippingMethodLabel && (
                  <p className="mt-1">
                    <span className="font-semibold text-slate-800">Shipping:</span> {order.shippingMethodLabel}
                  </p>
                )}
              </div>
              <ul className="divide-y divide-slate-100 text-sm">
                {order.items.map((i) => (
                  <li key={i.sku + i.productName} className="flex justify-between gap-4 py-3 first:pt-0">
                    <span className="text-slate-700">
                      {i.productName} × {i.quantity}
                    </span>
                    <span className="shrink-0 font-semibold text-slate-900">
                      {new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(i.lineTotalCents / 100)}
                    </span>
                  </li>
                ))}
              </ul>
              {order.couponCode && order.discountCents > 0 && (
                <p className="rounded-lg bg-emerald-50 px-3 py-2 text-sm text-emerald-900">
                  Coupon {order.couponCode}: −
                  {new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(order.discountCents / 100)}
                </p>
              )}
              <p className="border-t border-slate-100 pt-6 text-lg font-bold text-slate-900">
                Total {new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(order.totalCents / 100)}
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
