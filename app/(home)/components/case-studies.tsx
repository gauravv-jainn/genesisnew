import { PosterRail, type Poster } from "@/components/genesis/poster-card";
import { Reveal } from "@/components/genesis/reveal";
import { GlassButton } from "@/components/genesis/glass-button";
import { caseStudiesPage, caseStudyList, isPublished } from "@/lib/case-studies";
import { SectionShell } from "./section-shell";

/**
 * Section 4 — Case studies.
 *
 * THE ARCHETYPE WAS WRONG, not the styling. Spec page 13 is Case Studies, and
 * both design images on it (p13_1 = img-025, p13_2 = img-026) are movie-poster
 * stages: tall 2:3 posters on a dark ground inside a brand bloom, the centre
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
  /*
    Reads the case-study catalogue rather than its own copy of the list. The
    homepage rail and /case-studies were describing the same four clients from
    two places, which is how a site ends up with a study that exists in one
    and not the other.
  */
  const posters: Poster[] = caseStudyList.map((study) => {
    const published = isPublished(study);

    return {
      id: study.slug,
      category: study.discipline,
      // With no written study the client IS the title; with one, it steps
      // back up to the eyebrow above it.
      client: published ? study.client : undefined,
      title: published ? (study.headline ?? study.client) : study.client,
      meta: published && study.results?.[0] ? [study.results[0].value] : undefined,
    };
  });

  return (
    <SectionShell
      id="case-studies"
      label={caseStudiesPage.label}
      heading={caseStudiesPage.heading}
      headingAccent={caseStudiesPage.headingAccent}
      body={caseStudiesPage.body}
      align="split"
      tone="brand"
      origin="top-right"
      intensity={0.2}
    >
      <Reveal variant="scene">
        {/*
          The stage. img-025 sits its rail inside a broad brand bloom rather
          than on flat black — that glow is what makes the posters read as lit
          objects on a stage instead of tiles on a page.
        */}
        <div className="relative">
          <div
            aria-hidden
            className="pointer-events-none absolute -inset-x-10 -inset-y-8"
            style={{
              background:
                "radial-gradient(closest-side, rgb(255 212 0 / 0.3) 0%, rgb(255 212 0 / 0.12) 42%, transparent 76%)",
            }}
          />
          <PosterRail posters={posters} className="relative -mx-6 px-6" />
        </div>
      </Reveal>
      {/*
        The section is a trailer; the page is the thing. Without this the rail
        was a dead end — four posters and no way to read any of them.
      */}
      <Reveal delay={0.1} className="mt-10">
        <GlassButton href="/case-studies" variant="glass" arrow>
          Read the case studies
        </GlassButton>
      </Reveal>
    </SectionShell>
  );
}
