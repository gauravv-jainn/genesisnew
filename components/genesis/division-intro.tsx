import type { CSSProperties } from "react";

import { Reveal } from "@/components/genesis/reveal";

/**
 * A division's own lockup, at the top of its page.
 *
 * Genesis's divisions each have a wordmark — GENESIS.Influence over
 * "Influencer Marketing | Celeb | UGC Activations" — and their pages opened
 * with a generic section heading instead, so a visitor arriving on one had no
 * signal they had reached that division rather than a page about it.
 *
 * Set rather than placed as an image, deliberately: the lockups are supplied
 * as raster files, and a page heading that is a PNG cannot be selected,
 * searched, translated, or read by a screen reader, and goes soft on a
 * retina display. The name is live text in the division's own ramp, which is
 * the same gradient the lockup uses.
 */
export function DivisionIntro({
  division,
  tagline,
  ramp,
  children,
}: {
  /** The part after the dot — "Influence", "Studios". */
  division: string;
  tagline: string;
  /** The division's gradient, from lib/home-content. */
  ramp: string;
  children?: React.ReactNode;
}) {
  return (
    <header className="mx-auto w-full max-w-6xl px-6">
      <Reveal>
        <h1 className="flex flex-wrap items-baseline gap-x-1 text-h2 font-normal leading-[1.05] tracking-tight sm:text-h1">
          <span className="text-bone">GENESIS</span>
          <span className="text-brand-ink">.</span>
          <span
            className="ramp-text"
            style={{ "--ramp": ramp } as CSSProperties}
          >
            {division}
          </span>
        </h1>
        <p className="mt-4 text-lead leading-relaxed text-ash">{tagline}</p>
      </Reveal>

      {children && (
        <Reveal delay={0.1} className="mt-8 max-w-2xl">
          {children}
        </Reveal>
      )}
    </header>
  );
}
