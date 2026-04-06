"use client";

import { useCart } from "@/context/cart-context";
import { LoadingOverlay } from "@/components/loading-overlay";

export function CartLoadingOverlay() {
  const { cartLoading, cartOverlayLabel } = useCart();
  return <LoadingOverlay show={cartLoading} label={cartOverlayLabel} />;
}
