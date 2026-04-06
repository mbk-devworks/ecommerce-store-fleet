import { Suspense } from "react";

export default function ResetPasswordLayout({ children }: { children: React.ReactNode }) {
  return <Suspense fallback={<div className="min-h-[30vh]" aria-hidden />}>{children}</Suspense>;
}
