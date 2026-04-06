export default function ShopLoading() {
  return (
    <div className="border-b border-slate-800/60 bg-gradient-to-b from-slate-200/30 via-slate-50 to-white">
      <div className="mx-auto max-w-7xl px-4 pb-20 pt-6 sm:px-6 lg:px-8">
        <div className="h-4 w-48 animate-pulse rounded bg-slate-200" />
        <div className="mt-8 flex flex-col gap-10 lg:flex-row">
          <aside className="space-y-6 lg:w-72">
            <div className="h-56 animate-pulse rounded-2xl bg-slate-300/70" />
            <div className="h-52 animate-pulse rounded-2xl bg-slate-300/70" />
          </aside>
          <div className="min-w-0 flex-1">
            <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="h-10 w-2/3 max-w-md animate-pulse rounded-lg bg-slate-200" />
                <div className="h-11 w-full max-w-[12rem] animate-pulse rounded-full bg-slate-200 sm:ml-auto" />
              </div>
              <div className="mt-4 h-4 w-24 animate-pulse rounded bg-slate-200" />
              <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {[1, 2, 3, 4, 5, 6].map((k) => (
                  <div key={k} className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                    <div className="aspect-[4/5] animate-pulse bg-slate-200" />
                    <div className="space-y-2 p-4">
                      <div className="h-3 w-1/3 animate-pulse rounded bg-slate-200" />
                      <div className="h-4 w-full animate-pulse rounded bg-slate-200" />
                      <div className="h-4 w-1/2 animate-pulse rounded bg-slate-200" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
