export default function CheckoutLoading() {
  return (
    <div className="mx-auto max-w-5xl animate-pulse px-4 py-12 sm:px-6 lg:px-8" aria-busy aria-label="Loading checkout">
      <div className="grid gap-10 lg:grid-cols-2">
        <div className="space-y-4">
          <div className="h-9 w-48 rounded-lg bg-slate-800" />
          <div className="h-10 w-full rounded-xl bg-slate-800" />
          <div className="h-10 w-full rounded-xl bg-slate-800" />
          <div className="h-10 w-full rounded-xl bg-slate-800" />
        </div>
        <div className="h-64 rounded-2xl border border-slate-800 bg-slate-900" />
      </div>
    </div>
  );
}
