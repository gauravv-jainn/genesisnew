import { GlassButton } from "@/components/genesis/glass-button";
import { Reveal } from "@/components/genesis/reveal";
import { SectionLabel } from "@/components/genesis/section-label";
import { WorkGrid } from "@/components/genesis/work-grid";
import { work } from "@/lib/work";

/**
 * How many pieces the homepage browse shows.
 *
 * The full catalogue ran to 2.76 screens here, against a brief that asks for
 * one section to a screen. The rest is one click away at /our-work, which is
 * the page built for browsing all of it.
 *
 * EIGHT NOW THAT THE GRID IS FOUR COLUMNS WIDE. Six was two full rows of
 * three; in four columns it is one row and a gap-toothed second, which reads
 * as a grid that ran out of work rather than one that stops. Eight fills two
 * rows exactly, and at the smaller tile size those two rows are shorter than
 * the old two were.
 */
const ON_HOMEPAGE = 8;

/**
 * The full work library, on the homepage, after the four verticals.
 *
 * THE ONE BROWSE ON THE PAGE, after all four verticals. There used to be a
 * poster rail above it under "Selected work" doing the same job from the same
 * catalogue, four cards shorter — Genesis counted the work three times over
 * and this was the third. The rail is gone; Studios keeps its own reel wall,
 * which is that division showing its footage rather than a second catalogue,
 * and its button scrolls down here.
 *
 * It is the same grid and the same catalogue as /our-work, so a piece cannot
 * appear in one and be missing from the other, and every tile leads to the
 * same /work/<slug>.
 */
export function WorkLibrary() {
  return (
    <section
      id="library"
      className="relative isolate overflow-hidden py-12 sm:py-14 lg:py-16"
    >
      <div className="relative z-[2] mx-auto w-full max-w-6xl px-6">
        <div className="flex flex-wrap items-end justify-between gap-x-12 gap-y-4">
          <Reveal className="max-w-xl">
            <SectionLabel dot tone="brand">
              Everything we&rsquo;ve made
            </SectionLabel>
            <h2 className="mt-4 text-balance text-h2 font-normal leading-[1.05] tracking-tight text-bone sm:text-h1">
              The full{" "}
              <span className="font-serif font-normal italic text-brand-ink">
                library
              </span>
            </h2>
          </Reveal>

          <Reveal delay={0.1}>
            <GlassButton href="/our-work" variant="glass" arrow>
              Open the portfolio
            </GlassButton>
          </Reveal>
        </div>

        <Reveal variant="scene" className="mt-8">
          <WorkGrid items={work.slice(0, ON_HOMEPAGE)} />
        </Reveal>
      </div>
    </section>
  );
}
