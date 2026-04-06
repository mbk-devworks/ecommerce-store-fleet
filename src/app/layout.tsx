import type { Metadata } from "next";
import { DM_Sans, Space_Grotesk } from "next/font/google";
import "./globals.css";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { StoreProviders } from "@/components/store-providers";

const dm = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const display = Space_Grotesk({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
});

export const metadata: Metadata = {
  title: {
    default: "FleetTrack Pro — GPS for modern fleets",
    template: "%s | FleetTrack Pro",
  },
  description: "4G GPS trackers, dash cameras, and fleet accessories with enterprise-grade reliability.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className={`${dm.variable} ${display.variable} min-h-screen antialiased`}>
        <StoreProviders>
          <a
            href="#main-content"
            className="sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[200] focus:inline-block focus:h-auto focus:w-auto focus:rounded-lg focus:bg-cyan-500 focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-slate-950 focus:shadow-lg"
          >
            Skip to main content
          </a>
          <SiteHeader />
          <main id="main-content" tabIndex={-1} className="min-h-[60vh] antialiased outline-none">
            {children}
          </main>
          <SiteFooter />
        </StoreProviders>
      </body>
    </html>
  );
}
