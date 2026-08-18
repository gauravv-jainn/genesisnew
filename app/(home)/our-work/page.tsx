import type { Metadata } from "next";

import { GlassButton } from "@/components/genesis/glass-button";
import { Reveal } from "@/components/genesis/reveal";
import { ourWork } from "@/lib/page-content";
import { SectionShell } from "../components/section-shell";
import { ContentLibrary } from "./content-library";

export const metadata: Metadata = {
  title: "Our Work",
  description: ourWork.body,
};

/**
 * /our-work — the content library the spec calls "Genesis' NETFLIX".
 */
export default function OurWorkPage() {
  return (
    <main className="pt-24">
      <SectionShell
        label={ourWork.label}
        heading={ourWork.heading}
        headingAccent={ourWork.headingAccent}
        body={ourWork.body}
        tone="crimson"
        origin="top"
        intensity={0.24}
      >
        <ContentLibrary />

        <Reveal delay={0.1} className="mt-16 flex justify-center">
          <GlassButton href="/#contact" variant="crimson" size="lg" arrow magnetic>
            Start a project
          </GlassButton>
        </Reveal>
      </SectionShell>
    </main>
  );
}
