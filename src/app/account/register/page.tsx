"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { apiJson, getStoreId } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { LoadingOverlay } from "@/components/loading-overlay";
import { AccountShell } from "@/components/account-shell";

export default function AccountRegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);
    setLoading(true);
    try {
      await apiJson("/storefront/auth/register", {
        method: "POST",
        body: JSON.stringify({ name: name || undefined, email, password }),
      });
      toast.success("Account created");
      router.push("/shop");
      router.refresh();
    } catch (e) {
      const m = e instanceof Error ? e.message : "Registration failed";
      setErr(m);
      toast.error(m);
    } finally {
      setLoading(false);
    }
  }

  return (
    <AccountShell
      title="Create account"
      subtitle={
        <>
          Already registered?{" "}
          <Link href="/account/login" className="font-semibold text-cyan-700 underline-offset-4 hover:underline">
            Sign in
          </Link>
        </>
      }
    >
      <LoadingOverlay show={loading} label="Creating account…" />
      {!getStoreId() && (
        <p className="mb-6 rounded-xl border border-amber-200 bg-amber-50 p-3 text-sm text-amber-900">
          Set <code className="rounded bg-white px-1">NEXT_PUBLIC_STORE_ID</code> in your env file.
        </p>
      )}
      <form onSubmit={submit} className="space-y-4">
        <div>
          <label className="text-xs font-medium uppercase tracking-wider text-slate-500">Full name (optional)</label>
          <Input className="mt-2" placeholder="Alex Fleet" value={name} onChange={(e) => setName(e.target.value)} autoComplete="name" />
        </div>
        <div>
          <label className="text-xs font-medium uppercase tracking-wider text-slate-500">Email</label>
          <Input className="mt-2" type="email" autoComplete="email" placeholder="you@fleet.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </div>
        <div>
          <label className="text-xs font-medium uppercase tracking-wider text-slate-500">Password</label>
          <Input
            className="mt-2"
            type="password"
            autoComplete="new-password"
            placeholder="Min. 8 characters"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={8}
          />
        </div>
        {err && <p className="text-sm text-rose-600">{err}</p>}
        <Button type="submit" className="mt-2 h-12 w-full bg-cyan-500 text-base font-semibold text-slate-950 shadow-md hover:bg-cyan-400" size="lg" disabled={loading}>
          {loading ? "Creating…" : "Register"}
        </Button>
      </form>
    </AccountShell>
  );
}
