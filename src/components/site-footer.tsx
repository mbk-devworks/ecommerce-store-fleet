import Link from "next/link";

const links = [
  { href: "/shop", label: "Shop" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
  { href: "/order/track", label: "Track order" },
  { href: "/shipping-policy", label: "Shipping" },
  { href: "/returns", label: "Returns" },
];

export function SiteFooter() {
  return (
    <footer className="mt-auto border-t border-slate-800/90 bg-slate-950 text-slate-300">
      <div className="mx-auto grid max-w-7xl gap-12 px-4 py-16 sm:px-6 md:grid-cols-3 lg:gap-16 lg:px-8">
        <div>
          <p className="font-display text-2xl font-semibold text-white">FleetTrack Pro</p>
          <p className="mt-4 max-w-sm text-sm leading-relaxed text-slate-400">
            Precision GPS hardware for fleets that cannot afford blind spots. Built for installers and operations teams.
          </p>
        </div>
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-500">Explore</p>
          <ul className="mt-5 space-y-3">
            {links.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="text-sm text-slate-300 transition hover:text-white">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-500">Deploy</p>
          <p className="mt-5 text-sm leading-relaxed text-slate-400">Bulk pricing and white-glove onboarding for 50+ vehicles.</p>
        </div>
      </div>
      <div className="border-t border-slate-800/90 bg-slate-900/40 py-6 text-center text-xs text-slate-500">
        © {new Date().getFullYear()} FleetTrack Pro. All rights reserved.
      </div>
    </footer>
  );
}
