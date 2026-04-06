"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { apiJson } from "@/lib/api";
import { LoadingOverlay } from "@/components/loading-overlay";
import { Card, CardContent } from "@/components/ui/card";
import { ChevronRight } from "lucide-react";

type Row = {
  id: string;
  orderNumber: string;
  totalCents: number;
  paymentStatus: string;
  fulfillmentStatus: string;
  paymentMethod?: string;
  createdAt: string;
};

export default function AccountOrdersPage() {
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    apiJson<Row[]>("/storefront/orders")
      .then(setRows)
      .catch(() => setRows([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="relative min-h-[55vh] border-b border-slate-800/60 bg-gradient-to-b from-slate-100/80 to-white px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
      <LoadingOverlay show={loading} label="Loading orders…" />
      <div className="mx-auto max-w-2xl">
        <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-cyan-700">Account</p>
        <h1 className="mt-2 font-display text-3xl font-semibold tracking-tight text-slate-900">Your orders</h1>
        <p className="mt-2 text-sm text-slate-600">Orders placed on this store while signed in.</p>

        <ul className="mt-10 space-y-3">
          {rows.map((r) => (
            <li key={r.id}>
              <Link href={`/account/orders/${r.id}`}>
                <Card className="border-slate-200 transition hover:border-cyan-300 hover:shadow-md">
                  <CardContent className="flex items-center gap-4 p-5">
                    <div className="min-w-0 flex-1">
                      <p className="font-semibold text-slate-900">{r.orderNumber}</p>
                      <p className="mt-1 text-xs text-slate-500">
                        {new Date(r.createdAt).toLocaleString()} · {r.paymentStatus} · {r.fulfillmentStatus}
                        {r.paymentMethod ? ` · ${r.paymentMethod}` : ""}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <p className="text-sm font-bold text-slate-900">
                        {new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(r.totalCents / 100)}
                      </p>
                      <ChevronRight className="h-5 w-5 text-slate-400" aria-hidden />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            </li>
          ))}
        </ul>
        {!loading && rows.length === 0 && (
          <Card className="mt-10 border-dashed border-slate-300 py-16 text-center">
            <p className="text-slate-600">No orders yet.</p>
            <Link href="/shop" className="mt-4 inline-block text-sm font-semibold text-cyan-700 underline-offset-4 hover:underline">
              Browse hardware
            </Link>
          </Card>
        )}
      </div>
    </div>
  );
}
