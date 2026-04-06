import { MarketingLayout } from "@/components/marketing-layout";

export const metadata = { title: "Shipping policy" };

export default function ShippingPolicyPage() {
  return (
    <MarketingLayout
      title="Shipping policy"
      subtitle="Hardware ships from our warehouse with carrier options shown at checkout."
    >
      <p>
        Rates combine dimensional weight, service level, and destination. Battery-powered devices ship according to carrier
        dangerous-goods rules where applicable — surcharges, if any, appear before you pay.
      </p>
      <h2>Bulk &amp; pallet</h2>
      <p>
        Large rollouts may ship LTL or on customer-provided accounts. Contact sales for pallet quotes and dock delivery
        requirements.
      </p>
      <h2>International</h2>
      <p>
        This demo storefront assumes US destinations. For cross-border projects, our team can quote duties-aware shipping
        separately.
      </p>
    </MarketingLayout>
  );
}
