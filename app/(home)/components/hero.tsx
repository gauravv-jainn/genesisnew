import { ArrowDown } from "lucide-react";

import { GlassButton } from "@/components/genesis/glass-button";
import { LandingScene } from "@/components/genesis/landing-scene";
import { Reel } from "@/components/genesis/reel";
import { Reveal } from "@/components/genesis/reveal";
import { SectionLabel } from "@/components/genesis/section-label";
import { hero, heroReel } from "@/lib/home-content";

/**
 * Section 1 — Hero.
 *
 * Built to the landing reference on page 1: a figure facing a curved wall of
 * lit documents, standing in shallow water in a room the wall itself lights.
 *
 * THIS IS A SCENE THE COPY SITS INSIDE, NOT AN ILLUSTRATION BESIDE IT. The
 * previous version put the wall in a 52% right-hand column and masked it back
 * until it was a smudge, which turned the reference's subject into wallpaper.
 * Measured against the reference it was a different photograph: 59% of the
 * frame in shadow against 19%, mean luminance 52 against 90.
 *
 * The copy therefore sits low and left, where the scene is darkest, over a
 * scrim — rather than in a column that pushes the scene aside.
 *
 * Note the reel: an empty bordered frame in the hero's best real estate reads
 * as a broken image rather than as a placeholder, so the reel appears ONLY
 * when there is footage. Until then the scene has that space, which is what
 * the reference shows anyway.
 */
export function Hero() {
  const hasReel = Boolean(heroReel.src);

  return (
    <section className="grain relative isolate flex min-h-dvh flex-col justify-end overflow-hidden">
      <LandingScene />

      {/*
        Legibility scrim. The reference is dark down its left edge and bright
        through the centre, so this both matches it and buys the contrast the
        headline needs.

        Measured, not guessed: with the wall corrected to its reference
        luminance the headline's worst line fell to 2.7:1 against white, under
        the 3.0:1 WCAG AA floor for large text. The ramp is carried further
        across the frame and is fully clear by 70%, so the scene's right half —
        the wall, the figure, the water — is untouched.
      */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-[1]"
        style={{
          // Masked so it only covers the band the copy occupies. A scrim run
          // full-height darkened the left half of the WALL as well, and since
          // it is expressed in percentages it did so at every viewport width —
          // which is why the wall measured 68% of the frame at 1024, 1440 and
          // 2560 alike, against the reference's 89%. The wall's own band is
          // now untouched and the headline still has its ground.
          maskImage:
            "linear-gradient(180deg, transparent 0%, rgb(0 0 0 / 0.35) 26%, #000 38%, #000 100%)",
          WebkitMaskImage:
            "linear-gradient(180deg, transparent 0%, rgb(0 0 0 / 0.35) 26%, #000 38%, #000 100%)",
          background:
            "linear-gradient(94deg, rgb(44 14 3 / 0.86) 0%, rgb(50 17 4 / 0.72) 24%, rgb(56 20 5 / 0.48) 42%, rgb(60 22 6 / 0.2) 56%, transparent 72%)",
        }}
      />

      <div className="relative z-[2] mx-auto w-full max-w-7xl px-6 pb-24 pt-32 sm:pb-28">
        <div className="grid items-end gap-12 lg:grid-cols-[1.15fr_0.85fr]">
          <div>
            <Reveal>
              <SectionLabel dot>{hero.eyebrow}</SectionLabel>
            </Reveal>

            <Reveal delay={0.05}>
              {/*
                Gated on viewport HEIGHT as well as width: this headline wraps
                to several lines and a width-only rule pushed the CTA
                off-screen at 1440x900. Underscores become spaces in the
                emitted media query.
              */}
              <h1 className="mt-6 max-w-3xl text-balance text-h2 font-semibold leading-[1.02] tracking-tight text-bone drop-shadow-[0_2px_24px_rgb(12_4_1/0.9)] sm:text-h1 lg:text-h1 [@media(min-width:1280px)_and_(min-height:960px)]:text-display">
                {hero.headlineLead}{" "}
                <span className="font-serif font-normal italic text-amber-light">
                  {hero.headlineAccent}
                </span>
              </h1>
            </Reveal>

            <Reveal delay={0.12}>
              <p className="mt-6 max-w-xl text-pretty text-body leading-relaxed text-bone/75 sm:text-h3">
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
                <GlassButton href={hero.secondaryCta.href} variant="glass" size="lg">
                  {hero.secondaryCta.label}
                </GlassButton>
              </div>
            </Reveal>
          </div>

          {/* Real footage when it exists; otherwise the scene keeps the space. */}
          {hasReel && (
            <Reveal delay={0.25} direction="left" className="hidden lg:block">
              <Reel
                src={heroReel.src}
                poster={heroReel.poster}
                label={heroReel.label}
                aspect="4 / 5"
                className="ml-auto w-full max-w-[17rem]"
              />
            </Reveal>
          )}
        </div>
      </div>

      {/* Out of flow, so a long headline never pushes the CTA off-screen. */}
      <Reveal
        delay={0.4}
        className="absolute inset-x-0 bottom-8 z-[2] flex justify-center"
      >
        <a
          href="#services"
          className="inline-flex items-center gap-2 text-small tracking-[0.2em] text-bone/50 transition-colors hover:text-bone"
        >
          <ArrowDown className="size-3.5" aria-hidden />
          SCROLL
        </a>
      </Reveal>
    </section>
  );
}
