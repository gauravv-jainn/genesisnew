import type { CSSProperties } from "react";

import Link from "next/link";

import { Spectrum } from "@/components/genesis/atmosphere";
import { GenesisMark } from "@/components/genesis/genesis-mark";
import { NeuralOrb } from "@/components/genesis/neural-orb";
import { RevealGroup, RevealItem } from "@/components/genesis/reveal";
import { services } from "@/lib/home-content";

/**
 * Section 2 — the four divisions, set around the orb.
 *
 * THE COMPOSITION IS GENESIS'S OWN. The company's films put a single dotted
 * sphere in the middle of the frame with the wordmark across its core and the
 * four division names at the four corners around it, each in its own
 * warm-to-cool ramp. That picture is an argument: the heading says "four
 * divisions, one system", and a diagram of one body with four things in orbit
 * says it better than a list can.
 *
 * WHAT THIS REPLACED, TWICE OVER. First, five pinned paper cards dropped
 * across an arc under a raking spotlight — the exact "normal agency template"
 * the guidelines tell you to reject. Then a plain four-row list, built to the
 * deck's division pages, which was right about the typography and silent
 * about the relationship between the four.
 *
 * WHY THE NAMES LOSE THE PREFIX. On the deck's division pages each name is
 * set in full — Genesis.Influence — because it is alone on a black page and
 * nothing else identifies it. Here the wordmark is at the centre of the
 * picture, so the prefix is already said; repeating it four times around a
 * Genesis logo is a stutter. The short names are in the content file beside
 * the full ones rather than sliced off the end of a string.
 *
 * WHY THE COLUMNS RAG INWARD. The left pair is right-aligned and the right
 * pair left-aligned, so all four names run toward the sphere instead of
 * toward the page edges. It is the only thing holding the corners to the
 * middle once the type is this large.
 *
 * THE HOVER STATE IS A GLOW. It was a rule that grew out from under each
 * name; Genesis asked for the line gone and a shadow in its place. Each
 * vertical lights in its OWN colour rather than in the interface yellow, and
 * because the names are gradients clipped to their glyphs it has to be a
 * drop-shadow filter — a text-shadow paints behind transparent text and would
 * put a coloured slab where the halo should be.
 */

/**
 * Where each division sits, in order. Written as whole class strings because
 * Tailwind reads the source for literals; `lg:col-start-${n}` compiles to
 * nothing at all.
 */
const PLACEMENT = [
  "lg:col-start-1 lg:row-start-1 lg:items-end lg:text-right",
  "lg:col-start-1 lg:row-start-2 lg:items-end lg:text-right",
  "lg:col-start-3 lg:row-start-2 lg:items-start lg:text-left",
  "lg:col-start-3 lg:row-start-1 lg:items-start lg:text-left",
];

export function Services() {
  return (
    <section
      id="services"
      /*
        THE FIRST THING ON THE PAGE, so it carries hero spacing: enough top
        padding to clear the fixed nav pill, and a min-height that gives the
        orb a full screen to sit in rather than the 24 units of section
        padding it had when it was section two.
      */
      className="scene-dark scene-open grain relative isolate flex min-h-dvh flex-col justify-center overflow-hidden pb-16 pt-28 sm:pb-20 sm:pt-32"
    >
      {/*
        Transitions into and out of the dark chapter, for the LIGHT theme
        only. --chapter-blend is the PAGE's ground — white on light, nothing
        on dark — so on dark these evaluate to transparent and paint nothing,
        which is right: there is no join to hide, and a band of flat colour
        over the page's own light field would be the very cut this pass
        removed. 64px, which is the section's own minimum padding, so the
        fade never reaches anything that has to stay readable.
      */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 z-[3] h-16"
        style={{
          background:
            "linear-gradient(180deg, var(--chapter-blend) 0%, color-mix(in srgb, var(--chapter-blend) 40%, transparent) 55%, transparent 100%)",
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 z-[3] h-16"
        style={{
          background:
            "linear-gradient(0deg, var(--chapter-blend) 0%, color-mix(in srgb, var(--chapter-blend) 40%, transparent) 55%, transparent 100%)",
        }}
      />

      <Spectrum />

      <div className="relative z-[2] mx-auto w-full max-w-7xl px-6">
        {/*
          NO HEADER AT ALL. The label, the heading and the standfirst have all
          gone at Genesis's request: the hero is the orb and the four names,
          exactly as the reference film is. Removing the heading on its own
          left a label and a floating paragraph either side of empty space,
          which read as something that had failed to load.

          The h1 stays, screen-reader only. A page needs exactly one top-level
          heading, and deleting the visible one and leaving nothing would put
          the homepage back to having none — the bug fixed three commits ago.
        */}
        <h1 className="sr-only">
          Genesis Media — four divisions, one creative system
        </h1>

        {/*
          Three columns on desktop: names, orb, names. The orb is a real grid
          item spanning both rows rather than an absolutely-placed backdrop,
          which is what guarantees the type can never land on top of it at any
          width. Below lg the whole thing folds to one column with the orb
          first, because on a phone a sphere behind live text is a legibility
          problem dressed as atmosphere.
        */}
        {/*
          ONE LINE EACH, WHICH IS A MEASUREMENT NOT A PREFERENCE. At the old
          sizes the side columns were 272px and "Brand & Design" needed 406px
          at 56px type, so it broke over two lines; three of the four captions
          needed just over 300px and broke too. Three changes buy the width
          back: the container goes to max-w-7xl, the orb's own track narrows
          between lg and xl where the squeeze is worst, and the gaps come in.
          The side columns are 296px at lg and 360px from xl up, which is what
          the type below is sized against.
        */}
        <RevealGroup className="mt-14 grid items-center gap-y-12 sm:mt-12 lg:grid-cols-[1fr_minmax(0,20rem)_1fr] lg:grid-rows-2 lg:gap-x-8 lg:gap-y-12 xl:grid-cols-[1fr_minmax(0,26rem)_1fr] xl:gap-x-12">
          <RevealItem className="order-first lg:order-none lg:col-start-2 lg:row-span-2 lg:row-start-1">
            {/*
              The orb overruns its own column by 11% each side, into the grid
              gap — which is why that gap is 14. It buys the sphere the
              presence it has on the board, roughly a third of the frame,
              without taking width off the names.

              The track and the overrun both grew when the surface started
              displacing: the radius had to come down from 0.42 of the box to
              0.375 to leave room for a crest, so the box grew to keep the
              sphere the same size on the page.
            */}
            <div className="relative mx-auto w-[min(88vw,24rem)] lg:-mx-[11%] lg:w-[122%]">
              <NeuralOrb />

              {/*
                The wordmark at the core. aria-hidden because the header
                already carries the real one — a second "Genesis Media" in the
                accessibility tree is noise, and this one is a picture.
              */}
              <div
                aria-hidden
                className="absolute inset-0 flex items-center justify-center"
              >
                <GenesisMark className="h-[14px] w-[8.75rem] lg:h-[18px] lg:w-[11.25rem]" />
              </div>
            </div>
          </RevealItem>

          {services.items.map((service, index) => (
            <RevealItem
              key={service.title}
              className={`flex flex-col ${PLACEMENT[index] ?? ""}`}
            >
              {/*
                THE WHOLE VERTICAL IS THE TARGET, name and caption together —
                a two-line block where only the first line is clickable is a
                small target and an arbitrary one. `group` drives the hover
                from the wrapper so pointing anywhere in the block lights all
                of it.
              */}
              <Link
                href={service.href}
                className="group flex flex-col gap-2 rounded-sm outline-none transition-transform duration-300 ease-out focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-4 focus-visible:ring-offset-transparent motion-safe:hover:-translate-y-0.5"
                style={{ "--glow": service.glow } as CSSProperties}
              >
                <h3
                  /*
                    NOWRAP, and a size clamped to the column rather than to the
                    type scale. text-h1 is 56px, at which "Brand & Design"
                    measures 406px against a 296px column — so the scale was
                    the thing forcing the break. This tops out at 48px, where
                    it measures 348px, and scales down with the viewport
                    between lg and xl where the column is narrowest.

                    THE GLOW IS THE HOVER STATE. It used to be a rule that grew
                    out from under the name; Genesis asked for the line gone
                    and a shadow instead. drop-shadow rather than text-shadow
                    because the name is a gradient clipped to the glyphs, and
                    text-shadow paints behind transparent text — it would draw
                    a coloured slab, not a halo. The colour is the division's
                    own, so each vertical lights up as itself.
                  */
                  className="ramp-text whitespace-nowrap text-h3 font-normal leading-[1.05] tracking-tight transition-[filter] duration-300 ease-out group-hover:[filter:drop-shadow(0_0_10px_var(--glow))_drop-shadow(0_0_34px_var(--glow))] sm:text-h2 lg:text-[clamp(2rem,3.6vw,3rem)] motion-reduce:transition-none"
                  style={{ "--ramp": service.ramp } as CSSProperties}
                >
                  {service.short}
                </h3>

                <p className="whitespace-nowrap text-[0.8125rem] leading-relaxed text-ash transition-colors duration-300 group-hover:text-bone xl:text-small">
                  {service.caption}
                </p>
              </Link>
            </RevealItem>
          ))}
        </RevealGroup>
      </div>
    </section>
  );
}
