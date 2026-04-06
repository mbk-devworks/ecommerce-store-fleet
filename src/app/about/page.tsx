import { MarketingLayout } from "@/components/marketing-layout";

export const metadata = { title: "About" };

export default function AboutPage() {
  return (
    <MarketingLayout
      title="About FleetTrack Pro"
      subtitle="Precision GPS and dash-camera hardware for fleets that run 24/7 — from local service vans to national logistics."
    >
      <p>
        FleetTrack Pro focuses on devices installers can deploy quickly and operations teams can trust. We emphasize
        real-world RF performance, power behavior in parked vehicles, and straightforward cabling — not brochure specs alone.
      </p>
      <h2>Who we serve</h2>
      <p>
        Contractors, fleet managers, and IT partners use our catalog for rollouts where downtime is expensive. The same
        commerce stack powers our sister lighting demo store — here you will find trackers, cameras, and accessories tuned
        for field use.
      </p>
      <h2>Enterprise</h2>
      <p>
        For fifty vehicles or more, talk to sales about staging, SIM logistics, and documentation packages for your
        compliance workflow.
      </p>
    </MarketingLayout>
  );
}
