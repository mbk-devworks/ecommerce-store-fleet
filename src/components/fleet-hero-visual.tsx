/** Stylized GPS / live-map hero — no external images (avoids optimizer/CDN issues). */
export function FleetHeroVisual() {
  return (
    <div className="relative h-full min-h-[280px] w-full bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900" aria-hidden>
      <svg viewBox="0 0 400 500" className="absolute inset-0 h-full w-full" preserveAspectRatio="xMidYMid slice">
        <defs>
          <linearGradient id="fleet-hero-grid" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="rgba(34,211,238,0.07)" />
            <stop offset="100%" stopColor="rgba(34,211,238,0.02)" />
          </linearGradient>
          <filter id="fleet-hero-glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="4" result="b" />
            <feMerge>
              <feMergeNode in="b" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        <rect width="400" height="500" fill="url(#fleet-hero-grid)" />
        {[0, 1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
          <line
            key={`v-${i}`}
            x1={40 + i * 44}
            y1="0"
            x2={40 + i * 44}
            y2="500"
            stroke="rgba(34,211,238,0.08)"
            strokeWidth="1"
          />
        ))}
        {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((i) => (
          <line
            key={`h-${i}`}
            x1="0"
            y1={36 + i * 52}
            x2="400"
            y2={36 + i * 52}
            stroke="rgba(34,211,238,0.06)"
            strokeWidth="1"
          />
        ))}
        <path
          d="M 60 380 Q 120 320 180 280 T 300 140 L 340 100"
          fill="none"
          stroke="rgba(34,211,238,0.45)"
          strokeWidth="3"
          strokeLinecap="round"
          strokeDasharray="8 10"
          filter="url(#fleet-hero-glow)"
        />
        <circle cx="340" cy="100" r="10" fill="rgba(34,211,238,0.9)" />
        <circle cx="340" cy="100" r="24" fill="none" stroke="rgba(34,211,238,0.4)" strokeWidth="2" opacity="0.75" />
        <circle cx="340" cy="100" r="36" fill="none" stroke="rgba(34,211,238,0.2)" strokeWidth="1.5" opacity="0.5" />
        <g transform="translate(175, 300) rotate(-12)">
          <rect x="-42" y="-22" width="84" height="44" rx="10" fill="rgba(15,23,42,0.95)" stroke="rgba(34,211,238,0.35)" strokeWidth="2" />
          <rect x="-34" y="-14" width="68" height="28" rx="4" fill="rgba(8,47,73,0.9)" />
          <path d="M -20 0 L 0 -8 L 20 0 L 0 8 Z" fill="rgba(34,211,238,0.85)" />
          <circle cx="24" cy="-12" r="3" fill="#22d3ee" />
        </g>
        <g transform="translate(255, 355)">
          <rect x="-28" y="-48" width="56" height="96" rx="12" fill="rgba(15,23,42,0.98)" stroke="rgba(148,163,184,0.4)" strokeWidth="2" />
          <rect x="-22" y="-40" width="44" height="72" rx="6" fill="rgba(30,41,59,0.95)" />
          <circle cx="0" cy="32" r="5" fill="rgba(34,211,238,0.5)" />
          <path d="M -14 -28 L 14 -28 L 10 -8 L -10 -8 Z" fill="rgba(34,211,238,0.25)" />
          <circle cx="0" cy="-18" r="4" fill="#22d3ee" />
        </g>
        <g transform="translate(95, 200) rotate(8)">
          <rect x="-52" y="-20" width="104" height="40" rx="8" fill="rgba(30,41,59,0.95)" stroke="rgba(100,116,139,0.5)" strokeWidth="1.5" />
          <rect x="-46" y="-12" width="72" height="24" rx="4" fill="rgba(15,23,42,0.9)" />
          <circle cx="38" cy="-4" r="5" fill="#64748b" />
          <circle cx="38" cy="-4" r="2" fill="#22d3ee" />
        </g>
      </svg>
      <div className="pointer-events-none absolute bottom-4 left-4 right-4 flex items-center justify-between text-[10px] font-semibold uppercase tracking-widest text-cyan-400/70">
        <span>Live GPS</span>
        <span className="tabular-nums text-emerald-400/90">● Tracking on</span>
      </div>
    </div>
  );
}
