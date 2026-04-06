export default function ProductLoading() {
  return (
    <div className="border-b border-slate-800/60 bg-gradient-to-b from-slate-100/80 to-white">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="h-3 w-40 animate-pulse rounded bg-slate-200" />
        <div className="mt-8 grid gap-10 lg:grid-cols-2">
          <div className="aspect-[4/5] animate-pulse rounded-2xl bg-slate-200" />
          <div className="space-y-4">
            <div className="h-4 w-24 animate-pulse rounded bg-slate-200" />
            <div className="h-10 w-full max-w-lg animate-pulse rounded-lg bg-slate-200" />
            <div className="h-8 w-32 animate-pulse rounded bg-slate-200" />
            <div className="mt-6 space-y-2">
              <div className="h-3 w-full animate-pulse rounded bg-slate-200" />
              <div className="h-3 w-full animate-pulse rounded bg-slate-200" />
              <div className="h-3 w-2/3 animate-pulse rounded bg-slate-200" />
            </div>
            <div className="mt-8 h-12 w-48 animate-pulse rounded-full bg-slate-200" />
          </div>
        </div>
      </div>
    </div>
  );
}
