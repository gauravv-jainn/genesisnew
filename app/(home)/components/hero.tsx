import { ArrowDown } from "lucide-react";

import { Atmosphere } from "@/components/genesis/atmosphere";
import { GlassButton } from "@/components/genesis/glass-button";
import { PaperCard } from "@/components/genesis/paper-card";
import { Reveal } from "@/components/genesis/reveal";
import { SectionLabel } from "@/components/genesis/section-label";
import { hero } from "@/lib/home-content";

/**
 * Section 1 — Hero.
 *
 * The dramatic single light source with paper caught in it, stated up front:
 * crimson aurora from top-right, floating sheets on the right, and the
 * headline carrying one serif-italic accent word (img-010).
 */
export function Hero() {
  return (
    <Atmosphere
      tone="crimson"
      origin="top-right"
      intensity={0.3}
      className="relative min-h-dvh"
    >
      {/*
        The vertical budget is tight: this headline is long real copy, and at
        1440x900 an earlier pass pushed the primary CTA below the fold. Padding
        and type scale are tuned so the CTA stays visible on a laptop, and the
        scroll cue is positioned absolutely so it costs the flow nothing.
      */}
      <div className="mx-auto flex min-h-dvh w-full max-w-6xl flex-col justify-center px-6 pb-28 pt-28 sm:pt-32">
        <div className="grid items-center gap-16 lg:grid-cols-[1.15fr_0.85fr]">
          <div>
            <Reveal>
              <SectionLabel dot>{hero.eyebrow}</SectionLabel>
            </Reveal>

            <Reveal delay={0.05}>
              {/*
                The largest step is gated on viewport HEIGHT as well as width.
                This headline is long real copy that wraps to six lines, so at
                1440x900 a width-only `xl:text-7xl` overflowed the hero and
                pushed the CTA and scroll cue off-screen.
              */}
              {/* Underscores become spaces in the emitted media query. */}
              <h1 className="mt-6 text-balance text-[2.5rem] font-semibold leading-[1.03] tracking-tight text-bone sm:text-5xl lg:text-6xl [@media(min-width:1280px)_and_(min-height:960px)]:text-7xl">
                {hero.headlineLead}{" "}
                <span className="font-serif font-normal italic text-amber">
                  {hero.headlineAccent}
                </span>
              </h1>
            </Reveal>

            <Reveal delay={0.12}>
              <p className="mt-6 max-w-xl text-pretty text-base leading-relaxed text-ash sm:text-lg">
                {hero.body}
              </p>
            </Reveal>

            <Reveal delay={0.18}>
              <div className="mt-8 flex flex-wrap items-center gap-4">
                <GlassButton
                  href={hero.primaryCta.href}
                  variant="crimson"
                  size="lg"
                  arrow
                  magnetic
                >
                  {hero.primaryCta.label}
                </GlassButton>
                <GlassButton
                  href={hero.secondaryCta.href}
                  variant="glass"
                  size="lg"
                >
                  {hero.secondaryCta.label}
                </GlassButton>
              </div>
            </Reveal>
          </div>

          {/* The paper motif, introduced here and carried through the page. */}
          <Reveal delay={0.25} direction="left" className="hidden lg:block">
            <div className="relative h-[26rem]">
              <PaperCard
                rotate={-4}
                tone="amber"
                className="absolute left-0 top-4 w-60"
              >
                <p className="micro-label mb-2">Campaign</p>
                <p className="text-sm leading-relaxed text-ash">
                  Creator matching, brief to delivery.
                </p>
              </PaperCard>

              <PaperCard
                rotate={3.5}
                tone="crimson"
                className="absolute right-2 top-28 w-56"
              >
                <p className="micro-label mb-2">Content</p>
                <p className="text-sm leading-relaxed text-ash">
                  Films, reels and UGC at channel cadence.
                </p>
              </PaperCard>

              <PaperCard
                rotate={-1.5}
                tone="neutral"
                className="absolute bottom-2 left-14 w-52"
              >
                <p className="micro-label mb-2">Technology</p>
                <p className="text-sm leading-relaxed text-ash">
                  AI-assisted production and measurement.
                </p>
              </PaperCard>
            </div>
          </Reveal>
        </div>

      </div>

      {/* Out of flow, so a long headline never pushes the CTA off-screen. */}
      <Reveal
        delay={0.4}
        className="absolute inset-x-0 bottom-8 flex justify-center"
      >
        <a
          href="#services"
          className="inline-flex items-center gap-2 text-xs tracking-[0.2em] text-faint transition-colors hover:text-ash"
        >
          <ArrowDown className="size-3.5" aria-hidden />
          SCROLL
        </a>
      </Reveal>
    </Atmosphere>
  );
}
