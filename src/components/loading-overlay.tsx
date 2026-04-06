"use client";

export function LoadingOverlay({ show, label = "Loading…" }: { show: boolean; label?: string }) {
  if (!show) return null;
  return (
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center bg-slate-950/75 backdrop-blur-[2px]"
      role="status"
      aria-live="polite"
      aria-label={label}
    >
      <div className="flex flex-col items-center gap-3 rounded-2xl border border-slate-700 bg-slate-900 px-8 py-6 shadow-xl">
        <div className="size-8 animate-spin rounded-full border-2 border-slate-600 border-t-white" />
        <p className="text-sm text-slate-300">{label}</p>
      </div>
    </div>
  );
}
