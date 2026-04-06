import type { Metadata } from "next";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "Track order",
  description: "Look up your order status with your order number and email.",
};

export default function TrackOrderLayout({ children }: { children: React.ReactNode }) {
  return <Suspense fallback={<div className="min-h-[50vh]" aria-hidden />}>{children}</Suspense>;
}
