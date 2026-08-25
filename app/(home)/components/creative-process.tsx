import { Clapperboard, Compass, MessagesSquare, TrendingUp } from "lucide-react";

import { Reveal, RevealGroup, RevealItem } from "@/components/genesis/reveal";
import { SectionLabel } from "@/components/genesis/section-label";
import { creativeProcess } from "@/lib/home-content";
import { cn } from "@/lib/utils";

/**
 * Creative process — built to the reference on deck page 27.
 *
 * That reference is a Figma community design, not Genesis artwork, so what is
 * copied is its STAGING: cards scattered across an arc at strong angles,
 * overlapping, over a deep red ground, with display type behind them that the
 * cards partly cover. Its words and marks are not copied.
 *
 * WHAT THE PREVIOUS VERSION GOT WRONG. It was a tidy four-column grid of pale
 * pinned paper cards on a warm brand spotlight, tilted by ±2°. The reference
 * is none of those things: the ground is red, the cards are dark glass, and
 * the tilts run to ±9°, which is the difference between "a grid that slipped"
 * and "laid out by hand". It also printed its own label twice, once as the
 * eyebrow and again as the ghost word behind.
 *
 * The scatter is a LG-AND-UP treatment. Below that the cards stack into a
 * readable column with their tilts kept small — an overlapping arc at phone
 * width is illegible, not atmospheric.
 */

const STEP_ICONS = [MessagesSquare, Compass, Clapperboard, TrendingUp];

/**
 * Positions on the stage, as percentages of it.
 *
 * MEASURED OFF p27_1, and the first attempt got all three of these wrong. The
 * reference's five cards are PORTRAIT (~24% wide against 58% of canvas
 * height), they overlap each other by 30-40% of a card width, and they all
 * lean the SAME way at -10 to -14 degrees. The first pass produced four
 * landscape cards, evenly spaced, overlapping by 0-4%, tilted alternately —
 * which is a grid that slipped, exactly what it was rebuilt to stop being.
 *
 * Four cards rather than five, because four is what Genesis's process has.
 */
const SCATTER = [
  { left: "0%", top: "4%", rotate: -13 },
  { left: "20.4%", top: "26%", rotate: -11 },
  { left: "40.8%", top: "12%", rotate: -9 },
  { left: "61.2%", top: "32%", rotate: -12 },
];

/**
 * Card box as a share of the stage. 30% wide at a 20.4% step overlaps by 32%
 * of a card width and still reaches 91% across, which is the only combination
 * that satisfies both constraints with four cards instead of the reference's
 * five. 56% tall makes the box portrait, as the reference's are.
 */
const CARD_WIDTH = "30%";
const CARD_HEIGHT = "56%";

export function CreativeProcess() {
  return (
    <section
      id="process"
      className="grain relative isolate overflow-hidden py-24 sm:py-32"
      style={{ backgroundColor: "#120306" }}
    >
      {/*
        Transitions into and out of the dark chapter.

        This is the only pinned-dark section on an otherwise light page, and in
        the light theme it butted straight into cream on both sides: measured
        luminance steps of 0.675 -> 0.003 at the top edge and 0.002 -> 0.836 at
        the bottom, in the space of three pixels. That is the "rough page
        break" — a butt joint, not a transition.

        The bands blend to the ACTUAL adjacent grounds via the surface tokens,
        so they follow the theme: in dark mode both neighbours are near-black
        and these fade to nothing, which is why there is no theme check here.
      */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 z-[1] h-28"
        style={{
          background:
            "linear-gradient(180deg, color-mix(in srgb, var(--surface-base) 90%, transparent) 0%, color-mix(in srgb, var(--surface-base) 50%, transparent) 42%, transparent 100%)",
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 z-[1] h-28"
        style={{
          background:
            "linear-gradient(0deg, var(--surface-ink) 0%, color-mix(in srgb, var(--surface-ink) 55%, transparent) 42%, transparent 100%)",
        }}
      />

      {/* The red ground. The reference has no brand and no neutral in it. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(58% 62% at 22% 46%, #8c0f1c 0%, #5e0a14 30%, #37060d 56%, #1c0308 78%, #120306 100%), radial-gradient(46% 50% at 84% 28%, rgb(255 197 22 / 0.22) 0%, transparent 72%)",
        }}
      />

      <div className="relative z-[2] mx-auto w-full max-w-6xl px-6">
        <div className="flex flex-wrap items-end justify-between gap-x-12 gap-y-6">
          <Reveal className="max-w-xl">
            <SectionLabel dot tone="brand">
              {creativeProcess.label}
            </SectionLabel>
            <h2 className="mt-6 text-balance text-h2 font-semibold leading-[1.05] tracking-tight text-scene sm:text-h1">
              {creativeProcess.heading}{" "}
              <span className="font-serif font-normal italic text-brand-soft">
                {creativeProcess.headingAccent}
              </span>
            </h2>
          </Reveal>

          <Reveal delay={0.1} className="max-w-sm">
            <p className="text-small leading-relaxed text-scene-dim">{creativeProcess.body}</p>
          </Reveal>
        </div>

        {/*
          The stage. Fixed aspect on large screens so the scattered positions
          below are stable — percentage positions inside an auto-height box
          collapse, which is the bug that once left a whole wall at height 0.
        */}
        <div className="relative mt-16 lg:mt-24 lg:aspect-[848/560]">
          {/*
            Display type behind the cards, which cover most of it.

            THIS IS THE MOVE THAT MAKES p27_1 LOOK LIKE p27_1, and it was
            missing. The reference sets "Creative Flow" in pure white at about
            12:1 against its red ground, as the largest thing in the frame,
            with the cards crossing it — that occlusion is the entire reason
            the composition reads as layered. At white/[0.09] over this
            section's ground the glyphs landed at roughly 1.2:1, so nothing was
            occluded because nothing was visible.
          */}
          <p
            aria-hidden
            className="pointer-events-none absolute inset-x-0 -top-[6%] hidden select-none text-center font-semibold leading-[0.78] tracking-tighter text-white/70 lg:block"
            style={{ fontSize: "clamp(7rem, 16vw, 15rem)" }}
          >
            CREATIVE
            <br />
            PROCESS
          </p>

          {/* Below lg: a plain readable column. */}
          <RevealGroup className="grid gap-6 sm:grid-cols-2 lg:hidden">
            {creativeProcess.steps.map((step, index) => (
              <RevealItem key={step.title}>
                <StepCard step={step} index={index} />
              </RevealItem>
            ))}
          </RevealGroup>

          {/* lg and up: the scattered arc. */}
          <div className="hidden lg:block">
            {creativeProcess.steps.map((step, index) => {
              const place = SCATTER[index] ?? SCATTER[SCATTER.length - 1];
              return (
                // Positioning lives on a plain wrapper rather than on Reveal:
                // the reveal primitive animates transform, and an inline
                // position here would be fighting it.
                <div
                  key={step.title}
                  className="absolute"
                  style={{
                    left: place.left,
                    top: place.top,
                    width: CARD_WIDTH,
                    height: CARD_HEIGHT,
                    zIndex: 10 + index,
                  }}
                >
                  {/* h-full has to be carried through Reveal, or the card
                      sizes to its content and the sized wrapper does nothing. */}
                  <Reveal delay={0.08 * index} variant="card" className="h-full">
                    <StepCard step={step} index={index} rotate={place.rotate} />
                  </Reveal>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

function StepCard({
  step,
  index,
  rotate = 0,
}: {
  step: { title: string; caption: string };
  index: number;
  rotate?: number;
}) {
  const Icon = STEP_ICONS[index] ?? MessagesSquare;

  return (
    <article
      className={cn(
        "glass glass-lit flex h-full flex-col justify-between rounded-panel p-6 transition-transform duration-500 will-change-transform",
        // DARK slabs over a bright ground, which is what p27_1 actually shows:
        // its card fills sample at rgb(3,3,3), (15,6,4) and (80,32,2) against
        // a red peaking at (162,23,4). The previous fill added brand at 0.14
        // and white at 0.04 on top of .glass's own white, which netted a
        // LIGHTENING wash — pale pink rectangles pasted on dark maroon, and
        // backdrop-filter paid for on four elements for no visual return.
        "bg-[linear-gradient(158deg,rgb(0_0_0/0.5)_0%,rgb(24_5_9/0.68)_54%,rgb(0_0_0/0.78)_100%)]",
      )}
      style={{ transform: rotate ? `rotate(${rotate}deg)` : undefined }}
    >
      <span className="grid size-10 place-items-center rounded-full border border-white/20 text-scene/80">
        <Icon className="size-[18px]" aria-hidden />
      </span>

      <div>
        <h3 className="text-balance text-h3 font-semibold leading-tight tracking-tight text-scene">
          {step.title}
        </h3>
        <p className="mt-3 text-small leading-relaxed text-scene-dim">{step.caption}</p>
      </div>
    </article>
  );
}
