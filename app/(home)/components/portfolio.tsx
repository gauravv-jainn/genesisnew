import { GlassButton } from "@/components/genesis/glass-button";
import { PosterRail, type Poster } from "@/components/genesis/poster-card";
import { Reveal } from "@/components/genesis/reveal";
import { portfolio } from "@/lib/home-content";
import { featuredWork, hasBakedChrome } from "@/lib/work";
import { SectionShell } from "./section-shell";

/**
 * Section 02 — Selected Work.
 *
 * BACK TO THE RAIL, at Genesis's request. This was a poster rail, became a
 * filtered masonry grid, and is a rail again — the grid belonged on the
 * portfolio, where browsing everything is the job. On the homepage the job is
 * a trailer: a handful of the strongest pieces, one horizontal move, and a
 * way through to the rest.
 *
 * WHAT IT KEEPS FROM THE GRID, because those parts were not the problem: the
 * posters read the one work catalogue, so the homepage and the portfolio can
 * no longer show different work; they carry the real client stills instead of
 * generated gradients; and every poster is a link to /work/<slug> rather than
 * a picture of a project you cannot open.
 */
export function Portfolio() {
  const posters: Poster[] = featuredWork.map((item) => ({
    id: item.slug,
    client: item.client,
    title: item.title,
    category: item.format,
    image: item.art,
    hasOwnChrome: hasBakedChrome(item),
    href: `/work/${item.slug}`,
  }));

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
      contentClassName="-mr-6 sm:-mr-10"
    >
      <Reveal variant="scene">
        <PosterRail posters={posters} />
      </Reveal>

      <Reveal delay={0.1} className="mr-6 mt-8 sm:mr-12">
        <GlassButton href="/our-work" variant="glass" arrow>
          View all work
        </GlassButton>
      </Reveal>
    </SectionShell>
  );
}
