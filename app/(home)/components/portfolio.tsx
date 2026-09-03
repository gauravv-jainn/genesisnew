import { GlassButton } from "@/components/genesis/glass-button";
import { Reveal } from "@/components/genesis/reveal";
import { WorkGrid } from "@/components/genesis/work-grid";
import { portfolio } from "@/lib/home-content";
import { featuredWork } from "@/lib/work";
import { SectionShell } from "./section-shell";

/**
 * Section 02 — Selected Work.
 *
 * The second thing on the page and, per the brief, one of the strongest: a
 * visitor deciding whether to hire a creative company is looking for the
 * work, and everything else on the page is a caption on it.
 *
 * WHAT THIS REPLACED. A rail of four poster cards carrying nothing but a
 * client name, a title and a category — no artwork, no link, no way in. The
 * site had ten real client stills sitting in /public and a separate library
 * page that used them, and the homepage showed none of it.
 *
 * FEATURED, NOT EVERYTHING. This is the selected slice; /our-work is the full
 * library. Same catalogue, same tiles, same project URLs — the difference is
 * only how much of it you are looking at.
 */
export function Portfolio() {
  return (
    <SectionShell
      id="work"
      label={portfolio.label}
      heading={portfolio.heading}
      headingAccent={portfolio.headingAccent}
      body={portfolio.body}
      align="split"
      tone="brand"
      origin="top"
      intensity={0.18}
    >
      <Reveal variant="scene" className="mt-4">
        <WorkGrid items={featuredWork} />
      </Reveal>

      <Reveal delay={0.1} className="mt-10">
        <GlassButton href="/our-work" variant="glass" arrow>
          View all work
        </GlassButton>
      </Reveal>
    </SectionShell>
  );
}
