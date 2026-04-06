"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { apiJson, fetchStorefrontAccount, type StorefrontAccount } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { LoadingOverlay } from "@/components/loading-overlay";
import { AccountShell } from "@/components/account-shell";

export default function AccountProfilePage() {
  const [acc, setAcc] = useState<StorefrontAccount | null>(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setLoading(true);
    fetchStorefrontAccount()
      .then((u) => {
        setAcc(u);
        if (u) {
          setName(u.name ?? "");
          setEmail(u.email);
        }
      })
      .finally(() => setLoading(false));
  }, []);

  async function save(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      const updated = await apiJson<StorefrontAccount>("/storefront/auth/me", {
        method: "PATCH",
        body: JSON.stringify({
          name: name.trim() || null,
          ...(email.trim().toLowerCase() !== acc?.email.toLowerCase() ? { email: email.trim() } : {}),
        }),
      });
      setAcc(updated);
      toast.success("Profile updated");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not save");
    } finally {
      setSaving(false);
    }
  }

  if (!loading && !acc) {
    return (
      <div className="min-h-[50vh] border-b border-slate-800/60 bg-gradient-to-b from-slate-100/80 to-white px-4 py-20 text-center">
        <p className="text-slate-600">Sign in to manage your profile.</p>
        <Button asChild className="mt-6 bg-cyan-500 font-semibold text-slate-950 hover:bg-cyan-400">
          <Link href="/account/login">Sign in</Link>
        </Button>
      </div>
    );
  }

  return (
    <AccountShell title="Profile" subtitle="Update your display name and login email.">
      <LoadingOverlay show={loading || saving} label={saving ? "Saving…" : "Loading…"} />
      <form onSubmit={save} className="space-y-5">
        <div>
          <label className="text-xs font-medium uppercase tracking-wider text-slate-500">Display name</label>
          <Input className="mt-2" value={name} onChange={(e) => setName(e.target.value)} />
        </div>
        <div>
          <label className="text-xs font-medium uppercase tracking-wider text-slate-500">Email</label>
          <Input className="mt-2" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </div>
        <Button type="submit" className="h-11 w-full bg-cyan-500 font-semibold text-slate-950 hover:bg-cyan-400 sm:w-auto" disabled={saving}>
          {saving ? "Saving…" : "Save changes"}
        </Button>
      </form>
    </AccountShell>
  );
}
