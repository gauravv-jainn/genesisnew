import type { CSSProperties } from "react";

import Link from "next/link";

import { Spectrum } from "@/components/genesis/atmosphere";
import { GenesisMark } from "@/components/genesis/genesis-mark";
import { NeuralOrb } from "@/components/genesis/neural-orb";
import { Reveal, RevealGroup, RevealItem } from "@/components/genesis/reveal";
import { SectionLabel } from "@/components/genesis/section-label";
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
 * NO HOVER STATE. The previous list lit each row with a fill cut at the
 * mark's own diagonal. These are not links — no division has a page yet — and
 * a hover flourish on text that cannot be clicked promises something that
 * does not happen. The device comes back when the destinations do.
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

/**
 * Which edge the hover rule grows from — toward the sphere, matching the way
 * each column rags. Kept beside PLACEMENT because it is the same decision,
 * and written as whole class strings for the same reason: Tailwind reads the
 * source for literals and compiles nothing it cannot see.
 */
const RULE_ORIGIN = [
  "origin-left lg:origin-right",
  "origin-left lg:origin-right",
  "origin-left",
  "origin-left",
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
      className="scene-dark grain relative isolate flex min-h-dvh flex-col justify-center overflow-hidden bg-void pb-24 pt-32 sm:pb-32 sm:pt-36"
    >
      {/*
        Transitions into and out of the dark chapter — the same treatment the
        process section uses, since this is now the second pinned-dark band on
        an otherwise light page and a butt joint reads as a rendering fault.
        Both blend to the ACTUAL adjacent grounds through the surface tokens,
        so they disappear in dark mode where the neighbours are already black.
      */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 z-[3] h-28"
        style={{
          background:
            "linear-gradient(180deg, color-mix(in srgb, var(--surface-ink) 90%, transparent) 0%, color-mix(in srgb, var(--surface-ink) 50%, transparent) 42%, transparent 100%)",
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 z-[3] h-28"
        style={{
          background:
            "linear-gradient(0deg, var(--surface-base) 0%, color-mix(in srgb, var(--surface-base) 55%, transparent) 42%, transparent 100%)",
        }}
      />

      <Spectrum />

      <div className="relative z-[2] mx-auto w-full max-w-6xl px-6">
        <div className="flex flex-wrap items-end justify-between gap-x-12 gap-y-6">
          <Reveal className="max-w-xl">
            <SectionLabel dot tone="brand">
              {services.label}
            </SectionLabel>
            {/*
              h1, not h2. This section became the homepage hero when the lit
              room was removed, and nothing replaced the h1 it took with it —
              the homepage had no top-level heading at all.
            */}
            <h1 className="mt-6 text-balance text-h2 font-normal leading-[1.02] tracking-tight text-bone sm:text-h1">
              {services.heading}{" "}
              <span className="font-serif font-normal italic text-brand-ink">
                {services.headingAccent}
              </span>
            </h1>
          </Reveal>

          <Reveal delay={0.1} className="max-w-sm">
            <p className="text-small leading-relaxed text-ash">{services.body}</p>
          </Reveal>
        </div>

        {/*
          Three columns on desktop: names, orb, names. The orb is a real grid
          item spanning both rows rather than an absolutely-placed backdrop,
          which is what guarantees the type can never land on top of it at any
          width. Below lg the whole thing folds to one column with the orb
          first, because on a phone a sphere behind live text is a legibility
          problem dressed as atmosphere.
        */}
        <RevealGroup className="mt-14 grid items-center gap-y-12 sm:mt-20 lg:grid-cols-[1fr_minmax(0,28rem)_1fr] lg:grid-rows-2 lg:gap-x-14 lg:gap-y-20">
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
              >
                <h3
                  className="ramp-text text-balance text-h3 font-normal leading-[1.05] tracking-tight sm:text-h2 lg:text-h1"
                  style={{ "--ramp": service.ramp } as CSSProperties}
                >
                  {service.short}
                </h3>

                <p className="max-w-[18rem] text-small leading-relaxed text-ash transition-colors duration-300 group-hover:text-bone">
                  {service.caption}
                </p>

                {/*
                  The rule is the hover state, drawn in the division's own
                  ramp rather than in the interface yellow — each vertical
                  lights up as itself. It grows from whichever edge the column
                  rags toward, so it runs into the sphere.
                */}
                <span
                  aria-hidden
                  className={`mt-1 h-px w-0 transition-[width] duration-500 ease-out group-hover:w-16 ${RULE_ORIGIN[index] ?? "origin-left"}`}
                  style={{ backgroundImage: service.ramp }}
                />
              </Link>
            </RevealItem>
          ))}
        </RevealGroup>
      </div>
    </section>
  );
}
