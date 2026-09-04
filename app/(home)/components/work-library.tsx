import { GlassButton } from "@/components/genesis/glass-button";
import { Reveal } from "@/components/genesis/reveal";
import { SectionLabel } from "@/components/genesis/section-label";
import { WorkGrid } from "@/components/genesis/work-grid";
import { work } from "@/lib/work";

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
          <WorkGrid items={work} />
        </Reveal>
      </div>
    </section>
  );
}
