"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { fetchStorefrontAccount, trackStorefrontOrder, type TrackedOrder } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { PackageSearch } from "lucide-react";

function formatMoney(cents: number | null) {
  if (cents == null) return "—";
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(cents / 100);
}

export default function TrackOrderPage() {
  const searchParams = useSearchParams();
  const [orderNumber, setOrderNumber] = useState("");
  const [email, setEmail] = useState("");
  const [signedIn, setSignedIn] = useState(false);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [order, setOrder] = useState<TrackedOrder | null>(null);

  useEffect(() => {
    void fetchStorefrontAccount().then((a) => setSignedIn(!!a));
  }, []);

  useEffect(() => {
    const n = searchParams.get("order") ?? searchParams.get("orderNumber");
    const e = searchParams.get("email");
    if (n) setOrderNumber(n);
    if (e) setEmail(e);
  }, [searchParams]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);
    setOrder(null);
    setLoading(true);
    try {
      const o = await trackStorefrontOrder({
        orderNumber,
        email: signedIn ? undefined : email || undefined,
      });
      setOrder(o);
    } catch (er) {
      setErr(er instanceof Error ? er.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="border-b border-slate-800 bg-gradient-to-b from-slate-950 to-slate-900 py-16 text-slate-100">
      <div className="mx-auto max-w-lg px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <PackageSearch className="mx-auto h-12 w-12 text-cyan-500/80" aria-hidden />
          <h1 className="mt-6 font-display text-3xl font-semibold">Track your order</h1>
          <p className="mt-3 text-sm text-slate-400">
            Enter the order number from your confirmation email
            {signedIn ? " — signed-in customers don't need to enter email." : " and the email used at checkout."}
          </p>
        </div>

        <Card className="mt-10 border-slate-800 bg-slate-900/80 p-6 shadow-xl backdrop-blur sm:p-8">
          <form onSubmit={onSubmit} className="space-y-5">
            <div>
              <label htmlFor="orderNumber" className="text-sm font-medium text-slate-200">
                Order number
              </label>
              <Input
                id="orderNumber"
                className="mt-1.5 border-slate-700 bg-slate-950/50 text-slate-100 placeholder:text-slate-500"
                placeholder="e.g. ORD-1001"
                value={orderNumber}
                onChange={(e) => setOrderNumber(e.target.value)}
                autoComplete="off"
                required
              />
            </div>
            {!signedIn && (
              <div>
                <label htmlFor="email" className="text-sm font-medium text-slate-200">
                  Email on the order
                </label>
                <Input
                  id="email"
                  type="email"
                  className="mt-1.5 border-slate-700 bg-slate-950/50 text-slate-100 placeholder:text-slate-500"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete="email"
                  required={!signedIn}
                />
              </div>
            )}
            {err && (
              <div className="space-y-2 rounded-lg border border-rose-500/40 bg-rose-950/40 p-3 text-sm text-rose-200">
                <p>{err}</p>
                {!signedIn && (
                  <p className="text-xs text-rose-300/90">
                    Double-check the order number and the email used at checkout. If it still fails, try{" "}
                    <Link className="font-medium text-cyan-400 underline underline-offset-2 hover:text-cyan-300" href="/account/login">
                      signing in
                    </Link>{" "}
                    to see your orders.
                  </p>
                )}
              </div>
            )}
            <Button type="submit" className="w-full bg-cyan-500 font-semibold text-slate-950 hover:bg-cyan-400" size="lg" disabled={loading}>
              {loading ? "Looking up…" : "Track order"}
            </Button>
          </form>
        </Card>

        {order && (
          <Card className="mt-8 border-slate-800 bg-slate-900/80 p-6 backdrop-blur sm:p-8">
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-cyan-400/90">Order</p>
            <p className="mt-2 font-display text-2xl font-semibold text-white">{order.orderNumber}</p>
            <p className="mt-1 text-sm text-slate-400">
              Payment: <span className="capitalize">{order.paymentStatus.replace(/_/g, " ").toLowerCase()}</span>
              {" · "}
              Fulfillment: <span className="capitalize">{order.fulfillmentStatus.replace(/_/g, " ").toLowerCase()}</span>
            </p>
            <p className="mt-1 text-xs text-slate-500">Placed {new Date(order.createdAt).toLocaleString()}</p>
            <div className="mt-6 border-t border-slate-800 pt-6">
              <p className="text-sm font-medium text-white">Items</p>
              <ul className="mt-3 space-y-2 text-sm text-slate-300">
                {order.items.map((line, i) => (
                  <li key={i} className="flex justify-between gap-4">
                    <span>
                      {line.productName} × {line.quantity}
                    </span>
                    <span className="tabular-nums text-slate-400">{formatMoney(line.lineTotalCents)}</span>
                  </li>
                ))}
              </ul>
              <p className="mt-6 flex justify-between border-t border-slate-800 pt-4 text-base font-semibold text-white">
                <span>Total</span>
                <span>{formatMoney(order.totalCents)}</span>
              </p>
            </div>
            <Button asChild variant="outline" className="mt-8 w-full border-slate-600 text-slate-100 hover:bg-slate-800" size="lg">
              <Link href="/shop">Continue shopping</Link>
            </Button>
          </Card>
        )}
      </div>
    </div>
  );
}
