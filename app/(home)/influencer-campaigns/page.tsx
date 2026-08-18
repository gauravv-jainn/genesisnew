import type { Metadata } from "next";

import { RouteStub } from "@/components/genesis/route-stub";

export const metadata: Metadata = { title: "Influencer Campaigns" };

export default function InfluencerCampaignsPage() {
  return (
    <RouteStub
      label="Influencer campaigns"
      title="From discovery to delivery"
      description="A deep dive into how campaigns are scoped, how creators are matched, and how results are measured across every platform."
    />
  );
}
