"use client";

import { useEffect, useState } from "react";
import { Toaster } from "sonner";
import { CartProvider } from "@/context/cart-context";
import { CartLoadingOverlay } from "@/components/cart-loading-overlay";
import { verifyStoreConfig } from "@/lib/api";

export function StoreProviders({ children }: { children: React.ReactNode }) {
  const [configErr, setConfigErr] = useState<string | null>(null);

  useEffect(() => {
    verifyStoreConfig().then((r) => {
      if (!r.ok) setConfigErr(r.message);
    });
  }, []);

  return (
    <CartProvider>
      {configErr ? (
        <div
          className="border-b border-amber-500/80 bg-amber-950/95 px-4 py-3 text-center text-sm text-amber-100"
          role="alert"
        >
          <strong className="font-semibold">Store configuration: </strong>
          {configErr}
        </div>
      ) : null}
      <CartLoadingOverlay />
      {children}
      <Toaster richColors theme="dark" position="top-center" closeButton />
    </CartProvider>
  );
}
