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
 * pinned paper cards on a warm amber spotlight, tilted by ±2°. The reference
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
 * Positions on the stage, as percentages of it. Read off the reference's arc:
 * high at the outsides, dropping through the middle, angles growing toward
 * the edges. Four cards rather than the reference's five, because four is
 * what Genesis's process actually has.
 */
const SCATTER = [
  { left: "1%", top: "12%", rotate: -9 },
  { left: "25%", top: "44%", rotate: -5 },
  { left: "50%", top: "41%", rotate: 4 },
  { left: "74%", top: "9%", rotate: 8 },
];

export function CreativeProcess() {
  return (
    <section
      id="process"
      className="grain relative isolate overflow-hidden py-24 sm:py-32"
      style={{ backgroundColor: "#120306" }}
    >
      {/* The red ground. The reference has no amber and no neutral in it. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(58% 62% at 22% 46%, #8c0f1c 0%, #5e0a14 30%, #37060d 56%, #1c0308 78%, #120306 100%), radial-gradient(46% 50% at 84% 28%, rgb(255 45 63 / 0.22) 0%, transparent 72%)",
        }}
      />

      <div className="relative z-[2] mx-auto w-full max-w-6xl px-6">
        <div className="flex flex-wrap items-end justify-between gap-x-10 gap-y-6">
          <Reveal className="max-w-xl">
            <SectionLabel dot tone="crimson">
              {creativeProcess.label}
            </SectionLabel>
            <h2 className="mt-5 text-balance text-4xl font-semibold leading-[1.05] tracking-tight text-bone sm:text-5xl">
              {creativeProcess.heading}{" "}
              <span className="font-serif font-normal italic text-crimson-soft">
                {creativeProcess.headingAccent}
              </span>
            </h2>
          </Reveal>

          <Reveal delay={0.1} className="max-w-sm">
            <p className="text-sm leading-relaxed text-bone/60">{creativeProcess.body}</p>
          </Reveal>
        </div>

        {/*
          The stage. Fixed aspect on large screens so the scattered positions
          below are stable — percentage positions inside an auto-height box
          collapse, which is the bug that once left a whole wall at height 0.
        */}
        <div className="relative mt-16 lg:mt-20 lg:aspect-[848/430]">
          {/*
            Display type behind the cards, which cover most of it — the
            reference's signature move. Bright enough to read as a backdrop
            rather than as a watermark, and clipped by the stage.
          */}
          <p
            aria-hidden
            className="pointer-events-none absolute inset-x-0 top-[2%] hidden select-none text-center font-semibold leading-[0.8] tracking-tighter text-white/[0.09] lg:block"
            style={{ fontSize: "clamp(7rem, 17vw, 16rem)" }}
          >
            PROCESS
          </p>

          {/* Below lg: a plain readable column. */}
          <RevealGroup className="grid gap-5 sm:grid-cols-2 lg:hidden">
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
                  className="absolute w-[25%]"
                  style={{ left: place.left, top: place.top, zIndex: 10 + index }}
                >
                  <Reveal delay={0.08 * index}>
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
  step: { title: string; body: string };
  index: number;
  rotate?: number;
}) {
  const Icon = STEP_ICONS[index] ?? MessagesSquare;

  return (
    <article
      className={cn(
        "glass glass-lit group/card h-full rounded-[1.5rem] p-6 transition-transform duration-500 will-change-transform",
        // The cards sit over a red ground, so their fill carries a little of it
        // rather than reading as neutral glass pasted on top.
        "bg-[linear-gradient(158deg,rgb(255_45_63/0.14)_0%,rgb(255_255_255/0.04)_46%,rgb(0_0_0/0.18)_100%)]",
      )}
      style={{ transform: rotate ? `rotate(${rotate}deg)` : undefined }}
    >
      <span className="grid size-10 place-items-center rounded-full border border-white/20 text-bone/80">
        <Icon className="size-[18px]" aria-hidden />
      </span>

      <h3 className="mt-6 text-balance text-xl font-semibold leading-tight tracking-tight text-bone">
        {step.title}
      </h3>
      <p className="mt-2.5 text-[13px] leading-relaxed text-bone/55">{step.body}</p>
    </article>
  );
}
