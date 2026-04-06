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

export default function AccountLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);
    setLoading(true);
    try {
      await apiJson("/storefront/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      });
      toast.success("Signed in");
      router.push("/shop");
      router.refresh();
    } catch (e) {
      const m = e instanceof Error ? e.message : "Sign in failed";
      setErr(m);
      toast.error(m);
    } finally {
      setLoading(false);
    }
  }

  return (
    <AccountShell
      title="Sign in"
      subtitle={
        <>
          Fleet customer account. New here?{" "}
          <Link href="/account/register" className="font-semibold text-cyan-700 underline-offset-4 hover:underline">
            Create an account
          </Link>
        </>
      }
    >
      <LoadingOverlay show={loading} label="Signing in…" />
      {!getStoreId() && (
        <p className="mb-6 rounded-xl border border-amber-200 bg-amber-50 p-3 text-sm text-amber-900">
          Set <code className="rounded bg-white px-1">NEXT_PUBLIC_STORE_ID</code> in <code className="rounded bg-white px-1">.env</code> (see API seed output).
        </p>
      )}
      <form onSubmit={submit} className="space-y-4">
        <div>
          <label className="text-xs font-medium uppercase tracking-wider text-slate-500">Email</label>
          <Input type="email" autoComplete="email" placeholder="you@fleet.com" className="mt-2" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </div>
        <div>
          <label className="text-xs font-medium uppercase tracking-wider text-slate-500">Password</label>
          <Input
            type="password"
            autoComplete="current-password"
            placeholder="••••••••"
            className="mt-2"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        {err && <p className="text-sm text-rose-600">{err}</p>}
        <Button type="submit" className="mt-2 h-12 w-full bg-cyan-500 text-base font-semibold text-slate-950 shadow-md hover:bg-cyan-400" size="lg" disabled={loading}>
          {loading ? "Signing in…" : "Sign in"}
        </Button>
      </form>
      <p className="mt-8 border-t border-slate-100 pt-6 text-center text-sm text-slate-600">
        <Link href="/account/forgot-password" className="font-semibold text-cyan-700 underline-offset-4 hover:underline">
          Forgot password?
        </Link>
      </p>
    </AccountShell>
  );
}
