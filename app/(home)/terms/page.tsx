import type { Metadata } from "next";

import { LegalPage } from "@/components/genesis/legal-page";
import { terms } from "@/lib/legal";

export const metadata: Metadata = {
  title: terms.title,
  description: terms.standfirst,
  robots: { index: true, follow: true },
};

export default function TermsPage() {
  return <LegalPage doc={terms} />;
}
