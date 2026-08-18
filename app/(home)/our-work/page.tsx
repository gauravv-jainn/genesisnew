import type { Metadata } from "next";

import { RouteStub } from "@/components/genesis/route-stub";

export const metadata: Metadata = { title: "Our Work" };

export default function OurWorkPage() {
  return (
    <RouteStub
      label="Our work"
      title="The content library"
      description="Every reel, film, ad and brand story in one browsable catalogue — filterable by format, client and platform."
    />
  );
}
