import { ArrowDown } from "lucide-react";

import { DocumentWall } from "@/components/genesis/document-wall";
import { GlassButton } from "@/components/genesis/glass-button";
import { LitRoom } from "@/components/genesis/lit-room";
import { Reel } from "@/components/genesis/reel";
import { Reveal } from "@/components/genesis/reveal";
import { SectionLabel } from "@/components/genesis/section-label";
import { CornerNote } from "@/components/genesis/spotlight";
import { hero, heroReel } from "@/lib/home-content";

/**
 * Section 1 — Hero.
 *
 * Built to the landing reference on page 1 of the spec: a figure facing a
 * curved wall of lit documents in a dark room. The wall is the subject here,
 * not a texture — it is the only thing on the page carrying light, and the
 * headline is read against it.
 *
 * TWO THINGS AN EARLIER VERSION GOT WRONG:
 *
 * 1. The wall was masked and dimmed until it was a faint smudge. It now
 *    carries real luminance, with the room's own vignette doing the work of
 *    keeping it off the type instead of an opacity clamp.
 *
 * 2. The reel slot rendered a bordered empty frame in the hero's best real
 *    estate, which reads as a broken image rather than as a placeholder. The
 *    reel now appears ONLY when there is footage; until then the wall takes
 *    that space, which is what the reference shows anyway.
 */
export function Hero() {
  const hasReel = Boolean(heroReel.src);

  return (
    <section className="grain relative isolate min-h-dvh overflow-hidden bg-void">
      {/* The room the wall stands in — edgeless, so nothing reads as a line. */}
      <LitRoom lightX={62} />

      {/* The wall itself, only when it is not displaced by real footage. */}
      {!hasReel && (
        <div
          className={[
            // Sits in the right half only, so it never competes with the
            // headline for contrast, and fades out toward the type rather
            // than ending on a hard edge.
            "pointer-events-none absolute inset-y-0 right-0 hidden w-[52%] lg:block",
            "[mask-image:linear-gradient(90deg,transparent,black_26%,black_100%)]",
          ].join(" ")}
        >
          <DocumentWall tone="amber" />
        </div>
      )}

      {/*
        The vertical budget is tight: this headline is long real copy. Padding
        and type scale are tuned so the CTA stays visible at 1440x900, and the
        scroll cue is positioned absolutely so it costs the flow nothing.
      */}
      <div className="relative z-[2] mx-auto flex min-h-dvh w-full max-w-6xl flex-col justify-center px-6 pb-28 pt-28 sm:pt-32">
        <div className="grid items-center gap-14 lg:grid-cols-[1.1fr_0.9fr]">
          <div>
            <Reveal>
              <SectionLabel dot>{hero.eyebrow}</SectionLabel>
            </Reveal>

            <Reveal delay={0.05}>
              {/*
                The largest step is gated on viewport HEIGHT as well as width:
                this headline wraps to several lines, and a width-only rule
                pushed the CTA off-screen at 1440x900.
                Underscores become spaces in the emitted media query.
              */}
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

          {/* Right column: real footage when it exists, otherwise an annotation. */}
          <Reveal delay={0.25} direction="left" className="hidden lg:block">
            {hasReel ? (
              <Reel
                src={heroReel.src}
                poster={heroReel.poster}
                label={heroReel.label}
                aspect="4 / 5"
                className="ml-auto w-full max-w-sm"
              />
            ) : (
              <CornerNote index="01" className="ml-auto">
                Content, influencer activations and AI — produced in-house, from
                the first idea to the published post.
              </CornerNote>
            )}
          </Reveal>
        </div>
      </div>

      {/* Out of flow, so a long headline never pushes the CTA off-screen. */}
      <Reveal
        delay={0.4}
        className="absolute inset-x-0 bottom-8 z-[2] flex justify-center"
      >
        <a
          href="#services"
          className="inline-flex items-center gap-2 text-xs tracking-[0.2em] text-faint transition-colors hover:text-ash"
        >
          <ArrowDown className="size-3.5" aria-hidden />
          SCROLL
        </a>
      </Reveal>
    </section>
  );
}
