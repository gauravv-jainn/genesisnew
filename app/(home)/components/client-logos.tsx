import Image from "next/image";

import { clients } from "@/lib/home-content";
import { cn } from "@/lib/utils";
import { SectionShell } from "./section-shell";

/**
 * Section 5 — Clients we've worked with.
 *
 * WHITE, SMALL, AND NOTHING BUT THE MARKS. That is Genesis's call, and it
 * settles two earlier passes: a tinted palette, where each chip carried its
 * client's own brand hue, and a labelled swatch board with the name printed
 * under every logo. Both are gone. A logo wall is a logo wall — the marks are
 * the content, and the tint, the caption and the size were all things standing
 * in front of them.
 *
 * WHAT SURVIVED, BECAUSE IT WAS NEVER ABOUT DECORATION. The marks run from
 * 0.89:1 to 12.63:1 — fourteen times the spread — and in a plain square chip
 * `object-contain` fits each to whichever edge it hits first, so a square mark
 * stood 72px tall and Mahindra Finance stood 5.7. That is not a padding value,
 * it is geometry, and no amount of resizing the chip closes it because
 * resizing scales both numbers together.
 *
 * So the chip still adapts to the mark, off the measured `ratio` in
 * lib/home-content:
 *
 *   WIDTH — past 4.5:1 a mark takes a double-width chip. A long horizontal
 *     lockup wants a long horizontal swatch; that is what it was drawn to be.
 *     Five of the twenty-nine qualify.
 *   HEIGHT — the ink stands in three steps rather than one, so a near-square
 *     mark is not held to the same line as a wordmark. With a max-width the
 *     box then fits whichever edge the mark reaches first, and every mark ends
 *     up covering a comparable AREA — which is what the eye reads as "the same
 *     size".
 *
 * SMALLER IS WHAT DROPPING THE CAPTION BOUGHT. Every chip was carrying about
 * 32px of name under an 96px band; without it the same wall fits seven columns
 * instead of six and five rows instead of six — 818px of section down to about
 * 440. The names live on in each image's `alt`, so a screen reader still hears
 * every client; what is gone is the printed caption, which is what made this
 * read as a directory.
 */

/** Past this, a mark gets a double-width chip. See the note above. */
const WIDE_RATIO = 4.5;

/**
 * Past this, a mark is treated as a long wordmark for HEIGHT purposes.
 *
 * Deliberately NOT the same number as WIDE_RATIO. How tall the ink should
 * stand is a question about the mark; whether it earns two columns is a
 * question about the board. Tying them together is what made the height rule
 * move every time the row count was tuned.
 */
const LONG_RATIO = 3.5;

/**
 * How tall a mark's ink stands, as a share of its chip.
 *
 * Three steps, not a formula. A continuous curve reads as noise across
 * twenty-nine chips — a set of marks all at slightly different sizes looks
 * like a mistake, where a set at three deliberate sizes looks like a system.
 */
function inkHeight(ratio: number): string {
  if (ratio < 1.8) return "62%";
  if (ratio < LONG_RATIO) return "48%";
  return "34%";
}

export function ClientLogos() {
  return (
    <SectionShell
      id="clients"
      label={clients.label}
      heading={clients.heading}
      headingAccent={clients.headingAccent}
      body={clients.body}
      tone="brand"
      origin="center"
      intensity={0.14}
    >
      {/*
        No Reveal per chip. Twenty-nine staggered entrances is a long wait for
        a wall whose whole job is to be taken in at once — the board arrives as
        one thing, which is what SectionShell's own reveals already do for the
        header above it.

        Seven columns at the top end, TWO on a phone — it was three, and
        Genesis's report was that the wall did not read at all there.

        Measured: three columns on a 375px viewport gives a 104px chip, and at
        34% ink height a long wordmark stood 22px tall inside it. "GRAND
        HYATT" is set in ~7px letters at that size and House of Hiranandani's
        strapline in under 4. The marks were on the page and none of them were
        legible, which for a wall whose entire content is other people's
        names is the same as not being there.

        Two columns takes the chip to 160px and the ink with it — half again
        as tall — and the chips grow to h-20 to keep the same proportion. It
        costs eight rows of scroll on a phone; the alternative was thirty
        logos nobody could name.
      */}
      <ul className="grid grid-flow-row-dense grid-cols-2 gap-2 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-7">
        {clients.logos.map((logo) => (
          <li
            key={logo.file}
            className={cn(
              /*
                One white ground for every chip, at Genesis's instruction.
                Opaque rather than glass on purpose: a client's logo is their
                asset and belongs on a ground you control, not one that picks
                up whatever gradient is behind it — and it is white in BOTH
                themes, because these files were drawn for white paper and the
                `ink` corrections below were measured against it.
              */
              "relative flex items-center justify-center overflow-hidden rounded-card",
              "border border-black/10 bg-white px-3",
              "h-20 sm:h-[4.5rem] lg:h-20",
              // Lift only. Scaling a client's logo on hover is the sort of
              // flourish that makes a wall of them feel like a toy.
              "transition-[transform,box-shadow] duration-300 ease-out",
              "hover:-translate-y-0.5 hover:shadow-[0_10px_24px_-12px_rgb(0_0_0/0.35)]",
              "motion-reduce:transition-none motion-reduce:hover:translate-y-0",
              logo.ratio >= WIDE_RATIO && "col-span-2",
            )}
          >
            {/*
              The ink box: a height from the rule above, capped at 86% of the
              chip so a mark never runs into the edges, and object-contain
              fitting to whichever it reaches first.
            */}
            <span
              className="relative block w-full"
              style={{ height: inkHeight(logo.ratio), maxWidth: "86%" }}
            >
              <Image
                src={`/clients/${logo.file}.png`}
                alt={logo.name}
                fill
                /*
                  The widest chip is a double at the lg breakpoint — about
                  310px across a 1104px container. Without this every one of
                  the twenty-nine would pull a viewport-sized file.
                */
                sizes="(min-width: 1024px) 310px, (min-width: 640px) 33vw, 92vw"
                className="object-contain"
                style={
                  /*
                    Seven marks cannot live on paper as supplied. Two are
                    monochrome white and simply invert, which for a mark with
                    no colour in it is lossless. Five carry colour and are
                    dimmed instead, which holds the hue — inverting those would
                    turn The Lalit's red square cyan. Measured, not eyeballed;
                    see lib/home-content.
                  */
                  logo.ink === "invert"
                    ? { filter: "invert(1)" }
                    : logo.ink === "darken"
                      ? { filter: "brightness(0.58) saturate(1.2)" }
                      : undefined
                }
              />
            </span>
          </li>
        ))}
      </ul>
    </SectionShell>
  );
}
