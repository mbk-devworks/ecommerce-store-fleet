"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { apiJson } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { LoadingOverlay } from "@/components/loading-overlay";
import { CheckCircle2, Package } from "lucide-react";

type Order = {
  orderNumber: string;
  customerEmail?: string;
  totalCents: number;
  subtotalCents?: number;
  discountCents?: number;
  couponCode?: string | null;
  paymentStatus: string;
  paymentMethod?: string;
  items: { productName: string; quantity: number; lineTotalCents: number }[];
};

function Inner() {
  const sp = useSearchParams();
  const sessionId = sp.get("session_id");
  const orderId = sp.get("orderId");
  const emailQ = sp.get("email");
  const [order, setOrder] = useState<Order | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (sessionId) {
      setLoading(true);
      setErr(null);
      apiJson<Order>(`/checkout/order?session_id=${encodeURIComponent(sessionId)}`)
        .then(setOrder)
        .catch(() => setErr("Order not found yet — webhooks may still be processing."))
        .finally(() => setLoading(false));
      return;
    }
    if (orderId && emailQ) {
      setLoading(true);
      setErr(null);
      apiJson<Order>(`/checkout/order-detail?orderId=${encodeURIComponent(orderId)}&email=${encodeURIComponent(emailQ)}`)
        .then(setOrder)
        .catch(() => setErr("We could not find that order. Check the link or your email."))
        .finally(() => setLoading(false));
      return;
    }
    setLoading(false);
    setErr(null);
  }, [sessionId, orderId, emailQ]);

  if (!sessionId && !(orderId && emailQ)) {
    return (
      <Card className="border-dashed border-slate-300 py-12 text-center">
        <p className="text-slate-600">
          Missing confirmation details. Return to{" "}
          <Link className="font-semibold text-cyan-700 underline" href="/shop">
            shop
          </Link>
          .
        </p>
      </Card>
    );
  }

  return (
    <>
      <LoadingOverlay show={loading} label="Loading order…" />
      {err && (
        <Card className="border-rose-200 bg-rose-50 py-8 text-center">
          <p className="text-sm text-rose-800">{err}</p>
        </Card>
      )}
      {!loading && !err && !order && <p className="text-center text-slate-500">No order data.</p>}
      {order && (
        <Card className="overflow-hidden border-slate-200 shadow-xl">
          <div className="border-b border-slate-100 bg-gradient-to-r from-cyan-50/80 to-slate-50 px-6 py-8 text-center sm:px-10">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-cyan-500/20 text-cyan-700">
              <CheckCircle2 className="h-8 w-8" aria-hidden />
            </div>
            <p className="mt-4 text-sm font-semibold text-emerald-800">
              Thank you — payment {order.paymentStatus === "PAID" ? "received" : "pending"}
              {order.paymentMethod === "COD" && " (cash on delivery)"}.
            </p>
            <p className="mt-3 font-display text-2xl font-semibold text-slate-900">Order {order.orderNumber}</p>
          </div>
          <CardContent className="space-y-6 p-6 sm:p-8">
            <div className="flex items-center gap-2 text-sm font-semibold text-slate-900">
              <Package className="h-4 w-4 text-cyan-600" aria-hidden />
              Line items
            </div>
            <ul className="divide-y divide-slate-100 text-sm">
              {order.items.map((i, idx) => (
                <li key={idx} className="flex justify-between gap-4 py-3 first:pt-0">
                  <span className="text-slate-700">
                    {i.productName} × {i.quantity}
                  </span>
                  <span className="shrink-0 font-semibold text-slate-900">
                    {new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(i.lineTotalCents / 100)}
                  </span>
                </li>
              ))}
            </ul>
            {order.couponCode && (order.discountCents ?? 0) > 0 && (
              <p className="rounded-lg bg-emerald-50 px-3 py-2 text-sm text-emerald-900">
                Coupon {order.couponCode}: −
                {new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format((order.discountCents ?? 0) / 100)}
              </p>
            )}
            <div className="flex items-center justify-between border-t border-slate-100 pt-6 text-lg font-bold text-slate-900">
              <span>Total</span>
              <span>{new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(order.totalCents / 100)}</span>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              {order.customerEmail ? (
                <Button asChild variant="outline" className="w-full border-slate-300 sm:w-auto" size="lg">
                  <Link
                    href={`/order/track?order=${encodeURIComponent(order.orderNumber)}&email=${encodeURIComponent(order.customerEmail)}`}
                  >
                    Track this order
                  </Link>
                </Button>
              ) : null}
              <Button asChild className="w-full bg-cyan-500 font-semibold text-slate-950 hover:bg-cyan-400 sm:w-auto" size="lg">
                <Link href="/shop">Continue shopping</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </>
  );
}

export default function ConfirmationPage() {
  return (
    <div className="border-b border-slate-800/60 bg-gradient-to-b from-slate-100/80 to-white px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
      <div className="mx-auto max-w-lg">
        <p className="text-center text-[11px] font-semibold uppercase tracking-[0.2em] text-cyan-700">FleetTrack Pro</p>
        <h1 className="mt-2 text-center font-display text-3xl font-semibold tracking-tight text-slate-900">Order confirmation</h1>
        <div className="mt-10">
          <Suspense fallback={<p className="text-center text-slate-500">Loading…</p>}>
            <Inner />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
