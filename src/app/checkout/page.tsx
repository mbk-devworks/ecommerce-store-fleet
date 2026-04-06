"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { apiJson, fetchStorefrontAccount, fetchStorefrontAddresses } from "@/lib/api";
import { useCart } from "@/context/cart-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LoadingOverlay } from "@/components/loading-overlay";
import { CreditCard, Lock, ShieldCheck, Truck, Tag } from "lucide-react";

type Rate = {
  id: string;
  carrier: string;
  service: string;
  amountCents: number;
  estimatedDaysMin?: number;
  estimatedDaysMax?: number;
};

type Quote = {
  rates: Rate[];
  cheapest: Rate | null;
  fastest: Rate | null;
  recommended: Rate | null;
};

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-2">
      <label className="text-xs font-medium uppercase tracking-wider text-slate-500">{label}</label>
      {children}
    </div>
  );
}

export default function CheckoutPage() {
  const router = useRouter();
  const { refreshCart } = useCart();
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [line1, setLine1] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [postal, setPostal] = useState("");
  const [quote, setQuote] = useState<Quote | null>(null);
  const [methodId, setMethodId] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [couponBusy, setCouponBusy] = useState(false);
  const [couponInput, setCouponInput] = useState("");
  const [appliedCouponCode, setAppliedCouponCode] = useState<string | null>(null);
  const [couponDiscountCents, setCouponDiscountCents] = useState(0);
  const [couponMsg, setCouponMsg] = useState<string | null>(null);
  const [payMode, setPayMode] = useState<"stripe" | "cod">("stripe");

  useEffect(() => {
    void refreshCart();
  }, [refreshCart]);

  useEffect(() => {
    fetchStorefrontAccount().then((u) => {
      if (u?.email) setEmail((prev) => prev || u.email);
      if (u?.name) setName((prev) => prev || u.name || "");
    });
    fetchStorefrontAddresses().then((addrs) => {
      const d = addrs.find((a) => a.isDefault) ?? addrs[0];
      if (d) {
        setLine1((prev) => prev || d.line1);
        setCity((prev) => prev || d.city);
        setState((prev) => prev || d.state);
        setPostal((prev) => prev || d.postalCode);
      }
    });
  }, []);

  async function applyCoupon() {
    setCouponMsg(null);
    setErr(null);
    setCouponBusy(true);
    try {
      const p = await apiJson<{
        valid: boolean;
        code?: string;
        discountCents?: number;
        message?: string;
      }>("/cart/coupon-preview", {
        method: "POST",
        body: JSON.stringify({ code: couponInput }),
      });
      if (p.valid && p.code && (p.discountCents ?? 0) > 0) {
        setAppliedCouponCode(p.code);
        setCouponDiscountCents(p.discountCents ?? 0);
        setCouponMsg(`Applied ${p.code} (−${new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format((p.discountCents ?? 0) / 100)})`);
        toast.success("Coupon applied");
      } else {
        setAppliedCouponCode(null);
        setCouponDiscountCents(0);
        setCouponMsg(p.message ?? "Coupon not applied");
        toast.message(p.message ?? "Coupon not applied");
      }
    } catch {
      setAppliedCouponCode(null);
      setCouponDiscountCents(0);
      setCouponMsg("Could not validate coupon");
      toast.error("Could not validate coupon");
    } finally {
      setCouponBusy(false);
    }
  }

  async function getQuote() {
    setErr(null);
    setLoading(true);
    try {
      const q = await apiJson<Quote>("/cart/shipping-quote", {
        method: "POST",
        body: JSON.stringify({
          destination: { line1, city, state, postalCode: postal, country: "US" },
        }),
      });
      setQuote(q);
      setMethodId(q.recommended?.id ?? q.cheapest?.id ?? null);
      toast.success("Shipping rates loaded");
    } catch (e) {
      const m = e instanceof Error ? e.message : "Quote failed";
      setErr(m);
      toast.error(m);
    } finally {
      setLoading(false);
    }
  }

  async function pay() {
    setErr(null);
    setLoading(true);
    try {
      const origin = window.location.origin;
      const res = await apiJson<{ url: string | null }>("/checkout/create-session", {
        method: "POST",
        body: JSON.stringify({
          customerEmail: email,
          customerName: name,
          shippingAddress: { line1, city, state, postalCode: postal, country: "US" },
          shippingMethodId: methodId,
          storefrontSuccessUrl: `${origin}/order/confirmation`,
          storefrontCancelUrl: `${origin}/checkout`,
          ...(appliedCouponCode ? { couponCode: appliedCouponCode } : {}),
        }),
      });
      if (res.url) {
        toast.success("Redirecting to secure checkout…");
        window.location.href = res.url;
      } else {
        setErr("Checkout unavailable");
        toast.error("Checkout unavailable");
      }
    } catch (e) {
      const m = e instanceof Error ? e.message : "Checkout failed";
      setErr(m);
      toast.error(m);
    } finally {
      setLoading(false);
    }
  }

  async function placeCod() {
    setErr(null);
    setLoading(true);
    try {
      const order = await apiJson<{ id: string; orderNumber: string }>("/checkout/place-cod-order", {
        method: "POST",
        body: JSON.stringify({
          customerEmail: email,
          customerName: name,
          shippingAddress: { line1, city, state, postalCode: postal, country: "US" },
          shippingMethodId: methodId,
          storefrontBaseUrl: typeof window !== "undefined" ? window.location.origin : undefined,
          ...(appliedCouponCode ? { couponCode: appliedCouponCode } : {}),
        }),
      });
      await refreshCart();
      toast.success(`Order ${order.orderNumber} — pay on delivery`);
      router.push(`/order/confirmation?orderId=${encodeURIComponent(order.id)}&email=${encodeURIComponent(email)}`);
    } catch (e) {
      const m = e instanceof Error ? e.message : "Could not place order";
      setErr(m);
      toast.error(m);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="border-b border-slate-800/60 bg-gradient-to-b from-slate-100/80 to-white">
      <LoadingOverlay show={loading} label={payMode === "cod" ? "Placing order…" : "Please wait…"} />
      <LoadingOverlay show={couponBusy && !loading} label="Checking coupon…" />
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:grid lg:grid-cols-[1fr_380px] lg:gap-10 lg:px-8 lg:py-16">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-cyan-700">Secure checkout</p>
          <h1 className="mt-2 font-display text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">Checkout</h1>
          <p className="mt-3 text-sm text-slate-600">Hardware orders — rates and tax finalized on the next step.</p>

          <Card className="mt-10 border-slate-200 shadow-md">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 font-display text-lg">
                <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-cyan-500/15 text-sm font-bold text-cyan-800">1</span>
                Contact &amp; shipping
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Field label="Email">
                <Input type="email" placeholder="you@fleet.com" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" />
              </Field>
              <Field label="Full name">
                <Input placeholder="Name for the order" value={name} onChange={(e) => setName(e.target.value)} autoComplete="name" />
              </Field>
              <Field label="Address">
                <Input placeholder="Street address" value={line1} onChange={(e) => setLine1(e.target.value)} autoComplete="street-address" />
              </Field>
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="City">
                  <Input placeholder="City" value={city} onChange={(e) => setCity(e.target.value)} autoComplete="address-level2" />
                </Field>
                <Field label="State">
                  <Input placeholder="State" value={state} onChange={(e) => setState(e.target.value)} autoComplete="address-level1" />
                </Field>
              </div>
              <Field label="ZIP">
                <Input placeholder="ZIP" value={postal} onChange={(e) => setPostal(e.target.value)} autoComplete="postal-code" />
              </Field>
            </CardContent>
          </Card>

          <Card className="mt-6 border-slate-200 shadow-md">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 font-display text-lg">
                <Tag className="h-5 w-5 text-cyan-600" aria-hidden />
                Promo code
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-wrap items-end gap-3">
              <Input placeholder="Enter code" value={couponInput} onChange={(e) => setCouponInput(e.target.value)} className="max-w-xs" />
              <Button type="button" variant="outline" className="text-slate-900" onClick={applyCoupon} disabled={couponBusy || loading || !couponInput.trim()}>
                {couponBusy ? "Checking…" : "Apply"}
              </Button>
              {couponMsg && <p className="w-full text-sm text-slate-600">{couponMsg}</p>}
            </CardContent>
          </Card>

          <div className="mt-6">
            <Button type="button" variant="secondary" className="h-11" onClick={getQuote} disabled={loading || couponBusy}>
              <Truck className="mr-2 h-4 w-4" aria-hidden />
              {loading ? "Getting rates…" : "Get shipping rates"}
            </Button>
          </div>

          {quote && (
            <Card className="mt-6 border-slate-200 shadow-md">
              <CardHeader className="pb-2">
                <CardTitle className="font-display text-lg">Shipping options</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {quote.rates.map((r) => (
                  <label
                    key={r.id}
                    className="flex cursor-pointer items-center gap-4 rounded-xl border border-slate-200 bg-white p-4 transition hover:border-cyan-300 has-[:checked]:border-cyan-500 has-[:checked]:bg-cyan-50/50 has-[:checked]:ring-1 has-[:checked]:ring-cyan-500/30"
                  >
                    <input type="radio" name="ship" className="h-4 w-4 accent-cyan-600" checked={methodId === r.id} onChange={() => setMethodId(r.id)} />
                    <span className="text-sm">
                      <span className="font-semibold text-slate-900">
                        {r.carrier} {r.service}
                      </span>
                      <span className="text-slate-600">
                        {" "}
                        — {new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(r.amountCents / 100)}
                      </span>
                      {r.estimatedDaysMax != null && <span className="text-slate-500"> · up to {r.estimatedDaysMax} days</span>}
                    </span>
                  </label>
                ))}
              </CardContent>
            </Card>
          )}

          <Card className="mt-6 border-slate-200 shadow-md">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 font-display text-lg">
                <CreditCard className="h-5 w-5 text-cyan-600" aria-hidden />
                Payment
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-slate-200 p-4 has-[:checked]:border-cyan-500 has-[:checked]:bg-cyan-50/40">
                <input type="radio" name="pay" className="h-4 w-4 accent-cyan-600" checked={payMode === "stripe"} onChange={() => setPayMode("stripe")} />
                <span className="text-sm text-slate-800">Pay now (Stripe)</span>
              </label>
              <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-slate-200 p-4 has-[:checked]:border-cyan-500 has-[:checked]:bg-cyan-50/40">
                <input type="radio" name="pay" className="h-4 w-4 accent-cyan-600" checked={payMode === "cod"} onChange={() => setPayMode("cod")} />
                <span className="text-sm text-slate-800">Cash on delivery</span>
              </label>
            </CardContent>
          </Card>

          {err && <p className="mt-6 text-sm text-rose-600">{err}</p>}

          <div className="mt-8 flex flex-wrap gap-4 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-xs text-slate-600">
            <span className="inline-flex items-center gap-1.5">
              <Lock className="h-3.5 w-3.5 text-slate-500" aria-hidden />
              Secure checkout
            </span>
            <span className="inline-flex items-center gap-1.5">
              <ShieldCheck className="h-3.5 w-3.5 text-cyan-600" aria-hidden />
              Encrypted payment (Stripe)
            </span>
            <Link className="text-cyan-800 underline-offset-2 hover:underline" href="/shipping-policy">
              Shipping policy
            </Link>
            <Link className="text-cyan-800 underline-offset-2 hover:underline" href="/returns">
              Returns
            </Link>
          </div>

          {payMode === "stripe" ? (
            <Button
              className="mt-8 h-12 w-full max-w-md bg-cyan-500 text-base font-semibold text-slate-950 shadow-md hover:bg-cyan-400 sm:w-auto"
              size="lg"
              onClick={pay}
              disabled={loading || couponBusy || !methodId || !email}
            >
              Pay with Stripe
            </Button>
          ) : (
            <Button
              className="mt-8 h-12 w-full max-w-md text-base sm:w-auto"
              size="lg"
              variant="secondary"
              onClick={placeCod}
              disabled={loading || couponBusy || !methodId || !email}
            >
              Place order (COD)
            </Button>
          )}
        </div>

        <Card className="mt-10 h-fit border-slate-200 shadow-xl lg:sticky lg:top-24 lg:mt-16">
          <CardHeader>
            <CardTitle className="font-display text-xl">Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-sm text-slate-600">
            {appliedCouponCode && couponDiscountCents > 0 && (
              <p className="rounded-lg bg-emerald-50 px-3 py-2 text-emerald-900">
                Coupon {appliedCouponCode}: −{new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(couponDiscountCents / 100)} on merchandise.
              </p>
            )}
            <p>
              {payMode === "stripe"
                ? "Tax and final totals are confirmed in Stripe Checkout."
                : "You will receive an order number. Pay when your shipment arrives."}
            </p>
            <p className="border-t border-slate-100 pt-4">
              Questions?{" "}
              <a className="font-semibold text-cyan-700 underline-offset-4 hover:underline" href="/contact">
                Contact sales
              </a>
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
