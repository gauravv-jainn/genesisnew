import type { Metadata } from "next";

import { LegalPage } from "@/components/genesis/legal-page";
import { privacy } from "@/lib/legal";

export const metadata: Metadata = {
  title: privacy.title,
  description: privacy.standfirst,
  // Interim copy. Indexed, because a policy nobody can find is not a policy,
  // but not something to rank for.
  robots: { index: true, follow: true },
};

export default function PrivacyPage() {
  return <LegalPage doc={privacy} />;
}
