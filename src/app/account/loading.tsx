export default function AccountLoading() {
  return (
    <div className="mx-auto max-w-md animate-pulse px-4 py-16" aria-busy aria-label="Loading">
      <div className="h-8 w-40 rounded-lg bg-slate-800" />
      <div className="mt-8 space-y-4">
        <div className="h-10 w-full rounded-xl bg-slate-800" />
        <div className="h-10 w-full rounded-xl bg-slate-800" />
        <div className="h-10 w-full rounded-xl bg-slate-800" />
      </div>
    </div>
  );
}
