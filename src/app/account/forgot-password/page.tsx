"use client";

import Link from "next/link";
import { useState } from "react";
import { apiJson } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { LoadingOverlay } from "@/components/loading-overlay";
import { AccountShell } from "@/components/account-shell";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [msg, setMsg] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);
    setMsg(null);
    setLoading(true);
    try {
      await apiJson("/storefront/auth/forgot-password", {
        method: "POST",
        body: JSON.stringify({ email }),
      });
      setMsg(
        "If an account exists for this store, you should receive an email with a reset link shortly. " +
          "If email is not configured on the API, check the API server console for a one-time token and open Reset password."
      );
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Request failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <AccountShell
      title="Forgot password"
      subtitle="We send a reset link by email when RESEND_API_KEY and MAIL_FROM are set on the API. Otherwise the API logs a token for local testing."
    >
      <LoadingOverlay show={loading} label="Sending…" />
      <form onSubmit={submit} className="space-y-4">
        <div>
          <label className="text-xs font-medium uppercase tracking-wider text-slate-500">Email</label>
          <Input type="email" autoComplete="email" placeholder="you@fleet.com" className="mt-2" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </div>
        {msg && <p className="rounded-lg bg-emerald-50 px-3 py-2 text-sm text-emerald-800">{msg}</p>}
        {err && <p className="text-sm text-rose-600">{err}</p>}
        <Button type="submit" className="h-12 w-full bg-cyan-500 text-base font-semibold text-slate-950 hover:bg-cyan-400" size="lg" disabled={loading}>
          {loading ? "Sending…" : "Send reset link"}
        </Button>
      </form>
      <p className="mt-8 border-t border-slate-100 pt-6 text-center text-sm text-slate-600">
        <Link href="/account/reset-password" className="font-semibold text-cyan-700 underline-offset-4 hover:underline">
          I have a reset token
        </Link>
        {" · "}
        <Link href="/account/login" className="underline-offset-4 hover:underline">
          Back to sign in
        </Link>
      </p>
    </AccountShell>
  );
}
