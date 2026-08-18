import { AnimatedTimeline } from "@/components/genesis/animated-timeline";
import { Reveal } from "@/components/genesis/reveal";
import { journey } from "@/lib/home-content";
import { SectionShell } from "./section-shell";

/**
 * Section 5 — Our Journey.
 *
 * Amber-lit, tying the timeline to the paper/light motif that runs through
 * Services, Case Studies and the Journal teaser.
 */
export function Journey() {
  return (
    <SectionShell
      id="journey"
      label={journey.label}
      heading={journey.heading}
      headingAccent={journey.headingAccent}
      body={journey.body}
      tone="amber"
      origin="top-left"
      intensity={0.18}
    >
      <Reveal>
        <AnimatedTimeline milestones={[...journey.milestones]} tone="amber" />
      </Reveal>
    </SectionShell>
  );
}
