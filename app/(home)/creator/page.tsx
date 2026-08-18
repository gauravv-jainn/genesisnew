import type { Metadata } from "next";

import { RouteStub } from "@/components/genesis/route-stub";

export const metadata: Metadata = { title: "For Creators" };

export default function CreatorPage() {
  return (
    <RouteStub
      label="I'm a creator"
      title="Work with Genesis"
      description="How creators join the network, what campaigns look like from the inside, and how briefs, delivery and payment actually run."
    />
  );
}
