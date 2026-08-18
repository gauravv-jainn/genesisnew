import type { Metadata } from "next";

import { RouteStub } from "@/components/genesis/route-stub";

export const metadata: Metadata = { title: "Journal" };

export default function BlogPage() {
  return (
    <RouteStub
      label="Journal"
      title="Notes on creators, content and technology"
      description="Long-form thinking from the Genesis team. Posts arrive as MDX files in the repo rather than a CMS, so writing and shipping stay in one place."
    />
  );
}
