import { GlassButton } from "@/components/genesis/glass-button";
import { PosterRail } from "@/components/genesis/poster-card";
import { Reveal } from "@/components/genesis/reveal";
import { portfolio } from "@/lib/home-content";
import { SectionShell } from "./section-shell";

/**
 * Section 3 — Portfolio.
 *
 * The horizontal poster rail. Bleeds past the container on the right so the
 * row reads as continuing off-screen rather than ending at the margin.
 */
export function Portfolio() {
  return (
    <SectionShell
      id="portfolio"
      label={portfolio.label}
      heading={portfolio.heading}
      headingAccent={portfolio.headingAccent}
      body={portfolio.body}
      tone="crimson"
      origin="top"
      intensity={0.18}
      contentClassName="-mr-6 sm:-mr-10"
    >
      <Reveal>
        <PosterRail posters={[...portfolio.posters]} />
      </Reveal>

      <Reveal delay={0.1} className="mr-6 mt-10 sm:mr-10">
        <GlassButton href="/our-work" variant="glass" arrow>
          Browse the full library
        </GlassButton>
      </Reveal>
    </SectionShell>
  );
}
