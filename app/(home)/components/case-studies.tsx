import { PosterRail, type Poster } from "@/components/genesis/poster-card";
import { Reveal } from "@/components/genesis/reveal";
import { caseStudies, isPending } from "@/lib/home-content";
import { SectionShell } from "./section-shell";

/**
 * Section 4 — Case studies.
 *
 * THE ARCHETYPE WAS WRONG, not the styling. Spec page 13 is Case Studies, and
 * both design images on it (p13_1 = img-025, p13_2 = img-026) are movie-poster
 * stages: tall 2:3 posters on a dark ground inside a crimson bloom, the centre
 * card enlarged, the flankers dimmed and cropped by the frame. This section
 * was rendering a 2x2 grid of rounded glass rectangles — identical in
 * silhouette to the services grid, the process cards and the footer stat bar,
 * and the single most generic layout on the web. It never imported PosterCard,
 * which already exists in this repo and is built for exactly this.
 *
 * WHAT IS REAL HERE. The four clients and their disciplines come from the spec
 * and are confirmed. The headline and the result figure for each are not
 * written yet, so the poster leads with the CLIENT — the part that is true —
 * and the story takes over the moment it is written. Nothing is invented.
 */
export function CaseStudies() {
  const posters: Poster[] = caseStudies.items.map((study) => {
    const hasStory = !isPending(study.title);

    return {
      id: study.id,
      category: study.discipline,
      // With no written story the client IS the title; with one, it steps back
      // up to the eyebrow above it.
      client: hasStory ? study.client : undefined,
      title: hasStory ? study.title : study.client,
      meta: isPending(study.result) ? undefined : [study.result],
    };
  });

  return (
    <SectionShell
      id="case-studies"
      label={caseStudies.label}
      heading={caseStudies.heading}
      headingAccent={caseStudies.headingAccent}
      body={caseStudies.body}
      tone="crimson"
      origin="top-right"
      intensity={0.2}
    >
      <Reveal variant="scene">
        {/*
          The stage. img-025 sits its rail inside a broad crimson bloom rather
          than on flat black — that glow is what makes the posters read as lit
          objects on a stage instead of tiles on a page.
        */}
        <div className="relative">
          <div
            aria-hidden
            className="pointer-events-none absolute -inset-x-10 -inset-y-8"
            style={{
              background:
                "radial-gradient(closest-side, rgb(255 45 63 / 0.3) 0%, rgb(255 45 63 / 0.12) 42%, transparent 76%)",
            }}
          />
          <PosterRail posters={posters} className="relative -mx-6 px-6" />
        </div>
      </Reveal>
    </SectionShell>
  );
}
