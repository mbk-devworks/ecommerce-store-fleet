"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { apiJson, fetchStorefrontAccount, type SavedAddress } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { LoadingOverlay } from "@/components/loading-overlay";

export default function AddressesPage() {
  const [account, setAccount] = useState<{ email: string } | null | undefined>(undefined);
  const [rows, setRows] = useState<SavedAddress[]>([]);
  const [label, setLabel] = useState("");
  const [line1, setLine1] = useState("");
  const [line2, setLine2] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [postal, setPostal] = useState("");
  const [isDefault, setIsDefault] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [listLoading, setListLoading] = useState(false);
  const [addBusy, setAddBusy] = useState(false);
  const [removingId, setRemovingId] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setListLoading(true);
    try {
      const data = await apiJson<SavedAddress[]>("/storefront/addresses");
      setRows(data);
    } catch {
      setRows([]);
    } finally {
      setListLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStorefrontAccount().then(setAccount);
  }, []);

  useEffect(() => {
    if (account) void refresh();
  }, [account, refresh]);

  async function add(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);
    setAddBusy(true);
    try {
      await apiJson("/storefront/addresses", {
        method: "POST",
        body: JSON.stringify({
          label: label.trim() || undefined,
          line1,
          line2: line2.trim() || undefined,
          city,
          state,
          postalCode: postal,
          country: "US",
          isDefault,
        }),
      });
      setLabel("");
      setLine1("");
      setLine2("");
      setCity("");
      setState("");
      setPostal("");
      setIsDefault(false);
      await refresh();
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Failed");
    } finally {
      setAddBusy(false);
    }
  }

  async function remove(id: string) {
    setRemovingId(id);
    try {
      await apiJson(`/storefront/addresses/${id}`, { method: "DELETE" });
      await refresh();
    } finally {
      setRemovingId(null);
    }
  }

  const overlayLabel =
    addBusy ? "Saving address…" : removingId ? "Removing…" : listLoading ? "Loading addresses…" : "Loading…";

  if (account === undefined) {
    return (
      <div className="relative min-h-[50vh] px-4 py-16">
        <LoadingOverlay show label="Loading…" />
      </div>
    );
  }

  if (!account) {
    return (
      <div className="min-h-[50vh] border-b border-slate-800/60 bg-gradient-to-b from-slate-100/80 to-white px-4 py-20 text-center">
        <p className="text-slate-600">Sign in to manage saved addresses.</p>
        <Button asChild className="mt-6 bg-cyan-500 font-semibold text-slate-950 hover:bg-cyan-400">
          <Link href="/account/login">Sign in</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="relative min-h-[55vh] border-b border-slate-800/60 bg-gradient-to-b from-slate-100/80 to-white px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
      <LoadingOverlay show={listLoading || addBusy || removingId !== null} label={overlayLabel} />
      <div className="mx-auto max-w-2xl">
        <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-cyan-700">Account</p>
        <h1 className="mt-2 font-display text-3xl font-semibold tracking-tight text-slate-900">Saved addresses</h1>
        <p className="mt-2 text-sm text-slate-600">Prefill checkout — you can still edit before paying.</p>

        <Card className="mt-10 border-slate-200 shadow-xl">
          <CardContent className="p-6 sm:p-8">
            <p className="text-sm font-semibold text-slate-900">Add address</p>
            <form onSubmit={add} className="mt-6 space-y-4">
              <Input placeholder="Label (optional)" value={label} onChange={(e) => setLabel(e.target.value)} disabled={addBusy} />
              <Input placeholder="Line 1" value={line1} onChange={(e) => setLine1(e.target.value)} required disabled={addBusy} />
              <Input placeholder="Line 2" value={line2} onChange={(e) => setLine2(e.target.value)} disabled={addBusy} />
              <div className="grid gap-4 sm:grid-cols-2">
                <Input placeholder="City" value={city} onChange={(e) => setCity(e.target.value)} required disabled={addBusy} />
                <Input placeholder="State" value={state} onChange={(e) => setState(e.target.value)} required disabled={addBusy} />
              </div>
              <Input placeholder="ZIP" value={postal} onChange={(e) => setPostal(e.target.value)} required disabled={addBusy} />
              <label className="flex items-center gap-2 text-sm text-slate-700">
                <input type="checkbox" checked={isDefault} onChange={(e) => setIsDefault(e.target.checked)} disabled={addBusy} />
                Default for checkout
              </label>
              {err && <p className="text-sm text-rose-600">{err}</p>}
              <Button type="submit" className="bg-cyan-500 font-semibold text-slate-950 hover:bg-cyan-400" disabled={addBusy || listLoading}>
                {addBusy ? "Saving…" : "Save address"}
              </Button>
            </form>
          </CardContent>
        </Card>

        <ul className="mt-8 space-y-4">
          {rows.map((a) => (
            <li key={a.id}>
              <Card className="border-slate-200">
                <CardContent className="p-5 text-sm">
                  <p className="font-semibold text-slate-900">
                    {a.label ?? "Address"}
                    {a.isDefault && (
                      <span className="ml-2 rounded-full bg-cyan-50 px-2 py-0.5 text-xs font-semibold text-cyan-800">Default</span>
                    )}
                  </p>
                  <p className="mt-2 leading-relaxed text-slate-600">
                    {a.line1}
                    {a.line2 ? `, ${a.line2}` : ""}
                    <br />
                    {a.city}, {a.state} {a.postalCode}
                  </p>
                  <button
                    type="button"
                    className="mt-3 text-sm font-semibold text-rose-600 underline-offset-4 hover:underline disabled:opacity-50"
                    disabled={removingId !== null || listLoading}
                    onClick={() => void remove(a.id)}
                  >
                    {removingId === a.id ? "Removing…" : "Remove"}
                  </button>
                </CardContent>
              </Card>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
