import type { ReactNode } from "react";
import { Card } from "@/components/ui/card";

export function AccountShell({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: ReactNode;
  children: ReactNode;
}) {
  return (
    <div className="min-h-[55vh] border-b border-slate-800/80 bg-gradient-to-b from-slate-200/40 via-slate-50 to-white px-4 py-14 sm:px-6 sm:py-20 lg:px-8">
      <div className="mx-auto w-full max-w-md">
        <div className="mb-8 text-center">
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-cyan-600">Account</p>
          <h1 className="mt-2 font-display text-3xl font-semibold tracking-tight text-slate-900">{title}</h1>
          {subtitle ? <div className="mt-3 text-sm text-slate-600">{subtitle}</div> : null}
        </div>
        <Card className="border-slate-200/90 bg-white p-8 shadow-[0_20px_50px_-24px_rgba(15,23,42,0.2)]">{children}</Card>
      </div>
    </div>
  );
}
