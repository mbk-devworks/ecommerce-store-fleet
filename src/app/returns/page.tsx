import { MarketingLayout } from "@/components/marketing-layout";

export const metadata = { title: "Returns" };

export default function ReturnsPage() {
  return (
    <MarketingLayout
      title="Returns &amp; RMA"
      subtitle="Unopened hardware in sellable condition may be eligible for return within 30 days."
    >
      <p>
        GPS modules, cameras, and accessories must be unused, with factory seals intact, to qualify for a standard return.
        Activated SIMs or registered devices may be subject to carrier-specific policies.
      </p>
      <h2>Defective units</h2>
      <p>
        If a device fails under normal use during the warranty window, open an RMA with support@fleettrack.example. Include
        serial numbers and a short description of the failure mode.
      </p>
      <h2>Restocking</h2>
      <p>
        Open-box and non-defective returns may incur a restocking fee. Our team confirms fees before issuing a return
        authorization.
      </p>
    </MarketingLayout>
  );
}
