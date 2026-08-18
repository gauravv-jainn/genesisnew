import type { Metadata } from "next";

import { RouteStub } from "@/components/genesis/route-stub";

export const metadata: Metadata = { title: "Careers" };

export default function CareersPage() {
  return (
    <RouteStub
      label="Careers"
      title="Join the waitlist"
      description="We open roles in batches. Leave your details and we'll reach out when something matching your discipline opens up."
    />
  );
}
