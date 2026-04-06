"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Menu, Search, ShoppingBag, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { apiJson, fetchStorefrontAccount, storefrontLogout, type StorefrontAccount } from "@/lib/api";
import { useCart } from "@/context/cart-context";
import type { Category } from "@/types/commerce";
import { cn } from "@/lib/utils";
import { LoadingOverlay } from "@/components/loading-overlay";

const RECENT_SEARCH_KEY = "sf_recent_q_fleet";

function readRecentSearches(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(RECENT_SEARCH_KEY);
    return raw ? (JSON.parse(raw) as string[]) : [];
  } catch {
    return [];
  }
}

function pushRecentSearch(term: string) {
  const t = term.trim();
  if (!t) return;
  try {
    const list = readRecentSearches();
    const next = [t, ...list.filter((x) => x !== t)].slice(0, 5);
    localStorage.setItem(RECENT_SEARCH_KEY, JSON.stringify(next));
  } catch {
    /* ignore */
  }
}

export function SiteHeader() {
  const router = useRouter();
  const pathname = usePathname();
  const { itemCount } = useCart();
  const [open, setOpen] = useState(false);
  const [cats, setCats] = useState<Category[]>([]);
  const [q, setQ] = useState("");
  const [mobileQ, setMobileQ] = useState("");
  const [account, setAccount] = useState<StorefrontAccount | null | undefined>(undefined);
  const [signingOut, setSigningOut] = useState(false);
  const [recent, setRecent] = useState<string[]>([]);

  useEffect(() => {
    apiJson<Category[]>("/storefront/categories").then(setCats).catch(() => setCats([]));
  }, []);

  useEffect(() => {
    setRecent(readRecentSearches());
    if (pathname.startsWith("/shop") && typeof window !== "undefined") {
      const qq = new URLSearchParams(window.location.search).get("q");
      if (qq) {
        setQ(qq);
        setMobileQ(qq);
      }
    }
  }, [pathname]);

  useEffect(() => {
    fetchStorefrontAccount().then(setAccount);
  }, [pathname]);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  async function handleSignOut() {
    setSigningOut(true);
    try {
      await storefrontLogout();
      setAccount(null);
    } finally {
      setSigningOut(false);
    }
  }

  const inputDark = "border-slate-700 bg-slate-900 pl-9 text-slate-100 placeholder:text-slate-500";

  return (
    <header className="sticky top-0 z-50 border-b border-slate-800/80 bg-slate-950/92 text-slate-50 shadow-sm shadow-black/40 backdrop-blur-xl">
      <LoadingOverlay show={signingOut} label="Signing out…" />
      <div className="mx-auto flex h-16 max-w-7xl items-center gap-4 px-4 sm:px-6 lg:px-8">
        <Button variant="ghost" size="icon" className="text-slate-100 lg:hidden" onClick={() => setOpen((v) => !v)} aria-label={open ? "Close menu" : "Open menu"} aria-expanded={open}>
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>
        <Link href="/" className="font-display text-xl font-semibold tracking-tight text-white transition hover:text-cyan-100">
          FleetTrack Pro
        </Link>
        <nav className="hidden flex-1 items-center justify-center gap-8 lg:flex" aria-label="Primary">
          <Link href="/shop" className={cn("text-sm text-slate-300 hover:text-white", pathname === "/shop" && "font-medium text-white")}>
            Shop
          </Link>
          <div className="group relative">
            <button type="button" className="text-sm text-slate-300 hover:text-white">
              Categories
            </button>
            <div className="invisible absolute left-1/2 top-full z-50 mt-3 w-[min(90vw,520px)] -translate-x-1/2 rounded-2xl border border-slate-700/80 bg-slate-900 p-6 opacity-0 shadow-2xl shadow-black/50 ring-1 ring-white/[0.06] transition-all group-hover:visible group-hover:opacity-100">
              <div className="grid grid-cols-2 gap-2">
                {cats.map((c) => (
                  <Link
                    key={c.id}
                    href={`/shop/${c.slug}`}
                    className="rounded-xl px-3 py-2.5 text-sm text-slate-200 transition hover:bg-slate-800/90"
                  >
                    {c.name}
                  </Link>
                ))}
              </div>
            </div>
          </div>
          <Link href="/about" className={cn("text-sm text-slate-300 hover:text-white", pathname === "/about" && "font-medium text-white")}>
            About
          </Link>
          <Link href="/contact" className={cn("text-sm text-slate-300 hover:text-white", pathname === "/contact" && "font-medium text-white")}>
            Contact
          </Link>
          <Link
            href="/order/track"
            className={cn(
              "text-sm text-slate-300 hover:text-white",
              pathname.startsWith("/order/track") && "font-medium text-white"
            )}
          >
            Track order
          </Link>
        </nav>
        <form
          className="hidden max-w-xs flex-1 items-center gap-2 md:flex"
          onSubmit={(e) => {
            e.preventDefault();
            const term = q.trim();
            pushRecentSearch(term);
            setRecent(readRecentSearches());
            router.push(term ? `/shop?q=${encodeURIComponent(term)}` : "/shop");
          }}
        >
          <div className="relative w-full">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-500" aria-hidden />
            <Input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search hardware…"
              className={inputDark}
              list="sf-recent-q-fleet"
              autoComplete="off"
            />
            <datalist id="sf-recent-q-fleet">
              {recent.map((r) => (
                <option key={r} value={r} />
              ))}
            </datalist>
          </div>
        </form>
        <div className="flex items-center gap-2">
          {account === undefined ? null : account ? (
            <div className="hidden items-center gap-2 sm:flex">
              <span className="max-w-[140px] truncate text-xs text-slate-400" title={account.email}>
                {account.email}
              </span>
              <Button type="button" variant="ghost" size="sm" className="text-xs text-slate-300" disabled={signingOut} onClick={() => void handleSignOut()}>
                {signingOut ? "Signing out…" : "Sign out"}
              </Button>
            </div>
          ) : (
            <div className="hidden items-center gap-1 sm:flex">
              <Button variant="ghost" size="sm" className="text-xs text-slate-300" asChild>
                <Link href="/account/login">Sign in</Link>
              </Button>
              <Button size="sm" className="border-0 bg-cyan-500 text-xs font-semibold text-slate-950 shadow-md shadow-cyan-500/15 hover:bg-cyan-400" asChild>
                <Link href="/account/register">Create account</Link>
              </Button>
            </div>
          )}
          {account ? (
            <>
              <Button variant="ghost" size="sm" className="hidden text-xs text-slate-300 sm:inline-flex" asChild>
                <Link href="/account/orders">Orders</Link>
              </Button>
              <Button variant="ghost" size="sm" className="hidden text-xs text-slate-300 sm:inline-flex" asChild>
                <Link href="/account/profile">Profile</Link>
              </Button>
              <Button variant="ghost" size="sm" className="hidden text-xs text-slate-300 sm:inline-flex" asChild>
                <Link href="/account/addresses">Addresses</Link>
              </Button>
            </>
          ) : null}
          <Link href="/cart" className="relative">
            <Button variant="outline" size="icon" className="rounded-full border-slate-600 bg-transparent text-slate-100" aria-label="Shopping cart">
              <ShoppingBag className="h-5 w-5" />
            </Button>
            {itemCount > 0 && (
              <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-emerald-500 px-1 text-[10px] font-semibold text-slate-950">
                {itemCount > 99 ? "99+" : itemCount}
              </span>
            )}
          </Link>
        </div>
      </div>

      {open ? (
        <>
          <button
            type="button"
            className="fixed inset-0 z-[60] bg-slate-950/70 backdrop-blur-sm lg:hidden"
            aria-label="Close menu"
            onClick={() => setOpen(false)}
          />
          <aside
            className="fixed inset-y-0 left-0 z-[70] flex w-[min(100%,400px)] max-w-full flex-col border-r border-slate-800 bg-slate-950 shadow-2xl shadow-black/50 lg:hidden"
            role="dialog"
            aria-modal="true"
            aria-label="Navigation menu"
          >
            <div className="flex h-16 shrink-0 items-center justify-between border-b border-slate-800 px-4">
              <span className="font-display text-lg font-semibold text-white">Menu</span>
              <Button variant="ghost" size="icon" className="text-slate-200 hover:bg-slate-900 hover:text-white" onClick={() => setOpen(false)} aria-label="Close menu">
                <X className="h-5 w-5" />
              </Button>
            </div>
            <div className="min-h-0 flex-1 overflow-y-auto overscroll-y-contain px-4 py-5">
              <form
                className="mb-8"
                onSubmit={(e) => {
                  e.preventDefault();
                  const term = mobileQ.trim() || q.trim();
                  pushRecentSearch(term);
                  setRecent(readRecentSearches());
                  setOpen(false);
                  router.push(term ? `/shop?q=${encodeURIComponent(term)}` : "/shop");
                }}
              >
                <p className="text-[11px] font-semibold uppercase tracking-wider text-cyan-500/80">Search</p>
                <div className="relative mt-2">
                  <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-500" aria-hidden />
                  <Input
                    value={mobileQ}
                    onChange={(e) => setMobileQ(e.target.value)}
                    placeholder="Search hardware…"
                    className={inputDark}
                    name="q"
                    list="sf-recent-q-fleet"
                    autoComplete="off"
                  />
                </div>
                <Button type="submit" className="mt-3 w-full bg-cyan-500 font-semibold text-slate-950 hover:bg-cyan-400" size="sm">
                  Search
                </Button>
              </form>

              <div className="space-y-8">
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">Shop</p>
                  <nav className="mt-3 flex flex-col gap-1">
                    <Link
                      href="/shop"
                      onClick={() => setOpen(false)}
                      className={cn(
                        "rounded-xl px-3 py-3 text-sm font-medium transition hover:bg-slate-900",
                        pathname === "/shop" ? "bg-slate-900 text-white" : "text-slate-200"
                      )}
                    >
                      All products
                    </Link>
                  </nav>
                </div>
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">Categories</p>
                  <nav className="mt-3 flex flex-col gap-1">
                    {cats.map((c) => (
                      <Link
                        key={c.id}
                        href={`/shop/${c.slug}`}
                        onClick={() => setOpen(false)}
                        className="rounded-xl px-3 py-2.5 text-sm text-slate-300 transition hover:bg-slate-900 hover:text-white"
                      >
                        {c.name}
                      </Link>
                    ))}
                  </nav>
                </div>
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">Company</p>
                  <nav className="mt-3 flex flex-col gap-1">
                    <Link href="/about" onClick={() => setOpen(false)} className="rounded-xl px-3 py-2.5 text-sm text-slate-300 hover:bg-slate-900 hover:text-white">
                      About
                    </Link>
                    <Link href="/contact" onClick={() => setOpen(false)} className="rounded-xl px-3 py-2.5 text-sm text-slate-300 hover:bg-slate-900 hover:text-white">
                      Contact
                    </Link>
                    <Link href="/order/track" onClick={() => setOpen(false)} className="rounded-xl px-3 py-2.5 text-sm text-slate-300 hover:bg-slate-900 hover:text-white">
                      Track order
                    </Link>
                    <Link href="/shipping-policy" onClick={() => setOpen(false)} className="rounded-xl px-3 py-2.5 text-sm text-slate-300 hover:bg-slate-900 hover:text-white">
                      Shipping
                    </Link>
                    <Link href="/returns" onClick={() => setOpen(false)} className="rounded-xl px-3 py-2.5 text-sm text-slate-300 hover:bg-slate-900 hover:text-white">
                      Returns
                    </Link>
                  </nav>
                </div>

                <div className="border-t border-slate-800 pt-6">
                  <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">Account</p>
                  {account ? (
                    <nav className="mt-3 flex flex-col gap-1">
                      <p className="truncate px-3 py-1 text-xs text-slate-500">{account.email}</p>
                      <Link href="/account/orders" onClick={() => setOpen(false)} className="rounded-xl px-3 py-2.5 text-sm text-slate-200 hover:bg-slate-900">
                        Orders
                      </Link>
                      <Link href="/account/profile" onClick={() => setOpen(false)} className="rounded-xl px-3 py-2.5 text-sm text-slate-200 hover:bg-slate-900">
                        Profile
                      </Link>
                      <Link href="/account/addresses" onClick={() => setOpen(false)} className="rounded-xl px-3 py-2.5 text-sm text-slate-200 hover:bg-slate-900">
                        Saved addresses
                      </Link>
                      <button
                        type="button"
                        className="rounded-xl px-3 py-2.5 text-left text-sm text-slate-400 hover:bg-slate-900 hover:text-white disabled:opacity-50"
                        disabled={signingOut}
                        onClick={() => void handleSignOut().then(() => setOpen(false))}
                      >
                        {signingOut ? "Signing out…" : "Sign out"}
                      </button>
                    </nav>
                  ) : (
                    <nav className="mt-3 flex flex-col gap-2">
                      <Button variant="outline" className="w-full border-slate-600 text-slate-100 hover:bg-slate-900" asChild>
                        <Link href="/account/login" onClick={() => setOpen(false)}>
                          Sign in
                        </Link>
                      </Button>
                      <Button className="w-full bg-cyan-500 font-semibold text-slate-950 hover:bg-cyan-400" asChild>
                        <Link href="/account/register" onClick={() => setOpen(false)}>
                          Create account
                        </Link>
                      </Button>
                    </nav>
                  )}
                </div>
              </div>
            </div>
          </aside>
        </>
      ) : null}
    </header>
  );
}
