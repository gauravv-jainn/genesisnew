import { GlassButton } from "@/components/genesis/glass-button";
import { Reveal } from "@/components/genesis/reveal";
import { SectionLabel } from "@/components/genesis/section-label";
import { WorkGrid } from "@/components/genesis/work-grid";
import { work } from "@/lib/work";

/**
 * How many pieces the homepage browse shows.
 *
 * The full catalogue ran to 2.76 screens here, against a brief that asks for
 * one section to a screen. Six is enough to read as "there is a lot of
 * this" while the grid still ends where the reader can see it ending; the
 * rest is one click away at /our-work, which is the page built for browsing
 * all of it.
 */
const ON_HOMEPAGE = 6;

/**
 * The full work library, on the homepage, after Studios.
 *
 * TWO PLACES, TWO JOBS. The rail near the top is a trailer — six pieces, one
 * horizontal move, seen before a visitor has read anything. This is the
 * browse: everything Genesis has made, filterable, straight after the
 * production section that explains how it is made. A visitor who has just
 * watched the reel wall is exactly the one who wants to see the rest.
 *
 * It is the same grid and the same catalogue as /our-work, so a piece cannot
 * appear in one and be missing from the other, and every tile leads to the
 * same /work/<slug>.
 */
export function WorkLibrary() {
  return (
    <section
      id="library"
      className="grain relative isolate overflow-hidden bg-void py-16 sm:py-20"
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

        <Reveal variant="scene" className="mt-10">
          <WorkGrid items={work.slice(0, ON_HOMEPAGE)} />
        </Reveal>
      </div>
    </section>
  );
}
