import Link from "next/link";
import { MarketingLayout } from "@/components/marketing-layout";
import { Card, CardContent } from "@/components/ui/card";
import { Mail, Headphones } from "lucide-react";

export const metadata = { title: "Contact" };

export default function ContactPage() {
  return (
    <MarketingLayout
      title="Contact sales"
      subtitle="Deployment questions, bulk orders, and integration topics — we route you to the right person."
    >
      <div className="not-prose grid gap-4 sm:grid-cols-2">
        <Card className="border-slate-200">
          <CardContent className="flex gap-4 p-6">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-cyan-500/15 text-cyan-700">
              <Headphones className="h-5 w-5" aria-hidden />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Sales</p>
              <a href="mailto:sales@fleettrack.example" className="mt-1 block font-semibold text-slate-900 hover:text-cyan-700 hover:underline">
                sales@fleettrack.example
              </a>
              <p className="mt-2 text-sm text-slate-500">Rollouts &amp; pricing</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-slate-200">
          <CardContent className="flex gap-4 p-6">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-cyan-500/15 text-cyan-700">
              <Mail className="h-5 w-5" aria-hidden />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Support</p>
              <a href="mailto:support@fleettrack.example" className="mt-1 block font-semibold text-slate-900 hover:text-cyan-700 hover:underline">
                support@fleettrack.example
              </a>
              <p className="mt-2 text-sm text-slate-500">Orders &amp; RMA</p>
            </div>
          </CardContent>
        </Card>
      </div>
      <p className="mt-10 text-center text-sm text-slate-500">
        Ready to buy?{" "}
        <Link href="/shop" className="font-semibold text-cyan-700 underline-offset-4 hover:underline">
          Browse hardware
        </Link>
      </p>
    </MarketingLayout>
  );
}
