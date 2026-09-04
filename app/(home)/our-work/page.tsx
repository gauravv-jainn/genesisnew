import type { Metadata } from "next";

import { Reveal } from "@/components/genesis/reveal";
import { SectionLabel } from "@/components/genesis/section-label";
import { WorkGrid } from "@/components/genesis/work-grid";
import { ourWork } from "@/lib/page-content";
import { work } from "@/lib/work";

export const metadata: Metadata = {
  title: "Portfolio",
  description: ourWork.body,
};

/**
 * /our-work — the Portfolio: the complete library.
 *
 * WORK vs PORTFOLIO, which the brief is explicit about and the site was not:
 * Work is the selected section on the homepage, Portfolio is everything.
 * They now read the one catalogue in lib/work.ts, so a piece cannot appear in
 * one and be missing from the other, and every tile in both leads to the same
 * /work/<slug>.
 *
 * WHAT THIS REPLACED: a second, parallel implementation — its own grid, its
 * own list view, its own search, its own copy of the ten stills, and tiles
 * that opened nothing. It was the better-built of the two galleries and it
 * was the wrong shape: a library whose items have no URL cannot be shared,
 * indexed, or sent to a client, which is the whole reason this page exists.
 *
 * Search went with it. It filtered fourteen items behind a text box; the
 * filter row does that job at this size. It earns its place back when the
 * catalogue is long enough that scanning it is work.
 */
export default function OurWorkPage() {
  return (
    <main className="relative min-h-dvh pb-32 pt-32 sm:pt-40">
      <div className="mx-auto w-full max-w-6xl px-6">
        <Reveal>
          <SectionLabel dot tone="brand">
            {ourWork.label}
          </SectionLabel>
          <h1 className="mt-6 max-w-2xl text-balance text-h2 font-normal leading-[1.02] tracking-tight text-bone sm:text-h1">
            {ourWork.heading}{" "}
            <span className="font-serif font-normal italic text-brand-ink">
              {ourWork.headingAccent}
            </span>
          </h1>
          <p className="mt-6 max-w-xl text-body leading-relaxed text-ash">
            {ourWork.body}
          </p>
        </Reveal>

        <Reveal variant="scene" className="mt-14 sm:mt-16">
          <WorkGrid items={work} />
        </Reveal>
      </div>
    </main>
  );
}
