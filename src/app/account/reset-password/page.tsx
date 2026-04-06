"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { apiJson } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { LoadingOverlay } from "@/components/loading-overlay";
import { AccountShell } from "@/components/account-shell";

export default function ResetPasswordPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [token, setToken] = useState("");

  useEffect(() => {
    const t = searchParams.get("token");
    if (t) setToken(t);
  }, [searchParams]);
  const [password, setPassword] = useState("");
  const [err, setErr] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);
    setLoading(true);
    try {
      await apiJson("/storefront/auth/reset-password", {
        method: "POST",
        body: JSON.stringify({ token, password }),
      });
      router.push("/account/login");
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Reset failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <AccountShell
      title="Reset password"
      subtitle="Use the link from your email, or paste a token from the API console when outbound mail is not configured."
    >
      <LoadingOverlay show={loading} label="Updating password…" />
      <form onSubmit={submit} className="space-y-4">
        <div>
          <label className="text-xs font-medium uppercase tracking-wider text-slate-500">Reset token</label>
          <Input className="mt-2" placeholder="Token" value={token} onChange={(e) => setToken(e.target.value)} required autoComplete="off" />
        </div>
        <div>
          <label className="text-xs font-medium uppercase tracking-wider text-slate-500">New password</label>
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
        <Button type="submit" className="h-12 w-full bg-cyan-500 font-semibold text-slate-950 hover:bg-cyan-400" size="lg" disabled={loading}>
          {loading ? "Updating…" : "Update password"}
        </Button>
      </form>
      <p className="mt-8 text-center text-sm text-slate-600">
        <Link href="/account/login" className="font-semibold text-cyan-700 underline-offset-4 hover:underline">
          Sign in
        </Link>
      </p>
    </AccountShell>
  );
}
